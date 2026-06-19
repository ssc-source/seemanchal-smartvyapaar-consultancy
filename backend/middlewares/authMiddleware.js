const catchAsync = require('../utils/catchAsync');
const authUtils = require('../utils/auth');
const { User, Role, Permission } = require('../models');
const { recordAudit } = require('../utils/auditLogger');

const getAccessTokenFromRequest = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }

  const cookies = authUtils.parseCookies(req.headers.cookie);
  if (req.originalUrl && req.originalUrl.startsWith('/api/admin')) {
    return cookies.ssc_admin_access_token;
  }
  return cookies.ssc_access_token;
};

const loadUser = (id) => User.findByPk(id, {
  include: [{
    model: Role,
    include: [{ model: Permission, through: { attributes: [] } }],
  }],
});

exports.protect = catchAsync(async (req, res, next) => {
  const token = getAccessTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, token missing', errors: [] });
  }

  try {
    const decoded = authUtils.verifyAccessToken(token);
    const user = decoded.id ? await loadUser(decoded.id) : null;

    if (user) {
      if (user.status !== 'ACTIVE') {
        return res.status(403).json({ success: false, message: 'Account is not active', errors: [] });
      }

      req.user = user;
      req.admin = {
        id: user.id,
        email: user.email,
        role: user.Role?.name || user.role,
        permissions: user.Role?.Permissions?.map((permission) => permission.name) || [],
      };
      return next();
    }

    if (decoded.role === 'admin') {
      req.admin = decoded;
      return next();
    }

    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required', errors: [] });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired', errors: [] });
  }
});

exports.requirePermission = (...permissions) => {
  return catchAsync(async (req, res, next) => {
    const roleName = req.admin?.role;
    const grantedPermissions = req.admin?.permissions || [];

    if (roleName === 'SUPER_ADMIN' || roleName === 'admin') {
      return next();
    }

    const hasPermission = permissions.some((permission) => grantedPermissions.includes(permission));
    if (!hasPermission) {
      await recordAudit({
        userId: req.admin?.id || null,
        action: 'AUTHORIZATION_DENIED',
        entityType: 'Authorization',
        entityId: req.originalUrl,
        newValue: { requiredPermissions: permissions, role: roleName },
        ipAddress: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient permission',
        errors: [],
      });
    }

    return next();
  });
};

// Backward-compatible aliases used by routes
exports.requireAuth = exports.protect;

// requireAdmin: ensure request is authenticated and user has admin role
exports.requireAdmin = (req, res, next) => {
  const run = async () => {
    await exports.protect(req, res, async () => {
      const roleName = req.admin?.role || req.user?.role;
      if (roleName === 'SUPER_ADMIN' || roleName === 'admin') {
        return next();
      }

      await recordAudit({
        userId: req.admin?.id || req.user?.id || null,
        action: 'AUTHORIZATION_DENIED',
        entityType: 'Authorization',
        entityId: req.originalUrl,
        newValue: { required: 'admin', role: roleName },
        ipAddress: req.ip,
      });

      return res.status(403).json({ success: false, message: 'Admin access required', errors: [] });
    });
  };
  run().catch((err) => next(err));
};
