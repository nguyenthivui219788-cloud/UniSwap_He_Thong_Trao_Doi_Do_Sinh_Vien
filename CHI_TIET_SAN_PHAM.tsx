import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  Heart, 
  MessageCircle, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Flag, 
  Headphones, 
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
  Shield,
  Leaf,
  Mail,
  Phone,
  GraduationCap,
  Navigation,
  LocateFixed,
  Compass,
  ExternalLink,
  Lightbulb
} from 'lucide-react';
import { ProductItem, User } from './src/types';
import { InteractiveMap } from './src/components/InteractiveMap';

export interface ProductDetailModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  product?: ProductItem | null;
  currentUser?: User;
  onOpenChat?: (product: ProductItem) => void;
  onToggleLike?: (id: string) => void;
  isLiked?: boolean;
  isStandalonePage?: boolean;
}

export interface UnifiedProductConfig {
  id: string;
  title: string;
  category: ProductItem['category'];
  categoryLabel: string;
  price: number;
  condition: string;
  meetingSpot: string;
  description: string;
  mainImage: string;
  galleryImages: string[];
  detailImages: string[];
  quickSpecs: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }[];
  specs: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }[];
  checklist: { title: string; desc: string }[];
  seller: {
    name: string;
    studentId: string;
    eduEmail: string;
    phone: string;
    universityCode: string;
    major: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    soldCount: number;
    bio: string;
  };
}

// 1. MACBOOK AIR M1 CONFIG
const CONFIG_MACBOOK: UnifiedProductConfig = {
  id: 'p_feat_2',
  title: 'Macbook Air M1 2020 (8GB/256GB)',
  category: 'electronics',
  categoryLabel: 'Laptop',
  price: 7500000,
  condition: 'Tốt',
  meetingSpot: 'Trường Đại học Bách Khoa - TP.HCM',
  description: 'Macbook Air M1 2020, máy đẹp, hoạt động ổn định, pin trâu. Phù hợp cho học tập, làm việc và giải trí. Máy đã được vệ sinh, cài lại macOS mới, full chức năng.',
  mainImage: '/assets/detail/macbook-main.png',
  galleryImages: [
    '/assets/detail/macbook-main.png',
    '/assets/detail/thumb-2.png',
    '/assets/detail/thumb-3.png',
    '/assets/detail/thumb-4.png',
    '/assets/detail/thumb-5.png',
    '/assets/detail/macbook-detail-1.png',
    '/assets/detail/macbook-detail-2.png',
    '/assets/detail/macbook-detail-3.png'
  ],
  detailImages: [
    '/assets/detail/macbook-detail-1.png',
    '/assets/detail/macbook-detail-2.png',
    '/assets/detail/macbook-detail-3.png',
    '/assets/detail/macbook-detail-4.png'
  ],
  quickSpecs: [
    { label: 'Tình trạng', value: 'Tốt', icon: Leaf },
    { label: 'Hãng', value: 'Apple', icon: BookOpen },
    { label: 'Bảo hành', value: 'Không', icon: ShieldCheck },
    { label: 'Ngày đăng', value: '16/04/2025', icon: Calendar }
  ],
  specs: [
    { label: 'Tên sản phẩm', value: 'Macbook Air M1 2020', icon: Laptop },
    { label: 'Hãng', value: 'Apple', icon: BookOpen },
    { label: 'CPU', value: 'Apple M1 (8 nhân)', icon: Cpu },
    { label: 'RAM', value: '8GB Unified', icon: Layers },
    { label: 'Ổ cứng', value: '256GB SSD', icon: HardDrive },
    { label: 'Màn hình', value: '13.3 inch (Retina)', icon: Monitor },
    { label: 'Hệ điều hành', value: 'macOS Sonoma', icon: Laptop },
    { label: 'Pin', value: 'Còn tốt (khoảng 8-10 tiếng)', icon: BatteryCharging }
  ],
  checklist: [
    { title: 'Màn hình', desc: 'Không trầy xước, hiển thị tốt' },
    { title: 'Bàn phím', desc: 'Bấm nhạy, không kẹt phím' },
    { title: 'Pin', desc: 'Sạc tốt, giữ pin lâu' },
    { title: 'Cổng kết nối', desc: 'Đầy đủ, hoạt động bình thường' },
    { title: 'Ngoại hình', desc: 'Có trầy nhẹ ở cạnh dưới' },
    { title: 'Phụ kiện đi kèm', desc: 'Sạc, dây sạc (không phải chính hãng)' }
  ],
  seller: {
    name: 'Nguyễn Văn Anh',
    studentId: '2021001',
    eduEmail: 'vananh.k21@hcmut.edu.vn',
    phone: '0918.***.204',
    universityCode: 'ĐH Bách Khoa TP.HCM',
    major: 'Khoa học Máy tính',
    avatar: '/assets/detail/seller-avatar.png',
    rating: 4.8,
    reviewCount: 24,
    soldCount: 56,
    bio: 'Sinh viên năm 3, chuyên bán đồ điện tử, sách và đồ dùng học tập. Giao dịch nhanh chóng, uy tín.'
  }
};

