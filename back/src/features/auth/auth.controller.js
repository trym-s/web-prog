const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user.model.js');

const register = async (req, res) => {
  const { username, password, studentId } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10); // Hash the password
    const newUser = { username, passwordHash, role: 'student', studentId }; // Default role is student
    
    const newUserId = await User.create(newUser);
    res.status(201).json({ id: newUserId, username });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized
    }

    // Create JWT
    const payload = { userId: user.id, username: user.username, role: user.role };
    const secret = process.env.JWT_SECRET || 'your-default-secret-key'; // IMPORTANT: Use environment variables
    const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // Token expires in 1 hour

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { register, login };
