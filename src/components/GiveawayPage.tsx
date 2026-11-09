import React, { useState, useMemo } from 'react';
import {
  Gift,
  Heart,
  Sparkles,
  MapPin,
  Search,
  ArrowRight,
  ShieldCheck,
  Check,
  MessageCircle,
  Plus,
  BookOpen,
  Laptop,
  Shirt,
  Home as HomeIcon,
  Tag,
  UserCheck,
  Send,
  Calendar,
  X,
  Flame,
  Award,
  Clock,
  Compass,
} from 'lucide-react';
import type { ProductItem, User } from '../types';
import { UNIVERSITIES } from '../data/mockData';

export interface GiveawayPageProps {
  products: ProductItem[];
  user: User | null;
  onSelectProduct: (product: ProductItem) => void;
  onOpenCreate: () => void;
  onOpenChat?: (product: ProductItem) => void;
  onNotice?: (msg: string) => void;
  onLogin?: () => void;
}

// Danh mục chuyên biệt cho đồ 0đ
const GIVEAWAY_CATEGORIES = [
  { id: 'all', label: 'Tất cả đồ 0đ', icon: Gift },
  { id: 'books', label: 'Sách & Giáo trình', icon: BookOpen },
  { id: 'stationery', label: 'Đồ dùng học tập', icon: Tag },
  { id: 'tech', label: 'Điện tử & Phụ kiện', icon: Laptop },
  { id: 'dorm', label: 'Đồ phòng trọ', icon: HomeIcon },
  { id: 'fashion', label: 'Balo & Thời trang', icon: Shirt },
];

// Danh sách lời cảm ơn trên Kindness Wall
interface GratitudeNote {
  id: string;
  sender: string;
  school: string;
  receiver: string;
  giftTitle: string;
  message: string;
  time: string;
  hearts: number;
}

const INITIAL_GRATITUDE_NOTES: GratitudeNote[] = [
  {
    id: 'g1',
    sender: 'Thanh Thảo (K24)',
    school: 'ĐH Bách Khoa TP.HCM',
    receiver: 'Anh Minh Quân (K21)',
    giftTitle: 'Giáo trình Giải tích 1 & ĐSTT',
    message: 'Em nhận được sách rồi ạ, sách anh giữ rất mới và còn ghi chú cẩn thận bài tập khó. Cảm ơn anh đã giúp một đứa tân sinh viên bớt hoang mang kỳ đầu!',
    time: '2 giờ trước',
    hearts: 28,
  },
  {
    id: 'g2',
    sender: 'Văn Hoàng (K23)',
    school: 'ĐH Khoa học Tự nhiên',
    receiver: 'Bạn Thu Trang (K22)',
    giftTitle: 'Nồi cơm điện mini 1.2L',
    message: 'Nồi nấu rất tốt và sạch sẽ. Nhờ món quà của bạn mà mình tiết kiệm được một khoản tiền lớn lúc vừa chuyển vào KTX khu B. Chúc bạn luôn vui vẻ!',
    time: 'Hôm qua',
    hearts: 45,
  },
  {
    id: 'g3',
    sender: 'Mai Anh (K24)',
    school: 'ĐH Kinh tế TP.HCM (UEH)',
    receiver: 'Chị Bảo Ngọc (K20)',
    giftTitle: 'Balo laptop và kẹp tài liệu',
    message: 'Balo đeo rất êm và chắc chắn. Cảm ơn chị Ngọc đã hỗ trợ sinh viên năm nhất tụi em. Sau này tốt nghiệp em cũng sẽ tiếp tục tặng lại cho các em khóa sau!',
    time: '3 ngày trước',
    hearts: 39,
  },
];

