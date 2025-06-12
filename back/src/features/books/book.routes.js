
const express = require('express');
const router = express.Router();
const bookController = require('./book.controller.js');

// GET /api/books
router.get('/', bookController.getAllBooks);

// POST /api/books
router.post('/', bookController.createBook);

module.exports = router;
