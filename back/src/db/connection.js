const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'library.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanına bağlanırken hata oluştu:', err.message);
  } else {
    console.log('SQLite veritabanına başarıyla bağlanıldı.');
  }
});

module.exports = db;
