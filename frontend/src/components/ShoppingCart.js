import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Checkout from "./Checkout";
import BookDialog from "./BookDialog";
import {
  fetchBooksFromAPI,
  fetchBooksFromDB,
  mergeBookData,
  genres,
} from "./utility";
import "./css/styles.css";

const ShoppingCart = ({
  cartItems = [],
  updateCartItem,
  removeCartItem,
  handleAddToCart,
  clearCart,
  user,
  userId,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchAndMergeBooks = useCallback(async () => {
    const dbBooks = await fetchBooksFromDB();

    const allBooksPromises = genres.map((genre) =>
      fetchBooksFromAPI(genre.link)
    );
    const allBooks = await Promise.all(allBooksPromises);
    const flattenedBooks = allBooks.flat();

    const mergedBooks = await mergeBookData(dbBooks, flattenedBooks);

    return mergedBooks;
  }, []);

  const fetchSuggestions = useCallback(
    async (newCartItem) => {
      setLoading(true);
      setError(null);

      try {
        let mergedBooks = JSON.parse(localStorage.getItem("mergedBooks")) || [];
        if (mergedBooks.length === 0) {
          mergedBooks = await fetchAndMergeBooks();
          localStorage.setItem("mergedBooks", JSON.stringify(mergedBooks));
        }

        let filteredBooks = mergedBooks.filter((book) => book.cover_id);

        if (cartItems.length > 0) {
          filteredBooks = filteredBooks.filter(
            (book) => !cartItems.some((cartItem) => cartItem.id === book.id)
          );
        }

        let newSuggestions = [];

        if (newCartItem) {
          newSuggestions = suggestions.filter(
            (suggestion) => suggestion.id !== newCartItem.id
          );
          const newBook = filteredBooks.sort(() => 0.5 - Math.random())[0];
          if (newBook) {
            newSuggestions.push(newBook);
          }
        } else {
          newSuggestions = filteredBooks
            .sort(() => 0.5 - Math.random())
            .slice(0, 6);
        }

        localStorage.setItem("suggestions", JSON.stringify(newSuggestions));
        setSuggestions(newSuggestions);
      } catch (error) {
        setError("Error fetching suggestions");
      } finally {
        setLoading(false);
      }
    },
    [cartItems, fetchAndMergeBooks, suggestions]
  );

  useEffect(() => {
    const storedSuggestions =
      JSON.parse(localStorage.getItem("suggestions")) || [];
    if (storedSuggestions.length > 0) {
      setSuggestions(storedSuggestions);
    } else {
      fetchSuggestions();
    }
  }, [cartItems, fetchSuggestions]);

  const handleAddToCartAndUpdateSuggestions = (item) => {
    if (typeof handleAddToCart !== "function") {
      return;
    }
    handleAddToCart(item);
    fetchSuggestions(item);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setBookDialogOpen(true);
  };

  const handleCloseBookDialog = () => {
    setBookDialogOpen(false);
    setSelectedBook(null);
  };

  const totalPrice = cartItems
    .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

  const handleCheckout = () => {
    setCheckoutDialogOpen(true);
  };

  const handleCloseCheckoutDialog = () => {
    setCheckoutDialogOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="div" gutterBottom>
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {cartItems.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="product-item"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <figure
                      className="product-style"
                      style={{ marginBottom: "15px" }}
                    >
                      <img
                        src={`https://covers.openlibrary.org/b/id/${item.cover_id}-L.jpg`}
                        alt={item.title}
                        className="product-item"
                        style={{ width: "100%", height: "auto" }}
                      />

                      <button
                        type="button"
                        className="add-to-cart"
                        data-product-tile="add-to-cart"
                        onClick={() =>
                          handleAddToCartAndUpdateSuggestions(item)
                        }
                      >
                        Add to Cart
                      </button>
                    </figure>
                    <figcaption style={{ textAlign: "center" }}>
                      <h3 style={{ fontSize: "1.25rem", marginBottom: "10px" }}>
                        {item.title}
                      </h3>
                      <span style={{ display: "block", marginBottom: "10px" }}>
                        {item.authors.map((author) => author.name).join(", ")}
                      </span>
                      <div
                        className="item-price"
                        style={{ fontSize: "1.25rem", color: "#333" }}
                      >
                        ${item.price}
                      </div>
                      <Typography variant="body2" color="textSecondary">
                        Quantity: {item.quantity}
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          onClick={() =>
                            updateCartItem(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                        >
                          -
                        </Button>
                        <Typography
                          variant="body2"
                          style={{ width: 30, textAlign: "center" }}
                        >
                          {item.quantity}
                        </Typography>
                        <Button
                          onClick={() =>
                            updateCartItem(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button onClick={() => removeCartItem(item.id)}>
                          x
                        </Button>
                      </div>
                    </figcaption>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="h5"
            component="div"
            gutterBottom
            style={{ marginTop: 20 }}
          >
            Total: ${totalPrice}
          </Typography>
          <Button onClick={handleCheckout} className="btn btn-accent">
            Checkout
          </Button>
        </>
      )}

      {suggestions.length > 0 && (
        <>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            style={{ marginTop: 40 }}
          >
            You might also like:
          </Typography>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          ) : error ? (
            <div>Error fetching suggestions: {error}</div>
          ) : (
            <Grid container spacing={4}>
              {suggestions.map((suggestion) => (
                <Grid item key={suggestion.id} xs={12} sm={6} md={4}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="product-item"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      onClick={() => handleBookClick(suggestion)}
                    >
                      <figure
                        className="product-style"
                        style={{ marginBottom: "15px" }}
                      >
                        <img
                          src={`https://covers.openlibrary.org/b/id/${suggestion.cover_id}-L.jpg`}
                          alt={suggestion.title}
                          className="product-item"
                          style={{ width: "100%", height: "auto" }}
                        />

                        <button
                          type="button"
                          className="add-to-cart"
                          data-product-tile="add-to-cart"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCartAndUpdateSuggestions(suggestion);
                          }}
                        >
                          Add to Cart
                        </button>
                      </figure>
                      <figcaption style={{ textAlign: "center" }}>
                        <h3
                          style={{ fontSize: "1.25rem", marginBottom: "10px" }}
                        >
                          {suggestion.title}
                        </h3>
                        <span
                          style={{ display: "block", marginBottom: "10px" }}
                        >
                          {suggestion.authors
                            .map((author) => author.name)
                            .join(", ")}
                        </span>
                        <div
                          className="item-price"
                          style={{ fontSize: "1.25rem", color: "#333" }}
                        >
                          ${suggestion.price}
                        </div>
                        <Typography variant="body2" color="textSecondary">
                          Quantity: {suggestion.quantity}
                        </Typography>
                      </figcaption>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      <Dialog
        open={checkoutDialogOpen}
        onClose={handleCloseCheckoutDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Checkout
            cartItems={cartItems}
            userId={userId}
            user={user}
            totalAmount={totalPrice}
            clearCart={clearCart}
            onClose={handleCloseCheckoutDialog}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckoutDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <BookDialog
        open={bookDialogOpen}
        onClose={handleCloseBookDialog}
        book={selectedBook}
        handleAddToCart={handleAddToCartAndUpdateSuggestions}
      />
    </Container>
  );
};

export default ShoppingCart;
