import {PRIMARY_CAMPUS} from "../../shared/campus";
import { University, ProductItem, User } from '../types';

export const UNIVERSITIES: University[] = ([
  {...PRIMARY_CAMPUS,spots:[...PRIMARY_CAMPUS.spots]},
  {
    id: 'uit',
    name: 'ĐH Công nghệ Thông tin (UIT - ĐHQG)',
    code: 'UIT',
    domain: 'uit.edu.vn',
    cluster: 'lang-dh',
    spots: ['Sảnh Tòa E', 'Thư viện tầng 1', 'Canteen UIT', 'Trạm xe bus UIT']
  },
  {
    id: 'hcmut',
    name: 'ĐH Bách Khoa TP.HCM (HCMUT)',
    code: 'HCMUT',
    domain: 'hcmut.edu.vn',
    cluster: 'lang-dh',
    spots: ['Sảnh Tòa H6 (CS2)', 'Cổng 1 Lý Thường Kiệt (CS1)', 'Canteen B6', 'Sân bóng KTX']
  },
  {
    id: 'hcmus',
    name: 'ĐH Khoa học Tự nhiên (HCMUS)',
    code: 'HCMUS',
    domain: 'hcmus.edu.vn',
    cluster: 'q5',
    spots: ['Sảnh Tòa F Nguyễn Văn Cừ', 'Nhà xe CS Linh Trung', 'Canteen KHTN']
  },
  {
    id: 'ueh',
    name: 'ĐH Kinh tế TP.HCM (UEH)',
    code: 'UEH',
    domain: 'ueh.edu.vn',
    cluster: 'q10',
    spots: ['Cơ sở B (279 Nguyễn Tri Phương)', 'Cơ sở A (59C Nguyễn Đình Chiểu)', 'Thư viện thông minh UEH']
  },
  {
    id: 'sgu',
    name: 'ĐH Sài Gòn (SGU)',
    code: 'SGU',
    domain: 'sgu.edu.vn',
    cluster: 'q5',
    spots: ['Sân cờ An Dương Vương', 'Canteen CS1', 'Cổng phụ Nguyễn Trãi']
  },
  {
    id: 'ump',
    name: 'ĐH Y Dược TP.HCM (UMP)',
    code: 'UMP',
    domain: 'ump.edu.vn',
    cluster: 'q10',
    spots: ['Sảnh Đại giảng đường Hồng Bàng', 'Thư viện Y Dược', 'Canteen KTX Ngô Gia Tự']
  },
  {
    id: 'tdtu',
    name: 'ĐH Tôn Đức Thắng (TDTU)',
    code: 'TDTU',
    domain: 'tdtu.edu.vn',
    cluster: 'nam-sai-gon',
    spots: ['Thư viện Truyền cảm hứng', 'Canteen Tòa C', 'Khu vực KTX Tân Phong']
  },
  {
    id: 'hutech',
    name: 'ĐH Công nghệ TP.HCM (HUTECH)',
    code: 'HUTECH',
    domain: 'hutech.edu.vn',
    cluster: 'binh-thanh',
    spots: ['Sảnh Điện Biên Phủ', 'Khu tự học tầng 4', 'Canteen khu E']
  }
] satisfies University[]).sort((a,b)=>a.name.localeCompare(b.name,"vi"));

