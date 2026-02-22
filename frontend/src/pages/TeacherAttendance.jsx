import React, { useState } from 'react';
import { FiCalendar, FiFilter, FiSearch, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { Card, Table } from '../components/ui';

const TeacherAttendance = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [search, setSearch] = useState('');

    const attendanceData = [
        { id: 1, name: 'Dr. Amitabh Bachchan', empId: 'EMP001', dept: 'Administration', inTime: '08:15 AM', outTime: '04:30 PM', status: 'Present', avatar: 'AB' },
        { id: 2, name: 'Mrs. Priya Sharma', empId: 'EMP002', dept: 'Academic', inTime: '08:00 AM', outTime: '03:45 PM', status: 'Present', avatar: 'PS' },
        { id: 3, name: 'Mr. Robert D\'Souza', empId: 'EMP005', dept: 'Physical Education', inTime: '-', outTime: '-', status: 'Absent', avatar: 'RD' },
        { id: 4, name: 'Ms. Anita Roy', empId: 'EMP009', dept: 'Mathematics', inTime: '08:45 AM', outTime: '-', status: 'Late', avatar: 'AR' },
        { id: 5, name: 'Mr. Sahil Varma', empId: 'EMP012', dept: 'Science', inTime: '08:10 AM', outTime: '04:00 PM', status: 'Present', avatar: 'SV' },
    ];

    const filteredData = attendanceData.filter(staff =>
        staff.name.toLowerCase().includes(search.toLowerCase()) ||
        staff.empId.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        {
            header: 'Staff Member',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs ring-2 ring-white shadow-sm">
                        {row.avatar}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{row.name}</p>
                        <p className="text-xs font-bold text-slate-400">{row.empId}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Department',
            accessor: 'dept',
            render: (row) => <span className="text-sm font-bold text-slate-600">{row.dept}</span>,
        },
        {
            header: 'Status',
            render: (row) => (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit ${row.status === 'Present' ? 'bg-green-50 text-green-600' :
                    row.status === 'Absent' ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-600'
                    }`}>
                    {row.status === 'Present' && <FiCheckCircle size={14} />}
                    {row.status === 'Absent' && <FiXCircle size={14} />}
                    {row.status === 'Late' && <FiAlertCircle size={14} />}
                    <span className="text-xs font-black uppercase tracking-wider">{row.status}</span>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-[11px] font-black tracking-widest text-[#0047AB] uppercase">Teacher Attendance</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 md:gap-0 px-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Teacher Attendance</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        <p className="text-[#0047AB] font-black text-[13px] uppercase tracking-widest">Daily Log: {new Date().toDateString()}</p>
                    </div>
                </div>

                {/* Date Picker */}
                <div className="relative group">
                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="pl-12 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 shadow-xl shadow-slate-200/50 outline-none focus:border-[#0047AB] transition-all cursor-pointer hover:-translate-y-0.5"
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Present', value: attendanceData.filter(d => d.status === 'Present').length, gradient: 'from-emerald-500 to-teal-600', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600', icon: FiCheckCircle },
                    { label: 'Late', value: attendanceData.filter(d => d.status === 'Late').length, gradient: 'from-amber-400 to-orange-500', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-600', icon: FiAlertCircle },
                    { label: 'On Leave / Absent', value: attendanceData.filter(d => d.status === 'Absent').length, gradient: 'from-blue-500 to-indigo-600', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-600', icon: FiXCircle },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={i}
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
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-50 overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out w-1/3 group-hover:w-full`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[3rem] shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-6 md:p-10 mb-6 ring-1 ring-slate-100">
                <div className="mb-8">
                    <div className="relative w-full max-w-md group/search">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-[#0047AB] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-[1.25rem] text-[15px] font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-50">
                    <Table
                        columns={columns}
                        data={filteredData}
                        className="border-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default TeacherAttendance;
