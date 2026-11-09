import React, { useEffect, useState, useRef, type FormEvent } from "react";
import {
  Send,
  MapPin,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  CheckCheck,
  Check,
  MessageCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { ProductItem, User } from "../types";
import { api } from "../lib/api";

type Message = {
  id: string;
  text: string;
  sender: string;
  name: string;
  created: string;
  read?: boolean;
};

export interface ConversationProps {
  product: ProductItem;
  user: User;
  buyer?: string;
}

const QUICK_CHIPS = [
  "👋 Chào bạn, món này còn không ạ?",
  "📍 Bạn có tiện hẹn xem đồ ở sảnh trường không?",
  "💰 Giá này có fix nhẹ tiền xăng cho sinh viên không bạn?",
  "📦 Mình muốn hẹn xem và chốt món này luôn!",
];

export function Conversation({ product, user, buyer }: ConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sellerName = product.seller?.name || "Người bán sinh viên";
  const sellerId = product.seller?.id || "seller-demo";
  const isSeller = user.id === sellerId;

  const path =
    "/products/" +
    product.id +
    "/messages" +
    (buyer ? "?buyer=" + encodeURIComponent(buyer) : "");

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load tin nhắn ban đầu từ API hoặc tạo tin nhắn chào mừng mặc định
  useEffect(() => {
    let active = true;

    const fetchMessages = async () => {
      try {
        const data = await api(path);
        if (active && data?.messages?.length) {
          setMessages(data.messages);
          setError("");
          return;
        }
      } catch (err) {
        // Nếu API backend trả lỗi (ví dụ bài demo hoặc chưa có owner), dùng tin nhắn mô phỏng sinh động
      }

      if (active && messages.length === 0) {
        setMessages([
          {
            id: "msg-welcome-seller",
            sender: sellerId,
            name: sellerName,
            text: `Chào bạn! Mình đăng ${product.title} cần pass lại. Bạn có thể nhắn tin hoặc hẹn gặp trực tiếp tại cơ sở trường để xem đồ nha!`,
            created: new Date(Date.now() - 3600000).toISOString(),
            read: true,
          },
        ]);
      }
    };

    void fetchMessages();
    const timer = setInterval(fetchMessages, 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [path, product.id, sellerId, sellerName]);

  // Xử lý gửi tin nhắn
  const handleSend = async (msgText: string) => {
    const trimmed = msgText.trim();
    if (!trimmed) return;

    const newMsg: Message = {
      id: "msg-" + Date.now(),
      sender: user.id,
      name: user.name || "Bạn",
      text: trimmed,
      created: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    setText("");
    setBusy(true);

    try {
      // 1. Gửi lên backend API nếu kết nối được
      await api(path, "POST", { text: trimmed });
    } catch (err) {
      // Nếu là môi trường demo, tiếp tục xử lý local mượt mà
    } finally {
      setBusy(false);
    }

    // 2. TỰ ĐỘNG PHẢN HỒI MÔ PHỎNG TỪ NGƯỜI BÁN NẾU BẠN LÀ NGƯỜI MUA
    if (!isSeller) {
      setTimeout(() => {
        const replies = [
          `Chào bạn nhé! Món "${product.title}" mình vẫn còn nha. Bạn tiện hẹn gặp ở sảnh trường hoặc KTX mấy giờ nè?`,
          `Dạ có fix nhẹ tiền xăng cho sinh viên qua tận sảnh cơ sở ${product.seller?.universityCode || "DHV"} lấy nhé!`,
          `Oke bạn nha! Mình học ca sáng ở trường, tầm 11h30 trưa hoặc chiều 5h mình hẹn nhau xem đồ thoải mái trước khi thanh toán nha.`,
          `Mình giữ đồ cẩn thận lắm, máy/đồ hoạt động bình thường 100%. Bạn có thể add Zalo hoặc gọi mình để hẹn điểm gặp cụ thể nhé!`,
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        setMessages((prev) => [
          ...prev,
          {
            id: "reply-" + Date.now(),
            sender: sellerId,
            name: sellerName,
            text: randomReply,
            created: new Date().toISOString(),
            read: true,
          },
        ]);
      }, 1200);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void handleSend(text);
  };

  return (
    <div
      className="flex flex-col h-[520px] max-h-[80vh] bg-white rounded-2xl overflow-hidden"
      style={{ fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif" }}
    >
      {/* 1. Header tóm tắt món đồ & người bán đang chat */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-b border-emerald-100/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={product.images?.[0] || "/assets/prod-books.png"}
            alt={product.title}
            className="w-12 h-12 object-cover rounded-xl border border-emerald-200 shrink-0 bg-white shadow-2xs"
            onError={(e) => {
              e.currentTarget.src = "/assets/prod-books.png";
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900 truncate">
                {product.title}
              </span>
              <span className="text-xs font-black text-emerald-800 shrink-0">
                {product.price === 0 ? "Miễn phí 0đ" : `${product.price.toLocaleString("vi-VN")}đ`}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {sellerName} ({product.seller?.universityCode || "DHV"})
              </span>
              <span>·</span>
              <span className="truncate">
                {product.meetingSpot || "Sảnh cơ sở Campus"}
              </span>
            </div>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200 shadow-2xs shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Giao dịch an toàn
        </span>
      </div>

      {/* 2. Danh sách tin nhắn cuộc trò chuyện */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#fcfdfa]">
        <div className="text-center my-1">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10.5px] font-medium">
            🔒 Cuộc trò chuyện sinh viên nội bộ UniSwap · Hẹn gặp tại nơi công cộng
          </span>
        </div>

        {messages.map((m) => {
          const isMine = m.sender === user.id;
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
            >
              {!isMine && (
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {m.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-2xs text-xs sm:text-[13px] leading-relaxed ${
                  isMine
                    ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-br-xs"
                    : "bg-white text-gray-900 border border-gray-200/80 rounded-bl-xs"
                }`}
              >
                {!isMine && (
                  <div className="text-[10px] font-bold text-emerald-800 mb-0.5">
                    {m.name}
                  </div>
                )}
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 text-[9.5px] mt-1 ${
                    isMine ? "text-emerald-100" : "text-gray-400"
                  }`}
                >
                  <span>
                    {new Date(m.created).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMine && (
                    <span>
                      {m.read ? (
                        <CheckCheck className="w-3 h-3 text-emerald-200" />
                      ) : (
                        <Check className="w-3 h-3 text-emerald-300" />
                      )}
                    </span>
                  )}
                </div>
              </div>

              {isMine && (
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-300">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Tin nhắn mẫu gợi ý bấm gửi nhanh */}
      <div className="px-3.5 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-bold text-gray-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Gợi ý:
        </span>
        {QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-gray-600 rounded-lg border border-gray-200 text-[11px] font-medium transition-colors shrink-0 cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 4. Khung gõ tin nhắn & nút Gửi */}
      <form
        onSubmit={onSubmit}
        className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập tin nhắn trao đổi với người bán..."
          maxLength={2000}
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
        />

        <button
          type="submit"
          disabled={busy || !text.trim()}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <span>Gửi</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}

export default Conversation;
