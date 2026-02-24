import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Mock data for development
const mockStudents = [
    {
        id: 1,
        studentId: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        class: '10th Grade',
        section: 'A',
        dateOfBirth: '2008-05-15',
        gender: 'Male',
        address: '123 Main St, City',
        guardianName: 'Jane Doe',
        guardianPhone: '0987654321',
        status: 'Active',
        admissionDate: '2020-04-01',
    },
    {
        id: 2,
        studentId: 'STU002',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@example.com',
        phone: '2345678901',
        class: '9th Grade',
        section: 'B',
        dateOfBirth: '2009-08-22',
        gender: 'Female',
        address: '456 Oak Ave, Town',
        guardianName: 'Bob Smith',
        guardianPhone: '1234509876',
        status: 'Active',
        admissionDate: '2021-04-01',
    },
    {
        id: 3,
        studentId: 'STU003',
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.j@example.com',
        phone: '3456789012',
        class: '10th Grade',
        section: 'A',
        dateOfBirth: '2008-11-30',
        gender: 'Male',
        address: '789 Pine Rd, Village',
        guardianName: 'Sarah Johnson',
        guardianPhone: '5678901234',
        status: 'Active',
        admissionDate: '2020-04-01',
    },
];

// Student API
export const studentAPI = {
    getAll: () => {
        // Mock API call - replace with real API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: mockStudents });
            }, 500);
        });
    },

    getById: (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const student = mockStudents.find(s => s.id === parseInt(id));
                resolve({ data: student });
            }, 300);
        });
    },

    create: (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newStudent = {
                    id: mockStudents.length + 1,
                    studentId: `STU${String(mockStudents.length + 1).padStart(3, '0')}`,
                    ...data,
                    status: 'Active',
                    admissionDate: new Date().toISOString().split('T')[0],
                };
                resolve({ data: newStudent });
            }, 500);
        });
    },

    update: (id, data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { id, ...data } });
            }, 500);
        });
    },

    delete: (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { success: true } });
            }, 300);
        });
    },
};

// Auth API
export const authAPI = {
    login: (credentials) => {
        // Mock login - updated with user specific admin credentials
        return new Promise((resolve, reject) => {
            const adminCredentials = [
                // Admins
                { email: 'admin@school.in', password: 'admin2026@', name: 'Primary Admin', role: 'Administrator' },
                { email: 'xan@admin.in', password: 'xan2026@', name: 'Xan Admin', role: 'Administrator' },
                { email: 'xan@school.in', password: 'XAN2026', name: 'Xan School Admin', role: 'Administrator' },
                // Office Staff Roles
                { email: 'teacher@school.in', password: 'teacher2026@', name: 'Teacher Manager', role: 'TeacherManager' },
                { email: 'student@school.in', password: 'student2026@', name: 'Student Manager', role: 'StudentManager' },
                { email: 'fee@school.in', password: 'fee2026@', name: 'Fee Manager', role: 'FeeManager' },
                { email: 'inventory@school.in', password: 'inventory2026@', name: 'Inventory Manager', role: 'InventoryManager' }
            ];

            setTimeout(() => {
                const user = adminCredentials.find(
                    c => c.email === credentials.email && c.password === credentials.password
                );

                if (user) {
                    // Check if user is logging in through the correct tab
                    const isAdminTab = credentials.loginType === 'admin';
                    const isUserAdmin = user.role === 'Administrator';

                    if ((isAdminTab && !isUserAdmin) || (!isAdminTab && isUserAdmin)) {
                        reject({ response: { data: { message: 'Invalid credentials for this login type' } } });
                        return;
                    }

                    resolve({
                        data: {
                            token: 'mock-jwt-token-' + Date.now(),
                            user: {
                                id: adminCredentials.indexOf(user) + 1,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                            },
                        },
                    });
                } else {
                    reject({ response: { data: { message: 'Invalid credentials' } } });
                }
            }, 800);
        });
    },

    logout: () => {
        return apiClient.post('/auth/logout');
    },

    getCurrentUser: () => {
        return apiClient.get('/auth/me');
    },
};

// Staff API
export const staffAPI = {
    getAll: () => apiClient.get('/staff'),
    getById: (id) => apiClient.get(`/staff/${id}`),
    create: (data) => apiClient.post('/staff', data),
    update: (id, data) => apiClient.put(`/staff/${id}`, data),
    delete: (id) => apiClient.delete(`/staff/${id}`),
};

// Attendance API
export const attendanceAPI = {
    getAll: (params) => apiClient.get('/attendance', { params }),
    markAttendance: (data) => apiClient.post('/attendance', data),
    updateAttendance: (id, data) => apiClient.put(`/attendance/${id}`, data),
};

// Fee API
export const feeAPI = {
    getAll: () => apiClient.get('/fees'),
    getById: (id) => apiClient.get(`/fees/${id}`),
    create: (data) => apiClient.post('/fees', data),
    update: (id, data) => apiClient.put(`/fees/${id}`, data),
    recordPayment: (data) => apiClient.post('/fees/payment', data),
};

// Inventory API
export const inventoryAPI = {
    getAll: () => apiClient.get('/inventory'),
    getById: (id) => apiClient.get(`/inventory/${id}`),
    create: (data) => apiClient.post('/inventory', data),
    update: (id, data) => apiClient.put(`/inventory/${id}`, data),
    delete: (id) => apiClient.delete(`/inventory/${id}`),
};

export default apiClient;
