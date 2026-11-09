import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  lat: number;
  lng: number;
  label: string;
  address: string;
  userCoords?: { lat: number; lng: number } | null;
  onOpenDirections?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  lat,
  lng,
  label,
  address,
  userCoords,
  onOpenDirections
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  
  // Mặc định hiển thị Giao diện Vệ tinh (Satellite Hybrid) theo yêu cầu
  const [mapType, setMapType] = useState<'satellite' | 'street'>('satellite');

  // Khởi tạo bản đồ
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Giới hạn phạm vi bản đồ độc quyền trong khu vực TP. Hồ Chí Minh
    const HCMC_BOUNDS = L.latLngBounds(
      L.latLng(10.35, 106.35), // Góc Tây Nam (Bình Chánh / Nhà Bè / Cần Giờ)
      L.latLng(11.18, 107.02)  // Góc Đông Bắc (Củ Chi / TP. Thủ Đức / Làng ĐH)
    );

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 17,
      minZoom: 11,
      maxZoom: 20,
      maxBounds: HCMC_BOUNDS,
      maxBoundsViscosity: 1.0, // Cố định và chặn kéo bản đồ ra khỏi phạm vi TP.HCM
      zoomControl: false,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // Thiết lập lớp bản đồ ban đầu (mặc định Vệ tinh)
    const initialTileUrl = mapType === 'satellite'
      ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
      : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    const tiles = L.tileLayer(initialTileUrl, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    tiles.addTo(map);
    tileLayerRef.current = tiles;

    // Nút Zoom (+ / -) góc trên bên phải
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Ghim UniSwap phát sáng tại vị trí trường đại học
    const campusIcon = L.divIcon({
      className: 'uniswap-map-pin',
      html: `
        <div style="position:relative; width:42px; height:42px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
          <span style="position:absolute; width:100%; height:100%; border-radius:50%; background:#10b981; opacity:0.45; animation:ping 1.6s cubic-bezier(0,0,0.2,1) infinite;"></span>
          <div style="position:relative; width:32px; height:32px; border-radius:50%; background:#00513D; border:2.5px solid #ffffff; box-shadow:0 4px 16px rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; color:#ffffff;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 40]
    });

    const destinationMarker = L.marker([lat, lng], { icon: campusIcon }).addTo(map);

    destinationMarker.bindPopup(`
      <div style="font-family:system-ui,-apple-system,sans-serif; min-width:185px; padding:3px;">
        <div style="font-size:12.5px; font-weight:800; color:#00513D; line-height:1.2;">${label}</div>
        <div style="font-size:10px; color:#555; margin-top:3px; line-height:1.35;">${address}</div>
        <div style="margin-top:6px; display:inline-block; background:#eef7f2; border:1px solid #bbf7d0; color:#00513D; font-size:9px; font-weight:700; padding:2px 6px; border-radius:4px;">
          📍 Điểm giao dịch UniSwap an toàn
        </div>
      </div>
    `, { offset: [0, -30] }).openPopup();

    // Nếu người mua bật GPS: Vẽ vị trí và lộ trình kết nối
    if (userCoords) {
      const userIcon = L.divIcon({
        className: 'user-gps-pin',
        html: `
          <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
            <span style="position:absolute; width:100%; height:100%; border-radius:50%; background:#3b82f6; opacity:0.45; animation:ping 1.4s cubic-bezier(0,0,0.2,1) infinite;"></span>
            <div style="position:relative; width:22px; height:22px; border-radius:50%; background:#2563eb; border:2.5px solid #ffffff; box-shadow:0 2px 12px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; color:#ffffff;">
              <div style="width:8px; height:8px; border-radius:50%; background:#ffffff;"></div>
            </div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon }).addTo(map);
      userMarker.bindPopup('<strong style="font-size:11px; color:#2563eb;">Vị trí hiện tại của bạn</strong>');

      const polyline = L.polyline([
        [userCoords.lat, userCoords.lng],
        [lat, lng]
      ], {
        color: '#10b981',
        dashArray: '6, 8',
        weight: 3.5,
        opacity: 0.95
      }).addTo(map);

      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, label, address, userCoords]);

  // Cập nhật lớp Vệ tinh / Bản đồ đường phố khi bấm chuyển chế độ
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // 'lyrs=y': Google Maps Hybrid Satellite (Hình ảnh vệ tinh thật + nhãn tên đường phố)
    // 'lyrs=m': Google Maps Standard Roadmap (Bản đồ số giao thông)
    const newTileUrl = mapType === 'satellite'
      ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
      : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    const newTiles = L.tileLayer(newTileUrl, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    newTiles.addTo(map);
    tileLayerRef.current = newTiles;
  }, [mapType]);

  return (
    <div className="relative w-full h-full min-h-[250px] bg-[#1a231e] rounded-xl overflow-hidden select-none">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Nút chuyển đổi nhanh Vệ tinh 🛰️ / Bản đồ 🗺️ ở góc trên bên trái */}
      <div className="absolute top-2 left-2 z-[400] flex items-center bg-black/70 backdrop-blur-md p-0.5 rounded-lg border border-white/20 shadow-md">
        <button
          type="button"
          onClick={() => setMapType('satellite')}
          className={`px-2 py-0.5 rounded-md text-[8.5px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
            mapType === 'satellite'
              ? 'bg-[#00513D] text-white shadow-xs border border-emerald-400/40'
              : 'text-gray-300 hover:text-white'
          }`}
          title="Chế độ ảnh vệ tinh thực tế từ trên cao"
        >
          <span>🛰️ Vệ tinh</span>
        </button>
        <button
          type="button"
          onClick={() => setMapType('street')}
          className={`px-2 py-0.5 rounded-md text-[8.5px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
            mapType === 'street'
              ? 'bg-[#00513D] text-white shadow-xs border border-emerald-400/40'
              : 'text-gray-300 hover:text-white'
          }`}
          title="Chế độ bản đồ đường phố"
        >
          <span>🗺️ Bản đồ</span>
        </button>
      </div>

      {/* Floating Badge Tên trường học ở góc dưới bên trái */}
      <div className={`absolute bottom-2 left-2 text-[8.5px] font-bold px-2 py-0.5 rounded-md shadow-md border flex items-center gap-1.5 z-[400] pointer-events-none transition-colors ${
        mapType === 'satellite' 
          ? 'bg-black/75 backdrop-blur-md text-white border-white/20' 
          : 'bg-white/95 backdrop-blur-xs text-gray-800 border-gray-200'
      }`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>{label}</span>
      </div>

      {/* Nút mở bản đồ lớn Google Maps ở góc dưới bên phải */}
      {onOpenDirections && (
        <button
          type="button"
          onClick={onOpenDirections}
          className="absolute bottom-2 right-2 bg-[#00513D] hover:bg-[#073e2b] text-white text-[8.5px] font-bold px-2.5 py-1 rounded-md shadow-md border border-emerald-300/30 flex items-center gap-1 transition-all cursor-pointer z-[400] active:scale-95"
          title="Mở Google Maps chỉ đường turn-by-turn"
        >
          <span>Mở bản đồ lớn</span>
          <span className="text-[9.5px]">↗</span>
        </button>
      )}
    </div>
  );
};

export default InteractiveMap;
