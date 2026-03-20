const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const setupDB = async () => {
  try {
    console.log('Connecting to database...');
    
    await pool.query(`DROP TABLE IF EXISTS students CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS staff CASCADE;`);

    console.log('Creating tables with correct schema...');
    await pool.query(`
      CREATE TABLE students (
        id SERIAL PRIMARY KEY,
        "studentId" VARCHAR(50) UNIQUE NOT NULL,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        "dateOfBirth" DATE,
        gender VARCHAR(20),
        address TEXT,
        class VARCHAR(50) NOT NULL,
        section VARCHAR(10),
        "rollNumber" VARCHAR(50),
        "guardianName" VARCHAR(150),
        relation VARCHAR(50),
        "guardianPhone" VARCHAR(20),
        email VARCHAR(150),
        status VARCHAR(20) DEFAULT 'Active',
        "admissionDate" DATE,
        "feeStatus" VARCHAR(20) DEFAULT 'Pending',
        "pendingFee" NUMERIC DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE staff (
        id SERIAL PRIMARY KEY,
        "staffId" VARCHAR(50) UNIQUE NOT NULL,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        email VARCHAR(150),
        phone VARCHAR(20),
        department VARCHAR(100),
        status VARCHAR(20) DEFAULT 'Active',
        "hireDate" DATE,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Inserting 28 students (2 per class)...');
    
    const classes = ['LKG', 'UKG', '1st Std', '2nd Std', '3rd Std', '4th Std', '5th Std', '6th Std', '7th Std', '8th Std', '9th Std', '10th Std', '11th Std', '12th Std'];
    const sections = ['A', 'B'];
    
    let studentIdCounter = 1;
    for (const c of classes) {
      for (let i = 0; i < 2; i++) {
        const sid = `STU${String(studentIdCounter).padStart(3, '0')}`;
        const section = sections[i % 2];
        const feeStatus = i === 0 ? 'Paid' : 'Pending';
        const pendingFee = i === 0 ? 0 : 25000;
        
        await pool.query(`
          INSERT INTO students (
            "studentId", "firstName", "lastName", class, section, email, "guardianPhone", 
            "dateOfBirth", gender, "guardianName", relation, "feeStatus", "pendingFee", "admissionDate"
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_DATE
          )
        `, [
          sid,
          `First${studentIdCounter}`, 
          `Last${studentIdCounter}`, 
          c, 
          section,
          `student${studentIdCounter}@school.com`,
          `9876543${String(studentIdCounter).padStart(3, '0')}`,
          '2015-05-10',
          i % 2 === 0 ? 'Male' : 'Female',
          `Guardian ${studentIdCounter}`,
          'Father',
          feeStatus,
          pendingFee
        ]);
        studentIdCounter++;
      }
    }

    console.log('Inserting 10 field staff...');
    const fieldStaffRoles = [
      { role: 'Security Guard', dept: 'Security' },
      { role: 'Bus Driver', dept: 'Transport' },
      { role: 'Maintenance Worker', dept: 'Facilities' },
      { role: 'Gardener', dept: 'Facilities' },
      { role: 'Cleaner', dept: 'Housekeeping' },
      { role: 'Bus Driver', dept: 'Transport' },
      { role: 'Electrician', dept: 'Maintenance' },
      { role: 'Plumber', dept: 'Maintenance' },
      { role: 'Security Supervisor', dept: 'Security' },
      { role: 'Peon', dept: 'Administration' }
    ];

    for (let i = 0; i < 10; i++) {
      const staffInfo = fieldStaffRoles[i];
      const sid = `STF${String(i + 1).padStart(3, '0')}`;
      await pool.query(`
        INSERT INTO staff (
          "staffId", "firstName", "lastName", role, department, email, phone, "hireDate"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
      `, [
        sid,
        `StaffFirst${i+1}`,
        `StaffLast${i+1}`,
        staffInfo.role,
        staffInfo.dept,
        `staff${i+1}@school.com`,
        `8765432${String(i+1).padStart(3, '0')}`
      ]);
    }

    console.log('Database setup complete!');
  } catch (err) {
    console.error('Error during setup:', err);
  } finally {
    pool.end();
  }
};

setupDB();
