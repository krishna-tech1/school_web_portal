import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiInfo, FiPackage, FiMapPin, FiDatabase } from 'react-icons/fi';

const InventoryModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        item_id: '',
        name: '',
        category: 'Stationery',
        quantity: '',
        min_quantity: '10',
        unit: 'Pieces',
        location: ''
    });

    const categories = ['Stationery', 'Sports Equipment', 'Lab Equipment', 'Furniture', 'Electronics', 'Books'];

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                quantity: initialData.quantity.toString(),
                min_quantity: initialData.min_quantity.toString()
            });
        } else {
            setFormData({
                item_id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
                name: '',
                category: 'Stationery',
                quantity: '',
                min_quantity: '10',
                unit: 'Pieces',
                location: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['quantity', 'min_quantity'].includes(name) && !/^\d*$/.test(value)) {
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 pb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            {initialData ? 'Update Item' : 'Add New Item'}
                        </h2>
                        <p className="text-[#0047AB] font-black text-[11px] uppercase tracking-widest mt-1">Global Inventory Registry</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="p-8 pt-0 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Item ID */}
                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2"><FiDatabase className="text-[#0047AB]" /> Item ID</span>
                                <span className="text-[10px] text-slate-400">{(formData.item_id || '').length}/20</span>
                            </label>
                            <input
                                name="item_id"
                                value={formData.item_id}
                                onChange={handleChange}
                                maxLength={20}
                                placeholder="e.g. INV-001"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 focus:border-[#0047AB]/20 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all"
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2"><FiPackage className="text-[#0047AB]" /> Item Name</span>
                                <span className="text-[10px] text-slate-400">{(formData.name || '').length}/25</span>
                            </label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                maxLength={25}
                                placeholder="e.g. Microscope"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 focus:border-[#0047AB]/20 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 focus:border-[#0047AB]/20 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all appearance-none cursor-pointer"
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between gap-2">
                                <span className="flex items-center gap-2"><FiMapPin className="text-[#0047AB]" /> Storage Location</span>
                                <span className="text-[10px] text-slate-400">{(formData.location || '').length}/30</span>
                            </label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                maxLength={30}
                                placeholder="e.g. Lab A, Rack 2"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 focus:border-[#0047AB]/20 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all"
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Current Quantity</label>
                            <input
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                maxLength={10}
                                placeholder="0"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 focus:border-[#0047AB]/20 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all"
                            />
                        </div>

                        {/* Min Quantity */}
                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Min. Threshold</label>
                            <input
                                name="min_quantity"
                                value={formData.min_quantity}
                                onChange={handleChange}
                                maxLength={10}
                                placeholder="10"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 focus:border-[#0047AB]/20 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all"
                            />
                        </div>

                        {/* Unit */}
                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                                <span>Unit of Measurement</span>
                                <span className="text-[10px] text-slate-400">{(formData.unit || '').length}/15</span>
                            </label>
                            <input
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                maxLength={15}
                                placeholder="e.g. Pieces, Boxes, Kg"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 focus:border-[#0047AB]/20 focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Stock Alert Info */}
                    <div className="p-5 bg-[#0047AB]/5 rounded-3xl flex gap-4 items-start border border-[#0047AB]/10">
                        <FiInfo className="text-[#0047AB] mt-0.5" size={20} />
                        <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                            Supply status is determined automatically: <br/>
                            <span className="text-amber-600">Quantity ≤ Threshold = Low Stock</span> | <span className="text-rose-600">Quantity = 0 = Out of Stock</span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(formData)}
                            className="flex-1 px-8 py-4 bg-[#0047AB] hover:bg-[#003580] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200/50 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <FiSave size={18} />
                            {initialData ? 'Update Registry' : 'Confirm Addition'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryModal;
