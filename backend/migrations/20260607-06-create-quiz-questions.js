module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quiz_questions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      quiz_exam_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'quiz_exams',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      question_type: {
        type: Sequelize.ENUM('single_choice', 'multiple_choice', 'text'),
        allowNull: false,
        defaultValue: 'single_choice',
      },
      options: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      correct_answer: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      marks: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
    await queryInterface.dropTable('quiz_questions');
  },
};