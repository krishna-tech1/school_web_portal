import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiEdit3, FiLoader, FiUser } from 'react-icons/fi';
import { Card } from '../../components/ui';
import { studentAPI } from '../../services/api';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Basic Info');

    const tabs = ['Basic Info', 'Parents Details', 'Academic Records', 'Documents'];

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await studentAPI.getById(id);
                setStudent(res.data);
            } catch (err) {
                console.error('Failed to fetch student:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <FiLoader className="text-[#0047AB] animate-spin" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading profile...</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-slate-800">Student not found</h1>
                <button onClick={() => navigate('/students')} className="mt-4 text-[#0047AB] font-bold underline">Back to list</button>
            </div>
        );
    }

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-start gap-4">
                    <button
                        onClick={() => navigate('/students')}
                        className="mt-1 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-[1.5rem] bg-white shadow-xl shadow-blue-100/50 overflow-hidden border-4 border-white flex items-center justify-center shrink-0">
                            {student.photo_url ? (
                                <img 
                                    src={student.photo_url} 
                                    alt="Student profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                    <FiUser size={32} className="text-slate-200" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Student Profile - {student.studentId}</h1>
                            <p className="text-slate-500 font-medium mt-0.5">View and manage student details</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => navigate(`/students/edit/${student.studentId}`)}
                    className="flex items-center gap-2 bg-[#0047AB] hover:bg-[#003580] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                    <FiEdit3 size={18} />
                    Edit Profile
                </button>
            </div>

            {/* Tabs */}
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <Card className="border-none shadow-sm rounded-[2rem] p-10 bg-white">
                {activeTab === 'Basic Info' && (
                    <>
                        <h2 className="text-lg font-bold text-slate-900 mb-10">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</p>
                                <p className="text-lg font-bold text-slate-900">{student.firstName} {student.lastName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</p>
                                <p className="text-lg font-bold text-slate-900">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Class & Section</p>
                                <p className="text-lg font-bold text-slate-900">{student.class} - {student.section}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Roll Number</p>
                                <p className="text-lg font-bold text-slate-900">{student.rollNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</p>
                                <p className="text-lg font-bold text-slate-900 capitalize">{student.gender}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Admission Date</p>
                                <p className="text-lg font-bold text-slate-900">{student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Address</p>
                                <p className="text-lg font-bold text-slate-900">{student.address}</p>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'Parents Details' && (
                    <>
                        <h2 className="text-lg font-bold text-slate-900 mb-10">Guardian Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Guardian Name</p>
                                <p className="text-lg font-bold text-slate-900">{student.guardianName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Relation</p>
                                <p className="text-lg font-bold text-slate-900">{student.relation}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</p>
                                <p className="text-lg font-bold text-slate-900">{student.guardianPhone}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</p>
                                <p className="text-lg font-bold text-slate-900">{student.email}</p>
                            </div>
                        </div>
                    </>
                )}
                
                {activeTab === 'Academic Records' && (
                  <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Academic records feature coming soon
                  </div>
                )}
                
                {activeTab === 'Documents' && (
                  <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Document management coming soon
                  </div>
                )}
            </Card>
        </div>
    );
};

export default StudentProfile;
