import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiCheck, FiChevronRight } from 'react-icons/fi';
import { Card } from '../ui';

const FeeModal = ({ isOpen, onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [feeName, setFeeName] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [amounts, setAmounts] = useState({}); // { 'LKG': '500', ... }

    const classes = ['LKG', 'UKG', '1st Std', '2nd Std', '3rd Std', '4th Std', '5th Std', '6th Std', '7th Std', '8th Std', '9th Std', '10th Std', '11th Std', '12th Std'];
    const feeSuggestions = ['Admission Fees', 'Tuition Fees', 'Quarterly Fees', 'Half-Yearly Fees', 'Bus Fees', 'Library Fees', 'Lab Fees', 'Uniform Fees'];

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setFeeName('');
            setSelectedClasses([]);
            setAmounts({});
        }
    }, [isOpen]);

    const toggleClass = (c) => {
        setSelectedClasses(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            feeName,
            updates: selectedClasses.map(c => ({
                className: c,
                amount: amounts[c] || 0
            }))
        };
        onSave(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-2xl border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden p-0">
                <div className="p-8 pb-4 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bulk Fee Configuration</h2>
                        <div className="flex items-center gap-2 mt-2">
                             {[1, 2, 3].map(s => (
                                 <div key={s} className={`h-1.5 rounded-full transition-all ${step >= s ? 'w-8 bg-[#0047AB]' : 'w-4 bg-slate-200'}`}></div>
                             ))}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 shadow-sm"><FiX size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex justify-between">
                                    <span>Step 1: Define Fee Name</span>
                                    <span className="text-[10px] text-slate-300 font-bold tracking-normal uppercase">{feeName.length}/25</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Admission Fees"
                                    value={feeName}
                                    maxLength={25}
                                    onChange={(e) => setFeeName(e.target.value)}
                                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl text-lg font-bold focus:bg-white focus:border-[#0047AB] transition-all outline-none shadow-sm"
                                    autoFocus
                                />
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {feeSuggestions.map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFeeName(s)}
                                            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${feeName === s ? 'bg-[#0047AB] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                disabled={!feeName}
                                onClick={() => setStep(2)}
                                className="w-full flex items-center justify-center gap-2 bg-[#0047AB] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#003580] disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
                            >
                                Next: Select Classes <FiChevronRight />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Step 2: Choose Target Classes</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {classes.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => toggleClass(c)}
                                            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between font-bold text-sm ${selectedClasses.includes(c) ? 'bg-blue-50 border-[#0047AB] text-[#0047AB]' : 'bg-slate-50 border-transparent text-slate-600'}`}
                                        >
                                            {c}
                                            {selectedClasses.includes(c) && <FiCheck className="animate-in zoom-in duration-300" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest">Back</button>
                                <button
                                    type="button"
                                    disabled={selectedClasses.length === 0}
                                    onClick={() => setStep(3)}
                                    className="flex-[2] flex items-center justify-center gap-2 bg-[#0047AB] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#003580] disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
                                >
                                    Next: Set Amounts <FiChevronRight />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Step 3: Set Amounts for {feeName}</label>
                                <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                    {selectedClasses.map(c => (
                                        <div key={c} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus-within:border-[#0047AB]/20 focus-within:bg-white transition-all">
                                            <span className="w-20 font-black text-slate-900 text-sm">{c}</span>
                                            <div className="flex-1 flex items-center gap-3">
                                                <span className="text-slate-400 font-bold">₹</span>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={amounts[c] || ''}
                                                    onChange={(e) => setAmounts(prev => ({ ...prev, [c]: e.target.value }))}
                                                    className="w-full bg-transparent outline-none font-bold text-slate-700"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setStep(2)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest">Back</button>
                                <button
                                    type="submit"
                                    className="flex-[2] flex items-center justify-center gap-2 bg-[#10B981] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#059669] transition-all shadow-lg shadow-emerald-100"
                                >
                                    <FiSave /> Finalize & Save
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </Card>
        </div>
    );
};

export default FeeModal;
