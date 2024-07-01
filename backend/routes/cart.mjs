import { Router } from 'express';
import { query } from '../db.mjs';

const router = Router();

router.post('/', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const product = await query('SELECT quantity FROM products WHERE id = $1', [productId]);
    if (product.rows[0].quantity < quantity) {
      return res.status(400).send('Not enough quantity available');
    }
    const newCartItem = await query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [userId, productId, quantity]
    );
    res.json(newCartItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cartItems = await query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    res.json(cartItems.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const updatedCartItem = await query(
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

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCartItem = await query('DELETE FROM cart WHERE id = $1 RETURNING *', [id]);
    if (deletedCartItem.rows.length === 0) {
      return res.status(404).send('Cart item not found');
    }
    res.json(deletedCartItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
