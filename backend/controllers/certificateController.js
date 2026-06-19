const { Certificate, StudentProfile, sequelize } = require('../models');
const catchAsync = require('../utils/catchAsync');
const generateCertificate = require("../utils/certificateGenerator");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");


const generateQRCodeUrl = (certificateId) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/career/certificate/verify/${certificateId}`;
  const encodedUrl = encodeURIComponent(verificationUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`;
};


const generateVerificationUrl = (certificateId) => {
  return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/career/certificate/verify/${certificateId}`;
};


exports.createCertificate = catchAsync(async (req, res) => {

  console.log("========== CREATE CERTIFICATE CALLED ==========");
console.log(req.body);
  const { quizRegistrationId, registration_id, score } = req.body;
  // FIX #2: Remove duplicate Certificate import, only import QuizRegistration
  const { QuizRegistration } = require('../models');


  let quizRegistration = null;
  let user = null;
  // FIX #1: Declare studentProfile once at the top to avoid shadowing
  let studentProfile = null;


  if (registration_id) {
    // Prefer users table lookup
    const { User } = require('../models');
    user = await User.findOne({ where: { registrationId: registration_id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found for registration_id' });
    // Find student profile for user
    studentProfile = await StudentProfile.findOne({ where: { userId: user.id } });
    if (!studentProfile) return res.status(404).json({ success: false, message: 'Student profile not found' });
    // FIX #11: Fix quizRegistration lookup - order by createdAt DESC to get latest quiz
    quizRegistration = await QuizRegistration.findOne({ 
      where: { studentId: studentProfile.id },
      order: [["createdAt", "DESC"]],
    });
  } else if (quizRegistrationId) {
    quizRegistration = await QuizRegistration.findByPk(quizRegistrationId);
    if (quizRegistration) {
      // load user via student profile
      studentProfile = await StudentProfile.findByPk(quizRegistration.studentId || quizRegistration.student_id);
      if (studentProfile) user = await require('../models').User.findByPk(studentProfile.userId || studentProfile.user_id);
    }
  }


  if (!quizRegistration) {
    return res.status(404).json({ success: false, message: 'Quiz registration not found' });
  }
  
  // FIX #1: Only do another lookup if studentProfile is still null
  if (!studentProfile) {
    studentProfile = await StudentProfile.findByPk(quizRegistration.studentId || quizRegistration.student_id);
  }
  
  // FIX #2: Add null check for studentProfile
  if (!studentProfile) {
    return res.status(404).json({
      success: false,
      message: "Student profile not found",
    });
  }
  
  const certificateId =
    "CERT-" +
    Date.now() +
    "-" +
    crypto.randomBytes(3).toString("hex").toUpperCase();
  
  // FIX #3: Do not pre-populate pdfUrl, set to null initially
  const pdfUrl = null;
  
  // FIX #6: Normalize score with Number(score) before comparing
  const numericScore = Number(score) || 0;
  
  // FIX: Compute certificateType once before using it
  const certificateType = numericScore >= 60 ? "Quiz Merit" : "Quiz Participation";
  
  // FIX: Removed certificate.certificateType - certificate doesn't exist yet
  const internshipTitle = studentProfile.track 
    ? (studentProfile.track.endsWith("Internship") ? studentProfile.track : `${studentProfile.track} Internship`)
    : "Internship";
  
  const registrationForCert = (user && user.registrationId) || quizRegistration.registrationId || quizRegistration.registration_id || registration_id || null;

  let certificate = null;

  try {
    certificate = await sequelize.transaction(async (t) => {
      // Check for existing certificate based on exact unique scopes
      let existing = null;
      if (certificateType === 'Internship') {
        existing = await Certificate.findOne({
          where: {
            studentId: studentProfile.id,
            certificateType: 'Internship'
          },
          transaction: t,
          lock: t.LOCK.UPDATE
        });
      } else {
        existing = await Certificate.findOne({
          where: {
            quizRegistrationId: quizRegistration.id
          },
          transaction: t,
          lock: t.LOCK.UPDATE
        });
      }

      if (existing) {
        // Throw a special error that we can catch outside to return the correct response
        const err = new Error('Certificate already exists');
        err.existingRecord = existing;
        throw err;
      }

      const newCert = await Certificate.create({
        certificateId,
        studentId: studentProfile.id,
        registrationId: registrationForCert,
        internshipStudentId: certificateType === 'Internship' ? studentProfile.id : null,
        quizRegistrationId: quizRegistration.id,
        certificateType,
        pdfUrl,
        verificationCode: crypto.randomBytes(6).toString("hex").toUpperCase(),
        issuedAt: new Date(),
        metadata: { 
          score: numericScore, 
          quizExamId: quizRegistration.quizExamId || quizRegistration.quiz_exam_id, 
          issuedBy: 'SSC Internship Program' 
        }
      }, { transaction: t });

      return newCert;
    });
  } catch (error) {
    if (error.message === 'Certificate already exists' && error.existingRecord) {
      const existing = error.existingRecord;
      return res.status(200).json({
        success: true,
        certificateId: existing.certificateId,
        pdfUrl: existing.pdfUrl,
        verificationCode: existing.verificationCode,
        message: "Certificate already exists",
      });
    }
    console.error('Certificate creation transaction error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }


  // FIX #5: Wrap generateCertificate() in try/catch
  console.log("Generating PDF...", {
  certificateId: certificate.certificateId,
  student: studentProfile.name,
});
  try {
    const generated = await generateCertificate({
      certificateId: certificate.certificateId,
      studentName: studentProfile.name,
      certificateType: certificate.certificateType,
      verificationCode: certificate.verificationCode,
      issueDate: certificate.issuedAt,
      registrationId: certificate.registrationId,
      // Additional fields for richer certificates
      internshipTitle: internshipTitle,
      // FIX Change #2: Safer grade assignment with letter grades
      grade: numericScore >= 80
        ? "A"
        : numericScore >= 60
        ? "B"
        : "Participation",
      score: numericScore,
    });

    certificate.pdfUrl = generated.pdfUrl;
    await certificate.save();

    console.log("PDF generated:", generated);
    
    // FIX Change #3: Log PDF generation result for debugging
    console.log("Certificate generated:", {
      certificateId: certificate.certificateId,
      pdfUrl: certificate.pdfUrl,
    });
  } catch (err) {
    console.error("Certificate generation failed:", err);

    // FIX #5: Protected rollback
    try {
      await certificate.destroy();
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate certificate PDF",
    });
  }


  return res.status(201).json({
    success: true,
    certificateId: certificate.certificateId,
    registration_id: certificate.registrationId,
    pdfUrl: certificate.pdfUrl,
    verificationCode: certificate.verificationCode,
    message: 'Certificate generated successfully'
  });
});


exports.verifyCertificate = catchAsync(async (req, res) => {
  const certificate = await Certificate.findOne({
    where: { certificateId: req.params.certificateId },
    include: [{ model: StudentProfile, attributes: ['id', 'name', 'email', 'track', 'batchId'] }],
  });


  if (!certificate) {
    return res.status(404).json({ success: false, message: 'Certificate not found' });
  }


  return res.status(200).json({
    success: true,
    data: {
      id: certificate.id,
      certificateId: certificate.certificateId,
      certificateType: certificate.certificateType,
      issuedAt: certificate.issuedAt,
      pdfUrl: certificate.pdfUrl,
      verificationCode: certificate.verificationCode,
      verificationUrl: generateVerificationUrl(certificate.certificateId),
      qrCodeUrl: generateQRCodeUrl(certificate.certificateId),
      studentName: certificate.StudentProfile?.name,
      track: certificate.StudentProfile?.track,
      student: certificate.StudentProfile ? {
        id: certificate.StudentProfile.id,
        name: certificate.StudentProfile.name,
        email: certificate.StudentProfile.email,
        track: certificate.StudentProfile.track,
      } : null,
      status: 'VALID'
    },
  });
});


exports.downloadCertificate = catchAsync(async (req, res) => {
  const certificate = await Certificate.findOne({ where: { certificateId: req.params.certificateId } });
  if (!certificate) {
    return res.status(404).json({ success: false, message: 'Certificate not found' });
  }

  // Ensure owner or admin
  const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'SUPER_ADMIN');
  const student = await StudentProfile.findOne({ where: { userId: req.user.id } });
  const isOwner = student && student.id === certificate.studentId;
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Forbidden: You do not own this certificate' });
  }


  if (!certificate.pdfUrl) {
    return res.status(404).json({ success: false, message: 'Certificate PDF not available' });
  }


  // Make downloadCertificate compatible with both absolute and relative URLs
  if (certificate.pdfUrl.startsWith("http")) {
    return res.redirect(certificate.pdfUrl);
  }


  const filePath = path.join(
    __dirname,
    "..",
    "public",
    certificate.pdfUrl.replace(/^\/+/, "")
  );


  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: "Certificate PDF file not found",
    });
  }


  return res.download(filePath, `certificate-${certificate.certificateId}.pdf`);
});


exports.getStudentCertificates = catchAsync(async (req, res) => {
  // FIX #10: Fix getStudentCertificates - use StudentProfile.userId instead of User.id
  const userId = req.user?.id;


  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }


  const student = await StudentProfile.findOne({
    where: { userId },
  });


  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student profile not found",
    });
  }


  const certs = await Certificate.findAll({
    where: { studentId: student.id },
    order: [["issuedAt", "DESC"]],
  });


  return res.status(200).json({
    success: true,
    data: certs,
  });
});