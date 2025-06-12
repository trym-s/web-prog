const Book = require('./book.model.js');

const getAllBooks = async (req, res) => {
  try {
    // Extract filters and pagination from query parameters
    const options = {
      filters: {
        search: req.query.search || null,
        availability: req.query.availability || null,
      },
      pagination: {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      }
    };
    
    // Model now returns two results: total count and the data itself
    const [totalItems, books] = await Book.getAll(options);

    const totalPages = Math.ceil(totalItems / options.pagination.limit);

    // Build a rich response object for the GUI
    res.status(200).json({
      data: books,
      pagination: {
        totalItems,
        totalPages,
        currentPage: options.pagination.page,
        itemsPerPage: options.pagination.limit,
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error getting books', error: error.message });
  }
};

const createBook = async (req, res) => {
  // ... this function remains the same ...
  try {
    const bookData = req.body;
    if (!bookData.title || !bookData.author || !bookData.quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    bookData.available_quantity = bookData.quantity;

    const newBookId = await Book.create(bookData);
    res.status(201).json({ id: newBookId, ...bookData });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ message: 'ISBN already exists.' });
    }
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.getById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    const updated = { ...book, ...req.body };
    await Book.update(id, updated);
    res.status(200).json({ id: Number(id), ...updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await Book.remove(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
};
