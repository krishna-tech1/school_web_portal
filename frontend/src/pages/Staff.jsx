import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEye, FiSearch, FiChevronDown } from 'react-icons/fi';
import { Card, Table } from '../components/ui';

const Staff = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('All Type');
    const [selectedDept, setSelectedDept] = useState('All Department');

    // Dropdown states
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isDeptOpen, setIsDeptOpen] = useState(false);

    const departments = ['All Department', 'Academic', 'Science', 'Mathematics', 'Physical Education', 'Administration', 'Support Staff'];
    const staffTypes = ['All Type', 'Teaching', 'Non-Teaching'];

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsTypeOpen(false);
            setIsDeptOpen(false);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const baseStaff = [
        { staffId: 'STF001', name: 'Dr. Amitabh Bachchan', type: 'Non-Teaching', designation: 'Principal', department: 'Administration' },
        { staffId: 'STF002', name: 'Mrs. Priya Sharma', type: 'Teaching', designation: 'Senior Teacher', department: 'Academic' },
        { staffId: 'STF005', name: 'Mr. Robert D\'Souza', type: 'Teaching', designation: 'P.E. Coach', department: 'Physical Education' },
        { staffId: 'STF009', name: 'Ms. Anita Roy', type: 'Teaching', designation: 'HOD - Mathematics', department: 'Mathematics' },
        { staffId: 'STF012', name: 'Mr. Sahil Varma', type: 'Non-Teaching', designation: 'Lab Assistant', department: 'Science' },
        { staffId: 'STF015', name: 'Mrs. Rekha G.', type: 'Teaching', designation: 'English Teacher', department: 'Academic' },
        { staffId: 'STF018', name: 'Mr. Salman Khan', type: 'Non-Teaching', designation: 'Admin Officer', department: 'Administration' },
    ];

    // Filter Logic
    const staffList = baseStaff.filter(staff => {
        const matchesSearch = staff.name.toLowerCase().includes(search.toLowerCase()) ||
            staff.staffId.toLowerCase().includes(search.toLowerCase());
        const matchesType = selectedType === 'All Type' || staff.type === selectedType;
        const matchesDept = selectedDept === 'All Department' || staff.department === selectedDept;
        return matchesSearch && matchesType && matchesDept;
    });

    const columns = [
        {
            header: 'Staff ID',
            accessor: 'staffId',
        },
        {
            header: 'Name',
            accessor: 'name',
            render: (row) => <span className="font-semibold text-slate-700">{row.name}</span>,
        },
        {
            header: 'Type',
            render: (row) => (
                <div className={`px-4 py-1.5 rounded-lg text-xs font-black text-center inline-block min-w-[100px] ${row.type === 'Teaching'
                    ? 'bg-[#14b8a6] text-white'
                    : 'bg-[#b45309] text-white'
                    }`}>
                    {row.type}
                </div>
            ),
        },
        {
            header: 'Designation',
            accessor: 'designation',
        },
        {
            header: 'Department',
            accessor: 'department',
        },
        {
            header: 'Actions',
            render: (row) => (
                <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <FiEye size={18} />
                </button>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-[11px] font-black tracking-widest text-[#0047AB] uppercase">Manage Staff</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 md:gap-0 px-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Staff Management</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
                        <p className="text-[#0047AB] font-black text-[13px] uppercase tracking-widest">Active Database: {staffList.length} Total Staff</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/staff/add')}
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#0047AB] hover:bg-[#003580] text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-blue-200/50 transition-all hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-widest"
                >
                    <FiPlus size={20} />
                    New Staff Member
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[3rem] shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-6 md:p-10 mb-6 group transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.05)] ring-1 ring-slate-100">
                <div className="flex flex-wrap items-center gap-6">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[300px] group/search">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-[#0047AB] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Find by name, ID or department..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-16 pr-6 py-4.5 bg-slate-50 border-2 border-slate-50 rounded-[1.25rem] text-[15px] font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        {/* Staff Type Dropdown */}
                        <div className="relative flex-1 md:flex-none group/drop" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => {
                                    setIsTypeOpen(!isTypeOpen);
                                    setIsDeptOpen(false);
                                }}
                                className="w-full flex items-center justify-between gap-8 bg-slate-50 border-2 border-slate-50 text-slate-900 px-8 py-4.5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest min-w-[180px] hover:bg-white hover:border-[#0047AB]/20 transition-all"
                            >
                                {selectedType}
                                <FiChevronDown className={`transition-transform duration-500 ${isTypeOpen ? 'rotate-180' : ''}`} size={18} />
                            </button>
                            {isTypeOpen && (
                                <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5">
                                    {staffTypes.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => {
                                                setSelectedType(t);
                                                setIsTypeOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedType === t ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Department Dropdown */}
                        <div className="relative flex-1 md:flex-none group/drop" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => {
                                    setIsDeptOpen(!isDeptOpen);
                                    setIsTypeOpen(false);
                                }}
                                className="w-full flex items-center justify-between gap-8 bg-slate-50 border-2 border-slate-50 text-slate-900 px-8 py-4.5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest min-w-[220px] hover:bg-white hover:border-[#0047AB]/20 transition-all"
                            >
                                {selectedDept}
                                <FiChevronDown className={`transition-transform duration-500 ${isDeptOpen ? 'rotate-180' : ''}`} size={18} />
                            </button>
                            {isDeptOpen && (
                                <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5 custom-scrollbar">
                                    {departments.map(d => (
                                        <button
                                            key={d}
                                            onClick={() => {
                                                setSelectedDept(d);
                                                setIsDeptOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedDept === d ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Refined Table Section */}
                <div className="mt-12 border-t border-slate-50 pt-8 overflow-hidden rounded-2xl">
                    <Table
                        columns={columns}
                        data={staffList}
                        className="border-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default Staff;
