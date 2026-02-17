import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiChevronDown } from 'react-icons/fi';
import { Card, Table } from '../components/ui';

const FeeStructure = () => {
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [isClassOpen, setIsClassOpen] = useState(false);

    const classes = ['All Classes', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsClassOpen(false);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const baseFeeStructure = [
        { class: 'Class 1', tuitionFee: 15000, admissionFee: 5000, examFee: 2000, labFee: 0, libraryFee: 1000, sportsFee: 1500, total: 24500 },
        { class: 'Class 2', tuitionFee: 15000, admissionFee: 5000, examFee: 2000, labFee: 0, libraryFee: 1000, sportsFee: 1500, total: 24500 },
        { class: 'Class 3', tuitionFee: 16000, admissionFee: 5000, examFee: 2500, labFee: 0, libraryFee: 1000, sportsFee: 1500, total: 26000 },
        { class: 'Class 4', tuitionFee: 16000, admissionFee: 5000, examFee: 2500, labFee: 0, libraryFee: 1000, sportsFee: 1500, total: 26000 },
        { class: 'Class 5', tuitionFee: 17000, admissionFee: 5000, examFee: 2500, labFee: 1000, libraryFee: 1000, sportsFee: 1500, total: 28000 },
        { class: 'Class 6', tuitionFee: 18000, admissionFee: 5000, examFee: 3000, labFee: 1500, libraryFee: 1000, sportsFee: 1500, total: 30000 },
        { class: 'Class 7', tuitionFee: 18000, admissionFee: 5000, examFee: 3000, labFee: 1500, libraryFee: 1000, sportsFee: 1500, total: 30000 },
        { class: 'Class 8', tuitionFee: 19000, admissionFee: 5000, examFee: 3000, labFee: 2000, libraryFee: 1000, sportsFee: 1500, total: 31500 },
        { class: 'Class 9', tuitionFee: 20000, admissionFee: 5000, examFee: 3500, labFee: 2500, libraryFee: 1000, sportsFee: 1500, total: 33500 },
        { class: 'Class 10', tuitionFee: 20000, admissionFee: 5000, examFee: 3500, labFee: 2500, libraryFee: 1000, sportsFee: 1500, total: 33500 },
        { class: 'Class 11', tuitionFee: 22000, admissionFee: 5000, examFee: 4000, labFee: 3000, libraryFee: 1500, sportsFee: 1500, total: 37000 },
        { class: 'Class 12', tuitionFee: 22000, admissionFee: 5000, examFee: 4000, labFee: 3000, libraryFee: 1500, sportsFee: 1500, total: 37000 },
    ];

    // Filter Logic
    const feeStructure = baseFeeStructure.filter(fee => {
        return selectedClass === 'All Classes' || fee.class === selectedClass;
    });

    const columns = [
        {
            header: 'Class',
            accessor: 'class',
            render: (row) => <span className="font-black text-slate-900">{row.class}</span>,
        },
        {
            header: 'Tuition Fee',
            render: (row) => <span className="font-bold text-slate-700">₹{row.tuitionFee.toLocaleString()}</span>,
        },
        {
            header: 'Admission Fee',
            render: (row) => <span className="font-bold text-slate-700">₹{row.admissionFee.toLocaleString()}</span>,
        },
        {
            header: 'Exam Fee',
            render: (row) => <span className="font-bold text-slate-700">₹{row.examFee.toLocaleString()}</span>,
        },
        {
            header: 'Lab Fee',
            render: (row) => <span className="font-bold text-slate-700">₹{row.labFee.toLocaleString()}</span>,
        },
        {
            header: 'Library Fee',
            render: (row) => <span className="font-bold text-slate-700">₹{row.libraryFee.toLocaleString()}</span>,
        },
        {
            header: 'Sports Fee',
            render: (row) => <span className="font-bold text-slate-700">₹{row.sportsFee.toLocaleString()}</span>,
        },
        {
            header: 'Total Annual Fee',
            render: (row) => (
                <span className="font-black text-[#0047AB] text-base">₹{row.total.toLocaleString()}</span>
            ),
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-[#0047AB]">
                        <FiEdit2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500">
                        <FiTrash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-[11px] font-black tracking-widest text-[#0047AB] uppercase">Fee Structure</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 md:gap-0 px-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Fee Structure</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
                        <p className="text-[#0047AB] font-black text-[13px] uppercase tracking-widest">Academic Year: 2024-2025</p>
                    </div>
                </div>
                <button
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#0047AB] hover:bg-[#003580] text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-blue-200/50 transition-all hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-widest"
                >
                    <FiPlus size={20} />
                    Add New Fee Structure
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2rem] p-8 bg-gradient-to-br from-blue-50 to-white ring-1 ring-slate-100">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Lowest Fee</p>
                    <p className="text-3xl font-black text-[#0047AB]">₹24,500</p>
                    <p className="text-xs font-bold text-slate-400 mt-1">Class 1-2</p>
                </Card>
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2rem] p-8 bg-gradient-to-br from-purple-50 to-white ring-1 ring-slate-100">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Highest Fee</p>
                    <p className="text-3xl font-black text-[#D946EF]">₹37,000</p>
                    <p className="text-xs font-bold text-slate-400 mt-1">Class 11-12</p>
                </Card>
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2rem] p-8 bg-gradient-to-br from-green-50 to-white ring-1 ring-slate-100">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Average Fee</p>
                    <p className="text-3xl font-black text-[#10B981]">₹29,708</p>
                    <p className="text-xs font-bold text-slate-400 mt-1">Across all classes</p>
                </Card>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[3rem] shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-6 md:p-10 mb-6 group transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.05)] ring-1 ring-slate-100">
                <div className="flex flex-wrap items-center gap-6 mb-8">
                    {/* Class Dropdown */}
                    <div className="relative flex-1 md:flex-none group/drop" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsClassOpen(!isClassOpen)}
                            className="w-full flex items-center justify-between gap-8 bg-slate-50 border-2 border-slate-50 text-slate-900 px-8 py-4.5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest min-w-[220px] hover:bg-white hover:border-[#0047AB]/20 transition-all"
                        >
                            {selectedClass}
                            <FiChevronDown className={`transition-transform duration-500 ${isClassOpen ? 'rotate-180' : ''}`} size={18} />
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
                                        className={`w-full text-left px-6 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedClass === c ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-right">
                        <p className="text-sm font-bold text-slate-500">Showing {feeStructure.length} of {baseFeeStructure.length} classes</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="border-t border-slate-50 pt-8 overflow-x-auto rounded-2xl">
                    <Table
                        columns={columns}
                        data={feeStructure}
                        className="border-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default FeeStructure;
