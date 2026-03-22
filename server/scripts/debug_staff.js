const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function debugStaff() {
  try {
    const result = await pool.query('SELECT firstName, lastName, class_teacher, subjects FROM staff ORDER BY id DESC LIMIT 3');
    result.rows.forEach((row, i) => {
      console.log(`[${i}] ${row.firstName} ${row.lastName}:`);
      console.log(`    Class: ${row.class_teacher}`);
      console.log(`    Subjects Type: ${typeof row.subjects}`);
      console.log(`    Subjects Value: ${JSON.stringify(row.subjects)}`);
    });
  } catch (err) {
    console.error('Debug Error:', err.message);
  } finally {
    await pool.end();
  }
}

debugStaff();
