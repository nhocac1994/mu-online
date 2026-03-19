/**
 * Security utilities để bảo vệ chống SQL Injection và các tấn công khác
 */

/**
 * Validate Account ID để chống SQL injection
 * @param accountId - Account ID cần validate
 * @returns Object với valid (boolean) và error (string nếu có)
 */
export function validateAccountId(accountId: string | null | undefined): { valid: boolean; error?: string } {
  if (!accountId || accountId.length === 0) {
    return { valid: false, error: 'Account ID is required' };
  }
  
  if (accountId.length > 10) {
    return { valid: false, error: 'Account ID quá dài (tối đa 10 ký tự)' };
  }
  
  // Chỉ cho phép alphanumeric
  if (!/^[a-zA-Z0-9]+$/.test(accountId)) {
    return { valid: false, error: 'Account ID chỉ được chứa chữ cái và số' };
  }
  
  // Check SQL injection patterns
  const sqlPatterns = [
    "'", ";", "--", "/*", "*/", 
    "xp_", "sp_", "exec", "execute", 
    "union", "select", "insert", "update", 
    "delete", "drop", "create", "alter",
    "truncate", "grant", "revoke", "shutdown"
  ];
  
  const lowerAccountId = accountId.toLowerCase();
  for (const pattern of sqlPatterns) {
    if (lowerAccountId.includes(pattern)) {
      console.error('⚠️ SQL Injection attempt detected:', {
        accountId,
        pattern,
        timestamp: new Date().toISOString()
      });
      return { valid: false, error: 'Input không hợp lệ' };
    }
  }
  
  return { valid: true };
}

/**
 * Validate Character Name
 */
export function validateCharacterName(name: string | null | undefined): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Character name is required' };
  }
  
  if (name.length > 10) {
    return { valid: false, error: 'Character name quá dài (tối đa 10 ký tự)' };
  }
  
  // Cho phép alphanumeric và một số ký tự đặc biệt
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    return { valid: false, error: 'Character name chỉ được chứa chữ cái, số và dấu gạch dưới' };
  }
  
  // Check SQL injection
  const sqlPatterns = ["'", ";", "--", "/*", "*/", "xp_", "sp_", "exec"];
  const lowerName = name.toLowerCase();
  if (sqlPatterns.some(pattern => lowerName.includes(pattern))) {
    console.error('⚠️ SQL Injection attempt detected in character name:', name);
    return { valid: false, error: 'Input không hợp lệ' };
  }
  
  return { valid: true };
}

/**
 * Validate Password
 */
export function validatePassword(password: string | null | undefined): { valid: boolean; error?: string } {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { valid: false, error: 'Password phải có ít nhất 6 ký tự' };
  }
  
  if (password.length > 20) {
    return { valid: false, error: 'Password quá dài (tối đa 20 ký tự)' };
  }
  
  // Check SQL injection patterns
  const sqlPatterns = ["'", ";", "--", "/*", "*/"];
  if (sqlPatterns.some(pattern => password.includes(pattern))) {
    console.error('⚠️ SQL Injection attempt detected in password');
    return { valid: false, error: 'Password chứa ký tự không hợp lệ' };
  }
  
  return { valid: true };
}

/**
 * Validate Email
 */
