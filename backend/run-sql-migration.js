const mysql = require('mysql2/promise');
const fs = require('fs');

(async () => {
  const sql = fs.readFileSync('..\\migrations\\add-registration-id-schema.sql', 'utf8');
  const conn = await mysql.createConnection({
    host: 'srv2052.hstgr.io',
    port: 3306,
    user: 'u524636674_sscwebdb_user',
    password: 'x5E@v?SUfCi',
    database: 'u524636674_sscwebdb',
    multipleStatements: true,
  });

  try {
    await conn.query(sql);
    console.log('Migration executed successfully');
  } catch (error) {
    console.error('Migration error:', error.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
})();
