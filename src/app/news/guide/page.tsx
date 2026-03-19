'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, type SiteConfig } from '@/lib/config-api';

export default function NewsGuide() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(siteConfigStatic as unknown as SiteConfig);
  useEffect(() => {
    getSiteConfig().then((c) => { if (c) setSiteConfig(c); });
  }, []);

  const serverName = siteConfig?.serverName || siteConfigStatic.serverName;
  const serverVersion = siteConfig?.serverVersion || siteConfigStatic.serverVersion;
  const gameTitle = siteConfig?.gameTitle || siteConfigStatic.gameTitle;

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
              <span className="text-white">Hướng Dẫn</span>
            </nav>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg p-6 sm:p-8 border border-white/40 bg-black/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">HOT</span>
                  <span className="text-gray-400 text-sm">15/4/2026</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                  HƯỚNG DẪN CHƠI {String(serverName || '').toUpperCase()} - {String(serverVersion || 'Season 1').toUpperCase()}
                </h1>

                <h2 className="text-lg font-bold text-white mb-3">Tạo nhân vật</h2>
                <p className="text-gray-300 mb-4">Tạo tài khoản và nhân vật. Các class chính trong {gameTitle || 'Mu Online Season 1'}:</p>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-white mb-2">Dark Knight</h3>
                    <p className="text-gray-300 text-sm mb-2">Chiến binh cận chiến, sức mạnh cao, dễ chơi.</p>
                    <ul className="text-gray-400 text-xs space-y-1">
                      <li>• Sức mạnh, chịu đòn tốt</li>
                    </ul>
                  </div>
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-white mb-2">Dark Wizard</h3>
                    <p className="text-gray-300 text-sm mb-2">Pháp sư tấn công từ xa, sát thương cao.</p>
                    <ul className="text-gray-400 text-xs space-y-1">
                      <li>• Tấn công từ xa, cần kỹ năng</li>
                    </ul>
                  </div>
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-white mb-2">Fairy Elf</h3>
                    <p className="text-gray-300 text-sm mb-2">Hỗ trợ và tấn công linh hoạt.</p>
                    <ul className="text-gray-400 text-xs space-y-1">
                      <li>• Hỗ trợ, cân bằng</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white mb-3">Phát triển nhân vật</h2>
                <div className="rounded-lg p-5 border border-white/30 bg-black/30 mb-6">
                  <h3 className="text-base font-bold text-blue-400 mb-2">Leveling</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Level 1–50: Diệt quái cấp thấp</li>
                    <li>• Level 50–100: Tham gia event EXP</li>
                    <li>• Level 100+: Party để level nhanh</li>
                  </ul>
                </div>
                <div className="rounded-lg p-5 border border-white/30 bg-black/30 mb-6">
                  <h3 className="text-base font-bold text-[#F39C12] mb-2">Trang bị</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Vũ khí: tăng sát thương</li>
                    <li>• Giáp: phòng thủ</li>
                    <li>• Trang sức: tăng stats</li>
                  </ul>
                </div>

                <h2 className="text-lg font-bold text-white mb-3">Gợi ý</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-green-400 mb-2">Nên làm</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Tham gia guild</li>
                      <li>• Làm daily quest, events</li>
                      <li>• Nâng cấp trang bị thường xuyên</li>
                    </ul>
                  </div>
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-red-400 mb-2">Không nên</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Bỏ qua nâng cấp đồ</li>
                      <li>• Chơi solo quá nhiều</li>
                      <li>• Bỏ qua sự kiện, guild</li>
                    </ul>
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