export const CURRENT_USER: User = {
  id: 'usr_me',
  name: 'Nguyễn Văn Hoàng',
  email: '21520098@gm.uit.edu.vn',
  studentId: '21520098',
  universityCode: 'UIT',
  universityName: 'ĐH Công nghệ Thông tin - ĐHQG-HCM',
  faculty: 'Khoa Kỹ thuật Phần mềm',
  year: 'K16 (Năm 4)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  isVerified: true,
  tier: 'hunter_pro',
  pushCredits: 2,
  rating: 4.9,
  dealCount: 14,
  role: 'student'
};

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: 'p1',
    title: 'Giáo trình Cấu trúc dữ liệu & Giải thuật (Kèm bộ đề thi có giải)',
    price: 35000,
    tradeType: 'sale',
    category: 'books',
    majorGroup: 'it',
    description: 'Sách in rõ nét, đã highlight các phần trọng tâm thi cuối kỳ của thầy T. Tặng kèm tập photo đề thi 3 năm gần nhất có lời giải chi tiết. Pass nhanh để dọn bàn học.',
    condition: '95% (Có ghi chú chì)',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 's1',
      name: 'Trần Minh Đức',
      studentId: '22520311',
      universityCode: 'UIT',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      isVerified: true,
      isPro: true
    },
    cluster: 'lang-dh',
    meetingSpot: 'Thư viện UIT tầng 1 hoặc KTX Khu B (Tòa B4)',
    createdAt: '10 phút trước',
    isUrgent: true,
    isPushed: true,
    pushedAt: 'Vừa đẩy',
    status: 'available',
    views: 142,
    likes: 18
  },
  {
    id: 'p2',
    title: 'Máy tính Casio FX-580VN X chính hãng Bitex (Màu đen)',
    price: 320000,
    tradeType: 'sale',
    category: 'electronics',
    majorGroup: 'general',
    description: 'Máy mua ở Fahasa, còn nguyên tem Bitex, nắp đậy đầy đủ. Phím bấm nảy, màn hình sáng đẹp không đốm. Bao test thoải mái trước cổng KTX.',
    condition: '98% như mới',
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 's2',
      name: 'Lê Thu Thảo',
      studentId: '2311542',
      universityCode: 'HCMUT',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      rating: 4.8,
      isVerified: true,
      isPro: false
    },
    cluster: 'lang-dh',
    meetingSpot: 'Sảnh Tòa H6 ĐH Bách Khoa CS2 (Làng ĐH)',
    createdAt: '35 phút trước',
    status: 'available',
    views: 290,
    likes: 34
  },
  {
    id: 'p3',
    title: '[TẶNG 0Đ] Trọn bộ tài liệu ôn thi Triết học Mác-Lênin & Kinh tế chính trị',
    price: 0,
    tradeType: 'giveaway',
    category: 'books',
    majorGroup: 'general',
    description: 'Mình vừa thi qua môn 8.5 điểm nên pass lại 0 đồng cho bạn nào khóa dưới cần. Gồm 2 quyển giáo trình + tập đề cương ôn tập tổng hợp 60 câu hỏi tự luận.',
    condition: 'Dùng tốt',
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 's3',
      name: 'Võ Hoàng Quân',
      studentId: '31221021',
      universityCode: 'UEH',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      isVerified: true,
      isPro: false
    },
    cluster: 'q10',
    meetingSpot: 'Cơ sở B UEH (279 Nguyễn Tri Phương, Q.10)',
    createdAt: '1 giờ trước',
    status: 'available',
    views: 450,
    likes: 67
  },
  {
    id: 'p4',
    title: 'Quạt đứng lỡ Senko 3 cánh gió êm - Pass gấp dọn phòng trọ',
    price: 85000,
    tradeType: 'sale',
    category: 'dorm',
    majorGroup: 'general',
    description: 'Quạt chạy êm ru, 3 cấp tốc độ, tuốc năng quay đều. Mình trả phòng trọ về quê nên thanh lý gấp trong chiều nay.',
    condition: 'Hoạt động tốt',
    images: [
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 's4',
      name: 'Đặng Tuấn Kiệt',
      studentId: '20120155',
      universityCode: 'HCMUS',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rating: 4.7,
      isVerified: true,
      isPro: false
    },
    cluster: 'q5',
    meetingSpot: 'Cổng sau KHTN (Đường An Dương Vương, Q.5)',
    createdAt: '2 giờ trước',
    isUrgent: true,
    status: 'available',
    views: 180,
    likes: 12
  },
  {
    id: 'p5',
    title: '[ĐỔI ĐỒ] Đổi Giáo trình Kinh tế Vi mô lấy Kinh tế Vĩ mô',
    price: 0,
    tradeType: 'swap',
    swapFor: 'Giáo trình Kinh tế Vĩ mô (NXB ĐHQG hoặc Kinh Tế)',
    category: 'books',
    majorGroup: 'economics',
    description: 'Mình học xong Vi mô kỳ này rồi, kỳ tới học Vĩ mô. Bạn nào có sách Vĩ mô muốn đổi thì giao lưu nhé, sách mình giữ rất kỹ không quăn mép.',
    condition: '95% sạch đẹp',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 's5',
      name: 'Nguyễn Mai Phương',
      studentId: '31231045',
      universityCode: 'SGU',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      isVerified: true,
      isPro: false
    },
    cluster: 'q5',
    meetingSpot: 'Sân cờ ĐH Sài Gòn (Cơ sở chính)',
    createdAt: '3 giờ trước',
    status: 'available',
    views: 95,
    likes: 9
  },
  {
    id: 'p6',
    title: '[CHO MƯỢN] Áo Vest đen + Cà vạt nam (Size L) thuyết trình đồ án',
    price: 25000,
    tradeType: 'borrow',
    borrowDuration: 'Mượn 1–2 ngày',
    category: 'fashion',
    majorGroup: 'general',
    description: 'Vest may phom chuẩn, sạch sẽ thơm tho. Dành cho các bạn cần mặc bảo vệ đồ án tốt nghiệp hoặc thuyết trình môn học mà không muốn tốn tiền triệu mua mới. Cọc thẻ SV.',
    condition: 'Đã giặt ủi sạch sẽ',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 's6',
      name: 'Phạm Minh Khang',
      studentId: '52000889',
      universityCode: 'TDTU',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      isVerified: true,
      isPro: true
    },
    cluster: 'nam-sai-gon',
    meetingSpot: 'Thư viện Tôn Đức Thắng (Q.7)',
    createdAt: '5 giờ trước',
    status: 'available',
    views: 310,
    likes: 42
  },
  {
    id: 'p7',
    title: 'Bảng vẽ điện tử Wacom One Small (CTL-472) - Fullbox',
    price: 450000,
    tradeType: 'sale',
    category: 'electronics',
    majorGroup: 'architecture',
    description: 'Bảng vẽ cho dân thiết kế, đồ họa, vẽ minh họa hoặc dạy học online. Còn hộp, cáp nối, bút cảm ứng và ngòi dự phòng chưa xài tới.',
    condition: '98% không trầy xước',
    images: [
      'https://images.unsplash.com/photo-1561998338-13ad7883b20f?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 's7',
      name: 'Bùi Gia Huy',
      studentId: '21112004',
      universityCode: 'HUTECH',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      rating: 4.9,
      isVerified: true,
      isPro: false
    },
    cluster: 'binh-thanh',
    meetingSpot: 'Sảnh Điện Biên Phủ HUTECH',
    createdAt: '6 giờ trước',
    status: 'available',
    views: 220,
    likes: 19
  },
  {
    id: 'p8',
    title: 'Áo Blouse trắng sinh viên Y Dược (Nam size M)',
    price: 45000,
    tradeType: 'sale',
    category: 'fashion',
    majorGroup: 'medical',
    description: 'Vải kaki cotton mát, thấm hút mồ hôi, thêu logo UMP chuẩn phòng khám thực tập. Đã giặt sạch tinh.',
    condition: '90%',
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      id: 's8',
      name: 'Ngô Thanh Hà',
      studentId: '21510109',
      universityCode: 'UMP',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      isVerified: true,
      isPro: false
    },
    cluster: 'q10',
    meetingSpot: 'Cổng Bệnh viện ĐHYD hoặc KTX Ngô Gia Tự',
    createdAt: '1 ngày trước',
    status: 'available',
    views: 165,
    likes: 21
  }
];
