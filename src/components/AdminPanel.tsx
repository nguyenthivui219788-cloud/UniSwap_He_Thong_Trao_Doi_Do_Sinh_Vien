import { useEffect, useState, useMemo } from "react";
import { api } from "../lib/api";
import type { User } from "../types";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  LayoutDashboard,
  Package,
  FileText,
  AlertTriangle,
  Users,
  History,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  BadgeCheck,
  RefreshCw,
  Lock,
  Unlock,
  GraduationCap,
  Clock,
  Sparkles,
  ShoppingBag,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Check,
} from "lucide-react";

interface AdminPanelProps {
  currentUser?: User | null;
  onRoleChanged?: () => void;
  onClose?: () => void;
}

export function AdminPanel({ currentUser, onRoleChanged, onClose }: AdminPanelProps) {
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState<"dashboard" | "products" | "posts" | "reports" | "users" | "audit">("dashboard");
  const [postSubTab, setPostSubTab] = useState<"community" | "wanted">("community");
  
  // Search & Filters
  const [productSearch, setProductSearch] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState<"all" | "active" | "hidden" | "verified">("all");
  const [postSearch, setPostSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [reportFilter, setReportFilter] = useState<"all" | "open" | "resolved" | "dismissed">("all");

  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [busy, setBusy] = useState(false);

  // Quick Action Modal / Confirmation state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: string;
    targetId: string;
    extraData?: any;
  } | null>(null);

  const refresh = async () => {
    try {
      setBusy(true);
      const res = await api("/admin/overview");
      setData(res);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    let active = true;
    api("/admin/overview")
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(""), 4000);
  };

  async function act(path: string, body: unknown, method = "POST") {
    setBusy(true);
    try {
      await api("/admin/" + path, method, body);
      await refresh();
      setError("");
      showToast("Thao tác thành công và đã ghi vào nhật ký kiểm duyệt.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
      setConfirmModal(null);
    }
  }

  // Toggle user role between Admin & Student (dành cho thử nghiệm/demo)
  const handleToggleMyRole = async () => {
    try {
      setBusy(true);
      await api("/admin/toggle-my-role", "POST");
      if (onRoleChanged) onRoleChanged();
      window.location.reload();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  // =========================================================================
  // BẢO VỆ PHÂN QUYỀN (AUTHORIZATION CHECK)
  // =========================================================================
  const isAdmin = currentUser?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 text-center bg-white rounded-3xl border border-red-200 shadow-2xl">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-red-200 shadow-inner">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-black tracking-wider uppercase rounded-full">
          Truy cập bị từ chối · 403 Forbidden
        </span>
        <h2 className="text-2xl font-black text-gray-900 mt-3 mb-2">
          Khu Vực Quản Trị Hệ Thống
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          Tài khoản hiện tại của bạn không có đặc quyền <b>Quản trị viên (Admin)</b>.
          Chức năng kiểm duyệt bài viết, duyệt sản phẩm và phân quyền người dùng chỉ dành cho tài khoản cán bộ quản trị UniSwap.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Chế độ kiểm thử Demo (Phân quyền nhanh):</span>
          </div>
          <p className="text-xs text-amber-900/80 mb-3">
            Bạn có thể chuyển tài khoản hiện tại thành <b>Quản trị viên</b> ngay lập tức để trải nghiệm trọn vẹn bộ công cụ quản lý.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={handleToggleMyRole}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Kích hoạt quyền Admin cho tài khoản này</span>
          </button>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800 hover:underline cursor-pointer"
          >
            Quay lại trang chủ
          </button>
        )}
      </div>
    );
  }

  // =========================================================================
  // DỮ LIỆU THỐNG KÊ DASHBOARD (TÍNH TOÁN REALTIME)
  // =========================================================================
  const productsList = data?.products || [];
  const topicsList = data?.topics || [];
  const buyRequestsList = data?.buyRequests || [];
  const reportsList = data?.reports || [];
  const usersList = data?.users || [];
  const auditList = data?.audit || [];

  const totalProducts = productsList.length;
  const hiddenProductsCount = productsList.filter((p: any) => p.moderation === "hidden").length;
  const verifiedCampusCount = productsList.filter((p: any) => p.isVerified).length;
  const totalPostsCount = topicsList.length + buyRequestsList.length;
  const openReportsCount = reportsList.filter((r: any) => r.status === "open").length;
  const verifiedUsersCount = usersList.filter((u: any) => u.verified).length;

  // Lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return productsList.filter((p: any) => {
      const matchSearch =
        !productSearch ||
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.seller?.name?.toLowerCase().includes(productSearch.toLowerCase());
      
      if (!matchSearch) return false;

      if (productStatusFilter === "active") return p.moderation !== "hidden";
      if (productStatusFilter === "hidden") return p.moderation === "hidden";
      if (productStatusFilter === "verified") return !!p.isVerified;
      return true;
    });
  }, [productsList, productSearch, productStatusFilter]);

  // Lọc bài viết
  const filteredTopics = useMemo(() => {
    return topicsList.filter((t: any) => {
      return (
        !postSearch ||
        t.title?.toLowerCase().includes(postSearch.toLowerCase()) ||
        t.author_name?.toLowerCase().includes(postSearch.toLowerCase()) ||
        t.text?.toLowerCase().includes(postSearch.toLowerCase())
      );
    });
  }, [topicsList, postSearch]);

  const filteredBuyRequests = useMemo(() => {
    return buyRequestsList.filter((b: any) => {
      const title = b.data?.title || b.data?.item || "";
      const author = b.author_name || "";
      return (
        !postSearch ||
        title.toLowerCase().includes(postSearch.toLowerCase()) ||
        author.toLowerCase().includes(postSearch.toLowerCase())
      );
    });
  }, [buyRequestsList, postSearch]);

  // Lọc báo cáo
  const filteredReports = useMemo(() => {
    return reportsList.filter((r: any) => {
      if (reportFilter === "all") return true;
      return r.status === reportFilter;
    });
  }, [reportsList, reportFilter]);

  // Lọc người dùng
  const filteredUsers = useMemo(() => {
    return usersList.filter((u: any) => {
      return (
        !userSearch ||
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.school?.toLowerCase().includes(userSearch.toLowerCase())
      );
    });
  }, [usersList, userSearch]);

  return (
    <div className="bg-[#f8faf9] text-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-emerald-900/10 min-h-[750px] flex flex-col font-sans">
      {/* 1. TOP ADMIN BAR */}
      <div className="bg-[#043322] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-emerald-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-[#06462e] shadow-lg shadow-amber-500/20">
            <Shield className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base tracking-wide text-white flex items-center gap-2">
                BẢNG QUẢN TRỊ UNISWAP
              </h1>
              <span className="bg-amber-400 text-[#06462e] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin Center
              </span>
            </div>
            <p className="text-xs text-emerald-200/80">
              Kiểm duyệt bài đăng · Quản lý sản phẩm & nội dung · Phân quyền thành viên
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refresh}
            disabled={busy}
            title="Tải lại dữ liệu"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${busy ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            onClick={handleToggleMyRole}
            disabled={busy}
            title="Chuyển sang vai trò Sinh viên thường để kiểm tra phân quyền"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-xs font-semibold text-emerald-100 border border-emerald-600/40 transition cursor-pointer"
          >
            <span>Đổi sang Student Role</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center transition cursor-pointer ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. NOTIFICATIONS / ALERTS */}
      {successNotice && (
        <div className="bg-emerald-500 text-white text-xs font-bold px-6 py-2.5 flex items-center justify-between animate-fadeIn shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-100" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice("")} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {error && (
        <div className="bg-red-500 text-white text-xs font-bold px-6 py-2.5 flex items-center justify-between animate-fadeIn shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-100" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* 3. MAIN NAVIGATION TABS */}
      <div className="bg-white border-b border-gray-200 px-6 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-xs">
        {[
          { key: "dashboard", label: "Dashboard (Tổng quan)", icon: LayoutDashboard },
          { key: "products", label: "Quản lý sản phẩm", icon: Package, badge: totalProducts },
          { key: "posts", label: "Quản lý bài viết", icon: FileText, badge: totalPostsCount },
          { key: "reports", label: "Báo cáo vi phạm", icon: AlertTriangle, badge: openReportsCount, badgeColor: "bg-red-500 text-white" },
          { key: "users", label: "Quản lý tài khoản", icon: Users, badge: usersList.length },
          { key: "audit", label: "Nhật ký kiểm duyệt", icon: History },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key as any)}
              className={`flex items-center gap-2 px-4 py-3.5 text-xs font-extrabold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "border-[#06462e] text-[#06462e] bg-emerald-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#06462e]" : "text-gray-400"}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    item.badgeColor || (isActive ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700")
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENTS */}
      <div className="p-6 flex-1 overflow-y-auto">
        {!data && !error ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-3" />
            <p className="text-xs font-bold text-gray-500">Đang tải dữ liệu trung tâm quản trị...</p>
          </div>
        ) : (
          <>
            {/* =========================================================================
                TAB 1: 📊 DASHBOARD (TỔNG QUAN)
               ========================================================================= */}
            {tab === "dashboard" && (
              <div className="space-y-6">
                {/* KPI Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Sản phẩm */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500">Tổng sản phẩm</span>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Package className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{totalProducts}</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="text-emerald-700 font-bold">{verifiedCampusCount} đã xác thực</span>
                      <span>·</span>
                      <span className="text-red-700 font-bold">{hiddenProductsCount} bị ẩn</span>
                    </div>
                  </div>

                  {/* Card 2: Bài viết & Nhu cầu */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500">Bài viết & Nhu cầu</span>
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{totalPostsCount}</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="text-amber-700 font-bold">{topicsList.length} bài cộng đồng</span>
                      <span>·</span>
                      <span className="text-blue-700 font-bold">{buyRequestsList.length} tin cần mua</span>
                    </div>
                  </div>

                  {/* Card 3: Báo cáo vi phạm */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500">Báo cáo vi phạm</span>
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-red-600 mb-1">{openReportsCount}</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="text-red-600 font-bold">Cần xử lý gấp</span>
                      <span>·</span>
                      <span>Tổng {reportsList.length} đơn</span>
                    </div>
                  </div>

                  {/* Card 4: Thành viên sinh viên */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500">Tài khoản sinh viên</span>
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-gray-900 mb-1">{usersList.length}</div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="text-emerald-700 font-bold">{verifiedUsersCount} đã xác minh</span>
                      <span>·</span>
                      <span className="text-gray-400">ĐH Quốc Gia & TP.HCM</span>
                    </div>
                  </div>
                </div>

                {/* Phân bố danh mục & Tác vụ cần xử lý ngay */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Báo cáo khẩn cấp */}
                  <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-sm text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>Hàng đợi kiểm duyệt báo cáo gần đây</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setTab("reports")}
                        className="text-xs font-bold text-emerald-800 hover:underline"
                      >
                        Xem tất cả ({reportsList.length}) →
                      </button>
                    </div>

                    {reportsList.slice(0, 4).length === 0 ? (
                      <p className="text-xs text-gray-400 py-6 text-center">
                        Tuyệt vời! Hiện không có đơn báo cáo vi phạm nào chưa xử lý.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {reportsList.slice(0, 4).map((r: any) => (
                          <div
                            key={r.id}
                            className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/70 flex flex-wrap items-center justify-between gap-3 text-xs"
                          >
                            <div className="max-w-[70%]">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    r.status === "open"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-200 text-gray-700"
                                  }`}
                                >
                                  {r.status === "open" ? "Đang chờ" : r.status}
                                </span>
                                <span className="font-bold text-gray-800">{r.name}</span>
                                <span className="text-gray-400 text-[11px]">báo cáo mã: {r.product_id}</span>
                              </div>
                              <p className="text-gray-600 line-clamp-1 italic">"{r.reason}"</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  act("moderate", {
                                    productId: r.product_id,
                                    hide: true,
                                    note: "Ẩn từ hàng đợi báo cáo: " + r.reason,
                                  })
                                }
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
                              >
                                Ẩn bài vi phạm
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  act(
                                    "reports",
                                    { id: r.id, status: "resolved", resolution: "Đã xử lý từ Dashboard" },
                                    "PATCH"
                                  )
                                }
                                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-xs cursor-pointer"
                              >
                                Đã giải quyết
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hoạt động gần đây */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-black text-sm text-gray-900 mb-4 flex items-center gap-2">
                      <History className="w-4 h-4 text-emerald-600" />
                      <span>Nhật ký xử lý mới nhất</span>
                    </h3>
                    <div className="space-y-3">
                      {auditList.slice(0, 5).map((a: any) => (
                        <div key={a.id} className="text-xs border-l-2 border-emerald-500 pl-3 py-0.5">
                          <p className="font-black text-gray-800">{a.action}</p>
                          <p className="text-gray-500 line-clamp-1">{a.target} · {a.note || "Hệ thống"}</p>
                          <small className="text-gray-400 text-[10px]">{a.created}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 2: 📦 QUẢN LÝ SẢN PHẨM (PRODUCTS MANAGEMENT)
               ========================================================================= */}
            {tab === "products" && (
              <div className="space-y-4">
                {/* Thanh công cụ: Tìm kiếm & Lọc */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên sản phẩm, mã bài, người bán..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="bg-transparent text-xs w-full focus:outline-none"
                    />
                    {productSearch && (
                      <button onClick={() => setProductSearch("")} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {[
                      { key: "all", label: "Tất cả" },
                      { key: "active", label: "Đang hiển thị" },
                      { key: "hidden", label: "Đang bị ẩn" },
                      { key: "verified", label: "Campus Check" },
                    ].map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setProductStatusFilter(f.key as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          productStatusFilter === f.key
                            ? "bg-[#06462e] text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bảng danh sách sản phẩm */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50/80 text-gray-500 font-black border-b border-gray-200 uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Sản phẩm</th>
                          <th className="py-3 px-4">Giá / Giao dịch</th>
                          <th className="py-3 px-4">Người bán</th>
                          <th className="py-3 px-4">Trường</th>
                          <th className="py-3 px-4">Trạng thái</th>
                          <th className="py-3 px-4 text-right">Thao tác kiểm duyệt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((p: any) => {
                          const isHidden = p.moderation === "hidden";
                          const isVerified = !!p.isVerified;
                          const thumb = p.images?.[0] || "/assets/placeholder.png";

                          return (
                            <tr key={p.id} className="hover:bg-gray-50/60 transition">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={thumb}
                                    alt=""
                                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-extrabold text-gray-900 truncate max-w-[260px] text-xs">
                                      {p.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                                      <span>Mã: {p.id}</span>
                                      <span>·</span>
                                      <span>{p.category}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                <p className="font-black text-emerald-800">
                                  {p.price === 0 ? "Tặng 0đ" : p.price?.toLocaleString("vi-VN") + "đ"}
                                </p>
                                <span className="text-[10px] text-gray-400 uppercase font-semibold">
                                  {p.tradeType}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <p className="font-bold text-gray-800">{p.seller?.name || "Ẩn danh"}</p>
                                <p className="text-[10px] text-gray-400">{p.seller?.studentId || "SV"}</p>
                              </td>

                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold text-[11px]">
                                  {p.cluster || "Làng ĐH"}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <div className="flex flex-col gap-1 items-start">
                                  {isHidden ? (
                                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-black text-[10px]">
                                      Đang bị ẩn
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                                      Hiển thị
                                    </span>
                                  )}

                                  {isVerified && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                      <BadgeCheck className="w-3 h-3" /> Campus Check
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Toggle Campus Check */}
                                  <button
                                    type="button"
                                    disabled={busy}
                                    title={isVerified ? "Gỡ xác minh Campus Check" : "Gắn huy hiệu Campus Check"}
                                    onClick={() =>
                                      act("verify-product", {
                                        productId: p.id,
                                        verified: !isVerified,
                                      })
                                    }
                                    className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                                      isVerified
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                                    }`}
                                  >
                                    <BadgeCheck className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Toggle Hide / Restore */}
                                  <button
                                    type="button"
                                    disabled={busy}
                                    title={isHidden ? "Khôi phục bài đăng" : "Ẩn bài do vi phạm"}
                                    onClick={() =>
                                      act("moderate", {
                                        productId: p.id,
                                        hide: !isHidden,
                                        note: isHidden ? "Admin khôi phục" : "Admin ẩn kiểm duyệt",
                                      })
                                    }
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                      isHidden
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    }`}
                                  >
                                    {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                    <span>{isHidden ? "Mở" : "Ẩn"}</span>
                                  </button>

                                  {/* Delete permanently */}
                                  <button
                                    type="button"
                                    disabled={busy}
                                    title="Xóa vĩnh viễn"
                                    onClick={() => {
                                      if (confirm(`Bạn có chắc muốn xóa vĩnh viễn sản phẩm "${p.title}" không?`)) {
                                        act("delete-product", { productId: p.id });
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 3: 📝 QUẢN LÝ BÀI VIẾT (POSTS MANAGEMENT - COMMUNITY & WANTED)
               ========================================================================= */}
            {tab === "posts" && (
              <div className="space-y-4">
                {/* Sub tabs: Thảo luận cộng đồng / Tin cần mua */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPostSubTab("community")}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                        postSubTab === "community"
                          ? "bg-[#06462e] text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Bài viết Thảo luận Cộng đồng ({topicsList.length})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostSubTab("wanted")}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
                        postSubTab === "wanted"
                          ? "bg-[#06462e] text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Tin đăng Cần Mua / Cần Tìm ({buyRequestsList.length})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 min-w-[240px]">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm bài viết, người đăng..."
                      value={postSearch}
                      onChange={(e) => setPostSearch(e.target.value)}
                      className="bg-transparent text-xs w-full focus:outline-none"
                    />
                  </div>
                </div>

                {/* Danh sách bài viết Cộng đồng */}
                {postSubTab === "community" && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 font-black border-b border-gray-200 text-[10px] uppercase">
                          <th className="py-3 px-4">Tiêu đề bài viết / Nhóm</th>
                          <th className="py-3 px-4">Tác giả</th>
                          <th className="py-3 px-4">Thể loại</th>
                          <th className="py-3 px-4">Trạng thái</th>
                          <th className="py-3 px-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredTopics.map((t: any) => {
                          const isClosed = t.enrollment === "closed";
                          return (
                            <tr key={t.id} className="hover:bg-gray-50/60">
                              <td className="py-3 px-4">
                                <p className="font-bold text-gray-900 text-xs">{t.title}</p>
                                <p className="text-gray-500 text-[11px] line-clamp-1 mt-0.5">{t.text}</p>
                                <small className="text-gray-400 text-[10px]">Đăng ngày: {t.created}</small>
                              </td>
                              <td className="py-3 px-4 font-semibold text-gray-700">
                                {t.author_name || t.user_id}
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                                  {t.kind || "Thảo luận"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    isClosed ? "bg-gray-200 text-gray-600" : "bg-emerald-100 text-emerald-800"
                                  }`}
                                >
                                  {isClosed ? "Đã đóng" : "Đang mở"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() =>
                                      act("topic", {
                                        topicId: t.id,
                                        action: isClosed ? "reopen" : "close",
                                      })
                                    }
                                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                                  >
                                    {isClosed ? "Mở lại" : "Đóng"}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => {
                                      if (confirm(`Bạn có chắc muốn xóa bài "${t.title}" không?`)) {
                                        act("topic", { topicId: t.id, action: "delete" });
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Danh sách Tin cần mua / Cần tìm */}
                {postSubTab === "wanted" && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 font-black border-b border-gray-200 text-[10px] uppercase">
                          <th className="py-3 px-4">Nhu cầu cần mua</th>
                          <th className="py-3 px-4">Ngân sách</th>
                          <th className="py-3 px-4">Người tìm</th>
                          <th className="py-3 px-4">Hạn chót</th>
                          <th className="py-3 px-4">Trạng thái</th>
                          <th className="py-3 px-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredBuyRequests.map((b: any) => {
                          const title = b.data?.title || b.data?.item || "Nhu cầu sinh viên";
                          const budget = b.data?.budget ? Number(b.data.budget).toLocaleString("vi-VN") + "đ" : "Thỏa thuận";
                          const isClosed = b.status === "closed";

                          return (
                            <tr key={b.id} className="hover:bg-gray-50/60">
                              <td className="py-3 px-4">
                                <p className="font-bold text-gray-900 text-xs">{title}</p>
                                <p className="text-gray-500 text-[11px] line-clamp-1">{b.data?.note || b.data?.details}</p>
                              </td>
                              <td className="py-3 px-4 font-black text-amber-700">{budget}</td>
                              <td className="py-3 px-4 font-semibold text-gray-700">{b.author_name}</td>
                              <td className="py-3 px-4 text-gray-500">{b.data?.neededBy || "Không gấp"}</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    isClosed ? "bg-gray-200 text-gray-600" : "bg-emerald-100 text-emerald-800"
                                  }`}
                                >
                                  {isClosed ? "Đã đóng" : "Đang tìm"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() =>
                                      act("buy-request", {
                                        requestId: b.id,
                                        action: isClosed ? "reopen" : "close",
                                      })
                                    }
                                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs"
                                  >
                                    {isClosed ? "Mở lại" : "Đóng"}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => {
                                      if (confirm(`Bạn có chắc muốn xóa tin cần mua này không?`)) {
                                        act("buy-request", { requestId: b.id, action: "delete" });
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                TAB 4: 🚨 BÁO CÁO VI PHẠM (REPORTS)
               ========================================================================= */}
            {tab === "reports" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-bold text-gray-500 mr-2">Lọc trạng thái:</span>
                  {[
                    { key: "all", label: "Tất cả báo cáo" },
                    { key: "open", label: "Đang chờ xử lý" },
                    { key: "resolved", label: "Đã giải quyết" },
                    { key: "dismissed", label: "Không có vi phạm" },
                  ].map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setReportFilter(f.key as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        reportFilter === f.key
                          ? "bg-red-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {filteredReports.map((r: any) => (
                    <div
                      key={r.id}
                      className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              r.status === "open"
                                ? "bg-red-100 text-red-700"
                                : r.status === "resolved"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {r.status}
                          </span>
                          <span className="font-extrabold text-gray-900 text-sm">{r.name}</span>
                          <span className="text-gray-400 text-xs">Mã bài vi phạm: <b className="text-gray-700">{r.product_id}</b></span>
                        </div>
                        <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-200/60">
                          <b>Lý do tố cáo:</b> {r.reason}
                        </p>
                        {r.resolution && (
                          <p className="text-xs text-emerald-700 font-semibold">
                            <b>Kết quả xử lý:</b> {r.resolution}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            act("moderate", {
                              productId: r.product_id,
                              hide: true,
                              note: "Ẩn bài theo báo cáo: " + r.reason,
                            })
                          }
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
                        >
                          Ẩn bài đăng này
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            act(
                              "reports",
                              { id: r.id, status: "resolved", resolution: note || "Đã kiểm tra và xử lý thỏa đáng" },
                              "PATCH"
                            )
                          }
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
                        >
                          Đã giải quyết
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            act(
                              "reports",
                              { id: r.id, status: "dismissed", resolution: note || "Không phát hiện vi phạm quy định" },
                              "PATCH"
                            )
                          }
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                        >
                          Bác đơn
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 5: 👥 QUẢN LÝ NGƯỜI DÙNG (USERS MANAGEMENT)
               ========================================================================= */}
            {tab === "users" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 max-w-md bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Tìm sinh viên theo tên, email, trường..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="bg-transparent text-xs w-full focus:outline-none"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-500">{filteredUsers.length} thành viên</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-black border-b border-gray-200 text-[10px] uppercase">
                        <th className="py-3 px-4">Sinh viên</th>
                        <th className="py-3 px-4">Email trường</th>
                        <th className="py-3 px-4">Trường ĐH</th>
                        <th className="py-3 px-4">Xác minh</th>
                        <th className="py-3 px-4">Trạng thái</th>
                        <th className="py-3 px-4 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((u: any) => {
                        const isSuspended = !!u.suspended;
                        const isVer = !!u.verified;
                        return (
                          <tr key={u.id} className="hover:bg-gray-50/60">
                            <td className="py-3 px-4 font-extrabold text-gray-900">{u.name}</td>
                            <td className="py-3 px-4 text-gray-600">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-bold text-[10px]">
                                {u.school}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {isVer ? (
                                <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                                  <BadgeCheck className="w-3.5 h-3.5" /> Đã xác minh
                                </span>
                              ) : (
                                <span className="text-gray-400 font-semibold text-[11px]">Chưa</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isSuspended ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {isSuspended ? "Đang bị khóa" : "Hoạt động"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() =>
                                    act("verify-user", {
                                      userId: u.id,
                                      verified: !isVer,
                                    })
                                  }
                                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg text-xs border border-emerald-200"
                                >
                                  {isVer ? "Hủy XM" : "Duyệt XM"}
                                </button>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() =>
                                    act("suspend", {
                                      userId: u.id,
                                      suspended: !isSuspended,
                                      note: isSuspended ? "Admin mở khóa" : "Admin khóa vi phạm",
                                    })
                                  }
                                  className={`px-2.5 py-1 font-bold rounded-lg text-xs cursor-pointer ${
                                    isSuspended
                                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                      : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                  }`}
                                >
                                  {isSuspended ? "Mở khóa" : "Khóa tài khoản"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 6: 📜 NHẬT KÝ KIỂM DUYỆT (AUDIT LOG)
               ========================================================================= */}
            {tab === "audit" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-black border-b border-gray-200 text-[10px] uppercase">
                      <th className="py-3 px-4">Hành động</th>
                      <th className="py-3 px-4">Đối tượng kiểm duyệt</th>
                      <th className="py-3 px-4">Ghi chú / Lý do</th>
                      <th className="py-3 px-4 text-right">Thời gian ghi nhận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {auditList.map((a: any) => (
                      <tr key={a.id} className="hover:bg-gray-50/60">
                        <td className="py-3 px-4 font-extrabold text-emerald-900">{a.action}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-gray-600">{a.target}</td>
                        <td className="py-3 px-4 text-gray-700">{a.note || "Mặc định từ Admin"}</td>
                        <td className="py-3 px-4 text-right text-gray-400 font-mono text-[10px]">{a.created}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
