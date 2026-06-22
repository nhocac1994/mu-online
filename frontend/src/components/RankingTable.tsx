'use client';

import { useState, useEffect, useRef } from 'react';
import { RANKING_LEVEL_FALLBACK } from '@/lib/ranking-fallback-data';
import type { CharacterRankingRow } from '@/lib/ranking-api';

function isSameRankingData(a: CharacterRankingRow[], b: CharacterRankingRow[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, i) => {
    const o = b[i];
    return (
      o &&
      item.character === o.character &&
      item.score === o.score &&
      (item.level ?? 0) === (o.level ?? 0)
    );
  });
}

interface RankingTableProps {
  title: string;
  endpoint: string;
  scoreLabel?: string;
  enableSearch?: boolean;
  embedded?: boolean;
}

const CLASS_SHORT: Record<number, string> = {
  0: 'DW', 1: 'SM', 2: 'GM', 16: 'DK', 17: 'BK', 18: 'BM',
  32: 'FE', 33: 'ME', 34: 'HE', 48: 'MG', 50: 'DL', 64: 'DL',
  65: 'BS', 66: 'DM', 80: 'RF', 81: 'FM',
};

const SAMPLE_CHARACTERS: CharacterRankingRow[] = RANKING_LEVEL_FALLBACK.map((c) => ({
  account: c.account,
  character: c.character,
  class: c.class,
  score: c.resets,
  level: c.level,
  isOnline: c.isOnline,
}));

export default function RankingTable({
  endpoint,
  scoreLabel = 'Resets',
  enableSearch = false,
}: RankingTableProps) {
  const [characters, setCharacters] = useState<CharacterRankingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [dataSource, setDataSource] = useState<'database' | 'fallback' | 'cache' | null>(null);
  const lastDataRef = useRef<CharacterRankingRow[]>([]);
  const isMountedRef = useRef(true);
  const fetchIdRef = useRef(0);

  const fetchRankings = async (searchName?: string, requestId?: number) => {
    const activeRequestId = requestId ?? fetchIdRef.current;
    try {
      const isInitial = lastDataRef.current.length === 0 && !searchName;
      if (isInitial) setLoading(true);
      setIsSearching(!!searchName);

      const url = searchName
        ? `/api/characters/search?name=${encodeURIComponent(searchName)}`
        : `/api/rankings/${endpoint}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!isMountedRef.current || activeRequestId !== fetchIdRef.current) return;

      if (data.success && Array.isArray(data.data)) {
        const metaSource = data.meta?.source as string | undefined;
        if (metaSource === 'database') {
          setDataSource('database');
        } else if (metaSource === 'fallback') {
          setDataSource('fallback');
        } else if (data.message?.includes('cache')) {
          setDataSource('cache');
        }

        const newData: CharacterRankingRow[] = data.data.map((char: Record<string, unknown>) => ({
          account: String(char.account ?? char.AccountID ?? ''),
          character: String(char.character ?? char.Name ?? ''),
          class: Number(char.class ?? char.Class ?? 0),
          score: Number(char.score ?? char.Score ?? char.resets ?? char.ResetCount ?? 0),
          level: char.level != null ? Number(char.level) : char.cLevel != null ? Number(char.cLevel) : null,
          isOnline: (char.isOnline ?? char.IsOnline ?? 0) as number | boolean,
        }));

        if (!isSameRankingData(lastDataRef.current, newData)) {
          lastDataRef.current = newData;
          setCharacters(newData);
        } else if (newData.length === 0) {
          lastDataRef.current = newData;
          setCharacters(newData);
        }
        setIsSearchMode(!!searchName);
      } else if (!searchName && lastDataRef.current.length === 0) {
        lastDataRef.current = SAMPLE_CHARACTERS;
        setCharacters(SAMPLE_CHARACTERS);
      } else if (searchName) {
        setCharacters([]);
      }
    } catch {
      if (!isMountedRef.current || activeRequestId !== fetchIdRef.current) return;
      if (!searchName && lastDataRef.current.length === 0) {
        lastDataRef.current = SAMPLE_CHARACTERS;
        setCharacters(SAMPLE_CHARACTERS);
      } else if (searchName) {
        setCharacters([]);
      }
    } finally {
      if (isMountedRef.current && activeRequestId === fetchIdRef.current) {
        setLoading(false);
        setIsSearching(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    const requestId = ++fetchIdRef.current;
    setSearchTerm('');
    setIsSearchMode(false);
    setDataSource(null);
    lastDataRef.current = [];
    setCharacters([]);
    setLoading(true);
    fetchRankings(undefined, requestId);
    return () => {
      isMountedRef.current = false;
    };
  }, [endpoint]);

  return (
    <div>
      {enableSearch && (
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchRankings(searchTerm.trim() || undefined)}
          placeholder="Gõ tên nhân vật để lọc nhanh trong danh sách..."
          className="we-rank-search"
        />
      )}

      {dataSource === 'fallback' && (
        <p style={{ fontSize: 12, color: '#b45309', margin: '0 0 10px', textAlign: 'center' }}>
          Đang hiển thị dữ liệu mẫu — backend tạm thời không phản hồi (thường do HTTP 429). Thử tải lại sau vài giây.
        </p>
      )}

      {dataSource === 'cache' && (
        <p style={{ fontSize: 12, color: '#b45309', margin: '0 0 10px', textAlign: 'center' }}>
          Đang hiển thị dữ liệu cache — backend tạm thời quá tải. Dữ liệu có thể chậm vài phút so với game.
        </p>
      )}

      {loading ? (
        <div className="we-loading-center"><div className="we-spinner" /></div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="we-rank-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Country</th>
                <th>Class</th>
                <th>Character</th>
                <th>Level</th>
                <th>{scoreLabel}</th>
              </tr>
            </thead>
            <tbody>
              {characters.map((char, index) => (
                <tr key={`${char.account}-${char.character}`}>
                  <td>{index + 1}</td>
                  <td>🇻🇳</td>
                  <td>
                    <span className="we-class-badge">{CLASS_SHORT[char.class] || '?'}</span>
                  </td>
                  <td className="char-name">
                    {char.character}
                    <span
                      className={`we-status-dot ${char.isOnline === 1 || char.isOnline === true ? 'we-status-online' : 'we-status-offline'}`}
                    />
                  </td>
                  <td>{char.level ?? '—'}</td>
                  <td style={{ fontWeight: 700 }}>{char.score.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {characters.length === 0 && (
            <p style={{ textAlign: 'center', padding: 20, color: '#999', fontSize: 13 }}>
              {isSearchMode
                ? `Không tìm thấy nhân vật "${searchTerm}"`
                : dataSource === 'database'
                  ? 'Chưa có người chơi trong bảng xếp hạng này (database trống).'
                  : 'Chưa có dữ liệu xếp hạng — thử tải lại trang sau vài giây.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
