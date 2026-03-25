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
    .then(() => db.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS \"feeStatus\" VARCHAR(20) DEFAULT 'Pending'"))
    .then(() => db.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS \"pendingFee\" NUMERIC(15, 2) DEFAULT 0"))
    .then(() => db.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS \"totalAmount\" NUMERIC(15, 2) DEFAULT 42000"))
    .then(() => db.query("UPDATE students SET \"totalAmount\" = 42000 WHERE \"totalAmount\" IS NULL"))
    .then(() => db.query(`
        CREATE TABLE IF NOT EXISTS class_fees (
            id SERIAL PRIMARY KEY,
            class_name VARCHAR(50) NOT NULL,
            fee_name VARCHAR(100) NOT NULL,
            amount NUMERIC(15, 2) DEFAULT 0,
            due_date DATE,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(class_name, fee_name)
        )
    `))
    .then(() => db.query("ALTER TABLE class_fees ADD COLUMN IF NOT EXISTS due_date DATE"))
    .then(() => db.query(`
        CREATE TABLE IF NOT EXISTS staff_timetables (
            id SERIAL PRIMARY KEY,
            "staffId" VARCHAR(50) NOT NULL,
            day VARCHAR(10) NOT NULL,
            period1 JSONB,
            period2 JSONB,
            period3 JSONB,
            period4 JSONB,
            period5 JSONB,
            period6 JSONB,
            period7 JSONB,
            UNIQUE("staffId", day)
        )
    `))
    .then(() => db.query(`
        CREATE TABLE IF NOT EXISTS student_timetables (
            id SERIAL PRIMARY KEY,
            class_name VARCHAR(50) NOT NULL,
            section VARCHAR(10) NOT NULL,
            day VARCHAR(10) NOT NULL,
            period1 JSONB,
            period2 JSONB,
            period3 JSONB,
            period4 JSONB,
            period5 JSONB,
            period6 JSONB,
            period7 JSONB,
            UNIQUE(class_name, section, day)
        )
    `))
    .then(() => db.query(`
        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(20) DEFAULT 'info',
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `))
    .then(() => db.query(`
        CREATE TABLE IF NOT EXISTS staff_attendance (
            id SERIAL PRIMARY KEY,
            "staffId" VARCHAR(50) NOT NULL,
            date DATE NOT NULL,
            status VARCHAR(20) NOT NULL,
            remarks TEXT,
            "submitted_by" VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE("staffId", date)
        )
    `))
    .then(() => db.query(`
        CREATE TABLE IF NOT EXISTS fee_payments (
            id SERIAL PRIMARY KEY,
            student_id VARCHAR(50) NOT NULL,
            amount NUMERIC(15, 2) NOT NULL,
            payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            payment_method VARCHAR(50),
            remark TEXT,
            selected_fees TEXT, -- JSON string or comma-separated list of fee names
            recorded_by VARCHAR(50) -- admin name or ID
        )
    `))
    .then(() => db.query(`
        CREATE TABLE IF NOT EXISTS inventory (
            id SERIAL PRIMARY KEY,
            item_id VARCHAR(50) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            category VARCHAR(50),
            quantity INT DEFAULT 0,
            min_quantity INT DEFAULT 0,
            unit VARCHAR(20),
            location VARCHAR(50),
            status VARCHAR(20),
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `))
    .then(() => console.log('✅ Database schema verified'))
    .catch(err => console.error('❌ Schema migration failed:', err));

// API Routes
const router = express.Router();