// 2. GIÁO TRÌNH KINH TẾ VI MÔ (UEH) CONFIG
const CONFIG_BOOK: UnifiedProductConfig = {
  id: 'p_feat_1',
  title: 'Giáo trình Kinh tế vi mô (UEH)',
  category: 'books',
  categoryLabel: 'Sách & Giáo trình',
  price: 120000,
  condition: '95% còn rất tốt',
  meetingSpot: 'ĐH Kinh tế TP.HCM (UEH Cơ sở B)',
  description: 'Giáo trình Kinh tế vi mô (UEH) bản chuẩn, đầy đủ sơ đồ và bài tập cuối chương. Sách giữ gìn cẩn thận, có ghi chú bút chì giải thích ở chương 2-3, không rách trang.',
  mainImage: '/assets/prod-books.png',
  galleryImages: [
    '/assets/prod-books.png',
    '/assets/detail/book-detail-1.png',
    '/assets/detail/book-detail-2.png',
    '/assets/detail/book-detail-3.png',
    '/assets/detail/book-detail-4.png'
  ],
  detailImages: [
    '/assets/detail/book-detail-1.png',
    '/assets/detail/book-detail-2.png',
    '/assets/detail/book-detail-3.png',
    '/assets/detail/book-detail-4.png'
  ],
  quickSpecs: [
    { label: 'Tình trạng', value: '95% rất tốt', icon: Leaf },
    { label: 'Thể loại', value: 'Giáo trình ĐH', icon: BookOpen },
    { label: 'NXB', value: 'Kinh tế TP.HCM', icon: ShieldCheck },
    { label: 'Năm xuất bản', value: '2023', icon: Calendar }
  ],
  specs: [
    { label: 'Tên giáo trình', value: 'Giáo trình Kinh tế vi mô (UEH)', icon: BookOpen },
    { label: 'Chủ biên', value: 'Bộ môn Kinh tế học UEH', icon: Layers },
    { label: 'Nhà xuất bản', value: 'NXB ĐH Kinh tế TP.HCM', icon: BookOpen },
    { label: 'Năm tái bản', value: '2023 (Tái bản có sửa đổi)', icon: Calendar },
    { label: 'Số trang', value: '420 trang', icon: HardDrive },
    { label: 'Loại bìa', value: 'Bìa mềm cán bóng', icon: Layers },
    { label: 'Ngôn ngữ', value: 'Tiếng Việt', icon: BookOpen },
    { label: 'Tình trạng ruột', value: 'Đầy đủ 100%, không rách', icon: Leaf }
  ],
  checklist: [
    { title: 'Bìa sách', desc: 'Không rách mép, gáy sách chắc chắn' },
    { title: 'Trang ruột', desc: 'Đầy đủ 420 trang, không mất trang' },
    { title: 'Ghi chú', desc: 'Có note nhẹ bút chì ở chương 2-3' },
    { title: 'Chất lượng giấy', desc: 'Giấy in offset sáng rõ, không ố vàng' },
    { title: 'Mùi sách', desc: 'Sạch sẽ, thơm tho, không ẩm mốc' },
    { title: 'Tài liệu tặng kèm', desc: 'Tặng kèm tài liệu đề cương ôn thi giữa kỳ UEH' }
  ],
  seller: {
    name: 'Trần Thị Mai',
    studentId: '2022045',
    eduEmail: 'maitt.k48@ueh.edu.vn',
    phone: '0984.***.892',
    universityCode: 'ĐH Kinh tế TP.HCM (UEH)',
    major: 'Kinh doanh quốc tế',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    rating: 4.8,
    reviewCount: 18,
    soldCount: 24,
    bio: 'Sinh viên năm 3 khoa KDQT UEH, pass lại giáo trình và tài liệu ôn thi các học phần đại cương tại cơ sở Nguyễn Tri Phương Q.10.'
  }
};

// 3. GIÀY ADIDAS CONFIG
const CONFIG_SHOES: UnifiedProductConfig = {
  id: 'p_feat_3',
  title: 'Giày thể thao Adidas (Size 42)',
  category: 'fashion',
  categoryLabel: 'Giày thể thao',
  price: 550000,
  condition: '90% còn rất mới',
  meetingSpot: 'ĐH Sư phạm TDTT - TP.HCM',
  description: 'Giày thể thao Adidas nam size 42 form ôm chân, đi học và tập thể dục rất êm. Đã vệ sinh sạch sẽ, đế ít mòn, còn nguyên tem nhãn và lót trong chính hãng.',
  mainImage: '/assets/prod-shoes.png',
  galleryImages: [
    '/assets/prod-shoes.png',
    '/assets/detail/shoes-detail-1.png',
    '/assets/detail/shoes-detail-2.png',
    '/assets/detail/shoes-detail-3.png',
    '/assets/detail/shoes-detail-4.png'
  ],
  detailImages: [
    '/assets/detail/shoes-detail-1.png',
    '/assets/detail/shoes-detail-2.png',
    '/assets/detail/shoes-detail-3.png',
    '/assets/detail/shoes-detail-4.png'
  ],
  quickSpecs: [
    { label: 'Tình trạng', value: '90% rất mới', icon: Leaf },
    { label: 'Hãng', value: 'Adidas', icon: BookOpen },
    { label: 'Kích cỡ', value: 'Size 42', icon: Layers },
    { label: 'Xuất xứ', value: 'Chính hãng', icon: ShieldCheck }
  ],
  specs: [
    { label: 'Tên sản phẩm', value: 'Giày thể thao Adidas nam', icon: Layers },
    { label: 'Thương hiệu', value: 'Adidas Originals', icon: BookOpen },
    { label: 'Kích cỡ', value: 'Size 42 (Chiều dài 26.5 cm)', icon: Layers },
    { label: 'Kiểu dáng', value: 'Sneaker thể thao năng động', icon: Layers },
    { label: 'Màu sắc', value: 'Phối Đỏ - Đen cá tính', icon: Monitor },
    { label: 'Chất liệu vải', value: 'Vải dệt Primeknit thoáng khí', icon: Layers },
    { label: 'Đế giày', value: 'Đệm Boost êm ái đàn hồi cao', icon: HardDrive },
    { label: 'Tình trạng đế', value: 'Độ bám tốt, mòn rất ít', icon: Leaf }
  ],
  checklist: [
    { title: 'Thân giày', desc: 'Vải dệt sạch sẽ, không rách sờn' },
    { title: 'Đế giày', desc: 'Gai đế còn dày, độ bám cao' },
    { title: 'Lót giày', desc: 'Đệm lót chính hãng, đi êm ái' },
    { title: 'Dây giày', desc: 'Đầy đủ 2 dây, không bị xơ tua' },
    { title: 'Mùi giày', desc: 'Khử khuẩn sạch sẽ, thơm tho' },
    { title: 'Hộp giày', desc: 'Tặng kèm hộp carton bảo vệ giày' }
  ],
  seller: {
    name: 'Lê Hoàng Nam',
    studentId: '2023112',
    eduEmail: 'namlh.tdtt@upes1.edu.vn',
    phone: '0932.***.678',
    universityCode: 'ĐH Sư phạm TDTT TP.HCM',
    major: 'Giáo dục Thể chất',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 4.7,
    reviewCount: 12,
    soldCount: 19,
    bio: 'Sinh viên thể thao, thích sneaker và đồ phụ kiện chạy bộ. Hẹn gặp trực tiếp xem giày tại ký túc xá.'
  }
};

