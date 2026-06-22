import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware } from '@/lib/security-middleware';
import { fetchRankingFromBackend, getRankingFallback } from '@/lib/ranking-api';

function fallbackResponse() {
  return NextResponse.json({
    success: true,
    data: getRankingFallback('level'),
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
        message: securityCheck.error || 'Request không hợp lệ',
      }, { status: securityCheck.statusCode || 400 });
    }

    const result = await fetchRankingFromBackend('level');
    const transformedData = (
      result.data as Array<{
        account: string;
        character: string;
        class: number;
        score: number;
        level?: number | null;
        isOnline?: number | boolean;
      }>
    ).map((char) => ({
      account: char.account,
      character: char.character,
      class: char.class,
      resets: char.score,
      level: char.level ?? 0,
      isOnline: char.isOnline ?? 0,
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedData,
        message: result.message,
        meta: result.meta,
      },
      { headers: { 'Cache-Control': 'public, s-maxage=90, stale-while-revalidate=180' } }
    );
  } catch (error) {
    console.error('Ranking error:', error);
    return fallbackResponse();
  }
}
