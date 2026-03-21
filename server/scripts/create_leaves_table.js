const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createLeavesTable() {
    try {
        console.log('Creating staff_leaves table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS staff_leaves (
                id SERIAL PRIMARY KEY,
                "staffId" VARCHAR(50) NOT NULL,
                "leaveType" VARCHAR(50) NOT NULL,
                "startDate" DATE NOT NULL,
                "endDate" DATE NOT NULL,
                "reason" VARCHAR(75) NOT NULL,
                "status" VARCHAR(20) DEFAULT 'Pending',
                "appliedOn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Table created successfully!');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        await pool.end();
    }
}

createLeavesTable();
