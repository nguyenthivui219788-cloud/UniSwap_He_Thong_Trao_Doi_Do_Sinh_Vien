import React, { useState, useMemo } from "react";
import {
  User as UserIcon,
  Package,
  Heart,
  Star,
  Gift,
  LogOut,
  Camera,
  CheckCircle2,
  ChevronRight,
  Headphones,
  ArrowRight,
  Plus,
  ChevronDown,
  Edit,
  MoreVertical,
  MapPin,
  Clock,
  Sparkles,
  Share2,
  Trash2,
  Eye,
  Check,
  X,
  FileText,
  Send,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  Sun,
  Award,
  Zap,
  ShoppingBag,
  Coins,
  History,
  ThumbsUp,
  Bell,
  MessageCircle,
} from "lucide-react";
import type { ProductItem, User } from "../types";
import { AdminPanel } from "./AdminPanel";

export interface UserProfileViewProps {
  currentUser?: User | null;
  userProducts?: ProductItem[];
  allProducts?: ProductItem[];
  likedIds?: Set<string>;
  onToggleLike?: (id: string) => void;
  onOpenCreatePost?: () => void;
  onSelectProduct?: (product: ProductItem) => void;
  onLogout?: () => void;
  onBackToHome: () => void;
  onOpenChatWithSeller?: (p: ProductItem) => void;
  initialMode?: "list" | "create";
  initialTab?: string;
  onPublishSuccess?: (newProduct: ProductItem) => void;
}

