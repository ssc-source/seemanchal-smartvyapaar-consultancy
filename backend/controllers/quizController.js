const { QuizExam, QuizQuestion, QuizRegistration, QuizAttempt, StudentProfile, sequelize } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { recordAudit } = require('../utils/auditLogger');
const crypto = require('crypto');


const normalizeEmail = (email) => (email ? String(email).trim().toLowerCase() : null);


const getStudentProfileForUser = async (user) => {
  if (!user) return null;
  const email = normalizeEmail(user.email);
  let student = null;
  if (email) {
    student = await StudentProfile.findOne({ where: { email } });
  }
  if (!student) {
    student = await StudentProfile.findByPk(user.id);
  }
  return student;
};


const formatQuestionForResponse = (question) => {
  const q = question.toJSON ? question.toJSON() : question;


  let optionsValue = q.options;


  // Handle MySQL LONGTEXT storing JSON as string
  if (typeof optionsValue === 'string') {
    try {
      optionsValue = JSON.parse(optionsValue);
    } catch (error) {
      console.error('Failed to parse quiz question options:', {
        questionId: q.id,
        options: q.options,
        error: error.message,
      });
      optionsValue = [];
    }
  }


  const optionsFromModel = Array.isArray(optionsValue)
    ? optionsValue
    : optionsValue && typeof optionsValue === 'object'
      ? ['A', 'B', 'C', 'D']
          .map(
            (key) =>
              optionsValue[key] ??
              optionsValue[key.toLowerCase()]
          )
          .filter(
            (value) =>
              value !== undefined &&
              value !== null &&
              value !== ''
          )
      : [];


  return {
    id: q.id,
    question: q.questionText,
    questionText: q.questionText,
    questionType: q.questionType,

    optionA: optionsFromModel[0] ?? '',
    optionB: optionsFromModel[1] ?? '',
    optionC: optionsFromModel[2] ?? '',
    optionD: optionsFromModel[3] ?? '',

    options: optionsFromModel,

    correctAnswer: q.correctAnswer,
    marks: q.marks,

    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
  };
};


exports.listQuizzes = catchAsync(async (req, res) => {
  const quizzes = await QuizExam.findAll({
    where: { status: 'published' },
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'title', 'description', 'timeLimitMinutes', 'passMarks', 'type', 'status', 'createdAt'],
  });
  return res.status(200).json({ success: true, data: quizzes });
});


exports.getQuiz = catchAsync(async (req, res) => {
  const quiz = await QuizExam.findByPk(req.params.id, {
    attributes: ['id', 'title', 'description', 'timeLimitMinutes', 'passMarks', 'type', 'status', 'createdAt'],
    include: [{
      model: QuizQuestion,
      attributes: ['id', 'questionText', 'questionType', 'options', 'correctAnswer', 'marks', 'createdAt', 'updatedAt'],
    }],
  });


  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  const quizJson = quiz.toJSON();
  quizJson.QuizQuestions = (quizJson.QuizQuestions || []).map(formatQuestionForResponse);
  return res.status(200).json({ success: true, data: quizJson });
});



