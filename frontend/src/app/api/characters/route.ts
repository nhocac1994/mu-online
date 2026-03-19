import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/config/backend.config';
import { validateAccountId, detectSQLInjection, logSuspiciousActivity } from '@/lib/security';
import { getClientIP } from '@/lib/utils';
import { securityMiddleware, validateAccountIdWithLogging } from '@/lib/security-middleware';

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // ✅ Security: Kiểm tra bảo mật tổng quát
    const securityCheck = await securityMiddleware(request, '/api/characters');
    if (securityCheck && !securityCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        message: securityCheck.error || 'Request không hợp lệ' 
      }, { status: securityCheck.statusCode || 400 });
    }

    const accountId = request.nextUrl.searchParams.get('accountId');
    
    if (!accountId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Account ID không được cung cấp' 
      }, { status: 400 });
    }

    // ✅ Security: Validate accountId với logging tự động
    const accountIdValidation = validateAccountIdWithLogging(accountId, '/api/characters', clientIP);
    if (!accountIdValidation.valid) {
      return NextResponse.json({ 
        success: false, 
        message: accountIdValidation.error || 'Account ID không hợp lệ' 
      }, { status: 400 });
    }

    // Lấy JWT token từ header
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || 
                  request.headers.get('x-auth-token') || '';

    // Gọi Backend API
    const backendResponse = await fetch(getBackendUrl('/api/characters'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    const backendData = await backendResponse.json();

    if (backendData.success) {
      // Map class names
      const getClassName = (classId: number) => {
        const classMap: { [key: number]: string } = {
          0: 'Dark Wizard',
          1: 'Soul Master',
          2: 'Grand Master',
          3: 'Dark Knight',
          4: 'Blade Knight',
          5: 'Blade Master',
          6: 'Fairy Elf',
          7: 'Muse Elf',
          8: 'High Elf',
          16: 'Magic Gladiator',
          17: 'Dark Lord',
          32: 'Summoner',
          33: 'Bloody Summoner',
          34: 'Dimension Master',
          48: 'Rage Fighter',
          50: 'Fist Master',
          64: 'Grow Lancer',
          65: 'Mirage Lancer',
          66: 'Shining Lancer'
        };
        return classMap[classId] || `Unknown (${classId})`;
      };

      // Format characters data
      const formattedCharacters = backendData.data.map((char: any) => ({
        name: char.Name,
        level: char.cLevel,
        class: char.Class,
        className: getClassName(char.Class),
        resetCount: char.ResetCount,
        masterResetCount: char.MasterResetCount,
        stats: {
          strength: char.Strength,
          dexterity: char.Dexterity,
          vitality: char.Vitality,
          energy: char.Energy,
          leadership: char.Leadership
        },
        life: char.Life,
        maxLife: char.MaxLife,
        mana: char.Mana,
        maxMana: char.MaxMana,
        money: char.Money,
        mapNumber: char.MapNumber,
        mapPosX: char.MapPosX,
        mapPosY: char.MapPosY,
        pkCount: char.PKCount,
        pkLevel: char.PKLevel
      }));

      return NextResponse.json({
        success: true,
        data: {
          characters: formattedCharacters,
          totalCharacters: formattedCharacters.length
        }
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: backendData.message || 'Lỗi khi lấy danh sách characters' 
      }, { status: backendResponse.status });
    }

  } catch (error) {
    console.error('Error fetching characters:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Lỗi kết nối đến server. Vui lòng thử lại sau.' 
    }, { status: 500 });
  }
}
