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
  MapPin,
  Clock,
  Eye,
  Rocket,
  ShoppingBag,
  Store,
  DollarSign,
  MessageCircle,
} from "lucide-react";
import type { User } from "../types";

export interface WantedFeaturedCarouselProps {
  marketMode: "buyer" | "seller";
  items?: any[];
  onSelectItem: (item: any) => void;
  onOpenPro?: () => void;
  currentUser?: User | null;
  onRequireLogin?: () => void;
}

// Dữ liệu mẫu bài Cần Mua nổi bật (đã mua gói đẩy tin trang 1)
const DEFAULT_PROMOTED_BUYERS = [
  {
    id: "boost-wanted-1",
    title: "CẦN MUA GẤP MÁY TÍNH CASIO 580VNX CHÍNH HÃNG ĐỂ THI CUỐI KỲ",
    budget: 450000,
    school: "ĐH Bách Khoa TP.HCM (HCMUT)",
    category: "Đồ học tập",
    neededBy: "Hôm nay trước 17h",
    description: "Cần máy còn hoạt động tốt, phím bấm nhạy, không mờ số. Giao dịch trực tiếp tại sảnh H6 hoặc cổng Lý Thường Kiệt.",
    image: "/assets/3d-study.png",
    boostBadge: "🔥 CẦN TÌM GẤP HÔM NAY",
    viewsToday: 342,
    userName: "Hoàng Minh Trí",
    contactZalo: "0912345678",
  },
  {
    id: "boost-wanted-2",
    title: "TÌM MUA GIÁO TRÌNH KINH TẾ LƯỢNG & XÁC SUẤT THỐNG KÊ CÓ LỜI GIẢI",
    budget: 90000,
    school: "ĐH Kinh Tế TP.HCM (UEH)",
    category: "Sách giáo trình",
    neededBy: "Trong 2 ngày tới",
    description: "Cần sách bản in rõ ràng, ưu tiên có ghi chú trọng tâm ôn thi hoặc bài tập giải sẵn của thầy cô. Pass lại mình qua lấy liền.",
    image: "/assets/detail/book-detail-1.png",
    boostBadge: "⚡ VỪA ĐẨY TOP 1",
    viewsToday: 285,
    userName: "Trần Bảo Ngọc",
    contactZalo: "0987654321",
  },
  {
    id: "boost-wanted-3",
    title: "CẦN TÌM LAPTOP THINKPAD / DELL I5 GEN 10 HOẶC 11 HỌC CODE & ĐỒ HỌA",
    budget: 6500000,
    school: "ĐH Công Nghệ Thông Tin (UIT)",
    category: "Laptop",
    neededBy: "Tuần này",
    description: "Yêu cầu máy zin chưa sửa chữa, RAM tối thiểu 8GB, ổ SSD 256GB trở lên. Pin còn 2-3 tiếng để mang lên giảng đường.",
    image: "/assets/detail/macbook-main.png",
    boostBadge: "🚀 GÓI ĐẨY TIN 7 NGÀY",
    viewsToday: 520,
    userName: "Nguyễn Hải Nam",
    contactZalo: "0903112233",
  },
  {
    id: "boost-wanted-4",
    title: "TÌM MUA XE MÁY WAVE HOẶC SIRIUS CŨ CÒN TỐT ĐI LÀM THÊM",
    budget: 7200000,
    school: "ĐH Khoa Học Tự Nhiên (HCMUS)",
    category: "Phương tiện",
    neededBy: "Cuối tuần này",
    description: "Cần xe máy giấy tờ đầy đủ chính chủ sinh viên, máy móc êm, còi đèn xi nhan đầy đủ để chạy đi học và làm thêm buổi tối.",
    image: "/assets/demo/detail-frog-main.png",
    boostBadge: "🔥 TOP ĐẶC BIỆT TRANG 1",
    viewsToday: 410,
    userName: "Đặng Quang Huy",
    contactZalo: "0938445566",
  },
  {
    id: "boost-wanted-5",
    title: "TÌM MUA BỘ VỢT CẦU LÔNG YONEX CŨ KÈM BAO VỢT GIÁ SINH VIÊN",
    budget: 350000,
    school: "ĐH Sư Phạm TP.HCM (HCMUE)",
    category: "Thể thao",
    neededBy: "Trước thứ 7",
    description: "Mình mới tham gia CLB cầu lông của trường nên cần tìm 1 cây vợt Yonex hoặc Lining cũ đan lưới sẵn về chơi luôn.",
    image: "/assets/3d-fashion.png",
    boostBadge: "⚡ TÌM GẤP TRONG 24H",
    viewsToday: 219,
    userName: "Vũ Phương Linh",
    contactZalo: "0977889900",
  },
  {
    id: "boost-wanted-6",
    title: "CẦN MUA TỦ LẠNH MINI 90L HOẶC NỒI CƠM ĐIỆN CHO PHÒNG KTX",
    budget: 950000,
    school: "Khu B KTX ĐHQG TP.HCM",
    category: "Đồ gia dụng",
    neededBy: "Đầu tuần sau",
    description: "Phòng KTX mới dọn vào thiếu đồ dùng. Bạn nào tốt nghiệp dọn phòng cần thanh lý tủ lạnh mini chạy êm nhắn mình nhé.",
    image: "/assets/cat-dorm.png",
    boostBadge: "⭐ ĐÃ XÁC THỰC KTX",
    viewsToday: 304,
    userName: "Lê Quốc Trung",
    contactZalo: "0918776655",
  },
];

