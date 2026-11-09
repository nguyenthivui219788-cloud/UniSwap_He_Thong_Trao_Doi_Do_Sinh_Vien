export const CATEGORY_TREE = {
  books: {label:'Sách & giáo trình',icon:'BookOpen',children:{textbooks:'Giáo trình chuyên ngành',reference:'Sách tham khảo',notes:'Tài liệu & đề cương',exam:'Đề thi, tài liệu ôn tập'}},
  electronics:{label:'Đồ công nghệ',icon:'Laptop',children:{laptops:'Laptop, máy tính bàn',phones:'Điện thoại, máy tính bảng',audio:'Tai nghe, loa',calculators:'Máy tính Casio',accessories:'Phụ kiện điện tử'}},
  dorm:{label:'Đồ phòng trọ',icon:'House',children:{furniture:'Bàn ghế, kệ, tủ',lighting_fan:'Đèn bàn, quạt',kitchen:'Đồ nhà bếp',cleaning:'Đồ vệ sinh, lưu trữ',appliances:'Thiết bị gia dụng'}},
  fashion:{label:'Thời trang',icon:'Shirt',children:{clothing:'Áo, quần',jackets:'Áo khoác',footwear:'Giày, dép',bags:'Balo, túi xách',accessories:'Phụ kiện thời trang'}},
  sports:{label:'Thể thao',icon:'Dumbbell',children:{badminton:'Cầu lông',football:'Bóng đá',basketball:'Bóng rổ',gym:'Gym, tập luyện',cycling_running:'Chạy bộ, đạp xe',other:'Dụng cụ thể thao khác'}},
  stationery:{label:'Đồ học tập',icon:'PencilRuler',children:{drawing_tools:'Bút, thước, dụng cụ vẽ',calculators:'Máy tính cầm tay',notebooks:'Vở, sổ ghi chép',major_tools:'Dụng cụ học tập chuyên ngành',pencil_cases:'Hộp bút, balo học tập'}},
  handmade:{label:'Handmade',icon:'HeartHandshake',children:{keychains:'Móc khóa handmade',crochet:'Đồ len, thú bông',jewelry:'Trang sức thủ công',decor:'Đồ trang trí',materials:'Nguyên liệu handmade',diy_kits:'Bộ kit DIY'}},
  other:{label:'Khác',icon:'Grid2X2',children:{instruments:'Nhạc cụ',travel:'Đồ du lịch',collectibles:'Đồ sưu tầm',other:'Món đồ khác'}}
} as const;
export type CategoryId=keyof typeof CATEGORY_TREE;
export const CONDITIONS={new:'Mới 100%',like_new:'Như mới',used:'Đã qua sử dụng',repair:'Cần sửa chữa'} as const;
export function conditionGroup(value:string){const s=String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();if(/sua|hong|loi|khong hoat dong/.test(s))return 'repair';if(/100\s*%/.test(s)||s.trim()==='moi')return 'new';if(/nhu moi|khong tray/.test(s))return 'like_new';const percent=s.match(/(\d{2})\s*%/);if(percent&&Number(percent[1])>=95)return 'like_new';return 'used';}
export function validSubcategory(category:string,sub:string){const c=CATEGORY_TREE[category as CategoryId];return !!c&&Object.hasOwn(c.children,sub);}
export function classifyTitle(title:string):{category:CategoryId;subcategory:string}|null{
 const s=String(title||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
 if(/balo|ba lo|tui dung sach/.test(s))return {category:'stationery',subcategory:'bags'};
 if(/giay.*(the thao|tap luyen|chay bo)/.test(s))return {category:'sports',subcategory:'shoes'};
 if(/den (ban|hoc)|chieu sang/.test(s))return {category:'dorm',subcategory:'lighting'};
 if(/casio|may tinh cam tay|fx-/.test(s))return {category:'electronics',subcategory:'calculators'};
 if(/macbook|laptop|may tinh xach tay/.test(s))return {category:'electronics',subcategory:'laptops'};
 if(/moc khoa|len handmade/.test(s))return {category:'handmade',subcategory:'crochet'};
 if(/giao trinh/.test(s))return {category:'books',subcategory:'textbooks'};
 if(/tai lieu|de cuong/.test(s))return {category:'books',subcategory:'notes'};
 return null;
}
export const FREE_LIMITS={posts:3,images:5,savedSearches:5,priceAlerts:3,buyRequests:3,holds:3,postDays:30,repostHours:72,publishPerDay:5,boostCredits:0};
export function planLimits(buyer:boolean,seller:boolean){return {...FREE_LIMITS,posts:seller?20:3,images:seller?10:5,savedSearches:buyer?30:5,priceAlerts:buyer?30:3,buyRequests:buyer?10:3,holds:buyer?5:3,postDays:seller?60:30,repostHours:seller?24:72,publishPerDay:seller?20:5,boostCredits:seller?3:0};}
export const PLANS=[
 {id:'buyer',name:'Premium Mua',eyebrow:'TÌM ĐÚNG MÓN, ĐÚNG GIÁ',price:50000,days:30,buyer:true,seller:false,description:'Theo dõi món cần mua, nhận tin giảm giá và lưu nhiều nhu cầu hơn.',features:['30 bộ lọc tìm kiếm đã lưu','30 món theo dõi giảm giá','10 tin cần mua đang mở','Giữ tối đa 5 món cùng lúc']},
 {id:'seller',name:'Premium Bán',eyebrow:'ĐĂNG ĐẸP, QUẢN LÝ DỄ',price:50000,days:30,buyer:false,seller:true,description:'Thêm không gian đăng tin và công cụ quản lý những món bạn bán.',features:['20 tin đang hoạt động, 10 ảnh mỗi tin','Tin hiển thị 60 ngày; đăng lại sau 24 giờ','3 lượt đẩy tin 24 giờ trong kỳ','Thống kê lượt xem, lưu và liên hệ theo ngày']},
 {id:'both',name:'Premium Toàn Diện',eyebrow:'TRỌN QUYỀN MUA & BÁN',price:75000,days:30,buyer:true,seller:true,description:'Kết hợp đầy đủ quyền lợi Premium Mua và Premium Bán trong một gói.',features:['Toàn bộ quyền lợi Premium Mua','Toàn bộ quyền lợi Premium Bán','Một tài khoản, quản lý cả hai nhu cầu','Tiết kiệm 25% so với mua hai gói riêng']}
] as const;
export const BOOST_PLANS={push1d:3000,push3d:7000,combo5:10000} as const;
