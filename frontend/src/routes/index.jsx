import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import StudentList from '../features/students/StudentList';
import StudentProfile from '../features/students/StudentProfile';
import AddStudent from '../features/students/AddStudent';
import StudentPromotion from '../features/students/StudentPromotion';
import Staff from '../pages/Staff';
import AddStaff from '../pages/AddStaff';
import LeaveTracking from '../pages/LeaveTracking';
import Attendance from '../pages/Attendance';
import TeacherAttendance from '../pages/TeacherAttendance';
import FeeStructure from '../pages/FeeStructure';
import PendingFees from '../pages/PendingFees';
import Inventory from '../pages/Inventory';
import Reports from '../pages/Reports';

// Placeholder pages
const Calendar = () => (
    <div className="p-8 bg-[#F8FAFC] min-h-[calc(100vh-64px)] flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-blue-50 bg-opacity-80 rounded-full flex items-center justify-center mb-8 shadow-sm">
            <div className="w-12 h-12 border-4 border-[#0047AB] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Calendar & Events</h1>
        <p className="text-slate-500 font-bold text-lg font-inter">Work is under progress, coming soon...</p>
    </div>
);

const Settings = () => (
    <div className="p-8 bg-[#F8FAFC] min-h-[calc(100vh-64px)] flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-blue-50 bg-opacity-80 rounded-full flex items-center justify-center mb-8 shadow-sm">
            <div className="w-12 h-12 border-4 border-slate-300 border-t-[#0047AB] rounded-full animate-spin"></div>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Settings & Configuration</h1>
        <p className="text-slate-500 font-bold text-lg font-inter">Work is under progress, coming soon...</p>
    </div>
);

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/students" element={<StudentList />} />
                                    <Route path="/students/:id" element={<StudentProfile />} />
                                    <Route path="/students/add" element={<AddStudent />} />
                                    <Route path="/students/promotion" element={<StudentPromotion />} />
                                    <Route path="/staff" element={<Staff />} />
                                    <Route path="/staff/add" element={<AddStaff />} />
                                    <Route path="/staff/leave-tracking" element={<LeaveTracking />} />
                                    <Route path="/attendance" element={<Attendance />} />
                                    <Route path="/attendance/teacher" element={<TeacherAttendance />} />
                                    <Route path="/fees/structure" element={<FeeStructure />} />
                                    <Route path="/fees/pending" element={<PendingFees />} />
                                    <Route path="/inventory" element={<Inventory />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/calendar" element={<Calendar />} />
                                    <Route path="/settings" element={<Settings />} />
                                </Routes>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
