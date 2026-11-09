import React from 'react';

interface FooterProps {
  onOpenCreateModal: () => void;
  onOpenHunterModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCreateModal, onOpenHunterModal }) => {
  return (
    <footer>
      <div className="wrap footer-main">
        {/* Brand Column */}
        <div className="footer-about">
          <a href="/" className="brand flex items-center gap-2">
            <img 
              src="/assets/uniswap-logo.png" 
              alt="Logo UniSwap" 
              className="w-12 h-12 bg-white rounded-full p-1 object-contain shadow-xs"
            />
            <div>
              <strong className="text-[#096441] text-2xl font-black tracking-tight">
                Uni<span className="text-[#f4a614]">Swap</span>
              </strong>
              <small className="block text-[8px] tracking-[1.1px] text-[#7d8e81] uppercase font-semibold">
                TRAO ĐỔI ĐỒ SINH VIÊN
              </small>
            </div>
          </a>
          <p className="text-[11px] text-[#8fa087] leading-relaxed mt-4">
            Trao đồ hay. Kết nối mới.<br />
            Để những giá trị tốt được tiếp tục trong cộng đồng sinh viên TP.HCM.
          </p>
        </div>

        {/* Explore Links */}
        <div className="footer-links">
          <b>Khám phá</b>
          <a href="/#categories">Tất cả món đồ</a>
          <a href="/#categories">Danh mục sản phẩm</a>
          <a href="/?trade=giveaway#categories">Góc cho tặng 0đ</a>
        </div>

        {/* Community Links */}
        <div className="footer-links">
          <b>Cộng đồng</b>
          <a href="/can-mua">Cần mua / cần tìm</a>
          <a href="/cong-dong">Cộng đồng sinh viên</a>
          <a href="/huong-dan">Cách thức hoạt động</a>
          <button onClick={onOpenHunterModal} className="text-left text-[#a7b296] hover:text-[#096441]">
            Gói Thợ Săn Đồ Pro
          </button>
          <button onClick={onOpenCreateModal} className="text-left text-[#a7b296] hover:text-[#096441]">
            Đăng tin trao đổi
          </button>
        </div>

        {/* Manifesto */}
        <div className="footer-manifesto">
          <span>KEEP GOOD THINGS</span>
          <b>Going<span>↗</span></b>
          <i></i>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="wrap footer-bottom border-t border-[#e9eee1] py-5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#aebb9c] gap-2">
        <span>© 2026 UniSwap · Nền tảng Kinh tế Tuần hoàn Học đường TP.HCM</span>
        <span>Dự án tham gia Cuộc thi Sinh viên Kinh doanh số 2026 (DBC 2026 - VECOM)</span>
      </div>
    </footer>
  );
};
