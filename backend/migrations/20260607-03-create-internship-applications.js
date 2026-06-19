module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('internship_applications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      application_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      college: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      university: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      course: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      branch: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      semester: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      internship_track: {
        type: Sequelize.ENUM('Frontend', 'Backend', 'Full Stack', 'UI/UX', 'AI'),
        allowNull: false,
      },
      resume_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resume_file_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resume_mime_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resume_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'ONBOARDED'),
        allowNull: false,
        defaultValue: 'APPLIED',
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      assigned_batch_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'internship_batches',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('internship_applications');
  },
};