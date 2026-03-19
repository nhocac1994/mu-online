'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import SimpleCaptcha from '@/components/SimpleCaptcha';

const inputClass =
  'w-full bg-black border border-white/30 rounded px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#F39C12] transition-colors';
const labelClass = 'block text-white text-sm font-medium mb-1.5';
const sectionTitleClass = 'text-[#F39C12] text-xs font-bold uppercase tracking-wider mb-4';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    characterName: '',
    email: '',
    phone: '',
    securityQuestion: '',
    securityAnswer: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<typeof formData | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = 'Tên đăng nhập là bắt buộc';
    else if (formData.username.length < 3) newErrors.username = 'Tên đăng nhập ít nhất 3 ký tự';
    if (!formData.password) newErrors.password = 'Mật khẩu là bắt buộc';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu ít nhất 6 ký tự';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    if (!formData.characterName) newErrors.characterName = 'Tên nhân vật là bắt buộc';
    if (!formData.email) newErrors.email = 'Email là bắt buộc';
    if (!formData.phone) newErrors.phone = 'Số điện thoại là bắt buộc';
    if (!formData.securityQuestion) newErrors.securityQuestion = 'Chọn câu hỏi bảo mật';
    if (!formData.securityAnswer) newErrors.securityAnswer = 'Câu trả lời là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        setSuccessData({ ...formData });
        setIsSuccess(true);
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          characterName: '',
          email: '',
          phone: '',
          securityQuestion: '',
          securityAnswer: '',
        });
      } else {
        alert(result.message || 'Đăng ký thất bại.');
      }
    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-black flex flex-col" style={{ fontFamily: 'var(--font-main)' }}>
      <PageBackground />
      <div className="relative z-10 flex flex-col flex-1 pt-24 pb-12 px-4">
      {/* Breadcrumb */}
      <div className="max-w-xl mx-auto w-full mb-6 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="hover:text-white transition-colors" aria-label="Trang chủ">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
        <span>/</span>
        <span className="text-gray-300">register</span>
      </div>

      <main className="max-w-xl mx-auto w-full flex-1">
        <h1 className="text-2xl font-bold text-white mb-1 text-center">ĐĂNG KÝ TÀI KHOẢN</h1>
        <p className="text-sm text-gray-400 text-center mb-8">
          Tạo tài khoản mới để bắt đầu hành trình Mu Online
        </p>

        {isSuccess && successData ? (
          <div className="rounded border border-white/40 bg-black/30 p-6 space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl">
                ✓
              </div>
              <h2 className="text-lg font-bold text-white mb-1">Đăng ký thành công</h2>
              <p className="text-gray-400 text-sm">Tài khoản của bạn đã được tạo.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-black/50 rounded p-3">
                <span className="text-gray-500">Tên đăng nhập</span>
                <p className="text-white font-medium">{successData.username}</p>
              </div>
              <div className="bg-black/50 rounded p-3">
                <span className="text-gray-500">Tên nhân vật</span>
                <p className="text-white font-medium">{successData.characterName}</p>
              </div>
              <div className="bg-black/50 rounded p-3">
                <span className="text-gray-500">Email</span>
                <p className="text-white font-medium">{successData.email}</p>
              </div>
              <div className="bg-black/50 rounded p-3">
                <span className="text-gray-500">Số điện thoại</span>
                <p className="text-white font-medium">{successData.phone}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="py-2.5 px-4 rounded text-sm font-medium text-white border border-white/30 hover:bg-white/10"
              >
                Đăng ký tài khoản khác
              </button>
              <Link
                href="/login"
                className="py-2.5 px-4 rounded text-sm font-bold text-center text-white"
                style={{ background: '#F39C12' }}
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className={sectionTitleClass}>Thông tin tài khoản</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tên đăng nhập *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`${inputClass} ${errors.username ? 'border-red-500' : ''}`}
                    placeholder="Nhập tên đăng nhập"
                    autoComplete="off"
                  />
                  {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
                </div>
                <div>
                  <label className={labelClass}>Mật khẩu *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${inputClass} ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Nhập mật khẩu"
                    autoComplete="new-password"
                  />
                  {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className={labelClass}>Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`${inputClass} ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Nhập lại mật khẩu"
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Tên nhân vật *</label>
                  <input
                    type="text"
                    name="characterName"
                    value={formData.characterName}
                    onChange={handleInputChange}
                    className={`${inputClass} ${errors.characterName ? 'border-red-500' : ''}`}
                    placeholder="Nhập tên nhân vật"
                    autoComplete="off"
                  />
                  {errors.characterName && (
                    <p className="text-red-400 text-xs mt-1">{errors.characterName}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>Thông tin cá nhân</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Nhập email"
                    autoComplete="email"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className={labelClass}>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`${inputClass} ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Nhập số điện thoại"
                    autoComplete="tel"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>Bảo mật</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Câu hỏi bảo mật *</label>
                  <select
                    name="securityQuestion"
                    value={formData.securityQuestion}
                    onChange={handleInputChange}
                    className={`${inputClass} ${errors.securityQuestion ? 'border-red-500' : ''}`}
                  >
                    <option value="">Chọn câu hỏi bảo mật</option>
                    <option value="pet">Tên thú cưng đầu tiên của bạn?</option>
                    <option value="school">Tên trường tiểu học của bạn?</option>
                    <option value="city">Thành phố bạn sinh ra?</option>
                    <option value="food">Món ăn yêu thích của bạn?</option>
                  </select>
                  {errors.securityQuestion && (
                    <p className="text-red-400 text-xs mt-1">{errors.securityQuestion}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Câu trả lời *</label>
                  <input
                    type="text"
                    name="securityAnswer"
                    value={formData.securityAnswer}
                    onChange={handleInputChange}
                    className={`${inputClass} ${errors.securityAnswer ? 'border-red-500' : ''}`}
                    placeholder="Nhập câu trả lời"
                    autoComplete="off"
                  />
                  {errors.securityAnswer && (
                    <p className="text-red-400 text-xs mt-1">{errors.securityAnswer}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className={sectionTitleClass}>Xác thực bảo mật</h3>
              <SimpleCaptcha onVerify={setCaptchaValid} variant="minimal" />
            </div>

            <button
              type="submit"
              disabled={!captchaValid || isLoading}
              className="w-full py-3 rounded font-bold text-white uppercase text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#F39C12' }}
            >
              {isLoading ? 'Đang xử lý...' : captchaValid ? 'Tạo tài khoản' : 'Vui lòng xác thực captcha'}
            </button>
          </form>
        )}

        <p className="text-center text-gray-400 text-sm mt-8">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: '#F39C12' }}>
            Đăng nhập ngay
          </Link>
        </p>
      </main>
      </div>
    </div>
  );
}
