import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.mjs";
import productRoutes from "./routes/products.mjs";
import cartRoutes from "./routes/cart.mjs";
import checkoutRoutes from "./routes/checkout.mjs";
import booksRoutes from "./routes/books.mjs"; // Import the books route
import { query } from "./db.mjs"; // Ensure you import the query function

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003; // Changed to 5003

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/books", booksRoutes); // Use the books route

app.get("/test-db", async (req, res) => {
  try {
    const result = await query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection error");
  }
});

app.get("/", (req, res) => {
  res.send("E-commerce backend is running");
});

app.listen(PORT, (err) => {
  if (err) {
    console.error("Failed to start server:", err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
