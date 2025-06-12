
const express = require('express');
const router = express.Router();
const bookController = require('./book.controller.js');
const verifyToken = require('../../middleware/auth.middleware.js');
const requireAdmin = require('../../middleware/admin.middleware.js');

// GET /api/books
router.get('/', bookController.getAllBooks);

// POST /api/books
router.post('/', verifyToken, requireAdmin, bookController.createBook);

router.put('/:id', verifyToken, requireAdmin, bookController.updateBook);

router.delete('/:id', verifyToken, requireAdmin, bookController.deleteBook);

module.exports = router;