// 4. MÓC KHÓA LEN ẾCH CONFIG
const CONFIG_FROG: UnifiedProductConfig = {
  id: 'p_feat_4',
  title: 'Móc khóa len handmade (Ếch xanh)',
  category: 'other',
  categoryLabel: 'Đồ handmade',
  price: 80000,
  condition: 'Mới 100%',
  meetingSpot: 'ĐH Khoa học Tự nhiên - TP.HCM',
  description: 'Móc khóa len handmade hình chú ếch xanh mắt to cực kỳ dễ thương. Sản phẩm tự tay móc tỉ mỉ từng mũi đan, nhồi bông gòn trắng đàn hồi, thích hợp móc balo hoặc túi xách.',
  mainImage: '/assets/prod-frog.png',
  galleryImages: [
    '/assets/prod-frog.png',
    '/assets/detail/frog-detail-1.png',
    '/assets/detail/frog-detail-2.png',
    '/assets/detail/frog-detail-3.png',
    '/assets/detail/frog-detail-4.png'
  ],
  detailImages: [
    '/assets/detail/frog-detail-1.png',
    '/assets/detail/frog-detail-2.png',
    '/assets/detail/frog-detail-3.png',
    '/assets/detail/frog-detail-4.png'
  ],
  quickSpecs: [
    { label: 'Tình trạng', value: 'Mới 100%', icon: Leaf },
    { label: 'Kỹ thuật', value: 'Đan móc tay', icon: BookOpen },
    { label: 'Chất liệu', value: 'Len Milk Cotton', icon: Layers },
    { label: 'Kích thước', value: '7cm x 6cm', icon: Calendar }
  ],
  specs: [
    { label: 'Tên sản phẩm', value: 'Móc khóa len handmade Ếch xanh', icon: Layers },
    { label: 'Kỹ thuật đan', value: 'Thủ công đan móc (Crochet)', icon: BookOpen },
    { label: 'Chất liệu len', value: 'Len Milk Cotton loại 1', icon: Layers },
    { label: 'Kích thước', value: '7cm x 6cm (gọn lòng bàn tay)', icon: HardDrive },
    { label: 'Móc khóa', value: 'Hợp kim không gỉ mạ bạc', icon: Cpu },
    { label: 'Ruột nhồi', value: 'Bông gòn bi trắng kháng khuẩn', icon: Layers },
    { label: 'Độ bền', value: 'Giặt tay thoải mái, không xù', icon: Monitor },
    { label: 'Tình trạng', value: 'Mới 100% vừa hoàn thiện', icon: Leaf }
  ],
  checklist: [
    { title: 'Mũi móc', desc: 'Đều tăm tắp, len không bị xơ' },
    { title: 'Mắt thú', desc: 'Đính chốt bảo vệ an toàn chắc chắn' },
    { title: 'Khuyên móc', desc: 'Bấm nhạy, mạ bạc sáng bóng' },
    { title: 'Bông nhồi', desc: 'Căng tròn, đàn hồi tốt không xẹp' },
    { title: 'Vệ sinh', desc: 'Đã giặt phơi thơm dịu nhẹ' },
    { title: 'Đóng gói', desc: 'Kèm túi kiếng thắt nơ quà tặng' }
  ],
  seller: {
    name: 'Đỗ Thùy Linh',
    studentId: '2024098',
    eduEmail: 'linhdt.khtn@hcmus.edu.vn',
    phone: '0977.***.415',
    universityCode: 'ĐH Khoa học Tự nhiên TP.HCM',
    major: 'Công nghệ Sinh học',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    rating: 4.9,
    reviewCount: 42,
    soldCount: 88,
    bio: 'Mê đan móc len và làm đồ thủ công handmade cho sinh viên.'
  }
};

// 5. ĐÈN HỌC CHỐNG CẬN CONFIG
const CONFIG_LAMP: UnifiedProductConfig = {
  id: 'p_feat_5',
  title: 'Đèn học chống cận (Đã qua sử dụng)',
  category: 'dorm',
  categoryLabel: 'Đồ phòng trọ',
  price: 150000,
  condition: 'Tốt (92%)',
  meetingSpot: 'ĐH Ngoại thương CS2 - TP.HCM',
  description: 'Đèn bàn học sinh viên LED chống cận 3 mức độ ánh sáng (vàng, ấm, trắng), nguồn USB tiện dụng cắm củ sạc hoặc pin dự phòng, cổ đèn xoay uốn đa góc tiện lợi.',
  mainImage: '/assets/prod-lamp.png',
  galleryImages: [
    '/assets/prod-lamp.png',
    '/assets/detail/lamp-detail-1.png',
    '/assets/detail/lamp-detail-2.png',
    '/assets/detail/lamp-detail-3.png',
    '/assets/detail/lamp-detail-4.png'
  ],
  detailImages: [
    '/assets/detail/lamp-detail-1.png',
    '/assets/detail/lamp-detail-2.png',
    '/assets/detail/lamp-detail-3.png',
    '/assets/detail/lamp-detail-4.png'
  ],
  quickSpecs: [
    { label: 'Tình trạng', value: 'Tốt (92%)', icon: Leaf },
    { label: 'Bóng đèn', value: 'LED EyeCare', icon: BookOpen },
    { label: 'Nguồn điện', value: 'USB 5V', icon: ShieldCheck },
    { label: 'Cổ đèn', value: 'Uốn 360°', icon: Calendar }
  ],
  specs: [
    { label: 'Tên sản phẩm', value: 'Đèn học LED chống cận sinh viên', icon: Monitor },
    { label: 'Thương hiệu', value: 'Rạng Đông / LED EyeCare', icon: BookOpen },
    { label: 'Công suất', value: '7W tiết kiệm điện năng', icon: Cpu },
    { label: 'Chế độ sáng', value: '3 chế độ (Trắng / Vàng / Dịu)', icon: Layers },
    { label: 'Nhiệt độ màu', value: '4000K dịu mắt, chống mỏi', icon: Monitor },
    { label: 'Nguồn điện', value: 'Cổng cắm USB Type-C 5V', icon: HardDrive },
    { label: 'Thân đèn', value: 'Cổ ngỗng silicon uốn 360 độ', icon: Laptop },
    { label: 'Tuổi thọ bóng', value: '25.000 giờ chiếu sáng bền bỉ', icon: BatteryCharging }
  ],
  checklist: [
    { title: 'Bóng LED', desc: 'Sáng đều, không nhấp nháy mỏi mắt' },
    { title: 'Nút cảm ứng', desc: 'Chạm 1 chạm siêu nhạy' },
    { title: 'Khớp uốn dẻo', desc: 'Giữ góc chiếu chắc chắn, không lỏng' },
    { title: 'Cổng sạc', desc: 'Chân Type-C nhận nguồn ổn định' },
    { title: 'Chân đế', desc: 'Đệm cao su chống trượt trên bàn' },
    { title: 'Phụ kiện', desc: 'Tặng kèm cáp sạc USB dài 1.2m' }
  ],
  seller: {
    name: 'Phạm Minh Tuấn',
    studentId: '2022304',
    eduEmail: 'tuanpm.ftu2@ftu.edu.vn',
    phone: '0905.***.931',
    universityCode: 'ĐH Ngoại thương CS2 TP.HCM',
    major: 'Kinh tế Quốc tế',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    rating: 4.6,
    reviewCount: 15,
    soldCount: 31,
    bio: 'Sinh viên K60 FTU2, sắp tốt nghiệp dọn trọ pass lại đồ dùng học tập giá hạt dẻ.'
  }
};

