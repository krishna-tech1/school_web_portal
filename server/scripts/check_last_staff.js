const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkLastStaff() {
  try {
    const result = await pool.query('SELECT "firstName", "lastName", class_teacher, subjects FROM staff ORDER BY id DESC LIMIT 5');
    console.log('--- Last 5 Staff Members ---');
    if (result.rows.length === 0) {
      console.log('No staff records found in the table.');
    } else {
      result.rows.forEach((row, i) => {
        console.log(`[${i+1}] Name: ${row.firstName} ${row.lastName}`);
        console.log(`    Class Teacher: "${row.class_teacher}"`);
        console.log(`    Subjects: "${row.subjects}"`);
      });
    }
  } catch (err) {
    console.error('Error executing query:', err.message);
  } finally {
    await pool.end();
  }
}

checkLastStaff();
