const db = require('./connection.js');
const Student = require('../features/students/student.model.js');

const dummyStudents = [
  {
    firstName: 'Zeynep',
    lastName: 'Kaya',
    studentNumber: '20250315'
  },
  {
    firstName: 'Mehmet',
    lastName: 'Demir',
    studentNumber: '20250420'
  },
  {
    firstName: 'Elif',
    lastName: 'Çelik',
    studentNumber: '20250525'
  }
];

async function seedDatabase() {
  console.log('Seeding database with initial data...');

  try {
    // Check if data already exists to prevent duplicates on re-run
    const existingStudents = await Student.getAll();
    if (existingStudents.length > 0) {
      console.log('Database already seeded. Exiting.');
      return;
    }

    // Create promises for each student creation
    const createPromises = dummyStudents.map(student => Student.create(student));
    
    // Execute all promises
    await Promise.all(createPromises);
    
    console.log('Database seeded successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    db.close();
    console.log('Database connection closed.');
  }
}

seedDatabase();
