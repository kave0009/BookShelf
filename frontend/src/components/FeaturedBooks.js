import React, { useEffect, useState, useCallback } from "react";
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

const primaryBooks = [
  { title: "Le Petit Prince", author: "Antoine de Saint-Exupéry" },
  { title: "The Hitch Hiker's Guide To The Galaxy", author: "Douglas Adams" },
  { title: "City", author: "Clifford D. Simak" },
  { title: "Perfume", author: "Patrick Süskind" },
];

const alternativeBooks = [
  { title: "Anne's House Of Dreams", author: "Lucy Maud Montgomery" },
];

const FeaturedBooks = ({ handleAddToCart, handleImageClick }) => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAndMergeBooks = useCallback(async () => {
    try {
      const dbBooks = await fetchBooksFromDB();
      console.log("DB Books:", dbBooks);

      const allBooksPromises = genres.map((genre) =>
        fetchBooksFromAPI(genre.link)
      );
      const allBooks = await Promise.all(allBooksPromises);
      const flattenedBooks = allBooks.flat();
      console.log("API Books:", flattenedBooks);

      const mergedBooks = await mergeBookData(dbBooks, flattenedBooks);
      console.log("Merged Books:", mergedBooks);

      return mergedBooks;
    } catch (error) {
      console.error("Error fetching and merging books:", error);
      throw error;
    }
  }, []);

  const fetchFeaturedBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const mergedBooks = await fetchAndMergeBooks();

      const findBook = (specificBook) => {
        return mergedBooks.find(
          (book) =>
            book.title.toLowerCase() === specificBook.title.toLowerCase() &&
            book.authors.some(
              (author) =>
                author.name.toLowerCase() === specificBook.author.toLowerCase()
            )
        );
      };

      let specificFeaturedBooks = primaryBooks
        .map(findBook)
        .filter((book) => book !== undefined);

      for (
        let i = 0;
        specificFeaturedBooks.length < 4 && i < alternativeBooks.length;
        i++
      ) {
        const alternativeBook = findBook(alternativeBooks[i]);
        if (
          alternativeBook &&
          !specificFeaturedBooks.includes(alternativeBook)
        ) {
          specificFeaturedBooks.push(alternativeBook);
        }
      }

      setFeaturedBooks(specificFeaturedBooks);
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
  }, [fetchAndMergeBooks]);

  useEffect(() => {
    fetchFeaturedBooks();
  }, [fetchFeaturedBooks]);

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
    </section>
  );
};

export default FeaturedBooks;
