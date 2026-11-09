import React from 'react';
import { ShieldCheck, Shield, ArrowRight } from 'lucide-react';

export interface CommunityFlowProps {
  onOpenCreateModal?: () => void;
  onOpenHunterModal?: () => void;
}

export const CommunityFlowSections: React.FC<CommunityFlowProps> = ({
  onOpenCreateModal,
  onOpenHunterModal
}) => {
  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 my-6 sm:my-8 font-sans">
      
      {/* ========================================================================= */}
      {/* KHỐI 1: MỘT MÓN ĐỒ. BA BƯỚC KẾT NỐI (HOW IT WORKS CARD CHUẨN ẢNH 1)      */}
      {/* ========================================================================= */}
      <section 
        id="community" 
        className="w-full bg-white rounded-[24px] border border-[#e8efe3] p-6 sm:p-8 lg:p-9 shadow-xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-stretch">
          
          {/* CỘT INTRO BÊN TRÁI (~col-span-4) */}
          <div className="lg:col-span-4 flex flex-col justify-between pr-0 lg:pr-8 lg:border-r border-[#edf2ea]">
            <div>
              {/* Badge Bắt đầu thật dễ */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf6ed] text-[#2c7748] text-[11px] font-bold mb-3 select-none">
                <span>🌿</span>
                <span className="tracking-wider uppercase">BẮT ĐẦU THẬT DỄ</span>
              </div>

              {/* Tiêu đề chính */}
              <h2 className="text-2xl sm:text-[27px] font-black text-[#0d3826] leading-[1.26] tracking-tight mb-2.5">
                Một món đồ.<br />
                <span className="text-[#f5a623]">Ba bước</span> kết nối.
              </h2>

              {/* Mô tả phụ */}
              <p className="text-[12px] text-gray-500 leading-relaxed max-w-[220px]">
                Đơn giản từ lúc tìm kiếm<br />đến khi trao tay.
              </p>
            </div>

            {/* Họa tiết nét vẽ tay hình cành lá / trái tim uốn lượn dưới text */}
            <div className="mt-4 pt-1 select-none">
              <svg width="110" height="22" viewBox="0 0 110 22" fill="none" className="text-[#7da385]/70">
                <path 
                  d="M2 14C30 9 65 18 90 8C95 6 102 3 105 10C107 14 102 18 97 16C92 14 93 8 98 6" 
                  stroke="currentColor" 
                  strokeWidth="1.4" 
                  strokeLinecap="round" 
                />
              </svg>
            </div>
          </div>

          {/* 3 BƯỚC BÊN PHẢI (~col-span-8 chia 3 cột) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 pl-0 lg:pl-2 items-start">
            
            {/* BƯỚC 01 */}
            <div className="flex flex-col px-0 sm:px-5 lg:px-6 sm:border-r border-[#edf2ea] h-full justify-start">
              {/* Header: Icon tròn có tia nắng + Số 01 */}
              <div className="flex items-center justify-between mb-3.5">
                {/* Icon tròn Hộp quà 3D */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#edf6ee] flex items-center justify-center text-[#236b40]">
                    {/* Isometric Cube / Box */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                  </div>
                  {/* Tia sáng vàng tỏa ra */}
                  <div className="absolute -top-1 -right-1 flex gap-0.5 text-[#f5a623] text-[9px] font-bold select-none">
                    <span>✦</span>
                  </div>
                </div>

                {/* Số 01 màu xanh lá pastel */}
                <span className="text-2xl sm:text-3xl font-black text-[#5fa379] leading-none select-none tracking-tight">
                  01
                </span>
              </div>

              <h3 className="text-[13.5px] font-bold text-[#0d3826] mb-1.5 leading-snug">
                Chọn món đồ bạn cần
              </h3>
              <p className="text-[11.5px] text-gray-500 leading-relaxed">
                Khám phá theo danh mục, mức giá và trường đại học của bạn tại TP.HCM.
              </p>
            </div>

            {/* BƯỚC 02 */}
            <div className="flex flex-col px-0 sm:px-5 lg:px-6 sm:border-r border-[#edf2ea] h-full justify-start">
              {/* Header: Icon tròn Chat/MapPin + Số 02 */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#edf6ee] flex items-center justify-center text-[#236b40]">
                    {/* Chat Bubble & Pin */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                      <path d="M8 10h.01" />
                      <path d="M12 10h.01" />
                      <path d="M16 10h.01" />
                    </svg>
                  </div>
                  {/* Tia sáng vàng tỏa ra */}
                  <div className="absolute -top-1 -right-1 flex gap-0.5 text-[#f5a623] text-[9px] font-bold select-none">
                    <span>✦</span>
                  </div>
                </div>

                {/* Số 02 màu xanh lá pastel */}
                <span className="text-2xl sm:text-3xl font-black text-[#5fa379] leading-none select-none tracking-tight">
                  02
                </span>
              </div>

              <h3 className="text-[13.5px] font-bold text-[#0d3826] mb-1.5 leading-snug">
                Nhắn tin, hẹn gặp
              </h3>
              <p className="text-[11.5px] text-gray-500 leading-relaxed">
                Trao đổi tình trạng món đồ và thống nhất điểm hẹn sảnh trường / KTX an toàn.
              </p>
            </div>

            {/* BƯỚC 03 */}
            <div className="flex flex-col px-0 sm:px-5 lg:px-6 h-full justify-start">
              {/* Header: Icon tròn Trao tay + Số 03 */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#edf6ee] flex items-center justify-center text-[#236b40]">
                    {/* Exchange Hands / Token */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M16 8h4a2 2 0 0 1 2 2v2" />
                      <path d="M8 16H4a2 2 0 0 1-2-2v-2" />
                      <path d="M16 16l4-4" />
                      <path d="M8 8L4 12" />
                    </svg>
                  </div>
                  {/* Tia sáng vàng tỏa ra */}
                  <div className="absolute -top-1 -right-1 flex gap-0.5 text-[#f5a623] text-[9px] font-bold select-none">
                    <span>✦</span>
                  </div>
                </div>

                {/* Số 03 màu xanh lá pastel */}
                <span className="text-2xl sm:text-3xl font-black text-[#5fa379] leading-none select-none tracking-tight">
                  03
                </span>
              </div>

              <h3 className="text-[13.5px] font-bold text-[#0d3826] mb-1.5 leading-snug">
                Trao tay, tiếp giá trị
              </h3>
              <p className="text-[11.5px] text-gray-500 leading-relaxed">
                Kiểm tra trực tiếp món đồ trước khi nhận để món đồ bắt đầu hành trình mới.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* KHỐI 2: THANH CAM KẾT AN TOÀN (SAFETY BAR CHUẨN ẢNH 1)                    */}
      {/* ========================================================================= */}
      <div className="w-full bg-white rounded-2xl border border-[#e2e8df] px-5 py-3 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        
        {/* Nhóm bên trái: Khiên tick + 3 cam kết */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs text-gray-600">
          {/* Nhãn chính */}
          <div className="flex items-center gap-2 font-bold text-[#0d3826] pr-1 sm:border-r border-gray-200">
            <ShieldCheck className="w-4 h-4 text-[#1e6b45] stroke-[2.2]" />
            <span>Một cuộc trao đổi an tâm</span>
          </div>

          {/* 3 Cam kết */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[11.5px]">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#1e6b45]/70 stroke-[1.8]" />
              <span>Gặp tại nơi công cộng trong khuôn viên trường</span>
            </span>

            <span className="text-gray-300 select-none">•</span>

            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#1e6b45]/70 stroke-[1.8]" />
              <span>Kiểm tra đồ trước khi nhận</span>
            </span>

            <span className="text-gray-300 select-none">•</span>

            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#1e6b45]/70 stroke-[1.8]" />
              <span>Bảo vệ thông tin cá nhân</span>
            </span>
          </div>
        </div>

        {/* Nút Tìm hiểu gói Pro bên phải */}
        <button
          type="button"
          onClick={onOpenHunterModal}
          className="text-xs font-semibold text-gray-500 hover:text-[#0d3826] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          <span>Tìm hiểu gói Pro</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* KHỐI 3: BANNER CTA MÓN TIẾP THEO, TỪ BẠN? (CLOSING BANNER CHUẨN ẢNH 1)   */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-[20px] bg-[#0c432d] p-6 sm:p-8 lg:px-10 lg:py-7 shadow-md">
        
        {/* Nếp gấp hình học 3D hữu cơ chìm màu xanh ngọc ở bên phải */}
        <svg 
          className="absolute right-0 top-0 h-full w-[450px] pointer-events-none select-none opacity-25"
          viewBox="0 0 450 140" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <path d="M80 140L200 40L350 100L450 0V140H80Z" fill="#1b7a54" />
          <path d="M150 140L270 20L420 140H150Z" fill="#2eb07d" opacity="0.6" />
          <path d="M260 0L380 90L450 30V0H260Z" fill="#155e41" />
        </svg>

        {/* Ngôi sao 4 cánh lấp lánh màu vàng ✦ ở giữa bên phải */}
        <div className="absolute right-[280px] top-1/2 -translate-y-1/2 pointer-events-none select-none text-[#fab42b] opacity-80 hidden md:block">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#fab42b" fillOpacity="0.3" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          
          {/* Nhóm text bên trái */}
          <div className="text-center sm:text-left">
            <small className="text-[10.5px] font-bold text-[#7ca98f] tracking-[0.14em] uppercase block mb-1.5 select-none">
              ĐỒ TỐT KHÔNG NÊN BỊ LÃNG QUÊN.
            </small>

            <h2 className="text-2xl sm:text-[29px] font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span>Món tiếp theo,</span>
              <span className="relative inline-block text-[#f7b538]">
                <span>từ bạn?</span>
                
                {/* 3 tia sáng vàng/trắng ấm tỏa ra bên cạnh dấu '?' */}
                <svg
                  className="w-5 h-5 absolute -top-3.5 -right-5 text-[#f7b538] select-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6L2 2" />
                  <path d="M12 4V0" />
                  <path d="M18 6L22 2" />
                </svg>

                {/* Nét gạch uốn lượn màu vàng mềm mại bên dưới 'từ bạn?' */}
                <svg 
                  className="w-full h-3 absolute -bottom-2 left-0 text-[#f7b538] select-none"
                  viewBox="0 0 100 12" 
                  fill="none"
                >
                  <path d="M2 6C30 11 70 12 98 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
          </div>

          {/* Nút Đăng món đồ của bạn bên phải */}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-6 sm:px-7 py-3 rounded-xl bg-[#fab42b] hover:bg-[#e9a41e] text-[#0d3826] text-xs sm:text-[13.5px] font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98 shrink-0"
          >
            <span>Đăng món đồ của bạn</span>
            <span className="text-base font-black leading-none">＋</span>
          </button>

        </div>
      </section>

    </div>
  );
};

export default CommunityFlowSections;
