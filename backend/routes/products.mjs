// routes/products.mjs
import { Router } from "express";
import { query } from "../db.mjs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const books = await query("SELECT * FROM books");
    res.json(books.rows);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const bookResult = await query("SELECT * FROM books WHERE id = $1", [
      bookId,
    ]);
    if (bookResult.rows.length === 0) {
      return res.status(404).send("Book not found");
    }
    res.json(bookResult.rows[0]);
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).send("Server error");
  }
});

export default router;
