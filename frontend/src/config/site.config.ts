// Site Configuration - Thay đổi thông tin tại đây mà không cần sửa mã nguồn
export const siteConfig = {
  // Thông tin game
  nameGame: "Mu-hnss1.com",
  gameTitle: "Mu Online Season 1",
  gameSubtitle: "Hành trình huyền thoại bắt đầu",
  
  // Thông tin server
  serverName: "Mu-hnss1.com",
  serverVersion: "Season 1",
  serverIP: "127.0.0.1",
  serverPort: "55900",
  
  // Links mạng xã hội
  linkFacebook: "https://facebook.com/Mu-hnss1.com",
  linkDiscord: "https://discord.gg/Mu-hnss1.com",
  linkYoutube: "https://youtube.com/@Mu-hnss1.com",
  linkZalo: "https://zalo.me/Mu-hnss1.com",
  linkTikTok: "https://www.tiktok.com/@Mu-hnss1.com",
  
  // Thông tin liên hệ
  email: "support@Mu-hnss1.com",
  phone: "0123456789",
  address: "Việt Nam",
  
  // Thông tin website
  websiteUrl: "https://Mu-hnss1.com",
  websiteName: "Mu-hnss1.com",
  
  // Thông tin game settings
  expRate: "100x",
  dropRate: "50%",
  resetLevel: 400,
  maxReset: 999,
  
  // Thông tin events
  eventStartDate: "2025-10-10",
  eventStartTime: "13:00",
  
  // SEO & Meta
  metaDescription: "Mu-hnss1.com - Server Mu Online Season 1 với tỷ lệ exp cao, drop rate tốt. Game MMORPG miễn phí, PvP, Guild System, Events đặc biệt.",
  metaKeywords: [
    "Mu Online",
    "Mu Online Season 1",
    "Mu-hnss1.com",
    "Server Mu Online",
    "Game Mu Online Việt Nam"
  ],
  
  // Images
  logoImage: "/icon.jpg",
  bannerImage: "/panael-mu.jpg",
  favicon: "/favicon.ico",
  
  // Colors theme
  primaryColor: "#FFD700",
  secondaryColor: "#FFA500",
  accentColor: "#FF0000",
  
  // Features
  features: {
    pvp: true,
    guild: true,
    events: true,
    reset: true,
    chaosMix: true
  }
};

// Export type for TypeScript
export type SiteConfig = typeof siteConfig;

