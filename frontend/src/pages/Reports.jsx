import React from 'react';
import { FiBarChart2, FiUsers, FiTrendingUp, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { Card } from '../components/ui';

const Reports = () => {
    const reportCards = [
        {
            title: 'Attendance Report',
            description: 'Monthly student and staff attendance summaries',
            icon: FiUsers,
            color: 'bg-blue-500',
            stats: '96.4% avg'
        },
        {
            title: 'Financial Summary',
            description: 'Fee collections, pending dues, and trends',
            icon: FiTrendingUp,
            color: 'bg-green-500',
            stats: '₹ 45.2L'
        },
        {
            title: 'Academic Performance',
            description: 'Class-wise results and grade distributions',
            icon: FiBarChart2,
            color: 'bg-purple-500',
            stats: 'B+ avg'
        }
    ];

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-slate-900 mb-1 font-inter">Reports & Analytics</h1>
                <p className="text-slate-500 font-medium font-inter">Generate and view detailed school performance metrics</p>
            </div>

            {/* Featured Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {reportCards.map((report, index) => (
                    <Card key={index} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl p-8 bg-white cursor-pointer overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${report.color} opacity-5 rounded-bl-full`}></div>
                        <div className={`${report.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                            <report.icon size={26} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">{report.title}</h3>
                        <p className="text-slate-400 font-bold text-sm leading-relaxed mb-6">{report.description}</p>
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                            <span className="text-slate-900 font-black text-lg">{report.stats}</span>
                            <button className="text-[#0047AB] font-black text-sm flex items-center gap-1 hover:underline">
                                View Full
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Quick Actions / Recent Generation */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-50 p-10">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-xl font-bold text-slate-900">Recently Generated Reports</h2>
                    <button className="bg-slate-50 text-slate-600 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-slate-100 transition-all">
                        View All History
                    </button>
                </div>

                <div className="space-y-4">
                    {[
                        { name: 'Annual Fee Collection Report 2024-25', date: 'Feb 15, 2026', size: '2.4 MB' },
                        { name: 'Student Strength by Class - Term 1', date: 'Feb 12, 2026', size: '1.2 MB' },
                        { name: 'Staff Attendance Summary - January', date: 'Feb 01, 2026', size: '840 KB' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0047AB]">
                                    <FiCheckCircle size={22} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                                    <p className="text-slate-400 font-bold text-xs mt-0.5">{item.date} • {item.size}</p>
                                </div>
                            </div>
                            <button className="bg-[#0047AB]/5 text-[#0047AB] p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-[#0047AB] hover:text-white">
                                <FiDownload size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;
