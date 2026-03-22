import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiEdit3, FiLoader, FiUser, FiBriefcase, FiMapPin, FiPhone, FiMail, FiCalendar } from 'react-icons/fi';
import { Card } from '../components/ui';
import { staffAPI } from '../services/api';

const StaffProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Basic Info');

    const tabs = ['Basic Info', 'Professional', 'Contact Details'];

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                const res = await staffAPI.getById(id);
                setStaff(res.data);
            } catch (err) {
                console.error('Failed to fetch staff:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <FiLoader className="text-[#0047AB] animate-spin" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading profile...</p>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-500">
                    <FiUser size={40} />
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Staff member not found</h1>
                <p className="text-slate-500 mt-2 font-medium">The requested profile could not be located in our records.</p>
                <button 
                    onClick={() => navigate('/staff')} 
                    className="mt-8 bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold transition-all uppercase tracking-widest text-sm"
                >
                    Back to Staff List
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                <div className="flex-shrink-0">
                    <div className="w-40 h-40 bg-white border-4 border-white shadow-xl rounded-full flex items-center justify-center overflow-hidden ring-1 ring-slate-100">
                        {staff.photo_url ? (
                            <img src={staff.photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <FiUser className="text-slate-200" size={80} />
                        )}
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                    <div className="flex items-start gap-4">
                        <button
                            onClick={() => navigate('/staff')}
                            className="mt-1 p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all shadow-sm text-slate-600 active:scale-95"
                        >
                            <FiArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                {staff.firstName} {staff.lastName}
                            </h1>
                                <p className="text-[#0047AB] font-black text-[13px] uppercase tracking-widest mt-2">
                                   Teacher Profile • {staff.staffId || staff.employeeId || id}
                                </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate(`/staff/edit/${staff.id}`)}
                        className="flex items-center gap-3 bg-[#0047AB] hover:bg-[#003580] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-200/50 transition-all active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <FiEdit3 size={18} />
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="inline-flex p-2 bg-slate-100/50 backdrop-blur-md rounded-[1.5rem] mb-10 border border-slate-200/50">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-4 rounded-[1.25rem] text-sm font-black transition-all uppercase tracking-widest ${activeTab === tab
                                ? 'bg-white text-[#0047AB] shadow-lg shadow-black/5'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <Card className="border-none shadow-[0_20px_60px_rgba(0,0,0,0.03)] rounded-[3rem] p-8 md:p-12 bg-white">
                {activeTab === 'Basic Info' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2 bg-blue-50 text-[#0047AB] rounded-lg">
                                <FiUser size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Personal Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-12">
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 leading-none">Full Name</p>
                                <p className="text-lg font-bold text-slate-800">{staff.firstName} {staff.lastName}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 leading-none">Date of Birth</p>
                                <p className="text-lg font-bold text-slate-800">{staff.dob ? staff.dob.split('T')[0] : '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 leading-none">Gender</p>
                                <p className="text-lg font-bold text-slate-800 capitalize">{staff.gender || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 leading-none">Email Address</p>
                                <p className="text-lg font-bold text-slate-800 break-all">{staff.email || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 leading-none">Phone Number</p>
                                <p className="text-lg font-bold text-slate-800">{staff.phone || '—'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Professional' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2 bg-blue-50 text-[#0047AB] rounded-lg">
                                <FiBriefcase size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Professional Records</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-12">
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 leading-none">Employee ID</p>
                                <p className="text-lg font-bold text-slate-800">{staff.staffId || staff.employeeId || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 leading-none">Class Teacher</p>
                                <p className="text-lg font-bold text-slate-800">{staff.class_teacher || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 leading-none">Subjects</p>
                                <div className="space-y-1">
                                    {(() => {
                                        let subjs = staff.subjects_list || staff.subjects;
                                        if (typeof subjs === 'string' && subjs) {
                                            try { subjs = JSON.parse(subjs); } catch (e) { subjs = []; }
                                        }
                                        if (!Array.isArray(subjs) || subjs.length === 0) return '—';
                                        
                                        return subjs.map((s, i) => (
                                            <div key={i} className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{s.class}:</span>
                                                <span>{s.subject}</span>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Contact Details' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-2 bg-blue-50 text-[#0047AB] rounded-lg">
                                <FiMapPin size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Address & Location</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12">
                            <div className="md:col-span-2">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 leading-none">Current Address</p>
                                <p className="text-lg font-bold text-slate-800 whitespace-pre-wrap">{staff.address || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 leading-none">City</p>
                                <p className="text-lg font-bold text-slate-800">{staff.city || '—'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 leading-none">State & Zip</p>
                                <p className="text-lg font-bold text-slate-800">{staff.state}{staff.zipCode ? `, ${staff.zipCode}` : '' || '—'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default StaffProfile;
