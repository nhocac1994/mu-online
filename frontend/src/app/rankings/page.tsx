'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import RankingTable from '@/components/RankingTable';
import GuildRankingTable from '@/components/GuildRankingTable';

const cardClass = 'rounded border border-white/40 bg-black/30 p-4 sm:p-6';
const titleClass = 'text-[#F39C12] font-bold uppercase tracking-wider text-sm';

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<'characters' | 'guilds'>('characters');

  return (
    <div className="min-h-screen relative bg-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <PageBackground />
      <div className="relative z-10 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors" aria-label="Trang chủ">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <span>/</span>
          <span className="text-gray-300">xếp hạng</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1 text-center">Bảng xếp hạng</h1>
        <p className="text-sm text-gray-400 text-center mb-8">Top nhân vật và guild của server</p>

        {/* Card chứa tab + bảng (như ảnh 2: tab ngay trên bảng) */}
        <div className="rounded border border-white/40 bg-black/30 overflow-hidden">
          {/* Tab ngay trên bảng */}
          <div className="flex justify-center border-b border-white/35 bg-black/40 p-2">
            <div className="inline-flex rounded border border-white/40 bg-black/60 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('characters')}
                className={`px-5 py-2.5 rounded text-sm font-medium transition-colors ${
                  activeTab === 'characters'
                    ? 'bg-[#F39C12] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Top Resets
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guilds')}
                className={`px-5 py-2.5 rounded text-sm font-medium transition-colors ${
                  activeTab === 'guilds'
                    ? 'bg-[#F39C12] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Top Guilds
              </button>
            </div>
          </div>
          {/* Nhãn General Rankings + nội dung bảng */}
          <div className="p-4 sm:p-6 pt-2">
            <h2
              className="text-[#FFD700] font-bold uppercase tracking-wider text-sm pb-2 mb-4 border-b-2"
              style={{ borderColor: '#FFD700' }}
            >
              Xếp hạng chung
            </h2>
            {activeTab === 'characters' && (
              <RankingTable title="Top 100 Resets" endpoint="level" embedded />
            )}
            {activeTab === 'guilds' && (
              <GuildRankingTable title="Top 50 Guilds" endpoint="guild" embedded />
            )}
          </div>
        </div>

        {/* Thông tin */}
        <div className={`${cardClass} mt-6`}>
          <h3 className={`${titleClass} mb-3`}>Thông tin ranking</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Top Resets</h4>
              <ul className="space-y-1 text-xs">
                <li>• Xếp hạng theo tổng số resets</li>
                <li>• Hiển thị top 100</li>
                <li>• Chỉ tính nhân vật CtlCode &lt; 8 hoặc NULL</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Top Guilds</h4>
              <ul className="space-y-1 text-xs">
                <li>• Xếp hạng theo điểm guild (G_Score)</li>
                <li>• Hiển thị top 50</li>
                <li>• Gồm Guild Master và số thành viên</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
