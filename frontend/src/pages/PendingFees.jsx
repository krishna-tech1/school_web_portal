import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiBell } from 'react-icons/fi';
import { Card, Table } from '../components/ui';

const PendingFees = () => {
    const [search, setSearch] = useState('');
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [selectedSection, setSelectedSection] = useState('All Sections');
    const [selectedStatus, setSelectedStatus] = useState('Unpaid');

    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isSectionOpen, setIsSectionOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const classes = ['All Classes', '10th Std', '9th Std', '8th Std', 'LKG', 'UKG'];
    const sections = ['All Sections', 'A', 'B', 'C', 'D'];
    const statuses = ['All Status', 'Unpaid', 'Pending', 'Overdue'];

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

    const pendingData = [
        { id: 'STU001', name: 'Rahul Sharma', class: '10 - A', amount: '15,000', dueDate: '20/12/2024', status: 'Overdue' },
        { id: 'STU002', name: 'Priya Verma', class: '10 - B', amount: '15,000', dueDate: '30/12/2024', status: 'Pending' },
        { id: 'STU003', name: 'Arjun Singh', class: '10 - A', amount: '15,000', dueDate: '20/12/2024', status: 'Overdue' },
        { id: 'STU004', name: 'Anita Roy', class: '9 - A', amount: '12,000', dueDate: '15/12/2024', status: 'Overdue' },
        { id: 'STU005', name: 'Sahil Varma', class: '10 - C', amount: '15,000', dueDate: '20/12/2024', status: 'Overdue' },
        { id: 'STU006', name: 'Dr. Amitabh', class: '10 - A', amount: '15,000', dueDate: '20/12/2024', status: 'Overdue' },
    ];

    const columns = [
        { header: 'Student ID', accessor: 'id' },
        { header: 'Name', accessor: 'name', render: (row) => <span className="font-bold text-slate-700">{row.name}</span> },
        { header: 'Class', accessor: 'class' },
        { header: 'Amount', accessor: 'amount', render: (row) => <span className="font-bold">₹{row.amount}</span> },
        { header: 'Due Date', accessor: 'dueDate' },
        {
            header: 'Status',
            render: (row) => (
                <div className={`px-4 py-1.5 rounded-lg text-xs font-black text-center inline-block min-w-[90px] ${row.status === 'Overdue' ? 'bg-[#ef4444] text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                    {row.status}
                </div>
            )
        },
        {
            header: 'Actions',
            render: (row) => (
                <button className="bg-[#0047AB] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#003580] transition-all">
                    Send Reminder
                </button>
            )
        }
    ];

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-[11px] font-black tracking-widest text-[#0047AB] uppercase leading-none">Pending Fees</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 md:gap-0 px-2 transition-all">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Fee Collections</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] animate-pulse"></span>
                        <p className="text-slate-500 font-black text-[13px] uppercase tracking-widest">Action Required: {pendingData.length} Outstanding Payments</p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-end gap-4 w-full md:w-auto">
                    <div className="relative group/drop" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsClassOpen(!isClassOpen)}
                            className="bg-white border-2 border-slate-100 text-slate-900 px-8 py-4 rounded-[1.25rem] font-black text-xs uppercase tracking-widest flex items-center justify-between gap-6 hover:border-[#0047AB]/20 transition-all shadow-sm min-w-[160px]"
                        >
                            {selectedClass} <FiChevronDown className={`transition-transform duration-500 ${isClassOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isClassOpen && (
                            <div className="absolute top-[calc(100%+12px)] right-0 w-full md:w-56 bg-white rounded-2xl shadow-2xl z-50 py-3 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5">
                                {classes.map(c => (
                                    <button key={c} onClick={() => { setSelectedClass(c); setIsClassOpen(false) }} className={`w-full text-left px-6 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedClass === c ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}>{c}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative group/drop" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsSectionOpen(!isSectionOpen)}
                            className="bg-white border-2 border-slate-100 text-slate-900 px-8 py-4 rounded-[1.25rem] font-black text-xs uppercase tracking-widest flex items-center justify-between gap-6 hover:border-[#0047AB]/20 transition-all shadow-sm min-w-[160px]"
                        >
                            {selectedSection} <FiChevronDown className={`transition-transform duration-500 ${isSectionOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isSectionOpen && (
                            <div className="absolute top-[calc(100%+12px)] right-0 w-full md:w-56 bg-white rounded-2xl shadow-2xl z-50 py-3 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5">
                                {sections.map(s => (
                                    <button key={s} onClick={() => { setSelectedSection(s); setIsSectionOpen(false) }} className={`w-full text-left px-6 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedSection === s ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}>{s}</button>
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
                            placeholder="Search by student name or ID..."
                            className="w-full pl-16 pr-6 py-4.5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] text-[15px] font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none placeholder:text-slate-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 group/drop" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className="w-full bg-[#0047AB] hover:bg-[#003580] text-white px-8 py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-between min-w-[180px] shadow-lg shadow-blue-200/50 transition-all hover:-translate-y-1 active:scale-95"
                            >
                                {selectedStatus} <FiChevronDown className={`ml-4 transition-transform duration-500 ${isStatusOpen ? 'rotate-180' : ''}`} size={18} />
                            </button>
                            {isStatusOpen && (
                                <div className="absolute top-[calc(100%+12px)] right-0 w-full bg-white rounded-2xl shadow-2xl z-50 py-3 border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5">
                                    {statuses.map(s => (
                                        <button key={s} onClick={() => { setSelectedStatus(s); setIsStatusOpen(false) }} className={`w-full text-left px-6 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedStatus === s ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}>{s}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="flex-1 bg-slate-900 hover:bg-black text-white px-8 py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-slate-200/50 whitespace-nowrap leading-none">
                            <FiBell size={18} /> Send Reminder All
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden mt-2 border-t border-slate-50 pt-8 rounded-2xl">
                    <Table
                        columns={columns}
                        data={pendingData}
                        className="border-none"
                    />
                </div>
            </Card>
        </div>
    );
};

export default PendingFees;
