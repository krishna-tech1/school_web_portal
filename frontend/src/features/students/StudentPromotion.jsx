import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiCheck } from 'react-icons/fi';
import { Card, Table } from '../../components/ui';

const StudentPromotion = () => {
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [selectedSection, setSelectedSection] = useState('All Sections');
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isSectionOpen, setIsSectionOpen] = useState(false);

    const classes = ['All Classes', 'LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `${i + 1}${getSuffix(i + 1)} Std`)];
    const sections = ['All Sections', 'A', 'B', 'C', 'D', 'E'];

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
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleStudentSelection = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };

    const columns = [
        {
            header: 'Select',
            render: (row) => (
                <div className="flex justify-center">
                    <div
                        onClick={() => toggleStudentSelection(row.studentId)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${selectedStudents.includes(row.studentId)
                            ? 'bg-[#0047AB] border-[#0047AB]'
                            : 'bg-white border-slate-200 hover:border-[#0047AB]'
                            }`}
                    >
                        {selectedStudents.includes(row.studentId) && <FiCheck className="text-white" size={14} />}
                    </div>
                </div>
            ),
        },
        {
            header: 'Student ID',
            accessor: 'studentId',
        },
        {
            header: 'Name',
            accessor: 'name',
            render: (row) => <span className="font-semibold text-slate-700">{row.name}</span>,
        },
        {
            header: 'Current Class',
            accessor: 'class',
        },
        {
            header: 'Section',
            accessor: 'section',
        },
    ];

    const baseData = [
        { studentId: 'STU001', name: 'Rahul Sharma', class: '10th Std', section: 'A' },
        { studentId: 'STU002', name: 'Arjun Verma', class: '10th Std', section: 'B' },
        { studentId: 'STU003', name: 'Sana Khan', class: '10th Std', section: 'A' },
        { studentId: 'STU004', name: 'Rohan Mehra', class: '10th Std', section: 'C' },
        { studentId: 'STU005', name: 'Ishita Roy', class: '10th Std', section: 'B' },
        { studentId: 'STU006', name: 'Amit Singh', class: '10th Std', section: 'A' },
        { studentId: 'STU007', name: 'Neha Gupta', class: '10th Std', section: 'D' },
    ];

    // Filter Logic
    const studentData = baseData.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
            student.studentId.toLowerCase().includes(search.toLowerCase());
        const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
        const matchesSection = selectedSection === 'All Sections' || student.section === selectedSection;
        return matchesSearch && matchesClass && matchesSection;
    });

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Select Students for Promotion</h1>
                    <p className="text-slate-500 font-medium font-inter">Check students to promote to next class</p>
                    <p className="text-[#0047AB] font-black text-sm uppercase tracking-wider mt-6">Total {studentData.length} Students</p>
                </div>
                <button
                    disabled={selectedStudents.length === 0}
                    className={`px-8 py-3 rounded-xl font-bold transition-all ${selectedStudents.length > 0
                        ? 'bg-[#0047AB] text-white hover:bg-[#003580] shadow-lg shadow-blue-100 active:scale-95'
                        : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                        }`}
                >
                    Promote Selected ({selectedStudents.length})
                </button>
            </div>

            {/* Filters */}
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

                    {/* Class Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => {
                                setIsClassOpen(!isClassOpen);
                                setIsSectionOpen(false);
                            }}
                            className="flex items-center justify-between gap-8 bg-[#0047AB] text-white px-6 py-3 rounded-xl font-bold text-sm min-w-[160px] shadow-md hover:bg-[#003580] transition-all"
                        >
                            {selectedClass}
                            <FiChevronDown className={`transition-transform duration-300 ${isClassOpen ? 'rotate-180' : ''}`} size={18} />
                        </button>
                        {isClassOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-[100] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300">
                                {classes.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => {
                                            setSelectedClass(c);
                                            setIsClassOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors hover:bg-slate-50 ${selectedClass === c ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section Dropdown */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => {
                                setIsSectionOpen(!isSectionOpen);
                                setIsClassOpen(false);
                            }}
                            className="flex items-center justify-between gap-8 bg-[#0047AB] text-white px-6 py-3 rounded-xl font-bold text-sm min-w-[160px] shadow-md hover:bg-[#003580] transition-all"
                        >
                            {selectedSection}
                            <FiChevronDown className={`transition-transform duration-300 ${isSectionOpen ? 'rotate-180' : ''}`} size={18} />
                        </button>
                        {isSectionOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                                {sections.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            setSelectedSection(s);
                                            setIsSectionOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors hover:bg-slate-50 ${selectedSection === s ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {s}
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
                        data={studentData}
                        className="border-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentPromotion;
