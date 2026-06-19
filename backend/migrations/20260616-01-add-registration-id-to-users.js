const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'registration_id', {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      comment: 'Business registration ID for student',
    });

    await queryInterface.addIndex('users', ['registration_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'registration_id');
  }
};
