'use client';

import React from 'react';
import Image from 'next/image';

export interface SocialLinks {
  facebook?: string;
  youtube?: string;
  zalo?: string;
  discord?: string;
  tiktok?: string;
}

const cardHead = 'panel-card-head font-display';
const cardShellGlow = 'panel-card panel-card-glow';

type SocialItem = {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  accent: string;
};

function DiscordIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 12.573 12.573 0 0 0-.608 1.25 18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

function buildItems(links: SocialLinks): SocialItem[] {
  const items: SocialItem[] = [];
  if (links.zalo?.trim()) {
    items.push({
      id: 'zalo',
      label: 'Zalo',
      href: links.zalo,
      accent: '#0068FF',
      icon: <Image src="/Zalo-icon.webp" alt="" width={22} height={22} className="rounded-sm" />,
    });
  }
  if (links.facebook?.trim()) {
    items.push({
      id: 'facebook',
      label: 'Facebook',
      href: links.facebook,
      accent: '#1877F2',
      icon: <Image src="/facebook-logo.webp" alt="" width={22} height={22} className="rounded-sm" />,
    });
  }
  if (links.youtube?.trim()) {
    items.push({
      id: 'youtube',
      label: 'YouTube',
      href: links.youtube,
      accent: '#FF0000',
      icon: <Image src="/youtube-logo.webp" alt="" width={22} height={22} className="rounded-sm" />,
    });
  }
  if (links.discord?.trim()) {
    items.push({
      id: 'discord',
      label: 'Discord',
      href: links.discord,
      accent: '#5865F2',
      icon: <DiscordIcon />,
    });
  }
  if (links.tiktok?.trim()) {
    items.push({
      id: 'tiktok',
      label: 'TikTok',
      href: links.tiktok,
      accent: '#EE1D52',
      icon: <TikTokIcon />,
    });
  }
  return items;
}

export default function SocialMediaPanel({ links }: { links: SocialLinks }) {
  const items = buildItems(links);
  if (items.length === 0) return null;

  return (
    <div className={cardShellGlow}>
      <div className={cardHead}>Mạng xã hội</div>
      <div className="p-3 sm:p-3.5">
        <p className="mb-3 text-[11px] leading-relaxed text-zinc-300 sm:text-xs">
          Tham gia cộng đồng — cập nhật sự kiện, hỗ trợ nhanh &amp; tin tức mới nhất.
        </p>
        <ul className="space-y-0">
          {items.map((item, index) => (
            <li key={item.id} className={index < items.length - 1 ? 'border-b border-white/10' : ''}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 py-2.5 transition hover:bg-purple-950/35 -mx-1 px-1 rounded-lg"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/40"
                  style={{ color: item.accent }}
                >
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-zinc-50 group-hover:text-purple-100">
                    {item.label}
                  </span>
                  <span className="block truncate text-[10px] text-zinc-500 group-hover:text-zinc-400">
                    Nhấn để tham gia →
                  </span>
                </span>
                <span className="shrink-0 text-zinc-600 transition group-hover:text-purple-400" aria-hidden>
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
