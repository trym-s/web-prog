const db = require('./db/connection.js');

console.log('Bağlantı modülü yüklendi. Test sorgusu çalıştırılıyor...');

// Veritabanındaki tüm tabloları listeleyen basit bir sorgu
db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
  if (err) {
    console.error('Sorgu hatası:', err.message);
    return;
  }
  
  const tableNames = tables.map(t => t.name);
  console.log('Veritabanındaki tablolar:', tableNames);
  
  // Bağlantıyı kapat
  db.close((err) => {
    if (err) {
      console.error('Veritabanı kapatılırken hata:', err.message);
    } else {
      console.log('Veritabanı bağlantısı başarıyla kapatıldı.');
    }
  });
});
