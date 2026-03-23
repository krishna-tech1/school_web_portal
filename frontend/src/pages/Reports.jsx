import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiDollarSign, FiUsers, FiPieChart, FiCalendar, FiArrowRight, FiDownload, FiX, FiPrinter } from 'react-icons/fi';
import { Card, Table } from '../components/ui';
import { reportsAPI } from '../services/api';

const Reports = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeReport, setActiveReport] = useState(null); // 'pending-fees' etc
    const [reportResults, setReportResults] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [filterClass, setFilterClass] = useState('All Class');

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const res = await reportsAPI.getSummary();
            setReportData(res.data);
        } catch (err) {
            console.error('Report summary fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const generatePendingReport = async () => {
        try {
            setGenerating(true);
            const res = await reportsAPI.getPendingList(filterClass);
            setReportResults(res.data);
            setActiveReport('pending-fees');
        } catch (err) {
            console.error('Report generation error:', err);
        } finally {
            setGenerating(false);
        }
    };

    const reportCategories = [
        {
            title: 'Financial Reports',
            icon: FiDollarSign,
            color: 'bg-emerald-500',
            bg: 'bg-emerald-50',
            stat: reportData ? `₹${(reportData.financial.collected / 1000).toFixed(1)}k Collected` : '...',
            reports: [
                { id: 'pending-fees', name: 'Pending Fees Report', desc: 'List of students with outstanding dues' },
                { id: 'collection-summary', name: 'Fee Collection Summary', desc: 'Daily and monthly collection log' }
            ]
        },
        {
            title: 'Attendance Reports',
            icon: FiUsers,
            color: 'bg-amber-500',
            bg: 'bg-amber-50',
            stat: reportData ? `${reportData.attendance.monthlyPercent} Avg.` : '...',
            reports: [
                { id: 'student-attendance', name: 'Student Attendance Map', desc: 'Detailed attendance registers' },
                { id: 'absence-trends', name: 'Absence Analysis', desc: 'Frequent absenteeism report' }
            ]
        },
        {
            title: 'Inventory & Assets',
            icon: FiPieChart,
            color: 'bg-rose-500',
            bg: 'bg-rose-50',
            stat: reportData ? `${reportData.inventory.lowStockCount} Low Stock` : '...',
            reports: [
                { id: 'stock-audit', name: 'Stock Audit Summary', desc: 'Current inventory levels' }
            ]
        },
        {
            title: 'Academic Reports',
            icon: FiBookOpen,
            color: 'bg-indigo-500',
            bg: 'bg-indigo-50',
            stat: 'Term-End Ready',
            reports: [
                { id: 'report-cards', name: 'Bulk Report Cards', desc: 'Generate and print cards' }
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
                                         <div className="flex items-center gap-2 mt-1">
                                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{category.reports.length} Reports</p>
                                             <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase text-white ${category.color} animate-pulse`}>
                                                 {category.stat}
                                             </span>
                                         </div>
                                     </div>
                                 </div>
                            </div>
    
                            <div className="space-y-4">
                                {category.reports.map((report, rIdx) => (
                                    <div 
                                        key={rIdx} 
                                        onClick={() => {
                                            if(report.id === 'pending-fees') generatePendingReport();
                                        }}
                                        className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-50 hover:border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer group/item"
                                    >
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover/item:text-[#0047AB] transition-colors">{report.name}</h3>
                                            <p className="text-xs text-slate-400 font-medium">{report.desc}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover/item:bg-white group-hover/item:shadow-md transition-all">
                                            {generating && report.id === 'pending-fees' ? (
                                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <FiArrowRight size={16} className="text-slate-300 group-hover/item:text-[#0047AB] transition-colors" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
    
                            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                                View Full Suite
                                <FiArrowRight size={14} />
                            </button>
                        </Card>
                    ))}
                </div>
    
                {/* Detailed Report Result Overlay */}
                {activeReport && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[1000] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-6xl max-h-full overflow-hidden rounded-[3rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                            {/* Modal Header */}
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                        {activeReport === 'pending-fees' ? 'Pending Fees List' : 'Report Analysis'}
                                    </h2>
                                    <p className="text-xs font-bold text-[#0047AB] uppercase tracking-widest mt-1">Generated: {new Date().toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl text-xs font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">
                                        <FiPrinter size={16} /> Print Report
                                    </button>
                                    <button 
                                        onClick={() => setActiveReport(null)}
                                        className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all hover:rotate-90 hover:shadow-lg"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>
                            </div>
    
                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                {activeReport === 'pending-fees' && (
                                    <Table 
                                        columns={[
                                            { header: 'Student ID', accessor: 'studentId' },
                                            { header: 'Full Name', render: (row) => <span className="font-bold text-slate-700">{row.firstName} {row.lastName}</span> },
                                            { header: 'Class', accessor: 'class' },
                                            { header: 'Section', accessor: 'section' },
                                            { header: 'Pending Amount', render: (row) => <span className="text-rose-600 font-bold">₹{row.pendingFee}</span> }
                                        ]}
                                        data={reportResults}
                                    />
                                )}
                            </div>
    
                            {/* Modal Footer */}
                            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Showing {reportResults.length} records in this snapshot.</p>
                                <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
                                    <FiDownload size={16} /> Export to Excel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

export default Reports;
