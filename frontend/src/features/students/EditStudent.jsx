import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiChevronDown, FiSave, FiArrowLeft, FiLoader, FiCamera, FiUser } from 'react-icons/fi';
import { Card } from '../../components/ui';
import { studentAPI } from '../../services/api';

const EditStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        class: '',
        section: '',
        rollNumber: '',
        guardianName: '',
        relation: '',
        guardianPhone: '',
        email: '',
        feeStatus: 'Pending',
        pendingFee: 0,
        photo_url: ''
    });
    const [uploading, setUploading] = useState(false);

    const classes = ['LKG', 'UKG', '1st Std', '2nd Std', '3rd Std', '4th Std', '5th Std', '6th Std', '7th Std', '8th Std', '9th Std', '10th Std', '11th Std', '12th Std'];
    const sections = ['A', 'B', 'C', 'D', 'E'];

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        try {
            setUploading(true);
            const response = await studentAPI.uploadPhoto(uploadFormData);
            setFormData(prev => ({ ...prev, photo_url: response.data.url }));
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload photo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await studentAPI.getById(id);
                const data = res.data;
                // Format date for input[type="date"]
                if (data.dateOfBirth) {
                    data.dateOfBirth = new Date(data.dateOfBirth).toISOString().split('T')[0];
                }
                setFormData(data);
            } catch (err) {
                console.error('Failed to fetch student:', err);
                setError('Could not load student data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Phone number restriction (only numbers)
        if (name === 'guardianPhone' && !/^\d*$/.test(value)) {
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        const mandatoryFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'class', 'section', 'rollNumber', 'guardianName', 'relation', 'guardianPhone', 'email', 'photo_url'];
        const missing = mandatoryFields.filter(f => !formData[f]);

        if (missing.length > 0) {
            setError(`Please fill all mandatory fields: ${missing.join(', ')}`);
            window.scrollTo(0, 0);
            return;
        }

        setSubmitting(true);
        setError('');
        try {
            await studentAPI.update(id, formData);
            navigate(`/students/${id}`);
        } catch (err) {
            console.error(err);
            setError('Failed to update student. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <FiLoader className="text-[#0047AB] animate-spin" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading form...</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-3">
                        <FiSave className="text-[#0047AB]" /> Edit Student Record
                    </h1>
                    <p className="text-slate-500 font-medium">Updating profile for {formData.studentId}</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#0047AB] font-bold transition-colors"
                >
                    <FiArrowLeft /> Back
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 font-bold rounded-xl">
                    {error}
                </div>
            )}

            <div className="space-y-8 max-w-5xl">
                {/* Personal Details Section */}
                <Card className="border-none shadow-[0_4px_25px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 md:p-12 bg-white">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                                    {formData.photo_url ? (
                                        <img 
                                            src={formData.photo_url} 
                                            alt="Student Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FiUser className="w-16 h-16 text-slate-200" />
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                                            <div className="w-8 h-8 border-4 border-[#0047AB] border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#0047AB] text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#003580] transition-all hover:scale-110 active:scale-95 group-hover:rotate-6">
                                    <FiCamera size={20} />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Photograph <span className="text-rose-500">*</span></p>
                        </div>

                        <div className="flex-1 w-full">
                            <h2 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-4">
                                <span className="w-2 h-8 bg-[#0047AB] rounded-full"></span>
                                Personal Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest flex justify-between items-center">
                                        First Name
                                        <span className="text-[10px] lowercase font-medium opacity-60">Max 32</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        maxLength={32}
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold placeholder-slate-400 focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm"
                                    />
                                </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest flex justify-between items-center">
                                Last Name <span className="text-rose-500">*</span>
                                <span className="text-[10px] lowercase font-medium opacity-60">Max 32</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                maxLength={32}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold placeholder-slate-400 focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">Date of Birth <span className="text-rose-500">*</span></label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold appearance-none focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">Gender <span className="text-rose-500">*</span></label>
                            <div className="relative">
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold appearance-none focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm"
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest flex justify-between items-center">
                                Address
                                <span className="text-[10px] lowercase font-medium opacity-60">Max 350</span>
                            </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    maxLength={350}
                                    rows="3"
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold placeholder-slate-400 focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm resize-none"
                                ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Academic Information */}
                <Card className="border-none shadow-[0_4px_25px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 md:p-12 bg-white">
                    <h2 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-4">
                        <span className="w-2 h-8 bg-[#0047AB] rounded-full"></span>
                        Academic Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">Class <span className="text-rose-500">*</span></label>
                            <div className="relative">
                                <select
                                    name="class"
                                    value={formData.class}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold appearance-none focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm"
                                >
                                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">Section <span className="text-rose-500">*</span></label>
                            <div className="relative">
                                <select
                                    name="section"
                                    value={formData.section}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold appearance-none focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm"
                                >
                                    {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
                                </select>
                                <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest flex justify-between items-center">
                                Roll Number <span className="text-rose-500">*</span>
                                <span className="text-[10px] lowercase font-medium opacity-60">Max 10</span>
                            </label>
                            <input
                                type="text"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                maxLength={10}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold placeholder-slate-400 focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm"
                            />
                        </div>
                    </div>
                </Card>

                {/* Guardian Details */}
                <Card className="border-none shadow-[0_4px_25px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 md:p-12 bg-white">
                    <h2 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-4">
                        <span className="w-2 h-8 bg-[#0047AB] rounded-full"></span>
                        Guardian Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest flex justify-between items-center">
                                Guardian Name <span className="text-rose-500">*</span>
                                <span className="text-[10px] lowercase font-medium opacity-60">Max 100</span>
                            </label>
                            <input
                                type="text"
                                name="guardianName"
                                value={formData.guardianName}
                                onChange={handleChange}
                                maxLength={100}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold placeholder-slate-400 focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">Relation <span className="text-rose-500">*</span></label>
                            <div className="relative">
                                <select
                                    name="relation"
                                    value={formData.relation}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold appearance-none focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm"
                                >
                                    <option value="Father">Father</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Guardian">Guardian</option>
                                </select>
                                <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest flex justify-between items-center">
                                Phone Number <span className="text-rose-500">*</span>
                                <span className="text-[10px] lowercase font-medium opacity-60">Max 15</span>
                            </label>
                            <input
                                type="text"
                                name="guardianPhone"
                                value={formData.guardianPhone}
                                onChange={handleChange}
                                maxLength={15}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold placeholder-slate-400 focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest flex justify-between items-center">
                                Email <span className="text-rose-500">*</span>
                                <span className="text-[10px] lowercase font-medium opacity-60">Max 50</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                maxLength={50}
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] text-slate-900 font-bold placeholder-slate-400 focus:border-[#0047AB] focus:bg-white transition-all outline-none shadow-sm"
                            />
                        </div>
                    </div>
                </Card>

                {/* Form Actions */}
                <div className="flex items-center gap-6 pt-10 pb-20">
                    <button
                        onClick={handleSave}
                        disabled={submitting}
                        className={`bg-[#0047AB] hover:bg-[#003580] text-white px-12 py-5 rounded-2xl font-black shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-3`}
                    >
                        {submitting ? 'Updating...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white border-2 border-slate-100 text-slate-500 hover:text-[#0047AB] hover:border-[#0047AB] px-10 py-5 rounded-2xl font-black transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditStudent;
