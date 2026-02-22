import React from 'react';
import { FiUsers, FiCreditCard, FiPackage, FiChevronDown } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { Card } from '../components/ui';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const RupeesIcon = () => <span className="font-black text-2xl">₹</span>;

const chartData = [
    { name: 'Jan', present: 180, absent: 400 },
    { name: 'Feb', present: 200, absent: 350 },
    { name: 'Mar', present: 300, absent: 330 },
    { name: 'Apr', present: 250, absent: 280 },
    { name: 'May', present: 350, absent: 320 },
    { name: 'Jun', present: 150, absent: 370 },
    { name: 'Jul', present: 180, absent: 340 },
    { name: 'Aug', present: 250, absent: 360 },
    { name: 'Sep', present: 180, absent: 320 },
    { name: 'Oct', present: 300, absent: 280 },
    { name: 'Nov', present: 220, absent: 300 },
    { name: 'Dec', present: 380, absent: 250 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
                <p className="text-sm font-black text-slate-900 mb-2 uppercase tracking-widest">{label}</p>
                <div className="space-y-1.5">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-xs font-bold text-slate-500 uppercase">{entry.name}:</span>
                            <span className="text-sm font-black text-slate-900">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const stats = [
        {
            title: 'Total Students',
            value: '8,500',
            icon: FaGraduationCap,
            color: 'emerald',
            trend: '+12%',
            trendUp: true,
            description: '42 new this month',
            gradient: 'from-emerald-500 to-teal-600',
            iconBg: 'bg-emerald-500/10',
            iconColor: 'text-emerald-600'
        },
        {
            title: 'Total Staff',
            value: '87',
            icon: FiUsers,
            color: 'fuchsia',
            trend: '+2',
            trendUp: true,
            description: '1 on leave today',
            gradient: 'from-fuchsia-500 to-purple-600',
            iconBg: 'bg-fuchsia-500/10',
            iconColor: 'text-fuchsia-600'
        },
        {
            title: 'Pending Fees',
            value: '₹2.45L',
            icon: RupeesIcon,
            color: 'amber',
            trend: '-15%',
            trendUp: false,
            description: 'vs last month',
            gradient: 'from-amber-400 to-orange-500',
            iconBg: 'bg-amber-500/10',
            iconColor: 'text-amber-600'
        },
        {
            title: 'Low stock',
            value: '12',
            icon: FiPackage,
            color: 'rose',
            trend: 'High',
            trendUp: false,
            description: 'Items need refill',
            gradient: 'from-rose-500 to-red-600',
            iconBg: 'bg-rose-500/10',
            iconColor: 'text-rose-600'
        },
    ];

    return (
        <div className="p-6 md:p-10 space-y-10 animate-in fade-in duration-1000 bg-[#F8FAFC] min-h-screen">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1.5 overflow-hidden"
                        >
                            {/* Background Pattern/Glow */}
                            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.08] rounded-full transition-opacity duration-700 blur-2xl`} />

                            <div className="relative z-10">
                                <div className="mb-6">
                                    <div className={`w-fit p-4 rounded-2xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                        <Icon size={26} strokeWidth={2.5} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.title}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Progress/Line Decoration */}
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-50 overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out w-1/3 group-hover:w-full`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Attendance Chart Card */}
            <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/50 overflow-hidden relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/30 rounded-full blur-3xl -mr-48 -mt-48 opacity-50" />

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 md:mb-16 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-1.5 bg-indigo-600 rounded-full" />
                                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Attendance Overview</h2>
                            </div>
                            <p className="text-slate-400 font-bold text-sm md:text-base uppercase tracking-[0.2em]">Yearly analytics for school departments</p>
                        </div>

                        <div className="relative flex items-center group">
                            <div className="absolute left-6 text-indigo-600 font-black text-xs uppercase tracking-widest pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">View:</div>
                            <select className="bg-slate-50 border-2 border-slate-50 rounded-2xl pl-20 pr-14 py-4 text-[15px] font-black text-slate-900 outline-none appearance-none min-w-[220px] cursor-pointer hover:bg-white hover:border-indigo-100 transition-all shadow-sm focus:ring-4 focus:ring-indigo-50">
                                <option>Students</option>
                                <option>Staff</option>
                            </select>
                            <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-600 pointer-events-none group-hover:translate-y-[-40%] transition-transform" size={20} />
                        </div>
                    </div>

                    <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 700 }}
                                    dy={20}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 700 }}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
                                <Legend
                                    verticalAlign="top"
                                    align="right"
                                    padding={30}
                                    iconType="circle"
                                    iconSize={10}
                                    formatter={(value) => <span className="text-[13px] font-black text-slate-500 uppercase tracking-[0.15em] ml-2">{value}</span>}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="present"
                                    name="Present"
                                    stroke="#10B981"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorPresent)"
                                    animationDuration={2500}
                                    dot={{ r: 0 }}
                                    activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#10B981' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="absent"
                                    name="Absent"
                                    stroke="#F43F5E"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorAbsent)"
                                    animationDuration={2500}
                                    dot={{ r: 0 }}
                                    activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#F43F5E' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