// Dữ liệu mẫu bài Cần Bán / Xả hàng nổi bật
const DEFAULT_PROMOTED_SELLERS = [
  {
    id: "boost-seller-1",
    title: "XẢ GẤP MACBOOK PRO 13 INCH RETINA ĐẸP 99% RA TRƯỜNG DỌN PHÒNG",
    budget: 8200000,
    school: "ĐH Bách Khoa TP.HCM (HCMUT)",
    category: "Laptop",
    neededBy: "Cần pass trước chủ nhật",
    description: "Sinh viên năm cuối dọn đồ về quê pass nhanh giá rẻ cho anh em khóa dưới. Máy nguyên bản, sạc cáp đầy đủ.",
    image: "/assets/detail/macbook-main.png",
    boostBadge: "🔥 XẢ GẤP HÔM NAY",
    viewsToday: 489,
    userName: "Trần Anh Tuấn",
    contactZalo: "0912111222",
  },
  {
    id: "boost-seller-2",
    title: "THANH LÝ TRỌN BỘ 12 CUỐN GIÁO TRÌNH CNTT K2021 TẶNG KÈM ĐỀ THI",
    budget: 180000,
    school: "ĐH Công Nghệ Thông Tin (UIT)",
    category: "Sách",
    neededBy: "Hôm nay",
    description: "Gồm Cấu trúc dữ liệu, Mạng máy tính, Hệ điều hành, Kiến trúc máy tính. Tặng kèm bộ code project đồ án full A.",
    image: "/assets/detail/book-detail-1.png",
    boostBadge: "⚡ VỪA ĐẨY TOP 1",
    viewsToday: 367,
    userName: "Phạm Văn Đức",
    contactZalo: "0933444555",
  },
  {
    id: "boost-seller-3",
    title: "PASS LẠI XE ĐẠP ĐIỆN ASAMA BÌNH MỚI THAY CHẠY 40KM / 1 LẦN SẠC",
    budget: 2800000,
    school: "ĐH Nông Lâm TP.HCM (NLU)",
    category: "Phương tiện",
    neededBy: "Trong tuần này",
    description: "Xe em gái dùng đi học giữ gìn cẩn thận, sạc zin theo xe, bình mới thay còn bảo hành 6 tháng cửa hàng.",
    image: "/assets/3d-tech.png",
    boostBadge: "🚀 ĐẨY TIN VIP 7 NGÀY",
    viewsToday: 412,
    userName: "Nguyễn Thị Mai",
    contactZalo: "0966777888",
  },
];

