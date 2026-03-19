'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, type SiteConfig } from '@/lib/config-api';

const cardClass = 'rounded border border-white/40 bg-black/30 p-4 sm:p-6';
const titleClass = 'text-[#F39C12] font-bold uppercase tracking-wider text-sm mb-3 sm:mb-4';

interface Character {
  name: string;
  level: number;
  class: number;
  className: string;
  resetCount: number;
  masterResetCount: number;
  stats: {
    strength: number;
    dexterity: number;
    vitality: number;
    energy: number;
    leadership: number;
  };
  life: number;
  maxLife: number;
  mana: number;
  maxMana: number;
  money: number;
  mapNumber: number;
  mapPosX: number;
  mapPosY: number;
  pkCount: number;
  pkLevel: number;
}

interface CharacterData {
  name: string;
  level: number;
  experience: number;
  nextLevelExp: number;
  expProgress: number;
  class: number;
  strength: number;
  dexterity: number;
  vitality: number;
  energy: number;
  leadership: number;
  money: number;
  life: number;
  maxLife: number;
  mana: number;
  maxMana: number;
  mapNumber: number;
  mapPosX: number;
  mapPosY: number;
  pkCount: number;
  pkLevel: number;
  resetCount: number;
  masterResetCount: number;
  isOnline: boolean;
  connectTime: string;
  disconnectTime: string;
  totalPlayTime: number;
  playTimeHours: number;
  playTimeMinutes: number;
}

interface ResetData {
  dailyReset: number;
  weeklyReset: number;
  monthlyReset: number;
  lastDailyReset: string;
  lastWeeklyReset: string;
  lastMonthlyReset: string;
  masterDailyReset: number;
  masterWeeklyReset: number;
  masterMonthlyReset: number;
  lastMasterDailyReset: string;
  lastMasterWeeklyReset: string;
  lastMasterMonthlyReset: string;
  totalResetCount: number;
  totalMasterResetCount: number;
}

interface GuildData {
  name: string;
  master: string;
  score: number;
  memberCount: number;
}

interface DashboardData {
  account: {
    id: string;
    characterCount: number;
    level: number;
    levelName: string;
    levelColor: string;
    expireDate: string;
    isExpired: boolean;
  };
  character: CharacterData;
  reset: ResetData;
  warehouse: {
    money: number;
  };
  guild: GuildData | null;
}

// Dữ liệu mẫu khi backend chưa trả về hoặc lỗi
const SAMPLE_CHARACTER: Character = {
  name: 'AdminChar',
  level: 400,
  class: 50,
  className: 'Dark Lord',
  resetCount: 15,
  masterResetCount: 2,
  stats: { strength: 1200, dexterity: 800, vitality: 1000, energy: 600, leadership: 400 },
  life: 4500,
  maxLife: 5000,
  mana: 2000,
  maxMana: 2500,
  money: 5000000,
  mapNumber: 0,
  mapPosX: 130,
  mapPosY: 130,
  pkCount: 0,
  pkLevel: 3,
};

const SAMPLE_DASHBOARD: DashboardData = {
  account: {
    id: 'adminsse',
    characterCount: 1,
    level: 1,
    levelName: 'Đồng',
    levelColor: '#CD7F32',
    expireDate: '2079-06-06',
    isExpired: false,
  },
  character: {
    name: 'AdminChar',
    level: 400,
    experience: 8500000,
    nextLevelExp: 16000000,
    expProgress: 53,
    class: 50,
    strength: 1200,
    dexterity: 800,
    vitality: 1000,
    energy: 600,
    leadership: 400,
    money: 5000000,
    life: 4500,
    maxLife: 5000,
    mana: 2000,
    maxMana: 2500,
    mapNumber: 0,
    mapPosX: 130,
    mapPosY: 130,
    pkCount: 0,
    pkLevel: 3,
    resetCount: 15,
    masterResetCount: 2,
    isOnline: false,
    connectTime: '',
    disconnectTime: '',
    totalPlayTime: 7200,
    playTimeHours: 2,
    playTimeMinutes: 0,
  },
  reset: {
    dailyReset: 1,
    weeklyReset: 1,
    monthlyReset: 1,
    lastDailyReset: '2026-03-15',
    lastWeeklyReset: '2026-03-10',
    lastMonthlyReset: '2026-03-01',
    masterDailyReset: 0,
    masterWeeklyReset: 0,
    masterMonthlyReset: 0,
    lastMasterDailyReset: '',
    lastMasterWeeklyReset: '',
    lastMasterMonthlyReset: '',
    totalResetCount: 15,
    totalMasterResetCount: 2,
  },
  warehouse: { money: 1000000 },
  guild: { name: 'MuLegends', master: 'adminsse', score: 5000, memberCount: 5 },
};

