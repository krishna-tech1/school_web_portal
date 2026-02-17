import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#FBFBFE]">
            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-in fade-in duration-300 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <Sidebar
                isMobileOpen={isMobileMenuOpen}
                setIsMobileOpen={setIsMobileMenuOpen}
                collapsed={isCollapsed}
                setCollapsed={setIsCollapsed}
            />

            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
                <Navbar
                    isMobileOpen={isMobileMenuOpen}
                    onMenuClick={() => setIsMobileMenuOpen(true)}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />
                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