export function validateEmail(email: string | null | undefined): { valid: boolean; error?: string } {
  if (!email || email.length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  
  if (email.length > 50) {
    return { valid: false, error: 'Email quá dài (tối đa 50 ký tự)' };
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Email không hợp lệ' };
  }
  
  // Check SQL injection
  const sqlPatterns = ["'", ";", "--", "/*", "*/"];
  if (sqlPatterns.some(pattern => email.includes(pattern))) {
    console.error('⚠️ SQL Injection attempt detected in email:', email);
    return { valid: false, error: 'Email chứa ký tự không hợp lệ' };
  }
  
  return { valid: true };
}

/**
 * Sanitize string input - loại bỏ các ký tự nguy hiểm
 * LƯU Ý: Chỉ dùng sanitize như một lớp bảo vệ bổ sung
 * QUAN TRỌNG: Luôn dùng parameterized queries, không dựa vào sanitize
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Loại bỏ các ký tự SQL injection
  return input
    .replace(/'/g, '')           // Loại bỏ single quote
    .replace(/"/g, '')           // Loại bỏ double quote
    .replace(/;/g, '')            // Loại bỏ semicolon
    .replace(/--/g, '')           // Loại bỏ comment
    .replace(/\/\*/g, '')         // Loại bỏ comment start
    .replace(/\*\//g, '')         // Loại bỏ comment end
    .replace(/\[/g, '')           // Loại bỏ bracket
    .replace(/\]/g, '')           // Loại bỏ bracket
    .replace(/xp_/gi, '')         // Loại bỏ xp_ prefix
    .replace(/sp_/gi, '')         // Loại bỏ sp_ prefix
    .replace(/exec/gi, '')        // Loại bỏ exec
    .replace(/execute/gi, '')      // Loại bỏ execute
    .trim();
}

/**
 * Validate và sanitize tất cả inputs trong một object
 */
export function validateAndSanitizeInputs(inputs: Record<string, any>): { valid: boolean; sanitized?: Record<string, any>; errors?: string[] } {
  const errors: string[] = [];
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(inputs)) {
    if (value === null || value === undefined) {
      continue;
    }
    
    if (typeof value === 'string') {
      // Kiểm tra SQL injection
      if (detectSQLInjection(value)) {
        errors.push(`${key} chứa ký tự không hợp lệ`);
        continue;
      }
      
      // Sanitize
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'number') {
      // Validate number
      if (!isFinite(value) || isNaN(value)) {
        errors.push(`${key} không phải là số hợp lệ`);
        continue;
      }
      sanitized[key] = value;
    } else if (typeof value === 'boolean') {
      sanitized[key] = value;
    } else {
      errors.push(`${key} có kiểu dữ liệu không hợp lệ`);
    }
  }
  
  return {
    valid: errors.length === 0,
    sanitized: errors.length === 0 ? sanitized : undefined,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Check if input contains SQL injection patterns
 * Enhanced detection với nhiều patterns hơn
 */
export function detectSQLInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  const sqlPatterns = [
    // Basic SQL injection
    /('|(\\')|(;)|(--)|(\/\*)|(\*\/)|(\[)|(\]))/i,
    // Stored procedures và system functions
    /(xp_|sp_|exec|execute|exec\(|execute\()/i,
    // SQL commands
    /(union|select|insert|update|delete|drop|create|alter|truncate)/i,
    // Dangerous commands
    /(grant|revoke|shutdown|backup|restore|kill)/i,
    // Time-based attacks
    /(waitfor|delay|sleep|benchmark)/i,
    // Boolean-based attacks
    /(or\s+1\s*=\s*1|or\s+'1'\s*=\s*'1'|or\s+"1"\s*=\s*"1")/i,
    /(and\s+1\s*=\s*1|and\s+'1'\s*=\s*'1'|and\s+"1"\s*=\s*"1")/i,
    // Comment-based
    /(\/\*|\*\/|--|\#)/i,
    // Hex encoding attempts
    /(0x[0-9a-f]+)/i,
    // Function calls
    /(cast\(|convert\(|char\(|ascii\(|substring\(|len\(|count\(|sum\(|avg\(|max\(|min\()/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Rate limiting helper - log suspicious activity
 */
export function logSuspiciousActivity(
  ip: string, 
  endpoint: string, 
  input: string, 
  reason: string
): void {
  console.error('🚨 SUSPICIOUS ACTIVITY DETECTED:', {
    ip,
    endpoint,
    input: input.substring(0, 100), // Chỉ log 100 ký tự đầu
    reason,
    timestamp: new Date().toISOString()
  });
  
  // TODO: Gửi alert đến admin hoặc security monitoring system
}

