import pkg from "pg";
import axios from "axios";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const genres = ["history", "love", "science-fiction", "fantasy"];

const fetchBooksFromAPI = async (genre) => {
  const response = await axios.get(
    `https://openlibrary.org/subjects/${genre}.json`
  );
  return response.data.works;
};

const insertBooksToDB = async (books) => {
  for (const book of books) {
    const title = book.title;
    const quantity = 100;
    const price = (Math.random() * 40 + 10).toFixed(2);

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
    const allBooks = [];
    for (const genre of genres) {
      const apiBooks = await fetchBooksFromAPI(genre);
      allBooks.push(...apiBooks);
    }
    await insertBooksToDB(allBooks);
  } catch (err) {
    console.error("Error fetching or inserting books:", err);
  } finally {
    pool.end();
  }
};

fetchAndInsertBooks();
