/**
 * Parse customoption.txt → public/data/custom-option.json
 * Usage: node scripts/parse-customoption.mjs [path-to-customoption.txt]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultInput = path.resolve(__dirname, '../../customoption.txt');
const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInput;
const outputSrc = path.resolve(__dirname, '../src/data/custom-option.json');
const outputPublic = path.resolve(__dirname, '../public/data/custom-option.json');

const GROUP0_RE =
  /^\s*254\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+"([^"]+)"/;

const ITEM_NAMES = {
  '12,15': 'Ngọc Hỗn Nguyên',
  '12,30': 'Cụm Ngọc Ước Nguyện',
  '12,31': 'Cụm Ngọc Tâm Linh',
  '12,137': 'Cụm Ngọc Sáng Tạo',
  '14,16': 'Ngọc Sinh Mệnh',
  '14,200': 'Ngọc HP (khảm)',
  '14,201': 'Ngọc Mana (khảm)',
  '14,202': 'Ngọc Sát thương (khảm)',
  '14,203': 'Ngọc Phản hồi (khảm)',
  '14,204': 'Ngọc Tránh đòn (khảm)',
  '14,205': 'Ngọc Zen (khảm)',
  '14,206': 'Ngọc May mắn (khảm)',
  '14,207': 'Ngọc HP (khảm)',
  '14,208': 'Ngọc Mana (khảm)',
  '14,209': 'Ngọc Sát thương (khảm)',
  '14,210': 'Ngọc Phản hồi (khảm)',
  '14,211': 'Ngọc Tránh đòn (khảm)',
  '14,212': 'Ngọc Zen (khảm)',
};

function parseCommentItem(line) {
  const m = line.match(/\/\/\s*(.+)$/);
  return m ? m[1].trim() : '';
}

function formatZen(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M Zen`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K Zen`;
  return `${n} Zen`;
}

function resolveItemName(itemKey, comment) {
  const c = (comment || '').trim().toLowerCase();
  if (itemKey === '14,16' && /sinh m/.test(c)) return 'Ngọc Sinh Mệnh';
  if (ITEM_NAMES[itemKey]) return ITEM_NAMES[itemKey];
  if (comment) {
    const raw = comment.trim();
    if (/^ngoc/i.test(raw)) return raw.replace(/^ngoc\s*/i, 'Ngọc ').replace(/Ngoc/gi, '');
    if (/^\d+\s*vien/i.test(raw)) return raw.replace(/^\d+\s*vien\s*/i, '').replace(/^./, (ch) => ch.toUpperCase());
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  return `Item ${itemKey}`;
}

/** Gộp trùng itemKey trong cùng 1 công thức (cộng số lượng) */
function mergeMaterials(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = row.itemKey;
    const prev = map.get(key);
    if (prev) {
      prev.count += row.count;
    } else {
      map.set(key, { ...row });
    }
  }
  return [...map.values()].map(({ itemKey, item, count }) => ({ itemKey, item, count }));
}

function inferCategory(name) {
  const n = name.toLowerCase();
  if (/hp|mau/i.test(n)) return 'Tăng HP / hồi máu';
  if (/mana/i.test(n)) return 'Mana';
  if (/sat thuong|tan cong|damage/i.test(n)) return 'Sát thương / tấn công';
  if (/tranh|ne don/i.test(n)) return 'Phòng thủ / né';
  if (/zen/i.test(n)) return 'Zen / drop';
  if (/may man/i.test(n)) return 'May mắn';
  if (/phan hoi/i.test(n)) return 'Phản hồi';
  return 'Khảm đồng';
}

