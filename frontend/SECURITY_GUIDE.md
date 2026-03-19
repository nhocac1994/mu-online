# 🛡️ Hướng Dẫn Bảo Mật - Chống SQL Injection và Tấn Công

## ⚠️ QUAN TRỌNG: Bảo Vệ Chống SQL Injection

Trang web này đã được bảo vệ chống SQL injection và các tấn công khác. Tài liệu này giải thích các biện pháp bảo vệ đã được triển khai.

---

## ✅ CÁC BIỆN PHÁP BẢO VỆ ĐÃ TRIỂN KHAI

### 1. **Parameterized Queries (Quan Trọng Nhất)**

**TẤT CẢ** các SQL queries đều sử dụng parameterized queries:

```typescript
// ✅ AN TOÀN - Dùng parameterized query
const result = await pool.request()
  .input('accountId', sql.VarChar(10), accountId)
  .query('SELECT * FROM MEMB_INFO WHERE memb___id = @accountId');
```

**Tại sao an toàn?**
- Input được escape tự động bởi SQL Server
- SQL Server xử lý input như data, không phải code
- Không thể inject SQL code vào query

### 2. **Input Validation**

Tất cả inputs đều được validate trước khi sử dụng:

```typescript
// ✅ Validate format
const validation = validateAccountId(accountId);
if (!validation.valid) {
  return error;
}

// ✅ Validate length
if (accountId.length > 10) {
  return error;
}

// ✅ Validate pattern (chỉ alphanumeric)
if (!/^[a-zA-Z0-9]+$/.test(accountId)) {
  return error;
}
```

### 3. **SQL Injection Detection**

Hệ thống tự động detect các patterns SQL injection:

```typescript
// ✅ Detect SQL injection patterns
if (detectSQLInjection(input)) {
  logSuspiciousActivity(clientIP, endpoint, input, 'SQL Injection attempt');
  return error;
}
```

**Các patterns được detect:**
- Single quote (`'`)
- Semicolon (`;`)
- SQL comments (`--`, `/* */`)
- SQL commands (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `DROP`, etc.)
- Stored procedures (`xp_`, `sp_`, `exec`, `execute`)
- Boolean-based attacks (`OR 1=1`, `AND 1=1`)
- Time-based attacks (`WAITFOR DELAY`, `SLEEP`)
- Function calls (`CAST`, `CONVERT`, `CHAR`, etc.)

### 4. **Security Middleware**

Tất cả API routes đều được bảo vệ bởi security middleware:

```typescript
// ✅ Tự động kiểm tra bảo mật
const securityCheck = await securityMiddleware(request, '/api/endpoint');
if (securityCheck && !securityCheck.allowed) {
  return error;
}
```

**Middleware kiểm tra:**
- Query parameters
- Request headers
- Request body
- Tất cả các giá trị string trong request

### 5. **Suspicious Activity Logging**

Tất cả các attempts bất thường đều được log:

```typescript
logSuspiciousActivity(clientIP, endpoint, input, reason);
```

**Thông tin được log:**
- IP address
- Endpoint
- Input (100 ký tự đầu)
- Reason
- Timestamp

### 6. **Rate Limiting**

Các endpoint quan trọng có rate limiting để chống brute force:

```typescript
// ✅ Rate limiting cho login
const rateLimitResponse = await fetch('/api/rate-limit', {
  method: 'POST',
  body: JSON.stringify({ ip: clientIP, action: 'check' })
});
```

---

## 🚫 NHỮNG ĐIỀU KHÔNG BAO GIỜ ĐƯỢC LÀM

### ❌ KHÔNG BAO GIỜ: String Concatenation trong SQL

```typescript
// ❌ NGUY HIỂM - KHÔNG BAO GIỜ LÀM
const query = `SELECT * FROM MEMB_INFO WHERE memb___id = '${accountId}'`;
await pool.request().query(query);

// Hacker có thể inject:
// accountId = "admin' OR '1'='1"
// → SELECT * FROM MEMB_INFO WHERE memb___id = 'admin' OR '1'='1'
// → Trả về TẤT CẢ accounts!
```

### ❌ KHÔNG BAO GIỜ: Trust User Input

