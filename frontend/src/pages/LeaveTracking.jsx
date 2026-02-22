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
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-[11px] font-black tracking-widest text-[#0047AB] uppercase">Leave Management</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 md:gap-0 px-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Leave Tracking</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-pulse"></span>
                        <p className="text-[#0047AB] font-black text-[13px] uppercase tracking-widest">{leaveRequests.filter(r => r.status === 'Pending').length} Pending Requests</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Pending Request', value: leaveRequests.filter(r => r.status === 'Pending').length, icon: FiClock, gradient: 'from-amber-400 to-orange-500', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-600' },
                    { label: 'Approved', value: leaveRequests.filter(r => r.status === 'Approved').length, icon: FiCheckCircle, gradient: 'from-emerald-500 to-teal-600', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600' },
                    { label: 'Rejected', value: leaveRequests.filter(r => r.status === 'Rejected').length, icon: FiXCircle, gradient: 'from-rose-500 to-red-600', iconBg: 'bg-rose-500/10', iconColor: 'text-rose-600' },
                    { label: 'Total Requests', value: leaveRequests.length, icon: FiList, gradient: 'from-blue-500 to-indigo-600', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-600' },
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1.5 overflow-hidden"
                        >
                            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.08] rounded-full transition-opacity duration-700 blur-2xl`} />

                            <div className="relative z-10">
                                <div className="mb-6">
                                    <div className={`w-fit p-4 rounded-2xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                        <Icon size={26} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-50 overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out w-1/4 group-hover:w-full`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 px-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.label
                            ? 'bg-[#0047AB] text-white shadow-lg shadow-blue-200'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Leave Request Cards */}
            <div className="flex flex-col items-center space-y-6">
                {filteredRequests.map((request) => (
                    <Card key={request.id} className="border-none shadow-sm rounded-3xl p-8 bg-white max-w-4xl w-full">
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