function parseFile(content) {
  const lines = content.split(/\r?\n/);
  let section = -1;
  const meta = new Map();
  const materials = new Map();
  const excBitmask = new Map();
  let maxExcLines = null;
  /** Trong nhóm 1, dòng 254 0 giữa block thường là lỗi gõ — gán vào option đang mở (1–12) */
  let currentMaterialMix = -1;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('//')) continue;
    if (line === 'end') {
      section = -1;
      currentMaterialMix = -1;
      continue;
    }

    const parts = line.split(/\s+/).filter(Boolean);

    if (section === 3 && parts.length === 1 && /^\d+$/.test(parts[0])) {
      maxExcLines = parseInt(parts[0], 10);
      continue;
    }

    if (/^\d+$/.test(line) && !line.includes(',')) {
      section = parseInt(line, 10);
      if (section === 1) currentMaterialMix = -1;
      continue;
    }

    if (section === 0) {
      const m = GROUP0_RE.exec(raw) || GROUP0_RE.exec(line);
      if (m) {
        const mixIndex = parseInt(m[1], 10);
        const money = parseInt(m[2], 10);
        const rates = [parseInt(m[3], 10), parseInt(m[4], 10), parseInt(m[5], 10), parseInt(m[6], 10)];
        const name = m[7].trim();
        meta.set(mixIndex, { mixIndex, money, rates, name, category: inferCategory(name) });
        continue;
      }
      if (parts.length >= 8 && parts[0] === '254') {
        const mixIndex = parseInt(parts[1], 10);
        const money = parseInt(parts[2], 10);
        const rates = [parseInt(parts[3], 10), parseInt(parts[4], 10), parseInt(parts[5], 10), parseInt(parts[6], 10)];
        const q = line.match(/"([^"]+)"/);
        const name = q ? q[1].trim() : `Option #${mixIndex}`;
        meta.set(mixIndex, { mixIndex, money, rates, name, category: inferCategory(name) });
        continue;
      }
    }

    if (section === 1 && parts.length >= 6 && parts[0] === '254') {
      let mixIndex = parseInt(parts[1], 10);
      if (mixIndex > 0) {
        currentMaterialMix = mixIndex;
      } else if (mixIndex === 0 && currentMaterialMix > 0) {
        mixIndex = currentMaterialMix;
      } else if (mixIndex === 0) {
        currentMaterialMix = 0;
      }
      const itemKey = parts[2];
      const count = parseInt(parts[4], 10);
      const comment = parseCommentItem(raw);
      const item = resolveItemName(itemKey, comment);
      if (!materials.has(mixIndex)) materials.set(mixIndex, []);
      materials.get(mixIndex).push({ itemKey, item, count });
      continue;
    }

    if (section === 2 && parts.length >= 3 && parts[0] === '254') {
      const mixIndex = parseInt(parts[1], 10);
      const bit = parseInt(parts[2], 10);
      excBitmask.set(mixIndex, bit);
      continue;
    }

  }

  const commonMaterials = mergeMaterials(materials.get(0) || []);

  const recipes = [];
  for (const [mixIndex, m] of meta) {
    recipes.push({
      ...m,
      zenLabel: formatZen(m.money),
      ratesLabel: { al0: m.rates[0], al1: m.rates[1] },
      materials: mergeMaterials(materials.get(mixIndex) || []),
      excBitmask: excBitmask.get(mixIndex) ?? null,
    });
  }

  recipes.sort((a, b) => a.category.localeCompare(b.category) || a.mixIndex - b.mixIndex);
  const categories = [...new Set(recipes.map((r) => r.category))].sort();

  return { recipes, categories, maxExcLines, commonMaterials };
}

const content = fs.readFileSync(inputPath, 'utf8');
const { recipes, categories, maxExcLines, commonMaterials } = parseFile(content);

const payload = JSON.stringify(
  {
    generatedAt: new Date().toISOString(),
    maxExcLines,
    commonMaterials,
    categories,
    recipes,
  },
  null,
  2
);

for (const out of [outputSrc, outputPublic]) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, payload, 'utf8');
  console.log(`Wrote ${out}`);
}

console.log(`Parsed ${recipes.length} option recipes. maxExcLines=${maxExcLines}`);
