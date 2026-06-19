module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE internship_applications
      ADD COLUMN IF NOT EXISTS registration_id VARCHAR(50) NULL,
      ADD COLUMN IF NOT EXISTS student_profile_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE internship_applications
      ADD INDEX IF NOT EXISTS idx_internship_applications_registration_id (registration_id)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE internship_applications
      ADD CONSTRAINT fk_internship_applications_student_profile_id
      FOREIGN KEY (student_profile_id)
      REFERENCES student_profiles(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
    `).catch((error) => {
      // Log and continue when FK cannot be created (schema mismatch, engine/collation issues)
      console.warn('Could not add FK fk_internship_applications_student_profile_id:', error.message);
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE internship_applications
      DROP FOREIGN KEY IF EXISTS fk_internship_applications_student_profile_id
    `).catch(() => {});

    await queryInterface.sequelize.query(`
      ALTER TABLE internship_applications
      DROP INDEX IF EXISTS idx_internship_applications_registration_id
    `).catch(() => {});

    await queryInterface.sequelize.query(`
      ALTER TABLE internship_applications
      DROP COLUMN IF EXISTS registration_id,
      DROP COLUMN IF EXISTS student_profile_id
    `).catch(() => {});
  },
};
