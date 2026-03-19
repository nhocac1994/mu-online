'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, type SiteConfig } from '@/lib/config-api';

export default function NewsRoadmap() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(siteConfigStatic as unknown as SiteConfig);
  useEffect(() => {
    getSiteConfig().then((c) => { if (c) setSiteConfig(c); });
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black" style={{ fontFamily: 'var(--font-main)' }}>
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
              <span className="text-white">Lộ Trình</span>
            </nav>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg p-6 sm:p-8 border border-white/40 bg-black/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold">UPDATE</span>
                  <span className="text-gray-400 text-sm">15/4/2026</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">LỘ TRÌNH PHÁT TRIỂN SERVER</h1>

                <h2 className="text-lg font-bold text-white mb-3">Giai đoạn 1: Khởi động</h2>
                <p className="text-gray-300 mb-4">Ổn định server và thu hút người chơi.</p>
                <div className="rounded-lg p-5 border border-white/30 bg-black/30 mb-6">
                  <h3 className="text-base font-bold text-white mb-3">Đã hoàn thành</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Khởi động server {(siteConfig?.serverVersion || siteConfigStatic.serverVersion)}</li>
                    <li>• Hệ thống đăng ký / đăng nhập</li>
                    <li>• Website chính thức</li>
                    <li>• Hệ thống anti-cheat cơ bản</li>
                  </ul>
                </div>
                <div className="rounded-lg p-5 border border-white/30 bg-black/30 mb-6">
                  <h3 className="text-base font-bold text-blue-400 mb-3">Đang thực hiện</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Tối ưu hiệu năng server</li>
                    <li>• Thêm sự kiện hàng ngày</li>
                    <li>• Cải thiện hỗ trợ</li>
                  </ul>
                </div>

                <h2 className="text-lg font-bold text-white mb-3">Giai đoạn 2: Phát triển</h2>
                <p className="text-gray-300 mb-4">Tính năng mới và cải thiện trải nghiệm.</p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-green-400 mb-3">Tính năng game</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Class Summoner</li>
                      <li>• Guild war nâng cao</li>
                      <li>• Map mới, quest tự động</li>
                    </ul>
                  </div>
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-blue-400 mb-3">Tính năng website</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Ranking online</li>
                      <li>• Forum, vote server</li>
                      <li>• API mobile</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white mb-3">Giai đoạn 3: Mở rộng</h2>
                <div className="rounded-lg p-5 border border-white/30 bg-black/30 mb-6">
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Castle siege nâng cao, class Rage Fighter</li>
                    <li>• Hệ thống pet và mount</li>
                    <li>• Tournament tự động</li>
                  </ul>
                </div>

                <h2 className="text-lg font-bold text-white mb-3">Giai đoạn 4: Tương lai</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-[#F39C12] mb-2">Mở rộng</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Server quốc tế, cross-server</li>
                      <li>• Thêm ngôn ngữ</li>
                    </ul>
                  </div>
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-red-400 mb-2">Công nghệ</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Nâng cấp Season 2</li>
                      <li>• AI anti-cheat, cloud</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                  <h3 className="text-base font-bold text-white mb-3">Mục tiêu</h3>
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div><span className="font-bold text-green-400">1.000+</span><br /><span className="text-gray-400">Online</span></div>
                    <div><span className="font-bold text-blue-400">10.000+</span><br /><span className="text-gray-400">Tài khoản</span></div>
                    <div><span className="font-bold text-purple-400">99.9%</span><br /><span className="text-gray-400">Uptime</span></div>
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
