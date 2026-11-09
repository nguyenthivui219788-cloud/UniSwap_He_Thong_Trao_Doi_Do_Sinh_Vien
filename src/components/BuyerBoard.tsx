import { UNIVERSITIES } from "../data/mockData";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { categories, clusters, normalize } from "../lib/market";
import type { ProductItem, User } from "../types";
import {
  ShoppingBag,
  Store,
  MessageCircle,
  Phone,
  Share2,
  Sparkles,
  Zap,
  CheckCircle2,
  Search,
  Plus,
  X,
  ExternalLink,
  ShieldCheck,
  Crown,
  ArrowRight,
  Tag,
  Calendar,
  MapPin,
  Clock,
  Send,
  SlidersHorizontal,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import "../buyer-board-pro.css";
import { WantedFeaturedCarousel } from "./WantedFeaturedCarousel";

export function BuyerBoard({
  user,
  focusId = "",
  onClearFocus,
  products,
  onSelect,
  onLogin,
  onNotice,
  onNavigate,
  onOpenPremium,
  onOpenCreateListing,
}: {
  focusId?: string;
  onClearFocus: () => void;
  user: User | null;
  products: ProductItem[];
  onSelect: (p: ProductItem) => void;
  onLogin: () => void;
  onNotice: (s: string) => void;
  onNavigate?: (page: any) => void;
  onOpenPremium?: () => void;
  onOpenCreateListing?: () => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // DUAL MARKET MODE: 'buyer' (Sàn Cần Mua) vs 'seller' (Sàn Cần Bán / Chào Hàng)
  const [marketMode, setMarketMode] = useState<"buyer" | "seller">("buyer");

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [cluster, setCluster] = useState("all");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [budgetBand, setBudgetBand] = useState("all");
  const [sort, setSort] = useState("latest");
  const [limit, setLimit] = useState(12);

  // Modals state
  const [chatTarget, setChatTarget] = useState<any | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [contactTarget, setContactTarget] = useState<any | null>(null);
  const [offerTarget, setOfferTarget] = useState<any | null>(null);
  const [selectedOfferProductId, setSelectedOfferProductId] = useState("");
  const [customOfferText, setCustomOfferText] = useState("");
  const [showProModal, setShowProModal] = useState(false);
  const [proModalType, setProModalType] = useState<"seller" | "buyer" | "both">("seller");
  const [showFaq, setShowFaq] = useState(false);

  // Form State
  const [editing, setEditing] = useState("");
  const [today] = useState(() =>
    new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }).format(new Date())
  );
  const [form, setForm] = useState({
    postType: "buy", // 'buy' (Người mua) or 'sell' (Người bán xả gấp)
    title: "",
    description: "",
    budget: 0,
    category: "books",
    cluster: "lang-dh",
    neededBy: "",
    contactPhone: "",
    contactZalo: "",
  });

  // PHÂN QUYỀN GÓI MUA & GÓI BÁN CHÍNH XÁC:
  // 1. Gói Bán (Seller Pro): Đăng bán vô hạn bên mục bán + Mở khóa Zalo & Nhắn tin Người Mua bên mục mua.
  // 2. Gói Mua (Buyer Pro): Đăng mua vô hạn bên mục mua (bị khóa giới hạn 3 bài bên mục bán nếu chưa có Gói Bán).
  // 3. Gói Toàn Diện (Hunter Pro) / Admin: Mở khóa toàn bộ cả 2 bên.
  const isAdmin = user?.role === "admin";
  const isHunterProAll = user?.tier === "hunter_pro" || isAdmin;
  const isSellerPro =
    isHunterProAll ||
    !!(user as any)?.sellerPremium ||
    (user as any)?.subscription?.plan === "seller" ||
    (user as any)?.subscription?.plan === "both";
  const isBuyerPro =
    isHunterProAll ||
    !!(user as any)?.buyerPremium ||
    (user as any)?.subscription?.plan === "buyer" ||
    (user as any)?.subscription?.plan === "both";

  const refresh = async () => {
    try {
      const res = await api("/buy-requests");
      setItems(res.requests || []);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    let alive = true;
    api("/buy-requests")
      .then((d) => {
        if (alive) setItems(d.requests || []);
      })
      .catch((e) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user?.id]);

  const handleOpenPro = (type: "seller" | "buyer" | "both" = "seller") => {
    setProModalType(type);
    if (onOpenPremium) {
      onOpenPremium();
    } else if (onNavigate) {
      onNavigate("premium");
    } else {
      setShowProModal(true);
    }
  };

  // Helper: Determine if item is Buyer or Seller
  const getItemType = (item: any): "buyer" | "seller" => {
    if (item.data?.postType === "sell") return "seller";
    if (item.data?.postType === "buy") return "buyer";
    const title = (item.data?.title || "").toLowerCase();
    if (
      title.includes("cần bán") ||
      title.includes("thanh lý") ||
      title.includes("xả") ||
      title.includes("pass")
    ) {
      return "seller";
    }
    return "buyer";
  };

  // Quotas
  const ownOpenSellerPosts = items.filter(
    (i) => i.user_id === user?.id && getItemType(i) === "seller" && i.status === "open"
  ).length;

  const ownOpenBuyerPosts = items.filter(
    (i) => i.user_id === user?.id && getItemType(i) === "buyer" && i.status === "open"
  ).length;

  // Submit new / edit request
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");

    // 1. CHECK SELLER QUOTA (Chỉ 3 bài bán cho free user)
    if (form.postType === "sell" && !isSellerPro && ownOpenSellerPosts >= 3 && !editing) {
      onNotice(
        "Tài khoản thường đã đăng đủ 3 bài bán. Đang chuyển đến trang Gói Premium Bán để mở khóa đăng vô hạn!"
      );
      setCreating(false);
      handleOpenPro("seller");
      return;
    }

    // 2. CHECK BUYER QUOTA (Chỉ 3 bài mua cho free user)
    if (form.postType === "buy" && !isBuyerPro && ownOpenBuyerPosts >= 3 && !editing) {
      onNotice(
        "Tài khoản thường đã đăng đủ 3 bài cần mua. Đang chuyển đến trang Gói Premium Mua để mở khóa đăng vô hạn!"
      );
      setCreating(false);
      handleOpenPro("buyer");
      return;
    }

    setBusy(true);
    try {
      await api(
        "/buy-requests" + (editing ? "/" + editing : ""),
        editing ? "PATCH" : "POST",
        form
      );
      setCreating(false);
      setEditing("");
      setForm({
        postType: marketMode === "seller" ? "sell" : "buy",
        title: "",
        description: "",
        budget: 0,
        category: "books",
        cluster: "lang-dh",
        neededBy: "",
        contactPhone: "",
        contactZalo: "",
      });
      await refresh();
      onNotice(
        editing
          ? "Đã cập nhật bài đăng thành công!"
          : form.postType === "sell"
          ? "Đã đăng tin thanh lý / chào hàng gấp!"
          : "Đã đăng nhu cầu tìm đồ thành công!"
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  // Handle Send Direct Message
  async function handleSendDirectChat(e: FormEvent) {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setBusy(true);
    try {
      onNotice(`Đã gửi tin nhắn đến ${chatTarget.name || "bạn ấy"}: "${chatMessage.slice(0, 40)}..."`);
      setChatTarget(null);
      setChatMessage("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  // Handle Offer Submission
  async function handleSendOffer(e: FormEvent) {
    e.preventDefault();
    if (!offerTarget) return;
    setBusy(true);
    try {
      await api(`/buy-requests/${offerTarget.id}/respond`, "POST", {
        productId: selectedOfferProductId || "custom_offer",
        text: customOfferText || "Mình có món đồ phù hợp muốn gửi bạn tham khảo nhé!",
      });
      setOfferTarget(null);
      setSelectedOfferProductId("");
      setCustomOfferText("");
      await refresh();
      onNotice("Đã gửi đề xuất chào hàng cho bạn ấy thành công!");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  // Handle Contact Button Click (Gating logic)
  const handleContactClick = (item: any) => {
    const type = getItemType(item);

    // Ở mục Cần Mua: Người Bán xem tin Người Mua -> BẮT BUỘC PHẢI CÓ GÓI BÁN!
    if (type === "buyer") {
      if (!user) {
        onNotice("Mở khóa liên hệ Người Mua trực tiếp — Xem các gói Hunter Pro để kích hoạt!");
        handleOpenPro("seller");
        return;
      }
      if (!isSellerPro) {
        onNotice("Bạn cần nâng cấp Gói Premium Bán để mở khóa số Zalo và liên hệ chốt đơn với Người Mua này!");
        handleOpenPro("seller");
        return;
      }
    }

    setContactTarget(item);
  };

  // Handle Chat Button Click (Gating logic)
  const handleChatClick = (item: any) => {
    const type = getItemType(item);

    // Ở mục Cần Mua: Người Bán muốn nhắn tin cho Người Mua -> BẮT BUỘC PHẢI CÓ GÓI BÁN!
    if (type === "buyer") {
      if (!user) {
        onNotice("Vui lòng nâng cấp Gói Premium Bán để mở khóa chat và chốt đơn với Người Mua!");
        handleOpenPro("seller");
        return;
      }
      if (!isSellerPro) {
        onNotice("Bạn cần Gói Premium Bán để nhắn tin chốt đơn trực tiếp với Người Mua!");
        handleOpenPro("seller");
        return;
      }
    }

    if (!user) {
      onLogin();
      return;
    }

    setChatTarget(item);
    setChatMessage(
      `Chào ${item.name}, mình thấy tin bạn ${
        type === "buyer" ? "đang tìm" : "đang thanh lý"
      } "${item.data.title}". Mình muốn trao đổi với bạn nhé!`
    );
  };

  // Handle Offer Button Click (Gating logic)
  const handleOfferClick = (item: any) => {
    const type = getItemType(item);

    // Chào hàng cho Người Mua -> BẮT BUỘC PHẢI CÓ GÓI BÁN!
    if (type === "buyer") {
      if (!user || !isSellerPro) {
        onNotice("Nâng cấp Gói Premium Bán để gửi báo giá và chào hàng trực tiếp cho Người Mua!");
        handleOpenPro("seller");
        return;
      }
    }

    if (!user) {
      onLogin();
      return;
    }

    setOfferTarget(item);
  };

  // Products available to offer
  const ownProducts = products.filter(
    (p) => p.seller.id === user?.id && p.status === "available"
  );

  // Statistics
  const totalBuyerPosts = items.filter((i) => getItemType(i) === "buyer" && i.status === "open").length;
  const totalSellerPosts = items.filter((i) => getItemType(i) === "seller" && i.status === "open").length;

  // Filtered Items theo Market Mode
  const visible = items
    .filter((i) => {
      // 1. Focus ID
      if (focusId && i.id !== focusId) return false;

      // 2. Chế độ Sàn: Sàn Cần Mua (hiện tin Người Mua) vs Sàn Cần Bán (hiện tin Người Bán)
      const type = getItemType(i);
      if (marketMode === "buyer" && type !== "buyer") return false;
      if (marketMode === "seller" && type !== "seller") return false;

      // 3. Tab Tin của tôi
      if (activeTab === "mine" && i.user_id !== user?.id) return false;

      // 4. Category & Cluster & School
      if (category !== "all" && i.data.category !== category) return false;
      if (cluster !== "all" && i.data.cluster !== cluster) return false;
      if (schoolFilter !== "all" && i.school !== schoolFilter) return false;

      // 5. Budget Band
      const b = i.data.budget || 0;
      if (budgetBand === "free" && b !== 0) return false;
      if (budgetBand === "low" && (b <= 0 || b > 100000)) return false;
      if (budgetBand === "mid" && (b <= 100000 || b > 500000)) return false;
      if (budgetBand === "high" && b <= 500000) return false;

      // 6. Query
      if (query) {
        const textToSearch = [i.data.title, i.data.description, i.school, i.name].join(" ");
        if (!normalize(textToSearch).includes(normalize(query))) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sort === "budget") return (a.data.budget || 0) - (b.data.budget || 0);
      if (sort === "deadline") return (a.data.neededBy || "9999").localeCompare(b.data.neededBy || "9999");
      return Date.parse(b.created) - Date.parse(a.created);
    });

  return (
    <section className="swap-buyer-board-pro">
      {/* 1. DUAL MARKET SWITCHER (BỘ CHUYỂN ĐỔI 2 SÀN ĐỐI XỨNG CẦN MUA & CẦN BÁN) */}
      <div className="wanted-market-switcher">
        <button
          className={`wanted-switcher-btn buyer-mode ${marketMode === "buyer" ? "active" : ""}`}
          onClick={() => {
            setMarketMode("buyer");
            onClearFocus();
          }}
        >
          <div className="wanted-switcher-icon">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="wanted-switcher-title">
              🙋‍♂️ SÀN CẦN MUA ({totalBuyerPosts})
              {marketMode === "buyer" && (
                <span className="wanted-tag" style={{ background: "#dcfce7", color: "#15803d", fontSize: 11 }}>
                  Đang xem
                </span>
              )}
            </div>
            <p className="wanted-switcher-desc">
              Người Mua đăng nhu cầu tìm đồ. <b>Người Bán cần Gói Bán</b> để mở khóa Zalo & chốt đơn!
            </p>
          </div>
        </button>

        <button
          className={`wanted-switcher-btn seller-mode ${marketMode === "seller" ? "active" : ""}`}
          onClick={() => {
            setMarketMode("seller");
            onClearFocus();
          }}
        >
          <div className="wanted-switcher-icon">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="wanted-switcher-title">
              🏪 SÀN CẦN BÁN ({totalSellerPosts})
              {marketMode === "seller" && (
                <span className="wanted-tag" style={{ background: "#ffedd5", color: "#c2410c", fontSize: 11 }}>
                  Đang xem
                </span>
              )}
            </div>
            <p className="wanted-switcher-desc">
              Người Bán xả nhanh đồ gấp. <b>Có Gói Bán đăng bài VÔ HẠN</b> (Tài khoản thường tối đa 3 bài)!
            </p>
          </div>
        </button>
      </div>

      {/* 2. HERO HEADER THEME TỰ ĐỘNG ĐỔI THEO SÀN */}
      <div className={`wanted-hero ${marketMode === "seller" ? "theme-seller" : "theme-buyer"}`}>
        <div className="wanted-hero-content">
          <div className="wanted-hero-text">
            <span className="wanted-hero-badge">
              {marketMode === "seller" ? "Dành Riêng Cho Người Bán" : "Dành Riêng Cho Người Mua"}
            </span>
            <h1>
              {marketMode === "seller" ? (
                <>
                  <Store className="w-8 h-8 text-amber-300" />
                  Sàn Cần Bán & Chào Hàng Xả Nhanh
                </>
              ) : (
                <>
                  <ShoppingBag className="w-8 h-8 text-amber-300" />
                  Sàn Cần Mua & Khớp Đơn Sinh Viên
                </>
              )}
            </h1>
            <p>
              {marketMode === "seller"
                ? "Người Bán đăng xả đồ gấp. Sinh viên có Gói Bán (Seller Pro) được đăng bài VÔ HẠN không giới hạn số lượng!"
                : "Người Mua đăng nhu cầu tìm đồ và ngân sách sẵn có. Người Bán có Gói Bán (Seller Pro) được mở khóa Zalo để chốt đơn ngay!"}
            </p>
          </div>
          <div className="wanted-hero-actions">
            <button
              className="wanted-btn-post"
              onClick={() => {
                if (!user) {
                  onLogin();
                  return;
                }
                setCreating(true);
                setEditing("");
                setError("");
                setForm({
                  postType: marketMode === "seller" ? "sell" : "buy",
                  title: "",
                  description: "",
                  budget: 0,
                  category: "books",
                  cluster: "lang-dh",
                  neededBy: "",
                  contactPhone: "",
                  contactZalo: "",
                });
              }}
            >
              <Plus className="w-5 h-5 text-emerald-700" />
              {marketMode === "seller" ? "＋ Đăng tin Xả Hàng Bán" : "＋ Đăng tin Cần Mua"}
            </button>

            <button
              className="wanted-btn-pro"
              onClick={() => handleOpenPro(marketMode === "seller" ? "seller" : "buyer")}
            >
              <Crown className="w-4 h-4 text-amber-200" />
              {marketMode === "seller" ? "Gói Premium Bán" : "Gói Premium Mua"}
            </button>
          </div>
        </div>
      </div>

      {/* 3. THÔNG BÁO PHÂN QUYỀN GÓI MUA & GÓI BÁN TRỰC QUAN */}
      {marketMode === "buyer" ? (
        <div className="wanted-permission-alert buyer-alert">
          <div>
            <b>🔒 Dành cho Người Bán:</b> Toàn bộ số Zalo & mục Nhắn tin bên Sàn Cần Mua bị khóa đối với tài khoản thường. Hãy nâng cấp <b>Gói Premium Bán</b> để mở khóa liên hệ và chốt đơn ngay với Người Mua!
          </div>
          <button className="wanted-permission-btn" onClick={() => handleOpenPro("seller")}>
            {isSellerPro ? "✓ Đã Kích Hoạt Gói Bán" : "Mở Khóa Gói Bán (39k) →"}
          </button>
        </div>
      ) : (
        <div className="wanted-permission-alert seller-alert">
          <div>
            <b>⚡ Hạn mức Người Bán:</b> Tài khoản thường được đăng tối đa <b>3 bài bán</b> (Hiện tại bạn có: <b>{ownOpenSellerPosts}/3 bài</b>). Nâng cấp <b>Gói Premium Bán</b> để mở khóa đăng bài <b>VÔ HẠN</b>!
          </div>
          <button className="wanted-permission-btn" onClick={() => handleOpenPro("seller")}>
            {isSellerPro ? "✓ Đã Có Gói Bán (Vô hạn)" : "Nâng Cấp Đăng Vô Hạn →"}
          </button>
        </div>
      )}

      {/* 3.5. DẢI TIN XOAY CHẠY TỰ ĐỘNG: CẦN MUA / CẦN TÌM GẤP TOP TRANG 1 */}
      <WantedFeaturedCarousel
        marketMode={marketMode}
        items={items.filter((i) => getItemType(i) === (marketMode === "seller" ? "seller" : "buyer"))}
        onSelectItem={(item) => handleContactClick(item)}
        onOpenPro={() => handleOpenPro(marketMode === "seller" ? "seller" : "buyer")}
        currentUser={user}
        onRequireLogin={onLogin}
      />

      {focusId && (
        <div className="hub-focus-note" style={{ marginBottom: 16 }}>
          Bạn đang xem bài đăng theo liên kết chia sẻ.{" "}
          <button onClick={onClearFocus} style={{ fontWeight: 700, color: "#065f46" }}>
            Xem toàn bộ bài đăng
          </button>
        </div>
      )}

      {/* 5. SEARCH & FILTER TOOLBAR */}
      <div className="wanted-toolbar">
        <div className="wanted-toolbar-top">
          <input
            type="search"
            className="wanted-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`🔍 Tìm kiếm món đồ ${marketMode === "buyer" ? "sinh viên cần mua" : "sinh viên đang xả bán"}...`}
          />
          <div className="wanted-filter-field">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="latest">Mới nhất vừa đăng</option>
              <option value="deadline">Cần gấp sớm nhất</option>
              <option value="budget">Mức giá / Ngân sách tăng dần</option>
            </select>
          </div>
        </div>

        <div className="wanted-toolbar-selects">
          <div className="wanted-filter-field">
            <label>Danh mục</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {Object.entries(categories).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="wanted-filter-field">
            <label>Khu vực Campus</label>
            <select value={cluster} onChange={(e) => setCluster(e.target.value)}>
              {Object.entries(clusters).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="wanted-filter-field">
            <label>Trường ĐH</label>
            <select value={schoolFilter} onChange={(e) => setSchoolFilter(e.target.value)}>
              <option value="all">Tất cả trường</option>
              {UNIVERSITIES.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="wanted-filter-field">
            <label>Khoảng giá</label>
            <select value={budgetBand} onChange={(e) => setBudgetBand(e.target.value)}>
              <option value="all">Mọi mức giá</option>
              <option value="free">Đồ cho tặng 0đ</option>
              <option value="low">Dưới 100.000đ</option>
              <option value="mid">100.000đ – 500.000đ</option>
              <option value="high">Trên 500.000đ</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. GRID OF POSTS */}
      <div className="wanted-grid">
        {visible.slice(0, limit).map((item) => {
          const type = getItemType(item);
          const isOwn = item.user_id === user?.id;
          const isPostPro = item.admin || item.is_pro || item.data?.isPro;

          // Quyền xem Zalo & Chat đối với bài Cần Mua: BẮT BUỘC có isSellerPro!
          const canUnlockBuyerContact = isSellerPro || isOwn;

          return (
            <article
              key={item.id}
              className={`wanted-card type-${type} ${isPostPro ? "is-pro-card" : ""}`}
              id={`request-${item.id}`}
            >
              {/* Card Header: Author Identity & Role Badge */}
              <div className="wanted-card-header">
                <div className="wanted-author-info">
                  <img
                    src={item.avatar || "/assets/detail/seller-avatar.png"}
                    alt={item.name}
                    className="wanted-avatar"
                  />
                  <div className="wanted-author-text">
                    <b>
                      {item.name}
                      {item.verified ? (
                        <span title="Đã xác minh sinh viên">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 inline ml-1" />
                        </span>
                      ) : null}
                    </b>
                    <span className="wanted-author-sub">
                      {item.school || "DHV"} · {clusters[item.data.cluster] || "Campus"}
                    </span>
                  </div>
                </div>

                {/* ROLE BADGE */}
                {type === "buyer" ? (
                  <span className="wanted-role-badge buyer">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                    Cần Mua
                  </span>
                ) : (
                  <span className="wanted-role-badge seller">
                    <Store className="w-3.5 h-3.5 text-orange-700" />
                    Cần Bán
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div>
                <h3 className="wanted-card-title">{item.data.title}</h3>
                <p className="wanted-card-desc">{item.data.description}</p>

                {/* Price / Budget Box */}
                <div className="wanted-price-box">
                  <span className="wanted-price-label">
                    {type === "buyer" ? "💰 Ngân sách sẵn sàng:" : "🏷️ Giá thanh lý SV:"}
                  </span>
                  <span className="wanted-price-value">
                    {item.data.budget
                      ? `${item.data.budget.toLocaleString("vi-VN")}đ`
                      : "0đ (Đồ cho tặng)"}
                  </span>
                </div>

                {/* BLURRED / LOCKED CONTACT TEASER Ở MỤC CẦN MUA CHO NGƯỜI BÁN */}
                {type === "buyer" && !isOwn && (
                  <div
                    className="wanted-locked-contact-box"
                    onClick={() => handleContactClick(item)}
                    title={canUnlockBuyerContact ? "Bấm xem số Zalo" : "Nâng cấp Gói Bán để mở khóa số Zalo"}
                  >
                    <div>
                      <small style={{ display: "block", color: "#64748b", fontSize: 11 }}>
                        Zalo Người Mua:
                      </small>
                      {canUnlockBuyerContact ? (
                        <span style={{ fontWeight: 700, color: "#0068ff", fontSize: 13 }}>
                          {item.data?.contactPhone || item.phone || "0938 123 456"}
                        </span>
                      ) : (
                        <span className="wanted-blurred-text">0938 ••• •••</span>
                      )}
                    </div>
                    <span className="wanted-lock-pill">
                      {canUnlockBuyerContact ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã mở khóa
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-amber-700" /> Mở khóa (Gói Bán)
                        </>
                      )}
                    </span>
                  </div>
                )}

                {/* Meta Tags */}
                <div className="wanted-meta-tags">
                  <span className="wanted-tag">
                    {categories[item.data.category] || "Đồ dùng"}
                  </span>
                  {item.data.neededBy && (
                    <span className="wanted-tag urgent">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Hạn: {item.data.neededBy}
                    </span>
                  )}
                  {item.is_demo && (
                    <span className="wanted-tag" style={{ background: "#fef9c3", color: "#854d0e" }}>
                      Minh họa Campus
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Chat, Liên hệ, Chào hàng, Đẩy tin */}
              <div className="wanted-card-actions">
                {isOwn ? (
                  <>
                    <button
                      className="wanted-btn-chat"
                      onClick={() => {
                        setForm({ ...item.data });
                        setEditing(item.id);
                        setCreating(true);
                      }}
                    >
                      Sửa tin
                    </button>

                    <button
                      className="wanted-btn-contact"
                      onClick={async () => {
                        if (confirm("Bạn có chắc muốn đóng bài đăng này?")) {
                          await api(`/buy-requests/${item.id}`, "DELETE");
                          await refresh();
                          onNotice("Đã đóng bài đăng.");
                        }
                      }}
                    >
                      Đóng tin
                    </button>

                    <button
                      className="wanted-btn-push"
                      style={{ gridColumn: "span 2" }}
                      onClick={() => handleOpenPro("both")}
                    >
                      <Zap className="w-4 h-4" />
                      ⚡ Đẩy tin lên TOP Radar
                    </button>
                  </>
                ) : (
                  <>
                    {/* Nút 1: Nhắn tin trực tiếp */}
                    <button
                      className="wanted-btn-chat"
                      onClick={() => handleChatClick(item)}
                    >
                      {type === "buyer" && !isSellerPro ? (
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                      ) : (
                        <MessageCircle className="w-4 h-4" />
                      )}
                      {type === "buyer" && !isSellerPro ? "Mở khóa Chat" : "Nhắn tin"}
                    </button>

                    {/* Nút 2: Xem Zalo & SĐT liên hệ */}
                    <button
                      className="wanted-btn-contact"
                      onClick={() => handleContactClick(item)}
                    >
                      {type === "buyer" && !isSellerPro ? (
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <Phone className="w-4 h-4 text-emerald-600" />
                      )}
                      {type === "buyer" && !isSellerPro ? "Mở khóa Zalo" : "Xem Zalo / SĐT"}
                    </button>

                    {/* Nút 3: Chào hàng */}
                    <button
                      className="wanted-btn-offer"
                      onClick={() => handleOfferClick(item)}
                    >
                      {type === "buyer" && !isSellerPro ? (
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-amber-600" />
                      )}
                      {type === "buyer"
                        ? isSellerPro
                          ? "Chào hàng cho bạn này"
                          : "Mở khóa chào hàng (Gói Bán)"
                        : "Đề xuất mua món này"}
                    </button>
                  </>
                )}
              </div>

              {/* Suggestions / Responses list if any */}
              {item.responses && item.responses.length > 0 && (
                <details style={{ marginTop: 14, fontSize: 13, borderTop: "1px dashed #e2e8f0", paddingTop: 10 }}>
                  <summary style={{ cursor: "pointer", fontWeight: 700, color: "#065f46" }}>
                    {item.responses.length} gợi ý món đồ đã gửi
                  </summary>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    {item.responses.map((r: any) => (
                      <div
                        key={r.id}
                        onClick={() => r.product && onSelect(r.product)}
                        style={{
                          background: "#f8fafc",
                          padding: "8px 10px",
                          borderRadius: 8,
                          cursor: r.product ? "pointer" : "default",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <b style={{ color: "#0f172a" }}>{r.product?.title || "Món đồ sinh viên đề xuất"}</b>
                        <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: 12 }}>{r.text}</p>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </article>
          );
        })}

        {/* In-feed Pro Sponsored Card */}
        <div className="wanted-infeed-promo">
          <div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                background: "rgba(250, 204, 21, 0.2)",
                color: "#fde047",
                padding: "3px 8px",
                borderRadius: 6,
                textTransform: "uppercase",
              }}
            >
              VIP HUNTER PRO
            </span>
            <h4>
              {marketMode === "seller"
                ? "Người Bán: Đăng xả hàng VÔ HẠN không giới hạn số lượng!"
                : "Người Bán: Mở khóa số Zalo Người Mua & chốt đơn trong 5 phút!"}
            </h4>
            <p>
              {marketMode === "seller"
                ? "Tài khoản thường bị giới hạn tối đa 3 bài bán. Nâng cấp Gói Bán để đăng thanh lý toàn bộ phòng trọ, giáo trình và phụ kiện!"
                : "Hàng trăm sinh viên đang cầm sẵn tiền mặt chờ mua. Nâng cấp Gói Bán để xem số Zalo và gọi điện chốt đơn ngay!"}
            </p>
            <ul className="wanted-infeed-features">
              <li>
                <span>✓</span> Đăng bán VÔ HẠN (Vượt mức 3 bài của tài khoản thường)
              </li>
              <li>
                <span>✓</span> Mở khóa 100% số Zalo Người Mua có sẵn tiền
              </li>
              <li>
                <span>✓</span> AI Radar tự động quét đơn và thông báo tức thì
              </li>
            </ul>
          </div>
          <button className="wanted-infeed-btn" onClick={() => handleOpenPro("seller")}>
            Xem Gói Premium Bán (Chỉ 50.000đ/tháng)
          </button>
        </div>
      </div>

      {loading && <p style={{ textAlign: "center", color: "#64748b" }}>Đang tải danh sách bài đăng...</p>}

      {!loading && !visible.length && (
        <div className="swap-empty">
          <ShoppingBag className="w-12 h-12 text-slate-300" />
          <h3>Không tìm thấy bài đăng nào phù hợp</h3>
          <p>
            Thử đổi bộ lọc hoặc là người đầu tiên đăng tin{" "}
            {marketMode === "seller" ? "xả món đồ này" : "cần tìm món đồ này"}!
          </p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
              setCluster("all");
              setSchoolFilter("all");
              setBudgetBand("all");
              setActiveTab("all");
              onClearFocus();
            }}
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {visible.length > limit && (
        <button className="hub-load-more" onClick={() => setLimit(limit + 12)}>
          Xem thêm bài đăng ({visible.length - limit})
        </button>
      )}

      {/* ==============================================================================
          MODAL ĐĂNG TIN POPUP NỔI (FLOATING FORM MODAL)
          ============================================================================== */}
      {creating && (
        <div className="wanted-modal-overlay" onClick={() => setCreating(false)}>
          <div className="wanted-modal-box form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wanted-modal-header">
              <h3>
                <Plus className="w-5 h-5 text-emerald-600" />
                {editing
                  ? "Chỉnh sửa bài đăng"
                  : form.postType === "sell"
                  ? "Đăng tin Bán / Xả hàng"
                  : "Đăng tin Cần Mua"}
              </h3>
              <button className="wanted-modal-close" onClick={() => setCreating(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="wanted-modal-body">
              {/* Quota reminder notice */}
              <div className="wanted-quota-notice">
                <span>
                  {form.postType === "sell" ? (
                    <>
                      Hạn mức bài bán: <b>{isSellerPro ? "Vô hạn (Gói Bán)" : `${ownOpenSellerPosts}/3 bài (Tài khoản thường)`}</b>
                    </>
                  ) : (
                    <>
                      Hạn mức bài mua: <b>{isBuyerPro ? "Vô hạn (Gói Mua)" : `${ownOpenBuyerPosts}/3 bài (Tài khoản thường)`}</b>
                    </>
                  )}
                </span>
                {form.postType === "sell" && !isSellerPro && (
                  <button className="wanted-quota-upgrade-btn" onClick={() => handleOpenPro("seller")}>
                    Mở khóa VÔ HẠN (Gói Bán)
                  </button>
                )}
                {form.postType === "buy" && !isBuyerPro && (
                  <button className="wanted-quota-upgrade-btn" onClick={() => handleOpenPro("buyer")}>
                    Mở khóa VÔ HẠN (Gói Mua)
                  </button>
                )}
              </div>

              <form onSubmit={submit}>
                {/* Switcher vai trò */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontWeight: 700, fontSize: 13, color: "#334155", display: "block", marginBottom: 8 }}>
                    Chọn mục đích đăng tin:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, postType: "buy" })}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: form.postType === "buy" ? "2px solid #059669" : "1px solid #cbd5e1",
                        background: form.postType === "buy" ? "#ecfdf5" : "#ffffff",
                        color: form.postType === "buy" ? "#065f46" : "#475569",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <ShoppingBag className="w-5 h-5 text-emerald-600" />
                      🙋‍♂️ Người Mua (Cần tìm)
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm({ ...form, postType: "sell" })}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: form.postType === "sell" ? "2px solid #ea580c" : "1px solid #cbd5e1",
                        background: form.postType === "sell" ? "#fff7ed" : "#ffffff",
                        color: form.postType === "sell" ? "#9a3412" : "#475569",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <Store className="w-5 h-5 text-orange-600" />
                      🏪 Người Bán (Xả gấp)
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                    {form.postType === "sell" ? "Tên món bạn muốn thanh lý / xả gấp *" : "Tên món bạn đang cần tìm mua *"}
                  </label>
                  <input
                    required
                    minLength={5}
                    maxLength={120}
                    className="wanted-search-input"
                    placeholder={
                      form.postType === "sell"
                        ? "Ví dụ: Tai nghe Sony WH-CH520 màu đen như mới"
                        : "Ví dụ: Cần tìm giáo trình Cơ sở dữ liệu DHV K23"
                    }
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                    Mô tả chi tiết nhu cầu / món đồ *
                  </label>
                  <textarea
                    required
                    minLength={10}
                    maxLength={2000}
                    rows={3}
                    className="wanted-chat-textarea"
                    placeholder="Mô tả cụ thể tình trạng, phiên bản, phụ kiện kèm theo hoặc khu vực hẹn gặp..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      {form.postType === "sell" ? "Giá muốn bán (0đ = tặng) *" : "Ngân sách tối đa (0đ = cần tặng) *"}
                    </label>
                    <input
                      required
                      type="number"
                      min={0}
                      max={100000000}
                      className="wanted-search-input"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      {form.postType === "sell" ? "Giao dịch trước ngày" : "Cần món này trước ngày"}
                    </label>
                    <input
                      type="date"
                      min={today}
                      className="wanted-search-input"
                      value={form.neededBy}
                      onChange={(e) => setForm({ ...form, neededBy: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      Danh mục *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
                    >
                      {Object.entries(categories)
                        .filter(([k]) => k !== "all")
                        .map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      Khu vực Campus ưu tiên *
                    </label>
                    <select
                      value={form.cluster}
                      onChange={(e) => setForm({ ...form, cluster: e.target.value })}
                      style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1" }}
                    >
                      {Object.entries(clusters)
                        .filter(([k]) => k !== "all")
                        .map(([k, v]) => (
                          <option key={k} value={k}>
                            {v}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      Số điện thoại Zalo liên hệ:
                    </label>
                    <input
                      type="tel"
                      className="wanted-search-input"
                      placeholder="0912 xxx xxx"
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      Ghi chú điểm hẹn:
                    </label>
                    <input
                      type="text"
                      className="wanted-search-input"
                      placeholder="Sảnh ĐH Hùng Vương, Căn tin..."
                      value={form.contactZalo}
                      onChange={(e) => setForm({ ...form, contactZalo: e.target.value })}
                    />
                  </div>
                </div>

                {error && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>{error}</p>}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    type="button"
                    className="wanted-btn-contact"
                    onClick={() => setCreating(false)}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    disabled={busy}
                    type="submit"
                    className="wanted-btn-chat"
                    style={{ background: form.postType === "sell" ? "#ea580c" : "#059669" }}
                  >
                    {editing
                      ? "Lưu cập nhật"
                      : form.postType === "sell"
                      ? "Đăng tin xả hàng"
                      : "Đăng tin cần mua"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================================
          MODAL 1: NHẮN TIN TRỰC TIẾP (DIRECT CHAT MODAL)
          ============================================================================== */}
      {chatTarget && (
        <div className="wanted-modal-overlay" onClick={() => setChatTarget(null)}>
          <div className="wanted-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="wanted-modal-header">
              <h3>
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                Nhắn tin với {chatTarget.name}
              </h3>
              <button className="wanted-modal-close" onClick={() => setChatTarget(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="wanted-modal-body">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <img
                  src={chatTarget.avatar || "/assets/detail/seller-avatar.png"}
                  alt={chatTarget.name}
                  style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <b style={{ color: "#0f172a", fontSize: 15 }}>{chatTarget.name}</b>
                  <span style={{ display: "block", color: "#64748b", fontSize: 13 }}>
                    {chatTarget.school} · Bài đăng: "{chatTarget.data?.title}"
                  </span>
                </div>
              </div>

              {/* Tin nhắn mẫu */}
              <div className="wanted-presets-title">Tin nhắn mẫu gợi ý:</div>
              <div className="wanted-presets-grid">
                <button
                  type="button"
                  className="wanted-preset-btn"
                  onClick={() =>
                    setChatMessage(
                      `Chào ${chatTarget.name}, mình có món "${chatTarget.data?.title}" đúng như bạn cần. Bạn còn nhu cầu không ạ?`
                    )
                  }
                >
                  💬 "Mình có món đồ này, bạn còn nhu cầu không ạ?"
                </button>

                <button
                  type="button"
                  className="wanted-preset-btn"
                  onClick={() =>
                    setChatMessage(
                      `Chào bạn, món này còn bảo hành hay đầy đủ phụ kiện không bạn? Bạn có thể bớt chút tiền xăng cho SV không ạ?`
                    )
                  }
                >
                  💰 "Món này có bớt chút tiền xăng cho SV không bạn?"
                </button>

                <button
                  type="button"
                  className="wanted-preset-btn"
                  onClick={() =>
                    setChatMessage(
                      `Mình có thể hẹn gặp trực tiếp tại sảnh cơ sở ${chatTarget.school || "DHV"} hoặc KTX để trao đổi không bạn?`
                    )
                  }
                >
                  📍 "Hẹn gặp tại sảnh trường hoặc KTX để xem món nhé!"
                </button>
              </div>

              <form onSubmit={handleSendDirectChat}>
                <textarea
                  required
                  className="wanted-chat-textarea"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Nhập nội dung tin nhắn trao đổi của bạn..."
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    type="button"
                    className="wanted-btn-contact"
                    onClick={() => setChatTarget(null)}
                  >
                    Hủy
                  </button>
                  <button disabled={busy} type="submit" className="wanted-btn-chat">
                    <Send className="w-4 h-4" />
                    Gửi tin nhắn ngay
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================================
          MODAL 2: XEM THÔNG TIN LIÊN HỆ & ZALO (CONTACT CARD MODAL)
          ============================================================================== */}
      {contactTarget && (
        <div className="wanted-modal-overlay" onClick={() => setContactTarget(null)}>
          <div className="wanted-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="wanted-modal-header">
              <h3>
                <Phone className="w-5 h-5 text-emerald-600" />
                Thông Tin Liên Hệ Sinh Viên
              </h3>
              <button className="wanted-modal-close" onClick={() => setContactTarget(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="wanted-modal-body">
              <div className="wanted-contact-card">
                <div className="wanted-contact-row">
                  <span className="wanted-contact-label">Họ và tên:</span>
                  <span className="wanted-contact-val">{contactTarget.name}</span>
                </div>

                <div className="wanted-contact-row">
                  <span className="wanted-contact-label">Trường ĐH:</span>
                  <span className="wanted-contact-val">{contactTarget.school || "ĐH Hùng Vương TP.HCM"}</span>
                </div>

                <div className="wanted-contact-row">
                  <span className="wanted-contact-label">Vai trò tin:</span>
                  <span className="wanted-contact-val">
                    {getItemType(contactTarget) === "buyer" ? "🙋‍♂️ Người Mua (Cần tìm đồ)" : "🏪 Người Bán (Xả đồ gấp)"}
                  </span>
                </div>

                <div className="wanted-contact-row">
                  <span className="wanted-contact-label">Điện thoại / Zalo:</span>
                  <span className="wanted-contact-val" style={{ color: "#0068ff" }}>
                    {contactTarget.data?.contactPhone || contactTarget.phone || "0938 123 456"}
                  </span>
                </div>

                <div className="wanted-contact-row">
                  <span className="wanted-contact-label">Email trường:</span>
                  <span className="wanted-contact-val">
                    {contactTarget.email || `${contactTarget.user_id}@dhv.edu.vn`}
                  </span>
                </div>

                <div className="wanted-contact-row">
                  <span className="wanted-contact-label">Điểm hẹn Campus:</span>
                  <span className="wanted-contact-val">
                    {clusters[contactTarget.data.cluster] || "Sảnh chính cơ sở trường"}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, fontSize: 13, color: "#059669" }}>
                <ShieldCheck className="w-5 h-5" />
                <span>Sinh viên đã được xác thực an toàn qua hệ thống UniSwap</span>
              </div>

              <div className="wanted-contact-buttons">
                <a
                  href={`https://zalo.me/${(contactTarget.data?.contactPhone || contactTarget.phone || "0938123456").replace(/\s/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="wanted-btn-zalo"
                >
                  <MessageCircle className="w-4 h-4" />
                  Mở Zalo kết bạn
                </a>

                <a
                  href={`tel:${(contactTarget.data?.contactPhone || contactTarget.phone || "0938123456").replace(/\s/g, "")}`}
                  className="wanted-btn-call"
                >
                  <Phone className="w-4 h-4" />
                  Gọi điện thoại
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================================
          MODAL 3: CHÀO HÀNG / GỢI Ý MÓN ĐỒ (QUICK OFFER MODAL)
          ============================================================================== */}
      {offerTarget && (
        <div className="wanted-modal-overlay" onClick={() => setOfferTarget(null)}>
          <div className="wanted-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="wanted-modal-header">
              <h3>
                <Sparkles className="w-5 h-5 text-amber-600" />
                {getItemType(offerTarget) === "buyer" ? "Chào hàng cho Người Mua" : "Đề xuất mua món này"}
              </h3>
              <button className="wanted-modal-close" onClick={() => setOfferTarget(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="wanted-modal-body">
              <p style={{ margin: "0 0 16px 0", fontSize: 14, color: "#475569" }}>
                Gửi gợi ý món đồ bạn đang có cho <b>{offerTarget.name}</b> (nhu cầu: "<i>{offerTarget.data?.title}</i>"):
              </p>

              <form onSubmit={handleSendOffer}>
                {ownProducts.length > 0 ? (
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      Chọn món từ kho đồ đang bán của bạn:
                    </label>
                    <select
                      value={selectedOfferProductId}
                      onChange={(e) => setSelectedOfferProductId(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                      }}
                    >
                      <option value="">-- Hoặc nhập mô tả món bên dưới --</option>
                      {ownProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.price.toLocaleString("vi-VN")}đ)
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                    Lời nhắn & Báo giá đề xuất của bạn:
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="wanted-chat-textarea"
                    placeholder="Ví dụ: Mình có máy tính Casio FX 580VN màu đen, còn đủ nắp đậy, pass lại 350k hẹn lấy ở sảnh DHV nhé..."
                    value={customOfferText}
                    onChange={(e) => setCustomOfferText(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {onOpenCreateListing && (
                    <button
                      type="button"
                      onClick={() => {
                        setOfferTarget(null);
                        onOpenCreateListing();
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#059669",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      ＋ Tạo tin đăng mới trong kho
                    </button>
                  )}

                  <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
                    <button
                      type="button"
                      className="wanted-btn-contact"
                      onClick={() => setOfferTarget(null)}
                    >
                      Hủy
                    </button>
                    <button disabled={busy} type="submit" className="wanted-btn-offer">
                      Gửi đề xuất chào hàng
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================================
          MODAL 4: UPSELL HUNTER PRO MODAL
          ============================================================================== */}
      {showProModal && (
        <div className="wanted-modal-overlay" onClick={() => setShowProModal(false)}>
          <div className="wanted-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="wanted-modal-header" style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}>
              <h3 style={{ color: "#78350f" }}>
                <Crown className="w-5 h-5 text-amber-700" />
                {proModalType === "seller" ? "Gói Premium Bán (Seller Pro)" : "Gói Premium Mua (Buyer Pro)"}
              </h3>
              <button className="wanted-modal-close" onClick={() => setShowProModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="wanted-modal-body">
              <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, margin: "0 0 16px 0" }}>
                {proModalType === "seller" ? (
                  <>
                    <b>Gói Premium Bán (Chỉ 50k/tháng):</b> Mở khóa 100% số Zalo & mục Nhắn tin bên Sàn Cần Mua để chốt đơn với Người Mua, đồng thời được <b>đăng bán VÔ HẠN</b> bài xả hàng bên Sàn Cần Bán!
                  </>
                ) : (
                  <>
                    <b>Gói Premium Mua (Chỉ 50k/tháng):</b> Được đăng tin Cần Mua <b>VÔ HẠN</b>, ghim tin lên TOP đầu và nhận thông báo radar tự động khi có người đăng bán rẻ hơn ngân sách của bạn!
                  </>
                )}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ background: "#ecfdf5", color: "#047857", padding: 8, borderRadius: 8 }}>⚡</div>
                  <div>
                    <b style={{ fontSize: 14, color: "#0f172a" }}>
                      {proModalType === "seller" ? "Đăng bán VÔ HẠN bài xả hàng" : "Đăng Cần Mua VÔ HẠN nhu cầu"}
                    </b>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                      Tài khoản thường bị giới hạn 3 bài. Nâng cấp để xóa bỏ hoàn toàn giới hạn.
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ background: "#eff6ff", color: "#1d4ed8", padding: 8, borderRadius: 8 }}>📞</div>
                  <div>
                    <b style={{ fontSize: 14, color: "#0f172a" }}>Mở khóa số Zalo & Gọi điện trực tiếp</b>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                      {proModalType === "seller"
                        ? "Xem ngay số điện thoại Zalo của sinh viên cần mua để chủ động chốt đơn."
                        : "Nhận liên hệ ưu tiên và bảo vệ giao dịch campus an toàn."}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ background: "#fef3c7", color: "#b45309", padding: 8, borderRadius: 8 }}>🤖</div>
                  <div>
                    <b style={{ fontSize: 14, color: "#0f172a" }}>AI Radar tự động quét đơn 24/7</b>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                      Tự động báo tin Zalo/Web ngay khi có người tìm hoặc bán đúng món đồ bạn quan tâm.
                    </p>
                  </div>
                </div>
              </div>

              <button
                className="wanted-btn-pro"
                style={{ width: "100%", justifyContent: "center", padding: "14px" }}
                onClick={() => {
                  setShowProModal(false);
                  if (onOpenPremium) onOpenPremium();
                  else if (onNavigate) onNavigate("premium");
                }}
              >
                👉 Đi đến Trang Mua Gói Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
