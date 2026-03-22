const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'school_staff',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});
const upload = multer({ storage: storage });

const db = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Startup migration to ensure staff_type exists
db.query("ALTER TABLE staff ADD COLUMN IF NOT EXISTS staff_type VARCHAR(20) DEFAULT 'Teaching'")
    .then(() => db.query("ALTER TABLE staff ADD COLUMN IF NOT EXISTS photo_url TEXT"))
    .then(() => db.query("ALTER TABLE staff ADD COLUMN IF NOT EXISTS class_teacher VARCHAR(20)"))
    .then(() => db.query("ALTER TABLE staff ADD COLUMN IF NOT EXISTS subjects TEXT"))
    .then(() => db.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS photo_url TEXT"))
    .then(() => console.log('✅ Database schema verified'))
    .catch(err => console.error('❌ Schema migration failed:', err));

// Logger for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Root route
app.get('/', (req, res) => {
    res.send('Hello from Node.js Server!');
});

// API Routes
const router = express.Router();

// Auth API
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password, loginType } = req.body;
        console.log(`[LOGIN] Attempting login for: ${email}`);
        
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            console.log(`[LOGIN] User not found: ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`[LOGIN] Password mismatch: ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isAdminTab = loginType === 'admin';
        const isUserAdmin = user.role === 'Administrator';

        if ((isAdminTab && !isUserAdmin) || (!isAdminTab && isUserAdmin)) {
            console.log(`[LOGIN] Tab mismatch: ${email}`);
            return res.status(403).json({ message: 'Invalid credentials for this login type' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('[LOGIN] Error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

router.post('/auth/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

router.get('/auth/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        
        const result = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Students API
router.get('/students', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM students ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching students' });
    }
});

// Get Single Student
router.get('/students/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const result = await db.query('SELECT * FROM students WHERE "studentId" = $1', [studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Fetch student error:', err);
        res.status(500).json({ message: 'Error fetching student' });
    }
});

// Create Student
router.post('/students', async (req, res) => {
    try {
        const { 
            firstName, lastName, dob, gender, address, 
            class: className, section, rollNumber, 
            parentName, relation, phoneNumber, email, photo_url 
        } = req.body;

        // Generate a unique timestamp-based Student ID
        const studentId = `STU${Date.now()}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;

        // Basic server-side length validation
        if (firstName?.length > 32 || lastName?.length > 32 || parentName?.length > 32 || phoneNumber?.length > 15 || email?.length > 50 || address?.length > 350) {
            return res.status(400).json({ message: 'Input fields exceed character limits.' });
        }

        const query = `
            INSERT INTO students (
                "studentId", "firstName", "lastName", "dateOfBirth", gender, address, 
                class, section, "rollNumber", "guardianName", relation, 
                "guardianPhone", email, "feeStatus", "pendingFee", photo_url, "admissionDate"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_DATE)
            RETURNING *
        `;

        const values = [
            studentId, firstName, lastName, dob || null, gender, address, 
            className, section, rollNumber, parentName, relation, 
            phoneNumber, email, 'Pending', 42000, photo_url
        ];

        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create student error:', err);
        res.status(500).json({ message: 'Error creating student' });
    }
});

// Update Student
router.put('/students/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { 
            firstName, lastName, dateOfBirth, gender, address, 
            class: className, section, rollNumber, 
            guardianName, relation, guardianPhone, email,
            feeStatus, pendingFee, photo_url
        } = req.body;

        // Basic server-side length validation
        if (firstName?.length > 32 || lastName?.length > 32 || guardianName?.length > 32 || guardianPhone?.length > 15 || email?.length > 50 || address?.length > 350) {
            return res.status(400).json({ message: 'Input fields exceed character limits.' });
        }

        const query = `
            UPDATE students 
            SET 
                "firstName" = $1, "lastName" = $2, "dateOfBirth" = $3, gender = $4, address = $5, 
                class = $6, section = $7, "rollNumber" = $8, "guardianName" = $9, relation = $10, 
                "guardianPhone" = $11, email = $12, "feeStatus" = $13, "pendingFee" = $14, photo_url = $15
            WHERE "studentId" = $16
            RETURNING *
        `;

        const values = [
            firstName, lastName, dateOfBirth, gender, address, 
            className, section, rollNumber, guardianName, relation, 
            guardianPhone, email, feeStatus, pendingFee, photo_url, studentId
        ];

        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update student error:', err);
        res.status(500).json({ message: 'Error updating student' });
    }
});

// Delete Student
router.delete('/students/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const result = await db.query('DELETE FROM students WHERE "studentId" = $1 RETURNING *', [studentId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Delete student error:', err);
        res.status(500).json({ message: 'Error deleting student' });
    }
});

// Promote Students
router.post('/students/promote', async (req, res) => {
    try {
        const { studentIds } = req.body;
        if (!studentIds || !studentIds.length) {
            return res.status(400).json({ message: 'No students selected' });
        }

        const classOrder = ['LKG', 'UKG', '1st Std', '2nd Std', '3rd Std', '4th Std', '5th Std', '6th Std', '7th Std', '8th Std', '9th Std', '10th Std', '11th Std', '12th Std', 'Graduated'];

        // We'll update students one by one or with a clever CASE statement.
        // For simplicity and correctness in a small class, let's fetch current classes first.
        const students = await db.query('SELECT "studentId", class FROM students WHERE "studentId" = ANY($1)', [studentIds]);
        
        const updates = students.rows.map(student => {
            const currentIndex = classOrder.indexOf(student.class);
            const nextClass = (currentIndex !== -1 && currentIndex < classOrder.length - 1) 
                ? classOrder[currentIndex + 1] 
                : 'Graduated';
                
            return db.query('UPDATE students SET class = $1 WHERE "studentId" = $2', [nextClass, student.studentId]);
        });

        await Promise.all(updates);
        res.json({ message: `Successfully promoted ${studentIds.length} students` });
    } catch (err) {
        console.error('Promotion error:', err);
        res.status(500).json({ message: 'Error promoting students' });
    }
});

// Staff API
router.get('/staff', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM staff ORDER BY id DESC');
        console.log('--- DEBUG: FETCHED ---', result.rows.length, 'records');
        if (result.rows.length > 0) {
            console.log('Record 0 keys:', Object.keys(result.rows[0]));
        }
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch staff error:', err);
        res.status(500).json({ message: 'Error fetching staff', error: err.message });
    }
});

// GET single staff
router.get('/staff/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let result;
        // Check if id is numeric (database PK) or string (staffId/employeeId)
        if (!isNaN(id)) {
            result = await db.query('SELECT * FROM staff WHERE id = $1', [parseInt(id)]);
        } else {
            result = await db.query('SELECT * FROM staff WHERE "staffId" = $1 OR "employeeId" = $1', [id]);
        }
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Fetch staff details error:', err);
        res.status(500).json({ message: 'Error fetching staff details' });
    }
});

// Upload Staff Photo
router.post('/staff/upload', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary Error:', err);
            return res.status(500).json({ message: 'Cloudinary upload failed: ' + err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({ url: req.file.path });
    });
});

// Upload Student Photo
router.post('/students/upload', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer/Cloudinary Error:', err);
            return res.status(500).json({ message: 'Cloudinary upload failed: ' + err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({ url: req.file.path });
    });
});

// Create Staff
router.post('/staff', async (req, res) => {
    try {
        const { 
            firstName, lastName, email, phone, dob, gender, address, city, state, zipCode, 
            employeeId, photo_url, classTeacher, subjects
        } = req.body;

        // Backend Mandatory Fields Validation
        if (!firstName || !lastName || !gender || !dob || !employeeId || !email || !classTeacher) {
            return res.status(400).json({ message: 'All mandatory fields (Names, Gender, DOB, Staff ID, Email, Class Teacher) must be filled.' });
        }
        
        // Ensure at least one subject entry
        let parsedSubjects = [];
        try {
            parsedSubjects = typeof subjects === 'string' ? JSON.parse(subjects) : subjects;
        } catch (e) {
            parsedSubjects = [];
        }

        if (!Array.isArray(parsedSubjects) || parsedSubjects.filter(s => s.class && s.subject).length === 0) {
            return res.status(400).json({ message: 'At least one subject with a class is required.' });
        }

        // Check for internal duplicate subjects (same class and subject)
        const subjSet = new Set();
        for (const s of parsedSubjects) {
            const key = `${s.class}-${s.subject}`.toLowerCase().trim();
            if (subjSet.has(key)) {
                return res.status(400).json({ message: `Duplicate subject info typed twice: ${s.class} - ${s.subject}` });
            }
            subjSet.add(key);
        }

        // Check Duplicate Staff ID and Class Teacher in DB (Ignore NONE)
        const duplicateCheck = await db.query(
            'SELECT "employeeId", class_teacher FROM staff WHERE LOWER("employeeId") = LOWER($1) OR (class_teacher = $2 AND class_teacher NOT IN (\'\', \'NONE\') AND class_teacher IS NOT NULL)',
            [employeeId, classTeacher]
        );

        if (duplicateCheck.rows.length > 0) {
            const dup = duplicateCheck.rows[0];
            if (dup.employeeId?.toLowerCase() === employeeId?.toLowerCase()) {
                return res.status(400).json({ message: `A teacher with ID ${employeeId} already exists.` });
            }
            if (dup.class_teacher === classTeacher) {
                return res.status(400).json({ message: `Class ${classTeacher} already has a designated Class Teacher.` });
            }
        }

        // Validation
        if (firstName?.length > 32 || lastName?.length > 32 || email?.length > 50 || phone?.length > 15 || address?.length > 350) {
            return res.status(400).json({ message: 'Input fields exceed character limits.' });
        }

        const query = `
            INSERT INTO staff (
                "firstName", "lastName", email, phone, dob, gender, address, city, state, "zipCode", 
                "employeeId", "staffId", staff_type, photo_url,
                class_teacher, "subjects_list"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
            RETURNING *
        `;
        // Generate a cleaner, unique Smart ID (STF-XXXXXX)
        const staffIdRaw = employeeId || `STF-${Math.floor(100000 + Math.random() * 900000)}`;
        // Normalize subjects (can be array or string)
        let normalizedSubjects = [];
        try {
            normalizedSubjects = typeof subjects === 'string' ? JSON.parse(subjects) : (Array.isArray(subjects) ? subjects : []);
        } catch (e) {
            normalizedSubjects = [];
        }

        const subjectsStr = JSON.stringify(normalizedSubjects.filter(s => s.class || s.subject));

        const values = [
            firstName, lastName, email, phone, dob || null, gender, address, city, state, zipCode, 
            employeeId, staffIdRaw, req.body.staffType || 'Teaching', photo_url,
            classTeacher, subjectsStr
        ];
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create staff error:', err);
        if (err.code === '23505') {
            if (err.constraint === 'staff_email_key') {
                return res.status(400).json({ message: 'Email address already exists. Please use a unique email.' });
            }
            if (err.constraint === 'staff_employeeId_key' || err.message.includes('employeeId')) {
                return res.status(400).json({ message: 'Employee ID already exists.' });
            }
        }
        res.status(500).json({ message: 'Error creating staff member' });
    }
});

// Update Staff
router.put('/staff/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            firstName, lastName, email, phone, dob, gender, address, city, state, zipCode, 
            employeeId, photo_url,
            classTeacher, subjects
        } = req.body;

        // Backend Mandatory Fields Validation
        if (!firstName || !lastName || !gender || !dob || !employeeId || !email || !classTeacher) {
            return res.status(400).json({ message: 'All mandatory fields (Names, Gender, DOB, Staff ID, Email, Class Teacher) must be filled.' });
        }
        
        // Ensure at least one subject entry
        let parsedSubjects = [];
        try {
            parsedSubjects = typeof subjects === 'string' ? JSON.parse(subjects) : subjects;
        } catch (e) {
            parsedSubjects = [];
        }

        if (!Array.isArray(parsedSubjects) || parsedSubjects.filter(s => s.class && s.subject).length === 0) {
            return res.status(400).json({ message: 'At least one subject with a class is required.' });
        }

        // Check for internal duplicate subjects
        const subjSet = new Set();
        for (const s of parsedSubjects) {
            const key = `${s.class}-${s.subject}`.toLowerCase().trim();
            if (subjSet.has(key)) {
                return res.status(400).json({ message: `Duplicate subject info typed twice: ${s.class} - ${s.subject}` });
            }
            subjSet.add(key);
        }

        // Check Duplicate Staff ID and Class Teacher in DB (excluding current id, ignore NONE for Class Teacher)
        const duplicateCheck = await db.query(
            'SELECT "employeeId", class_teacher FROM staff WHERE (LOWER("employeeId") = LOWER($1) OR (class_teacher = $2 AND class_teacher NOT IN (\'\', \'NONE\') AND class_teacher IS NOT NULL)) AND id != $3',
            [employeeId, classTeacher, id]
        );

        if (duplicateCheck.rows.length > 0) {
            const dup = duplicateCheck.rows[0];
            if (dup.employeeId?.toLowerCase() === employeeId?.toLowerCase()) {
                return res.status(400).json({ message: `A teacher with ID ${employeeId} already exists.` });
            }
            if (dup.class_teacher === classTeacher) {
                return res.status(400).json({ message: `Class ${classTeacher} already has a designated Class Teacher.` });
            }
        }

        // Length validation
        if (firstName?.length > 32 || lastName?.length > 32 || email?.length > 50 || phone?.length > 15 || address?.length > 350) {
            return res.status(400).json({ message: 'Input fields exceed character limits.' });
        }

        const query = `
            UPDATE staff SET 
                "firstName" = $1, "lastName" = $2, email = $3, phone = $4, dob = $5, gender = $6, 
                address = $7, city = $8, state = $9, "zipCode" = $10, 
                "employeeId" = $11, "staffId" = $12, 
                staff_type = $13, photo_url = $14, class_teacher = $15, "subjects_list" = $16
            WHERE id = $17 RETURNING *
        `;
        const subjectsStr = Array.isArray(parsedSubjects) ? JSON.stringify(parsedSubjects.filter(s => s.class || s.subject)) : '[]';
        const values = [
            firstName, lastName, email, phone, dob || null, gender, address, city, state, zipCode, 
            employeeId, staffIdRaw, req.body.staffType || 'Teaching', photo_url,
            classTeacher, subjectsStr, id
        ];
        
        console.log('--- FINAL SAVING: subjects_list length =', subjectsStr.length, '---');
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update staff error:', err);
        if (err.code === '23505') {
            if (err.constraint === 'staff_email_key') {
                return res.status(400).json({ message: 'Email address already exists. Please use a unique email.' });
            }
            if (err.constraint === 'staff_employeeId_key' || err.message.includes('employeeId')) {
                return res.status(400).json({ message: 'Employee ID already exists.' });
            }
        }
        res.status(500).json({ message: 'Error updating staff member' });
    }
});

// Delete Staff
router.delete('/staff/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM staff WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json({ message: 'Staff member deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting staff member' });
    }
});
// Startup migration for Fees
db.query(`
    CREATE TABLE IF NOT EXISTS class_fees (
        id SERIAL PRIMARY KEY,
        class_name VARCHAR(50) NOT NULL,
        fee_name VARCHAR(100) NOT NULL,
        amount NUMERIC(15, 2) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(class_name, fee_name)
    )
`).then(async () => {
    // Migration: Check if old table exists and has data
    try {
        const oldTable = await db.query("SELECT * FROM information_schema.tables WHERE table_name = 'fee_structure'");
        if (oldTable.rows.length > 0) {
            const oldData = await db.query("SELECT * FROM fee_structure");
            for (const row of oldData.rows) {
                if (row.admission_fees) await db.query("INSERT INTO class_fees (class_name, fee_name, amount) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [row.class_name, 'Admission Fees', row.admission_fees]);
                if (row.quarterly_fees) await db.query("INSERT INTO class_fees (class_name, fee_name, amount) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [row.class_name, 'Quarterly Fees', row.quarterly_fees]);
                if (row.half_yearly_fees) await db.query("INSERT INTO class_fees (class_name, fee_name, amount) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [row.class_name, 'Half-Yearly Fees', row.half_yearly_fees]);
            }
            console.log('✅ Fees migrated to new schema');
        }
    } catch (e) {
        console.log('Migration skipped or failed (maybe already done)');
    }
});

// Fee Structure APIs
router.get('/fees', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM class_fees ORDER BY class_name ASC, fee_name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch fees error:', err);
        res.status(500).json({ message: 'Error fetching fees' });
    }
});

router.post('/fees/bulk', async (req, res) => {
    const { feeName, updates } = req.body; // updates: [{ className: 'LKG', amount: 500 }, ...]
    
    if (!feeName || feeName.length > 25 || !updates || !Array.isArray(updates)) {
        return res.status(400).json({ message: 'Invalid bulk data or fee name too long' });
    }

    try {
        for (const update of updates) {
            const query = `
                INSERT INTO class_fees (class_name, fee_name, amount, updated_at)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                ON CONFLICT (class_name, fee_name) 
                DO UPDATE SET 
                    amount = EXCLUDED.amount,
                    updated_at = CURRENT_TIMESTAMP
            `;
            await db.query(query, [update.className, feeName, update.amount]);
        }
        res.json({ message: 'Bulk fees updated successfully' });
    } catch (err) {
        console.error('Bulk fee error:', err);
        res.status(500).json({ message: 'Error updating bulk fees' });
    }
});

router.delete('/fees', async (req, res) => {
    const { className, feeName } = req.query;
    try {
        if (className && feeName) {
            await db.query('DELETE FROM class_fees WHERE class_name = $1 AND fee_name = $2', [className, feeName]);
        } else if (className) {
            await db.query('DELETE FROM class_fees WHERE class_name = $1', [className]);
        }
        res.json({ message: 'Fee structure removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting fees' });
    }
});

// Dashboard Statistics API
router.get('/dashboard/stats', async (req, res) => {
    try {
        const studentCountRaw = await db.query('SELECT COUNT(*) FROM students');
        const staffCountRaw = await db.query('SELECT COUNT(*) FROM staff');
        const feesRaw = await db.query('SELECT SUM("pendingFee") as total FROM students');
        
        // Count new students this month
        const newStudentsRaw = await db.query(`
            SELECT COUNT(*) FROM students 
            WHERE "admissionDate" >= DATE_TRUNC('month', CURRENT_DATE)
        `);

        res.json({
            totalStudents: parseInt(studentCountRaw.rows[0].count),
            totalStaff: parseInt(staffCountRaw.rows[0].count),
            totalPendingFees: parseFloat(feesRaw.rows[0].total || 0),
            newStudentsThisMonth: parseInt(newStudentsRaw.rows[0].count),
            lowStockCount: 0 // Placeholder for inventory phase
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// Inventory APIs
router.get('/inventory', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM inventory ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch inventory error:', err);
        res.status(500).json({ message: 'Error fetching inventory' });
    }
});

router.post('/inventory', async (req, res) => {
    const { item_id, name, category, quantity, min_quantity, unit, location } = req.body;
    
    // Server-side validation
    if (item_id?.length > 20 || name?.length > 25 || unit?.length > 15 || location?.length > 30) {
        return res.status(400).json({ message: 'Input fields exceed character limits.' });
    }

    try {
        // Status determination
        let status = 'In Stock';
        if (parseInt(quantity) <= 0) status = 'Out of Stock';
        else if (parseInt(quantity) <= parseInt(min_quantity)) status = 'Low Stock';

        const query = `
            INSERT INTO inventory (item_id, name, category, quantity, min_quantity, unit, location, status, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
            ON CONFLICT (item_id) 
            DO UPDATE SET 
                name = EXCLUDED.name,
                category = EXCLUDED.category,
                quantity = EXCLUDED.quantity,
                min_quantity = EXCLUDED.min_quantity,
                unit = EXCLUDED.unit,
                location = EXCLUDED.location,
                status = EXCLUDED.status,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `;
        const result = await db.query(query, [item_id, name, category, quantity, min_quantity, unit, location, status]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Save inventory error:', err);
        res.status(500).json({ message: 'Error saving inventory item' });
    }
});

router.delete('/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM inventory WHERE id = $1', [id]);
        res.json({ message: 'Item removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting inventory item' });
    }
});

router.get('/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW() as current_time');
        res.json({ success: true, timestamp: result.rows[0].current_time });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Staff Leaves
router.get('/staff-leaves', async (req, res) => {
    try {
        const query = `
            SELECT sl.*, s."firstName", s."lastName", s.photo_url, s.staff_type as designation
            FROM staff_leaves sl
            LEFT JOIN staff s ON sl."staffId" = s."staffId"
            ORDER BY sl."appliedOn" DESC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch staff leaves error:', err);
        res.status(500).json({ message: 'Error fetching leave requests.' });
    }
});

router.put('/staff-leaves/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }
        const result = await db.query(
            'UPDATE staff_leaves SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update staff leave error:', err);
        res.status(500).json({ message: 'Error updating leave status.' });
    }
});

// Mounting the router on /api
app.use('/api', router);

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

server.on('error', (err) => {
    console.error('Server error:', err.message);
});
