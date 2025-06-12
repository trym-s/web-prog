const Student = require('./student.model.js');

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.getAll();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error getting students', error: error.message });
  }
};

// Create a new student
const createStudent = async (req, res) => {
  try {
    // req.body comes from express.json() middleware in index.js
    const studentData = req.body;
    
    // Basic validation
    if (!studentData.firstName || !studentData.lastName || !studentData.studentNumber) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const newStudentId = await Student.create(studentData);
    res.status(201).json({ id: newStudentId, ...studentData });
  } catch (error) {
    // Handle specific errors, e.g., duplicate student number
    if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ message: 'Student number already exists.' });
    }
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
};

// TODO: Add getStudentById, updateStudent, deleteStudent functions later

module.exports = {
  getAllStudents,
  createStudent,
};
