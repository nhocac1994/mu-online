# Deploy lên Vercel

Ứng dụng Next.js nằm trong thư mục **`frontend/`**. Để tránh lỗi 404 NOT_FOUND:

## Cấu hình trên Vercel

1. Vào [Vercel Dashboard](https://vercel.com/dashboard) → chọn project **mu-online** (hoặc tên project của bạn).
2. Vào **Settings** → **General**.
3. Tìm mục **Root Directory** → bấm **Edit**.
4. Nhập: **`frontend`** (chỉ tên thư mục, không có dấu `/` cuối).
5. Bấm **Save**.
6. Vào **Deployments** → bấm **Redeploy** ở deployment mới nhất (hoặc push lại code để tạo deployment mới).

Sau khi đặt Root Directory là `frontend`, Vercel sẽ build và deploy đúng app Next.js trong thư mục đó.
