import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  ArrowLeft,
  MoreHorizontal,
  User as UserIcon,
  X,
  Star,
  CheckCircle2,
  Package,
  Clock,
  Calendar,
  Send,
  Image as ImageIcon,
  Smile,
  Check,
  CheckCheck,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Building,
  BookOpen,
  FileText,
  Camera,
  Heart,
  Bell,
  Sun,
  Sparkles,
  MapPin,
  MessageCircle,
  ExternalLink,
  ShoppingBag,
  Plus,
} from "lucide-react";
import type { ProductItem, User } from "../types";

export interface ChatWorkspaceProps {
  initialProduct?: ProductItem | null;
  currentUser?: User | null;
  initialViewMode?: "chat" | "profile";
  initialSellerId?: string;
  onBack: () => void;
  onNavigateExplore?: () => void;
  onLoginClick?: () => void;
  onOpenCreate?: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "seller";
  text: string;
  time: string;
  read?: boolean;
}

interface ChatThread {
  id: string;
  sellerName: string;
  sellerRole?: string;
  verified: boolean;
  school: string;
  avatar: string;
  product: {
    id: string;
    title: string;
    price: number;
    priceFormatted: string;
    image: string;
    status: string;
  };
  rating: number;
  reviewCount: number;
  soldCount: number;
  responseRate: string;
  avgResponseTime: string;
  joinDate: string;
  bio: string;
  tags: string[];
  studentInfo: {
    university: string;
    major: string;
    cohort: string;
    program: string;
  };
  ratingBreakdown: {
    score: number;
    total: number;
    bars: { star: number; percent: number }[];
  };
  unreadCount?: number;
  lastMessageTime: string;
  messages: ChatMessage[];
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: "thread-an",
    sellerName: "Nguyễn Văn An",
    sellerRole: "Người bán",
    verified: true,
    school: "Đại học Bách Khoa TP.HCM",
    avatar: "/assets/detail/seller-an.png",
    product: {
      id: "prod-mac-m1",
      title: "Macbook Air M1 2020 (8GB/256GB)",
      price: 7500000,
      priceFormatted: "7.500.000đ",
      image: "/assets/detail/detail-macbook-main.png",
      status: "Đang giao dịch",
    },
    rating: 4.8,
    reviewCount: 24,
    soldCount: 56,
    responseRate: "98%",
    avgResponseTime: "2 giờ",
    joinDate: "09/2025",
    bio: "Sinh viên năm 3, chuyên bán đồ điện tử, sách và đồ dùng học tập. Giao dịch nhanh chóng, uy tín.",
    tags: ["Laptop", "Sách", "Điện thoại", "Đồ học tập"],
    studentInfo: {
      university: "Đại học Bách Khoa TP.HCM",
      major: "Công nghệ thông tin",
      cohort: "K2022",
      program: "Đại học chính quy",
    },
    ratingBreakdown: {
      score: 4.8,
      total: 24,
      bars: [
        { star: 5, percent: 85 },
        { star: 4, percent: 10 },
        { star: 3, percent: 4 },
        { star: 2, percent: 1 },
        { star: 1, percent: 0 },
      ],
    },
    unreadCount: 2,
    lastMessageTime: "14:32",
    messages: [
      {
        id: "m-1",
        sender: "user",
        text: "Chào bạn, mình muốn hỏi thêm về tình trạng máy ạ",
        time: "14:20",
        read: true,
      },
      {
        id: "m-2",
        sender: "seller",
        text: "Chào bạn! Bạn quan tâm đến máy nào ạ?",
        time: "14:21",
        read: true,
      },
      {
        id: "m-3",
        sender: "seller",
        text: "Máy mình dùng rất cẩn thận, pin còn ổn, hiện tại chưa từng sửa chữa. Có thể test thoải mái ạ.",
        time: "14:23",
        read: true,
      },
      {
        id: "m-4",
        sender: "user",
        text: "Dạ vâng, mình ở khu vực Đại học Bách Khoa, shop có thể giao tận nơi được không ạ?",
        time: "14:30",
        read: true,
      },
      {
        id: "m-5",
        sender: "seller",
        text: "Được bạn nhé! Mình có thể giao trong ngày hôm nay nếu bạn sắp xếp được.",
        time: "14:32",
        read: true,
      },
      {
        id: "m-6",
        sender: "user",
        text: "Ok bạn, mình đặt cọc trước ạ",
        time: "14:33",
        read: true,
      },
    ],
  },
  {
    id: "thread-quan",
    sellerName: "Trần Minh Quân",
    verified: true,
    school: "Đại học Hùng Vương TP.HCM (DHV)",
    avatar: "/assets/detail/seller-quan.png",
    product: {
      id: "prod-shoes",
      title: "Giày thể thao Adidas Campus 00s",
      price: 650000,
      priceFormatted: "650.000đ",
      image: "/assets/prod-books.png",
      status: "Còn hàng",
    },
    rating: 4.9,
    reviewCount: 18,
    soldCount: 32,
    responseRate: "95%",
    avgResponseTime: "1 giờ",
    joinDate: "11/2025",
    bio: "Sinh viên năm 2 DHV, thích sưu tầm giày sneaker chính hãng và đồ thể thao.",
    tags: ["Giày dép", "Thời trang", "Sneaker"],
    studentInfo: {
      university: "Đại học Hùng Vương TP.HCM",
      major: "Quản trị kinh doanh",
      cohort: "K2023",
      program: "Đại học chính quy",
    },
    ratingBreakdown: {
      score: 4.9,
      total: 18,
      bars: [
        { star: 5, percent: 90 },
        { star: 4, percent: 10 },
        { star: 3, percent: 0 },
        { star: 2, percent: 0 },
        { star: 1, percent: 0 },
      ],
    },
    unreadCount: 1,
    lastMessageTime: "12:15",
    messages: [
      {
        id: "mq-1",
        sender: "seller",
        text: "Quân: Ok bạn, mình giữ size cho bạn nhé!",
        time: "12:15",
        read: false,
      },
    ],
  },
  {
    id: "thread-thao",
    sellerName: "Lê Phương Thảo",
    verified: true,
    school: "Đại học Kinh tế TP.HCM (UEH)",
    avatar: "/assets/detail/seller-thao.png",
    product: {
      id: "prod-book-macro",
      title: "Sách giáo trình Kinh tế vĩ mô UEH",
      price: 75000,
      priceFormatted: "75.000đ",
      image: "/assets/detail/detail-book-main.png",
      status: "Còn hàng",
    },
    rating: 5.0,
    reviewCount: 42,
    soldCount: 88,
    responseRate: "100%",
    avgResponseTime: "30 phút",
    joinDate: "08/2025",
    bio: "Pass giáo trình và tài liệu ôn thi môn chuyên ngành UEH giá siêu sinh viên.",
    tags: ["Giáo trình", "Kinh tế", "Sách cũ"],
    studentInfo: {
      university: "Đại học Kinh tế TP.HCM (UEH)",
      major: "Tài chính ngân hàng",
      cohort: "K2022",
      program: "Đại học chính quy",
    },
    ratingBreakdown: {
      score: 5.0,
      total: 42,
      bars: [
        { star: 5, percent: 98 },
        { star: 4, percent: 2 },
        { star: 3, percent: 0 },
        { star: 2, percent: 0 },
        { star: 1, percent: 0 },
      ],
    },
    unreadCount: 1,
    lastMessageTime: "10:22",
    messages: [
      {
        id: "pt-1",
        sender: "seller",
        text: "Thảo: Mình gửi bạn ảnh chi tiết các chương nha",
        time: "10:22",
        read: false,
      },
    ],
  },
  {
    id: "thread-huy",
    sellerName: "Hoàng Đức Huy",
    verified: true,
    school: "Đại học Công nghệ Thông tin (UIT)",
    avatar: "/assets/detail/seller-huy.png",
    product: {
      id: "prod-dell",
      title: "Laptop Dell Latitude 7490 i7 16GB",
      price: 5200000,
      priceFormatted: "5.200.000đ",
      image: "/assets/detail/detail-macbook-main.png",
      status: "Còn hàng",
    },
    rating: 4.7,
    reviewCount: 15,
    soldCount: 22,
    responseRate: "92%",
    avgResponseTime: "3 giờ",
    joinDate: "10/2025",
    bio: "Dân IT UIT, hay nâng cấp máy tính và linh kiện bàn phím cơ.",
    tags: ["Laptop", "Linh kiện", "Bàn phím"],
    studentInfo: {
      university: "ĐH Công nghệ Thông tin (ĐHQG)",
      major: "Kỹ thuật phần mềm",
      cohort: "K2021",
      program: "Đại học chính quy",
    },
    ratingBreakdown: {
      score: 4.7,
      total: 15,
      bars: [
        { star: 5, percent: 80 },
        { star: 4, percent: 15 },
        { star: 3, percent: 5 },
        { star: 2, percent: 0 },
        { star: 1, percent: 0 },
      ],
    },
    lastMessageTime: "Hôm qua",
    messages: [
      {
        id: "dh-1",
        sender: "user",
        text: "Bạn: Còn bảo hành không ạ?",
        time: "Hôm qua",
        read: true,
      },
    ],
  },
  {
    id: "thread-ha",
    sellerName: "Ngô Thu Hà",
    verified: false,
    school: "Đại học Khoa học Tự nhiên TP.HCM",
    avatar: "/assets/detail/seller-ha.png",
    product: {
      id: "prod-hoodie",
      title: "Áo hoodie nỉ bông form rộng",
      price: 120000,
      priceFormatted: "120.000đ",
      image: "/assets/prod-books.png",
      status: "Còn hàng",
    },
    rating: 4.6,
    reviewCount: 9,
    soldCount: 14,
    responseRate: "89%",
    avgResponseTime: "4 giờ",
    joinDate: "01/2026",
    bio: "Thanh lý đồ thời trang unisex cho các bạn sinh viên mặc đi học.",
    tags: ["Áo quần", "Unisex", "Áo hoodie"],
    studentInfo: {
      university: "ĐH Khoa học Tự nhiên TP.HCM",
      major: "Hóa học",
      cohort: "K2023",
      program: "Đại học chính quy",
    },
    ratingBreakdown: {
      score: 4.6,
      total: 9,
      bars: [
        { star: 5, percent: 75 },
        { star: 4, percent: 20 },
        { star: 3, percent: 5 },
        { star: 2, percent: 0 },
        { star: 1, percent: 0 },
      ],
    },
    lastMessageTime: "Hôm qua",
    messages: [
      {
        id: "th-1",
        sender: "seller",
        text: "Hà: Mình ở gần trường, bạn tiện ghé không?",
        time: "Hôm qua",
        read: true,
      },
    ],
  },
  {
    id: "thread-dat",
    sellerName: "Võ Thành Đạt",
    verified: true,
    school: "Đại học Sài Gòn (SGU)",
    avatar: "/assets/detail/seller-dat.png",
    product: {
      id: "prod-headphone",
      title: "Tai nghe Bluetooth Sony WH-CH520",
      price: 450000,
      priceFormatted: "450.000đ",
      image: "/assets/prod-books.png",
      status: "Còn hàng",
    },
    rating: 4.8,
    reviewCount: 20,
    soldCount: 40,
    responseRate: "96%",
    avgResponseTime: "1 giờ",
    joinDate: "10/2025",
    bio: "Đam mê âm nhạc, pass tai nghe và phụ kiện công nghệ giá tốt.",
    tags: ["Tai nghe", "Âm thanh", "Phụ kiện"],
    studentInfo: {
      university: "Đại học Sài Gòn (SGU)",
      major: "Sư phạm Âm nhạc",
      cohort: "K2022",
      program: "Đại học chính quy",
    },
    ratingBreakdown: {
      score: 4.8,
      total: 20,
      bars: [
        { star: 5, percent: 85 },
        { star: 4, percent: 10 },
        { star: 3, percent: 5 },
        { star: 2, percent: 0 },
        { star: 1, percent: 0 },
      ],
    },
    lastMessageTime: "2 ngày trước",
    messages: [
      {
        id: "td-1",
        sender: "user",
        text: "Đạt: Giá còn fix thêm được không bạn?",
        time: "2 ngày trước",
        read: true,
      },
    ],
  },
  {
    id: "thread-han",
    sellerName: "Phạm Gia Hân",
    verified: true,
    school: "Đại học Ngoại thương Cơ sở 2 (FTU2)",
    avatar: "/assets/detail/seller-han.png",
    product: {
      id: "prod-backpack",
      title: "Balo laptop chống sốc chống nước",
      price: 180000,
      priceFormatted: "180.000đ",
      image: "/assets/prod-books.png",
      status: "Còn hàng",
    },
    rating: 4.9,
    reviewCount: 31,
    soldCount: 65,
    responseRate: "99%",
    avgResponseTime: "45 phút",
    joinDate: "07/2025",
    bio: "Pass balo, túi xách đi học gọn gàng và đồ dùng học tập FTU.",
    tags: ["Balo", "Túi xách", "Đồ học tập"],
    studentInfo: {
      university: "ĐH Ngoại thương Cơ sở 2",
      major: "Kinh tế đối ngoại",
      cohort: "K2021",
      program: "Đại học chính quy",
    },
    ratingBreakdown: {
      score: 4.9,
      total: 31,
      bars: [
        { star: 5, percent: 92 },
        { star: 4, percent: 8 },
        { star: 3, percent: 0 },
        { star: 2, percent: 0 },
        { star: 1, percent: 0 },
      ],
    },
    lastMessageTime: "3 ngày trước",
    messages: [
      {
        id: "gh-1",
        sender: "user",
        text: "Bạn: Cảm ơn bạn nhiều nhé!",
        time: "3 ngày trước",
        read: true,
      },
    ],
  },
];