// Notifications API
router.get('/notifications/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await db.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

router.post('/notifications', async (req, res) => {
    try {
        const { userId, message, type } = req.body;
        await db.query('INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)', [userId, message, type || 'info']);
        res.json({ message: 'Notification created' });
    } catch (err) {
        res.status(500).json({ message: 'Error creating notification' });
    }
});

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
        // Automatic Fee Status Check:
        // Update all students to 'Overdue' if they have pending fees AND any fee for their class is past due_date
        const overdueUpdateQuery = `
            UPDATE students
            SET "feeStatus" = 'Overdue'
            WHERE "pendingFee" > 0 
            AND "feeStatus" != 'Overdue'
            AND "class" IN (
                SELECT class_name FROM class_fees 
                WHERE due_date < CURRENT_DATE 
                AND amount > 0
            )
        `;
        await db.query(overdueUpdateQuery);

        // Also reset to 'Pending' if the above isn't true but they still have balance (in case date was extended)
        const pendingResetQuery = `
            UPDATE students
            SET "feeStatus" = 'Pending'
            WHERE "pendingFee" > 0 
            AND "feeStatus" = 'Overdue'
            AND "class" NOT IN (
                SELECT class_name FROM class_fees 
                WHERE due_date < CURRENT_DATE 
                AND amount > 0
            )
        `;
        await db.query(pendingResetQuery);

        const result = await db.query('SELECT * FROM students ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch students error:', err);
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

router.post('/students', async (req, res) => {
    try {
        const { 
            studentId, firstName, lastName, dob, gender, address, 
            class: className, section, rollNumber, 
            parentName, relation, phoneNumber, email, photo_url 
        } = req.body;

        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is mandatory.' });
        }

        if (studentId.length > 15) {
            return res.status(400).json({ message: 'Student ID cannot exceed 15 characters.' });
        }

        // Check for duplicate Student ID
        const existing = await db.query('SELECT "studentId" FROM students WHERE "studentId" = $1', [studentId]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: `Student ID "${studentId}" is already assigned to another student.` });
        }

        // Basic server-side length validation
        if (firstName?.length > 32 || lastName?.length > 32 || parentName?.length > 32 || phoneNumber?.length > 15 || email?.length > 50 || address?.length > 350) {
            return res.status(400).json({ message: 'Input fields exceed character limits.' });
        }

        // Fetch current total fees for this class to set as initial pendingFee
        const feeRes = await db.query('SELECT SUM(amount) as total FROM class_fees WHERE class_name = $1', [className]);
        const initialFee = parseFloat(feeRes.rows[0].total || 0);

        const query = `
            INSERT INTO students (
                "studentId", "firstName", "lastName", "dateOfBirth", gender, address, 
                class, section, "rollNumber", "guardianName", relation, 
                "guardianPhone", email, "feeStatus", "pendingFee", "totalAmount", photo_url, "admissionDate"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_DATE)
            RETURNING *
        `;

        const values = [
            studentId, firstName, lastName, dob || null, gender, address, 
            className, section, rollNumber, parentName, relation, 
            phoneNumber, email, initialFee > 0 ? 'Pending' : 'Paid', initialFee, initialFee, photo_url
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
        
        // Ensure we have a staffId value
        const staffIdRaw = req.body.staffId || employeeId; 

        // Use numeric ID if possible
        const targetId = !isNaN(id) ? parseInt(id) : id;

        const values = [
            firstName, lastName, email, phone, dob || null, gender, address, city, state, zipCode, 
            employeeId, staffIdRaw, req.body.staffType || 'Teaching', photo_url,
            classTeacher, subjectsStr, targetId
        ];
        
        console.log(`--- UPDATING STAFF ID: ${targetId} ---`);
        const result = await db.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update staff error:', {
            message: err.message,
            code: err.code,
            detail: err.detail,
            stack: err.stack
        });
        
        if (err.code === '23505') {
            if (err.constraint === 'staff_email_key') {
                return res.status(400).json({ message: 'Email address already exists.' });
            }
            if (err.constraint === 'staff_employeeId_key' || err.message.includes('employeeId')) {
                return res.status(400).json({ message: 'Employee ID already exists.' });
            }
        }
        res.status(500).json({ message: 'Server error updating staff: ' + err.message });
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
        due_date DATE,
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
    const { className } = req.query;
    try {
        let query = 'SELECT * FROM class_fees';
        let params = [];
        
        if (className) {
            query += ' WHERE class_name = $1';
            params.push(className);
        }
        
        query += ' ORDER BY class_name ASC, fee_name ASC';
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Fetch fees error:', err);
        res.status(500).json({ message: 'Error fetching fees' });
    }
});

