import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiGrid,
    FiCheckSquare,
    FiCreditCard,
    FiBox,
    FiFileText,
    FiSettings,
    FiChevronLeft,
    FiChevronRight,
    FiUsers
} from 'react-icons/fi';
import { FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import { GoTriangleDown } from 'react-icons/go';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState(['Students']); // Default open for screenshot focus

    const toggleMenu = (label) => {
        if (openMenus.includes(label)) {
            setOpenMenus(openMenus.filter(m => m !== label));
        } else {
            setOpenMenus([...openMenus, label]);
        }
    };

    const menuItems = [
        { path: '/dashboard', icon: FiGrid, label: 'Dashboard', hasSub: false },
        {
            label: 'Students',
            icon: FaGraduationCap,
            hasSub: true,
            subItems: [
                { path: '/students', label: 'Student List' },
                { path: '/students/add', label: 'Add Student' },
                { path: '/students/promotion', label: 'Promotion' },
            ]
        },
        {
            label: 'Teacher',
            icon: FaChalkboardTeacher,
            hasSub: true,
            subItems: [
                { path: '/staff', label: 'Teacher List' },
                { path: '/staff/add', label: 'Add Teacher' },
                { path: '/staff/leave-tracking', label: 'Leave Tracking' },
            ]
        },
        {
            label: 'Attendance',
            icon: FiCheckSquare,
            hasSub: true,
            subItems: [
                { path: '/attendance', label: 'Student Attendance' },
                { path: '/attendance/teacher', label: 'Teacher Attendance' },
            ]
        },
        {
            label: 'Fees',
            icon: FiCreditCard,
            hasSub: true,
            subItems: [
                { path: '/fees/structure', label: 'Fee Structure' },
                { path: '/fees/pending', label: 'Pending Fees' },
            ]
        },
        { path: '/inventory', icon: FiBox, label: 'Inventory', hasSub: true },
        { path: '/reports', icon: FiFileText, label: 'Reports', hasSub: false },
        { path: '/settings', icon: FiSettings, label: 'Settings', hasSub: false },
    ];

    return (
        <aside
            className={`bg-[#0047AB] text-white h-screen sticky top-0 transition-all duration-300 relative ${collapsed ? 'w-20' : 'w-72'
                }`}
        >
            {/* Logo area */}
            <div className="h-24 flex flex-col items-center justify-center border-b border-white/10 px-4">
                {!collapsed && (
                    <div className="flex flex-col items-center text-center">
                        <p className="text-[#FFD700] font-black text-sm tracking-[0.2em] leading-tight">GOD IS LOVE</p>
                        <p className="text-[#FFD700] font-black text-sm tracking-[0.2em] leading-tight mt-1">LOVE IS GOD</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-96px)]">
                {menuItems.map((item) => (
                    <div key={item.label}>
                        {item.path ? (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'text-white font-bold'
                                        : 'text-white/60 hover:text-white'
                                    }`
                                }
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    {!collapsed && <span className="text-[15px]">{item.label}</span>}
                                </div>
                                {!collapsed && item.hasSub && (
                                    <GoTriangleDown className="h-3 w-3 -rotate-90 opacity-40 group-hover:opacity-100 transition-opacity" />
                                )}
                            </NavLink>
                        ) : (
                            <div className="space-y-1">
                                <button
                                    onClick={() => toggleMenu(item.label)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${openMenus.includes(item.label) ? 'text-white font-bold' : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className="h-5 w-5 flex-shrink-0" />
                                        {!collapsed && <span className="text-[15px]">{item.label}</span>}
                                    </div>
                                    {!collapsed && (
                                        <GoTriangleDown className={`h-3 w-3 transition-transform duration-300 ${openMenus.includes(item.label) ? 'rotate-0' : '-rotate-90'}`} />
                                    )}
                                </button>

                                {!collapsed && openMenus.includes(item.label) && (
                                    <div className="pl-[52px] space-y-3 py-2 animate-in slide-in-from-top-1 duration-200">
                                        {item.subItems?.map(sub => (
                                            <NavLink
                                                key={sub.path}
                                                to={sub.path}
                                                className={({ isActive }) =>
                                                    `block text-[14px] font-medium transition-colors ${isActive ? 'text-white' : 'text-white/60 hover:text-white'
                                                    }`
                                                }
                                            >
                                                {sub.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute right-2 top-12 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#0047AB] shadow-lg z-50 hover:bg-slate-50 transition-all active:scale-90 border-none outline-none focus:outline-none"
            >
                {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
            </button>
        </aside>
    );
};

export default Sidebar;
