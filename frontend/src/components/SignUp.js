import React, { useState } from "react";
import { registerUser, loginUser } from "../api";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import "./SignUp.css";
import Billboard from "./images/Baloon.svg";

const SignUp = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    phone_number: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      setSuccess(response.message);
      setError(null);
      console.log("User registered:", response);
      const loginResponse = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      setUser(loginResponse.user);
      localStorage.setItem("token", loginResponse.token);
      setError(null);
      console.log("User logged in:", loginResponse);
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
            "Registration failed. Please try again later."
        );
      } else {
        setError("Network error. Please check your internet connection.");
      }
      setSuccess(null);
    }
  };

  return (
    <main>
      <Container maxWidth="lg">
        <Box mt={5} mb={5}>
          <Typography
            variant="h4"
            align="start"
            gutterBottom
            className="section-title"
          >
            Sign Up and Explore
          </Typography>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              style={{ marginBottom: "20px" }}
            >
              {typeof error === "string" ? error : "An unknown error occurred"}
            </Alert>
          )}
          {success && (
            <Alert
              severity="success"
              onClose={() => setSuccess(null)}
              style={{ marginBottom: "20px" }}
            >
              {success}
            </Alert>
          )}
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <form onSubmit={handleRegister}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      variant="outlined"
                      className="form-control"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      variant="outlined"
                      className="form-control"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      variant="outlined"
                      className="form-control"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      variant="outlined"
                      className="form-control"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                      className="form-control"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      variant="outlined"
                      className="form-control"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      variant="outlined"
                      className="form-control"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      variant="outlined"
                      className="form-control"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      variant="outlined"
                      className="form-control"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      variant="outlined"
                      className="form-control"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      className="btn btn-accent"
                    >
                      Register
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="billboard">
                <img src={Billboard} />
              </div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </main>
  );
};

export default SignUp;
