import React from 'react';
import Link from 'next/link';
import TwoColumnLayout from '@/components/TwoColumnLayout';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type SubPageLayoutProps = {
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  showSidebar?: boolean;
  maxWidth?: string;
  centered?: boolean;
};

export default function SubPageLayout({
  breadcrumbs,
  title,
  subtitle,
  children,
  showSidebar = true,
}: SubPageLayoutProps) {
  return (
    <div className="we-subpage">
      <TwoColumnLayout showSidebar={showSidebar}>
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav style={{ fontSize: 12, color: '#888', marginBottom: 10 }} aria-label="Breadcrumb">
              <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>Trang chủ</Link>
              {breadcrumbs.map((item, i) => (
                <span key={`${item.label}-${i}`}>
                  {' / '}
                  {item.href ? (
                    <Link href={item.href} style={{ color: '#888', textDecoration: 'none' }}>
                      {item.label}
                    </Link>
                  ) : (
                    <span style={{ color: '#555' }}>{item.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {title && <h1 className="we-page-title">{title}</h1>}
          {subtitle && <p style={{ fontSize: 13, color: '#777', marginBottom: 15 }}>{subtitle}</p>}

          {children}
        </div>
      </TwoColumnLayout>
    </div>
  );
}
