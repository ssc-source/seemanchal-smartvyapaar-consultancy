// const crypto = require('crypto');
// const { Certificate, StudentProfile } = require('../models');
// const catchAsync = require('../utils/catchAsync');
// const { getPagination, buildOrder } = require('../utils/apiQuery');
// const { recordAudit } = require('../utils/auditLogger');

// const generateCertificateValue = (size = 8) => {
//   return crypto.randomBytes(size).toString('hex').toUpperCase();
// };

// const generateQRCodeUrl = (certificateId) => {
//   const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/career/certificate/verify/${certificateId}`;
//   const encodedUrl = encodeURIComponent(verificationUrl);
//   return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`;
// };

// const generateVerificationUrl = (certificateId) => {
//   return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/career/certificate/verify/${certificateId}`;
// };

// exports.getAllCertificates = catchAsync(async (req, res) => {
//   const { page, limit, offset } = getPagination(req.query);
//   const where = {};
//   if (req.query.certificateType) where.certificateType = req.query.certificateType;
//   if (req.query.studentId) where.studentId = req.query.studentId;

//   const result = await Certificate.findAndCountAll({
//     where,
//     include: [{ model: StudentProfile, attributes: ['id', 'name', 'email', 'track'] }],
//     order: buildOrder(req.query, ['issuedAt', 'certificateType', 'createdAt'], [['createdAt', 'DESC']]),
//     limit,
//     offset,
//   });

//   return res.status(200).json({
//     success: true,
//     data: result.rows,
//     meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
//   });
// });

// exports.getCertificate = catchAsync(async (req, res) => {
//   const certificate = await Certificate.findByPk(req.params.id, {
//     include: [{ model: StudentProfile, attributes: ['id', 'name', 'email', 'track', 'batchId'] }],
//   });
//   if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });

//   const certificateData = certificate.toJSON();
//   certificateData.qrCodeUrl = generateQRCodeUrl(certificate.certificateId);
//   certificateData.verificationUrl = generateVerificationUrl(certificate.certificateId);

//   return res.status(200).json({ success: true, data: certificateData });
// });

// exports.createCertificate = catchAsync(async (req, res) => {
//   const { studentId, certificateType } = req.body;

//   if (!studentId || !certificateType) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'studentId and certificateType are required', 
//       errors: [] 
//     });
//   }

//   const student = await StudentProfile.findByPk(studentId);
//   if (!student) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Student not found',
//       errors: [] 
//     });
//   }

//   const payload = {
//     studentId,
//     certificateType,
//     certificateId: generateCertificateValue(6),
//     verificationCode: generateCertificateValue(8),
//     issuedAt: new Date(),
//     pdfUrl: req.body.pdfUrl || null,
//   };

//   const certificate = await Certificate.create(payload);

//   if (certificate.studentId) {
//     student.certificateIssued = true;
//     await student.save();
//   }

//   await recordAudit({
//     userId: req.admin?.id || null,
//     action: 'CREATE',
//     entityType: 'Certificate',
//     entityId: certificate.id,
//     newValue: certificate.toJSON(),
//     ipAddress: req.ip,
//   });

//   const certificateData = certificate.toJSON();
//   certificateData.qrCodeUrl = generateQRCodeUrl(certificate.certificateId);
//   certificateData.verificationUrl = generateVerificationUrl(certificate.certificateId);

//   return res.status(201).json({ success: true, data: certificateData });
// });

// exports.updateCertificate = catchAsync(async (req, res) => {
//   const certificate = await Certificate.findByPk(req.params.id);
//   if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });

//   const oldValue = certificate.toJSON();
//   if (req.body.pdfUrl) certificate.pdfUrl = req.body.pdfUrl;
//   if (req.body.certificateType) certificate.certificateType = req.body.certificateType;

//   await certificate.save();

//   await recordAudit({
//     userId: req.admin?.id || null,
//     action: 'UPDATE',
//     entityType: 'Certificate',
//     entityId: certificate.id,
//     oldValue,
//     newValue: certificate.toJSON(),
//     ipAddress: req.ip,
//   });

//   const certificateData = certificate.toJSON();
//   certificateData.qrCodeUrl = generateQRCodeUrl(certificate.certificateId);
//   certificateData.verificationUrl = generateVerificationUrl(certificate.certificateId);

//   return res.status(200).json({ success: true, data: certificateData });
// });

// exports.deleteCertificate = catchAsync(async (req, res) => {
//   const certificate = await Certificate.findByPk(req.params.id);
//   if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });

