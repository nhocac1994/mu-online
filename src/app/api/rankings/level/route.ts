import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/config/backend.config';
import { securityMiddleware } from '@/lib/security-middleware';
import { RANKING_LEVEL_FALLBACK } from '@/lib/ranking-fallback-data';

function fallbackResponse() {
  return NextResponse.json({
    success: true,
    data: RANKING_LEVEL_FALLBACK,
    message: 'Dữ liệu mẫu (backend ranking chưa kết nối được).',
  });
}

export async function GET(request: NextRequest) {
  try {
    let securityCheck: Awaited<ReturnType<typeof securityMiddleware>>;
    try {
      securityCheck = await securityMiddleware(request, '/api/rankings/level');
    } catch (mwErr) {
      console.error('Rankings level securityMiddleware:', mwErr);
      return fallbackResponse();
    }
    if (securityCheck && !securityCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        message: securityCheck.error || 'Request không hợp lệ' 
      }, { status: securityCheck.statusCode || 400 });
    }

    // Gọi Backend API
    const backendResponse = await fetch(getBackendUrl('/api/rankings/level'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text().catch(() => '');
      console.warn('Ranking level backend:', backendResponse.status, errorText);
      return fallbackResponse();
    }

    let backendData: { success?: boolean; data?: unknown; message?: string };
    try {
      backendData = await backendResponse.json();
    } catch {
      return fallbackResponse();
    }

    if (backendData.success && Array.isArray(backendData.data)) {
      const transformedData = backendData.data.map((char: any) => ({
        account: char.AccountID || char.account || '',
        character: char.Name || char.character || '',
        class: char.Class ?? char.class ?? 0,
        resets: char.ResetCount ?? char.resets ?? 0,
        level: char.cLevel ?? char.level ?? 0,
        isOnline: char.IsOnline ?? char.isOnline ?? 0,
      }));

      return NextResponse.json({
        success: true,
        data: transformedData,
        message: 'Lấy danh sách ranking thành công!',
      });
    }

    return fallbackResponse();
  } catch (error) {
    console.error('Ranking error:', error);
    return fallbackResponse();
  }
}
