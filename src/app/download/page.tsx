'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, getDownloadConfig, type SiteConfig, type DownloadLinks } from '@/lib/config-api';

const SECTION_HEADER_STYLE = {
  background: 'rgba(40, 40, 45, 0.95)',
  color: '#E8A84A',
  fontFamily: 'var(--font-main)',
  fontSize: '0.9rem',
  paddingTop: '1.5rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  padding: '0.5rem 0.75rem',
  paddingBottom: '1.5rem',
  textTransform: 'uppercase' as const,
};

const systemRequirementsRows = [
  { component: 'Operating System', requirement: 'Windows 7/8/10/11' },
  { component: 'Processor', requirement: 'Pentium 4 2.0 Ghz or higher' },
  { component: 'System Memory', requirement: '1 GB or higher' },
  { component: 'Graphics', requirement: 'DirectX 9.0c compatible' },
  { component: 'Storage', requirement: '5 GB free space' },
];

export default function Download() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(siteConfigStatic as unknown as SiteConfig);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLinks | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getSiteConfig();
        if (config) setSiteConfig(config);
        const links = await getDownloadConfig();
        if (links) setDownloadLinks(links);
      } catch {
        // keep static config
      }
    };
    loadConfig();
  }, []);

  const config = siteConfig || (siteConfigStatic as unknown as SiteConfig);
  const links = downloadLinks || config?.downloadLinks || (siteConfigStatic as unknown as { downloadLinks: DownloadLinks }).downloadLinks;
  const clientVersion = links?.clientVersion || 'v1.1';
  const serverName = config?.serverName || config?.nameGame || 'MuDauTruongSS1.net';
  const displayName = serverName.replace(/\.(net|com|vn)$/i, '');
  const downloadSize = '397.5';

  return (
    <div className="min-h-screen relative bg-black">
      <PageBackground />
      <div className="relative z-10 pt-28 pb-12 px-4">
        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto mb-4 flex items-center gap-2 text-sm text-white/80">
          <Link href="/" className="hover:text-[#FFD700] transition-colors" aria-label="Trang chủ">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <span className="text-white/50">/</span>
          <span className="text-white/90">downloads</span>
        </div>

        {/* Container chính: viền vàng, icon skull trên cùng giữa */}
        <div
          className="max-w-5xl mx-auto rounded-lg overflow-hidden"
          style={{
            background: 'rgba(28, 28, 32, 0.92)',
            border: '1px solid rgba(212, 175, 55, 0.7)',
            boxShadow: '0 0 24px rgba(0,0,0,0.4)',
          }}
        >
          {/* Icon skull trang trí — giữa trên cùng */}
          <div className="flex justify-center pt-4 pb-2">
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-full"
              style={{
                background: 'rgba(60, 60, 65, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
              aria-hidden
            >
              <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C8 2 6 5 6 8c0 3 2 4 6 6 4-2 6-3 6-6 0-3-2-6-6-6z" />
                <circle cx="9" cy="10" r="1.2" fill="currentColor" />
                <circle cx="15" cy="10" r="1.2" fill="currentColor" />
                <path d="M8 14c0 2 1.5 3 4 3s4-1 4-3" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-0 p-4 md:p-6" style={{ fontFamily: 'var(--font-main)' }}>
            {/* CỘT TRÁI */}
            <div className="space-y-6">
              {/* Client Downloads */}
              <div className="rounded border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div style={SECTION_HEADER_STYLE}>Client Downloads</div>
                <div className="p-4 space-y-3 bg-black/20">
                  {/* Card MediaFire */}
                  <a
                    href={links?.mediafire || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded p-4 transition-colors hover:bg-white/5"
                    style={{
                      border: '1px solid rgba(212, 175, 55, 0.6)',
                      background: 'rgba(30, 30, 35, 0.6)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm sm:text-base">
                          {displayName} {clientVersion} ({downloadSize} MB)
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Mở Config hoặc Main.exe — Chạy với quyền Administrator
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 flex-shrink-0 text-white/90 text-xs font-medium">
                        <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        MediaFire
                      </span>
                    </div>
                  </a>
                  {/* Card Mega */}
                  <a
                    href={links?.mega || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded p-4 transition-colors hover:bg-white/5"
                    style={{
                      border: '1px solid rgba(212, 175, 55, 0.6)',
                      background: 'rgba(30, 30, 35, 0.6)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm sm:text-base">
                          {displayName} {clientVersion} ({downloadSize} MB)
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Mở Config hoặc Main.exe — Chạy với quyền Administrator
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 flex-shrink-0 text-white/90 text-xs font-medium">
                        <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        MegaNZ
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Tool Downloads — chỉ header */}
              <div className="rounded border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div style={SECTION_HEADER_STYLE}>Tool Downloads</div>
                <div className="p-4 bg-black/20 min-h-[60px] flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Chưa có công cụ</p>
                </div>
              </div>

              {/* System Requirements — bảng */}
              <div className="rounded border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div style={SECTION_HEADER_STYLE}>System Requirements</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'rgba(50, 50, 55, 0.9)' }}>
                        <th className="text-left py-2.5 px-3 font-bold" style={{ color: '#E8A84A' }}>COMPONENT</th>
                        <th className="text-left py-2.5 px-3 font-bold" style={{ color: '#E8A84A' }}>REQUIREMENTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {systemRequirementsRows.map((row, i) => (
                        <tr
                          key={i}
                          className="text-white/90"
                          style={{ background: i % 2 === 0 ? 'rgba(25, 25, 28, 0.8)' : 'rgba(32, 32, 36, 0.8)' }}
                        >
                          <td className="py-2 px-3">{row.component}</td>
                          <td className="py-2 px-3">{row.requirement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI */}
            <div className="space-y-6">
              {/* Patch Downloads — chỉ header */}
              <div className="rounded border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div style={SECTION_HEADER_STYLE}>Patch Downloads</div>
                <div className="p-4 bg-black/20 min-h-[60px] flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Chưa có bản patch</p>
                </div>
              </div>

              {/* Drivers — logo NVIDIA, AMD, Intel */}
              <div className="rounded border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div style={SECTION_HEADER_STYLE}>Drivers</div>
                <div className="p-6 bg-black/20 flex flex-wrap items-center justify-center gap-6">
                  <a
                    href="https://www.nvidia.com/Download/index.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-20 h-14 rounded font-bold text-white text-xs transition-opacity hover:opacity-100 opacity-90"
                    style={{ background: '#76B900' }}
                    title="NVIDIA Drivers"
                  >
                    NVIDIA
                  </a>
                  <a
                    href="https://www.amd.com/en/support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-20 h-14 rounded font-bold text-white text-xs transition-opacity hover:opacity-100 opacity-90"
                    style={{ background: '#ED1C24' }}
                    title="AMD Drivers"
                  >
                    AMD
                  </a>
                  <a
                    href="https://www.intel.com/content/www/us/en/download/785598/intel-graphics-windows-dch-drivers.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-20 h-14 rounded font-bold text-white text-xs transition-opacity hover:opacity-100 opacity-90"
                    style={{ background: '#0071C5' }}
                    title="Intel Graphics Drivers"
                  >
                    Intel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
