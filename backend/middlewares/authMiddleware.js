const catchAsync = require('../utils/catchAsync');
const authUtils = require('../utils/auth');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
  }

  try {
    const decoded = authUtils.verifyToken(token);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    // If the token is modified, expired, or invalid
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
});
