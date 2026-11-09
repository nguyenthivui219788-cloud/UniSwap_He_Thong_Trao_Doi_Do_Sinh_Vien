import React, { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
  Tag,
  Clock,
  Eye,
  Rocket,
} from "lucide-react";
import type { ProductItem, User } from "../types";

export interface FeaturedCarouselProps {
  products: ProductItem[];
  onSelectProduct: (product: ProductItem) => void;
  onOpenPro?: () => void;
  currentUser?: User | null;
  onRequireLogin?: () => void;
}

// Dữ liệu sản phẩm nổi bật mặc định nếu props chưa có đủ
const FALLBACK_PROMOTED_ITEMS: {
  id: string;
  title: string;
  price: number;
  category: string;
  school: string;
  condition: string;
  image: string;
  description: string;
  boostBadge: string;
  viewsToday: number;
  sellerName: string;
}[] = [
  {
    id: "boost-1",
    title: "MACBOOK AIR M1 2020 (8GB/256GB) ZIN ALL PIN 98%",
    price: 7500000,
    category: "Laptop",
    school: "ĐH Bách Khoa TP.HCM",
    condition: "Như mới 99%",
    image: "/assets/detail/macbook-main.png",
    description: "Máy ngoại hình đẹp leng keng, pin trâu 98%, phím gõ êm, màn hình Retina sắc nét không ám ố. Tặng kèm sạc zin theo máy.",
    boostBadge: "🔥 TOP 1 TRANG CHỦ",
    viewsToday: 428,
    sellerName: "Nguyễn Văn An",
  },
  {
    id: "boost-2",
    title: "GIÁO TRÌNH KINH TẾ VĨ MÔ & VI MÔ (NEU) KÈM ĐỀ THI GIẢI CHI TIẾT",
    price: 120000,
    category: "Sách giáo trình",
    school: "ĐH Kinh Tế TP.HCM (UEH)",
    condition: "Mới 95% có highlight",
    image: "/assets/detail/book-detail-1.png",
    description: "Bộ sách chính khóa NEU bản in mới nhất, đã highlight trọng tâm thi qua môn, tặng kèm tập đề thi 3 năm có đáp án giáo viên chấm.",
    boostBadge: "⚡ VỪA ĐẨY TIN 15P TRƯỚC",
    viewsToday: 315,
    sellerName: "Lê Phương Thảo",
  },
  {
    id: "boost-3",
    title: "GIÀY THỂ THAO ADIDAS ULTRABOOST (SIZE 42) CHÍNH HÃNG PASS NHANH",
    price: 550000,
    category: "Thời trang",
    school: "ĐH Sài Gòn (SGU)",
    condition: "Còn rất mới 92%",
    image: "/assets/detail/shoes-detail-1.png",
    description: "Mang êm chân, đế giày còn nguyên gai chống trượt, phù hợp chạy bộ và đi học hàng ngày. Cam kết hàng chính hãng 100%.",
    boostBadge: "⭐ ĐÃ XÁC THỰC CAMPUS",
    viewsToday: 264,
    sellerName: "Trần Minh Quân",
  },
  {
    id: "boost-4",
    title: "BALO LAPTOP CHỐNG NƯỚC 15.6 INCH CHUYÊN CHO SINH VIÊN CNTT",
    price: 250000,
    category: "Phụ kiện",
    school: "ĐH Công Nghệ Thông Tin (UIT)",
    condition: "Mới 98%",
    image: "/assets/detail/backpack-detail-1.png",
    description: "Nhiều ngăn đựng laptop, máy tính bảng, sách vở rộng rãi. Vải dù chống nước đi mưa an tâm, khóa kéo kim loại bền bỉ.",
    boostBadge: "🚀 ĐẨY TIN VIP 7 NGÀY",
    viewsToday: 198,
    sellerName: "Phạm Gia Hân",
  },
  {
    id: "boost-5",
    title: "IPAD GEN 9 64GB WIFI FULLBOX KÈM BÚT APPLE PENCIL 1 HỌC TẬP",
    price: 5200000,
    category: "Máy tính bảng",
    school: "ĐH Khoa Học Tự Nhiên (HCMUS)",
    condition: "Fullbox 98%",
    image: "/assets/3d-tech.png",
    description: "Máy dùng vẽ sơ đồ và học online cực mượt, pin khỏe 96%, kèm ốp lưng chống sốc và dán cường lực paper-like xịn.",
    boostBadge: "🔥 TOP 1 TRANG CHỦ",
    viewsToday: 512,
    sellerName: "Hoàng Đức Huy",
  },
  {
    id: "boost-6",
    title: "ĐÈN HỌC CHỐNG CẬN ĐIỀU CHỈNH 3 CHẾ ĐỘ SÁNG KTX SIÊU BỀN",
    price: 95000,
    category: "Đồ dùng KTX",
    school: "ĐH Sư Phạm Kỹ Thuật (HCMUTE)",
    condition: "Hoạt động hoàn hảo",
    image: "/assets/cat-dorm.png",
    description: "Bảo vệ mắt khi thức đêm ôn thi, có cổng sạc USB tiện lợi, thân đèn uốn dẻo 360 độ điều chỉnh mọi góc học tập.",
    boostBadge: "⚡ VỪA ĐẨY TIN 30P TRƯỚC",
    viewsToday: 182,
    sellerName: "Ngô Thu Hà",
  },
];

