const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function rawDebug() {
  try {
    const result = await pool.query('SELECT * FROM staff ORDER BY id DESC LIMIT 1');
    const row = result.rows[0];
    console.log('--- LATEST STAFF RECORD ---');
    if (!row) {
      console.log('No staff records found.');
      return;
    }
    Object.keys(row).forEach(key => {
      console.log(`${key}: ${JSON.stringify(row[key])}`);
    });
  } catch (err) {
    console.error('SQL Error:', err.message);
  } finally {
    await pool.end();
  }
}

rawDebug();