// Các điểm Tủ đồ tử tế tại campus
const CAMPUS_HUBS = [
  {
    name: 'Tủ đồ KTX Khu B - ĐHQG TP.HCM',
    location: 'Sảnh nhà B3 - Cạnh văn phòng ban quản lý KTX',
    itemsCount: '34 món sẵn có',
    hours: 'Mở cửa tự do 7:00 - 21:00',
    manager: 'Đội sinh viên tình nguyện KTX',
  },
  {
    name: 'Góc trao đổi Bách Khoa (Cơ sở Dĩ An)',
    location: 'Sảnh nhà C6 - Khu tự học sinh viên Bách Khoa',
    itemsCount: '22 món sẵn có',
    hours: 'Thứ 2 - Thứ 7 (8:00 - 17:30)',
    manager: 'Đoàn Thanh niên ĐHBK',
  },
  {
    name: 'Tủ sách & Đồ dùng UEH Nguyễn Tri Phương',
    location: 'Tầng trệt Tòa B1 - Góc không gian xanh kết nối',
    itemsCount: '19 món sẵn có',
    hours: 'Mở cửa giờ hành chính',
    manager: 'CLB Sinh viên Khởi nghiệp UEH',
  },
  {
    name: 'Không gian sẻ chia ĐH Khoa học Tự nhiên',
    location: 'Sảnh chính cơ sở Linh Trung - Thủ Đức',
    itemsCount: '15 món sẵn có',
    hours: 'Thứ 2 - Thứ 6 (7:30 - 18:00)',
    manager: 'Hội Sinh viên KHTN',
  },
];

