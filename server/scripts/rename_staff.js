const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const staffNames = [
    { first: 'Abhishek', last: 'Sharma' },
    { first: 'Suresh', last: 'Raina' },
    { first: 'Mahendra', last: 'Dhoni' },
    { first: 'Virat', last: 'Kohli' },
    { first: 'Rohit', last: 'Sharma' },
    { first: 'K.L.', last: 'Rahul' },
    { first: 'Hardik', last: 'Pandya' },
    { first: 'Jasprit', last: 'Bumrah' },
    { first: 'Ravindra', last: 'Jadeja' },
    { first: 'Ravichandran', last: 'Ashwin' },
    { first: 'Anjali', last: 'Mehta' },
    { first: 'Neha', last: 'Desai' },
    { first: 'Pooja', last: 'Patel' },
    { first: 'Deepika', last: 'Padukone' },
    { first: 'Priyanka', last: 'Chopra' }
];

const renameStaff = async () => {
    try {
        console.log('Connecting to database...');
        const result = await pool.query('SELECT id FROM staff ORDER BY id ASC');
        const ids = result.rows;

        console.log(`Found ${ids.length} staff members. Renaming...`);
        for (let i = 0; i < ids.length; i++) {
            const name = staffNames[i % staffNames.length];
            await pool.query(
                'UPDATE staff SET "firstName" = $1, "lastName" = $2 WHERE id = $3',
                [name.first, name.last, ids[i].id]
            );
        }
        console.log('Successfully updated staff names!');
    } catch (err) {
        console.error('Update error:', err);
    } finally {
        await pool.end();
    }
};

renameStaff();
