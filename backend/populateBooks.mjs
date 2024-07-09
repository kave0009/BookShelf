import pkg from "pg";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const genres = [
  { title: "History", link: "history" },
  { title: "Romance", link: "love" },
  { title: "Science Fiction", link: "science-fiction" },
  { title: "Fantasy", link: "fantasy" },
];

const createTables = async () => {
  const createBooksTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) UNIQUE NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL
    );
  `;

  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      address VARCHAR(255),
      city VARCHAR(255),
      province VARCHAR(255),
      postal_code VARCHAR(20),
      phone_number VARCHAR(20)
    );
  `;

  const createOrdersTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      total_amount DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createOrderItemsTableQuery = `
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INT REFERENCES orders(id),
      book_id INT REFERENCES books(id),
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL
    );
  `;

  const createCartTableQuery = `
    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      book_id INT REFERENCES books(id),
      quantity INT NOT NULL
    );
  `;

  try {
    await pool.query(createBooksTableQuery);
    await pool.query(createUsersTableQuery);
    await pool.query(createOrdersTableQuery);
    await pool.query(createOrderItemsTableQuery);
    await pool.query(createCartTableQuery);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
    throw err;
  }
};

const getRandomPrice = () => {
  return (Math.random() * (50 - 5) + 5).toFixed(2); // Random price between $5 and $50
};

const populateBooks = async (books) => {
  for (const book of books) {
    const title = book.title;
    const quantity = 100;
    const price = getRandomPrice();

    const query = `
      INSERT INTO books (title, quantity, price)
      VALUES ($1, $2, $3)
      ON CONFLICT (title) DO NOTHING
      RETURNING *`;
    const values = [title, quantity, price];

    try {
      const res = await pool.query(query, values);
      if (res.rows.length > 0) {
        console.log(
          `Inserted book: ${res.rows[0].title} with price: $${price}`
        );
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
    await createTables(); // Ensure tables are created before inserting data

    for (const genre of genres) {
      const response = await axios.get(
        `https://openlibrary.org/subjects/${encodeURIComponent(
          genre.link
        )}.json?limit=50`
      );
      const books = response.data.works;
      await populateBooks(books);
    }
  } catch (err) {
    console.error("Error fetching or inserting books:", err);
  } finally {
    pool.end();
  }
};

fetchAndInsertBooks();
