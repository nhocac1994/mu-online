'use client';

import React from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';

export default function NewsEvents() {
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
              <span className="text-white">Sự Kiện</span>
            </nav>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg p-6 sm:p-8 border border-white/40 bg-black/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">EVENT</span>
                  <span className="text-gray-400 text-sm">15/4/2026</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">CÁC SỰ KIỆN TRONG GAME</h1>

                <h2 className="text-lg font-bold text-white mb-3">Sự kiện hàng ngày</h2>
                <p className="text-gray-300 mb-4">Sự kiện đặc biệt mỗi ngày để nhận thêm phần thưởng.</p>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-green-400 mb-2">Double EXP</h3>
                    <p className="text-gray-400 text-sm mb-2">20:00 – 22:00 hàng ngày</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Gấp đôi kinh nghiệm, mọi map</li>
                    </ul>
                  </div>
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-blue-400 mb-2">Drop Rate Event</h3>
                    <p className="text-gray-400 text-sm mb-2">14:00 – 16:00 hàng ngày</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Tăng tỷ lệ rơi đồ hiếm, set items</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white mb-3">Sự kiện hàng tuần</h2>
                <div className="space-y-4 mb-6">
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-white mb-2">PK Tournament</h3>
                    <p className="text-gray-400 text-sm mb-2">Chủ nhật 20:00 — Đăng ký 19:00–19:30</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Hạng 1: 10.000 Zen + Wing</li>
                      <li>• Hạng 2: 5.000 Zen + Ring</li>
                      <li>• Hạng 3: 2.000 Zen + Pendant</li>
                    </ul>
                  </div>
                  <div className="rounded-lg p-5 border border-white/30 bg-black/30">
                    <h3 className="text-base font-bold text-white mb-2">Guild War</h3>
                    <p className="text-gray-400 text-sm mb-2">Thứ 7, 21:00 — Castle Siege</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Guild thắng: 50.000 Zen</li>
                      <li>• Guild thua: 10.000 Zen</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-white mb-3">Sự kiện đặc biệt</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="rounded-lg p-4 border border-white/30 bg-black/30">
                    <h3 className="font-bold text-red-400 mb-1">Birthday Event</h3>
                    <p className="text-gray-300 text-xs">Sinh nhật server, quà đặc biệt</p>
                  </div>
                  <div className="rounded-lg p-4 border border-white/30 bg-black/30">
                    <h3 className="font-bold text-purple-400 mb-1">Halloween</h3>
                    <p className="text-gray-300 text-xs">Trang phục và items đặc biệt</p>
                  </div>
                  <div className="rounded-lg p-4 border border-white/30 bg-black/30">
                    <h3 className="font-bold text-[#F39C12] mb-1">Christmas</h3>
                    <p className="text-gray-300 text-xs">Quà tặng và sự kiện Giáng sinh</p>
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
