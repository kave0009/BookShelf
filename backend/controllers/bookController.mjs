import { query } from "../db.mjs";

const fetchBooksFromDatabase = async () => {
  const result = await query("SELECT id, title, quantity, price FROM books");
  return result.rows;
};

export const getBooks = async (req, res) => {
  try {
    const books = await fetchBooksFromDatabase();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
