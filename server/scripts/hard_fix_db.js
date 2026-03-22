const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function renameAndFix() {
  try {
    console.log('--- DB HARD FIX: RENAMING SUBJS COLUMN ---');
    // Ensure both columns exist (old and new)
    await pool.query('ALTER TABLE staff ADD COLUMN IF NOT EXISTS "subjects_list" TEXT;');
    await pool.query('ALTER TABLE staff ADD COLUMN IF NOT EXISTS "class_teacher" TEXT;');
    
    // Copy data from old 'subjects' or 'staff_subjects' if exists
    // (This is just a safety measure)
    await pool.query('UPDATE staff SET "subjects_list" = subjects WHERE "subjects_list" IS NULL AND subjects IS NOT NULL;');
    
    console.log('--- DB FIX DONE ---');
  } catch (err) {
    console.error('Schema fix error:', err.message);
  } finally {
    await pool.end();
  }
}

renameAndFix();
