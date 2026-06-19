module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_profiles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      application_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'internship_applications',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      batch_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'internship_batches',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      track: {
        type: Sequelize.ENUM('Frontend', 'Backend', 'Full Stack', 'UI/UX', 'AI'),
        allowNull: true,
      },
      week1_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      week2_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      week3_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      week4_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      week5_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      week6_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mentor_remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      certificate_issued: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      quiz_eligible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('student_profiles');
  },
};