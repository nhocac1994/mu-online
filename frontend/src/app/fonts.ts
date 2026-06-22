import { Exo_2, Rajdhani } from 'next/font/google';

/** Tiêu đề — geometric / gaming (kiểu mẫu Third Evolution) */
export const fontDisplay = Rajdhani({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-family-display',
  weight: ['500', '600', '700'],
  display: 'swap',
});

/** Nội dung — sans gọn, dễ đọc */
export const fontBody = Exo_2({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-family-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});
