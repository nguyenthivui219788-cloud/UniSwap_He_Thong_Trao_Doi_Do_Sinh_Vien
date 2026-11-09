export type CampusCluster = 'all' | 'lang-dh' | 'q5' | 'q10' | 'nam-sai-gon' | 'binh-thanh';

export type MajorGroup = 
  | 'all'
  | 'it'           // CNTT & Phần mềm
  | 'economics'    // Kinh tế - QTKD - Marketing
  | 'engineering'  // Kỹ thuật - Cơ khí - Điện tử
  | 'medical'      // Y - Dược
  | 'architecture' // Kiến trúc - Mỹ thuật
  | 'general';     // Đại cương & Dùng chung

export type TradeType = 'sale' | 'swap' | 'giveaway' | 'borrow';

export interface University {
  id: string;
  name: string;
  code: string;
  domain: string;
  cluster: CampusCluster;
  spots: string[];
}

export interface User {
  buyerPremium?: boolean; sellerPremium?: boolean; buyerUntil?:number; sellerUntil?:number;
  limits?: {holds:number;posts:number;images:number;buyRequests:number;priceAlerts:number;savedSearches:number};
  verificationMode?: 'local' | 'email';
  imageLimit?: number;
  savedSearchLimit?: number;
  quota?: number;
  bio?: string;
  subscription?: {plan:string;expires:number}|null;
  purpose?: 'buyer' | 'seller' | 'both';
  id: string;
  name: string;
  email: string;
  studentId: string;
  universityCode: string;
  universityName: string;
  faculty: string;
  year: string;
  avatar: string;
  isVerified: boolean;
  tier: 'free' | 'hunter_pro';
  pushCredits: number;
  rating: number;
  dealCount: number;
  role: 'student' | 'admin';
}

export interface ProductItem {
  id: string;
  title: string;
  price: number; // 0 for giveaway
  tradeType: TradeType;
  swapFor?: string; // e.g. "Đổi lấy sách Giải tích 2"
  borrowDuration?: string; // e.g. "Mượn 1 ngày đi thi"
  category: 'books' | 'electronics' | 'dorm' | 'stationery' | 'fashion' | 'sports' | 'handmade' | 'other';
  keywords?:string[];
  demoVersion?:number;
  subcategory?:string;
  conditionGroup?:string;
  majorGroup: MajorGroup;
  description: string;
  condition: string; // e.g. "99% như mới", "Đã ghi chú bút chì"
  images: string[];
  seller: {
    id: string;
    name: string;
    studentId: string;
    universityCode: string;
    avatar: string;
    rating: number;
    isVerified: boolean;
    isPro: boolean;
  };
  cluster: CampusCluster;
  meetingSpot: string; // e.g. "KTX Khu B - Tòa B3", "Canteen ĐH Bách Khoa CS2"
  createdAt: string;
  isUrgent?: boolean;
  isPushed?: boolean;
  pushedAt?: string;
  pushedDuration?: string; // e.g. "Ưu tiên 3 ngày"
  status: 'available' | 'reserved' | 'completed' | 'draft' | 'paused' | 'expired' | 'lent' | 'deleted';
  views: number;
  inquiries?: number;
  likes: number;
  location?: { lat: number; lng: number };
  isDemo?: boolean;
  moderation?: 'hidden';
  specs?: Record<string,string>;
  expiresAt?: string;
  pushedUntil?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSpotSuggestion?: boolean;
  spotName?: string;
}
