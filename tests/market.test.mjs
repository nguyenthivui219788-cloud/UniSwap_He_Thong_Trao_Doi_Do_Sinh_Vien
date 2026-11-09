import { test } from "node:test";
import assert from "node:assert/strict";
import {filterProducts,defaultFilters,distance} from "../src/lib/market.ts";
const items = [
  {
    id: "1",
    title: "Giáo trình Đại số",
    description: "Sách mới",
    meetingSpot: "Thư viện",
    seller: { universityCode: "UIT" },
    category: "books",
    cluster: "lang-dh",
    tradeType: "sale",
    price: 50000,
    condition: "Như mới",
    status: "available",
    createdAt: "2026-10-25",
    location: { lat: 10.8, lng: 106.7 },
  },
  {
    id: "2",
    title: "Máy tính",
    description: "Máy học tập",
    meetingSpot: "Cổng trường",
    seller: { universityCode: "UEH" },
    category: "electronics",
    cluster: "q10",
    tradeType: "sale",
    price: 8000000,
    condition: "Đã qua sử dụng",
    status: "available",
    createdAt: "2026-10-26",
  },
  {
    id: "3",
    title: "Sách đã bán",
    category: "books",
    cluster: "lang-dh",
    tradeType: "sale",
    price: 0,
    condition: "Mới",
    status: "completed",
    createdAt: "2026-10-26",
  },
];
test("combined school/area/type/price filters affect the actual catalog", () => {
  assert.deepEqual(
    filterProducts(items, {
      ...defaultFilters,
      q: "giao trinh dai so",
      school: "UIT",
      cluster: "lang-dh",
      category: "books",
      trade: "sale",
      max: "60000",
    }).map((p) => p.id),
    ["1"],
  );
  assert.equal(
    filterProducts(items, {
      ...defaultFilters,
      school: "UEH",
      category: "books",
    }).length,
    0,
  );
});
test("sort newest, price, and accurate distance; exclude unknown coordinates for radius", () => {
  assert.deepEqual(
    filterProducts(items, { ...defaultFilters }).map((p) => p.id),
    ["2", "1"],
  );
  assert.deepEqual(
    filterProducts(items, { ...defaultFilters, sort: "price_asc" }).map(
      (p) => p.id,
    ),
    ["1", "2"],
  );
  assert.equal(
    distance({ lat: 0, lng: 0 }, { lat: 0, lng: 1 }).toFixed(1),
    "111.2",
  );
  assert.equal(
    filterProducts(items, { ...defaultFilters, radius: "1" }, null).length,
    0,
  );
  assert.deepEqual(
    filterProducts(
      items,
      { ...defaultFilters, radius: "1" },
      { lat: 10.8, lng: 106.7 },
    ).map((p) => p.id),
    ["1"],
  );
});

test('condition groups and category children filter precisely',()=>{const list=[{...items[0],subcategory:'textbooks',condition:'Mới 100%'},{...items[0],id:'second',subcategory:'reference',condition:'99% như mới'},{...items[0],id:'repair',condition:'Bìa hỏng cần sửa'}];assert.equal(filterProducts(list,{...defaultFilters,condition:'new'}).length,1);assert.equal(filterProducts(list,{...defaultFilters,condition:'like_new'})[0].id,'second');assert.equal(filterProducts(list,{...defaultFilters,condition:'repair'})[0].id,'repair');assert.equal(filterProducts(list,{...defaultFilters,subcategory:'textbooks'}).length,1);});

test('schools have equal ranking and school filtering remains exact',()=>{const ordinary={...items[0],id:'other-school',price:10000,createdAt:'2026-10-27',seller:{universityCode:'UIT'}},dhv={...items[0],id:'dhv-school',price:50000,createdAt:'2026-10-20',seller:{universityCode:'DHV'}};assert.equal(filterProducts([ordinary,dhv],{...defaultFilters})[0].id,'other-school');assert.equal(filterProducts([ordinary,dhv],{...defaultFilters,sort:'price_asc'})[0].id,'other-school');assert.deepEqual(filterProducts([ordinary,dhv],{...defaultFilters,school:'DHV'}).map(p=>p.id),['dhv-school']);});
