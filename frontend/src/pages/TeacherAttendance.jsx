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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
                <Card className="border-none bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-[2rem] shadow-xl shadow-green-200 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-green-300 hover:-translate-y-2 hover:scale-105">
                    <p className="text-xs font-black opacity-90 uppercase tracking-widest mb-1">Present</p>
                    <p className="text-3xl font-black">42</p>
                </Card>
                <Card className="border-none bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-[2rem] shadow-xl shadow-amber-200 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-amber-300 hover:-translate-y-2 hover:scale-105">
                    <p className="text-xs font-black opacity-90 uppercase tracking-widest mb-1">Late</p>
                    <p className="text-3xl font-black">5</p>
                </Card>
                <Card className="border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-[2rem] shadow-xl shadow-blue-200 cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-blue-300 hover:-translate-y-2 hover:scale-105">
                    <p className="text-xs font-black opacity-90 uppercase tracking-widest mb-1">On Leave</p>
                    <p className="text-3xl font-black">2</p>
                </Card>
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
