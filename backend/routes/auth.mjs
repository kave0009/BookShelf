// routes/auth.mjs
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.mjs";

const router = Router();

router.post("/register", async (req, res) => {
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    address,
    city,
    province,
    postal_code,
    phone_number,
  } = req.body;

  try {
    // Check if user already exists
    const userResult = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await query(
      "INSERT INTO users (username, password, first_name, last_name, email, address, city, province, postal_code, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [
        username,
        hashedPassword,
        first_name,
        last_name,
        email,
        address,
        city,
        province,
        postal_code,
        phone_number,
      ]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    if (err.code === "23505") {
      return res.status(400).json({ message: err.detail }); // Send the error detail
    }
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const userResult = await query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (userResult.rows.length === 0) {
      return res.status(400).send("Invalid username or password");
    }

    const user = userResult.rows[0];

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid username or password");
    }

    // Generate JWT token
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Include user information in the response
    res.json({ token, user });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Server error");
  }
});

export default router;
