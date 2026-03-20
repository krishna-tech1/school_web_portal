const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const fixIds = async () => {
    try {
        console.log('Fetching staff records...');
        const result = await pool.query('SELECT id, "staffId", "employeeId" FROM staff ORDER BY id ASC');
        const rows = result.rows;

        console.log(`Processing ${rows.length} records...`);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            let newId = row.staffId || row.employeeId;

            // If it's just a number (like "15"), or empty, make it STF00X
            if (!newId || /^\d+$/.test(newId)) {
                newId = `STF${String(row.id).padStart(3, '0')}`;
            } 
            // If it's the long timestamp one, we can leave it or convert it to STF00X too for sequence
            // Let's make them all STF00X for perfect visual sequence if that's what user prefers?
            // "STF001", "STF002", etc. is much cleaner than the long timestamp.
            
            // To be safe and clean, let's normalize everything to STF + sequential ID
            const normalizedId = `STF${String(row.id).padStart(3, '0')}`;

            await pool.query(
                'UPDATE staff SET "staffId" = $1, "employeeId" = $1 WHERE id = $2',
                [normalizedId, row.id]
            );
        }
        console.log('Successfully normalized all Staff IDs!');
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await pool.end();
    }
};

fixIds();
