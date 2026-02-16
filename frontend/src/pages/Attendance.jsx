import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiUserX, FiChevronDown, FiDownload } from 'react-icons/fi';
import { Card, Table } from '../components/ui';

const Attendance = () => {
    const [selectedClass, setSelectedClass] = useState('All Class');
    const [selectedSection, setSelectedSection] = useState('All Section');
    const [selectedMonth, setSelectedMonth] = useState('December, 2025');

    // Dropdown visibility states
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isSectionOpen, setIsSectionOpen] = useState(false);
    const [isMonthOpen, setIsMonthOpen] = useState(false);

    const classes = ['All Class', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `${i + 1}${getSuffix(i + 1)} Std`)];
    const sections = ['All Section', 'A', 'B', 'C', 'D', 'E'];
    const months = ['January, 2026', 'February, 2026', 'December, 2025', 'November, 2025'];

    function getSuffix(num) {
        if (num === 1) return 'st';
        if (num === 2) return 'nd';
        if (num === 3) return 'rd';
        return 'th';
    }

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = () => {
            setIsClassOpen(false);
            setIsSectionOpen(false);
            setIsMonthOpen(false);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const stats = [
        {
            label: "Today's Student Attendance",
            value: "95%",
            subValue: "1,186 / 1,248 present",
            icon: FiUsers,
            iconBg: "bg-[#7c3aed]", // Purple
            textColor: "text-slate-900"
        },
        {
            label: "Monthly Average",
            value: "92%",
            subValue: "Students this month",
            icon: FiCalendar,
            iconBg: "bg-[#ca8a04]", // Gold/Yellow
            textColor: "text-slate-900"
        },
        {
            label: "Absentees Today",
            value: "64",
            subValue: "Students",
            icon: FiUserX,
            iconBg: "bg-[#dc2626]", // Red
            textColor: "text-slate-900"
        }
    ];

    const columns = [
        { header: 'Student ID', accessor: 'studentId' },
        { header: 'Name', accessor: 'name', render: (row) => <span className="font-semibold text-slate-700">{row.name}</span> },
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
        { studentId: '001', name: 'Rahul Sharma', totalDays: '22', present: '20', absent: '2', percentage: '90.9' },
        { studentId: '002', name: 'Priya Verma', totalDays: '22', present: '21', absent: '1', percentage: '95.5' },
        { studentId: '003', name: 'John Doe', totalDays: '22', present: '20', absent: '2', percentage: '90.9' },
        { studentId: '004', name: 'Anita Roy', totalDays: '22', present: '19', absent: '3', percentage: '86.4' },
        { studentId: '005', name: 'Sahil Varma', totalDays: '22', present: '20', absent: '2', percentage: '90.9' },
    ];

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Student Attendance</h1>
                <p className="text-slate-500 font-medium font-inter">View and download attendance records for students</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-sm font-bold text-slate-900 mb-4 text-center md:text-left">Class</label>
                        <button
                            onClick={() => {
                                setIsClassOpen(!isClassOpen);
                                setIsSectionOpen(false);
                                setIsMonthOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-6 py-4 bg-[#f3f4f6] text-slate-900 rounded-xl font-bold shadow-sm hover:bg-slate-200 transition-all border-none"
                        >
                            {selectedClass}
                            <FiChevronDown className={`transition-transform duration-300 ${isClassOpen ? 'rotate-180' : ''}`} size={20} />
                        </button>
                        {isClassOpen && (
                            <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-xl shadow-2xl border border-slate-100 py-3 z-[100] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-500">
                                {classes.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => {
                                            setSelectedClass(c);
                                            setIsClassOpen(false);
                                        }}
                                        className={`w-full text-left px-6 py-3 text-sm font-bold transition-colors hover:bg-slate-50 ${selectedClass === c ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-sm font-bold text-slate-900 mb-4 text-center md:text-left">Section</label>
                        <button
                            onClick={() => {
                                setIsSectionOpen(!isSectionOpen);
                                setIsClassOpen(false);
                                setIsMonthOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-6 py-4 bg-[#f3f4f6] text-slate-900 rounded-xl font-bold shadow-sm hover:bg-slate-200 transition-all border-none"
                        >
                            {selectedSection}
                            <FiChevronDown className={`transition-transform duration-300 ${isSectionOpen ? 'rotate-180' : ''}`} size={20} />
                        </button>
                        {isSectionOpen && (
                            <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-xl shadow-2xl border border-slate-100 py-3 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
                                {sections.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            setSelectedSection(s);
                                            setIsSectionOpen(false);
                                        }}
                                        className={`w-full text-left px-6 py-3 text-sm font-bold transition-colors hover:bg-slate-50 ${selectedSection === s ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-sm font-bold text-slate-900 mb-4 text-center md:text-left">Month</label>
                        <button
                            onClick={() => {
                                setIsMonthOpen(!isMonthOpen);
                                setIsClassOpen(false);
                                setIsSectionOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-6 py-4 bg-[#f3f4f6] text-slate-900 rounded-xl font-bold shadow-sm hover:bg-slate-200 transition-all border-none"
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
                        Student Attendance - {selectedClass === 'All Class' ? 'All Classes' : selectedClass} {selectedSection === 'All Section' ? '(All Sections)' : `Section ${selectedSection}`}
                    </h2>
                    <p className="text-slate-400 font-bold text-sm">Monthly attendance records for {selectedMonth.split(',')[1].trim()}</p>
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

export default Attendance;
