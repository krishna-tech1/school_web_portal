import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiLoader, FiSave, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import { feeAPI } from '../services/api';
import FeeModal from '../components/modals/FeeModal';

const FeeStructure = () => {
    const [feeData, setFeeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editBuffer, setEditBuffer] = useState({}); // { 'LKG-Admission Fees': '500' }

    const classes = ['All Classes', 'LKG', 'UKG', '1st Std', '2nd Std', '3rd Std', '4th Std', '5th Std', '6th Std', '7th Std', '8th Std', '9th Std', '10th Std', '11th Std', '12th Std'];

    const fetchFees = async () => {
        try {
            setLoading(true);
            const res = await feeAPI.getAll();
            setFeeData(res.data);
            
            // Clear buffer
            setEditBuffer({});
        } catch (err) {
            console.error('Failed to fetch fees:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, []);

    const handleSaveBulk = async (payload) => {
        try {
            await feeAPI.saveBulk(payload);
            setIsModalOpen(false);
            fetchFees();
        } catch (err) {
            console.error(err);
            alert('Error saving fees.');
        }
    };

    const handleInlineChange = (className, feeName, value) => {
        setEditBuffer(prev => ({
            ...prev,
            [`${className}-${feeName}`]: value
        }));
    };

    const saveBuffer = async () => {
        const updates = Object.entries(editBuffer).map(([key, amount]) => {
            const [className, feeName] = key.split(/-(.+)/);
            return { className, feeName, amount };
        });

        if (updates.length === 0) return;

        try {
            setSaving(true);
            // Group by feeName since saveBulk expects one feeName
            const grouped = updates.reduce((acc, curr) => {
                if (!acc[curr.feeName]) acc[curr.feeName] = [];
                acc[curr.feeName].push({ className: curr.className, amount: curr.amount });
                return acc;
            }, {});

            for (const feeName in grouped) {
                await feeAPI.saveBulk({ feeName, updates: grouped[feeName] });
            }
            
            fetchFees();
        } catch (err) {
            console.error(err);
            alert('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const deleteFeeType = async (feeName) => {
        if (window.confirm(`Are you SURE you want to delete "${feeName}" for ALL classes? This cannot be undone.`)) {
            try {
                // To delete a whole fee type, we can loop or add a backend route
                // For now, let's loop
                const classesWithFee = [...new Set(feeData.filter(f => f.fee_name === feeName).map(f => f.class_name))];
                for (const c of classesWithFee) {
                    await feeAPI.delete(c, feeName);
                }
                fetchFees();
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = () => setIsClassOpen(false);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const classList = classes.filter(c => c !== 'All Classes' && (selectedClass === 'All Classes' || c === selectedClass));
    const feeNames = [...new Set(feeData.map(f => f.fee_name))];
    if (feeNames.length === 0 && !loading) {
        feeNames.push('Admission Fees', 'Quarterly Fees', 'Half-Yearly Fees');
    }

    const getAmount = (className, feeName) => {
        const bufferValue = editBuffer[`${className}-${feeName}`];
        if (bufferValue !== undefined) return bufferValue;
        
        const item = feeData.find(f => f.class_name === className && f.fee_name === feeName);
        return item ? item.amount : '';
    };

    const calculateAnnualTotal = (className) => {
        const dbTotal = feeData
            .filter(f => f.class_name === className)
            .reduce((sum, f) => {
                const bufferValue = editBuffer[`${className}-${f.fee_name}`];
                const val = bufferValue !== undefined ? parseFloat(bufferValue || 0) : parseFloat(f.amount || 0);
                return sum + val;
            }, 0);
        
        // Add new items from buffer that aren't in DB yet
        const bufferItems = Object.entries(editBuffer)
            .filter(([key]) => key.startsWith(`${className}-`))
            .filter(([key]) => !feeData.some(f => `${f.class_name}-${f.fee_name}` === key))
            .reduce((sum, [, amount]) => sum + parseFloat(amount || 0), 0);

        return dbTotal + bufferItems;
    };

    const hasChanges = Object.keys(editBuffer).length > 0;

    if (loading && feeData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <FiLoader className="text-[#0047AB] animate-spin" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Fee Structure...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 md:gap-0 px-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Fee Structure</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className={`h-1.5 w-1.5 rounded-full ${hasChanges ? 'bg-amber-400 animate-pulse' : 'bg-[#10B981]'}`}></span>
                        <p className={`${hasChanges ? 'text-amber-600' : 'text-[#0047AB]'} font-black text-[13px] uppercase tracking-widest`}>
                            {hasChanges ? 'Unsaved Changes Pending' : 'Live Academic Records'}
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    {hasChanges && (
                        <button
                            onClick={saveBuffer}
                            disabled={saving}
                            className="flex items-center justify-center gap-3 bg-[#10B981] hover:bg-[#059669] text-white px-8 py-4 rounded-[1.5rem] font-black shadow-xl shadow-emerald-200/50 transition-all hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-widest"
                        >
                            {saving ? <FiLoader className="animate-spin" /> : <FiSave size={20} />}
                            Save All Changes
                        </button>
                    )}
                    {!hasChanges && (
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to reset ALL students\' pending fees to the current structure amounts? All existing payment records for the current term will be overwritten with the full amounts.')) {
                                    feeAPI.syncStudents().then(() => {
                                        alert('Successfully updated all students with the latest fee structure.');
                                    });
                                }
                            }}
                            className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-[1.5rem] font-black shadow-xl shadow-slate-200/50 transition-all hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-widest"
                        >
                            <FiLoader size={20} className={loading ? 'animate-spin' : 'hidden'} />
                            Sync All Students
                        </button>
                    )}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-3 bg-[#0047AB] hover:bg-[#003580] text-white px-8 py-4 rounded-[1.5rem] font-black shadow-xl shadow-blue-200/50 transition-all hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-widest"
                    >
                        <FiPlus size={20} />
                        Bulk Add Fee
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[3rem] shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-6 md:p-10 mb-6 group transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.05)] ring-1 ring-slate-100">
                <div className="flex flex-wrap items-center gap-6 mb-8">
                    {/* Class Dropdown */}
                    <div className="relative flex-1 md:flex-none" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setIsClassOpen(!isClassOpen)}
                            className="w-full flex items-center justify-between gap-8 bg-slate-50 border-2 border-slate-50 text-slate-900 px-8 py-4.5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest min-w-[220px] hover:bg-white hover:border-[#0047AB]/20 transition-all shadow-sm"
                        >
                            {selectedClass}
                            <FiChevronDown className={`transition-transform duration-500 ${isClassOpen ? 'rotate-180' : ''}`} size={18} />
                        </button>
                        {isClassOpen && (
                            <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] max-h-[300px] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5 custom-scrollbar">
                                {classes.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => {
                                            setSelectedClass(c);
                                            setIsClassOpen(false);
                                        }}
                                        className={`w-full text-left px-6 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedClass === c ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Transposed Table Section */}
                <div className="border-t border-slate-50 pt-8 overflow-x-auto rounded-3xl custom-scrollbar">
                    <table className="w-full border-separate border-spacing-x-4 border-spacing-y-0 text-left">
                        <thead>
                            <tr>
                                <th className="sticky left-0 bg-white z-10 p-6 min-w-[220px] border-b-2 border-slate-100 uppercase tracking-[0.2em] text-[10px] font-black text-slate-400">
                                    Fee Type Name
                                </th>
                                {classList.map(c => (
                                    <th key={c} className="p-6 text-center min-w-[150px] border-b-2 border-[#0047AB]/10 bg-blue-50/30 rounded-t-[1.5rem]">
                                        <span className="font-black text-slate-900 text-sm whitespace-nowrap">{c}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {feeNames.map(fName => (
                                <tr key={fName} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="sticky left-0 bg-white z-20 p-6 font-black text-slate-500 text-[11px] uppercase tracking-widest border-r-2 border-slate-50 shadow-[10px_0_15px_-5px_rgba(0,0,0,0.05)] flex justify-between items-center group/row">
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <span className="truncate pr-4">{fName}</span>
                                            {feeData.find(f => f.fee_name === fName)?.due_date && (
                                                <span className="text-[9px] text-[#0047AB] lowercase">{new Date(feeData.find(f => f.fee_name === fName).due_date).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button 
                                                onClick={() => {
                                                    const date = prompt(`Enter Deadline (YYYY-MM-DD) for "${fName}":`, feeData.find(f => f.fee_name === fName)?.due_date?.split('T')[0] || '');
                                                    if (date) {
                                                        const selectedDate = new Date(date);
                                                        const today = new Date();
                                                        today.setHours(0,0,0,0);
                                                        if (selectedDate < today) {
                                                            alert('Past dates are not allowed.');
                                                            return;
                                                        }
                                                        feeAPI.saveDueDate({ feeName: fName, dueDate: date }).then(() => {
                                                            alert(`Deadline for ${fName} set to ${date}. System will now mark students as overdue after this date.`);
                                                            fetchFees();
                                                        });
                                                    }
                                                }}
                                                title="Set Fee Deadline"
                                                className="opacity-0 group-hover/row:opacity-100 p-2 bg-[#0047AB]/5 text-[#0047AB] hover:bg-[#0047AB] hover:text-white rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                                            >
                                                <FiCalendar size={14} />
                                                <span className="text-[10px] font-black uppercase">Deadline</span>
                                            </button>
                                            <button 
                                                onClick={() => deleteFeeType(fName)}
                                                title={`Delete "${fName}" type`}
                                                className="opacity-0 group-hover/row:opacity-100 p-2 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    {classList.map(c => (
                                        <td key={`${c}-${fName}`} className="p-6 text-center min-w-[150px]">
                                            <div className="relative group/cell">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">₹</div>
                                                <input
                                                    type="number"
                                                    value={getAmount(c, fName)}
                                                    onChange={(e) => handleInlineChange(c, fName, e.target.value)}
                                                    className={`w-full bg-slate-50/50 pl-7 pr-3 py-3 rounded-xl border-2 transition-all font-bold text-sm outline-none ${editBuffer[`${c}-${fName}`] !== undefined ? 'border-amber-200 bg-amber-50/30 focus:border-amber-400' : 'border-transparent hover:border-slate-200 focus:border-[#0047AB]/20 focus:bg-white'}`}
                                                    placeholder="0"
                                                />
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            
                            {/* Total Annual Row */}
                            <tr className="bg-blue-50/30 group">
                                <td className="sticky left-0 bg-white z-20 p-6 font-black text-[#0047AB] text-[11px] uppercase tracking-widest border-r-2 border-blue-50 shadow-[10px_0_15px_-5px_rgba(0,0,0,0.05)] border-t-2 border-blue-100">
                                    Total Annual Fees
                                </td>
                                {classList.map(c => (
                                    <td key={`total-${c}`} className="p-6 text-center border-t-2 border-blue-100 bg-blue-50/10">
                                        <div className="flex flex-col items-center">
                                            <span className="font-black text-[#0047AB] text-lg">₹{calculateAnnualTotal(c).toLocaleString()}</span>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Gross Total</span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {feeNames.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-20 gap-4 text-slate-300">
                        <FiAlertCircle size={48} />
                        <p className="font-black text-xs uppercase tracking-widest">No fee types configured yet</p>
                    </div>
                )}
            </div>

            <FeeModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveBulk}
            />
        </div>
    );
};

export default FeeStructure;
