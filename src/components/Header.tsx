'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, type SiteConfig } from '@/lib/config-api';

const LogoFallback = ({ className = 'w-20 h-20' }: { className?: string }) => (
  <div
    className={`rounded-full flex items-center justify-center font-bold text-white border-2 ${className}`}
    style={{
      background: 'linear-gradient(180deg,rgb(104, 102, 102) 0%,rgb(124, 121, 121) 100%)',
      borderColor: 'rgba(255, 215, 0, 0.6)',
      boxShadow: 'inset 0 0 24px rgba(0,0,0,0.5)',
      fontFamily: 'Cinzel, serif',
      fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
      textShadow: '0 0 14px rgba(255, 215, 0, 0.4)',
    }}
  >
    MU
  </div>
);

// Trang chủ | Xếp hạng (trái) — Quyên góp | Bản tin (phải). Không có "Hình ảnh" vì logo đã ở giữa.
const leftNavLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Xếp hạng', href: '/rankings' },
];
const rightNavLinks = [
  { label: 'Quyên góp', href: '/donate' },
  { label: 'Bản tin', href: '/news' },
];
const allNavLinks = [...leftNavLinks, ...rightNavLinks];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(siteConfigStatic as unknown as SiteConfig);
  const pathname = usePathname();

  useEffect(() => {
    const load = async () => {
      const config = await getSiteConfig();
      if (config) setSiteConfig(config);
    };
    load();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen]);

  const config = siteConfig || (siteConfigStatic as unknown as SiteConfig);
  const logoUrl = (config as { logoImage?: string }).logoImage || '/icon.jpg';

  return (
    <header
      data-header-version="2"
      className="fixed right-0 left-0 top-0 z-[100] h-20 overflow-visible"
      style={{
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.85) 100%)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03) inset',
        borderBottom: '1px solid rgba(184, 115, 51, 0.45)',
      }}
    >
      {/* Mobile: ẩn nền đen; ép header sát top, không margin/padding tạo khoảng trống */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          header[data-header-version="2"] {
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            margin: 0 !important;
            padding-top: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            border-bottom: none !important;
          }
        }
        header .nav-link-glow { position: relative; padding-bottom: 10px; transition: color 0.2s, text-shadow 0.2s; }
        header .nav-link-glow::after {
          content: ''; position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);
          width: 0; height: 4px; background: #FFD700; border-radius: 2px;
          box-shadow: 0 0 12px #FFD700, 0 0 24px rgba(255,215,0,0.6); transition: width 0.25s, box-shadow 0.25s;
        }
        header .nav-link-glow:hover, header .nav-link-glow[data-active="true"] {
          color: #FFD700 !important; text-shadow: 0 0 10px rgba(255,215,0,0.6), 0 0 20px rgba(255,215,0,0.3) !important;
        }
        header .nav-link-glow:hover::after, header .nav-link-glow[data-active="true"]::after {
          width: 85% !important; box-shadow: 0 0 16px #FFD700, 0 0 32px rgba(255,215,0,0.7) !important;
        }
      `}} />
      {/* Thanh nav cao 80px (trùng với header); logo gấp đôi (160px), nửa trong header nửa tràn xuống */}
      <nav className="relative max-w-7xl mx-auto px-6 h-full min-h-0 flex items-center justify-between overflow-visible">
        {/* Trái: Trang chủ | Xếp hạng */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-8 pr-20 md:pr-24">
          {leftNavLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="nav-link-glow text-base md:text-[17px] font-medium uppercase tracking-wider whitespace-nowrap"
                data-active={isActive ? 'true' : undefined}
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: isActive ? '#FFD700' : 'rgba(255, 255, 255, 0.98)',
                  textShadow: isActive ? '0 0 8px rgba(255, 215, 0, 0.3)' : '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Logo 160px (desktop only): ẩn trên mobile để tránh trùng với logo trong thanh mobile */}
        <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 flex-shrink-0 pointer-events-none w-30 h-30">
          <Link href="/" className="pointer-events-auto flex items-center justify-center w-full h-full">
            <div
              className="w-30 h-30 rounded-full overflow-hidden border-[3px] flex items-center justify-center bg-black/50"
              style={{
                borderColor: 'rgba(205, 170, 100, 0.7)',
                boxShadow: '0 0 30px rgba(0,0,0,0.5), 0 0 20px rgba(184, 115, 51, 0.2), inset 0 0 20px rgba(0,0,0,0.3)',
              }}
            >
              {logoError ? (
                <LogoFallback className="w-full h-full rounded-full" />
              ) : (
                <Image
                  src={logoUrl}
                  alt={(config.serverName as string) || 'Logo'}
                  width={120}
                  height={120}
                  className="object-contain w-full h-full"
                  priority
                  unoptimized={logoUrl.startsWith('http')}
                  onError={() => setLogoError(true)}
                />
              )}
            </div>
          </Link>
        </div>

        {/* Phải: Quyên góp | Bản tin */}
        <div className="hidden md:flex flex-1 items-center justify-start gap-8 pl-20 md:pl-24">
          {rightNavLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="nav-link-glow text-base md:text-[17px] font-medium uppercase tracking-wider whitespace-nowrap"
                data-active={isActive ? 'true' : undefined}
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: isActive ? '#FFD700' : 'rgba(255, 255, 255, 0.98)',
                  textShadow: isActive ? '0 0 8px rgba(255, 215, 0, 0.3)' : '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* LOGIN cố định góc phải, nằm trong thanh header 80px (không tràn xuống dưới) */}
      <Link
        href="/login"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center px-6 py-2.5 text-base font-semibold uppercase tracking-wider text-white transition-all hover:brightness-110"
        style={{
          background: 'linear-gradient(180deg, #5c4535 0%, #4a3728 50%, #3d2e22 100%)',
          border: '2px solid #B87333',
          borderRadius: '8px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)',
        }}
      >
        LOGIN
      </Link>

      {/* Mobile - thanh nav 80px */}
      <div className="md:hidden flex items-center justify-between h-20 px-4">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded border border-[#B87333]/60"
          style={{ color: '#FFD700' }}
          aria-label="Menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/" className="flex-1 flex justify-center">
          <div
            className="w-16 h-16 rounded-full border-2 flex items-center justify-center bg-black/50 overflow-hidden"
            style={{ borderColor: 'rgba(205, 170, 100, 0.6)' }}
          >
            {logoError ? (
              <LogoFallback className="w-full h-full rounded-full text-xl" />
            ) : (
              <Image
                src={logoUrl}
                alt={(config.serverName as string) || 'Logo'}
                width={64}
                height={64}
                className="object-contain w-full h-full"
                priority
                onError={() => setLogoError(true)}
              />
            )}
          </div>
        </Link>
        <Link
          href="/login"
          className="px-4 py-2.5 text-xs font-bold uppercase text-white rounded-lg"
          style={{
            background: 'linear-gradient(180deg, #4a3728 0%, #3d2e22 100%)',
            border: '2px solid #B87333',
          }}
        >
          LOGIN
        </Link>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay: bấm ra ngoài để đóng menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 top-20 z-[99] bg-black/50"
              aria-hidden
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-[#B87333]/30 relative z-[101]"
              style={{ background: 'rgba(30, 30, 35, 0.98)' }}
            >
              <div className="py-4 px-4 space-y-1">
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className="text-sm font-semibold text-[#B87333] uppercase">Menu</span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded border border-white/20 text-white hover:bg-white/10"
                    aria-label="Đóng menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {allNavLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-base font-medium uppercase tracking-wider rounded hover:bg-white/5"
                    style={{ fontFamily: 'system-ui, sans-serif', color: 'rgba(255, 255, 255, 0.98)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
