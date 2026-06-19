// const { sendCareerApplicationEmail } = require("../utils/email");
// const { InternshipApplication } = require("../models");
// const catchAsync = require("../utils/catchAsync");
// const { recordAudit } = require("../utils/auditLogger");

// exports.submitCareerApplication = catchAsync(async (req, res) => {
//   const data = req.body;

//   console.log("🟪 Career Application Received:", {
//     name: data.fullName,
//     email: data.email,
//   });

//   // Validate required fields
//   const errors = [];
//   if (!data.fullName) errors.push("fullName is required");
//   if (!data.email) errors.push("email is required");
//   if (!data.phone) errors.push("phone is required");
//   if (!data.college) errors.push("college is required");
//   if (!data.internshipTrack) errors.push("internshipTrack is required");
  
//   if (errors.length > 0) {
//     return res.status(400).json({
//       success: false,
//       message: "Validation failed",
//       errors,
//     });
//   }

//   // CRITICAL FIX: Create InternshipApplication record in database
//   const applicationId = `SSC-INT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

//   try {
//     const application = await InternshipApplication.create({
//       applicationId,
//       fullName: data.fullName,
//       email: data.email,
//       phone: data.phone,
//       college: data.college,
//       university: data.university || null,
//       course: data.course || null,
//       branch: data.branch || null,
//       semester: data.semester || null,
//       internshipTrack: data.internshipTrack,
//       resumeUrl: null,
//       resumeFileName: null,
//       resumeMimeType: null,
//       resumeSize: null,
//       status: 'APPLIED',
//     });

//     await recordAudit({
//       action: 'CREATE',
//       entityType: 'InternshipApplication',
//       entityId: application.id,
//       newValue: application.toJSON(),
//       ipAddress: req.ip,
//     });

//     // SEND EMAIL NOTIFICATION
//     await sendCareerApplicationEmail(data);

//     return res.status(201).json({
//       success: true,
//       message: "Application submitted successfully",
//       data: {
//         applicationId: application.applicationId,
//         status: application.status,
//       },
//     });
//   } catch (error) {
//     console.error("Career Application Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to submit application",
//     });
//   }
// };

exports.submitCareerApplication = (req, res) => {
  console.warn('Deprecated route /api/career-applications called.');
  return res.status(410).json({
    success: false,
    message: 'Legacy career application endpoint is deprecated. Use /api/internships/apply instead.',
  });
};

  const errors = [];

  if (!data.fullName) errors.push("fullName is required");
  if (!data.email) errors.push("email is required");
  if (!data.phone) errors.push("phone is required");
  if (!data.college) errors.push("college is required");
  if (!data.applyingFor && !data.internshipTrack) errors.push("applyingFor is required");

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  const applicationId = `SSC-INT-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase()}`;

  const internshipTrack = data.applyingFor || data.internshipTrack || data.role || null;

  try {
    const application = await InternshipApplication.create({
      applicationId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      college: data.college,
      university: data.university || null,
      course: data.course || null,
      branch: data.branch || null,
      semester: data.semester || null,
      internshipTrack,
      applyingFor: data.applyingFor || null,
      internshipType: data.internshipType || null,
      github: data.github || null,
      linkedin: data.linkedin || null,
      portfolio: data.portfolio || null,
      projectsExperience: data.projectsExperience || null,
      whyJoinSSC: data.whyJoinSSC || null,
      status: "APPLIED",
    });

    await recordAudit({
      action: "CREATE",
      entityType: "InternshipApplication",
      entityId: application.id,
      newValue: application.toJSON(),
      ipAddress: req.ip,
    });

    await sendCareerApplicationEmail(data);

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: {
        applicationId: application.applicationId,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("Career Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
});