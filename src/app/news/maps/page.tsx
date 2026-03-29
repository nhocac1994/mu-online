'use client';

import React from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';

const MAPS_DATA: { name: string; zen: string; pk: string; drop: string }[] = [
  { name: 'Arena', zen: '2000', pk: 'Bật', drop: 'Trung Bình' },
  { name: 'Lorencia', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Noria', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Devias', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Devias 2', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Devias 3', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Devias 4', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Dungeon 1', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Dungeon 2', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Dungeon 3', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Atlans 1', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Atlans 2', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Atlans 3', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Losttower 1', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Losttower 2', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Losttower 3', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Losttower 4', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Losttower 5', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Losttower 6', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Losttower 7', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Aida 1', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Aida 2', zen: '2000', pk: 'Bật', drop: '0' },
  { name: 'Tarkan', zen: '8000', pk: 'Bật', drop: 'Cao' },
  { name: 'Tarkan 2', zen: '8000', pk: 'Bật', drop: 'Cao' },
  { name: 'Icarus', zen: '10000', pk: 'Bật', drop: 'Trung Bình' },
  { name: 'Blood Castle 1', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Blood Castle 2', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Blood Castle 3', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Blood Castle 4', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Blood Castle 5', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Blood Castle 6', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Blood Castle 7', zen: '-', pk: 'Bật', drop: 'Cao' },
  { name: 'Devil Square 1', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Devil Square 2', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Devil Square 3', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Devil Square 4', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Devil Square 5', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Devil Square 6', zen: '-', pk: 'Bật', drop: 'Cao' },
  { name: 'Chaos Castle 1', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Chaos Castle 2', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Chaos Castle 3', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Chaos Castle 4', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Chaos Castle 5', zen: '-', pk: 'Bật', drop: '0' },
  { name: 'Chaos Castle 6', zen: '-', pk: 'Bật', drop: 'Cao' },
];

export default function NewsMaps() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black" style={{ fontFamily: 'var(--font-main)' }}>
      <PageBackground />
      <div className="fixed inset-0 bg-black/40 z-[1]" aria-hidden />
      <div className="relative z-10 pt-48">
        <section className="py-4 bg-black/30">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-2 text-sm">
              <Link href="/" className="text-blue-400 hover:text-blue-300">Trang Chủ</Link>
              <span className="text-gray-400">/</span>
              <Link href="/news" className="text-blue-400 hover:text-blue-300">Tin Tức</Link>
              <span className="text-gray-400">/</span>
              <span className="text-white">Thông Tin Map</span>
            </nav>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-lg p-6 sm:p-8 border border-white/40 bg-black/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold">INFO</span>
                  <span className="text-gray-400 text-sm">15/4/2026</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">THÔNG TIN CÁC MAP</h1>
                <p className="text-gray-400 text-sm mb-6">Zen, trạng thái PK và tỷ lệ drop ngọc theo từng bản đồ.</p>

                <div className="overflow-x-auto rounded-lg border border-white/35">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-black/70 border-b border-white/35">
                        <th className="text-left py-3 px-4 text-white font-semibold border-r border-white/25 last:border-r-0">Tên</th>
                        <th className="text-center py-3 px-4 text-white font-semibold border-r border-white/25 last:border-r-0">Zen</th>
                        <th className="text-center py-3 px-4 text-white font-semibold border-r border-white/25 last:border-r-0">PK</th>
                        <th className="text-center py-3 px-4 text-white font-semibold">Drop Ngọc</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MAPS_DATA.map((row, i) => (
                        <tr
                          key={row.name + i}
                          className={`border-b border-white/20 last:border-b-0 ${i % 2 === 0 ? 'bg-black/30' : 'bg-black/20'}`}
                        >
                          <td className="py-2.5 px-4 text-gray-200 border-r border-white/25">{row.name}</td>
                          <td className="py-2.5 px-4 text-center text-gray-300 border-r border-white/25">{row.zen}</td>
                          <td className="py-2.5 px-4 text-center text-gray-300 border-r border-white/25">{row.pk}</td>
                          <td className="py-2.5 px-4 text-center text-gray-300">{row.drop}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
