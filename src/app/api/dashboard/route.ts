import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/config/backend.config';
import { validateAccountId, detectSQLInjection, logSuspiciousActivity } from '@/lib/security';
import { getClientIP } from '@/lib/utils';
import { securityMiddleware, validateAccountIdWithLogging } from '@/lib/security-middleware';

// Helper functions for account level
function getAccountLevelName(level: number): string {
  switch (level) {
    case 1: return 'Đồng';
    case 2: return 'Bạc';
    case 3: return 'Vàng';
    default: return 'Thường';
  }
}

function getAccountLevelColor(level: number): string {
  switch (level) {
    case 1: return '#CD7F32'; // Bronze/Đồng
    case 2: return '#C0C0C0'; // Silver/Bạc
    case 3: return '#FFD700'; // Gold/Vàng
    default: return '#808080'; // Gray/Thường
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // ✅ Security: Kiểm tra bảo mật tổng quát
    const securityCheck = await securityMiddleware(request, '/api/dashboard');
    if (securityCheck && !securityCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        message: securityCheck.error || 'Request không hợp lệ' 
      }, { status: securityCheck.statusCode || 400 });
    }

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token không hợp lệ' }, { status: 401 });
    }

    // Lấy thông tin user từ request headers hoặc từ token
    const accountId = request.nextUrl.searchParams.get('accountId') || 
                     request.headers.get('x-user-account');
    
    if (!accountId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Account ID không được cung cấp' 
      }, { status: 400 });
    }

    // ✅ Security: Validate accountId với logging tự động
    const accountIdValidation = validateAccountIdWithLogging(accountId, '/api/dashboard', clientIP);
    if (!accountIdValidation.valid) {
      return NextResponse.json({ 
        success: false, 
        message: accountIdValidation.error || 'Account ID không hợp lệ' 
      }, { status: 400 });
    }

    // Tài khoản test: trả về dữ liệu mẫu không cần backend
    if (accountId === 'adminsse') {
      const sampleData = {
        account: {
          id: accountId,
          characterCount: 1,
          level: 1,
          levelName: 'Đồng',
          levelColor: '#CD7F32',
          expireDate: '2079-06-06',
          isExpired: false,
        },
        character: {
          name: 'AdminChar',
          level: 400,
          experience: 8500000,
          nextLevelExp: 16000000,
          expProgress: 53,
          class: 50,
          strength: 1200,
          dexterity: 800,
          vitality: 1000,
          energy: 600,
          leadership: 400,
          money: 5000000,
          life: 4500,
          maxLife: 5000,
          mana: 2000,
          maxMana: 2500,
          mapNumber: 0,
          mapPosX: 130,
          mapPosY: 130,
          pkCount: 0,
          pkLevel: 3,
          resetCount: 15,
          masterResetCount: 2,
          isOnline: false,
        },
        reset: {
          dailyReset: 1,
          weeklyReset: 1,
          monthlyReset: 1,
          lastDailyReset: '2026-03-15',
          lastWeeklyReset: '2026-03-10',
          lastMonthlyReset: '2026-03-01',
          masterDailyReset: 0,
          masterWeeklyReset: 0,
          masterMonthlyReset: 0,
          lastMasterDailyReset: '',
          lastMasterWeeklyReset: '',
          lastMasterMonthlyReset: '',
          totalResetCount: 15,
          totalMasterResetCount: 2,
        },
        warehouse: { money: 1000000 },
        guild: { name: 'MuLegends', master: 'adminsse', score: 5000, memberCount: 5 },
      };
      return NextResponse.json({ success: true, data: sampleData });
    }

    const backendUrl = new URL(getBackendUrl('/api/dashboard'));
    backendUrl.searchParams.set('accountId', accountId);

    const backendResponse = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const backendData = await backendResponse.json();

    if (backendData.success) {
      // Transform data để match với format cũ
      const character = backendData.data.character;
      const account = backendData.data.account;

      // Helper functions
      const getAccountLevelName = (level: number): string => {
        switch (level) {
          case 1: return 'Đồng';
          case 2: return 'Bạc';
          case 3: return 'Vàng';
          default: return 'Thường';
        }
      };

      const getAccountLevelColor = (level: number): string => {
        switch (level) {
          case 1: return '#CD7F32';
          case 2: return '#C0C0C0';
          case 3: return '#FFD700';
          default: return '#808080';
        }
      };

      // Tính toán thông tin bổ sung
      const currentExp = character?.Experience || 0;
      const currentLevel = character?.cLevel || 1;
      const nextLevelExp = Math.floor(Math.pow(currentLevel, 2) * 100);
      const expProgress = Math.min((currentExp / nextLevelExp) * 100, 100);

      const responseData = {
        success: true,
        data: {
          account: {
            id: accountId,
            characterCount: 1, // Backend có thể không trả về, dùng default
            level: account?.AccountLevel || 0,
            levelName: getAccountLevelName(account?.AccountLevel || 0),
            levelColor: getAccountLevelColor(account?.AccountLevel || 0),
            expireDate: account?.AccountExpireDate,
            isExpired: account?.AccountExpireDate ? new Date(account.AccountExpireDate) < new Date() : false
          },
          character: {
            name: character?.Name || 'Chưa có',
            level: character?.cLevel || 1,
            experience: currentExp,
            nextLevelExp: nextLevelExp,
            expProgress: expProgress,
            class: character?.Class || 0,
            strength: character?.Strength || 0,
            dexterity: character?.Dexterity || 0,
            vitality: character?.Vitality || 0,
            energy: character?.Energy || 0,
            leadership: character?.Leadership || 0,
            money: character?.Money || 0,
            life: character?.Life || 0,
            maxLife: character?.MaxLife || 0,
            mana: character?.Mana || 0,
            maxMana: character?.MaxMana || 0,
            mapNumber: character?.MapNumber || 0,
            mapPosX: character?.MapPosX || 0,
            mapPosY: character?.MapPosY || 0,
            pkCount: character?.PkCount || 0,
            pkLevel: character?.PkLevel || 0,
            resetCount: character?.ResetCount || 0,
            masterResetCount: character?.MasterResetCount || 0
          },
          reset: {
            totalResetCount: character?.ResetCount || 0,
            totalMasterResetCount: character?.MasterResetCount || 0
          },
          warehouse: {
            money: 0 // Backend có thể không trả về
          },
          guild: null // Backend có thể không trả về
        }
      };

      return NextResponse.json(responseData);
    } else {
      return NextResponse.json({ 
        success: false, 
        message: backendData.message || 'Lỗi khi lấy thông tin dashboard'
      }, { status: backendResponse.status });
    }

  } catch (error) {
    console.error('Dashboard API error:', error);
    
    return NextResponse.json({ 
      success: false, 
      message: 'Lỗi kết nối đến server. Vui lòng thử lại sau.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
