import React, { useState } from 'react';
import { 
  BookOpen, 
  Laptop, 
  Home, 
  Shirt, 
  Activity, 
  HeartHandshake, 
  PenTool, 
  Grid, 
  LayoutGrid, 
  ChevronRight, 
  ChevronLeft, 
  ChevronsLeft,
  ChevronsRight,
  ArrowRight, 
  Heart, 
  Star, 
  ShieldCheck, 
  Truck, 
  Recycle, 
  MapPin,
  X
} from 'lucide-react';
import { ProductItem } from './src/types';
import { DEFAULT_MACBOOK_DATA } from './CHI_TIET_SAN_PHAM';
import { 
  SIDEBAR_CATEGORIES, 
  CATEGORY_TOTALS,
  CATEGORY_SUBCATEGORIES,
  getCategoryProductsPage,
  FeaturedProduct 
} from './DU_LIEU_DANH_MUC';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutGrid,
  BookOpen,
  Laptop,
  Home,
  Shirt,
  Activity,
  HeartHandshake,
  PenTool,
  Grid
};

export interface DanhMucSanPhamProps {
  onBackToHome?: () => void;
  onSelectProduct?: (product: ProductItem) => void;
  onToggleLike?: (id: string) => void;
  likedIds?: Set<string>;
}

