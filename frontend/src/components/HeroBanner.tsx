'use client';

import React, { useState, useEffect } from 'react';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, type SiteConfig } from '@/lib/config-api';

const LOGO_VERSION = '20260622';

/** Logo + tên game — nằm chung trong khối nội dung trang chủ */
export default function HomeLogoHeader() {
  const [config, setConfig] = useState<SiteConfig>(siteConfigStatic as unknown as SiteConfig);

  useEffect(() => {
    getSiteConfig().then((c) => { if (c) setConfig({ ...siteConfigStatic, ...c } as SiteConfig); });
  }, []);

  const serverName = config?.serverName || config?.nameGame || 'Mu Online';
  const gameTitle = config?.gameTitle || 'Mu Online Season 1';
  const logoSrc = `/NAME.PNG?v=${LOGO_VERSION}`;

  return (
    <div className="we-home-head">
      <img
        src={logoSrc}
        alt={serverName}
        className="we-home-logo"
        width={220}
        height={220}
        loading="eager"
        decoding="async"
      />
      <p className="we-home-subtitle">{gameTitle}</p>
    </div>
  );
}
