const db = require('../../db/connection.js');

const Book = {
  // create, getById, update, remove functions remain the same...

  create: (data) => {
    // Tüm yeni alanları (description, page_number, cover_image_url) data nesnesinden alıyoruz
    const { title, author, description, page_number, cover_image_url, isbn, quantity, available_quantity } = data;
    const sql = `
      INSERT INTO Books (title, author, description, page_number, cover_image_url, isbn, quantity, available_quantity) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      // Tüm yeni alanları sorguya parametre olarak ekliyoruz
      db.run(sql, [title, author, description, page_number, cover_image_url, isbn, quantity, available_quantity], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },


  getById: (id) => {
    const sql = 'SELECT * FROM Books WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  update: (id, data) => {
    const { title, author, description, page_number, cover_image_url, isbn, quantity, available_quantity } = data;
    const sql = `
      UPDATE Books 
      SET title = ?, author = ?, description = ?, page_number = ?, cover_image_url = ?, isbn = ?, quantity = ?, available_quantity = ? 
      WHERE id = ?
    `;
    return new Promise((resolve, reject) => {
      db.run(sql, [title, author, description, page_number, cover_image_url, isbn, quantity, available_quantity, id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  },

  remove: (id) => {
    const sql = 'DELETE FROM Books WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  },

  getAll: (options = {}) => {
    const { filters, pagination } = options;
    
    // Base queries
    let sql = `SELECT * FROM Books`;
    let countSql = `SELECT COUNT(*) as total FROM Books`;

    const params = [];
    const whereClauses = [];

    if (filters?.search) {
      whereClauses.push(`(title LIKE ? OR author LIKE ?)`);
      params.push(`%${filters.search}%`);
      params.push(`%${filters.search}%`);
    }
 if (filters?.availability) {
      if (filters.availability === 'available') {
        whereClauses.push(`available_quantity > 0`);
      } else if (filters.availability === 'unavailable') {
        whereClauses.push(`available_quantity = 0`);
      }
    }

    if (whereClauses.length > 0) {
      const whereString = ` WHERE ${whereClauses.join(' AND ')}`;
      sql += whereString;
      countSql += whereString;
    }

    // First, get the total count for pagination metadata
    const countPromise = new Promise((resolve, reject) => {
      db.get(countSql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });

    // Apply pagination
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const offset = (page - 1) * limit;
    
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    // Second, get the paginated data
    const dataPromise = new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Return both promises
    return Promise.all([countPromise, dataPromise]);
  },
};

module.exports = Book;
