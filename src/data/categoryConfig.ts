export interface CategoryDetailConfig {
  id: string;
  name: string;
  iconName: string;
  subtitle: string;
  subcategories: { id: string; label: string }[];
  filters: {
    key: string;
    label: string;
    type: 'radio' | 'select' | 'checkbox_group' | 'text' | 'price';
    options?: { id: string; label: string }[];
    placeholder?: string;
  }[];
}

export const CATEGORY_CONFIGS: Record<string, CategoryDetailConfig> = {
  books: {
    id: 'books',
    name: 'Sách & giáo trình',
    iconName: 'BookOpen',
    subtitle: 'Ví dụ khi người dùng chọn danh mục Sách & giáo trình',
    subcategories: [
      { id: 'textbooks', label: 'Giáo trình theo môn' },
      { id: 'reference', label: 'Sách tham khảo' },
      { id: 'notes', label: 'Tài liệu & đề cương' },
      { id: 'exam', label: 'Đề thi, tài liệu ôn tập' },
      { id: 'programming', label: 'Lập trình & CNTT' },
      { id: 'economics', label: 'Kinh tế & quản trị' },
      { id: 'languages', label: 'Ngoại ngữ' },
      { id: 'literature', label: 'Văn học & kỹ năng' },
      { id: 'science', label: 'Khoa học & kỹ thuật' },
      { id: 'other', label: 'Sách khác' },
    ],
    filters: [
      {
        key: 'majorGroup',
        label: 'Ngành học',
        type: 'radio',
        options: [
          { id: 'all', label: 'Tất cả ngành' },
          { id: 'it', label: 'Công nghệ thông tin' },
          { id: 'economics', label: 'Kinh tế – Quản trị kinh doanh' },
          { id: 'engineering', label: 'Kỹ thuật – Cơ khí – Điện' },
          { id: 'languages', label: 'Ngôn ngữ' },
          { id: 'general', label: 'Ngành khác' },
        ],
      },
      {
        key: 'subject',
        label: 'Môn học',
        type: 'select',
        options: [
          { id: 'all', label: 'Tất cả môn học' },
          { id: 'Toán cao cấp', label: 'Toán cao cấp' },
          { id: 'Giải tích', label: 'Giải tích 1 & 2' },
          { id: 'Đại số tuyến tính', label: 'Đại số tuyến tính' },
          { id: 'Cấu trúc dữ liệu', label: 'Cấu trúc dữ liệu & Giải thuật' },
          { id: 'Cơ sở dữ liệu', label: 'Cơ sở dữ liệu' },
          { id: 'Lập trình hướng đối tượng', label: 'Lập trình hướng đối tượng' },
          { id: 'Triết học Mác-Lênin', label: 'Triết học Mác – Lênin' },
          { id: 'Kinh tế vi mô', label: 'Kinh tế vi mô / Vĩ mô' },
          { id: 'Tiếng Anh', label: 'Tiếng Anh chuyên ngành' },
        ],
      },
      {
        key: 'bookType',
        label: 'Loại sách',
        type: 'radio',
        options: [
          { id: 'all', label: 'Tất cả' },
          { id: 'textbook', label: 'Giáo trình chính thức' },
          { id: 'reference', label: 'Sách tham khảo' },
          { id: 'notes', label: 'Tài liệu và vở ghi' },
          { id: 'exam', label: 'Đề thi, tài liệu ôn tập' },
        ],
      },
      {
        key: 'condition',
        label: 'Tình trạng',
        type: 'radio',
        options: [
          { id: '', label: 'Tất cả' },
          { id: 'like_new', label: 'Gần như mới' },
          { id: 'used', label: 'Đã sử dụng, còn tốt' },
          { id: 'repair', label: 'Có ghi chú hoặc hao mòn' },
        ],
      },
    ],
  },

  electronics: {
    id: 'electronics',
    name: 'Đồ công nghệ',
    iconName: 'Laptop',
    subtitle: 'Laptop, điện thoại, phụ kiện & thiết bị điện tử sinh viên',
    subcategories: [
      { id: 'laptops', label: 'Laptop, máy tính bàn' },
      { id: 'phones', label: 'Điện thoại, máy tính bảng' },
      { id: 'audio', label: 'Tai nghe, loa' },
      { id: 'calculators', label: 'Máy tính Casio' },
      { id: 'accessories', label: 'Phụ kiện điện tử' },
      { id: 'gaming', label: 'Gaming & gear' },
      { id: 'screens', label: 'Màn hình & bàn phím' },
      { id: 'storage', label: 'Ổ cứng & lưu trữ' },
    ],
    filters: [
      {
        key: 'brand',
        label: 'Thương hiệu',
        type: 'radio',
        options: [
          { id: 'all', label: 'Tất cả thương hiệu' },
          { id: 'Apple', label: 'Apple (MacBook / iPhone / iPad)' },
          { id: 'ASUS', label: 'ASUS' },
          { id: 'Dell', label: 'Dell' },
          { id: 'HP', label: 'HP' },
          { id: 'Lenovo', label: 'Lenovo / ThinkPad' },
          { id: 'Casio', label: 'Casio' },
          { id: 'Sony', label: 'Sony / Marshall / JBL' },
        ],
      },
      {
        key: 'ram',
        label: 'Thông số RAM (với laptop & PC)',
        type: 'select',
        options: [
          { id: 'all', label: 'Tất cả dung lượng RAM' },
          { id: '8GB', label: '8GB RAM (Đủ học tập cơ bản)' },
          { id: '16GB', label: '16GB RAM (Lập trình, đồ họa mượt)' },
          { id: '32GB', label: '32GB RAM trở lên' },
        ],
      },
      {
        key: 'condition',
        label: 'Tình trạng',
        type: 'radio',
        options: [
          { id: '', label: 'Tất cả tình trạng' },
          { id: 'like_new', label: 'Như mới (99% không trầy xước)' },
          { id: 'used', label: 'Tốt (Đang dùng ổn định)' },
          { id: 'repair', label: 'Có lỗi nhẹ / cần sửa' },
        ],
      },
      {
        key: 'warranty',
        label: 'Bảo hành & Phụ kiện',
        type: 'radio',
        options: [
          { id: 'all', label: 'Tất cả' },
          { id: 'active', label: 'Còn bảo hành chính hãng' },
          { id: 'fullbox', label: 'Đầy đủ cáp sạc và phụ kiện' },
          { id: 'device_only', label: 'Chỉ có thân máy' },
        ],
      },
    ],
  },

  dorm: {
    id: 'dorm',
    name: 'Đồ phòng trọ',
    iconName: 'House',
    subtitle: 'Nội thất, gia dụng & đồ dùng cho phòng trọ, KTX',
    subcategories: [
      { id: 'furniture', label: 'Bàn ghế, kệ, tủ' },
      { id: 'lighting_fan', label: 'Đèn bàn, quạt' },
      { id: 'kitchen', label: 'Đồ nhà bếp' },
      { id: 'cleaning', label: 'Đồ vệ sinh, lưu trữ' },
      { id: 'appliances', label: 'Thiết bị gia dụng' },
      { id: 'bedding', label: 'Chăn ga & đồ ngủ' },
      { id: 'other', label: 'Đồ phòng trọ khác' },
    ],
    filters: [
      {
        key: 'itemType',
        label: 'Loại đồ phòng trọ',
        type: 'select',
        options: [
          { id: 'all', label: 'Tất cả loại đồ' },
          { id: 'bàn', label: 'Bàn học / Bàn gấp gọn' },
          { id: 'ghế', label: 'Ghế xoay / Ghế tựa' },
          { id: 'kệ', label: 'Kệ sách / Kệ để giày' },
          { id: 'quạt', label: 'Quạt đứng / Quạt treo tường' },
          { id: 'nồi', label: 'Nồi cơm điện / Bếp từ' },
          { id: 'đèn', label: 'Đèn bàn học' },
        ],
      },
      {
        key: 'itemSize',
        label: 'Kích thước',
        type: 'radio',
        options: [
          { id: 'all', label: 'Tất cả kích thước' },
          { id: 'small', label: 'Nhỏ (Gọn gàng, dễ mang lên gác lửng)' },
          { id: 'medium', label: 'Vừa (Kích thước tiêu chuẩn < 1m2)' },
          { id: 'large', label: 'Lớn (Cần xe ba gác / xe tải)' },
        ],
      },
      {
        key: 'condition',
        label: 'Tình trạng',
        type: 'radio',
        options: [
          { id: '', label: 'Tất cả' },
          { id: 'like_new', label: 'Như mới' },
          { id: 'used', label: 'Còn tốt, chắc chắn' },
          { id: 'repair', label: 'Có hao mòn nhẹ theo thời gian' },
        ],
      },
    ],
  },

  fashion: {
    id: 'fashion',
    name: 'Thời trang',
    iconName: 'Shirt',
    subtitle: 'Quần áo, giày dép, balo & phụ kiện sinh viên',
    subcategories: [
      { id: 'clothing', label: 'Áo, quần' },
      { id: 'jackets', label: 'Áo khoác' },
      { id: 'footwear', label: 'Giày, dép' },
      { id: 'bags', label: 'Balo, túi xách' },
      { id: 'accessories', label: 'Phụ kiện thời trang' },
      { id: 'formal', label: 'Trang phục thuyết trình' },
    ],
    filters: [
      {
        key: 'size',
        label: 'Kích cỡ (Size)',
        type: 'radio',
        options: [
          { id: 'all', label: 'Tất cả kích cỡ' },
          { id: 'XS', label: 'Size XS' },
          { id: 'S', label: 'Size S (Dưới 52kg)' },
          { id: 'M', label: 'Size M (52 - 62kg)' },
          { id: 'L', label: 'Size L (62 - 72kg)' },
          { id: 'XL', label: 'Size XL trở lên' },
          { id: 'Free size', label: 'Free size / Oversize' },
        ],
      },
      {
        key: 'style',
        label: 'Phong cách',
        type: 'select',
        options: [
          { id: 'all', label: 'Tất cả phong cách' },
          { id: 'basic', label: 'Basic hàng ngày sinh viên' },
          { id: 'thể thao', label: 'Thể thao, năng động' },
          { id: 'vintage', label: 'Vintage / Retro' },
          { id: 'thuyết trình', label: 'Đi thuyết trình, công sở, phỏng vấn' },
        ],
      },
      {
        key: 'condition',
        label: 'Tình trạng sản phẩm',
        type: 'radio',
        options: [
          { id: '', label: 'Tất cả' },
          { id: 'new', label: 'Mới 100% nguyên tag' },
          { id: 'like_new', label: 'Như mới (mặc 1 - 2 lần)' },
          { id: 'used', label: 'Đã sử dụng, còn tốt' },
        ],
      },
    ],
  },

  sports: {
    id: 'sports',
    name: 'Thể thao',
    iconName: 'Dumbbell',
    subtitle: 'Cầu lông, bóng đá, bóng rổ, gym & rèn luyện sức khỏe',
    subcategories: [
      { id: 'badminton', label: 'Cầu lông' },
      { id: 'football', label: 'Bóng đá' },
      { id: 'basketball', label: 'Bóng rổ' },
      { id: 'gym', label: 'Gym, tập luyện' },
      { id: 'cycling_running', label: 'Chạy bộ, đạp xe' },
      { id: 'other', label: 'Dụng cụ thể thao khác' },
    ],
    filters: [
      {
        key: 'sport',
        label: 'Môn thể thao',
        type: 'radio',
        options: [
          { id: 'all', label: 'Tất cả môn' },
          { id: 'cầu lông', label: 'Cầu lông (Vợt, giày, bao đựng)' },
          { id: 'bóng đá', label: 'Bóng đá (Giày đinh, quả bóng)' },
          { id: 'bóng rổ', label: 'Bóng rổ' },
          { id: 'gym', label: 'Gym / Dụng cụ tập thể hình tại phòng' },
          { id: 'chạy bộ', label: 'Chạy bộ / Đạp xe' },
        ],
      },
      {
        key: 'brand',
        label: 'Thương hiệu',
        type: 'select',
        options: [
          { id: 'all', label: 'Tất cả thương hiệu' },
          { id: 'Yonex', label: 'Yonex' },
          { id: 'Lining', label: 'Lining' },
          { id: 'Victor', label: 'Victor' },
          { id: 'Nike', label: 'Nike' },
          { id: 'Adidas', label: 'Adidas' },
          { id: 'Decathlon', label: 'Decathlon / Kipsta' },
        ],
      },
      {
        key: 'condition',
        label: 'Tình trạng',
        type: 'radio',
        options: [
          { id: '', label: 'Tất cả' },
          { id: 'like_new', label: 'Như mới (chưa va chạm xước)' },
          { id: 'used', label: 'Tốt (dây đan căng, phom chuẩn)' },
          { id: 'repair', label: 'Có hao mòn nhẹ theo thời gian' },
        ],
      },
    ],
  },

  stationery: {
    id: 'stationery',
    name: 'Đồ học tập',
    iconName: 'PencilRuler',
    subtitle: 'Bút, thước, máy tính cầm tay & dụng cụ chuyên ngành',
    subcategories: [
      { id: 'drawing_tools', label: 'Bút, thước, dụng cụ vẽ' },
      { id: 'calculators', label: 'Máy tính cầm tay' },
      { id: 'notebooks', label: 'Vở, sổ ghi chép' },
      { id: 'major_tools', label: 'Dụng cụ học tập chuyên ngành' },
      { id: 'pencil_cases', label: 'Hộp bút, balo học tập' },
      { id: 'other', label: 'Đồ học tập khác' },
    ],
    filters: [
      {
        key: 'toolType',
        label: 'Loại dụng cụ',
        type: 'radio',
        options: [
          { id: 'all', label: 'Tất cả dụng cụ' },
          { id: 'máy tính', label: 'Máy tính cầm tay (Casio FX-580VN...)' },
          { id: 'thước', label: 'Thước kỹ thuật, compa, eke vẽ đồ án' },
          { id: 'bút', label: 'Bút ký, bút dạ quang, bút chì kỹ thuật' },
          { id: 'vở', label: 'Vở, sổ tay ghi chép' },
        ],
      },
      {
        key: 'majorGroup',
        label: 'Ngành học ứng dụng',
        type: 'select',
        options: [
          { id: 'all', label: 'Dùng chung cho mọi ngành' },
          { id: 'engineering', label: 'Kỹ thuật - Xây dựng - Cơ khí' },
          { id: 'architecture', label: 'Kiến trúc - Mỹ thuật' },
          { id: 'economics', label: 'Kinh tế - Kế toán - Ngân hàng' },
          { id: 'it', label: 'Công nghệ thông tin' },
        ],
      },
      {
        key: 'condition',
        label: 'Tình trạng',
        type: 'radio',
        options: [
          { id: '', label: 'Tất cả' },
          { id: 'new', label: 'Mới 100% chưa qua sử dụng' },
          { id: 'like_new', label: 'Tốt (Đầy đủ nắp, hộp, linh kiện)' },
          { id: 'used', label: 'Đã sử dụng' },
        ],
      },
    ],
  },

  handmade: {
    id: 'handmade',
    name: 'Handmade',
    iconName: 'Sparkles',
    subtitle: 'Thú bông len, móc khóa, trang sức thủ công & kit DIY',
    subcategories: [
      { id: 'keychains', label: 'Móc khóa handmade' },
      { id: 'crochet', label: 'Đồ len, thú bông' },
      { id: 'jewelry', label: 'Trang sức thủ công' },
      { id: 'decor', label: 'Đồ trang trí' },
      { id: 'materials', label: 'Nguyên liệu handmade' },
      { id: 'diy_kits', label: 'Bộ kit DIY' },
      { id: 'other', label: 'Handmade khác' },
    ],
    filters: [
      {
        key: 'material',
        label: 'Chất liệu làm đồ',
        type: 'radio',
        options: [
          { id: 'all', label: 'Tất cả chất liệu' },
          { id: 'len', label: 'Len sợi (Thú bông, móc khóa len)' },
          { id: 'hạt', label: 'Hạt cườm, pha lê (Vòng tay, dây chuyền)' },
          { id: 'gỗ', label: 'Gỗ, resin, đất sét tự khô' },
          { id: 'vải', label: 'Vải nỉ, canvas' },
        ],
      },
      {
        key: 'orderType',
        label: 'Hình thức sản phẩm',
        type: 'radio',
        options: [
          { id: 'all', label: 'Tất cả' },
          { id: 'ready', label: 'Đồ thành phẩm làm sẵn (lấy ngay)' },
          { id: 'custom', label: 'Nhận đặt làm theo yêu cầu / phối màu' },
          { id: 'diy', label: 'Nguyên liệu & Bộ kit tự làm' },
        ],
      },
      {
        key: 'condition',
        label: 'Tình trạng',
        type: 'radio',
        options: [
          { id: '', label: 'Tất cả' },
          { id: 'new', label: 'Mới tinh 100%' },
          { id: 'used', label: 'Đã dùng để trang trí' },
        ],
      },
    ],
  },
};
