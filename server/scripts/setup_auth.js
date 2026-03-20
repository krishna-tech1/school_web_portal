const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const setupAuth = async () => {
    try {
        console.log('Setting up Auth Database...');
        
        await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);
        
        await pool.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(150) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Hashing passwords and inserting users...');

        const usersToCreate = [
            { email: 'admin@school.in', password: 'admin2026@', name: 'Primary Admin', role: 'Administrator' },
            { email: 'xan@admin.in', password: 'xan2026@', name: 'Xan Admin', role: 'Administrator' },
            { email: 'xan@school.in', password: 'XAN2026', name: 'Xan School Admin', role: 'Administrator' },
            { email: 'teacher@school.in', password: 'teacher2026@', name: 'Teacher Manager', role: 'TeacherManager' },
            { email: 'student@school.in', password: 'student2026@', name: 'Student Manager', role: 'StudentManager' },
            { email: 'fee@school.in', password: 'fee2026@', name: 'Fee Manager', role: 'FeeManager' },
            { email: 'inventory@school.in', password: 'inventory2026@', name: 'Inventory Manager', role: 'InventoryManager' }
        ];

        for (const user of usersToCreate) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            
            await pool.query(`
                INSERT INTO users (name, email, password, role)
                VALUES ($1, $2, $3, $4)
            `, [user.name, user.email, hashedPassword, user.role]);
        }

        console.log('Secure users table populated successfully!');
    } catch (err) {
        console.error('Error in auth setup:', err);
    } finally {
        pool.end();
    }
};

setupAuth();
