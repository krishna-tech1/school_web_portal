const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTimetableTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS staff_timetables (
        id SERIAL PRIMARY KEY,
        "staffId" VARCHAR(50) NOT NULL,
        "day" VARCHAR(10) NOT NULL,
        "period1" JSONB,
        "period2" JSONB,
        "period3" JSONB,
        "period4" JSONB,
        "period5" JSONB,
        "period6" JSONB,
        "period7" JSONB,
        UNIQUE("staffId", "day")
      );
    `;
    await pool.query(query);
    console.log('✅ staff_timetables table created successfully.');
  } catch (err) {
    console.error('❌ Error creating staff_timetables table:', err);
  } finally {
    await pool.end();
  }
}

createTimetableTable();
