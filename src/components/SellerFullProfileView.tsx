import React, { useState } from "react";
import {
  Star,
  CheckCircle2,
  Package,
  Clock,
  Calendar,
  Check,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Building,
  BookOpen,
  FileText,
  Camera,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  X,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";

export interface SellerFullProfileViewProps {
  sellerName?: string;
  verified?: boolean;
  school?: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  responseRate?: string;
  avgResponseTime?: string;
  joinDate?: string;
  bio?: string;
  studentInfo?: {
    university: string;
    major: string;
    cohort: string;
    program: string;
  };
  onBackToChat: () => void;
}

export function SellerFullProfileView({
  sellerName = "Nguyễn Văn An",
  verified = true,
  school = "Đại học Bách Khoa TP.HCM (TP.HCM)",
  avatar = "/assets/detail/seller-avatar.png",
  rating = 4.8,
  reviewCount = 24,
  soldCount = 56,
  responseRate = "98%",
  avgResponseTime = "2 giờ",
  joinDate = "09/2025",
  bio = "Mình là sinh viên năm 3, chuyên bán đồ điện tử, sách và đồ dùng học tập. Giao dịch nhanh chóng, uy tín. Có thể nhắn tin trước để thương lượng nhé!",
  studentInfo = {
    university: "Đại học Bách Khoa TP.HCM",
    major: "Công nghệ thông tin",
    cohort: "K2022",
    program: "Đại học chính quy",
  },
  onBackToChat,
}: SellerFullProfileViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "reviews" | "deals" | "campus"
  >("overview");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 4 Sản phẩm đang bán chuẩn 100% theo Ảnh 2
  const sellerProducts = [
    {
      id: "prod-mac-m1",
      title: "Macbook Air M1 2020 (8GB/256GB)",
      price: "7.500.000đ",
      category: "Laptop",
      image: "/assets/detail/macbook-main.png",
      fallback: "/assets/detail/detail-macbook-main.png",
    },
    {
      id: "prod-book-macro",
      title: "Giáo trình Kinh tế vĩ mô (NEU)",
      price: "120.000đ",
      category: "Sách",
      image: "/assets/detail/book-detail-1.png",
      fallback: "/assets/3d-books.png",
    },
    {
      id: "prod-shoes-adidas",
      title: "Giày thể thao Adidas (Size 42)",
      price: "550.000đ",
      category: "Giày dép",
      image: "/assets/detail/shoes-detail-1.png",
      fallback: "/assets/3d-fashion.png",
    },
    {
      id: "prod-backpack",
      title: "Balo laptop 15.6 inch (đã sử dụng)",
      price: "250.000đ",
      category: "Phụ kiện",
      image: "/assets/detail/backpack-detail-1.png",
      fallback: "/assets/detail/thumb-1.png",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#f8faf8] pb-16 animate-in fade-in duration-150">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-5 space-y-4">
        {/* =================================================================== */}
        {/* HERO CARD HỒ SƠ NGƯỜI BÁN (ĐÚNG 100% THEO ẢNH 2)                     */}
        {/* =================================================================== */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xs p-6 sm:p-7 relative overflow-hidden">
          {/* Nền cong nghệ thuật nhạt */}
          <div className="absolute top-0 left-0 w-80 h-36 bg-emerald-50/60 rounded-full -translate-x-24 -translate-y-16 pointer-events-none blur-xl" />
          <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-50/50 rounded-full translate-x-20 -translate-y-16 pointer-events-none blur-xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Cột trái: Avatar + Tên + Đã xác minh + Vị trí + Rating */}
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="relative shrink-0">
                <img
                  src={avatar}
                  alt={sellerName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md bg-white ring-2 ring-emerald-500/20"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/detail/seller-avatar.png";
                  }}
                />
                {verified && (
                  <span className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-[26px] font-black text-gray-900 tracking-tight">
                    {sellerName}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 shrink-0" />
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mt-1">
                  <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sinh viên đã xác minh</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{school}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 mt-1.5">
                  <span className="text-amber-500 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{rating}</span>
                  </span>
                  <span className="text-gray-400 font-normal">
                    ({reviewCount} đánh giá)
                  </span>
                </div>
              </div>
            </div>

            {/* Cột giữa: 3 Huy hiệu + Bio + 4 Stats */}
            <div className="flex-1 lg:max-w-[560px] lg:border-l lg:border-gray-100 lg:pl-6 space-y-3">
              {/* 3 Huy hiệu */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-bold shadow-2xs">
                  <span className="text-emerald-600">🌿</span>
                  <span>Uy tín</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-bold shadow-2xs">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Giao dịch thật</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-bold shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Campus Check</span>
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs text-gray-600 leading-relaxed font-normal">
                {bio}
              </p>

              {/* 4 Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200/70 flex items-center justify-center text-gray-700 shrink-0">
                    <Package className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">{soldCount}</div>
                    <div className="text-[10px] text-gray-400 font-medium leading-tight">
                      Sản phẩm đang bán
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200/70 flex items-center justify-center text-gray-700 shrink-0">
                    <MessageCircle className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-emerald-700">{responseRate}</div>
                    <div className="text-[10px] text-gray-400 font-medium leading-tight">
                      Phản hồi
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200/70 flex items-center justify-center text-gray-700 shrink-0">
                    <Clock className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">{avgResponseTime}</div>
                    <div className="text-[10px] text-gray-400 font-medium leading-tight">
                      Thời gian phản hồi TB
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200/70 flex items-center justify-center text-gray-700 shrink-0">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-gray-900">{joinDate}</div>
                    <div className="text-[10px] text-gray-400 font-medium leading-tight">
                      Tham gia từ
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: 3 Nút tác vụ + Chữ nghệ thuật máy bay giấy */}
            <div className="flex flex-col items-end justify-between self-stretch shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center gap-2.5">
                {/* NÚT CHAT NGAY: QUAY LẠI MÀN HÌNH CHAT */}
                <button
                  type="button"
                  onClick={onBackToChat}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#06462e] hover:bg-[#0a5c3e] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat ngay</span>
                </button>

                {/* Nút Theo dõi */}
                <button
                  type="button"
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isFollowing
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isFollowing ? "fill-emerald-600 text-emerald-600" : "text-gray-500"
                    }`}
                  />
                  <span>{isFollowing ? "Đang theo dõi" : "Theo dõi"}</span>
                </button>

                {/* Nút 3 chấm */}
                <button
                  type="button"
                  className="w-9 h-9 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                  title="Tùy chọn khác"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Dòng chữ trang trí: Sinh viên kết nối cộng đồng ✈ */}
              <div className="hidden lg:flex items-center gap-2 text-emerald-700/80 font-semibold italic text-xs pt-4 select-none">
                <span style={{ fontFamily: "cursive, sans-serif" }}>
                  Sinh viên kết nối cộng đồng
                </span>
                <span className="text-sm">✈</span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* THANH TABS ĐIỀU HƯỚNG NGANG (ĐÚNG THEO ẢNH 2)                        */}
        {/* =================================================================== */}
        <div className="flex items-center gap-6 sm:gap-8 border-b border-gray-200/80 pt-2 px-2 text-xs sm:text-sm font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer relative shrink-0 ${
              activeTab === "overview"
                ? "text-[#06462e] font-black border-b-2 border-[#06462e]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>🏠 Tổng quan</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer relative shrink-0 ${
              activeTab === "products"
                ? "text-[#06462e] font-black border-b-2 border-[#06462e]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>🛍️ Sản phẩm đang bán (8)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer relative shrink-0 ${
              activeTab === "reviews"
                ? "text-[#06462e] font-black border-b-2 border-[#06462e]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>⭐ Đánh giá (24)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("deals")}
            className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer relative shrink-0 ${
              activeTab === "deals"
                ? "text-[#06462e] font-black border-b-2 border-[#06462e]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>📋 Lịch sử giao dịch</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("campus")}
            className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer relative shrink-0 ${
              activeTab === "campus"
                ? "text-[#06462e] font-black border-b-2 border-[#06462e]"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <span>🛡️ Campus Check</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* BỐ CỤC 3 CỘT NỘI DUNG CHÍNH (ĐÚNG 100% THEO ẢNH 2)                   */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          {/* ----------------------------------------------------------------- */}
          {/* CỘT 1 (TRÁI - 3 COLS): THÔNG TIN SINH VIÊN, XÁC MINH, ĐỊA ĐIỂM      */}
          {/* ----------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4">
            {/* Thẻ 1: Thông tin sinh viên */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Thông tin sinh viên</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-[11px] text-gray-400 font-medium">Trường đại học</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">
                    {studentInfo.university}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-gray-400 font-medium">Ngành học</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">
                    {studentInfo.major}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-gray-400 font-medium">Khóa học</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">
                    {studentInfo.cohort}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-gray-400 font-medium">Chương trình</div>
                  <div className="text-xs font-bold text-gray-900 mt-0.5">
                    {studentInfo.program}
                  </div>
                </div>
              </div>

              {/* Banner xanh: Đã xác minh sinh viên */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-emerald-800">
                    Đã xác minh sinh viên
                  </div>
                  <div className="text-[10.5px] text-emerald-700/90 leading-tight mt-0.5">
                    Tài khoản đã được xác thực qua email trường.
                  </div>
                </div>
              </div>
            </div>

            {/* Thẻ 2: Chứng chỉ & xác minh */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Chứng chỉ & xác minh</span>
              </div>

              <div className="space-y-2.5 pt-1 text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span className="font-medium">Xác minh sinh viên (email trường)</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span className="font-medium">Xác minh số điện thoại</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span className="font-medium">Tài khoản hoạt động lâu dài</span>
                </div>
              </div>
            </div>

            {/* Thẻ 3: Địa điểm giao nhận */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Địa điểm giao nhận</span>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    📍
                  </span>
                  <span className="font-medium leading-relaxed">
                    Khu vực trường Bách Khoa, Quận 10, TP.HCM
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xem bản đồ</span>
                </button>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CỘT 2 (GIỮA - 5 COLS): ĐÁNH GIÁ TỪ NGƯỜI MUA + LỊCH SỬ GIAO DỊCH   */}
          {/* ----------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-4">
            {/* Thẻ 1: Đánh giá từ người mua */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Đánh giá từ người mua</span>
                </div>
              </div>

              {/* Điểm số & Biểu đồ thanh sao */}
              <div className="flex items-center gap-6 pb-2">
                <div>
                  <div className="text-4xl font-black text-gray-900 tracking-tight">
                    4.8<span className="text-xl text-gray-400 font-semibold">/5</span>
                  </div>
                  <div className="flex items-center text-amber-400 text-sm mt-1">
                    ★★★★★
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    (24 đánh giá)
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-gray-500 w-9">5 sao</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0a5c3e] rounded-full" style={{ width: "85%" }} />
                    </div>
                    <span className="text-gray-400 w-8 text-right font-medium">85%</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-gray-500 w-9">4 sao</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0a5c3e] rounded-full" style={{ width: "10%" }} />
                    </div>
                    <span className="text-gray-400 w-8 text-right font-medium">10%</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-gray-500 w-9">3 sao</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0a5c3e] rounded-full" style={{ width: "4%" }} />
                    </div>
                    <span className="text-gray-400 w-8 text-right font-medium">4%</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-gray-500 w-9">2 sao</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0a5c3e] rounded-full" style={{ width: "1%" }} />
                    </div>
                    <span className="text-gray-400 w-8 text-right font-medium">1%</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-gray-500 w-9">1 sao</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0a5c3e] rounded-full" style={{ width: "0%" }} />
                    </div>
                    <span className="text-gray-400 w-8 text-right font-medium">0%</span>
                  </div>
                </div>
              </div>

              {/* Danh sách 2 bình luận mẫu (Đúng theo Ảnh 2) */}
              <div className="space-y-4 pt-3 border-t border-gray-100">
                {/* Review 1: Trần Minh Quân */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/assets/detail/shoes-detail-2.png"
                      alt="Trần Minh Quân"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 bg-white"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/assets/detail/seller-avatar.png";
                      }}
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Trần Minh Quân</div>
                      <div className="flex items-center gap-1.5 text-[10.5px]">
                        <span className="text-amber-500 font-bold">★★★★★ 5.0</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-400">2 tuần trước</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">
                    Sản phẩm đúng như mô tả, đóng gói cẩn thận, bạn rất nhiệt tình. Sẽ ủng hộ tiếp!
                  </p>

                  <div className="text-[10.5px] text-gray-400 flex items-center gap-1">
                    <span>🛍️</span>
                    <span>Đã mua: Macbook Air M1</span>
                  </div>
                </div>

                {/* Review 2: Lê Phương Thảo */}
                <div className="space-y-2 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
                      T
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">Lê Phương Thảo</div>
                      <div className="flex items-center gap-1.5 text-[10.5px]">
                        <span className="text-amber-500 font-bold">★★★★★ 5.0</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-400">3 tuần trước</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">
                    Giao dịch nhanh, dễ nói chuyện. Máy dùng tốt, không có vấn đề gì như mô tả. Rất uy tín!
                  </p>

                  <div className="text-[10.5px] text-gray-400 flex items-center gap-1">
                    <span>🛍️</span>
                    <span>Đã mua: Balo laptop</span>
                  </div>
                </div>
              </div>

              {/* Link: Xem tất cả đánh giá -> */}
              <div className="pt-2 border-t border-gray-100 text-right">
                <button
                  type="button"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>Xem tất cả đánh giá</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Thẻ 2: Lịch sử giao dịch */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Lịch sử giao dịch</span>
                </div>
                <button
                  type="button"
                  className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                >
                  <span>Xem chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Số liệu giao dịch */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-base font-black text-gray-900">56</div>
                    <div className="text-[11px] text-gray-500 font-medium">Đã bán</div>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                  </div>
                  <div>
                    <div className="text-base font-black text-gray-900">12</div>
                    <div className="text-[11px] text-gray-500 font-medium">Đã mua</div>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-base font-black text-gray-900">0</div>
                    <div className="text-[11px] text-gray-500 font-medium">Tranh chấp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* CỘT 3 (PHẢI - 4 COLS): SẢN PHẨM ĐANG BÁN + CAMPUS CHECK + BANNER     */}
          {/* ----------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-4">
            {/* Thẻ 1: Sản phẩm đang bán (8) */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Sản phẩm đang bán (8)</span>
                </div>
                <button
                  type="button"
                  className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lưới 4 sản phẩm theo Ảnh 2 */}
              <div className="grid grid-cols-2 gap-3">
                {sellerProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-gray-200/80 rounded-2xl p-2.5 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-2">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = p.fallback;
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => toggleLike(p.id, e)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-500 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            likedItems[p.id] ? "fill-red-500 text-red-500" : "text-gray-500"
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-[11.5px] font-bold text-gray-900 line-clamp-2 leading-tight">
                        {p.title}
                      </h4>
                      <div className="text-xs font-black text-emerald-800 mt-1">
                        {p.price}
                      </div>
                      <div className="mt-1.5">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9.5px] font-bold rounded-md border border-emerald-100">
                          {p.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thẻ 2: Campus Check */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Campus Check</span>
                </div>
                <button
                  type="button"
                  className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                >
                  <span>Xem tất cả</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                Các sản phẩm đã được người bán khai báo tình trạng và cung cấp hình ảnh chi tiết.
              </p>

              <div className="grid grid-cols-4 gap-2 text-center pt-1">
                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[9.5px] text-gray-600 font-semibold leading-tight">
                    Tình trạng sản phẩm
                  </span>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                  <Camera className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[9.5px] text-gray-600 font-semibold leading-tight">
                    Ảnh thực tế
                  </span>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                  <Package className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[9.5px] text-gray-600 font-semibold leading-tight">
                    Phụ kiện đi kèm
                  </span>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                  <FileText className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[9.5px] text-gray-600 font-semibold leading-tight">
                    Mô tả chi tiết
                  </span>
                </div>
              </div>
            </div>

            {/* Thẻ 3: Banner tư vấn & Chat ngay */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-black text-gray-900 leading-tight">
                    Bạn có câu hỏi về sản phẩm hoặc muốn thương lượng?
                  </div>
                  <div className="text-[11px] text-emerald-800 mt-0.5 font-medium">
                    Nhắn tin ngay để được hỗ trợ nhanh nhất!
                  </div>
                </div>
              </div>

              {/* NÚT CHAT NGAY TRÊN BANNER */}
              <button
                type="button"
                onClick={onBackToChat}
                className="px-4 py-2.5 bg-[#06462e] hover:bg-[#0a5c3e] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 active:scale-95 inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat ngay</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xem bản đồ giao nhận */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-gray-900">
                  Địa điểm giao nhận trực tiếp
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 relative aspect-video">
                <img
                  src="/assets/detail/campus-map.png"
                  alt="Bản đồ giao nhận"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/banner-1536.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white text-xs">
                    <div className="font-bold">Đại học Bách Khoa TP.HCM - Cơ sở 1</div>
                    <div className="text-[11px] text-gray-200">268 Lý Thường Kiệt, Phường 14, Quận 10</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Mẹo giao dịch an toàn tại campus:
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Ưu tiên hẹn gặp vào ban ngày tại các khu vực công cộng đông người như Sảnh A1, Canteen trường hoặc Thư viện trung tâm để kiểm tra sản phẩm kỹ trước khi nhận.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerFullProfileView;
