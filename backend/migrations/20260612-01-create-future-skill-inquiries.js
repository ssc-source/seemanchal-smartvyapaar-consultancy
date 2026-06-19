module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('future_skill_inquiries', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      school_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      principal_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      board_type: {
        type: Sequelize.ENUM('state_board', 'cbse', 'icse', 'igcse', 'other'),
        allowNull: false,
      },
      student_strength: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      classes_covered: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('new', 'contacted', 'meeting_scheduled', 'proposal_sent', 'negotiation', 'converted', 'rejected'),
        allowNull: false,
        defaultValue: 'new',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      interested_programs: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'website',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('future_skill_inquiries');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_future_skill_inquiries_board_type";').catch(() => {});
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_future_skill_inquiries_status";').catch(() => {});
  },
};
