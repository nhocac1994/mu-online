'use client';

import { useState, useEffect, useRef } from 'react';

function isSameGuildData(a: GuildRank[], b: GuildRank[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, i) => {
    const o = b[i];
    return o && item.guildName === o.guildName && (item.score ?? 0) === (o.score ?? 0) && (item.memberCount ?? 0) === (o.memberCount ?? 0);
  });
}

interface GuildRank {
  guildName: string;
  score: number;
  guildMaster: string;
  memberCount: number;
  guildMark?: string | null;
}

// Dữ liệu mẫu khi backend chưa trả về hoặc lỗi
const SAMPLE_GUILDS: GuildRank[] = [
  { guildName: 'MuOnline', guildMaster: 'Demonu', memberCount: 1, score: 1000 },
  { guildName: 'DragonSlayer', guildMaster: 'TestMu', memberCount: 12, score: 800 },
  { guildName: 'Phoenix', guildMaster: 'Mazoku', memberCount: 8, score: 600 },
  { guildName: 'Shadow', guildMaster: 'DarkKnight', memberCount: 5, score: 400 },
  { guildName: 'Legends', guildMaster: 'TestMu3', memberCount: 3, score: 200 },
];

interface GuildRankingTableProps {
  title: string;
  endpoint: string;
  embedded?: boolean;
}

export default function GuildRankingTable({ title, endpoint, embedded }: GuildRankingTableProps) {
  const [guilds, setGuilds] = useState<GuildRank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingSample, setIsAddingSample] = useState(false);
  const lastDataRef = useRef<GuildRank[]>([]);
  const isMountedRef = useRef(true);

  const fetchGuildRankings = async () => {
    try {
      const isInitial = lastDataRef.current.length === 0;
      if (isInitial) setLoading(true);

      const response = await fetch(`/api/rankings/${endpoint}`);
      const data = await response.json();

      if (!isMountedRef.current) return;

      if (data.success && Array.isArray(data.data)) {
        const newData = data.data;
        if (!isSameGuildData(lastDataRef.current, newData)) {
          lastDataRef.current = newData;
          setGuilds(newData);
        }
        setError(null);
      } else {
        setError(null);
        if (lastDataRef.current.length === 0) {
          lastDataRef.current = SAMPLE_GUILDS;
          setGuilds(SAMPLE_GUILDS);
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(null);
        if (lastDataRef.current.length === 0) {
          lastDataRef.current = SAMPLE_GUILDS;
          setGuilds(SAMPLE_GUILDS);
        }
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const addSampleGuilds = async () => {
    try {
      setIsAddingSample(true);
      const response = await fetch('/api/guilds/sample', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        // Reload data after adding samples
        await fetchGuildRankings();
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (err) {
      alert('Lỗi khi thêm dữ liệu mẫu');
    } finally {
      setIsAddingSample(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchGuildRankings();
    return () => { isMountedRef.current = false; };
  }, [endpoint]);

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getGuildLogo = (guildName: string) => {
    if (!guildName) return null;
    
    // Tạo logo đơn giản từ tên guild
    const firstLetter = guildName.charAt(0).toUpperCase();
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 
      'bg-purple-500', 'bg-yellow-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-orange-500', 'bg-teal-500', 'bg-cyan-500'
    ];
    const colorIndex = guildName.length % colors.length;
    
    return (
      <div className={`w-6 h-6 sm:w-8 sm:h-8 ${colors[colorIndex]} rounded flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg`}>
        {firstLetter}
      </div>
    );
  };

  const formatValue = (value: number | string) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value.toString();
  };

  const wrapperClass = embedded ? 'p-0' : 'rounded border border-white/40 bg-black/30 p-4 sm:p-8';
  const showTitle = !embedded;

  if (loading) {
    return (
      <div className={wrapperClass}>
        {showTitle && <h2 className="text-lg sm:text-2xl mu-retro-title-small mb-4 text-center">{title}</h2>}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {showTitle && <h2 className="text-lg sm:text-2xl mu-retro-title-small mb-4 sm:mb-6 text-center">{title}</h2>}
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-base">
          <thead>
            <tr className="border-b" style={{ borderColor: '#FFD700' }}>
              <th className="text-left py-2 sm:py-4 px-2 sm:px-4 mu-text-gold font-bold text-xs sm:text-lg">Hạng</th>
              <th className="text-left py-2 sm:py-4 px-2 sm:px-4 mu-text-gold font-bold text-xs sm:text-lg">Logo</th>
              <th className="text-left py-2 sm:py-4 px-2 sm:px-4 mu-text-gold font-bold text-xs sm:text-lg">Tên Guild</th>
              <th className="text-left py-2 sm:py-4 px-2 sm:px-4 mu-text-gold font-bold text-xs sm:text-lg">Guild Master</th>
              <th className="text-left py-2 sm:py-4 px-2 sm:px-4 mu-text-gold font-bold text-xs sm:text-lg">Thành viên</th>
              <th className="text-left py-2 sm:py-4 px-2 sm:px-4 mu-text-gold font-bold text-xs sm:text-lg">Điểm số</th>
            </tr>
          </thead>
          <tbody>
            {guilds.map((guild, index) => (
              <tr key={guild.guildName} className="border-b border-gray-700/50 hover:bg-black/20 transition-colors">
                <td className="py-2 sm:py-4 px-2 sm:px-4 mu-text-gold font-bold text-xs sm:text-lg">
                  {getRankIcon(index)}
                </td>
                <td className="py-2 sm:py-4 px-2 sm:px-4">
                  {getGuildLogo(guild.guildName)}
                </td>
                <td className="py-2 sm:py-4 px-2 sm:px-4 text-white font-medium text-xs sm:text-lg">
                  {guild.guildName || 'Unknown'}
                </td>
                <td className="py-2 sm:py-4 px-2 sm:px-4 text-blue-300 text-xs sm:text-lg">
                  {guild.guildMaster || 'Unknown'}
                </td>
                <td className="py-2 sm:py-4 px-2 sm:px-4 text-green-300 text-xs sm:text-lg">
                  {formatValue(guild.memberCount)}
                </td>
                <td className="py-2 sm:py-4 px-2 sm:px-4 text-purple-300 font-bold text-xs sm:text-lg">
                  {formatValue(guild.score)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {guilds.length === 0 && (
        <div className="text-center text-gray-400 py-4 sm:py-8">
          <div className="mb-4">
            <div className="text-4xl sm:text-6xl mb-2">🏰</div>
            <p className="text-sm sm:text-lg font-medium">Chưa có thông tin</p>
            <p className="text-xs sm:text-sm mt-2 mb-4">Có thể database chưa có guild nào hoặc dữ liệu chưa được cập nhật</p>
            <button
              onClick={addSampleGuilds}
              disabled={isAddingSample}
              className="px-4 py-2 rounded font-medium text-sm disabled:opacity-50 text-black"
            style={{ background: '#F39C12' }}
            >
              {isAddingSample ? 'Đang thêm...' : '➕ Thêm dữ liệu mẫu'}
            </button>
          </div>
        </div>
      )}
      
      {guilds.length > 0 && (
        <div className="mt-4 text-center text-gray-400 text-xs sm:text-sm">
          Hiển thị {guilds.length} guild đầu tiên
        </div>
      )}
    </div>
  );
}
