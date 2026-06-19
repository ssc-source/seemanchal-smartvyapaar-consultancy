module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure unique index on users.registration_id
    try {
      await queryInterface.addIndex('users', ['registration_id'], { unique: true, name: 'idx_users_registration_id_unique' });
    } catch (e) {
      console.warn('Index idx_users_registration_id_unique may already exist');
    }

    // Add indexes on child tables for registration_id
    try {
      await queryInterface.addIndex('internship_applications', ['registration_id'], { name: 'idx_internship_applications_registration_id' });
    } catch (e) { console.warn('Could not add index on internship_applications'); }

    try {
      await queryInterface.addIndex('quiz_registrations', ['registration_id'], { name: 'idx_quiz_registrations_registration_id' });
    } catch (e) { console.warn('Could not add index on quiz_registrations'); }

    try {
      await queryInterface.addIndex('certificates', ['registration_id'], { name: 'idx_certificates_registration_id' });
    } catch (e) { console.warn('Could not add index on certificates'); }
  },

  down: async (queryInterface, Sequelize) => {
    try { await queryInterface.removeIndex('users', 'idx_users_registration_id_unique'); } catch (e) {}
    try { await queryInterface.removeIndex('internship_applications', 'idx_internship_applications_registration_id'); } catch (e) {}
    try { await queryInterface.removeIndex('quiz_registrations', 'idx_quiz_registrations_registration_id'); } catch (e) {}
    try { await queryInterface.removeIndex('certificates', 'idx_certificates_registration_id'); } catch (e) {}
  }
};
