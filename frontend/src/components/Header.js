import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Dialog,
  Button,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Login from "./Login";
import "./css/styles.css";
import BookshelfLogo from "./images/BOOKSHELF.svg";

const Header = ({ cartItemCount, user, setUser, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginDialogOpen = () => {
    setLoginDialogOpen(true);
  };

  const handleLoginDialogClose = () => {
    setLoginDialogOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setLoginDialogOpen(false);
    handleClose();
    onLogout();
  };

  const handleScrollToSection = (id) => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // Add a slight delay to ensure the page has navigated
  };

  useEffect(() => {
    console.log(`loginDialogOpen state changed: ${loginDialogOpen}`);
  }, [loginDialogOpen]);

  useEffect(() => {
    console.log(`user state changed: ${user}`);
    if (user) {
      setShowWelcomeMessage(true);
      setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 3000);
    }
  }, [user]);

  return (
    <AppBar
      position="sticky"
      style={{
        backgroundColor: "var(--light-color)",
        borderBottom: "1px solid var(--dark-color)",
        zIndex: 1100,
        transition: "all 0.5s ease",
      }}
    >
      <Toolbar
        style={{
          minHeight: "var(--header-height-min)",
          transition: "all 0.5s ease",
        }}
      >
        <IconButton
          id="homeButton"
          edge="start"
          color="inherit"
          component={Link}
          to="/"
          style={{ color: "var(--dark-color)" }}
        >
          <HomeIcon />
        </IconButton>
        <Button
          id="genresButton"
          className="hide-on-small-screen"
          color="inherit"
          onClick={() => handleScrollToSection("popular-books")}
          style={{ color: "var(--dark-color)" }}
        >
          Genres
        </Button>
        <Button
          id="featuredButton"
          className="hide-on-small-screen"
          color="inherit"
          onClick={() => handleScrollToSection("featured-books")}
          style={{ color: "var(--dark-color)" }}
        >
          Featured
        </Button>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <img
            src={BookshelfLogo}
            alt="Bookshelf"
            style={{ height: "80px", width: "auto", padding: "0.6rem" }}
          />
        </Box>
        {user ? (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                className={`welcome-message ${
                  showWelcomeMessage ? "visible" : "hidden"
                }`}
                style={{
                  marginRight: "8px",
                  color: "var(--dark-color)",
                }}
              >
                Welcome,
              </Typography>
              <Typography
                variant="h6"
                style={{
                  marginRight: "16px",
                  color: "var(--dark-color)",
                  transition: "opacity 0.5s ease",
                }}
              >
                {user.username}
              </Typography>
            </div>
            <IconButton
              id="accountButton"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              style={{ color: "var(--dark-color)", marginRight: "16px" }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem id="logoutButton" onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <IconButton
              id="loginButton"
              color="inherit"
              onClick={handleLoginDialogOpen}
              style={{ color: "var(--dark-color)", marginRight: "16px" }}
            >
              <LoginIcon />
            </IconButton>
            <Dialog open={loginDialogOpen} onClose={handleLoginDialogClose}>
              <Login setUser={setUser} onClose={handleLoginDialogClose} />
            </Dialog>
            <Button
              id="signupButton"
              color="primary"
              variant="outlined"
              component={Link}
              to="/signup"
              className="custom-create-account-button"
              style={{ marginRight: "16px" }}
            >
              Create Account
            </Button>
          </>
        )}
        <IconButton
          id="cartButton"
          color="inherit"
          component={Link}
          to="/cart"
          style={{ color: "var(--dark-color)" }}
        >
          <Badge badgeContent={cartItemCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
