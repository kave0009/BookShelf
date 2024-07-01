import pkg from "pg";
import axios from "axios";

const { Pool } = pkg;

const pool = new Pool({
  user: "kave0009",
  host: "localhost",
  database: "ecommerce",
  password: "@Rtin1382",
  port: 5432,
});

const populateBooks = async (books) => {
  for (const book of books) {
    const title = book.title;
    const quantity = 100;
    const price = 0; // Set a default price

    const query = `
      INSERT INTO books (title, quantity, price)
      VALUES ($1, $2, $3)
      ON CONFLICT (title) DO NOTHING
      RETURNING *`;
    const values = [title, quantity, price];

    try {
      const res = await pool.query(query, values);
      if (res.rows.length > 0) {
        console.log(`Inserted book: ${res.rows[0].title}`);
      } else {
        console.log(`Book already exists or insert failed: ${title}`);
      }
    } catch (dbErr) {
      console.error(`Error inserting book "${title}":`, dbErr);
    }
  }
};

const fetchAndInsertBooks = async () => {
  try {
    const response = await axios.get(
      "https://openlibrary.org/subjects/fiction.json"
    );
    const books = response.data.works;
    await populateBooks(books);
  } catch (err) {
    console.error("Error fetching or inserting books:", err);
  } finally {
    pool.end();
  }
};

fetchAndInsertBooks();
