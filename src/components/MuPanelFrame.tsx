'use client';

import React from 'react';

export type MuPanelFrameProps = {
  src: string;
  alt: string;
  /** Kích thước gốc của file nền — dùng cho aspect-ratio khung */
  width: number;
  height: number;
  /** inset vùng nội dung: vd top-[17%] bottom-[8%] left-[5%] right-[5%] */
  overlayClassName?: string;
  className?: string;
  /**
   * Căn nền giống CSS background-size.
   * contain = trọn khung; cover = lấp đầy; "120% auto" / "100% 85%" để zoom tinh chỉnh.
   */
  backgroundSize?: string;
  /** VD: center, center top, 50% 20% */
  backgroundPosition?: string;
  /** Gắn thêm class cho lớp có aspect-ratio + nền (vd max-md:min-h-[…] kéo cao card mobile) */
  innerClassName?: string;
  children: React.ReactNode;
};

/**
 * Khung panel / modal: nền bằng CSS background (không dùng next/Image).
 * Dễ chỉnh kích thước hiển thị bằng backgroundSize / backgroundPosition thay vì object-fit cứng.
 */
export function MuPanelFrame({
  src,
  alt,
  width,
  height,
  overlayClassName,
  className,
  backgroundSize = 'contain',
  backgroundPosition = 'center',
  innerClassName,
  children,
}: MuPanelFrameProps) {
  const shell =
    className != null && className !== ''
      ? `relative w-full bg-transparent ${className}`
      : 'relative w-full bg-transparent';

  const overlayClasses = overlayClassName
    ? `absolute z-[1] box-border flex min-h-0 min-w-0 max-w-full flex-col overflow-hidden bg-transparent ${overlayClassName}`
    : 'absolute z-[1] box-border flex min-h-0 min-w-0 max-w-full flex-col overflow-hidden bg-transparent top-[18%] bottom-[9%] left-[5%] right-[5%]';

  return (
    <div className={shell}>
      <div
        className={`relative w-full min-h-0 max-w-full overflow-hidden bg-transparent${innerClassName ? ` ${innerClassName}` : ''}`}
        style={{
          aspectRatio: `${width} / ${height}`,
          backgroundImage: `url(${JSON.stringify(src)})`,
          backgroundSize,
          backgroundPosition,
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className="sr-only">{alt}</span>
        <div className={overlayClasses}>{children}</div>
      </div>
    </div>
  );
}