export const DanhMucSanPham: React.FC<DanhMucSanPhamProps> = ({
  onBackToHome,
  onSelectProduct,
  onToggleLike,
  likedIds = new Set()
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [activeCategoryView, setActiveCategoryView] = useState<string>('books'); // Danh mục đang xem ở cột con kế bên
  const [showSubPanel, setShowSubPanel] = useState<boolean>(false); // Mặc định ẩn, chỉ khi ấn vào mục nào đó mới hiện
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');
  const [localLikedIds, setLocalLikedIds] = useState<Set<string>>(new Set(['p_feat_1']));

  const activeCategoryObj = SIDEBAR_CATEGORIES.find(c => c.id === selectedCategory) || SIDEBAR_CATEGORIES[0];
  const viewingCategoryObj = SIDEBAR_CATEGORIES.find(c => c.id === activeCategoryView) || SIDEBAR_CATEGORIES[1];
  const subCatConfig = CATEGORY_SUBCATEGORIES[activeCategoryView] || CATEGORY_SUBCATEGORIES.books;

  // Lấy dữ liệu 20 sản phẩm theo danh mục & danh mục con
  const {
    products: pageProducts,
    totalCount,
    totalPages,
    currentPage: activePage,
    categoryName,
    subcategoryName
  } = getCategoryProductsPage(selectedCategory, selectedSubCategory, currentPage, 20, selectedFilters);

  const handleSelectCategory = (catId: string) => {
    if (catId === 'all') {
      setSelectedCategory('all');
      setShowSubPanel(false);
    } else {
      setSelectedCategory(catId);
      setActiveCategoryView(catId);
      setShowSubPanel(true);
    }
    setSelectedSubCategory('all');
    setSelectedFilters({});
    setCurrentPage(1);
    setJumpPageInput('');
    const el = document.getElementById('product-catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectSubCategory = (subId: string) => {
    setSelectedCategory(activeCategoryView);
    setSelectedSubCategory(subId);
    setCurrentPage(1);
    setJumpPageInput('');
    const el = document.getElementById('product-catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFilterToggle = (groupTitle: string, optionId: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [groupTitle]: prev[groupTitle] === optionId ? 'all' : optionId
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const validTarget = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(validTarget);
    setJumpPageInput('');
    const el = document.getElementById('product-catalog-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleJumpPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpPageInput.trim(), 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      handlePageChange(parsed);
    }
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleLike) {
      onToggleLike(id);
    } else {
      setLocalLikedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  };

  const isLiked = (id: string) => {
    return onToggleLike ? likedIds.has(id) : localLikedIds.has(id);
  };

  // Tính toán các nút số trang thông minh hiển thị quanh trang hiện tại
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // hiển thị 2 trang trước và sau activePage

    const left = Math.max(1, activePage - delta);
    const right = Math.min(totalPages, activePage + delta);

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push('...');
    }

    for (let p = left; p <= right; p++) {
      pages.push(p);
    }

    if (right < totalPages) {
      if (right < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="w-full space-y-6">
      {/* Scoped CSS to strictly guarantee clean responsive grid alongside the dual-column category panel */}
      <style>{`
        .cat-six-cols {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 12px !important;
        }
        @media (min-width: 640px) {
          .cat-six-cols {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (min-width: 1024px) {
          .cat-six-cols {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }
        @media (min-width: 1380px) {
          .cat-six-cols {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }
        @media (min-width: 1680px) {
          .cat-six-cols {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          }
        }
        @keyframes cat3dDrift {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1.2deg);
          }
        }
        .cat-3d-floating {
          animation: cat3dDrift 6s ease-in-out infinite;
        }
      `}</style>
      
      {/* Hero / Banner with 3 Distinct Parts: Left Typography, Center 3D Student Objects, Right Translucent Benefit Card */}
      <div className="relative w-full overflow-hidden rounded-[24px] bg-[#EDF4E9] border border-[#d2e4d0] shadow-xs min-h-[220px] lg:h-[254px] mb-[26px]">
        
        {/* Center: The 3D Student Items Scene (books, laptop, backpack, headphones, plant, pedestal, sun, doodle) */}
        <div className="absolute top-0 right-[280px] bottom-0 left-[340px] hidden lg:flex items-end justify-center pointer-events-none select-none z-0">
          <img 
            src="/assets/banner-3d-scene-transparent.png" 
            alt="Đồ cũ giá tốt & Cụm đồ dùng sinh viên 3D" 
            className="h-full w-auto max-w-full object-contain object-bottom [image-rendering:-webkit-optimize-contrast] filter drop-shadow-md transition-all"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full flex items-center justify-between p-6 lg:px-8 lg:py-6">
          
          {/* Left: Breadcrumbs, Title, Description */}
          <div className="max-w-[400px] flex flex-col justify-between h-full py-1">
            {/* Top: Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium mb-3">
              <button 
                onClick={onBackToHome}
                className="flex items-center gap-1 text-gray-800 hover:text-[#00513D] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Trang chủ</span>
              </button>
              <span className="text-gray-400 font-normal">&gt;</span>
              <span className="bg-white/80 backdrop-blur-xs text-gray-600 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-gray-200/50">
                Danh mục
              </span>
            </div>

            {/* Middle: Tiêu đề Danh mục sản phẩm (Đã bỏ 2 gạch vàng theo yêu cầu) */}
            <div className="space-y-2.5 my-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-[33px] font-black text-[#00513D] tracking-tight leading-tight">
                Danh mục sản phẩm
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-[13px] text-[#20583f] leading-relaxed max-w-sm font-medium">
                Khám phá đa dạng sản phẩm từ cộng đồng sinh viên tại nhiều trường đại học trên toàn quốc.
              </p>
            </div>
          </div>

          {/* Right: Bảng ba lợi ích nền trắng mờ (Translucent Glass Benefit Card) */}
          <div className="hidden lg:flex flex-col justify-center gap-4 bg-white/80 backdrop-blur-md rounded-[20px] px-6 py-5 border border-white/70 shadow-[0_8px_30px_rgba(0,81,61,0.04)] z-10 shrink-0 w-[275px]">
            {/* Benefit 1 */}
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-6 h-6 text-[#00513D] stroke-[1.8] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-[#00513D] leading-tight">
                  Sản phẩm được xác thực
                </h4>
                <p className="text-[11.5px] text-[#3d604e] font-normal leading-tight mt-0.5">
                  &amp; có hồ sơ tình trạng
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-3.5">
              <Truck className="w-6 h-6 text-[#00513D] stroke-[1.8] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-[#00513D] leading-tight">
                  Giao dịch an toàn
                </h4>
                <p className="text-[11.5px] text-[#3d604e] font-normal leading-tight mt-0.5">
                  với cộng đồng sinh viên
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-3.5">
              <Recycle className="w-6 h-6 text-[#00513D] stroke-[1.8] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[13px] font-bold text-[#00513D] leading-tight">
                  Tái sử dụng - Tiết kiệm
                </h4>
                <p className="text-[11.5px] text-[#3d604e] font-normal leading-tight mt-0.5">
                  vì một tương lai xanh
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Fallback: 3D scene on mobile */}
          <div className="block lg:hidden pt-2">
            <img 
              src="/assets/banner-3d-scene-transparent.png" 
              alt="3D Items" 
              className="w-full h-auto max-h-[140px] object-contain object-center [image-rendering:-webkit-optimize-contrast]"
            />
          </div>

        </div>
      </div>

      {/* 2-Column Content Layout (Dual-Column Category Panel like Image 5 + Product Grid) */}
      <div className="flex flex-col xl:flex-row items-start gap-6 w-full">
        
        {/* Left Side: Dual-Pane Category & Subcategory Container (Giống Ảnh 5) */}
        <aside className={`shrink-0 transition-all duration-300 ${showSubPanel && selectedCategory !== 'all' ? 'w-full xl:w-[540px]' : 'w-full xl:w-[260px]'}`}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row overflow-hidden sticky top-24">
            
            {/* CỘT 1: DANH MỤC CHÍNH (Giống cột bên trái Ảnh 5) */}
            <div className={`p-3 space-y-1 shrink-0 bg-[#fbfdfb] transition-all ${
              showSubPanel && selectedCategory !== 'all'
                ? 'w-full md:w-[240px] border-b md:border-b-0 md:border-r border-gray-100'
                : 'w-full'
            }`}>
              <div className="px-3.5 py-2 text-sm font-bold text-gray-900 border-b border-gray-100 mb-2 flex items-center justify-between">
                <span>Danh mục</span>
              </div>

              {/* Tất cả danh mục */}
              <button
                onClick={() => handleSelectCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#EDF4E9] text-[#00513D] shadow-2xs'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${selectedCategory === 'all' ? 'bg-[#00513D] text-white' : 'bg-[#00513D]/10 text-[#00513D]'}`}>
                    <LayoutGrid className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  <span>Tất cả danh mục</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${selectedCategory === 'all' ? 'text-[#00513D]' : 'text-gray-400'}`} />
              </button>

              {/* 8 Danh mục chính */}
              {SIDEBAR_CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
                const Icon = ICON_MAP[cat.iconName] || LayoutGrid;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#EDF4E9] text-[#00513D] font-bold shadow-2xs'
                        : 'text-gray-700 font-medium hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 stroke-[1.8] ${isSelected ? 'text-[#00513D] stroke-[2.2]' : 'text-gray-600'}`} />
                      <span>{cat.name}</span>
                    </div>

                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#00513D] stroke-[2.5]' : 'text-gray-300'}`} />
                  </button>
                );
              })}
            </div>

            {/* CỘT 2: DANH MỤC CON KẾ BÊN - Chỉ hiện khi người dùng ấn vào 1 danh mục cụ thể */}
            {showSubPanel && selectedCategory !== 'all' && (
              <div className="w-full md:w-[300px] p-3.5 space-y-3 bg-white flex-1 min-h-[460px] flex flex-col animate-in fade-in duration-200">
                <div>
                  {/* Header danh mục con kèm nút đóng */}
                  <div className="border-b border-gray-100 pb-2.5 mb-2.5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#00513D] tracking-tight">
                        {subCatConfig.categoryName}
                      </h3>
                      <span className="text-[10px] text-gray-400">
                        Chọn danh mục con bên dưới:
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#00513D] bg-[#EDF4E9] px-2 py-0.5 rounded-full border border-[#00513D]/20">
                        {viewingCategoryObj.count || ''} món
                      </span>
                      <button
                        onClick={() => setShowSubPanel(false)}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Đóng danh mục con"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    </div>
                  </div>

                  {/* Danh sách danh mục con (Trình bày thanh lịch như Ảnh 5) */}
                  <div className="space-y-0.5">
                    {subCatConfig.subcategories.map((sub) => {
                      const isSubSelected = selectedCategory === activeCategoryView && selectedSubCategory === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSubCategory(sub.id)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                            isSubSelected
                              ? 'bg-[#00513D] text-white font-bold shadow-xs'
                              : 'text-gray-700 hover:bg-[#EDF4E9]/60 hover:text-[#00513D]'
                          }`}
                        >
                          <span className="truncate">{sub.name}</span>
                          {sub.count && (
                            <span className={`text-[10px] font-medium ml-2 ${isSubSelected ? 'text-white/80' : 'text-gray-400'}`}>
                              {sub.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Các bộ lọc con đặc thù (Loại sách, Tình trạng, Thương hiệu... như Ảnh 1, 2, 3, 4) */}
                  {subCatConfig.filterGroups && subCatConfig.filterGroups.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-gray-100 space-y-2.5">
                      {subCatConfig.filterGroups.map((group) => (
                        <div key={group.title} className="space-y-1">
                          <div className="text-[11px] font-bold text-gray-800">
                            {group.title}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {group.options.map((opt) => {
                              const isOptActive = (selectedFilters[group.title] || 'all') === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => handleFilterToggle(group.title, opt.id)}
                                  className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                                    isOptActive
                                      ? 'bg-[#00513D] text-white border-[#00513D] font-bold shadow-2xs'
                                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* Right Main Column: Product Catalog Grid */}
        <main className="flex-1 min-w-0 space-y-6 w-full">
          {/* Section: Sản phẩm nổi bật / lọc theo danh mục (20 sản phẩm / trang) */}
          <section id="product-catalog-grid" className="space-y-4 scroll-mt-24">
            
            {/* Header thông tin lọc và tổng số lượng sản phẩm */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-100 pb-3.5 bg-white p-4 rounded-2xl border shadow-2xs">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-[22px] font-bold text-[#00513D] tracking-tight">
                    {selectedCategory === 'all'
                      ? 'Tất cả sản phẩm'
                      : `Sản phẩm: ${categoryName}`}
                    {selectedSubCategory !== 'all' && subcategoryName && (
                      <span className="text-gray-500 font-normal"> › {subcategoryName}</span>
                    )}
                  </h2>
                  <span className="text-xs font-extrabold text-[#00513D] bg-[#EDF4E9] px-3 py-1 rounded-full border border-[#00513D]/20">
                    {totalCount.toLocaleString('vi-VN')} sản phẩm
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1.5">
                  Hiển thị {((activePage - 1) * 20 + 1).toLocaleString('vi-VN')} - {Math.min(activePage * 20, totalCount).toLocaleString('vi-VN')} trong tổng số {totalCount.toLocaleString('vi-VN')} món tại TP.HCM (Trang {activePage} / {totalPages.toLocaleString('vi-VN')})
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                {selectedCategory !== 'all' ? (
                  <button 
                    onClick={() => handleSelectCategory('all')}
                    className="text-xs font-bold text-[#00513D] bg-[#EDF4E9]/60 hover:bg-[#EDF4E9] px-3 py-1.5 rounded-xl border border-[#00513D]/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Xem tất cả ({CATEGORY_TOTALS.all.toLocaleString('vi-VN')})</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>
                ) : (
                  <button 
                    onClick={onBackToHome}
                    className="text-xs font-semibold text-[#00513D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Về trang chủ</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>
                )}
              </div>
            </div>

            {/* 20 Products Grid (6 columns desktop) */}
            <div className="cat-six-cols">
              {pageProducts.map((p) => {
                const liked = isLiked(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (onSelectProduct) {
                        if (p.id.includes('macbook') || p.title.toLowerCase().includes('macbook')) {
                          onSelectProduct(DEFAULT_MACBOOK_DATA);
                        } else {
                          onSelectProduct({
                            id: p.id,
                            title: p.title,
                            price: p.price,
                            images: [p.image],
                            tradeType: 'sale',
                            condition: '95% còn rất tốt',
                            description: `${p.title} tại ${p.school}`,
                            category: (p.categoryId as any) || 'books',
                            majorGroup: 'all',
                            cluster: 'all',
                            meetingSpot: p.school,
                            createdAt: 'Vừa đăng',
                            views: 120,
                            likes: 12,
                            status: 'available',
                            seller: { 
                              id: 's_uniswap', 
                              name: 'Sinh viên UniSwap', 
                              studentId: '2026DBC', 
                              universityCode: 'UNISWAP', 
                              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                              rating: p.rating,
                              isVerified: true,
                              isPro: false
                            }
                          });
                        }
                      }
                    }}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
                  >
                    {/* Top Image + Badges */}
                    <div className="relative aspect-[1.28/1] w-full bg-[#f4f7f5] overflow-hidden">
                      <img 
                        src={p.image} 
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                        }}
                      />

                      {/* Campus Check / Handmade Badge */}
                      {p.badge && (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-[#00b074] text-white text-[9px] font-bold shadow-xs flex items-center gap-1 backdrop-blur-xs">
                          <MapPin className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                          <span>{p.badge}</span>
                        </div>
                      )}

                      {/* Heart Button */}
                      <button
                        onClick={(e) => handleLike(p.id, e)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/85 hover:bg-white text-gray-700 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                        aria-label="Lưu sản phẩm"
                      >
                        <Heart 
                          className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : 'text-gray-400 hover:text-gray-600'}`} 
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#00513D] transition-colors line-clamp-2 leading-snug">
                          {p.title}
                        </h3>
                        
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                          <MapPin className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                          <span className="truncate">{p.school}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-extrabold text-[#00513D] mt-2">
                          {p.price.toLocaleString('vi-VN')}đ
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-[10px] text-gray-500">
                          <span className="bg-[#eef7f2] text-[#00513D] px-2 py-0.5 rounded font-medium truncate max-w-[100px]">
                            {p.categoryTag}
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold shrink-0">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <span>{p.rating}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Pagination Bar (Phân trang 20 sản phẩm/trang, có Next / Prev và nhảy trang) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-3.5 sm:p-4 mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Info text */}
              <div className="text-xs text-gray-500 font-medium">
                Đang xem trang <span className="font-bold text-[#00513D]">{activePage}</span> / <span className="font-bold text-gray-700">{totalPages.toLocaleString('vi-VN')}</span> (20 sản phẩm/lần xem)
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
                
                {/* Đầu trang */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={activePage === 1}
                  className="px-2 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-0.5 cursor-pointer"
                  title="Về trang đầu tiên"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đầu</span>
                </button>

                {/* Trang trước */}
                <button
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Trước</span>
                </button>

                {/* Page Number Buttons */}
                {getPageNumbers().map((item, idx) => {
                  if (typeof item === 'string') {
                    return (
                      <span key={`dots_${idx}`} className="px-1 text-xs text-gray-400 select-none">
                        ...
                      </span>
                    );
                  }
                  const isCurrent = item === activePage;
                  return (
                    <button
                      key={`page_${item}`}
                      onClick={() => handlePageChange(item)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#00513D] text-white shadow-2xs'
                          : 'bg-gray-50 text-gray-700 hover:bg-[#EDF4E9] hover:text-[#00513D]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}

                {/* Trang sau (Next) */}
                <button
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === totalPages}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#EDF4E9] text-[#00513D] hover:bg-[#00513D] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Sau</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Cuối trang */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={activePage === totalPages}
                  className="px-2 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-0.5 cursor-pointer"
                  title="Đến trang cuối cùng"
                >
                  <span className="hidden sm:inline">Cuối</span>
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Jump to Page Input */}
              <form onSubmit={handleJumpPageSubmit} className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-500 whitespace-nowrap">Đến trang:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  placeholder={String(activePage)}
                  className="w-14 px-2 py-1.5 rounded-lg border border-gray-200 text-center text-xs font-bold text-gray-800 focus:outline-none focus:border-[#00513D] focus:ring-1 focus:ring-[#00513D]"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 rounded-lg bg-[#00513D] text-white font-semibold hover:bg-[#003e2e] transition-colors cursor-pointer"
                >
                  Đi
                </button>
              </form>

            </div>

          </section>

        </main>

      </div>
    </div>
  );
};

export const CategoryCatalog = DanhMucSanPham;
export default DanhMucSanPham;
