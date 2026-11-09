import React from 'react';

interface HeroStatsProps {
  onQuickFilter: (type: 'giveaway' | 'dorm' | 'books' | 'swap') => void;
}

export const HeroStats: React.FC<HeroStatsProps> = ({ onQuickFilter: _onQuickFilter }) => {
  return (
    <section className="universe-hero">
      <div className="hero-rings"></div>
      <span className="spark s1">✦</span>
      <span className="spark s2">✧</span>
      <span className="spark s3">✦</span>
      <span className="orbit-label">PASS IT ON.</span>

      {/* Floating 3D Elements with CSS Drift Animation */}
      <div className="hero-floater float-books">
        <img src="/assets/3d-books.png" alt=""/>
      </div>
      <div className="hero-floater float-tech">
        <img src="/assets/3d-tech.png" alt=""/>
      </div>
      <div className="hero-floater float-lamp">
        <img src="/assets/3d-dorm.png" alt=""/>
      </div>
      <div className="hero-floater float-bag">
        <img src="/assets/3d-fashion.png" alt=""/>
      </div>

      {/* Main Copy */}
      <div className="universe-copy text-center flex flex-col items-center justify-center pt-3 sm:pt-4 pb-2">
        <h1 className="!text-[44px] sm:!text-[54px] md:!text-[64px] lg:!text-[70px] xl:!text-[74px] !font-black !leading-[1.1] !tracking-[-2px] !text-center mx-auto max-w-4xl drop-shadow-md !m-0">
          Đồ hay chuyền tay.<br />
          <em className="text-[#ffb525] not-italic">Giá trị ở lại.</em>
          <svg viewBox="0 0 290 16" fill="none" className="w-[260px] sm:w-[320px] md:w-[380px] h-3.5 mx-auto mt-2">
            <path d="M3 12C83 0 204 0 287 7" stroke="#ffb525" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </h1>

        <p className="!text-center !mx-auto !mt-4 max-w-2xl text-[#d4eadc] text-sm sm:text-base md:text-[17px] lg:text-[18px] leading-relaxed font-medium">
          Trao món bạn dư. Tìm điều bạn cần • Kết nối sinh viên các trường TP.HCM
        </p>
      </div>
    </section>
  );
};
