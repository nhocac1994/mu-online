# 🎮 Mu Online - Full Stack Application

Dự án Mu Online với Frontend (Next.js) và Backend (Node.js/Express) tách biệt.

## 📁 Cấu Trúc Dự Án

```
mu-online-react 2/
├── frontend/          # Frontend Next.js Application
│   ├── src/          # Source code
│   ├── public/       # Static files
│   ├── package.json  # Frontend dependencies
│   └── ...
│
├── backend/          # Backend Node.js/Express API
│   ├── src/         # Source code
│   ├── dist/        # Compiled JavaScript
│   ├── package.json # Backend dependencies
│   └── ...
│
└── MuOnline.sql      # Database schema
```

## 🚀 Cài Đặt và Chạy

### 1. Backend

```bash
cd backend
npm install
npm run dev    # Development mode
# hoặc
npm run build
npm start      # Production mode
```

Backend chạy tại: `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev    # Development mode
# hoặc
npm run build
npm start      # Production mode
```

Frontend chạy tại: `http://localhost:3000`

## ⚙️ Cấu Hình

### Backend (.env trong thư mục backend/)

```env
DB_SERVER=127.0.0.1
DB_NAME=MuOnline
DB_USERNAME=sa
DB_PASSWORD=your-password
PORT=3001
CORS_ORIGIN=*
```

### Frontend (.env.local trong thư mục frontend/)

```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001
```

## 📚 Tài Liệu

- [Hướng Dẫn Kết Nối Frontend-Backend](./frontend/HUONG_DAN_KET_NOI_FRONTEND_BACKEND.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Security Guide](./frontend/SECURITY_GUIDE.md)

## 🔧 Công Nghệ Sử Dụng

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- MSSQL

## 📝 Ghi Chú

- Backend và Frontend chạy độc lập
- Frontend gọi Backend API qua Next.js API routes
- Database chỉ kết nối từ Backend (bảo mật)