```typescript
// ❌ NGUY HIỂM
const level = request.body.level; // Không validate
await pool.request().query(`UPDATE Character SET cLevel = ${level}`);
```

### ❌ KHÔNG BAO GIỜ: Expose Error Messages

```typescript
// ❌ NGUY HIỂM - Expose thông tin database
catch (error) {
  return NextResponse.json({ error: error.message }); // Có thể chứa thông tin nhạy cảm
}

// ✅ AN TOÀN
catch (error) {
  console.error('Error:', error); // Log internally
  return NextResponse.json({ error: 'Lỗi hệ thống' }); // Generic message
}
```

---

## 📋 CHECKLIST KHI TẠO API MỚI

Khi tạo API endpoint mới, **BẮT BUỘC** phải:

1. ✅ **Dùng parameterized queries**
   ```typescript
   .input('param', sql.VarChar(10), value)
   ```

2. ✅ **Validate tất cả inputs**
   ```typescript
   const validation = validateAccountId(accountId);
   if (!validation.valid) return error;
   ```

3. ✅ **Detect SQL injection**
   ```typescript
   if (detectSQLInjection(input)) return error;
   ```

4. ✅ **Dùng security middleware**
   ```typescript
   const securityCheck = await securityMiddleware(request, '/api/endpoint');
   ```

5. ✅ **Log suspicious activity**
   ```typescript
   logSuspiciousActivity(clientIP, endpoint, input, reason);
   ```

6. ✅ **Generic error messages**
   ```typescript
   return NextResponse.json({ error: 'Lỗi hệ thống' });
   ```

---

## 🔍 CÁC VECTOR TẤN CÔNG ĐÃ ĐƯỢC BẢO VỆ

### ✅ SQL Injection Qua URL Parameters
```
GET /api/characters?name=test' OR '1'='1
```
→ **Bị block** bởi `detectSQLInjection()` và `validateCharacterName()`

### ✅ SQL Injection Qua Request Body
```json
{
  "username": "admin'--",
  "password": "anything"
}
```
→ **Bị block** bởi `securityMiddleware()` và `validateAccountId()`

### ✅ SQL Injection Qua Headers
```
Headers: {
  "x-user-account": "admin'; UPDATE MEMB_INFO SET AccountLevel=32;--"
}
```
→ **Bị block** bởi `checkHeadersSecurity()`

### ✅ Time-Based Blind SQL Injection
```
GET /api/characters?name=test' AND (SELECT COUNT(*) FROM MEMB_INFO) > 100 WAITFOR DELAY '00:00:05'--
```
→ **Bị block** bởi `detectSQLInjection()` (detect `WAITFOR DELAY`)

### ✅ Boolean-Based SQL Injection
```
GET /api/login?username=admin' OR '1'='1
```
→ **Bị block** bởi `detectSQLInjection()` (detect `OR 1=1`)

---

## 🛡️ BẢO VỆ BỔ SUNG

### Database User Permissions

Đảm bảo database user chỉ có quyền cần thiết:

```sql
-- ✅ Tạo user với quyền hạn chế
CREATE LOGIN webapp_user WITH PASSWORD = 'strong_password';
CREATE USER webapp_user FOR LOGIN webapp_user;

-- Chỉ cho phép SELECT, INSERT, UPDATE trên các bảng cụ thể
GRANT SELECT, INSERT, UPDATE ON MEMB_INFO TO webapp_user;
GRANT SELECT ON Character TO webapp_user;

-- KHÔNG cho phép:
-- DENY DELETE ON MEMB_INFO TO webapp_user;
-- DENY DROP TABLE TO webapp_user;
-- DENY ALTER TABLE TO webapp_user;
```

### Network Security

- ✅ Database chỉ accessible từ server
- ✅ Không expose database port ra internet
- ✅ Dùng firewall rules

### Monitoring

- ✅ Log tất cả suspicious activity
- ✅ Monitor failed login attempts
- ✅ Alert khi có nhiều SQL injection attempts từ cùng IP

---

## 📞 LIÊN HỆ

Nếu phát hiện lỗ hổng bảo mật, vui lòng báo ngay cho admin.

---

**Lưu ý:** Tài liệu này được cập nhật thường xuyên. Luôn kiểm tra phiên bản mới nhất trước khi phát triển tính năng mới.

