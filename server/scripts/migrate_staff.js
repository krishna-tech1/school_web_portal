const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const migrateStaff = async () => {
  try {
    console.log('Connecting to database...');
    console.log('Using URL:', process.env.DATABASE_URL ? 'URL Found' : 'URL NOT FOUND');
    
    console.log('Adding missing columns to staff table...');
    const query = `
      ALTER TABLE staff 
      ADD COLUMN IF NOT EXISTS dob DATE,
      ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS state VARCHAR(100),
      ADD COLUMN IF NOT EXISTS "zipCode" VARCHAR(20),
      ADD COLUMN IF NOT EXISTS "joiningDate" DATE,
      ADD COLUMN IF NOT EXISTS designation VARCHAR(100),
      ADD COLUMN IF NOT EXISTS "employeeId" VARCHAR(50),
      ADD COLUMN IF NOT EXISTS qualification TEXT,
      ADD COLUMN IF NOT EXISTS experience TEXT,
      ADD COLUMN IF NOT EXISTS salary VARCHAR(50);
    `;
    await pool.query(query);
    console.log('Staff table schema updated successfully!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
};

migrateStaff();
