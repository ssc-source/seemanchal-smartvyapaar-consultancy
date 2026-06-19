const { User, Role, Permission, sequelize } = require('../models');
const catchAsync = require('../utils/catchAsync');
const authUtils = require('../utils/auth');
const { recordAudit } = require('../utils/auditLogger');
const { sendError, sendSuccess, sendMessage } = require('../utils/apiResponse');

const ACCESS_COOKIE = 'ssc_admin_access_token';
const REFRESH_COOKIE = 'ssc_admin_refresh_token';

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

const setAdminAuthCookies = (res, accessToken, refreshToken) => {
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

const clearAdminAuthCookies = (res) => {
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

  const roleName = user.Role?.name || user.role;
  if (roleName !== 'admin' && roleName !== 'SUPER_ADMIN') {
    await recordAudit({
      action: 'AUTH_LOGIN_FAILED',
      entityType: 'Authentication',
      newValue: { email, reason: 'NOT_ADMIN' },
      ipAddress: req.ip,
    });
    return sendError(res, 'Access denied: Admin role required', 403);
  }

  const isMatch = await authUtils.verifyPassword(password, user.passwordHash);
  if (!isMatch) {
    await recordAudit({
      action: 'AUTH_LOGIN_FAILED',
      entityType: 'Authentication',
      newValue: { email, reason: 'INVALID_PASSWORD' },
      ipAddress: req.ip,
    });
    return sendError(res, 'Invalid credentials', 401);
  }

  if (user.status !== 'ACTIVE') {
    return sendError(res, 'User status inactive. Contact administrator.', 403);
  }

  user.lastLogin = new Date();
  await user.save();

  const payload = tokenPayloadFor(user);
  const accessToken = authUtils.generateAccessToken(payload);
  const refreshToken = authUtils.generateRefreshToken({ id: user.id, email: user.email });

  setAdminAuthCookies(res, accessToken, refreshToken);

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
  clearAdminAuthCookies(res);
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

  const roleName = user.Role?.name || user.role;
  if (roleName !== 'admin' && roleName !== 'SUPER_ADMIN') {
    return sendError(res, 'Access denied', 403);
  }

  const accessToken = authUtils.generateAccessToken(tokenPayloadFor(user));
  const nextRefreshToken = authUtils.generateRefreshToken({ id: user.id, email: user.email });
  setAdminAuthCookies(res, accessToken, nextRefreshToken);

  return res.status(200).json({
    success: true,
    message: 'Token refreshed',
    token: accessToken,
    data: {
      user: publicUser(user),
      accessToken,
    },
  });
});

exports.me = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.user.id, { include: userInclude });
  if (!user) {
    return sendError(res, 'User profile not found', 404);
  }
  return res.status(200).json({
    success: true,
    data: publicUser(user),
  });
});
