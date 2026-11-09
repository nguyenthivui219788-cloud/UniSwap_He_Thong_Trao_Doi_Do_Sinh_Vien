import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Star,
  Heart,
  MessageCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  MoreHorizontal,
  Laptop,
  Cpu,
  HardDrive,
  Layers,
  Monitor,
  BatteryCharging,
  Calendar,
  BookOpen,
  Check,
  Leaf,
  Navigation,
  LocateFixed,
  Lightbulb,
  ExternalLink,
  Flag,
  Share2,
  Tag,
  Shield,
  Building,
} from "lucide-react";
import type { ProductItem, User } from "../types";
import { InteractiveMap } from "./InteractiveMap";

export interface ProductDetailViewProps {
  product: ProductItem;
  user: User | null;
  onBack: () => void;
  onOpenChat: (product: ProductItem) => void;
  onOpenProfile: (sellerId: string) => void;
  onToggleLike: (productId: string) => void;
  isLiked: boolean;
  onReport: (product: ProductItem) => void;
  onReserve?: (product: ProductItem) => void;
  onNotice?: (msg: string) => void;
  onOpenPaymentReg?: (product: ProductItem) => void;
}

// BẢNG TỌA ĐỘ VÀ ĐỊA CHỈ TRƯỜNG ĐẠI HỌC CHO GOOGLE MAPS GPS
interface UniLocation {
  lat: number;
  lng: number;
  address: string;
  label: string;
  query: string;
}

const UNIVERSITY_LOCATIONS: Record<string, UniLocation> = {
  UEH: {
    lat: 10.76008,
    lng: 106.66698,
    address: "279 Nguyễn Tri Phương, Phường 5, Quận 10, TP.HCM",
    label: "ĐH Kinh tế TP.HCM (UEH Cơ sở B)",
    query: "Trường+Đại+học+Kinh+tế+TP.HCM",
  },
  HCMUT: {
    lat: 10.77254,
    lng: 106.65784,
    address: "268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM",
    label: "ĐH Bách Khoa TP.HCM (CS1)",
    query: "Trường+Đại+học+Bách+Khoa+ĐHQG-HCM",
  },
  HCMUS: {
    lat: 10.76313,
    lng: 106.68233,
    address: "227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM",
    label: "ĐH Khoa học Tự nhiên TP.HCM",
    query: "Trường+Đại+học+Khoa+học+Tự+nhiên+ĐHQG-HCM",
  },
  UIT: {
    lat: 10.87023,
    lng: 106.80318,
    address: "Khu phố 6, Phường Linh Trung, TP. Thủ Đức, TP.HCM",
    label: "ĐH Công nghệ Thông tin (UIT - ĐHQG)",
    query: "Trường+Đại+học+Công+nghệ+Thông+tin+ĐHQG-HCM",
  },
  SGU: {
    lat: 10.75991,
    lng: 106.67822,
    address: "273 An Dương Vương, Phường 3, Quận 5, TP.HCM",
    label: "ĐH Sài Gòn (SGU Cơ sở chính)",
    query: "Trường+Đại+học+Sài+Gòn",
  },
  FTU2: {
    lat: 10.80348,
    lng: 106.71424,
    address: "15 Đường D5, Phường 25, Bình Thạnh, TP.HCM",
    label: "ĐH Ngoại thương Cơ sở 2 - TP.HCM",
    query: "Trường+Đại+học+Ngoại+thương+Cơ+sở+II",
  },
  IUH: {
    lat: 10.82224,
    lng: 106.68752,
    address: "12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM",
    label: "ĐH Công nghiệp TP.HCM (IUH)",
    query: "Trường+Đại+học+Công+nghệ+TP.HCM",
  },
  UPES1: {
    lat: 10.75825,
    lng: 106.66112,
    address: "639 Nguyễn Trãi, Phường 11, Quận 5, TP.HCM",
    label: "ĐH Sư phạm TDTT TP.HCM",
    query: "Trường+Đại+học+Sư+phạm+Thể+dục+Thể+thao+TP.HCM",
  },
  DHV: {
    lat: 10.75338,
    lng: 106.66212,
    address: "736 Nguyễn Trãi, Phường 11, Quận 5, TP.HCM",
    label: "ĐH Hùng Vương TP.HCM (DHV Cơ sở chính)",
    query: "Trường+Đại+học+Hùng+Vương+TP.HCM",
  },
};

