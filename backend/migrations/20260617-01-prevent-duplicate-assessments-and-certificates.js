module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add unique index on quiz_attempts(quiz_registration_id)
    // First, verify if index already exists to avoid errors
    const attemptsIndexes = await queryInterface.showIndex('quiz_attempts');
    const uqAttemptsExists = attemptsIndexes.some(idx => idx.name === 'uq_quiz_attempts_quiz_registration_id');
    if (!uqAttemptsExists) {
      await queryInterface.addIndex('quiz_attempts', ['quiz_registration_id'], {
        unique: true,
        name: 'uq_quiz_attempts_quiz_registration_id'
      });
    }

    // 2. Add internship_student_id column to certificates table
    const certTable = await queryInterface.describeTable('certificates');
    
    if (!certTable.internship_student_id) {
      await queryInterface.addColumn('certificates', 'internship_student_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'student_profiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    // 3. Add quiz_registration_id column to certificates table
    if (!certTable.quiz_registration_id) {
      await queryInterface.addColumn('certificates', 'quiz_registration_id', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'quiz_registrations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    // 4. Populate internship_student_id and quiz_registration_id for existing certificates
    // For Internship certificates: set internship_student_id = student_id
    await queryInterface.sequelize.query(`
      UPDATE certificates 
      SET internship_student_id = student_id 
      WHERE certificate_type = 'Internship' AND internship_student_id IS NULL
    `);

    // For quiz certificates: extract quizRegistrationId from metadata JSON
    await queryInterface.sequelize.query(`
      UPDATE certificates 
      SET quiz_registration_id = NULLIF(JSON_UNQUOTE(JSON_EXTRACT(metadata, '$.quizRegistrationId')), 'null')
      WHERE metadata IS NOT NULL AND JSON_EXTRACT(metadata, '$.quizRegistrationId') IS NOT NULL AND quiz_registration_id IS NULL
    `);

    // 5. Add unique indexes for new columns on certificates
    const certIndexes = await queryInterface.showIndex('certificates');
    
    const uqInternshipExists = certIndexes.some(idx => idx.name === 'uq_certificates_internship_student_id');
    if (!uqInternshipExists) {
      await queryInterface.addIndex('certificates', ['internship_student_id'], {
        unique: true,
        name: 'uq_certificates_internship_student_id'
      });
    }

    const uqQuizRegExists = certIndexes.some(idx => idx.name === 'uq_certificates_quiz_registration_id');
    if (!uqQuizRegExists) {
      await queryInterface.addIndex('certificates', ['quiz_registration_id'], {
        unique: true,
        name: 'uq_certificates_quiz_registration_id'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert all migrations safely
    const attemptsIndexes = await queryInterface.showIndex('quiz_attempts');
    if (attemptsIndexes.some(idx => idx.name === 'uq_quiz_attempts_quiz_registration_id')) {
      await queryInterface.removeIndex('quiz_attempts', 'uq_quiz_attempts_quiz_registration_id');
    }

    const certIndexes = await queryInterface.showIndex('certificates');
    if (certIndexes.some(idx => idx.name === 'uq_certificates_internship_student_id')) {
      await queryInterface.removeIndex('certificates', 'uq_certificates_internship_student_id');
    }
    if (certIndexes.some(idx => idx.name === 'uq_certificates_quiz_registration_id')) {
      await queryInterface.removeIndex('certificates', 'uq_certificates_quiz_registration_id');
    }

    const certTable = await queryInterface.describeTable('certificates');
    if (certTable.internship_student_id) {
      await queryInterface.removeColumn('certificates', 'internship_student_id');
    }
    if (certTable.quiz_registration_id) {
      await queryInterface.removeColumn('certificates', 'quiz_registration_id');
    }
  }
};
