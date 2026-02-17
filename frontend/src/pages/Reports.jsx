import React, { useState } from 'react';
import { FiBookOpen, FiDollarSign, FiUsers, FiPieChart, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { Card } from '../components/ui';

const Reports = () => {
    const reportCategories = [
        {
            title: 'Financial Reports',
            icon: FiDollarSign,
            color: 'bg-emerald-500',
            bg: 'bg-emerald-50',
            reports: [
                { name: 'Fee Collection Summary', desc: 'Daily, monthly, and yearly fee collection analysis' },
                { name: 'Pending Fees Report', desc: 'List of students with outstanding dues by class' },
                { name: 'Expense Report', desc: 'Breakdown of school operational expenses' }
            ]
        },
        {
            title: 'Academic Reports',
            icon: FiBookOpen,
            color: 'bg-indigo-500',
            bg: 'bg-indigo-50',
            reports: [
                { name: 'Performance Analysis', desc: 'Student academic performance trends' },
                { name: 'Report Cards', desc: 'Generate and print term-end report cards' },
                { name: 'Subject-wise Analysis', desc: 'Detailed breakdown of subject performance' }
            ]
        },
        {
            title: 'Attendance Reports',
            icon: FiUsers,
            color: 'bg-amber-500',
            bg: 'bg-amber-50',
            reports: [
                { name: 'Student Attendance', desc: 'Class-wise student attendance registers' },
                { name: 'Staff Attendance', desc: 'Teacher and staff monthly attendance logs' },
                { name: 'Absence Trends', desc: 'Analysis of frequent absenteeism' }
            ]
        },
        {
            title: 'Inventory & Assets',
            icon: FiPieChart,
            color: 'bg-rose-500',
            bg: 'bg-rose-50',
            reports: [
                { name: 'Stock Summary', desc: 'Current inventory levels and stock value' },
                { name: 'Usage Report', desc: 'Consumption of resources by department' },
                { name: 'Asset Register', desc: 'List of all school infrastructure assets' }
            ]
        }
    ];

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-[11px] font-black tracking-widest text-[#0047AB] uppercase">Reports Section</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-14 gap-6 md:gap-0 px-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Reports & Analytics</h1>
                    <p className="text-slate-500 font-bold text-sm mt-2">Generate detailed insights across all school modules.</p>
                </div>

                {/* Date Dropdown */}
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                        <select className="pl-12 pr-10 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 shadow-xl shadow-slate-200/50 outline-none focus:border-[#0047AB] transition-all cursor-pointer hover:-translate-y-0.5 appearance-none min-w-[200px]">
                            <option>Current Session (2024-25)</option>
                            <option>Previous Session (2023-24)</option>
                            <option>Last 6 Months</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {reportCategories.map((category, idx) => (
                    <Card key={idx} className="border-none shadow-[0_15px_40px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-8 md:p-10 bg-white ring-1 ring-slate-100 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)] transition-all duration-500 group">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 ${category.bg} rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100`}>
                                    <category.icon size={32} className={`${category.color.replace('bg-', 'text-')}`} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">{category.title}</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{category.reports.length} Reports Available</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {category.reports.map((report, rIdx) => (
                                <div key={rIdx} className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-50 hover:border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer group/item">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover/item:text-[#0047AB] transition-colors">{report.name}</h3>
                                        <p className="text-xs text-slate-400 font-medium">{report.desc}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover/item:bg-white group-hover/item:shadow-md transition-all">
                                        <FiArrowRight size={16} className="text-slate-300 group-hover/item:text-[#0047AB] transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                            View All {category.title}
                            <FiArrowRight size={14} />
                        </button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Reports;
