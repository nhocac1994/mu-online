'use client';

/**
 * Nền ảnh dùng chung cho các trang (giống trang chủ).
 * Đặt bên trong wrapper có position relative, content đặt trong div relative z-10.
 */
export default function PageBackground() {
  return (
    <div
      className="page-site-bg fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/panael-mu.jpg)',
        filter: 'brightness(0.5) contrast(1.1)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
    </div>
  );
}
