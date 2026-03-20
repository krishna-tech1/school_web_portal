const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const setupStudents = async () => {
    try {
        console.log('Ensuring students table exists...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                "studentId" VARCHAR(50) UNIQUE NOT NULL,
                "firstName" VARCHAR(50) NOT NULL,
                "lastName" VARCHAR(50) NOT NULL,
                "dateOfBirth" DATE,
                gender VARCHAR(10),
                address TEXT,
                class VARCHAR(20),
                section VARCHAR(10),
                "rollNumber" VARCHAR(20),
                "guardianName" VARCHAR(100),
                relation VARCHAR(20),
                "guardianPhone" VARCHAR(20),
                email VARCHAR(100),
                status VARCHAR(20) DEFAULT 'Active',
                "admissionDate" DATE DEFAULT CURRENT_DATE,
                "feeStatus" VARCHAR(20) DEFAULT 'Pending',
                "pendingFee" NUMERIC(10, 2) DEFAULT 0,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Students table is ready.');
    } catch (err) {
        console.error('Setup error:', err);
    } finally {
        await pool.end();
    }
};

setupStudents();
