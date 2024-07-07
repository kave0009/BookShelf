import React from "react"; 
import { Container, Typography, Grid, Button } from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import "./css/styles.css";

const Receipt = () => {
  const { state } = useLocation();
  const { orderId, totalAmount, cartItems, user, address } = state;
  const taxRate = 0.13; // 13% tax rate for Canada
  const taxAmount = (totalAmount * taxRate).toFixed(2);
  const totalWithTax = (
    parseFloat(totalAmount) + parseFloat(taxAmount)
  ).toFixed(2);

  return (
    <Container>
      <Typography variant="h4" gutterBottom className="section-title">
        Thank you for your purchase, {user.first_name}!
      </Typography>

      <Grid container spacing={4}>
        {cartItems.map((item, index) => (
          <Grid item key={`${item.id}-${index}`} xs={12} sm={6} md={4} lg={3}>
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
                  {item.cover_id ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${item.cover_id}-L.jpg`}
                      alt={item.title}
                      className="product-item"
                      style={{ width: "100%", height: "auto" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "auto",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="subtitle1">No Image</Typography>
                    </div>
                  )}
                </figure>
                <figcaption style={{ textAlign: "center" }}>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "10px" }}>
                    {item.title}
                  </h3>
                  <span style={{ display: "block", marginBottom: "10px" }}>
                    {item.authors
                      ? item.authors.map((author) => author.name).join(", ")
                      : "Unknown Author"}
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
                </figcaption>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6">Order ID: {orderId}</Typography>
      <Typography variant="h6">Total Amount: ${totalAmount}</Typography>
      <Typography variant="h6">Tax: ${taxAmount}</Typography>
      <Typography variant="h6">
        Total Amount (including tax): ${totalWithTax}
      </Typography>
      <Typography variant="h6">Billing and Shipping Address:</Typography>
      <Typography variant="body1">
        {address.street}, {address.city}, {address.state}, {address.zip}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        className="btn btn-accent"
        style={{ marginTop: "20px" }}
      >
        Continue Shopping
      </Button>
    </Container>
  );
};

export default Receipt;
