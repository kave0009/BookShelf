import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Grid, Typography, CircularProgress } from "@mui/material";
import CustomTooltip from "./CustomTooltip";
import "./css/styles.css";

const genres = [
  { title: "History", link: "history" },
  { title: "Romance", link: "love" },
  { title: "Science Fiction", link: "science-fiction" },
  { title: "Fantasy", link: "fantasy" },
];

const ProductListing = ({ handleAddToCart, handleImageClick }) => {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(genre || "history");

  const fetchBooksFromAPI = async (genre, numBooks = 50) => {
    try {
      const response = await axios.get(
        `https://openlibrary.org/subjects/${encodeURIComponent(
          genre
        )}.json?limit=${numBooks}`
      );
      return response.data.works.map((book) => ({
        id: book.cover_edition_key || book.key,
        title: book.title,
        authors: book.authors || [],
        cover_id: book.cover_id,
      }));
    } catch (error) {
      console.error(`Error fetching books from API:`, error);
      return [];
    }
  };

  const fetchBooksFromDB = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/books");
      return response.data;
    } catch (error) {
      console.error("Error fetching books from database:", error);
      return [];
    }
  };

  const mergeBookData = (dbBooks, apiBooks) => {
    const dbBooksMap = new Map();
    dbBooks.forEach((book) => dbBooksMap.set(book.title.toLowerCase(), book));

    return apiBooks
      .map((apiBook) => {
        const dbBook = dbBooksMap.get(apiBook.title.toLowerCase());
        if (dbBook && apiBook.cover_id) {
          return {
            ...apiBook,
            price: dbBook.price,
            quantity: dbBook.quantity,
            id: dbBook.id,
          };
        }
        return null;
      })
      .filter((book) => book !== null);
  };

  const checkImageExists = async (url, book) => {
    try {
      const response = await axios.get(url);
      return response.status === 200;
    } catch {
      console.log(`Image fetch failed for book: ${book.title}`);
      return false;
    }
  };

  const fetchGenreBooks = useCallback(async (genre) => {
    setLoading(true);
    setError(null);
    try {
      const dbBooks = await fetchBooksFromDB();
      const apiBooks = await fetchBooksFromAPI(genre);
      const mergedBooks = mergeBookData(dbBooks, apiBooks);

      const imageChecks = mergedBooks.map(async (book) => {
        const imageUrl = `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`;
        const imageExists = await checkImageExists(imageUrl, book);
        return imageExists ? book : null;
      });

      const booksWithImages = (await Promise.all(imageChecks)).filter(
        (book) => book !== null
      );

      setBooks(booksWithImages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenreBooks(selectedGenre);
  }, [fetchGenreBooks, selectedGenre]);

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    fetchGenreBooks(genre);
  };

  return (
    <Container>
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