router.post('/fees/bulk', async (req, res) => {
    const { feeName, updates, dueDate } = req.body; 
    
    if (!feeName || feeName.length > 50 || !updates || !Array.isArray(updates)) {
        return res.status(400).json({ message: 'Invalid bulk data or fee name too long' });
    }

    try {
        for (const update of updates) {
            // 1. Check if this is a NEW fee for this class (not just an update)
            const checkQuery = 'SELECT id FROM class_fees WHERE class_name = $1 AND fee_name = $2';
            const checkRes = await db.query(checkQuery, [update.className, feeName]);
            const isNewFee = checkRes.rows.length === 0;

            // 2. Insert or Update the fee structure
            const query = `
                INSERT INTO class_fees (class_name, fee_name, amount, due_date, updated_at)
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
                ON CONFLICT (class_name, fee_name) 
                DO UPDATE SET 
                    amount = EXCLUDED.amount,
                    due_date = COALESCE(EXCLUDED.due_date, class_fees.due_date),
                    updated_at = CURRENT_TIMESTAMP
            `;
            await db.query(query, [update.className, feeName, update.amount, dueDate || null]);

            // 3. If it's a NEW fee, automatically add it to every student in that class
            if (isNewFee && parseFloat(update.amount) > 0) {
                const addAmount = parseFloat(update.amount);
                const updateStudentsQuery = `
                    UPDATE students 
                    SET 
                        "pendingFee" = "pendingFee" + $1,
                        "totalAmount" = "totalAmount" + $1,
                        "feeStatus" = 'Pending',
                        updated_at = CURRENT_TIMESTAMP
                    WHERE class = $2
                `;
                await db.query(updateStudentsQuery, [addAmount, update.className]);
                console.log(`[AUTO-FEE] Added ${addAmount} to students in ${update.className} for new fee: ${feeName}`);
            }
        }
        res.json({ message: 'Bulk fees updated successfully. New fees were automatically added to student balances.' });
    } catch (err) {
        console.error('Bulk fee error:', err);
        res.status(500).json({ message: 'Error updating bulk fees' });
    }
});

router.post('/fees/sync-students', async (req, res) => {
    try {
        // Smarter sync logic: Incremental fee update
        // New PendingFee = Current PendingFee + (New TotalFees - Previous TotalAmount)
        const query = `
            WITH fee_totals AS (
                SELECT class_name, SUM(amount) as new_total
                FROM class_fees
                GROUP BY class_name
            )
            UPDATE students
            SET 
                "pendingFee" = GREATEST(0, "pendingFee" + (ft.new_total - COALESCE("totalAmount", 0))),
                "totalAmount" = ft.new_total,
                "feeStatus" = CASE 
                    WHEN ("pendingFee" + (ft.new_total - COALESCE("totalAmount", 0))) > 0 THEN 'Pending'
                    ELSE 'Paid'
                END
            FROM fee_totals ft
            WHERE students."class" = ft.class_name
        `;
        await db.query(query);
        
        // Handle students whose classes have NO fees defined
        const resetQuery = `
            UPDATE students
            SET 
                "pendingFee" = 0,
                "totalAmount" = 0,
                "feeStatus" = 'Paid'
            WHERE "class" NOT IN (SELECT class_name FROM class_fees)
        `;
        await db.query(resetQuery);

        res.json({ message: 'Sync complete! Only fee differences were added to students, preserving previous payments.' });
    } catch (err) {
        console.error('Sync fees error:', err);
        res.status(500).json({ message: 'Error syncing students' });
    }
});

