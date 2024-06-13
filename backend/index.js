const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use auth routes
app.use('/api/auth', authRoutes);

// Use product routes
app.use('/api/products', productRoutes);

// Use cart routes
app.use('/api/cart', cartRoutes);

// Use checkout routes
app.use('/api/checkout', checkoutRoutes);

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  }
});

app.get('/', (req, res) => {
  res.send('E-commerce backend is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

