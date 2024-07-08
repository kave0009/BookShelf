import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    throw err;
  }
};

export const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};
