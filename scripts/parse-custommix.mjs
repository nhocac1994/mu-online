/**
 * Parse custommix.txt → src/data/chaos-mix.json
 * Usage: node scripts/parse-custommix.mjs [path-to-custommix.txt]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultInput = path.resolve(__dirname, '../../custommix.txt');
const inputPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultInput;
const outputSrc = path.resolve(__dirname, '../src/data/chaos-mix.json');
const outputPublic = path.resolve(__dirname, '../public/data/chaos-mix.json');

/** Nhóm 0: 255 MixIndex MixMoney AL0 AL1 AL2 AL3 "Name" ... */
const GROUP0_RE =
  /^\s*255\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+"([^"]+)"/;

const JEWEL_NAMES = {
  '12,15': 'Ngọc Hỗn Nguyên',
  '12,30': 'Cụm Ngọc Tâm Linh',
  '12,31': 'Cụm Ngọc Ước Nguyện',
  '12,137': 'Cụm Ngọc Sáng Tạo',
  '12,136': 'Cụm Ngọc Sinh Mệnh',
  '14,220': 'Ngọc Tạo Hóa',
};

const SLOT_NAMES = {
  0: 'Vũ khí (Kiếm)',
  2: 'Găng',
  4: 'Cung/Nỏ',
  5: 'Gậy',
  6: 'Khiên',
  7: 'Mũ',
  8: 'Áo',
  9: 'Quần',
  10: 'Găng tay',
  11: 'Giày',
};

function inferCategory(name, mixIndex) {
  const n = name.toLowerCase();
  if (/kiem|dao|cuong phong|loi phong|ao anh|thien tu|sinh menh/i.test(n)) return 'Vũ khí DK/MG';
  if (/quyen truong/i.test(n)) return 'Vũ khí RF';
  if (/cung|no /i.test(n)) return 'Vũ khí Elf';
  if (/gay|khien/i.test(n)) return 'Vũ khí DW/DL';
  if (mixIndex >= 140 || mixIndex >= 120 && /phong vu|loi phong|cuong phong/i.test(n)) {
    if (mixIndex >= 140) return 'Vũ khí';
  }
  if (/ma thuat|trieu hon|ma vuong/i.test(n)) return 'Set DW';
  if (/ngoc bich|kim ngan|giai nhan|thanh nu/i.test(n)) return 'Set Elf';
  if (/huyen thiet|hac vuong|chi ton/i.test(n)) return 'Set DL';
  if (/phong vu|loi phong|cuong phong/i.test(n) && mixIndex >= 120) return 'Set MG';
  if (/hoa long|hac long|phuong hoang|than long/i.test(n)) return 'Set DK';
  if (mixIndex >= 0 && mixIndex <= 19) return 'Set DK';
  if (mixIndex >= 30 && mixIndex <= 44) return 'Set DW';
  if (mixIndex >= 60 && mixIndex <= 79) return 'Set Elf';
  if (mixIndex >= 90 && mixIndex <= 104) return 'Set DL';
  if (mixIndex >= 120 && mixIndex <= 131) return 'Set MG';
  if (mixIndex >= 140) return 'Vũ khí';
  return 'Khác';
}

function parseQuotedName(line) {
  const m = line.match(/"([^"]+)"/);
  return m ? m[1].trim() : '';
}

function formatZen(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M Zen`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K Zen`;
  return `${n} Zen`;
}

function formatMainItem(row) {
  const slot = SLOT_NAMES[row.type] || `Loại ${row.type}`;
  const opts = [];
  if (row.level > 0) opts.push(`+${row.level}`);
  if (row.luck === 1) opts.push('Luck');
  if (row.add > 0) opts.push(`+${row.add} option`);
  if (row.exc === '*' || row.exc === 1 || row.exc === '1') opts.push('có Exc');
  else if (typeof row.exc === 'number' && row.exc > 0) opts.push(`Exc≥${row.exc}`);
  return `${slot} (ID ${row.index}) ${opts.join(', ') || 'theo config'}`;
}

