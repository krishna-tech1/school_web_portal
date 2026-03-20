const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const seedMissing = async () => {
    try {
        console.log('Seeding missing class fees...');
        const values = [
            ['Class 8', 7000, 6000, 12000],
            ['Class 9', 7500, 6500, 13000],
            ['Class 11', 8500, 7500, 15000],
            ['Class 12', 9000, 8000, 16000]
        ];

        for (const [cls, adm, qr, hy] of values) {
            await pool.query(
                `INSERT INTO fee_structure (class_name, admission_fees, quarterly_fees, half_yearly_fees) 
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (class_name) DO NOTHING`,
                [cls, adm, qr, hy]
            );
        }
        console.log('Successfully seeded missing classes!');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await pool.end();
    }
};

seedMissing();
