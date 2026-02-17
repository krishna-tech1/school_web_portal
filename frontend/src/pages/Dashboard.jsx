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
            color: '#10B981',
            bg: 'bg-[#10B981]',
        },
        {
            title: 'Total Staff',
            value: '87',
            icon: FiUsers,
            color: '#D946EF',
            bg: 'bg-[#D946EF]',
        },
        {
            title: 'Pending Fees',
            value: '₹2,45,000',
            icon: RupeesIcon,
            color: '#F59E0B',
            bg: 'bg-[#F59E0B]',
        },
        {
            title: 'Low Stock Items',
            value: '5',
            icon: FiPackage,
            color: '#EF4444',
            bg: 'bg-[#EF4444]',
        },
    ];

    return (
        <div className="p-4 md:p-12 space-y-10 md:space-y-14 animate-in fade-in duration-1000 bg-[#FBFBFE] min-h-screen">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="group relative border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[2.5rem] p-0 bg-white transition-all duration-500 hover:-translate-y-2 overflow-hidden ring-1 ring-slate-100">
                            {/* Decorative Glow */}
                            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-3xl ${stat.bg}`} />

                            <div className="p-7 md:p-8 h-full min-h-[160px] flex flex-col relative z-10">
                                <div className="flex justify-between items-start w-full">
                                    <p className="text-[17px] font-bold text-slate-400 pr-2 leading-snug group-hover:text-slate-600 transition-colors duration-300">{stat.title}</p>
                                    <div
                                        className={`w-[64px] h-[60px] ${stat.bg} rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                                        style={{ boxShadow: `0 10px 20px ${stat.color}33` }}
                                    >
                                        <Icon size={32} />
                                    </div>
                                </div>
                                <div className="mt-auto pt-6">
                                    <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:translate-x-1 transition-transform duration-500">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Attendance Chart Card */}
            <Card className="border-none shadow-[0_15px_60px_rgba(0,0,0,0.03)] rounded-[3rem] p-8 md:p-12 bg-white ring-1 ring-slate-100 overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 md:mb-16 gap-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Attendance Overview</h2>
                        <p className="text-slate-400 font-bold text-sm md:text-base mt-2 uppercase tracking-wider">Yearly analytics for school departments</p>
                    </div>

                    <div className="relative flex items-center">
                        <select className="bg-slate-50 border-2 border-slate-50 rounded-2xl px-7 py-3.5 text-[15px] font-black text-slate-900 outline-none appearance-none pr-14 min-w-[180px] cursor-pointer hover:bg-white hover:border-[#0047AB22] transition-all shadow-sm">
                            <option>Students</option>
                            <option>Staff</option>
                        </select>
                        <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#0047AB] pointer-events-none group-hover:scale-110 transition-transform" size={20} />
                    </div>
                </div>

                <div className="h-[450px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                            <defs>
                                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00E396" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#00E396" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF4560" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#FF4560" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#0f172a', fontSize: 16, fontWeight: 800 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#0f172a', fontSize: 15, fontWeight: 800 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                height={40}
                                iconType="circle"
                                formatter={(value) => <span className="text-[14px] font-black text-slate-600 uppercase tracking-widest ml-1">{value}</span>}
                            />
                            <Area
                                type="monotone"
                                dataKey="present"
                                name="Present"
                                stroke="#00E396"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorPresent)"
                                animationDuration={2000}
                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                activeDot={{ r: 8, strokeWidth: 0, fill: '#00E396' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="absent"
                                name="Absent"
                                stroke="#FF4560"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorAbsent)"
                                animationDuration={2000}
                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                activeDot={{ r: 8, strokeWidth: 0, fill: '#FF4560' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
