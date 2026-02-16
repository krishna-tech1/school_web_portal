import React from 'react';
import { FiUsers, FiCreditCard, FiPackage, FiChevronDown } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { Card } from '../components/ui';

const Dashboard = () => {
    const stats = [
        {
            title: 'Total Students',
            value: '8,500',
            icon: FaGraduationCap,
            color: '#10B981', // Emerald/Cyan
            bg: 'bg-[#10B981]',
        },
        {
            title: 'Total Staff',
            value: '87',
            icon: FiUsers,
            color: '#D946EF', // Fuchsia/Magenta
            bg: 'bg-[#D946EF]',
        },
        {
            title: 'Pending Fees',
            value: '₹2,45,000',
            icon: () => <span className="font-bold text-lg">₹</span>,
            color: '#F59E0B', // Amber/Orange
            bg: 'bg-[#F59E0B]',
        },
        {
            title: 'Low Stock Items',
            value: '5',
            icon: FiPackage,
            color: '#EF4444', // Red
            bg: 'bg-[#EF4444]',
        },
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500 bg-white min-h-screen">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-3xl p-0 bg-white overflow-hidden">
                        <div className="p-7 h-full min-h-[145px] flex flex-col">
                            <div className="flex justify-between items-start w-full">
                                <p className="text-[17px] font-semibold text-slate-500 pr-2 leading-snug">{stat.title}</p>
                                <div className={`w-[52px] h-[48px] ${stat.bg} rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 animate-in fade-in zoom-in duration-500`}>
                                    {typeof stat.icon === 'function' ? (
                                        <div className="flex items-center justify-center w-full h-full leading-none">
                                            <stat.icon size={22} />
                                        </div>
                                    ) : (
                                        <stat.icon size={22} />
                                    )}
                                </div>
                            </div>
                            <div className="mt-7">
                                <p className="text-[24px] font-black text-slate-900 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Attendance Chart Card */}
            <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-3xl p-10 bg-white">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-[20px] font-bold text-slate-900">Attendance Overview</h2>
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-2.5">
                            <span className="w-4 h-4 rounded bg-[#00E396]"></span>
                            <span className="text-[15px] font-bold text-slate-900">Present</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="w-4 h-4 rounded bg-[#FF4560]"></span>
                            <span className="text-[15px] font-bold text-slate-900 line-through-none">Abscent</span>
                        </div>
                        <div className="relative ml-4">
                            <select className="bg-[#F8FAFC] border-none rounded-xl px-6 py-2.5 text-[15px] font-bold text-slate-900 outline-none appearance-none pr-12 min-w-[140px]">
                                <option>Students</option>
                                <option>Staff</option>
                            </select>
                            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                        </div>
                    </div>
                </div>

                <div className="relative h-[400px] w-full px-10">
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
                            <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#CBD5E1" strokeDasharray="5 5" strokeWidth="1" />
                        ))}

                        {/* Absent Area (Red) - Sharp peak in Jan */}
                        <path
                            d="M0,0 C50,0 80,150 120,300 C160,400 200,320 250,330 C300,340 350,300 400,280 C450,260 500,280 550,320 C600,350 650,360 700,370 C750,380 800,350 850,340 C900,330 950,350 1000,360 L1000,400 L0,400 Z"
                            fill="url(#absentGrad)"
                            className="opacity-70"
                        />
                        <path
                            d="M0,0 C50,0 80,150 120,300 C160,400 200,320 250,330 C300,340 350,300 400,280 C450,260 500,280 550,320 C600,350 650,360 700,370 C750,380 800,350 850,340 C900,330 950,350 1000,360"
                            fill="none" stroke="#FF4560" strokeWidth="3" strokeLinecap="round"
                        />

                        {/* Present Area (Green) - Wavy */}
                        <path
                            d="M0,320 C100,280 150,280 200,300 C250,320 300,180 350,150 C400,120 450,160 500,180 C550,200 600,100 650,80 C700,60 750,150 800,180 C850,210 900,100 950,50 L1000,40 V400 H0 Z"
                            fill="url(#presentGrad)"
                            className="opacity-90"
                        />
                        <path
                            d="M0,320 C100,280 150,280 200,300 C250,320 300,180 350,150 C400,120 450,160 500,180 C550,200 600,100 650,80 C700,60 750,150 800,180 C850,210 900,100 950,50 L1000,40"
                            fill="none" stroke="#00E396" strokeWidth="4" strokeLinecap="round"
                        />
                    </svg>

                    {/* Month Labels */}
                    <div className="flex justify-between mt-8">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                            <span key={month} className="text-[13px] font-bold text-slate-400 font-inter">{month}</span>
                        ))}
                    </div>

                    {/* Y-axis Labels */}
                    <div className="absolute left-[-20px] top-[-5px] h-[400px] flex flex-col justify-between py-1 text-[13px] font-bold text-slate-900 font-inter">
                        <span>250</span>
                        <span>200</span>
                        <span>150</span>
                        <span>100</span>
                        <span>50</span>
                        <span>0</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
