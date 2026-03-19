# 🎮 Mu Online Website - React Next.js

Website chính thức cho server Mu Online Season 1 với đầy đủ tính năng quản lý, xác thực và tương tác người dùng.

## ✨ Tính năng chính

### 🏠 Trang chủ
- Hero section với hiệu ứng animation
- Thống kê server real-time
- Tin tức và sự kiện
- Ranking system (Level, Guild, Events)

### 🔐 Hệ thống xác thực
- **Đăng ký tài khoản** - Form đầy đủ với validation
- **Đăng nhập** - Xác thực an toàn
- **Quản lý tài khoản** - Thay đổi thông tin cá nhân
- **Bảo mật** - Giới hạn thay đổi mật khẩu 1 lần/ngày

### 📰 Hệ thống tin tức
- Trang tin tức chính
- Chi tiết tin tức theo danh mục:
  - Hướng dẫn chơi
  - Sự kiện trong game
  - Lộ trình phát triển
  - Thông báo mở server
  - Cập nhật server

### 🎯 Trang thông tin
- Thống kê server chi tiết
- Cài đặt server (Exp rate, Drop rate, etc.)
- Lệnh trong game
- Tính năng nổi bật

### 💰 Hệ thống ủng hộ
- Các gói ủng hộ (Chaos, Gold Member, Life)
- Thông tin chuyển khoản
- QR Code thanh toán

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQL Server (MSSQL)
- **Deployment**: Vercel
- **Icons**: Next.js Image Optimization

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn
- SQL Server database

### Cài đặt dependencies
```bash
npm install
```

### Cấu hình Environment Variables
Tạo file `.env.local`:
```env
DB_SERVER=your_sql_server_ip
DB_NAME=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_PORT=1433
```

**Lưu ý**: Thay thế các giá trị mẫu bằng thông tin thực tế của bạn.

### Chạy development server
```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000)

## 🚀 Triển khai

### Vercel (Recommended)
1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Cấu hình Environment Variables
4. Deploy tự động

### Manual Build
```bash
npm run build
npm start
```

## 📁 Cấu trúc dự án

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── login/
│   │   ├── register/
│   │   ├── ranking/
│   │   └── test-db/
│   ├── donate/              # Trang ủng hộ
│   ├── download/             # Trang tải game
│   ├── info/                 # Thông tin server
│   ├── login/                # Đăng nhập
│   ├── myaccount/            # Quản lý tài khoản
│   ├── news/                 # Tin tức
│   │   ├── events/
│   │   ├── guide/
│   │   ├── opening/
│   │   ├── roadmap/
│   │   └── update/
│   ├── register/             # Đăng ký
│   └── test-db/              # Test database
├── lib/
│   └── database.ts           # Database connection
└── globals.css               # Global styles
```

## 🗄️ Database Schema

### MEMB_INFO Table
```sql
CREATE TABLE MEMB_INFO (
    memb_guid int IDENTITY(1,1) NOT NULL,
    memb___id varchar(10) NOT NULL,
    memb__pwd varchar(10) NOT NULL,
    memb_name varchar(10) NOT NULL,
    sno__numb char(18) NOT NULL,
    mail_addr varchar(50) NULL,
    tel__numb varchar(20) NULL,
    fpas_ques varchar(50) NULL,
    fpas_answ varchar(50) NULL,
    appl_days datetime NULL,
    bloc_code char(1) NOT NULL,
    ctl1_code char(1) NOT NULL,
    AccountLevel int NOT NULL,
    AccountExpireDate smalldatetime NOT NULL,
    CONSTRAINT PK_MEMB_INFO_1 PRIMARY KEY (memb_guid DESC)
);
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - Đăng ký tài khoản
- `POST /api/login` - Đăng nhập
- `GET /api/test-db` - Test kết nối database

### Data
- `GET /api/ranking` - Lấy dữ liệu ranking

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tablet và desktop optimization
- Touch-friendly interface

### Animations
- CSS keyframe animations
- Hover effects
- Loading states
- Smooth transitions

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

## 🔒 Bảo mật

### Authentication
- Password validation
- Session management
- Rate limiting

### Data Protection
- Input sanitization
- SQL injection prevention
- XSS protection

### Privacy
- GDPR compliance
- Data encryption
- Secure connections

## 📊 Performance

### Optimization
- Next.js Image Optimization
- Code splitting
- Lazy loading
- Caching strategies

### Monitoring
- Vercel Analytics
- Performance metrics
- Error tracking

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Support

- **Email**: support@mudautruongss1.net
- **Discord**: [Server Discord](https://discord.gg/mudautruongss1)
- **Facebook**: [Fanpage](https://facebook.com/mudautruongss1)

## 🙏 Acknowledgments

- Next.js team cho framework tuyệt vời
- Vercel cho hosting platform
- Tailwind CSS cho styling system
- Cộng đồng Mu Online Việt Nam

---

**🎮 Chúc bạn có trải nghiệm tuyệt vời với Mu Online Season 1!**