// Record Fee Payment
router.post('/fees/payment', async (req, res) => {
    const { studentId, amount, paymentMethod, remark, selectedFees } = req.body;
    
    if (!studentId || !amount || parseFloat(amount) <= 0) {
        return res.status(400).json({ message: 'Invalid payment details.' });
    }

    try {
        await db.query('BEGIN');

        // 1. Record the payment in history
        const feeList = Array.isArray(selectedFees) ? selectedFees.join(', ') : selectedFees;
        await db.query(`
            INSERT INTO fee_payments (student_id, amount, payment_method, remark, selected_fees)
            VALUES ($1, $2, $3, $4, $5)
        `, [studentId, amount, paymentMethod || 'Cash', remark || '', feeList || 'General Payment']);

        // 2. Reduce the student's pendingFee
        const updateRes = await db.query(`
            UPDATE students
            SET 
                "pendingFee" = GREATEST(0, "pendingFee" - $1),
                "feeStatus" = CASE 
                    WHEN ("pendingFee" - $1) <= 0 THEN 'Paid'
                    ELSE 'Pending'
                END
            WHERE "studentId" = $2
            RETURNING *
        `, [parseFloat(amount), studentId]);

        if (updateRes.rows.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ message: 'Student not found.' });
        }

        await db.query('COMMIT');
        res.json({ 
            message: `Recorded payment of ₹ ${amount} for student ${studentId}.`, 
            student: updateRes.rows[0] 
        });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error('Record Payment error:', err);
        res.status(500).json({ message: 'Internal server error while recording payment.' });
    }
});

