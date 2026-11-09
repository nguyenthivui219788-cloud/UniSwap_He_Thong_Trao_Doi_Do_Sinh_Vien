// =====================================================================
// FILE DỮ LIỆU DANH MỤC & DANH MỤC CON (CHO SINH VIÊN TP.HCM)
// TẤT CẢ ẢNH VÀ TÊN SẢN PHẨM KHỚP 1:1, CÓ ĐẦY ĐỦ DANH MỤC CON
// =====================================================================

export interface SubCategoryItem {
  id: string;
  name: string;
  count?: string;
}

export interface FilterGroupOption {
  id: string;
  label: string;
}

export interface FilterGroup {
  title: string;
  options: FilterGroupOption[];
}

export interface SubCategoryConfig {
  categoryName: string;
  subcategories: SubCategoryItem[];
  filterGroups?: FilterGroup[];
}

export interface SidebarCategory {
  id: string;
  name: string;
  count: string | null;
  totalNum: number;
  iconName: "LayoutGrid" | "BookOpen" | "Laptop" | "Home" | "Shirt" | "Activity" | "HeartHandshake" | "PenTool" | "Grid";
}

export interface FeaturedCategory {
  id: string;
  name: string;
  count: string;
  image: string;
  bgColor?: string;
}

export interface FeaturedProduct {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  title: string;
  school: string;
  price: number;
  image: string;
  badge: string | null;
  categoryTag: string;
  rating: number;
}

export interface CatalogItemTemplate {
  title: string;
  price: number;
  tag: string;
  image: string;
  subcategoryId?: string;
}

// 1. Số lượng chính xác theo từng danh mục (Đã giảm chuẩn 5.000 món đồ để MySQL nhẹ tối ưu)
export const CATEGORY_TOTALS: Record<string, number> = {
  all: 5000,
  books: 1290,
  tech: 801,
  dorm: 523,
  fashion: 1039,
  sports: 353,
  handmade: 185,
  study: 659,
  other: 150
};

// 2. CẤU HÌNH DANH MỤC CON KHỚP HOÀN TOÀN THEO ẢNH 1, 2, 3, 4
export const CATEGORY_SUBCATEGORIES: Record<string, SubCategoryConfig> = {
  "books": {
    "categoryName": "Sách & giáo trình",
    "subcategories": [
      {
        "id": "all",
        "name": "Tất cả sách & giáo trình",
        "count": "1.290"
      },
      {
        "id": "cntt",
        "name": "Công nghệ thông tin",
        "count": "328"
      },
      {
        "id": "kinhte",
        "name": "Kinh tế – Quản trị kinh doanh",
        "count": "443"
      },
      {
        "id": "kythuat",
        "name": "Kỹ thuật – Cơ khí – Điện",
        "count": "219"
      },
      {
        "id": "ngonngu",
        "name": "Ngôn ngữ (TOEIC, IELTS...)",
        "count": "181"
      },
      {
        "id": "nganh_khac",
        "name": "Ngành khác (Y dược, Luật, Sư phạm)",
        "count": "119"
      }
    ],
    "filterGroups": [
      {
        "title": "Loại sách",
        "options": [
          {
            "id": "all",
            "label": "Tất cả loại sách"
          },
          {
            "id": "giao_trinh",
            "label": "Giáo trình chính thức"
          },
          {
            "id": "tham_khao",
            "label": "Sách tham khảo"
          },
          {
            "id": "tai_lieu",
            "label": "Tài liệu và vở ghi"
          },
          {
            "id": "de_thi",
            "label": "Đề thi, tài liệu ôn tập"
          }
        ]
      },
      {
        "title": "Tình trạng",
        "options": [
          {
            "id": "all",
            "label": "Tất cả tình trạng"
          },
          {
            "id": "moi",
            "label": "Gần như mới (99%)"
          },
          {
            "id": "tot",
            "label": "Đã sử dụng, còn tốt"
          },
          {
            "id": "ghi_chu",
            "label": "Có ghi chú hoặc hao mòn"
          }
        ]
      }
    ]
  },
  "tech": {
    "categoryName": "Đồ công nghệ",
    "subcategories": [
      {
        "id": "all",
        "name": "Tất cả đồ công nghệ",
        "count": "801"
      },
      {
        "id": "laptop",
        "name": "Laptop, máy tính bàn",
        "count": "279"
      },
      {
        "id": "phone",
        "name": "Điện thoại, máy tính bảng",
        "count": "190"
      },
      {
        "id": "audio",
        "name": "Tai nghe, loa",
        "count": "150"
      },
      {
        "id": "casio",
        "name": "Máy tính Casio",
        "count": "69"
      },
      {
        "id": "phukien",
        "name": "Phụ kiện điện tử",
        "count": "113"
      }
    ],
    "filterGroups": [
      {
        "title": "Thương hiệu",
        "options": [
          {
            "id": "all",
            "label": "Tất cả thương hiệu"
          },
          {
            "id": "apple",
            "label": "Apple"
          },
          {
            "id": "asus",
            "label": "ASUS"
          },
          {
            "id": "dell",
            "label": "Dell"
          },
          {
            "id": "hp",
            "label": "HP"
          },
          {
            "id": "lenovo",
            "label": "Lenovo"
          },
          {
            "id": "casio",
            "label": "Casio"
          },
          {
            "id": "sony_logi",
            "label": "Sony / Logitech"
          }
        ]
      }
    ]
  },
  "dorm": {
    "categoryName": "Đồ phòng trọ",
    "subcategories": [
      {
        "id": "all",
        "name": "Tất cả đồ phòng trọ",
        "count": "523"
      },
      {
        "id": "banghe",
        "name": "Bàn ghế, kệ, tủ",
        "count": "172"
      },
      {
        "id": "den_quat",
        "name": "Đèn bàn, quạt",
        "count": "129"
      },
      {
        "id": "bep",
        "name": "Đồ nhà bếp",
        "count": "106"
      },
      {
        "id": "vesinh",
        "name": "Đồ vệ sinh, lưu trữ",
        "count": "64"
      },
      {
        "id": "giadung",
        "name": "Thiết bị gia dụng",
        "count": "52"
      }
    ],
    "filterGroups": [
      {
        "title": "Nhận hàng",
        "options": [
          {
            "id": "all",
            "label": "Tất cả hình thức"
          },
          {
            "id": "truong",
            "label": "Nhận tại trường"
          },
          {
            "id": "ktx",
            "label": "Ký túc xá"
          },
          {
            "id": "gan_do",
            "label": "Khu vực gần đó"
          }
        ]
      }
    ]
  },
  "fashion": {
    "categoryName": "Thời trang",
    "subcategories": [
      {
        "id": "all",
        "name": "Tất cả thời trang",
        "count": "1.039"
      },
      {
        "id": "ao_quan",
        "name": "Áo, quần",
        "count": "375"
      },
      {
        "id": "ao_khoac",
        "name": "Áo khoác, hoodie",
        "count": "257"
      },
      {
        "id": "giay_dep",
        "name": "Giày, dép",
        "count": "190"
      },
      {
        "id": "balo_tui",
        "name": "Balo, túi xách",
        "count": "136"
      },
      {
        "id": "phukien",
        "name": "Phụ kiện thời trang",
        "count": "81"
      }
    ],
    "filterGroups": [
      {
        "title": "Kích cỡ",
        "options": [
          {
            "id": "all",
            "label": "Tất cả kích cỡ"
          },
          {
            "id": "s",
            "label": "Size S"
          },
          {
            "id": "m",
            "label": "Size M"
          },
          {
            "id": "l",
            "label": "Size L"
          },
          {
            "id": "xl",
            "label": "Size XL"
          },
          {
            "id": "free",
            "label": "Freesize"
          }
        ]
      }
    ]
  },
  "sports": {
    "categoryName": "Thể thao",
    "subcategories": [
      {
        "id": "all",
        "name": "Tất cả thể thao",
        "count": "353"
      },
      {
        "id": "cau_long",
        "name": "Cầu lông",
        "count": "104"
      },
      {
        "id": "bong_da",
        "name": "Bóng đá",
        "count": "83"
      },
      {
        "id": "bong_ro",
        "name": "Bóng rổ",
        "count": "60"
      },
      {
        "id": "gym",
        "name": "Gym, tập luyện",
        "count": "64"
      },
      {
        "id": "chay_bo",
        "name": "Chạy bộ, đạp xe",
        "count": "26"
      },
      {
        "id": "dung_cu_khac",
        "name": "Dụng cụ thể thao khác",
        "count": "16"
      }
    ]
  },
  "study": {
    "categoryName": "Đồ học tập",
    "subcategories": [
      {
        "id": "all",
        "name": "Tất cả đồ học tập",
        "count": "659"
      },
      {
        "id": "but_thuoc",
        "name": "Bút, thước, dụng cụ vẽ",
        "count": "222"
      },
      {
        "id": "may_tinh",
        "name": "Máy tính cầm tay",
        "count": "136"
      },
      {
        "id": "so_vo",
        "name": "Vở, sổ ghi chép",
        "count": "144"
      },
      {
        "id": "chuyen_nganh",
        "name": "Dụng cụ học tập chuyên ngành",
        "count": "95"
      },
      {
        "id": "hop_but",
        "name": "Hộp bút, balo học tập",
        "count": "62"
      }
    ]
  },
  "handmade": {
    "categoryName": "Đồ handmade",
    "subcategories": [
      {
        "id": "all",
        "name": "Tất cả đồ handmade",
        "count": "185"
      },
      {
        "id": "moc_khoa",
        "name": "Móc khóa handmade",
        "count": "58"
      },
      {
        "id": "do_len",
        "name": "Đồ len, thú bông",
        "count": "48"
      },
      {
        "id": "trang_suc",
        "name": "Trang sức thủ công",
        "count": "37"
      },
      {
        "id": "trang_tri",
        "name": "Đồ trang trí",
        "count": "25"
      },
      {
        "id": "nguyen_lieu",
        "name": "Nguyên liệu handmade",
        "count": "10"
      },
      {
        "id": "kit_diy",
        "name": "Bộ kit DIY",
        "count": "7"
      }
    ]
  },
  "other": {
    "categoryName": "Khác",
    "subcategories": [
      {
        "id": "all",
        "name": "Tất cả đồ khác",
        "count": "150"
      },
      {
        "id": "nhac_cu",
        "name": "Nhạc cụ",
        "count": "43"
      },
      {
        "id": "da_ngoai",
        "name": "Dã ngoại, du lịch",
        "count": "35"
      },
      {
        "id": "an_ninh",
        "name": "Khóa xe, an ninh",
        "count": "29"
      },
      {
        "id": "cham_soc",
        "name": "Chăm sóc cá nhân",
        "count": "23"
      },
      {
        "id": "tien_ich",
        "name": "Tiện ích đời sống sinh viên",
        "count": "20"
      }
    ]
  }
};

