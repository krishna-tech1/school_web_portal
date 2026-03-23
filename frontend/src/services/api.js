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

// Dashboard Stats
export const dashboardAPI = {
    getStats: () => apiClient.get('/dashboard/stats'),
    getAttendanceChart: (type) => apiClient.get('/dashboard/attendance-chart', { params: { type } }),
};

// Student API
export const studentAPI = {
    getAll: () => apiClient.get('students'),
    getById: (id) => apiClient.get(`students/${id}`),
    create: (data) => apiClient.post('students', data),
    update: (id, data) => apiClient.put(`students/${id}`, data),
    delete: (id) => apiClient.delete(`students/${id}`),
    promote: (studentIds) => apiClient.post('students/promote', { studentIds }),
    uploadPhoto: (formData) => apiClient.post('students/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
};

// Auth API
export const authAPI = {
    login: (credentials) => {
        return apiClient.post('auth/login', credentials);
    },

    logout: () => {
        return apiClient.post('auth/logout');
    },

    getCurrentUser: () => {
        return apiClient.get('auth/me');
    },
};

// Staff API
export const staffAPI = {
    getAll: () => apiClient.get('staff'),
    getById: (id) => apiClient.get(`staff/${id}`),
    create: (data) => apiClient.post('staff', data),
    update: (id, data) => apiClient.put(`staff/${id}`, data),
    delete: (id) => apiClient.delete(`staff/${id}`),
    uploadPhoto: (formData) => apiClient.post('staff/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),
};

// Attendance API
export const attendanceAPI = {
    getAll: () => apiClient.get('/attendance'),
    getSummary: (filters) => apiClient.get('/attendance/summary', { params: filters }),
    update: (id, data) => apiClient.put(`/attendance/${id}`, data),
};

// Fee API
export const feeAPI = {
    getAll: () => apiClient.get('/fees'),
    create: (data) => apiClient.post('/fees', data),
    save: (data) => apiClient.post('/fees', data), 
    saveBulk: (data) => apiClient.post('/fees/bulk', data),
    saveDueDate: (data) => apiClient.post('/fees/due-date', data), // data: { feeName, dueDate }
    syncStudents: () => apiClient.post('/fees/sync-students'),
    delete: (className, feeName) => apiClient.delete(`/fees?className=${className}${feeName ? `&feeName=${feeName}` : ''}`),
};

// Inventory API
export const inventoryAPI = {
    getAll: () => apiClient.get('/inventory'),
    save: (data) => apiClient.post('/inventory', data),
    delete: (id) => apiClient.delete(`/inventory/${id}`),
};

// Staff Leave API
export const leaveAPI = {
    getAllRequests: () => apiClient.get('/staff-leaves'),
    updateStatus: (id, status) => apiClient.put(`/staff-leaves/${id}`, { status }),
};

// Notification API
export const notificationAPI = {
    getAll: (userId) => apiClient.get(`/notifications/${userId}`),
    create: (data) => apiClient.post('/notifications', data), // { userId, message, type }
};

// Timetable API
export const timetableAPI = {
    getStaff: (staffId) => apiClient.get(`timetable/staff/${staffId}`),
    saveStaff: (data) => apiClient.post('timetable/staff', data),
    getStudent: (className, section) => apiClient.get(`timetable/student/${className}/${section}`),
    saveStudent: (data) => apiClient.post('timetable/student', data),
};

export default apiClient;
