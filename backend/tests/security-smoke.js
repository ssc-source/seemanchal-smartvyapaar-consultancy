require('dotenv').config();

const assert = require('assert');
const { sequelize, User, Role, Permission } = require('../models');
const authUtils = require('../utils/auth');
const { ROLE_PERMISSIONS } = require('../security/permissions');

async function main() {
  await sequelize.authenticate();

  const adminEmail = process.env.ADMIN_LOGIN_EMAIL || process.env.ADMIN_EMAIL;
  const admin = await User.findOne({
    where: { email: adminEmail },
    include: [{ model: Role, include: [{ model: Permission, through: { attributes: [] } }] }],
  });

  assert(admin, 'Seeded admin user must exist');
  assert.strictEqual(admin.status, 'ACTIVE', 'Admin user must be active');
  assert.strictEqual(admin.Role.name, 'SUPER_ADMIN', 'Admin user must be SUPER_ADMIN');
  assert(admin.Role.Permissions.length >= ROLE_PERMISSIONS.SUPER_ADMIN.length, 'SUPER_ADMIN must have all configured permissions');

  const accessToken = authUtils.generateAccessToken({
    id: admin.id,
    email: admin.email,
    role: admin.Role.name,
    permissions: admin.Role.Permissions.map((permission) => permission.name),
  });
  const refreshToken = authUtils.generateRefreshToken({ id: admin.id, email: admin.email });

  assert.strictEqual(authUtils.verifyAccessToken(accessToken).id, admin.id, 'Access token must verify');
  assert.strictEqual(authUtils.verifyRefreshToken(refreshToken).id, admin.id, 'Refresh token must verify');

  const contentRole = await Role.findOne({
    where: { name: 'CONTENT_MANAGER' },
    include: [{ model: Permission, through: { attributes: [] } }],
  });
  const contentPermissions = contentRole.Permissions.map((permission) => permission.name);
  assert(contentPermissions.includes('CONTENT_WRITE'), 'CONTENT_MANAGER must be able to write content');
  assert(!contentPermissions.includes('USERS_MANAGE'), 'CONTENT_MANAGER must not manage users');

  await sequelize.close();
  console.log('Security smoke tests passed.');
}

main().catch(async (error) => {
  console.error(error.message);
  await sequelize.close();
  process.exit(1);
});
