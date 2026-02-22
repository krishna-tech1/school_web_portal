import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import { authAPI } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const [role, setRole] = useState('admin');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const response = await authAPI.login(formData);
            dispatch(loginSuccess(response.data));
            navigate('/dashboard');
        } catch (err) {
            dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
        }
    };

    return (
        <div className="flex min-h-screen w-screen font-sans bg-white overflow-x-hidden">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-[45%] flex flex-col items-center justify-center px-6 py-12 sm:px-16 lg:px-24">
                <div className="w-full max-w-sm">
                    {/* Mobile Logo Only */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="scale-90">
                            <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="60" rx="10" fill="#0047AB" />
                                <path d="M10 30 Q50 10 90 30 Q50 50 10 30" stroke="white" strokeWidth="2" fill="none" />
                                <text x="50%" y="45%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">GOD IS LOVE</text>
                                <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">GOD IS LOVE</text>
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-black text-[#0047AB] text-center mb-4 lg:mb-10">Login</h1>
                    <p className="lg:hidden text-center text-slate-500 font-bold text-sm mb-10">X'an Matriculation School</p>

                    {/* Role Switcher */}
                    <div className="flex bg-white border border-[#0047AB] rounded-lg mb-10 overflow-hidden">
                        <button
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-3 text-sm font-bold transition-all ${role === 'admin'
                                ? 'bg-[#0047AB] text-white'
                                : 'bg-white text-[#0047AB]'
                                }`}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => setRole('staff')}
                            className={`flex-1 py-3 text-sm font-bold transition-all ${role === 'staff'
                                ? 'bg-[#0047AB] text-white'
                                : 'bg-white text-[#0047AB]'
                                }`}
                        >
                            Office Staff
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                className="w-full px-5 py-4 bg-[#f3f4f6] border-none rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0047AB] transition-all"
                            />
                            {role === 'staff' && (
                                <div className="flex justify-end mt-2">
                                    <button type="button" className="text-xs font-bold text-[#0047AB] hover:underline transition-all">
                                        Forgot password?
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
                        )}

                        {/* Login Button */}
                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#0047AB] hover:bg-[#003580] text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>

                            {role === 'staff' && (
                                <button
                                    type="button"
                                    className="w-full py-4 border-2 border-[#0047AB] text-[#0047AB] bg-white hover:bg-slate-50 font-bold rounded-xl transition-all active:scale-95"
                                >
                                    Registration
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side - Branding & Image */}
            <div className="hidden lg:block lg:w-[55%] relative">
                <img
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000&auto=format&fit=crop"
                    alt="Classroom background"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-900/30 backdrop-brightness-75 flex flex-col items-center justify-center text-white px-12 text-center">
                    {/* Logo Placeholder - Matches God is Love Style */}
                    <div className="mb-8 transform hover:scale-105 transition-transform">
                        <svg width="120" height="80" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100" height="60" rx="10" fill="white" />
                            <path d="M10 30 Q50 10 90 30 Q50 50 10 30" stroke="black" strokeWidth="2" fill="none" />
                            <text x="50%" y="45%" dominantBaseline="middle" textAnchor="middle" fill="black" fontSize="8" fontWeight="bold">GOD IS LOVE</text>
                            <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fill="black" fontSize="8" fontWeight="bold">GOD IS LOVE</text>
                        </svg>
                    </div>

                    <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight drop-shadow-2xl">
                        X'an Matriculation School
                    </h2>
                </div>

                {/* Visual refinement - bottom white cut-out effect if needed, but the screenshot shows full image */}
                <div className="absolute bottom-4 right-4 text-white/50 text-[10px]">
                    © 2026 Admin Panel
                </div>
            </div>
        </div>
    );
};

export default Login;