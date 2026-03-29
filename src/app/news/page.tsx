'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';

const cardClass =
  'rounded border border-white/30 bg-black/55 p-5 backdrop-blur-md transition-colors hover:border-white/45';
const badge = (type: string) => {
  const colors: Record<string, string> = {
    Notice: 'bg-blue-600',
    Event: 'bg-green-600',
    Update: 'bg-purple-600',
    Hot: 'bg-red-600',
  };
  return `px-2 py-0.5 rounded text-xs font-bold text-white ${colors[type] || 'bg-gray-600'}`;
};

const newsItems = [
  { type: 'Notice', title: 'HƯỚNG DẪN CHƠI - SEASON 1', date: '15/4/2026', link: '/news/guide', excerpt: 'Hướng dẫn chi tiết cách chơi game, từ tạo nhân vật đến các tính năng nâng cao.' },
  { type: 'Notice', title: 'CÁC LỆNH TRONG GAME (CHAT)', date: '15/4/2026', link: '/news/commands', excerpt: 'Danh sách lệnh chat thường dùng: post, cộng điểm, reset, kho đồ và các lệnh tiện ích trên server.' },
  { type: 'Event', title: 'CÁC SỰ KIỆN TRONG GAME', date: '15/4/2026', link: '/news/events', excerpt: 'Double EXP, Drop Rate Event, PK Tournament và nhiều sự kiện đặc biệt.' },
  { type: 'Update', title: 'LỘ TRÌNH PHÁT TRIỂN SERVER', date: '15/4/2026', link: '/news/roadmap', excerpt: 'Kế hoạch phát triển, tính năng mới và cải thiện trải nghiệm.' },
  { type: 'Notice', title: 'THÔNG BÁO MỞ SERVER', date: '15/4/2026', link: '/news/opening', excerpt: 'Thông báo chính thức mở cửa server.' },
  { type: 'Hot', title: 'THÔNG TIN CÁC MAP', date: '15/4/2026', link: '/news/maps', excerpt: 'Bảng Zen, PK và tỷ lệ drop ngọc theo từng bản đồ.' },
];

const sidebarLinks = [
  { label: 'Hướng dẫn', href: '/news/guide' },
  { label: 'Lệnh trong game', href: '/news/commands' },
  { label: 'Sự kiện', href: '/news/events' },
  { label: 'Cập nhật', href: '/news/roadmap' },
  { label: 'Thông báo', href: '/news/opening' },
  { label: 'Thông tin Map', href: '/news/maps' },
];

export default function News() {
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? newsItems.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.excerpt.toLowerCase().includes(search.toLowerCase())
      )
    : newsItems;

  return (
    <div className="relative min-h-screen bg-black" style={{ fontFamily: 'var(--font-main)' }}>
      <PageBackground />
      <div className="relative z-10 px-4 pb-12 pt-48">
        <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors" aria-label="Trang chủ">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <span>/</span>
          <span className="text-gray-300">bản tin</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1 text-center">BẢN TIN</h1>
        <p className="text-sm text-gray-400 text-center mb-8">Cập nhật thông tin mới nhất về server</p>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm tin tức..."
              className="flex-1 bg-black border border-white/30 rounded px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#F39C12]"
            />
            <button
              type="button"
              className="px-4 py-2.5 rounded text-sm font-semibold text-white shrink-0"
              style={{ background: '#F39C12' }}
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Danh sách tin */}
          <div className="lg:col-span-2 space-y-4">
            {filtered.length === 0 ? (
              <div className="rounded border border-white/30 bg-black/55 p-8 text-center text-sm text-gray-400 backdrop-blur-md">
                Không tìm thấy tin nào.
              </div>
            ) : (
              filtered.map((item, i) => (
                <Link key={i} href={item.link} className={`block ${cardClass}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={badge(item.type)}>{item.type}</span>
                    <span className="text-gray-500 text-xs">{item.date}</span>
                  </div>
                  <h2 className="text-white font-bold text-base mb-2">{item.title}</h2>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.excerpt}</p>
                  <span className="text-sm font-medium" style={{ color: '#F39C12' }}>
                    Đọc thêm →
                  </span>
                </Link>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded border border-white/30 bg-black/55 p-5 backdrop-blur-md">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#F39C12]">Tin gần đây</h3>
              <ul className="space-y-3">
                {newsItems.slice(0, 5).map((n, i) => (
                  <li key={i} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <Link href={n.link} className="text-white text-sm hover:text-[#F39C12] transition-colors block">
                      {n.title}
                    </Link>
                    <span className="text-gray-500 text-xs">{n.date}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded border border-white/30 bg-black/55 p-5 backdrop-blur-md">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#F39C12]">Danh mục</h3>
              <ul className="space-y-2">
                {sidebarLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-gray-300 text-sm hover:text-[#F39C12] transition-colors block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
