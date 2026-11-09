import React, { type ReactNode } from 'react';

export function AuthPage({
  children,
  onBack,
}: {
  children: ReactNode;
  onBack: () => void;
}) {
  const handleHomeNavigation = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onBack) {
      onBack();
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('login')) {
        url.searchParams.delete('login');
        window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#fbfdfa] overflow-y-auto flex flex-col justify-between"
      style={{ fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif" }}
    >
      {/* ======================================================================= */}
      {/* TOP HEADER: LOGO UNISWAP & NÚT VỀ TRANG CHỦ                              */}
      {/* ======================================================================= */}
      <header className="w-full border-b border-gray-100 bg-[#fbfdfa]">
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 py-3.5 flex items-center justify-between shrink-0">
          <a 
            href="/" 
            onClick={handleHomeNavigation}
            className="flex items-center gap-2.5 no-underline group"
          >
            <img 
              src="/assets/uniswap-logo.png" 
              alt="Logo UniSwap" 
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/logo.png';
              }}
            />
            <div className="flex flex-col">
              <span className="text-[22px] font-black leading-tight tracking-tight text-[#06462e]">
                Uni<span className="text-[#ffb525]">Swap</span>
              </span>
              <span className="text-[8.5px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mt-0.5">
                TRAO ĐỔI ĐỒ SINH VIÊN
              </span>
            </div>
          </a>

          <button 
            type="button" 
            onClick={handleHomeNavigation}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#06462e] transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-gray-100"
          >
            <span>← Về trang chủ</span>
          </button>
        </div>
      </header>

      {/* ======================================================================= */}
      {/* MAIN 2-COLUMN VIEW: TRÁI LÀ BANNER ĐỒ HỌA, PHẢI LÀ FORM ĐĂNG NHẬP        */}
      {/* ======================================================================= */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-4 my-auto">
        <div className="w-full max-w-[960px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center mx-auto" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
          
          {/* CỘT TRÁI: BANNER ĐỒ HỌA HỮU CƠ 3D "ĐỒ HAY CHUYỂN TAY. GIÁ TRỊ Ở LẠI." */}
          <div className="flex items-center justify-center md:justify-end w-full min-w-0">
            <img
              src="/assets/uniswap-left-panel-perfect.png"
              alt="Đồ hay chuyển tay. Giá trị ở lại."
              className="w-full max-w-[460px] md:max-w-[480px] aspect-square object-contain drop-shadow-md select-none"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/crop_login_card.png';
              }}
            />
          </div>

          {/* CỘT PHẢI: FORM ĐĂNG NHẬP CHUẨN XÁC THEO MẪU */}
          <div className="flex items-center justify-center md:justify-start w-full min-w-0">
            <div className="w-full max-w-[420px]">
              {children}
            </div>
          </div>

        </div>
      </main>

      {/* Footer copyright nhẹ */}
      <footer className="w-full text-center py-2.5 text-[10.5px] text-gray-400">
        UniSwap DBC 2026 · Nền tảng trao đổi đồ dùng sinh viên TP.HCM
      </footer>
    </div>
  );
}

export default AuthPage;
