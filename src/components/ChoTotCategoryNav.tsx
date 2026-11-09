import { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Laptop,
  House,
  Shirt,
  Dumbbell,
  PencilRuler,
  Sparkles,
  Grid2X2,
  ChevronRight,
  Check,
} from 'lucide-react';
import { CATEGORY_TREE, type CategoryId } from '../../shared/catalog';
import { categories } from '../lib/market';

interface ChoTotCategoryNavProps {
  activeCategory: string;
  activeSubcategory: string;
  onSelectCategory: (cat: string, sub?: string) => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  all: Grid2X2,
  books: BookOpen,
  electronics: Laptop,
  dorm: House,
  fashion: Shirt,
  sports: Dumbbell,
  stationery: PencilRuler,
  handmade: Sparkles,
  other: Grid2X2,
};

export function ChoTotCategoryNav({
  activeCategory,
  activeSubcategory,
  onSelectCategory,
}: ChoTotCategoryNavProps) {
  // Chỉ hiện khi di chuột tới danh mục đó (hover)
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);

  const handleMouseEnter = (catKey: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (catKey !== 'all') {
      setHoveredCat(catKey);
    } else {
      setHoveredCat(null);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCat(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const activeSubTree = hoveredCat && (CATEGORY_TREE as any)[hoveredCat]?.children
    ? Object.entries((CATEGORY_TREE as any)[hoveredCat].children)
    : [];

  return (
    <div
      ref={containerRef}
      className="chotot-nav-container"
      onMouseLeave={handleMouseLeave}
    >
      <div className="chotot-nav-header">
        <h2>Danh mục</h2>
        <span className="chotot-nav-badge">UniSwap</span>
      </div>

      {/* CỘT DANH MỤC CHÍNH (Đầy đủ chữ, rộng rãi, không bị co ép) */}
      <div className="chotot-nav-list">
        {Object.entries(categories).map(([key, label]) => {
          const Icon = CATEGORY_ICONS[key] || Grid2X2;
          const isSelected = activeCategory === key;
          const isHovered = hoveredCat === key;

          return (
            <div
              key={key}
              className="chotot-item-wrapper"
              onMouseEnter={() => handleMouseEnter(key)}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectCategory(key, 'all');
                  setHoveredCat(null);
                }}
                className={`chotot-main-btn ${isSelected ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
              >
                <div className="chotot-main-info">
                  <span className="chotot-main-icon">
                    <Icon size={19} />
                  </span>
                  <span className="chotot-main-label">{label}</span>
                </div>
                {key !== 'all' && (
                  <ChevronRight size={15} className="chotot-main-chevron" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* FLYOUT DANH MỤC CON: DI CHUỘT TỚI ĐÂU MỚI HIỆN RA CÁI ĐÓ */}
      {hoveredCat && activeSubTree.length > 0 && (
        <div
          className="chotot-flyout-panel animate-in fade-in zoom-in-95 duration-150"
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="chotot-flyout-header">
            <h3>{categories[hoveredCat]}</h3>
          </div>

          <div className="chotot-flyout-list">
            {/* Mục "Tất cả [Tên danh mục]" */}
            <button
              type="button"
              onClick={() => {
                onSelectCategory(hoveredCat, 'all');
                setHoveredCat(null);
              }}
              className={`chotot-flyout-btn ${
                activeCategory === hoveredCat && (activeSubcategory === 'all' || !activeSubcategory)
                  ? 'active'
                  : ''
              }`}
            >
              <span>Tất cả {categories[hoveredCat]?.toLowerCase()}</span>
              {activeCategory === hoveredCat && (activeSubcategory === 'all' || !activeSubcategory) && (
                <Check size={15} className="chotot-flyout-check" />
              )}
            </button>

            {/* Các vật phẩm chính xác người dùng yêu cầu (không thanh cuộn, hiện full) */}
            {activeSubTree.map(([subKey, subLabel]) => {
              const isSubActive =
                activeCategory === hoveredCat && activeSubcategory === subKey;

              return (
                <button
                  key={subKey}
                  type="button"
                  onClick={() => {
                    onSelectCategory(hoveredCat, subKey);
                    setHoveredCat(null);
                  }}
                  className={`chotot-flyout-btn ${isSubActive ? 'active' : ''}`}
                >
                  <span>{subLabel as string}</span>
                  {isSubActive && (
                    <Check size={15} className="chotot-flyout-check" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
