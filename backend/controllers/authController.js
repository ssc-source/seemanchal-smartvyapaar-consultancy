const catchAsync = require('../utils/catchAsync');
const authUtils = require('../utils/auth');

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  // Check email
  if (email !== adminEmail) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Verify password using bcrypt
  const isMatch = await authUtils.verifyPassword(password, adminPasswordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Issue Token securely
  try {
    const token = authUtils.generateToken({ role: 'admin', email: adminEmail });
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error generating token' });
  }
});
