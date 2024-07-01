// routes/books.mjs
import express from "express";
import { getBooks } from "../controllers/bookController.mjs";

const router = express.Router();

router.get("/", getBooks);

export default router;
