'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageBackground from '@/components/PageBackground';
import { MuPanelFrame } from '@/components/MuPanelFrame';
import EventCountdown from '@/components/EventCountdown';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, getDownloadConfig, type SiteConfig, type DownloadLinks } from '@/lib/config-api';

const PANEL = {
  event: '/panel/panel-event.PNG',
  news: '/panel/panel-news.PNG',
  topPlayer: '/panel/panel-topplayer.PNG',
  topGuild: '/panel/panel-topguild.PNG',
  /** Nút “Xem thêm” — file thật: public/panel/xemthem.PNG (Linux/production phân biệt hoa thường) */
  xemThem: '/panel/xemthem.PNG',
} as const;

const XEMTHEM_IMG_PX = { w: 133, h: 40 } as const;

function PanelXemThemLink({ href, alt }: { href: string; alt: string }) {
  return (
    <Link
      href={href}
      className="inline-flex max-w-full justify-center rounded transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]/50"
    >
      <Image
        src={PANEL.xemThem}
        alt={alt}
        width={XEMTHEM_IMG_PX.w}
        height={XEMTHEM_IMG_PX.h}
        className="h-8 w-auto max-w-[min(133px,78vw)] object-contain object-center md:h-9"
        unoptimized
      />
    </Link>
  );
}

/** Ảnh nền panel (IHDR): event, news, topplayer, topguild đều 545×650 */
const EVENT_PANEL_PX = { w: 550, h: 650 } as const;
const NEWS_PANEL_PX = EVENT_PANEL_PX;

/** Đặt true khi đã có file trong public/icons/ để tránh 404 */
const CTA_USE_CUSTOM_PNG_ICONS = false;
const CTA_ICON_REGISTER = '/icons/icon-registration.png';
const CTA_ICON_DOWNLOAD = '/icons/icon-download.png';

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

