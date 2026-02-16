import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiChevronDown } from 'react-icons/fi';
import { Card } from '../../components/ui';

const AddStudent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        address: '',
        class: '',
        section: '',
        rollNumber: '',
        parentName: '',
        relation: '',
        phoneNumber: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Add New Student</h1>
                <p className="text-slate-500 font-medium">Fill out the student admission form</p>
            </div>

            <div className="space-y-8 max-w-5xl">
                {/* Personal Details Section */}
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                    <h2 className="text-lg font-bold text-slate-900 mb-8 underline decoration-[#0047AB] underline-offset-8 decoration-2">Personal Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Enter your first name"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Enter your last name"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">Gender</label>
                            <div className="relative">
                                <select
                                    name="gender"
                                    className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 appearance-none focus:ring-2 focus:ring-[#0047AB] transition-all"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-900 mb-3">Address</label>
                            <textarea
                                name="address"
                                placeholder="Enter full address"
                                rows="3"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>
                </Card>

                {/* Class & Section Allocation Section */}
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                    <h2 className="text-lg font-bold text-slate-900 mb-8 underline decoration-[#0047AB] underline-offset-8 decoration-2">Class & Section allocation</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">Class</label>
                            <div className="relative">
                                <select
                                    name="class"
                                    className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 appearance-none focus:ring-2 focus:ring-[#0047AB] transition-all"
                                >
                                    <option value="">Select class</option>
                                    <option value="10">10th Grade</option>
                                </select>
                                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">Section</label>
                            <div className="relative">
                                <select
                                    name="section"
                                    className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 appearance-none focus:ring-2 focus:ring-[#0047AB] transition-all"
                                >
                                    <option value="">Select Section</option>
                                    <option value="A">Section A</option>
                                </select>
                                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">Roll Number</label>
                            <input
                                type="text"
                                name="rollNumber"
                                placeholder="eg:25..."
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                    </div>
                </Card>

                {/* Parent / Guardian Details Section */}
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                    <h2 className="text-lg font-bold text-slate-900 mb-8 underline decoration-[#0047AB] underline-offset-8 decoration-2">Parent / Guardian Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">Parent / Guardian name</label>
                            <input
                                type="text"
                                name="parentName"
                                placeholder="Enter parent name"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">Relation</label>
                            <div className="relative">
                                <select
                                    name="relation"
                                    className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 appearance-none focus:ring-2 focus:ring-[#0047AB] transition-all"
                                >
                                    <option value="">Select Relation</option>
                                    <option value="father">Father</option>
                                    <option value="mother">Mother</option>
                                </select>
                                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Enter your phone number"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-3">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>
                    </div>
                </Card>

                {/* Document Upload Section */}
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                    <h2 className="text-lg font-bold text-slate-900 mb-8 underline decoration-[#0047AB] underline-offset-8 decoration-2">Document Upload</h2>

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
                <div className="flex items-center gap-4 pt-10 pb-20">
                    <button className="bg-[#0047AB] hover:bg-[#003580] text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
                        Save Student
                    </button>
                    <button
                        onClick={() => navigate('/students')}
                        className="bg-white border-2 border-slate-100 text-[#0047AB] hover:bg-slate-50 px-10 py-4 rounded-xl font-bold transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddStudent;
