import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiChevronRight, FiSearch, FiChevronDown } from 'react-icons/fi';
import { Button, Card, Table, Modal, Badge } from '../../components/ui';
import StudentForm from './StudentForm';
import { fetchStudents, deleteStudent, setSelectedStudent } from './studentSlice';

const StudentList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { students, loading, error } = useSelector((state) => state.students);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedStudent, setSelectedStudentLocal] = useState(null);

    // Filter states
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

    useEffect(() => {
        dispatch(fetchStudents());
    }, [dispatch]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = () => {
            setIsClassOpen(false);
            setIsSectionOpen(false);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const columns = [
        {
            header: 'Student ID',
            accessor: 'studentId',
        },
        {
            header: 'Name',
            accessor: 'firstName', // Placeholder accessor
            render: (row) => <span className="font-semibold text-slate-700">{row.firstName} {row.lastName}</span>,
        },
        {
            header: 'Class',
            accessor: 'class',
        },
        {
            header: 'Section',
            accessor: 'section',
        },
        {
            header: 'Fee Status',
            render: (row) => (
                <div className={`px-4 py-1.5 rounded-lg text-xs font-black text-center inline-block min-w-[120px] ${row.feeStatus === 'Paid'
                    ? 'bg-[#4ade80] text-white'
                    : 'bg-[#ef4444] text-white'
                    }`}>
                    {row.feeStatus === 'Paid' ? 'Paid' : `₹ ${row.pendingFee || '20000'} pending`}
                </div>
            ),
        },
        {
            header: 'Actions',
            render: (row) => (
                <button
                    onClick={() => navigate(`/students/${row.studentId}`)}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                    <FiEye size={18} />
                </button>
            ),
        },
    ];

    // Mock data for initial state
    const baseData = students.length > 0 ? students : [
        { studentId: 'STU001', firstName: 'Rahul', lastName: 'Sharma', class: '10th Std', section: 'A', feeStatus: 'Pending', pendingFee: '20000' },
        { studentId: 'STU002', firstName: 'Aman', lastName: 'Gupta', class: '10th Std', section: 'B', feeStatus: 'Pending', pendingFee: '20000' },
        { studentId: 'STU003', firstName: 'Sita', lastName: 'Patel', class: '10th Std', section: 'A', feeStatus: 'Paid' },
        { studentId: 'STU004', firstName: 'Vijay', lastName: 'Singh', class: '10th Std', section: 'C', feeStatus: 'Pending', pendingFee: '20000' },
        { studentId: 'STU005', firstName: 'Priya', lastName: 'Reddy', class: '10th Std', section: 'D', feeStatus: 'Paid' },
    ];

    // Filter Logic
    const studentData = baseData.filter(student => {
        const matchesSearch = (student.firstName + ' ' + student.lastName).toLowerCase().includes(search.toLowerCase()) ||
            student.studentId.toLowerCase().includes(search.toLowerCase());
        const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
        const matchesSection = selectedSection === 'All Sections' || student.section === selectedSection;
        return matchesSearch && matchesClass && matchesSection;
    });

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-6">
                <span>Students</span>
                <FiChevronRight size={14} />
                <span className="text-slate-500">Student list</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Manage all student records</h1>
                    <p className="text-[#0047AB] font-black text-sm uppercase tracking-wider mt-4">Total {studentData.length} Students</p>
                </div>
                <button
                    onClick={() => navigate('/students/add')}
                    className="flex items-center gap-2 bg-[#0047AB] hover:bg-[#003580] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                    <FiPlus size={20} />
                    Add Student
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

export default StudentList;
