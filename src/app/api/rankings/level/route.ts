import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/config/backend.config';
import { securityMiddleware } from '@/lib/security-middleware';

export async function GET(request: NextRequest) {
  try {
    // ✅ Security: Kiểm tra bảo mật tổng quát
    const securityCheck = await securityMiddleware(request, '/api/rankings/level');
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
      const errorText = await backendResponse.text();
      console.error('Backend API error:', backendResponse.status, errorText);
      return NextResponse.json({
        success: false,
        message: `Lỗi từ backend API: ${backendResponse.status}`
      }, { status: backendResponse.status });
    }

    const backendData = await backendResponse.json();

    if (backendData.success) {
      // Transform data để match với format frontend cần
          const transformedData = backendData.data.map((char: any) => ({
            account: char.AccountID || char.account || '',
            character: char.Name || char.character || '',
            class: char.Class ?? char.class ?? 0,
            resets: char.ResetCount ?? char.resets ?? 0,
            level: char.cLevel ?? char.level ?? 0,
            isOnline: char.IsOnline ?? char.isOnline ?? 0
          }));

      return NextResponse.json({
        success: true,
        data: transformedData,
        message: 'Lấy danh sách ranking thành công!'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: backendData.message || 'Lỗi khi lấy danh sách ranking'
      }, { status: backendResponse.status });
    }
    
  } catch (error) {
    console.error('Ranking error:', error);
    return NextResponse.json({
      success: false,
      message: 'Lỗi kết nối đến server. Vui lòng thử lại sau.'
    }, { status: 500 });
  }
}
