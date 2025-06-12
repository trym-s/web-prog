const db = require('../../db/connection.js');

const User = {
  create: (data) => {
    // passwordHash is already hashed by bcrypt in controller
    const { username, passwordHash, role, studentId } = data;
    const sql = `
      INSERT INTO Users (username, password_hash, role, student_id) 
      VALUES (?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.run(sql, [username, passwordHash, role, studentId], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },

  findByUsername: (username) => {
    const sql = 'SELECT * FROM Users WHERE username = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

module.exports = User;