function getUniversityLocation(meetingSpot?: string, uniCode?: string): UniLocation {
  const text = `${meetingSpot || ""} ${uniCode || ""}`.toLowerCase();
  if (text.includes("dhv") || text.includes("hùng vương")) return UNIVERSITY_LOCATIONS.DHV;
  if (text.includes("ueh") || text.includes("kinh tế")) return UNIVERSITY_LOCATIONS.UEH;
  if (text.includes("bách khoa") || text.includes("hcmut") || text.includes("q10")) return UNIVERSITY_LOCATIONS.HCMUT;
  if (text.includes("khoa học tự nhiên") || text.includes("khtn") || text.includes("hcmus")) return UNIVERSITY_LOCATIONS.HCMUS;
  if (text.includes("công nghệ thông tin") || text.includes("uit") || text.includes("thủ đức") || text.includes("làng")) return UNIVERSITY_LOCATIONS.UIT;
  if (text.includes("sài gòn") || text.includes("sgu")) return UNIVERSITY_LOCATIONS.SGU;
  if (text.includes("ngoại thương") || text.includes("ftu")) return UNIVERSITY_LOCATIONS.FTU2;
  if (text.includes("công nghiệp") || text.includes("iuh")) return UNIVERSITY_LOCATIONS.IUH;
  if (text.includes("sư phạm tdtt") || text.includes("upes")) return UNIVERSITY_LOCATIONS.UPES1;

  // Default to UEH Cơ sở B (như trong ảnh mẫu)
  return UNIVERSITY_LOCATIONS.UEH;
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function ProductDetailView({
  product,
  user: _user,
  onBack,
  onOpenChat,
  onOpenProfile,
  onToggleLike,
  isLiked,
  onReport,
  onReserve,
  onNotice,
  onOpenPaymentReg,
}: ProductDetailViewProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"info" | "condition" | "reviews" | "qa">("info");
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // GPS & Bản đồ
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "active" | "error">("idle");
  const [distanceKm, setDistanceKm] = useState<number>(1.2);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(4);

  const destLocation = getUniversityLocation(product.meetingSpot, product.seller?.universityCode);

  const isBook =
    product.category === "books" ||
    (product.title && product.title.toLowerCase().includes("giáo trình")) ||
    (product.title && product.title.toLowerCase().includes("sách"));

  const isMacbook =
    product.title &&
    (product.title.toLowerCase().includes("macbook") ||
      product.title.toLowerCase().includes("laptop") ||
      product.title.toLowerCase().includes("m1"));

  const fallbackMain = isBook ? "/assets/detail/detail-book-main.png" : "/assets/detail/detail-macbook-main.png";

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : isBook
      ? [
          "/assets/detail/detail-book-main.png",
          "/assets/detail/detail-book-2.png",
          "/assets/detail/detail-book-3.png",
          "/assets/detail/detail-book-4.png",
        ]
      : [
          "/assets/detail/detail-macbook-main.png",
          "/assets/detail/detail-mac-screen.png",
          "/assets/detail/detail-mac-kb.png",
          "/assets/detail/detail-mac-port.png",
        ];

  const detailThumbs = isBook
    ? [
        "/assets/detail/detail-book-main.png",
        "/assets/detail/detail-book-2.png",
        "/assets/detail/detail-book-3.png",
        "/assets/detail/detail-book-4.png",
      ]
    : [
        "/assets/detail/detail-macbook-main.png",
        "/assets/detail/detail-mac-screen.png",
        "/assets/detail/detail-mac-kb.png",
        "/assets/detail/detail-mac-port.png",
      ];

  const [selectedCustomImage, setSelectedCustomImage] = useState<string | null>(null);
  const currentMainImage = selectedCustomImage || galleryImages[activeImageIdx] || fallbackMain;

  const handlePrevImage = () => {
    setSelectedCustomImage(null);
    setActiveImageIdx((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedCustomImage(null);
    setActiveImageIdx((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setUserCoords({ lat: uLat, lng: uLng });
        setGpsStatus("active");
        const dist = calculateDistanceKm(uLat, uLng, destLocation.lat, destLocation.lng);
        setDistanceKm(dist);
        setEstimatedMinutes(Math.max(2, Math.round(dist * 3.5)));
      },
      () => {
        setGpsStatus("idle");
      },
      { timeout: 5000 }
    );
  }, [destLocation.lat, destLocation.lng]);

  const handleGetGps = () => {
    if (!navigator.geolocation) {
      if (onNotice) onNotice("Trình duyệt không hỗ trợ Geolocation.");
      return;
    }
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setUserCoords({ lat: uLat, lng: uLng });
        setGpsStatus("active");
        const dist = calculateDistanceKm(uLat, uLng, destLocation.lat, destLocation.lng);
        setDistanceKm(dist);
        setEstimatedMinutes(Math.max(2, Math.round(dist * 3.5)));
        if (onNotice) onNotice(`Đã định vị thành công! Cách bạn khoảng ${dist} km`);
      },
      () => {
        setGpsStatus("error");
        if (onNotice) onNotice("Không thể lấy tọa độ GPS. Vui lòng cấp quyền vị trí.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleOpenGoogleMapsDirections = () => {
    const originParam = userCoords ? `${userCoords.lat},${userCoords.lng}` : "My Location";
    const destinationParam = `${destLocation.lat},${destLocation.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originParam)}&destination=${encodeURIComponent(destinationParam)}&travelmode=two_wheeler`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // 4 Quick Specs Pills (Hàng 4 thông số gọn gàng như ảnh mẫu)
  const quickSpecs = isBook
    ? [
        { label: "Tình trạng", value: product.condition || "95% rất tốt", icon: Leaf },
        { label: "Thể loại", value: "Giáo trình ĐH", icon: BookOpen },
        { label: "NXB", value: "Kinh tế TP.HCM", icon: ShieldCheck },
        { label: "Năm xuất bản", value: "2023", icon: Calendar },
      ]
    : isMacbook
    ? [
        { label: "Tình trạng", value: product.condition || "98% không trầy xước", icon: Leaf },
        { label: "Vi xử lý", value: "Apple M1", icon: Cpu },
        { label: "Bộ nhớ", value: "8GB / 256GB", icon: HardDrive },
        { label: "Pin", value: "Còn 91%", icon: BatteryCharging },
      ]
    : [
        { label: "Tình trạng", value: product.condition || "90% còn mới", icon: Leaf },
        { label: "Phân loại", value: "Đồ sinh viên", icon: Tag },
        { label: "Xác minh", value: "Chính chủ", icon: ShieldCheck },
        { label: "Đăng ngày", value: "Gần đây", icon: Calendar },
      ];

  // Detailed Specs (Bảng THÔNG TIN SẢN PHẨM 8 dòng)
  const detailedSpecs = isBook
    ? [
        { label: "Tên giáo trình", value: product.title, icon: BookOpen },
        { label: "Chủ biên", value: "Bộ môn Kinh tế học UEH", icon: Layers },
        { label: "Nhà xuất bản", value: "NXB ĐH Kinh tế TP.HCM", icon: BookOpen },
        { label: "Năm tái bản", value: "2023 (Tái bản có sửa đổi)", icon: Calendar },
        { label: "Số trang", value: "420 trang", icon: HardDrive },
        { label: "Loại bìa", value: "Bìa mềm cán bóng", icon: Layers },
        { label: "Ngôn ngữ", value: "Tiếng Việt", icon: BookOpen },
        { label: "Tình trạng ruột", value: "Đầy đủ 100%, không rách", icon: Leaf },
      ]
    : isMacbook
    ? [
        { label: "Tên sản phẩm", value: product.title, icon: Laptop },
        { label: "CPU", value: "Apple M1 (8 nhân GPU/CPU)", icon: Cpu },
        { label: "RAM", value: "8GB Unified Memory", icon: Layers },
        { label: "Ổ cứng", value: "256GB SSD tốc độ cao", icon: HardDrive },
        { label: "Màn hình", value: "13.3 inch Retina True Tone", icon: Monitor },
        { label: "Pin", value: "Dùng liên tục 8-10 tiếng", icon: BatteryCharging },
        { label: "Ngoại hình", value: "98% có dán keo cẩn thận", icon: Leaf },
        { label: "Phụ kiện", value: "Củ sạc và cáp sạc Type-C", icon: ShieldCheck },
      ]
    : [
        { label: "Tên sản phẩm", value: product.title, icon: Tag },
        { label: "Tình trạng", value: product.condition || "Tốt", icon: Leaf },
        { label: "Địa điểm hẹn", value: product.meetingSpot || destLocation.label, icon: MapPin },
        { label: "Khuôn viên", value: destLocation.label, icon: Building },
        {
          label: "Hình thức",
          value:
            product.tradeType === "giveaway"
              ? "Tặng miễn phí 0đ"
              : product.tradeType === "swap"
              ? "Trao đổi đồ"
              : "Thanh lý sinh viên",
          icon: Layers,
        },
        { label: "Tài khoản", value: "Sinh viên đã xác thực", icon: ShieldCheck },
        { label: "Nguồn gốc", value: "Chính chủ sử dụng", icon: HardDrive },
        { label: "Kiểm tra", value: "Cho phép xem trực tiếp", icon: Check },
      ];

  // Checklist tình trạng (6 tiêu chí kèm icon xanh tick chuẩn)
  const checklist = isBook
    ? [
        { title: "Bìa sách", desc: "Không rách mép, gáy sách chắc chắn" },
        { title: "Trang ruột", desc: "Đầy đủ 420 trang, không mất trang" },
        { title: "Chữ viết", desc: "Có note nhẹ bút chì ở chương 2-3" },
        { title: "Chất lượng giấy", desc: "Giấy in offset sáng rõ, không ố vàng" },
        { title: "Mùi sách", desc: "Sạch sẽ, thơm tho, không ẩm mốc" },
        { title: "Tài liệu tặng kèm", desc: "Tặng kèm tài liệu đề cương ôn thi giữa kỳ UEH" },
      ]
    : isMacbook
    ? [
        { title: "Màn hình Retina", desc: "Sáng đẹp, không điểm chết, không ám ố" },
        { title: "Bàn phím & Trackpad", desc: "Gõ êm, mượt mà, phản hồi tốt" },
        { title: "Hiệu năng M1", desc: "Chạy mượt Xcode, Photoshop, Canva, Office" },
        { title: "Pin & Nhiệt độ", desc: "Máy mát, pin trâu cả ngày làm việc" },
        { title: "Loa & Camera", desc: "Loa kép âm vang, Mic bắt tiếng rõ" },
        { title: "iCloud & Nguồn gốc", desc: "Chính chủ reset dòng 2 tại chỗ" },
      ]
    : [
        { title: "Mô tả thực tế", desc: "Sản phẩm đúng như ảnh chụp thực tế" },
        { title: "Chức năng", desc: "Hoạt động trơn tru không lỗi lầm" },
        { title: "Độ bền & Vệ sinh", desc: "Đã được vệ sinh sạch sẽ thơm tho" },
        { title: "Nguồn gốc", desc: "Đồ dùng học tập cá nhân sinh viên" },
        { title: "Bàn giao", desc: "Hẹn gặp trực tiếp tại sảnh trường / KTX" },
        { title: "Bao test", desc: "Kiểm tra thoải mái trước khi thanh toán" },
      ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200"
      onClick={onBack}
      role="dialog"
      aria-modal="true"
    >
      {/* Zoom to khung viền theo đúng yêu cầu: giữ nguyên thiết kế 1 khuôn gom gọn không cuộn */}
      <div
        className="animate-in zoom-in-95 duration-200 origin-center"
        style={{
          width: "1024px",
          maxWidth: "98vw",
          transform: "scale(1.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-white rounded-2xl border border-gray-200/90 shadow-2xl relative font-sans text-gray-800"
          style={{
            width: "1024px",
            maxWidth: "100%",
            boxSizing: "border-box",
            padding: "14px 16px",
            margin: "0 auto",
            height: "530px",
            maxHeight: "92vh",
            overflow: "hidden",
          }}
        >
          {/* Nút Đóng (X) góc trên bên phải */}
          <button
            type="button"
            onClick={onBack}
            className="absolute top-2.5 right-2.5 z-40 w-7 h-7 rounded-full bg-white/95 hover:bg-gray-100 text-gray-600 shadow-xs flex items-center justify-center transition-all cursor-pointer border border-gray-200 hover:scale-105 active:scale-95"
            aria-label="Đóng chi tiết sản phẩm"
            title="Đóng (Esc)"
          >
            <X className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>

          {/* ========================================================================= */}
          {/* MASTER 2-COLUMN LAYOUT: Cột Trái 665px + Cột Phải Bản Đồ 315px           */}
          {/* ========================================================================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "665px 315px",
              gap: "14px",
              alignItems: "start",
              height: "100%",
            }}
          >
            {/* ======================================================================= */}
            {/* CỘT TRÁI: Nửa Trên (Ảnh + Thông Tin) & Nửa Dưới (Tabs + Bảng Thông Số)    */}
            {/* ======================================================================= */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              {/* --------------------------------------------------------------------- */}
              {/* NỬA TRÊN: Gallery (Trái 255px) + Tóm tắt sản phẩm & Hành động (Phải) */}
              {/* --------------------------------------------------------------------- */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "255px 1fr",
                  gap: "14px",
                  alignItems: "start",
                }}
              >
                {/* GALLERY BÊN TRÁI (~255px) */}
                <div style={{ width: "255px" }}>
                  {/* Ảnh chính lớn (Tỷ lệ chuẩn 255x146px) */}
                  <div
                    className="relative rounded-xl overflow-hidden bg-[#f6f7f5] border border-gray-100 shadow-2xs group flex items-center justify-center"
                    style={{ width: "255px", height: "146px" }}
                  >
                    <img
                      src={currentMainImage}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackMain;
                      }}
                    />

                    {/* Campus Check Badge góc trên bên trái */}
                    <div className="absolute top-1.5 left-1.5 bg-[#00513D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
                      <span>Campus Check</span>
                    </div>

                    {/* Nút lùi ảnh */}
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5.5 h-5.5 rounded-full bg-white/95 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                      aria-label="Ảnh trước"
                    >
                      <ChevronLeft className="w-3 h-3 stroke-[2.5]" />
                    </button>

                    {/* Nút tiến ảnh */}
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5.5 h-5.5 rounded-full bg-white/95 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                      aria-label="Ảnh sau"
                    >
                      <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                    </button>

                    {/* Bộ đếm ảnh góc dưới bên phải */}
                    <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[8.5px] font-semibold px-1.5 py-0.2 rounded">
                      {selectedCustomImage ? "Chi tiết" : `${activeImageIdx + 1}/${galleryImages.length}`}
                    </div>
                  </div>

                  {/* Khối HÌNH ẢNH CHI TIẾT (4 Thumbnails) */}
                  <div style={{ marginTop: "6px" }}>
                    <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-1">
                      Hình ảnh chi tiết
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "5px",
                      }}
                    >
                      {detailThumbs.slice(0, 4).map((img, idx) => {
                        const isSelected = currentMainImage === img;
                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedCustomImage(img)}
                            className={`rounded-lg overflow-hidden bg-gray-100 border transition-all cursor-pointer ${
                              isSelected
                                ? "border-2 border-[#00513D] shadow-xs"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                            style={{ height: "46px" }}
                          >
                            <img
                              src={img}
                              alt={`Detail ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = fallbackMain;
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* THÔNG TIN TÓM TẮT & NÚT HÀNH ĐỘNG BÊN PHẢI */}
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <div>
                    {/* Tiêu đề sản phẩm */}
                    <h1 className="text-[17px] font-black text-gray-900 tracking-tight leading-tight line-clamp-2">
                      {product.title}
                    </h1>

                    {/* Điểm hẹn giao dịch */}
                    <div className="flex items-center gap-1 text-[10.5px] text-gray-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#00513D] shrink-0" />
                      <span className="truncate">{product.meetingSpot || destLocation.label}</span>
                    </div>
                  </div>

                  {/* Giá bán & Huy hiệu Thương lượng */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[20px] font-black text-[#00513D] tracking-tight leading-none">
                      {product.price === 0 ? "0đ (Miễn phí)" : `${product.price.toLocaleString("vi-VN")}đ`}
                    </span>
                    <span className="bg-[#eef7ee] text-[#2e7d32] text-[9px] font-bold px-1.5 py-0.2 rounded">
                      {product.price === 0 ? "Tặng đồ 0đ" : "Thương lượng"}
                    </span>
                  </div>

                  {/* 4 Hộp thông số nhanh (1 hàng) */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "5px",
                      marginTop: "1px",
                    }}
                  >
                    {quickSpecs.map((qs, qidx) => {
                      const QIcon = qs.icon;
                      return (
                        <div
                          key={qidx}
                          className="bg-[#f8faf8] border border-gray-100 rounded-lg p-1.5 flex items-center gap-1"
                        >
                          <div className="w-4 h-4 rounded bg-emerald-100/70 text-[#00513D] flex items-center justify-center shrink-0">
                            <QIcon className="w-2.5 h-2.5 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[7.5px] text-gray-400 leading-none truncate">{qs.label}</div>
                            <div className="text-[9.5px] font-bold text-gray-800 truncate mt-0.5">
                              {qs.value}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mô tả ngắn */}
                  <p className="text-[10px] text-gray-600 leading-relaxed mt-0.5 line-clamp-2">
                    {product.description || `${product.title} giữ gìn cẩn thận, đầy đủ phụ kiện, sẵn sàng bàn giao.`}
                  </p>

                  {/* Hàng nút bấm Hành động */}
                  <div className="flex items-center gap-2 mt-1 flex-wrap sm:flex-nowrap">
                    <button
                      type="button"
                      onClick={() => onOpenPaymentReg?.(product)}
                      className="bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98 shrink-0"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Đăng ký để biết thông tin</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenChat(product)}
                      className="flex-1 bg-[#00513D] hover:bg-[#073e2b] text-white font-bold text-[11px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat với người bán</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleLike(product.id)}
                      className="border border-gray-200 hover:bg-gray-50 text-gray-800 font-semibold text-[10.5px] py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? "fill-rose-500 text-rose-500" : "text-gray-600"
                        }`}
                      />
                      <span>{isLiked ? "Đã lưu" : "Thêm vào yêu thích"}</span>
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="w-7 h-7 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0"
                        aria-label="Tùy chọn khác"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>

                      {showMoreMenu && (
                        <div className="absolute right-0 bottom-full mb-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-lg p-1 z-30 text-xs">
                          {onReserve && product.status === "available" && (
                            <button
                              type="button"
                              onClick={() => {
                                setShowMoreMenu(false);
                                onReserve(product);
                              }}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-gray-50 rounded-lg font-medium text-gray-800"
                            >
                              Đặt giữ món đồ
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setShowMoreMenu(false);
                              onOpenProfile(product.seller?.id || "");
                            }}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-gray-50 rounded-lg font-medium text-gray-800"
                          >
                            Xem trang cá nhân
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowMoreMenu(false);
                              navigator.clipboard?.writeText(window.location.href);
                              if (onNotice) onNotice("Đã sao chép liên kết sản phẩm!");
                            }}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-gray-50 rounded-lg font-medium text-gray-800"
                          >
                            Sao chép liên kết
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowMoreMenu(false);
                              onReport(product);
                            }}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-rose-50 rounded-lg font-medium text-rose-600"
                          >
                            Báo cáo bài đăng
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* --------------------------------------------------------------------- */}
              {/* NỬA DƯỚI: TABS & 2 CỘT SONG SONG (THÔNG TIN SẢN PHẨM & CHECKLIST)     */}
              {/* --------------------------------------------------------------------- */}
              <div style={{ borderTop: "1px solid #f1f3f1", paddingTop: "5px" }}>
                {/* Thanh điều hướng Tabs */}
                <div className="flex items-center gap-5 border-b border-gray-100 text-[10.5px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("info")}
                    className={`pb-1 relative transition-colors cursor-pointer ${
                      activeTab === "info"
                        ? "text-[#00513D] font-bold border-b-2 border-[#00513D]"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Thông tin chi tiết
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("condition")}
                    className={`pb-1 relative transition-colors cursor-pointer ${
                      activeTab === "condition"
                        ? "text-[#00513D] font-bold border-b-2 border-[#00513D]"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Tình trạng sản phẩm
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("reviews")}
                    className={`pb-1 relative transition-colors cursor-pointer ${
                      activeTab === "reviews"
                        ? "text-[#00513D] font-bold border-b-2 border-[#00513D]"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Đánh giá (18)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("qa")}
                    className={`pb-1 relative transition-colors cursor-pointer ${
                      activeTab === "qa"
                        ? "text-[#00513D] font-bold border-b-2 border-[#00513D]"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Hỏi đáp (3)
                  </button>
                </div>

                {/* NỘI DUNG TAB 1: 2 CỘT SONG SONG (THÔNG TIN SẢN PHẨM & CHECKLIST TÌNH TRẠNG) */}
                {activeTab === "info" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      alignItems: "start",
                      paddingTop: "6px",
                    }}
                  >
                    {/* Cột con 1: THÔNG TIN SẢN PHẨM */}
                    <div>
                      <h3 className="text-[9.5px] font-bold text-gray-900 uppercase tracking-wider mb-0.5">
                        Thông tin sản phẩm
                      </h3>
                      <div className="space-y-0.5 text-[9px]">
                        {detailedSpecs.map((item, idx) => {
                          const Icon = item.icon || Tag;
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-0.5 border-b border-gray-50 leading-tight"
                            >
                              <div className="flex items-center gap-1.5 text-gray-400">
                                <Icon className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                                <span>{item.label}</span>
                              </div>
                              <span className="font-semibold text-gray-800 text-right truncate max-w-[155px]">
                                {item.value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cột con 2: CHECKLIST TÌNH TRẠNG */}
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-[9.5px] font-bold text-gray-900 uppercase tracking-wider">
                          Checklist tình trạng
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[8px] font-bold text-[#00513D] bg-[#eef7f2] px-1.5 py-0.2 rounded-full">
                          <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
                          Campus Check
                        </span>
                      </div>

                      <div className="space-y-0.5 mb-1">
                        {checklist.map((c, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 py-0.5 border-b border-gray-50 text-[9px] leading-tight"
                          >
                            <div className="w-3 h-3 rounded-full bg-[#00b074] text-white flex items-center justify-center shrink-0">
                              <Check className="w-2 h-2 stroke-[3]" />
                            </div>
                            <span className="font-semibold text-gray-800 shrink-0">{c.title}</span>
                            <span className="text-gray-400 text-right flex-1 truncate text-[8.5px]">
                              {c.desc}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Hộp lưu ý màu vàng */}
                      <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-md p-1.5 flex items-start gap-1 text-[8px] text-[#92400e] leading-snug">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                        <p>
                          Đây là thông tin do người bán cung cấp, vui lòng kiểm tra kỹ trước khi giao dịch.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* NỘI DUNG TAB 2: TÌNH TRẠNG SẢN PHẨM */}
                {activeTab === "condition" && (
                  <div className="pt-2 space-y-1.5 text-xs">
                    <div className="bg-[#eef7f2] p-2 rounded-lg text-[#00513D] font-bold text-[10px] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Xác minh tình trạng Campus Check bởi Sinh viên</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {checklist.map((c, idx) => (
                        <div
                          key={idx}
                          className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-1.5 text-[9px]"
                        >
                          <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-gray-800">{c.title}</div>
                            <div className="text-gray-500 text-[8px]">{c.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NỘI DUNG TAB 3: ĐÁNH GIÁ (18) */}
                {activeTab === "reviews" && (
                  <div className="pt-2 space-y-1.5">
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg text-xs">
                      <span className="text-lg font-black text-gray-900 leading-none">4.9</span>
                      <div className="text-amber-400 text-xs">★★★★★</div>
                      <span className="text-[10px] text-gray-500">100% sinh viên hài lòng sau khi nhận đồ</span>
                    </div>
                    <div className="space-y-1">
                      {[
                        {
                          name: "Trần Minh Quân",
                          time: "2 ngày trước",
                          text: "Bạn bán rất nhiệt tình, đúng như mô tả, bao test chu đáo!",
                        },
                        {
                          name: "Lê Hoàng Phúc",
                          time: "1 tuần trước",
                          text: "Giao dịch nhanh tại cổng trường, đồ còn rất mới!",
                        },
                      ].map((rev, idx) => (
                        <div
                          key={idx}
                          className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 text-[9px]"
                        >
                          <div className="flex justify-between font-bold text-gray-800">
                            <span>{rev.name}</span>
                            <span className="text-gray-400 font-normal">{rev.time}</span>
                          </div>
                          <p className="text-gray-600 mt-0.5">{rev.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NỘI DUNG TAB 4: HỎI ĐÁP (3) */}
                {activeTab === "qa" && (
                  <div className="pt-2 space-y-1.5 text-[9px]">
                    {[
                      {
                        q: "Món này có hỗ trợ bớt chút tiền xăng không bạn?",
                        a: "Dạ có fix nhẹ cho bạn qua tận sảnh trường lấy nhé!",
                      },
                      {
                        q: "Có giao được qua KTX không?",
                        a: "Được bạn nha, chiều 5h mình học về ghé ngang được.",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 space-y-0.5"
                      >
                        <div className="font-bold text-gray-900">Hỏi: {item.q}</div>
                        <div className="text-emerald-800 pl-1.5 border-l-2 border-emerald-500">
                          Trả lời: {item.a}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ======================================================================= */}
            {/* CỘT PHẢI: BẢN ĐỒ TO + GOOGLE MAPS VỆ TINH + CHỈ ĐƯỜNG GPS THỜI GIAN THỰC*/}
            {/* ======================================================================= */}
            <div className="bg-[#fbfdfb] rounded-xl border border-gray-200/90 shadow-2xs p-2.5 h-full flex flex-col justify-between">
              {/* Header bản đồ & Bộ chuyển đổi */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-gray-900 leading-tight">
                    <div className="w-5 h-5 rounded-full bg-[#00513D]/10 text-[#00513D] flex items-center justify-center shrink-0">
                      <MapPin className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <span>Địa điểm giao nhận</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenGoogleMapsDirections}
                    className="text-[9px] text-[#00513D] hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>

                <p className="text-[9px] text-gray-600 leading-tight mt-1 truncate">
                  • Trong khuôn viên <strong className="text-gray-900">{destLocation.label}</strong>
                </p>

                {/* Thanh đo khoảng cách GPS thời gian thực */}
                <div className="bg-[#eef7f2] border border-emerald-100 rounded-lg px-2 py-1 flex items-center justify-between gap-1.5 mt-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <LocateFixed
                      className={`w-3.5 h-3.5 shrink-0 ${
                        gpsStatus === "active" ? "text-emerald-600 animate-pulse" : "text-gray-400"
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-[#00513D] text-[9px] leading-tight truncate">
                        {gpsStatus === "active"
                          ? `Cách bạn: ~${distanceKm} km (khoảng ${estimatedMinutes} phút)`
                          : gpsStatus === "loading"
                          ? "Đang dò GPS của bạn..."
                          : "Định vị GPS của bạn"}
                      </div>
                      <div className="text-[7.5px] text-gray-500 truncate leading-tight">
                        {destLocation.address}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGetGps}
                    className="px-2 py-1 bg-[#00513D] hover:bg-[#073e2b] text-white font-bold text-[8px] rounded shadow-2xs cursor-pointer shrink-0 transition-colors"
                    title="Lấy tọa độ GPS hiện tại của bạn"
                  >
                    {gpsStatus === "active" ? "Làm mới GPS" : "Bật GPS"}
                  </button>
                </div>
              </div>

              {/* Khung bản đồ tương tác lớn Leaflet (Vệ tinh Google Maps hybrid sắc nét) */}
              <div className="relative rounded-xl overflow-hidden border border-gray-200/90 bg-gray-100 my-1.5 flex-1 min-h-[250px] shadow-inner">
                <InteractiveMap
                  lat={destLocation.lat}
                  lng={destLocation.lng}
                  label={destLocation.label}
                  address={destLocation.address}
                  userCoords={userCoords}
                  onOpenDirections={handleOpenGoogleMapsDirections}
                />
              </div>

              {/* Gợi ý an toàn & Nút chỉ đường GPS nổi bật */}
              <div className="space-y-1 pt-1 border-t border-gray-100">
                <div className="bg-[#fffbeb] border border-amber-200/80 rounded-md p-1.5 text-[8px] text-[#92400e] leading-snug flex items-center gap-1.5 shadow-3xs">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 fill-amber-200 shrink-0" />
                  <span>
                    <strong>Gợi ý an toàn:</strong> Giao dịch tại sảnh thư viện, căn tin hoặc cổng trường vào ban ngày.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenGoogleMapsDirections}
                  className="w-full py-1.5 rounded-lg bg-[#00513D] hover:bg-[#073e2b] text-white text-[10.5px] font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-98"
                >
                  <Navigation className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Chỉ đường trên Google Maps (từ GPS)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailView;
