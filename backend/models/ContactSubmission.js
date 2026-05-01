const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactSubmission = sequelize.define('ContactSubmission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false },
}, { timestamps: true });

module.exports = ContactSubmission;
