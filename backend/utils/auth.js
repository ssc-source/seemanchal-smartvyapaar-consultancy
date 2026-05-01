const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Verify a plaintext password against a stored hash securely.
 * @param {string} plainPassword 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>}
 */
exports.verifyPassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) return false;
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate a JWT token using env-driven secrets.
 * @param {Object} payload 
 * @returns {string} token
 */
exports.generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment.');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify a JWT token and decode its payload.
 * @param {string} token 
 * @returns {Object} decoded payload
 */
exports.verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment.');
  }
  return jwt.verify(token, secret);
};
