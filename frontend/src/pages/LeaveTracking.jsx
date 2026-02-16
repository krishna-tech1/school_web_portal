import React, { useState } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiList, FiCalendar, FiFileText } from 'react-icons/fi';
import { Card } from '../components/ui';

const LeaveTracking = () => {
    const [activeTab, setActiveTab] = useState('Pending');



    const leaveRequests = [
        {
            id: 1,
            name: 'Mrs. Priya Sharma',
            staffId: 'STF002',
            designation: 'Senior Teacher',
            type: 'Sick Leave',
            duration: '15/02/2026 - 17/02/2026',
            appliedOn: '10/02/2026',
            reason: 'Recovering from severe viral fever',
            image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=0047AB&color=fff',
            status: 'Pending'
        },
        {
            id: 2,
            name: 'Mr. Robert D\'Souza',
            staffId: 'STF005',
            designation: 'Physical Education Coach',
            type: 'Casual Leave',
            duration: '18/02/2026 - 19/02/2026',
            appliedOn: '12/02/2026',
            reason: 'Attending family wedding at hometown',
            image: 'https://ui-avatars.com/api/?name=Robert+DSouza&background=0047AB&color=fff',
            status: 'Pending'
        },
        {
            id: 3,
            name: 'Ms. Anita Roy',
            staffId: 'STF009',
            designation: 'Mathematics Teacher',
            type: 'Medical Leave',
            duration: '01/02/2026 - 05/02/2026',
            appliedOn: '25/01/2026',
            reason: 'Annual medical checkup and tests',
            image: 'https://ui-avatars.com/api/?name=Anita+Roy&background=0047AB&color=fff',
            status: 'Approved'
        },
        {
            id: 4,
            name: 'Mr. Sahil Varma',
            staffId: 'STF012',
            designation: 'History Lecturer',
            type: 'Personal Leave',
            duration: '20/02/2026 - 22/02/2026',
            appliedOn: '15/02/2026',
            reason: 'Urgent personal work at bank',
            image: 'https://ui-avatars.com/api/?name=Sahil+Varma&background=0047AB&color=fff',
            status: 'Rejected'
        }
    ];

    const filteredRequests = leaveRequests.filter(req => req.status === activeTab);

    const stats = [
        { label: 'Pending Request', value: leaveRequests.filter(r => r.status === 'Pending').length, icon: FiClock, color: 'text-orange-500', bg: 'bg-orange-500' },
        { label: 'Approved', value: leaveRequests.filter(r => r.status === 'Approved').length, icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-500' },
        { label: 'Rejected', value: leaveRequests.filter(r => r.status === 'Rejected').length, icon: FiXCircle, color: 'text-red-500', bg: 'bg-red-500' },
        { label: 'Total Requests', value: leaveRequests.length, icon: FiList, color: 'text-blue-500', bg: 'bg-blue-500' },
    ];

    const tabs = [
        { label: 'Pending', count: leaveRequests.filter(r => r.status === 'Pending').length },
        { label: 'Approved', count: leaveRequests.filter(r => r.status === 'Approved').length },
        { label: 'Rejected', count: leaveRequests.filter(r => r.status === 'Rejected').length },
    ];

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-slate-900 mb-1 font-inter">Leave Tracking</h1>
                <p className="text-slate-500 font-medium">Manage staff leave requests and balance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-sm p-6 bg-white rounded-2xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-500 mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                            </div>
                            <div className={`${stat.bg} p-2.5 rounded-lg`}>
                                <stat.icon className="text-white" size={20} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.label
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Leave Request Cards */}
            <div className="space-y-6">
                {filteredRequests.map((request) => (
                    <Card key={request.id} className="border-none shadow-sm rounded-3xl p-8 bg-white max-w-4xl">
                        <div className="flex items-start gap-4 mb-8">
                            <img src={request.image} alt={request.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-50 shadow-sm" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{request.name}</h3>
                                <p className="text-slate-400 font-bold text-sm tracking-wide">{request.staffId} • {request.designation}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                <FiFileText className="text-slate-400" size={18} />
                                <span>Leave Type : {request.type}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                <FiCalendar className="text-slate-400" size={18} />
                                <span>Duration : {request.duration}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                <FiClock className="text-slate-400" size={18} />
                                <span>Applied On : {request.appliedOn}</span>
                            </div>
                        </div>

                        <div className="bg-[#f3f4f6] rounded-2xl p-6 mb-8">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-inter">Reason:</p>
                            <p className="text-slate-900 font-bold text-base">{request.reason}</p>
                        </div>

                        {/* Action Buttons - Only visible for Pending per user request */}
                        {activeTab === 'Pending' && (
                            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <button className="bg-[#00b341] hover:bg-[#009637] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-100 transition-all active:scale-95">
                                    Approve
                                </button>
                                <button className="bg-[#ff0000] hover:bg-[#d90000] text-white py-4 rounded-xl font-bold shadow-lg shadow-red-100 transition-all active:scale-95">
                                    Reject
                                </button>
                            </div>
                        )}
                    </Card>
                ))}

                {filteredRequests.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 font-bold text-lg">No {activeTab.toLowerCase()} leave requests found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveTracking;
