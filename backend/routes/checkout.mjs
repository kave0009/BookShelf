// backend/routes/checkout.mjs
import { Router } from 'express';
import { query } from '../db.mjs';

const router = Router();

router.post('/', async (req, res) => {
  const { userId, cartItems, totalAmount } = req.body;

  try {
    console.log('Starting checkout process');
    console.log('Order data:', req.body);

    // Begin transaction
    await query('BEGIN');
    console.log('Transaction started');

    // Insert order
    const insertOrderText = 'INSERT INTO orders(user_id, total_amount) VALUES($1, $2) RETURNING id';
    const insertOrderValues = [userId, totalAmount];
    const result = await query(insertOrderText, insertOrderValues);
    const orderId = result.rows[0].id;
    console.log('Order inserted with ID:', orderId);

    // Insert order items and update book quantities
    for (const item of cartItems) {
      let bookIdResult = await query('SELECT id, quantity FROM books WHERE title = $1', [item.title]);
      if (bookIdResult.rows.length === 0) {
        console.log(`Book with title "${item.title}" not found. Adding to database.`);
        const insertBookText = 'INSERT INTO books(title, quantity) VALUES($1, 100) RETURNING id';
        const insertBookValues = [item.title];
        bookIdResult = await query(insertBookText, insertBookValues);
        console.log(`Book "${item.title}" added with ID ${bookIdResult.rows[0].id}`);
      }

      const book = bookIdResult.rows[0];
      if (book.quantity < item.quantity) {
        throw new Error(`Insufficient quantity for book: "${item.title}"`);
      }

      const insertOrderItemText = `
        INSERT INTO order_items(order_id, book_id, quantity, price)
        VALUES($1, $2, $3, $4)
      `;
      const insertOrderItemValues = [orderId, book.id, item.quantity, item.price];
      await query(insertOrderItemText, insertOrderItemValues);
      console.log(`Order item inserted for book ID ${book.id}`);

      // Update book quantity
      const updateBookQuantityText = 'UPDATE books SET quantity = quantity - $1 WHERE id = $2';
      const updateBookQuantityValues = [item.quantity, book.id];
      await query(updateBookQuantityText, updateBookQuantityValues);
      console.log(`Book quantity updated for book ID ${book.id}`);
    }

    // Commit transaction
    await query('COMMIT');
    console.log('Transaction committed');
    res.status(200).json({ orderId, totalAmount });
  } catch (err) {
    // Rollback transaction if there was an error
    await query('ROLLBACK');
    console.error('Error placing order:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

export default router;
