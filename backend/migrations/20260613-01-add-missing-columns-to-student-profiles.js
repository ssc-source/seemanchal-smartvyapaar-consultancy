module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'student_profiles';

    // Check if columns exist before adding them
    const tableInfo = await queryInterface.describeTable(table);

    if (!tableInfo.phone) {
      await queryInterface.addColumn(table, 'phone', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.college) {
      await queryInterface.addColumn(table, 'college', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!tableInfo.internship_status) {
      await queryInterface.addColumn(table, 'internship_status', {
        type: Sequelize.ENUM('APPLIED', 'IN_PROGRESS', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'APPLIED',
      });
    }

    if (!tableInfo.assessment_passed) {
      await queryInterface.addColumn(table, 'assessment_passed', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    if (!tableInfo.assessment_score) {
      await queryInterface.addColumn(table, 'assessment_score', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = 'student_profiles';

    try {
      await queryInterface.removeColumn(table, 'phone');
    } catch (err) {
      // Column doesn't exist, skip
    }

    try {
      await queryInterface.removeColumn(table, 'college');
    } catch (err) {
      // Column doesn't exist, skip
    }

    try {
      await queryInterface.removeColumn(table, 'internship_status');
    } catch (err) {
      // Column doesn't exist, skip
    }

    try {
      await queryInterface.removeColumn(table, 'assessment_passed');
    } catch (err) {
      // Column doesn't exist, skip
    }

    try {
      await queryInterface.removeColumn(table, 'assessment_score');
    } catch (err) {
      // Column doesn't exist, skip
    }
  },
};
