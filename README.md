# Mu Online — Full Stack

Monorepo: **frontend** (Next.js) + **backend** (Express + SQL Server).

## Cấu trúc dự án

```
mu-online-react 2/
├── frontend/              # Website Next.js (chạy :3000)
│   ├── src/app/           # Trang + API routes proxy
│   ├── src/components/
│   ├── src/lib/
│   ├── public/
│   ├── package.json
│   └── README.md          # Chi tiết cấu trúc frontend
│
├── backend/               # API Express (chạy :3001 hoặc :55777 VPS)
│   ├── src/routes/        # auth, rankings, admin, launcher...
│   ├── admin-panel/       # Trang admin HTML từ xa (/admin)
│   ├── config/            # site-config.json, news.json
│   ├── launcher/          # File patch client
│   └── package.json
│
├── MuOnline.sql           # Schema database
├── package.json           # Script gốc: npm run dev / dev:backend
└── README.md
```

## Chạy nhanh

### Backend

```bash
cd backend
npm install
npm run dev          # http://localhost:3001
```

### Frontend

```bash
# Cách 1 — từ thư mục gốc
npm run install:frontend
npm run dev          # http://localhost:3000

# Cách 2 — trong frontend/
cd frontend
npm install
cp env.local.template .env.local
npm run dev
```

## Cấu hình

**Backend** — `backend/.env` hoặc `backend/config/app.config.json`:

- `DB_SERVER`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `PORT`, `CORS_ORIGIN`
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`

**Frontend** — `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_API_URL=http://103.77.174.211:55777
```

## Deploy

| Thành phần | Ghi chú |
|------------|---------|
| Frontend | Vercel / Netlify — root directory: `frontend` |
| Backend | VPS — chạy `mu-online-backend.exe` hoặc `npm start` trong `backend/` |

Xem thêm: [frontend/DEPLOY.md](./frontend/DEPLOY.md)

## Tài liệu

- [Frontend README](./frontend/README.md)
- [Hướng dẫn chạy local](./frontend/HUONG_DAN_CHAY_LOCAL.md)
- [Kiểm tra kết nối](./frontend/KIEM_TRA_KET_NOI.md)
- [Push Git](./HUONG_DAN_PUSH_GIT.md)

## Công nghệ

| Frontend | Backend |
|----------|---------|
| Next.js 16, React 19 | Node.js, Express |
| TypeScript, Tailwind | TypeScript, MSSQL |
