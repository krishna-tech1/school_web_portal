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
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Manage staff profiles</h1>
                    <p className="text-[#0047AB] font-black text-sm uppercase tracking-wider mt-4">Showing {staffList.length} staff members</p>
                </div>
                <button
                    onClick={() => navigate('/staff/add')}
                    className="flex items-center gap-2 bg-[#0047AB] hover:bg-[#003580] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                    <FiPlus size={20} />
                    Add Staff
                </button>
            </div>

            {/* Filters Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-50 p-6 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[300px]">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0047AB] transition-all"
                        />
                    </div>

                    {/* Staff Type Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => {
                                setIsTypeOpen(!isTypeOpen);
                                setIsDeptOpen(false);
                            }}
                            className="flex items-center justify-between gap-8 bg-[#f3f4f6] text-slate-900 px-6 py-3 rounded-xl font-bold text-sm min-w-[170px] hover:bg-slate-200 transition-all"
                        >
                            {selectedType}
                            <FiChevronDown className={`transition-transform duration-300 ${isTypeOpen ? 'rotate-180' : ''}`} size={18} />
                        </button>
                        {isTypeOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                                {staffTypes.map(t => (
                                    <button
                                        key={t}
                                        onClick={() => {
                                            setSelectedType(t);
                                            setIsTypeOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors hover:bg-slate-50 ${selectedType === t ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Department Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => {
                                setIsDeptOpen(!isDeptOpen);
                                setIsTypeOpen(false);
                            }}
                            className="flex items-center justify-between gap-8 bg-[#f3f4f6] text-slate-900 px-6 py-3 rounded-xl font-bold text-sm min-w-[170px] hover:bg-slate-200 transition-all"
                        >
                            {selectedDept}
                            <FiChevronDown className={`transition-transform duration-300 ${isDeptOpen ? 'rotate-180' : ''}`} size={18} />
                        </button>
                        {isDeptOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-[100] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300">
                                {departments.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => {
                                            setSelectedDept(d);
                                            setIsDeptOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors hover:bg-slate-50 ${selectedDept === d ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="mt-8 border-t border-slate-50 pt-2">
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
