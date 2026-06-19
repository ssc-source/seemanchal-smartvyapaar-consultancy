const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const csv = require('csv-parser');
const { sequelize, User, StudentProfile } = require('../models');
const { generateRegistrationId } = require('../utils/generateRegistrationId');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const IMPORT_DIR = path.join(process.cwd(), 'uploads', 'imports');

const ensureImportDir = () => {
  if (!fs.existsSync(path.join(process.cwd(), 'uploads'))) fs.mkdirSync(path.join(process.cwd(), 'uploads'));
  if (!fs.existsSync(IMPORT_DIR)) fs.mkdirSync(IMPORT_DIR, { recursive: true });
};

exports.importUsersFromCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No CSV file uploaded' });

    ensureImportDir();

    const csvPath = req.file.path;
    const imported = [];
    const failed = [];
    let totalRows = 0;

    await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(csvPath).pipe(csv({ mapHeaders: ({ header }) => header.trim() }));

      stream.on('data', async (row) => {
        // Pause the stream while processing this row
        stream.pause();
        totalRows += 1;
        const name = (row.name || row.Name || '').trim();
        const email = (row.email || row.Email || '').trim();
        const phone = (row.phone || row.Phone || '').trim();
        const dob = (row.dob || row.DOB || row.DOB || '').trim() || null;
        const college = (row.college || row.College || '').trim() || null;
        const course = (row.course || row.Course || '').trim() || null;

        if (!name || !email) {
          failed.push({ row: totalRows, error: 'Name and email required' });
          stream.resume();
          return;
        }

        try {
          const registrationId = await generateRegistrationId();
          const tempPassword = registrationId;
          const passwordHash = bcrypt.hashSync(tempPassword, 10);

          const user = await User.create({ name, email, passwordHash, role: 'student', status: 'ACTIVE' });

          try {
            await sequelize.query('UPDATE users SET must_change_password = TRUE WHERE id = ?', { replacements: [user.id] });
          } catch (e) {
            // ignore if column missing
          }

          const studentProfile = await StudentProfile.create({
            userId: user.id,
            name,
            email,
            phone,
            dob: dob || null,
            college: college || null,
            track: course?.trim() || null,
            internshipStatus: 'NOT_STARTED',
            registrationId: registrationId,
          });

          // Update users.registration_id
          try {
            await sequelize.query('UPDATE users SET registration_id = ? WHERE id = ?', { replacements: [registrationId, user.id] });
          } catch (e) {
            // ignore
          }

          // Send credentials email (best effort)
          try {
            const from = process.env.EMAIL_FROM || 'SSC <contact@seemanchalsmartvyapaar.com>';
            await resend.emails.send({
              from,
              to: email,
              subject: `Your SSC Account - Registration ID: ${registrationId}`,
              html: `<p>Hi ${name},</p><p>Your account has been created. Login with:</p><p><strong>Email:</strong> ${email}</p><p><strong>Temporary Password:</strong> ${registrationId}</p><p>Please change your password on first login.</p>`
            });
          } catch (e) {
            console.warn('Failed to send email to', email, e && e.message ? e.message : e);
          }

          imported.push({ row: totalRows, name, email, registrationId });
        } catch (err) {
          failed.push({ row: totalRows, error: err && err.message ? err.message : String(err) });
        } finally {
          stream.resume();
        }
      });

      stream.on('end', () => resolve());
      stream.on('error', (err) => reject(err));
    });

    const summary = { success: true, total: totalRows, imported: imported.length, failed: failed.length, importedUsers: imported, failedRows: failed, timestamp: new Date().toISOString() };

    const outPath = path.join(IMPORT_DIR, `import_${Date.now()}.json`);
    fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));

    return res.json(summary);
  } catch (error) {
    console.error('CSV import error:', error && error.message ? error.message : error);
    return res.status(500).json({ success: false, message: error && error.message ? error.message : String(error) });
  }
};

exports.listImports = async (req, res) => {
  try {
    ensureImportDir();
    const files = fs.readdirSync(IMPORT_DIR).filter((f) => f.endsWith('.json')).sort().reverse();
    const summaries = files.slice(0, 20).map((f) => {
      try {
        const content = fs.readFileSync(path.join(IMPORT_DIR, f), 'utf-8');
        return JSON.parse(content);
      } catch (e) {
        return { file: f, error: e.message };
      }
    });
    return res.json({ success: true, data: summaries });
  } catch (error) {
    console.error('List imports error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