export function FeaturedCarousel({
  products,
  onSelectProduct,
  onOpenPro,
  currentUser,
  onRequireLogin,
}: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"1day" | "3day" | "7day">("3day");
  const [boostSuccess, setBoostSuccess] = useState(false);

  // Kết hợp sản phẩm từ props và fallback để luôn có ít nhất 6 card chạy cuộn mượt mà
  const displayItems = React.useMemo(() => {
    if (products && products.length >= 4) {
      return products.slice(0, 8).map((p, idx) => ({
        id: p.id,
        title: p.title.toUpperCase(),
        price: p.price,
        category: p.category || "Đồ sinh viên",
        school: p.seller?.universityCode ? `Đại học ${p.seller.universityCode}` : "Campus TP.HCM",
        condition: p.condition || "Đã kiểm định",
        image: p.images?.[0] || FALLBACK_PROMOTED_ITEMS[idx % FALLBACK_PROMOTED_ITEMS.length].image,
        description: p.description || "Sản phẩm được đẩy tin ưu tiên lên đầu trang 1 của UniSwap.",
        boostBadge: idx % 2 === 0 ? "🔥 TOP 1 TRANG CHỦ" : "⚡ VỪA ĐẨY TIN VIP",
        viewsToday: 150 + (idx * 37) % 300,
        sellerName: p.seller?.name || "Sinh viên chính chủ",
        rawProduct: p,
      }));
    }

    return FALLBACK_PROMOTED_ITEMS.map((item) => {
      // Tìm sản phẩm tương ứng trong products nếu có
      const matched = products?.find((p) => p.id === item.id);
      return {
        ...item,
        rawProduct: (matched || {
          id: item.id,
          title: item.title,
          price: item.price,
          category: item.category,
          condition: item.condition,
          description: item.description,
          images: [item.image],
          createdAt: Date.now(),
          campus: "lang-dh",
          cluster: "lang-dh",
          tradeType: "sale",
          status: "available",
          meetingSpot: "Sảnh trường",
          seller: {
            id: "seller-boost",
            name: item.sellerName,
            universityCode: "HCMUT",
            rating: 4.9,
            reviewCount: 38,
            isVerified: true,
          },
        }) as unknown as ProductItem,
      };
    });
  }, [products]);

  // Tự động cuộn mượt mà theo khoảng thời gian (Auto-Scroll) khi không hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // Nếu cuộn gần hết thì quay lại đầu
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 3800);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Cuộn thủ công bằng nút trái / phải
  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCardClick = (item: (typeof displayItems)[0]) => {
    if (item.rawProduct) {
      onSelectProduct(item.rawProduct);
    }
  };

  const handleOpenBoostModal = () => {
    if (!currentUser && onRequireLogin) {
      onRequireLogin();
      return;
    }
    setShowBoostModal(true);
  };

  const handleConfirmBoost = () => {
    setBoostSuccess(true);
    setTimeout(() => {
      setBoostSuccess(false);
      setShowBoostModal(false);
      if (onOpenPro) onOpenPro();
    }, 1800);
  };

  return (
    <section className="my-8 relative w-full overflow-hidden">
      {/* Header khu vực Sản Phẩm Nổi Bật / Đẩy Tin Trang 1 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-[#06462e] flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Flame className="w-5 h-5 fill-current animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                SẢN PHẨM NỔI BẬT · TOP TRANG 1
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                <Sparkles className="w-3 h-3 text-amber-600" />
                DỊCH VỤ ĐẨY TIN PRO
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Các bài đăng được ưu tiên xuất hiện liên tục trước 15.000+ sinh viên toàn thành phố
            </p>
          </div>
        </div>

        {/* Nút Đẩy tin lên đây trả phí */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={handleOpenBoostModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#06462e] to-[#0a5c3e] hover:from-[#0a5c3e] hover:to-[#0f7a53] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/10 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 group"
          >
            <Rocket className="w-3.5 h-3.5 text-amber-300 group-hover:animate-bounce" />
            <span>Đẩy bài lên đây (từ 15k/ngày)</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Khung Slider chứa Carousel và 2 nút mũi tên tròn 2 bên */}
      <div
        className="relative group/carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Nút mũi tên tròn BÊN TRÁI (y hệt ảnh mẫu) */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute -left-3 sm:-left-4 top-[38%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 border border-gray-200/90 shadow-xl flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 active:scale-90"
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Nút mũi tên tròn BÊN PHẢI (y hệt ảnh mẫu) */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute -right-3 sm:-right-4 top-[38%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 border border-gray-200/90 shadow-xl flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 active:scale-90"
          aria-label="Cuộn sang phải"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Thanh cuộn ngang mượt mà (Horizontal Scroll Track) */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scroll-smooth py-2 px-1 no-scrollbar"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              style={{ scrollSnapAlign: "start" }}
              className="w-[260px] sm:w-[285px] shrink-0 bg-white rounded-3xl border border-gray-200/90 p-3.5 shadow-2xs hover:shadow-xl hover:border-emerald-400 transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 relative"
            >
              {/* Badge Đẩy Tin nổi bật ở góc trên */}
              <div className="absolute top-5 left-5 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-md">
                <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{item.boostBadge}</span>
              </div>

              {/* Lượt xem hôm nay */}
              <div className="absolute top-5 right-5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-white/90 backdrop-blur-md text-gray-700 shadow-sm border border-gray-100">
                <Eye className="w-3 h-3 text-emerald-600" />
                <span>{item.viewsToday} xem</span>
              </div>

              {/* Ảnh sản phẩm vuông bo góc lớn (Theo đúng ảnh mẫu) */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/detail/macbook-main.png";
                  }}
                />
                {/* Lớp gradient nhẹ bảo vệ badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Giá tiền nổi bật ở góc dưới ảnh */}
                <div className="absolute bottom-2.5 left-2.5 px-3 py-1 bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-white">
                  <span className="text-xs sm:text-sm font-black text-[#06462e]">
                    {item.price === 0 ? "Miễn phí 0đ" : `${item.price.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
              </div>

              {/* Nội dung bên dưới ảnh (Đúng bố cục ảnh mẫu: Tag trạng thái -> Tiêu đề in hoa -> Mô tả) */}
              <div className="flex-1 flex flex-col justify-between pt-1">
                <div>
                  {/* Dòng trạng thái / trường sinh viên */}
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mb-1.5">
                    <span className="truncate max-w-[150px] font-bold text-emerald-700">
                      📍 {item.school}
                    </span>
                    <span className="px-1.5 py-0.2 bg-gray-100 text-gray-600 text-[10px] rounded font-semibold">
                      {item.condition}
                    </span>
                  </div>

                  {/* Tiêu đề in HOA ĐẬM chuẩn xác theo ảnh mẫu */}
                  <h3 className="text-xs sm:text-[13px] font-black text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug tracking-tight mb-2">
                    {item.title}
                  </h3>

                  {/* Mô tả ngắn 2 dòng */}
                  <p className="text-[11.5px] text-gray-500 line-clamp-2 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Footer thẻ: Người bán + Nút xem chi tiết */}
                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black flex items-center justify-center shrink-0">
                      {item.sellerName.charAt(0)}
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 truncate">
                      {item.sellerName}
                    </span>
                  </div>

                  <span className="text-[11px] font-extrabold text-[#06462e] group-hover:underline flex items-center gap-0.5 shrink-0">
                    <span>Xem ngay</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* MODAL ĐĂNG KÝ GÓI ĐẨY TIN LÊN TRANG 1 (TÍNH NĂNG TRẢ PHÍ THEO Ý BẠN)    */}
      {/* ======================================================================= */}
      {showBoostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Họa tiết trang trí vàng kim */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-100/60 rounded-full translate-x-16 -translate-y-16 pointer-events-none blur-2xl" />

            <div className="flex items-start justify-between border-b border-gray-100 pb-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    Dịch Vụ Đẩy Tin Lên Top Trang 1
                  </h3>
                  <p className="text-xs text-gray-500">
                    Bài đăng của bạn sẽ nằm trong dải tin xoay chạy nổi bật 24/7
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBoostModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Lợi ích vượt trội của tính năng đẩy bài */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
                <Flame className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-xs font-black text-amber-950">Vị trí Kim Cương</div>
                <div className="text-[10px] text-amber-800/80 mt-0.5">Đầu trang chủ 24/7</div>
              </div>
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs font-black text-emerald-950">x3 Lượt xem</div>
                <div className="text-[10px] text-emerald-800/80 mt-0.5">Tiếp cận 15k SV/ngày</div>
              </div>
              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-xs font-black text-blue-950">Bán nhanh x5</div>
                <div className="text-[10px] text-blue-800/80 mt-0.5">Ưu tiên chốt cọc</div>
              </div>
            </div>

            {/* Chọn gói thời gian đẩy tin */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-gray-900 uppercase tracking-wider block">
                Chọn gói đẩy tin cho bài đăng:
              </label>

              <div className="grid grid-cols-3 gap-3">
                {/* Gói 1 ngày */}
                <div
                  onClick={() => setSelectedPlan("1day")}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                    selectedPlan === "1day"
                      ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="text-xs font-bold text-gray-600">Gói 24 Giờ</div>
                  <div className="text-base font-black text-[#06462e] mt-1">15.000đ</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Trải nghiệm thử</div>
                </div>

                {/* Gói 3 ngày - Phổ biến nhất */}
                <div
                  onClick={() => setSelectedPlan("3day")}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-center relative ${
                    selectedPlan === "3day"
                      ? "border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-black px-2 py-0.2 rounded-full uppercase">
                    Phổ biến nhất
                  </span>
                  <div className="text-xs font-bold text-amber-900">Gói 3 Ngày</div>
                  <div className="text-base font-black text-amber-800 mt-1">39.000đ</div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Tiết kiệm 15%</div>
                </div>

                {/* Gói 7 ngày - Tiết kiệm nhất */}
                <div
                  onClick={() => setSelectedPlan("7day")}
                  className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                    selectedPlan === "7day"
                      ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="text-xs font-bold text-gray-600">Gói 7 Ngày</div>
                  <div className="text-base font-black text-[#06462e] mt-1">79.000đ</div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Tiết kiệm 25%</div>
                </div>
              </div>
            </div>

            {/* Thông báo thanh toán thành công mô phỏng */}
            {boostSuccess ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-1 animate-in zoom-in-95">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="text-xs font-black text-emerald-800">
                  Đăng ký đẩy tin thành công!
                </div>
                <div className="text-[11px] text-emerald-700">
                  Bài đăng của bạn đã được đưa lên dải xoay chạy nổi bật trang 1.
                </div>
              </div>
            ) : (
              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="text-xs text-gray-500">
                  <span>Hỗ trợ thanh toán: </span>
                  <b className="text-gray-800">QR MoMo / ZaloPay / VietQR</b>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmBoost}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#06462e] font-black rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-95"
                >
                  Xác nhận đẩy tin ngay
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default FeaturedCarousel;
