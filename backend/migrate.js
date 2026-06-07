const fs = require('fs');
const path = require('path');
const sequelize = require('./config/database');
const { Sequelize } = require('sequelize');

const direction = process.argv[2] === 'down' ? 'down' : 'up';
const migrationsPath = path.join(__dirname, 'migrations');

async function ensureMigrationTable() {
  await sequelize.getQueryInterface().createTable('sequelize_meta', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }).catch((error) => {
    if (error.original?.code !== 'ER_TABLE_EXISTS_ERROR') {
      throw error;
    }
  });
}

async function getAppliedMigrations() {
  const [rows] = await sequelize.query('SELECT name FROM sequelize_meta');
  return new Set(rows.map((row) => row.name));
}

async function markApplied(name) {
  await sequelize.query('INSERT IGNORE INTO sequelize_meta (name) VALUES (?)', {
    replacements: [name],
  });
}

async function markReverted(name) {
  await sequelize.query('DELETE FROM sequelize_meta WHERE name = ?', {
    replacements: [name],
  });
}

async function tableExists(tableName) {
  const tables = await sequelize.getQueryInterface().showAllTables();
  return tables.includes(tableName);
}

async function baselineExistingPhaseOne(files, applied) {
  if (applied.size > 0 || !(await tableExists('content_pages'))) return;

  const baselineFiles = files.filter((file) => file.startsWith('20260605-'));
  for (const file of baselineFiles) {
    await markApplied(file);
    applied.add(file);
    console.log(`Baselined existing migration ${file}`);
  }
}

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await ensureMigrationTable();

    const files = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith('.js'))
      .sort();

    if (direction === 'down') {
      files.reverse();
    }

    const applied = await getAppliedMigrations();
    if (direction === 'up') {
      await baselineExistingPhaseOne(files, applied);
    }

    for (const file of files) {
      const migration = require(path.join(migrationsPath, file));
      if (direction === 'up' && typeof migration.up === 'function') {
        if (applied.has(file)) {
          console.log(`Skipping already applied ${file}`);
          continue;
        }
        console.log(`Applying ${file}`);
        await migration.up(sequelize.getQueryInterface(), Sequelize);
        await markApplied(file);
      }
      if (direction === 'down' && typeof migration.down === 'function') {
        if (!applied.has(file)) {
          console.log(`Skipping unapplied ${file}`);
          continue;
        }
        console.log(`Reverting ${file}`);
        await migration.down(sequelize.getQueryInterface(), Sequelize);
        await markReverted(file);
      }
    }

    console.log(`Migration ${direction} complete.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