export function UserProfileView({
  currentUser,
  userProducts = [],
  allProducts = [],
  likedIds,
  onToggleLike,
  onOpenCreatePost,
  onSelectProduct,
  onLogout,
  onBackToHome,
  onOpenChatWithSeller,
  initialMode = "list",
  initialTab = "profile",
  onPublishSuccess,
}: UserProfileViewProps) {
  // Chế độ hiển thị:
  // - "profile": Trang Tài khoản của tôi (Banner + 4 stats + danh sách tin đăng)
  // - "create": Form Đăng tin mới (KHÔNG có banner, KHÔNG có 4 stats)
  // - "saved": Sản phẩm yêu thích (KHÔNG có banner, KHÔNG có 4 stats)
  // - "reviews": Đánh giá & uy tín (KHÔNG có banner, KHÔNG có 4 stats)
  // - "rewards": Điểm thưởng UniPoints (KHÔNG có banner, KHÔNG có 4 stats)
  const [activeTab, setActiveTab] = useState<string>(
    initialMode === "create" ? "create" : initialTab || "profile"
  );

  const [sortOption, setSortOption] = useState<string>("newest");
  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);
  const [menuActionItem, setMenuActionItem] = useState<string | null>(null);
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);

  // =========================================================================
  // STATE CHO FORM ĐĂNG TIN MỚI (KHI activeTab === "create")
  // =========================================================================
  const [category, setCategory] = useState("Đồ công nghệ");
  const [subcategory, setSubcategory] = useState("Laptop, máy tính bàn");
  const [title, setTitle] = useState("Macbook Air M1 2020 (8GB/256GB)");
  const [price, setPrice] = useState<string>("7500000");
  const [isFree, setIsFree] = useState(false);
  const [condition, setCondition] = useState("Tốt");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState(
    "Macbook Air M1 2020, máy đẹp, hoạt động ổn định, pin trâu. Phù hợp cho học tập, làm việc và giải trí. Máy đã được vệ sinh, cài lại macOS mới, full chức năng."
  );

  const [images, setImages] = useState<string[]>([
    "/assets/detail/macbook-main.png",
    "/assets/detail/macbook-detail-1.png",
    "/assets/detail/macbook-detail-2.png",
  ]);

  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState("Macbook Air M1");
  const [year, setYear] = useState("2021");
  const [specs, setSpecs] = useState("RAM 8GB, SSD 256GB, M1");
  const [accessories, setAccessories] = useState("Đầy đủ sạc cáp zin");
  const [warranty, setWarranty] = useState("Không");
  const [location, setLocation] = useState("Đại học Bách Khoa TP.HCM");
  const [deliveryMethod, setDeliveryMethod] = useState<"direct" | "shipping" | "both">("direct");
  const [busy, setBusy] = useState(false);
  const [publishNotice, setPublishNotice] = useState(false);

  // Thêm ảnh từ máy
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Nộp form đăng tin
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    const newProd: ProductItem = {
      id: `p-${Date.now()}`,
      title: title || "Sản phẩm sinh viên",
      description: description,
      price: isFree ? 0 : Number(price) || 0,
      category: "electronics",
      condition: condition,
      majorGroup: "general",
      images: images.length > 0 ? images : ["/assets/detail/macbook-main.png"],
      cluster: "lang-dh",
      tradeType: isFree ? "giveaway" : "sale",
      status: "available",
      createdAt: new Date().toISOString(),
      meetingSpot: location,
      views: 1,
      likes: 0,
      seller: {
        id: currentUser?.id || "usr_current",
        name: currentUser?.name || "Duy Em",
        studentId: currentUser?.studentId || "2305CT0661",
        universityCode: currentUser?.universityCode || "DHV",
        avatar: currentUser?.avatar || "/assets/avatar-default.png",
        rating: 4.8,
        isVerified: true,
        isPro: currentUser?.tier === "hunter_pro",
      },
    };

    setTimeout(() => {
      setBusy(false);
      setPublishNotice(true);
      if (onPublishSuccess) {
        onPublishSuccess(newProd);
      }
      setTimeout(() => {
        setPublishNotice(false);
        setActiveTab("profile");
      }, 1200);
    }, 600);
  };

  // =========================================================================
  // DANH SÁCH 4 BÀI ĐĂNG CỦA TÔI
  // =========================================================================
  interface ListingItemModel {
    id: string;
    title: string;
    badgeType: string;
    condition: string;
    category: string;
    location: string;
    time: string;
    image: string;
    fallbackImage: string;
    price: number;
    rawProduct?: ProductItem;
  }

  const initialDemoItems: ListingItemModel[] = [
    {
      id: "demo-book-macro",
      title: "Sách giáo trình Kinh tế vĩ mô",
      badgeType: "giveaway",
      condition: "Còn tốt",
      category: "Sách & giáo trình",
      location: "Q.10, TP.HCM",
      time: "2 ngày trước",
      image: "/assets/detail/book-detail-1.png",
      fallbackImage: "/assets/3d-books.png",
      price: 0,
    },
    {
      id: "demo-laptop-dell",
      title: "Laptop Dell Inspiron 15",
      badgeType: "sale",
      condition: "Còn tốt",
      category: "Laptop",
      location: "Thủ Đức, TP.HCM",
      time: "3 ngày trước",
      image: "/assets/detail/macbook-detail-1.png",
      fallbackImage: "/assets/3d-tech.png",
      price: 6800000,
    },
    {
      id: "demo-backpack-mini",
      title: "Balo thời trang mini",
      badgeType: "giveaway",
      condition: "Còn tốt",
      category: "Thời trang",
      location: "Bình Thạnh, TP.HCM",
      time: "5 ngày trước",
      image: "/assets/detail/backpack-detail-1.png",
      fallbackImage: "/assets/3d-fashion.png",
      price: 0,
    },
    {
      id: "demo-mouse-logitech",
      title: "Chuột không dây Logitech",
      badgeType: "sale",
      condition: "Còn tốt",
      category: "Đồ công nghệ",
      location: "Tân Bình, TP.HCM",
      time: "1 tuần trước",
      image: "/assets/detail/frog-detail-1.png",
      fallbackImage: "/assets/cat-exact-1.png",
      price: 150000,
    },
  ];

  const allListings = React.useMemo(() => {
    if (userProducts && userProducts.length > 0) {
      const converted = userProducts.map((p) => ({
        id: p.id,
        title: p.title,
        badgeType: p.tradeType === "giveaway" || p.price === 0 ? "giveaway" : "sale",
        condition: p.condition || "Còn tốt",
        category: p.category || "Đồ sinh viên",
        location: p.meetingSpot || "TP.HCM",
        time: "Vừa xong",
        image: p.images?.[0] || "/assets/detail/macbook-main.png",
        fallbackImage: "/assets/detail/macbook-main.png",
        price: p.price,
        rawProduct: p,
      }));
      return [...converted, ...initialDemoItems];
    }
    return initialDemoItems;
  }, [userProducts]);

  // =========================================================================
  // DỮ LIỆU SẢN PHẨM YÊU THÍCH (ĐỒNG BỘ TOÀN SÀN TỪ allProducts VÀ likedIds)
  // =========================================================================
  const [demoSavedItems, setDemoSavedItems] = useState([
    {
      id: "saved-1",
      title: "Giáo trình Giải tích 1 & 2 (Bách Khoa)",
      price: 0,
      isFree: true,
      condition: "95% như mới",
      category: "Sách",
      location: "KTX Khu A, ĐHQG",
      school: "HCMUT",
      image: "/assets/detail/book-detail-2.png",
      seller: "Trần Bảo Long",
      rawProduct: null as ProductItem | null,
    },
    {
      id: "saved-2",
      title: "Tai nghe không dây chống ồn Sony WH-CH520",
      price: 450000,
      isFree: false,
      condition: "Còn bảo hành 3 tháng",
      category: "Công nghệ",
      location: "Quận 5, TP.HCM",
      school: "HCMUS",
      image: "/assets/detail/frog-detail-2.png",
      seller: "Nguyễn Minh Khang",
      rawProduct: null as ProductItem | null,
    },
    {
      id: "saved-3",
      title: "Nồi cơm điện mini Lock&Lock 0.8L (tiết kiệm điện KTX)",
      price: 180000,
      isFree: false,
      condition: "Dùng tốt, sạch sẽ",
      category: "Phòng trọ",
      location: "Bình Thạnh, TP.HCM",
      school: "VLU",
      image: "/assets/detail/lamp-detail-1.png",
      seller: "Đặng Thuỳ Linh",
      rawProduct: null as ProductItem | null,
    },
    {
      id: "saved-4",
      title: "Bàn gỗ chân gấp học bài ngồi giường KTX",
      price: 0,
      isFree: true,
      condition: "Còn chắc chắn",
      category: "Phòng trọ",
      location: "KTX Khu B, TP.Thủ Đức",
      school: "UIT",
      image: "/assets/detail/lamp-detail-2.png",
      seller: "Võ Hoàng Nam",
      rawProduct: null as ProductItem | null,
    },
    {
      id: "saved-5",
      title: "Combo Bút dạ quang pastel + Sổ còng B5 Campus",
      price: 45000,
      isFree: false,
      condition: "Mới 100% nguyên seal",
      category: "Đồ học tập",
      location: "Quận 10, TP.HCM",
      school: "UEH",
      image: "/assets/detail/book-detail-3.png",
      seller: "Lê Cẩm Tú",
      rawProduct: null as ProductItem | null,
    },
    {
      id: "saved-6",
      title: "Áo khoác dù bomber 2 lớp local brand",
      price: 90000,
      isFree: false,
      condition: "Mặc 2 lần",
      category: "Thời trang",
      location: "Gò Vấp, TP.HCM",
      school: "IUH",
      image: "/assets/detail/backpack-detail-2.png",
      seller: "Phạm Hải Đăng",
      rawProduct: null as ProductItem | null,
    },
  ]);

  // Đồng bộ sản phẩm Yêu thích thực tế từ `allProducts` và `likedIds`
  const realLikedProducts = useMemo(() => {
    if (allProducts && allProducts.length > 0 && likedIds && likedIds.size > 0) {
      return allProducts.filter((p) => likedIds.has(p.id));
    }
    return [];
  }, [allProducts, likedIds]);

  const displayedSavedItems = useMemo(() => {
    if (likedIds !== undefined) {
      if (realLikedProducts.length > 0) {
        return realLikedProducts.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          isFree: p.tradeType === "giveaway" || p.price === 0,
          condition: p.condition || "Tốt",
          category: p.category,
          location: p.meetingSpot || "TP.HCM",
          school: p.seller?.universityCode || "DHV",
          image: p.images?.[0] || "/assets/detail/macbook-main.png",
          seller: p.seller?.name || "Người bán",
          rawProduct: p,
        }));
      }
      return [];
    }
    return demoSavedItems;
  }, [likedIds, realLikedProducts, demoSavedItems]);

  const totalSavedCount = likedIds !== undefined ? likedIds.size : displayedSavedItems.length;

  const handleRemoveSaved = (id: string) => {
    if (onToggleLike) {
      onToggleLike(id);
    }
    setDemoSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // =========================================================================
  // DỮ LIỆU MẪU CHO MỤC: ĐÁNH GIÁ (24 ĐÁNH GIÁ)
  // =========================================================================
  const reviewsList = [
    {
      id: "rev-1",
      author: "Lê Hoàng Nam",
      school: "ĐH Bách Khoa TP.HCM",
      avatar: "/assets/detail/seller-avatar.png",
      rating: 5,
      date: "2 ngày trước",
      productName: "Macbook Air M1 2020",
      content:
        "Máy tính rất đẹp, đúng như bạn mô tả. Bạn giao dịch rất nhanh nhẹn, hỗ trợ test máy nhiệt tình tại canteen trường. Rất uy tín và an tâm!",
    },
    {
      id: "rev-2",
      author: "Trần Thị Mai",
      school: "Đại học Văn Lang",
      avatar: "/assets/cat-exact-2.png",
      rating: 5,
      date: "5 ngày trước",
      productName: "Sách giáo trình Kinh tế vĩ mô [Cho tặng]",
      content:
        "Cảm ơn bạn Duy Em rất nhiều vì đã tặng sách cho mình. Sách còn mới tinh, bọc bìa cẩn thận. Chúc bạn kỳ này đạt GPA cao nhé!",
    },
    {
      id: "rev-3",
      author: "Nguyễn Quốc Bảo",
      school: "ĐH Khoa học Tự nhiên",
      avatar: "/assets/cat-exact-3.png",
      rating: 5,
      date: "1 tuần trước",
      productName: "Bàn phím cơ DareU EK87",
      content:
        "Giao dịch uy tín, hẹn gặp đúng giờ tại KTX Khu B. Hàng dùng ngon lành, sẽ ủng hộ tiếp nếu bạn có pass thêm đồ công nghệ.",
    },
    {
      id: "rev-4",
      author: "Phạm Quỳnh Anh",
      school: "ĐH Kinh Tế TP.HCM (UEH)",
      avatar: "/assets/cat-exact-4.png",
      rating: 5,
      date: "2 tuần trước",
      productName: "Balo mini thời trang [Cho tặng]",
      content:
        "Balo dễ thương lắm luôn, bạn chủ rất thân thiện và nhiệt tình. Cảm ơn tinh thần chia sẻ xanh của cộng đồng sinh viên UniSwap!",
    },
  ];

  // =========================================================================
  // DỮ LIỆU MẪU CHO MỤC: ĐIỂM THƯỞNG UNIPOINTS
  // =========================================================================
  const [points, setPoints] = useState(250);
  const rewardsStore = [
    {
      id: "rew-1",
      title: "Đẩy tin VIP TOP 1 (1 ngày)",
      cost: 50,
      desc: "Ghim bài đăng lên vị trí kim cương trang chủ suốt 24 giờ, tiếp cận hàng nghìn sinh viên.",
      icon: Zap,
      tag: "Phổ biến nhất",
    },
    {
      id: "rew-2",
      title: "Đẩy tin Combo Kim Cương (3 ngày)",
      cost: 120,
      desc: "Tiết kiệm 30 điểm. Giữ bài đăng ở trang đầu liên tục trong 72 giờ.",
      icon: Sparkles,
      tag: "Tiết kiệm 30 điểm",
    },
    {
      id: "rew-3",
      title: "Voucher 20.000đ Canteen trường",
      cost: 100,
      desc: "Áp dụng thanh toán tại căng tin các trường Bách Khoa, Văn Lang, UEH, KTX...",
      icon: ShoppingBag,
      tag: "Campus Partner",
    },
    {
      id: "rew-4",
      title: "Huy hiệu Chiến Binh Sống Xanh 🌿",
      cost: 150,
      desc: "Huy hiệu độc quyền gắn cạnh tên đại diện cho sinh viên tích cực lan tỏa đồ cũ.",
      icon: Award,
      tag: "Hồ sơ uy tín",
    },
  ];

  const handleRedeemReward = (title: string, cost: number) => {
    if (points < cost) {
      alert("Bạn chưa đủ điểm UniPoints để đổi phần quà này!");
      return;
    }
    setPoints((prev) => prev - cost);
    setRewardNotice(`Đã đổi thành công "${title}"! Phần thưởng đã được thêm vào tài khoản của bạn.`);
    setTimeout(() => setRewardNotice(null), 3000);
  };

  const userName = currentUser?.name || "Admin DHV (2305CT0661)";
  const userSchool = currentUser?.universityCode
    ? `ĐH ${currentUser.universityCode}`
    : "ĐH DHV";

  return (
    <div
      className="fixed inset-0 z-50 bg-[#f8faf8] flex flex-col overflow-y-auto"
      style={{
        fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: "#f8faf8",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {/* ======================================================================= */}
      {/* 1. TOP NAVBAR: ĐÚNG 100% THEO ẢNH 2 (ẢNH MẪU TRANG CHỦ)                 */}
      {/* Có: Khám phá, Danh mục, Góc cho tặng, Cần mua / cần tìm, Cộng đồng       */}
      {/* Nút: Thợ Săn Đồ PRO, ♡, 🔔, [Liên hệ], [👤 ⌄], [Đăng tin]                */}
      {/* ======================================================================= */}
      <header
        className="chat-header h-[72px] w-full px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-md z-30 sticky top-0"
        style={{
          backgroundColor: "#06462e",
          background: "#06462e",
          color: "#ffffff",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          boxSizing: "border-box",
        }}
      >
        {/* Bên trái: Logo + 5 mục điều hướng */}
        <div className="flex items-center gap-7">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onBackToHome();
            }}
            className="flex items-center gap-2.5 no-underline group cursor-pointer"
          >
            <img
              src="/assets/uniswap-logo.png"
              alt="Logo UniSwap"
              className="w-10 h-10 object-contain drop-shadow"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/logo.png";
              }}
            />
            <div className="flex flex-col">
              <span className="text-[22px] font-black leading-tight tracking-tight text-white">
                Uni<span style={{ color: "#f5b82c" }}>Swap</span>
              </span>
              <span
                className="text-[8px] font-extrabold uppercase tracking-[0.2em] mt-0.5"
                style={{ color: "#a7f3d0" }}
              >
                TRAO ĐỔI ĐỒ SINH VIÊN
              </span>
            </div>
          </a>

          {/* 5 Tab điều hướng chuẩn Ảnh 2: Khám phá, Danh mục, Góc cho tặng, Cần mua/cần tìm, Cộng đồng */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <button
              type="button"
              onClick={onBackToHome}
              className="px-3.5 py-1.5 rounded-full flex flex-col items-center relative transition-all cursor-pointer"
              style={{
                backgroundColor: "#043322",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span>Khám phá</span>
              <span className="w-8 h-0.5 bg-[#f5b82c] rounded-full mt-0.5"></span>
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0 text-sm font-medium"
              style={{ color: "#d1fae5", background: "transparent", border: 0 }}
            >
              Danh mục
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0 text-sm font-medium"
              style={{ color: "#d1fae5", background: "transparent", border: 0 }}
            >
              Góc cho tặng
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0 text-sm font-medium"
              style={{ color: "#d1fae5", background: "transparent", border: 0 }}
            >
              Cần mua / cần tìm
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0 text-sm font-medium"
              style={{ color: "#d1fae5", background: "transparent", border: 0 }}
            >
              Cộng đồng
            </button>
          </nav>
        </div>

        {/* Bên phải: Cụm điều hướng Glassmorphic cao cấp đồng bộ */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Thợ Săn Đồ PRO */}
          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 h-10 rounded-full text-xs font-black shadow-xs cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "#043322",
              color: "#fcd34d",
              border: "1px solid rgba(252, 211, 77, 0.35)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Thợ Săn Đồ</span>
            <span
              className="text-[9.5px] px-1.5 py-0.2 rounded font-black"
              style={{ backgroundColor: "#f5b82c", color: "#06462e" }}
            >
              PRO
            </span>
          </button>

          {/* Trái tim yêu thích Kính Mờ (Glassmorphism) - Đồng bộ số lượng */}
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 cursor-pointer shadow-xs"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "#ffffff",
              backdropFilter: "blur(8px)",
            }}
            title={`Sản phẩm yêu thích (${totalSavedCount})`}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                totalSavedCount > 0 ? "text-rose-400 fill-rose-400" : "text-white"
              }`}
            />
            <span
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm border border-[#06462e]"
              style={{
                backgroundColor: "#f59e0b",
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                color: "#06462e",
              }}
            >
              {totalSavedCount}
            </span>
          </button>

          {/* Chuông thông báo Kính Mờ */}
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 cursor-pointer shadow-xs"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "#ffffff",
              backdropFilter: "blur(8px)",
            }}
            title="Thông báo"
          >
            <Bell className="w-4 h-4 text-white" />
          </button>

          {/* Nút Liên hệ Kính Mờ */}
          <button
            type="button"
            onClick={() => {
              if (onOpenChatWithSeller && userProducts[0]) {
                onOpenChatWithSeller(userProducts[0]);
              } else {
                alert("Mở hộp thư tin nhắn và liên hệ sinh viên.");
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 h-10 rounded-full text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-xs"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "#ffffff",
              backdropFilter: "blur(8px)",
            }}
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>Liên hệ</span>
          </button>

          {/* Pill User Avatar bo tròn sang trọng */}
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className="inline-flex items-center gap-2 px-3 h-10 rounded-full text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-xs"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.14)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              color: "#ffffff",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-400 text-[#06462e] font-black text-[11px] flex items-center justify-center border border-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[90px] truncate hidden md:inline">{userName.split(" ").slice(-1)[0]}</span>
            <span className="text-[10px] text-emerald-200">⌄</span>
          </button>

          {/* HERO CTA NỔI BẬT: [ + ĐĂNG TIN ] VÀNG KIM HOÀNG GIA */}
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className="inline-flex items-center gap-1.5 px-5 h-10 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95"
            style={{
              background: "linear-gradient(135deg, #ffc438 0%, #f59e0b 100%)",
              color: "#06462e",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 4px 14px rgba(245, 158, 11, 0.4)",
            }}
          >
            <Plus className="w-4 h-4 text-[#06462e] stroke-[2.5]" />
            <span>Đăng tin</span>
          </button>
        </div>
      </header>

      {/* ======================================================================= */}
      {/* 2. BODY CHÍNH: DÀN NGANG FLEXBOX FULL WIDTH 100%                        */}
      {/* ======================================================================= */}
      <main
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          width: "100%",
          maxWidth: "100%",
          minHeight: "calc(100vh - 72px)",
          backgroundColor: "#f9fafb",
          boxSizing: "border-box",
          flex: "1 1 auto",
        }}
      >
        {/* --------------------------------------------------------------------- */}
        {/* CỘT 1: THANH SIDEBAR FULL XUYÊN SUỐT TRÁI (1 THANH FULL MÀU XANH)     */}
        {/* HỢP NHẤT TOÀN DIỆN THÀNH 1 THANH LIỀN MẠCH, KHÔNG BỊ CHIA NHỎ CẮT KHÚC*/}
        {/* CHẠY DÀI FULL HEIGHT THEO VIEWPORT / NỘI DUNG, CỐ ĐỊNH STICKY MƯỢT MÀ   */}
        {/* --------------------------------------------------------------------- */}
        <aside
          style={{
            width: "290px",
            minWidth: "290px",
            maxWidth: "290px",
            flexShrink: 0,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#06462e",
            background: "linear-gradient(180deg, #06462e 0%, #053b27 45%, #032b1b 100%)",
            borderRight: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "4px 0 24px rgba(6, 70, 46, 0.18)",
            padding: "24px 16px",
            color: "#ffffff",
            position: "sticky",
            top: "72px",
            height: "calc(100vh - 72px)",
            overflowY: "auto",
          }}
          className="no-scrollbar"
        >
          <div className="flex flex-col gap-5">
            {/* 1. THÔNG TIN PROFILE SINH VIÊN */}
            <div className="text-center pt-2">
              <div className="relative inline-block mx-auto mb-3">
                <img
                  src={currentUser?.avatar || "/assets/detail/seller-avatar.png"}
                  alt={userName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#10b981] shadow-md mx-auto bg-gray-50"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/avatar-default.png";
                  }}
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-7 h-7 bg-[#10b981] text-[#06462e] rounded-full flex items-center justify-center border-2 border-[#06462e] shadow-xs cursor-pointer hover:bg-emerald-400 font-bold"
                  title="Thay đổi ảnh đại diện"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <h2 className="text-sm font-black text-white truncate max-w-[220px]">
                    {userName}
                  </h2>
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] fill-[#06462e] shrink-0" />
                </div>
                <p className="text-xs text-[#a7f3d0] font-medium">Sinh viên · {userSchool}</p>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(252, 211, 77, 0.4)",
                  color: "#fcd34d",
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer hover:bg-white/15"
              >
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Thành viên Bạc</span>
                <ChevronRight className="w-3 h-3 text-amber-300/70" />
              </div>
            </div>

            {/* ĐƯỜNG KẺ PHÂN CÁCH TINH TẾ */}
            <div className="w-full h-px bg-white/10" />

            {/* 2. MENU ĐIỀU HƯỚNG DỌC */}
            <div className="flex flex-col gap-1.5">
              {/* 1. TÀI KHOẢN CỦA TÔI */}
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                style={{
                  backgroundColor: activeTab === "profile" ? "rgba(255, 255, 255, 0.18)" : "transparent",
                  color: activeTab === "profile" ? "#ffffff" : "#d1fae5",
                  border: activeTab === "profile" ? "1px solid rgba(16, 185, 129, 0.6)" : "1px solid transparent",
                  fontWeight: activeTab === "profile" ? 800 : 600,
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer text-left hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 shrink-0 text-emerald-300" />
                  <span>Tài khoản của tôi</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-[#a7f3d0] border border-emerald-400/40 text-[10px] font-bold flex items-center justify-center">
                  {allListings.length}
                </span>
              </button>

              {/* 2. ĐĂNG TIN */}
              <button
                type="button"
                onClick={() => setActiveTab("create")}
                style={{
                  backgroundColor: activeTab === "create" ? "rgba(255, 255, 255, 0.18)" : "transparent",
                  color: activeTab === "create" ? "#ffffff" : "#d1fae5",
                  border: activeTab === "create" ? "1px solid rgba(16, 185, 129, 0.6)" : "1px solid transparent",
                  fontWeight: activeTab === "create" ? 800 : 600,
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer text-left hover:bg-white/10"
              >
                <Plus className="w-4 h-4 shrink-0 text-emerald-300" />
                <span>Đăng tin</span>
              </button>

              {/* 3. YÊU THÍCH */}
              <button
                type="button"
                onClick={() => setActiveTab("saved")}
                style={{
                  backgroundColor: activeTab === "saved" ? "rgba(255, 255, 255, 0.18)" : "transparent",
                  color: activeTab === "saved" ? "#ffffff" : "#d1fae5",
                  border: activeTab === "saved" ? "1px solid rgba(16, 185, 129, 0.6)" : "1px solid transparent",
                  fontWeight: activeTab === "saved" ? 800 : 600,
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer text-left hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 shrink-0 text-emerald-300" />
                  <span>Yêu thích</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-amber-400/30 text-[#fcd34d] border border-amber-400/40 text-[10px] font-bold flex items-center justify-center">
                  {totalSavedCount}
                </span>
              </button>

              {/* 4. ĐÁNH GIÁ */}
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                style={{
                  backgroundColor: activeTab === "reviews" ? "rgba(255, 255, 255, 0.18)" : "transparent",
                  color: activeTab === "reviews" ? "#ffffff" : "#d1fae5",
                  border: activeTab === "reviews" ? "1px solid rgba(16, 185, 129, 0.6)" : "1px solid transparent",
                  fontWeight: activeTab === "reviews" ? 800 : 600,
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer text-left hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 shrink-0 text-emerald-300" />
                  <span>Đánh giá</span>
                </div>
                <span className="text-[11px] font-bold text-amber-300">4.9 ★</span>
              </button>

              {/* 5. ĐIỂM THƯỞNG */}
              <button
                type="button"
                onClick={() => setActiveTab("rewards")}
                style={{
                  backgroundColor: activeTab === "rewards" ? "rgba(255, 255, 255, 0.18)" : "transparent",
                  color: activeTab === "rewards" ? "#ffffff" : "#d1fae5",
                  border: activeTab === "rewards" ? "1px solid rgba(16, 185, 129, 0.6)" : "1px solid transparent",
                  fontWeight: activeTab === "rewards" ? 800 : 600,
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer text-left hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <Gift className="w-4 h-4 shrink-0 text-emerald-300" />
                  <span>Điểm thưởng</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-[#a7f3d0] border border-emerald-400/40 text-[10px] font-black">
                  {points}
                </span>
              </button>

              {/* 6. QUẢN TRỊ ADMIN (CHỈ DÀNH CHO QUẢN TRỊ VIÊN) */}
              {currentUser?.role === "admin" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("admin")}
                  style={{
                    backgroundColor: activeTab === "admin" ? "rgba(245, 158, 11, 0.28)" : "rgba(245, 158, 11, 0.12)",
                    color: activeTab === "admin" ? "#ffffff" : "#fcd34d",
                    border: activeTab === "admin" ? "1px solid rgba(251, 191, 36, 0.85)" : "1px solid rgba(251, 191, 36, 0.35)",
                    fontWeight: 800,
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer text-left hover:bg-amber-400/20 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Quản trị Admin</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#06462e] text-[9.5px] font-black uppercase">
                    PRO
                  </span>
                </button>
              )}

              {/* 7. ĐĂNG XUẤT */}
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors cursor-pointer text-left pt-2.5 border-t border-white/10 mt-1"
              >
                <LogOut className="w-4 h-4 shrink-0 text-red-400" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* 3. BOX CẦN HỖ TRỢ GHIM LIỀN DƯỚI ĐÁY THANH */}
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.22)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "16px",
              color: "#ffffff",
              marginTop: "20px",
            }}
            className="space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center shrink-0 border border-white/10">
                <Headphones className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white leading-tight">Cần hỗ trợ?</h4>
                <p className="text-[11px] text-[#a7f3d0] leading-relaxed mt-0.5">
                  Liên hệ trung tâm hỗ trợ sinh viên UniSwap
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
              }}
              className="w-full py-2 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Xem hỗ trợ</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>
          </div>
        </aside>

        {/* --------------------------------------------------------------------- */}
        {/* CỘT 2: VÙNG NỘI DUNG CHÍNH (FULL WIDTH - GIÃN NỞ KHÔNG GIAN)           */}
        {/* QUY TẮC: CHỈ HIỂN THỊ BANNER & 4 STATS KHI Ở activeTab === "profile"   */}
        {/* CÁC TAB "create", "saved", "reviews", "rewards": ĐÃ XÓA BANNER VÀ STATS*/}
        {/* --------------------------------------------------------------------- */}
        <div
          style={{
            flex: "1 1 0%",
            minWidth: 0,
            width: "100%",
            boxSizing: "border-box",
            padding: "24px 32px",
          }}
        >
          {/* =================================================================== */}
          {/* TAB 1: TÀI KHOẢN CỦA TÔI (DUY NHẤT CÓ BANNER & 4 STAT CARDS - ẢNH 3) */}
          {/* =================================================================== */}
          {activeTab === "profile" && (
            <div className="space-y-5">
              {/* BANNER XANH CHÀO MỪNG */}
              <div
                style={{
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, #06462e 0%, #09573a 50%, #0a6644 100%)",
                  color: "#ffffff",
                  padding: "24px 32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 12px rgba(6,70,46,0.12)",
                }}
              >
                <div className="space-y-1.5 max-w-[620px]">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    Xin chào, {userName}! 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                    Cùng UniSwap lan tỏa giá trị xanh và sống bền vững hơn nhé!
                  </p>
                </div>

                <div className="hidden sm:flex items-center justify-center relative w-40 h-24 shrink-0">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                    <span className="text-4xl drop-shadow">🌍</span>
                  </div>
                  <span className="absolute -top-1 right-2 text-xl">🌿</span>
                  <span className="absolute bottom-1 left-2 text-lg">🌱</span>
                </div>
              </div>

              {/* 4 THẺ THỐNG KÊ (ẢNH 3) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab("profile")}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    border: "1.5px solid #06462e",
                    padding: "16px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                  className="flex items-center gap-3.5 cursor-pointer hover:border-emerald-300 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#06462e] flex items-center justify-center shrink-0 border border-emerald-100">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-gray-900">{allListings.length}</div>
                    <div className="text-xs text-gray-400 font-medium mt-0.5">Bài đăng của tôi</div>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("saved")}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid rgba(229, 231, 235, 0.9)",
                    padding: "16px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                  className="flex items-center gap-3.5 cursor-pointer hover:border-emerald-300 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#06462e] flex items-center justify-center shrink-0 border border-emerald-100">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-gray-900">{totalSavedCount}</div>
                    <div className="text-xs text-gray-400 font-medium mt-0.5">Sản phẩm yêu thích</div>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("rewards")}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid rgba(229, 231, 235, 0.9)",
                    padding: "16px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                  className="flex items-center gap-3.5 cursor-pointer hover:border-emerald-300 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#06462e] flex items-center justify-center shrink-0 border border-emerald-100">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-black text-gray-900">{points}</div>
                    <div className="text-xs text-gray-400 font-medium mt-0.5">Điểm thưởng</div>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("reviews")}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid rgba(229, 231, 235, 0.9)",
                    padding: "16px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                  className="flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                      <Star className="w-6 h-6 fill-amber-400" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-gray-900">4.9 ★</div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5">Đánh giá uy tín</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Header danh sách bài đăng */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-base font-black text-gray-900">Tất cả bài đăng của tôi</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Quản lý các tin đăng bán và cho tặng đồ cũ sinh viên
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 outline-none appearance-none pr-7 cursor-pointer"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="price_asc">Giá tăng dần</option>
                      <option value="price_desc">Giá giảm dần</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
                  </div>

                  {/* Nút ＋ Đăng tin mới */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("create")}
                    style={{ backgroundColor: "#06462e", color: "#ffffff" }}
                    className="px-4 py-2 hover:bg-[#0a5c3e] rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Đăng tin mới</span>
                  </button>
                </div>
              </div>

              {/* Danh sách các bài đăng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {allListings.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "20px",
                      border: "1px solid rgba(229, 231, 235, 0.9)",
                      overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                    className="flex flex-col justify-between hover:shadow-md transition-all group"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = item.fallbackImage || "/assets/detail/macbook-main.png";
                        }}
                      />

                      <span
                        style={{
                          backgroundColor: item.badgeType === "giveaway" ? "#06462e" : "rgba(0,0,0,0.75)",
                          color: "#ffffff",
                        }}
                        className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-xs"
                      >
                        {item.badgeType === "giveaway" ? "Cho tặng" : "Bán"}
                      </span>

                      <button
                        type="button"
                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 text-gray-600 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                      >
                        <Heart className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="text-xs font-black text-gray-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {item.condition} · {item.category}
                        </p>
                      </div>

                      <div className="space-y-1 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{item.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (item.rawProduct && onSelectProduct) {
                              onSelectProduct(item.rawProduct);
                            }
                          }}
                          className="flex-1 py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#06462e] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Chỉnh sửa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setMenuActionItem(menuActionItem === item.id ? null : item.id)}
                          className="w-8 h-8 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2: ĐĂNG TIN MỚI (ĐÃ XÓA BANNER VÀ 4 STATS TRÊN ẢNH 3)           */}
          {/* =================================================================== */}
          {activeTab === "create" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-white rounded-3xl border border-gray-200/90 p-4 px-6 shadow-2xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại</span>
                  </button>
                  <span className="text-gray-300">|</span>
                  <div>
                    <h1 className="text-base font-black text-gray-900 leading-tight">
                      Đăng tin sản phẩm mới
                    </h1>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Đăng bán đồ cũ, giúp món đồ của bạn tìm được chủ mới!
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-gray-400 italic hidden sm:inline">
                  * Thông tin có dấu <span className="text-red-500 font-bold">*</span> là bắt buộc
                </span>
              </div>

              {publishNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Đã đăng tin thành công! Đang chuyển đến danh sách bài đăng của bạn...</span>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) 380px",
                  gap: "24px",
                  alignItems: "start",
                  width: "100%",
                }}
              >
                {/* Form 4 bước */}
                <form
                  onSubmit={handleFormSubmit}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "24px",
                    border: "1px solid rgba(229, 231, 235, 0.9)",
                    padding: "26px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: "#06462e", color: "#ffffff" }}
                        className="w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0"
                      >
                        1
                      </span>
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                        Thông tin cơ bản
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Danh mục <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-emerald-600 outline-none appearance-none pr-8 cursor-pointer"
                          >
                            <option value="Đồ công nghệ">Đồ công nghệ</option>
                            <option value="Sách & giáo trình">Sách & giáo trình</option>
                            <option value="Đồ phòng trọ">Đồ phòng trọ</option>
                            <option value="Thời trang">Thời trang</option>
                            <option value="Thể thao">Thể thao</option>
                            <option value="Đồ học tập">Đồ học tập</option>
                            <option value="Handmade">Handmade</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Danh mục con <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={subcategory}
                            onChange={(e) => setSubcategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-emerald-600 outline-none appearance-none pr-8 cursor-pointer"
                          >
                            <option value="Laptop, máy tính bàn">Laptop, máy tính bàn</option>
                            <option value="Điện thoại, máy tính bảng">Điện thoại, máy tính bảng</option>
                            <option value="Phụ kiện, chuột, bàn phím">Phụ kiện, chuột, bàn phím</option>
                            <option value="Màn hình, linh kiện">Màn hình, linh kiện</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Tiêu đề sản phẩm <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Ví dụ: Macbook Air M1 2020 (8GB/256GB)"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-emerald-600 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-gray-700">
                            Giá bán <span className="text-red-500">*</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-[11px] text-gray-500 font-normal cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isFree}
                              onChange={(e) => setIsFree(e.target.checked)}
                              className="rounded text-emerald-600 cursor-pointer"
                            />
                            <span>Tặng 0đ</span>
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            disabled={isFree}
                            value={isFree ? 0 : price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Nhập giá (VNĐ)"
                            className="w-full pr-8 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-bold focus:bg-white focus:border-emerald-600 outline-none disabled:opacity-50"
                            required={!isFree}
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">
                            đ
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Tình trạng <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-emerald-600 outline-none appearance-none pr-8 cursor-pointer"
                          >
                            <option value="Tốt">Tốt (Có trầy xước nhẹ)</option>
                            <option value="Như mới 99%">Như mới 99%</option>
                            <option value="Khá">Khá (Đã qua sử dụng)</option>
                            <option value="Cần bảo dưỡng">Cần bảo dưỡng nhẹ</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Số lượng</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full pr-14 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-emerald-600 outline-none"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">
                            chiếc
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: "#06462e", color: "#ffffff" }}
                        className="w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0"
                      >
                        2
                      </span>
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                        Mô tả sản phẩm
                      </h3>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={1000}
                        placeholder="Mô tả chi tiết về sản phẩm..."
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 leading-relaxed focus:bg-white focus:border-emerald-600 outline-none resize-none"
                        required
                      />
                      <span className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-medium">
                        {description.length}/1000
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: "#06462e", color: "#ffffff" }}
                        className="w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0"
                      >
                        3
                      </span>
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                        Hình ảnh sản phẩm
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-3 text-center hover:border-emerald-500 bg-gray-50/60 transition-colors flex-1 min-w-[210px] max-w-[270px]">
                        <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-[11px] text-gray-600 font-medium">Kéo thả ảnh vào đây hoặc</p>
                        <label
                          style={{ backgroundColor: "#06462e", color: "#ffffff" }}
                          className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 hover:bg-[#0a5c3e] rounded-xl text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Chọn ảnh</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[9.5px] text-gray-400 mt-1.5">
                          Hỗ trợ JPG, PNG. Tối đa 10 ảnh, mỗi ảnh &lt; 5MB
                        </p>
                      </div>

                      {images.map((imgSrc, idx) => (
                        <div
                          key={idx}
                          className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 group shadow-2xs shrink-0"
                        >
                          <img
                            src={imgSrc}
                            alt={`Ảnh ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
                            title="Xóa ảnh"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 text-emerald-800 flex flex-col items-center justify-center gap-1 hover:bg-emerald-100/60 cursor-pointer transition-colors shrink-0">
                        <Plus className="w-5 h-5 text-emerald-700" />
                        <span className="text-[10px] font-bold">Thêm ảnh</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span
                        style={{ backgroundColor: "#06462e", color: "#ffffff" }}
                        className="w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shrink-0"
                      >
                        4
                      </span>
                      <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                        Thông tin chi tiết
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Thương hiệu <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none appearance-none pr-7 cursor-pointer"
                          >
                            <option value="Apple">Apple</option>
                            <option value="Dell">Dell</option>
                            <option value="Asus">Asus</option>
                            <option value="HP">HP</option>
                            <option value="Lenovo">Lenovo</option>
                            <option value="Khác">Khác</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Model (nếu có)
                        </label>
                        <input
                          type="text"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          placeholder="Ví dụ: Macbook Air M1"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Năm sản xuất (nếu có)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="2021"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none pr-8"
                          />
                          <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Thông số kỹ thuật
                        </label>
                        <input
                          type="text"
                          value={specs}
                          onChange={(e) => setSpecs(e.target.value)}
                          placeholder="RAM 8GB, SSD 256GB..."
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Phụ kiện đi kèm
                        </label>
                        <div className="relative">
                          <select
                            value={accessories}
                            onChange={(e) => setAccessories(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none appearance-none pr-7 cursor-pointer"
                          >
                            <option value="Đầy đủ sạc cáp zin">Đầy đủ sạc cáp zin</option>
                            <option value="Chỉ có máy trần">Chỉ có máy trần</option>
                            <option value="Kèm ốp lưng / bao da">Kèm ốp lưng / bao da</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Bảo hành</label>
                        <div className="relative">
                          <select
                            value={warranty}
                            onChange={(e) => setWarranty(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none appearance-none pr-7 cursor-pointer"
                          >
                            <option value="Không">Hết bảo hành (Không)</option>
                            <option value="Còn bảo hành hãng">Còn bảo hành hãng</option>
                            <option value="Bao test 7 ngày">Bao test 7 ngày</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Địa điểm giao nhận <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                          <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            style={{ paddingLeft: "32px" }}
                            className="w-full py-2.5 pr-8 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 outline-none appearance-none cursor-pointer"
                          >
                            <option value="Đại học Bách Khoa TP.HCM">Đại học Bách Khoa TP.HCM</option>
                            <option value="Đại học Kinh Tế TP.HCM">Đại học Kinh Tế TP.HCM</option>
                            <option value="ĐH Công Nghệ Thông Tin (UIT)">ĐH Công Nghệ Thông Tin (UIT)</option>
                            <option value="Đại học Văn Lang">Đại học Văn Lang</option>
                            <option value="KTX ĐHQG Khu B">KTX ĐHQG Khu B</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Hình thức nhận hàng <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-4 pt-1 text-xs text-gray-700">
                          <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                            <input
                              type="radio"
                              name="delivery"
                              checked={deliveryMethod === "direct"}
                              onChange={() => setDeliveryMethod("direct")}
                              className="text-emerald-600 cursor-pointer"
                            />
                            <span>Gặp trực tiếp</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                            <input
                              type="radio"
                              name="delivery"
                              checked={deliveryMethod === "shipping"}
                              onChange={() => setDeliveryMethod("shipping")}
                              className="text-emerald-600 cursor-pointer"
                            />
                            <span>Giao hàng</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                            <input
                              type="radio"
                              name="delivery"
                              checked={deliveryMethod === "both"}
                              onChange={() => setDeliveryMethod("both")}
                              className="text-emerald-600 cursor-pointer"
                            />
                            <span>Cả hai</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab("profile")}
                      className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                      <span>Xem trước</span>
                    </button>

                    <button
                      type="submit"
                      disabled={busy}
                      style={{ backgroundColor: "#06462e", color: "#ffffff" }}
                      className="px-8 py-2.5 hover:bg-[#0a5c3e] rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5 text-amber-300" />
                      <span>{busy ? "Đang xử lý..." : "Đăng tin"}</span>
                    </button>
                  </div>
                </form>

                {/* Live Preview Cột Phải */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "24px",
                    border: "1px solid rgba(229, 231, 235, 0.9)",
                    padding: "20px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    position: "sticky",
                    top: "88px",
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>Xem trước tin đăng</span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                      <img
                        src={images[0] || "/assets/detail/macbook-main.png"}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded-md">
                        1/{images.length || 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-gray-900 line-clamp-2 leading-snug">
                        {title || "Macbook Air M1 2020 (8GB/256GB)"}
                      </h3>
                      <div className="flex items-center gap-2.5 mt-1">
                        <span className="text-base font-black text-[#06462e]">
                          {isFree ? "Miễn phí 0đ" : `${Number(price || 0).toLocaleString("vi-VN")}đ`}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-md">
                          Còn hàng
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                      <span className="flex items-center gap-1 text-gray-600 truncate max-w-[170px]">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{location}</span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>Đăng 12 giờ trước</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 p-2 bg-gray-50/80 rounded-xl border border-gray-100 text-center text-[10px]">
                      <div>
                        <div className="text-gray-400 flex items-center justify-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Tình trạng</span>
                        </div>
                        <div className="font-bold text-gray-800 truncate mt-0.5">{condition}</div>
                      </div>
                      <div className="border-x border-gray-200">
                        <div className="text-gray-400 flex items-center justify-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Bảo hành</span>
                        </div>
                        <div className="font-bold text-gray-800 truncate mt-0.5">{warranty}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 flex items-center justify-center gap-0.5">
                          <FileText className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Phụ kiện</span>
                        </div>
                        <div className="font-bold text-gray-800 truncate mt-0.5">Đầy đủ</div>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentUser?.avatar || "/assets/detail/seller-avatar.png"}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-emerald-300"
                        />
                        <div>
                          <div className="flex items-center gap-1 text-xs font-black text-gray-900">
                            <span>{userName}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                          </div>
                          <div className="text-[10px] text-emerald-700 font-bold">
                            Sinh viên đã xác minh
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[10.5px] text-gray-500">
                        <span className="text-amber-500 font-bold">★ 4.8</span>
                        <span className="text-gray-300">·</span>
                        <span>(24 đánh giá)</span>
                        <span className="text-gray-300">·</span>
                        <span>56 đã bán</span>
                      </div>

                      <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed">
                        {description}
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-emerald-800">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Campus Check
                        </span>
                        <span>›</span>
                      </div>
                      <p className="text-[10.5px] text-emerald-700/90 leading-relaxed">
                        Đã kiểm tra tình trạng cơ bản và xác nhận đúng thông tin sản phẩm.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 3: GIAO DIỆN SẢN PHẨM YÊU THÍCH (ĐÃ XÓA BANNER VÀ 4 STATS)     */}
          {/* =================================================================== */}
          {activeTab === "saved" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-base font-black text-gray-900">
                    Sản phẩm yêu thích ({totalSavedCount})
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Các món đồ bạn đã lưu để theo dõi và liên hệ khi cần
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors cursor-pointer"
                >
                  Quay lại tài khoản
                </button>
              </div>

              {displayedSavedItems.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 space-y-3">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto" />
                  <h3 className="text-sm font-bold text-gray-700">Chưa có sản phẩm yêu thích</h3>
                  <p className="text-xs text-gray-400">
                    Khám phá chợ đồ sinh viên và bấm vào icon trái tim để lưu món đồ bạn ưng ý.
                  </p>
                  <button
                    type="button"
                    onClick={onBackToHome}
                    className="px-4 py-2 bg-[#06462e] text-white rounded-xl text-xs font-bold"
                  >
                    Khám phá ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
                  {displayedSavedItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "20px",
                        border: "1px solid rgba(229, 231, 235, 0.9)",
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                      }}
                      className="flex flex-col justify-between hover:shadow-md transition-all group"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span
                          style={{
                            backgroundColor: item.isFree ? "#06462e" : "#09573a",
                            color: "#ffffff",
                          }}
                          className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-xs"
                        >
                          {item.isFree ? "Cho tặng 0đ" : `${item.price.toLocaleString("vi-VN")}đ`}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveSaved(item.id)}
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/95 text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          title="Bỏ lưu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="text-xs font-black text-gray-900 line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-gray-400 mt-1">
                            {item.condition} · {item.category}
                          </p>
                        </div>

                        <div className="space-y-1 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-gray-600 truncate max-w-[150px]">
                              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[#06462e] text-[9.5px] font-bold">
                              {item.school}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400">Người bán: {item.seller}</p>
                        </div>

                        {item.rawProduct && (
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            {onSelectProduct && (
                              <button
                                type="button"
                                onClick={() => onSelectProduct(item.rawProduct!)}
                                className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-[#06462e] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Xem chi tiết</span>
                              </button>
                            )}
                            {onOpenChatWithSeller && (
                              <button
                                type="button"
                                onClick={() => onOpenChatWithSeller(item.rawProduct!)}
                                className="py-1.5 px-2.5 bg-[#06462e] hover:bg-[#0a5c3e] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Nhắn tin</span>
                              </button>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              alert(`Mở liên hệ với bạn ${item.seller}`);
                            }}
                            className="flex-1 py-1.5 px-3 bg-[#06462e] hover:bg-[#0a5c3e] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                          >
                            Liên hệ ngay
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSaved(item.id)}
                            className="py-1.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-medium transition-colors"
                          >
                            Bỏ lưu
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 4: GIAO DIỆN ĐÁNH GIÁ (ĐÃ XÓA BANNER VÀ 4 STATS TRÊN ẢNH 3)     */}
          {/* =================================================================== */}
          {activeTab === "reviews" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-base font-black text-gray-900">
                    Đánh giá & Uy tín cộng đồng
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Nhận xét thực tế từ các bạn sinh viên đã từng giao dịch với bạn
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>4.9 / 5.0 (24 đánh giá)</span>
                </div>
              </div>

              {/* Card tổng quan chỉ số uy tín */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-3xl border border-gray-200/90 shadow-2xs flex flex-col items-center justify-center text-center space-y-2">
                  <div className="text-4xl font-black text-gray-900">4.9 ★</div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <p className="text-xs text-gray-400">Dựa trên 24 lượt đánh giá</p>
                </div>

                <div className="p-5 bg-white rounded-3xl border border-gray-200/90 shadow-2xs space-y-2.5 col-span-2">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                    Chỉ số an tâm giao dịch
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700 pt-1">
                    <div className="flex items-center gap-2 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold">Đã xác minh email trường</div>
                        <div className="text-[10px] text-gray-400">Sinh viên chính quy</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold">Phản hồi nhanh dưới 15 phút</div>
                        <div className="text-[10px] text-gray-400">Tỉ lệ phản hồi 98%</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <ThumbsUp className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold">100% đánh giá tích cực</div>
                        <div className="text-[10px] text-gray-400">Không có khiếu nại</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold">Đã hoàn thành 56 giao dịch</div>
                        <div className="text-[10px] text-gray-400">Khu vực TP.HCM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh sách các review thực tế */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  Nhận xét gần đây
                </h3>
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-white rounded-2xl border border-gray-200/90 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-9 h-9 rounded-full object-cover border border-emerald-200 bg-gray-50"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-gray-900">{rev.author}</span>
                            <span className="px-1.5 py-0.2 rounded bg-gray-100 text-[9.5px] text-gray-500 font-semibold">
                              {rev.school}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400">{rev.date}</span>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed pl-12">{rev.content}</p>

                    <div className="pl-12 pt-1 flex items-center gap-2 text-[10.5px] text-emerald-800 font-medium">
                      <Package className="w-3 h-3 text-emerald-600" />
                      <span>Món đồ: {rev.productName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 5: GIAO DIỆN ĐIỂM THƯỞNG (ĐÃ XÓA BANNER VÀ 4 STATS TRÊN ẢNH 3)  */}
          {/* =================================================================== */}
          {activeTab === "rewards" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-base font-black text-gray-900">
                    Điểm thưởng UniPoints & Đổi quà sinh viên
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Tích lũy Điểm Xanh từ mỗi món đồ trao đổi, đổi lấy lượt đẩy tin và quyền lợi
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-black text-[#06462e]">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>Số dư: {points} Điểm Xanh</span>
                </div>
              </div>

              {rewardNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{rewardNotice}</span>
                </div>
              )}

              {/* Banner số dư & Thăng hạng */}
              <div
                style={{
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, #043322 0%, #06462e 50%, #09573a 100%)",
                  color: "#ffffff",
                  padding: "24px 30px",
                }}
                className="space-y-3 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Hạng thành viên
                    </span>
                    <h3 className="text-xl font-black text-white mt-0.5">
                      ⭐ Thành viên Bạc (Silver Tier)
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-emerald-200">Tổng điểm tích lũy</span>
                    <div className="text-2xl font-black text-amber-300">{points} UniPoints</div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-[11px] text-emerald-200 mb-1">
                    <span>Tiến độ lên Hạng Vàng (+3 lượt đẩy tin VIP)</span>
                    <span>{points} / 500 điểm</span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/20">
                    <div
                      style={{ width: `${Math.min(100, (points / 500) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>

              {/* Kho quà đổi thưởng */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  Cửa hàng đổi quà UniPoints
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rewardsStore.map((item) => {
                    const Icon = item.icon;
                    const canAfford = points >= item.cost;

                    return (
                      <div
                        key={item.id}
                        className="p-5 bg-white rounded-3xl border border-gray-200/90 shadow-2xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-emerald-50 text-[#06462e] border border-emerald-200 text-[10px] font-bold rounded-md">
                              {item.tag}
                            </span>
                            <span className="text-sm font-black text-amber-600 flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5" />
                              {item.cost} điểm
                            </span>
                          </div>

                          <div className="flex items-start gap-3 pt-1">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#06462e] flex items-center justify-center shrink-0 border border-emerald-100">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-gray-900">{item.title}</h4>
                              <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => handleRedeemReward(item.title, item.cost)}
                          style={{
                            backgroundColor: canAfford ? "#06462e" : "#f3f4f6",
                            color: canAfford ? "#ffffff" : "#9ca3af",
                          }}
                          className="w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed hover:brightness-110 active:scale-95 shadow-2xs"
                        >
                          {canAfford ? `Đổi ngay (${item.cost} điểm)` : `Cần thêm ${item.cost - points} điểm`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lịch sử tích điểm gần đây */}
              <div className="p-5 bg-white rounded-3xl border border-gray-200/90 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>Lịch sử tích lũy gần đây</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-gray-50/70 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-gray-800">
                        Cho tặng miễn phí sách Kinh tế vĩ mô cho bạn sinh viên
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700">+50 điểm</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-gray-50/70 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-gray-800">
                        Giao dịch thành công Laptop Dell Inspiron 15
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700">+30 điểm</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-gray-50/70 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-gray-800">
                        Nhận đánh giá 5 sao từ người nhận đồ
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700">+20 điểm</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-gray-50/70 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-gray-800">
                        Điểm danh tuần thành viên sống xanh
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700">+50 điểm</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 6: BẢNG QUẢN TRỊ ADMIN (DÀNH CHO QUẢN TRỊ VIÊN)                 */}
          {/* =================================================================== */}
          {activeTab === "admin" && (
            <AdminPanel currentUser={currentUser} />
          )}
        </div>
      </main>

      {/* MODAL TRUNG TÂM HỖ TRỢ */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Headphones className="w-5 h-5 text-[#06462e]" />
                <h3 className="text-sm font-black text-gray-900">Trung tâm hỗ trợ sinh viên</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-gray-600">
              <p>Hotline sinh viên: <b>1900 6868 (8:00 - 21:00)</b></p>
              <p>Email hỗ trợ: <b>support@uniswap.edu.vn</b></p>
              <p>Zalo hỗ trợ trực tiếp: <b>UniSwap Campus Helpdesk</b></p>
            </div>

            <button
              type="button"
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 bg-[#06462e] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#0a5c3e] transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfileView;