// 3. Danh sách danh mục trên Sidebar bên trái (Tổng đúng 5.000 sản phẩm)
export const SIDEBAR_CATEGORIES: SidebarCategory[] = [
  { id: "all", name: "Tất cả danh mục", count: "5.000", totalNum: 5000, iconName: "LayoutGrid" },
  { id: "books", name: "Sách & giáo trình", count: "1.290", totalNum: 1290, iconName: "BookOpen" },
  { id: "tech", name: "Đồ công nghệ", count: "801", totalNum: 801, iconName: "Laptop" },
  { id: "dorm", name: "Đồ phòng trọ", count: "523", totalNum: 523, iconName: "Home" },
  { id: "fashion", name: "Thời trang", count: "1.039", totalNum: 1039, iconName: "Shirt" },
  { id: "sports", name: "Thể thao", count: "353", totalNum: 353, iconName: "Activity" },
  { id: "handmade", name: "Đồ handmade", count: "185", totalNum: 185, iconName: "HeartHandshake" },
  { id: "study", name: "Đồ học tập", count: "659", totalNum: 659, iconName: "PenTool" },
  { id: "other", name: "Khác", count: "150", totalNum: 150, iconName: "Grid" }
];

// 4. Danh sách trường ĐH tại TP.HCM
export const HCM_UNIVERSITIES = [
  "ĐH Bách Khoa TP.HCM (HCMUT)",
  "ĐH Kinh tế TP.HCM (UEH)",
  "ĐH Khoa học Tự nhiên (HCMUS)",
  "ĐH Công nghệ Thông tin (UIT)",
  "ĐH Sài Gòn (SGU)",
  "ĐH Ngoại thương Cơ sở 2 - TP.HCM",
  "ĐH Sư phạm Kỹ thuật (HCMUTE)",
  "ĐH Công nghiệp TP.HCM (IUH)",
  "ĐH Y Dược TP.HCM (UMP)",
  "ĐH Ngân hàng TP.HCM (HUB)",
  "ĐH Luật TP.HCM (ULaw)",
  "Khu đô thị ĐHQG-HCM (Làng ĐH Thủ Đức)"
];

