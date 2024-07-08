import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB, query } from "./db.mjs";
import authRoutes from "./routes/auth.mjs";
import productRoutes from "./routes/products.mjs";
import cartRoutes from "./routes/cart.mjs";
import checkoutRoutes from "./routes/checkout.mjs";
import booksRoutes from "./routes/books.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

const corsOptions = {
  origin: [
    "http://35.182.93.118",
    "http://bookshelfz.com",
    "http://www.bookshelfz.com",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

connectDB().catch((err) => {
  console.error("Failed to connect to the database:", err);
  process.exit(1);
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/books", booksRoutes);

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
