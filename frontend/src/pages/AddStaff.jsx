import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiUploadCloud, FiChevronDown } from 'react-icons/fi';
import { Card } from '../components/ui';

const AddStaff = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        pincode: '',
        employeeId: '',
        joiningDate: '',
        designation: '',
        department: '',
        staffType: '',
        qualification: '',
        experience: '',
        salary: '',
        bankAccount: ''
    });

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button
                    onClick={() => navigate('/staff')}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                >
                    <FiArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Add Staff Member</h1>
                    <p className="text-slate-500 font-medium text-sm">Add new staff member information</p>
                </div>
            </div>

            <div className="space-y-8 max-w-5xl">
                {/* Profile Photo Section */}
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                    <h2 className="text-lg font-bold text-slate-900 mb-8 underline decoration-[#0047AB] underline-offset-8 decoration-2 text-inter">Profile Photo</h2>

                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center text-slate-300">
                            <FiUpload size={32} />
                        </div>
                        <div className="space-y-2">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-white hover:border-[#0047AB] transition-all">
                                <FiUpload size={16} />
                                Upload Photo
                            </button>
                            <p className="text-xs font-medium text-slate-400 font-inter">PNG, JPG or JPEG (Max. 5MB)</p>
                        </div>
                    </div>
                </Card>

                {/* Personal Information */}
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                    <h2 className="text-lg font-bold text-slate-900 mb-8 underline decoration-[#0047AB] underline-offset-8 decoration-2 text-inter">Personal Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">First Name</label>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Last Name</label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        {/* DOB */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Date of Birth</label>
                            <input
                                type="date"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        {/* Gender & Blood Group Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Gender</label>
                                <div className="relative">
                                    <select className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 appearance-none focus:ring-2 focus:ring-[#0047AB] transition-all">
                                        <option value="">Enter gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Blood Group</label>
                                <div className="relative">
                                    <select className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 appearance-none focus:ring-2 focus:ring-[#0047AB] transition-all">
                                        <option value="">Enter blood group</option>
                                        <option value="A+">A+</option>
                                        <option value="B+">B+</option>
                                    </select>
                                    <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>
                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter your phone number"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Address</label>
                            <textarea
                                placeholder="Enter full address"
                                rows="3"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all resize-none"
                            ></textarea>
                        </div>
                        {/* City & Pincode Row */}
                        <div className="grid grid-cols-2 gap-6 md:col-span-2">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">City</label>
                                <input
                                    type="text"
                                    placeholder="Enter city"
                                    className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Pincode</label>
                                <input
                                    type="text"
                                    placeholder="Enter pincode"
                                    className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Professional Details */}
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                    <h2 className="text-lg font-bold text-slate-900 mb-8 underline decoration-[#0047AB] underline-offset-8 decoration-2 text-inter">Professional Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {/* Employee ID */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Employee ID</label>
                            <input
                                type="text"
                                placeholder="eg:ST-001"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        {/* Joining Date */}
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Joining Date</label>
                            <input
                                type="date"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        {/* Designation & Department & Staff Type Row */}
                        <div className="grid grid-cols-3 gap-6 md:col-span-2">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Designation</label>
                                <div className="relative">
                                    <select className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 appearance-none focus:ring-2 focus:ring-[#0047AB] transition-all">
                                        <option value="">Select designation</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                    <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Department</label>
                                <div className="relative">
                                    <select className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 appearance-none focus:ring-2 focus:ring-[#0047AB] transition-all">
                                        <option value="">Select department</option>
                                        <option value="math">Mathematics</option>
                                    </select>
                                    <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Staff Type</label>
                                <div className="relative">
                                    <select className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 appearance-none focus:ring-2 focus:ring-[#0047AB] transition-all">
                                        <option value="">Select type</option>
                                        <option value="teaching">Teaching</option>
                                        <option value="non-teaching">Non-Teaching</option>
                                    </select>
                                    <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>
                        {/* Qualification & Experience Row */}
                        <div className="grid grid-cols-2 gap-6 md:col-span-2">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Qualification</label>
                                <input
                                    type="text"
                                    placeholder="Enter educational qualification"
                                    className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Experience (in years)</label>
                                <input
                                    type="text"
                                    placeholder="eg:5"
                                    className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                                />
                            </div>
                        </div>
                        {/* Salary & Bank Row */}
                        <div className="grid grid-cols-2 gap-6 md:col-span-2">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Salary (Monthly)</label>
                                <input
                                    type="text"
                                    placeholder="Enter salary"
                                    className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-3 font-inter">Bank Account Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter bank account number"
                                    className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Document Upload */}
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                    <h2 className="text-lg font-bold text-slate-900 mb-8 underline decoration-[#0047AB] underline-offset-8 decoration-2 text-inter">Document Upload</h2>

                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center hover:border-[#0047AB] hover:bg-blue-50/30 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                                <FiUploadCloud className="text-slate-400 group-hover:text-[#0047AB]" size={32} />
                            </div>
                            <p className="text-lg font-bold text-slate-900 mb-2 font-inter">Drag files here or click to upload</p>
                            <p className="text-sm font-medium text-slate-400 mb-8">Upload birth certificate, previous school records, etc.</p>
                            <button className="px-8 py-3 bg-[#f8f9fa] border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white hover:border-[#0047AB] transition-all shadow-sm">
                                Choose file
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Form Actions */}
                <div className="flex items-center gap-4 pt-10 pb-20 font-inter">
                    <button className="bg-[#0047AB] hover:bg-[#003580] text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
                        Create Staff Member
                    </button>
                    <button
                        onClick={() => navigate('/staff')}
                        className="bg-white border-2 border-slate-100 text-[#0047AB] hover:bg-slate-50 px-10 py-4 rounded-xl font-bold transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddStaff;
