import { NextResponse } from 'next/server';
import { getBackendUrl } from '@/config/backend.config';

/**
 * Test endpoint để kiểm tra kết nối với Backend API
 * GET /api/test-backend
 */
export async function GET() {
  try {
    const backendUrl = getBackendUrl('/health');
    
    console.log('Testing backend connection to:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Timeout sau 5 giây
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: `Backend returned status ${response.status}`,
        backendUrl,
      }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Kết nối backend thành công!',
      backendUrl,
      backendResponse: data,
    });
  } catch (error) {
    console.error('Backend connection error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Không thể kết nối đến backend',
      error: error instanceof Error ? error.message : 'Unknown error',
      backendUrl: getBackendUrl('/health'),
      hint: 'Kiểm tra: 1) Backend đang chạy trên VPS, 2) Firewall đã mở port 56666, 3) IP đúng trong .env.local',
    }, { status: 500 });
  }
}

