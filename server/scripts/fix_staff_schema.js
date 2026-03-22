const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixSchema() {
  try {
    // Check if columns exist
    const check = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'staff' AND column_name IN ('class_teacher', 'subjects')
    `);
    
    if (check.rows.length < 2) {
      console.log('Columns missing. Adding them...');
      await pool.query('ALTER TABLE staff ADD COLUMN IF NOT EXISTS class_teacher TEXT;');
      await pool.query('ALTER TABLE staff ADD COLUMN IF NOT EXISTS subjects TEXT;');
      console.log('Schema fixed successfully.');
    } else {
      console.log('Columns already exist:', check.rows.map(r => r.column_name));
    }
  } catch (err) {
    console.error('Schema fix error:', err.message);
  } finally {
    await pool.end();
  }
}

fixSchema();
