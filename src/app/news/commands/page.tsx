'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, type SiteConfig } from '@/lib/config-api';

type CmdRow = { cmd: string; desc: string };

const COMMAND_GROUPS: { title: string; rows: CmdRow[] }[] = [
  {
    title: 'Chat & thông báo',
    rows: [
      { cmd: '/post Nội dung', desc: 'Gửi thông báo lên toàn server' },
      { cmd: '/evo', desc: 'Làm nhiệm vụ' },
    ],
  },
  {
    title: 'Cộng điểm (sau khi reset / có điểm dư)',
    rows: [
      { cmd: '/addstr Số', desc: 'Cộng Strength.' },
      { cmd: '/addagi Số', desc: 'Cộng Agility.' },
      { cmd: '/addvit Số', desc: 'Cộng Vitality.' },
      { cmd: '/addene Số', desc: 'Cộng Energy.' },
      { cmd: '/addcmd Số', desc: 'Cộng Command (DL).' },
    ],
  },
  {
    title: 'Nhân vật & tiện ích',
    rows: [
      { cmd: '/reset', desc: 'Reset nhân vật khi đủ điều kiện level / Zen' },
      { cmd: '/reset auto', desc: 'Reset nhân vật tự động khi đủ điều kiện level / Zen' },
      { cmd: '/pkclear', desc: 'Xóa trạng thái PK (nếu bật).' },
      { cmd: '/request on | off', desc: 'Bật/tắt nhận lời mời party / trade' },
      { cmd: '/readd | /reload', desc: 'Tẩy điểm nhân vật' },
    ],
  },
  {
    title: 'Kho & giao dịch',
    rows: [
      { cmd: '/store', desc: 'Mở kho đồ (chaos , life , b , s , c) tại NPC tương ứng' },
      { cmd: '/offstore', desc: 'Treo store không cần online' },
      { cmd: '/warehouse', desc: 'Tương tự kho đồ' },
    ],
  },
  {
    title: 'Nhặt đồ & auto nhặt',
    rows: [
      { cmd: '/pick', desc: 'Auto nhặt (/pick 1 1 1 1) nhặt hêt tất cả ' },
      { cmd: '/pickclear', desc: 'Tắt Auto nhặt' },
    ],
  },
];

export default function NewsCommands() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(siteConfigStatic as unknown as SiteConfig);
  useEffect(() => {
    getSiteConfig().then((c) => {
      if (c) setSiteConfig(c);
    });
  }, []);

  const serverName = siteConfig?.serverName || siteConfigStatic.serverName;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black" style={{ fontFamily: 'var(--font-main)' }}>
      <PageBackground />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-black/40" aria-hidden />
      <div className="relative z-10 px-4 pb-12 pt-48">
        <section className="bg-black/30 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
              <Link href="/" className="text-blue-400 hover:text-blue-300">
                Trang chủ
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/news" className="text-blue-400 hover:text-blue-300">
                Bản tin
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-white">Lệnh trong game</span>
            </nav>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg border border-white/40 bg-black/50 p-6 sm:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white">Notice</span>
                  <span className="text-sm text-gray-400">15/4/2026</span>
                </div>
                <h1 className="mb-4 text-2xl font-bold text-white sm:text-3xl">CÁC LỆNH TRONG GAME (CHAT)</h1>
                <p className="mb-8 text-sm text-gray-300">
                  Danh sách dưới đây là các lệnh chat phổ biến trên nhiều server MU Online (Season 1 / private).{' '}
                  <strong className="text-[#F39C12]">{serverName}</strong> có thể bật/tắt hoặc đổi cú pháp — nếu lệnh
                  không chạy, hỏi GM hoặc xem bảng lệnh trong game (F1 / NPC Helper nếu có).
                </p>

                <div className="space-y-8">
                  {COMMAND_GROUPS.map((g) => (
                    <div key={g.title}>
                      <h2 className="mb-3 border-b border-white/20 pb-2 text-lg font-bold text-[#F39C12]">{g.title}</h2>
                      <div className="overflow-x-auto rounded-lg border border-white/25">
                        <table className="w-full min-w-[280px] text-left text-sm">
                          <thead>
                            <tr className="border-b border-white/20 bg-black/40 text-gray-400">
                              <th className="px-3 py-2 font-semibold">Lệnh</th>
                              <th className="px-3 py-2 font-semibold">Mô tả ngắn</th>
                            </tr>
                          </thead>
                          <tbody>
                            {g.rows.map((r) => (
                              <tr key={r.cmd} className="border-b border-white/10 last:border-0">
                                <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[0.8rem] text-[#7dd3fc]">
                                  {r.cmd}
                                </td>
                                <td className="px-3 py-2.5 text-gray-300">{r.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-8 rounded-lg border border-[#F39C12]/40 bg-black/40 p-4 text-xs text-gray-400">
                  Ghi chú: Gõ lệnh trong ô chat trong game (Enter). Không thêm khoảng trắng thừa ở đầu. Một số lệnh chỉ
                  dùng được ở thành / khu an toàn hoặc khi đủ Zen / level.
                </p>

                <div className="mt-8 text-center">
                  <Link href="/news" className="text-sm font-medium text-[#F39C12] hover:underline">
                    ← Quay lại bản tin
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
