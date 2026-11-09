import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  Bell,
  Home,
  Search,
  Plus,
  MessageCircle,
  UserRound,
  SlidersHorizontal,
  MapPin,
  Bookmark,
  History,
  Handshake,
  Receipt,
  BellRing,
  PackagePlus,
  ArrowRight,
  ShieldCheck,
  Heart,
  Sparkles,
  Star,
  Gift,
} from "lucide-react";
import type { ProductItem, User } from "./types";
import { api } from "./lib/api";
import {
  categories,
  clusters,
  trades,
  defaultFilters,
  filterProducts,
  distance,
  type Filters,
} from "./lib/market";
import { HeroStats } from "./components/HeroStats";
import { Footer } from "./components/Footer";
import { Dialog } from "./components/Dialog";
import { ListingForm } from "./components/ListingForm";
import { AccountForm } from "./components/AccountForm";
import { Conversation } from "./components/Conversation";
import { ExchangePanel } from "./components/ExchangePanel";
import { Community } from "./components/Community";
import { AccountCenter } from "./components/AccountCenter";
import { BuyerBoard } from "./components/BuyerBoard";
import { OfferPanel } from "./components/OfferPanel";
import { BillingPanel } from "./components/BillingPanel";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { SellerProfile } from "./components/SellerProfile";
import { AdminPanel } from "./components/AdminPanel";
import { SellerStats } from "./components/SellerStats";
import { ReserveForm } from "./components/ReserveForm";
import {PremiumShop} from "./components/PremiumShop";
import {PriceWatch,PriceAlertsPanel} from "./components/PriceWatch";
import {ApiGuide} from "./components/ApiGuide";
import {CATEGORY_TREE,CONDITIONS,validSubcategory,type CategoryId} from "../shared/catalog";
import {SiteNavigation,HubPortals,HubHeading} from "./components/SiteNavigation";
import {TradingGuide} from "./components/TradingGuide";
import {readSitePage,pagePaths,pageLabels,type SitePage} from "./lib/pages";
import {UNIVERSITIES} from "./data/mockData";
import {OriginalCategoryDeck,OriginalPromos,OriginalCatalogBanner} from "./components/OriginalMarket";
import { AuthPage } from "./components/AuthPage";
import { ProductDetailView } from "./components/ProductDetailView";
import { ChatWorkspace } from "./components/ChatWorkspace";
import { GivingSection } from "./components/GivingSection";
import { GiveawayPage } from "./components/GiveawayPage";
import { CommunityFlowSections } from "./components/CommunityFlowSections";
import { PaymentRegistrationModal } from "./components/PaymentRegistrationModal";
import { IpLocationWantedBar } from "./components/IpLocationWantedBar";
import { UserProfileView } from "./components/UserProfileView";
import "./hubs.css";
import "./premium.css";
import "./swap.css";
import "./refinements.css";
import {DemoCatalog,SearchDiscovery} from "./components/DemoCatalog";
import "./restored.css";
import "./demo-pages.css";
import {MarketFilterPanel} from "./components/MarketFilterPanel";
import "./refine-ui.css";
import { ChoTotCategoryNav } from "./components/ChoTotCategoryNav";
import { DetailedFilterModal } from "./components/DetailedFilterModal";
import { FeaturedCarousel } from "./components/FeaturedCarousel";
import "./chotot-categories.css";

type View = "all" | "saved" | "mine" | "history";
type Panel =
  | "login"
  | "register"
  | "create"
  | "edit"
  | "detail"
  | "chat"
  | "pro"
  | "push"
  | "orders"
  | "inbox"
  | "searches"
  | "report"
  | "exchanges"
  | "account"
  | "offers"
  | "notifications"
  | "profile"
  | "admin"
  | "price-alerts"
  | "api-guide"
  | "reserve"
  | null;
type Thread = {
  product_id: string;
  buyer: string;
  buyer_name: string;
  updated: string;
  unread?: number;
  lastText?: string;
  product?: ProductItem;
};
const price = (p: ProductItem) =>
  p.tradeType === "giveaway"
    ? "Miễn phí"
    : p.tradeType === "swap"
      ? "Trao đổi"
      : p.price.toLocaleString("vi-VN") +
        "đ" +
        (p.tradeType === "borrow" ? " / ngày" : "");
function formatDetailDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

