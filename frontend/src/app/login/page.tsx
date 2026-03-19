'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import SimpleCaptcha from '@/components/SimpleCaptcha';

const inputClass =
  'w-full bg-black border border-white/30 rounded px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#F39C12] transition-colors';
const labelClass = 'block text-white text-sm font-medium mb-1.5';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaValid, setCaptchaValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = 'Tên đăng nhập là bắt buộc';
    if (!formData.password) newErrors.password = 'Mật khẩu là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        if (result.data?.token) localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user_data', JSON.stringify(result.data || {}));
        window.location.href = '/dashboard';
      } else {
        alert(result.message || 'Đăng nhập thất bại.');
      }
    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen relative bg-black flex flex-col" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <PageBackground />
      <div className="relative z-10 flex flex-col flex-1 pt-24 pb-12 px-4">
      {/* Breadcrumb */}
      <div className="max-w-md mx-auto w-full mb-6 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-white transition-colors" aria-label="Trang chủ">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
        <span>/</span>
        <span className="text-gray-300">login</span>
      </div>

      {/* Form */}
      <main className="max-w-md mx-auto w-full flex-1 flex flex-col justify-start">
        <h1 className="text-2xl font-bold text-white mb-1 text-center">ĐĂNG NHẬP</h1>
        <p className="text-sm text-gray-400 text-center mb-8">Đăng nhập vào tài khoản của bạn</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className={labelClass}>
              Tên đăng nhập *
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`${inputClass} ${errors.username ? 'border-red-500' : ''}`}
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Mật khẩu *
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${inputClass} ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="text-right">
            <Link href="#" className="text-sm text-gray-400 hover:text-[#F39C12] transition-colors">
              Quên mật khẩu?
            </Link>
          </div>

          <SimpleCaptcha onVerify={setCaptchaValid} variant="minimal" />

          <button
            type="submit"
            disabled={!captchaValid}
            className="w-full py-3 rounded font-bold text-white uppercase text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#F39C12' }}
          >
            {captchaValid ? 'Đăng nhập' : 'Vui lòng xác thực captcha'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-8">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-semibold hover:underline" style={{ color: '#F39C12' }}>
            Đăng ký ngay
          </Link>
        </p>
      </main>
      </div>
    </div>
  );
}