export function GiveawayPage({
  products,
  user,
  onSelectProduct,
  onOpenCreate,
  onOpenChat,
  onNotice,
  onLogin,
}: GiveawayPageProps) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyPriority, setOnlyPriority] = useState(false);

  // State cho Modal "Đăng ký nhận món đồ 0đ"
  const [claimProduct, setClaimProduct] = useState<ProductItem | null>(null);
  const [claimName, setClaimName] = useState(user?.name || '');
  const [claimSchool, setClaimSchool] = useState(user?.universityCode || 'ĐHQG TP.HCM');
  const [claimCohort, setClaimCohort] = useState('K24 (Tân sinh viên)');
  const [claimMessage, setClaimMessage] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  // State cho Lời cảm ơn (Kindness Wall)
  const [gratitudeNotes, setGratitudeNotes] = useState<GratitudeNote[]>(INITIAL_GRATITUDE_NOTES);
  const [showThankModal, setShowThankModal] = useState(false);
  const [thankSender, setThankSender] = useState(user?.name || '');
  const [thankReceiver, setThankReceiver] = useState('');
  const [thankGift, setThankGift] = useState('');
  const [thankMessage, setThankMessage] = useState('');

  // Lọc danh sách sản phẩm 0đ / cho tặng
  const giveawayItems = useMemo(() => {
    // Lấy các sản phẩm có tradeType là giveaway hoặc giá = 0
    let list = products.filter(
      (p) => p.tradeType === 'giveaway' || p.price === 0 || p.title.toLowerCase().includes('tặng')
    );

    // Nếu dữ liệu hiện tại ít, tạo thêm một số mock đồ 0đ phong phú
    if (list.length < 4) {
      const fallbackList: ProductItem[] = [
        {
          id: 'giveaway-demo-1',
          title: 'Giáo trình Giải tích 1 & Đại số tuyến tính (Chuẩn ĐHQG)',
          category: 'books',
          subcategory: 'textbooks',
          majorGroup: 'general',
          price: 0,
          condition: 'Tốt',
          tradeType: 'giveaway',
          cluster: 'lang-dh',
          meetingSpot: 'Sảnh nhà C6 - ĐH Bách Khoa CS2 Dĩ An',
          description: 'Sách mình đã học xong kỳ trước, đã ghi chú nhiều công thức tính nhanh và ví dụ ôn thi cuối kỳ. Tặng lại cho bạn tân sinh viên nào cần nhé!',
          images: ['/assets/demo/books-textbooks-0.svg', '/assets/detail/book-detail-1.png'],
          seller: {
            id: 'seller-ga-1',
            name: 'Nguyễn Tuấn Kiệt',
            studentId: '2110982',
            universityCode: 'ĐH Bách Khoa TP.HCM',
            avatar: '/assets/detail/seller-avatar.png',
            rating: 4.9,
            isVerified: true,
            isPro: true,
          },
          createdAt: new Date().toISOString(),
          views: 312,
          likes: 45,
          status: 'available',
          isDemo: true,
        },
        {
          id: 'giveaway-demo-2',
          title: 'Balo sinh viên đeo chéo còn tốt 90%',
          category: 'fashion',
          subcategory: 'backpacks',
          majorGroup: 'general',
          price: 0,
          condition: 'Như mới',
          tradeType: 'giveaway',
          cluster: 'lang-dh',
          meetingSpot: 'KTX Khu B - Nhà B3 ĐHQG',
          description: 'Balo còn mới, khóa kéo trơn tru, chống thấm nước nhẹ. Mình đổi balo to hơn nên tặng lại cho bạn nào đi học hàng ngày.',
          images: ['/assets/prod-books.png', '/assets/detail/macbook-detail-2.png'],
          seller: {
            id: 'seller-ga-2',
            name: 'Trần Phương Uyên',
            studentId: '2250123',
            universityCode: 'ĐH Kinh tế TP.HCM',
            avatar: '/assets/detail/seller-avatar.png',
            rating: 4.8,
            isVerified: true,
            isPro: false,
          },
          createdAt: new Date().toISOString(),
          views: 240,
          likes: 38,
          status: 'available',
          isDemo: true,
        },
        {
          id: 'giveaway-demo-3',
          title: 'Bộ compa kĩ thuật & thước chữ T vẽ đồ án',
          category: 'stationery',
          subcategory: 'tools',
          majorGroup: 'engineering',
          price: 0,
          condition: 'Tốt',
          tradeType: 'giveaway',
          cluster: 'lang-dh',
          meetingSpot: 'Thư viện trung tâm ĐHQG',
          description: 'Bộ thước và compa chuyên vẽ kỹ thuật mình đã dùng qua môn Hình họa. Dụng cụ còn đầy đủ hộp, tặng cho các bạn khóa mới ngành xây dựng/cơ khí.',
          images: ['/assets/demo/stationery-notebooks-0.svg', '/assets/detail/book-detail-3.png'],
          seller: {
            id: 'seller-ga-3',
            name: 'Lê Minh Huy',
            studentId: '2014567',
            universityCode: 'ĐH Sư phạm Kỹ thuật',
            avatar: '/assets/detail/seller-avatar.png',
            rating: 5.0,
            isVerified: true,
            isPro: false,
          },
          createdAt: new Date().toISOString(),
          views: 189,
          likes: 29,
          status: 'available',
          isDemo: true,
        },
        {
          id: 'giveaway-demo-4',
          title: 'Bàn học gấp gọn chân sắt & đèn học để bàn',
          category: 'dorm',
          subcategory: 'furniture',
          majorGroup: 'general',
          price: 0,
          condition: 'Tốt',
          tradeType: 'giveaway',
          cluster: 'lang-dh',
          meetingSpot: 'Khu phố 6, Linh Trung, TP.Thủ Đức',
          description: 'Mình chuyển trọ về quê nên tặng lại bàn học gấp gọn và đèn bàn led ánh sáng trắng. Bàn còn rất chắc chắn, ưu tiên bạn nào qua lấy trực tiếp.',
          images: ['/assets/3d-dorm.png', '/assets/detail/book-detail-4.png'],
          seller: {
            id: 'seller-ga-4',
            name: 'Hoàng Quốc Việt',
            studentId: '2352011',
            universityCode: 'ĐH Công nghệ Thông tin',
            avatar: '/assets/detail/seller-avatar.png',
            rating: 4.9,
            isVerified: true,
            isPro: true,
          },
          createdAt: new Date().toISOString(),
          views: 420,
          likes: 67,
          status: 'available',
          isDemo: true,
        },
      ];
      list = [...list, ...fallbackList];
    }

    // Lọc theo danh mục
    if (selectedCat !== 'all') {
      list = list.filter((p) => p.category === selectedCat);
    }

    // Lọc theo trường
    if (selectedSchool !== 'all') {
      list = list.filter(
        (p) =>
          p.seller.universityCode?.toLowerCase().includes(selectedSchool.toLowerCase()) ||
          p.meetingSpot?.toLowerCase().includes(selectedSchool.toLowerCase())
      );
    }

    // Lọc theo từ khóa
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.meetingSpot?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [products, selectedCat, selectedSchool, searchQuery]);

  // Xử lý gửi yêu cầu nhận đồ 0đ
  const handleSendClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimMessage.trim()) {
      if (onNotice) onNotice('Vui lòng nhập lời nhắn gửi đến người tặng!');
      return;
    }

    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      const target = claimProduct;
      setClaimProduct(null);
      setClaimMessage('');
      if (onNotice) {
        onNotice(`Đã gửi đăng ký nhận "${target?.title}" tới người tặng thành công!`);
      }
      if (target && onOpenChat) {
        onOpenChat(target);
      }
    }, 1500);
  };

  // Xử lý gửi lời cảm ơn lên Kindness Wall
  const handleSendThankNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thankMessage.trim() || !thankGift.trim()) {
      if (onNotice) onNotice('Vui lòng điền đầy đủ tên món đồ và lời cảm ơn!');
      return;
    }

    const newNote: GratitudeNote = {
      id: 'g-' + Date.now(),
      sender: thankSender || 'Sinh viên UniSwap',
      school: user?.universityCode || 'ĐHQG TP.HCM',
      receiver: thankReceiver || 'Người bạn tử tế',
      giftTitle: thankGift,
      message: thankMessage,
      time: 'Vừa xong',
      hearts: 1,
    };

    setGratitudeNotes([newNote, ...gratitudeNotes]);
    setShowThankModal(false);
    setThankGift('');
    setThankMessage('');
    if (onNotice) onNotice('Cảm ơn bạn đã lan tỏa sự tử tế lên Bức tường yêu thương! ♡');
  };

  return (
    <div className="w-full max-w-[1340px] mx-auto px-3 sm:px-5 py-4 sm:py-6 flex flex-col gap-6 font-['Be_Vietnam_Pro',sans-serif]">
      {/* ===================================================================== */}
      {/* 1. HERO BANNER CHUẨN XÁC THEO ẢNH 2 (MÀU KEM BE, PLAYFAIR & CAVEAT)   */}
      {/* ===================================================================== */}
      <section
        className="relative overflow-hidden rounded-3xl p-6 sm:p-9 border border-[#e7ede0] shadow-xs"
        style={{ backgroundColor: '#f8f5ec' }}
      >
        {/* Vệt cong hữu cơ góc phải trên */}
        <svg
          className="absolute top-0 right-0 pointer-events-none select-none opacity-60"
          width="340"
          height="190"
          viewBox="0 0 340 190"
          fill="none"
        >
          <path d="M80 0C160 50 220 25 270 75C320 125 330 90 360 140V0H80Z" fill="#e2ecdb" />
        </svg>

        {/* Vệt cong hữu cơ góc trái dưới */}
        <svg
          className="absolute bottom-0 left-0 pointer-events-none select-none opacity-75"
          width="320"
          height="170"
          viewBox="0 0 320 170"
          fill="none"
        >
          <path d="M 0 65 C 80 45, 150 115, 230 110 C 275 107, 310 145, 340 190 H 0 Z" fill="#e1ecda" />
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* CỘT TRÁI: TIÊU ĐỀ BÁO CHÍ & CHỮ VIẾT TAY */}
          <div className="flex flex-col items-start max-w-[540px]">
            {/* Kicker với 2 chiếc lá & đường kẻ thanh mảnh */}
            <div className="flex items-center gap-2 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#497053]">
                <path d="M7 17C6.2 13 8 9.5 11 8C11 11 9.5 14.5 7 17Z" fill="currentColor" opacity="0.85" />
                <path d="M10 18C10 12 14 7 19 6C19 11 15 16 10 18Z" fill="currentColor" />
                <path d="M6 20C8 18 10 17 12 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-bold text-[#456b50] tracking-[0.16em] uppercase">
                TẶNG ĐI MỘT ĐIỀU TỐT · DBC 2026
              </span>
              <div className="h-[1px] bg-[#497053]/35 w-20 hidden sm:block" />
            </div>

            {/* Tiêu đề chính dạng Serif báo chí */}
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#0c432d] tracking-tight mb-3 leading-snug"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Có những món đồ,
              <br />
              giá trị hơn giá tiền.
            </h1>

            {/* Mô tả nhân văn */}
            <p className="text-xs sm:text-sm text-[#425949] leading-relaxed mb-6">
              Chia sẻ những gì bạn không còn dùng. Để một bạn tân sinh viên hoặc bạn cùng trường có
              thêm khởi đầu vững vàng và ấm áp tại TP.HCM.
            </p>

            {/* Khối nút bấm và chữ viết tay "Lan toả sự tử tế ♡" */}
            <div className="flex items-center justify-between w-full flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenCreate}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#114b35] hover:bg-[#0c3827] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer group active:scale-98"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Đăng món cho tặng (0đ)</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#campus-hubs"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/80 hover:bg-white text-[#114b35] text-xs font-bold border border-[#d6e4d0] transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Tủ đồ tại trường</span>
                </a>
              </div>

              {/* Chữ viết tay "Lan toả sự tử tế ♡" */}
              <div
                className="flex flex-col select-none text-[#708d77] -rotate-3 origin-bottom-left"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                <div className="text-2xl leading-none font-semibold">Lan toả</div>
                <div className="text-2xl leading-none font-semibold flex items-center gap-1.5 pl-3 pt-0.5">
                  <span>sự tử tế</span>
                  <Heart className="w-4 h-4 fill-[#708d77] text-[#708d77] inline-block rotate-12" />
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: HỘP THỐNG KÊ TÁC ĐỘNG TỬ TẾ */}
          <div className="grid grid-cols-2 gap-3 w-full lg:max-w-[420px] shrink-0">
            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#e2ebd9] shadow-2xs flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00513D] flex items-center justify-center mb-2">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#00513D]">142+</div>
                <div className="text-[11px] text-gray-500 font-medium mt-0.5">Món đồ 0đ đã trao tay</div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#e2ebd9] shadow-2xs flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-800">100%</div>
                <div className="text-[11px] text-gray-500 font-medium mt-0.5">Miễn phí cho sinh viên</div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#e2ebd9] shadow-2xs flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-800">18+</div>
                <div className="text-[11px] text-gray-500 font-medium mt-0.5">Trường ĐH TP.HCM tham gia</div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#e2ebd9] shadow-2xs flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#00513D]">~38tr</div>
                <div className="text-[11px] text-gray-500 font-medium mt-0.5">Tiết kiệm cho tân sinh viên</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. THANH TÌM KIẾM & BỘ LỌC DANH MỤC SẢN PHẨM 0Đ                      */}
      {/* ===================================================================== */}
      <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Ô tìm kiếm món 0đ */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm giáo trình, balo, đồ dùng 0đ..."
              className="w-full bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Lọc theo trường đại học */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs text-gray-500 shrink-0 font-medium">Trường:</span>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="bg-gray-50 text-xs py-2 px-3 rounded-xl border border-gray-200 font-medium text-gray-700 cursor-pointer"
            >
              <option value="all">Tất cả các trường</option>
              {UNIVERSITIES.map((u) => (
                <option key={u.code} value={u.name}>
                  {u.code} - {u.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setOnlyPriority(!onlyPriority)}
              className={`text-xs py-2 px-3 rounded-xl border transition-all cursor-pointer shrink-0 font-medium flex items-center gap-1.5 ${
                onlyPriority
                  ? 'bg-emerald-50 border-[#00513D] text-[#00513D] font-bold'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ưu tiên Tân sinh viên</span>
            </button>
          </div>
        </div>

        {/* Thanh phân loại Danh mục đồ 0đ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-gray-100 scrollbar-none">
          {GIVEAWAY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#00513D] text-white shadow-xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-gray-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. LƯỚI SẢN PHẨM ĐỒ 0Đ (GIVEAWAY PRODUCTS GRID)                        */}
      {/* ===================================================================== */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Món đồ đang sẵn sàng trao tặng
            </h2>
            <span className="bg-emerald-100 text-[#00513D] text-xs font-bold px-2 py-0.5 rounded-full">
              {giveawayItems.length} món
            </span>
          </div>
          <div className="text-xs text-gray-500 hidden sm:block">
            Mọi giao dịch đều miễn phí 0đ và gặp trực tiếp tại trường
          </div>
        </div>

        {giveawayItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00513D] flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">Chưa có món 0đ nào trong bộ lọc này</h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Bạn có thể đổi danh mục khác hoặc là người đầu tiên đăng tặng một món đồ hữu ích cho sinh viên cùng trường!
            </p>
            <button
              type="button"
              onClick={onOpenCreate}
              className="mt-2 bg-[#00513D] text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
            >
              ＋ Đăng món cho tặng ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {giveawayItems.map((item) => {
              const mainImg = item.images?.[0] || '/assets/prod-books.png';
              return (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Khung ảnh */}
                  <div
                    onClick={() => onSelectProduct(item)}
                    className="relative aspect-[4/3] bg-gray-50 overflow-hidden cursor-pointer flex items-center justify-center"
                  >
                    <img
                      src={mainImg}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/prod-books.png';
                      }}
                    />

                    {/* Tag Cho Tặng 0đ góc trên trái */}
                    <div className="absolute top-2.5 left-2.5 bg-[#00513D] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Gift className="w-3 h-3 text-amber-300" />
                      <span>CHO TẶNG · 0đ</span>
                    </div>

                    {/* Tình trạng */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs">
                      {item.condition || 'Còn tốt'}
                    </div>
                  </div>

                  {/* Thông tin món đồ */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h3
                        onClick={() => onSelectProduct(item)}
                        className="font-bold text-gray-900 text-xs sm:text-[13px] leading-snug line-clamp-2 hover:text-[#00513D] cursor-pointer transition-colors"
                      >
                        {item.title}
                      </h3>

                      {/* Trường & Điểm nhận */}
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-2 truncate">
                        <MapPin className="w-3 h-3 text-[#00513D] shrink-0" />
                        <span className="truncate">
                          {item.seller.universityCode || item.meetingSpot || 'ĐHQG TP.HCM'}
                        </span>
                      </div>

                      {/* Người tặng */}
                      <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-50 text-[11px] text-gray-600">
                        <img
                          src={item.seller.avatar || '/assets/detail/seller-avatar.png'}
                          alt={item.seller.name}
                          className="w-5 h-5 rounded-full object-cover border border-emerald-100"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/assets/detail/seller-avatar.png';
                          }}
                        />
                        <span className="truncate font-medium">{item.seller.name}</span>
                        {item.seller.isVerified && (
                          <span className="text-blue-500 text-[9px] font-bold">✓</span>
                        )}
                      </div>
                    </div>

                    {/* Hàng nút hành động */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setClaimProduct(item)}
                        className="flex-1 bg-[#114b35] hover:bg-[#0c3827] text-white text-xs font-bold py-2 px-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-98"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                        <span>Xin nhận đồ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectProduct(item)}
                        className="border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold py-2 px-2.5 rounded-xl transition-all cursor-pointer"
                        title="Xem chi tiết"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ===================================================================== */}
      {/* 4. BỨC TƯỜNG CẢM ƠN (WALL OF GRATITUDE / NHẬT KÝ TỬ TẾ)                 */}
      {/* ===================================================================== */}
      <section className="bg-gradient-to-br from-[#f8f6ee] to-[#f0f6ec] rounded-3xl p-5 sm:p-7 border border-[#e4eedb] shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#00513D] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bức tường yêu thương · UniSwap Stories</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              Những lời cảm ơn đọng lại sau mỗi món quà
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowThankModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-emerald-50 text-[#00513D] text-xs font-bold border border-emerald-200 shadow-2xs transition-all cursor-pointer shrink-0"
          >
            <span>Viết lời tri ân</span>
            <span className="text-rose-500">♡</span>
          </button>
        </div>

        {/* Danh sách thẻ cảm ơn */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {gratitudeNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white/95 rounded-2xl p-4 border border-[#e2ead8] shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span className="font-semibold text-[#00513D]">{note.school}</span>
                  <span>{note.time}</span>
                </div>

                <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{note.giftTitle}</span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{note.message}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-[11px]">
                <div className="text-gray-500 font-medium truncate">
                  Từ: <span className="text-gray-800 font-bold">{note.sender}</span>
                </div>
                <div className="flex items-center gap-1 text-rose-500 font-bold">
                  <Heart className="w-3 h-3 fill-rose-500" />
                  <span>{note.hearts}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. TỦ ĐỒ TỬ TẾ TẠI TRƯỜNG (CAMPUS GIVING HUBS)                         */}
      {/* ===================================================================== */}
      <section id="campus-hubs" className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-2xs scroll-mt-24">
        <div className="flex items-center gap-2 text-xs font-bold text-[#00513D] uppercase tracking-wider mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>Điểm tiếp nhận cố định</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Tủ đồ tử tế đặt tại các trường đại học
        </h2>
        <p className="text-xs text-gray-500 max-w-2xl mb-5">
          Nếu bạn có đồ muốn tặng nhưng bận rộn không tiện hẹn gặp, bạn có thể gửi trực tiếp tại các
          tủ đồ sinh viên UniSwap đặt tại sảnh các trường bên dưới.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {CAMPUS_HUBS.map((hub, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-emerald-100/60 text-[#00513D] flex items-center justify-center font-bold text-xs mb-3">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-gray-900 text-xs sm:text-[13px] leading-snug">
                  {hub.name}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1.5 leading-snug">
                  {hub.location}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-200/60 text-[10.5px] text-gray-500 space-y-1">
                <div className="text-emerald-800 font-bold">{hub.itemsCount}</div>
                <div>{hub.hours}</div>
                <div className="text-gray-400">QL: {hub.manager}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* MODAL: ĐĂNG KÝ XIN NHẬN MÓN ĐỒ 0Đ                                      */}
      {/* ===================================================================== */}
      {claimProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setClaimProduct(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#00513D] flex items-center justify-center">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Đăng ký xin nhận món đồ 0đ</h3>
              </div>
              <button
                type="button"
                onClick={() => setClaimProduct(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Thông tin món đồ */}
            <div className="bg-[#f0f7f2] p-3 rounded-2xl flex items-center gap-3 border border-emerald-100">
              <img
                src={claimProduct.images?.[0] || '/assets/prod-books.png'}
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-emerald-200"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Món quà tặng</div>
                <div className="text-xs font-bold text-gray-900 truncate">{claimProduct.title}</div>
                <div className="text-[11px] text-gray-500 truncate">Người tặng: {claimProduct.seller.name}</div>
              </div>
            </div>

            {claimSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 text-[#00513D] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Gửi đăng ký thành công!</h4>
                <p className="text-xs text-gray-500">
                  Lời nhắn của bạn đã được chuyển đến người tặng. Đang chuyển tiếp vào khung trò chuyện...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendClaim} className="flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Tên của bạn & Khóa học:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Họ và tên"
                      value={claimName}
                      onChange={(e) => setClaimName(e.target.value)}
                      className="bg-gray-50 text-xs p-2.5 rounded-xl border border-gray-200 w-full"
                    />
                    <input
                      type="text"
                      placeholder="VD: K24 Tân sinh viên"
                      value={claimCohort}
                      onChange={(e) => setClaimCohort(e.target.value)}
                      className="bg-gray-50 text-xs p-2.5 rounded-xl border border-gray-200 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Trường bạn đang học:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: ĐH Bách Khoa TP.HCM"
                    value={claimSchool}
                    onChange={(e) => setClaimSchool(e.target.value)}
                    className="bg-gray-50 text-xs p-2.5 rounded-xl border border-gray-200 w-full"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Lời nhắn gửi người tặng (Lý do bạn cần món đồ này):
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Em là tân sinh viên rất cần tài liệu này để ôn tập kỳ thi tới, mong anh/chị cho em xin nhận nhé..."
                    value={claimMessage}
                    onChange={(e) => setClaimMessage(e.target.value)}
                    className="bg-gray-50 text-xs p-2.5 rounded-xl border border-gray-200 w-full"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-[10.5px] text-gray-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Người tặng sẽ ưu tiên cho các bạn có nhu cầu học tập thực tế nhất.</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setClaimProduct(null)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#114b35] hover:bg-[#0c3827] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi lời nhắn</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: VIẾT LỜI TRI ÂN LÊN KINDNESS WALL                              */}
      {/* ===================================================================== */}
      {showThankModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200"
          onClick={() => setShowThankModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <h3 className="font-bold text-gray-900 text-sm">Gửi lời cảm ơn lên Bức tường yêu thương</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowThankModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendThankNote} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Tên của bạn:
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Minh Thư (K24)"
                  value={thankSender}
                  onChange={(e) => setThankSender(e.target.value)}
                  className="bg-gray-50 text-xs p-2.5 rounded-xl border border-gray-200 w-full"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Người bạn muốn gửi lời cảm ơn (tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="VD: Anh Minh Quân K21 Bách Khoa"
                  value={thankReceiver}
                  onChange={(e) => setThankReceiver(e.target.value)}
                  className="bg-gray-50 text-xs p-2.5 rounded-xl border border-gray-200 w-full"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Món đồ bạn đã nhận được:
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Bộ giáo trình Giải tích, Balo, Đèn bàn..."
                  value={thankGift}
                  onChange={(e) => setThankGift(e.target.value)}
                  className="bg-gray-50 text-xs p-2.5 rounded-xl border border-gray-200 w-full"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Lời tri ân chân thành của bạn:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Chia sẻ niềm vui hoặc lời cảm ơn của bạn đến người đã trao tặng..."
                  value={thankMessage}
                  onChange={(e) => setThankMessage(e.target.value)}
                  className="bg-gray-50 text-xs p-2.5 rounded-xl border border-gray-200 w-full"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowThankModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#114b35] hover:bg-[#0c3827] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  <span>Lan tỏa lời cảm ơn</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GiveawayPage;
