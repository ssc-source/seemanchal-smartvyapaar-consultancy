module.exports = {
  async up(queryInterface) {
    // Add dob column and ensure registration_id exists
    await queryInterface.sequelize.query(`ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS dob DATE NULL`);
    await queryInterface.sequelize.query(`ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS registration_id VARCHAR(50) UNIQUE NULL`);
    await queryInterface.sequelize.query(`ALTER TABLE student_profiles ADD INDEX IF NOT EXISTS idx_student_profiles_registration_id (registration_id)`);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`ALTER TABLE student_profiles DROP COLUMN IF EXISTS dob`);
    await queryInterface.sequelize.query(`ALTER TABLE student_profiles DROP INDEX IF EXISTS idx_student_profiles_registration_id`);
    await queryInterface.sequelize.query(`ALTER TABLE student_profiles DROP COLUMN IF EXISTS registration_id`);
  },
};
