const { sequelize, User, StudentProfile } = require('../models');
const { generateRegistrationId } = require('../utils/generateRegistrationId');
const authUtils = require('../utils/auth');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.addUserManual = async (req, res) => {
  const { name, email, phone, dob, college, course } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required', message: 'Please provide name and email' });
  }

  const t = await sequelize.transaction();
  try {
    const registrationId = await generateRegistrationId();

    const tempPassword = registrationId;
    const passwordHash = await authUtils.hashPassword(tempPassword);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'student',
      status: 'ACTIVE',
    }, { transaction: t });

    // set must_change_password = TRUE
    try {
      await sequelize.query('UPDATE users SET must_change_password = TRUE WHERE id = ?', {
        replacements: [user.id],
        transaction: t,
      });
    } catch (e) {
      // ignore if column missing
    }

    const studentProfile = await StudentProfile.create({
      userId: user.id,
      name,
      email,
      phone: phone || null,
      dob: dob || null,
      college: college || null,
      track: course?.trim() || null,
      internshipStatus: 'NOT_STARTED',
      registrationId,
    }, { transaction: t });

    // Set users.registration_id
    try {
      await sequelize.query('UPDATE users SET registration_id = ? WHERE id = ?', {
        replacements: [registrationId, user.id],
        transaction: t,
      });
    } catch (e) {
      // ignore
    }

    await t.commit();

    // Send credentials email to student (best-effort)
    try {
      const from = process.env.EMAIL_FROM || 'SSC <contact@seemanchalsmartvyapaar.com>';
      await resend.emails.send({
        from,
        to: email,
        subject: `Your SSC Account - Registration ID: ${registrationId}`,
        html: `<h1>Welcome to SSC Internship Program</h1>
               <p>Your account has been created successfully.</p>
               <h2>Your Login Credentials:</h2>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Temporary Password:</strong> <code>${registrationId}</code></p>
               <p><strong>Registration ID:</strong> <code>${registrationId}</code></p>
               <h3>Important:</h3>
               <p>⚠️ You must change your password on first login.</p>
               <p><a href="http://localhost:3000/login">Login Here</a></p>`
      });
    } catch (e) {
      console.warn('Failed to send credentials email to', email, e && e.message ? e.message : e);
    }

    return res.json({ success: true, userId: user.id, registrationId, message: 'User created successfully' });
  } catch (error) {
    await t.rollback();
    console.error('Manual user add error:', error);
    return res.status(500).json({ error: 'Failed to create user', message: error.message });
  }
};

module.exports = { addUserManual: exports.addUserManual };
