const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new product
router.post('/', async (req, res) => {
    const { name, price, description } = req.body;
    try {
        const newProduct = await pool.query(
            'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
            [name, price, description]
        );
        res.json(newProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const allProducts = await pool.query('SELECT * FROM products');
        res.json(allProducts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (product.rows.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.json(product.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    try {
        const updatedProduct = await pool.query(
            'UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *',
            [name, price, description, id]
        );
        if (updatedProduct.rows.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.json(updatedProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (deletedProduct.rows.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.json(deletedProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

