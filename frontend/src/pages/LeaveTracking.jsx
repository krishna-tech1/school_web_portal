import React, { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiList, FiCalendar, FiFileText, FiLoader } from 'react-icons/fi';
import { Card } from '../components/ui';
import { leaveAPI } from '../services/api';

const LeaveTracking = () => {
    const [activeTab, setActiveTab] = useState('Pending');
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await leaveAPI.getAllRequests();
            setLeaveRequests(response.data);
        } catch (err) {
            console.error('Error fetching leave requests:', err);
            setError('Failed to load leave requests.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await leaveAPI.updateStatus(id, status);
            // Update local state
            setLeaveRequests(prev => prev.map(req => 
                req.id === id ? { ...req, status } : req
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update leave status.');
        }
    };

    const filteredRequests = leaveRequests.filter(req => req.status === activeTab);

    const tabs = [
        { label: 'Pending', count: leaveRequests.filter(r => r.status === 'Pending').length },
        { label: 'Approved', count: leaveRequests.filter(r => r.status === 'Approved').length },
        { label: 'Rejected', count: leaveRequests.filter(r => r.status === 'Rejected').length },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#FBFBFE]">
                <FiLoader className="text-[#0047AB] animate-spin" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading leave requests...</p>
            </div>
        );
    }

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
                            <img 
                                src={request.photo_url || `https://ui-avatars.com/api/?name=${request.firstName}+${request.lastName}&background=0047AB&color=fff`} 
                                alt={request.firstName} 
                                className="w-16 h-16 rounded-full object-cover border-2 border-slate-50 shadow-sm" 
                            />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{request.firstName} {request.lastName}</h3>
                                <p className="text-slate-400 font-bold text-sm tracking-wide">{request.staffId} • {request.designation}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                <FiFileText className="text-slate-400" size={18} />
                                <span>Leave Type : {request.leaveType}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                <FiCalendar className="text-slate-400" size={18} />
                                <span>Duration : {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                                <FiClock className="text-slate-400" size={18} />
                                <span>Applied On : {new Date(request.appliedOn).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="bg-[#f3f4f6] rounded-2xl p-6 mb-8">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-inter">Reason:</p>
                            <p className="text-slate-900 font-bold text-base">{request.reason}</p>
                        </div>

                        {/* Action Buttons - Only visible for Pending */}
                        {activeTab === 'Pending' && (
                            <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <button 
                                    onClick={() => handleStatusUpdate(request.id, 'Approved')}
                                    className="bg-[#00b341] hover:bg-[#009637] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-100 transition-all active:scale-95"
                                >
                                    Approve
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(request.id, 'Rejected')}
                                    className="bg-[#ff0000] hover:bg-[#d90000] text-white py-4 rounded-xl font-bold shadow-lg shadow-red-100 transition-all active:scale-95"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </Card>
                ))}

                {filteredRequests.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 w-full max-w-4xl">
                        <p className="text-slate-400 font-bold text-lg">No {activeTab.toLowerCase()} leave requests found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveTracking;