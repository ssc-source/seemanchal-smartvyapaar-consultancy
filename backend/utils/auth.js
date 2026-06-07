const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAccessTokenSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment.');
  }
  return secret;
};

const getRefreshTokenSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL ERROR: JWT_REFRESH_SECRET/JWT_SECRET is not defined in environment.');
  }
  return secret;
};

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

exports.hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, Number(process.env.BCRYPT_ROUNDS || 12));
};

/**
 * Generate a JWT token using env-driven secrets.
 * @param {Object} payload 
 * @returns {string} token
 */
exports.generateToken = (payload) => {
  return exports.generateAccessToken(payload);
};

exports.generateAccessToken = (payload) => {
  return jwt.sign(payload, getAccessTokenSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || process.env.JWT_EXPIRES_IN || '15m',
  });
};

exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload, getRefreshTokenSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

/**
 * Verify a JWT token and decode its payload.
 * @param {string} token 
 * @returns {Object} decoded payload
 */
exports.verifyToken = (token) => {
  return exports.verifyAccessToken(token);
};

exports.verifyAccessToken = (token) => jwt.verify(token, getAccessTokenSecret());

exports.verifyRefreshToken = (token) => jwt.verify(token, getRefreshTokenSecret());

exports.parseCookies = (cookieHeader = '') => {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf('=');
      if (separatorIndex === -1) return cookies;
      const key = decodeURIComponent(part.slice(0, separatorIndex));
      const value = decodeURIComponent(part.slice(separatorIndex + 1));
      cookies[key] = value;
      return cookies;
    }, {});
};

exports.getAuthCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
};
