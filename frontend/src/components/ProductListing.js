import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography } from "@mui/material";
import "./styles.css";

const ProductListing = ({ handleAddToCart }) => {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          `https://openlibrary.org/subjects/${encodeURIComponent(genre)}.json`
        );
        const fetchedBooks = response.data.works.map((book) => ({
          ...book,
          price: (Math.random() * 40 + 10).toFixed(2),
          quantity: 100,
          id: book.cover_edition_key || book.key,
        }));
        console.log("Fetched Books:", fetchedBooks);
        setBooks(fetchedBooks);
        setLoading(false);
      } catch (error) {
        setError("Error fetching books");
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genre]);

  return (
    <Container>
      <Typography variant="h4" component="div" gutterBottom>
        {genre} Books
      </Typography>
      {loading ? (
        <Typography variant="body1">Loading...</Typography>
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
                <figure
                  className="product-style"
                  style={{ marginBottom: "15px" }}
                >
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
                    alt={book.title}
                    className="product-item"
                    style={{ width: "100%", height: "auto" }}
                  />
                  <button
                    type="button"
                    className="add-to-cart"
                    data-product-tile="add-to-cart"
                    onClick={() => handleAddToCart(book)}
                  >
                    Add to Cart
                  </button>
                </figure>
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
