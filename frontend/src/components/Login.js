import React, { useState } from "react";
import { loginUser } from "../api";
import { Container, TextField, Button, Typography, Alert } from "@mui/material";
import "./css/styles.css";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      setError("Please fill out both fields.");
      return;
    }

    try {
      const response = await loginUser({ username, password });
      console.log("Login response:", response);
      localStorage.setItem("token", response.token);
      console.log("User logged in:", response.user);
      setUser(response.user);
    } catch (error) {
      console.error("Login failed", error);
      if (error.response) {
        if (error.response.status === 401) {
          setError("Invalid username or password.");
        } else if (error.response.status === 400) {
          setError("Please provide a valid username and password.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        className="section-title"
        style={{ marginTop: "20px" }}
      >
        Login
      </Typography>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          style={{ marginBottom: "20px" }}
        >
          {error}
        </Alert>
      )}
      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          margin="normal"
          className="form-control"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          margin="normal"
          className="form-control"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="btn btn-accent"
        >
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
