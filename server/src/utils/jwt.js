const jwt = require('jsonwebtoken');
const config = require('../config');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
