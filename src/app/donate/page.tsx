'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageBackground from '@/components/PageBackground';
import siteConfigStatic from '@/config/site.config.json';
import { getBankTransferConfig, type BankTransfer } from '@/lib/config-api';

const cardClass = 'rounded border border-white/40 bg-black/30 p-6';
const titleClass = 'text-[#F39C12] font-bold uppercase tracking-wider text-sm';

export default function Donate() {
  const [bankTransfer, setBankTransfer] = useState<BankTransfer | null>(null);

  useEffect(() => {
    const load = async () => {
      const config = await getBankTransferConfig();
      setBankTransfer(config || (siteConfigStatic as { bankTransfer?: BankTransfer }).bankTransfer || null);
    };
    load();
  }, []);

  const bank = bankTransfer || (siteConfigStatic as { bankTransfer: BankTransfer }).bankTransfer;

  return (
    <div className="min-h-screen relative bg-black" style={{ fontFamily: 'var(--font-main)' }}>
      <PageBackground />
      <div className="relative z-10 pt-28 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors" aria-label="Trang chủ">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <span>/</span>
          <span className="text-gray-300">donate</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-1 text-center">ỦNG HỘ SERVER</h1>
        <p className="text-sm text-gray-400 text-center mb-10">Hỗ trợ server phát triển và duy trì hoạt động</p>

        {/* Hàng 1: Gold Member (trái) + Thông tin donate (phải) */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className={cardClass}>
            <h3 className={titleClass}>Vip number</h3>
            <p className="text-xl font-bold text-[#F39C12] mt-2">200.000đ / 30 ngày</p>
            <ul className="mt-4 space-y-2 text-white text-sm">
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-[#F39C12] rounded-full shrink-0" /> Tăng 5% tỉ lệ úp đồ / 10-11-12-13</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-[#F39C12] rounded-full shrink-0" /> Thời hạn 30 ngày</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 bg-[#F39C12] rounded-full shrink-0" /> Ưu đãi đặc biệt nhận 5 chaos / 30 life</li>
            </ul>
          </div>
          <div className="rounded border border-white/40 bg-black/30 p-6">
            <h2 className={titleClass}>Thông tin donate</h2>
            <p className="text-gray-400 text-xs mt-0.5 mb-4">Thông tin tài khoản ngân hàng</p>
            <div className="flex flex-wrap items-start gap-6">
              <div className="space-y-1.5 min-w-0">
                <div>
                  <span className="text-gray-500 text-[11px] uppercase tracking-wide">Số tài khoản</span>
                  <p className="text-white font-medium text-sm leading-tight">{bank?.accountNumber}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-[11px] uppercase tracking-wide">Chủ tài khoản</span>
                  <p className="text-white font-medium text-sm leading-tight">{bank?.accountHolder}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-[11px] uppercase tracking-wide">Ngân hàng</span>
                  <p className="text-white font-medium text-sm leading-tight">{bank?.bankName}</p>
                </div>
              </div>
              {bank?.qrCodeUrl && (
                <div className="shrink-0">
                  <Image
                    src={bank.qrCodeUrl}
                    alt="QR Code"
                    width={140}
                    height={140}
                    className="rounded border border-white/40 w-[140px] h-[140px] object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hàng 2: Hướng dẫn donate */}
        <div className={cardClass}>
          <h3 className={titleClass}>Hướng dẫn donate</h3>
          <ol className="mt-4 space-y-2 text-white text-sm list-decimal list-inside text-gray-300">
            <li>Chuyển khoản theo thông tin trên</li>
            <li>Ghi nội dung: &quot;Tên Tài Khoản&quot;</li>
            <li>Gửi bill cho Admin qua Zalo</li>
            <li>Chờ Admin xử lý và cấp quyền lợi</li>
          </ol>
        </div>
      </div>
      </div>
    </div>
  );
}