export function WantedFeaturedCarousel({
  marketMode,
  items,
  onSelectItem,
  onOpenPro,
  currentUser,
  onRequireLogin,
}: WantedFeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"1day" | "3day" | "7day">("3day");
  const [boostSuccess, setBoostSuccess] = useState(false);

  // Chọn nguồn dữ liệu hiển thị tương ứng với sàn Cần Mua hoặc Sàn Cần Bán
  const displayItems = React.useMemo(() => {
    const rawList =
      items && items.length >= 3
        ? items.slice(0, 8).map((it, idx) => ({
            id: it.id,
            title: (it.data?.title || it.title || "TIN CẦN TÌM ĐỒ GẤP").toUpperCase(),
            budget: it.data?.budget || it.budget || 0,
            school: it.school || (it.data?.cluster ? `Khu vực ${it.data.cluster}` : "Campus TP.HCM"),
            category: it.data?.category || it.category || "Đồ sinh viên",
            neededBy: it.data?.neededBy ? `Hạn: ${it.data.neededBy}` : "Cần gấp hôm nay",
            description: it.data?.description || it.description || "Bài đăng được ưu tiên đẩy lên dải tin xoay chạy trang 1.",
            image:
              marketMode === "seller"
                ? DEFAULT_PROMOTED_SELLERS[idx % DEFAULT_PROMOTED_SELLERS.length].image
                : DEFAULT_PROMOTED_BUYERS[idx % DEFAULT_PROMOTED_BUYERS.length].image,
            boostBadge: idx % 2 === 0 ? "🔥 CẦN TÌM GẤP HÔM NAY" : "⚡ VỪA ĐẨY TIN VIP",
            viewsToday: 180 + (idx * 43) % 280,
            userName: it.name || it.data?.name || "Sinh viên UniSwap",
            contactZalo: it.data?.contactZalo || it.contactZalo || "09xxxx",
            rawItem: it,
          }))
        : null;

    if (rawList) return rawList;

    const fallbackSource = marketMode === "seller" ? DEFAULT_PROMOTED_SELLERS : DEFAULT_PROMOTED_BUYERS;
    return fallbackSource.map((it) => ({
      ...it,
      rawItem: {
        id: it.id,
        name: it.userName,
        school: it.school,
        data: {
          title: it.title,
          description: it.description,
          budget: it.budget,
          category: it.category,
          neededBy: it.neededBy,
          contactZalo: it.contactZalo,
          postType: marketMode === "seller" ? "sell" : "buy",
        },
      },
    }));
  }, [items, marketMode]);

  // Tự động cuộn mượt mà theo khoảng thời gian (Auto-Scroll) khi không hover chuột
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 3900);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Cuộn thủ công bằng nút bấm
  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
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

  const isBuyer = marketMode === "buyer";

  return (
    <div className="my-6 relative w-full overflow-hidden">
      {/* Header khu vực Sản Phẩm Nổi Bật Cần Mua / Cần Tìm */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md shrink-0 ${
              isBuyer
                ? "bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-emerald-600/20"
                : "bg-gradient-to-tr from-amber-500 to-amber-300 text-[#06462e] shadow-amber-500/20"
            }`}
          >
            {isBuyer ? (
              <ShoppingBag className="w-5 h-5 fill-current animate-pulse" />
            ) : (
              <Store className="w-5 h-5 fill-current animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                {isBuyer
                  ? "TIN CẦN MUA GẤP · NỔI BẬT TOP TRANG 1"
                  : "TIN XẢ HÀNG GẤP · NỔI BẬT TOP TRANG 1"}
              </h2>
              <span
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-black border ${
                  isBuyer
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                    : "bg-amber-100 text-amber-900 border-amber-300"
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                VỊ TRÍ KIM CƯƠNG PRO
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isBuyer
                ? "Nhu cầu tìm đồ được ghim chạy tự động để người bán có sẵn hàng liên hệ báo giá ngay lập tức"
                : "Hàng thanh lý gấp được hiển thị ưu tiên trước 15.000+ sinh viên để xả nhanh trong ngày"}
            </p>
          </div>
        </div>

        {/* Nút Đẩy tin cần tìm / xả hàng lên đây */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={handleOpenBoostModal}
            className={`inline-flex items-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95 group ${
              isBuyer
                ? "bg-gradient-to-r from-[#06462e] to-[#0a5c3e] hover:from-[#0a5c3e] hover:to-[#0f7a53] shadow-emerald-900/15"
                : "bg-gradient-to-r from-[#c2410c] to-[#ea580c] hover:from-[#ea580c] hover:to-[#f97316] shadow-orange-900/15"
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-amber-300 group-hover:animate-bounce" />
            <span>
              {isBuyer ? "Đẩy tin cần mua lên đây (15k/ngày)" : "Đẩy tin xả hàng lên đây (15k/ngày)"}
            </span>
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
        {/* Nút mũi tên tròn BÊN TRÁI (Chuẩn theo ảnh mẫu) */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute -left-3 sm:-left-4 top-[38%] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 border border-gray-200/90 shadow-xl flex items-center justify-center transition-all cursor-pointer opacity-90 hover:opacity-100 active:scale-90"
          aria-label="Cuộn sang trái"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Nút mũi tên tròn BÊN PHẢI (Chuẩn theo ảnh mẫu) */}
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
              onClick={() => onSelectItem(item.rawItem)}
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

              {/* Ảnh đại diện vuông bo góc lớn (Theo đúng ảnh mẫu) */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/3d-study.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Ngân sách sẵn sàng mua / Giá xả nổi bật */}
                <div className="absolute bottom-2.5 left-2.5 px-3 py-1 bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-white flex items-center gap-1">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">
                    {isBuyer ? "Ngân sách:" : "Giá xả:"}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      isBuyer ? "text-[#06462e]" : "text-amber-700"
                    }`}
                  >
                    {item.budget === 0 ? "Thương lượng" : `${item.budget.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
              </div>

              {/* Nội dung bên dưới ảnh (Chuẩn form ảnh mẫu: Tag trạng thái -> Tiêu đề in hoa -> Mô tả) */}
              <div className="flex-1 flex flex-col justify-between pt-1">
                <div>
                  {/* Dòng trạng thái / trường sinh viên */}
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mb-1.5">
                    <span className="truncate max-w-[150px] font-bold text-emerald-700">
                      📍 {item.school}
                    </span>
                    <span className="px-1.5 py-0.2 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] rounded font-semibold truncate max-w-[105px]">
                      {item.neededBy}
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

                {/* Footer thẻ: Người đăng tin + Nút Báo giá / Chào hàng */}
                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black flex items-center justify-center shrink-0">
                      {item.userName.charAt(0)}
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 truncate">
                      {item.userName}
                    </span>
                  </div>

                  <span className="text-[11px] font-extrabold text-[#06462e] group-hover:underline flex items-center gap-0.5 shrink-0">
                    <span>{isBuyer ? "Báo giá ngay" : "Xem chi tiết"}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* MODAL ĐĂNG KÝ GÓI ĐẨY TIN CẦN MUA LÊN TRANG 1 (TÍNH NĂNG TRẢ PHÍ)        */}
      {/* ======================================================================= */}
      {showBoostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Họa tiết trang trí */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-100/60 rounded-full translate-x-16 -translate-y-16 pointer-events-none blur-2xl" />

            <div className="flex items-start justify-between border-b border-gray-100 pb-3 relative z-10">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-2xl text-white flex items-center justify-center shadow-md ${
                    isBuyer ? "bg-emerald-600 shadow-emerald-600/20" : "bg-amber-500 shadow-amber-500/20"
                  }`}
                >
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    {isBuyer ? "Đẩy Tin Cần Mua Lên Top 1" : "Đẩy Tin Xả Hàng Lên Top 1"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Bài của bạn sẽ nằm trong dải tin xoay chạy nổi bật để khớp đơn nhanh nhất
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

            {/* 3 Lợi ích vượt trội */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                <Flame className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <div className="text-xs font-black text-emerald-950">Vị trí Kim Cương</div>
                <div className="text-[10px] text-emerald-800/80 mt-0.5">Top đầu sàn 24/7</div>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
                <TrendingUp className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-xs font-black text-amber-950">Khớp đơn x5</div>
                <div className="text-[10px] text-amber-800/80 mt-0.5">Người bán thấy ngay</div>
              </div>
              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-xs font-black text-blue-950">Huy hiệu VIP</div>
                <div className="text-[10px] text-blue-800/80 mt-0.5">Uy tín tuyệt đối</div>
              </div>
            </div>

            {/* Chọn gói thời gian đẩy tin */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-gray-900 uppercase tracking-wider block">
                Chọn gói đẩy tin phù hợp:
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
                  <div className="text-[10px] text-gray-400 mt-0.5">Cần tìm gấp</div>
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

            {/* Thông báo thanh toán thành công */}
            {boostSuccess ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-1 animate-in zoom-in-95">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="text-xs font-black text-emerald-800">
                  Đăng ký đẩy tin thành công!
                </div>
                <div className="text-[11px] text-emerald-700">
                  Nhu cầu của bạn đã được đưa lên dải xoay chạy nổi bật đầu sàn Cần Mua.
                </div>
              </div>
            ) : (
              <div className="pt-2 flex items-center justify-between gap-3">
                <div className="text-xs text-gray-500">
                  <span>Hỗ trợ: </span>
                  <b className="text-gray-800">QR MoMo / ZaloPay / VietQR</b>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmBoost}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer active:scale-95"
                >
                  Xác nhận đẩy tin ngay
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WantedFeaturedCarousel;
