# Deploy lên Vercel

Ứng dụng Next.js nằm ngay tại **thư mục gốc** repo (`package.json`, `src/`, `public/` ở root). Vercel sẽ tự nhận và build, **không cần** cấu hình Root Directory.

## Nếu gặp lỗi 404

1. Vào [Vercel Dashboard](https://vercel.com/dashboard) → chọn project.
2. **Settings** → **General** → **Root Directory** phải để **trống** (hoặc `.`).
3. **Deployments** → **Redeploy** để build lại.

## Tắt Vercel Toolbar (thanh nổi góc màn hình)

Thanh "Vercel Toolbar" do Vercel tự chèn, không tắt được bằng code. Cách tắt:

1. Vào [Vercel Dashboard](https://vercel.com/dashboard) → chọn project **mu-online**.
2. Vào **Settings** → **General**.
3. Tìm mục **Vercel Toolbar**.
4. Ở **Preview** và **Production**, chọn **Off**.
5. Lưu (Save). Có thể cần **Redeploy** một lần để áp dụng.
