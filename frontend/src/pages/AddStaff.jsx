import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiUpload, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { Card } from '../components/ui';

const AddStaff = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        joiningDate: '',
        designation: '',
        department: '',
        employeeId: '',
        qualification: '',
        experience: '',
        salary: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Simulate API call
        setTimeout(() => {
            navigate('/staff');
        }, 1000);
    };

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 px-2">

                <span className="text-[11px] font-black tracking-widest text-[#0047AB] uppercase">Add New Staff</span>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 md:gap-0 px-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Add New Staff Member</h1>
                    <p className="text-slate-500 font-bold text-sm mt-2">Enter the details of the new staff member below.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={() => navigate('/staff')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-slate-600 px-6 py-3.5 rounded-xl font-black shadow-sm border border-slate-200 hover:bg-slate-50 transition-all text-xs uppercase tracking-widest"
                    >
                        <FiX size={18} />
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0047AB] hover:bg-[#003580] text-white px-8 py-3.5 rounded-xl font-black shadow-lg shadow-blue-200/50 transition-all hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest"
                    >
                        <FiSave size={18} />
                        Save Staff
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Photo & Personal Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Photo Upload Card */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 bg-white ring-1 ring-slate-100 flex flex-col items-center text-center">
                        <div className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg relative group cursor-pointer overflow-hidden">
                            <FiUser className="text-slate-300" size={64} />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiUpload className="text-white" size={32} />
                            </div>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-1">Profile Photo</h3>
                        <p className="text-xs font-bold text-slate-400 mb-6 max-w-[200px]">Upload a recent passport size photograph. Max size 2MB.</p>
                        <button type="button" className="text-[#0047AB] font-black text-xs uppercase tracking-widest hover:underline">
                            Upload Image
                        </button>
                    </Card>

                    {/* Employment Details */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 bg-white ring-1 ring-slate-100">
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                            <FiBriefcase className="text-[#0047AB]" />
                            Employment Details
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    placeholder="e.g. EMP001"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Joining Date</label>
                                <input
                                    type="date"
                                    name="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none text-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Department</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none text-slate-600 appearance-none cursor-pointer"
                                >
                                    <option value="">Select Department</option>
                                    <option value="Academic">Academic</option>
                                    <option value="Science">Science</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Administration">Administration</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Teacher"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column - Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 bg-white ring-1 ring-slate-100">
                        <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                            <FiUser className="text-[#0047AB]" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Date of Birth</label>
                                <div className="relative">
                                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none text-slate-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none text-slate-600 appearance-none cursor-pointer"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    {/* Address Information */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 bg-white ring-1 ring-slate-100">
                        <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                            <FiMapPin className="text-[#0047AB]" />
                            Address Details
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Current Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none resize-none"
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Zip Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default AddStaff;
