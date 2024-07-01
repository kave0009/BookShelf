import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Grid,
  IconButton,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Checkout from "./Checkout";
import "./styles.css";

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

  const fetchSuggestions = useCallback(async () => {
    const genres = ["fiction", "non-fiction", "science-fiction", "fantasy"];
    setLoading(true);
    setError(null);
    try {
      const promises = genres.map((genre) =>
        axios.get(
          `https://openlibrary.org/subjects/${encodeURIComponent(genre)}.json`
        )
      );
      const results = await Promise.all(promises);

      const books = results
        .flatMap((result) => result.data.works)
        .map((book) => ({
          id: book.cover_edition_key || book.key,
          title: book.title,
          authors: book.authors || [],
          cover_id: book.cover_id,
          price: (Math.random() * 40 + 10).toFixed(2),
          quantity: 100,
        }));

      const filteredBooks = books.filter(
        (book) =>
          !cartItems.some((cartItem) => cartItem.title === book.title) &&
          !suggestions.some((suggestion) => suggestion.title === book.title)
      );

      const newSuggestions = filteredBooks.slice(0, 6);
      setSuggestions(newSuggestions);
    } catch (error) {
      let errorMessage = "An error occurred while fetching suggestions.";
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Error: ${error.response.status} - ${error.response.data.message}`;
        } else if (error.request) {
          errorMessage = "Error: No response received from the server.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      setError(errorMessage);
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  }, [cartItems]);

  useEffect(() => {
    fetchSuggestions();
  }, [cartItems, fetchSuggestions]);

  const handleAddToCartAndUpdateSuggestions = (item) => {
    if (typeof handleAddToCart !== "function") {
      console.error("handleAddToCart is not a function");
      return;
    }
    handleAddToCart(item);
    setTimeout(() => {
      fetchSuggestions();
    }, 0);
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
                        <IconButton
                          onClick={() =>
                            updateCartItem(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography
                          variant="body2"
                          style={{ width: 30, textAlign: "center" }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            updateCartItem(item.id, item.quantity + 1)
                          }
                        >
                          <AddIcon />
                        </IconButton>
                        <IconButton onClick={() => removeCartItem(item.id)}>
                          <DeleteIcon />
                        </IconButton>
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
            <CircularProgress />
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
                          onClick={() =>
                            handleAddToCartAndUpdateSuggestions(suggestion)
                          }
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
    </Container>
  );
};

export default ShoppingCart;
