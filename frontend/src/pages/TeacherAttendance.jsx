import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiUserX, FiChevronDown, FiDownload } from 'react-icons/fi';
import { Card, Table } from '../components/ui';

const TeacherAttendance = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('All Department');
    const [selectedMonth, setSelectedMonth] = useState('December, 2025');

    // Dropdown visibility states
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false);

    const departments = ['All Department', 'Academic', 'Science', 'Mathematics', 'Physical Education', 'Administration', 'Support Staff'];
    const months = ['January, 2026', 'February, 2026', 'December, 2025', 'November, 2025'];

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = () => {
            setIsDeptOpen(false);
            setIsMonthOpen(false);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const stats = [
        {
            label: "Today's Staff Attendance",
            value: "97%",
            subValue: "112 / 115 present",
            icon: FiUsers,
            iconBg: "bg-[#7c3aed]", // Purple
        },
        {
            label: "Monthly Average",
            value: "94%",
            subValue: "Staff this month",
            icon: FiCalendar,
            iconBg: "bg-[#ca8a04]", // Gold/Yellow
        },
        {
            label: "Absentees Today",
            value: "3",
            subValue: "Teachers",
            icon: FiUserX,
            iconBg: "bg-[#dc2626]", // Red
        }
    ];

    const columns = [
        { header: 'Staff ID', accessor: 'staffId' },
        { header: 'Name', accessor: 'name', render: (row) => <span className="font-semibold text-slate-700">{row.name}</span> },
        { header: 'Designation', accessor: 'designation' },
        { header: 'Department', accessor: 'department' },
        { header: 'Total Days', accessor: 'totalDays' },
        { header: 'Present', accessor: 'present', render: (row) => <span className="text-[#22c55e] font-bold">{row.present}</span> },
        { header: 'Absent', accessor: 'absent', render: (row) => <span className="text-[#ef4444] font-bold">{row.absent}</span> },
        {
            header: 'Percentage',
            accessor: 'percentage',
            render: (row) => (
                <div className="bg-[#f0f9ff] text-[#0369a1] px-3 py-1 rounded-lg font-bold text-xs inline-block">
                    {row.percentage}%
                </div>
            )
        },
    ];

    const attendanceData = [
        { staffId: 'STF001', name: 'Dr. Amitabh Bachchan', designation: 'Principal', department: 'Administration', totalDays: '22', present: '22', absent: '0', percentage: '100' },
        { staffId: 'STF002', name: 'Mrs. Priya Sharma', designation: 'Senior Teacher', department: 'Academic', totalDays: '22', present: '20', absent: '2', percentage: '90.9' },
        { staffId: 'STF005', name: 'Mr. Robert D\'Souza', designation: 'P.E. Coach', department: 'Physical Education', totalDays: '22', present: '21', absent: '1', percentage: '95.5' },
        { staffId: 'STF009', name: 'Ms. Anita Roy', designation: 'HOD - Mathematics', department: 'Mathematics', totalDays: '22', present: '22', absent: '0', percentage: '100' },
        { staffId: 'STF012', name: 'Mr. Sahil Varma', designation: 'Lab Assistant', department: 'Science', totalDays: '22', present: '19', absent: '3', percentage: '86.4' },
    ];

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Teacher Attendance</h1>
                <p className="text-slate-500 font-medium font-inter">View and manage attendance records for all staff members</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-sm p-6 bg-white rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 font-inter">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                <p className="text-xs font-bold text-slate-400 font-inter">{stat.subValue}</p>
                            </div>
                            <div className={`${stat.iconBg} p-3 rounded-xl shadow-lg shadow-gray-200/50`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filters Section */}
            <Card className="border-none shadow-sm rounded-3xl p-8 bg-white mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-sm font-bold text-slate-900 mb-4">Department</label>
                        <button
                            onClick={() => {
                                setIsDeptOpen(!isDeptOpen);
                                setIsMonthOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-6 py-4 bg-[#f3f4f6] text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all border-none"
                        >
                            {selectedDepartment}
                            <FiChevronDown className={`transition-transform duration-300 ${isDeptOpen ? 'rotate-180' : ''}`} size={20} />
                        </button>
                        {isDeptOpen && (
                            <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-xl shadow-2xl border border-slate-100 py-3 z-[100] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-500">
                                {departments.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => {
                                            setSelectedDepartment(d);
                                            setIsDeptOpen(false);
                                        }}
                                        className={`w-full text-left px-6 py-3 text-sm font-bold transition-colors hover:bg-slate-50 ${selectedDepartment === d ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-sm font-bold text-slate-900 mb-4">Month</label>
                        <button
                            onClick={() => {
                                setIsMonthOpen(!isMonthOpen);
                                setIsDeptOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-6 py-4 bg-[#f3f4f6] text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all border-none"
                        >
                            {selectedMonth}
                            <FiChevronDown className={`transition-transform duration-300 ${isMonthOpen ? 'rotate-180' : ''}`} size={20} />
                        </button>
                        {isMonthOpen && (
                            <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-xl shadow-2xl border border-slate-100 py-3 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
                                {months.map(m => (
                                    <button
                                        key={m}
                                        onClick={() => {
                                            setSelectedMonth(m);
                                            setIsMonthOpen(false);
                                        }}
                                        className={`w-full text-left px-6 py-3 text-sm font-bold transition-colors hover:bg-slate-50 ${selectedMonth === m ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-[#0047AB] hover:bg-[#003580] text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-[0.99]">
                    <FiDownload size={20} />
                    Download Report
                </button>
            </Card>

            {/* List Table Section */}
            <Card className="border-none shadow-sm rounded-3xl p-8 bg-white overflow-hidden">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                        Teacher Attendance Records - {selectedDepartment === 'All Department' ? 'All Staff' : selectedDepartment}
                    </h2>
                    <p className="text-slate-400 font-bold text-sm">Monthly attendance summaries for {selectedMonth}</p>
                </div>
                <Table
                    columns={columns}
                    data={attendanceData}
                    className="border-none"
                />
            </Card>
        </div>
    );
};

export default TeacherAttendance;
