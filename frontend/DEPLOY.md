# Deploy lên Vercel

Ứng dụng Next.js nằm trong thư mục **`frontend/`** (monorepo).

## Cấu hình Vercel

1. **Settings** → **General** → **Root Directory** = `frontend`
2. **Build Command**: `npm run build` (mặc định)
3. **Environment**: thêm `NEXT_PUBLIC_BACKEND_API_URL` trỏ tới backend VPS

## Nếu gặp lỗi 404

1. Vào [Vercel Dashboard](https://vercel.com/dashboard) → chọn project.
2. **Root Directory** phải là **`frontend`**, không phải thư mục gốc repo.
3. **Deployments** → **Redeploy** để build lại.

## Netlify

Trong site settings, **Base directory** = `frontend` (file `netlify.toml` đã nằm trong `frontend/`).

## Tắt Vercel Toolbar

1. Vercel Dashboard → project → **Settings** → **General**
2. **Vercel Toolbar** → **Preview** và **Production** → **Off**
