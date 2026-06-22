'use client';

import React, { useEffect, useId } from 'react';

export type PanelZoomModalProps = {
  open: boolean;
  onClose: () => void;
  /** Tiêu đề a11y */
  title: string;
  /** Khung panel bên trong (thường là MuPanelFrame + children) */
  children: React.ReactNode;
  /** Độ rộng tối đa — mặc định lớn để “zoom” so với cột trang */
  maxWidthClassName?: string;
};

export function PanelZoomModal({
  open,
  onClose,
  title,
  children,
  maxWidthClassName = 'max-w-[min(820px,96vw)]',
}: PanelZoomModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        aria-label="Đóng"
        onClick={onClose}
      />
      <div
        className={`relative z-[1] w-full ${maxWidthClassName} max-h-[92vh] overflow-y-auto overscroll-contain`}
      >
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="sticky top-1 z-[102] float-right mb-1 mr-1 flex h-9 w-9 items-center justify-center rounded-md border border-white/35 bg-black/75 text-lg leading-none text-white shadow hover:bg-black/90 sm:absolute sm:right-2 sm:top-2 sm:float-none"
          aria-label="Đóng"
        >
          ×
        </button>
        <div className="clear-both px-1 pb-2 pt-1 sm:px-2">{children}</div>
      </div>
    </div>
  );
}
