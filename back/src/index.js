const express = require('express');
const cors = require('cors'); // cors import edilmiş mi?

// 2. EXPRESS UYGULAMASINI OLUŞTURMA
const app = express();

// 3. MIDDLEWARE KULLANIMI (SIRALAMA ÇOK ÖNEMLİ)
app.use(cors()); // BU SATIR EN BAŞLARDA OLMALI
app.use(express.json());

// 4. ROTALARIN TANIMLANMASI
const studentRoutes = require('./features/students/student.routes.js');
const bookRoutes = require('./features/books/book.routes.js');
const checkoutRoutes = require('./features/checkouts/checkout.routes.js');
const authRoutes = require('./features/auth/auth.routes.js');

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Library API is running' });
});

app.use('/api/students', studentRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/checkouts', checkoutRoutes);
app.use('/api/auth', authRoutes);


// 5. SUNUCUYU BAŞLATMA
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
