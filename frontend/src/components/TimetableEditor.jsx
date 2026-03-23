import React, { useState, useEffect } from 'react';
import { timetableAPI } from '../services/api';
import { FiSave, FiX, FiCalendar, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';

/**
 * TimetableEditor Component
 * 
 * Generic editor for managing both Staff and Student timetables.
 */
const TimetableEditor = ({ type, targetId, section, onCancel }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [timetableData, setTimetableData] = useState({});
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const periods = ['period1', 'period2', 'period3', 'period4', 'period5', 'period6', 'period7'];
    
    const timeLabels = {
        period1: '8:45 - 9:30',
        period2: '9:30 - 10:25',
        period3: '10:40 - 11:35',
        period4: '11:35 - 12:30',
        period5: '1:05 - 2:00',
        period6: '2:00 - 2:55',
        period7: '3:20 - 4:15'
    };

    useEffect(() => {
        if (targetId) fetchTimetable();
    }, [targetId, section]);

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const response = type === 'staff' 
                ? await timetableAPI.getStaff(targetId)
                : await timetableAPI.getStudent(targetId, section);
            
            const data = {};
            response.data.forEach(row => {
                data[row.day] = row;
            });
            setTimetableData(data);
        } catch (err) {
            console.error('Error fetching timetable:', err);
            toast.error('Failed to load existing timetable.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            
            for (const day of days) {
                const dayData = timetableData[day] || {};
                const payload = {
                    day: day,
                    periods: {
                        period1: dayData.period1,
                        period2: dayData.period2,
                        period3: dayData.period3,
                        period4: dayData.period4,
                        period5: dayData.period5,
                        period6: dayData.period6,
                        period7: dayData.period7
                    }
                };

                if (type === 'staff') {
                    payload.staffId = targetId;
                    await timetableAPI.saveStaff(payload);
                } else {
                    payload.className = targetId;
                    payload.section = section;
                    await timetableAPI.saveStudent(payload);
                }
            }
            toast.success('Timetable saved successfully!');
            if (onCancel) onCancel();
        } catch (err) {
            console.error('Error saving timetable:', err);
            toast.error('Failed to save timetable.');
        } finally {
            setSaving(false);
        }
    };

    const updateSlot = (day, period, field, value) => {
        setTimetableData(prev => {
            const dayData = prev[day] || {};
            const periodData = dayData[period] || { subject: '', class: '', teacher: '' };
            return {
                ...prev,
                [day]: {
                    ...dayData,
                    [period]: { ...periodData, [field]: value }
                }
            };
        });
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#0047AB] p-8 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                        <FiCalendar size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight uppercase">
                            {type === 'staff' ? `Teacher: ${targetId}` : `Class: ${targetId} - ${section}`}
                        </h3>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Configure weekly academic schedule</p>
                    </div>
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                    <FiX size={24} />
                </button>
            </div>

            {/* Grid Container */}
            <div className="p-8 overflow-auto custom-scrollbar flex-1">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-[#0047AB] rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Schedule...</p>
                    </div>
                ) : (
                    <div className="min-w-[1000px]">
                        {/* Days Row */}
                        <div className="grid grid-cols-[160px_repeat(6,1fr)] gap-4 mb-8">
                            <div className="flex items-center gap-2 text-slate-300 px-4">
                                <FiClock size={16} />
                                <span className="text-[11px] font-black uppercase tracking-widest text-center">Timing</span>
                            </div>
                            {days.map(day => (
                                <div key={day} className="text-sm font-black text-slate-400 text-center uppercase tracking-widest py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Schedule Rows */}
                        <div className="space-y-4">
                            {periods.map((period, pIdx) => (
                                <div key={pIdx} className="grid grid-cols-[160px_repeat(6,1fr)] gap-4 items-center">
                                    <div className="flex flex-col gap-1 px-4 border-l-4 border-[#0047AB]">
                                        <span className="text-[13px] font-black text-slate-700 uppercase">{period.replace('period', 'Period ')}</span>
                                        <span className="text-[10px] font-bold text-slate-300 tabular-nums">{timeLabels[period]}</span>
                                    </div>
                                    {days.map((day, dIdx) => {
                                        const slot = timetableData[day]?.[period];
                                        return (
                                            <div key={dIdx} className="bg-slate-50 rounded-2xl p-3 border border-slate-100 focus-within:border-[#0047AB] focus-within:bg-white transition-all space-y-2 group">
                                                <input 
                                                    type="text"
                                                    placeholder="Subject"
                                                    maxLength={10}
                                                    className="w-full bg-transparent text-[11px] font-black text-slate-800 outline-none placeholder:text-slate-300"
                                                    value={slot?.subject || ''}
                                                    onChange={(e) => updateSlot(day, period, 'subject', e.target.value)}
                                                />
                                                {type === 'staff' && (
                                                    <input 
                                                        type="text"
                                                        placeholder="Class"
                                                        maxLength={10}
                                                        className="w-full bg-transparent text-[9px] font-bold text-slate-400 uppercase outline-none placeholder:text-slate-200"
                                                        value={slot?.class || ''}
                                                        onChange={(e) => updateSlot(day, period, 'class', e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button 
                    onClick={onCancel}
                    className="px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all font-inter"
                >
                    Discard
                </button>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#0047AB] text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50 font-inter"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <FiSave size={18} />}
                    Apply Changes
                </button>
            </div>
        </div>
    );
};

export default TimetableEditor;
