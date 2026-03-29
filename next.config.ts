import fs from "fs";
import path from "path";
import type { NextConfig } from "next";

/** Mặc định khi chưa set .env — đồng bộ với src/config/backend.config.ts */
const DEFAULT_PUBLIC_BACKEND_API_URL = "http://14.225.206.163:55999";

/**
 * Đọc NEXT_PUBLIC_BACKEND_API_URL trực tiếp từ file .env* trong project.
 * Lý do: nếu biến đã tồn tại trong shell/IDE (export ...), dotenv sẽ KHÔNG ghi đè
 * → .env.local đúng URL nhưng app vẫn dùng IP cũ (vd 14.225.208.182:56666).
 */
function parseEnvFileValue(content: string, key: string): string {
  for (const line of content.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const m = t.match(new RegExp(`^${key}=(.*)$`));
    if (!m) continue;
    let v = m[1].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    return v;
  }
  return "";
}

function readBackendUrlFromEnvFiles(cwd: string): string {
  const names = [".env.local", ".env.development.local", ".env.development", ".env"];
  for (const name of names) {
    try {
      const p = path.join(cwd, name);
      if (!fs.existsSync(p)) continue;
      const v = parseEnvFileValue(fs.readFileSync(p, "utf8"), "NEXT_PUBLIC_BACKEND_API_URL");
      if (v) return v;
    } catch {
      /* bỏ qua */
    }
  }
  return "";
}

function sanitizeBackendUrl(url: string): string {
  const u = url.trim();
  if (u.includes("14.225.208.182")) return DEFAULT_PUBLIC_BACKEND_API_URL;
  return u;
}

const resolvedPublicBackendUrl = sanitizeBackendUrl(
  readBackendUrlFromEnvFiles(process.cwd()).trim() ||
    (process.env.NEXT_PUBLIC_BACKEND_API_URL || "").trim() ||
    DEFAULT_PUBLIC_BACKEND_API_URL
);

// Đồng bộ cho API routes / server — tránh shell export che .env.local
process.env.NEXT_PUBLIC_BACKEND_API_URL = resolvedPublicBackendUrl;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_API_URL: resolvedPublicBackendUrl,
  },
  images: {
    /** Cho phép ảnh trong public/ kèm ?v=... (cache bust). Không khai báo search → mọi query đều hợp lệ. */
    localPatterns: [{ pathname: '/**' }],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.vietqr.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Cache control headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Static assets có thể cache lâu hơn nhưng vẫn check version
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API routes không cache
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
