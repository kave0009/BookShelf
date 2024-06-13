const express = require('express');
const router = express.Router();
const stripe = require('stripe')('your_stripe_secret_key');

router.post('/', async (req, res) => {
    const { amount, currency, source } = req.body;
    try {
        const charge = await stripe.charges.create({
            amount,
            currency,
            source,
        });
        res.json(charge);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

