const { sequelize } = require('../models');
const { User, StudentProfile } = require('../models');
const { Op } = require('sequelize');

async function backfillUsersRegistrationId() {
  console.log('Starting backfill of users.registration_id...');
  try {
    const studentProfiles = await StudentProfile.findAll({
      where: { registrationId: { [Op.ne]: null } },
      attributes: ['email', 'registrationId'],
    });

    console.log(`Found ${studentProfiles.length} student profiles with registration_id`);
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const profile of studentProfiles) {
      try {
        const email = String(profile.email || '').trim().toLowerCase();
        if (!email) {
          errors++;
          console.warn('Skipping profile with empty email', profile.toJSON());
          continue;
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
          errors++;
          console.warn('No user found for student profile email', email);
          continue;
        }

        if (user.registrationId) {
          skipped++;
          continue;
        }

        await sequelize.query('UPDATE users SET registration_id = ? WHERE id = ?', {
          replacements: [profile.registrationId, user.id],
        });
        updated++;
        console.log(`✓ Updated user ${user.id} (${email}) with registration_id ${profile.registrationId}`);
      } catch (err) {
        errors++;
        console.error(`✗ Error updating registration_id for profile ${profile.email}:`, err.message);
      }
    }

    console.log('\n=== Backfill Summary ===');
    console.log(`Updated: ${updated}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log('Backfill complete!');
    process.exit(0);
  } catch (error) {
    console.error('Backfill failed:', error);
    process.exit(1);
  }
}

backfillUsersRegistrationId();
