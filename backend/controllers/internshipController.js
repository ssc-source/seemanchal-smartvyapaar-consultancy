const { InternshipApplication, StudentProfile, User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { sendCareerApplicationEmail } = require('../utils/email');

const TRACKS = ['Frontend', 'Backend', 'Full Stack', 'UI/UX', 'AI'];
const INTERNSHIP_TYPES = ['Remote', 'Hybrid', 'On-site'];

exports.apply = catchAsync(async (req, res) => {
  console.log('🔥 INTERNSHIP CONTROLLER HIT', {
    path: req.originalUrl,
    method: req.method,
    bodyKeys: Object.keys(req.body),
  });

  const registrationId = req.body.registrationId || req.body.registration_id || null;
  const fullName = req.body.fullName || null;
  const email = req.body.email || null;
  const phone = req.body.phone || null;
  const location = req.body.location || null;
  const college = req.body.college || null;
  const degree = req.body.degree || null;
  const graduationYear = req.body.graduationYear || req.body.graduation_year || null;
  const applyingFor = req.body.applyingFor || req.body.applying_for || req.body.internshipTrack || req.body.internship_track || req.body.role || null;
  const internshipType = req.body.internshipType || req.body.internship_type || null;
  const internshipTrack = req.body.internshipTrack || req.body.internship_track || applyingFor || null;
  const github = req.body.github || null;
  const linkedin = req.body.linkedin || null;
  const portfolio = req.body.portfolio || null;
  const projectsExperience = req.body.projectsExperience || req.body.projects_experience || null;
  const whyJoinSSC = req.body.whyJoinSSC || req.body.why_join_ssc || null;

  if (process.env.NODE_ENV !== 'production') {
    console.debug('[Internship Apply] payload:', {
      registrationId,
      fullName,
      email,
      phone,
      location,
      college,
      degree,
      graduationYear,
      applyingFor,
      internshipType,
      github,
      linkedin,
      portfolio,
      projectsExperience,
      whyJoinSSC,
    });
  }

  const errors = [];
  if (!registrationId) errors.push('registrationId is required');
  if (!fullName) errors.push('fullName is required');
  if (!email) errors.push('email is required');
  if (!phone) errors.push('phone is required');
  if (!location) errors.push('location is required');
  if (!college) errors.push('college is required');
  if (!degree) errors.push('degree is required');
  if (!graduationYear) errors.push('graduationYear is required');
  if (!applyingFor) errors.push('applyingFor is required');
  if (!internshipType) errors.push('internshipType is required');
  if (!projectsExperience) errors.push('projectsExperience is required');
  if (!whyJoinSSC) errors.push('whyJoinSSC is required');
  if (applyingFor && !TRACKS.includes(applyingFor)) {
    errors.push(`applyingFor must be one of: ${TRACKS.join(', ')}`);
  }
  if (internshipTrack && !TRACKS.includes(internshipTrack)) {
    errors.push(`internshipTrack must be one of: ${TRACKS.join(', ')}`);
  }
  if (internshipTrack && !applyingFor) {
    errors.push('applyingFor is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  const user = await User.findOne({ where: { registrationId } });
  if (!user) {
    return res.status(404).json({ success: false, error: 'Invalid registration ID', message: 'No user found with this registration ID' });
  }

  const studentProfile = await StudentProfile.findOne({ where: { userId: user.id } });
  if (!studentProfile) {
    return res.status(404).json({ success: false, error: 'Student profile not found', message: 'No student found for this user' });
  }

  if (studentProfile.email && studentProfile.email !== email) {
    return res.status(403).json({
      success: false,
      error: 'Email mismatch',
      message: 'Email does not match registration ID',
    });
  }

  const applicationId = `SSC-INT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const application = await InternshipApplication.create({
    applicationId,
    studentProfileId: studentProfile.id,
    userId: user.id,
    registrationId,
    fullName,
    email,
    phone,
    location,
    college,
    degree,
    graduationYear,
    applyingFor,
    internshipType,
    internshipTrack,
    github,
    linkedin,
    portfolio,
    projectsExperience,
    whyJoinSSC,
    status: 'APPLIED',
  });

  try {
    studentProfile.internshipStatus = 'APPLIED';
    await studentProfile.save();
  } catch (e) {
    console.warn('Failed to update studentProfile internshipStatus:', e && e.message ? e.message : e);
  }

  await sendCareerApplicationEmail({
    registrationId,
    fullName,
    email,
    phone,
    location,
    college,
    degree,
    graduationYear,
    applyingFor,
    internshipType,
    github,
    linkedin,
    portfolio,
    projectsExperience,
    whyJoinSSC,
  });

  return res.status(201).json({
    success: true,
    applicationId: application.applicationId,
    message: 'Internship application submitted successfully',
  });
});

exports.getStatus = catchAsync(async (req, res) => {
  const application = await InternshipApplication.findOne({ where: { applicationId: req.params.applicationId } });
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found', errors: [] });
  }
  return res.status(200).json({ success: true, data: { applicationId: application.applicationId, status: application.status, remarks: application.remarks } });
});
