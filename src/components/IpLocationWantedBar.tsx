import React, { useEffect, useState, useRef } from 'react';
import { 
  MapPin, Sparkles, ChevronDown, Crosshair, 
  Gift, ArrowRight, Check, Flame
} from 'lucide-react';

function calculateDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}

export interface IpLocationData {
  ip: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  cluster: string;
  clusterName: string;
}

export interface IpLocationWantedBarProps {
  onLocationDetected?: (coords: { lat: number; lng: number }, cluster: string) => void;
  onSelectCategory?: (category: string) => void;
  onOpenWanted?: () => void;
  onGoToGiving?: () => void;
  currentCluster?: string;
  onSelectCluster?: (cluster: string) => void;
}

// Tọa độ trung tâm các Cụm trường ĐH TP.HCM
const CLUSTER_COORDS: Record<string, { lat: number; lng: number; name: string; neededCategories: Array<{ id: string; label: string; icon: string }> }> = {
  'q10': {
    lat: 10.7720,
    lng: 106.6580,
    name: 'Cụm Q.10 (Bách Khoa, Kinh Tế, Huflit)',
    neededCategories: [
      { id: 'books', label: 'Sách Kinh Tế / Ngoại ngữ TOEIC', icon: '📚' },
      { id: 'electronics', label: 'Laptop đồ họa & Chuột máy tính', icon: '💻' },
      { id: 'dorm', label: 'Bàn ghế gấp & Tủ lạnh mini', icon: '🛏️' },
      { id: 'stationery', label: 'Dụng cụ vẽ & Tài liệu học', icon: '✏️' },
    ]
  },
  'lang-dh': {
    lat: 10.8700,
    lng: 106.8030,
    name: 'Làng Đại Học TP.HCM (Thủ Đức - Dĩ An)',
    neededCategories: [
      { id: 'books', label: 'Giáo trình Bách Khoa / KHTN', icon: '📚' },
      { id: 'electronics', label: 'Máy tính Casio 580 / Laptop', icon: '💻' },
      { id: 'dorm', label: 'Quạt máy & Nồi cơm KTX', icon: '🏠' },
      { id: 'stationery', label: 'Xe đạp / Xe máy đi học', icon: '🛵' },
    ]
  },
  'q5': {
    lat: 10.7570,
    lng: 106.6780,
    name: 'Cụm Q.5 (KHTN, Sư Phạm, Y Dược, Sài Gòn)',
    neededCategories: [
      { id: 'books', label: 'Giáo trình Y Khoa / Sư Phạm', icon: '📚' },
      { id: 'electronics', label: 'iPad / Máy tính bảng ghi chép', icon: '📱' },
      { id: 'dorm', label: 'Đồ dùng trọ chuyển nhà', icon: '📦' },
      { id: 'fashion', label: 'Áo blouse & Đồng phục thể dục', icon: '🥼' },
    ]
  },
  'binh-thanh': {
    lat: 10.8030,
    lng: 106.7130,
    name: 'Cụm Bình Thạnh (HUTECH, UEF, Ngoại Thương, GTVT)',
    neededCategories: [
      { id: 'books', label: 'Sách Ngoại Thương & Kinh Doanh', icon: '📚' },
      { id: 'electronics', label: 'Phụ kiện Macbook / Tai nghe', icon: '🎧' },
      { id: 'dorm', label: 'Nội thất phòng trọ mini', icon: '🏠' },
      { id: 'fashion', label: 'Quần áo & Balo đi học', icon: '🎒' },
    ]
  },
  'nam-sai-gon': {
    lat: 10.7320,
    lng: 106.6990,
    name: 'Nam Sài Gòn (RMIT, Tôn Đức Thắng, UFM)',
    neededCategories: [
      { id: 'electronics', label: 'MacBook / iPad / Màn hình', icon: '💻' },
      { id: 'books', label: 'Sách giáo trình tiếng Anh', icon: '📖' },
      { id: 'dorm', label: 'Đồ decor phòng & Bàn học', icon: '🪴' },
      { id: 'stationery', label: 'Xe điện / Xe máy tay ga', icon: '🛵' },
    ]
  }
};

