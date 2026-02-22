import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronDown, FiAlertTriangle, FiPackage } from 'react-icons/fi';
import { Card, Table } from '../components/ui';

const Inventory = () => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const categories = ['All Categories', 'Stationery', 'Sports Equipment', 'Lab Equipment', 'Furniture', 'Electronics', 'Books'];
    const statuses = ['All Status', 'In Stock', 'Low Stock', 'Out of Stock'];

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsCategoryOpen(false);
            setIsStatusOpen(false);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const baseInventory = [
        { itemId: 'INV001', name: 'A4 Paper Ream', category: 'Stationery', quantity: 150, minQuantity: 50, unit: 'Reams', location: 'Store Room A', status: 'In Stock' },
        { itemId: 'INV002', name: 'Whiteboard Markers', category: 'Stationery', quantity: 25, minQuantity: 30, unit: 'Boxes', location: 'Store Room A', status: 'Low Stock' },
        { itemId: 'INV003', name: 'Football', category: 'Sports Equipment', quantity: 8, minQuantity: 10, unit: 'Pieces', location: 'Sports Room', status: 'Low Stock' },
        { itemId: 'INV004', name: 'Chemistry Lab Beakers', category: 'Lab Equipment', quantity: 45, minQuantity: 20, unit: 'Pieces', location: 'Chemistry Lab', status: 'In Stock' },
        { itemId: 'INV005', name: 'Student Desks', category: 'Furniture', quantity: 0, minQuantity: 5, unit: 'Pieces', location: 'Warehouse', status: 'Out of Stock' },
        { itemId: 'INV006', name: 'Projectors', category: 'Electronics', quantity: 12, minQuantity: 8, unit: 'Pieces', location: 'IT Room', status: 'In Stock' },
        { itemId: 'INV007', name: 'Basketball', category: 'Sports Equipment', quantity: 6, minQuantity: 8, unit: 'Pieces', location: 'Sports Room', status: 'Low Stock' },
        { itemId: 'INV008', name: 'Reference Books', category: 'Books', quantity: 250, minQuantity: 100, unit: 'Books', location: 'Library', status: 'In Stock' },
        { itemId: 'INV009', name: 'Microscopes', category: 'Lab Equipment', quantity: 15, minQuantity: 10, unit: 'Pieces', location: 'Biology Lab', status: 'In Stock' },
        { itemId: 'INV010', name: 'Chairs', category: 'Furniture', quantity: 3, minQuantity: 10, unit: 'Pieces', location: 'Warehouse', status: 'Low Stock' },
    ];

    // Filter Logic
    const inventoryList = baseInventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.itemId.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
        const matchesStatus = selectedStatus === 'All Status' || item.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const lowStockCount = baseInventory.filter(item => item.status === 'Low Stock').length;
    const outOfStockCount = baseInventory.filter(item => item.status === 'Out of Stock').length;
    const totalItems = baseInventory.length;

    const columns = [
        {
            header: 'Item ID',
            accessor: 'itemId',
        },
        {
            header: 'Item Name',
            accessor: 'name',
            render: (row) => <span className="font-semibold text-slate-700">{row.name}</span>,
        },
        {
            header: 'Category',
            accessor: 'category',
        },
        {
            header: 'Quantity',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{row.quantity}</span>
                    <span className="text-xs text-slate-400">{row.unit}</span>
                </div>
            ),
        },
        {
            header: 'Min. Quantity',
            render: (row) => (
                <span className="text-slate-600">{row.minQuantity} {row.unit}</span>
            ),
        },
        {
            header: 'Location',
            accessor: 'location',
        },
        {
            header: 'Status',
            render: (row) => (
                <div className={`px-4 py-1.5 rounded-lg text-xs font-black text-center inline-block min-w-[100px] ${row.status === 'In Stock'
                    ? 'bg-[#10B981] text-white'
                    : row.status === 'Low Stock'
                        ? 'bg-[#F59E0B] text-white'
                        : 'bg-[#EF4444] text-white'
                    }`}>
                    {row.status}
                </div>
            ),
        },
        {
            header: 'Actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-[#0047AB]">
                        <FiEdit2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500">
                        <FiTrash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-[11px] font-black tracking-widest text-[#0047AB] uppercase">Inventory Management</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 md:gap-0 px-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Inventory Management</h1>
                    <div className="flex items-center gap-3 mt-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
                        <p className="text-[#0047AB] font-black text-[13px] uppercase tracking-widest">Total Items: {totalItems}</p>
                    </div>
                </div>
                <button
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#0047AB] hover:bg-[#003580] text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-blue-200/50 transition-all hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-widest"
                >
                    <FiPlus size={20} />
                    Add New Item
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: 'Total Items', value: totalItems, icon: FiPackage, gradient: 'from-emerald-500 to-teal-600', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600', desc: 'In inventory' },
                    { label: 'Low Stock', value: lowStockCount, icon: FiAlertTriangle, gradient: 'from-amber-400 to-orange-500', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-600', desc: 'Need restocking' },
                    { label: 'Out of Stock', value: outOfStockCount, icon: FiAlertTriangle, gradient: 'from-rose-500 to-red-600', iconBg: 'bg-rose-500/10', iconColor: 'text-rose-600', desc: 'Unavailable' },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={i}
                            className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1.5 overflow-hidden"
                        >
                            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${stat.gradient} opacity-[0.03] group-hover:opacity-[0.08] rounded-full transition-opacity duration-700 blur-2xl`} />

                            <div className="relative z-10">
                                <div className="mb-6">
                                    <div className={`w-fit p-4 rounded-2xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                        <Icon size={26} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                                    </div>
                                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1 opacity-60">{stat.desc}</p>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-50 overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 ease-out w-1/3 group-hover:w-full`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[3rem] shadow-[0_15px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-6 md:p-10 mb-6 group transition-all duration-500 hover:shadow-[0_30px_70px_rgba(0,0,0,0.05)] ring-1 ring-slate-100">
                <div className="flex flex-wrap items-center gap-6">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[300px] group/search">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-[#0047AB] transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by item name or ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-16 pr-6 py-4.5 bg-slate-50 border-2 border-slate-50 rounded-[1.25rem] text-[15px] font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        {/* Category Dropdown */}
                        <div className="relative flex-1 md:flex-none group/drop" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => {
                                    setIsCategoryOpen(!isCategoryOpen);
                                    setIsStatusOpen(false);
                                }}
                                className="w-full flex items-center justify-between gap-8 bg-slate-50 border-2 border-slate-50 text-slate-900 px-8 py-4.5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest min-w-[200px] hover:bg-white hover:border-[#0047AB]/20 transition-all"
                            >
                                {selectedCategory}
                                <FiChevronDown className={`transition-transform duration-500 ${isCategoryOpen ? 'rotate-180' : ''}`} size={18} />
                            </button>
                            {isCategoryOpen && (
                                <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5">
                                    {categories.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => {
                                                setSelectedCategory(c);
                                                setIsCategoryOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedCategory === c ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status Dropdown */}
                        <div className="relative flex-1 md:flex-none group/drop" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => {
                                    setIsStatusOpen(!isStatusOpen);
                                    setIsCategoryOpen(false);
                                }}
                                className="w-full flex items-center justify-between gap-8 bg-slate-50 border-2 border-slate-50 text-slate-900 px-8 py-4.5 rounded-[1.25rem] font-black text-xs uppercase tracking-widest min-w-[180px] hover:bg-white hover:border-[#0047AB]/20 transition-all"
                            >
                                {selectedStatus}
                                <FiChevronDown className={`transition-transform duration-500 ${isStatusOpen ? 'rotate-180' : ''}`} size={18} />
                            </button>
                            {isStatusOpen && (
                                <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-black/5">
                                    {statuses.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => {
                                                setSelectedStatus(s);
                                                setIsStatusOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-3 text-[13px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${selectedStatus === s ? 'text-[#0047AB] bg-blue-50' : 'text-slate-600'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="mt-12 border-t border-slate-50 pt-8 overflow-x-auto rounded-2xl">
                    <Table
                        columns={columns}
                        data={inventoryList}
                        className="border-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default Inventory;
