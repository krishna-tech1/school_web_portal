import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiBell, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { Card, Table } from '../components/ui';
import { studentAPI, feeAPI, notificationAPI } from '../services/api';
import { toast } from 'react-toastify';

const PendingFees = () => {
    const [search, setSearch] = useState('');
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [selectedSection, setSelectedSection] = useState('All Sections');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isSectionOpen, setIsSectionOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const classes = ['All Classes', 'LKG', 'UKG', '1st Std', '2nd Std', '3rd Std', '4th Std', '5th Std', '6th Std', '7th Std', '8th Std', '9th Std', '10th Std', '11th Std', '12th Std'];
    const sections = ['All Sections', 'A', 'B', 'C', 'D', 'E'];
    const statuses = ['All Status', 'Overdue', 'Pending', 'Paid'];

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await studentAPI.getAll();
            setStudents(res.data || res); 
        } catch (err) {
            console.error('Failed to fetch students:', err);
            toast.error('Failed to load student data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsClassOpen(false);
            setIsSectionOpen(false);
            setIsStatusOpen(false);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleMarkPaid = async (student) => {
        try {
            await studentAPI.update(student.studentId, {
                ...student,
                feeStatus: 'Paid',
                pendingFee: 0
            });
            toast.success(`${student.firstName}'s fees marked as Paid`);
            fetchStudents();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update fee status');
        }
    };

    const handleMarkOverdue = async (student) => {
        try {
            await studentAPI.update(student.studentId, {
                ...student,
                feeStatus: 'Overdue'
            });
            toast.success(`${student.firstName}'s fees marked as Overdue`);
            fetchStudents();
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemind = async (student) => {
        try {
            // Find the deadline for this student's class
            const res = await feeAPI.getAll();
            const classFees = (res.data || res).filter(f => f.class_name === student.class && f.due_date);
            const firstDeadline = classFees.length > 0 
                ? new Date(Math.min(...classFees.map(f => new Date(f.due_date))))
                : null;
                
            const dateStr = firstDeadline ? firstDeadline.toLocaleDateString() : 'near target';
            let message = '';
            
            if (student.feeStatus === 'Overdue') {
                message = `Your fee last date is over. Please pay the fee as soon as possible.`;
            } else {
                message = `Your fee last date is ${dateStr}. Please pay the fees timely.`;
            }
            
            await notificationAPI.create({
                userId: student.studentId,
                message: message,
                type: student.feeStatus === 'Overdue' ? 'error' : 'warning'
            });
            
            toast.success(`Reminder sent to ${student.firstName}`);
        } catch (err) {
            console.error('Failed to send reminder:', err);
            toast.error('Could not send notification');
        }
    };

    const filteredData = Array.isArray(students) ? students.filter(s => {
        const matchesSearch = (s.firstName + ' ' + s.lastName).toLowerCase().includes(search.toLowerCase()) || 
                             s.studentId.toLowerCase().includes(search.toLowerCase());
        const matchesClass = selectedClass === 'All Classes' || s.class === selectedClass;
        const matchesSection = selectedSection === 'All Sections' || s.section === selectedSection;
        const matchesStatus = selectedStatus === 'All Status' || s.feeStatus === selectedStatus;
        return matchesSearch && matchesClass && matchesSection && matchesStatus;
    }) : [];

    const columns = [
        { header: 'Student ID', accessor: 'studentId' },
        { header: 'Name', render: (row) => <span className="font-bold text-slate-700">{row.firstName} {row.lastName}</span> },
        { header: 'Class', render: (row) => <span>{row.class} - {row.section}</span> },
        { header: 'Pending', accessor: 'pendingFee', render: (row) => <span className="font-bold">₹{row.pendingFee?.toLocaleString() || 0}</span> },
        {
            header: 'Status',
            render: (row) => (
                <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest text-center inline-block min-w-[100px] uppercase shadow-sm ${
                    row.feeStatus === 'Overdue' ? 'bg-[#EF4444] text-white' : 
                    row.feeStatus === 'Paid' ? 'bg-[#10B981] text-white' : 
                    'bg-amber-400 text-white'
                }`}>
                    {row.feeStatus || 'Pending'}
                </div>
            )
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    {row.feeStatus !== 'Paid' && (
                        <>
                            <button 
                                onClick={() => handleMarkPaid(row)}
                                className="bg-[#10B981] text-white p-2 rounded-lg hover:bg-[#059669] transition-all"
                                title="Mark as Paid"
                            >
                                <FiCheckCircle size={18} />
                            </button>
                            {row.feeStatus === 'Pending' && (
                                <button 
                                    onClick={() => handleMarkOverdue(row)}
                                    className="bg-slate-100 text-[#0047AB] p-2 rounded-lg hover:bg-slate-200 transition-all font-bold text-[10px] px-3 uppercase tracking-widest"
                                    title="Set Overdue"
                                >
                                    Mark Overdue
                                </button>
                            )}
                            <button 
                                onClick={() => handleRemind(row)}
                                className="bg-[#0047AB] text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-[#003580] transition-all"
                            >
                                Remind
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 md:gap-0 px-2 transition-all">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase">Fee Management</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] animate-pulse"></span>
                        <p className="text-slate-500 font-black text-[13px] uppercase tracking-widest">
                            {loading ? 'Syncing...' : `${filteredData.length} Students Listed`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-4 w-full md:w-auto">
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsClassOpen(!isClassOpen)}
                            className="bg-white border-2 border-slate-100 text-slate-900 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-between gap-6 hover:border-[#0047AB]/20 transition-all shadow-sm"
                        >
                            {selectedClass} <FiChevronDown className={`transition-transform duration-500 ${isClassOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isClassOpen && (
                            <div className="absolute top-[calc(100%+12px)] right-0 w-56 bg-white rounded-2xl shadow-2xl z-50 py-3 border border-slate-100 animate-in translate-y-2 duration-300 max-h-[300px] overflow-auto custom-scrollbar">
                                {classes.map(c => (
                                    <button key={c} onClick={() => { setSelectedClass(c); setIsClassOpen(false) }} className={`w-full text-left px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedClass === c ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}>{c}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                            className="bg-[#0047AB] text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-between gap-6 shadow-xl shadow-blue-100 transition-all"
                        >
                            {selectedStatus} <FiChevronDown className={`transition-transform duration-500 ${isStatusOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isStatusOpen && (
                            <div className="absolute top-[calc(100%+12px)] right-0 w-56 bg-white rounded-2xl shadow-2xl z-50 py-3 border border-slate-100 animate-in translate-y-2 duration-300">
                                {statuses.map(s => (
                                    <button key={s} onClick={() => { setSelectedStatus(s); setIsStatusOpen(false) }} className={`w-full text-left px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedStatus === s ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}>{s}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <Card className="border-none shadow-[0_15px_50px_rgba(0,0,0,0.03)] rounded-[3rem] p-6 md:p-10 bg-white ring-1 ring-slate-100">
                <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center mb-10 gap-8">
                    <div className="relative flex-1 group/search">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-[#0047AB] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Find by name or student ID..."
                            className="w-full pl-16 pr-6 py-4.5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-[15px] font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-hidden mt-2 pt-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <FiLoader className="text-[#0047AB] animate-spin" size={32} />
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Updating Records...</p>
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={filteredData}
                            className="border-none transition-all"
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default PendingFees;
