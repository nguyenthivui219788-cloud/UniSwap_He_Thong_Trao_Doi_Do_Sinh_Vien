import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  School,
  ArrowRight,
  MessageSquare,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import type { ProductItem, User } from "../types";
import { UNIVERSITIES } from "../data/mockData";

const CLUSTER_NAMES: Record<string, string> = {
  all: "Toàn thành phố",
  "lang-dh": "Làng Đại Học TP.HCM",
  q5: "Cụm Q.5",
  q10: "Cụm Q.10",
  "nam-sai-gon": "Nam Sài Gòn",
  "binh-thanh": "Bình Thạnh",
};

export interface PaymentRegistrationModalProps {
  product?: ProductItem | null;
  user: User | null;
  onClose: () => void;
  onSuccess?: (details: { phone: string; sellerName: string; address: string }) => void;
  onViewDetail?: (product: ProductItem) => void;
}

export const PaymentRegistrationModal: React.FC<PaymentRegistrationModalProps> = ({
  product,
  user,
  onClose,
  onSuccess,
  onViewDetail,
}) => {
  // Form fields
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState((user as any)?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [university, setUniversity] = useState(
    user?.universityName || user?.universityCode || "Đại học Hùng Vương TP.HCM (DHV)"
  );
  const [note, setNote] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Email sinh viên.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      // 1. Ghi nhận thông tin đăng ký lên hệ thống
      try {
        await fetch("/api/seller-registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product?.id || null,
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            university: university.trim(),
            note: note.trim(),
          }),
        });
      } catch (err) {
        console.warn("Backend registration notice:", err);
      }

      // Giả lập xử lý nhanh 200ms
      await new Promise((r) => setTimeout(r, 200));

      const sellerPhone = (product?.seller as any)?.phone || "0908 345 678";
      const sellerName = product?.seller?.name || "Nguyễn Thành Luân (DHV)";
      const sellerSpot = product?.meetingSpot || "Sảnh cơ sở ĐH Hùng Vương TP.HCM (736 Nguyễn Trãi, Q.5)";

      // 2. Kích hoạt callback thành công
      if (onSuccess) {
        onSuccess({
          phone: sellerPhone,
          sellerName: sellerName,
          address: sellerSpot,
        });
      }

      // 3. Mở ngay giao diện chi tiết sản phẩm có Bản đồ Interactive Map
      if (product && onViewDetail) {
        onViewDetail(product);
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || "Có lỗi xảy ra khi xử lý đăng ký. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[620px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col my-auto"
        style={{ fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header hiện đại tông Xanh Ngọc Campus cao cấp */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#059669] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-inner shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black leading-tight tracking-tight text-white">
                  Đăng Ký Nhận Thông Tin Người Bán
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/30 text-emerald-100 border border-emerald-300/40">
                  Miễn phí 100%
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium mt-0.5 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                Kết nối sinh viên trực tiếp · Mở khóa Bản đồ & Tọa độ Campus
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            aria-label="Đóng modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Bố cục rộng rãi, chữ to rõ ràng, không bị chèn ép */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Card Preview Món Đồ: Rõ nét hình ảnh, Giá tiền, Campus và TÌNH TRẠNG MÓN ĐỒ */}
          {product && (
            <div className="p-3 bg-gradient-to-r from-emerald-50/90 to-teal-50/60 rounded-xl border border-emerald-100 flex items-center gap-3.5">
              <img
                src={product.images?.[0] || "/assets/prod-books.png"}
                alt={product.title}
                className="w-14 h-14 object-cover rounded-lg shrink-0 border border-emerald-200 bg-white shadow-2xs"
                onError={(e) => {
                  e.currentTarget.src = "/assets/prod-books.png";
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-700 text-white text-[11px] font-black rounded tracking-wide">
                    {product.tradeType === "giveaway"
                      ? "Miễn phí 0đ"
                      : `${product.price.toLocaleString("vi-VN")}đ`}
                  </span>
                  
                  {/* Hiển thị Tình trạng món đồ */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold rounded">
                    <Sparkles className="w-3 h-3 text-amber-700 shrink-0" />
                    <span>Tình trạng: <b>{product.condition || "98% như mới"}</b></span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 truncate">
                  {product.title}
                </h3>

                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-600 truncate">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-gray-800">
                    {product.seller?.universityCode || "DHV"}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="truncate">{CLUSTER_NAMES[product.cluster] || product.cluster}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Điền Thông Tin (Rộng Rãi, Gọn Gàng, Icon Không Đè Lên Chữ) */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
              <span className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                Thông tin người nhận đồ
              </span>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Miễn phí · Không thu phí
              </span>
            </div>

            {/* Hàng 1: Họ tên & Số điện thoại / Zalo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-1 whitespace-nowrap">
                  <span>Họ và tên của bạn</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <UserIcon className="w-4 h-4 text-emerald-600/80 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: "42px" }}
                    className="w-full pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-gray-50/40 focus:bg-white text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-1 whitespace-nowrap">
                  <span>Số điện thoại / Zalo</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-emerald-600/80 absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ paddingLeft: "42px" }}
                    className="w-full pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-gray-50/40 focus:bg-white text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Hàng 2: Email sinh viên & Trường ĐH */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-1 whitespace-nowrap">
                  <span>Email sinh viên</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-emerald-600/80 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="mssv@dhv.edu.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: "42px" }}
                    className="w-full pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-gray-50/40 focus:bg-white text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-1 whitespace-nowrap">
                  <span>Trường ĐH / Cơ sở</span>
                </label>
                <div className="relative flex items-center">
                  <School className="w-4 h-4 text-emerald-600/80 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    list="uni-suggestions-modal-v2"
                    placeholder="Đại học Hùng Vương TP.HCM (DHV)"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    style={{ paddingLeft: "42px" }}
                    className="w-full pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-gray-50/40 focus:bg-white text-gray-900"
                  />
                  <datalist id="uni-suggestions-modal-v2">
                    {UNIVERSITIES.map((u) => (
                      <option key={u.code} value={u.name} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Hàng 3: Lời nhắn gửi người bán */}
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-gray-700 mb-1 whitespace-nowrap">
                <span>Lời nhắn hẹn nhận đồ (Tùy chọn)</span>
              </label>
              <div className="relative flex items-center">
                <MessageSquare className="w-4 h-4 text-emerald-600/80 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ví dụ: Mình muốn hẹn xem món tại sảnh cơ sở 736 Nguyễn Trãi..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ paddingLeft: "42px" }}
                  className="w-full pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-gray-50/40 focus:bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Cam kết bảo mật sinh viên */}
            <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                Thông tin sinh viên được bảo mật an toàn và chỉ dùng để hiển thị điểm hẹn giao dịch tại Campus.
              </span>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Nút Submit Mở thẳng Bản Đồ & Chi Tiết Người Bán */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white font-black text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60"
              >
                <MapPin className="w-4 h-4 text-emerald-200" />
                <span>
                  {busy ? "Đang xử lý mở khóa..." : "Xác nhận & Xem Bản Đồ Điểm Hẹn Chi Tiết"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-gray-500 mt-1.5">
                ⚡ Sau khi bấm xác nhận, hệ thống sẽ mở ngay trang chi tiết có Bản đồ Google Maps & Tọa độ Campus
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentRegistrationModal;
