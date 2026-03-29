'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
      fontFamily: 'var(--font-main)',
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

/** Logo tròn giữa menu (PNG xóa nền) */
const NAV_CENTER_ICON = '/panel/icon-mu.PNG';

const LoginIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuPortalReady, setMenuPortalReady] = useState(false);
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
    setMenuPortalReady(true);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const config = siteConfig || (siteConfigStatic as unknown as SiteConfig);
  const serverLabel = (config.serverName as string) || 'MU Online';

  return (
    <header
      data-header-version="2"
      className="fixed right-0 left-0 top-0 z-[100] overflow-visible"
      style={{
        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.85) 100%)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03) inset',    
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
      {/* Desktop: module riêng, tự set chiều cao h-20 */}
      <div className="hidden md:block h-20 relative">
      <nav className="relative max-w-7xl mx-auto px-6 h-full min-h-0 flex items-center justify-between overflow-visible">
        {/* Trái: Trang chủ | Xếp hạng */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-8 pr-[min(7.5rem,16vw)] lg:pr-32">
          {leftNavLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="nav-link-glow text-base md:text-[17px] font-medium uppercase tracking-wider whitespace-nowrap"
                data-active={isActive ? 'true' : undefined}
                style={{
                  fontFamily: 'var(--font-main)',
                  color: isActive ? '#FFD700' : 'rgba(255, 255, 255, 0.98)',
                  textShadow: isActive ? '0 0 8px rgba(255, 215, 0, 0.3)' : '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Logo icon-mu.png — lớn hơn thanh nav, tràn lên/xuống kiểu mẫu DemonuMu */}
        <div className="hidden md:flex absolute left-1/2 top-[calc(50%+50px)] z-[110] -translate-x-1/2 -translate-y-1/2 flex-shrink-0 pointer-events-none w-[288px] h-[288px] min-[900px]:w-[248px] min-[900px]:h-[248px] lg:w-[288px] lg:h-[288px] items-center justify-center">
          <Link
            href="/"
            className="pointer-events-auto flex h-full w-full items-center justify-center"
            aria-label={serverLabel}
          >
            {logoError ? (
              <LogoFallback className="h-[85%] w-[85%] rounded-full" />
            ) : (
              <Image
                src={NAV_CENTER_ICON}
                alt=""
                width={2200}
                height={1344}
                className="h-full w-full object-contain bg-transparent drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)]"
                style={{ backgroundColor: 'transparent' }}
                priority
                onError={() => setLogoError(true)}
                aria-hidden
              />
            )}
          </Link>
        </div>

        {/* Phải: Quyên góp | Bản tin */}
        <div className="hidden md:flex flex-1 items-center justify-start gap-8 pl-[min(7.5rem,16vw)] lg:pl-32">
          {rightNavLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="nav-link-glow text-base md:text-[17px] font-medium uppercase tracking-wider whitespace-nowrap"
                data-active={isActive ? 'true' : undefined}
                style={{
                  fontFamily: 'var(--font-main)',
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
      <Link
        href="/login"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 text-white transition-all hover:brightness-110 rounded-lg"
        style={{
          background: 'linear-gradient(180deg, #5c4535 0%, #4a3728 50%, #3d2e22 100%)',
          border: '2px solid #B87333',
          boxShadow: '0 4px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
        aria-label="Đăng nhập"
      >
        <LoginIcon className="w-6 h-6" />
      </Link>
      </div>

      {/* Mobile: menu mở = full-screen (bên dưới) — không còn drawer lệch/hở dưới thanh */}
      <div className="relative z-[102] md:hidden flex h-28 min-h-28 items-center justify-between px-3 sm:px-4">
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
        <Link href="/" className="flex flex-1 justify-center" aria-label={serverLabel}>
          <div className="flex h-24 w-24 shrink-0 items-center justify-center bg-transparent">
            {logoError ? (
              <LogoFallback className="h-20 w-20 rounded-full text-xl" />
            ) : (
              <Image
                src={NAV_CENTER_ICON}
                alt=""
                width={2200}
                height={1344}
                className="h-full w-full object-contain bg-transparent drop-shadow-md"
                style={{ backgroundColor: 'transparent' }}
                priority
                onError={() => setLogoError(true)}
                aria-hidden
              />
            )}
          </div>
        </Link>
        <Link
          href="/login"
          className="flex items-center justify-center w-11 h-11 text-white rounded-lg"
          style={{
            background: 'linear-gradient(180deg, #4a3728 0%, #3d2e22 100%)',
            border: '2px solid #B87333',
          }}
          aria-label="Đăng nhập"
        >
          <LoginIcon className="w-6 h-6" />
        </Link>
      </div>

      {menuPortalReady &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                key="mobile-menu-fullscreen"
                role="dialog"
                aria-modal="true"
                aria-label="Menu điều hướng"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9999] flex flex-col md:hidden"
                style={{
                  paddingTop: 'env(safe-area-inset-top, 0px)',
                  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                  background: 'linear-gradient(180deg, #141418 0%, #0c0c0f 100%)',
                }}
              >
                <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#B87333]/40 px-4">
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF37]"
                    style={{ fontFamily: 'var(--font-main)' }}
                  >
                    Điều hướng
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#B87333]/50 text-[#E8C547] transition-colors hover:border-[#FFD700]/70 hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
                    aria-label="Đóng menu"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-3" aria-label="Menu chính">
                  <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/30">
                    {allNavLinks.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block border-b border-white/[0.06] py-3 pl-3 pr-3 text-[0.875rem] font-medium uppercase tracking-wide transition-colors last:border-b-0 ${
                            isActive
                              ? 'border-l-[3px] border-l-[#FFD700] bg-[#FFD700]/[0.08] pl-[9px] text-[#FFD700]'
                              : 'border-l-[3px] border-l-transparent pl-3 text-white/90 hover:bg-white/[0.06] hover:text-[#FFD700]'
                          }`}
                          style={{ fontFamily: 'var(--font-main)' }}
                          data-active={isActive ? 'true' : undefined}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
}
