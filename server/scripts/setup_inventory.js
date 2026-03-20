const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const setupInventory = async () => {
    try {
        console.log('Creating inventory table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS inventory (
                id SERIAL PRIMARY KEY,
                item_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                category VARCHAR(50) NOT NULL,
                quantity INTEGER DEFAULT 0,
                min_quantity INTEGER DEFAULT 10,
                unit VARCHAR(20) DEFAULT 'Pieces',
                location VARCHAR(100),
                status VARCHAR(20) DEFAULT 'In Stock',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('Seeding initial inventory data...');
        const initialItems = [
            ['INV001', 'A4 Paper Ream', 'Stationery', 150, 50, 'Reams', 'Store Room A', 'In Stock'],
            ['INV002', 'Whiteboard Markers', 'Stationery', 25, 30, 'Boxes', 'Store Room A', 'Low Stock'],
            ['INV003', 'Football', 'Sports Equipment', 8, 10, 'Pieces', 'Sports Room', 'Low Stock'],
            ['INV004', 'Chemistry Lab Beakers', 'Lab Equipment', 45, 20, 'Pieces', 'Chemistry Lab', 'In Stock'],
            ['INV005', 'Student Desks', 'Furniture', 0, 5, 'Pieces', 'Warehouse', 'Out of Stock']
        ];

        for (const item of initialItems) {
            await pool.query(`
                INSERT INTO inventory (item_id, name, category, quantity, min_quantity, unit, location, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (item_id) DO NOTHING
            `, item);
        }

        console.log('Inventory setup complete!');
    } catch (err) {
        console.error('Setup error:', err);
    } finally {
        await pool.end();
    }
};

setupInventory();
