import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FiSend, FiUsers, FiUser, FiInfo, FiTrash2, FiClock, FiAlertTriangle, FiFlag } from 'react-icons/fi';

const Announcements = () => {
    const { user } = useSelector((state) => state.auth);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState('all');
    const [type, setType] = useState('info'); // info, warning, other
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const API_URL = 'http://localhost:5056'; // Portal Backend

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const currentUserId = user?.staffId || user?.id || 'admin';

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/portal/announcements`, {
                params: { role: 'admin', userId: currentUserId }
            });
            setAnnouncements(response.data);
        } catch (err) {
            console.error('Fetch Error:', err);
        } finally {
            setFetching(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!title || !message) return alert('Please fill in both title and message');

        try {
            setLoading(true);
            await axios.post(`${API_URL}/api/portal/announcements`, {
                sender_id: currentUserId,
                sender_name: 'Administrator',
                sender_role: 'admin',
                target_type: target,
                type: type,
                title,
                message
            });
            alert('Announcement posted successfully!');
            setTitle('');
            setMessage('');
            fetchAnnouncements();
        } catch (err) {
            console.error('Send Error:', err);
            alert('Failed to post announcement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement permanently?')) return;
        try {
            await axios.delete(`${API_URL}/api/portal/announcements/${id}`, {
                params: { userId: currentUserId }
            });
            fetchAnnouncements();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
            <header className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#0047AB] rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <FiSend size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Announcements</h1>
                    <p className="text-slate-400 font-bold text-sm tracking-tight capitalize">Broadcast institutional messages</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Send Form */}
                <div className="lg:col-span-1 border border-slate-100 bg-white rounded-[40px] p-8 shadow-2xl h-fit">
                    <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                        <FiInfo className="text-[#0047AB]" />
                        Compose
                    </h2>
                    
                    <form onSubmit={handleSend} className="space-y-6">
                        {/* 1st Select Type */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">1. Announcement Type:</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'info', icon: FiInfo, color: 'text-blue-500' },
                                    { id: 'warning', icon: FiAlertTriangle, color: 'text-rose-500' },
                                    { id: 'other', icon: FiFlag, color: 'text-emerald-500' }
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setType(t.id)}
                                        className={`flex flex-col items-center gap-2 py-3 rounded-2xl border-2 transition-all ${
                                            type === t.id ? 'border-[#0047AB] bg-blue-50/50' : 'border-slate-50 grayscale opacity-40 hover:grayscale-0 hover:opacity-100'
                                        }`}
                                    >
                                        <t.icon className={t.color} size={20} />
                                        <span className="text-[10px] uppercase font-black tracking-widest">{t.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2nd Subject */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">2. Subject Headline ({title.length}/25):</label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={25}
                                placeholder="Max 25 characters"
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0047AB] focus:bg-white rounded-2xl px-6 py-4 font-bold transition-all outline-none"
                            />
                        </div>

                        {/* 3rd Description */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 leading-none">3. Message Body ({message.length}/75):</label>
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                maxLength={75}
                                placeholder="Max 75 characters"
                                rows="3"
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0047AB] focus:bg-white rounded-2xl px-6 py-4 font-bold transition-all outline-none resize-none text-sm"
                            ></textarea>
                        </div>

                        {/* Sending To */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">4. Target Audience:</label>
                            <div className="flex bg-slate-50 p-1 rounded-2xl overflow-hidden shadow-inner">
                                {['all', 'students', 'teachers'].map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setTarget(t)}
                                        className={`flex-1 py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            target === t ? 'bg-white shadow-sm text-[#0047AB]' : 'text-slate-300'
                                        }`}
                                    >
                                        {t.replace('all', 'Everyone')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                                loading ? 'bg-slate-100 text-slate-300' : 'bg-[#0047AB] text-white hover:bg-black shadow-blue-200'
                            }`}
                        >
                            {loading ? <FiClock className="animate-spin" /> : <FiSend />}
                            Post Announcement
                        </button>
                    </form>
                </div>

                {/* History List */}
                <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[85vh] pr-4 custom-scrollbar">
                    {fetching ? (
                        <div className="p-20 flex flex-col items-center justify-center text-slate-300">
                            <FiSend className="animate-bounce" size={48} />
                            <p className="mt-4 font-bold uppercase tracking-widest text-xs">Loading context...</p>
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="bg-slate-50 rounded-[40px] p-20 text-center border-2 border-dashed border-slate-100">
                            <FiSend className="mx-auto text-slate-200 mb-6" size={64} />
                            <h3 className="text-lg font-black text-slate-400">Archive is empty</h3>
                        </div>
                    ) : announcements.map((ann) => (
                        <div key={ann.id} className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm group hover:shadow-xl transition-all duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-4 items-center">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                                        ann.type === 'warning' ? 'bg-rose-500 shadow-rose-200 shadow-lg' : 
                                        ann.type === 'other' ? 'bg-emerald-500 shadow-emerald-200 shadow-lg' : 
                                        'bg-[#0047AB] shadow-blue-200 shadow-lg'
                                    }`}>
                                        {ann.type === 'info' ? <FiInfo /> : ann.type === 'warning' ? <FiAlertTriangle /> : <FiFlag />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{ann.type} Broadcast</p>
                                        <p className="text-[12px] font-bold text-slate-300">Created: {new Date(ann.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {(ann.sender_id === currentUserId || ann.sender_role === 'admin') && (
                                    <button 
                                        onClick={() => handleDelete(ann.id)}
                                        className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                )}
                            </div>

                            <p className="inline-block px-3 py-1 rounded-full bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                To: {ann.target_type}
                            </p>
                            <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-[#0047AB] transition-colors">{ann.title}</h3>
                            <p className="text-slate-500 font-bold leading-relaxed text-sm whitespace-pre-wrap">{ann.message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Announcements;
