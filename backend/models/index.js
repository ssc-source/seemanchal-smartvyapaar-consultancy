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

// Define Relationships

// Service <-> Project (Many-to-Many or One-to-Many)
Service.hasMany(Project, { foreignKey: 'serviceId' });
Project.belongsTo(Service, { foreignKey: 'serviceId' });

// Category <-> BlogPost (One-to-Many)
Category.hasMany(BlogPost, { foreignKey: 'categoryId' });
BlogPost.belongsTo(Category, { foreignKey: 'categoryId' });

// User (Admin) <-> BlogPost (Author)
User.hasMany(BlogPost, { foreignKey: 'authorId' });
BlogPost.belongsTo(User, { foreignKey: 'authorId' });

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
  HomepageSection
};