function parseFile(content) {
  const lines = content.split(/\r?\n/);
  let section = -1;
  const meta = new Map();
  const materials = new Map();
  const mainItems = new Map();

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('//')) continue;
    if (line === 'end') {
      section = -1;
      continue;
    }
    if (/^\d+$/.test(line) && !line.includes(',')) {
      section = parseInt(line, 10);
      continue;
    }

    const parts = line.split(/\s+/).filter(Boolean);

    if (section === 0) {
      const m = GROUP0_RE.exec(raw) || GROUP0_RE.exec(line);
      if (m) {
        const mixIndex = parseInt(m[1], 10);
        const money = parseInt(m[2], 10);
        const rates = [parseInt(m[3], 10), parseInt(m[4], 10), parseInt(m[5], 10), parseInt(m[6], 10)];
        const name = m[7].trim();
        meta.set(mixIndex, { mixIndex, money, rates, name, category: inferCategory(name, mixIndex) });
        continue;
      }
      if (parts.length >= 8 && parts[0] === '255') {
        const mixIndex = parseInt(parts[1], 10);
        const money = parseInt(parts[2], 10);
        const rates = [parseInt(parts[3], 10), parseInt(parts[4], 10), parseInt(parts[5], 10), parseInt(parts[6], 10)];
        const name = parseQuotedName(line);
        meta.set(mixIndex, { mixIndex, money, rates, name, category: inferCategory(name, mixIndex) });
        continue;
      }
    }

    if (section === 1 && parts.length >= 6) {
      const mixIndex = parseInt(parts[1], 10);
      const itemKey = parts[2];
      const count = parseInt(parts[4], 10);
      const jewelName = JEWEL_NAMES[itemKey] || `Item ${itemKey}`;
      if (!materials.has(mixIndex)) materials.set(mixIndex, []);
      materials.get(mixIndex).push({ item: jewelName, count });
    } else if (section === 2 && parts.length >= 10) {
      const mixIndex = parseInt(parts[1], 10);
      const count = parseInt(parts[2], 10);
      const [type, index] = parts[3].split(',').map((x) => parseInt(x, 10));
      const row = {
        count,
        type,
        index,
        level: parseInt(parts[4], 10),
        skill: parseInt(parts[5], 10),
        luck: parseInt(parts[6], 10),
        add: parseInt(parts[7], 10),
        exc: parts[8] === '*' ? '*' : parseInt(parts[8], 10) || parts[8],
      };
      if (!mainItems.has(mixIndex)) mainItems.set(mixIndex, []);
      mainItems.get(mixIndex).push({ ...row, label: formatMainItem(row) });
    }
  }

  const recipes = [];
  for (const [mixIndex, m] of meta) {
    recipes.push({
      ...m,
      zenLabel: formatZen(m.money),
      ratesLabel: { al0: m.rates[0], al1: m.rates[1], al2: m.rates[2], al3: m.rates[3] },
      materials: materials.get(mixIndex) || [],
      mainItems: mainItems.get(mixIndex) || [],
    });
  }

  recipes.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  return recipes;
}

const content = fs.readFileSync(inputPath, 'utf8');
const recipes = parseFile(content);
const categories = [...new Set(recipes.map((r) => r.category))].sort();

const payload = JSON.stringify({ generatedAt: new Date().toISOString(), categories, recipes }, null, 2);

for (const out of [outputSrc, outputPublic]) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, payload, 'utf8');
  console.log(`Wrote ${out}`);
}

const sample = recipes.find((r) => r.name === 'Mu Hoa Long');
if (sample) {
  console.log(`Sample Mu Hoa Long: thường ${sample.ratesLabel.al0}% · VIP ${sample.ratesLabel.al1}%`);
}
console.log(`Parsed ${recipes.length} recipes.`);