//   const oldValue = certificate.toJSON();
//   const studentId = certificate.studentId;
//   await certificate.destroy();

//   if (studentId) {
//     const student = await StudentProfile.findByPk(studentId);
//     if (student) {
//       student.certificateIssued = false;
//       await student.save();
//     }
//   }

//   await recordAudit({
//     userId: req.admin?.id || null,
//     action: 'DELETE',
//     entityType: 'Certificate',
//     entityId: certificate.id,
//     oldValue,
//     newValue: null,
//     ipAddress: req.ip,
//   });

//   return res.status(200).json({ success: true, message: 'Certificate deleted' });
// });


const crypto = require('crypto');
const { Certificate, StudentProfile, User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination, buildOrder } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');
const generateCertificate = require("../utils/certificateGenerator");


const generateCertificateValue = (size = 8) => {
  return crypto.randomBytes(size).toString('hex').toUpperCase();
};


const generateQRCodeUrl = (certificateId) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/career/certificate/verify/${certificateId}`;
  const encodedUrl = encodeURIComponent(verificationUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`;
};


const generateVerificationUrl = (certificateId) => {
  return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/career/certificate/verify/${certificateId}`;
};


exports.getAllCertificates = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.certificateType) where.certificateType = req.query.certificateType;
  if (req.query.studentId) where.studentId = req.query.studentId;


  const result = await Certificate.findAndCountAll({
    where,
    include: [{ model: StudentProfile, attributes: ['id', 'name', 'email', 'track'] }],
    order: buildOrder(req.query, ['issuedAt', 'certificateType', 'createdAt'], [['createdAt', 'DESC']]),
    limit,
    offset,
  });


  return res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});


exports.getCertificate = catchAsync(async (req, res) => {
  const certificate = await Certificate.findOne({
  where: { certificateId: req.params.id },
  include: [
    {
      model: StudentProfile,
      attributes: ["id", "name", "email", "track", "batchId"],
    },
  ],
});
  if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });


  const certificateData = certificate.toJSON();
  certificateData.qrCodeUrl = generateQRCodeUrl(certificate.certificateId);
  certificateData.verificationUrl = generateVerificationUrl(certificate.certificateId);
  certificateData.pdfUrl = certificate.pdfUrl;


  return res.status(200).json({ success: true, data: certificateData });
});


exports.createCertificate = catchAsync(async (req, res) => {
  const { studentId, certificateType, registrationId } = req.body;


  if (!studentId || !certificateType) {
    return res.status(400).json({ 
      success: false, 
      message: 'studentId and certificateType are required', 
      errors: [] 
    });
  }


  const student = await StudentProfile.findByPk(studentId);
  if (!student) {
    return res.status(400).json({ 
      success: false, 
      message: 'Student not found',
      errors: [] 
    });
  }

  // Resolve finalRegistrationId first to avoid TDZ errors
  let finalRegistrationId = registrationId || null;

  if (!finalRegistrationId && student.userId) {
    const user = await User.findByPk(student.userId);

    if (user?.registrationId) {
      finalRegistrationId = user.registrationId;
    }
  }

  // Load the corresponding QuizRegistration if possible
  const { QuizRegistration } = require('../models');
  let quizRegistration = null;
  if (finalRegistrationId) {
    quizRegistration = await QuizRegistration.findOne({
      where: {
        studentId,
        [Op.or]: [
          { registrationId: finalRegistrationId },
          { paymentReference: finalRegistrationId }
        ]
      }
    });
  }
  if (!quizRegistration) {
    // Fallback: get the latest registration for the student
    quizRegistration = await QuizRegistration.findOne({
      where: { studentId },
      order: [['createdAt', 'DESC']]
    });
  }

  // Check for existing certificate to prevent duplicates
  let existing = null;
  if (certificateType === 'Internship') {
    existing = await Certificate.findOne({
      where: {
        studentId,
        certificateType: 'Internship'
      }
    });
  } else if (quizRegistration) {
    existing = await Certificate.findOne({
      where: {
        quizRegistrationId: quizRegistration.id
      }
    });
  } else if (finalRegistrationId) {
    existing = await Certificate.findOne({
      where: {
        registrationId: finalRegistrationId,
        certificateType
      }
    });
  }

  if (existing) {
    return res.status(400).json({
      success: false,
      message: "Certificate already exists for this student/registration.",
    });
  }

  const payload = {
    studentId,
    certificateType,
    certificateId: generateCertificateValue(6),
    verificationCode: generateCertificateValue(8),
    issuedAt: new Date(),
    pdfUrl: null,
    registrationId: finalRegistrationId,
    internshipStudentId: certificateType === 'Internship' ? studentId : null,
    quizRegistrationId: quizRegistration ? quizRegistration.id : null,
    metadata: {
      issuedBy: 'Admin Portal',
      quizRegistrationId: quizRegistration ? quizRegistration.id : null,
    },
  };

  const certificate = await Certificate.create(payload);


  // FIX #1, #3, #5, #6: Generate PDF and rollback if fails
  try {
    const generated = await generateCertificate({
      certificateId: certificate.certificateId,
      studentName: student.name,
      certificateType: certificate.certificateType,
      verificationCode: certificate.verificationCode,
      issueDate: certificate.issuedAt,
      registrationId: certificate.registrationId,
      // Additional fields for richer certificates
      internshipTitle: student.track 
        ? (student.track.endsWith("Internship") ? student.track : `${student.track} Internship`)
        : "Internship",
      grade: certificate.certificateType === "Quiz Merit" ? "PASS" : "PARTICIPATED",
      score: req.body.score ?? null,
    });

    certificate.pdfUrl = generated.pdfUrl;
    await certificate.save();
  } catch (err) {
    console.error("Certificate PDF generation failed:", err);
    
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


  if (certificate.studentId) {
    // FIX #3: Simplify certificateIssued update
    student.certificateIssued = true;
    await student.save();
  }


  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'Certificate',
    entityId: certificate.id,
    newValue: certificate.toJSON(),
    ipAddress: req.ip,
  });


  const certificateData = certificate.toJSON();
  certificateData.qrCodeUrl = generateQRCodeUrl(certificate.certificateId);
  certificateData.verificationUrl = generateVerificationUrl(certificate.certificateId);


  return res.status(201).json({ success: true, data: certificateData });
});


exports.updateCertificate = catchAsync(async (req, res) => {
  const certificate = await Certificate.findByPk(req.params.id);
  if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });


  const oldValue = certificate.toJSON();
  
  if (req.body.pdfUrl) certificate.pdfUrl = req.body.pdfUrl;
  
  // FIX #9: Regenerate PDF if certificateType changes
  if (req.body.certificateType) {
    const oldType = certificate.certificateType;
    certificate.certificateType = req.body.certificateType;
    
    // Only regenerate if type actually changed
    if (oldType !== req.body.certificateType && certificate.studentId) {
      const student = await StudentProfile.findByPk(certificate.studentId);
      
      if (student) {
        try {
          const generated = await generateCertificate({
            certificateId: certificate.certificateId,
            studentName: student.name,
            certificateType: certificate.certificateType,
            verificationCode: certificate.verificationCode,
            issueDate: certificate.issuedAt,
            registrationId: certificate.registrationId,
            // Additional fields for richer certificates
            internshipTitle: student.track 
              ? (student.track.endsWith("Internship") ? student.track : `${student.track} Internship`)
              : "Internship",
            grade: certificate.certificateType === "Quiz Merit" ? "PASS" : "PARTICIPATED",
            score: null,
          });

          certificate.pdfUrl = generated.pdfUrl;
        } catch (err) {
          console.error("Certificate PDF regeneration failed:", err);
          // Don't rollback update, just log the error
        }
      }
    }
  }


  await certificate.save();


  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'Certificate',
    entityId: certificate.id,
    oldValue,
    newValue: certificate.toJSON(),
    ipAddress: req.ip,
  });


  const certificateData = certificate.toJSON();
  certificateData.qrCodeUrl = generateQRCodeUrl(certificate.certificateId);
  certificateData.verificationUrl = generateVerificationUrl(certificate.certificateId);


  return res.status(200).json({ success: true, data: certificateData });
});


exports.deleteCertificate = catchAsync(async (req, res) => {
  const certificate = await Certificate.findByPk(req.params.id);
  if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });


  const oldValue = certificate.toJSON();
  const studentId = certificate.studentId;
  await certificate.destroy();


  // FIX #8: Only clear certificateIssued if no certificates remain
  if (studentId) {
    const student = await StudentProfile.findByPk(studentId);
    if (student) {
      const remaining = await Certificate.count({
        where: { studentId },
      });
      student.certificateIssued = remaining > 0;
      await student.save();
    }
  }


  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'Certificate',
    entityId: certificate.id,
    oldValue,
    newValue: null,
    ipAddress: req.ip,
  });


  return res.status(200).json({ success: true, message: 'Certificate deleted' });
});