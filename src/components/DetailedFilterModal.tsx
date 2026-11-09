import { useState } from 'react';
import {
  BookOpen,
  Laptop,
  House,
  Shirt,
  Dumbbell,
  PencilRuler,
  Sparkles,
  Grid2X2,
  X,
  RotateCcw,
  ChevronDown,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import type { Filters } from '../lib/market';
import { CATEGORY_CONFIGS } from '../data/categoryConfig';
import { UNIVERSITIES } from '../data/mockData';

interface DetailedFilterModalProps {
  category: string;
  subcategory: string;
  currentFilters: Filters;
  matchCount?: number;
  onApply: (filters: Partial<Filters>) => void;
  onClose: () => void;
}

const ICONS_MAP: Record<string, any> = {
  BookOpen,
  Laptop,
  House,
  Shirt,
  Dumbbell,
  PencilRuler,
  Sparkles,
  Grid2X2,
};

export function DetailedFilterModal({
  category,
  subcategory,
  currentFilters,
  matchCount,
  onApply,
  onClose,
}: DetailedFilterModalProps) {
  // Use active category config or fallback to books
  const activeKey = category !== 'all' && CATEGORY_CONFIGS[category] ? category : 'books';
  const config = CATEGORY_CONFIGS[activeKey];
  const IconComponent = ICONS_MAP[config.iconName] || BookOpen;

  // Local draft state initialized with currentFilters
  const [draft, setDraft] = useState<Partial<Filters>>({
    category: activeKey,
    subcategory: subcategory || 'all',
    majorGroup: currentFilters.majorGroup || 'all',
    subject: currentFilters.subject || 'all',
    bookType: currentFilters.bookType || 'all',
    brand: currentFilters.brand || 'all',
    ram: currentFilters.ram || 'all',
    condition: currentFilters.condition || '',
    itemType: currentFilters.itemType || 'all',
    itemSize: currentFilters.itemSize || 'all',
    canPickupAtSchool: currentFilters.canPickupAtSchool || false,
    size: currentFilters.size || 'all',
    style: currentFilters.style || 'all',
    sport: currentFilters.sport || 'all',
    toolType: currentFilters.toolType || 'all',
    material: currentFilters.material || 'all',
    orderType: currentFilters.orderType || 'all',
    school: currentFilters.school || 'all',
    min: currentFilters.min || '',
    max: currentFilters.max || '',
  });

  const setField = (key: keyof Filters, val: any) => {
    setDraft((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setDraft({
      category: activeKey,
      subcategory: 'all',
      majorGroup: 'all',
      subject: 'all',
      bookType: 'all',
      brand: 'all',
      ram: 'all',
      condition: '',
      itemType: 'all',
      itemSize: 'all',
      canPickupAtSchool: false,
      size: 'all',
      style: 'all',
      sport: 'all',
      toolType: 'all',
      material: 'all',
      orderType: 'all',
      school: 'all',
      min: '',
      max: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(draft);
    onClose();
  };

  return (
    <div className="detailed-filter-overlay" onClick={onClose}>
      <div className="detailed-filter-card" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER CHUẨN XÁC THEO ẢNH 4 */}
        <div className="detailed-filter-header">
          <div>
            <h2>Bộ lọc chi tiết</h2>
            <p>{config.subtitle}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00513d] flex items-center justify-center border border-emerald-100">
              <IconComponent size={20} className="stroke-[2.2]" />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="detailed-filter-close"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* NỘI DUNG FORM: NGAY HÀNG THẲNG LỐI, CANH TRÁI TUYỆT ĐỐI (CHUẨN ẢNH 4 & 5) */}
        <form onSubmit={handleSubmit} className="detailed-filter-form">
          {config.filters.map((filter) => {
            const currentValue = (draft as any)[filter.key];

            // DẠNG 1: RADIO TRÒN (NGAY HÀNG THẲNG LỐI, HÌNH TRÒN BÊN TRÁI, CHỮ BÊN PHẢI)
            if (filter.type === 'radio' && filter.options) {
              return (
                <div key={filter.key} className="detailed-filter-group">
                  <h3 className="detailed-filter-group-title">
                    {filter.label}
                  </h3>
                  <div className="detailed-filter-options">
                    {filter.options.map((opt) => {
                      const isChecked =
                        currentValue === opt.id ||
                        (!currentValue && opt.id === '') ||
                        (!currentValue && opt.id === 'all');

                      return (
                        <label
                          key={opt.id}
                          className="detailed-radio-row"
                        >
                          <div
                            className={`detailed-radio-circle ${isChecked ? 'checked' : ''}`}
                          >
                            {isChecked && <div className="detailed-radio-dot" />}
                          </div>
                          <input
                            type="radio"
                            name={filter.key}
                            value={opt.id}
                            checked={isChecked}
                            onChange={() => setField(filter.key as any, opt.id)}
                            style={{ display: 'none' }}
                          />
                          <span
                            className={`detailed-radio-label ${isChecked ? 'checked' : ''}`}
                          >
                            {opt.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // DẠNG 2: DROPDOWN SELECT BO TRÒN CHUẨN ẢNH 4 ("Tất cả môn học ⌄")
            if (filter.type === 'select' && filter.options) {
              return (
                <div key={filter.key} className="detailed-filter-group">
                  <h3 className="detailed-filter-group-title">
                    {filter.label}
                  </h3>
                  <div className="detailed-select-wrapper">
                    <select
                      value={currentValue || 'all'}
                      onChange={(e) => setField(filter.key as any, e.target.value)}
                      className="detailed-select-box"
                    >
                      {filter.options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="detailed-select-icon" />
                  </div>
                </div>
              );
            }

            return null;
          })}

          {/* TRƯỜNG ĐẠI HỌC */}
          <div className="detailed-filter-group">
            <h3 className="detailed-filter-group-title flex items-center gap-1.5">
              <Building2 size={16} className="text-gray-500" />
              <span>Trường đại học / Khu vực</span>
            </h3>
            <div className="detailed-select-wrapper">
              <select
                value={draft.school || 'all'}
                onChange={(e) => setField('school', e.target.value)}
                className="detailed-select-box"
              >
                <option value="all">Tất cả trường đại học</option>
                {UNIVERSITIES.map((u) => (
                  <option key={u.code} value={u.code}>
                    {u.name} ({u.code})
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="detailed-select-icon" />
            </div>
          </div>

          {/* NÚT ĐEN BO TRÒN CHUẨN ẢNH 5 */}
          <div className="pt-2">
            <button type="submit" className="detailed-btn-apply">
              Tạo giao diện bộ lọc này {typeof matchCount === 'number' ? `(${matchCount} món phù hợp)` : ''}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="detailed-btn-reset"
            >
              <RotateCcw size={13} />
              <span>Đặt lại bộ lọc này</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
