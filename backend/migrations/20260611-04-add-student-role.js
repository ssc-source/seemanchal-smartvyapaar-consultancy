module.exports = {
  async up(queryInterface, Sequelize) {
    // Add 'student' role to the enum if not already present
    // Note: This migration modifies the ENUM type, which requires recreating the column in MySQL
    try {
      // For MySQL, we need to use raw SQL to alter the ENUM
      await queryInterface.sequelize.query(
        `ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'editor', 'student') DEFAULT 'student'`
      );
      console.log('✓ Added student role to users.role enum');
    } catch (err) {
      // If it fails, it might already exist
      console.warn('Could not modify role enum (may already exist):', err.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove 'student' role from enum
    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'editor') DEFAULT 'editor'`
      );
    } catch (err) {
      console.warn('Could not revert role enum:', err.message);
    }
  },
};
