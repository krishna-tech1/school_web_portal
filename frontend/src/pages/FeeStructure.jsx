import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronDown, FiBookOpen } from 'react-icons/fi';
import { Card, Table } from '../components/ui';

const FeeStructure = () => {
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [search, setSearch] = useState('');

    const classes = ['All Classes', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `${i + 1}${getSuffix(i + 1)} Std`)];

    function getSuffix(num) {
        if (num === 1) return 'st';
        if (num === 2) return 'nd';
        if (num === 3) return 'rd';
        return 'th';
    }

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = () => setIsClassOpen(false);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const feeStructures = [
        { class: '10th Std', tuition: '30,000', lab: '5,000', sports: '2,000', library: '1,000', total: '38,000' },
        { class: '9th Std', tuition: '28,000', lab: '4,000', sports: '2,000', library: '1,000', total: '35,000' },
        { class: '8th Std', tuition: '25,000', lab: '3,000', sports: '2,000', library: '1,000', total: '31,000' },
        { class: 'LKG', tuition: '15,000', lab: '0', sports: '1,000', library: '500', total: '16,500' },
        { class: 'UKG', tuition: '18,000', lab: '0', sports: '1,000', library: '500', total: '19,500' },
    ];

    const filteredData = feeStructures.filter(item => {
        const matchesClass = selectedClass === 'All Classes' || item.class === selectedClass;
        const matchesSearch = item.class.toLowerCase().includes(search.toLowerCase());
        return matchesClass && matchesSearch;
    });

    const columns = [
        { header: 'Class', accessor: 'class', render: (row) => <span className="font-bold text-slate-700">{row.class}</span> },
        { header: 'Tuition Fee (₹)', accessor: 'tuition' },
        { header: 'Lab Fee (₹)', accessor: 'lab' },
        { header: 'Sports Fee (₹)', accessor: 'sports' },
        { header: 'Library Fee (₹)', accessor: 'library' },
        { header: 'Total (₹)', accessor: 'total', render: (row) => <span className="font-bold text-[#0047AB]">₹ {row.total}</span> },
        {
            header: 'Actions',
            render: () => (
                <div className="flex gap-3">
                    <button className="p-2 hover:bg-blue-50 text-[#0047AB] rounded-lg transition-colors"><FiEdit2 size={16} /></button>
                    <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><FiTrash2 size={16} /></button>
                </div>
            )
        }
    ];

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Fee Structure</h1>
                    <p className="text-slate-500 font-medium">Manage and define fee breakdowns for all classes</p>
                </div>
                <button className="flex items-center gap-2 bg-[#0047AB] hover:bg-[#003580] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
                    <FiPlus size={20} />
                    Add New Structure
                </button>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm rounded-[2rem] p-8 bg-white mb-8">
                <div className="flex flex-wrap gap-6 items-center">
                    <div className="relative flex-1 min-w-[300px]">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search class..."
                            className="w-full pl-14 pr-6 py-4 bg-[#F1F5F9] border-none rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-[#0047AB] transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsClassOpen(!isClassOpen)}
                            className="flex items-center justify-between gap-12 bg-[#F1F5F9] text-slate-900 px-8 py-4 rounded-2xl font-bold min-w-[200px] hover:bg-slate-200 transition-all"
                        >
                            {selectedClass}
                            <FiChevronDown className={`transition-transform duration-300 ${isClassOpen ? 'rotate-180' : ''}`} size={20} />
                        </button>
                        {isClassOpen && (
                            <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-500">
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
                </div>
            </Card>

            {/* Table */}
            <Card className="border-none shadow-sm rounded-[2rem] p-8 bg-white overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#0047AB]">
                        <FiBookOpen size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Academic Year 2024-25</h2>
                </div>
                <Table
                    columns={columns}
                    data={filteredData}
                    className="border-none"
                />
            </Card>
        </div>
    );
};

export default FeeStructure;
