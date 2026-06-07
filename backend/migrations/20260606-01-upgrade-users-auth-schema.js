async function columnExists(queryInterface, tableName, columnName) {
  const table = await queryInterface.describeTable(tableName);
  return Boolean(table[columnName]);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    if (!(await columnExists(queryInterface, 'users', 'password_hash'))) {
      await queryInterface.addColumn('users', 'password_hash', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!(await columnExists(queryInterface, 'users', 'password_changed_at'))) {
      await queryInterface.addColumn('users', 'password_changed_at', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    await queryInterface.sequelize.query(
      'UPDATE users SET password_hash = passwordHash WHERE password_hash IS NULL AND passwordHash IS NOT NULL'
    );
  },

  async down(queryInterface) {
    if (await columnExists(queryInterface, 'users', 'password_changed_at')) {
      await queryInterface.removeColumn('users', 'password_changed_at');
    }

    if (await columnExists(queryInterface, 'users', 'password_hash')) {
      await queryInterface.removeColumn('users', 'password_hash');
    }
  },
};