// 5. KHO SẢN PHẨM KHỚP 1:1 GIỮA TÊN VÀ ẢNH THẬT KÈM SUBCATEGORY ID
export const MATCHED_CATALOG: Record<string, CatalogItemTemplate[]> = {
  "books": [
    {
      "title": "Giáo trình Cấu trúc dữ liệu & Giải thuật (UIT)",
      "price": 35000,
      "tag": "Giáo trình IT",
      "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cntt"
    },
    {
      "title": "Sách Lập trình Hướng đối tượng OOP với C++ & Java",
      "price": 45000,
      "tag": "Giáo trình IT",
      "image": "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cntt"
    },
    {
      "title": "Giáo trình Mạng máy tính & Thực hành Quản trị mạng",
      "price": 48000,
      "tag": "Mạng máy tính",
      "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cntt"
    },
    {
      "title": "Sách Cơ sở Dữ liệu & Thiết kế Hệ quản trị SQL Server",
      "price": 40000,
      "tag": "Cơ sở dữ liệu",
      "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cntt"
    },
    {
      "title": "Sách Kỹ thuật Số & Thiết kế Vi mạch điện tử",
      "price": 62000,
      "tag": "Điện tử IT",
      "image": "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cntt"
    },
    {
      "title": "Giáo trình Hệ điều hành Linux & Lập trình Shell Script",
      "price": 52000,
      "tag": "Hệ điều hành",
      "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cntt"
    },
    {
      "title": "Sách Nhập môn Trí tuệ Nhân tạo & Python Machine Learning",
      "price": 68000,
      "tag": "AI & Data",
      "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cntt"
    },
    {
      "title": "Sách Lập trình Web Fullstack với React và Node.js",
      "price": 59000,
      "tag": "Lập trình Web",
      "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cntt"
    },
    {
      "title": "Giáo trình Kinh tế vi mô (UEH Cơ sở B)",
      "price": 120000,
      "tag": "Kinh tế vi mô",
      "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kinhte"
    },
    {
      "title": "Giáo trình Kinh tế vĩ mô & Bài tập tình huống thực tế",
      "price": 45000,
      "tag": "Kinh tế vĩ mô",
      "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kinhte"
    },
    {
      "title": "Sách Nguyên lý Kế toán & Bài tập định khoản có lời giải",
      "price": 38000,
      "tag": "Kế toán",
      "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kinhte"
    },
    {
      "title": "Giáo trình Quản trị Marketing & Nghiên cứu thị trường Philip Kotler",
      "price": 75000,
      "tag": "Marketing",
      "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kinhte"
    },
    {
      "title": "Giáo trình Tài chính Doanh nghiệp & Quản trị dòng tiền",
      "price": 58000,
      "tag": "Tài chính",
      "image": "https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kinhte"
    },
    {
      "title": "Giáo trình Quản trị học (ĐH Ngoại Thương Cơ sở 2)",
      "price": 42000,
      "tag": "Quản trị học",
      "image": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kinhte"
    },
    {
      "title": "Sách Đàm phán và Ký kết Hợp đồng Ngoại thương FTU",
      "price": 49000,
      "tag": "Kinh doanh QT",
      "image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kinhte"
    },
    {
      "title": "Sách Kế toán Quản trị & Phân tích Báo cáo Tài chính UEH",
      "price": 55000,
      "tag": "Kế toán QT",
      "image": "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kinhte"
    },
    {
      "title": "Giáo trình Giải tích 1 & 2 (Kèm bài tập có lời giải HCMUT)",
      "price": 50000,
      "tag": "Giải tích",
      "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kythuat"
    },
    {
      "title": "Sách Đại số Tuyến tính & Hình học Giải tích sinh viên Bách Khoa",
      "price": 40000,
      "tag": "Đại số tuyến tính",
      "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kythuat"
    },
    {
      "title": "Giáo trình Vật lý Đại cương A1 & A2 cơ nhiệt quang điện",
      "price": 48000,
      "tag": "Vật lý đại cương",
      "image": "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kythuat"
    },
    {
      "title": "Sách Vẽ Kỹ thuật Cơ khí & Hình họa Vẽ kỹ thuật xây dựng",
      "price": 45000,
      "tag": "Vẽ kỹ thuật",
      "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kythuat"
    },
    {
      "title": "Giáo trình Sức bền Vật liệu & Cơ học Kết cấu công trình",
      "price": 56000,
      "tag": "Sức bền vật liệu",
      "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kythuat"
    },
    {
      "title": "Giáo trình Kỹ thuật Nhiệt & Cơ học Thủy khí ứng dụng",
      "price": 52000,
      "tag": "Cơ khí",
      "image": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kythuat"
    },
    {
      "title": "Bộ đề ôn luyện thi TOEIC 750+ ETS (Bản in đẹp kèm audio)",
      "price": 65000,
      "tag": "TOEIC",
      "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ngonngu"
    },
    {
      "title": "Sách Cambridge IELTS 15-18 Academic có giải chi tiết",
      "price": 78000,
      "tag": "IELTS",
      "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ngonngu"
    },
    {
      "title": "Bộ Flashcard 3000 từ vựng tiếng Anh chuyên ngành Kinh tế",
      "price": 42000,
      "tag": "Flashcard",
      "image": "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ngonngu"
    },
    {
      "title": "Giáo trình Hán ngữ 1 & 2 bản mới có phiên âm pinyin chuẩn",
      "price": 49000,
      "tag": "Tiếng Trung",
      "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ngonngu"
    },
    {
      "title": "Sách Minna no Nihongo I & II tiếng Nhật N5-N4 kèm bài tập",
      "price": 54000,
      "tag": "Tiếng Nhật",
      "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ngonngu"
    },
    {
      "title": "Sách Giải thích Ngữ pháp tiếng Anh Mai Lan Hương có bài tập",
      "price": 38000,
      "tag": "Ngữ pháp",
      "image": "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ngonngu"
    },
    {
      "title": "Giáo trình Triết học Mác - Lênin & Câu hỏi trắc nghiệm ôn tập",
      "price": 30000,
      "tag": "Đại cương",
      "image": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nganh_khac"
    },
    {
      "title": "Sách Lịch sử Đảng Cộng sản Việt Nam & Đề cương thi ĐHQG",
      "price": 28000,
      "tag": "Đại cương",
      "image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nganh_khac"
    },
    {
      "title": "Giáo trình Pháp luật Đại cương & Tình huống thực tế sinh viên",
      "price": 32000,
      "tag": "Luật đại cương",
      "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nganh_khac"
    },
    {
      "title": "Sách Giải phẫu học đại cương & Atlas y khoa (UMP TP.HCM)",
      "price": 85000,
      "tag": "Y Dược",
      "image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nganh_khac"
    },
    {
      "title": "Giáo trình Tâm lý học Đại cương (ĐH Sư phạm TP.HCM)",
      "price": 36000,
      "tag": "Sư phạm",
      "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nganh_khac"
    },
    {
      "title": "Giáo trình Phương pháp Nghiên cứu Khoa học sinh viên",
      "price": 35000,
      "tag": "NCKH",
      "image": "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nganh_khac"
    }
  ],
  "tech": [
    {
      "title": "Máy tính Casio FX-580VN X màu Đen chính hãng Bitex",
      "price": 520000,
      "tag": "Máy tính Casio",
      "image": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio FX-580VN X màu Xanh pastel mới 99%",
      "price": 490000,
      "tag": "Máy tính Casio",
      "image": "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio FX-580VN X màu Hồng phiên bản giới hạn",
      "price": 530000,
      "tag": "Máy tính Casio",
      "image": "https://images.unsplash.com/photo-1564865878688-9a244444042a?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio FX-880BTG thế hệ mới có kết nối Bluetooth",
      "price": 650000,
      "tag": "Casio 880BTG",
      "image": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio FX-880BTG màu Đen xám còn bảo hành 5 năm",
      "price": 630000,
      "tag": "Casio 880BTG",
      "image": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio FX-570VN Plus chính hãng còn tem chống giả Bitex",
      "price": 320000,
      "tag": "Casio 570VN",
      "image": "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio FX-570ES Plus 2nd Edition nút phím cực êm",
      "price": 280000,
      "tag": "Casio 570ES",
      "image": "https://images.unsplash.com/photo-1564865878688-9a244444042a?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Vinacal 680EX Plus đa chức năng tốc độ xử lý nhanh",
      "price": 450000,
      "tag": "Vinacal 680",
      "image": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio JS-40B mặt kim loại 14 số chuyên tài chính kế toán",
      "price": 380000,
      "tag": "Casio Kế toán",
      "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính bỏ túi Casio HL-820LV nhỏ gọn nắp gập tiện lợi",
      "price": 95000,
      "tag": "Casio bỏ túi",
      "image": "https://images.unsplash.com/photo-1574607383476-f517f260d30b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio FX-570MS bền bỉ chuẩn phòng thi đại cương",
      "price": 180000,
      "tag": "Casio 570MS",
      "image": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio JW-200SC màu vàng đồng phím nảy 12 số",
      "price": 310000,
      "tag": "Casio Thời trang",
      "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio FX-580VN X kèm bao da chống sốc chính hãng",
      "price": 540000,
      "tag": "Máy tính Casio",
      "image": "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio DF-120BM màn hình nghiêng hiển thị rõ nét",
      "price": 240000,
      "tag": "Casio Văn phòng",
      "image": "https://images.unsplash.com/photo-1574607383476-f517f260d30b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio MX-12B phím lớn dành cho sinh viên kinh tế",
      "price": 150000,
      "tag": "Casio Kế toán",
      "image": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio FX-500MS huyền thoại phím bấm số chuẩn",
      "price": 140000,
      "tag": "Casio 500MS",
      "image": "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Vinacal 570ES Plus II bản nâng cấp giải 4 ẩn",
      "price": 290000,
      "tag": "Vinacal 570",
      "image": "https://images.unsplash.com/photo-1564865878688-9a244444042a?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio FX-991EX ClassWiz màn hình độ phân giải cao",
      "price": 580000,
      "tag": "Casio ClassWiz",
      "image": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio FX-580VN X màu Trắng ngọc trai thanh lịch",
      "price": 520000,
      "tag": "Máy tính Casio",
      "image": "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "Máy tính Casio DJ-120D Plus có chức năng kiểm tra 150 bước",
      "price": 260000,
      "tag": "Casio Kế toán",
      "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "casio"
    },
    {
      "title": "MacBook Air M1 2020 8GB/256GB Gold (Pin 91%)",
      "price": 11800000,
      "tag": "Laptop Apple",
      "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "laptop"
    },
    {
      "title": "Laptop Dell Latitude 7490 Core i5-8350U 8GB/256GB SSD",
      "price": 4300000,
      "tag": "Laptop Dell",
      "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "laptop"
    },
    {
      "title": "Laptop ASUS Vivobook 15 OLED Core i5 gen 11 màn đẹp",
      "price": 8500000,
      "tag": "Laptop ASUS",
      "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "laptop"
    },
    {
      "title": "Laptop ThinkPad T480s bàn phím gõ êm mượt siêu bền bỉ",
      "price": 5400000,
      "tag": "Laptop Lenovo",
      "image": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "laptop"
    },
    {
      "title": "Màn hình Dell 24 inch IPS FHD 75Hz (Đủ cáp HDMI)",
      "price": 1450000,
      "tag": "Màn hình Dell",
      "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "laptop"
    },
    {
      "title": "Màn hình LG 27 inch 4K IPS chuyên đồ họa thiết kế",
      "price": 3850000,
      "tag": "Màn hình máy tính",
      "image": "https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "laptop"
    },
    {
      "title": "Laptop Acer Aspire 7 Gaming GTX 1650 cho đồ họa & code",
      "price": 8200000,
      "tag": "Laptop Gaming",
      "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "laptop"
    },
    {
      "title": "Laptop HP Pavilion 14 viền mỏng nguyên bản sinh viên",
      "price": 6400000,
      "tag": "Laptop HP",
      "image": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "laptop"
    },
    {
      "title": "iPad Gen 9 64GB Wifi màu Bạc (Ít dùng còn box)",
      "price": 5200000,
      "tag": "Máy tính bảng Apple",
      "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phone"
    },
    {
      "title": "iPad Air 4 64GB kèm bao da nam châm gập pin 92%",
      "price": 7800000,
      "tag": "iPad Air",
      "image": "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phone"
    },
    {
      "title": "Máy tính bảng Samsung Galaxy Tab S6 Lite kèm bút S-Pen",
      "price": 3900000,
      "tag": "Samsung Tab",
      "image": "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phone"
    },
    {
      "title": "iPhone 11 128GB Quốc tế bản LL/A pin 86% nguyên áp",
      "price": 5600000,
      "tag": "Điện thoại Apple",
      "image": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phone"
    },
    {
      "title": "Samsung Galaxy A54 5G 128GB chụp hình đẹp pin trâu",
      "price": 4300000,
      "tag": "Samsung Galaxy",
      "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phone"
    },
    {
      "title": "Máy đọc sách Kindle Paperwhite Gen 4 chống nước đọc PDF",
      "price": 1650000,
      "tag": "Máy đọc sách",
      "image": "https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phone"
    },
    {
      "title": "iPhone XR 64GB màu cam san hô máy phụ mượt mà",
      "price": 3800000,
      "tag": "Điện thoại Apple",
      "image": "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phone"
    },
    {
      "title": "Xiaomi Redmi Note 12 128GB pin 5000mAh sạc nhanh 33W",
      "price": 2700000,
      "tag": "Điện thoại Xiaomi",
      "image": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phone"
    },
    {
      "title": "Tai nghe chụp tai Sony WH-CH520 chính hãng",
      "price": 650000,
      "tag": "Tai nghe Sony",
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "audio"
    },
    {
      "title": "Tai nghe Bluetooth Soundpeats Air3 Deluxe HS",
      "price": 490000,
      "tag": "True Wireless",
      "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "audio"
    },
    {
      "title": "Loa Bluetooth JBL Go 3 chống nước pin trâu",
      "price": 580000,
      "tag": "Loa JBL",
      "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "audio"
    },
    {
      "title": "Tai nghe chống ồn Sony WF-1000XM4 nghe nhạc đỉnh",
      "price": 2100000,
      "tag": "Tai nghe Sony",
      "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "audio"
    },
    {
      "title": "Tai nghe Marshall Major IV pin 80h retro cá tính",
      "price": 1850000,
      "tag": "Tai nghe Marshall",
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "audio"
    },
    {
      "title": "Loa máy tính để bàn Edifier R1080BT âm thanh ấm",
      "price": 1200000,
      "tag": "Loa máy tính",
      "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "audio"
    },
    {
      "title": "Tai nghe Apple AirPods 2 chính hãng nguyên hộp sạc dây",
      "price": 1350000,
      "tag": "AirPods Apple",
      "image": "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "audio"
    },
    {
      "title": "Loa di động JBL Flip 5 âm bass mạnh mẽ ngoài trời",
      "price": 1150000,
      "tag": "Loa JBL",
      "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "audio"
    },
    {
      "title": "Bàn phím cơ DareU EK87 Blue Switch gõ siêu nảy",
      "price": 350000,
      "tag": "Bàn phím cơ",
      "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Chuột không dây Logitech Pebble M350 Silent",
      "price": 280000,
      "tag": "Chuột Logitech",
      "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Củ sạc nhanh Baseus GaN 65W 3 cổng Type-C + USB",
      "price": 320000,
      "tag": "Củ sạc nhanh",
      "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Webcam Rapoo C260 FHD 1080P học online & thuyết trình",
      "price": 240000,
      "tag": "Webcam",
      "image": "https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Đế tản nhiệt Laptop nhôm gấp gọn 6 nấc chỉnh cao",
      "price": 95000,
      "tag": "Giá đỡ laptop",
      "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Bút cảm ứng Goojodoq cho iPad vẽ ghi chú mượt",
      "price": 210000,
      "tag": "Bút cảm ứng",
      "image": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Ổ cứng SSD gắn ngoài Kingston 500GB USB 3.2",
      "price": 850000,
      "tag": "Ổ cứng SSD",
      "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "USB SanDisk Ultra Flair 64GB vỏ kim loại siêu bền",
      "price": 110000,
      "tag": "USB SanDisk",
      "image": "https://images.unsplash.com/photo-1626218174358-7769486c4b79?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Cáp sạc Baseus Type-C to C 100W bọc dù dài 2m",
      "price": 75000,
      "tag": "Cáp sạc",
      "image": "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Hub chuyển đổi Type-C 6 in 1 HDMI 4K cho Macbook",
      "price": 290000,
      "tag": "Hub chuyển đổi",
      "image": "https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Chuột không dây gaming Logitech G304 Lightspeed",
      "price": 480000,
      "tag": "Chuột Logitech",
      "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Pin sạc dự phòng Xiaomi 20.000mAh sạc nhanh 18W",
      "price": 290000,
      "tag": "Pin dự phòng",
      "image": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    }
  ],
  "dorm": [
    {
      "title": "Bàn học gấp chân sắt kèm khay iPad & cốc nước",
      "price": 75000,
      "tag": "Bàn gấp gọn",
      "image": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "banghe"
    },
    {
      "title": "Kệ sách mini để bàn gỗ MDF 3 ngăn gọn gàng",
      "price": 85000,
      "tag": "Kệ sách để bàn",
      "image": "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "banghe"
    },
    {
      "title": "Tủ vải đựng quần áo khung inox 3 buồng 8 ngăn",
      "price": 180000,
      "tag": "Tủ vải quần áo",
      "image": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "banghe"
    },
    {
      "title": "Kệ để giày dép 5 tầng khung nhôm chống gỉ",
      "price": 95000,
      "tag": "Kệ giày dép",
      "image": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "banghe"
    },
    {
      "title": "Ghế xoay công thái học văn phòng đệm lưới thoáng lưng",
      "price": 390000,
      "tag": "Ghế xoay bàn học",
      "image": "https://images.unsplash.com/photo-1580481077195-c99279774d0a?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "banghe"
    },
    {
      "title": "Bàn học gỗ chân chữ Z kích thước 1m x 50cm chắc chắn",
      "price": 250000,
      "tag": "Bàn làm việc",
      "image": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "banghe"
    },
    {
      "title": "Đèn học để bàn chống cận Rạng Đông LED 6W",
      "price": 110000,
      "tag": "Đèn bàn học",
      "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "den_quat"
    },
    {
      "title": "Quạt cây đứng Senko lỡ 3 cánh gió mát êm ru",
      "price": 190000,
      "tag": "Quạt cây đứng",
      "image": "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "den_quat"
    },
    {
      "title": "Quạt kẹp bàn mini tích điện cổng sạc USB cho phòng trọ",
      "price": 85000,
      "tag": "Quạt tích điện",
      "image": "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "den_quat"
    },
    {
      "title": "Đèn bàn Pixar chân kẹp thân kim loại điều chỉnh linh hoạt",
      "price": 145000,
      "tag": "Đèn Pixar",
      "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "den_quat"
    },
    {
      "title": "Quạt hộp tản gió Asia an toàn cho giường ký túc xá",
      "price": 160000,
      "tag": "Quạt hộp",
      "image": "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "den_quat"
    },
    {
      "title": "Nồi cơm điện mini Sunhouse 1.2L nấu 1-2 người",
      "price": 230000,
      "tag": "Nồi cơm điện",
      "image": "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bep"
    },
    {
      "title": "Ấm đun siêu tốc inox 1.8L Lock&Lock tự ngắt an toàn",
      "price": 140000,
      "tag": "Ấm siêu tốc",
      "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bep"
    },
    {
      "title": "Bếp điện từ mini Kangaroo kèm nồi lẩu tặng kèm",
      "price": 320000,
      "tag": "Bếp điện từ",
      "image": "https://images.unsplash.com/photo-1556911073-38141963c9e0?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bep"
    },
    {
      "title": "Chảo chống dính đá hoa cương Elmich 24cm chiên xào",
      "price": 120000,
      "tag": "Chảo chống dính",
      "image": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bep"
    },
    {
      "title": "Hộp cơm giữ nhiệt văn phòng 3 tầng cắm điện hâm nóng",
      "price": 160000,
      "tag": "Hộp cơm cắm điện",
      "image": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bep"
    },
    {
      "title": "Kệ úp chén bát có khay thoát nước inox chống gỉ",
      "price": 115000,
      "tag": "Kệ úp chén bát",
      "image": "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bep"
    },
    {
      "title": "Giỏ đựng quần áo giặt gấp gọn bằng vải canvas",
      "price": 55000,
      "tag": "Giỏ đựng đồ",
      "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "vesinh"
    },
    {
      "title": "Móc treo quần áo xoay 360 độ combo 20 chiếc nhôm bền",
      "price": 45000,
      "tag": "Móc treo đồ",
      "image": "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "vesinh"
    },
    {
      "title": "Thùng rác mini để bàn nắp lật màu pastel xinh xắn",
      "price": 35000,
      "tag": "Thùng rác mini",
      "image": "https://images.unsplash.com/photo-1499955085172-a104c9463ece?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "vesinh"
    },
    {
      "title": "Cây lau nhà tự vắt thông minh kèm thùng giặt 2 ngăn",
      "price": 135000,
      "tag": "Cây lau nhà",
      "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "vesinh"
    },
    {
      "title": "Thảm lau chân san hô siêu thấm hút nước chống trượt phòng tắm",
      "price": 38000,
      "tag": "Thảm lau chân",
      "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "vesinh"
    },
    {
      "title": "Gương đứng soi toàn thân có bánh xe di chuyển",
      "price": 160000,
      "tag": "Gương toàn thân",
      "image": "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "giadung"
    },
    {
      "title": "Nệm topper nệm trải sàn 1m2 x 2m êm ái thoáng khí",
      "price": 210000,
      "tag": "Nệm trải sàn",
      "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "giadung"
    },
    {
      "title": "Bàn ủi hơi nước cầm tay mini du lịch tiện lợi",
      "price": 175000,
      "tag": "Bàn ủi hơi nước",
      "image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "giadung"
    },
    {
      "title": "Bộ drap giường cotton 1m4 kèm 2 vỏ gối họa tiết kẻ",
      "price": 135000,
      "tag": "Chăn ga gối",
      "image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "giadung"
    },
    {
      "title": "Máy sấy tóc tạo kiểu Bluestone công suất lớn 1800W",
      "price": 165000,
      "tag": "Máy sấy tóc",
      "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "giadung"
    }
  ],
  "fashion": [
    {
      "title": "Quần Jeans ống rộng phong cách Hàn Quốc retro unisex",
      "price": 170000,
      "tag": "Quần jeans",
      "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ao_quan"
    },
    {
      "title": "Áo thun cotton 100% 250gsm in hình graphic năng động",
      "price": 95000,
      "tag": "Áo thun cotton",
      "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ao_quan"
    },
    {
      "title": "Áo sơ mi trắng form rộng mặc đi học đi làm thêm",
      "price": 110000,
      "tag": "Áo sơ mi trắng",
      "image": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ao_quan"
    },
    {
      "title": "Quần short thể thao 2 lớp co giãn tập gym chạy bộ",
      "price": 80000,
      "tag": "Quần short",
      "image": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ao_quan"
    },
    {
      "title": "Áo polo trơn cotton phối bo cổ lịch sự trang nhã",
      "price": 115000,
      "tag": "Áo polo",
      "image": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ao_quan"
    },
    {
      "title": "Quần tây ống suông cạp cao đi học chuẩn form",
      "price": 145000,
      "tag": "Quần tây",
      "image": "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ao_quan"
    },
    {
      "title": "Áo khoác Bomber nỉ University xanh rêu oversize",
      "price": 180000,
      "tag": "Áo khoác bomber",
      "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ao_khoac"
    },
    {
      "title": "Áo Hoodie form rộng nỉ bông dày dặn Unisex",
      "price": 160000,
      "tag": "Áo hoodie nỉ",
      "image": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ao_khoac"
    },
    {
      "title": "Áo len dệt kim mỏng cổ V phong cách vintage",
      "price": 140000,
      "tag": "Áo len mỏng",
      "image": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ao_khoac"
    },
    {
      "title": "Áo cardigan len dáng rộng phong cách Ulzzang Hàn Quốc",
      "price": 155000,
      "tag": "Áo cardigan",
      "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ao_khoac"
    },
    {
      "title": "Áo khoác dù 2 lớp chống nước cản gió đi phượt",
      "price": 165000,
      "tag": "Áo khoác gió",
      "image": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "ao_khoac"
    },
    {
      "title": "Giày sneaker trắng basic cổ thấp êm chân size 40-41",
      "price": 220000,
      "tag": "Giày sneaker",
      "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "giay_dep"
    },
    {
      "title": "Dép quai ngang đế bánh mì siêu êm chân chống trơn",
      "price": 65000,
      "tag": "Dép bánh mì",
      "image": "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "giay_dep"
    },
    {
      "title": "Sandals học sinh 3 quai dù đen đế đúc chống nước",
      "price": 135000,
      "tag": "Sandals đi học",
      "image": "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "giay_dep"
    },
    {
      "title": "Giày Converse Chuck 1970s cổ cao đen classic size 39",
      "price": 380000,
      "tag": "Giày Converse",
      "image": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "giay_dep"
    },
    {
      "title": "Giày lười slip-on canvas đế mềm nhẹ đi bộ cả ngày",
      "price": 160000,
      "tag": "Giày slip on",
      "image": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "giay_dep"
    },
    {
      "title": "Balo đi học chống nước có ngăn chống sốc 15.6 inch",
      "price": 195000,
      "tag": "Balo sinh viên",
      "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "balo_tui"
    },
    {
      "title": "Túi tote canvas dày dặn có khóa kéo & ngăn con",
      "price": 65000,
      "tag": "Túi tote vải",
      "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "balo_tui"
    },
    {
      "title": "Ví da dáng đứng nhiều ngăn đựng thẻ sinh viên",
      "price": 85000,
      "tag": "Ví da mini",
      "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "balo_tui"
    },
    {
      "title": "Túi đeo chéo mini chống thấm nước nhiều ngăn tiện lợi",
      "price": 90000,
      "tag": "Túi đeo chéo",
      "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "balo_tui"
    },
    {
      "title": "Nón lưỡi trai thêu chữ cá tính unisex màu kem",
      "price": 55000,
      "tag": "Nón lưỡi trai",
      "image": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Kính râm gọng vuông chống tia UV400 thời trang",
      "price": 70000,
      "tag": "Kính râm mát",
      "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Thắt lưng da khóa tự động bản nhỏ phối quần tây",
      "price": 60000,
      "tag": "Thắt lưng da",
      "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Khăn choàng cổ dệt kim ấm áp màu xám tiêu",
      "price": 75000,
      "tag": "Khăn choàng cổ",
      "image": "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    },
    {
      "title": "Vớ cổ cao cotton khử mùi combo 5 đôi thoáng mát",
      "price": 40000,
      "tag": "Vớ cotton",
      "image": "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "phukien"
    }
  ],
  "sports": [
    {
      "title": "Vợt cầu lông Yonex kèm bao vợt & quấn cán mới",
      "price": 420000,
      "tag": "Vợt Yonex",
      "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cau_long"
    },
    {
      "title": "Ống cầu lông Thành Công 12 quả bền lông bay chuẩn",
      "price": 185000,
      "tag": "Cầu lông",
      "image": "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cau_long"
    },
    {
      "title": "Vợt cầu lông Lining chính hãng cân bằng công thủ toàn diện",
      "price": 450000,
      "tag": "Vợt Lining",
      "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cau_long"
    },
    {
      "title": "Bao đựng vợt cầu lông 2 ngăn có quai đeo êm ái",
      "price": 110000,
      "tag": "Bao đựng vợt",
      "image": "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cau_long"
    },
    {
      "title": "Bóng đá Molten F5V3400 tiêu chuẩn thi đấu sân cỏ",
      "price": 280000,
      "tag": "Bóng đá Molten",
      "image": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bong_da"
    },
    {
      "title": "Giày đá bóng sân cỏ nhân tạo Wika size 41 đinh TF",
      "price": 210000,
      "tag": "Giày đá bóng",
      "image": "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bong_da"
    },
    {
      "title": "Bó gối thể thao xỏ co giãn bảo vệ khớp gối đá banh",
      "price": 70000,
      "tag": "Bảo hộ khớp gối",
      "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bong_da"
    },
    {
      "title": "Áo bib lưới tập chiến thuật bóng đá combo 6 áo",
      "price": 75000,
      "tag": "Áo bib lưới",
      "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bong_da"
    },
    {
      "title": "Bóng rổ Spalding chính hãng size 7 da PU bám tay",
      "price": 290000,
      "tag": "Bóng rổ Spalding",
      "image": "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bong_ro"
    },
    {
      "title": "Bóng bóng rổ Molten BG3800 tiêu chuẩn thi đấu trong nhà",
      "price": 350000,
      "tag": "Bóng rổ Molten",
      "image": "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bong_ro"
    },
    {
      "title": "Bó bắp tay bóng rổ nén cơ chống tia UV thấm mồ hôi",
      "price": 45000,
      "tag": "Phụ kiện bóng rổ",
      "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "bong_ro"
    },
    {
      "title": "Bộ tạ tay bọc cao su 5kg x 2 quả tập tại phòng trọ",
      "price": 180000,
      "tag": "Tạ tay cao su",
      "image": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "gym"
    },
    {
      "title": "Găng tay tập gym hở ngón đệm silicon chống chai tay",
      "price": 65000,
      "tag": "Găng tay gym",
      "image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "gym"
    },
    {
      "title": "Đai lưng tập gym hỗ trợ cột sống nâng tạ nặng",
      "price": 160000,
      "tag": "Đai lưng tập gym",
      "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "gym"
    },
    {
      "title": "Dây kháng lực Miniband 5 cấp độ tập mông đùi",
      "price": 60000,
      "tag": "Dây kháng lực",
      "image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "gym"
    },
    {
      "title": "Con lăn tập bụng 4 bánh có phanh trợ lực hồi",
      "price": 130000,
      "tag": "Con lăn tập bụng",
      "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "gym"
    },
    {
      "title": "Dây nhảy thể lực có vòng bi quay mượt không rối",
      "price": 55000,
      "tag": "Dây nhảy thể lực",
      "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "chay_bo"
    },
    {
      "title": "Đai đeo hông chạy bộ chống nước có ngăn đựng điện thoại",
      "price": 65000,
      "tag": "Đai đeo chạy bộ",
      "image": "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "chay_bo"
    },
    {
      "title": "Bình nước giữ nhiệt thể thao Lock&Lock 800ml inox",
      "price": 165000,
      "tag": "Bình nước thể thao",
      "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "chay_bo"
    },
    {
      "title": "Thảm tập Yoga TPE 6mm định tuyến chống trơn trượt",
      "price": 150000,
      "tag": "Thảm tập Yoga",
      "image": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "dung_cu_khac"
    },
    {
      "title": "Vợt bóng bàn 729 kèm 3 quả bóng tập luyện",
      "price": 140000,
      "tag": "Bóng bàn",
      "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "dung_cu_khac"
    },
    {
      "title": "Kính bơi cận chống đọng sương mắt kính tráng gương",
      "price": 120000,
      "tag": "Kính bơi",
      "image": "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "dung_cu_khac"
    },
    {
      "title": "Bơm bóng mini cầm tay có đồng hồ đo áp suất",
      "price": 40000,
      "tag": "Bơm mini",
      "image": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "dung_cu_khac"
    }
  ],
  "study": [
    {
      "title": "Bút máy Pilot Kakuno ngòi F kèm ống mực đen",
      "price": 175000,
      "tag": "Bút máy Pilot",
      "image": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "but_thuoc"
    },
    {
      "title": "Set 5 bút Highlight dạ quang màu pastel Mildliner",
      "price": 65000,
      "tag": "Bút dạ quang",
      "image": "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "but_thuoc"
    },
    {
      "title": "Bút gel xóa được Pilot Frixion ngòi 0.5mm màu xanh",
      "price": 40000,
      "tag": "Bút gel Pilot",
      "image": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "but_thuoc"
    },
    {
      "title": "Thước kẻ nhôm định tuyến 30cm khắc laser không mòn",
      "price": 18000,
      "tag": "Thước kẻ nhôm",
      "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "but_thuoc"
    },
    {
      "title": "Hộp 20 bút bi nước Deli ngòi 0.5mm mực đậm nét êm",
      "price": 45000,
      "tag": "Bút bi Deli",
      "image": "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "but_thuoc"
    },
    {
      "title": "Máy tính Casio FX-580VN X chính hãng nguyên tem Bitex",
      "price": 520000,
      "tag": "Máy tính Casio",
      "image": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "may_tinh"
    },
    {
      "title": "Máy tính Casio FX-880BTG thế hệ mới có kết nối Bluetooth",
      "price": 650000,
      "tag": "Casio 880BTG",
      "image": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "may_tinh"
    },
    {
      "title": "Máy tính Casio FX-570VN Plus nút bấm êm siêu nhạy",
      "price": 320000,
      "tag": "Casio 570VN",
      "image": "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "may_tinh"
    },
    {
      "title": "Máy tính Vinacal 680EX Plus màu xanh máy mạnh tốc độ cao",
      "price": 450000,
      "tag": "Vinacal 680",
      "image": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "may_tinh"
    },
    {
      "title": "Máy tính bỏ túi Casio HL-820LV nhỏ gọn nắp gập",
      "price": 95000,
      "tag": "Casio bỏ túi",
      "image": "https://images.unsplash.com/photo-1574607383476-f517f260d30b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "may_tinh"
    },
    {
      "title": "Sổ còng Klong Caro A5 120 trang giấy chống thấm nhòe",
      "price": 45000,
      "tag": "Sổ còng Klong",
      "image": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "so_vo"
    },
    {
      "title": "Bộ 10 tập giấy kiểm tra kẻ ngang cấp tốc trước giờ thi",
      "price": 15000,
      "tag": "Giấy thi kẻ ngang",
      "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "so_vo"
    },
    {
      "title": "Giấy note vàng ghi chú có keo dán tệp 100 tờ Deli",
      "price": 12000,
      "tag": "Giấy note Deli",
      "image": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "so_vo"
    },
    {
      "title": "Vở ghi bài Klong B5 200 trang kẻ ngang định lượng 100gsm",
      "price": 25000,
      "tag": "Vở Klong B5",
      "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "so_vo"
    },
    {
      "title": "Bảng vẽ điện tử Huion H430P học vẽ đồ họa & ghi chú",
      "price": 480000,
      "tag": "Bảng vẽ đồ họa",
      "image": "https://images.unsplash.com/photo-1561998338-13ad7883b20f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "chuyen_nganh"
    },
    {
      "title": "File kẹp tài liệu 60 lá nhựa PP đựng đề thi & báo cáo",
      "price": 35000,
      "tag": "File kẹp hồ sơ",
      "image": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "chuyen_nganh"
    },
    {
      "title": "Compa kim loại định tâm chuyên dụng vẽ kỹ thuật",
      "price": 30000,
      "tag": "Compa kỹ thuật",
      "image": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "chuyen_nganh"
    },
    {
      "title": "Đèn kẹp sách đọc ban đêm chống mỏi mắt sạc USB",
      "price": 55000,
      "tag": "Đèn đọc sách",
      "image": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "chuyen_nganh"
    },
    {
      "title": "Hộp bút vải canvas nhiều ngăn sức chứa lớn màu pastel",
      "price": 45000,
      "tag": "Hộp bút canvas",
      "image": "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "hop_but"
    },
    {
      "title": "Hộp bút trong suốt phong cách Hàn Quốc đựng vừa máy tính Casio",
      "price": 35000,
      "tag": "Hộp bút trong suốt",
      "image": "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "hop_but"
    },
    {
      "title": "Kệ mica đựng bút 4 tầng đa năng để bàn học",
      "price": 38000,
      "tag": "Kệ bút mica",
      "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "hop_but"
    }
  ],
  "handmade": [
    {
      "title": "Móc khóa thú len đan tay handmade hình gấu bông",
      "price": 35000,
      "tag": "Móc khóa len",
      "image": "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "moc_khoa"
    },
    {
      "title": "Ví đựng tiền xu đan len họa tiết quả dâu tây dễ thương",
      "price": 40000,
      "tag": "Ví len mini",
      "image": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "moc_khoa"
    },
    {
      "title": "Túi đựng ly giữ nhiệt đan len có quai xách mang đi học",
      "price": 35000,
      "tag": "Túi ly len",
      "image": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "moc_khoa"
    },
    {
      "title": "Móc khóa hoa chuông len handmade chuông gió xinh xắn",
      "price": 25000,
      "tag": "Móc hoa chuông",
      "image": "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "moc_khoa"
    },
    {
      "title": "Hoa kẽm nhung bó 5 bông tulip pastel không bao giờ tàn",
      "price": 75000,
      "tag": "Hoa kẽm nhung",
      "image": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "do_len"
    },
    {
      "title": "Kẹp tóc len hoa hướng dương handmade cài tóc xinh xắn",
      "price": 20000,
      "tag": "Kẹp tóc len",
      "image": "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "do_len"
    },
    {
      "title": "Lót ly bằng len đan hình hoa cúc dễ thương cho bàn học",
      "price": 22000,
      "tag": "Lót ly len",
      "image": "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "do_len"
    },
    {
      "title": "Thú nhồi bông len Amigurumi thỏ trắng tai dài móc tay",
      "price": 85000,
      "tag": "Thú len bông",
      "image": "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "do_len"
    },
    {
      "title": "Vòng tay hạt cườm handmade phối màu phong cách Y2K",
      "price": 25000,
      "tag": "Vòng tay cườm",
      "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "trang_suc"
    },
    {
      "title": "Vòng cổ ngọc trai nhân tạo phối mặt charm bạc handmade",
      "price": 45000,
      "tag": "Vòng cổ ngọc trai",
      "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "trang_suc"
    },
    {
      "title": "Nhẫn dây cước xỏ hạt đá tự nhiên phong thủy may mắn",
      "price": 18000,
      "tag": "Nhẫn hạt cườm",
      "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "trang_suc"
    },
    {
      "title": "Bộ combo 3 vòng tay bện chỉ đỏ may mắn mùa thi cử",
      "price": 30000,
      "tag": "Vòng chỉ đỏ",
      "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "trang_suc"
    },
    {
      "title": "Khay đựng trang sức đất sét tự khô vẽ hoa cúc thủ công",
      "price": 45000,
      "tag": "Khay đất sét",
      "image": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "trang_tri"
    },
    {
      "title": "Nến thơm hoa khô tinh dầu sáp đậu nành thư giãn học bài",
      "price": 85000,
      "tag": "Nến thơm hoa khô",
      "image": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "trang_tri"
    },
    {
      "title": "Đèn ngủ hoa tulip trong lồng kính lung linh để bàn",
      "price": 110000,
      "tag": "Đèn ngủ tulip",
      "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "trang_tri"
    },
    {
      "title": "Khung ảnh gỗ lồng hoa khô lưu giữ kỷ niệm sinh viên",
      "price": 65000,
      "tag": "Khung ảnh hoa khô",
      "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "trang_tri"
    },
    {
      "title": "Chậu cây để bàn vẽ tay gốm Bát Tràng mini xinh xắn",
      "price": 38000,
      "tag": "Chậu cây vẽ tay",
      "image": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "trang_tri"
    },
    {
      "title": "Bookmark kẹp sách hoa ép khô nhựa epoxy trong suốt",
      "price": 28000,
      "tag": "Bookmark hoa khô",
      "image": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nguyen_lieu"
    },
    {
      "title": "Set 10 thiệp chúc mừng vẽ màu nước handmade thủ công",
      "price": 30000,
      "tag": "Thiệp màu nước",
      "image": "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nguyen_lieu"
    },
    {
      "title": "Cuộn len sợi Milk Cotton 50g đan móc đủ màu sắc",
      "price": 16000,
      "tag": "Len sợi Milk",
      "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nguyen_lieu"
    },
    {
      "title": "Kẽm nhung làm hoa gói 100 sợi màu pastel mềm mại",
      "price": 28000,
      "tag": "Kẽm nhung làm hoa",
      "image": "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nguyen_lieu"
    },
    {
      "title": "Bộ kit thêu len nổi Punch Needle cho người mới bắt đầu",
      "price": 95000,
      "tag": "Kit Punch Needle",
      "image": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kit_diy"
    },
    {
      "title": "Tranh thêu chữ thập mini tự thêu treo góc học tập",
      "price": 50000,
      "tag": "Tranh thêu chữ thập",
      "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kit_diy"
    },
    {
      "title": "Bộ kit tự làm nến thơm handmade kèm sáp đậu nành & tinh dầu",
      "price": 115000,
      "tag": "Kit làm nến thơm",
      "image": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "kit_diy"
    }
  ],
  "other": [
    {
      "title": "Đàn Guitar Acoustic gỗ Mahogany âm thanh ấm vang",
      "price": 750000,
      "tag": "Đàn Guitar",
      "image": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nhac_cu"
    },
    {
      "title": "Đàn Ukulele Soprano 21 inch màu gỗ tự nhiên kèm bao đàn",
      "price": 250000,
      "tag": "Đàn Ukulele",
      "image": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nhac_cu"
    },
    {
      "title": "Đàn Kalimba 17 phím gỗ thông khắc nốt âm trong trẻo",
      "price": 160000,
      "tag": "Đàn Kalimba",
      "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "nhac_cu"
    },
    {
      "title": "Lều cắm trại 2-4 người tự bung chống mưa gió dã ngoại",
      "price": 350000,
      "tag": "Lều cắm trại",
      "image": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "da_ngoai"
    },
    {
      "title": "Ghế dù xếp dã ngoại cafe câu cá nhỏ gọn mang đi",
      "price": 95000,
      "tag": "Ghế xếp dã ngoại",
      "image": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "da_ngoai"
    },
    {
      "title": "Đèn bão chiếu sáng cắm trại pin sạc năng lượng mặt trời",
      "price": 85000,
      "tag": "Đèn cắm trại",
      "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "da_ngoai"
    },
    {
      "title": "Khóa đĩa xe máy chống trộm Z-Con kèm 3 chìa thép",
      "price": 110000,
      "tag": "Khóa đĩa xe máy",
      "image": "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "an_ninh"
    },
    {
      "title": "Khóa số dây cáp bọc nhựa an toàn khóa mũ bảo hiểm xe máy",
      "price": 45000,
      "tag": "Khóa cáp số",
      "image": "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "an_ninh"
    },
    {
      "title": "Ổ khóa báo động chống trộm phát chuông hú 110dB",
      "price": 135000,
      "tag": "Khóa báo động",
      "image": "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "an_ninh"
    },
    {
      "title": "Máy tăm nước mini cầm tay du lịch vệ sinh răng miệng",
      "price": 240000,
      "tag": "Máy tăm nước",
      "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cham_soc"
    },
    {
      "title": "Cân điện tử thông minh đo mỡ sức khỏe kết nối Bluetooth",
      "price": 130000,
      "tag": "Cân điện tử",
      "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cham_soc"
    },
    {
      "title": "Máy massage cổ vai gáy 6 chế độ giảm mỏi học thi",
      "price": 180000,
      "tag": "Máy massage cổ",
      "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cham_soc"
    },
    {
      "title": "Bàn chải điện sóng âm đa năng chống nước IPX7",
      "price": 150000,
      "tag": "Bàn chải điện",
      "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "cham_soc"
    },
    {
      "title": "Ô dù cầm tay gấp gọn che mưa chống tia UV tự động",
      "price": 65000,
      "tag": "Dù gấp gọn",
      "image": "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "tien_ich"
    },
    {
      "title": "Áo mưa cánh dơi 2 đầu vải dù chống thấm siêu bền",
      "price": 85000,
      "tag": "Áo mưa 2 đầu",
      "image": "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "tien_ich"
    },
    {
      "title": "Bình giữ nhiệt Lock&Lock 500ml giữ nóng lạnh 24h",
      "price": 145000,
      "tag": "Bình giữ nhiệt",
      "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "tien_ich"
    },
    {
      "title": "Đèn pin siêu sáng mini sạc USB chiếu xa 200m",
      "price": 55000,
      "tag": "Đèn pin mini",
      "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
      "subcategoryId": "tien_ich"
    }
  ]
};


// 6. HÀM PHÂN TRANG: HỖ TRỢ LỌC CHÍNH XÁC THEO DANH MỤC, DANH MỤC CON & BỘ LỌC
export function getCategoryProductsPage(
  categoryId: string = "all",
  subcategoryId: string = "all",
  page: number = 1,
  pageSize: number = 20,
  filters: Record<string, string> = {}
): {
  products: FeaturedProduct[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  categoryName: string;
  subcategoryName?: string;
} {
  const activeCat = SIDEBAR_CATEGORIES.find(c => c.id === categoryId) || SIDEBAR_CATEGORIES[0];
  const catConfig = CATEGORY_SUBCATEGORIES[categoryId];
  const activeSub = catConfig?.subcategories.find(s => s.id === subcategoryId);

  // Tính tổng số lượng chính xác
  let totalCount = activeCat.totalNum;
  if (categoryId !== "all" && subcategoryId !== "all" && activeSub?.count) {
    const parsed = parseInt(activeSub.count.replace(/\./g, ""), 10);
    if (!isNaN(parsed)) totalCount = parsed;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const validPage = Math.max(1, Math.min(page, totalPages));

  const result: FeaturedProduct[] = [];
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);
  const itemsOnThisPage = endIndex - startIndex;

  const catKeys = ["books", "tech", "dorm", "fashion", "sports", "handmade", "study", "other"];

  // Điều kiện lọc theo thương hiệu hoặc option nếu có
  const brandFilter = filters["Thương hiệu"] || "all";

  for (let i = 0; i < itemsOnThisPage; i++) {
    const globalIdx = (validPage - 1) * pageSize + i;
    let targetCatId = categoryId;
    let template: CatalogItemTemplate;

    let pool: CatalogItemTemplate[] = [];

    if (categoryId === "all") {
      targetCatId = catKeys[(i + (validPage - 1) * 2) % catKeys.length];
      pool = MATCHED_CATALOG[targetCatId] || MATCHED_CATALOG.books;
      const itemIdx = Math.floor(i / catKeys.length + validPage) % pool.length;
      template = pool[itemIdx];
    } else {
      pool = MATCHED_CATALOG[targetCatId] || MATCHED_CATALOG.books;
      
      // Lọc nghiêm ngặt theo danh mục con
      if (subcategoryId !== "all") {
        const filtered = pool.filter(p => p.subcategoryId === subcategoryId);
        if (filtered.length > 0) {
          pool = filtered;
        }
      }

      // Lọc thêm theo thương hiệu nếu người dùng chọn
      if (brandFilter !== "all") {
        const byBrand = pool.filter(p => {
          const lowerTitle = p.title.toLowerCase();
          const lowerTag = p.tag.toLowerCase();
          if (brandFilter === "casio") return lowerTitle.includes("casio") || lowerTag.includes("casio");
          if (brandFilter === "apple") return lowerTitle.includes("apple") || lowerTitle.includes("macbook") || lowerTitle.includes("ipad") || lowerTitle.includes("airpods") || lowerTitle.includes("iphone");
          if (brandFilter === "dell") return lowerTitle.includes("dell");
          if (brandFilter === "asus") return lowerTitle.includes("asus");
          if (brandFilter === "hp") return lowerTitle.includes("hp");
          if (brandFilter === "lenovo") return lowerTitle.includes("lenovo") || lowerTitle.includes("thinkpad");
          if (brandFilter === "sony_logi") return lowerTitle.includes("sony") || lowerTitle.includes("logitech");
          return true;
        });
        if (byBrand.length > 0) {
          pool = byBrand;
        }
      }

      const itemIdx = globalIdx % pool.length;
      template = pool[itemIdx];
    }

    // Tạo biến thể thực tế nếu danh sách lặp lại ở các trang tiếp theo (đảm bảo không trùng tiêu đề y hệt)
    const cycle = Math.floor(globalIdx / pool.length);
    let finalTitle = template.title;
    if (cycle > 0) {
      const suffixes = [
        " (Gần như mới 99%)",
        " (Còn bảo hành chính hãng)",
        " (Đầy đủ phụ kiện & hộp)",
        " (Pass nhanh dọn phòng)",
        " (Tình trạng tốt không lỗi)",
        " (Bản sinh viên ít dùng)",
        " (Tặng kèm phụ kiện bảo vệ)",
        " (Chính hãng nguyên tem)"
      ];
      finalTitle += suffixes[(cycle + i) % suffixes.length];
    }

    const school = HCM_UNIVERSITIES[(globalIdx + 2) % HCM_UNIVERSITIES.length];
    const priceOffset = ((globalIdx * 7 + 3) % 7 - 3) * 5000;
    const finalPrice = Math.max(15000, template.price + priceOffset);
    const ratings = [4.8, 4.9, 5.0, 4.7, 4.6];
    const rating = ratings[(globalIdx) % ratings.length];
    const badge = (i % 4 === 0) ? "Campus Check" : (i % 6 === 0) ? "Đã xác thực" : null;

    result.push({
      id: "p_" + targetCatId + "_" + (template.subcategoryId || "all") + "_" + validPage + "_" + i,
      categoryId: targetCatId,
      subcategoryId: template.subcategoryId,
      title: finalTitle,
      school: school,
      price: finalPrice,
      image: template.image,
      badge: badge,
      categoryTag: template.tag,
      rating: rating
    });
  }

  return {
    products: result,
    totalCount,
    totalPages,
    currentPage: validPage,
    categoryName: activeCat.name,
    subcategoryName: activeSub?.name
  };
}

export const FEATURED_PRODUCTS = getCategoryProductsPage("all", "all", 1, 20).products;
