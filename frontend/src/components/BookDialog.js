import React, { useState } from "react";
import {
  Dialog,
  Paper,
  Grid,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "./css/styles.css";

const generateStaticSummary = () => {
  return "This is an enthralling book that captures the essence of adventure and keeps you hooked till the last page. A masterpiece that explores deep human emotions and relationships, a fascinating tale of courage, resilience, and triumph.";
};

const generateRandomReviews = () => {
  const reviews = [];
  const reviewCount = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < reviewCount; i++) {
    const rating = Math.floor(Math.random() * 2) + 4;
    reviews.push({ rating, count: Math.floor(Math.random() * 100) + 1 });
  }
  return reviews;
};

const generateUserComments = () => {
  const users = ["Alice", "Bob", "Charlie", "David", "Eve"];
  const comments = [
    "Amazing book!",
    "Really enjoyed it.",
    "Would recommend to others.",
    "A bit lengthy but worth the read.",
    "Not my favorite, but still good.",
  ];
  return Array.from({ length: 3 }, () => ({
    user: users[Math.floor(Math.random() * users.length)],
    comment: comments[Math.floor(Math.random() * comments.length)],
    rating: Math.floor(Math.random() * 2) + 4,
  }));
};

const calculateAverageRating = (reviews) => {
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1);
};

const BookDialog = ({ open, onClose, book, handleAddToCart }) => {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!book) return null;

  const summary = generateStaticSummary();
  const reviews = generateRandomReviews();
  const userComments = generateUserComments();
  const averageRating = calculateAverageRating(reviews);

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="div" gutterBottom>
              {book.title}
            </Typography>
            {book.authors && (
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {Array.isArray(book.authors)
                  ? book.authors.map((author) => author.name).join(", ")
                  : book.authors}
              </Typography>
            )}
            <Typography variant="body1" paragraph>
              {summary}
            </Typography>
            <Typography variant="h5" className="book-details" gutterBottom>
              Price: ${book.price}
            </Typography>
            <Typography variant="h5" className="book-details" gutterBottom>
              Quantity Available: {book.quantity}
            </Typography>
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Average Rating:
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                {Array.from({ length: Math.floor(averageRating) }, (_, i) => (
                  <StarIcon key={i} style={{ color: "gold" }} />
                ))}
                {Array.from(
                  { length: 5 - Math.floor(averageRating) },
                  (_, i) => (
                    <StarIcon key={i} style={{ color: "#ccc" }} />
                  )
                )}
                <Typography variant="body2" color="text.secondary" ml={1}>
                  {averageRating} based on {reviews.length} reviews
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowComments(!showComments)}
                  sx={{ marginRight: 2 }}
                >
                  {showComments ? "Hide Comments" : "Show Comments"}
                </Button>
                <IconButton onClick={handleLike}>
                  {liked ? (
                    <FavoriteIcon style={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Box>
              {showComments && (
                <Box mt={2}>
                  {userComments.map((comment, index) => (
                    <Box key={index} mb={2}>
                      <Typography variant="body2" color="text.primary">
                        <strong>{comment.user}:</strong> {comment.comment}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        {Array.from({ length: comment.rating }, (_, i) => (
                          <StarIcon key={i} style={{ color: "gold" }} />
                        ))}
                        {Array.from({ length: 5 - comment.rating }, (_, i) => (
                          <StarIcon key={i} style={{ color: "#ccc" }} />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleAddToCart(book);
                  onClose();
                }}
                className="btn btn-accent"
                sx={{ mt: 2, alignSelf: "flex-end" }}
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} className="image-container">
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
              alt={book.title}
              className="book-image"
            />
          </Grid>
        </Grid>
      </Paper>
      <IconButton
        edge="end"
        color="inherit"
        onClick={onClose}
        aria-label="close"
        style={{ position: "absolute", top: "10px", right: "10px" }}
      >
        <CloseIcon />
      </IconButton>
    </Dialog>
  );
};

export default BookDialog;