router.post('/fees/due-date', async (req, res) => {
    const { feeName, dueDate } = req.body;
    if (!feeName || !dueDate) return res.status(400).json({ message: 'Fee name and due date required' });
    
    try {
        await db.query('UPDATE class_fees SET due_date = $1 WHERE fee_name = $2', [dueDate, feeName]);
        res.json({ message: 'Due date updated for ' + feeName });
    } catch (err) {
        res.status(500).json({ message: 'Error updating due date' });
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

        // Real Low Stock Count
        const lowStockRaw = await db.query('SELECT COUNT(*) FROM inventory WHERE quantity <= min_quantity');

        res.json({
            totalStudents: parseInt(studentCountRaw.rows[0].count),
            totalStaff: parseInt(staffCountRaw.rows[0].count),
            totalPendingFees: parseFloat(feesRaw.rows[0].total || 0),
            newStudentsThisMonth: parseInt(newStudentsRaw.rows[0].count),
            lowStockCount: parseInt(lowStockRaw.rows[0].count)
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

router.get('/dashboard/attendance-chart', async (req, res) => {
    try {
        const { type } = req.query;
        const tableName = type === 'Staff' ? 'staff_attendance' : 'student_attendance';
        const query = `
            SELECT 
                TO_CHAR(date, 'Mon') as name,
                COUNT(*) FILTER (WHERE status = 'Present') as present,
                COUNT(*) FILTER (WHERE status = 'Absent') as absent
            FROM ${tableName}
            WHERE date >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY TO_CHAR(date, 'Mon'), DATE_TRUNC('month', date)
            ORDER BY DATE_TRUNC('month', date)
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Attendance chart error:', err);
        res.status(500).json({ message: 'Error fetching chart data' });
    }
});

router.get('/attendance/staff-summary', async (req, res) => {
    try {
        const { date } = req.query;
        const query = `
            SELECT 
                s."staffId", 
                s.name, 
                s.department as dept,
                COALESCE(a.status, 'Not Marked') as status,
                a.remarks
            FROM staff s
            LEFT JOIN staff_attendance a ON s."staffId" = a."staffId" AND a.date = $1
            ORDER BY s.name ASC
        `;
        const result = await db.query(query, [date || new Date().toISOString().split('T')[0]]);
        res.json(result.rows);
    } catch (err) {
        console.error('Staff summary error:', err);
        res.status(500).json({ message: 'Error fetching staff summary' });
    }
});

router.get('/attendance/summary', async (req, res) => {
    try {
        const { className, section, month, year } = req.query;
        
        // 1. School-wide Stats for TODAY
        const todayStats = await db.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'Present') as present,
                COUNT(*) FILTER (WHERE status = 'Absent') as absent
            FROM student_attendance 
            WHERE date = CURRENT_DATE
        `);

        // 2. Monthly School-wide Average
        const monthStats = await db.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'Present') as present
            FROM student_attendance 
            WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
        `);

        // 3. Detailed Student List for selected filters
        let studentQuery = `
            SELECT 
                s."studentId", 
                s."firstName" || ' ' || s."lastName" as name,
                COUNT(a.id) as "totalDays",
                COUNT(a.id) FILTER (WHERE a.status = 'Present') as present,
                COUNT(a.id) FILTER (WHERE a.status = 'Absent') as absent
            FROM students s
            LEFT JOIN student_attendance a ON s."studentId" = a."studentId"
        `;
        
        const conditions = [];
        const params = [];
        
        if (className && className !== 'All Class') {
            params.push(className);
            conditions.push(`s.class = $${params.length}`);
        }
        if (section && section !== 'All Section') {
            params.push(section);
            conditions.push(`s.section = $${params.length}`);
        }
        if (month) {
            params.push(month);
            conditions.push(`EXTRACT(MONTH FROM a.date) = $${params.length}`);
        }
        if (year) {
            params.push(year);
            conditions.push(`EXTRACT(YEAR FROM a.date) = $${params.length}`);
        }

        if (conditions.length > 0) {
            studentQuery += ' WHERE ' + conditions.join(' AND ');
        }
        
        studentQuery += ' GROUP BY s."studentId", s."firstName", s."lastName" ORDER BY s."firstName" ASC';
        
        const details = await db.query(studentQuery, params);
        
        res.json({
            today: todayStats.rows[0],
            monthly: monthStats.rows[0],
            students: details.rows.map(s => ({
                ...s,
                percentage: s.totalDays > 0 ? ((s.present / s.totalDays) * 100).toFixed(1) : '0.0'
            }))
        });

    } catch (err) {
        console.error('Attendance summary error:', err);
        res.status(500).json({ message: 'Error fetching attendance summary' });
    }
});

router.get('/reports/summary', async (req, res) => {
    try {
        const financialQuery = `
            SELECT 
                SUM(COALESCE("totalAmount", 0) - COALESCE("pendingFee", 0)) as collected,
                SUM(COALESCE("pendingFee", 0)) as outstanding
            FROM students
        `;
        const attendanceQuery = `
            SELECT 
                COUNT(*) FILTER (WHERE status = 'Present') as present,
                COUNT(*) as total
            FROM student_attendance
            WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
        `;
        const inventoryQuery = `
            SELECT COUNT(*) as low_stock 
            FROM inventory 
            WHERE quantity <= min_quantity
        `;

        const [fin, att, inv] = await Promise.all([
            db.query(financialQuery),
            db.query(attendanceQuery),
            db.query(inventoryQuery)
        ]);

        const attPercent = att.rows[0].total > 0 
            ? ((att.rows[0].present / att.rows[0].total) * 100).toFixed(1)
            : '0.0';

        res.json({
            financial: {
                collected: parseFloat(fin.rows[0].collected || 0),
                outstanding: parseFloat(fin.rows[0].outstanding || 0)
            },
            attendance: {
                monthlyPercent: attPercent + '%'
            },
            inventory: {
                lowStockCount: parseInt(inv.rows[0].low_stock || 0)
            }
        });
    } catch (err) {
        console.error('Reports summary error:', err);
        res.status(500).json({ message: 'Error fetching reports summary' });
    }
});

router.get('/reports/pending-list', async (req, res) => {
    try {
        const { className } = req.query;
        let query = 'SELECT "studentId", "firstName", "lastName", class, section, "pendingFee" FROM students WHERE "pendingFee" > 0';
        let params = [];

        if (className && className !== 'All Class') {
            query += ' AND class = $1';
            params.push(className);
        }

        query += ' ORDER BY class, section, "firstName"';
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Pending list error:', err);
        res.status(500).json({ message: 'Error fetching pending list' });
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

router.get('/reports/attendance-map', async (req, res) => {
    try {
        const query = `
            SELECT 
                class,
                section,
                COUNT(*) as total_days,
                COUNT(*) FILTER (WHERE status = 'Present') as present,
                ROUND((COUNT(*) FILTER (WHERE status = 'Present')::float / NULLIF(COUNT(*), 0)) * 100) as percentage
            FROM student_attendance
            WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY class, section
            ORDER BY class ASC, section ASC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Attendance map error:', err);
        res.status(500).json({ message: 'Error fetching attendance map' });
    }
});

router.get('/reports/collection-log', async (req, res) => {
    try {
        const query = `
            SELECT 
                "studentId",
                "firstName" || ' ' || s."lastName" as name,
                class,
                section,
                "totalAmount" as amount,
                updated_at as "date"
            FROM students s
            WHERE "feeStatus" = 'Paid'
            ORDER BY updated_at DESC
            LIMIT 50
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Collection log error:', err);
        res.status(500).json({ message: 'Error fetching collection log' });
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
// Timetable APIs (Admin Management)
router.get('/timetable/staff/:staffId', async (req, res) => {
    try {
        const { staffId } = req.params;
        const result = await db.query('SELECT * FROM staff_timetables WHERE "staffId" = $1', [staffId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching staff timetable' });
    }
});

router.post('/timetable/staff', async (req, res) => {
    try {
        const { staffId, day, periods } = req.body;
        const query = `
            INSERT INTO staff_timetables ("staffId", "day", "period1", "period2", "period3", "period4", "period5", "period6", "period7")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT ("staffId", "day") DO UPDATE SET
                "period1" = EXCLUDED."period1",
                "period2" = EXCLUDED."period2",
                "period3" = EXCLUDED."period3",
                "period4" = EXCLUDED."period4",
                "period5" = EXCLUDED."period5",
                "period6" = EXCLUDED."period6",
                "period7" = EXCLUDED."period7"
            RETURNING *
        `;
        const values = [
            staffId, day,
            periods.period1 || null, periods.period2 || null, periods.period3 || null,
            periods.period4 || null, periods.period5 || null, periods.period6 || null,
            periods.period7 || null
        ];
        const result = await db.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error saving staff timetable' });
    }
});

router.get('/timetable/student/:className/:section', async (req, res) => {
    try {
        const { className, section } = req.params;
        const result = await db.query('SELECT * FROM student_timetables WHERE class_name = $1 AND section = $2', [className, section]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching student timetable' });
    }
});

router.post('/timetable/student', async (req, res) => {
    try {
        const { className, section, day, periods } = req.body;
        const query = `
            INSERT INTO student_timetables (class_name, section, "day", "period1", "period2", "period3", "period4", "period5", "period6", "period7")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (class_name, section, "day") DO UPDATE SET
                "period1" = EXCLUDED."period1",
                "period2" = EXCLUDED."period2",
                "period3" = EXCLUDED."period3",
                "period4" = EXCLUDED."period4",
                "period5" = EXCLUDED."period5",
                "period6" = EXCLUDED."period6",
                "period7" = EXCLUDED."period7"
            RETURNING *
        `;
        const values = [
            className, section, day,
            periods.period1 || null, periods.period2 || null, periods.period3 || null,
            periods.period4 || null, periods.period5 || null, periods.period6 || null,
            periods.period7 || null
        ];
        const result = await db.query(query, values);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error saving student timetable' });
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
