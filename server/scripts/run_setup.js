const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const run = async () => {
    try {
        await require('./setup_db');
    } catch(err) {
        fs.writeFileSync('error.json', JSON.stringify({error: err.message, stack: err.stack}));
    } finally {
        process.exit();
    }
}
run();
