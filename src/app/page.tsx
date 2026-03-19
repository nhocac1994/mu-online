'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageBackground from '@/components/PageBackground';
import EventCountdown from '@/components/EventCountdown';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, getDownloadConfig, type SiteConfig, type DownloadLinks } from '@/lib/config-api';

/**
 * Logo icon cho CTA: có thể dùng ảnh PNG/WebP (đặt trong public/) hoặc SVG fallback.
 * Icon kiểu "sách vàng, khiên đỏ trong khung kim cương" trong mẫu thường là ẢNH do designer
 * vẽ (Photoshop/Illustrator), không phải CSS hay Canvas — bạn đặt file vào public/ và đổi path bên dưới.
 */
const CTA_ICON_REGISTER = '/icons/icon-registration.png'; // PNG/WebP: sách vàng, khung kim cương
const CTA_ICON_DOWNLOAD = '/icons/icon-download.png';   // PNG/WebP: khiên đỏ-vàng, khung kim cương

// Icon Đăng ký: người dùng + dấu cộng (tạo tài khoản)
const RegisterIcon = ({ className = 'w-12 h-12' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="18" r="8" stroke="#D4AF37" strokeWidth="2" fill="rgba(212,175,55,0.12)" />
    <path d="M12 40c0-8 5-14 12-14s12 6 12 14" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M32 24h8M36 20v8" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Icon Tải xuống: mũi tên xuống (download)
const DownloadIcon = ({ className = 'w-12 h-12' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 8v24M24 32l-8-8M24 32l8-8" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 38h28" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Hiển thị icon: ưu tiên ảnh (nếu có), không thì dùng SVG
function CTAIcon({ src, alt, fallback }: { src: string; alt: string; fallback: React.ReactNode }) {
  const [useFallback, setUseFallback] = useState(false);
  const iconSize = 56; // 14 * 4 = 56px cho md

  if (useFallback) return <>{fallback}</>;

  return (
    <div className="relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14">
      <Image
        src={src}
        alt={alt}
        width={iconSize}
        height={iconSize}
        className="object-contain w-full h-full"
        onError={() => setUseFallback(true)}
        unoptimized={src.startsWith('http')}
      />
    </div>
  );
}

// Class id → viết tắt (TOP PLAYERS)
const classShort: Record<number, string> = {
  0: 'DW', 1: 'SM', 2: 'GM', 16: 'DK', 17: 'BK', 18: 'BM', 32: 'FE', 33: 'ME', 34: 'HE',
  48: 'MG', 50: 'DL', 64: 'SM', 65: 'BS', 66: 'DM', 80: 'RF', 81: 'FM', 96: 'GL', 97: 'ML',
};

interface PlayerRow {
  character: string;
  class: number;
  level?: number | null;
  resets?: number | null;
  grandResets?: number | null;
}
interface GuildRow {
  guildName: string;
  guildMaster: string;
  memberCount: number;
  guildMark?: string | null;
}

// Dữ liệu mẫu để test hiển thị khi API chưa có dữ liệu (5 dòng mỗi bảng)
const SAMPLE_PLAYERS: PlayerRow[] = [
  { character: 'TestMu3', class: 66, level: 400, resets: 71 },
  { character: 'TestMu', class: 34, level: 400, resets: 50 },
  { character: 'Demonu', class: 50, level: 400, resets: 40 },
  { character: 'Mazoku', class: 18, level: 400, resets: 0 },
  { character: 'DarkKnight', class: 16, level: 350, resets: 25 },
];
const SAMPLE_GUILDS: GuildRow[] = [
  { guildName: 'MuOnline', guildMaster: 'Demonu', memberCount: 1 },
  { guildName: 'DragonSlayer', guildMaster: 'TestMu', memberCount: 12 },
  { guildName: 'Phoenix', guildMaster: 'Mazoku', memberCount: 8 },
  { guildName: 'Shadow', guildMaster: 'DarkKnight', memberCount: 5 },
  { guildName: 'Legends', guildMaster: 'TestMu3', memberCount: 3 },
];

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [siteConfig, setSiteConfig] = useState(siteConfigStatic as unknown as SiteConfig);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLinks | null>(null);
  const [topPlayers, setTopPlayers] = useState<PlayerRow[]>([]);
  const [topGuilds, setTopGuilds] = useState<GuildRow[]>([]);
  const [rankLoading, setRankLoading] = useState(true);

  const currentConfig = siteConfig || (siteConfigStatic as unknown as SiteConfig);
  const serverName = currentConfig?.serverName || 'MuDauTruongSS1.net';
  const serverVersion = currentConfig?.serverVersion || 'Season 1';
  const displayName = serverName.replace(/\.(net|com|vn)$/i, '').toUpperCase();
  const downloadSize = '397.5 MB';

  // Tên/domain hiển thị trên hero: từ websiteUrl (hostname) hoặc websiteName/serverName trong config
  const heroTitle = (() => {
    const cfg = currentConfig as { websiteUrl?: string; websiteName?: string };
    try {
      if (cfg?.websiteUrl) return new URL(cfg.websiteUrl).hostname;
    } catch {
      // URL không hợp lệ thì bỏ qua
    }
    return cfg?.websiteName || serverName;
  })();

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const check = () => setIsMobile(window.innerWidth <= 768);
      check();
      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const config = await getSiteConfig();
        if (config) {
          setSiteConfig({ ...siteConfigStatic, ...config } as unknown as SiteConfig);
        }
        const dl = await getDownloadConfig();
        if (dl) setDownloadLinks(dl);
      } catch {
        // keep static
      }
    };
    load();
  }, []);

  // Lấy top players và top guilds từ trang xếp hạng (API); không có thì dùng dữ liệu mẫu để test
  useEffect(() => {
    const load = async () => {
      setRankLoading(true);
      try {
        const [playersRes, guildsRes] = await Promise.all([
          fetch('/api/rankings/level'),
          fetch('/api/rankings/guild'),
        ]);
        const playersData = await playersRes.json();
        const guildsData = await guildsRes.json();
        if (playersData?.success && Array.isArray(playersData.data) && playersData.data.length > 0) {
          setTopPlayers(playersData.data.slice(0, 5));
        } else {
          setTopPlayers(SAMPLE_PLAYERS);
        }
        if (guildsData?.success && Array.isArray(guildsData.data) && guildsData.data.length > 0) {
          setTopGuilds(guildsData.data.slice(0, 5));
        } else {
          setTopGuilds(SAMPLE_GUILDS);
        }
      } catch {
        setTopPlayers(SAMPLE_PLAYERS);
        setTopGuilds(SAMPLE_GUILDS);
      } finally {
        setRankLoading(false);
      }
    };
    load();
  }, []);

  const news = [
    { title: `HƯỚNG DẪN CHƠI ${serverName.toUpperCase()} - ${serverVersion.toUpperCase()}`, date: '15/4/2026', type: 'Notice' as const, link: '/news/guide' },
    { title: 'CÁC SỰ KIỆN TRONG GAME', date: '15/4/2026', type: 'Event', link: '/news/events' },
    { title: 'LỘ TRÌNH PHÁT TRIỂN SERVER', date: '15/4/2026', type: 'Update', link: '/news/roadmap' },
    { title: 'THÔNG BÁO MỞ SERVER', date: '15/4/2026', type: 'Notice', link: '/news/opening' },
    { title: 'THÔNG TIN CÁC MAP', date: '15/4/2026', type: 'Event', link: '/news/maps' },
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: `${serverName} - ${currentConfig?.gameTitle}`,
    description: (currentConfig as { metaDescription?: string })?.metaDescription || `${serverName} - ${serverVersion}`,
    applicationCategory: 'Game',
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <PageBackground />
        <main className="relative z-10 pt-[160px]">
          {/* Hero: full viewport, logo + tên + 2 nút CTA */}
          <section className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 relative">
            {/* Chỉ chữ: tên/domain từ config + SEASON 1, căn giữa */}
            <div className="flex flex-col items-center justify-center text-center mb-8 md:mb-12 w-full">
              <h1
                className="font-bold text-white tracking-wide"
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                  textShadow: '0 0 20px rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.8)',
                }}
              >
                {heroTitle}
              </h1>
              <p
                className="text-white/90 uppercase tracking-widest mt-2"
                style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)' }}
              >
                {serverVersion}
              </p>
            </div>

            {/* Phần Đăng ký và Tải xuống: hai khối cạnh nhau, nửa trong suốt, icon riêng */}
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 md:gap-6 w-full max-w-3xl px-4">
              <Link
                href="/register"
                className="flex-1 min-w-0 flex items-center gap-4 px-6 py-5 rounded-xl transition-all hover:brightness-110"
                style={{
                  background: 'rgba(45, 45, 50, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.6)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex-shrink-0" style={{ color: '#D4AF37' }}>
                  <CTAIcon src={CTA_ICON_REGISTER} alt="Đăng ký" fallback={<RegisterIcon className="w-12 h-12 md:w-14 md:h-14" />} />
                </div>
                <div className="text-left min-w-0">
                  <span
                    className="block font-bold uppercase text-white tracking-wide"
                    style={{ fontSize: 'clamp(1rem, 2.2vw, 1.35rem)' }}
                  >
                    ĐĂNG KÝ
                  </span>
                  <span
                    className="block text-white/85 uppercase mt-1 tracking-wide"
                    style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}
                  >
                    Tạo tài khoản chơi game
                  </span>
                </div>
              </Link>
              <Link
                href="/download"
                className="flex-1 min-w-0 flex items-center gap-4 px-6 py-5 rounded-xl transition-all hover:brightness-110"
                style={{
                  background: 'rgba(45, 45, 50, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.6)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex-shrink-0" style={{ color: '#D4AF37' }}>
                  <CTAIcon src={CTA_ICON_DOWNLOAD} alt="Tải xuống" fallback={<DownloadIcon className="w-12 h-12 md:w-14 md:h-14" />} />
                </div>
                <div className="text-left min-w-0">
                  <span
                    className="block font-bold uppercase text-white tracking-wide"
                    style={{ fontSize: 'clamp(1rem, 2.2vw, 1.35rem)' }}
                  >
                    TẢI XUỐNG
                  </span>
                  <span
                    className="block text-white/85 uppercase mt-1 tracking-wide"
                    style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}
                  >
                    Phiên bản đầy đủ {downloadSize.replace('.', ',')}
                  </span>
                </div>
              </Link>
            </div>
          </section>

          {/* Một trang duy nhất: Sự kiện (giống ảnh 2) + Bản tin */}
          <section className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-6">
            <div
              className="rounded-lg overflow-hidden"
              style={{
                background: 'rgba(20, 20, 28, 0.92)',
                border: '1px solid rgba(212, 175, 55, 0.75)',
                boxShadow: '0 0 20px rgba(0,0,0,0.3), 0 0 8px rgba(212, 175, 55, 0.08)',
              }}
            >
              {/* Tiêu đề Sự kiện (không icon) */}
              <div
                className="pt-3 pb-2 border-b text-center"
                style={{ borderColor: 'rgba(255, 215, 0, 0.45)' }}
              >
                <h3
                  className="font-bold uppercase tracking-widest"
                  style={{ color: '#FFD700', fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.2vw, 1.25rem)' }}
                >
                  Sự kiện
                </h3>
              </div>
              <div className="p-3">
                <EventCountdown />
              </div>
              {/* Pagination */}
              <div
                className="px-4 py-2 border-t text-center uppercase tracking-wider"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}
              >
                Prev 1 / 1 Next
              </div>
            </div>
            {/* Bản tin mới — 5 hàng đều nhau, hàng cuối: Zalo / Facebook / YouTube */}
            <div
              className="rounded-lg overflow-hidden flex flex-col"
              style={{
                background: 'rgba(20, 20, 28, 0.92)',
                border: '1px solid rgba(212, 175, 55, 0.75)',
                boxShadow: '0 0 20px rgba(0,0,0,0.3), 0 0 8px rgba(212, 175, 55, 0.08)',
              }}
            >
              {/* Header: BẢN TIN MỚI */}
              <div
                className="pt-3 pb-2 border-b text-center flex-shrink-0"
                style={{ borderColor: 'rgba(255, 215, 0, 0.5)' }}
              >
                <h3
                  className="font-bold uppercase tracking-widest"
                  style={{
                    color: '#FFD700',
                    fontFamily: 'Cinzel, serif',
                    fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  Bản tin mới
                </h3>
              </div>
              {/* 5 hàng đều: 4 bản tin (hover màu theo badge) + 1 hàng icon mạng xã hội */}
              <div className="flex flex-col flex-1 min-h-[240px] p-4">
                {news.slice(0, 4).map((item, i) => {
                  const isNotice = item.type === 'Notice';
                  const isEvent = item.type === 'Event';
                  const hoverBg = isNotice
                    ? 'hover:bg-[#1e40af]/25'
                    : isEvent
                      ? 'hover:bg-[#ea580c]/25'
                      : 'hover:bg-[#b91c1c]/25';
                  return (
                    <Link
                      key={i}
                      href={item.link}
                      className={`group flex items-center gap-3 flex-1 min-h-0 py-1.5 px-2 -mx-2 rounded-md transition-colors duration-200 ${hoverBg}`}
                    >
                      <span
                        className="font-bold px-2 py-0.5 rounded flex-shrink-0 text-white uppercase"
                        style={{
                          background: isNotice ? '#1e40af' : isEvent ? '#ea580c' : '#b91c1c',
                          fontSize: '10px',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {item.type}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-white group-hover:text-[#FFD700] block leading-tight transition-colors font-semibold uppercase text-sm truncate">
                          {item.title}
                        </span>
                        <span className="text-gray-500 mt-0.5 block text-xs">
                          {item.date}
                        </span>
                      </div>
                    </Link>
                  );
                })}
                {/* Hàng 5: icon Zalo, Facebook, YouTube — căn đều, khoảng cách đồng nhất */}
                <div className="flex items-center justify-center flex-1 min-h-0 py-2">
                  <div className="flex items-center justify-center gap-8">
                    {siteConfig?.linkZalo && (
                      <a
                        href={siteConfig.linkZalo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-11 h-11 rounded-full overflow-hidden bg-black/50 hover:bg-black/70 hover:scale-110 transition-all duration-200 flex-shrink-0"
                        title="Zalo"
                        aria-label="Zalo"
                      >
                        <Image src="/Zalo-icon.webp" alt="Zalo" width={44} height={44} className="w-7 h-7 object-contain" />
                      </a>
                    )}
                    {siteConfig?.linkFacebook && (
                      <a
                        href={siteConfig.linkFacebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-11 h-11 rounded-full overflow-hidden bg-black/50 hover:bg-black/70 hover:scale-110 transition-all duration-200 flex-shrink-0"
                        title="Facebook"
                        aria-label="Facebook"
                      >
                        <Image src="/facebook-logo.webp" alt="Facebook" width={44} height={44} className="w-7 h-7 object-contain" />
                      </a>
                    )}
                    {siteConfig?.linkYoutube && (
                      <a
                        href={siteConfig.linkYoutube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-11 h-11 rounded-full overflow-hidden bg-black/50 hover:bg-black/70 hover:scale-110 transition-all duration-200 flex-shrink-0"
                        title="YouTube"
                        aria-label="YouTube"
                      >
                        <Image src="/youtube-logo.webp" alt="YouTube" width={44} height={44} className="w-7 h-7 object-contain" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              {/* Footer: Xem tất cả tin — căn giữa, chữ trắng, font sạch, hover vàng */}
              <div
                className="px-4 py-3 border-t flex-shrink-0 text-center"
                style={{ borderColor: 'rgba(255,255,255,0.22)' }}
              >
                <Link
                  href="/news"
                  className="inline-block text-white font-semibold uppercase tracking-wider transition-colors duration-200 hover:text-[#FFD700] hover:underline"
                  style={{ fontSize: '0.9rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Xem tất cả tin →
                </Link>
              </div>
            </div>
          </section>

          {/* TOP PLAYERS + TOP GUILDS — dữ liệu từ trang xếp hạng, không có thì "Chưa có thông tin" */}
          <section className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-6">
            {/* TOP PLAYERS */}
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                background: 'rgba(30, 30, 35, 0.95)',
                borderColor: 'rgba(255, 215, 0, 0.55)',
              }}
            >
              <div
                className="px-4 py-3 border-b text-center"
                style={{ borderColor: 'rgba(255, 215, 0, 0.5)', background: 'rgba(0,0,0,0.3)' }}
              >
                <h3
                  className="font-bold uppercase tracking-widest"
                  style={{ color: '#FFD700', fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.2vw, 1.25rem)' }}
                >
                  Top players
                </h3>
              </div>
              <div className="p-4">
                {rankLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#FFD700] border-t-transparent" />
                  </div>
                ) : topPlayers.length === 0 ? (
                  <p className="text-center text-white/70 py-6" style={{ fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>
                    Chưa có thông tin
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full" style={{ fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)' }}>
                      <thead>
                        <tr className="border-b border-white/40">
                          <th className="text-left py-2.5 px-2 font-bold text-white/90">#</th>
                          <th className="text-left py-2.5 px-2 font-bold text-white/90">Nhân vật</th>
                          <th className="text-left py-2.5 px-2 font-bold text-white/90">Class</th>
                          <th className="text-left py-2.5 px-2 font-bold text-white/90">Level</th>
                          <th className="text-left py-2.5 px-2 font-bold text-white/90">RR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPlayers.map((p, i) => (
                          <tr key={`${p.character}-${i}`} className="border-b border-white/10">
                            <td className="py-2.5 px-2 text-[#FFD700] font-medium">
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                            </td>
                            <td className="py-2.5 px-2 text-white">{p.character || '—'}</td>
                            <td className="py-2.5 px-2 text-white/90">{classShort[p.class] ?? p.class}</td>
                            <td className="py-2.5 px-2 text-white/90">{p.level ?? '—'}</td>
                            <td className="py-2.5 px-2 text-white/90">{p.resets ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="mt-4 flex justify-center">
                  <Link
                    href="/rankings"
                    className="px-6 py-2 text-sm font-semibold uppercase text-white rounded transition-all hover:brightness-110"
                    style={{
                      background: 'linear-gradient(180deg, #5c4535 0%, #4a3728 100%)',
                      border: '1px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    Xem thêm
                  </Link>
                </div>
              </div>
            </div>

            {/* TOP GUILDS */}
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                background: 'rgba(30, 30, 35, 0.95)',
                borderColor: 'rgba(255, 215, 0, 0.55)',
              }}
            >
              <div
                className="px-4 py-3 border-b text-center"
                style={{ borderColor: 'rgba(255, 215, 0, 0.5)', background: 'rgba(0,0,0,0.3)' }}
              >
                <h3
                  className="font-bold uppercase tracking-widest"
                  style={{ color: '#FFD700', fontFamily: 'Cinzel, serif', fontSize: 'clamp(1rem, 2.2vw, 1.25rem)' }}
                >
                  Top guilds
                </h3>
              </div>
              <div className="p-4">
                {rankLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#FFD700] border-t-transparent" />
                  </div>
                ) : topGuilds.length === 0 ? (
                  <p className="text-center text-white/70 py-6" style={{ fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)' }}>
                    Chưa có thông tin
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full" style={{ fontSize: 'clamp(0.8rem, 1.6vw, 0.9rem)' }}>
                      <thead>
                        <tr className="border-b border-white/40">
                          <th className="text-left py-2.5 px-2 font-bold text-white/90">#</th>
                          <th className="text-left py-2.5 px-2 font-bold text-white/90">Guild</th>
                          <th className="text-left py-2.5 px-2 font-bold text-white/90">Master</th>
                          <th className="text-left py-2.5 px-2 font-bold text-white/90">TV</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topGuilds.map((g, i) => (
                          <tr key={`${g.guildName}-${i}`} className="border-b border-white/10">
                            <td className="py-2.5 px-2 text-[#FFD700] font-medium">
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                            </td>
                            <td className="py-2.5 px-2 text-white">{g.guildName || '—'}</td>
                            <td className="py-2.5 px-2 text-white/90">{g.guildMaster || '—'}</td>
                            <td className="py-2.5 px-2 text-white/90">{g.memberCount ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="mt-4 flex justify-center">
                  <Link
                    href="/rankings"
                    className="px-6 py-2 text-sm font-semibold uppercase text-white rounded transition-all hover:brightness-110"
                    style={{
                      background: 'linear-gradient(180deg, #5c4535 0%, #4a3728 100%)',
                      border: '1px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    Xem thêm
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
    </div>
  );
}
