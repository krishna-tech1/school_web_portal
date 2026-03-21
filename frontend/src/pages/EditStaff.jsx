import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiPlus, FiX, FiUpload, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiBriefcase, FiLoader } from 'react-icons/fi';
import { Card } from '../components/ui';
import { staffAPI } from '../services/api';

const EditStaff = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
        employeeId: '',
        staffType: '',
        classTeacher: 'NONE',
        subjects: [''],
        photo_url: ''
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                const response = await staffAPI.getById(id);
                // Ensure no null values for controlled inputs
                const cleanedData = {};
                Object.keys(response.data).forEach(key => {
                    cleanedData[key] = response.data[key] === null ? '' : response.data[key];
                });
                
                // Format dates for input fields (YYYY-MM-DD)
                if (cleanedData.dob) cleanedData.dob = cleanedData.dob.split('T')[0];

                // Parse subjects
                if (cleanedData.subjects) {
                    try {
                        cleanedData.subjects = JSON.parse(cleanedData.subjects);
                        if (!Array.isArray(cleanedData.subjects)) throw new Error();
                    } catch (e) {
                        // Fallback for old comma-separated strings
                        cleanedData.subjects = cleanedData.subjects.split(',').filter(Boolean).map(s => ({ class: '', subject: s }));
                    }
                } else {
                    cleanedData.subjects = [{ class: '', subject: '' }];
                }

                setFormData(prev => ({ ...prev, ...cleanedData }));
                setError('');
            } catch (err) {
                console.error('Fetch staff error:', err);
                setError('Failed to load staff details.');
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [id]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 2 * 1024 * 1024) {
            setError('File size too large (max 2MB)');
            return;
        }

        const formDataFile = new FormData();
        formDataFile.append('image', file);

        setUploading(true);
        setError('');
        try {
            const response = await staffAPI.uploadPhoto(formDataFile);
            setFormData(prev => ({ ...prev, photo_url: response.data.url }));
        } catch (err) {
            console.error('Upload failed:', err);
            setError('Photo upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Phone number restriction (only numbers)
        if (name === 'phone' && !/^\d*$/.test(value)) {
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubjectChange = (index, field, value) => {
        const newSubjects = [...formData.subjects];
        newSubjects[index][field] = value;
        setFormData(prev => ({ ...prev, subjects: newSubjects }));
    };

    const addSubject = () => {
        setFormData(prev => ({ ...prev, subjects: [...prev.subjects, { class: '', subject: '' }] }));
    };

    const removeSubject = (index) => {
        const newSubjects = formData.subjects.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, subjects: newSubjects.length > 0 ? newSubjects : [{ class: '', subject: '' }] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Comprehensive Validation
        const mandatoryFields = ['firstName', 'lastName', 'gender', 'dob', 'employeeId', 'email', 'classTeacher'];
        const missing = mandatoryFields.filter(field => !formData[field]);
        
        if (missing.length > 0) {
            setError(`Please fill all mandatory fields: ${missing.join(', ')}`);
            window.scrollTo(0, 0);
            return;
        }

        const validSubjects = formData.subjects.filter(s => (s.class && s.subject));
        
        // Ensure at least one subject entry
        // Ensure at least one subject entry if staffType is Teaching
        if (formData.staffType === 'Teaching' && validSubjects.length === 0) {
            setError('Please add at least one subject with its class for teaching staff.');
            window.scrollTo(0, 0);
            return;
        }

        // Check for internal duplicate subjects
        const subjSet = new Set();
        for (const s of validSubjects) {
            const key = `${s.class}-${s.subject}`.toLowerCase().trim();
            if (subjSet.has(key)) {
                setError(`Duplicate subject entry typed twice: ${s.class} - ${s.subject}`);
                window.scrollTo(0, 0);
                return;
            }
            subjSet.add(key);
        }

        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            setError('Phone number must be 10 digits.');
            window.scrollTo(0, 0);
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            
            const staffData = {
                ...formData,
                subjects: JSON.stringify(validSubjects)
            };

            await staffAPI.update(id, staffData);
            navigate('/staff');
        } catch (err) {
            console.error('Update staff error:', err);
            setError(err.response?.data?.message || 'Failed to update staff member.');
            window.scrollTo(0, 0);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#FBFBFE]">
                <FiLoader className="text-[#0047AB] animate-spin" size={40} />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading staff details...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-10 gap-6 md:gap-0 px-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">Edit Staff Member</h1>
                    <p className="text-[#0047AB] font-black text-[13px] uppercase tracking-widest mt-2">
                        ID: {formData.staffId || formData.employeeId || id}
                    </p>
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
                        disabled={submitting}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0047AB] hover:bg-[#003580] text-white px-8 py-3.5 rounded-xl font-black shadow-lg shadow-blue-200/50 transition-all hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                        <FiSave size={18} />
                        {submitting ? 'Updating...' : 'Update Staff'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 mx-2 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 font-bold rounded-xl">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Photo & Personal Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Photo Upload Card */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 bg-white ring-1 ring-slate-100 flex flex-col items-center text-center">
                        <div 
                            className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg relative group cursor-pointer overflow-hidden"
                            onClick={() => document.getElementById('photo-upload').click()}
                        >
                            {formData.photo_url ? (
                                <img src={formData.photo_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FiUser className="text-slate-300" size={64} />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiUpload className="text-white" size={32} />
                            </div>
                            {uploading && (
                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-[#0047AB] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <input 
                            id="photo-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <h3 className="text-lg font-black text-slate-900 mb-1">Profile Photo</h3>
                        <p className="text-xs font-bold text-slate-400 mb-6 max-w-[200px]">Upload a recent passport size photograph. Max size 2MB.</p>
                        <button 
                            type="button" 
                            onClick={() => document.getElementById('photo-upload').click()}
                            className="text-[#0047AB] font-black text-xs uppercase tracking-widest hover:underline disabled:opacity-50"
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Upload Image'}
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
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                                    <span>Employee ID <span className="text-rose-500">*</span></span>
                                    <span className="text-[9px] lowercase font-medium opacity-60">Max 20</span>
                                </label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    maxLength={20}
                                    placeholder="e.g. EMP001"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Employee Type</label>
                                <select
                                    name="staffType"
                                    value={formData.staffType || 'Teaching'}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none text-slate-600 appearance-none cursor-pointer"
                                >
                                    <option value="Teaching">Teaching</option>
                                    <option value="Non-Teaching">Non-Teaching</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Class Teacher <span className="text-rose-500">*</span></label>
                                <select
                                    name="classTeacher"
                                    value={formData.classTeacher}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none text-slate-600 appearance-none cursor-pointer"
                                >
                                    <option value="">None</option>
                                    <option value="LKG">LKG</option>
                                    <option value="UKG">UKG</option>
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i+1} value={`${i+1}${i+1 === 1 ? 'st' : i+1 === 2 ? 'nd' : i+1 === 3 ? 'rd' : 'th'} Std`}>
                                            {i+1}{i+1 === 1 ? 'st' : i+1 === 2 ? 'nd' : i+1 === 3 ? 'rd' : 'th'} Std
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider">Subject Teacher <span className="text-rose-500">*</span></label>
                                    <button 
                                        type="button" 
                                        onClick={addSubject}
                                        className="text-[#0047AB] font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1"
                                    >
                                        <FiPlus size={12} /> Add Subject
                                    </button>
                                </div>
                                {formData.subjects.map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <select
                                            value={item.class}
                                            onChange={(e) => handleSubjectChange(index, 'class', e.target.value)}
                                            className="w-1/3 px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                        >
                                            <option value="">Class</option>
                                            <option value="LKG">LKG</option>
                                            <option value="UKG">UKG</option>
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i+1} value={`${i+1}${i+1 === 1 ? 'st' : i+1 === 2 ? 'nd' : i+1 === 3 ? 'rd' : 'th'} Std`}>
                                                    {i+1}{i+1 === 1 ? 'st' : i+1 === 2 ? 'nd' : i+1 === 3 ? 'rd' : 'th'} Std
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={item.subject}
                                            onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                                            placeholder="Subject"
                                            className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                        />
                                        {formData.subjects.length > 1 && (
                                            <button 
                                                type="button" 
                                                onClick={() => removeSubject(index)}
                                                className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                            >
                                                <FiX size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
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
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                                    <span>First Name <span className="text-rose-500">*</span></span>
                                    <span className="text-[9px] lowercase font-medium opacity-60">Max 32</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    maxLength={32}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                                    <span>Last Name <span className="text-rose-500">*</span></span>
                                    <span className="text-[9px] lowercase font-medium opacity-60">Max 32</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    maxLength={32}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                                    <span>Email Address <span className="text-rose-500">*</span></span>
                                    <span className="text-[9px] lowercase font-medium opacity-60">Max 50</span>
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        maxLength={50}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                                    Phone Number
                                    <span className="text-[9px] lowercase font-medium opacity-60">Max 15</span>
                                </label>
                                <div className="relative">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength={15}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Date of Birth <span className="text-rose-500">*</span></label>
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
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Gender <span className="text-rose-500">*</span></label>
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
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                                    Current Address
                                    <span className="text-[9px] lowercase font-medium opacity-60">Max 350</span>
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    maxLength={350}
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none resize-none"
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                                        City
                                        <span className="text-[9px] lowercase font-medium opacity-60">Max 50</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        maxLength={50}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                                        State
                                        <span className="text-[9px] lowercase font-medium opacity-60">Max 50</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        maxLength={50}
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 focus:ring-4 focus:ring-[#0047AB]/5 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                                        Zip Code
                                        <span className="text-[9px] lowercase font-medium opacity-60">Max 10</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        maxLength={10}
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

export default EditStaff;
