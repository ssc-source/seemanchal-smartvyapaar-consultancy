module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS registration_counter (
        id INT PRIMARY KEY,
        current_count INT DEFAULT 360,
        year INT DEFAULT 2026
      )
    `);

    await queryInterface.sequelize.query(
      `INSERT IGNORE INTO registration_counter (id, current_count, year) VALUES (1, 360, 2026)`
    );

    await queryInterface.sequelize.query(
      `ALTER TABLE certificates ADD COLUMN IF NOT EXISTS registration_id VARCHAR(50) UNIQUE NULL`
    );

    await queryInterface.sequelize.query(
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT FALSE`
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TABLE certificates DROP COLUMN IF EXISTS registration_id`
    );

    await queryInterface.sequelize.query(
      `ALTER TABLE users DROP COLUMN IF EXISTS must_change_password`
    );

    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS registration_counter`);
  },
};
