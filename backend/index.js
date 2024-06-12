const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use auth routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('E-commerce backend is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

