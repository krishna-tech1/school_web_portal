import React, { useState, useEffect } from 'react';
import { FiBox } from 'react-icons/fi';

const Inventory = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a slight delay for the premium feel
        const timer = setTimeout(() => {
            // We keep it in a "loading" or "coming soon" state as requested
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-[calc(100vh-64px)] flex flex-col items-center justify-center animate-in fade-in duration-500">
            {/* Spinning Loader */}
            <div className="relative mb-12">
                <div className="w-32 h-32 border-8 border-slate-100 border-t-[#0047AB] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <FiBox className="text-[#0047AB] animate-pulse" size={40} />
                </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-4 max-w-md">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    Inventory System
                </h1>
                <div className="h-1.5 w-24 bg-[#0047AB] mx-auto rounded-full"></div>
                <p className="text-slate-500 font-bold text-lg mt-6">
                    This advanced feature is under heavy development.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                    <span className="px-4 py-2 bg-blue-50 text-[#0047AB] rounded-xl text-sm font-black uppercase tracking-wider">
                        Coming Soon
                    </span>
                    <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="mt-20 grid grid-cols-3 gap-8 opacity-20 filter grayscale">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl animate-pulse"></div>
                <div className="w-16 h-16 bg-slate-200 rounded-2xl animate-pulse [animation-delay:0.3s]"></div>
                <div className="w-16 h-16 bg-slate-200 rounded-2xl animate-pulse [animation-delay:0.6s]"></div>
            </div>
        </div>
    );
};

export default Inventory;
