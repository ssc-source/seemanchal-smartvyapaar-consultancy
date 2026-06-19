module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('certificates', 'metadata', { type: Sequelize.JSON, allowNull: true });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('certificates', 'metadata');
  }
};
