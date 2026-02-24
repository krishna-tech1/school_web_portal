import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiBell, FiSearch, FiUser, FiLogOut, FiSettings, FiMenu, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const Navbar = ({ onMenuClick, isMobileOpen, isCollapsed, setIsCollapsed }) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'Dashboard';
        if (path.startsWith('/students')) return 'Students';
        if (path.startsWith('/staff')) return 'Teacher';
        if (path.startsWith('/attendance')) return 'Attendance';
        if (path.startsWith('/fees')) return 'Fees';
        if (path.startsWith('/inventory')) return 'Inventory';
        return 'School Portal';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="bg-[#0047AB] text-white h-16 md:h-20 sticky top-0 z-30 transition-all duration-300 shadow-lg px-4 md:px-8 border-b border-white/10">
            <div className="h-full flex items-center justify-between">
                {/* Left Section: Toggle, Logo & Name */}
                <div className="flex items-center gap-6">
                    {/* PC Toggle Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-90 border border-white/10 shadow-sm"
                    >
                        {isCollapsed ? <FiChevronRight size={22} /> : <FiChevronLeft size={22} />}
                    </button>

                    {/* Mobile Menu Button */}
                    {!isMobileOpen && (
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90"
                        >
                            <FiMenu size={24} />
                        </button>
                    )}

                    {/* Branding */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex w-12 h-12 bg-white rounded-xl items-center justify-center shadow-lg ring-2 ring-white/20 p-1">
                            <img src={Logo} alt="School Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-[13px] md:text-sm font-black tracking-[0.15em] leading-none uppercase text-white/90">X'AN MATRICULATION SCHOOL</h1>
                            <p className="text-[10px] font-bold text-[#FFD700] tracking-widest mt-1 uppercase leading-none">{getPageTitle()}</p>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3 md:gap-6">
                    {/* Notifications */}
                    <button className="hidden sm:block relative p-2.5 hover:bg-white/10 rounded-full transition-all group">
                        <FiBell className="h-5 w-5" />
                        <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 border-2 border-[#0047AB] rounded-full"></span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 p-1 rounded-full hover:bg-white/10 transition-all group"
                        >
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=ffffff&color=0047AB`}
                                alt="User Profile"
                                className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-white/20 shadow-sm"
                            />
                            <div className="text-left hidden md:flex items-center gap-2">
                                <p className="text-sm font-bold">{user?.name || 'User'}</p>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-300 z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-50">
                                    <p className="text-sm font-bold text-slate-900">{user?.name || 'User Profile'}</p>
                                    <p className="text-xs text-slate-500">{user?.email || 'user@school.in'}</p>
                                </div>
                                <button
                                    onClick={() => { navigate('/settings'); setShowProfileMenu(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    <FiSettings className="h-4 w-4" />
                                    Account Settings
                                </button>
                                <div className="h-[1px] bg-slate-50 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <FiLogOut className="h-4 w-4" />
                                    Logout Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
