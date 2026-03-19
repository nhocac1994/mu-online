# Deploy lên Vercel

Ứng dụng Next.js nằm ngay tại **thư mục gốc** repo (`package.json`, `src/`, `public/` ở root). Vercel sẽ tự nhận và build, **không cần** cấu hình Root Directory.

## Nếu gặp lỗi 404

1. Vào [Vercel Dashboard](https://vercel.com/dashboard) → chọn project.
2. **Settings** → **General** → **Root Directory** phải để **trống** (hoặc `.`).
3. **Deployments** → **Redeploy** để build lại.