function readFilters(): Filters {
  const params = new URLSearchParams(location.search),
    next = { ...defaultFilters };
  for (const key of Object.keys(next) as (keyof Filters)[])
    if (params.has(key)) (next as any)[key] = params.get(key)!;
  if (!categories[next.category]) next.category = "all";
  if(next.category==="all"||!validSubcategory(next.category,next.subcategory))next.subcategory="all";
  if (!clusters[next.cluster]) next.cluster = "all";
  if (!trades[next.trade]) next.trade = "all";
  next.radius = "all";
  if(next.sort==="campus")next.sort="latest";
  if (!["latest", "price_asc", "price_desc", "nearest"].includes(next.sort))
    next.sort = "latest";
  for (const key of ["min", "max"] as const)
    if (
      next[key] &&
      (!Number.isFinite(Number(next[key])) || Number(next[key]) < 0)
    )
      next[key] = "";
  return next;
}
export function App() {
  const [sitePage,setSitePage]=useState<SitePage>(()=>readSitePage(location.pathname,location.search));
  const [pageTarget,setPageTarget]=useState(()=>new URLSearchParams(location.search).get('request')||new URLSearchParams(location.search).get('topic')||'');
  const [products, setProducts] = useState<ProductItem[]>([]),
    [user, setUser] = useState<User | null>(null),
    [ready, setReady] = useState(false),
    [loading, setLoading] = useState(true),
    [loadError, setLoadError] = useState("");
  const [filters, setFilters] = useState<Filters>(readFilters),
    [view, setView] = useState<View>("all"),
    [liked, setLiked] = useState<Set<string>>(new Set()),
    [pageState, setPageState] = useState({ signature: "", page: 1 });
  const signature = JSON.stringify(filters) + view;
  const page = pageState.signature === signature ? pageState.page : 1;
  const setPage = (page: number) => setPageState({ signature, page });
  const [panel, setPanelState] = useState<Panel>(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    if (params.has("action")) return "account";
    if (params.has("payment")) return "orders";
    if (params.has("login") || window.location.pathname === "/login") return "login";
    return null;
  }),
    [selected, setSelected] = useState<ProductItem | null>(null),
    [buyer, setBuyer] = useState<string | undefined>();
  const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null),
    [accountInitialTab, setAccountInitialTab] = useState<string>("profile"),
    [showPaymentRegModal, setShowPaymentRegModal] = useState(false),
    [regTargetProduct, setRegTargetProduct] = useState<ProductItem | null>(null),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const [, setOrders] = useState<any[]>([]),
    [threads, setThreads] = useState<Thread[]>([]),
    [searches, setSearches] = useState<any[]>([]),
    [plan, setPlan] = useState("both"),
    [reason, setReason] = useState(""),
    [, setPhone] = useState("");
  const [historyIds, setHistoryIds] = useState<string[]>(() => {
    try {
      const value = JSON.parse(localStorage.getItem("swap_history") || "[]");
      return Array.isArray(value)
        ? value.filter((x) => typeof x === "string")
        : [];
    } catch {
      return [];
    }
  });
  const [initialProductId] = useState(() =>
    new URLSearchParams(location.search).get("product"),
  );
  const [locationOpen, setLocationOpen] = useState(false);
  const [filterOpen,setFilterOpen]=useState(false);
  const [detailedFilterOpen, setDetailedFilterOpen] = useState(false);
  const [detailedFilterCat, setDetailedFilterCat] = useState('books');
  const [delivery, setDelivery] = useState<any>();
  const [securityLink] = useState(() => ({
    action: new URLSearchParams(location.search).get("action") || "",
    token: new URLSearchParams(location.search).get("token") || "",
  }));
  const [myStatus, setMyStatus] = useState("all"),
    [quota, setQuota] = useState<any>(null),
    [unread, setUnread] = useState(0),
    [offerId, setOfferId] = useState(""),
    [profileId, setProfileId] = useState("");
  const navigatePage=useCallback((next:SitePage,target='')=>{
    const query=new URLSearchParams();if(target)query.set(next==='wanted'?'request':'topic',target);
    window.history.pushState(null,'',pagePaths[next]+(query.size?'?'+query.toString():''));
    setSitePage(next);setPageTarget(target);setPanelState(null);setLocationOpen(false);window.scrollTo({top:0,behavior:'instant'});
  },[]);
  const setPanel=useCallback((next:Panel)=>{if(next==='pro')navigatePage('premium');else if(next==='api-guide')navigatePage('api');else setPanelState(next)},[navigatePage]);
  useEffect(()=>{document.title=pageLabels[sitePage]+' · UniSwap';},[sitePage]);
  const refreshUser = useCallback(() => {
    void api("/me")
      .then((d) => setUser(d.user))
      .catch((e) => setNotice(e.message));
  }, []);
  useEffect(() => {
    if (!user) return;
    let active = true;
    api("/account")
      .then((d) => {
        if (active) setQuota(d.quota);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user, products]);
  useEffect(() => {
    if (!user) return;
    let active = true;
    const load = () =>
      api("/notifications")
        .then((d) => {
          if (active) setUnread(d.unread);
        })
        .catch(() => {});
    void load();
    const timer = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [user]);
  const close = useCallback(() => {
    setPanel(null);
    setBusy(false);
  }, [setPanel]);
  const refresh = useCallback(async () => {
    try {
      setLoadError("");
      const data = await api("/products");
      setProducts(data.products);
    } catch (e) {
      setLoadError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    api("/products")
      .then((data) => {
        if (active) {
          setProducts(data.products);
          setLoadError("");
          const deep = initialProductId;
          if (deep) {
            void api("/products/" + encodeURIComponent(deep))
              .then((d) => {
                if (active) {
                  setSelected(d.product);
                  setPanel("detail");
                }
              })
              .catch((e) => {
                if (active) setNotice(e.message);
              });
          }
        }
      })
      .catch((e) => {
        if (active) setLoadError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    api("/me")
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch((e) => {
        if (active) setLoadError((e as Error).message);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, [initialProductId,setPanel]);
  useEffect(() => {
    if (!user) return;
    let active = true;
    api("/favorites")
      .then((d) => {
        if (active) setLiked(new Set(d.ids));
      })
      .catch((e) => setNotice((e as Error).message));
    return () => {
      active = false;
    };
  }, [user]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    const params = new URLSearchParams();
    if(sitePage==="market")Object.entries(filters).forEach(([k, v]) => {
      if (v !== defaultFilters[k as keyof Filters]) params.set(k, v);
    });
    const activePid = (panel === "detail" && selected?.id) || (!selected && loading && initialProductId ? initialProductId : ""); if (activePid) params.set("product", activePid);
    if(panel==="login"||panel==="register")params.set("login","true");
    if(pageTarget&&["wanted","community"].includes(sitePage))params.set(sitePage==="wanted"?"request":"topic",pageTarget);
    window.history.replaceState(
      null,
      "",
      pagePaths[sitePage] +
        (params.size ? "?" + params.toString() : "") +
        location.hash,
    );
  }, [filters, view, panel, selected,sitePage,pageTarget]);
  useEffect(() => {
    const pop = () => {
      setSitePage(readSitePage(location.pathname,location.search));
      setPageTarget(new URLSearchParams(location.search).get("request")||new URLSearchParams(location.search).get("topic")||"");
      setFilters(readFilters());
      const id = new URLSearchParams(location.search).get("product");
      if (id)
        void api("/products/" + id)
          .then((d) => {
            setSelected(d.product);
            setPanel("detail");
          })
          .catch((e) => setNotice(e.message));
      else { setSelected(null); setPanel(null); }
    };
    addEventListener("popstate", pop);
    return () => removeEventListener("popstate", pop);
  }, [setPanel]);
  const setFilter = (key: keyof Filters, value: any) =>
    setFilters((f) => ({ ...f, ...(key==="category"?{subcategory:"all"}:{}), [key]: value }));
  const requireUser = (action: () => void) => {
    if (!ready) {
      setNotice("Đang kiểm tra phiên đăng nhập…");
      return;
    }
    if (!user) {
      setPanel("login");
      setNotice("Đăng nhập hoặc tạo tài khoản để tiếp tục.");
      return;
    }
    action();
  };
  const scroll = () => {if(sitePage!=="market")navigatePage("market");requestAnimationFrame(()=>document.getElementById("categories")?.scrollIntoView({behavior:"smooth"}));};
  const openListing = (p: ProductItem) => {
    setSelected(p);
    setPanel("detail");
    const detailUrl = new URL(location.href);
    detailUrl.searchParams.set("product", p.id);
    window.history.pushState(null, "", detailUrl.pathname + detailUrl.search);
    void api("/products/" + encodeURIComponent(p.id))
      .then((d) => setSelected(d.product))
      .catch((e) => setNotice(e.message));
    setHistoryIds((prev) => {
      const next = [p.id, ...prev.filter((id) => id !== p.id)].slice(0, 50);
      try {
        localStorage.setItem("swap_history", JSON.stringify(next));
      } catch {
        /* history is optional */
      }
      return next;
    });
  };
  async function toggleLike(id: string) {
    requireUser(() => {
      void (async () => {
        try {
          const saved = liked.has(id);
          await api("/products/" + id + "/favorite", saved ? "DELETE" : "POST");
          setLiked((prev) => {
            const next = new Set(prev);
            if (saved) next.delete(id);
            else next.add(id);
            return next;
          });
        } catch (e) {
          setNotice((e as Error).message);
        }
      })();
    });
  }
  async function loadPanel(next: Panel) {
    requireUser(() => {
      setBusy(true);
      setPanel(next);
      setNotice("");
      void (async () => {
        try {
          if (next === "orders") setOrders((await api("/orders")).orders);
          if (next === "inbox") setThreads((await api("/inbox")).threads);
          if (next === "searches")
            setSearches((await api("/searches")).searches);
        } catch (e) {
          setNotice((e as Error).message);
        } finally {
          setBusy(false);
        }
      })();
    });
  }
  const schoolOptions = useMemo(
    () =>
      Array.from(new Set([...UNIVERSITIES.map(u=>u.code),...products.map((p) => p.seller.universityCode)])).sort((a,b)=>a.localeCompare(b,"vi")),
    [products],
  );
  const filtered = useMemo(() => {
    let source = products;
    if (view === "mine")
      source = source.filter(
        (p) =>
          p.seller.id === user?.id &&
          (myStatus === "all" || p.status === myStatus),
      );
    if (view === "saved") source = source.filter((p) => liked.has(p.id));
    if (view === "history")
      source = source.filter((p) => historyIds.includes(p.id));
    if (view === "mine")
      return source
        .filter(
          (p) =>
            !filters.q ||
            p.title.toLowerCase().includes(filters.q.toLowerCase()),
        )
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    return filterProducts(source, filters, origin);
  }, [products, filters, view, user, liked, historyIds, origin, myStatus]);
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("swap-is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.06 },
    );
    document
      .querySelectorAll(
        ".swap-card,.swap-promos>div,.swap-community-grid>article",
      )
      .forEach((el) => {
        if (!el.classList.contains("swap-is-visible")) {
          el.classList.add("swap-reveal-ready");
          observer.observe(el);
        }
      });
    return () => observer.disconnect();
  }, [filtered, view]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / 12)),
    activePage = Math.min(page, totalPages),
    visible = filtered.slice((activePage - 1) * 12, activePage * 12);
  async function updateStatus(p: ProductItem, status: string) {
    setBusy(true);
    try {
      await api("/products/" + p.id, "PATCH", { status });
      await refresh();
      setSelected({ ...p, status: status as ProductItem["status"] });
      setNotice("Đã cập nhật trạng thái bài đăng.");
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(p: ProductItem) {
    if (
      !window.confirm(
        "Xóa bài đăng “" +
          p.title +
          "”? Bài sẽ ẩn khỏi danh sách; lịch sử giao dịch vẫn được giữ.",
      )
    )
      return;
    setBusy(true);
    try {
      await api("/products/" + p.id, "DELETE");
      close();
      await refresh();
      setNotice("Đã xóa bài đăng.");
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function order(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api("/orders", "POST", {
        plan,
        productId: panel === "push" ? selected?.id : undefined,
      });
      setNotice(data.message);
      setOrders([data.order]);
      setPanel("orders");
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function saveSearch() {
    requireUser(() => {
      void (async () => {
        try {
          await api("/searches", "POST", {
            name:
              filters.q ||
              categories[filters.category] + " · " + clusters[filters.cluster],
            filters: {
              ...filters,
              radius: "all",
              sort: filters.sort === "nearest" ? "latest" : filters.sort,
            },
          });
          setNotice("Đã lưu bộ lọc tìm kiếm (không lưu vị trí cá nhân).");
        } catch (e) {
          setNotice((e as Error).message);
        }
      })();
    });
  }
  return (
    <div className="swap-app">
      <div className="swap-banner">
        Dự án DBC 2026 · Trao đổi đồ sinh viên các trường đại học tại TP.HCM
      </div>
      <header className="swap-header">
        <div
          className="swap-shell swap-header-inner"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "72px",
            width: "100%",
            maxWidth: "1560px",
            gap: "12px",
            paddingInline: "16px",
            boxSizing: "border-box",
          }}
        >
          <a
            href="/"
            className="swap-brand"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
              marginRight: "0px",
              textDecoration: "none",
            }}
            onClick={(e) => {
              e.preventDefault();navigatePage("market");setFilters({ ...defaultFilters });
              setView("all");
            }}
          >
            <img src="/assets/uniswap-logo.png" alt="" />
            <span>
              Uni<b>Swap</b>
              <small>TRAO ĐỔI ĐỒ SINH VIÊN</small>
            </span>
          </a>
          <SiteNavigation current={sitePage} onNavigate={navigatePage} onCatalog={()=>{setView('all');scroll()}} onGiveaway={()=>{setView('all');setFilter('trade','giveaway');scroll()}}/>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
              gap: "8px",
              flexShrink: 0,
              marginLeft: "auto",
            }}
            className="swap-header-actions"
          >
            {/* 1. Nút THỢ SĂN ĐỒ PRO */}
            <button
              type="button"
              onClick={() => setPanel("pro")}
              style={{
                backgroundColor: "#043322",
                color: "#fcd34d",
                border: "1px solid rgba(252, 211, 77, 0.35)",
                borderRadius: "9999px",
                height: "38px",
                padding: "0 14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "#f5b82c";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(245, 184, 44, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(252, 211, 77, 0.35)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.18)";
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Thợ Săn Đồ</span>
              <span
                style={{
                  backgroundColor: "#f5b82c",
                  color: "#06462e",
                  fontSize: "9.5px",
                  fontWeight: 900,
                  padding: "1px 6px",
                  borderRadius: "6px",
                }}
              >
                PRO
              </span>
            </button>

            {/* 2. Nút TRÁI TIM YÊU THÍCH (Kính mờ sang xịn, đồng bộ số lượng tức thì) */}
            <button
              type="button"
              aria-label="Sản phẩm đã lưu yêu thích"
              onClick={() => {
                setAccountInitialTab("saved");
                setPanel("account");
              }}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.22)";
                e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              title={`Sản phẩm yêu thích (${liked.size})`}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  liked.size > 0 ? "text-rose-400 fill-rose-400" : "text-white"
                }`}
              />
              <span
                style={{
                  position: "absolute",
                  top: "-3px",
                  right: "-3px",
                  minWidth: "18px",
                  height: "18px",
                  borderRadius: "9999px",
                  backgroundColor: "#f59e0b",
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                  color: "#06462e",
                  fontSize: "10px",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  border: "1.5px solid #06462e",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                }}
              >
                {liked.size}
              </span>
            </button>

            {/* 3. Nút CHUÔNG THÔNG BÁO */}
            <button
              type="button"
              aria-label="Thông báo"
              onClick={() => setPanel("notifications")}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.22)";
                e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              title="Thông báo mới"
            >
              <Bell className="w-4 h-4 text-white" />
              {unread > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-3px",
                    right: "-3px",
                    minWidth: "18px",
                    height: "18px",
                    borderRadius: "9999px",
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    border: "1.5px solid #06462e",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                  }}
                >
                  {unread}
                </span>
              )}
            </button>

            {/* 4. Nút LIÊN HỆ */}
            <button
              type="button"
              onClick={() => setPanel("inbox")}
              style={{
                height: "38px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "0 15px",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.22)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Liên hệ</span>
            </button>

            {/* 5. Nút TÀI KHOẢN (Menu dropdown kính mờ cao cấp) */}
            {!user ? (
              <button
                type="button"
                onClick={() => setPanel("login")}
                style={{
                  height: "38px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  border: "1px solid rgba(255, 255, 255, 0.18)",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "0 15px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.22)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <UserRound className="w-4 h-4 text-emerald-300" />
                <span>Đăng nhập</span>
              </button>
            ) : (
              <details className="original-user-menu relative">
                <summary
                  style={{
                    height: "38px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(255, 255, 255, 0.14)",
                    border: "1px solid rgba(255, 255, 255, 0.22)",
                    color: "#ffffff",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0 13px 0 6px",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    listStyle: "none",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.24)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.14)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      color: "#06462e",
                      fontWeight: 900,
                      fontSize: "11px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1.5px solid #ffffff",
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[105px] truncate">{user.name.split(" ").slice(-1)[0]}</span>
                  <span className="text-[10px] text-emerald-200">⌄</span>
                </summary>
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    width: "235px",
                    backgroundColor: "#06462e",
                    background: "linear-gradient(180deg, #06462e 0%, #04301f 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: "0 14px 40px rgba(0, 0, 0, 0.35)",
                    borderRadius: "20px",
                    padding: "12px",
                    zIndex: 100,
                    color: "#ffffff",
                  }}
                >
                  <div className="pb-2.5 mb-2 border-b border-white/10 px-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-white truncate">{user.name}</p>
                      {user.role === "admin" && (
                        <span className="text-[9px] bg-amber-400 text-[#06462e] font-black px-1.5 py-0.2 rounded-full uppercase">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-emerald-300">Sinh viên · {user.universityCode || "DHV"}</p>
                  </div>
                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        window.location.href = "/admin/dashboard.html";
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black text-amber-300 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 transition-colors text-left cursor-pointer mb-1.5 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={15} className="text-amber-400" />
                        <span>Bảng Quản trị Admin</span>
                      </div>
                      <span className="text-[9px] bg-amber-400 text-[#06462e] font-black px-1.5 py-0.5 rounded-full uppercase">
                        PRO
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setAccountInitialTab("profile");
                      setPanel("account");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-100 hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <UserRound size={15} className="text-emerald-300" />
                    <span>Tài khoản của tôi</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelected(null);
                      setPanel("create");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-100 hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <Plus size={15} className="text-emerald-300" />
                    <span>Đăng tin sản phẩm</span>
                  </button>
                  <button
                    onClick={() => {
                      setAccountInitialTab("saved");
                      setPanel("account");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-emerald-100 hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart size={15} className="text-emerald-300" />
                      <span>Sản phẩm yêu thích</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                      {liked.size}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setAccountInitialTab("reviews");
                      setPanel("account");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-100 hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <Star size={15} className="text-amber-300" />
                    <span>Đánh giá uy tín</span>
                  </button>
                  <button
                    onClick={() => {
                      setAccountInitialTab("rewards");
                      setPanel("account");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-100 hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <Gift size={15} className="text-emerald-300" />
                    <span>Điểm thưởng UniPoints</span>
                  </button>
                  <div className="pt-2 mt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        void api("/logout", "POST").then(() => {
                          setUser(null);
                          setLiked(new Set());
                          setOrders([]);
                          setThreads([]);
                          setSearches([]);
                          setView("all");
                          close();
                          setNotice("Đã đăng xuất.");
                        });
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-300 hover:bg-red-500/20 transition-colors text-left cursor-pointer"
                    >
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </details>
            )}

            {/* 6. HERO CTA NỔI BẬT: [ + ĐĂNG TIN ] VÀNG KIM HOÀNG GIA */}
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setPanel("create");
              }}
              style={{
                height: "38px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #ffc438 0%, #f59e0b 100%)",
                color: "#06462e",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                padding: "0 18px",
                fontWeight: 900,
                fontSize: "12.5px",
                letterSpacing: "0.2px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 14px rgba(245, 158, 11, 0.4)",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(245, 158, 11, 0.55)";
                e.currentTarget.style.filter = "brightness(1.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(245, 158, 11, 0.4)";
                e.currentTarget.style.filter = "none";
              }}
            >
              <Plus className="w-4 h-4 text-[#06462e] stroke-[2.5]" />
              <span>Đăng tin</span>
            </button>
          </div>
        </div>
      </header>
      {sitePage==="market"&&<HeroStats
        onQuickFilter={(type) => {
          setView("all");
          setFilters({
            ...defaultFilters,
            ...(type === "books" || type === "dorm"
              ? { category: type }
              : { trade: type }),
          });
          scroll();
        }}
      />}
      <main className={"swap-shell "+(sitePage!=="market"?"hub-main":"")}>
        {sitePage==="market"&&<>

        <form
          className="swap-search"
          onSubmit={(e) => {
            e.preventDefault();
            scroll();
          }}
        >
          <label className="sr-only" htmlFor="search">
            Tìm món đồ
          </label>
          <Search className="market-search-icon" size={22} aria-hidden="true"/><input
            id="search"
            placeholder="Hôm nay bạn đang tìm món đồ gì?"
            value={filters.q}
            onChange={(e) => setFilter("q", e.target.value)}
          />
          <button
            type="button"
            aria-expanded={locationOpen}
            onClick={() => setLocationOpen(!locationOpen)}
          >
            <MapPin size={17}/> {clusters[filters.cluster]}
          </button>
          <button className="swap-accent"><Search size={17}/> Tìm kiếm</button>
        </form>
        {locationOpen && (
          <section className="swap-location" aria-label="Khu vực tìm kiếm">
            <div className="swap-location-heading">
              <h2>Tìm quanh trường bạn</h2>
              <button
                aria-label="Đóng bộ chọn vị trí"
                onClick={() => setLocationOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="swap-form-row">
              <label>
                Khu vực
                <select
                  value={filters.cluster}
                  onChange={(e) => setFilter("cluster", e.target.value)}
                >
                  {Object.entries(clusters).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Trường
                <select
                  value={filters.school}
                  onChange={(e) => setFilter("school", e.target.value)}
                >
                  <option value="all">Tất cả trường</option>
                  {schoolOptions.map((s) => (
                    <option key={s} value={s}>{UNIVERSITIES.find(u=>u.code===s)?.name||s}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="swap-actions">
              <button
                className="swap-primary"
                onClick={() => setLocationOpen(false)}
              >
                Xem kết quả
              </button>
            </div>


          </section>
        )}
        {user && !user.isVerified && (
          <div className="swap-verification-banner">
            <span>Xác minh email trường để đăng tin và giao dịch an tâm.</span>
            <button onClick={() => setPanel("account")}>Xác minh ngay →</button>
          </div>
        )}
        <OriginalCategoryDeck onCategory={id=>{setFilter('category',id);setView('all');scroll()}}/>
        <OriginalPromos onCategory={id=>{setFilter('category',id);setView('all');scroll()}} onGiveaway={()=>{setView('all');setFilters({...defaultFilters,trade:'giveaway',sort:'latest'});scroll()}} onCreate={()=>requireUser(()=>{setSelected(null);setPanel('create')})}/>
        <OriginalCatalogBanner category={filters.category}/>
        {/* Dải tin xoay chạy tự động: Sản phẩm nổi bật đẩy lên Trang 1 (Tính năng trả phí PRO) */}
        <FeaturedCarousel
          products={products}
          onSelectProduct={openListing}
          onOpenPro={() => setPanel("pro")}
          currentUser={user}
          onRequireLogin={() => setPanel("login")}
        />
        {/* Thanh định vị IP & Tự động hiển thị danh mục cần mua cho người dùng */}
        <IpLocationWantedBar
          onLocationDetected={(coords, detectedCluster) => {
            setOrigin(coords);
            if (filters.cluster === "all") {
              setFilters((prev) => ({ ...prev, cluster: detectedCluster }));
            }
          }}
          onSelectCategory={(catId) => {
            setFilter('category', catId);
            setView('all');
            scroll();
          }}
          onOpenWanted={() => navigatePage('wanted')}
          onGoToGiving={() => {
            setView('all');
            setFilters({ ...defaultFilters, trade: 'giveaway', sort: 'latest' });
            scroll();
          }}
          currentCluster={filters.cluster}
          onSelectCluster={(c) => {
            setFilter('cluster', c);
            setView('all');
            scroll();
          }}
        />
        <section id="categories" className="swap-market">
          <aside className="swap-categories-wrapper">
            <ChoTotCategoryNav
              activeCategory={filters.category}
              activeSubcategory={filters.subcategory}
              onSelectCategory={(cat, sub) => {
                setView("all");
                setFilters((f) => ({
                  ...f,
                  category: cat,
                  subcategory: sub || "all",
                }));
                scroll();
              }}
            />
          </aside>
          <div className="swap-results">
            <div className="swap-result-heading">
              <div>
                <h2>
                  {view === "mine"
                    ? "Tin của tôi"
                    : view === "saved"
                      ? "Món đồ đã lưu"
                      : view === "history"
                        ? "Lịch sử đã xem"
                        : categories[filters.category]}
                </h2>
                <p>
                  {loading
                    ? "Đang tải…"
                    : `${filtered.length} món đồ · ${user ? "Xin chào " + user.name : "Khám phá đồ sinh viên quanh bạn"}`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setDetailedFilterCat(filters.category !== 'all' ? filters.category : 'books');
                    setDetailedFilterOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#00513d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <SlidersHorizontal size={15} />
                  <span>Bộ lọc chi tiết {filters.category !== 'all' ? `(${categories[filters.category]})` : ''}</span>
                </button>
                <button
                  onClick={() => {
                    setView("all");
                    setFilters({ ...defaultFilters });
                  }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
            {view === "mine" && (
              <>
                <SellerStats
                  key={products.length + ":" + user?.tier}
                  onUpgrade={() => {
                    setPlan("seller");sessionStorage.setItem("swap_chosen_plan","seller");
                    setPanel("pro");
                  }}
                />
                <div className="swap-quota">
                  <b>
                    {quota?.active || 0}/{quota?.quota || 3} suất đăng đang dùng
                  </b>
                  <progress
                    value={quota?.active || 0}
                    max={quota?.quota || 3}
                  />
                  <small>
                    Bản nháp, tạm ẩn, hết hạn và hoàn tất không chiếm suất.
                  </small>
                </div>
                <div className="swap-management-tabs">
                  {[
                    ["all", "Tất cả"],
                    ["draft", "Bản nháp"],
                    ["available", "Đang hiển thị"],
                    ["reserved", "Giữ chỗ"],
                    ["lent", "Đang mượn"],
                    ["completed", "Hoàn tất"],
                    ["expired", "Hết hạn"],
                    ["paused", "Tạm ẩn"],
                  ].map(([k, v]) => (
                    <button
                      aria-pressed={myStatus === k}
                      key={k}
                      onClick={() => setMyStatus(k)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="swap-active-filters">
              {Object.entries(filters)
                .filter(
                  ([k, v]) =>
                    v !== defaultFilters[k as keyof Filters] &&
                    !["sort", "radius"].includes(k),
                )
                .map(([k, v]) => (
                  <button
                    key={k}
                    onClick={() =>
                      setFilter(
                        k as keyof Filters,
                        defaultFilters[k as keyof Filters],
                      )
                    }
                  >
                    {k === "category"
                      ? categories[v]
                      : k === "subcategory" ? (CATEGORY_TREE[filters.category as CategoryId]?.children as Record<string,string>)?.[v]||v
                      : k === "condition" ? CONDITIONS[v as keyof typeof CONDITIONS]||v
                      : k === "cluster"
                        ? clusters[v]
                        : k === "trade"
                          ? trades[v]
                          : k === "min"
                            ? "Từ " + Number(v).toLocaleString("vi-VN") + "đ"
                            : k === "max"
                              ? "Đến " + Number(v).toLocaleString("vi-VN") + "đ"
                              : v}{" "}
                    ×
                  </button>
                ))}
            </div>
            {loadError ? (
              <div className="swap-empty" role="alert">
                <h3>Chưa kết nối được máy chủ</h3>
                <p>{loadError}</p>
                <button
                  onClick={() => {
                    setLoading(true);
                    void refresh();
                  }}
                >
                  Thử lại
                </button>
              </div>
            ) : loading ? (
              <div
                className="swap-skeleton-grid"
                role="status"
                aria-label="Đang tải món đồ"
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="swap-skeleton">
                    <div />
                    <p />
                    <p />
                  </div>
                ))}
              </div>
            ) : !visible.length ? (
              <div className="swap-empty">
                <h3>Chưa có món đồ phù hợp</h3>
                <p>
                  Thử đổi khu vực, khoảng giá hoặc đăng món đồ đầu tiên của bạn.
                </p>
                <button
                  onClick={() => {
                    setView("all");
                    setFilters({ ...defaultFilters });
                  }}
                >
                  Xem tất cả món đồ
                </button>
                {view==='all'&&<SearchDiscovery products={filterProducts(products,{...filters,q:''},origin)} query={filters.q} onSelect={openListing} onSearch={q=>setFilters({...defaultFilters,q,sort:'latest'})}/>}
              </div>
            ) : (
              <div className="swap-grid">
                {visible.map((p) => (
                  <article key={p.id} className="swap-card" onClick={() => openListing(p)} style={{ cursor: "pointer" }}>
                    <div className="swap-card-photo">
                      <button
                        onClick={(e) => { e.stopPropagation(); openListing(p); }}
                        aria-label={"Xem chi tiết " + p.title}
                      >
                        <img
                          src={p.images[0] || "/assets/prod-books.png"}
                          alt={p.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/assets/prod-books.png";
                          }}
                        />
                      </button>
                      <button
                        className={
                          "swap-heart " + (liked.has(p.id) ? "saved" : "")
                        }
                        aria-label={
                          (liked.has(p.id) ? "Bỏ lưu " : "Lưu ") + p.title
                        }
                        aria-pressed={liked.has(p.id)}
                        onClick={(e) => { e.stopPropagation(); void toggleLike(p.id); }}
                      >
                        ♥
                      </button>
                      {p.isPushed && (
                        <span className="swap-promoted">
                          Ưu tiên · Quảng bá
                        </span>
                      )}
                      <span className="swap-trade-tag">
                        {p.status === "draft"
                          ? "Bản nháp"
                          : p.status === "paused"
                            ? "Tạm ẩn"
                            : trades[p.tradeType]}
                      </span>
                    </div>
                    <div className="swap-card-info">
                      <button
                        className="swap-card-title"
                        onClick={(e) => { e.stopPropagation(); openListing(p); }}
                      >
                        {p.title}
                      </button>
                      <p>
                        ⌖ {p.seller.universityCode} · {clusters[p.cluster]}
                      </p>
                      <strong>{price(p)}</strong>
                      <div className="swap-card-meta">
                        <span>{p.condition}</span>
                        {p.isDemo && <span>Bài mẫu</span>}
                      </div>
                      {p.location && origin && (
                        <small>
                          Cách bạn {distance(origin, p.location).toFixed(1)} km
                        </small>
                      )}

                      {/* Nút màu đỏ dạng button Đăng ký để biết thông tin ở thân thẻ gắn tới form thanh toán */}
                      <button
                        type="button"
                        className="swap-card-red-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRegTargetProduct(p);
                          setShowPaymentRegModal(true);
                        }}
                      >
                        <ShieldCheck size={14} />
                        <span>Đăng ký để biết thông tin</span>
                      </button>
                      {view === "mine" && (
                        <p className="swap-status">
                          {
                            (
                              {
                                available: "Đang hiển thị",
                                reserved: "Đã giữ chỗ",
                                completed: "Hoàn tất",
                                draft: "Bản nháp",
                                paused: "Tạm ẩn",
                                expired: "Hết hạn",
                                lent: "Đang cho mượn",
                              } as Record<string, string>
                            )[p.status]
                          }
                        </p>
                      )}
                      {view === "mine" && (
                        <div className="swap-listing-stats">
                          <span>◉ {p.views || 0} lượt xem</span>
                          <span>♡ {p.likes || 0} lượt lưu</span>
                          <span>☏ {p.inquiries || 0} liên hệ</span>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <nav className="swap-pagination" aria-label="Phân trang">
                <button
                  disabled={activePage === 1}
                  onClick={() => {
                    setPage(activePage - 1);
                    scroll();
                  }}
                >
                  ← Trước
                </button>
                <span>
                  Trang {activePage} / {totalPages}
                </span>
                <button
                  disabled={activePage === totalPages}
                  onClick={() => {
                    setPage(activePage + 1);
                    scroll();
                  }}
                >
                  Sau →
                </button>
              </nav>
            )}
          </div>
        </section>
        {/* Góc Cho Tặng chuẩn mẫu theo Ảnh 1 */}
        <GivingSection
          onGoToGiving={() => {
            navigatePage("giveaway");
          }}
          onSelectProduct={() => {
            navigatePage("giveaway");
          }}
          onOpenPaymentReg={(title) => {
            const found = products.find((x) => x.title.toLowerCase().includes(title.toLowerCase()));
            setRegTargetProduct(found || null);
            setShowPaymentRegModal(true);
          }}
        />

        <HubPortals onNavigate={navigatePage}/>
        {/* 3 Khối chuẩn theo Ảnh 1: Ba bước kết nối + Safety Bar + Món tiếp theo từ bạn */}
        <CommunityFlowSections
          onOpenCreateModal={() =>
            requireUser(() => {
              setSelected(null);
              setPanel("create");
            })
          }
          onOpenHunterModal={() => navigatePage("premium")}
        />
        </>}
        {sitePage!=="market"&&<>
          {sitePage!=="giveaway"&&<HubHeading page={sitePage} onNavigate={navigatePage}/>}
          <div className={sitePage==="giveaway" ? "hub-page-content giveaway-page-wrapper" : "hub-page-content"}>
          {sitePage==="giveaway"&&<GiveawayPage products={products} user={user} onSelectProduct={openListing} onOpenCreate={()=>requireUser(()=>{setSelected(null);setPanel("create");})} onOpenChat={(p)=>requireUser(()=>{setSelected(p);setBuyer(undefined);setPanel("chat");})} onNotice={setNotice} onLogin={()=>setPanel("login")}/>}
          {sitePage==="demo"&&<DemoCatalog products={products} onSelect={openListing}/>}
          {sitePage==="wanted"&&<BuyerBoard focusId={pageTarget} onClearFocus={()=>setPageTarget('')} user={user} products={products} onSelect={openListing} onLogin={()=>setPanel('login')} onNotice={setNotice} onNavigate={navigatePage} onOpenPremium={()=>navigatePage("premium")} onOpenCreateListing={()=>requireUser(()=>{setSelected(null);setPanel("create");})}/>}
          {sitePage==="community"&&<Community focusId={pageTarget} onClearFocus={()=>setPageTarget('')} user={user} onLogin={()=>setPanel('login')}/>}
          {sitePage==="guide"&&<TradingGuide onNavigate={navigatePage} onCreate={()=>requireUser(()=>{setSelected(null);setPanel('create')})} onExchanges={()=>requireUser(()=>setPanel('exchanges'))}/>}
          {sitePage==="premium"&&<PremiumShop user={user} onVerify={()=>setPanel('account')} onLogin={()=>{sessionStorage.setItem('swap_resume_premium','1');setPanel('login')}} onOrders={()=>requireUser(()=>setPanel('orders'))} onChange={refreshUser}/>}
          {sitePage==="api"&&<ApiGuide/>}
          </div></>}
      </main>

      {/* Floating Product Detail Modal */}
      {selected && panel === "detail" && (
        <ProductDetailView
          product={selected}
          user={user}
          isLiked={liked.has(selected.id)}
          onBack={() => {
            setSelected(null);
            setPanel(null);
          }}
          onOpenChat={(p) => {
            setSelected(p);
            setBuyer(undefined);
            setPanel("chat");
          }}
          onOpenProfile={(sellerId) => {
            setProfileId(sellerId);
            setPanel("profile");
          }}
          onToggleLike={(id) => void toggleLike(id)}
          onReport={(p) => {
            requireUser(() => {
              setSelected(p);
              setReason("");
              setPanel("report");
            });
          }}
          onReserve={(p) => {
            requireUser(() => {
              setSelected(p);
              setPhone("");
              setOfferId("");
              setPanel("reserve");
            });
          }}
          onNotice={setNotice}
          onOpenPaymentReg={(p) => {
            setRegTargetProduct(p);
            setShowPaymentRegModal(true);
          }}
        />
      )}

      {/* Form Đăng ký để biết thông tin */}
      {showPaymentRegModal && (
        <PaymentRegistrationModal
          product={regTargetProduct}
          user={user}
          onClose={() => {
            setShowPaymentRegModal(false);
            setRegTargetProduct(null);
          }}
          onSuccess={(details) => {
            setNotice(`🎉 Đã mở khoá người bán: ${details.phone} (${details.sellerName})`);
            if (regTargetProduct) {
              openListing(regTargetProduct);
            }
          }}
          onViewDetail={(p) => {
            setShowPaymentRegModal(false);
            setRegTargetProduct(null);
            openListing(p);
          }}
        />
      )}
      <nav className="swap-mobile-nav" aria-label="Điều hướng điện thoại">
        <button onClick={() => navigatePage("market")}>
          <Home size={21} />
          <span>Trang chủ</span>
        </button>
        <button
          onClick={() => {
            scroll();
            document.getElementById("search")?.focus();
          }}
        >
          <Search size={21} />
          <span>Tìm kiếm</span>
        </button>
        <button
          className="swap-mobile-post"
          onClick={() =>
            requireUser(() => {
              setSelected(null);
              setPanel("create");
            })
          }
        >
          <Plus size={23} />
          <span>Đăng tin</span>
        </button>
        <button onClick={() => loadPanel("inbox")}>
          <MessageCircle size={21} />
          <span>Tin nhắn</span>
        </button>
        <button onClick={() => setPanel(user ? "account" : "login")}>
          <UserRound size={21} />
          <span>Tài khoản</span>
        </button>
      </nav>
      <Footer
        onOpenCreateModal={() =>
          requireUser(() => {
            setSelected(null);
            setPanel("create");
          })
        }
        onOpenHunterModal={() =>
          setPanel("pro")
        }
      />
      {filterOpen&&<MarketFilterPanel filters={filters} schools={schoolOptions} onClose={()=>setFilterOpen(false)} onApply={next=>{setFilters({...next,radius:'all'});setFilterOpen(false);scroll()}}/>}
      {detailedFilterOpen && (
        <DetailedFilterModal
          category={detailedFilterCat}
          subcategory={filters.subcategory}
          currentFilters={filters}
          matchCount={filtered.length}
          onApply={(newFilters) => {
            setView("all");
            setFilters((prev) => ({
              ...prev,
              ...newFilters,
            }));
            setNotice("Đã áp dụng bộ lọc chi tiết cho " + (categories[newFilters.category || detailedFilterCat] || "danh mục"));
            scroll();
          }}
          onClose={() => setDetailedFilterOpen(false)}
        />
      )}
      {notice && (
        <div className="swap-toast" role="status">
          {notice}
          <button aria-label="Đóng thông báo" onClick={() => setNotice("")}>
            ✕
          </button>
        </div>
      )}
      {/* Trang Đăng nhập & Đăng ký toàn màn hình chuẩn xác theo ảnh mẫu */}
      {(panel === "login" || panel === "register") && (
        <AuthPage onBack={close}>
          <AccountForm
            register={panel === "register"}
            onToggleMode={() => setPanel(panel === "login" ? "register" : "login")}
            onForgot={() => setPanel("account")}
            onSuccess={(u, d) => {
              setUser(u);
              setDelivery(d);
              if (u.role === "admin") {
                window.location.href = "/admin/dashboard.html";
              } else if (!u.isVerified) {
                setPanel("account");
              } else if (sessionStorage.getItem("swap_resume_create")) {
                sessionStorage.removeItem("swap_resume_create");
                setSelected(null);
                setPanel("create");
              } else if (sessionStorage.getItem("swap_resume_premium")) {
                sessionStorage.removeItem("swap_resume_premium");
                setPanel("pro");
              } else {
                close();
              }
              setNotice("Xin chào " + u.name + ". Bạn đã đăng nhập.");
            }}
          />
        </AuthPage>
      )}

      {(panel === "inbox" || panel === "chat" || panel === "profile") && (
        <ChatWorkspace
          initialProduct={selected}
          currentUser={user}
          initialViewMode={panel === "profile" ? "profile" : "chat"}
          onBack={close}
          onNavigateExplore={() => {
            close();
            setSitePage("market");
          }}
          onLoginClick={() => setPanel("login")}
          onOpenCreate={() => requireUser(() => { setSelected(null); setPanel("create"); })}
        />
      )}

      {/* Giao diện Đăng tin sản phẩm mới - Xài chung sidebar Tài khoản chuẩn Ảnh 3 */}
      {panel === "create" && (
        <UserProfileView
          initialMode="create"
          initialTab="create"
          currentUser={user}
          userProducts={products.filter((p) => p.seller.id === user?.id)}
          allProducts={products}
          likedIds={liked}
          onToggleLike={toggleLike}
          onOpenCreatePost={() => {
            setSelected(null);
            setPanel("create");
          }}
          onSelectProduct={openListing}
          onLogout={() => {
            void api("/logout", "POST").then(() => {
              setUser(null);
              close();
              setNotice("Đã đăng xuất.");
            });
          }}
          onBackToHome={close}
          onOpenChatWithSeller={(p) => {
            setSelected(p);
            setBuyer(undefined);
            setPanel("chat");
          }}
          onPublishSuccess={(newProduct) => {
            setProducts((prev) => [newProduct, ...prev]);
            setNotice("Đã đăng tin thành công!");
          }}
        />
      )}

      {/* Giao diện Tài khoản của tôi chuẩn 100% Ảnh 3 (Đã xóa bỏ mục Tour) */}
      {panel === "account" && (
        <UserProfileView
          initialMode="list"
          initialTab={accountInitialTab}
          currentUser={user}
          userProducts={products.filter((p) => p.seller.id === user?.id)}
          allProducts={products}
          likedIds={liked}
          onToggleLike={toggleLike}
          onOpenCreatePost={() => {
            setSelected(null);
            setPanel("create");
          }}
          onSelectProduct={openListing}
          onLogout={() => {
            void api("/logout", "POST").then(() => {
              setUser(null);
              close();
              setNotice("Đã đăng xuất.");
            });
          }}
          onBackToHome={close}
          onOpenChatWithSeller={(p) => {
            setSelected(p);
            setBuyer(undefined);
            setPanel("chat");
          }}
          onPublishSuccess={(newProduct) => {
            setProducts((prev) => [newProduct, ...prev]);
            setNotice("Đã đăng tin thành công!");
          }}
        />
      )}

      {panel && panel!=="pro" && panel!=="api-guide" && panel!=="detail" && panel!=="login" && panel!=="register" && panel!=="inbox" && panel!=="chat" && panel!=="profile" && panel!=="create" && panel!=="account" && (
        <Dialog
          title={
            panel === "offers"
              ? "Đề nghị mua và trao đổi"
              : panel === "notifications"
                ? "Thông báo"
                : panel === "admin"
                    ? "Quản trị UniSwap"
                    : panel === "exchanges"
                      ? "Giao dịch & tủ đồ mô phỏng"
                      : panel === "reserve"
                        ? "Đặt giữ món đồ"
                        : panel === "edit"
                          ? "Chỉnh sửa bài đăng"
                          : panel === "report"
                            ? "Báo cáo bài đăng"
                            : panel === "searches"
                              ? "Tìm kiếm đã lưu"
                              : panel === "price-alerts" ? "Theo dõi giá" : panel === "orders"
                                ? "Đăng ký dịch vụ của bạn"
                                : "Đăng ký dịch vụ"
          }
          onClose={close}
          wide={panel === "admin" || panel === "edit"}
        >
          {panel === "notifications" && user && (
            <NotificationsPanel
              onOpen={(kind, target) => {
                if (["listing", "match", "moderation", "price"].includes(kind)) {
                  void api("/products/" + target)
                    .then((d) => openListing(d.product))
                    .catch((e) => setNotice(e.message));
                } else if (kind === "offer") {
                  setSelected(null);
                  setPanel("offers");
                } else if (kind === "billing") setPanel("orders");
                else if (kind === "message") loadPanel("inbox");
                else if (
                  ["exchange", "reminder", "appointment", "return"].includes(
                    kind,
                  )
                )
                  setPanel("exchanges");
                else navigatePage(kind==='request'?'wanted':'community',target);
              }}
            />
          )}
          {panel === "offers" && user && (
            <OfferPanel
              key={selected?.id || "all"}
              user={user}
              product={selected || undefined}
              products={products}
              onReserve={(p, id) => {
                setSelected(p);
                setOfferId(id);
                setPanel("reserve");
              }}
              onNotice={setNotice}
            />
          )}
          {panel === "admin" && (
            <AdminPanel
              currentUser={user}
              onRoleChanged={refreshUser}
              onClose={close}
            />
          )}
          {panel === "edit" && user && (
            <ListingForm campus={user?.universityCode}
              imageLimit={user.imageLimit || 5}
              item={panel === "edit" ? selected || undefined : undefined}
              onSaved={() => {
                close();
                setView("mine");
                setMyStatus("all");
                setFilters({ ...defaultFilters });
                void refresh();
                setNotice("Đã lưu bài đăng.");
                scroll();
              }}
            />
          )}
          {panel === "price-alerts" && <PriceAlertsPanel onOpen={openListing}/>}
          {panel === "push" && (
            <form className="swap-form" onSubmit={order}>
              <p>
                Đăng ký cho <b>{user?.name}</b> · {user?.email}
              </p>
              <label>
                Chọn gói
                <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                  {([
                        ["push1d", "Đẩy tin 1 ngày · 3.000đ"],
                        ["push3d", "Đẩy tin 3 ngày · 7.000đ"],
                        ["combo5", "Đẩy tin 5 ngày · 10.000đ"],
                      ]).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              {panel === "push" && <><p>Bài đăng: {selected?.title}</p>{!!user?.pushCredits&&<button type="button" onClick={async()=>{try{const d=await api("/products/"+selected?.id+"/use-boost","POST",{});refreshUser();void refresh();close();setNotice(d.message)}catch(e){setNotice((e as Error).message)}}}>Dùng 1 lượt kèm gói (còn {user.pushCredits})</button>}</>}
              <p className="swap-note">
                Mức phí thử nghiệm theo đề xuất cuộc họp, chưa phải bảng giá
                kinh doanh chính thức. Hệ thống hiện nhận đăng ký dịch vụ. Bạn
                có thể chọn thanh toán nếu đã cấu hình VNPAY hoặc kích hoạt mô
                phỏng trên máy. Chưa trả tiền thì chưa được kích hoạt. Bạn có
                thể xem lại đăng ký trong tài khoản.
              </p>
              <label className="swap-check">
                <input type="checkbox" required />
                Tôi xác nhận gói và mức giá đăng ký.
              </label>
              <button className="swap-primary" disabled={busy}>
                {busy ? "Đang lưu…" : "Gửi đăng ký dịch vụ"}
              </button>
            </form>
          )}
          {panel === "orders" && user && (
            <BillingPanel
              onChange={() => {
                refreshUser();
                void refresh();
              }}
              onNotice={setNotice}
            />
          )}

          {panel === "searches" && (
            <div className="swap-list">
              {busy ? (
                <p>Đang tải…</p>
              ) : !searches.length ? (
                <p>Chưa lưu tìm kiếm. Chọn bộ lọc rồi bấm “Lưu tìm kiếm”.</p>
              ) : (
                searches.map((s) => (
                  <div key={s.id}>
                    <b>{s.name}</b>
                    <div className="swap-actions">
                      <button
                        onClick={() => {
                          setView("all");
                          setFilters({ ...defaultFilters, ...s.filters });
                          close();
                          scroll();
                        }}
                      >
                        Áp dụng
                      </button>
                      <button
                        onClick={() => {
                          void api("/searches/" + s.id, "DELETE")
                            .then(() =>
                              setSearches((prev) =>
                                prev.filter((x) => x.id !== s.id),
                              ),
                            )
                            .catch((e) => setNotice(e.message));
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </Dialog>
      )}
    </div>
  );
}
export default App;
