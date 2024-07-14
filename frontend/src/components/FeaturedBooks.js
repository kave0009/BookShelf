import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, CircularProgress } from "@mui/material";
import CustomTooltip from "./CustomTooltip";
import {
  fetchBooksFromAPI,
  fetchBooksFromDB,
  mergeBookData,
  genres,
} from "./utility";
import Featured from "./images/Featured.svg";
import "./css/styles.css";

const FeaturedBooks = ({ handleAddToCart, handleImageClick }) => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeaturedBooks = async () => {
    setLoading(true);
    try {
      const dbBooks = await fetchBooksFromDB();
      const allBooksPromises = genres.map((genre) =>
        fetchBooksFromAPI(genre.link)
      );
      const allBooks = await Promise.all(allBooksPromises);
      const flattenedBooks = allBooks.flat();
      const mergedBooks = await mergeBookData(dbBooks, flattenedBooks);
      setFeaturedBooks(mergedBooks.slice(0, 4)); // Get the last 4 books
    } catch (error) {
      setError("Error fetching featured books");
      console.error(
        "Error fetching featured books:",
        error.message,
        error.stack
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  return (
    <section id="featured-books" className="py-5 my-5">
      <Container>
        <div className="section-header align-center">
          <div className="title">
            <span>Quality Items</span>
          </div>
          <h2 className="section-title">
            <img src={Featured} alt="Featured Books" className="section-icon" />
          </h2>
        </div>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography variant="body1">{error}</Typography>
        ) : (
          <Grid container spacing={4}>
            {featuredBooks.map((book) => (
              <Grid item key={book.id} xs={12} sm={6} lg={3}>
                <div
                  className="product-item"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <CustomTooltip title="Click for more details">
                    <figure
                      className="product-style"
                      style={{ marginBottom: "15px" }}
                    >
                      {book.cover_id ? (
                        <img
                          src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
                          alt={book.title}
                          className="product-item"
                          style={{
                            width: "100%",
                            height: "auto",
                            cursor: "pointer",
                          }}
                          onError={(e) => (e.target.style.display = "none")}
                          onClick={() => handleImageClick(book)}
                        />
                      ) : null}
                      <button
                        type="button"
                        className="add-to-cart"
                        data-product-tile="add-to-cart"
                        onClick={() => handleAddToCart(book)}
                      >
                        Add to Cart
                      </button>
                    </figure>
                  </CustomTooltip>
                  <figcaption style={{ textAlign: "center" }}>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "10px" }}>
                      {book.title}
                    </h3>
                    <span style={{ display: "block", marginBottom: "10px" }}>
                      {book.authors.map((author) => author.name).join(", ")}
                    </span>
                    <div
                      className="item-price"
                      style={{ fontSize: "1.25rem", color: "#333" }}
                    >
                      ${book.price}
                    </div>
                    <Typography variant="body2" color="textSecondary">
                      Quantity: {book.quantity}
                    </Typography>
                  </figcaption>
                </div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </section>
  );
};

export default FeaturedBooks;
