const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const setupFeesTable = async () => {
    try {
        console.log('Creating fees table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS fee_structure (
                id SERIAL PRIMARY KEY,
                class_name VARCHAR(50) UNIQUE NOT NULL,
                admission_fees NUMERIC(10, 2) DEFAULT 0,
                quarterly_fees NUMERIC(10, 2) DEFAULT 0,
                half_yearly_fees NUMERIC(10, 2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Seed some data if empty
        const count = await pool.query('SELECT COUNT(*) FROM fee_structure');
        if (parseInt(count.rows[0].count) === 0) {
            console.log('Seeding initial fee structure...');
            const values = [
                ['Class 1', 5000, 4000, 8000],
                ['Class 2', 5000, 4000, 8000],
                ['Class 3', 5500, 4500, 9000],
                ['Class 4', 5500, 4500, 9000],
                ['Class 5', 6000, 5000, 10000],
                ['Class 6', 6000, 5000, 10000],
                ['Class 7', 6500, 5500, 11000],
                ['Class 10', 8000, 7000, 14000]
            ];

            for (const [cls, adm, qr, hy] of values) {
                await pool.query(
                    'INSERT INTO fee_structure (class_name, admission_fees, quarterly_fees, half_yearly_fees) VALUES ($1, $2, $3, $4)',
                    [cls, adm, qr, hy]
                );
            }
        }

        console.log('Fees table setup completed successfully!');
    } catch (err) {
        console.error('Setup error:', err);
    } finally {
        await pool.end();
    }
};

setupFeesTable();
