import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/config/backend.config';
import { getClientIP } from '@/lib/utils';
import { securityMiddleware, validateAccountIdWithLogging } from '@/lib/security-middleware';

export async function GET(request: NextRequest) {
  console.log('🔍 [NEXTJS API] /api/characters/search called');
  try {
    const clientIP = getClientIP(request);
    console.log(`🔍 [NEXTJS API] Client IP: ${clientIP}`);
    
    // ✅ Security: Kiểm tra bảo mật tổng quát
    const securityCheck = await securityMiddleware(request, '/api/characters/search');
    if (securityCheck && !securityCheck.allowed) {
      console.log(`🚨 [NEXTJS API] Security check failed: ${securityCheck.error}`);
      return NextResponse.json({ 
        success: false, 
        message: securityCheck.error || 'Request không hợp lệ' 
      }, { status: securityCheck.statusCode || 400 });
    }

    const { searchParams } = new URL(request.url);
    const characterName = searchParams.get('name');
    console.log(`🔍 [NEXTJS API] Search term: ${characterName}`);

    if (!characterName || !characterName.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Tên nhân vật không được để trống'
      }, { status: 400 });
    }

    // ✅ Security: Basic validation
    const trimmedName = characterName.trim();
    if (trimmedName.length > 10) {
      return NextResponse.json({
        success: false,
        message: 'Tên nhân vật quá dài'
      }, { status: 400 });
    }

    // Forward query parameter to backend
    const backendUrl = new URL(getBackendUrl('/api/rankings/search'));
    backendUrl.searchParams.set('name', trimmedName);
    console.log(`🔍 [NEXTJS API] Calling backend: ${backendUrl.toString()}`);
    
    // Gọi Backend API
    const backendResponse = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`🔍 [NEXTJS API] Backend response status: ${backendResponse.status}`);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`❌ [NEXTJS API] Backend API error: ${backendResponse.status}`, errorText);
      return NextResponse.json({
        success: false,
        message: `Lỗi từ backend API: ${backendResponse.status}`
      }, { status: backendResponse.status });
    }

    const backendData = await backendResponse.json();
    console.log(`🔍 [NEXTJS API] Backend data received:`, backendData.success ? `Success with ${backendData.data?.length || 0} results` : 'Failed');

    if (backendData.success) {
      // Transform data để match với format frontend
      const transformedData = backendData.data.map((char: any) => ({
        account: char.account || char.AccountID || '',
        character: char.character || char.Name || '',
        class: char.class ?? char.Class ?? 0,
        resets: char.resets ?? char.ResetCount ?? 0,
        level: char.level ?? char.cLevel ?? 0,
        pkcount: char.pkcount ?? char.PkCount ?? 0,
        isOnline: char.isOnline ?? char.IsOnline ?? 0
      }));

      console.log(`✅ [NEXTJS API] Returning ${transformedData.length} results`);
      return NextResponse.json({
        success: true,
        data: transformedData,
        message: backendData.message || `Tìm thấy ${transformedData.length} kết quả cho "${trimmedName}"`,
        isSearch: true
      });
    } else {
      console.log(`❌ [NEXTJS API] Backend returned error: ${backendData.message}`);
      return NextResponse.json({
        success: false,
        message: backendData.message || 'Lỗi khi tìm kiếm nhân vật'
      }, { status: backendResponse.status });
    }
    
  } catch (error) {
    console.error('💥 [NEXTJS API] Character search error:', error);
    return NextResponse.json({
      success: false,
      message: 'Lỗi kết nối đến server. Vui lòng thử lại sau.'
    }, { status: 500 });
  }
}
