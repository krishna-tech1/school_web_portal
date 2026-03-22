const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkColumns() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'staff'
    `);
    console.log('--- Columns in staff table ---');
    result.rows.forEach(row => {
      console.log(`Column: ${row.column_name} (${row.data_type})`);
    });
  } catch (err) {
    console.error('Error execution:', err.message);
  } finally {
    await pool.end();
  }
}

checkColumns();