// 6. BALO LAPTOP CONFIG
const CONFIG_BACKPACK: UnifiedProductConfig = {
  id: 'p_feat_6',
  title: 'Balo laptop 15.6 inch (Đã sử dụng)',
  category: 'other',
  categoryLabel: 'Phụ kiện',
  price: 250000,
  condition: '92% còn mới',
  meetingSpot: 'ĐH Công nghiệp TP.HCM (IUH)',
  description: 'Balo sinh viên đa năng màu xám đen thanh lịch, ngăn chứa rộng có đệm chống sốc vừa laptop 15.6 inch. Khóa kéo mượt mà, vải trượt nước nhẹ khi đi mưa nhỏ.',
  mainImage: '/assets/prod-backpack.png',
  galleryImages: [
    '/assets/prod-backpack.png',
    '/assets/detail/backpack-detail-1.png',
    '/assets/detail/backpack-detail-2.png',
    '/assets/detail/backpack-detail-3.png',
    '/assets/detail/backpack-detail-4.png'
  ],
  detailImages: [
    '/assets/detail/backpack-detail-1.png',
    '/assets/detail/backpack-detail-2.png',
    '/assets/detail/backpack-detail-3.png',
    '/assets/detail/backpack-detail-4.png'
  ],
  quickSpecs: [
    { label: 'Tình trạng', value: '92% còn mới', icon: Leaf },
    { label: 'Kích cỡ', value: 'Laptop 15.6"', icon: BookOpen },
    { label: 'Chất liệu', value: 'Vải Oxford', icon: ShieldCheck },
    { label: 'Trọng lượng', value: '680g siêu nhẹ', icon: Calendar }
  ],
  specs: [
    { label: 'Tên sản phẩm', value: 'Balo laptop 15.6 inch đa năng', icon: Layers },
    { label: 'Kích thước', value: '44 x 30 x 14 cm', icon: HardDrive },
    { label: 'Tương thích', value: 'Laptop 14 - 15.6 inch & tập sách', icon: Monitor },
    { label: 'Chất liệu vải', value: 'Vải Oxford 900D kháng nước', icon: Layers },
    { label: 'Số ngăn chứa', value: '1 ngăn chính + 1 ngăn laptop + 3 phụ', icon: BookOpen },
    { label: 'Quai đeo', value: 'Mút đệm tổ ong thoáng khí', icon: Layers },
    { label: 'Khóa kéo', value: 'Khóa kim loại chống gỉ', icon: Cpu },
    { label: 'Trọng lượng', value: '680g nhẹ nhàng, êm lưng', icon: Laptop }
  ],
  checklist: [
    { title: 'Khóa kéo', desc: 'Trơn mượt, không kẹt răng khóa' },
    { title: 'Ngăn laptop', desc: 'Lớp đệm mút dày dặn, chống sốc' },
    { title: 'Quai đeo', desc: 'Đường may chịu lực gia cố chắc chắn' },
    { title: 'Vải ngoài', desc: 'Sạch sẽ, chống thấm nước giọt bắn' },
    { title: 'Đáy balo', desc: 'Lớp lót đáy dày chống mài mòn' },
    { title: 'Quai xách', desc: 'Quai xách bọc da êm ái' }
  ],
  seller: {
    name: 'Vũ Đức Trọng',
    studentId: '2021556',
    eduEmail: 'trongvd.iuh@iuh.edu.vn',
    phone: '0963.***.187',
    universityCode: 'ĐH Công nghiệp TP.HCM (IUH)',
    major: 'Kỹ thuật Điện tử',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    rating: 4.5,
    reviewCount: 9,
    soldCount: 14,
    bio: 'Sinh viên IUH, pass balo laptop dùng 1 kỳ do đổi qua túi xách nhỏ gọn hơn.'
  }
};

export const DEFAULT_MACBOOK_DATA: ProductItem = {
  id: CONFIG_MACBOOK.id,
  title: CONFIG_MACBOOK.title,
  category: CONFIG_MACBOOK.category,
  price: CONFIG_MACBOOK.price,
  images: CONFIG_MACBOOK.galleryImages,
  description: CONFIG_MACBOOK.description,
  condition: CONFIG_MACBOOK.condition,
  seller: {
    id: 'u_sell_2',
    name: CONFIG_MACBOOK.seller.name,
    studentId: CONFIG_MACBOOK.seller.studentId,
    avatar: CONFIG_MACBOOK.seller.avatar,
    universityCode: CONFIG_MACBOOK.seller.universityCode,
    rating: CONFIG_MACBOOK.seller.rating,
    isVerified: true,
    isPro: true
  },
  tradeType: 'sale',
  majorGroup: 'it',
  cluster: 'q10',
  status: 'available',
  createdAt: '16/04/2025',
  meetingSpot: CONFIG_MACBOOK.meetingSpot,
  likes: 128,
  views: 2563
};

