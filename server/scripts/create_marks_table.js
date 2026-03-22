const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createMarksTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_marks (
        id SERIAL PRIMARY KEY,
        "studentId" TEXT NOT NULL,
        class TEXT NOT NULL,
        section TEXT NOT NULL,
        subject TEXT NOT NULL,
        exam_type TEXT NOT NULL, -- 'U1', 'U2', 'U3', etc.
        marks TEXT,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE ("studentId", subject, exam_type)
      );
    `);
    console.log('student_marks table created successfully');
  } catch (err) {
    console.error('Error creating table:', err.message);
  } finally {
    await pool.end();
  }
}

createMarksTable();
