const express = require('express');
const router = express.Router();
const checkoutController = require('./checkout.controller.js');

// GET /api/checkouts
router.get('/', checkoutController.getAllCheckouts);

// POST /api/checkouts
router.post('/', checkoutController.createCheckout);

// PUT /api/checkouts/:id/return  (Mark a checkout as returned)
router.put('/:id/return', checkoutController.returnBook);

module.exports = router;
