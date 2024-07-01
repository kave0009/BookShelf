// controllers/bookController.mjs
import { query } from "../db.mjs";

// Function to fetch books from the database
const fetchBooksFromDatabase = async () => {
  const result = await query("SELECT id, title, quantity, price FROM books");
  return result.rows;
};

// Controller to handle GET request for books
export const getBooks = async (req, res) => {
  try {
    const books = await fetchBooksFromDatabase();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
