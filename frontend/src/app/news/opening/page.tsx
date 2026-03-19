'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, type SiteConfig } from '@/lib/config-api';

const OPENING_DATE = '15/4/2026';
const OPENING_TIME = '20:00 (GMT+7)';

export default function NewsOpening() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(siteConfigStatic as unknown as SiteConfig);
  useEffect(() => {
    getSiteConfig().then((c) => { if (c) setSiteConfig(c); });
  }, []);

  const serverName = siteConfig?.serverName || siteConfigStatic.serverName;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <PageBackground />
      <div className="fixed inset-0 bg-black/40 z-[1]" aria-hidden />
      <div className="relative z-10" style={{ paddingTop: '92px' }}>
        <section className="py-4 bg-black/30">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-2 text-sm">
              <Link href="/" className="text-blue-400 hover:text-blue-300">Trang Chủ</Link>
              <span className="text-gray-400">/</span>
              <Link href="/news" className="text-blue-400 hover:text-blue-300">Tin Tức</Link>
              <span className="text-gray-400">/</span>
              <span className="text-white">Thông Báo</span>
            </nav>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg p-6 sm:p-8 border border-white/40 bg-black/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">NOTICE</span>
                  <span className="text-gray-400 text-sm">{OPENING_DATE}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">THÔNG BÁO MỞ SERVER</h1>

                <div className="rounded-lg p-5 sm:p-6 mb-6 border border-white/30 bg-black/30">
                  <h2 className="text-lg font-bold text-red-400 mb-3">CHÍNH THỨC MỞ SERVER</h2>
                  <p className="text-gray-300 mb-4">
                    Chúng tôi vui mừng thông báo rằng server {serverName} đã chính thức mở cửa!
                  </p>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{OPENING_DATE}</p>
                    <p className="text-lg text-blue-300 mt-1">{OPENING_TIME}</p>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white mb-3">Sự kiện khai trương</h2>
                <p className="text-gray-300 mb-4">Để chào mừng server mở cửa, chúng tôi tổ chức nhiều sự kiện đặc biệt:</p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-green-400 mb-3">Quà tặng khai trương</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• 10 Triệu Zen cho tài khoản mới</li>
                      <li>• Set đồ cấp 1 trong 7 ngày</li>
                    </ul>
                  </div>
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-blue-400 mb-3">Event đặc biệt</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Triple EXP 7 ngày đầu</li>
                      <li>• Double Drop Rate</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white mb-3">Hướng dẫn bắt đầu</h2>
                <p className="text-gray-300 mb-4">Để bắt đầu chơi trên server mới, làm theo các bước sau:</p>

                <div className="rounded-lg p-5 border border-white/30 bg-black/30 mb-6 space-y-4">
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F39C12] text-black flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <h3 className="font-bold text-white">Tải game</h3>
                      <p className="text-gray-300 text-sm">Tải client từ trang Download</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F39C12] text-black flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <h3 className="font-bold text-white">Đăng ký tài khoản</h3>
                      <p className="text-gray-300 text-sm">Tạo tài khoản trên website</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F39C12] text-black flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <h3 className="font-bold text-white">Tạo nhân vật</h3>
                      <p className="text-gray-300 text-sm">Chọn class và tạo nhân vật</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#F39C12] text-black flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <h3 className="font-bold text-white">Bắt đầu chơi</h3>
                      <p className="text-gray-300 text-sm">Tham gia thế giới Mu Online</p>
                    </div>
                  </div>
                </div>

                {/* <h2 className="text-lg font-bold text-white mb-3">Giải đấu khai trương</h2>
                <div className="rounded-lg p-5 border border-white/30 bg-black/30 mb-6">
                  <h3 className="text-base font-bold text-[#F39C12] mb-3">Giải đấu Level Race</h3>
                  <p className="text-gray-300 text-sm mb-3">Thời gian: 15/4 – 22/4/2026</p>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Thi đua level nhanh nhất; phần thưởng cho top 10</li>
                    <li>• Hạng 1: 100.000 Zen + Wing</li>
                    <li>• Hạng 2: 30.000 Zen + Ring</li>
                    <li>• Hạng 3: 20.000 Zen + Pendant</li>
                    <li>• Top 10: 10.000 Zen</li>
                  </ul>
                </div> */}

                <h2 className="text-lg font-bold text-white mb-3">Hỗ trợ & liên hệ</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="rounded-lg p-4 border border-white/30 bg-black/30">
                    <h3 className="font-bold text-blue-400 mb-1">Discord</h3>
                    <p className="text-gray-300 text-xs">Hỗ trợ 24/7</p>
                  </div>
                  <div className="rounded-lg p-4 border border-white/30 bg-black/30">
                    <h3 className="font-bold text-green-400 mb-1">Zalo</h3>
                    <p className="text-gray-300 text-xs">Liên hệ nhanh</p>
                  </div>
                  <div className="rounded-lg p-4 border border-white/30 bg-black/30">
                    <h3 className="font-bold text-purple-400 mb-1">Email</h3>
                    <p className="text-gray-300 text-xs">Hỗ trợ chuyên nghiệp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
