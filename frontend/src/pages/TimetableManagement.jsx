import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiCalendar, FiUsers, FiBookOpen, FiChevronRight, FiSearch, FiInfo } from 'react-icons/fi';
import { staffAPI } from '../services/api';
import TimetableEditor from '../components/TimetableEditor';

const TimetableManagement = () => {
    const { user } = useSelector((state) => state.auth);
    const uRole = user?.role?.toLowerCase() || '';
    
    // Role-based defaults
    const isStudentManager = uRole === 'studentmanager';
    const isTeacherManager = uRole === 'teachermanager';
    const isFullAdmin = uRole === 'administrator' || uRole === 'admin';

    const [activeTab, setActiveTab] = useState(isTeacherManager ? 'staff' : 'student');
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Student Selection State
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [showStudentEditor, setShowStudentEditor] = useState(false);

    // Staff Selection State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStaff, setSelectedStaff] = useState(null);

    const classes = ['LKG', 'UKG', ...Array.from({ length: 12 }, (_, i) => `${i + 1}${getSuffix(i + 1)} Std`)];
    const sections = ['A', 'B', 'C', 'D', 'E'];

    function getSuffix(num) {
        if (num === 1) return 'st';
        if (num === 2) return 'nd';
        if (num === 3) return 'rd';
        return 'th';
    }

    useEffect(() => {
        if (activeTab === 'staff') fetchStaff();
    }, [activeTab]);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await staffAPI.getAll();
            setStaffList(response.data);
        } catch (err) {
            console.error('Error fetching staff:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredStaff = staffList.filter(s => 
        (s.name || `${s.firstName} ${s.lastName}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.staffId || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500 font-inter">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-8">
                <span>Academic</span>
                <FiChevronRight size={12} />
                <span className="text-[#0047AB]">Timetable Management</span>
            </div>

            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Schedule Planner</h1>
                    <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest flex items-center gap-2">
                        <FiInfo className="text-[#0047AB]" /> Master configuration for all academic sessions
                    </p>
                </div>
                
                {/* Tab Switcher */}
                <div className="bg-white p-1.5 rounded-[1.25rem] shadow-sm border border-slate-100 flex gap-2">
                    {(isFullAdmin || isStudentManager) && (
                        <button 
                            onClick={() => setActiveTab('student')}
                            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'student' ? 'bg-[#0047AB] text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <FiBookOpen size={18} /> Student Class
                        </button>
                    )}
                    {(isFullAdmin || isTeacherManager) && (
                        <button 
                            onClick={() => setActiveTab('staff')}
                            className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'staff' ? 'bg-[#0047AB] text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <FiUsers size={18} /> Staff Faculty
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Selection Column */}
                <div className="lg:col-span-4 space-y-6">
                    {activeTab === 'student' ? (
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">Select Class Batch</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0047AB] block mb-2 px-1">Grade Level</label>
                                        <select 
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0047AB] transition-all outline-none"
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#0047AB] block mb-2 px-1">Section Unit</label>
                                        <select 
                                            value={selectedSection}
                                            onChange={(e) => setSelectedSection(e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-[#0047AB] transition-all outline-none"
                                        >
                                            <option value="">Select Section</option>
                                            {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowStudentEditor(true)}
                                disabled={!selectedClass || !selectedSection}
                                className="w-full bg-[#0047AB] text-white py-5 rounded-[1.25rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                <FiCalendar size={20} /> Open Editor
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col h-[600px]">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">Staff Directory</h3>
                            <div className="relative mb-6">
                                <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text"
                                    placeholder="Search Faculty..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#0047AB] outline-none"
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                                {loading ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="w-8 h-8 border-3 border-slate-100 border-t-[#0047AB] rounded-full animate-spin"></div>
                                    </div>
                                ) : filteredStaff.length > 0 ? (
                                    filteredStaff.map(staff => (
                                        <button 
                                            key={staff.id}
                                            onClick={() => setSelectedStaff(staff)}
                                            className={`w-full text-left p-4 rounded-2xl transition-all border flex flex-col gap-1 ${selectedStaff?.id === staff.id ? 'bg-[#0047AB] text-white border-[#0047AB] shadow-lg shadow-blue-100' : 'bg-white text-slate-600 border-slate-50 hover:bg-slate-50'}`}
                                        >
                                            <span className="font-black text-sm">{staff.name || `${staff.firstName} ${staff.lastName}`}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedStaff?.id === staff.id ? 'text-white/60' : 'text-slate-300'}`}>
                                                {staff.staffId || staff.employeeId} • {staff.staff_type || 'Teaching'}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-300 font-bold text-sm">No staff found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Hero / Placeholder View */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-12 min-h-[600px] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        {/* Decorative Background Icon */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-50 opacity-10 group-hover:scale-110 transition-transform duration-[2000ms]">
                            <FiCalendar size={500} />
                        </div>
                        
                        <div className="relative z-10 max-w-md">
                            <div className="w-24 h-24 bg-blue-50 rounded-[2.25rem] flex items-center justify-center text-[#0047AB] mx-auto mb-10 shadow-sm rotate-12 group-hover:rotate-0 transition-transform duration-700 ring-1 ring-[#0047AB]/10">
                                <FiCalendar size={40} />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight leading-tight">Master Schedule<br/>Gateway</h2>
                            <p className="text-slate-500 font-bold leading-relaxed mb-10 text-lg">
                                Select a specific class batch or faculty member from the side directory to access their live timetable configuration.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6">
                                {(isFullAdmin || isStudentManager) && (
                                    <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                                        <h4 className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest mb-1">Students</h4>
                                        <p className="text-2xl font-black text-slate-800">{classes.length * sections.length}+ Units</p>
                                    </div>
                                )}
                                {(isFullAdmin || isTeacherManager) && (
                                    <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100">
                                        <h4 className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest mb-1">Faculty</h4>
                                        <p className="text-2xl font-black text-slate-800">{staffList.length}+ Staff</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals Overlay */}
            {showStudentEditor && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-6xl">
                        <TimetableEditor 
                            type="student" 
                            targetId={selectedClass} 
                            section={selectedSection} 
                            onCancel={() => setShowStudentEditor(false)} 
                        />
                    </div>
                </div>
            )}

            {selectedStaff && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-6xl">
                        <TimetableEditor 
                            type="staff" 
                            targetId={selectedStaff.staffId || selectedStaff.employeeId} 
                            onCancel={() => setSelectedStaff(null)} 
                        />
                    </div>
                </div>
            )}
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
            ` }} />
        </div>
    );
};

export default TimetableManagement;
