import React from 'react';
import {ArrowUpRight,ShoppingBag,Users,BookOpen,Sparkles,Code2,Home,PackageSearch,Gift} from 'lucide-react';
import {pagePaths,pageLabels,type SitePage} from '../lib/pages';

const icons={demo:PackageSearch,market:Home,wanted:ShoppingBag,community:Users,guide:BookOpen,premium:Sparkles,api:Code2,giveaway:Gift};

export function PageLink({page,onNavigate,children,className}:{page:SitePage;onNavigate:(p:SitePage)=>void;children:React.ReactNode;className?:string}){
  return (
    <a
      className={className}
      href={pagePaths[page]}
      onClick={e=>{
        if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
        e.preventDefault();
        onNavigate(page);
      }}
    >
      {children}
    </a>
  );
}

export function SiteNavigation({
  current,
  onNavigate,
  onCatalog,
}: {
  current: SitePage;
  onNavigate: (p: SitePage) => void;
  onCatalog: () => void;
  onGiveaway?: () => void;
}) {
  return (
    <nav className="original-main-nav" aria-label="Điều hướng chính">
      <PageLink
        page="market"
        onNavigate={onNavigate}
        className={`nav-item ${current === 'market' ? 'active' : ''}`}
      >
        <span>Khám phá</span>
      </PageLink>

      <button
        type="button"
        onClick={onCatalog}
        className="nav-item"
      >
        <span>Danh mục</span>
      </button>

      <PageLink
        page="giveaway"
        onNavigate={onNavigate}
        className={`nav-item ${current === 'giveaway' ? 'active' : ''}`}
      >
        <span>Góc cho tặng</span>
      </PageLink>

      <PageLink
        page="wanted"
        onNavigate={onNavigate}
        className={`nav-item ${current === 'wanted' ? 'active' : ''}`}
      >
        <span>Cần mua / cần tìm</span>
      </PageLink>

      <PageLink
        page="community"
        onNavigate={onNavigate}
        className={`nav-item ${current === 'community' ? 'active' : ''}`}
      >
        <span>Cộng đồng</span>
      </PageLink>
    </nav>
  );
}

export function HubPortals({onNavigate}:{onNavigate:(p:SitePage)=>void}){
  return (
    <section className="hub-portals">
      <div className="hub-section-title">
        <small>KHÔNG CHỈ LÀ MUA BÁN</small>
        <h2>Mỗi nhu cầu, một không gian riêng.</h2>
        <p>Tìm món cần dùng, gặp người cùng sở thích và trao đồ đúng cách.</p>
      </div>
      <div className="hub-portal-grid">
        {[
          {page:'wanted',number:'01',title:'Bạn tìm, cộng đồng gợi ý',text:'Đăng nhu cầu và ngân sách. Xem những món người bán gửi đến bạn.',cta:'Đến góc cần tìm'},
          {page:'community',number:'02',title:'Kết nối ngoài món đồ',text:'Cà phê sách, nhóm học tập và gia sư. Tìm nhóm phù hợp với trường của bạn.',cta:'Khám phá cộng đồng'},
          {page:'guide',number:'03',title:'Trao đồ, hiểu từng bước',text:'Hướng dẫn mua, bán, đổi và mượn đồ; quản lý hẹn gặp và bàn giao.',cta:'Xem hướng dẫn'}
        ].map(item=>{
          const Icon=icons[item.page as SitePage];
          return (
            <PageLink key={item.page} page={item.page as SitePage} onNavigate={onNavigate} className="hub-portal">
              <div>
                <span className="hub-icon"><Icon size={25}/></span>
                <small>{item.number}</small>
                <img className="hub-portal-illustration" src={'/assets/'+(item.page==='wanted'?'3d-fashion.png':item.page==='community'?'3d-books.png':'3d-study.png')} alt=""/>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <b>{item.cta}<ArrowUpRight size={18}/></b>
            </PageLink>
          );
        })}
      </div>
    </section>
  );
}

