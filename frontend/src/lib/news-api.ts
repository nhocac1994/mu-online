export type NewsType = 'Notice' | 'Event' | 'Update' | 'Hot';

export interface NewsArticleListItem {
  id: string;
  slug: string;
  type: NewsType;
  title: string;
  excerpt: string;
  publishedAt: string;
  published: boolean;
  sortOrder: number;
  contentFormat?: 'markdown' | 'text' | 'html';
}

export interface NewsArticle extends NewsArticleListItem {
  content: string;
}

function isBrowser(): boolean {
  return typeof globalThis !== 'undefined' && typeof (globalThis as { document?: unknown }).document !== 'undefined';
}

function getAppOriginForServerFetch(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '');
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL?.trim()) return `https://${process.env.VERCEL_URL}`;
  const port = process.env.PORT || '3000';
  return `http://127.0.0.1:${port}`;
}

function newsFetchUrl(path: string): string {
  const proxyPath = `/api/remote/${path.replace(/^\/api\//, '')}`;
  if (isBrowser()) return proxyPath;
  return `${getAppOriginForServerFetch()}${proxyPath}`;
}

export function formatNewsDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}/${Number(m)}/${y}`;
}

export function formatNewsDateLong(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return formatNewsDate(iso);
  return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function getNewsList(): Promise<NewsArticleListItem[]> {
  try {
    const res = await fetch(newsFetchUrl('news'), { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  try {
    const res = await fetch(newsFetchUrl(`news/${encodeURIComponent(slug)}`), { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
}

export function newsArticleLink(slug: string): string {
  return `/news/${slug}`;
}
