import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import authRoutes from "./routes/auth.mjs";
import productRoutes from "./routes/products.mjs";
import cartRoutes from "./routes/cart.mjs";
import checkoutRoutes from "./routes/checkout.mjs";
import booksRoutes from "./routes/books.mjs";
import { connectDB, query } from "./db.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000"], // Allow local frontend during development
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to the database
connectDB().catch((err) => {
  console.error("Failed to connect to the database:", err);
  process.exit(1);
});

// Routes
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

const startBackend = () => {
  app.listen(PORT, (err) => {
    if (err) {
      console.error("Failed to start server:", err);
      process.exit(1);
    } else {
      console.log(`Server is running on port ${PORT}`);
    }
  });
};

startBackend();
