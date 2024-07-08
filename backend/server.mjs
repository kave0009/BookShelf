import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "./db.mjs";
import authRoutes from "./routes/auth.mjs";
import productRoutes from "./routes/products.mjs";
import cartRoutes from "./routes/cart.mjs";
import checkoutRoutes from "./routes/checkout.mjs";
import booksRoutes from "./routes/books.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// CORS configuration to allow requests from your frontend domain
const corsOptions = {
  origin: [
    "http://3.96.194.12",
    "http://bookshelfapp.com",
    "http://www.bookshelfapp.com",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Connect to the database
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