exports.registerQuiz = catchAsync(async (req, res) => {
  // Allow registration via business registration_id OR authenticated user
  const providedStudentId = req.body.studentId;
  const registration_id = req.body.registration_id || req.body.registrationId || null;
  const studentEmail = req.user?.email ? String(req.user.email).trim().toLowerCase() : null;
  const { paymentReference, quizUnlocked = false } = req.body;
  const exam = await QuizExam.findByPk(req.params.id);


  if (!exam) {
    return res.status(404).json({ success: false, message: 'Quiz not found' });
  }


  let student = null;


  // If registration_id provided, prefer lookup by users.registration_id then StudentProfile by userId
  if (registration_id) {
    const { User } = require('../models');
    const user = await User.findOne({ where: { registrationId: registration_id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student not found for provided registration_id' });
    }
    student = await StudentProfile.findOne({ where: { userId: user.id } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found for provided registration_id' });
    }
  }


  // Fallbacks: explicit studentId or authenticated user's email
  if (!student && providedStudentId) {
    student = await StudentProfile.findByPk(providedStudentId);
  }
  if (!student && studentEmail) {
    student = await StudentProfile.findOne({ where: { email: studentEmail } });
  }


  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }


  const isAdmin = req.admin || (req.user && req.user.role === 'admin');


  // Always create registration as pending payment unless an admin is performing the action
  const initialPaymentStatus = isAdmin && req.body.paymentStatus === 'paid' ? 'paid' : 'pending';
  const activatedAt = isAdmin && req.body.paymentStatus === 'paid' && quizUnlocked ? new Date() : (quizUnlocked ? new Date() : null);


  const registrationPayload = {
    studentId: student.id,
    quizExamId: req.params.id,
    paymentStatus: initialPaymentStatus,
    paymentReference: paymentReference || crypto.randomBytes(8).toString('hex'),
    activatedAt,
    status: initialPaymentStatus === 'paid' ? (activatedAt ? 'activated' : 'pending') : 'pending',
  };


  // If client supplied a business registration_id, store it on the quiz registration record
  if (registration_id) {
    registrationPayload.registrationId = registration_id;
  }


  // If exam defines an amount, use it; else default to 500
  registrationPayload.amount = exam.amount || req.body.amount || 500;


  const registration = await QuizRegistration.create(registrationPayload);


  await recordAudit({
    userId: null,
    action: 'CREATE',
    entityType: 'QuizRegistration',
    entityId: registration.id,
    newValue: registration.toJSON(),
    ipAddress: req.ip,
  });


  return res.status(201).json({ success: true, data: registration });
});


exports.submitAttempt = catchAsync(async (req, res) => {
  const { answers = [] } = req.body;
  const student = await getStudentProfileForUser(req.user);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student profile not found. Please register and pay to attempt.' });
  }

  let attemptData = null;

  try {
    attemptData = await sequelize.transaction(async (t) => {
      // Only consider a paid/activated registration for attempting the quiz.
      const registration = await QuizRegistration.findOne({
        where: {
          quizExamId: req.params.id,
          studentId: student.id,
          status: ['activated', 'paid'],
          paymentStatus: 'paid',
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!registration) {
        throw new Error('Active quiz registration not found. Please register and pay to attempt.');
      }

      // CRITICAL FIX: Verify authenticated user owns this registration
      if (req.user && registration.studentId !== student.id) {
        const err = new Error('Unauthorized');
        err.statusCode = 403;
        throw err;
      }

      // If this registration has a payable amount, ensure payment completed
      if (registration.amount && Number(registration.amount) > 0 && registration.paymentStatus !== 'paid') {
        const err = new Error('Payment required to attempt this assessment');
        err.statusCode = 403;
        throw err;
      }

      // Check for existing attempt to prevent duplicate attempts for the same registration (race condition safety)
      const existingAttempt = await QuizAttempt.findOne({
        where: { quizRegistrationId: registration.id },
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (existingAttempt) {
        const err = new Error('Assessment has already been attempted for this registration.');
        err.statusCode = 400;
        throw err;
      }

      const quiz = await QuizExam.findByPk(req.params.id, {
        include: [{ model: QuizQuestion }],
        transaction: t
      });

      if (!quiz) {
        const err = new Error('Quiz not found');
        err.statusCode = 404;
        throw err;
      }

      const questions = quiz.QuizQuestions || [];
      const answerMap = Array.isArray(answers) ? answers.reduce((acc, answer) => {
        if (answer.questionId) acc[answer.questionId] = answer.selectedOption;
        return acc;
      }, {}) : {};

      const normalizeOptionValues = (question) => {
        if (Array.isArray(question.options) && question.options.length) {
          return question.options;
        }
        if (question.options && typeof question.options === 'object') {
          return ['A', 'B', 'C', 'D']
            .map((key) => question.options[key] ?? question.options[key.toLowerCase()])
            .filter((value) => value !== undefined && value !== null && value !== '');
        }
        return [question.optionA, question.optionB, question.optionC, question.optionD].filter(
          (value) => value !== undefined && value !== null && value !== ''
        );
      };

      const optionLetters = ['A', 'B', 'C', 'D'];

      const getAnswerLetter = (selectedValue, question) => {
        if (!selectedValue) return null;
        const selected = String(selectedValue).trim();
        const selectedUpper = selected.toUpperCase();
        if (optionLetters.includes(selectedUpper)) {
          return selectedUpper;
        }
        const options = normalizeOptionValues(question);
        const matchIndex = options.findIndex((opt) => String(opt).trim().toUpperCase() === selectedUpper);
        return matchIndex >= 0 ? optionLetters[matchIndex] : null;
      };

      let score = 0;
      let totalMarks = 0;

      questions.forEach((question) => {
        totalMarks += question.marks || 0;
        const selected = answerMap[question.id];
        const selectedLetter = getAnswerLetter(selected, question);
        const correctAnswer = question.correctAnswer ? String(question.correctAnswer).trim() : '';
        const correctLetter = optionLetters.includes(correctAnswer.toUpperCase()) ? correctAnswer.toUpperCase() : null;
        const correctText = correctLetter ? normalizeOptionValues(question)[optionLetters.indexOf(correctLetter)] : correctAnswer;

        if (
          (selectedLetter && correctLetter && selectedLetter === correctLetter) ||
          (selected && String(selected).trim().toUpperCase() === String(correctText || correctAnswer).trim().toUpperCase())
        ) {
          score += question.marks || 0;
        }
      });

      const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
      const passed = percentage >= quiz.passMarks;

      const attempt = await QuizAttempt.create({
        quizRegistrationId: registration.id,
        startedAt: req.body.startedAt || registration.activatedAt || new Date(),
        completedAt: new Date(),
        answers,
        score,
        passed,
        durationSeconds: req.body.durationSeconds || 0,
      }, { transaction: t });

      if (registration.status !== 'completed') {
        registration.status = 'completed';
        await registration.save({ transaction: t });
      }

      return { attempt, registration, quiz, percentage, passed, score };
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    if (error.message.includes('Active quiz registration not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    console.error('Quiz attempt transaction error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }

  const { attempt, registration, quiz, percentage, passed, score } = attemptData;

  await recordAudit({
    userId: null,
    action: 'CREATE',
    entityType: 'QuizAttempt',
    entityId: attempt.id,
    newValue: attempt.toJSON(),
    ipAddress: req.ip,
  });

  let certRecord = null;

  // If passed, issue certificate (if not already issued) for INTERNSHIP_ASSESSMENT only
  if (passed) {
    const { Certificate, StudentProfile } = require('../models');
    const certType = (quiz && quiz.type === 'INTERNSHIP_ASSESSMENT') ? 'Internship' : 'Quiz Merit';
    
    // Check if certificate already exists using exact database unique scopes
    let existing = null;
    if (certType === 'Internship') {
      existing = await Certificate.findOne({ 
        where: { 
          studentId: registration.studentId,
          certificateType: 'Internship'
        } 
      });
    } else {
      existing = await Certificate.findOne({
        where: {
          quizRegistrationId: registration.id
        }
      });
    }
    
    if (!existing) {
      const cert = await Certificate.create({
        studentId: registration.studentId,
        certificateType: certType,
        certificateId: crypto.randomBytes(4).toString('hex').toUpperCase(),
        verificationCode: crypto.randomBytes(6).toString('hex').toUpperCase(),
        issuedAt: new Date(),
        pdfUrl: null,
        registrationId: registration.registrationId || registration.registration_id || null,
        internshipStudentId: certType === 'Internship' ? registration.studentId : null,
        quizRegistrationId: registration.id,
        metadata: { 
          quizRegistrationId: registration.id, 
          quizAttemptId: attempt.id, 
          score: percentage,
          payment: { gatewayPaymentId: registration.gatewayPaymentId } 
        },
      });

      const studentProfile = await StudentProfile.findByPk(registration.studentId);
      
      try {
        const generateCertificate = require("../utils/certificateGenerator");

        const generated = await generateCertificate({
          certificateId: cert.certificateId,
          studentName: studentProfile?.name || "Student",
          certificateType: cert.certificateType,
          verificationCode: cert.verificationCode,
          issueDate: cert.issuedAt,
          registrationId: cert.registrationId,
          internshipTitle: studentProfile?.track
            ? (studentProfile.track.endsWith("Internship") ? studentProfile.track : `${studentProfile.track} Internship`)
            : "Internship",
          score: percentage,
          grade:
            percentage >= 80
              ? "A"
              : percentage >= 60
              ? "B"
              : "Participation",
        });

        cert.pdfUrl = generated.pdfUrl;
        await cert.save();

        console.log("Certificate PDF generated:", generated.pdfUrl);
        certRecord = cert;
      } catch (err) {
        console.error("Certificate PDF generation failed:", err);
        await cert.destroy(); // rollback certificate if PDF generation fails
      }

      if (certRecord) {
        await recordAudit({ 
          userId: registration.studentId, 
          action: "CREATE", 
          entityType: "Certificate", 
          entityId: certRecord.id, 
          newValue: certRecord.toJSON(), 
          ipAddress: req.ip 
        });

        // Update student profile to reflect passing and certificate issuance when internship assessment
        if (quiz && quiz.type === 'INTERNSHIP_ASSESSMENT') {
          const studentProfile = await StudentProfile.findByPk(registration.studentId);
          if (studentProfile) {
            studentProfile.certificateIssued = true;
            studentProfile.assessmentPassed = true;
            studentProfile.assessmentScore = percentage;
            await studentProfile.save();
          }
        }
      }
    } else {
      certRecord = existing;
    }
  }

  if (!certRecord) {
    const { Certificate } = require('../models');
    certRecord = await Certificate.findOne({ 
      where: { studentId: registration.studentId }, 
      order: [['issuedAt', 'DESC']] 
    }).catch(() => null);
  }

  return res.status(201).json({ 
    success: true, 
    data: { 
      attempt, 
      score, 
      percentage, 
      passed, 
      certificate: certRecord
        ? { 
            id: certRecord.id, 
            certificateId: certRecord.certificateId, 
            certificateType: certRecord.certificateType,
            pdfUrl: certRecord.pdfUrl,
          }
        : null 
    } 
  });
});