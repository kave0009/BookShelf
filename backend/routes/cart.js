const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add item to cart
router.post('/', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        const newCartItem = await pool.query(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [userId, productId, quantity]
        );
        res.json(newCartItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get cart items by user ID
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const cartItems = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
        res.json(cartItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update cart item quantity
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        const updatedCartItem = await pool.query(
            'UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *',
            [quantity, id]
        );
        if (updatedCartItem.rows.length === 0) {
            return res.status(404).send('Cart item not found');
        }
        res.json(updatedCartItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete item from cart
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCartItem = await pool.query('DELETE FROM cart WHERE id = $1 RETURNING *', [id]);
        if (deletedCartItem.rows.length === 0) {
            return res.status(404).send('Cart item not found');
        }
        res.json(deletedCartItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

