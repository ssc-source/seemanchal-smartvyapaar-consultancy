'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('quiz_exams', 'type', {
      type: Sequelize.ENUM('INTERNSHIP_ASSESSMENT', 'PRACTICE_TEST', 'CERTIFICATION_TEST'),
      allowNull: false,
      defaultValue: 'PRACTICE_TEST',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('quiz_exams', 'type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_quiz_exams_type";');
  }
};
