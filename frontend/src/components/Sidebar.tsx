'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, type SiteConfig } from '@/lib/config-api';

interface PlayerRow {
  character: string;
  class: number;
  score?: number;
  level?: number | null;
}

const CLASS_SHORT: Record<number, string> = {
  0: 'DW', 1: 'SM', 2: 'GM', 16: 'DK', 17: 'BK', 18: 'BM',
  32: 'FE', 33: 'ME', 34: 'HE', 48: 'MG', 50: 'DL', 64: 'DL',
  65: 'BS', 66: 'DM', 80: 'RF', 81: 'FM',
};

export default function Sidebar() {
  const [config, setConfig] = useState<SiteConfig>(siteConfigStatic as unknown as SiteConfig);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [topPlayers, setTopPlayers] = useState<PlayerRow[]>([]);
  const [rankLoading, setRankLoading] = useState(true);

  useEffect(() => {
    getSiteConfig().then((c) => { if (c) setConfig({ ...siteConfigStatic, ...c } as SiteConfig); });
  }, []);

  useEffect(() => {
    fetch('/api/rankings/level')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTopPlayers(
            data.data.slice(0, 10).map((c: Record<string, unknown>) => ({
              character: String(c.character ?? c.Name ?? ''),
              class: Number(c.class ?? c.Class ?? 0),
              score: Number(c.score ?? c.Score ?? c.resets ?? 0),
              level: c.level != null ? Number(c.level) : c.cLevel != null ? Number(c.cLevel) : null,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setRankLoading(false));
  }, []);

  const cfg = config;
  const serverName = cfg?.serverName || cfg?.nameGame || 'Mu Online';
  const phone = cfg?.phone || 'Hotline';
  const zaloLink = cfg?.linkZalo || cfg?.socialMedia?.zalo || '#';
  const expRate = cfg?.serverInfo?.expRate || 'x100';
  const dropRate = cfg?.serverInfo?.dropRate || '50%';
  const version = cfg?.serverInfo?.version || cfg?.serverVersion || 'Season 1';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
    setLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await res.json();
      if (result.success) {
        if (result.data?.token) localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user_data', JSON.stringify(result.data || {}));
        window.location.href = '/dashboard';
      } else {
        setLoginError(result.message || 'Đăng nhập thất bại');
      }
    } catch {
      setLoginError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <aside className="we-sidebar-col">
      {/* Đăng nhập tài khoản */}
      <div className="we-box">
        <div className="we-box-head">
          Đăng nhập tài khoản
          <Link href="/login" className="we-box-head-link">Quên mật khẩu?</Link>
        </div>
        <div className="we-box-body">
          <form onSubmit={handleLogin}>
            <input
              type="text"
              className="we-input"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <input
              type="password"
              className="we-input"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {loginError && (
              <p style={{ color: '#cc0000', fontSize: 12, marginBottom: 8 }}>{loginError}</p>
            )}
            <button type="submit" className="we-btn we-btn-block" disabled={loggingIn}>
              {loggingIn ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>

      {/* Zalo Groups */}
      <div className="we-box">
        <div className="we-box-head">Nhóm Zalo</div>
        <div className="we-box-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
          <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="we-zalo-item">
            <Image src="/Zalo-icon.webp" alt="Zalo" width={28} height={28} className="we-zalo-icon" />
            THẢO LUẬN - {serverName.toUpperCase()}
          </a>
          <a href={zaloLink} target="_blank" rel="noopener noreferrer" className="we-zalo-item">
            <Image src="/Zalo-icon.webp" alt="Zalo" width={28} height={28} className="we-zalo-icon" />
            MUA BÁN - {serverName.toUpperCase()}
          </a>
        </div>
      </div>

      {/* Admin Support + banner đăng ký / tải game */}
      <div className="we-box">
        <div className="we-box-head">Hỗ Trợ Admin</div>
        <div className="we-box-body">
          <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 12px' }}>
            HOTLINE: {phone}
          </p>
          <Link href="/register" className="we-banner-link">
            <Image
              src="/DANG-KY.PNG"
              alt="Đăng ký tài khoản"
              width={343}
              height={125}
              unoptimized
            />
          </Link>
          <Link href="/download" className="we-banner-link">
            <Image
              src="/TAI-GAME.PNG"
              alt="Tải game"
              width={343}
              height={125}
              unoptimized
            />
          </Link>
        </div>
      </div>

      {/* Thông tin server */}
      <div className="we-box">
        <div className="we-box-head">Thông tin Server</div>
        <div className="we-box-body">
          <table className="we-info-table">
            <tbody>
              <tr>
                <td>Phiên bản</td>
                <td className="we-val-orange">{version}</td>
              </tr>
              <tr>
                <td>Kinh nghiệm</td>
                <td className="we-val-blue">{expRate}</td>
              </tr>
              <tr>
                <td>Tỷ lệ rơi đồ</td>
                <td>{dropRate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Reset */}
      <div className="we-box">
        <div className="we-box-head">
          Top Reset
          <Link href="/rankings" style={{ fontSize: 18, color: '#cc0000', textDecoration: 'none' }}>+</Link>
        </div>
        <div className="we-box-body">
          {rankLoading ? (
            <div className="we-loading-center"><div className="we-spinner" /></div>
          ) : topPlayers.length === 0 ? (
            <p style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>Chưa có dữ liệu</p>
          ) : (
            <table className="we-mini-rank">
              <thead>
                <tr>
                  <th>Nhân vật</th>
                  <th style={{ textAlign: 'right' }}>Reset</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((p, i) => (
                  <tr key={`${p.character}-${i}`}>
                    <td>
                      <span className="we-class-badge" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                        {CLASS_SHORT[p.class] || '?'}
                      </span>
                      {p.character}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{p.score ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </aside>
  );
}
