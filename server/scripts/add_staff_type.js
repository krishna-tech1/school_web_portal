const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const addStaffType = async () => {
    try {
        console.log('Adding staff_type column to staff table...');
        await pool.query(`
            ALTER TABLE staff ADD COLUMN IF NOT EXISTS staff_type VARCHAR(20) DEFAULT 'Teaching';
        `);
        
        console.log('Setting default types based on department...');
        // Academic department -> Teaching, others -> Non-Teaching
        await pool.query(`
            UPDATE staff SET staff_type = 'Teaching' WHERE department ILIKE '%Academic%';
        `);
        await pool.query(`
            UPDATE staff SET staff_type = 'Non-Teaching' WHERE department NOT ILIKE '%Academic%';
        `);

        console.log('Successfully updated staff table structure!');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await pool.end();
    }
};

addStaffType();