// RESOLVER ĐỒNG NHẤT 100% THÔNG TIN VÀ HÌNH ẢNH SẢN PHẨM
export function resolveUnifiedProductConfig(incoming: ProductItem | null | undefined): UnifiedProductConfig {
  if (!incoming) return CONFIG_MACBOOK;

  const t = (incoming.title || '').toLowerCase();
  const id = incoming.id || '';

  if (id === 'p_feat_1' || t.includes('kinh tế vi mô') || t.includes('giáo trình') || t.includes('sách')) {
    return CONFIG_BOOK;
  }
  if (id === 'p_feat_2' || t.includes('macbook') || t.includes('laptop')) {
    return CONFIG_MACBOOK;
  }
  if (id === 'p_feat_3' || t.includes('adidas') || t.includes('giày') || t.includes('shoes')) {
    return CONFIG_SHOES;
  }
  if (id === 'p_feat_4' || t.includes('ếch') || t.includes('len') || t.includes('handmade')) {
    return CONFIG_FROG;
  }
  if (id === 'p_feat_5' || t.includes('đèn') || t.includes('lamp')) {
    return CONFIG_LAMP;
  }
  if (id === 'p_feat_6' || t.includes('balo') || t.includes('backpack')) {
    return CONFIG_BACKPACK;
  }

  // Fallback dynamic config
  return {
    id: incoming.id,
    title: incoming.title,
    category: incoming.category,
    categoryLabel: incoming.category === 'books' ? 'Sách & Giáo trình' : 'Đồ sinh viên',
    price: incoming.price,
    condition: incoming.condition || 'Còn tốt',
    meetingSpot: incoming.meetingSpot || 'Khuôn viên trường ĐH',
    description: incoming.description || `${incoming.title} còn sử dụng rất tốt.`,
    mainImage: (incoming.images && incoming.images[0]) || '/assets/prod-books.png',
    galleryImages: incoming.images && incoming.images.length > 0 ? incoming.images : ['/assets/prod-books.png'],
    detailImages: [
      '/assets/detail/book-detail-1.png',
      '/assets/detail/book-detail-2.png',
      '/assets/detail/book-detail-3.png',
      '/assets/detail/book-detail-4.png'
    ],
    quickSpecs: [
      { label: 'Tình trạng', value: incoming.condition || 'Tốt', icon: Leaf },
      { label: 'Loại', value: 'Chính hãng', icon: BookOpen },
      { label: 'Kiểm duyệt', value: 'Đã xác minh', icon: ShieldCheck },
      { label: 'Ngày đăng', value: incoming.createdAt || 'Hôm nay', icon: Calendar }
    ],
    specs: [
      { label: 'Tên sản phẩm', value: incoming.title, icon: BookOpen },
      { label: 'Tình trạng', value: incoming.condition || 'Còn tốt', icon: Leaf },
      { label: 'Địa điểm hẹn', value: incoming.meetingSpot || 'Tại trường', icon: MapPin },
      { label: 'Hình thức', value: incoming.tradeType === 'giveaway' ? 'Cho tặng 0đ' : 'Trao đổi / Bán', icon: Layers },
      { label: 'Xác minh', value: 'Tài khoản .edu.vn', icon: ShieldCheck },
      { label: 'Bảo quản', value: 'Sạch sẽ, giữ gìn', icon: HardDrive },
      { label: 'Nguồn gốc', value: 'Sinh viên dùng cá nhân', icon: Monitor },
      { label: 'Hỗ trợ', value: 'Kiểm tra đồ trực tiếp', icon: BatteryCharging }
    ],
    checklist: [
      { title: 'Ngoại hình', desc: 'Đúng như mô tả và hình ảnh cung cấp' },
      { title: 'Chức năng', desc: 'Hoạt động bình thường, không lỗi' },
      { title: 'Vệ sinh', desc: 'Được làm sạch trước khi bàn giao' },
      { title: 'Nguồn gốc', desc: 'Đồ dùng học tập sinh viên' },
      { title: 'Kiểm tra', desc: 'Cho phép kiểm tra thoải mái khi nhận' },
      { title: 'Cam kết', desc: '100% sinh viên xác thực an tâm' }
    ],
    seller: {
      name: incoming.seller?.name || 'Sinh viên UniSwap',
      studentId: incoming.seller?.studentId || '2026DBC',
      eduEmail: `${(incoming.seller?.name || 'sinhvien').toLowerCase().replace(/\s+/g, '')}@student.edu.vn`,
      phone: '0988.***.678',
      universityCode: incoming.seller?.universityCode || 'ĐHQG TP.HCM',
      major: 'Công nghệ Thông tin',
      avatar: incoming.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      rating: incoming.seller?.rating || 4.8,
      reviewCount: 20,
      soldCount: 35,
      bio: 'Sinh viên năng động, uy tín, giao dịch trực tiếp an toàn trong khuôn viên trường.'
    }
  };
}

// BẢNG TỌA ĐỘ VÀ ĐỊA CHỈ TRƯỜNG ĐẠI HỌC CHO GOOGLE MAPS GPS
interface UniLocation {
  lat: number;
  lng: number;
  address: string;
  label: string;
  query: string;
  embedUrl: string;
}

