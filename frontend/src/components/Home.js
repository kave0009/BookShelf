import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, CircularProgress } from "@mui/material";
import "./css/styles.css";
import "./css/promise.css";
import BillboardSlider from "./BillboardSlider";
import CustomTooltip from "./CustomTooltip";
import Popular from "./images/Popular.svg";
import Featured from "./images/Featured.svg";
import PromiseSection from "./images/Promise.svg";
import Prices from "./images/Prices.svg";
import Privacy from "./images/Privacy.svg";
import Fast from "./images/fast.svg";
import Service from "./images/service.svg";
import ProductListing from "./ProductListing";

const genres = [
  { title: "History", link: "history" },
  { title: "Romance", link: "love" },
  { title: "Science Fiction", link: "science-fiction" },
  { title: "Fantasy", link: "fantasy" },
];

const items = [
  { src: Prices, alt: "Prices" },
  { src: Privacy, alt: "Privacy" },
  { src: Fast, alt: "Fast" },
  { src: Service, alt: "Service" },
];

const Home = ({ handleAddToCart, handleImageClick }) => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/books`
      );
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error("Expected an array but got:", response.data);
        return [];
      }
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

  const fetchFeaturedBooks = async () => {
    setLoading(true);
    try {
      const dbBooks = await fetchBooksFromDB();
      const allBooksPromises = genres.map((genre) =>
        fetchBooksFromAPI(genre.link)
      );
      const allBooks = await Promise.all(allBooksPromises);
      const flattenedBooks = allBooks.flat();
      const mergedBooks = mergeBookData(dbBooks, flattenedBooks);
      setFeaturedBooks(mergedBooks.slice(0, 4));
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
    <div
      className="MuiContainer-root MuiContainer-maxWidthLg content css-loqqzyl-MuiContainer-root"
      style={{ padding: "0 0 0 0" }}
    >
      <section>
        <BillboardSlider />
      </section>
      <section id="featured-books" className="py-5 my-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header align-center">
                <div className="title">
                  <span>Quality Items</span>
                </div>
                <h2 className="section-title">
                  <img
                    src={Featured}
                    alt="Featured Books"
                    className="section-icon"
                  />
                </h2>
              </div>
              <div
                className="product-list"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "20px",
                }}
              >
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography variant="body1">{error}</Typography>
                ) : (
                  featuredBooks.map((book, index) => (
                    <div
                      key={book.id || `book-${index}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <CustomTooltip title="Click for more details">
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
                            {book.cover_id ? (
                              <img
                                src={`https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`}
                                alt="Books"
                                className="product-item"
                                style={{
                                  width: "100%",
                                  height: "auto",
                                  cursor: "pointer",
                                  display: "none", // Hide initially
                                }}
                                onLoad={(e) =>
                                  (e.target.style.display = "block")
                                }
                                onError={(e) =>
                                  (e.target.style.display = "none")
                                }
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
                          <figcaption style={{ textAlign: "center" }}>
                            <h3
                              className="book-title"
                              style={{
                                fontSize: "1.25rem",
                                marginBottom: "10px",
                              }}
                            >
                              {book.title}
                            </h3>
                            <span
                              style={{ display: "block", marginBottom: "10px" }}
                            >
                              {book.authors
                                .map((author) => author.name)
                                .join(", ")}
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
                      </CustomTooltip>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="promise-section">
        <div className="container">
          <div className="section-header align-center">
            <div className="title">
              <span>commitments</span>
            </div>
            <h2 className="section-title">
              <img
                src={PromiseSection}
                alt="Promise Section"
                className="section-icon"
              />
            </h2>
          </div>
          <div
            className="slider"
            style={{
              "--imageQuantity": items.length / 2,
            }}
          >
            <div className="list">
              {items.concat(items).map((item, index) => (
                <div className="item" key={index}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={{
                      width: "250px",
                      height: "250px",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="popular-books" className="bookshelf py-5 my-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header align-center">
                <div className="title">
                  <span>Listings</span>
                </div>
                <h2 className="section-title">
                  <img
                    src={Popular}
                    alt="Popular Books"
                    className="section-icon"
                  />
                </h2>
              </div>
              <ProductListing
                handleAddToCart={handleAddToCart}
                handleImageClick={handleImageClick}
                showFeatured={false}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