export const IpLocationWantedBar: React.FC<IpLocationWantedBarProps> = ({
  onLocationDetected,
  onSelectCategory,
  onOpenWanted,
  onGoToGiving,
  currentCluster = 'all',
  onSelectCluster
}) => {
  const [locationData, setLocationData] = useState<IpLocationData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function detectLocation() {
      try {
        const response = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4000) });
        const data = await response.json();

        if (isMounted && data && data.success !== false) {
          const lat = data.latitude || 10.7769;
          const lng = data.longitude || 106.6599;

          let nearestCluster = 'q10';
          let minDistance = Infinity;

          Object.entries(CLUSTER_COORDS).forEach(([key, val]) => {
            const d = calculateDistance({ lat, lng }, { lat: val.lat, lng: val.lng });
            if (d < minDistance) {
              minDistance = d;
              nearestCluster = key;
            }
          });

          const detected: IpLocationData = {
            ip: data.ip || '118.69.182.204',
            city: data.city || 'Ho Chi Minh City',
            region: data.region || 'Hồ Chí Minh',
            lat,
            lng,
            cluster: nearestCluster,
            clusterName: CLUSTER_COORDS[nearestCluster]?.name || 'Cụm Q.10 (Bách Khoa, Kinh Tế, Huflit)'
          };

          setLocationData(detected);
          onLocationDetected?.({ lat, lng }, nearestCluster);
        }
      } catch (err) {
        if (isMounted) {
          const fallback: IpLocationData = {
            ip: '118.69.182.204',
            city: 'Ho Chi Minh City',
            region: 'Hồ Chí Minh',
            lat: 10.7720,
            lng: 106.6580,
            cluster: 'q10',
            clusterName: CLUSTER_COORDS['q10'].name
          };
          setLocationData(fallback);
          onLocationDetected?.({ lat: 10.7720, lng: 106.6580 }, 'q10');
        }
      }
    }

    detectLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeClusterKey = (currentCluster !== 'all' ? currentCluster : locationData?.cluster) || 'q10';
  const clusterInfo = CLUSTER_COORDS[activeClusterKey] || CLUSTER_COORDS['q10'];

  return (
    <div 
      className="w-full my-4 p-3.5 sm:p-4 rounded-2xl border border-gray-200/90 bg-white shadow-xs"
      style={{ fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif" }}
    >
      {/* HÀNG TRÊN: VỊ TRÍ + TỰ ĐỘNG ĐỊNH VỊ + NÚT HÀNH ĐỘNG (CHUẨN ẢNH MẪU 2) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
        
        {/* Nhóm bên trái: Vị trí của bạn & Tự động định vị */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          
          {/* Card Vị trí của bạn */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#eaf4eb] hover:bg-[#e2efe4] border border-[#d5e8d7] transition-all cursor-pointer text-left select-none active:scale-98"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-[#00513d] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 fill-[#00513d] text-[#00513d]" />
              </div>
              <div className="pr-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block leading-tight">
                  VỊ TRÍ CỦA BẠN
                </span>
                <span className="text-sm font-bold text-gray-900 block leading-tight">
                  {locationData?.city || 'Ho Chi Minh City'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown chọn nhanh cụm khu vực */}
            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Chọn cụm trường theo vị trí
                </div>
                {Object.entries(CLUSTER_COORDS).map(([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onSelectCluster?.(key);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                      activeClusterKey === key ? 'bg-emerald-50 text-[#00513d] font-bold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span>{val.name}</span>
                    {activeClusterKey === key && <Check className="w-4 h-4 text-[#00513d]" />}
                  </button>
                ))}
                <div className="border-t border-gray-100 my-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCluster?.('all');
                      setDropdownOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer ${
                      currentCluster === 'all' ? 'bg-emerald-50 text-[#00513d] font-bold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    🌐 Xem toàn TP.HCM (Không lọc cụm)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Phân khu Tự động định vị */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 shadow-2xs">
              <Crosshair className="w-4 h-4 text-gray-700" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900 block leading-tight">
                Tự động định vị
              </span>
              <span className="text-[11.5px] text-gray-500 block leading-tight">
                Tìm kiếm gần khu vực của bạn
              </span>
            </div>
          </div>
        </div>

        {/* Nhóm bên phải: Nút đỏ Nhu cầu tìm đồ + Nút xanh Góc 0đ + Xem toàn TP.HCM */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
          <button
            type="button"
            onClick={onOpenWanted}
            className="px-4 py-2.5 rounded-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Flame className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            <span>Nhu cầu tìm đồ Khu vực này</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onGoToGiving}
            className="px-4 py-2.5 rounded-full bg-[#00513d] hover:bg-[#003829] text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Góc 0đ tặng sinh viên</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCluster?.('all')}
            className={`text-xs font-semibold px-2 py-1 transition-colors cursor-pointer ${
              currentCluster === 'all'
                ? 'text-[#00513d] font-bold underline'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Xem toàn TP.HCM
          </button>
        </div>
      </div>
    </div>
  );
};

export default IpLocationWantedBar;
