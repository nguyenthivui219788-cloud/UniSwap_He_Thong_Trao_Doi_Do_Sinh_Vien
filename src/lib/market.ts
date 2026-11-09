import {searchScore} from "./search.ts";
import {CATEGORY_TREE,conditionGroup} from "../../shared/catalog.ts";
export { CATEGORY_TREE };
import type { ProductItem } from "../types";
export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
export const categories: Record<string,string> = {all:"Tất cả danh mục",...Object.fromEntries(Object.entries(CATEGORY_TREE).map(([k,v])=>[k,v.label]))};
export const clusters: Record<string, string> = {
  all: "Tất cả khu vực",
  "lang-dh": "Làng Đại Học",
  q5: "Cụm Q.5",
  q10: "Cụm Q.10",
  "nam-sai-gon": "Nam Sài Gòn",
  "binh-thanh": "Bình Thạnh",
};
export const trades: Record<string, string> = {
  all: "Tất cả hình thức",
  sale: "Đang bán",
  swap: "Trao đổi",
  giveaway: "Cho tặng 0đ",
  borrow: "Cho mượn",
};
export interface Filters {
  q: string;
  category: string;
  subcategory: string;
  cluster: string;
  school: string;
  trade: string;
  min: string;
  max: string;
  condition: string;
  sort: string;
  radius: string;
  // Tier-3 specialized filter attributes
  majorGroup?: string;
  subject?: string;
  bookType?: string;
  brand?: string;
  ram?: string;
  storage?: string;
  cpu?: string;
  warranty?: string;
  itemType?: string;
  itemSize?: string;
  canPickupAtSchool?: boolean;
  size?: string;
  color?: string;
  style?: string;
  sport?: string;
  toolType?: string;
  material?: string;
  orderType?: string;
  hasNotes?: string;
}
export const defaultFilters: Filters = {
  q: "",
  category: "all",
  subcategory: "all",
  cluster: "all",
  school: "all",
  trade: "all",
  min: "",
  max: "",
  condition: "",
  sort: "latest",
  radius: "all",
  majorGroup: "all",
  subject: "all",
  bookType: "all",
  brand: "all",
  ram: "all",
  storage: "all",
  cpu: "all",
  warranty: "all",
  itemType: "all",
  itemSize: "all",
  canPickupAtSchool: false,
  size: "all",
  color: "all",
  style: "all",
  sport: "all",
  toolType: "all",
  material: "all",
  orderType: "all",
  hasNotes: "all",
};
export function distance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const rad = Math.PI / 180,
    dLat = (b.lat - a.lat) * rad,
    dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
}
export function filterProducts(
  items: ProductItem[],
  f: Filters,
  origin?: { lat: number; lng: number } | null,
) {
  return items
    .filter(
      (p) =>
        p.status === "available" &&
        p.moderation !== "hidden" &&
        (f.category === "all" || p.category === f.category) &&
        (!f.subcategory||f.subcategory==="all"||p.subcategory===f.subcategory) &&
        (f.cluster === "all" || p.cluster === f.cluster) &&
        (f.school === "all" || p.seller.universityCode === f.school) &&
        (f.trade === "all" || p.tradeType === f.trade) &&
        (!f.min || p.price >= Number(f.min)) &&
        (!f.max || p.price <= Number(f.max)) &&
        (!f.condition ||
          (["new","like_new","used","repair"].includes(f.condition)?conditionGroup(p.condition)===f.condition:normalize(p.condition).includes(normalize(f.condition)))) &&
        (!f.q || searchScore(p,f.q)>0) &&
        (f.radius === "all" ||
          (!!origin &&
            !!p.location &&
            distance(origin, p.location) <= Number(f.radius))) &&
        // Tier 3 specialized filters
        (!f.majorGroup || f.majorGroup === 'all' || p.majorGroup === f.majorGroup) &&
        (!f.subject || f.subject === 'all' || normalize(p.title + ' ' + p.description).includes(normalize(f.subject))) &&
        (!f.brand || f.brand === 'all' || normalize(p.title + ' ' + p.description).includes(normalize(f.brand))) &&
        (!f.ram || f.ram === 'all' || normalize(p.title + ' ' + p.description).includes(normalize(f.ram))) &&
        (!f.size || f.size === 'all' || normalize(p.title + ' ' + p.description).includes(normalize(f.size))) &&
        (!f.sport || f.sport === 'all' || normalize(p.title + ' ' + p.description).includes(normalize(f.sport))) &&
        (!f.material || f.material === 'all' || normalize(p.title + ' ' + p.description).includes(normalize(f.material))) &&
        (!f.canPickupAtSchool || /truong|ktx|sanh|canteen|lop|giang duong/i.test(normalize(p.meetingSpot)))
    )
    .sort((a, b) =>
      ((!!f.q&&['latest'].includes(f.sort)?searchScore(b,f.q)-searchScore(a,f.q):0)||(
      f.sort === "price_asc"
        ? a.price - b.price
        : f.sort === "price_desc"
          ? b.price - a.price
          : f.sort === "nearest" && origin
            ? (a.location ? distance(origin, a.location) : Infinity) -
              (b.location ? distance(origin, b.location) : Infinity)
            : Number(!!b.isPushed)-Number(!!a.isPushed) || Date.parse(b.createdAt) - Date.parse(a.createdAt))),
    );
}
