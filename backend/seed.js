const fs = require('fs');
const path = require('path');
const sequelize = require('./config/database');

const direction = process.argv[2] === 'down' ? 'down' : 'up';
const seedsPath = path.join(__dirname, 'seeders');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    const files = fs
      .readdirSync(seedsPath)
      .filter((file) => file.endsWith('.js'))
      .sort();

    if (direction === 'down') {
      files.reverse();
    }

    for (const file of files) {
      const seed = require(path.join(seedsPath, file));
      console.log(`${direction === 'up' ? 'Applying' : 'Reverting'} ${file}`);
      if (direction === 'up' && typeof seed.up === 'function') {
        await seed.up();
      }
      if (direction === 'down' && typeof seed.down === 'function') {
        await seed.down();
      }
    }

    console.log(`Seed ${direction} complete.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed execution failed:', error);
    process.exit(1);
  }
}

run();