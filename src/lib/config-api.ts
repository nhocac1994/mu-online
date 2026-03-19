import { getBackendUrl } from '@/config/backend.config';

export interface EventConfig {
  id: number;
  name: string;
  schedule: {
    type: 'hourly' | 'specific';
    interval?: number;
    startMinute?: number;
    times?: string[];
    duration: number;
  };
  color: string;
}

export interface DownloadLinks {
  mediafire: string;
  mega: string;
  clientVersion: string;
}

export interface SocialMedia {
  facebook?: string;
  youtube?: string;
  discord?: string;
  zalo?: string;
  tiktok?: string;
}

export interface BankTransfer {
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  qrCodeUrl: string;
}

export interface ServerInfo {
  name: string;
  version: string;
  expRate: string;
  dropRate: string;
}

export interface SiteConfig {
  nameGame?: string;
  gameTitle?: string;
  gameSubtitle?: string;
  serverName?: string;
  serverVersion?: string;
  phone?: string;
  email?: string;
  address?: string;
  websiteUrl?: string;
  websiteName?: string;
  linkFacebook?: string;
  linkDiscord?: string;
  linkYoutube?: string;
  linkZalo?: string;
  linkTikTok?: string;
  events: EventConfig[];
  downloadLinks: DownloadLinks;
  socialMedia: SocialMedia;
  bankTransfer: BankTransfer;
  serverInfo: ServerInfo;
}

/**
 * Lấy tất cả config từ backend
 */
export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const url = getBackendUrl('/api/config');
    console.log('🌐 Gọi API:', url);
    
    const response = await fetch(url, {
      cache: 'no-store', // Không cache, luôn fetch mới
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('❌ API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('❌ Error body:', errorText);
      return null;
    }
    
    const result = await response.json();
    console.log('📦 API response:', result);
    
    if (result.success && result.data) {
      const data = result.data as SiteConfig;
      // Map socialMedia sang link* để component cũ vẫn dùng được (backend chỉ còn socialMedia)
      return {
        ...data,
        linkFacebook: data.linkFacebook ?? data.socialMedia?.facebook,
        linkDiscord: data.linkDiscord ?? data.socialMedia?.discord,
        linkYoutube: data.linkYoutube ?? data.socialMedia?.youtube,
        linkZalo: data.linkZalo ?? data.socialMedia?.zalo,
        linkTikTok: data.linkTikTok ?? data.socialMedia?.tiktok,
      };
    }
    console.warn('⚠️ API response không thành công:', result);
    return null;
  } catch (error) {
    console.error('❌ Get site config error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('💡 Có thể backend chưa chạy hoặc URL không đúng');
      console.error('💡 Kiểm tra:', getBackendUrl('/api/config'));
    }
    return null;
  }
}

/**
 * Lấy config sự kiện
 */
export async function getEventsConfig(): Promise<EventConfig[]> {
  try {
    const response = await fetch(getBackendUrl('/api/config/events'), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('Get events config error:', error);
    return [];
  }
}

/**
 * Lấy config download links
 */
export async function getDownloadConfig(): Promise<DownloadLinks | null> {
  try {
    const response = await fetch(getBackendUrl('/api/config/download'), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Get download config error:', error);
    return null;
  }
}

/**
 * Lấy config mạng xã hội
 */
export async function getSocialMediaConfig(): Promise<SocialMedia | null> {
  try {
    const response = await fetch(getBackendUrl('/api/config/social'), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Get social media config error:', error);
    return null;
  }
}

/**
 * Lấy config chuyển khoản
 */
export async function getBankTransferConfig(): Promise<BankTransfer | null> {
  try {
    const response = await fetch(getBackendUrl('/api/config/bank'), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Get bank transfer config error:', error);
    return null;
  }
}

/**
 * Lấy config server info
 */
export async function getServerInfoConfig(): Promise<ServerInfo | null> {
  try {
    const response = await fetch(getBackendUrl('/api/config/server'), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Get server info config error:', error);
    return null;
  }
}
