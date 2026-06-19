module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'student_profiles';
    const tableInfo = await queryInterface.describeTable(table);

    if (!tableInfo.user_id) {
      await queryInterface.addColumn(table, 'user_id', {
        type: Sequelize.UUID,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = 'student_profiles';
    const tableInfo = await queryInterface.describeTable(table);

    if (tableInfo.user_id) {
      await queryInterface.removeColumn(table, 'user_id');
    }
  },
};
