import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiDollarSign, FiInfo, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { Card } from '../ui';
import { feeAPI } from '../../services/api';

const PaymentModal = ({ isOpen, onClose, student, onPaymentSuccess }) => {
    const [classFees, setClassFees] = useState([]);
    const [selectedFees, setSelectedFees] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [remark, setRemark] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && student) {
            fetchFees();
            setSelectedFees([]);
            setRemark('');
        }
    }, [isOpen, student]);

    const fetchFees = async () => {
        try {
            setLoading(true);
            const res = await feeAPI.getFeesByClass(student.class);
            setClassFees(res.data);
        } catch (err) {
            console.error('Failed to fetch class fees:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFee = (f) => {
        setSelectedFees(prev => {
            const exists = prev.find(x => x.fee_name === f.fee_name);
            if (exists) return prev.filter(x => x.fee_name !== f.fee_name);
            return [...prev, f];
        });
    };

    const totalSelected = selectedFees.reduce((sum, f) => sum + parseFloat(f.amount), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (totalSelected === 0) return alert('Please select at least one fee');

        try {
            setSubmitting(true);
            await feeAPI.recordPayment({
                studentId: student.studentId,
                amount: totalSelected,
                paymentMethod,
                remark,
                selectedFees: selectedFees.map(f => f.fee_name)
            });
            onPaymentSuccess();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Error recording payment');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-2xl border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden p-0">
                {/* Header */}
                <div className="p-8 pb-6 flex justify-between items-start bg-slate-50/50">
                    <div>
                        <p className="text-[#0047AB] font-black text-[10px] uppercase tracking-[0.2em] mb-1">Fee Collection</p>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Record Payment</h2>
                        <p className="text-slate-400 font-bold text-sm mt-1">{student?.firstName} {student?.lastName} • {student?.studentId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 shadow-sm">
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-8">
                    {/* Class Fees List */}
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Select Fees Being Paid ({student?.class})</label>
                        {loading ? (
                            <div className="py-10 flex flex-col items-center justify-center gap-3">
                                <FiLoader className="text-[#0047AB] animate-spin" size={24} />
                                <span className="text-xs font-bold text-slate-300 uppercase">Fetching balance...</span>
                            </div>
                        ) : classFees.length === 0 ? (
                            <div className="p-6 bg-slate-50 rounded-2xl text-center text-slate-400 font-bold text-sm">
                                No fee structure defined for {student?.class}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {classFees.map(f => {
                                    const isSelected = selectedFees.some(x => x.fee_name === f.fee_name);
                                    return (
                                        <button
                                            key={f.fee_name}
                                            type="button"
                                            onClick={() => toggleFee(f)}
                                            className={`p-4 rounded-2xl border-2 text-left transition-all ${isSelected ? 'bg-blue-50 border-[#0047AB] shadow-md' : 'bg-slate-50 border-transparent hover:border-slate-100'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${isSelected ? 'bg-[#0047AB] text-white' : 'bg-slate-200 text-slate-500'}`}>Fee</span>
                                                {isSelected && <FiCheckCircle className="text-[#0047AB]" />}
                                            </div>
                                            <p className="font-black text-slate-900 text-sm mb-1">{f.fee_name}</p>
                                            <p className={`font-bold ${isSelected ? 'text-[#0047AB]' : 'text-slate-400'}`}>₹ {f.amount}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-50">
                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment Method</label>
                            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                                {['Cash', 'Online', 'Cheque'].map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setPaymentMethod(m)}
                                        className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === m ? 'bg-white text-[#0047AB] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Selected</label>
                            <div className="bg-[#10B981] text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-100">
                                <FiDollarSign size={20} />
                                <span className="text-2xl font-black">₹ {totalSelected.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Optional Remarks</label>
                        <textarea
                            placeholder="e.g. Paid via UPI / Parent phone number"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#0047AB] transition-all resize-none"
                            rows="2"
                        ></textarea>
                    </div>

                    {/* Actions */}
                    <button
                        type="submit"
                        disabled={submitting || totalSelected === 0}
                        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${submitting || totalSelected === 0 ? 'bg-slate-100 text-slate-300' : 'bg-[#0047AB] text-white hover:bg-black shadow-blue-100'}`}
                    >
                        {submitting ? <FiLoader className="animate-spin" /> : <FiCheck size={18} />}
                        Confirm Payment
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default PaymentModal;
