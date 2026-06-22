import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import sql from 'mssql';
import { validateAccountId, validatePassword, detectSQLInjection, logSuspiciousActivity } from '@/lib/security';
import { getClientIP } from '@/lib/utils';
import { securityMiddleware } from '@/lib/security-middleware';

export async function PUT(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // ✅ Security: Kiểm tra bảo mật tổng quát
    const securityCheck = await securityMiddleware(request, '/api/account/password');
    if (securityCheck && !securityCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        message: securityCheck.error || 'Request không hợp lệ' 
      }, { status: securityCheck.statusCode || 400 });
    }

    const body = await request.json();
    const { accountId, currentPassword, newPassword } = body;
    
    console.log('Password change request:', { accountId, hasCurrentPassword: !!currentPassword, hasNewPassword: !!newPassword });
    
    if (!accountId || !newPassword) {
      return NextResponse.json({ 
        success: false, 
        message: 'Thiếu thông tin bắt buộc (accountId hoặc newPassword)' 
      }, { status: 400 });
    }

    // ✅ Security: Validate accountId
    const accountIdValidation = validateAccountId(accountId);
    if (!accountIdValidation.valid) {
      logSuspiciousActivity(clientIP, '/api/account/password', accountId, 'Invalid account ID format');
      return NextResponse.json({ 
        success: false, 
        message: accountIdValidation.error || 'Account ID không hợp lệ' 
      }, { status: 400 });
    }

    // ✅ Security: Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      logSuspiciousActivity(clientIP, '/api/account/password', '***', 'Invalid password format');
      return NextResponse.json({ 
        success: false, 
        message: passwordValidation.error || 'Mật khẩu mới không hợp lệ' 
      }, { status: 400 });
    }

    // ✅ Security: Detect SQL injection
    if (detectSQLInjection(accountId) || detectSQLInjection(newPassword) || (currentPassword && detectSQLInjection(currentPassword))) {
      logSuspiciousActivity(clientIP, '/api/account/password', accountId, 'SQL Injection attempt detected');
      return NextResponse.json({ 
        success: false, 
        message: 'Input không hợp lệ' 
      }, { status: 400 });
    }

    const pool = await connectToDatabase();
    
    // Kiểm tra mật khẩu hiện tại
    const checkPasswordQuery = `
      SELECT memb__pwd FROM MEMB_INFO WHERE memb___id = @accountId
    `;
    
    const checkResult = await pool.request()
      .input('accountId', sql.VarChar(10), accountId)
      .query(checkPasswordQuery);
    
    if (checkResult.recordset.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Tài khoản không tồn tại' 
      }, { status: 404 });
    }

    const storedPassword = checkResult.recordset[0].memb__pwd;
    
    // So sánh mật khẩu hiện tại (xử lý trường hợp null/empty)
    const storedPwd = storedPassword || '';
    const currentPwd = currentPassword || '';
    
    if (currentPassword && storedPwd !== currentPwd) {
      return NextResponse.json({ 
        success: false, 
        message: 'Mật khẩu hiện tại không đúng' 
      }, { status: 400 });
    }

    // Cập nhật mật khẩu mới
    const updatePasswordQuery = `
      UPDATE MEMB_INFO 
      SET memb__pwd = @newPassword
      WHERE memb___id = @accountId
    `;

    const updateResult = await pool.request()
      .input('accountId', sql.VarChar(10), accountId)
      .input('newPassword', sql.VarChar(20), newPassword)
      .query(updatePasswordQuery);
    
    console.log('Password updated successfully for account:', accountId);

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });

  } catch (error: any) {
    console.error('Error changing password:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      number: error?.number,
      state: error?.state
    });
    
    return NextResponse.json({ 
      success: false, 
      message: error?.message || 'Lỗi khi đổi mật khẩu. Vui lòng thử lại.' 
    }, { status: 500 });
  }
}
