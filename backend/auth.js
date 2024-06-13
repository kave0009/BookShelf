const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Register new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
  res.json(newUser.rows[0]);
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (user.rows.length > 0) {
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (validPassword) {
      const token = jwt.sign({ id: user.rows[0].id }, 'your_jwt_secret');
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;

