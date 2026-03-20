import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiCheck, FiArrowUpCircle, FiLoader } from 'react-icons/fi';
import { Card, Table } from '../../components/ui';
import { studentAPI } from '../../services/api';

const StudentPromotion = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promoting, setPromoting] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [selectedSection, setSelectedSection] = useState('All Sections');
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isSectionOpen, setIsSectionOpen] = useState(false);

    const classes = ['All Classes', 'LKG', 'UKG', '1st Std', '2nd Std', '3rd Std', '4th Std', '5th Std', '6th Std', '7th Std', '8th Std', '9th Std', '10th Std', '11th Std', '12th Std'];
    const sections = ['All Sections', 'A', 'B', 'C', 'D', 'E'];

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await studentAPI.getAll();
            const formatted = res.data.map(s => ({
                ...s,
                name: `${s.firstName} ${s.lastName}`
            }));
            setStudents(formatted);
        } catch (err) {
            console.error('Failed to fetch students:', err);
        } finally {
            setLoading(false);
        }
    };

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

    const handlePromote = async () => {
        if (!selectedStudents.length) return;
        
        setPromoting(true);
        try {
            await studentAPI.promote(selectedStudents);
            setSelectedStudents([]);
            await fetchStudents(); // Refresh list
            alert('Students promoted successfully!');
        } catch (err) {
            console.error('Promotion failed:', err);
            alert('Promotion failed. Please try again.');
        } finally {
            setPromoting(false);
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
            render: (row) => <span className="font-bold text-slate-800">{row.name}</span>,
        },
        {
            header: 'Current Class',
            accessor: 'class',
            render: (row) => <span className="px-3 py-1 bg-blue-50 text-[#0047AB] rounded-full text-xs font-black uppercase">{row.class}</span>
        },
        {
            header: 'Section',
            accessor: 'section',
            render: (row) => <span className="font-bold text-slate-500">{row.section}</span>
        },
    ];

    // Filter Logic
    const studentData = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
            student.studentId.toLowerCase().includes(search.toLowerCase());
        const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
        const matchesSection = selectedSection === 'All Sections' || student.section === selectedSection;
        return matchesSearch && matchesClass && matchesSection;
    });

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-3">
                        <FiArrowUpCircle className="text-[#0047AB]" /> Bulk Student Promotion
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Academic year transition management</p>
                </div>
                <button
                    onClick={handlePromote}
                    disabled={selectedStudents.length === 0 || promoting}
                    className={`px-10 py-4 rounded-xl font-black transition-all shadow-xl flex items-center gap-3 ${selectedStudents.length > 0 && !promoting
                        ? 'bg-[#0047AB] text-white hover:bg-[#003580] shadow-blue-100 active:scale-95'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                >
                    {promoting ? <FiLoader className="animate-spin" /> : null}
                    {promoting ? 'Promoting...' : `Promote Selected (${selectedStudents.length})`}
                </button>
            </div>

            {/* Content Card */}
            <Card className="bg-white border-none shadow-[0_4px_25px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 overflow-hidden">
                <div className="mb-8 space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[300px]">
                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name or student ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-[15px] font-bold text-slate-900 placeholder-slate-400 focus:border-[#0047AB] focus:bg-white transition-all outline-none"
                            />
                        </div>

                        {/* Class Dropdown */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => {
                                    setIsClassOpen(!isClassOpen);
                                    setIsSectionOpen(false);
                                }}
                                className="flex items-center justify-between gap-6 bg-slate-50 border-2 border-transparent hover:border-slate-200 px-8 py-4 rounded-2xl font-black text-slate-700 text-sm min-w-[180px] transition-all"
                            >
                                {selectedClass}
                                <FiChevronDown className={`transition-transform duration-300 text-[#0047AB] ${isClassOpen ? 'rotate-180' : ''}`} size={18} />
                            </button>
                            {isClassOpen && (
                                <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] max-h-[350px] overflow-y-auto animate-in fade-in zoom-in duration-200">
                                    {classes.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setSelectedClass(c);
                                                setIsClassOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-3 text-sm font-black transition-colors hover:bg-slate-50 ${selectedClass === c ? 'text-[#0047AB] bg-blue-50/50' : 'text-slate-500'}`}
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
                                className="flex items-center justify-between gap-6 bg-slate-50 border-2 border-transparent hover:border-slate-200 px-8 py-4 rounded-2xl font-black text-slate-700 text-sm min-w-[180px] transition-all"
                            >
                                {selectedSection}
                                <FiChevronDown className={`transition-transform duration-300 text-[#0047AB] ${isSectionOpen ? 'rotate-180' : ''}`} size={18} />
                            </button>
                            {isSectionOpen && (
                                <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] animate-in fade-in zoom-in duration-200">
                                    {sections.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                setSelectedSection(s);
                                                setIsSectionOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-3 text-sm font-black transition-colors hover:bg-slate-50 ${selectedSection === s ? 'text-[#0047AB] bg-blue-50/50' : 'text-slate-500'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-4 px-2">
                        <div className="px-4 py-1.5 bg-blue-50 text-[#0047AB] rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm shadow-blue-50">
                            Total: {studentData.length} Students
                        </div>
                    </div>
                </div>

                {/* Table Component */}
                <div className="relative">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <FiLoader className="text-[#0047AB] animate-spin" size={40} />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing student database...</p>
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={studentData}
                            className="border-none"
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default StudentPromotion;
