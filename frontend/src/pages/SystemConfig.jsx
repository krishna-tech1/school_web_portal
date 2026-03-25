import React, { useState } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const SystemConfig = () => {
    const [confirmText, setConfirmText] = useState('');
    const [loading, setLoading] = useState(false);

    // For local dev, update this to your portal server URL
    const API_URL = 'https://teacher-student-server-itw6.onrender.com/api';

    const handleReset = async () => {
        if (confirmText !== 'we started new acdamic year or new term') {
            alert('Please enter the confirmation text exactly.');
            return;
        }

        if (!window.confirm('Are you absolutely sure? This will set today as the new academic start date for everyone.')) {
            return;
        }

        try {
            setLoading(true);
            const today = new Date().toISOString().split('T')[0];

            // 1. Update Academic Start Date
            await axios.post(`${API_URL}/portal/settings`, {
                key: 'academic_start_date',
                value: today
            });

            // 2. Set Global Message
            await axios.post(`${API_URL}/portal/settings`, {
                key: 'academic_reset_message',
                value: confirmText
            });

            alert('Academic Year Reset Successfully! All teachers and students will now see today as the starting point.');
            setConfirmText('');
        } catch (err) {
            console.error('Reset Error:', err);
            alert('Failed to update system settings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 max-w-4xl mx-auto space-y-10">
            <header className="flex items-center gap-6">
                <div className="w-20 h-20 bg-blue-50 rounded-[32px] flex items-center justify-center text-[#0047AB] shadow-sm">
                    <FiShield size={40} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-[#1C2B4E]">System Configuration</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">Manage global academic cycles and security settings</p>
                </div>
            </header>

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden p-12 space-y-8">
                <div className="flex items-start gap-6 bg-rose-50 p-8 rounded-[32px] border border-rose-100">
                    <FiAlertTriangle className="text-rose-500 shrink-0" size={32} />
                    <div>
                        <h2 className="text-xl font-black text-[#1C2B4E] mb-2">Reset Academic Cycle</h2>
                        <p className="text-slate-500 font-medium leading-relaxed mb-6">
                            This action will set the current date as the **Official Start Date** for the entire institution.
                            Teachers will be unable to mark or view attendance before this date, ensuring clean data for the new term.
                        </p>

                        <div className="space-y-4">
                            <div className="p-4 bg-white/50 border border-rose-200 rounded-2xl">
                                <p className="text-[11px] font-black text-rose-400 uppercase tracking-widest mb-2">Required Confirmation Text:</p>
                                <p className="text-[14px] font-black text-[#1C2B4E] select-all italic cursor-help" title="Copy this text">
                                    "we started new acdamic year or new term"
                                </p>
                            </div>

                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                Type confirmation here:
                            </label>
                            <input
                                type="text"
                                placeholder="Type the text exactly above..."
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-[#1C2B4E] focus:border-rose-500 outline-none transition-all placeholder:text-slate-200"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleReset}
                        disabled={loading || confirmText !== 'we started new acdamic year or new term'}
                        className={`px-12 py-5 rounded-3xl font-black text-sm flex items-center gap-3 transition-all active:scale-95 shadow-xl ${confirmText === 'we started new acdamic year or new term'
                                ? 'bg-rose-500 text-white hover:bg-black shadow-rose-200'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                            }`}
                    >
                        {loading ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />}
                        Perform Academic Reset
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-blue-50/50 p-8 rounded-[32px] border border-blue-100">
                    <h3 className="font-black text-[#1C2B4E] flex items-center gap-3 mb-4 uppercase tracking-wider text-xs">
                        <FiCheckCircle size={16} className="text-blue-500" />
                        What happens after reset?
                    </h3>
                    <ul className="space-y-3 text-[13px] font-bold text-slate-500 list-disc pl-5 leading-relaxed">
                        <li>Calendar start date is updated for all users.</li>
                        <li>Attendance percentages will start fresh from today.</li>
                        <li>A global announcement banner will show your message.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SystemConfig;
