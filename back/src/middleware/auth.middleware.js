const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  const secret = process.env.JWT_SECRET || 'your-default-secret-key';

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden (invalid token)
    }
    req.user = user; // Add decoded user payload to the request object
    next(); // Proceed to the next middleware or the route handler
  });
};

module.exports = verifyToken;
