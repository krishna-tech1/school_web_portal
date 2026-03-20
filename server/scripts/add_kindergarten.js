const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const addKindergarten = async () => {
    try {
        console.log('Seeding LKG and UKG fees...');
        const values = [
            ['LKG', 4000, 3500, 7000],
            ['UKG', 4000, 3500, 7000]
        ];

        for (const [cls, adm, qr, hy] of values) {
            await pool.query(
                `INSERT INTO fee_structure (class_name, admission_fees, quarterly_fees, half_yearly_fees) 
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (class_name) DO NOTHING`,
                [cls, adm, qr, hy]
            );
        }
        console.log('Successfully added LKG and UKG to fee structure!');
    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await pool.end();
    }
};

addKindergarten();
