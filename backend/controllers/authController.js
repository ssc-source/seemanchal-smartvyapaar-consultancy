const { User, Role, Permission } = require('../models');
const catchAsync = require('../utils/catchAsync');
const authUtils = require('../utils/auth');
const { recordAudit } = require('../utils/auditLogger');
const { sendError, sendSuccess, sendMessage } = require('../utils/apiResponse');

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

  const user = await findUserByEmail(email);
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

  const isMatch = await authUtils.verifyPassword(password, user.passwordHash);
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
