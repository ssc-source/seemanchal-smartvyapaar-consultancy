module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('student_profiles', 'track', {
      type: Sequelize.ENUM('Frontend', 'Backend', 'Full Stack'),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('student_profiles', 'track', {
      type: Sequelize.ENUM('Frontend', 'Backend', 'Full Stack'),
      allowNull: false,
    });
  },
};