export default function Dashboard() {
  const [user, setUser] = useState<{memb___id: string; memb_name: string} | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [charactersLoading, setCharactersLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(siteConfigStatic as unknown as SiteConfig);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const config = await getSiteConfig();
      if (config) setSiteConfig(config);
    };
    load();
  }, []);

  const getClassName = (classId: number): string => {
    const classNames: {[key: number]: string} = {
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
      64: 'Summoner',
      65: 'Bloody Summoner',
      66: 'Dimension Master',
      80: 'Rage Fighter',
      81: 'Fist Master'
    };
    return classNames[classId] || 'Unknown';
  };

  const formatMoney = (money: number): string => {
    return new Intl.NumberFormat('vi-VN').format(money);
  };

  const formatText = (text: string | null | undefined): string => {
    if (!text) return '';
    // Giữ nguyên nếu là số hoặc có chữ số
    if (/^\d+$/.test(text) || /\d/.test(text)) {
      return text;
    }
    // Format title case: chữ cái đầu viết hoa, còn lại viết thường
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatAccountName = (name: string | null | undefined): string => {
    if (!name) return '';
    // Giữ nguyên nếu có số hoặc ký tự đặc biệt
    if (/\d/.test(name) || /[^a-zA-Z0-9]/.test(name)) {
      return name;
    }
    // Format: chữ cái đầu viết hoa, còn lại viết thường
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const formatTime = (hours: number, minutes: number): string => {
    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }
    return `${minutes} phút`;
  };

  const fetchCharacters = async (accountId: string) => {
    try {
      setCharactersLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/characters?accountId=${accountId}`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      
      if (result.success && result.data?.characters?.length) {
        setCharacters(result.data.characters);
        setSelectedCharacter(result.data.characters[0]);
      } else {
        setCharacters([SAMPLE_CHARACTER]);
        setSelectedCharacter(SAMPLE_CHARACTER);
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
      setCharacters([SAMPLE_CHARACTER]);
      setSelectedCharacter(SAMPLE_CHARACTER);
    } finally {
      setCharactersLoading(false);
    }
  };

  const handleCharacterChange = (characterName: string) => {
    const character = characters.find(char => char.name === characterName);
    if (character) {
      setSelectedCharacter(character);
    }
  };

  const handleUpdateAccount = async (updateData: Record<string, string>) => {
    try {
      setUpdateLoading(true);
      const response = await fetch('/api/account/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: user?.memb___id,
          updateData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Cập nhật thông tin thành công!');
        setShowAccountModal(false);
        // Refresh user data
        const userData = localStorage.getItem('user_data');
        if (userData) {
          const updatedUser = JSON.parse(userData);
          updatedUser.memb_name = updateData.memb_name || updatedUser.memb_name;
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } else {
        alert('Lỗi: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Lỗi khi cập nhật thông tin');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
    try {
      if (!user?.memb___id) {
        alert('Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.');
        return;
      }

      setUpdateLoading(true);
      const response = await fetch('/api/account/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: user.memb___id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Đổi mật khẩu thành công!');
        setShowPasswordModal(false);
      } else {
        alert('Lỗi: ' + result.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Lỗi khi đổi mật khẩu. Vui lòng thử lại.');
    } finally {
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (!token || !userData) {
          router.push('/login');
          return;
        }
        
        // Parse user data để lấy account ID
        const parsedUser = JSON.parse(userData);
        const accountId = parsedUser.memb___id || parsedUser.username || parsedUser.accountId || parsedUser.id;
        
        if (!accountId) {
          console.error('Không tìm thấy account ID');
          router.push('/login');
          return;
        }
        
        console.log('Loading dashboard for account:', accountId);
        
        // Set user từ localStorage trước
        setUser({
          memb___id: accountId,
          memb_name: parsedUser.memb_name || parsedUser.username || parsedUser.characterName || accountId
        });
        
        // Fetch characters first
        await fetchCharacters(accountId);
        
        // Lấy thông tin dashboard từ API với account ID (khi lỗi dùng dữ liệu mẫu)
        try {
          const response = await fetch(`/api/dashboard?accountId=${accountId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'x-user-account': accountId
            }
          });
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              setDashboardData(result.data);
              if (result.data.account?.id) {
                setUser(prev => ({
                  memb___id: result.data.account.id,
                  memb_name: prev?.memb_name || result.data.account.id
                }));
              }
            } else {
              setDashboardData(SAMPLE_DASHBOARD);
            }
          } else {
            setDashboardData(SAMPLE_DASHBOARD);
          }
        } catch {
          setDashboardData(SAMPLE_DASHBOARD);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen relative bg-black flex items-center justify-center">
        <PageBackground />
        <div className="relative z-10 text-gray-400 text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <PageBackground />
      <div className="relative z-10 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-white transition-colors" aria-label="Trang chủ">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <span>/</span>
          <span className="text-gray-300">dashboard</span>
        </div>

        {/* Header: user + character selector + actions */}
        <div className={`${cardClass} mb-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Xin chào</p>
              <p className="text-white font-bold text-lg">{user?.memb_name || '—'}</p>
            </div>
            {characters.length > 0 && (
              <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                <span className="text-gray-400 text-sm shrink-0">Nhân vật:</span>
                <select
                  value={selectedCharacter?.name || ''}
                  onChange={(e) => handleCharacterChange(e.target.value)}
                  disabled={charactersLoading}
                  className="flex-1 bg-black border border-white/30 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F39C12]"
                >
                  {characters.map((char) => (
                    <option key={char.name} value={char.name}>
                      {char.name} ({char.className}) Lv.{char.level}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-2">
              <Link href="/myaccount" className="px-4 py-2 rounded text-sm font-medium text-black shrink-0" style={{ background: '#F39C12' }}>
                Thông tin tài khoản
              </Link>
              <button
                onClick={() => setShowAccountModal(true)}
                className="px-4 py-2 rounded text-sm font-medium border border-white/30 text-white hover:border-[#F39C12] hover:text-[#F39C12] transition-colors"
              >
                Quản lý
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded text-sm font-medium text-white border border-red-500/50 hover:bg-red-500/20 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>


          {/* User Info Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Thông tin tài khoản */}
            <div className={cardClass}>
              <h3 className={titleClass}>Thông tin tài khoản</h3>
              <div className="space-y-2 text-sm">
                <p className="text-white"><span className="text-gray-400">Tên đăng nhập:</span> <span className="text-[#F39C12] font-semibold ml-2">{formatAccountName(user?.memb___id || dashboardData?.account?.id || 'N/A')}</span></p>
                <p className="text-white"><span className="text-gray-400">Nhân vật chính:</span> <span className="text-[#F39C12] font-semibold ml-2">{formatAccountName(dashboardData?.character?.name || selectedCharacter?.name || 'Chưa có')}</span></p>
                <p className="text-white"><span className="text-gray-400">Số nhân vật:</span> <span className="text-white font-semibold ml-2">{dashboardData?.account?.characterCount ?? characters.length ?? 0}</span></p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-gray-400 text-sm">Loại tài khoản:</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: dashboardData?.account?.levelColor || '#808080', color: '#000' }}>
                    {formatText(dashboardData?.account?.levelName || 'Thường')}
                  </span>
                </div>
                {dashboardData?.account?.expireDate && (
                  <p className="text-white text-sm">
                    <span className="text-gray-400">Hết hạn:</span>
                    <span className={dashboardData?.account?.isExpired ? 'text-red-400' : 'text-green-400'}>{new Date(dashboardData.account.expireDate).toLocaleDateString('vi-VN')}</span>
                  </p>
                )}
                <p className="text-white text-sm"><span className="text-gray-400">Trạng thái:</span>
                  <span className={dashboardData?.character?.isOnline ? 'text-green-400' : 'text-red-400'}>{dashboardData?.character?.isOnline ? ' Online' : ' Offline'}</span>
                </p>
              </div>
            </div>

            {/* Trạng thái game */}
            <div className={cardClass}>
              <h3 className={titleClass}>Trạng thái game</h3>
                <div className="space-y-1.5 text-sm">
                  <p className="text-white"><span className="text-gray-400">Server:</span> <span className="text-green-400">Online</span></p>
                  <p className="text-white"><span className="text-gray-400">Cấp độ:</span> <span className="text-[#F39C12]">{selectedCharacter?.level ?? dashboardData?.character?.level ?? 0}</span></p>
                  <p className="text-white"><span className="text-gray-400">Class:</span> <span className="text-[#F39C12]">{formatText(selectedCharacter?.className || getClassName(dashboardData?.character?.class ?? 0))}</span></p>
                  <p className="text-white"><span className="text-gray-400">Kinh nghiệm:</span> <span className="text-[#F39C12]">{formatMoney(dashboardData?.character?.experience ?? 0)} / {formatMoney(dashboardData?.character?.nextLevelExp ?? 0)}</span></p>
                  <div className="w-full bg-black/50 rounded-full h-2 mt-2">
                    <div className="h-2 rounded-full bg-[#F39C12]/80 transition-all" style={{ width: `${dashboardData?.character?.expProgress ?? 0}%` }}></div>
                  </div>
                </div>
            </div>

            {/* Thống kê */}
            <div className={cardClass}>
              <h3 className={titleClass}>Thống kê</h3>
              <div className="space-y-1.5 text-sm">
                <p className="text-white"><span className="text-gray-400">Thời gian chơi:</span> <span className="text-[#F39C12]">{formatTime(dashboardData?.character?.playTimeHours ?? 0, dashboardData?.character?.playTimeMinutes ?? 0)}</span></p>
                <p className="text-white"><span className="text-gray-400">PK Count:</span> <span className="text-[#F39C12]">{selectedCharacter?.pkCount ?? dashboardData?.character?.pkCount ?? 0}</span></p>
                <p className="text-white"><span className="text-gray-400">PK Level:</span> <span className="text-[#F39C12]">{selectedCharacter?.pkLevel ?? dashboardData?.character?.pkLevel ?? 0}</span></p>
                <p className="text-white"><span className="text-gray-400">Vị trí:</span> <span className="text-[#F39C12]">Map {selectedCharacter?.mapNumber ?? dashboardData?.character?.mapNumber ?? 0} ({selectedCharacter?.mapPosX ?? dashboardData?.character?.mapPosX ?? 0}, {selectedCharacter?.mapPosY ?? dashboardData?.character?.mapPosY ?? 0})</span></p>
              </div>
            </div>
          </div>

          {/* Character Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Stats */}
            <div className={cardClass}>
              <h3 className={titleClass}>Chỉ số nhân vật</h3>
              <div className="space-y-2 text-sm">
                {/* Basic Stats */}
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-300 text-xs sm:text-sm">Strength:</span> 
                    <span className="font-bold text-orange-400 text-xs sm:text-base">{selectedCharacter?.stats?.strength ?? dashboardData?.character?.strength ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-300 text-xs sm:text-sm">Dexterity:</span> 
                    <span className="font-bold text-blue-400 text-xs sm:text-base">{selectedCharacter?.stats?.dexterity ?? dashboardData?.character?.dexterity ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-300 text-xs sm:text-sm">Vitality:</span> 
                    <span className="font-bold text-red-400 text-xs sm:text-base">{selectedCharacter?.stats?.vitality ?? dashboardData?.character?.vitality ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-300 text-xs sm:text-sm">Energy:</span> 
                    <span className="font-bold text-purple-400 text-xs sm:text-base">{selectedCharacter?.stats?.energy ?? dashboardData?.character?.energy ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-300 text-xs sm:text-sm">Leadership:</span> 
                    <span className="font-bold text-yellow-400 text-xs sm:text-base">{selectedCharacter?.stats?.leadership ?? dashboardData?.character?.leadership ?? 0}</span>
                  </div>
                </div>
                
                {/* Additional Stats */}
                <div className="pt-2 border-t border-white/10 mt-2 space-y-2 text-sm">
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-300 text-xs sm:text-sm">Level:</span> 
                    <span className="font-bold text-green-400 text-xs sm:text-base">{selectedCharacter?.level ?? dashboardData?.character?.level ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-300 text-xs sm:text-sm">Class:</span> 
                    <span className="font-bold text-cyan-400 text-xs sm:text-base">{formatText(selectedCharacter?.className || getClassName(dashboardData?.character?.class ?? 0))}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-300 text-xs sm:text-sm">PK Count:</span> 
                    <span className="font-bold text-red-300 text-xs sm:text-base">{selectedCharacter?.pkCount ?? dashboardData?.character?.pkCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-300 text-xs sm:text-sm">PK Level:</span> 
                    <span className="font-bold text-red-300 text-xs sm:text-base">{selectedCharacter?.pkLevel ?? dashboardData?.character?.pkLevel ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-300 text-xs sm:text-sm">Reset Count:</span> 
                    <span className="font-bold text-blue-300 text-xs sm:text-base">{selectedCharacter?.resetCount ?? dashboardData?.character?.resetCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 sm:py-2">
                    <span className="text-gray-300 text-xs sm:text-sm">Master Reset:</span> 
                    <span className="font-bold text-purple-300 text-xs sm:text-base">{selectedCharacter?.masterResetCount ?? dashboardData?.character?.masterResetCount ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Life & Mana */}
            <div className={cardClass}>
              <h3 className={titleClass}>HP & MP</h3>
              <div className="space-y-2 text-sm">
                <p className="text-white"><span className="text-gray-400">Life:</span> <span className="text-[#F39C12]">{Math.floor(selectedCharacter?.life ?? dashboardData?.character?.life ?? 0)} / {Math.floor(selectedCharacter?.maxLife ?? dashboardData?.character?.maxLife ?? 0)}</span></p>
                <div className="w-full bg-black/50 rounded-full h-2">
                  <div className="bg-red-500/90 h-2 rounded-full" style={{ width: `${Math.min(100, ((selectedCharacter?.life ?? dashboardData?.character?.life ?? 0) / (selectedCharacter?.maxLife ?? dashboardData?.character?.maxLife ?? 1)) * 100)}%` }}></div>
                </div>
                <p className="text-white"><span className="text-gray-400">Mana:</span> <span className="text-[#F39C12]">{Math.floor(selectedCharacter?.mana ?? dashboardData?.character?.mana ?? 0)} / {Math.floor(selectedCharacter?.maxMana ?? dashboardData?.character?.maxMana ?? 0)}</span></p>
                <div className="w-full bg-black/50 rounded-full h-2">
                  <div className="bg-blue-500/90 h-2 rounded-full" style={{ width: `${Math.min(100, ((selectedCharacter?.mana ?? dashboardData?.character?.mana ?? 0) / (selectedCharacter?.maxMana ?? dashboardData?.character?.maxMana ?? 1)) * 100)}%` }}></div>
                </div>
              </div>
            </div>

            {/* Money */}
            <div className={cardClass}>
              <h3 className={titleClass}>Tiền tệ</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">Tiền nhân vật</p>
                <p className="text-green-400 font-bold">{formatMoney(selectedCharacter?.money ?? dashboardData?.character?.money ?? 0)} Zen</p>
                <p className="text-gray-400 mt-2">Tiền kho</p>
                <p className="text-green-400 font-bold">{formatMoney(dashboardData?.warehouse?.money ?? 0)} Zen</p>
              </div>
            </div>

          </div>

          {/* Reset Info */}
          <div className={`${cardClass} mb-6 sm:mb-8`}>
            <h3 className={titleClass}>Reset</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Reset Thường */}
              <div className="rounded-lg p-4 border border-white/35 bg-black/20">
                <h4 className="text-sm font-semibold text-[#F39C12] mb-2">Reset Thường</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Daily:</span><span className="text-white font-medium">{dashboardData?.reset.dailyReset ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Weekly:</span><span className="text-white font-medium">{dashboardData?.reset.weeklyReset ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Monthly:</span><span className="text-white font-medium">{dashboardData?.reset.monthlyReset ?? 0}</span></div>
                  <div className="pt-2 border-t border-white/10 flex justify-between"><span className="text-gray-400">Tổng:</span><span className="text-[#F39C12] font-bold">{dashboardData?.reset.totalResetCount ?? 0}</span></div>
                </div>
              </div>

              {/* Master Reset */}
              <div className="rounded-lg p-4 border border-white/35 bg-black/20">
                <h4 className="text-sm font-semibold text-[#F39C12] mb-2">Master Reset</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Daily:</span><span className="text-white font-medium">{dashboardData?.reset.masterDailyReset ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Weekly:</span><span className="text-white font-medium">{dashboardData?.reset.masterWeeklyReset ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Monthly:</span><span className="text-white font-medium">{dashboardData?.reset.masterMonthlyReset ?? 0}</span></div>
                  <div className="pt-2 border-t border-white/10 flex justify-between"><span className="text-gray-400">Tổng:</span><span className="text-[#F39C12] font-bold">{dashboardData?.reset.totalMasterResetCount ?? 0}</span></div>
                </div>
              </div>

              {/* Lần Reset Cuối */}
              <div className="rounded-lg p-4 border border-white/35 bg-black/20">
                <h4 className="text-sm font-semibold text-[#F39C12] mb-2">Lần Reset Cuối</h4>
                <div className="space-y-2 text-sm">
                  {dashboardData?.reset.lastDailyReset && (
                    <div className="flex justify-between"><span className="text-gray-400">Daily:</span><span className="text-green-400">{new Date(dashboardData.reset.lastDailyReset).toLocaleDateString('vi-VN')}</span></div>
                  )}
                  {dashboardData?.reset.lastWeeklyReset && (
                    <div className="flex justify-between"><span className="text-gray-400">Weekly:</span><span className="text-green-400">{new Date(dashboardData.reset.lastWeeklyReset).toLocaleDateString('vi-VN')}</span></div>
                  )}
                  {dashboardData?.reset.lastMonthlyReset && (
                    <div className="flex justify-between"><span className="text-gray-400">Monthly:</span><span className="text-green-400">{new Date(dashboardData.reset.lastMonthlyReset).toLocaleDateString('vi-VN')}</span></div>
                  )}
                  {!dashboardData?.reset.lastDailyReset && !dashboardData?.reset.lastWeeklyReset && !dashboardData?.reset.lastMonthlyReset && (
                    <p className="text-gray-500 text-sm py-2">Chưa có dữ liệu reset</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Guild Info */}
          {dashboardData?.guild && (
            <div className={`${cardClass} mb-6 sm:mb-8`}>
              <h3 className={titleClass}>Thông tin Guild</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-400">Tên Guild:</span><span className="text-white font-medium">{dashboardData.guild.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Guild Master:</span><span className="text-white font-medium">{dashboardData.guild.master}</span></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-400">Điểm số:</span><span className="text-[#F39C12] font-medium">{formatMoney(dashboardData.guild.score)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Thành viên:</span><span className="text-white font-medium">{dashboardData.guild.memberCount}</span></div>
                </div>
              </div>
            </div>
          )}
      </div>



      {/* Account Management Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="rounded border border-white/40 bg-[#1a1a1d] p-6 w-full max-w-md">
            <h3 className="text-[#F39C12] font-bold uppercase tracking-wider text-sm mb-4">Quản lý tài khoản</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Tên hiển thị</label>
                <input type="text" defaultValue={user?.memb_name || ''} id="memb_name" className="w-full bg-black border border-white/30 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F39C12]" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Email</label>
                <input type="email" id="mail_addr" className="w-full bg-black border border-white/30 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F39C12]" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Số điện thoại</label>
                <input type="tel" id="phon_numb" className="w-full bg-black border border-white/30 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F39C12]" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { const updateData = { memb_name: (document.getElementById('memb_name') as HTMLInputElement)?.value, mail_addr: (document.getElementById('mail_addr') as HTMLInputElement)?.value, phon_numb: (document.getElementById('phon_numb') as HTMLInputElement)?.value }; handleUpdateAccount(updateData); }} disabled={updateLoading} className="flex-1 py-2.5 rounded font-medium text-black text-sm disabled:opacity-50" style={{ background: '#F39C12' }}>{updateLoading ? 'Đang cập nhật...' : 'Cập nhật'}</button>
                <button onClick={() => { setShowAccountModal(false); setShowPasswordModal(true); }} className="flex-1 py-2.5 rounded font-medium border border-white/30 text-white text-sm hover:border-[#F39C12]">Đổi mật khẩu</button>
              </div>
              <button onClick={() => setShowAccountModal(false)} className="w-full py-2.5 rounded font-medium border border-white/35 text-gray-400 text-sm hover:text-white">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="rounded border border-white/40 bg-[#1a1a1d] p-6 w-full max-w-md">
            <h3 className="text-[#F39C12] font-bold uppercase tracking-wider text-sm mb-4">Đổi mật khẩu</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Mật khẩu hiện tại</label>
                <input type="password" id="currentPassword" className="w-full bg-black border border-white/30 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F39C12]" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Mật khẩu mới</label>
                <input type="password" id="newPassword" className="w-full bg-black border border-white/30 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F39C12]" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Xác nhận mật khẩu mới</label>
                <input type="password" id="confirmPassword" className="w-full bg-black border border-white/30 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F39C12]" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { const currentPassword = (document.getElementById('currentPassword') as HTMLInputElement)?.value; const newPassword = (document.getElementById('newPassword') as HTMLInputElement)?.value; const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement)?.value; if (newPassword !== confirmPassword) { alert('Mật khẩu xác nhận không khớp!'); return; } handleChangePassword({ currentPassword, newPassword }); }} disabled={updateLoading} className="flex-1 py-2.5 rounded font-medium text-black text-sm disabled:opacity-50" style={{ background: '#F39C12' }}>{updateLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}</button>
                <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-2.5 rounded font-medium border border-white/30 text-white text-sm">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
