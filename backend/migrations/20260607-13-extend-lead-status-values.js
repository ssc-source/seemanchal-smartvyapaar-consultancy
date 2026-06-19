module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE leads
      MODIFY status ENUM('new','contacted','qualified','closed','lost','interested','converted','rejected') NOT NULL DEFAULT 'new';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE leads
      MODIFY status ENUM('new','contacted','qualified','closed','lost') NOT NULL DEFAULT 'new';
    `);
  },
};