const { User, StudentProfile, InternshipApplication, QuizRegistration, QuizAttempt, Certificate } = require('../models');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.admin?.id || req.user?.id || req.userId || req.user?.userId;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const studentProfile = await StudentProfile.findOne({ where: { userId } });
    if (!studentProfile) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const user = await User.findByPk(userId);

    const internshipApplication = await InternshipApplication.findOne({ where: { studentProfileId: studentProfile.id } });

    const quizRegistration = await QuizRegistration.findOne({ where: { studentId: studentProfile.id } });

    let quizAttempt = null;
    if (quizRegistration) {
      quizAttempt = await QuizAttempt.findOne({ where: { quizRegistrationId: quizRegistration.id } });
    }

    const certificate = await Certificate.findOne({ where: { studentId: studentProfile.id } });

    const registrationId = (user && user.registrationId) || studentProfile.registrationId || null;

    return res.json({
      success: true,
      student: {
        name: studentProfile.name,
        email: studentProfile.email,
        phone: studentProfile.phone,
        dob: studentProfile.dob,
        college: studentProfile.college,
        track: studentProfile.track,
        internshipStatus: studentProfile.internshipStatus,
        registrationId,
      },
      internship: {
        applied: !!internshipApplication,
        status: internshipApplication ? internshipApplication.status : null,
        applicationId: internshipApplication ? internshipApplication.id : null,
      },
      quiz: {
        registered: !!quizRegistration,
        status: quizRegistration ? quizRegistration.status : null,
        paymentStatus: quizRegistration ? quizRegistration.paymentStatus || quizRegistration.payment_status : null,
        attemptId: quizAttempt ? quizAttempt.id : null,
        score: quizAttempt ? quizAttempt.score : null,
        passed: quizAttempt ? quizAttempt.passed : null,
      },
      certificate: {
        earned: !!certificate,
        certificateId: certificate ? certificate.certificateId : null,
        pdfUrl: certificate ? certificate.pdfUrl : null,
        verificationCode: certificate ? certificate.verificationCode : null,
        issuedAt: certificate ? certificate.issuedAt : null,
      },
      quickActions: {
        canApplyInternship: !internshipApplication,
        canRegisterQuiz: !!internshipApplication && !quizRegistration,
        canTakeQuiz: !!(quizRegistration && quizRegistration.paymentStatus === 'COMPLETED') && !quizAttempt,
        canViewCertificate: !!certificate,
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard: exports.getDashboard };
