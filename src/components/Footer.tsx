'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, type SiteConfig } from '@/lib/config-api';

/** Thanh trang trí + về đầu trang — public/panel/top.PNG */
const FOOTER_TOP_BAR = '/panel/top.PNG';

// Icon nhỏ cho tiêu đề cột (khiên + viên đỏ)
const ColumnIcon = () => (
  <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center" aria-hidden>
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
      <path d="M10 2L12 6h4l-3 3 1 4-4-2-4 2 1-4-3-3h4L10 2z" fill="#FFD700" stroke="rgba(212,175,55,0.8)" strokeWidth="0.5" />
      <circle cx="10" cy="8" r="2" fill="#CC0000" />
    </svg>
  </span>
);

// Cấu trúc 6 cột theo ảnh 2
const footerColumns = [
  {
    title: 'Trang chủ',
    links: [
      { label: 'Đăng ký', href: '/register' },
      { label: 'Tải game', href: '/download' },
      { label: 'Đăng nhập', href: '/login' },
    ],
  },
  {
    title: 'Xếp hạng',
    links: [
      { label: 'Top nhân vật', href: '/rankings' },
      { label: 'Top guild', href: '/rankings' },
    ],
  },
  {
    title: 'Bản tin',
    links: [
      { label: 'Tin tức', href: '/news' },
      { label: 'Sự kiện', href: '/news/events' },
    ],
  },
  {
    title: 'Media',
    links: [
      { label: 'Video', href: '/info' },
    ],
  },
  {
    title: 'Về server',
    links: [
      { label: 'Thông tin server', href: '/info' },
      { label: 'Hướng dẫn', href: '/news/guide' },
    ],
  },
  {
    title: 'Khác',
    links: [
      { label: 'Quyên góp', href: '/donate' },
    ],
  },
];

const footerFont = 'var(--font-main)';

export default function Footer() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(siteConfigStatic as unknown as SiteConfig);
  const [isBackendLoaded, setIsBackendLoaded] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getSiteConfig();
        if (config) {
          setSiteConfig(config);
          setIsBackendLoaded(true);
        } else {
          setIsBackendLoaded(false);
        }
      } catch {
        setIsBackendLoaded(false);
      }
    };
    loadConfig();
  }, []);

  const currentConfig = useMemo(() => {
    const config = siteConfig || (siteConfigStatic as unknown as SiteConfig);
    return { ...config, socialMedia: config?.socialMedia || {} };
  }, [siteConfig]);

  const serverName = currentConfig?.serverName || currentConfig?.nameGame || 'MuDauTruongSS1.net';
  const serverVersion = currentConfig?.serverVersion || 'Season 1';
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full" style={{ background: '#0a0a0a' }}>
      {/* Phần trên: đường kẻ + Back to Top + 6 cột link (ảnh 2) */}
      <div
        className="w-full"
        style={{
          background: 'linear-gradient(180deg, rgba(20,20,22,0.98) 0%, rgba(15,15,18,0.99) 100%)',
          boxShadow: '0 -4px 24px rgba(255, 120, 0, 0.08)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-8">
          {/* Ảnh top.PNG — căn giữa, bấm để về đầu trang */}
          <div className="flex justify-center pb-4 mb-6 border-b border-white/10">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group w-full max-w-3xl bg-transparent p-0 border-0 cursor-pointer transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416]"
              aria-label="Về đầu trang"
            >
              <Image
                src={FOOTER_TOP_BAR}
                alt=""
                width={2398}
                height={200}
                className="h-auto w-full object-contain bg-transparent"
                style={{ backgroundColor: 'transparent' }}
                aria-hidden
              />
            </button>
          </div>

          {/* 6 cột navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
            {footerColumns.map((col, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <ColumnIcon />
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: '#E8A84A', fontFamily: footerFont }}
                  >
                    {col.title}
                  </span>
                </div>
                <ul className="flex flex-col gap-1 pl-6">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={link.href}
                        className="text-xs text-white/80 hover:text-[#FFD700] uppercase tracking-wide transition-colors"
                        style={{ fontFamily: footerFont }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phần dưới: thanh đen — Copyright | Logo + tên | Powered by */}
      <div
        className="w-full py-12 md:py-16"
        style={{
          background: '#000000',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12">
            {/* Trái: Copyright + disclaimer */}
            <div className="text-center md:text-left order-2 md:order-1" style={{ fontFamily: footerFont }}>
              <p
                className="text-lg md:text-xl font-semibold uppercase tracking-wide"
                style={{ color: '#E8A84A' }}
              >
                Copyright {year} © {serverName}
              </p>
              <p className="text-sm md:text-base mt-2 text-gray-500">
                This site is in no way associated or endorsed by Webzen Inc.
              </p>
            </div>

            {/* Giữa: ảnh tên server + season */}
            <div className="flex flex-col items-center gap-0 order-1 md:order-2" style={{ fontFamily: footerFont }}>
              <Image
                src="/NAME.PNG"
                alt={serverName}
                width={760}
                height={180}
                className="w-auto h-20 md:h-24 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
              />
            </div>

            {/* Phải: Powered by */}
            <div className="text-center md:text-right order-3" style={{ fontFamily: footerFont }}>
              <p className="text-sm md:text-base text-gray-500">
                Powered by{' '}
                <span className="font-semibold text-base md:text-lg" style={{ color: '#E8A84A' }}>
                  {serverName}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
