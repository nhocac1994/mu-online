/** Chuyển markdown đơn giản / text thường → HTML an toàn */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/'/g, '&#39;');
}

function isSafeImageUrl(url: string): boolean {
  const u = url.trim();
  if (u.startsWith('/')) return true;
  return /^https?:\/\//i.test(u);
}

/** Emoji, ==tên nổi bật==, [VS], **đậm**, *nghiêng*, ![ảnh](url) */
function inlineFormat(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) => {
    if (!isSafeImageUrl(url)) return escapeHtml(_m);
    return `<img src="${escapeAttr(url.trim())}" alt="${escapeAttr(alt)}" class="inline-img" loading="lazy" />`;
  });
  s = s.replace(/==(.+?)==/g, '<mark class="news-highlight">$1</mark>');
  s = s.replace(/\[VS\]/gi, '<span class="news-vs">VS</span>');
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return s;
}

function parseImageLine(line: string): string | null {
  const m = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (!m || !isSafeImageUrl(m[2])) return null;
  const alt = escapeAttr(m[1]);
  const src = escapeAttr(m[2].trim());
  return `<figure class="article-figure"><img src="${src}" alt="${alt}" loading="lazy" /></figure>`;
}

/** Một dòng trống = đoạn mới; dòng bắt đầu `- ` = danh sách */
export function simpleMarkdownToHtml(markdown: string): string {
  const normalized = markdown.replace(/\r\n/g, '\n').trim();
  if (!normalized) return '';

  const blocks = normalized.split(/\n\n+/);
  const html: string[] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trimEnd());
    const first = lines[0]?.trim() ?? '';

    const imgBlock = parseImageLine(first);
    if (imgBlock && lines.length === 1) {
      html.push(imgBlock);
      continue;
    }

    if (first.startsWith('### ')) {
      html.push(`<h3>${inlineFormat(first.slice(4))}</h3>`);
      for (const line of lines.slice(1)) {
        const t = line.trim();
        const img = parseImageLine(t);
        if (img) html.push(img);
        else if (t) html.push(`<p>${inlineFormat(t)}</p>`);
      }
      continue;
    }
    if (first.startsWith('## ')) {
      html.push(`<h2>${inlineFormat(first.slice(3))}</h2>`);
      for (const line of lines.slice(1)) {
        const t = line.trim();
        const img = parseImageLine(t);
        if (img) html.push(img);
        else if (t.startsWith('- ')) {
          html.push(`<ul><li>${inlineFormat(t.slice(2))}</li></ul>`);
        } else if (t) {
          html.push(`<p>${inlineFormat(t)}</p>`);
        }
      }
      continue;
    }
    if (first.startsWith('# ')) {
      html.push(`<h1>${inlineFormat(first.slice(2))}</h1>`);
      continue;
    }

    const allList = lines.every((l) => !l.trim() || l.trim().startsWith('- '));
    if (allList && lines.some((l) => l.trim().startsWith('- '))) {
      html.push('<ul>');
      for (const line of lines) {
        const t = line.trim();
        if (t.startsWith('- ')) {
          html.push(`<li>${inlineFormat(t.slice(2))}</li>`);
        }
      }
      html.push('</ul>');
      continue;
    }

    for (const line of lines) {
      const t = line.trim();
      const img = parseImageLine(t);
      if (img) html.push(img);
      else if (t) html.push(`<p>${inlineFormat(t)}</p>`);
    }
  }

  return html.join('');
}

export function isLikelyHtml(content: string): boolean {
  return /<\s*(p|h[1-6]|ul|ol|li|div|br|figure|img|mark)\b/i.test(content);
}

export function renderArticleContent(content: string, format?: 'markdown' | 'text' | 'html'): string {
  const fmt = format ?? (isLikelyHtml(content) ? 'html' : 'markdown');
  if (fmt === 'html') return content;
  if (fmt === 'text') {
    return content
      .split(/\n\n+/)
      .map((p) => `<p>${inlineFormat(p.replace(/\n/g, ' ').trim())}</p>`)
      .join('');
  }
  return simpleMarkdownToHtml(content);
}

/** Gợi ý chuyển HTML cũ sang text khi mở trong editor */
export function htmlToEditableText(html: string): string {
  if (!isLikelyHtml(html)) return html;
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<h2[^>]*>/gi, '\n\n## ')
    .replace(/<\/h2>/gi, '\n')
    .replace(/<h3[^>]*>/gi, '\n\n### ')
    .replace(/<\/h3>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/li>/gi, '')
    .replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '\n\n![$2]($1)\n\n')
    .replace(/<img[^>]+src="([^"]*)"[^>]*>/gi, '\n\n![]($1)\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
