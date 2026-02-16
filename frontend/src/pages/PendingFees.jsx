import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiMail, FiBell } from 'react-icons/fi';
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
        <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 gap-6 md:gap-0 text-center md:text-left">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1">Pending Fees</h1>
                    <p className="text-slate-500 font-bold text-xs md:text-sm uppercase tracking-wide">Students with pending payments</p>
                </div>
                <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsClassOpen(!isClassOpen)}
                            className="w-full bg-[#0047AB] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-between gap-4 hover:bg-[#003580] transition-all text-sm md:text-base"
                        >
                            {selectedClass} <FiChevronDown />
                        </button>
                        {isClassOpen && (
                            <div className="absolute top-full right-0 mt-2 w-full md:w-48 bg-white rounded-xl shadow-xl z-50 py-2 border border-slate-100">
                                {classes.map(c => (
                                    <button key={c} onClick={() => { setSelectedClass(c); setIsClassOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-slate-50">{c}</button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative flex-1 md:flex-none" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsSectionOpen(!isSectionOpen)}
                            className="w-full bg-[#0047AB] text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-between gap-4 hover:bg-[#003580] transition-all text-sm md:text-base"
                        >
                            {selectedSection} <FiChevronDown />
                        </button>
                        {isSectionOpen && (
                            <div className="absolute top-full right-0 mt-2 w-full md:w-48 bg-white rounded-xl shadow-xl z-50 py-2 border border-slate-100">
                                {sections.map(s => (
                                    <button key={s} onClick={() => { setSelectedSection(s); setIsSectionOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-slate-50">{s}</button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-sm rounded-[2rem] p-4 md:p-10 bg-white">
                <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center mb-8 md:mb-10 gap-6">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-[#0047AB] transition-all text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className="w-full bg-[#0047AB] text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-between min-w-[140px] hover:bg-[#003580] transition-all text-sm"
                            >
                                {selectedStatus} <FiChevronDown className="ml-4" />
                            </button>
                            {isStatusOpen && (
                                <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-xl z-50 py-2 border border-slate-100">
                                    {statuses.map(s => (
                                        <button key={s} onClick={() => { setSelectedStatus(s); setIsStatusOpen(false) }} className="w-full text-left px-4 py-2.5 text-sm font-bold hover:bg-slate-50">{s}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="flex-1 bg-[#0047AB] text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#003580] transition-all text-sm whitespace-nowrap">
                            <FiBell /> Send Reminder All
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden">
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
