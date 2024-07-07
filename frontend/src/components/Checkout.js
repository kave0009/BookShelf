import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkout } from "../api";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import "./css/styles.css";

const validProvinces = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
];

const validatePostalCode = (postalCode) => {
  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  return postalCodeRegex.test(postalCode);
};

const Checkout = ({
  cartItems,
  userId,
  user,
  totalAmount,
  clearCart,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User prop in Checkout:", user);
    if (user) {
      setError(null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setFormErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!address.street) errors.street = "Street address is required";
    if (!address.city) errors.city = "City is required";
    if (!address.state) errors.state = "State is required";
    else if (!validProvinces.includes(address.state))
      errors.state = "Invalid province";
    if (!address.zip) errors.zip = "Postal code is required";
    else if (!validatePostalCode(address.zip))
      errors.zip = "Invalid postal code format";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async () => {
    if (!user) {
      setError({
        error: "Authentication required",
        message: "You need to sign in before you can checkout.",
      });
      return;
    }

    if (!validateForm()) {
      setError({
        error: "Form Validation Error",
        message: "Please fill out all required fields correctly.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    const orderData = {
      userId,
      cartItems: cartItems.map((item) => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        cover_id: item.cover_id,
      })),
      totalAmount: parseFloat(totalAmount),
      address,
    };

    try {
      const response = await checkout(orderData);
      clearCart();
      onClose();
      navigate("/receipt", {
        state: {
          orderId: response.orderId,
          totalAmount: response.totalAmount,
          cartItems: orderData.cartItems,
          user,
          address,
        },
      });
    } catch (err) {
      setError(
        err.response
          ? err.response.data
          : { error: "Order submission failed", message: err.message }
      );
      console.error("Error placing order:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Paper style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" gutterBottom className="section-title">
          Please Enter Your Address:
        </Typography>
        {error && (
          <Alert severity="error" style={{ marginBottom: "20px" }}>
            <Typography variant="h6">{error.error}</Typography>
            <Typography>{error.message}</Typography>
          </Alert>
        )}
        <form noValidate autoComplete="off">
          <TextField
            fullWidth
            label="Street Address"
            name="street"
            value={address.street}
            onChange={handleChange}
            margin="normal"
            error={!!formErrors.street}
            helperText={formErrors.street}
            className="form-control"
          />
          <TextField
            fullWidth
            label="City"
            name="city"
            value={address.city}
            onChange={handleChange}
            margin="normal"
            error={!!formErrors.city}
            helperText={formErrors.city}
            className="form-control"
          />
          <TextField
            fullWidth
            label="Province"
            name="state"
            value={address.state}
            onChange={handleChange}
            margin="normal"
            error={!!formErrors.state}
            helperText={formErrors.state}
            className="form-control"
          />
          <TextField
            fullWidth
            label="Postal Code"
            name="zip"
            value={address.zip}
            onChange={handleChange}
            margin="normal"
            error={!!formErrors.zip}
            helperText={formErrors.zip}
            className="form-control"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            disabled={loading}
            fullWidth
            className="btn btn-accent"
            style={{ marginTop: "20px" }}
          >
            {loading ? <CircularProgress size={24} /> : "Place Order"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Checkout;
