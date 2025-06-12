const Checkout = require('./checkout.model.js');
const Book = require('../books/book.model.js'); // We need book model for stock control

// Get all checkouts
const getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await Checkout.getAll();
    res.status(200).json(checkouts);
  } catch (error) {
    res.status(500).json({ message: 'Error getting checkouts', error: error.message });
  }
};

// Create a new checkout (Lend a book)
const createCheckout = async (req, res) => {
  const { studentId, bookId } = req.body;
  if (!studentId || !bookId) {
    return res.status(400).json({ message: 'studentId and bookId are required' });
  }

  try {
    // 1. Check book availability
    const book = await Book.getById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.available_quantity < 1) {
      return res.status(400).json({ message: 'Book is not available for checkout' });
    }

    // 2. Create checkout record (Due date: 15 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);
    const checkoutData = { studentId, bookId, dueDate: dueDate.toISOString() };
    const newCheckoutId = await Checkout.create(checkoutData);

    // 3. Decrement available book quantity
    const updatedBookData = { ...book, available_quantity: book.available_quantity - 1 };
    await Book.update(bookId, updatedBookData);
    
    res.status(201).json({ id: newCheckoutId, ...checkoutData });

  } catch (error) {
    res.status(500).json({ message: 'Error creating checkout', error: error.message });
  }
};

const getMyCheckouts = async (req, res) => {
  // req.user comes from our verifyToken middleware
  const studentId = req.user.studentId;

  if (!studentId) {
    // This case might happen for an admin user
    return res.status(400).json({ message: 'User is not associated with a student.' });
  }

  try {
    const checkouts = await Checkout.findByStudentId(studentId);
    res.status(200).json(checkouts);
  } catch (error) {
    res.status(500).json({ message: 'Error getting your checkouts', error: error.message });
  }
};

// Return a book
const returnBook = async (req, res) => {
  const { id } = req.params; // checkout id from URL

  try {
    // 1. Find the active checkout record
    const checkout = await Checkout.findActiveById(id);
    if (!checkout) {
      return res.status(404).json({ message: 'Active checkout not found or already returned' });
    }

    // 2. Mark checkout as returned
    await Checkout.updateAsReturned(id);

    // 3. Increment available book quantity
    const book = await Book.getById(checkout.book_id);
    if (book) {
      const updatedBookData = { ...book, available_quantity: book.available_quantity + 1 };
      await Book.update(book.id, updatedBookData);
    }
    
    res.status(200).json({ message: 'Book returned successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error returning book', error: error.message });
  }
};

module.exports = {
  getAllCheckouts,
  createCheckout,
  returnBook,
  getMyCheckouts,
};
