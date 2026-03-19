import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/config/backend.config';
import { securityMiddleware } from '@/lib/security-middleware';

export async function GET(request: NextRequest) {
  try {
    // ✅ Security: Kiểm tra bảo mật tổng quát
    const securityCheck = await securityMiddleware(request, '/api/rankings/guild');
    if (securityCheck && !securityCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        message: securityCheck.error || 'Request không hợp lệ' 
      }, { status: securityCheck.statusCode || 400 });
    }

    // Gọi Backend API
    const backendResponse = await fetch(getBackendUrl('/api/rankings/guild'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const backendData = await backendResponse.json();

    if (backendData.success) {
      // Transform data để match với format cũ nếu cần
      const transformedData = backendData.data.map((guild: any) => ({
        guildName: guild.G_Name || guild.guildName,
        score: guild.G_Score || guild.score || 0,
        guildMaster: guild.G_Master || guild.guildMaster || 'Unknown',
        memberCount: guild.G_Count || guild.memberCount || 0,
        guildMark: guild.G_Mark || guild.guildMark
      }));

      return NextResponse.json({
        success: true,
        data: transformedData,
        message: 'Lấy danh sách guild ranking thành công!'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: backendData.message || 'Lỗi khi lấy danh sách guild ranking'
      }, { status: backendResponse.status });
    }
    
  } catch (error) {
    console.error('Guild ranking error:', error);
    return NextResponse.json({
      success: false,
      message: 'Lỗi kết nối đến server. Vui lòng thử lại sau.'
    }, { status: 500 });
  }
}
