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
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-[11px] font-black tracking-widest text-[#0047AB] uppercase font-bold">Attendance Records</span>
            </div>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 md:gap-0 px-2 transition-all">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Student Attendance</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                        <p className="text-[#0047AB] font-black text-[13px] uppercase tracking-widest">Real-time tracking enabled</p>
                    </div>
                </div>
                <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-slate-200/50 transition-all hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest leading-none">
                    <FiDownload size={18} />
                    Export Full Report
                </button>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: "Today's Attendance", value: '95%', sub: '1,186 / 1,248 present', icon: FiUsers, gradient: 'from-violet-500 to-purple-600', iconBg: 'bg-violet-500/10', iconColor: 'text-violet-600' },
                    { label: 'Monthly Average', value: '92%', sub: 'Students this month', icon: FiCalendar, gradient: 'from-amber-400 to-orange-500', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-600' },
                    { label: 'Absentees Today', value: '64', sub: 'Students absent', icon: FiUserX, gradient: 'from-rose-500 to-red-600', iconBg: 'bg-rose-500/10', iconColor: 'text-rose-600' },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1.5 overflow-hidden"
                        >
                            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.08] rounded-full transition-opacity duration-700 blur-2xl`} />

                            <div className="relative z-10">
                                <div className="mb-6">
                                    <div className={`w-fit p-4 rounded-2xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                        <Icon size={26} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
                                    <span className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest pt-1 opacity-60">{stat.sub}</p>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-50 overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out w-1/3 group-hover:w-full`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Refined Filter System */}
            <div className="bg-white rounded-[3rem] shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-8 md:p-10 mb-6 group transition-all duration-500 ring-1 ring-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="relative group/drop" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Academic Class</label>
                        <button
                            onClick={() => {
                                setIsClassOpen(!isClassOpen);
                                setIsSectionOpen(false);
                                setIsMonthOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-8 py-4.5 bg-slate-50 border-2 border-slate-50 rounded-[1.25rem] font-black text-[13px] uppercase tracking-widest text-slate-900 transition-all hover:bg-white hover:border-[#0047AB]/20"
                        >
                            {selectedClass}
                            <FiChevronDown className={`transition-transform duration-500 ${isClassOpen ? 'rotate-180' : ''}`} size={20} />
                        </button>
                        {isClassOpen && (
                            <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5 custom-scrollbar">
                                {classes.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => {
                                            setSelectedClass(c);
                                            setIsClassOpen(false);
                                        }}
                                        className={`w-full text-left px-8 py-3.5 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedClass === c ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative group/drop" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Division / Section</label>
                        <button
                            onClick={() => {
                                setIsSectionOpen(!isSectionOpen);
                                setIsClassOpen(false);
                                setIsMonthOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-8 py-4.5 bg-slate-50 border-2 border-slate-50 rounded-[1.25rem] font-black text-[13px] uppercase tracking-widest text-slate-900 transition-all hover:bg-white hover:border-[#0047AB]/20"
                        >
                            {selectedSection}
                            <FiChevronDown className={`transition-transform duration-500 ${isSectionOpen ? 'rotate-180' : ''}`} size={20} />
                        </button>
                        {isSectionOpen && (
                            <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5">
                                {sections.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            setSelectedSection(s);
                                            setIsSectionOpen(false);
                                        }}
                                        className={`w-full text-left px-8 py-3.5 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedSection === s ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative group/drop" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Reporting Period</label>
                        <button
                            onClick={() => {
                                setIsMonthOpen(!isMonthOpen);
                                setIsClassOpen(false);
                                setIsSectionOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-8 py-4.5 bg-slate-50 border-2 border-slate-50 rounded-[1.25rem] font-black text-[13px] uppercase tracking-widest text-slate-900 transition-all hover:bg-white hover:border-[#0047AB]/20"
                        >
                            {selectedMonth}
                            <FiChevronDown className={`transition-transform duration-500 ${isMonthOpen ? 'rotate-180' : ''}`} size={20} />
                        </button>
                        {isMonthOpen && (
                            <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5">
                                {months.map(m => (
                                    <button
                                        key={m}
                                        onClick={() => {
                                            setSelectedMonth(m);
                                            setIsMonthOpen(false);
                                        }}
                                        className={`w-full text-left px-8 py-3.5 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedMonth === m ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Table Section */}
                <div className="mt-12 border-t border-slate-50 pt-10">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-2">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight"> Detailed Summary</h2>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {selectedClass === 'All Class' ? 'All Classes' : selectedClass} • {selectedSection === 'All Section' ? 'All Sections' : `Section ${selectedSection}`}
                            </p>
                        </div>
                        <div className="bg-blue-50 px-4 py-2 rounded-xl">
                            <span className="text-[11px] font-black text-[#0047AB] uppercase tracking-widest">{selectedMonth}</span>
                        </div>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-50">
                        <Table
                            columns={columns}
                            data={attendanceData}
                            className="border-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
