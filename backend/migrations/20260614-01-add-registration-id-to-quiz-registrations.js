const crypto = require('crypto');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('quiz_registrations', 'registration_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    const [rows] = await queryInterface.sequelize.query(
      'SELECT id FROM quiz_registrations WHERE registration_id IS NULL OR registration_id = \'\''
    );

    for (const row of rows) {
      const generatedId = `SSC-REG-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      await queryInterface.sequelize.query(
        `UPDATE quiz_registrations SET registration_id = :registrationId WHERE id = :id`,
        {
          replacements: { registrationId: generatedId, id: row.id },
        }
      );
    }

    await queryInterface.changeColumn('quiz_registrations', 'registration_id', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addConstraint('quiz_registrations', {
      fields: ['registration_id'],
      type: 'unique',
      name: 'uniq_quiz_registrations_registration_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('quiz_registrations', 'uniq_quiz_registrations_registration_id');
    await queryInterface.removeColumn('quiz_registrations', 'registration_id');
  },
};
