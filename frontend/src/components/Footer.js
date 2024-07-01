import React from "react";
import { Box, Grid, Typography, Link } from "@mui/material";
import Logo from "./images/LOGO.svg";

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "var(--light-color)", p: 4, mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Box className="footer-item">
            <img src={Logo} className="footer-logo" />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box className="footer-menu">
            <Typography variant="h6" color="textPrimary">
              Sign Up
            </Typography>
            <ul className="menu-list">
              <li className="menu-item">
                <Link href="/signup" color="textSecondary">
                  Sign Up
                </Link>
              </li>
            </ul>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box className="footer-menu">
            <Typography variant="h6" color="textPrimary">
              Log In
            </Typography>
            <ul className="menu-list">
              <li className="menu-item">
                <Link href="/login" color="textSecondary">
                  Log In
                </Link>
              </li>
            </ul>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box className="footer-menu">
            <Typography variant="h6" color="textPrimary">
              Sections
            </Typography>
            <ul className="menu-list">
              <li className="menu-item">
                <Link href="#featured-books" color="textSecondary">
                  Featured Books
                </Link>
              </li>
              <li className="menu-item">
                <Link href="#popular-books" color="textSecondary">
                  Popular Genres
                </Link>
              </li>
            </ul>
          </Box>
        </Grid>
      </Grid>
      <Typography
        variant="body2"
        align="center"
        color="textSecondary"
        sx={{ mt: 4 }}
      >
        &copy; {new Date().getFullYear()} Developed by Artin Kaveh. All rights
        reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