const UNIVERSITY_LOCATIONS: Record<string, UniLocation> = {
  UEH: {
    lat: 10.76008,
    lng: 106.66698,
    address: '279 Nguyễn Tri Phương, Phường 5, Quận 10, TP.HCM',
    label: 'ĐH Kinh tế TP.HCM (UEH Cơ sở B)',
    query: 'Trường+Đại+học+Kinh+tế+TP.HCM',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6548549448834!2d106.6644062748571!3d10.76098048938676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ee16d13cb23%3A0xc3b8110b42ca2e65!2zMjc5IE5ndXnhu4VuIFRyaSBQaMawxqFuZywgUGjGsOG7nW5nIDUsIFF14bqtbiAxMCwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn'
  },
  HCMUT: {
    lat: 10.77254,
    lng: 106.65784,
    address: '268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM',
    label: 'ĐH Bách Khoa TP.HCM (CS1)',
    query: 'Trường+Đại+học+Bách+Khoa+ĐHQG-HCM',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4951234907996!2d106.65773337485728!3d10.774330759275895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ec3c161a3fb%3A0xef77cd47a1cc695e!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBCw6FjaCBLaG9hIC0gxJBoUUFHTPQ!5e0!3m2!1svn!2svn!4v1700000000000!5m2!1svn!2svn'
  },
  HCMUS: {
    lat: 10.76313,
    lng: 106.68233,
    address: '227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM',
    label: 'ĐH Khoa học Tự nhiên TP.HCM',
    query: 'Trường+Đại+học+Khoa+học+Tự+nhiên+ĐHQG-HCM',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5135995777176!2d106.68265087588383!3d10.762959959288597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1c06f4e1dd%3A0x43900f1d4539a3d!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBLaG9hIGjhu4vdCBUựIE5ow6JuIC0gxJDhuqFpIGjhu4tjIFF14buRYyBnaWEgVFAuSENN!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s'
  },
  UIT: {
    lat: 10.87023,
    lng: 106.80318,
    address: 'Khu phố 6, Phường Linh Trung, TP. Thủ Đức, TP.HCM',
    label: 'ĐH Công nghệ Thông tin (UIT - ĐHQG)',
    query: 'Trường+Đại+học+Công+nghệ+Thông+tin+ĐHQG-HCM',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.2312404179377!2d106.80059957485859!3d10.870008889284562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8f3c3ea6!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTQ!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn'
  },
  SGU: {
    lat: 10.75991,
    lng: 106.67822,
    address: '273 An Dương Vương, Phường 3, Quận 5, TP.HCM',
    label: 'ĐH Sài Gòn (SGU Cơ sở chính)',
    query: 'Trường+Đại+học+Sài+Gòn',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6433290623347!2d106.67564027485719!3d10.761868589385873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3aa6d7%3A0x6b499e4b7b2049b1!2zMjczIEFuIETGsMahbmcgVsawxqFuZywgUGjGsOG7nW5nIDMsIFF14bqtbiA1LCBI4buNYyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn'
  },
  FTU2: {
    lat: 10.80348,
    lng: 106.71424,
    address: '15 Đường D5, Phường 25, Bình Thạnh, TP.HCM',
    label: 'ĐH Ngoại thương Cơ sở 2 - TP.HCM',
    query: 'Trường+Đại+học+Ngoại+thương+Cơ+sở+II',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424171249679!2d106.71129527485741!3d10.806344589367302!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528a459cb43ab%3A0x6c3d8cf1f00cb100!2zQ8ahIHPhuEDigJIgSUkgLSBUcsaw4budbmcgxJDhuqFpIGjhu41jIE5nb-G6oWkgVGjGsMahbmc!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn'
  },
  IUH: {
    lat: 10.82224,
    lng: 106.68752,
    address: '12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM',
    label: 'ĐH Công nghiệp TP.HCM (IUH)',
    query: 'Trường+Đại+học+Công+nghiệp+TP.HCM',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456789!2d106.6882!3d10.8221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528e1076587c9%3A0x2a2dda9d95f877c8!2zMTIgTmd1eeG7hW4gVsSDbiBC4bqjbywgUGjGsOG7nW5nIDQsIEfDsiBW4bqkcCwgVGjDoG5oIHBo4buRIEhີ່ມIENowm5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2svn!4v1710000000000!5m2!1svi!2svn'
  },
  UPES1: {
    lat: 10.75825,
    lng: 106.66112,
    address: '639 Nguyễn Trãi, Phường 11, Quận 5, TP.HCM',
    label: 'ĐH Sư phạm TDTT TP.HCM',
    query: 'Trường+Đại+học+Sư+phạm+Thể+dục+Thể+thao+TP.HCM',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.530711929007!2d106.65756187533441!3d10.752530059300645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752eeec37b469b%3A0xc480a423f66c891a!2zUTYzOSwgxJAuIE5ndXnhuecgVHLDoyBQLCBXdSBuZyA1LCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s'
  }
};

