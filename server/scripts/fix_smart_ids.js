const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const fixIdsToSmartIds = async () => {
    try {
        console.log('Fetching staff records...');
        const result = await pool.query('SELECT id FROM staff ORDER BY id ASC');
        const rows = result.rows;

        console.log(`Updating ${rows.length} records to Smart ID format (STF-XXXXXX)...`);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const smartId = `STF-${Math.floor(100000 + Math.random() * 900000)}`;

            await pool.query(
                'UPDATE staff SET "staffId" = $1, "employeeId" = $1 WHERE id = $2',
                [smartId, row.id]
            );
        }
        console.log('Successfully updated all Staff IDs to professional Smart ID format!');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await pool.end();
    }
};

fixIdsToSmartIds();
