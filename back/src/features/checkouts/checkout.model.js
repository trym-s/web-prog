
const db = require('../../db/connection.js');

const Checkout = {
  // GUI friendly checkout creation
  create: (data) => {
    const { studentId, bookId, dueDate } = data;
    const sql = `
      INSERT INTO Checkouts (student_id, book_id, due_date) 
      VALUES (?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.run(sql, [studentId, bookId, dueDate], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },

  // Get all checkouts with student and book details
  getAll: () => {
    const sql = `
      SELECT 
        C.id,
        C.checkout_date,
        C.due_date,
        C.return_date,
        S.id as studentId,
        S.first_name || ' ' || S.last_name as studentName,
        B.id as bookId,
        B.title as bookTitle
      FROM Checkouts C
      JOIN Students S ON C.student_id = S.id
      JOIN Books B ON C.book_id = B.id
      ORDER BY C.checkout_date DESC
    `;
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  
  // Find a single, active checkout
  findActiveById: (id) => {
    const sql = `
      SELECT * FROM Checkouts 
      WHERE id = ? AND return_date IS NULL
    `;
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Mark a book as returned
  updateAsReturned: (id) => {
    const sql = `
      UPDATE Checkouts 
      SET return_date = datetime('now', 'localtime') 
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      db.run(sql, [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }
};

module.exports = Checkout;
