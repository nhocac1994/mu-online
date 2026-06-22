export type RankingTabId =
  | 'level'
  | 'killers'
  | 'guild'
  | 'online'
  | 'blood-castle'
  | 'devil-square'
  | 'chaos-castle'
  | 'kundun'
  | 'erohim'
  | 'red-dragon';

export type RankingTab = {
  id: RankingTabId;
  label: string;
  type: 'character' | 'guild';
  scoreLabel: string;
  description: string;
};

export const RANKING_TABS: RankingTab[] = [
  {
    id: 'level',
    label: 'Top Resets',
    type: 'character',
    scoreLabel: 'Resets',
    description: 'Xếp hạng theo tổng số resets (ResetCount)',
  },
  {
    id: 'killers',
    label: 'Top Killers',
    type: 'character',
    scoreLabel: 'PK',
    description: 'Xếp hạng theo số lần PK (PkCount)',
  },
  {
    id: 'guild',
    label: 'Top Guilds',
    type: 'guild',
    scoreLabel: 'Điểm',
    description: 'Xếp hạng theo điểm guild (G_Score)',
  },
  {
    id: 'online',
    label: 'Top Online',
    type: 'character',
    scoreLabel: 'Giờ',
    description: 'Xếp hạng theo tổng giờ online (OnlineHours)',
  },
  {
    id: 'blood-castle',
    label: 'Top Huyết Lâu',
    type: 'character',
    scoreLabel: 'Điểm',
    description: 'Bảng RankingBloodCastle — điểm sự kiện Huyết Lâu',
  },
  {
    id: 'devil-square',
    label: 'Top Quảng Trường Quỷ',
    type: 'character',
    scoreLabel: 'Điểm',
    description: 'Bảng RankingDevilSquare — điểm Quảng Trường Quỷ',
  },
  {
    id: 'chaos-castle',
    label: 'Top Hỗn Nguyên Lâu',
    type: 'character',
    scoreLabel: 'Điểm',
    description: 'Bảng RankingChaosCastle — điểm Hỗn Nguyên Lâu',
  },
  {
    id: 'kundun',
    label: 'Top Săn Kundun',
    type: 'character',
    scoreLabel: 'Lần',
    description: 'Số lần hạ boss Kundun (MonsterKillCount)',
  },
  {
    id: 'erohim',
    label: 'Top Săn Erohim',
    type: 'character',
    scoreLabel: 'Lần',
    description: 'Số lần hạ boss Erohim (MonsterKillCount)',
  },
  {
    id: 'red-dragon',
    label: 'Top Săn Rồng Đỏ',
    type: 'character',
    scoreLabel: 'Lần',
    description: 'Số lần hạ Rồng Đỏ (MonsterKillCount)',
  },
];

/** Hàng 1 + 2: mỗi hàng 5 tab — lưới 5 cột cân đối */
export const RANKING_TAB_ROWS: RankingTabId[][] = [
  ['level', 'killers', 'guild', 'online', 'blood-castle'],
  ['devil-square', 'chaos-castle', 'kundun', 'erohim', 'red-dragon'],
];

export function getRankingTab(id: RankingTabId): RankingTab | undefined {
  return RANKING_TABS.find((t) => t.id === id);
}
