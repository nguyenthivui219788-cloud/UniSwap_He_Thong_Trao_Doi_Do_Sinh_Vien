import React from 'react';
import { ArrowRight, Gift, GraduationCap, ShieldCheck } from 'lucide-react';

export interface GivingSectionProps {
  onGoToGiving?: () => void;
  onSelectProduct?: (productId: string) => void;
  onOpenPaymentReg?: (title: string) => void;
}

export const GivingSection: React.FC<GivingSectionProps> = ({
  onGoToGiving,
  onSelectProduct,
  onOpenPaymentReg
}) => {
  return (
    <section id="giving" className="w-full my-6 sm:my-8 scroll-mt-24">
      <div 
        className="relative overflow-hidden shadow-xs"
        style={{
          backgroundColor: '#f8f5ec', // Gam màu kem be ấm tự nhiên đúng chuẩn Ảnh 1
          border: '1px solid #e7ede0',
          borderRadius: '26px',
          padding: '38px 46px',
          boxSizing: 'border-box'
        }}
      >
        {/* ======================================================================= */}
        {/* HỌA TIẾT NỀN HỮU CƠ (ORGANIC VECTOR WAVES CHUẨN ẢNH 1)                  */}
        {/* ======================================================================= */}
        {/* Vết loang cong xanh sage ở góc trên bên phải */}
        <svg 
          className="absolute top-0 right-0 pointer-events-none select-none"
          width="360" 
          height="200" 
          viewBox="0 0 360 200" 
          fill="none"
        >
          <path 
            d="M80 0C160 50 220 25 270 75C320 125 330 90 360 140V0H80Z" 
            fill="#e2ecdb" 
            opacity="0.7" 
          />
        </svg>

        {/* Vết loang cong xanh sage mềm mại ở góc dưới bên trái */}
        <svg 
          className="absolute bottom-0 left-0 pointer-events-none select-none"
          width="340" 
          height="190" 
          viewBox="0 0 340 190" 
          fill="none"
        >
          <path 
            d="M 0 65 C 80 45, 150 115, 230 110 C 275 107, 310 145, 340 190 H 0 Z" 
            fill="#e1ecda" 
            opacity="0.85" 
          />
        </svg>

        {/* Cành cây 3 chiếc lá vươn lên nghệ thuật đúng chuẩn Ảnh 1 (nằm dưới mép phải nút, không đè nút) */}
        <svg 
          width="82" 
          height="82" 
          viewBox="0 0 90 90" 
          fill="none" 
          className="absolute bottom-2 pointer-events-none select-none text-[#718d70] z-10 hidden sm:block"
          style={{ left: '235px' }}
        >
          {/* Cuống cành cong mềm mại */}
          <path 
            d="M 14 84 C 25 64, 40 46, 56 26" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
          />
          {/* Chiếc lá 1: bên trái chĩa lên trên sang trái (~10h) */}
          <path 
            d="M 33 54 C 20 46, 21 32, 31 29 C 39 37, 38 47, 33 54 Z" 
            fill="#8aa389" 
          />
          <path 
            d="M 33 54 C 31 46, 28 38, 30 30" 
            stroke="#f0f6ee" 
            strokeWidth="0.9" 
            strokeLinecap="round" 
            opacity="0.75" 
          />
          {/* Chiếc lá 2: bên phải chĩa ngang sang phải (~3h-4h) */}
          <path 
            d="M 43 47 C 56 46, 65 52, 73 54 C 64 61, 52 57, 43 47 Z" 
            fill="#8aa389" 
          />
          <path 
            d="M 43 47 C 52 48, 61 51, 71 54" 
            stroke="#f0f6ee" 
            strokeWidth="0.9" 
            strokeLinecap="round" 
            opacity="0.75" 
          />
          {/* Chiếc lá 3: trên đỉnh cành chĩa lên trên sang phải (~1h-2h) */}
          <path 
            d="M 56 26 C 65 14, 79 9, 88 7 C 84 20, 72 30, 56 26 Z" 
            fill="#8aa389" 
          />
          <path 
            d="M 56 26 C 66 21, 75 16, 86 8" 
            stroke="#f0f6ee" 
            strokeWidth="1" 
            strokeLinecap="round" 
            opacity="0.75" 
          />
        </svg>

        {/* ======================================================================= */}
        {/* MASTER HORIZONTAL ROW: TEXT BLOCK (LEFT) + 2 CARDS (RIGHT)              */}
        {/* ======================================================================= */}
        <div 
          className="relative z-10 flex flex-col lg:flex-row items-center justify-between"
          style={{
            gap: '36px'
          }}
        >
          
          {/* ===================================================================== */}
          {/* CỘT TRÁI: TIÊU ĐỀ, MÔ TẢ, NÚT BẤM, CHỮ VIẾT TAY "Lan toả sự tử tế"    */}
          {/* ===================================================================== */}
          <div 
            className="flex flex-col items-start w-full lg:max-w-[480px] shrink-0"
          >
            {/* 1. Kicker với 2 chiếc lá mềm mại hữu cơ & đường kẻ ngang thanh mảnh */}
            <div className="flex items-center gap-2.5 mb-3.5 w-full">
              {/* Icon 2 chiếc lá vector mềm mại chuẩn Ảnh 1 */}
              <svg 
                width="22" 
                height="22" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="shrink-0 text-[#497053] select-none"
              >
                {/* Lá trái */}
                <path d="M7 17C6.2 13 8 9.5 11 8C11 11 9.5 14.5 7 17Z" fill="currentColor" opacity="0.85" />
                {/* Lá phải */}
                <path d="M10 18C10 12 14 7 19 6C19 11 15 16 10 18Z" fill="currentColor" />
                {/* Cuống */}
                <path d="M6 20C8 18 10 17 12 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>

              <span 
                className="text-[11.5px] font-bold text-[#456b50] tracking-[0.15em] uppercase whitespace-nowrap"
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
              >
                TẶNG ĐI MỘT ĐIỀU TỐT
              </span>

              {/* Đường kẻ ngang tinh tế kéo dài */}
              <div 
                className="h-[1px] bg-[#497053]/35 ml-1"
                style={{ width: '110px', minWidth: '40px' }}
              />
            </div>

            {/* 2. Tiêu đề chính dạng Serif thanh lịch chuẩn xác Ảnh 1 (đã xóa triệt để 3 vệt màu vàng theo yêu cầu) */}
            <h2 
              className="font-bold text-[#0c432d] tracking-tight mb-3 select-none"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '34px',
                lineHeight: '1.24',
                fontWeight: 700
              }}
            >
              Có những món đồ,
              <br />
              giá trị hơn giá tiền.
            </h2>

            {/* 3. Đoạn mô tả với phong cách báo chí nhẹ nhàng */}
            <p 
              className="text-[13px] text-[#425949] leading-relaxed mb-6 font-normal"
              style={{ 
                maxWidth: '430px',
                fontFamily: "'Be Vietnam Pro', sans-serif"
              }}
            >
              Chia sẻ những gì bạn không còn dùng. Để một bạn tân sinh viên hoặc bạn cùng trường có thêm khởi đầu.
            </p>

            {/* 4. Khối Nút bấm + Chữ viết tay "Lan toả sự tử tế ♡" */}
            <div className="relative w-full flex items-center justify-between pt-1">
              {/* Nút bấm viên thuốc xanh thông sâu */}
              <button
                type="button"
                onClick={onGoToGiving}
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#114b35] hover:bg-[#0c3827] text-white text-[13px] font-bold shadow-sm hover:shadow transition-all cursor-pointer group active:scale-98 shrink-0"
              >
                <span>Ghé góc cho tặng</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Chữ viết tay nghệ thuật: 2 dòng nghiêng + Trái tim ♡ + Nét vẽ cong thanh mảnh lượn sóng chuẩn Ảnh 1 */}
              <div 
                className="flex flex-col select-none shrink-0"
                style={{
                  fontFamily: "'Caveat', cursive",
                  color: '#708d77',
                  transform: 'rotate(-4deg)',
                  transformOrigin: 'bottom left',
                  marginRight: '12px'
                }}
              >
                <div 
                  className="text-[25px] leading-tight font-semibold tracking-wide"
                  style={{ letterSpacing: '0.02em' }}
                >
                  Lan toả
                </div>
                <div className="text-[24px] leading-tight font-semibold tracking-wide flex items-center gap-2 pl-3.5 pt-0.5">
                  <span>sự tử tế</span>
                  {/* Trái tim vẽ tay nét mảnh rỗng chuẩn xác */}
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="inline-block transform rotate-12 -mt-0.5"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                {/* Đường gạch dưới lượn sóng mềm mại vút lên bên phải chuẩn Ảnh 1 */}
                <svg 
                  width="210" 
                  height="26" 
                  viewBox="0 0 210 26" 
                  fill="none" 
                  className="text-[#96b099] -mt-1 -ml-2 pointer-events-none select-none"
                >
                  <path 
                    d="M 4 20 C 35 22, 70 19, 115 13 C 155 7, 195 4, 208 3" 
                    stroke="currentColor" 
                    strokeWidth="1.8" 
                    strokeLinecap="round" 
                  />
                </svg>
              </div>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* CỘT PHẢI: 2 CARDS MẪU ĐỒ CHO TẶNG CHUẨN XÁC 100% THEO ẢNH 1          */}
          {/* ===================================================================== */}
          <div 
            className="flex items-center gap-4 shrink-0 overflow-x-auto w-full lg:w-auto justify-center lg:justify-end py-1"
          >
            
            {/* ----------------------------------------------------------------- */}
            {/* THẺ 1: BALO SINH VIÊN CÒN TỐT (ĐH BÁCH KHOA TP.HCM)               */}
            {/* ----------------------------------------------------------------- */}
            <div 
              onClick={() => onSelectProduct?.('give_1')}
              className="bg-white rounded-2xl border border-[#e8efe3] shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-all cursor-pointer group shrink-0"
              style={{
                width: '245px',
                maxWidth: '245px'
              }}
            >
              {/* Ảnh Balo trên bàn gỗ kèm chậu cây phía sau */}
              <div 
                className="relative bg-gray-100 overflow-hidden"
                style={{ height: '168px' }}
              >
                <img
                  src="/assets/give-backpack.jpg"
                  alt="Balo sinh viên còn tốt"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/prod-backpack.png';
                  }}
                />

                {/* Badge góc trên bên trái: 🎁 CHO TẶNG */}
                <div 
                  className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-[#20603d] border border-[#20603d]/20 px-2 py-0.5 rounded-full text-[9.5px] font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Gift className="w-3 h-3 text-[#20603d]" />
                  <span>CHO TẶNG</span>
                </div>
              </div>

              {/* Thông tin thẻ */}
              <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                <div>
                  <h3 className="text-[13px] font-bold text-gray-900 group-hover:text-[#114b35] transition-colors truncate">
                    Balo sinh viên còn tốt
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
                    <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">ĐH Bách Khoa TP.HCM</span>
                  </div>
                </div>

                {/* Nút màu đỏ dạng button Đăng ký để biết thông tin */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPaymentReg?.('Balo sinh viên còn tốt');
                  }}
                  className="w-full py-1.5 px-2 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Đăng ký để biết thông tin</span>
                </button>

                {/* Chân thẻ: Huy hiệu Miễn phí + Nút tròn mũi tên */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#1f6640] bg-[#edf6ee] px-2.5 py-0.5 rounded-full">
                    🌱 Miễn phí
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGoToGiving?.();
                    }}
                    className="w-7 h-7 rounded-full bg-[#f0f6ed] hover:bg-[#dcead8] text-[#1f6640] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Xem chi tiết"
                  >
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* THẺ 2: SỔ TAY & BÚT VIẾT HỌC TẬP (ĐH KINH TẾ TP.HCM)              */}
            {/* ----------------------------------------------------------------- */}
            <div 
              onClick={() => onSelectProduct?.('give_2')}
              className="bg-white rounded-2xl border border-[#e8efe3] shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-all cursor-pointer group shrink-0"
              style={{
                width: '245px',
                maxWidth: '245px'
              }}
            >
              {/* Ảnh Sổ tay lò xo bìa Kraft kèm bút bi chuẩn Ảnh 1 */}
              <div 
                className="relative bg-gray-100 overflow-hidden"
                style={{ height: '168px' }}
              >
                <img
                  src="/assets/give-notebook.jpg"
                  alt="Sổ tay & bút viết học tập"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/detail/book-detail-1.png';
                  }}
                />

                {/* Badge góc trên bên trái: 🎁 CHO TẶNG */}
                <div 
                  className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs text-[#20603d] border border-[#20603d]/20 px-2 py-0.5 rounded-full text-[9.5px] font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Gift className="w-3 h-3 text-[#20603d]" />
                  <span>CHO TẶNG</span>
                </div>
              </div>

              {/* Thông tin thẻ */}
              <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                <div>
                  <h3 className="text-[13px] font-bold text-gray-900 group-hover:text-[#114b35] transition-colors truncate">
                    Sổ tay & bút viết học tập
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
                    <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">ĐH Kinh tế TP.HCM</span>
                  </div>
                </div>

                {/* Nút màu đỏ dạng button Đăng ký để biết thông tin */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPaymentReg?.('Sổ tay & bút viết học tập');
                  }}
                  className="w-full py-1.5 px-2 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Đăng ký để biết thông tin</span>
                </button>

                {/* Chân thẻ: Huy hiệu Miễn phí + Nút tròn mũi tên */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#1f6640] bg-[#edf6ee] px-2.5 py-0.5 rounded-full">
                    🌱 Miễn phí
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGoToGiving?.();
                    }}
                    className="w-7 h-7 rounded-full bg-[#f0f6ed] hover:bg-[#dcead8] text-[#1f6640] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Xem chi tiết"
                  >
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default GivingSection;
