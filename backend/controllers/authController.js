const { User, Role, Permission, StudentProfile, sequelize } = require('../models');
const catchAsync = require('../utils/catchAsync');
const authUtils = require('../utils/auth');
const { recordAudit } = require('../utils/auditLogger');
const { sendError, sendSuccess, sendMessage } = require('../utils/apiResponse');
const { generateRegistrationId } = require('../utils/generateRegistrationId');
const emailUtils = require('../utils/email');

const ACCESS_COOKIE = 'ssc_access_token';
const REFRESH_COOKIE = 'ssc_refresh_token';

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  status: user.status,
  role: user.Role?.name || user.role,
  permissions: user.Role?.Permissions?.map((permission) => permission.name) || [],
  lastLogin: user.lastLogin,
  passwordChangedAt: user.passwordChangedAt,
});

const userInclude = [{
  model: Role,
  include: [{ model: Permission, through: { attributes: [] } }],
}];

const findUserByEmail = (email) => User.findOne({
  where: { email },
  include: userInclude,
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  const options = authUtils.getAuthCookieOptions();
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...options,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...options,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res) => {
  const options = authUtils.getAuthCookieOptions();
  res.clearCookie(ACCESS_COOKIE, options);
  res.clearCookie(REFRESH_COOKIE, options);
};

const tokenPayloadFor = (user) => ({
  id: user.id,
  email: user.email,
  role: user.Role?.name || user.role,
  permissions: user.Role?.Permissions?.map((permission) => permission.name) || [],
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Please provide email and password', 400);
  }

  let user = await findUserByEmail(email);
  if (!user) {
    // If user supplied a registration id in the email field, try lookup by registration_id
    if (email && typeof email === 'string' && email.includes('SSC/')) {
      user = await User.findOne({ where: { registrationId: email }, include: userInclude });
    }
  }

  if (!user) {
    await recordAudit({
      action: 'AUTH_LOGIN_FAILED',
      entityType: 'Authentication',
      newValue: { email, reason: 'USER_NOT_FOUND' },
      ipAddress: req.ip,
    });
    return sendError(res, 'Invalid credentials', 401);
  }

  if (user.status !== 'ACTIVE') {
    await recordAudit({
      userId: user.id,
      action: 'AUTH_LOGIN_BLOCKED',
      entityType: 'Authentication',
      entityId: user.id,
      newValue: { status: user.status },
      ipAddress: req.ip,
    });
    return sendError(res, 'Account is not active', 403);
  }

  // Allow login with either hashed password or registrationId (temporary password)
  let isMatch = await authUtils.verifyPassword(password, user.passwordHash);
  let usedTemporaryPassword = false;

  if (!isMatch) {
    // Try registration id on User record
    if (user.registrationId && password === user.registrationId) {
      isMatch = true;
      usedTemporaryPassword = true;
    } else {
      // try registrationId match via StudentProfile (fallback)
      const studentProfile = await StudentProfile.findOne({ where: { userId: user.id } });
      if (studentProfile && studentProfile.registrationId && password === studentProfile.registrationId) {
        isMatch = true;
        usedTemporaryPassword = true;
      }
    }
  }

  if (!isMatch) {
    await recordAudit({
      userId: user.id,
      action: 'AUTH_LOGIN_FAILED',
      entityType: 'Authentication',
      entityId: user.id,
      newValue: { email, reason: 'PASSWORD_MISMATCH' },
      ipAddress: req.ip,
    });
    return sendError(res, 'Invalid credentials', 401);
  }

  user.lastLogin = new Date();
  await user.save();

  // Read must_change_password flag from DB (raw query since model doesn't expose it)
  let mustChangePassword = false;
  try {
    const [rows] = await sequelize.query('SELECT must_change_password FROM users WHERE id = ?', { replacements: [user.id] });
    if (rows && rows[0] && typeof rows[0].must_change_password !== 'undefined') {
      mustChangePassword = !!rows[0].must_change_password;
    }
  } catch (e) {
    // ignore
  }

  const payload = tokenPayloadFor(user);
  const accessToken = authUtils.generateAccessToken(payload);
  const refreshToken = authUtils.generateRefreshToken({ id: user.id, email: user.email });
  setAuthCookies(res, accessToken, refreshToken);

  await recordAudit({
    userId: user.id,
    action: 'AUTH_LOGIN_SUCCESS',
    entityType: 'Authentication',
    entityId: user.id,
    ipAddress: req.ip,
  });

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token: accessToken,
    data: {
      user: publicUser(user),
      accessToken,
      mustChangePassword,
    },
  });
});

exports.logout = catchAsync(async (req, res) => {
  clearAuthCookies(res);
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'AUTH_LOGOUT',
    entityType: 'Authentication',
    entityId: req.admin?.id || null,
    ipAddress: req.ip,
  });
  return sendMessage(res, 'Logged out successfully');
});

exports.refresh = catchAsync(async (req, res) => {
  const cookies = authUtils.parseCookies(req.headers.cookie);
  const refreshToken = cookies[REFRESH_COOKIE] || req.body?.refreshToken;

  if (!refreshToken) {
    return sendError(res, 'Refresh token missing', 401);
  }

  let decoded;
  try {
    decoded = authUtils.verifyRefreshToken(refreshToken);
  } catch (error) {
    return sendError(res, 'Refresh token invalid or expired', 401);
  }

  const user = await User.findByPk(decoded.id, { include: userInclude });
  if (!user || user.status !== 'ACTIVE') {
    return sendError(res, 'User unavailable', 401);
  }

  const accessToken = authUtils.generateAccessToken(tokenPayloadFor(user));
  const nextRefreshToken = authUtils.generateRefreshToken({ id: user.id, email: user.email });
  setAuthCookies(res, accessToken, nextRefreshToken);

  return sendSuccess(res, { user: publicUser(user), accessToken });
});

