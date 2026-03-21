import React, { useState, useEffect } from 'react';
import { staffAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEye, FiSearch, FiChevronDown, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { Card, Table } from '../components/ui';

const Staff = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedClass, setSelectedClass] = useState('All Class');
    const [selectedSection, setSelectedSection] = useState('All Section');
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Dropdown states
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isSectionOpen, setIsSectionOpen] = useState(false);

    const classes = ['All Class', 'LKG', 'UKG', ...[...Array(12)].map((_, i) => `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Std`)];
    const sections = ['All Section', 'A Section', 'B Section', 'C Section', 'D Section', 'E Section'];

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsClassOpen(false);
            setIsSectionOpen(false);
        };
        window.addEventListener('click', handleClickOutside);
        fetchStaff();
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await staffAPI.getAll();
            setStaffData(response.data);
            setError('');
        } catch (err) {
            console.error('Fetch staff error:', err);
            setError('Failed to load staff list.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await staffAPI.delete(id);
                setStaffData(prev => prev.filter(s => s.id !== id));
            } catch (err) {
                console.error('Delete error:', err);
                alert('Failed to delete staff member.');
            }
        }
    };

    // Filter Logic
    const staffList = staffData.filter(staff => {
        const name = staff.name || `${staff.firstName} ${staff.lastName}`;
        const sId = staff.staffId || staff.employeeId || '';
        
        const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
            sId.toLowerCase().includes(search.toLowerCase());
        const matchesClass = selectedClass === 'All Class' || staff.class_teacher?.includes(selectedClass);
        const matchesSection = selectedSection === 'All Section' || staff.class_teacher?.includes(selectedSection.split(' ')[0]);
        return matchesSearch && matchesClass && matchesSection;
    });

    const columns = [
        {
            header: 'Staff ID',
            render: (row) => <span>{row.staffId || row.employeeId || row.id}</span>,
        },
        {
            header: 'Name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                        {row.photo_url ? (
                            <img src={row.photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <FiUser className="text-slate-300" />
                        )}
                    </div>
                    <span className="font-semibold text-slate-700">{row.name || `${row.firstName} ${row.lastName}`}</span>
                </div>
            ),
        },
        {
            header: 'Type',
            render: (row) => {
                const type = row.staff_type || 'Teaching';
                return (
                    <div className={`px-4 py-1.5 rounded-lg text-xs font-black text-center inline-block min-w-[100px] ${type === 'Teaching'
                        ? 'bg-[#14b8a6] text-white'
                        : 'bg-[#b45309] text-white'
                        }`}>
                        {type}
                    </div>
                );
            },
        },
        {
            header: 'Class Teacher',
            render: (row) => <span>{row.class_teacher || 'None'}</span>,
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate(`/staff/${row.id}`)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-slate-500 hover:text-[#0047AB]"
                        title="View Profile"
                    >
                        <FiEye size={18} />
                    </button>
                    <button
                        onClick={() => navigate(`/staff/edit/${row.id}`)}
                        className="p-2 hover:bg-amber-50 rounded-lg transition-colors text-slate-500 hover:text-amber-600"
                        title="Edit Staff"
                    >
                        <FiEdit2 size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id, row.name || `${row.firstName} ${row.lastName}`)}
                        className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-slate-500 hover:text-rose-600"
                        title="Delete Staff"
                    >
                        <FiTrash2 size={18} />
                    </button>
                </div>
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
                        {/* Class Dropdown */}
                        <div className="relative flex-1 md:flex-none group/drop" onClick={(e) => e.stopPropagation()}>
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

                        {/* Section Dropdown */}
                        <div className="relative flex-1 md:flex-none group/drop" onClick={(e) => e.stopPropagation()}>
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
                                <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5 custom-scrollbar">
                                    {sections.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                setSelectedSection(s);
                                                setIsSectionOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedSection === s ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                        >
                                            {s}
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
