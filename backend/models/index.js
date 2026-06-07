const sequelize = require('../config/database');
const Lead = require('./Lead');
const Service = require('./Service');
const Project = require('./Project');
const Testimonial = require('./Testimonial');
const Setting = require('./Setting');
const ContactSubmission = require('./ContactSubmission');
const Media = require('./Media');
const Category = require('./Category');
const BlogPost = require('./BlogPost');
const User = require('./User');
const HomepageSection = require('./HomepageSection');
const ContentPage = require('./ContentPage');
const JobOpening = require('./JobOpening');
const CommunityItem = require('./CommunityItem');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const AuditLog = require('./AuditLog');

// Define Relationships

// Service <-> Project (One-to-Many)
Service.hasMany(Project, { foreignKey: 'serviceId' });
Project.belongsTo(Service, { foreignKey: 'serviceId' });

// Category <-> BlogPost (One-to-Many)
Category.hasMany(BlogPost, { foreignKey: 'categoryId' });
BlogPost.belongsTo(Category, { foreignKey: 'categoryId' });

// User (Admin) <-> BlogPost (Author)
User.hasMany(BlogPost, { foreignKey: 'authorId' });
BlogPost.belongsTo(User, { foreignKey: 'authorId' });

// Role and Permission relationships
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId',
});

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

AuditLog.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(AuditLog, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Lead,
  Service,
  Project,
  Testimonial,
  Setting,
  ContactSubmission,
  Media,
  Category,
  BlogPost,
  User,
  HomepageSection,
  ContentPage,
  JobOpening,
  CommunityItem,
  Role,
  Permission,
  RolePermission,
  AuditLog,
};