function getUniversityLocation(meetingSpot: string, universityCode?: string) {
  const code = (universityCode || '').toUpperCase();
  const spot = meetingSpot || '';
  if (code.includes('UEH') || spot.includes('Kinh tế TP.HCM') || spot.includes('UEH') || code.includes('NEU') || spot.includes('Kinh tế Quốc dân')) {
    return UNIVERSITY_LOCATIONS.UEH;
  }
  if (code.includes('HCMUT') || spot.includes('Bách Khoa')) {
    return UNIVERSITY_LOCATIONS.HCMUT;
  }
  if (code.includes('HCMUS') || spot.includes('Khoa học Tự nhiên')) {
    return UNIVERSITY_LOCATIONS.HCMUS;
  }
  if (code.includes('UIT') || spot.includes('Công nghệ Thông tin') || spot.includes('KTX Khu B')) {
    return UNIVERSITY_LOCATIONS.UIT;
  }
  if (code.includes('SGU') || spot.includes('Sài Gòn')) {
    return UNIVERSITY_LOCATIONS.SGU;
  }
  if (code.includes('TDTT') || spot.includes('TDTT') || code.includes('UPES')) {
    return UNIVERSITY_LOCATIONS.UPES1;
  }
  if (code.includes('FTU') || spot.includes('Ngoại thương')) {
    return UNIVERSITY_LOCATIONS.FTU2;
  }
  if (code.includes('IUH') || spot.includes('Công nghiệp')) {
    return UNIVERSITY_LOCATIONS.IUH;
  }
  return UNIVERSITY_LOCATIONS.UEH;
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen = true,
  onClose,
  product: incomingProduct,
  currentUser: _currentUser,
  onOpenChat,
  onToggleLike,
  isLiked = false,
  isStandalonePage = false
}) => {
  // Lấy cấu hình sản phẩm đồng nhất 100%
  const config = resolveUnifiedProductConfig(incomingProduct);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedCustomImage, setSelectedCustomImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'condition' | 'reviews' | 'qa'>('info');
  const [localLiked, setLocalLiked] = useState(isLiked);

  // Google Maps & GPS States
  const destLocation = getUniversityLocation(config.meetingSpot, config.seller.universityCode);
  const [mapMode, setMapMode] = useState<'google' | 'campus'>('google');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'active' | 'denied'>('idle');
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | null>(null);

  const handleGetGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('denied');
      return;
    }
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });
        setGpsStatus('active');
        const dist = calculateDistanceKm(lat, lng, destLocation.lat, destLocation.lng);
        setDistanceKm(dist);
        setEstimatedMinutes(Math.max(3, Math.round((dist / 25) * 60)));
      },
      (err) => {
        console.warn('Geolocation error/denied:', err);
        setGpsStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleOpenGoogleMapsDirections = () => {
    // Nếu có GPS người mua thì dùng lat,lng. Nếu chưa thì dùng 'My Location' để Google Maps tự bật GPS của thiết bị
    const originParam = userCoords ? `${userCoords.lat},${userCoords.lng}` : 'My Location';
    const destinationParam = `${destLocation.lat},${destLocation.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originParam)}&destination=${encodeURIComponent(destinationParam)}&travelmode=two_wheeler`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen && !isStandalonePage) return null;

  const currentMainImage = selectedCustomImage || config.galleryImages[activeImageIdx] || config.mainImage;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCustomImage(null);
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : config.galleryImages.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCustomImage(null);
    setActiveImageIdx((prev) => (prev < config.galleryImages.length - 1 ? prev + 1 : 0));
  };

  const content = (
    <div 
      className="bg-white rounded-2xl border border-gray-200/90 shadow-sm relative font-sans text-gray-800"
      style={{
        width: '1024px',
        maxWidth: '100%',
        boxSizing: 'border-box',
        padding: '14px 16px',
        margin: '0 auto',
        height: '525px',
        maxHeight: '525px',
        overflow: 'hidden'
      }}
    >
      {/* Optional Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 z-40 w-7 h-7 rounded-full bg-white/90 hover:bg-gray-100 text-gray-600 shadow-xs flex items-center justify-center transition-all cursor-pointer border border-gray-200"
          aria-label="Đóng chi tiết sản phẩm"
          title="Đóng"
        >
          <X className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>
      )}

      {/* ========================================================================= */}
      {/* MASTER 2-COLUMN LAYOUT: Left (Gallery, Info, Specs, Checklist) + Right (Big Map) */}
      {/* ========================================================================= */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '665px 315px',
          gap: '14px',
          alignItems: 'start',
          height: '100%'
        }}
      >
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: Top (Gallery + Info) & Bottom (Tabs + Specs & Checklist)   */}
        {/* ======================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          
          {/* TOP HALF: Gallery (Left 255px) + Product Info (Right) */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '255px 1fr',
              gap: '14px',
              alignItems: 'start'
            }}
          >
            {/* Gallery & Hình ảnh chi tiết đồng nhất (Left ~255px) */}
            <div style={{ width: '255px' }}>
              {/* Main Image Container */}
              <div 
                className="relative rounded-xl overflow-hidden bg-[#f6f7f5] border border-gray-100 shadow-2xs group flex items-center justify-center"
                style={{ width: '255px', height: '146px' }}
              >
                <img 
                  src={currentMainImage} 
                  alt={config.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                />

                {/* Campus Check Badge top-left */}
                <div className="absolute top-1.5 left-1.5 bg-[#00513D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-2.5 h-2.5 stroke-[2.5]" />
                  <span>Campus Check</span>
                </div>

                {/* Left Arrow Button */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-5.5 h-5.5 rounded-full bg-white/95 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronLeft className="w-3 h-3 stroke-[2.5]" />
                </button>

                {/* Right Arrow Button */}
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5.5 h-5.5 rounded-full bg-white/95 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                </button>

                {/* Counter Badge bottom-right */}
                <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[8.5px] font-semibold px-1.5 py-0.2 rounded">
                  {selectedCustomImage ? 'Chi tiết' : `${activeImageIdx + 1}/${config.galleryImages.length}`}
                </div>
              </div>

              {/* Hình ảnh chi tiết ĐỒNG NHẤT 100% VỚI SẢN PHẨM (Phóng to để bù khoảng trống) */}
              <div style={{ marginTop: '6px' }}>
                <h3 className="text-[10px] font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Hình ảnh chi tiết
                </h3>
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '5px'
                  }}
                >
                  {config.detailImages.map((img, idx) => {
                    const isSelected = currentMainImage === img;
                    return (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedCustomImage(img)}
                        className={`rounded-lg overflow-hidden bg-gray-100 border transition-all cursor-pointer ${
                          isSelected ? 'border-2 border-[#00513D] shadow-xs' : 'border-gray-200 hover:border-gray-400'
                        }`}
                        style={{ height: '48px' }}
                      >
                        <img src={img} alt={`Detail ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Product Summary & Actions (Right ~400px) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              
              <div>
                {/* Title */}
                <h1 className="text-[17px] font-black text-gray-900 tracking-tight leading-tight">
                  {config.title}
                </h1>

                {/* Location */}
                <div className="flex items-center gap-1 text-[10.5px] text-gray-500 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#00513D] shrink-0" />
                  <span>{config.meetingSpot}</span>
                </div>
              </div>

              {/* Price & Negotiation Badge */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[20px] font-black text-[#00513D] tracking-tight leading-none">
                  {config.price === 0 ? 'Miễn phí' : `${config.price.toLocaleString('vi-VN')}đ`}
                </span>
                <span className="bg-[#eef7ee] text-[#2e7d32] text-[9px] font-bold px-1.5 py-0.2 rounded">
                  {config.price === 0 ? 'Tặng đồ 0đ' : 'Thương lượng'}
                </span>
              </div>

              {/* 4 Quick Specs in 1 Row - ĐỒNG NHẤT THEO SẢN PHẨM */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '5px',
                  marginTop: '1px'
                }}
              >
                {config.quickSpecs.map((qs, qidx) => {
                  const QIcon = qs.icon;
                  return (
                    <div key={qidx} className="bg-[#f8faf8] border border-gray-100 rounded-lg p-1.5 flex items-center gap-1">
                      <div className="w-4 h-4 rounded bg-emerald-100/70 text-[#00513D] flex items-center justify-center shrink-0">
                        <QIcon className="w-2.5 h-2.5 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[7.5px] text-gray-400 leading-none">{qs.label}</div>
                        <div className="text-[9.5px] font-bold text-gray-800 truncate mt-0.5">{qs.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Description */}
              <p className="text-[10px] text-gray-600 leading-relaxed mt-0.5 line-clamp-2">
                {config.description}
              </p>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenChat) {
                      onOpenChat(incomingProduct || DEFAULT_MACBOOK_DATA);
                    }
                  }}
                  className="flex-1 bg-[#00513D] hover:bg-[#073e2b] text-white font-bold text-[11px] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat với người bán</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLocalLiked(!localLiked);
                    if (onToggleLike) onToggleLike(config.id);
                  }}
                  className="border border-gray-200 hover:bg-gray-50 text-gray-800 font-semibold text-[10.5px] py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Heart className={`w-3.5 h-3.5 ${localLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`} />
                  <span>Thêm vào yêu thích</span>
                </button>

                <button
                  type="button"
                  className="w-7 h-7 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0"
                  aria-label="Tùy chọn khác"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* BOTTOM HALF: Tabs & 2 Sub-columns (THÔNG TIN & CHECKLIST Ở BÊN TRÁI) */}
          <div style={{ borderTop: '1px solid #f1f3f1', paddingTop: '5px' }}>
            
            {/* Tabs Header */}
            <div className="flex items-center gap-5 border-b border-gray-100 text-[10.5px] font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`pb-1 relative transition-colors cursor-pointer ${
                  activeTab === 'info' ? 'text-[#00513D] font-bold border-b-2 border-[#00513D]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Thông tin chi tiết
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('condition')}
                className={`pb-1 relative transition-colors cursor-pointer ${
                  activeTab === 'condition' ? 'text-[#00513D] font-bold border-b-2 border-[#00513D]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Tình trạng sản phẩm
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`pb-1 relative transition-colors cursor-pointer ${
                  activeTab === 'reviews' ? 'text-[#00513D] font-bold border-b-2 border-[#00513D]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Đánh giá ({config.seller.reviewCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                className={`pb-1 relative transition-colors cursor-pointer ${
                  activeTab === 'qa' ? 'text-[#00513D] font-bold border-b-2 border-[#00513D]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Hỏi đáp (5)
              </button>
            </div>

            {/* Tab Content: 2 Columns Grid (Thông tin & Checklist ĐỒNG NHẤT) */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                alignItems: 'start',
                paddingTop: '6px'
              }}
            >
              
              {/* Sub-col 1: Thông tin sản phẩm */}
              <div>
                <h3 className="text-[9.5px] font-bold text-gray-900 uppercase tracking-wider mb-0.5">
                  Thông tin sản phẩm
                </h3>
                <div className="space-y-0.5 text-[9px]">
                  {config.specs.map((item, idx) => {
                    const Icon = item.icon || Laptop;
                    return (
                      <div key={idx} className="flex items-center justify-between py-0.5 border-b border-gray-50 leading-tight">
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Icon className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        <span className="font-semibold text-gray-800 text-right truncate max-w-[155px]">{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-col 2: Checklist tình trạng */}
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
                  {config.checklist.map((c, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 py-0.5 border-b border-gray-50 text-[9px] leading-tight">
                      <div className="w-3 h-3 rounded-full bg-[#00b074] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                      <span className="font-semibold text-gray-800 shrink-0">{c.title}</span>
                      <span className="text-gray-400 text-right flex-1 truncate text-[8.5px]">{c.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Warning Note */}
                <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-md p-1.5 flex items-start gap-1 text-[8px] text-[#92400e] leading-snug">
                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    Đây là thông tin do người bán cung cấp, vui lòng kiểm tra kỹ trước khi giao dịch.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: BẢN ĐỒ TO + TÍCH HỢP GOOGLE MAPS & CHỈ ĐƯỜNG GPS THEO YÊU CẦU */}
        {/* ======================================================================= */}
        <div className="bg-[#fbfdfb] rounded-xl border border-gray-200/90 shadow-2xs p-2.5 h-full flex flex-col justify-between">
          
          {/* Header bản đồ & Bộ chuyển đổi góc nhìn */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-[11px] text-gray-900 leading-tight">
                <div className="w-5 h-5 rounded-full bg-[#00513D]/10 text-[#00513D] flex items-center justify-center shrink-0">
                  <MapPin className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Địa điểm giao nhận</span>
              </div>
              
              {/* Nút chuyển chế độ bản đồ */}
              <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-[8px] font-bold">
                <button
                  type="button"
                  onClick={() => setMapMode('google')}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    mapMode === 'google' ? 'bg-[#00513D] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Google Maps
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode('campus')}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    mapMode === 'campus' ? 'bg-[#00513D] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sơ đồ trường
                </button>
              </div>
            </div>

            <p className="text-[9px] text-gray-600 leading-tight mt-1 truncate">
              • Trong khuôn viên <strong className="text-gray-900">{config.meetingSpot}</strong>
            </p>

            {/* Thanh đo khoảng cách GPS thời gian thực */}
            <div className="bg-[#eef7f2] border border-emerald-100 rounded-lg px-2 py-1 flex items-center justify-between gap-1.5 mt-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <LocateFixed className={`w-3.5 h-3.5 shrink-0 ${gpsStatus === 'active' ? 'text-emerald-600 animate-pulse' : 'text-gray-400'}`} />
                <div className="min-w-0">
                  <div className="font-bold text-[#00513D] text-[9px] leading-tight truncate">
                    {gpsStatus === 'active' 
                      ? `Cách bạn: ~${distanceKm} km (khoảng ${estimatedMinutes} phút)`
                      : gpsStatus === 'loading'
                      ? 'Đang dò GPS của bạn...'
                      : 'Định vị GPS của bạn'}
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
                {gpsStatus === 'active' ? 'Làm mới GPS' : 'Bật GPS'}
              </button>
            </div>
          </div>

          {/* Khung bản đồ lớn (Bản đồ tương tác trực tiếp hoặc Sơ đồ) */}
          <div className="relative rounded-xl overflow-hidden border border-gray-200/90 bg-gray-100 my-1.5 flex-1 min-h-[250px] group shadow-inner">
            {mapMode === 'google' ? (
              <InteractiveMap
                lat={destLocation.lat}
                lng={destLocation.lng}
                label={destLocation.label}
                address={destLocation.address}
                userCoords={userCoords}
                onOpenDirections={handleOpenGoogleMapsDirections}
              />
            ) : (
              <div className="relative w-full h-full min-h-[250px]">
                <img 
                  src="/assets/detail/campus-map.png" 
                  alt="Bản đồ giao nhận khuôn viên" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />

                {/* Pin vị trí trung tâm nhấp nháy */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#00513D] border-2 border-white shadow-md"></span>
                  </span>
                  <div className="bg-[#00513D] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md mt-1 whitespace-nowrap">
                    Điểm hẹn giao nhận
                  </div>
                </div>

                {/* Badge khuôn viên trường góc dưới trái */}
                <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs text-gray-800 text-[8.5px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-gray-200 flex items-center gap-1 z-10 pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{destLocation.label}</span>
                </div>

                {/* Nút mở bản đồ lớn góc dưới phải */}
                <button 
                  type="button"
                  onClick={handleOpenGoogleMapsDirections}
                  className="absolute bottom-2 right-2 bg-[#00513D] hover:bg-[#073e2b] text-white text-[8.5px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1 transition-all cursor-pointer z-10"
                  title="Mở Google Maps chỉ đường"
                >
                  <span>Mở bản đồ lớn</span>
                  <span className="text-[9.5px]">↗</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer thông tin điểm hẹn & Nút chỉ đường GPS nổi bật */}
          <div className="space-y-1 pt-1 border-t border-gray-100">
            <div className="bg-[#fffbeb] border border-amber-200/80 rounded-md p-1.5 text-[8px] text-[#92400e] leading-snug flex items-center gap-1.5 shadow-3xs">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 fill-amber-200 shrink-0" />
              <span><strong>Gợi ý an toàn:</strong> Giao dịch tại sảnh thư viện, căn tin hoặc cổng trường vào ban ngày.</span>
            </div>

            {/* Nút chỉ đường Google Maps từ GPS của người mua */}
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
  );

  // If used as standalone page
  if (isStandalonePage) {
    return (
      <div className="w-full flex items-center justify-center py-2 sm:py-3 px-2 sm:px-4">
        {content}
      </div>
    );
  }

  // If used as Modal Popup
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="animate-in zoom-in-95 duration-200"
        style={{ width: '1024px', maxWidth: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};

export default ProductDetailModal;
