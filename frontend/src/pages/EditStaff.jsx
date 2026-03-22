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
        staffType: 'Teaching',
        classTeacher: 'NONE',
        subjects: [{ class: '', subject: '' }],
        photo_url: ''
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                const response = await staffAPI.getById(id);
                const rawData = response.data;
                
                // Ensure no null values for controlled inputs
                const cleanedData = {};
                Object.keys(rawData).forEach(key => {
                    cleanedData[key] = rawData[key] === null ? '' : rawData[key];
                });
                
                // Map DB snake_case to Frontend camelCase
                if (rawData.class_teacher) cleanedData.classTeacher = rawData.class_teacher;
                if (rawData.staff_type) cleanedData.staffType = rawData.staff_type;
                
                // Format dates (YYYY-MM-DD)
                if (cleanedData.dob) cleanedData.dob = cleanedData.dob.split('T')[0];

                // Parse subjects (handle new subjects_list or old subjects column)
                let subjs = rawData.subjects_list || rawData.subjects;
                if (typeof subjs === 'string' && subjs) {
                  try {
                    subjs = JSON.parse(subjs);
                  } catch (e) {
                    subjs = [{ class: '', subject: '' }];
                  }
                }
                if (!Array.isArray(subjs) || subjs.length === 0) {
                  subjs = [{ class: '', subject: '' }];
                }
                cleanedData.subjects = subjs;

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
        if (name === 'phone' && !/^\d*$/.test(value)) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (index, field, value) => {
        const newSubjects = [...formData.subjects];
        newSubjects[index] = { ...newSubjects[index], [field]: value };
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
        
        const mandatoryFields = ['firstName', 'lastName', 'gender', 'dob', 'employeeId', 'email', 'classTeacher'];
        const missing = mandatoryFields.filter(field => !formData[field]);
        if (missing.length > 0) {
            setError(`Please fill all mandatory fields: ${missing.join(', ')}`);
            window.scrollTo(0, 0);
            return;
        }

        const validSubjects = formData.subjects.filter(s => s.class && s.subject);
        if (formData.staffType === 'Teaching' && validSubjects.length === 0) {
            setError('Please add at least one subject with its class for teaching staff.');
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

    if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-screen animate-pulse">
          <FiLoader className="text-blue-500 animate-spin mb-4" size={40} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Details...</p>
      </div>
    );

    return (
        <div className="p-4 md:p-10 bg-[#FBFBFE] min-h-screen animate-in fade-in duration-1000">
            <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Edit Staff Profile</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Refining records for {formData.employeeId}</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/staff')}
                        className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 shadow-sm transition-all"
                    >
                        <FiX size={20} />
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 bg-[#0047AB] text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                        {submitting ? <FiLoader className="animate-spin" /> : <FiSave />}
                        Update Data
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 font-bold rounded-2xl max-w-7xl mx-auto">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                <div className="lg:col-span-1 space-y-8">
                    {/* Photo upload section (kept same for brevity) */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 bg-white ring-1 ring-slate-50 flex flex-col items-center text-center">
                        <div 
                            className="w-40 h-40 bg-slate-50 rounded-[45px] flex items-center justify-center mb-8 border-4 border-white shadow-xl relative group cursor-pointer overflow-hidden ring-1 ring-slate-100"
                            onClick={() => document.getElementById('photo-upload').click()}
                        >
                            {formData.photo_url ? (
                                <img src={formData.photo_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FiUser className="text-slate-200" size={64} />
                            )}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FiUpload className="text-white" size={32} />
                            </div>
                        </div>
                        <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        <h3 className="text-lg font-black text-slate-900 mb-2">Profile Image</h3>
                        <p className="text-[11px] font-bold text-slate-400 max-w-[200px] leading-relaxed italic">Click image above to change staff photograph (max 2MB)</p>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 bg-white ring-1 ring-slate-50">
                        <h3 className="text-base font-black text-slate-900 mb-8 flex items-center gap-3">
                            <FiBriefcase className="text-[#0047AB]" /> Professional Details
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Employee ID</label>
                                <input
                                    type="text"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    placeholder="e.g. STF001"
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold outline-none focus:bg-white focus:border-[#0047AB]/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Staff Type</label>
                                <select
                                    name="staffType"
                                    value={formData.staffType}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-100 cursor-pointer"
                                >
                                    <option value="Teaching">Teaching</option>
                                    <option value="Non-Teaching">Non-Teaching</option>
                                </select>
                            </div>
                            
                            {formData.staffType === 'Teaching' && (
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Class Teacher Assignment</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={(() => {
                                                const parts = (formData.classTeacher || '').split(' ');
                                                const lastPart = parts[parts.length - 1];
                                                const hasSection = ['A', 'B', 'C', 'D', 'E'].includes(lastPart);
                                                return hasSection ? parts.slice(0, -1).join(' ') : (formData.classTeacher || '');
                                            })()}
                                            onChange={(e) => {
                                                const newClass = e.target.value;
                                                const parts = (formData.classTeacher || '').split(' ');
                                                const lastPart = parts[parts.length - 1];
                                                const hasSection = ['A', 'B', 'C', 'D', 'E'].includes(lastPart);
                                                const section = hasSection ? lastPart : '';
                                                const newCombined = newClass === 'NONE' ? 'NONE' : (section ? `${newClass} ${section}` : newClass);
                                                setFormData(prev => ({ ...prev, classTeacher: newCombined }));
                                            }}
                                            className="flex-[2] px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 outline-none cursor-pointer"
                                        >
                                            <option value="NONE">NONE</option>
                                            <option value="LKG">LKG</option>
                                            <option value="UKG">UKG</option>
                                            {[...Array(12)].map((_, i) => (
                                                <option key={i+1} value={`${i+1}${i+1 === 1 ? 'st' : i+1 === 2 ? 'nd' : i+1 === 3 ? 'rd' : 'th'} Std`}>
                                                    {i+1}{i+1 === 1 ? 'st' : i+1 === 2 ? 'nd' : i+1 === 3 ? 'rd' : 'th'} Std
                                                </option>
                                            ))}
                                        </select>
                                        {formData.classTeacher !== 'NONE' && (
                                            <select
                                                value={formData.classTeacher.split(' ').pop()}
                                                onChange={(e) => {
                                                    const section = e.target.value;
                                                    const parts = (formData.classTeacher || '').split(' ');
                                                    const hasSection = ['A', 'B', 'C', 'D', 'E'].includes(parts[parts.length - 1]);
                                                    const baseClass = hasSection ? parts.slice(0, -1).join(' ') : (formData.classTeacher || '');
                                                    setFormData(prev => ({ ...prev, classTeacher: `${baseClass} ${section}` }));
                                                }}
                                                className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold focus:bg-white focus:border-[#0047AB]/20 outline-none cursor-pointer"
                                            >
                                                {['A', 'B', 'C', 'D', 'E'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 bg-white ring-1 ring-slate-50">
                        <h3 className="text-base font-black text-slate-900 mb-8 flex items-center gap-3">
                            <FiUser className="text-[#0047AB]" /> Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">First Name</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold outline-none focus:bg-white focus:border-[#0047AB]/20 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Last Name</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold outline-none focus:bg-white focus:border-[#0047AB]/20 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold outline-none focus:bg-white focus:border-[#0047AB]/20 transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Date of Birth</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[14px] font-bold outline-none focus:bg-white focus:border-[#0047AB]/20 transition-all" />
                            </div>
                        </div>
                    </Card>

                    {formData.staffType === 'Teaching' && (
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-10 bg-white ring-1 ring-slate-50">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-base font-black text-slate-900 flex items-center gap-3">
                                    <FiBook className="text-[#0047AB]" /> Subjects & Classes
                                </h3>
                                <button type="button" onClick={addSubject} className="p-2 bg-blue-50 text-[#0047AB] rounded-xl hover:bg-blue-100 transition-colors">
                                    <FiPlus size={20} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {formData.subjects.map((sub, idx) => (
                                    <div key={idx} className="flex gap-4 items-center animate-in slide-in-from-left-4">
                                        <div className="flex-[2]">
                                            <select
                                                value={sub.class}
                                                onChange={(e) => handleSubjectChange(idx, 'class', e.target.value)}
                                                className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-100 cursor-pointer"
                                            >
                                                <option value="">Select Class</option>
                                                <option value="LKG">LKG</option>
                                                <option value="UKG">UKG</option>
                                                {[...Array(12)].map((_, i) => (
                                                    <optgroup key={i} label={`${i+1}th Std`}>
                                                        {['A', 'B', 'C', 'D', 'E'].map(section => (
                                                            <option key={section} value={`${i+1}${i+1 === 1 ? 'st' : i+1 === 2 ? 'nd' : i+1 === 3 ? 'rd' : 'th'} Std ${section}`}>
                                                                {i+1}th Std - {section}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-[3]">
                                            <input
                                                type="text"
                                                placeholder="e.g. Mathematics"
                                                value={sub.subject}
                                                onChange={(e) => handleSubjectChange(idx, 'subject', e.target.value)}
                                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-[13px] font-bold outline-none focus:bg-white focus:border-blue-100"
                                            />
                                        </div>
                                        {formData.subjects.length > 1 && (
                                            <button type="button" onClick={() => removeSubject(idx)} className="p-3 text-rose-300 hover:text-rose-500 transition-colors">
                                                <FiX size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </form>
        </div>
    );
};

const FiBook = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

export default EditStaff;
