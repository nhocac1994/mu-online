import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/config/backend.config';

/** Chỉ proxy các path config backend — tránh open proxy */
const ALLOWED_REMOTE_PATHS = new Set([
  'config',
  'config/download',
  'config/events',
  'config/social',
  'config/bank',
  'config/server',
]);

/**
 * GET /api/remote/config[...] → backend GET /api/config[...]
 * Trình duyệt gọi cùng origin; URL backend thật chỉ dùng trên server (đọc .env.local đúng).
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path: segments = [] } = await context.params;
  const normalized = segments.join('/');
  if (!normalized || !ALLOWED_REMOTE_PATHS.has(normalized)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  const backendUrl = getBackendUrl(`/api/${normalized}`);

  try {
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    const text = await backendResponse.text();
    return new NextResponse(text, {
      status: backendResponse.status,
      headers: {
        'Content-Type': backendResponse.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (e) {
    console.error('[api/remote] Proxy failed:', backendUrl, e);
    return NextResponse.json(
      { success: false, message: 'Không kết nối được backend' },
      { status: 502 }
    );
  }
}
