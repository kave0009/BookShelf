import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Dialog } from "@mui/material";
import Home from "./Home";
import ProductListing from "./ProductListing";
import ShoppingCart from "./ShoppingCart";
import SignUp from "./SignUp";
import Login from "./Login";
import Checkout from "./Checkout";
import Receipt from "./Receipt";
import Header from "./Header";
import BookDialog from "./BookDialog";
import { ProductProvider } from "./ProductContext";
import NavigateToSection from "./NavigateToSection";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [distinctItemsCount, setDistinctItemsCount] = useState(0);
  const [user, setUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    setDistinctItemsCount(cartItems.length);
  }, [cartItems]);

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.title === item.title
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.title === item.title
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [
          ...prevItems,
          { ...item, quantity: 1, bookId: item.bookId || item.id },
        ];
      }
    });
  };

  const updateCartItem = (id, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: quantity > 0 ? quantity : 1 }
          : item
      )
    );
  };

  const removeCartItem = (id) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id);
      if (itemToRemove) {
        setDistinctItemsCount((prevCount) => prevCount - 1);
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setDistinctItemsCount(0);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const totalAmount = cartItems
    .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

  const handleImageClick = (book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const handleOpenLoginDialog = () => {
    setLoginDialogOpen(true);
  };

  const handleCloseLoginDialog = () => {
    setLoginDialogOpen(false);
  };

  useEffect(() => {
    console.log("Cart items updated:", cartItems);
  }, [cartItems]);

  return (
    <ProductProvider>
      <Router>
        <Header
          cartItemCount={distinctItemsCount}
          user={user}
          setUser={setUser}
          onLogout={handleLogout}
        />
        <Container className="content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  handleAddToCart={handleAddToCart}
                  handleImageClick={handleImageClick}
                />
              }
            />
            <Route
              path="/genre/:genre"
              element={
                <ProductListing
                  handleAddToCart={handleAddToCart}
                  showFeatured={false}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <ShoppingCart
                  cartItems={cartItems}
                  updateCartItem={updateCartItem}
                  removeCartItem={removeCartItem}
                  handleImageClick={handleImageClick}
                  handleAddToCart={handleAddToCart}
                  user={user}
                  userId={user ? user.id : null}
                  clearCart={clearCart}
                />
              }
            />
            <Route path="/signup" element={<SignUp setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route
              path="/checkout"
              element={
                <Checkout
                  cartItems={cartItems}
                  userId={user ? user.id : null}
                  user={user}
                  totalAmount={totalAmount}
                  clearCart={clearCart}
                />
              }
            />
            <Route path="/receipt" element={<Receipt />} />
          </Routes>
        </Container>
        <NavigateToSection onOpenLoginDialog={handleOpenLoginDialog} />
        <BookDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          book={selectedBook}
          handleAddToCart={handleAddToCart}
        />
        <Dialog open={loginDialogOpen} onClose={handleCloseLoginDialog}>
          <Login setUser={setUser} />
        </Dialog>
      </Router>
    </ProductProvider>
  );
};

export default App;
