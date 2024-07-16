import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography, CircularProgress } from "@mui/material";
import CustomTooltip from "./CustomTooltip";
import {
  genres,
  fetchBooksFromAPI,
  fetchBooksFromDB,
  mergeBookData,
} from "./utility";
import "./css/styles.css";

const ProductListing = ({
  handleAddToCart,
  handleImageClick,
  showFeatured,
}) => {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(genre || "history");

  const fetchAndMergeBooks = useCallback(async (genre) => {
    const dbBooks = await fetchBooksFromDB();
    console.log("DB Books:", dbBooks);

    const apiBooks = await fetchBooksFromAPI(genre);
    console.log("API Books:", apiBooks);

    const mergedBooks = await mergeBookData(dbBooks, apiBooks);
    console.log("Merged Books:", mergedBooks);

    return mergedBooks;
  }, []);

  const fetchBooks = useCallback(
    async (genre) => {
      setLoading(true);
      setError(null);
      try {
        let mergedBooks =
          JSON.parse(localStorage.getItem(`mergedBooks_${genre}`)) || [];
        if (mergedBooks.length === 0) {
          mergedBooks = await fetchAndMergeBooks(genre);
          localStorage.setItem(
            `mergedBooks_${genre}`,
            JSON.stringify(mergedBooks)
          );
        }
        setBooks(mergedBooks);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchAndMergeBooks]
  );

  useEffect(() => {
    fetchBooks(selectedGenre);
  }, [fetchBooks, selectedGenre]);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    fetchBooks(genre);
  };

  return (
    <Container>
      {!showFeatured && (
        <ul className="tabs">
          {genres.map((genre) => (
            <li key={genre.title} className="tab">
              <button
                onClick={() => handleGenreClick(genre.link)}
                className={selectedGenre === genre.link ? "active" : ""}
              >
                {genre.title}
              </button>
            </li>
          ))}
        </ul>
      )}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography variant="body1">{error}</Typography>
      ) : (
        <Grid container spacing={4}>
          {books.map((book) => (
            <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
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
  );
};

export default ProductListing;
