/**
 * Mã Class trong bảng Character (cột Class) — Mu Online Season 1 / classic byte.
 * Tham chiếu: DW 0–2, DK 16–18, ELF 32–34, MG 48, DL 64.
 */
export const MU_CLASS_NAMES: Readonly<Record<number, string>> = {
  0: 'Dark Wizard',
  1: 'Soul Master',
  2: 'Grand Master',
  16: 'Dark Knight',
  17: 'Blade Knight',
  18: 'Blade Master',
  32: 'Fairy Elf',
  33: 'Muse Elf',
  34: 'High Elf',
  48: 'Magic Gladiator',
  50: 'Dark Lord',
  64: 'Dark Lord',
  65: 'Bloody Summoner',
  66: 'Dimension Master',
  80: 'Rage Fighter',
  81: 'Fist Master',
  96: 'Grow Lancer',
  97: 'Mirage Lancer',
};

export function getMuClassName(classId: number): string {
  return MU_CLASS_NAMES[classId] ?? `Class ${classId}`;
}
