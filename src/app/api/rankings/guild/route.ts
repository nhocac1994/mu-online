import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/config/backend.config';
import { securityMiddleware } from '@/lib/security-middleware';
import { RANKING_GUILD_FALLBACK } from '@/lib/ranking-fallback-data';

function fallbackResponse() {
  return NextResponse.json({
    success: true,
    data: RANKING_GUILD_FALLBACK,
    message: 'Dữ liệu mẫu (backend ranking chưa kết nối được).',
  });
}

export async function GET(request: NextRequest) {
  try {
    let securityCheck: Awaited<ReturnType<typeof securityMiddleware>>;
    try {
      securityCheck = await securityMiddleware(request, '/api/rankings/guild');
    } catch (mwErr) {
      console.error('Rankings guild securityMiddleware:', mwErr);
      return fallbackResponse();
    }
    if (securityCheck && !securityCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: securityCheck.error || 'Request không hợp lệ',
        },
        { status: securityCheck.statusCode || 400 }
      );
    }

    const backendResponse = await fetch(getBackendUrl('/api/rankings/guild'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text().catch(() => '');
      console.warn('Ranking guild backend:', backendResponse.status, errorText);
      return fallbackResponse();
    }

    let backendData: { success?: boolean; data?: unknown; message?: string };
    try {
      backendData = await backendResponse.json();
    } catch {
      return fallbackResponse();
    }

    if (backendData.success && Array.isArray(backendData.data)) {
      const transformedData = backendData.data.map((guild: any) => ({
        guildName: guild.G_Name || guild.guildName,
        score: guild.G_Score || guild.score || 0,
        guildMaster: guild.G_Master || guild.guildMaster || 'Unknown',
        memberCount: guild.G_Count || guild.memberCount || 0,
        guildMark: guild.G_Mark || guild.guildMark,
      }));

      return NextResponse.json({
        success: true,
        data: transformedData,
        message: 'Lấy danh sách guild ranking thành công!',
      });
    }

    return fallbackResponse();
  } catch (error) {
    console.error('Guild ranking error:', error);
    return fallbackResponse();
  }
}
