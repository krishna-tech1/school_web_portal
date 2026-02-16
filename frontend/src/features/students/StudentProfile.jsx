import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiEdit3 } from 'react-icons/fi';
import { Card } from '../../components/ui';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Basic Info');

    const tabs = ['Basic Info', 'Parents Details', 'Academic Records', 'Documents'];

    const studentInfo = {
        studentId: id || 'STU001',
        fullName: 'Rahul Sharma',
        dob: '15/03/2010',
        classSection: '10 - A',
        rollNumber: '25',
        status: 'Active',
        admissionDate: '01/04/2023'
    };

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
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Student Profile - {studentInfo.studentId}</h1>
                        <p className="text-slate-500 font-medium mt-0.5">View and manage student details</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-[#0047AB] hover:bg-[#003580] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
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
                <h2 className="text-lg font-bold text-slate-900 mb-10">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-20">
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</p>
                        <p className="text-lg font-bold text-slate-900">{studentInfo.fullName}</p>
                    </div>

                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</p>
                        <p className="text-lg font-bold text-slate-900">{studentInfo.dob}</p>
                    </div>

                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Class & Section</p>
                        <p className="text-lg font-bold text-slate-900">{studentInfo.classSection}</p>
                    </div>

                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Roll Number</p>
                        <p className="text-lg font-bold text-slate-900">{studentInfo.rollNumber}</p>
                    </div>

                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Status</p>
                        <div className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-bold">
                            {studentInfo.status}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Admission Date</p>
                        <p className="text-lg font-bold text-slate-900">{studentInfo.admissionDate}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default StudentProfile;
