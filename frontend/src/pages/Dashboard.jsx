import React from 'react';
import { FiUsers, FiCreditCard, FiPackage, FiChevronDown } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { Card } from '../components/ui';

const RupeesIcon = () => <span className="font-bold text-lg">₹</span>;

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
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500 bg-white min-h-screen">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="border-none shadow-sm rounded-3xl p-0 bg-white overflow-hidden">
                            <div className="p-6 md:p-7 h-full min-h-[130px] flex flex-col">
                                <div className="flex justify-between items-start w-full">
                                    <p className="text-[15px] md:text-[17px] font-bold text-slate-500 pr-2 leading-snug">{stat.title}</p>
                                    <div className={`w-12 h-10 md:w-[52px] md:h-[48px] ${stat.bg} rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                                        <Icon size={20} />
                                    </div>
                                </div>
                                <div className="mt-auto pt-4">
                                    <p className="text-2xl md:text-[24px] font-black text-slate-900 tracking-tight">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Attendance Chart Card */}
            <Card className="border-none shadow-sm rounded-3xl p-6 md:p-10 bg-white">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 md:mb-12 gap-6">
                    <h2 className="text-lg md:text-[20px] font-extrabold text-slate-900">Attendance Overview</h2>
                    <div className="flex flex-wrap items-center gap-4 md:gap-10">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#00E396]"></span>
                            <span className="text-xs md:text-[14px] font-bold text-slate-700">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#FF4560]"></span>
                            <span className="text-xs md:text-[14px] font-bold text-slate-700">Absent</span>
                        </div>
                        <div className="relative">
                            <select className="bg-[#F1F5F9] border-none rounded-xl px-4 py-2 text-xs md:text-[14px] font-bold text-slate-900 outline-none appearance-none pr-10 min-w-[120px]">
                                <option>Students</option>
                                <option>Staff</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        </div>
                    </div>
                </div>

                <div className="relative w-full overflow-x-auto custom-scrollbar pt-4">
                    <div className="min-w-[800px] h-[350px] relative px-10">
                        <svg viewBox="0 0 1000 400" className="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00E396" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#00E396" stopOpacity="0.05" />
                                </linearGradient>
                                <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#FF4560" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#FF4560" stopOpacity="0.05" />
                                </linearGradient>
                            </defs>

                            {/* Dashed Grid Lines */}
                            {[0, 80, 160, 240, 320, 400].map(y => (
                                <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#E2E8F0" strokeDasharray="5 5" strokeWidth="1" />
                            ))}

                            {/* Absent Area */}
                            <path
                                d="M0,0 C50,0 80,150 120,300 C160,400 200,320 250,330 C300,340 350,300 400,280 C450,260 500,280 550,320 C600,350 650,360 700,370 C750,380 800,350 850,340 C900,330 950,350 1000,360 L1000,400 L0,400 Z"
                                fill="url(#absentGrad)"
                                className="opacity-70"
                            />
                            <path
                                d="M0,0 C50,0 80,150 120,300 C160,400 200,320 250,330 C300,340 350,300 400,280 C450,260 500,280 550,320 C600,350 650,360 700,370 C750,380 800,350 850,340 C900,330 950,350 1000,360"
                                fill="none" stroke="#FF4560" strokeWidth="3" strokeLinecap="round"
                            />

                            {/* Present Area */}
                            <path
                                d="M0,320 C100,280 150,280 200,300 C250,320 300,180 350,150 C400,120 450,160 500,180 C550,200 600,100 650,80 C700,60 750,150 800,180 C850,210 900,100 950,50 L1000,40 V400 H0 Z"
                                fill="url(#presentGrad)"
                                className="opacity-90"
                            />
                            <path
                                d="M0,320 C100,280 150,280 200,300 C250,320 300,180 350,150 C400,120 450,160 500,180 C550,200 600,100 650,80 C700,60 750,150 800,180 C850,210 900,100 950,50 L1000,40"
                                fill="none" stroke="#00E396" strokeWidth="3" strokeLinecap="round"
                            />
                        </svg>

                        {/* Month Labels */}
                        <div className="flex justify-between mt-8">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                                <span key={month} className="text-[12px] font-bold text-slate-400">{month}</span>
                            ))}
                        </div>

                        {/* Y-axis Labels */}
                        <div className="absolute left-0 top-0 h-[400px] flex flex-col justify-between py-1 text-[12px] font-bold text-slate-400">
                            <span>250</span>
                            <span>200</span>
                            <span>150</span>
                            <span>100</span>
                            <span>50</span>
                            <span>0</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
