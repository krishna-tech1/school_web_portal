const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const check = async () => {
    try {
        console.log('--- Checking staff table ---');
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'staff'");
        console.log('Columns found:', res.rows.map(r => r.column_name));
        
        console.log('--- Adding column ---');
        await pool.query("ALTER TABLE staff ADD COLUMN IF NOT EXISTS staff_type VARCHAR(20) DEFAULT 'Teaching'");
        
        console.log('--- Checking again ---');
        const res2 = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'staff'");
        console.log('Columns found:', res2.rows.map(r => r.column_name));
    } catch (err) {
        console.error('Error during check:', err);
    } finally {
        await pool.end();
    }
};

check();