// Hiển thị icon: chỉ tải PNG khi CTA_USE_CUSTOM_PNG_ICONS và file tồn tại; mặc định SVG (không 404)
function CTAIcon({ src, alt, fallback }: { src: string; alt: string; fallback: React.ReactNode }) {
  const [useFallback, setUseFallback] = useState(!CTA_USE_CUSTOM_PNG_ICONS);
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
        unoptimized={!src.startsWith('http')}
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
  const [siteConfig, setSiteConfig] = useState(siteConfigStatic as unknown as SiteConfig);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLinks | null>(null);
  const [topPlayers, setTopPlayers] = useState<PlayerRow[]>([]);
  const [topGuilds, setTopGuilds] = useState<GuildRow[]>([]);
  const [rankLoading, setRankLoading] = useState(true);

  const currentConfig = siteConfig || (siteConfigStatic as unknown as SiteConfig);
  const serverName = currentConfig?.serverName || 'MuDauTruongSS1.net';
  const serverVersion = currentConfig?.serverVersion || 'Season 1';
  const downloadSize = '274.075 MB';

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
    { title: 'CÁC LỆNH TRONG GAME (CHAT)', date: '15/4/2026', type: 'Notice' as const, link: '/news/commands' },
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
    <div className="min-h-screen relative overflow-x-hidden bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <PageBackground />
        <main className="relative z-10 min-w-0 bg-transparent pt-20 md:pt-48">
          {/* Hero: full viewport, logo + tên + 2 nút CTA */}
          <section className="flex flex-col items-center justify-center px-4 py-12 relative">
            {/* Chỉ chữ: tên/domain từ config + SEASON 1, căn giữa */}
            <div className="flex flex-col items-center justify-center text-center mb-2 md:mb-4 w-full">
              <Image
                src="/NAME.PNG"
                alt={serverName}
                width={480}
                height={120}
                priority
                className="w-full max-w-[440px] md:max-w-[520px] h-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
              />
            </div>

            {/* Phần Đăng ký và Tải xuống: hai khối cạnh nhau, nửa trong suốt, icon riêng */}
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 md:gap-6 w-full max-w-3xl px-4">
              <Link
                href="/register"
                className="flex-1 min-w-0 flex items-center gap-4 px-6 py-5 rounded-xl transition-all hover:brightness-110"
                style={{
                  background: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex-shrink-0" style={{ color: '#D4AF37' }}>
                  <CTAIcon src={CTA_ICON_REGISTER} alt="Đăng ký" fallback={<RegisterIcon className="w-10 h-10 md:w-10 md:h-10" />} />
                </div>
                <div className="text-left min-w-0">
                  <span
                    className="block font-bold uppercase text-white tracking-wide"
                    style={{ fontSize: 'clamp(0.8rem, 2.2vw, 1.35rem)' }}
                  >
                    ĐĂNG KÝ
                  </span>
                  <span
                    className="block text-white/85 uppercase mt-1 tracking-wide"
                    style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.9rem)' }}
                  >
                    Tạo tài khoản chơi game
                  </span>
                </div>
              </Link>
              <Link
                href="/download"
                className="flex-1 min-w-0 flex items-center gap-4 px-6 py-5 rounded-xl transition-all hover:brightness-110"
                style={{
                  background: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex-shrink-0" style={{ color: '#D4AF37' }}>
                  <CTAIcon src={CTA_ICON_DOWNLOAD} alt="Tải xuống" fallback={<DownloadIcon className="w-10 h-10 md:w-10 md:h-10" />} />
                </div>
                <div className="text-left min-w-0">
                  <span
                    className="block font-bold uppercase text-white tracking-wide"
                    style={{ fontSize: 'clamp(0.8rem, 2.2vw, 1.35rem)' }}
                  >
                    TẢI XUỐNG
                  </span>
                  <span
                    className="block text-white/85 uppercase mt-1 tracking-wide"
                    style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.9rem)' }}
                  >
                    Phiên bản đầy đủ {downloadSize.replace('.', ',')}
                  </span>
                </div>
              </Link>
            </div>
          </section>

          {/* Sự kiện + Bản tin — chỉ căn padding/mép Events; News giữ nguyên cấu hình riêng */}
          <section className="mx-auto grid min-w-0 max-w-7xl grid-cols-1 items-start gap-8 px-5 py-8 md:px-8 lg:grid-cols-2 lg:gap-10">
            <MuPanelFrame
              src={PANEL.event}
              alt="Sự kiện"
              width={EVENT_PANEL_PX.w}
              height={EVENT_PANEL_PX.h}
              className="min-w-0 w-full"
              overlayClassName="top-[12%] bottom-[9%] left-[5%] right-[5%]"
              backgroundSize="contain"
            >
              <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden">
                <div className="min-h-0 w-full max-w-full flex-1 overflow-x-hidden overflow-y-auto px-2 pb-2 sm:px-3">
                  <div className="pt-[10px] sm:pt-3">
                    <EventCountdown variant="eventsBoard" />
                  </div>
                </div>
                <div
                  className="flex-shrink-0 border-t border-white/10 px-2 py-2 text-center uppercase tracking-wider text-white/55 sm:px-3"
                  style={{ fontSize: '0.68rem' }}
                >
                  Prev 1 / 1 Next
                </div>
              </div>
            </MuPanelFrame>

            <MuPanelFrame
              src={PANEL.news}
              alt="Bản tin mới"
              width={NEWS_PANEL_PX.w}
              height={NEWS_PANEL_PX.h}
              className="min-w-0 w-full"
              innerClassName="max-md:min-h-[36rem]"
              overlayClassName="top-[12%] bottom-[9%] left-[5%] right-[5%]"
              backgroundSize="contain"
            >
              <span className="sr-only">Bản tin mới</span>
              <div className="flex h-full min-h-0 min-w-0 w-full max-w-full flex-col overflow-hidden">
                <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-x-hidden overflow-y-auto px-2 pb-1 sm:px-3">
                  {/* Cách mép trên card một lần cho cả cụm tin — không dùng py từng Link (sẽ lặp 10px mỗi hàng) */}
                  <div className="min-w-0 max-w-full space-y-0 pt-17 sm:pt-2 pt-2">
                    {news.slice(0, 5).map((item, i) => {
                      const isNotice = item.type === 'Notice';
                      const isEvent = item.type === 'Event';
                      const badgeBg = isNotice ? '#1e40af' : isEvent ? '#ea580c' : '#b91c1c';
                      return (
                        <Link
                          key={i}
                          href={item.link}
                          className="group block min-w-0 max-w-full overflow-hidden border-b border-white/15 pb-1.5 last:border-b-0 md:pb-2.5"
                        >
                          <div className="flex min-w-0 max-w-full items-start justify-between gap-1.5 sm:gap-4 sm:pt-4">
                            <div className="flex min-w-0 flex-1 items-start gap-1 sm:gap-4">
                              <span
                                className="mt-0.5 flex-shrink-0 rounded px-1 py-0.5 text-[7px] font-bold uppercase leading-none text-white tracking-wide sm:px-1.5 sm:text-[9px]"
                                style={{
                                  background: badgeBg,
                                  letterSpacing: '0.04em',
                                }}
                              >
                                {item.type}
                              </span>
                              <span
                                className="min-w-0 flex-1 break-words font-bold uppercase leading-tight transition-colors group-hover:text-[#FFA733] sm:truncate md:leading-snug"
                                style={{
                                  color: '#FF8C00',
                                  fontSize: 'clamp(0.62rem, 2.8vw, 0.78rem)',
                                  fontFamily: 'var(--font-main)',
                                }}
                              >
                                {item.title}
                              </span>
                            </div>
                            <span className="flex-shrink-0 whitespace-nowrap text-right text-[0.62rem] font-medium tabular-nums text-white md:text-[0.75rem]">
                              {item.date}
                            </span>
                          </div>
                          <div className="mt-0.5 flex min-w-0 max-w-full items-center justify-between gap-2 pb-0.5 md:mt-1">
                            <span className="min-w-0 truncate text-[0.58rem] uppercase tracking-wide text-white/85 md:text-[0.7rem]">
                              Cập nhật
                            </span>
                            <span className="flex-shrink-0 whitespace-nowrap text-[0.6rem] text-white/55 transition-colors group-hover:text-[#FFD700] md:text-[0.72rem]">
                              Xem →
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-1.5 flex max-w-full shrink-0 flex-wrap items-center justify-center border-t border-white/10 pt-2 pb-1 md:mt-2 md:pt-6">
                    <div className="flex max-w-full flex-wrap items-center justify-center gap-3 sm:gap-8 pt-10">
                      {siteConfig?.linkZalo && (
                        <a
                          href={siteConfig.linkZalo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 transition-all duration-200 hover:scale-110 hover:bg-white/20 md:h-11 md:w-11"
                          title="Zalo"
                          aria-label="Zalo"
                        >
                          <Image src="/Zalo-icon.webp" alt="Zalo" width={40} height={40} className="h-26 w-26 object-contain sm:h-10 sm:w-10" />
                        </a>
                      )}
                      {siteConfig?.linkFacebook && (
                        <a
                          href={siteConfig.linkFacebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 transition-all duration-200 hover:scale-110 hover:bg-white/20 md:h-11 md:w-11"
                          title="Facebook"
                          aria-label="Facebook"
                        >
                          <Image src="/facebook-logo.png" alt="Facebook" width={40} height={40} className="h-26 w-26 object-contain sm:h-10 sm:w-10" />
                        </a>
                      )}
                      {siteConfig?.linkYoutube && (
                        <a
                          href={siteConfig.linkYoutube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 transition-all duration-200 hover:scale-110 hover:bg-white/20 md:h-11 md:w-11"
                          title="TikTok"
                          aria-label="TikTok"
                        >
                          <Image src="/tiktok-logo.png" alt="TikTok" width={40} height={40} className="h-26 w-26 object-contain sm:h-15 sm:w-15" />
                        </a>
                      )}
                    </div>
                  </div>  
                </div>
              </div>
              {/* Cùng vùng cuộn với tin + MXH — tránh bị đẩy ra ngoài viền panel (flex pin dưới) */}
              <div className="flex flex-shrink-0 justify-center pt-2">
                   <PanelXemThemLink href="/news" alt="Xem tất cả tin tức" />
              </div>
            </MuPanelFrame>
          </section>

          {/* TOP PLAYERS + TOP GUILDS — cùng tỷ lệ/overlay như Events & Bản tin */}
          <section className="mx-auto grid min-w-0 max-w-7xl grid-cols-1 items-start gap-8 px-5 py-8 md:px-8 lg:grid-cols-2 lg:gap-10">
            <MuPanelFrame
              src={PANEL.topPlayer}
              alt="Top players"
              width={EVENT_PANEL_PX.w}
              height={EVENT_PANEL_PX.h}
              overlayClassName="top-[12%] bottom-[9%] left-[5%] right-[5%]"
              className="min-w-0 w-full"
              backgroundSize="contain"
            >
              <span className="sr-only">Top players</span>
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 pt-8 sm:px-3 sm:pt-17">
                {rankLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent" />
                  </div>
                ) : topPlayers.length === 0 ? (
                  <p className="py-8 text-center text-white/70" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>
                    Chưa có thông tin
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full" style={{ fontSize: 'clamp(0.82rem, 1.4vw, 0.95rem)' }}>
                      <thead>
                        <tr>
                          <th className="px-1 pb-4 sm:pb-4 pt-4 text-left font-bold text-white/90">#</th>
                          <th className="px-1 pb-4 sm:pb-4 pt-4 text-left font-bold text-white/90">Nhân vật</th>
                          <th className="px-1 pb-4 sm:pb-4 pt-4 text-left font-bold text-white/90">Class</th>
                          <th className="px-1 pb-4 sm:pb-4 pt-4 text-left font-bold text-white/90">Level</th>
                          <th className="px-1 pb-4 sm:pb-4 pt-4 text-left font-bold text-white/90">RR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPlayers.map((p, i) => (
                          <tr key={`${p.character}-${i}`} className="border-b border-white/4">
                            <td className="px-1 py-2 sm:pt-4 font-medium text-[#FFD700]">
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                            </td>
                            <td className="max-w-[5.5rem] truncate px-1 py-2 sm:pt-4 text-white">{p.character || '—'}</td>
                            <td className="px-1 py-2 sm:pt-4 text-white/90">{classShort[p.class] ?? p.class}</td>
                            <td className="px-1 py-2 sm:pt-4 text-white/90">{p.level ?? '—'}</td>
                            <td className="px-1 py-2 sm:pt-4 text-white/90">{p.resets ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="flex flex-shrink-0 justify-center pt-2">
                <PanelXemThemLink href="/rankings" alt="Xem thêm bảng xếp hạng nhân vật" />
              </div>
            </MuPanelFrame>

            <MuPanelFrame
              src={PANEL.topGuild}
              alt="Top guilds"
              width={EVENT_PANEL_PX.w}
              height={EVENT_PANEL_PX.h}
              overlayClassName="top-[12%] bottom-[9%] left-[5%] right-[5%]"
              className="min-w-0 w-full"
              backgroundSize="contain"
            >
              <span className="sr-only">Top guilds</span>
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 pt-8 sm:px-3 sm:pt-17">
                {rankLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD700] border-t-transparent" />
                  </div>
                ) : topGuilds.length === 0 ? (
                  <p className="py-8 text-center text-white/70" style={{ fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)' }}>
                    Chưa có thông tin
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full" style={{ fontSize: 'clamp(0.72rem, 1.4vw, 0.85rem)' }}>
                      <thead>
                        <tr>
                          <th className="px-1 pb-4 sm:pb-4 pt-2 text-left font-bold text-white/90">#</th>
                          <th className="px-1 pb-4 sm:pb-4 pt-2 text-left font-bold text-white/90">Guild</th>
                          <th className="px-1 pb-4 sm:pb-4 pt-2 text-left font-bold text-white/90">Master</th>
                          <th className="px-1 pb-4 sm:pb-4 pt-2 text-left font-bold text-white/90">TV</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topGuilds.map((g, i) => (
                          <tr key={`${g.guildName}-${i}`} className="border-b border-white/4">
                            <td className="px-1 py-2 sm:pt-4 font-medium text-[#FFD700]">
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                            </td>
                            <td className="max-w-[5rem] truncate px-1 py-2 sm:pt-4 text-white">{g.guildName || '—'}</td>
                            <td className="max-w-[4.5rem] truncate px-1 py-2 sm:pt-4 text-white/90">{g.guildMaster || '—'}</td>
                            <td className="px-1 py-2 sm:pt-4 text-white/90">{g.memberCount ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="flex flex-shrink-0 justify-center pt-2">
                <PanelXemThemLink href="/rankings" alt="Xem thêm bảng xếp hạng guild" />
              </div>
            </MuPanelFrame>
          </section>
        </main>
    </div>
  );
}