const copy={
  demo:{kicker:'TRẢI NGHIỆM UNISWAP',title:'Một kho đồ, muôn nhu cầu.',text:'Khám phá đồ demo được phân loại rõ ràng. Tìm thử món bạn cần cho học tập, phòng trọ và những sở thích mỗi ngày.'},
  wanted:{kicker:'GÓC NHU CẦU SINH VIÊN',title:'Bạn cần món gì?',text:'Một nhu cầu rõ ràng giúp người có đồ tìm thấy bạn. Theo dõi gợi ý và quản lý tin cần tìm ngay tại đây.'},
  community:{kicker:'KẾT NỐI CÙNG TRƯỜNG',title:'Gặp nhau từ điều cùng thích.',text:'Mở một nhóm học, hẹn cà phê sách hoặc chia sẻ kiến thức. Một nơi để những kết nối tiếp tục sau giao dịch.'},
  guide:{kicker:'BẮT ĐẦU CÙNG UNISWAP',title:'Trao đồ tự tin, từng bước một.',text:'Từ tìm kiếm đến bàn giao: hiểu đúng cách dùng các công cụ của UniSwap.'},
  premium:{kicker:'QUYỀN LỢI & TÀI KHOẢN',title:'Chọn tiện ích cho nhu cầu của bạn.',text:'So sánh Premium Mua, Bán và Toàn Diện; xem quyền lợi, thời hạn và tiếp tục thanh toán.'},
  api:{kicker:'GÓC DÀNH CHO NGƯỜI PHÁT TRIỂN',title:'Khám phá cách UniSwap hoạt động.',text:'Thử đọc dữ liệu và hiểu luồng kết nối giữa giao diện với máy chủ.'},
  giveaway:{kicker:'TẶNG ĐI MỘT ĐIỀU TỐT · UNISWAP GIVING',title:'Có những món đồ, giá trị hơn giá tiền.',text:'Chia sẻ những gì bạn không còn dùng để một bạn tân sinh viên có thêm khởi đầu thuận lợi.'}
};

export function HubHeading({page,onNavigate}:{page:Exclude<SitePage,'market'>;onNavigate:(p:SitePage)=>void}){
  const c=copy[page],art={demo:['3d-tech.png','3d-fashion.png','TÌM MÓN BẠN CẦN'],wanted:['3d-study.png','3d-dorm.png','BẠN TÌM · CỘNG ĐỒNG GỢI Ý'],community:['3d-books.png','3d-handmade.png','CÙNG HỌC · CÙNG CHIA SẺ'],guide:['3d-fashion.png','3d-books.png','TRAO ĐỒ TỪNG BƯỚC'],premium:['3d-tech.png','3d-study.png','THÊM TIỆN ÍCH · ĐÚNG NHU CẦU'],api:['3d-tech.png','3d-dorm.png','THỬ API · HIỂU DỮ LIỆU'],giveaway:['3d-books.png','3d-fashion.png','LAN TỎA SỰ TỬ TẾ · 0Đ']}[page];
  return (
    <div className={'hub-heading illustrated-hub-heading hub-heading-'+page}>
      <div className="hub-breadcrumb">
        <PageLink page="market" onNavigate={onNavigate}>Trang chủ</PageLink>
        <span>/</span>
        <span>{pageLabels[page]}</span>
      </div>
      <div className="illustrated-hub-copy">
        <small>{c.kicker}</small>
        <h1>{c.title}</h1>
        <p>{c.text}</p>
      </div>
      <div className="hub-art-scene" aria-hidden="true">
        <span className="hub-art-orbit"/>
        <span className="hub-art-spark">✦</span>
        <img className="hub-art-main" src={'/assets/'+art[0]} alt=""/>
        <img className="hub-art-second" src={'/assets/'+art[1]} alt=""/>
        <span className="hub-art-caption">{art[2]}</span>
      </div>
    </div>
  );
}
