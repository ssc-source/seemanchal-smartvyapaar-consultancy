const db = require('../config/database');

/**
 * Generate unique registration ID in format: SSC/YEAR/I-361
 * Counter starts at 361, increments for each new user
 * Resets to 361 when year changes
 * @returns {Promise<string>} Registration ID (e.g., SSC/2026/I-361)
 */
async function generateRegistrationId() {
  const year = new Date().getFullYear();

  await db.query('START TRANSACTION');

  try {
    const [rows] = await db.query(
      'SELECT current_count, year FROM registration_counter WHERE id = 1 FOR UPDATE',
      { type: db.QueryTypes.SELECT }
    );

    const counterData = Array.isArray(rows) ? rows[0] : rows;
    if (!counterData) {
      throw new Error('Registration counter not initialized');
    }

    let currentCount = Number(counterData.current_count || 0);
    const counterYear = Number(counterData.year || 0);

    if (counterYear !== year) {
      currentCount = 360;
      await db.query(
        'UPDATE registration_counter SET current_count = 360, year = ? WHERE id = 1',
        { replacements: [year] }
      );
    }

    const newCount = currentCount + 1;
    await db.query(
      'UPDATE registration_counter SET current_count = ? WHERE id = 1',
      { replacements: [newCount] }
    );

    await db.query('COMMIT');

    return `SSC/${year}/I-${newCount}`;
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}

module.exports = { generateRegistrationId };