import { SellerFullProfileView } from "./SellerFullProfileView";

export function ChatWorkspace({
  initialProduct,
  currentUser,
  initialViewMode,
  initialSellerId,
  onBack,
  onNavigateExplore,
  onLoginClick,
  onOpenCreate,
}: ChatWorkspaceProps) {
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>("thread-an");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSellerProfile, setShowSellerProfile] = useState(true);
  const [viewMode, setViewMode] = useState<"chat" | "profile">(
    initialViewMode || "chat"
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  // Nếu người dùng mở từ 1 sản phẩm cụ thể, tự động chèn hoặc focus sản phẩm đó
  useEffect(() => {
    if (!initialProduct) return;

    setThreads((prev) => {
      const existing = prev.find((t) => t.product.id === initialProduct.id);
      if (existing) {
        setActiveThreadId(existing.id);
        return prev;
      }

      const newThread: ChatThread = {
        id: `thread-${initialProduct.id}`,
        sellerName: initialProduct.seller?.name || "Người bán sinh viên",
        sellerRole: "Người bán",
        verified: true,
        school: initialProduct.seller?.universityCode
          ? `Đại học ${initialProduct.seller.universityCode}`
          : "Đại học tại TP.HCM",
        avatar: "/assets/detail/seller-avatar.png",
        product: {
          id: initialProduct.id,
          title: initialProduct.title,
          price: initialProduct.price,
          priceFormatted:
            initialProduct.price === 0
              ? "Miễn phí 0đ"
              : `${initialProduct.price.toLocaleString("vi-VN")}đ`,
          image: initialProduct.images?.[0] || "/assets/prod-books.png",
          status: "Đang giao dịch",
        },
        rating: 4.8,
        reviewCount: 22,
        soldCount: 45,
        responseRate: "98%",
        avgResponseTime: "1 giờ",
        joinDate: "09/2025",
        bio: "Sinh viên bán đồ dùng học tập, công nghệ chính chủ. Giao dịch an toàn tại sảnh trường.",
        tags: ["Đồ sinh viên", "Chính chủ", "Giao dịch trực tiếp"],
        studentInfo: {
          university: initialProduct.seller?.universityCode || "DHV",
          major: "Công nghệ thông tin",
          cohort: "K2022",
          program: "Đại học chính quy",
        },
        ratingBreakdown: {
          score: 4.8,
          total: 22,
          bars: [
            { star: 5, percent: 85 },
            { star: 4, percent: 10 },
            { star: 3, percent: 5 },
            { star: 2, percent: 0 },
            { star: 1, percent: 0 },
          ],
        },
        unreadCount: 1,
        lastMessageTime: "Vừa xong",
        messages: [
          {
            id: `init-${Date.now()}`,
            sender: "seller",
            text: `Chào bạn! Mình có đăng bài "${initialProduct.title}". Bạn quan tâm hoặc muốn hẹn xem trực tiếp tại sảnh trường cứ nhắn mình nha!`,
            time: new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            read: true,
          },
        ],
      };

      setActiveThreadId(newThread.id);
      return [newThread, ...prev];
    });
  }, [initialProduct]);

  const activeThread =
    threads.find((t) => t.id === activeThreadId) || threads[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isTyping]);

  // Bộ máy Bot phản hồi thông minh đóng giả người bán sinh viên thật
  const handleBotAutoReply = (userMessage: string, threadId: string) => {
    setIsTyping(true);

    const lower = userMessage.toLowerCase();
    let reply = "";

    if (
      lower.includes("tình trạng") ||
      lower.includes("máy") ||
      lower.includes("mới") ||
      lower.includes("cũ") ||
      lower.includes("xước") ||
      lower.includes("pin") ||
      lower.includes("zin")
    ) {
      const conditionReplies = [
        "Máy mình dùng rất cẩn thận, pin còn ổn, hiện tại chưa từng sửa chữa. Bạn có thể qua test thoải mái ạ!",
        "Món này mình giữ gìn kỹ lắm bạn ơi, còn nguyên phụ kiện đi kèm. Bạn qua sảnh trường mình bật test trực tiếp nha!",
        "Đồ còn mới tầm 98% bạn nhé, màn hình sáng đẹp không điểm chết hay cấn móp gì cả.",
      ];
      reply = conditionReplies[Math.floor(Math.random() * conditionReplies.length)];
    } else if (
      lower.includes("ở đâu") ||
      lower.includes("địa chỉ") ||
      lower.includes("giao") ||
      lower.includes("ship") ||
      lower.includes("sảnh") ||
      lower.includes("trường") ||
      lower.includes("bách khoa") ||
      lower.includes("hutech") ||
      lower.includes("dhv") ||
      lower.includes("ktx")
    ) {
      const locationReplies = [
        "Được bạn nhé! Mình ở gần khu vực trường, có thể giao trong ngày hôm nay nếu bạn sắp xếp được.",
        "Mình học ca sáng tại cơ sở trường, tầm 11h30 trưa hoặc chiều 5h mình hẹn nhau ở sảnh chính hoặc KTX nhé!",
        "Dạ mình có thể mang qua sảnh trường hoặc căn tin cho bạn xem tận tay nha, bạn rảnh khung giờ nào cứ nhắn mình.",
      ];
      reply = locationReplies[Math.floor(Math.random() * locationReplies.length)];
    } else if (
      lower.includes("giá") ||
      lower.includes("bớt") ||
      lower.includes("fix") ||
      lower.includes("giảm") ||
      lower.includes("xăng") ||
      lower.includes("tiền")
    ) {
      const priceReplies = [
        "Giá này mình đã để rất hữu nghị cho sinh viên rồi ạ, nhưng nếu bạn qua tận nơi lấy thì mình fix nhẹ 50k - 100k tiền xăng xe nha!",
        "Dạ có fix nhẹ tiền xăng cho bạn nhiệt tình qua sảnh trường nhận nha!",
        "Giá này mình bao test và tặng kèm phụ kiện/sạc cáp luôn rồi á bạn ơi, bạn lấy sớm mình bớt chút lộc may mắn nhé.",
      ];
      reply = priceReplies[Math.floor(Math.random() * priceReplies.length)];
    } else if (
      lower.includes("cọc") ||
      lower.includes("chốt") ||
      lower.includes("mua") ||
      lower.includes("lấy") ||
      lower.includes("ok") ||
      lower.includes("được")
    ) {
      const confirmReplies = [
        "Ok bạn nhé! Bạn cho mình xin số điện thoại hoặc Zalo để mình tiện liên hệ khi tới điểm hẹn nha.",
        "Dạ nhất trí bạn! Mình giữ món đồ này lại cho bạn rồi nhé, chiều nay gặp nhau tại sảnh trường nha.",
        "Tuyệt vời bạn ơi! Mình đóng gói sẵn củ cáp và phụ kiện đầy đủ cho bạn rồi, tới nơi bạn alo mình xuống liền.",
      ];
      reply = confirmReplies[Math.floor(Math.random() * confirmReplies.length)];
    } else if (
      lower.includes("còn không") ||
      lower.includes("còn k") ||
      lower.includes("bán chưa")
    ) {
      reply =
        "Dạ món này vẫn còn nha bạn ơi! Có mấy bạn cũng đang hỏi nhưng mình ưu tiên bạn nào hẹn qua xem sớm nè.";
    } else {
      const genericReplies = [
        "Dạ đúng rồi bạn ơi! Bạn còn thắc mắc gì về món đồ này cứ nhắn mình giải đáp thêm nha.",
        "Cảm ơn bạn đã quan tâm nha! Mình học ở trường suốt nên bạn cần xem lúc nào cứ nhắn mình trước 15 phút là được ạ.",
        "Dạ vâng bạn, đồ sinh viên dùng học tập siêu bền và tiết kiệm, bạn yên tâm sử dụng nha!",
      ];
      reply = genericReplies[Math.floor(Math.random() * genericReplies.length)];
    }

    // Thời gian phản hồi tự nhiên (1.2s - 1.5s) tạo cảm giác người thật đang gõ
    setTimeout(() => {
      setIsTyping(false);

      const currentTime = new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const botMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: "seller",
        text: reply,
        time: currentTime,
        read: true,
      };

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === threadId) {
            return {
              ...t,
              lastMessageTime: currentTime,
              messages: [...t.messages, botMsg],
            };
          }
          return t;
        })
      );
    }, 1300);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const currentTime = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: trimmed,
      time: currentTime,
      read: true,
    };

    const targetThreadId = activeThread.id;

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === targetThreadId) {
          return {
            ...t,
            lastMessageTime: currentTime,
            messages: [...t.messages, userMsg],
          };
        }
        return t;
      })
    );

    setInputText("");

    // Kích hoạt bot phản hồi tự động
    handleBotAutoReply(trimmed, targetThreadId);
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-[#fbfdfa] flex flex-col overflow-hidden"
      style={{ fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* ======================================================================= */}
      {/* 1. TOP NAVBAR: ĐÚNG CHUẨN NAVBAR CHÍNH THEO ẢNH MẪU (NỀN XANH #06462e)   */}
      {/* ======================================================================= */}
      <header
        className="chat-header h-[68px] w-full px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-md z-30"
        style={{
          backgroundColor: "#06462e",
          background: "#06462e",
          color: "#ffffff",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <div className="flex items-center gap-8">
          {/* Logo UniSwap */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateExplore?.() || onBack();
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
              onClick={() => onNavigateExplore?.() || onBack()}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0"
              style={{ color: "#e8f5ec", background: "transparent", border: 0 }}
            >
              Khám phá
            </button>
            <button
              type="button"
              onClick={() => onNavigateExplore?.() || onBack()}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0"
              style={{ color: "#e8f5ec", background: "transparent", border: 0 }}
            >
              Danh mục
            </button>
            <button
              type="button"
              onClick={() => onNavigateExplore?.() || onBack()}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0"
              style={{ color: "#e8f5ec", background: "transparent", border: 0 }}
            >
              Góc cho tặng
            </button>
            <button
              type="button"
              onClick={() => onNavigateExplore?.() || onBack()}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0"
              style={{ color: "#e8f5ec", background: "transparent", border: 0 }}
            >
              Cần mua / cần tìm
            </button>
            <button
              type="button"
              onClick={() => onNavigateExplore?.() || onBack()}
              className="hover:text-white transition-colors cursor-pointer !bg-transparent !border-0"
              style={{ color: "#e8f5ec", background: "transparent", border: 0 }}
            >
              Cộng đồng
            </button>
          </nav>
        </div>

        {/* Right Action Tools - Chuẩn 100% Ảnh 9 */}
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

          {/* Trái tim yêu thích Kính Mờ */}
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center relative transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 cursor-pointer shadow-xs"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "#ffffff",
              backdropFilter: "blur(8px)",
            }}
            title="Tin lưu yêu thích"
          >
            <Heart className="w-4 h-4 text-white" />
            <span
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm border border-[#06462e]"
              style={{
                backgroundColor: "#f59e0b",
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                color: "#06462e",
              }}
            >
              1
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
            onClick={() => onBack()}
            className="inline-flex items-center gap-2 px-3 h-10 rounded-full text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-xs"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.14)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              color: "#ffffff",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-400 text-[#06462e] font-black text-[11px] flex items-center justify-center border border-white">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="text-[10px] text-emerald-200">⌄</span>
          </button>

          {/* HERO CTA NỔI BẬT: [ + ĐĂNG TIN ] VÀNG KIM HOÀNG GIA */}
          <button
            type="button"
            onClick={onOpenCreate}
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
      {/* 2. CHAT WORKSPACE BODY (Khi viewMode === "chat")                        */}
      {/* ======================================================================= */}
      {viewMode === "chat" ? (
        <div className="flex-1 flex overflow-hidden w-full">
        {/* --------------------------------------------------------------------- */}
        {/* CỘT 1 (BÊN TRÁI): DANH SÁCH CUỘC TRÒ CHUYỆN (TIN NHẮN 3)               */}
        {/* --------------------------------------------------------------------- */}
        <aside className="w-[310px] sm:w-[340px] bg-white border-r border-gray-200/90 flex flex-col shrink-0">
          {/* Header danh sách tin nhắn */}
          <div className="p-4 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                  Tin nhắn
                </h2>
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                title="Lọc tin nhắn"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Ô tìm kiếm tin nhắn */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng hoặc sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: "36px" }}
                className="w-full pr-3 py-2 text-xs bg-gray-50/80 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
              />
            </div>
          </div>

          {/* Danh sách các đoạn chat */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filteredThreads.map((t) => {
              const isActive = t.id === activeThread.id;
              const lastMsg = t.messages[t.messages.length - 1];

              return (
                <div
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    isActive
                      ? "bg-emerald-50/60 border-l-4 border-emerald-600"
                      : "hover:bg-gray-50/70"
                  }`}
                >
                  {/* Avatar người bán */}
                  <div className="relative shrink-0">
                    <img
                      src={t.avatar}
                      alt={t.sellerName}
                      className="w-11 h-11 rounded-full object-cover border border-gray-200 shadow-2xs bg-white"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/assets/detail/seller-avatar.png";
                      }}
                    />
                    {t.verified && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Thông tin đoạn chat */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-bold text-gray-900 truncate">
                          {t.sellerName}
                        </span>
                        {t.sellerRole && (
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                            {t.sellerRole}
                          </span>
                        )}
                      </div>
                      <span className="text-[10.5px] text-gray-400 font-medium shrink-0 ml-1">
                        {t.lastMessageTime}
                      </span>
                    </div>

                    {/* Tiêu đề món đồ */}
                    <div className="text-[11px] font-semibold text-gray-700 truncate mt-0.5">
                      {t.product.title}
                    </div>

                    {/* Tin nhắn cuối cùng */}
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[11px] text-gray-500 truncate pr-2">
                        {lastMsg ? lastMsg.text : "Chưa có tin nhắn"}
                      </p>
                      {t.unreadCount && t.unreadCount > 0 ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9.5px] font-bold flex items-center justify-center shrink-0">
                          {t.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer nhỏ bên dưới danh sách */}
          <div className="p-3 border-t border-gray-100 text-[11px] text-gray-400 text-center font-medium bg-[#fcfdfa]">
            Tổng {threads.length} cuộc trò chuyện ⚙
          </div>
        </aside>

        {/* --------------------------------------------------------------------- */}
        {/* CỘT 2 (GIỮA): KHUNG TRÒ CHUYỆN TRỰC TIẾP CHÍNH                         */}
        {/* --------------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col bg-[#f4f7f4] overflow-hidden min-w-0">
          {/* Header đoạn chat hiện tại */}
          <div className="h-16 px-5 bg-white border-b border-gray-200/90 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={onBack}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors cursor-pointer shrink-0"
                title="Quay lại"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={activeThread.avatar}
                  alt={activeThread.sellerName}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-300 shadow-2xs bg-white"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/detail/seller-avatar.png";
                  }}
                />
                {activeThread.verified && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                    <Check className="w-2 h-2 stroke-[3]" />
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-gray-900 truncate">
                    {activeThread.sellerName}
                  </h3>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                </div>
                <div className="text-[11px] text-gray-500 truncate">
                  <span>{activeThread.school}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.2">
                  <span className="flex items-center gap-0.5 font-bold text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{activeThread.rating}</span>
                    <span className="text-gray-400 font-normal">
                      ({activeThread.reviewCount} đánh giá)
                    </span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Package className="w-2.5 h-2.5" />
                    <span>Đã bán {activeThread.soldCount} sản phẩm</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Nút Xem hồ sơ (Được người dùng khoanh đỏ) & Menu tùy chọn */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode("profile")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border bg-red-50 text-red-700 border-red-300 ring-2 ring-red-400/30 hover:bg-red-100 hover:scale-[1.02] active:scale-95"
                title="Bấm để xem toàn bộ hồ sơ chi tiết người bán"
              >
                <UserIcon className="w-3.5 h-3.5 text-red-600" />
                <span>Xem hồ sơ</span>
              </button>

              <button
                type="button"
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                title="Tùy chọn khác"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vùng tin nhắn chính */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Thẻ ghim món đồ đang trao đổi (Product Snippet Card) */}
            <div className="max-w-[480px] mx-auto bg-white rounded-2xl p-3 border border-gray-200/90 shadow-sm flex items-center gap-3.5">
              <img
                src={activeThread.product.image}
                alt={activeThread.product.title}
                className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0 bg-white"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/detail/detail-macbook-main.png";
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  {activeThread.product.title}
                </h4>
                <div className="text-sm font-black text-emerald-800 mt-0.5">
                  {activeThread.product.priceFormatted}
                </div>
                <div className="mt-1">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-md">
                    {activeThread.product.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Các bong bóng tin nhắn */}
            <div className="space-y-3 pt-2">
              {activeThread.messages.map((m) => {
                const isUser = m.sender === "user";

                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2.5 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <img
                        src={activeThread.avatar}
                        alt={activeThread.sellerName}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200 mb-1"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/assets/detail/seller-avatar.png";
                        }}
                      />
                    )}

                    <div
                      className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                        isUser
                          ? "bg-[#d9fdd3] text-gray-900 border border-emerald-200/80 rounded-br-xs"
                          : "bg-white text-gray-900 border border-gray-200/90 rounded-bl-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      <div
                        className={`flex items-center justify-end gap-1 text-[9.5px] mt-1 ${
                          isUser ? "text-emerald-800" : "text-gray-400"
                        }`}
                      >
                        <span>{m.time}</span>
                        {isUser && <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Hiệu ứng Bot đang soạn tin nhắn phản hồi */}
              {isTyping && (
                <div className="flex items-end gap-2.5 justify-start animate-in fade-in duration-150">
                  <img
                    src={activeThread.avatar}
                    alt={activeThread.sellerName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-gray-200 mb-1"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/detail/seller-avatar.png";
                    }}
                  />
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-2xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    ></span>
                    <span className="text-[11px] text-gray-400 ml-1 font-medium">
                      {activeThread.sellerName} đang nhập...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Ô nhập tin nhắn & nút Gửi */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-200/90 shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2.5 bg-gray-50/80 border border-gray-200 rounded-2xl px-3 py-1.5 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
            >
              <button
                type="button"
                className="w-8 h-8 rounded-full hover:bg-gray-200/70 text-gray-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Gửi hình ảnh"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="w-8 h-8 rounded-full hover:bg-gray-200/70 text-gray-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Biểu tượng cảm xúc"
              >
                <Smile className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm text-gray-900 py-1"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                title="Gửi tin nhắn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>

        {/* --------------------------------------------------------------------- */}
        {/* CỘT 3 (BÊN PHẢI): HỒ SƠ NGƯỜI BÁN (TOGGLEABLE VIA NÚT "XEM HỒ SƠ")     */}
        {/* --------------------------------------------------------------------- */}
        {showSellerProfile && (
          <aside className="w-[320px] sm:w-[350px] bg-white border-l border-gray-200/90 flex flex-col shrink-0 overflow-y-auto animate-in slide-in-from-right-4 duration-200">
            {/* Header hồ sơ người bán */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-sm font-black text-gray-900">Hồ sơ người bán</h3>
              <button
                type="button"
                onClick={() => setShowSellerProfile(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
                title="Đóng hồ sơ người bán"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thông tin chính của Người Bán */}
            <div className="p-5 space-y-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={activeThread.avatar}
                    alt={activeThread.sellerName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-md bg-white"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/assets/detail/seller-avatar.png";
                    }}
                  />
                  {activeThread.verified && (
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 text-white rounded-full border-2 border-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mt-2.5">
                  <h4 className="text-base font-black text-gray-900">
                    {activeThread.sellerName}
                  </h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                </div>

                {activeThread.verified && (
                  <span className="mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10.5px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Sinh viên đã xác minh
                  </span>
                )}

                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {activeThread.school}
                </p>

                <div className="flex items-center gap-2 mt-1.5 text-xs">
                  <span className="font-bold text-amber-500 flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{activeThread.rating}</span>
                    <span className="text-gray-400 font-normal">
                      ({activeThread.reviewCount} đánh giá)
                    </span>
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    <span>Đã bán {activeThread.soldCount} sản phẩm</span>
                  </span>
                </div>
              </div>

              {/* 3 Hộp số liệu nhanh: Phản hồi, Thời gian phản hồi, Tham gia từ */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50/80 rounded-2xl border border-gray-100 text-center">
                <div>
                  <div className="text-sm font-black text-emerald-700">
                    {activeThread.responseRate}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                    Phản hồi
                  </div>
                </div>
                <div className="border-x border-gray-200/80">
                  <div className="text-sm font-black text-gray-900">
                    {activeThread.avgResponseTime}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                    Thời gian phản hồi TB
                  </div>
                </div>
                <div>
                  <div className="text-sm font-black text-gray-900">
                    {activeThread.joinDate}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                    Tham gia từ
                  </div>
                </div>
              </div>

              {/* Tiểu sử & Tags */}
              <div className="space-y-2">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {activeThread.bio}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeThread.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10.5px] font-bold rounded-md border border-emerald-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nút Xem tất cả sản phẩm của người bán */}
              <button
                type="button"
                onClick={() => setViewMode("profile")}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer hover:scale-[1.01] active:scale-98"
              >
                <span>Xem tất cả sản phẩm của người bán</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Khối: Thông tin sinh viên */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  Thông tin sinh viên
                </h4>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Building className="w-3.5 h-3.5" />
                      Trường đại học
                    </span>
                    <span className="font-bold text-gray-900 text-right truncate max-w-[160px]">
                      {activeThread.studentInfo.university}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1 text-gray-400">
                      <BookOpen className="w-3.5 h-3.5" />
                      Ngành học
                    </span>
                    <span className="font-bold text-gray-900 text-right truncate max-w-[160px]">
                      {activeThread.studentInfo.major}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      Khóa học
                    </span>
                    <span className="font-bold text-gray-900">
                      {activeThread.studentInfo.cohort}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1 text-gray-400">
                      <FileText className="w-3.5 h-3.5" />
                      Chương trình
                    </span>
                    <span className="font-bold text-gray-900">
                      {activeThread.studentInfo.program}
                    </span>
                  </div>
                </div>
              </div>

              {/* Khối: Đánh giá từ người mua */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                    Đánh giá từ người mua
                  </h4>
                  <button
                    type="button"
                    className="text-[11px] text-emerald-700 hover:underline font-bold cursor-pointer"
                  >
                    Xem tất cả
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-900">
                      {activeThread.ratingBreakdown.score}
                      <span className="text-xs text-gray-400">/5</span>
                    </div>
                    <div className="flex items-center justify-center text-amber-400 text-xs mt-0.5">
                      ★★★★★
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      ({activeThread.ratingBreakdown.total} đánh giá)
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    {activeThread.ratingBreakdown.bars.map((b) => (
                      <div key={b.star} className="flex items-center gap-2 text-[10px]">
                        <span className="text-gray-500 w-7">{b.star} sao</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${b.percent}%` }}
                          />
                        </div>
                        <span className="text-gray-400 w-6 text-right font-medium">
                          {b.percent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Khối: Campus Check */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Campus Check</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                    <span className="text-[9px] text-gray-600 font-semibold leading-tight">
                      Tình trạng sản phẩm
                    </span>
                  </div>

                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                    <Camera className="w-4 h-4 text-emerald-600 mb-1" />
                    <span className="text-[9px] text-gray-600 font-semibold leading-tight">
                      Ảnh thực tế
                    </span>
                  </div>

                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                    <Package className="w-4 h-4 text-emerald-600 mb-1" />
                    <span className="text-[9px] text-gray-600 font-semibold leading-tight">
                      Phụ kiện đi kèm
                    </span>
                  </div>

                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center">
                    <FileText className="w-4 h-4 text-emerald-600 mb-1" />
                    <span className="text-[9px] text-gray-600 font-semibold leading-tight">
                      Mô tả chi tiết
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
      ) : (
        /* ======================================================================= */
        /* 3. FULL SELLER PROFILE VIEW (Khi viewMode === "profile" - ĐÚNG ẢNH 2)  */
        /* ======================================================================= */
        <SellerFullProfileView
          sellerName={activeThread.sellerName}
          verified={activeThread.verified}
          school={activeThread.school}
          avatar={activeThread.avatar}
          rating={activeThread.rating}
          reviewCount={activeThread.reviewCount}
          soldCount={activeThread.soldCount}
          responseRate={activeThread.responseRate}
          avgResponseTime={activeThread.avgResponseTime}
          joinDate={activeThread.joinDate}
          bio={activeThread.bio}
          studentInfo={activeThread.studentInfo}
          onBackToChat={() => setViewMode("chat")}
        />
      )}
    </div>
  );
}

export default ChatWorkspace;
