import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiCheckSquare, FiCreditCard, FiBox, FiFileText, FiSettings, FiX } from 'react-icons/fi';
import { FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import { GoTriangleDown } from 'react-icons/go';

const Sidebar = ({ isMobileOpen, setIsMobileOpen, collapsed }) => {
    const [openMenus, setOpenMenus] = useState(['Students']);
    const { user } = useSelector((state) => state.auth);

    const toggleMenu = (label) => {
        if (openMenus.includes(label)) {
            setOpenMenus(openMenus.filter(m => m !== label));
        } else {
            setOpenMenus([...openMenus, label]);
        }
    };

    const allMenuItems = [
        { path: '/dashboard', icon: FiGrid, label: 'Dashboard', hasSub: false, roles: ['Administrator', 'TeacherManager', 'StudentManager', 'FeeManager', 'InventoryManager'] },
        {
            label: 'Students',
            icon: FaGraduationCap,
            hasSub: true,
            roles: ['Administrator', 'StudentManager'],
            subItems: [
                { path: '/students', label: 'Student List', roles: ['Administrator', 'StudentManager'] },
                { path: '/students/add', label: 'Add Student', roles: ['Administrator', 'StudentManager'] },
                { path: '/students/promotion', label: 'Promotion', roles: ['Administrator', 'StudentManager'] },
            ]
        },
        {
            label: 'Teacher',
            icon: FaChalkboardTeacher,
            hasSub: true,
            roles: ['Administrator', 'TeacherManager'],
            subItems: [
                { path: '/staff', label: 'Teacher List', roles: ['Administrator', 'TeacherManager'] },
                { path: '/staff/add', label: 'Add Teacher', roles: ['Administrator', 'TeacherManager'] },
                { path: '/staff/leave-tracking', label: 'Leave Tracking', roles: ['Administrator', 'TeacherManager'] },
            ]
        },
        {
            label: 'Attendance',
            icon: FiCheckSquare,
            hasSub: true,
            roles: ['Administrator', 'TeacherManager', 'StudentManager'],
            subItems: [
                { path: '/attendance', label: 'Student Attendance', roles: ['Administrator', 'StudentManager'] },
                { path: '/attendance/teacher', label: 'Teacher Attendance', roles: ['Administrator', 'TeacherManager'] },
            ]
        },
        {
            label: 'Fees',
            icon: FiCreditCard,
            hasSub: true,
            roles: ['Administrator', 'FeeManager'],
            subItems: [
                { path: '/fees/structure', label: 'Fee Structure', roles: ['Administrator', 'FeeManager'] },
                { path: '/fees/pending', label: 'Pending Fees', roles: ['Administrator', 'FeeManager'] },
            ]
        },
        { path: '/inventory', icon: FiBox, label: 'Inventory', hasSub: true, roles: ['Administrator', 'InventoryManager'] },
        { path: '/reports', icon: FiFileText, label: 'Reports', hasSub: false, roles: ['Administrator'] },
        { path: '/settings', icon: FiSettings, label: 'Settings', hasSub: false, roles: ['Administrator'] },
    ];

    const menuItems = allMenuItems
        .filter(item => item.roles.includes(user?.role))
        .map(item => ({
            ...item,
            subItems: item.subItems?.filter(sub => sub.roles.includes(user?.role))
        }));

    return (
        <aside
            className={`bg-[#0047AB] text-white h-screen fixed inset-y-0 left-0 z-50 lg:sticky lg:top-0 transition-all duration-300 shadow-2xl lg:shadow-none 
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
                ${collapsed ? 'lg:w-0 overflow-hidden' : 'lg:w-72'} w-72`}
        >
            {!collapsed && (
                <div className="h-full flex flex-col animate-in fade-in duration-300">
                    {/* Mobile Close Button */}
                    {isMobileOpen && (
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden absolute -right-12 top-6 bg-[#0047AB] text-white p-2 rounded-r-xl shadow-lg"
                        >
                            <FiX size={24} />
                        </button>
                    )}

                    {/* Logo area */}
                    <div className="h-24 flex flex-col items-center justify-center border-b border-white/10 px-4 shrink-0 transition-all">
                        <div className="flex flex-col items-center text-center">
                            <p className="text-[#FFD700] font-black text-sm tracking-[0.2em] leading-tight uppercase">Where Love is</p>
                            <p className="text-[#FFD700] font-black text-sm tracking-[0.2em] leading-tight mt-1 uppercase">There God is</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => (
                            <div key={item.label}>
                                {item.path ? (
                                    <NavLink
                                        to={item.path}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center rounded-lg transition-all duration-200 group py-3 px-4 ${isActive
                                                ? 'bg-white/10 text-white font-bold'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                            }`
                                        }
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-all duration-300 shadow-lg ring-1 ring-white/20">
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <span className="text-[15px] transition-all whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        </div>
                                    </NavLink>
                                ) : (
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => toggleMenu(item.label)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${openMenus.includes(item.label) ? 'bg-white/10 text-white font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-all duration-300 shadow-lg ring-1 ring-white/20">
                                                    <item.icon className="h-6 w-6" />
                                                </div>
                                                <span className="text-[15px] transition-all whitespace-nowrap">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <GoTriangleDown className={`h-3 w-3 transition-transform duration-300 ${openMenus.includes(item.label) ? 'rotate-0' : '-rotate-90'}`} />
                                        </button>

                                        {openMenus.includes(item.label) && (
                                            <div className="space-y-2 py-2 animate-in slide-in-from-top-1 duration-200 pl-[52px]">
                                                {item.subItems?.map(sub => (
                                                    <NavLink
                                                        key={sub.path}
                                                        to={sub.path}
                                                        onClick={() => setIsMobileOpen(false)}
                                                        className={({ isActive }) =>
                                                            `block text-[14px] font-medium transition-colors py-1 ${isActive ? 'text-white' : 'text-white/60 hover:text-white'
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
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
