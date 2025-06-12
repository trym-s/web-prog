const express = require('express');
const router = express.Router();
const checkoutController = require('./checkout.controller.js');
const verifyToken = require('../../middleware/auth.middleware.js');
const requireAdmin = require('../../middleware/admin.middleware.js');

// GET /api/checkouts/my - Sadece giriş yapmış kullanıcının kendi kayıtları
router.get('/my', verifyToken, checkoutController.getMyCheckouts);

// GET /api/checkouts - Tüm kayıtlar (Belki sadece adminler için?)
router.get('/', verifyToken, requireAdmin, checkoutController.getAllCheckouts);

// POST /api/checkouts
router.post('/', verifyToken, checkoutController.createCheckout); 

// PUT /api/checkouts/:id/return
router.put('/:id/return', verifyToken, checkoutController.returnBook); 
module.exports = router;
