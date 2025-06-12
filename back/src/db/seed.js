const db = require('./connection.js');
const bcrypt = require('bcrypt');

// Modelleri import ediyoruz
const Student = require('../features/students/student.model.js');
const Book = require('../features/books/book.model.js');
const User = require('../features/auth/user.model.js');
const Checkout = require('../features/checkouts/checkout.model.js');

/**
 * Bu ana fonksiyon, tüm tohumlama sürecini yönetir.
 */
async function runSeeding() {
  console.log('Starting the seeding process...');
  
  await clearDatabase();

  try {
    const students = await seedStudents();
    console.log(`Successfully seeded ${students.length} students.`);

    const books = await seedBooks();
    console.log(`Successfully seeded ${books.length} books.`);

    await seedUsers(students);
    console.log(`Successfully seeded users for students and an admin.`);

    await seedCheckouts(students, books);
    console.log(`Successfully seeded checkouts.`);

    console.log('✅ Seeding completed successfully!');

  } catch (error) {
    console.error('❌ An error occurred during the seeding process:', error);
  } finally {
    db.close();
    console.log('Database connection closed.');
  }
}

/**
 * Tohumlama öncesi tüm tablolardaki verileri temizler.
 */
async function clearDatabase() {
    console.log('Clearing all tables...');
    const tables = ['Checkouts', 'Users', 'Students', 'Books'];
    for (const table of tables) {
        await new Promise((res, rej) => db.run(`DELETE FROM ${table}`, (err) => err ? rej(err) : res()));
        await new Promise((res, rej) => db.run(`DELETE FROM sqlite_sequence WHERE name='${table}'`, (err) => err ? res() : res())); // Reset auto-increment
    }
    console.log('All tables cleared and auto-increment sequences reset.');
}

/**
 * Öğrencileri veritabanına ekler.
 */
async function seedStudents() {
  const dummyStudents = [
    { firstName: 'Ali', lastName: 'Veli', studentNumber: '101' },
    { firstName: 'Zeynep', lastName: 'Kaya', studentNumber: '102' },
    { firstName: 'Mehmet', lastName: 'Demir', studentNumber: '103' },
  ];
  
  const promises = dummyStudents.map(student => Student.create(student));
  const createdStudentIds = await Promise.all(promises);
  
  return dummyStudents.map((student, index) => ({ ...student, id: createdStudentIds[index] }));
}

/**
 * Kitapları veritabanına ekler.
 */
async function seedBooks() {
  const dummyBooks = [
    { title: 'Yerdeniz Büyücüsü', author: 'Ursula K. Le Guin', description: 'Fantastik bir klasik.', page_number: 240, cover_image_url: 'https://img.kitapyurdu.com/v1/getImage/fn:11891875/wh:true/wi:220', isbn: '9786053142279', quantity: 3, available_quantity: 3 },
    { title: 'Dune', author: 'Frank Herbert', description: 'Bilim kurgu başyapıtı.', page_number: 712, cover_image_url: 'https://img.kitapyurdu.com/v1/getImage/fn:11494736/wh:true/wi:220', isbn: '9786057911639', quantity: 5, available_quantity: 5 },
    { title: '1984', author: 'George Orwell', description: 'Distopik bir roman.', page_number: 328, cover_image_url: 'https://i.dr.com.tr/cache/600x600-0/originals/0000000064038-1.jpg', isbn: '9789750718534', quantity: 2, available_quantity: 2 },
  ];

  const promises = dummyBooks.map(book => Book.create(book));
  const createdBookIds = await Promise.all(promises);

  return dummyBooks.map((book, index) => ({ ...book, id: createdBookIds[index] }));
}

/**
 * Kullanıcıları oluşturur.
 */
async function seedUsers(students) {
  const saltRounds = 10;
  const genericPassword = await bcrypt.hash('password123', saltRounds);

  const userPromises = students.map(student => {
    const username = `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}`;
    return User.create({
      username: username,
      passwordHash: genericPassword,
      role: 'student',
      studentId: student.id,
    });
  });

  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  userPromises.push(User.create({
    username: 'admin',
    passwordHash: adminPassword,
    role: 'admin',
    studentId: null,
  }));

  await Promise.all(userPromises);
}

/**
 * Ödünç alma kayıtlarını oluşturur.
 */
async function seedCheckouts(students, books) {
  const checkoutPromises = [];

  if (students[0] && books[1]) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);
    
    checkoutPromises.push(Checkout.create({
      studentId: students[0].id,
      bookId: books[1].id,
      dueDate: dueDate.toISOString(),
    }));

    const updatedBook = { ...books[1], available_quantity: books[1].available_quantity - 1 };
    checkoutPromises.push(Book.update(books[1].id, updatedBook));
  }
  
  if (students[1] && books[2]) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 20);

    checkoutPromises.push(Checkout.create({
      studentId: students[1].id,
      bookId: books[2].id,
      dueDate: dueDate.toISOString(),
    }));
    const updatedBook = { ...books[2], available_quantity: books[2].available_quantity - 1 };
    checkoutPromises.push(Book.update(books[2].id, updatedBook));
  }

  await Promise.all(checkoutPromises);
}

// Script'i çalıştır
runSeeding();
