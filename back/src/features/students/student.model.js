const db = require('../../db/connection.js');

// Studet Entity
const Student = {
  create: (data) => {
    const { firstName, lastName, studentNumber } = data;
    const sql = 'INSERT INTO Students (first_name, last_name, student_number) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.run(sql, [firstName, lastName, studentNumber], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID); // get new id
        }
      });
    });
  },

  getAll: () => {
    const sql = 'SELECT * FROM Students';
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => { // multiple rows
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  },

  getById: (id) => {
    const sql = 'SELECT * FROM Students WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => { // single row
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  },

  findByStudentNumber: (studentNumber) => {
    const sql = 'SELECT * FROM Students WHERE student_number = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [studentNumber], (err, row) => { // single row
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  },

  update: (id, data) => {
    const { firstName, lastName, studentNumber } = data;
    const sql = 'UPDATE Students SET first_name = ?, last_name = ?, student_number = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [firstName, lastName, studentNumber, id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes); // returns affected rows
        }
      });
    });
  },

  remove: (id) => {
    const sql = 'DELETE FROM Students WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes); // returns affected rows
        }
      });
    });
  },
};

module.exports = Student;
