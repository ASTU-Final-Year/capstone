'use client';

import React from "react"

import { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login attempt:', { username, password, rememberMe });
    };

    return (
        <div
            className="relative w-full h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: 'url(/login-bg.png)',
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div
                    className="backdrop-blur-md bg-white/15 border border-white/30 rounded-3xl p-8 shadow-2xl"
                >
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Login</h1>
                        <p className="text-white/80 text-base">
                            Welcome back please login to your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="User Name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-lime-400/50 backdrop-blur-sm transition"
                            />
                            <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-lime-400/50 backdrop-blur-sm transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-5 h-5 rounded accent-lime-400"
                                />
                                <span className="text-white/90 text-sm">Remember me</span>
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-6 bg-gradient-to-r from-lime-400 to-emerald-400 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-lime-400/50 transition duration-300 text-lg"
                        >
                            Login
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="mt-6 text-center">
                        <p className="text-white/80 text-sm">
                            {"Don't have an account? "}
                            <Link
                                href="/signup"
                                className="text-white font-semibold hover:text-lime-300 transition"
                            >
                                Signup
                            </Link>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/20 text-center">
                        <p className="text-white/60 text-xs">
                            Created by{' '}
                            <span className="font-semibold text-white/80">Group</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
