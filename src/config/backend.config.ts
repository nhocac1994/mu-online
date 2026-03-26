// Backend API Configuration
// URL của Backend API Server — đặt trong .env.local: NEXT_PUBLIC_BACKEND_API_URL=...
// Sau khi sửa .env.local phải dừng và chạy lại `npm run dev` (Next.js nhúng NEXT_PUBLIC_* lúc build/start).
const DEFAULT_BACKEND_URL = 'http://14.225.206.163:55999';

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

/**
 * Luôn đọc lại env mỗi lần (tránh bundle client cũ giữ URL backend sai).
 * next.config.ts cũng set env.NEXT_PUBLIC_BACKEND_API_URL mặc định khi thiếu .env.local.
 */
function resolveBackendBase(): string {
  const raw =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_API_URL
      ? String(process.env.NEXT_PUBLIC_BACKEND_API_URL).trim()
      : '';
  // Bundle/shell cũ hay còn IP VPS không dùng nữa → ép về mặc định mới
  if (raw && raw.includes('14.225.208.182')) {
    return normalizeBaseUrl(DEFAULT_BACKEND_URL);
  }
  if (raw) return normalizeBaseUrl(raw);
  // Không fallback localhost:3001 trên trình duyệt — trước đây làm trống env vẫn trỏ nhầm API local.
  // Muốn backend chạy máy bạn: ghi rõ trong .env.local NEXT_PUBLIC_BACKEND_API_URL=http://localhost:PORT
  return normalizeBaseUrl(DEFAULT_BACKEND_URL);
}

/** @deprecated Dùng getBackendUrl() — giá trị này chỉ phản ánh lúc module load */
export const BACKEND_API_URL = resolveBackendBase();

/** Base URL backend (không có path) — dùng cho client kiểu `base + '/api/...'` */
export function getBackendBaseUrl(): string {
  return normalizeBaseUrl(resolveBackendBase());
}

/**
 * Lấy URL đầy đủ cho backend API endpoint
 * @param endpoint - API endpoint (ví dụ: '/api/auth/login')
 * @returns URL đầy đủ
 */
export const getBackendUrl = (endpoint: string): string => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const base = normalizeBaseUrl(resolveBackendBase());
  return `${base}${normalizedEndpoint}`;
};

/**
 * Helper function để gọi backend API với error handling
 */
export const callBackendAPI = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = getBackendUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};