exports.me = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.admin.id, { include: userInclude });
  if (!user) return sendError(res, 'User not found', 404);
  return sendSuccess(res, { user: publicUser(user) });
});

exports.registerStudent = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;

  // Validate required fields
  if (!email || !password || !name) {
    return sendError(res, 'Email, password, and name are required', 400);
  }

  if (password.length < 10) {
    return sendError(res, 'Password must be at least 10 characters', 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    await recordAudit({
      action: 'AUTH_REGISTRATION_FAILED',
      entityType: 'Authentication',
      newValue: { email, reason: 'EMAIL_ALREADY_EXISTS' },
      ipAddress: req.ip,
    });
    return sendError(res, 'Email already registered', 409);
  }

  // Generate registration ID first
  const registrationId = await generateRegistrationId();

  // Create new student user and StudentProfile inside a transaction
  const t = await sequelize.transaction();
  let user;
  try {
    const passwordHash = await authUtils.hashPassword(password);
    user = await User.create({
      email,
      passwordHash,
      name,
      role: 'student',
      status: 'ACTIVE',
    }, { transaction: t });

    // Ensure must_change_password is FALSE for new users (raw update since model doesn't expose the field)
    await sequelize.query('UPDATE users SET must_change_password = FALSE WHERE id = ?', {
      replacements: [user.id],
      transaction: t,
    });

    // Create StudentProfile with registration_id
    await StudentProfile.create({
      userId: user.id,
      email: user.email,
      name: user.name,
      dob: req.body.dob || null,
      phone: req.body.phone || null,
      track: req.body.track?.trim() || null,
      quizEligible: false,
      internshipStatus: 'NOT_STARTED',
      certificateIssued: false,
      assessmentPassed: false,
      assessmentScore: null,
      registrationId,
    }, { transaction: t });

    // Update users.registration_id
    try {
      await sequelize.query('UPDATE users SET registration_id = ? WHERE id = ?', {
        replacements: [registrationId, user.id],
        transaction: t,
      });
    } catch (e) {
      // ignore if column missing
    }

    await recordAudit({
      userId: user.id,
      action: 'AUTH_REGISTRATION_SUCCESS',
      entityType: 'Authentication',
      entityId: user.id,
      newValue: { email: user.email, registrationId },
      ipAddress: req.ip,
    });

    await t.commit();

    // Send admin notification (non-blocking for user flow)
    try {
      emailUtils.sendAdminNotification({
        name: user.name,
        email: user.email,
        phone: req.body.phone,
        dob: req.body.dob,
        registrationId,
        source: 'Registration',
      });
    } catch (err) {
      console.warn('Admin email failed to send:', err.message);
    }

    // Auto-login after registration
    const payload = tokenPayloadFor(user);
    const accessToken = authUtils.generateAccessToken(payload);
    const refreshToken = authUtils.generateRefreshToken({ id: user.id, email: user.email });
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      success: true,
      registrationId,
      message: 'Account created successfully',
      userId: user.id,
    });
  } catch (err) {
    await t.rollback();
    console.error('Signup transaction failed:', err);
    return sendError(res, 'Failed to create account', 500);
  }
});

exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 10) {
    return sendError(res, 'Current password and a new password of at least 10 characters are required', 400);
  }

  const user = await User.findByPk(req.admin.id, { include: userInclude });
  if (!user) return sendError(res, 'User not found', 404);

  const isMatch = await authUtils.verifyPassword(currentPassword, user.passwordHash);
  if (!isMatch) return sendError(res, 'Current password is incorrect', 401);

  const oldValue = { passwordChangedAt: user.passwordChangedAt };
  user.passwordHash = await authUtils.hashPassword(newPassword);
  user.passwordChangedAt = new Date();
  await user.save();

  await recordAudit({
    userId: user.id,
    action: 'AUTH_PASSWORD_CHANGED',
    entityType: 'User',
    entityId: user.id,
    oldValue,
    newValue: { passwordChangedAt: user.passwordChangedAt },
    ipAddress: req.ip,
  });

  return sendMessage(res, 'Password changed successfully');
});

// Unauthenticated password change for first-login (email + currentPassword + newPassword)
exports.changePasswordInitial = catchAsync(async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  if (!email || !currentPassword || !newPassword || newPassword.length < 10) {
    return sendError(res, 'Email, current password and a new password of at least 10 characters are required', 400);
  }

  const user = await findUserByEmail(email);
  if (!user) return sendError(res, 'User not found', 404);

  const isMatch = await authUtils.verifyPassword(currentPassword, user.passwordHash);
  if (!isMatch) return sendError(res, 'Current password is incorrect', 401);

  // Update password
  user.passwordHash = await authUtils.hashPassword(newPassword);
  user.passwordChangedAt = new Date();
  await user.save();

  // Clear must_change_password flag
  try {
    await sequelize.query('UPDATE users SET must_change_password = FALSE WHERE id = ?', { replacements: [user.id] });
  } catch (e) {
    // ignore
  }

  await recordAudit({
    userId: user.id,
    action: 'AUTH_PASSWORD_CHANGED',
    entityType: 'User',
    entityId: user.id,
    newValue: { passwordChangedAt: user.passwordChangedAt },
    ipAddress: req.ip,
  });

  return sendMessage(res, 'Password changed successfully');
});
