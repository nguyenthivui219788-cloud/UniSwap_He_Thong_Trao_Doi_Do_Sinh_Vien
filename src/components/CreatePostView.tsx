import React, { useState } from "react";
import {
  Laptop,
  BookOpen,
  Home,
  Shirt,
  Trophy,
  PenTool,
  Palette,
  Camera,
  X,
  Plus,
  Eye,
  Send,
  CheckCircle2,
  Calendar,
  Sparkles,
  Heart,
  Bell,
  FileText,
  Sun,
  ShieldCheck,
  MapPin,
  Clock,
  ChevronDown,
  User as UserIcon,
} from "lucide-react";
import type { ProductItem, User } from "../types";

export interface CreatePostViewProps {
  currentUser?: User | null;
  onBack: () => void;
  onGoToAccount?: (tab?: string) => void;
  onPublishSuccess?: (newProduct: ProductItem) => void;
  onLoginRequired?: () => void;
}

export function CreatePostView({
  currentUser,
  onBack,
  onGoToAccount,
  onPublishSuccess,
  onLoginRequired,
}: CreatePostViewProps) {
  // Danh mục đang chọn ở sidebar trái
  const [selectedCategory, setSelectedCategory] = useState<string>("tech");

  // State các trường của Form đăng tin (khởi tạo đúng theo Ảnh 2)
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

  // Danh sách hình ảnh sản phẩm (có sẵn 3 ảnh mẫu ban đầu như Ảnh 2)
  const [images, setImages] = useState<string[]>([
    "/assets/detail/macbook-main.png",
    "/assets/detail/macbook-detail-1.png",
    "/assets/detail/macbook-detail-2.png",
  ]);

  // Thông tin chi tiết (Bước 4)
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState("Macbook Air M1");
  const [year, setYear] = useState("2021");
  const [specs, setSpecs] = useState("RAM 8GB, SSD 256GB, M1");
  const [accessories, setAccessories] = useState("Đầy đủ sạc cáp zin");
  const [warranty, setWarranty] = useState("Không");
  const [location, setLocation] = useState("Đại học Bách Khoa TP.HCM");
  const [deliveryMethod, setDeliveryMethod] = useState<"direct" | "shipping" | "both">("direct");

  const [busy, setBusy] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Xử lý thêm ảnh từ máy
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

  // Danh mục sidebar trái theo Ảnh 2
  const categoriesList = [
    { id: "books", label: "Sách & giáo trình", icon: BookOpen },
    { id: "tech", label: "Đồ công nghệ", icon: Laptop },
    { id: "dorm", label: "Đồ phòng trọ", icon: Home },
    { id: "fashion", label: "Thời trang", icon: Shirt },
    { id: "sports", label: "Thể thao", icon: Trophy },
    { id: "study", label: "Đồ học tập", icon: PenTool },
    { id: "handmade", label: "Handmade", icon: Palette },
  ];

  const handleCategorySelect = (catId: string, label: string) => {
    setSelectedCategory(catId);
    setCategory(label);
    if (catId === "tech") setSubcategory("Laptop, máy tính bàn");
    else if (catId === "books") setSubcategory("Giáo trình đại học");
    else if (catId === "dorm") setSubcategory("Đồ gia dụng, phòng trọ");
    else if (catId === "fashion") setSubcategory("Quần áo, phụ kiện");
    else setSubcategory("Khác");
  };

  // Xử lý nộp form đăng tin
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser && onLoginRequired) {
      onLoginRequired();
      return;
    }

    setBusy(true);

    const categoryMap: Record<string, ProductItem["category"]> = {
      books: "books",
      tech: "electronics",
      dorm: "dorm",
      fashion: "fashion",
      sports: "sports",
      stationery: "stationery",
      handmade: "handmade",
    };

    const newProd: ProductItem = {
      id: `p-${Date.now()}`,
      title: title || "Sản phẩm sinh viên",
      description: description,
      price: isFree ? 0 : Number(price) || 0,
      category: categoryMap[selectedCategory] || "electronics",
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
        name: currentUser?.name || "Nguyễn Văn An",
        studentId: currentUser?.studentId || "2021001",
        universityCode: currentUser?.universityCode || "HCMUT",
        avatar: currentUser?.avatar || "/assets/avatar-default.png",
        rating: 4.8,
        isVerified: true,
        isPro: currentUser?.tier === "hunter_pro",
      },
    };

    setTimeout(() => {
      setBusy(false);
      setPublishSuccess(true);
      if (onPublishSuccess) {
        onPublishSuccess(newProd);
      }
      setTimeout(() => {
        if (onGoToAccount) {
          onGoToAccount("listings");
        } else {
          onBack();
        }
      }, 1200);
    }, 600);
  };

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
      {/* 1. TOP NAVBAR: ĐÚNG CHUẨN NAVBAR CHÍNH THEO ẢNH MẪU (NỀN XANH #06462e)   */}
      {/* ======================================================================= */}
      <header
        className="chat-header h-[68px] w-full px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-md z-30 sticky top-0"
        style={{
          backgroundColor: "#06462e",
          background: "#06462e",
          color: "#ffffff",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          boxSizing: "border-box",
        }}
      >
        <div className="flex items-center gap-8">
          {/* Logo UniSwap */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onBack();
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
              <span
                className="text-[22px] font-black leading-tight tracking-tight"
                style={{ color: "#ffffff" }}
              >
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0 flex flex-col items-center relative py-1"
              style={{ color: "#ffffff", background: "transparent", border: 0 }}
            >
              <span>Khám phá</span>
              <span className="w-full h-0.5 bg-[#f5b82c] rounded-full mt-1"></span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0"
              style={{ color: "#d1fae5", background: "transparent", border: 0 }}
            >
              Danh mục
            </button>
            <button
              type="button"
              onClick={onBack}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0"
              style={{ color: "#d1fae5", background: "transparent", border: 0 }}
            >
              Góc cho tặng
            </button>
            <button
              type="button"
              onClick={onBack}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0"
              style={{ color: "#d1fae5", background: "transparent", border: 0 }}
            >
              Cộng đồng
            </button>
          </nav>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-xs cursor-pointer transition-colors"
            style={{ backgroundColor: "#043322", color: "#fcd34d", border: "1px solid rgba(252, 211, 77, 0.3)" }}
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

          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center relative transition-colors cursor-pointer"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.12)", color: "#ffffff", border: 0 }}
            title="Tin lưu yêu thích"
          >
            <Heart className="w-4 h-4" />
            <span
              className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-black rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#f59e0b", color: "#ffffff" }}
            >
              1
            </span>
          </button>

          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center relative transition-colors cursor-pointer"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.12)", color: "#ffffff", border: 0 }}
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Nút Liên hệ */}
          <button
            type="button"
            onClick={onBack}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-gray-800 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer shadow-xs"
            style={{ backgroundColor: "#ffffff", color: "#1f2937", border: 0 }}
          >
            <FileText className="w-3.5 h-3.5 text-gray-600" />
            <span>Liên hệ</span>
          </button>

          {/* Nút Đăng nhập / Avatar */}
          {currentUser ? (
            <button
              type="button"
              onClick={() => onGoToAccount?.()}
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer shadow-xs"
              style={{ backgroundColor: "#0a5c3e", color: "#ffffff", border: "1.5px solid #a7f3d0" }}
            >
              {currentUser.name ? currentUser.name.charAt(0) : "A"}
            </button>
          ) : (
            <button
              type="button"
              onClick={onLoginRequired}
              className="hidden sm:inline-flex px-3.5 py-1.5 bg-white text-gray-800 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer shadow-xs"
              style={{ backgroundColor: "#ffffff", color: "#1f2937", border: 0 }}
            >
              Đăng nhập
            </button>
          )}

          {/* Nút Đăng tin đang active */}
          <button
            type="button"
            className="hidden sm:inline-flex px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-default shadow-xs"
            style={{ backgroundColor: "#043322", color: "#a7f3d0", border: "1px solid #10b981" }}
          >
            Đăng tin
          </button>

          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.12)", color: "#ffffff", border: 0 }}
            title="Đổi giao diện"
          >
            <Sun className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ======================================================================= */}
      {/* 2. BODY GIAO DIỆN ĐĂNG TIN (3 CỘT ĐÚNG 100% THEO ẢNH 2)                 */}
      {/* Sử dụng CSS Grid rõ ràng 260px - 1fr - 380px đảm bảo dàn ngang chuẩn      */}
      {/* ======================================================================= */}
      <main
        className="create-post-container"
        style={{
          display: "grid",
          gridTemplateColumns: "260px minmax(0, 1fr) 380px",
          gap: "24px",
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          padding: "24px 20px",
          alignItems: "start",
          boxSizing: "border-box",
        }}
      >
        {/* --------------------------------------------------------------------- */}
        {/* CỘT 1 (TRÁI - 260px): SIDEBAR DANH MỤC ĐĂNG TIN & BANNER MINH HỌA     */}
        {/* --------------------------------------------------------------------- */}
        <aside
          style={{
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid rgba(229, 231, 235, 0.9)",
            padding: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
          className="space-y-4"
        >
          {/* Header Sidebar: Đăng tin mới */}
          <div className="flex items-center gap-3 p-2 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#06462e] flex items-center justify-center shrink-0 border border-emerald-100">
              <UserIcon className="w-5 h-5 text-[#06462e]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900 leading-tight">Đăng tin mới</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Chia sẻ đồ cũ, lan tỏa giá trị</p>
            </div>
          </div>

          {/* Danh sách các danh mục lựa chọn */}
          <nav className="space-y-1">
            {categoriesList.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id, cat.label)}
                  style={{
                    backgroundColor: isActive ? "#e8f5ec" : "transparent",
                    color: isActive ? "#06462e" : "#4b5563",
                    border: isActive ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid transparent",
                    fontWeight: isActive ? 800 : 600,
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs transition-all cursor-pointer text-left hover:bg-gray-50"
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: isActive ? "#06462e" : "#9ca3af" }}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Banner minh họa: Đồ cũ có thể bắt đầu một hành trình mới! */}
          <div className="pt-4 border-t border-gray-100 text-center space-y-3">
            <div className="text-left px-2">
              <span
                className="text-sm font-black text-emerald-800 italic leading-snug block"
                style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: "17px" }}
              >
                Đồ cũ <br />
                <span className="text-amber-500 font-extrabold">có thể bắt đầu</span>
                <br />
                1 hành trình mới!
              </span>
            </div>
            <div className="relative px-2 flex justify-center">
              <img
                src="/assets/banner-3d-center-clean.png"
                alt="Minh họa đồ cũ"
                className="w-full h-32 object-contain drop-shadow-sm"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/3d-study.png";
                }}
              />
            </div>
          </div>
        </aside>

        {/* --------------------------------------------------------------------- */}
        {/* CỘT 2 (GIỮA - 1fr): FORM ĐĂNG TIN SẢN PHẨM (4 BƯỚC CHUẨN ẢNH 2)       */}
        {/* --------------------------------------------------------------------- */}
        <section
          style={{
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid rgba(229, 231, 235, 0.9)",
            padding: "26px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
          className="space-y-6"
        >
          {/* Header Form */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#06462e] flex items-center justify-center shrink-0 border border-emerald-100">
                <Laptop className="w-5 h-5 text-[#06462e]" />
              </div>
              <div>
                <h1 className="text-base font-black text-gray-900 leading-tight">Đăng tin sản phẩm</h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Đăng bán đồ cũ, giúp món đồ của bạn tìm được chủ mới!
                </p>
              </div>
            </div>
            <span className="text-[11px] text-gray-400 italic">
              * Thông tin có dấu <span className="text-red-500 font-bold">*</span> là bắt buộc
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ----------------------------------------------------------------- */}
            {/* BƯỚC 1: THÔNG TIN CƠ BẢN                                          */}
            {/* ----------------------------------------------------------------- */}
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

              {/* Row 1: Danh mục & Danh mục con */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-emerald-600 transition-all outline-none appearance-none pr-8 cursor-pointer"
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
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-emerald-600 transition-all outline-none appearance-none pr-8 cursor-pointer"
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

              {/* Row 2: Tiêu đề sản phẩm & Giá bán */}
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
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-emerald-600 transition-all outline-none"
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
                      className="w-full pr-8 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-bold focus:bg-white focus:border-emerald-600 transition-all outline-none disabled:opacity-50"
                      required={!isFree}
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">
                      đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Tình trạng & Số lượng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Tình trạng <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-emerald-600 transition-all outline-none appearance-none pr-8 cursor-pointer"
                    >
                      <option value="Tốt">Chọn tình trạng (Tốt)</option>
                      <option value="Như mới 99%">Như mới 99%</option>
                      <option value="Khá">Khá (Đã qua sử dụng)</option>
                      <option value="Cần bảo dưỡng nhẹ">Cần bảo dưỡng nhẹ</option>
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
                      className="w-full pr-14 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-emerald-600 transition-all outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-medium">
                      chiếc
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* BƯỚC 2: MÔ TẢ SẢN PHẨM                                            */}
            {/* ----------------------------------------------------------------- */}
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
                  placeholder="Mô tả chi tiết về sản phẩm: tình trạng, lỗi (nếu có), phụ kiện đi kèm, lý do bán..."
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 leading-relaxed focus:bg-white focus:border-emerald-600 transition-all outline-none resize-none"
                  required
                />
                <span className="absolute bottom-3 right-3 text-[10px] text-gray-400 font-medium">
                  {description.length}/1000
                </span>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* BƯỚC 3: HÌNH ẢNH SẢN PHẨM (DÀN HÀNG NGANG CHUẨN ẢNH 2)            */}
            {/* ----------------------------------------------------------------- */}
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

              {/* Hàng ngang chứa Dropzone + 3 Thumbnail + Nút Thêm ảnh */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Vùng upload ảnh kéo thả */}
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

                {/* Danh sách ảnh thumbnail đã upload */}
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

                {/* Nút thêm ảnh phụ (+ Thêm ảnh) */}
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

            {/* ----------------------------------------------------------------- */}
            {/* BƯỚC 4: THÔNG TIN CHI TIẾT                                        */}
            {/* ----------------------------------------------------------------- */}
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

              {/* Row 1: Thương hiệu, Model, Năm sản xuất */}
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
                      <option value="Apple">Chọn thương hiệu (Apple)</option>
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

              {/* Row 2: Thông số kỹ thuật, Phụ kiện đi kèm, Bảo hành */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Thông số kỹ thuật (nếu có)
                  </label>
                  <input
                    type="text"
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    placeholder="Ví dụ: RAM 8GB, SSD 256GB..."
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
                      <option value="Đầy đủ sạc cáp zin">Chọn phụ kiện (Đầy đủ)</option>
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
                      <option value="Không">Chọn bảo hành (Không)</option>
                      <option value="Còn bảo hành hãng">Còn bảo hành hãng</option>
                      <option value="Bao test 7 ngày">Bao test 7 ngày</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: Địa điểm giao nhận & Hình thức nhận hàng */}
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
                      <option value="Đại học Bách Khoa TP.HCM">Chọn khu vực (ĐH Bách Khoa)</option>
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

            {/* Thông báo đăng thành công */}
            {publishSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Đã đăng tin thành công! Đang chuyển đến danh sách bài đăng của bạn...</span>
              </div>
            )}

            {/* FOOTER BUTTONS: XEM TRƯỚC & ĐĂNG TIN */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                <span>Xem trước</span>
              </button>

              <button
                type="submit"
                disabled={busy}
                style={{
                  backgroundColor: "#06462e",
                  color: "#ffffff",
                }}
                className="px-8 py-2.5 hover:bg-[#0a5c3e] rounded-xl text-xs font-black shadow-md shadow-emerald-950/20 transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>{busy ? "Đang xử lý..." : "Đăng tin"}</span>
              </button>
            </div>
          </form>
        </section>

        {/* --------------------------------------------------------------------- */}
        {/* CỘT 3 (PHẢI - 380px): XEM TRƯỚC TIN ĐĂNG (LIVE PREVIEW CHUẨN ẢNH 2)   */}
        {/* --------------------------------------------------------------------- */}
        <aside
          style={{
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            border: "1px solid rgba(229, 231, 235, 0.9)",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            position: "sticky",
            top: "88px",
          }}
          className="create-post-preview-col space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>Xem trước tin đăng</span>
          </div>

          {/* Card xem trước sản phẩm thời gian thực */}
          <div className="space-y-3">
            {/* Ảnh lớn và badge số lượng */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={images[0] || "/assets/detail/macbook-main.png"}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/detail/macbook-main.png";
                }}
              />
              <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded-md">
                1/{images.length || 1}
              </span>
            </div>

            {/* Tiêu đề & Giá bán */}
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

            {/* Vị trí & thời gian */}
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

            {/* 3 Badge kiểm định nhanh */}
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

            {/* Thông tin người bán sinh viên */}
            <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-2">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/detail/seller-avatar.png"
                  alt="Avatar người bán"
                  className="w-9 h-9 rounded-full object-cover border border-emerald-300"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/avatar-default.png";
                  }}
                />
                <div>
                  <div className="flex items-center gap-1 text-xs font-black text-gray-900">
                    <span>{currentUser?.name || "Nguyễn Văn An"}</span>
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
                <span className="text-gray-300">·</span>
                <span>98% phản hồi</span>
              </div>

              <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Khối Campus Check */}
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
              <div className="pt-1 text-[10.5px] text-gray-600 space-y-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bạn sẽ nhận được hỗ trợ đồng kiểm sản phẩm khi giao dịch.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hãy giao dịch an toàn, không chuyển khoản trước khi chưa gặp trực tiếp.</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default CreatePostView;
