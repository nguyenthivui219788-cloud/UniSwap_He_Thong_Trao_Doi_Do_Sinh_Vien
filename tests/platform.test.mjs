import {initDemo} from "../server/demo.mjs";
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID, createHmac } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, unlinkSync } from "node:fs";
import path from "node:path";
const database = path.resolve(".cache/platform-" + randomUUID() + ".sqlite"),
  port = 41000 + Math.floor(Math.random() * 5000),
  base = `http://127.0.0.1:${port}/api`,
  secret = "test-signing-secret-never-use-live";
let child, db, a, b, c, unverified, p, ex, resetToken;
async function req(route, method = "GET", body, user) {
  const r = await fetch(base + route, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(user ? { Cookie: user.cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return {
    status: r.status,
    data: await r.json(),
    cookie: r.headers.get("set-cookie")?.split(";")[0],
  };
}
async function start(production = false) {
  child = spawn(process.execPath, ["server/server.mjs"], {
    env: {
      ...process.env,
      PORT: String(port),
      SWAP_DB: database,
      NODE_ENV: production ? "production" : "test",
      SWAP_MODE: production ? "production" : "local",
      VNPAY_TMN_CODE: "TESTCODE",
      VNPAY_HASH_SECRET: secret,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let err = "";
  child.stderr.on("data", (d) => (err += d));
  for (let i = 0; i < 80; i++) {
    try {
      if ((await req("/health")).status === 200) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw Error(err);
}
async function stop() {
  child.kill();
  await new Promise((resolve) => child.once("exit", resolve));
}
async function signup(name, verify = true) {
  const u = await req("/register", "POST", {
    name,
    email: name + "@uit.edu.vn",
    password: "Password123!",
    school: "UIT",
    purpose: "both",
    consent: true,
  });
  assert.equal(u.status, 200, JSON.stringify(u.data));
  u.id = u.data.user.id;
  if (verify) {
    const v = await req(
      "/auth/verify",
      "POST",
      { token: u.data.delivery.token },
      u,
    );
    assert.equal(v.status, 200, JSON.stringify(v.data));
  }
  return u;
}
const listing = (extra = {}) => ({
  title: "Giáo trình kiểm thử nền tảng",
  description: "Sách đầy đủ các trang, dùng thử cho luồng giao dịch.",
  category: "books",
  tradeType: "sale",
  price: 40000,
  images: ["/assets/prod-books.png"],
  condition: "Như mới",
  cluster: "q5",
  meetingSpot: "Sảnh thư viện trường",
  ...extra,
});
async function post(user, extra = {}) {
  const r = await req("/products", "POST", listing(extra), user);
  assert.equal(r.status, 201, JSON.stringify(r.data));
  return r.data.product;
}
before(async () => {
  mkdirSync(path.dirname(database), { recursive: true });
  await start();
  db = new DatabaseSync(database);
  a = await signup("seller");
  b = await signup("buyer");
  c = await signup("outsider");
  unverified = await signup("unverified", false);
});
after(async () => {
  db?.close();
  if (child && !child.killed) await stop();
  for (const s of ["", "-wal", "-shm"])
    try {
      unlinkSync(database + s);
    } catch {}
});
test("verification tokens are required, single-use; public email and password stay private", async () => {
  assert.equal(
    (await req("/products", "POST", listing(), unverified)).status,
    403,
  );
  assert.equal(
    (await req("/auth/verify", "POST", { token: a.data.delivery.token }, a))
      .status,
    400,
  );
  const profile = await req("/users/" + a.id);
  assert.equal(profile.data.profile.email, undefined);
  assert.equal(profile.data.profile.password, undefined);
  assert.equal(
    (
      await req(
        "/account",
        "PATCH",
        { name: "New", school: "UIT", admin: true, isVerified: true },
        unverified,
      )
    ).status,
    200,
  );
  assert.equal(
    (await req("/me", "GET", null, unverified)).data.user.role,
    "student",
  );
});
test("incomplete drafts are editable, excluded from public results and quota", async () => {
  const r = await req(
    "/products",
    "POST",
    { status: "draft", title: "Chưa viết xong" },
    a,
  );
  assert.equal(r.status, 201);
  assert.equal(r.data.product.status, "draft");
  assert.equal(
    (await req("/products")).data.products.some(
      (p) => p.id === r.data.product.id,
    ),
    false,
  );
  assert.equal((await req("/account", "GET", null, a)).data.quota.active, 0);
  assert.equal(
    (
      await req(
        "/products/" + r.data.product.id,
        "PATCH",
        { status: "draft", title: "Nháp" },
        a,
      )
    ).status,
    200,
  );
  const published = await req(
    "/products/" + r.data.product.id + "/publish",
    "POST",
    listing(),
    a,
  );
  assert.equal(published.status, 200, JSON.stringify(published.data));
  p = published.data.product;
  assert.ok(p.expiresAt);
  assert.equal(
    (await req("/products/" + p.id + "/repost", "POST", {}, a)).status,
    429,
  );
});
test("real view counts deduplicate by viewer/day; follow and saved search notify on publish", async () => {
  await req("/products/" + p.id, "GET", null, b);
  await req("/products/" + p.id, "GET", null, b);
  assert.equal(
    (await req("/products/" + p.id, "GET", null, b)).data.product.views,
    1,
  );
  assert.equal(
    (await req("/users/" + a.id + "/follow", "POST", {}, b)).status,
    200,
  );
  await req(
    "/searches",
    "POST",
    {
      name: "Sách UIT",
      filters: { category: "books", school: "UIT", q: "kiem thu" },
    },
    b,
  );
  const second = await post(a, {
    title: "Sách kiểm thử mới đăng",
    specs: { subject: "Kiểm thử", major: "CNTT" },
  });
  const messages = (await req("/notifications", "GET", null, b)).data
    .notifications;
  assert.ok(
    messages.some((n) => n.kind === "listing" && n.target === second.id),
  );
  assert.ok(messages.some((n) => n.kind === "match"));
  await req("/notifications", "PATCH", {}, b);
  assert.equal((await req("/notifications", "GET", null, b)).data.unread, 0);
});
test("price offer ownership, acceptance and reservation use the agreed price", async () => {
  const offer = await req(
    "/products/" + p.id + "/offer",
    "POST",
    { amount: 30000 },
    b,
  );
  assert.equal(offer.status, 201, JSON.stringify(offer.data));
  assert.equal(
    (await req("/offers/" + offer.data.id + "/accept", "POST", {}, c)).status,
    403,
  );
  assert.equal(
    (await req("/offers/" + offer.data.id + "/accept", "POST", {}, a)).status,
    200,
  );
  const r = await req(
    "/exchanges",
    "POST",
    { productId: p.id, phone: "0900000000", offerId: offer.data.id },
    b,
  );
  assert.equal(r.status, 201, JSON.stringify(r.data));
  ex = r.data.id;
  const e = (await req("/exchanges", "GET", null, b)).data.exchanges.find(
    (e) => e.id === ex,
  );
  assert.equal(e.agreed_price, 30000);
  assert.ok(e.expires > Date.now());
});
test("appointment changes require the other participant; expired code cannot complete", async () => {
  const appointment = new Date(Date.now() + 2 * 86400000).toISOString();
  assert.equal(
    (
      await req(
        "/exchanges/" + ex + "/appointment",
        "POST",
        { appointment, place: "Thư viện khu B" },
        b,
      )
    ).status,
    200,
  );
  assert.equal(
    (await req("/exchanges/" + ex + "/accept-appointment", "POST", {}, b))
      .status,
    403,
  );
  assert.equal(
    (await req("/exchanges/" + ex + "/accept-appointment", "POST", {}, a))
      .status,
    200,
  );
  const e = (await req("/exchanges", "GET", null, b)).data.exchanges.find(
    (e) => e.id === ex,
  );
  assert.equal(e.appointment, appointment);
  const issued = await req("/exchanges/" + ex + "/code", "POST", {}, a);
  assert.equal(issued.status, 200);
  assert.ok(issued.data.expires > Date.now());
  db.prepare("UPDATE exchanges SET code_expires=? WHERE id=?").run(
    Date.now() - 1,
    ex,
  );
  assert.equal(
    (
      await req(
        "/exchanges/" + ex + "/complete",
        "POST",
        { code: issued.data.code },
        b,
      )
    ).status,
    409,
  );
  const code = (await req("/exchanges/" + ex + "/code", "POST", {}, a)).data
    .code;
  assert.equal(
    (await req("/exchanges/" + ex + "/complete", "POST", { code }, b)).status,
    200,
  );
});
test("completed transaction allows one review per party and preserves snapshot after edits/deletion", async () => {
  assert.equal(
    (
      await req(
        "/exchanges/" + ex + "/review",
        "POST",
        { rating: 5, text: "Giao dịch nhanh và đúng mô tả." },
        c,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await req(
        "/exchanges/" + ex + "/review",
        "POST",
        { rating: 5, text: "Giao dịch nhanh và đúng mô tả." },
        b,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await req(
        "/exchanges/" + ex + "/review",
        "POST",
        { rating: 1, text: "Viết lần hai không được." },
        b,
      )
    ).status,
    409,
  );
  assert.equal((await req("/users/" + a.id)).data.profile.rating, 5);
  assert.equal(
    (await req("/products/" + p.id, "PATCH", listing({ price: 70000 }), a))
      .status,
    200,
  );
  assert.equal(
    (await req("/exchanges", "GET", null, b)).data.exchanges.find(
      (e) => e.id === ex,
    ).product.price,
    40000,
  );
  assert.equal((await req("/products/" + p.id, "DELETE", {}, a)).status, 200);
  assert.equal(
    (await req("/exchanges", "GET", null, b)).data.exchanges.find(
      (e) => e.id === ex,
    ).status,
    "completed",
  );
});
test("borrowing has due date, extension consent and two-party return confirmation", async () => {
  const p = await post(c, {
    tradeType: "borrow",
    borrowDuration: "3 ngày",
    price: 10000,
  });
  assert.equal(
    (
      await req(
        "/exchanges",
        "POST",
        { productId: p.id, phone: "0900000000" },
        b,
      )
    ).status,
    400,
  );
  const r = await req(
    "/exchanges",
    "POST",
    {
      productId: p.id,
      phone: "0900000000",
      due: new Date(Date.now() + 86400000).toISOString(),
    },
    b,
  );
  assert.equal(r.status, 201, JSON.stringify(r.data));
  const id = r.data.id,
    code = (await req("/exchanges/" + id + "/code", "POST", {}, c)).data.code;
  assert.equal(
    (await req("/exchanges/" + id + "/complete", "POST", { code }, b)).status,
    200,
  );
  assert.equal(
    (await req("/exchanges", "GET", null, b)).data.exchanges.find(
      (e) => e.id === id,
    ).status,
    "lent",
  );
  assert.equal(
    (
      await req(
        "/exchanges/" + id + "/extend",
        "POST",
        { due: new Date(Date.now() + 2 * 86400000).toISOString() },
        b,
      )
    ).status,
    200,
  );
  assert.equal(
    (await req("/exchanges/" + id + "/accept-extension", "POST", {}, b)).status,
    403,
  );
  assert.equal(
    (await req("/exchanges/" + id + "/accept-extension", "POST", {}, c)).status,
    200,
  );
  assert.equal(
    (await req("/exchanges/" + id + "/confirm-return", "POST", {}, c)).status,
    403,
  );
  await req("/exchanges/" + id + "/request-return", "POST", {}, b);
  assert.equal(
    (await req("/exchanges/" + id + "/confirm-return", "POST", {}, c)).status,
    200,
  );
  assert.equal(
    (await req("/products/" + p.id)).data.product.status,
    "available",
  );
});
test("swap reserves both items, records signed cash adjustment, cancellation releases both", async () => {
  const pa = await post(a, {
      tradeType: "swap",
      swapFor: "Sách khác",
      price: 0,
    }),
    pb = await post(b);
  assert.equal(
    (
      await req(
        "/exchanges",
        "POST",
        { productId: pa.id, phone: "0900000000" },
        b,
      )
    ).status,
    400,
  );
  const offer = await req(
    "/products/" + pa.id + "/offer",
    "POST",
    { amount: 0, cash: -10000, offeredProduct: pb.id },
    b,
  );
  assert.equal(offer.status, 201);
  await req("/offers/" + offer.data.id + "/accept", "POST", {}, a);
  const r = await req(
    "/exchanges",
    "POST",
    { productId: pa.id, phone: "0900000000", offerId: offer.data.id },
    b,
  );
  assert.equal(r.status, 201, JSON.stringify(r.data));
  assert.equal(
    (await req("/products/" + pb.id, "GET", null, b)).data.product.status,
    "reserved",
  );
  assert.equal(
    (await req("/exchanges", "GET", null, b)).data.exchanges.find(
      (e) => e.id === r.data.id,
    ).cash,
    -10000,
  );
  await req("/exchanges/" + r.data.id + "/cancel", "POST", {}, a);
  assert.equal(
    (await req("/products/" + pb.id)).data.product.status,
    "available",
  );
});
test("buy requests allow only owned available listing responses and can be closed", async () => {
  const r = await req(
    "/buy-requests",
    "POST",
    {
      title: "Cần giáo trình CNTT",
      description: "Mình cần sách dùng học kỳ tới.",
      budget: 70000,
      category: "books",
      cluster: "q5",
    },
    b,
  );
  assert.equal(r.status, 201);
  const owned = (await req("/products", "GET", null, a)).data.products.find(
    (p) => p.seller.id === a.id && p.status === "available",
  );
  assert.equal(
    (
      await req(
        "/buy-requests/" + r.data.id + "/respond",
        "POST",
        { productId: owned.id, text: "Sách mình còn bạn nhé" },
        c,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await req(
        "/buy-requests/" + r.data.id + "/respond",
        "POST",
        { productId: owned.id, text: "Sách mình còn bạn nhé" },
        a,
      )
    ).status,
    200,
  );
  assert.ok(
    (await req("/notifications", "GET", null, b)).data.notifications.some(
      (n) => n.kind === "request",
    ),
  );
  assert.equal(
    (await req("/buy-requests/" + r.data.id, "DELETE", {}, a)).status,
    403,
  );
  await req("/buy-requests/" + r.data.id, "DELETE", {}, b);
});
test("reservation expiry returns stock; cancelled history no longer prevents editing", async () => {
  const p = (await req("/products", "GET", null, c)).data.products.find(
    (p) => p.seller.id === c.id && p.status === "available",
  );
  const r = await req(
    "/exchanges",
    "POST",
    {
      productId: p.id,
      phone: "0900000000",
      due:
        p.tradeType === "borrow"
          ? new Date(Date.now() + 86400000).toISOString()
          : undefined,
    },
    b,
  );
  assert.equal(r.status, 201, JSON.stringify(r.data));
  db.prepare("UPDATE exchanges SET expires=? WHERE id=?").run(
    Date.now() - 1,
    r.data.id,
  );
  await new Promise((resolve) => setTimeout(resolve, 1100));
  assert.equal(
    (await req("/products/" + p.id)).data.product.status,
    "available",
  );
  assert.equal(
    (await req("/exchanges", "GET", null, b)).data.exchanges.find(
      (e) => e.id === r.data.id,
    ).status,
    "expired",
  );
  assert.equal(
    (
      await req(
        "/products/" + p.id,
        "PATCH",
        listing({ title: "Đã sửa sau giao dịch hủy", tradeType: "sale" }),
        c,
      )
    ).status,
    200,
  );
});
test("membership respects capacity and updates joined status", async () => {
  const r = await req(
    "/topics",
    "POST",
    {
      kind: "study",
      title: "Nhóm kiểm thử phần mềm",
      text: "Cùng học tại thư viện vào sáng thứ bảy.",
      price: 0,
      capacity: 1,
      schedule: new Date(Date.now() + 86400000).toISOString(),
    },
    a,
  );
  assert.equal(r.status, 201);
  assert.equal(
    (await req("/topics/" + r.data.id + "/join", "POST", {}, b)).status,
    200,
  );
  assert.equal(
    (await req("/topics/" + r.data.id + "/join", "POST", {}, c)).status,
    409,
  );
  assert.equal(
    (await req("/topics", "GET", null, b)).data.topics.find(
      (t) => t.id === r.data.id,
    ).joined,
    true,
  );
  await req("/topics/" + r.data.id + "/leave", "POST", {}, b);
  assert.equal(
    (await req("/topics/" + r.data.id + "/join", "POST", {}, c)).status,
    200,
  );
});
test("blocking prevents new messages and reservations", async () => {
  const p = (await req("/products", "GET", null, c)).data.products.find(
    (p) => p.seller.id === c.id && p.status === "available",
  );
  await req("/users/" + c.id + "/block", "POST", {}, b);
  assert.equal(
    (
      await req(
        "/products/" + p.id + "/messages",
        "POST",
        { text: "Không được gửi khi bị chặn" },
        b,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await req(
        "/exchanges",
        "POST",
        { productId: p.id, phone: "0900000000" },
        b,
      )
    ).status,
    403,
  );
  await req("/users/" + c.id + "/block", "DELETE", {}, b);
});
test("admin cannot be self-assigned; moderation and resolutions are audited", async () => {
  assert.equal((await req("/admin/overview", "GET", null, b)).status, 403);
  db.prepare("UPDATE account_state SET admin=1 WHERE user_id=?").run(a.id);
  const reportProduct = (
    await req("/products", "GET", null, c)
  ).data.products.find((p) => p.seller.id === c.id && p.status === "available");
  await req(
    "/products/" + reportProduct.id + "/report",
    "POST",
    { reason: "Kiểm tra thông tin mô tả sản phẩm." },
    b,
  );
  const overview = (await req("/admin/overview", "GET", null, a)).data;
  assert.ok(overview.reports.length > 0);
  await req(
    "/admin/moderate",
    "POST",
    { productId: reportProduct.id, hide: true, note: "Đang xác minh nội dung" },
    a,
  );
  assert.equal(
    (await req("/products")).data.products.some(
      (p) => p.id === reportProduct.id,
    ),
    false,
  );
  const report = overview.reports[0];
  await req(
    "/admin/reports",
    "PATCH",
    { id: report.id, status: "resolved", resolution: "Đã kiểm tra và xử lý" },
    a,
  );
  assert.equal(
    (await req("/admin/overview", "GET", null, a)).data.reports[0].status,
    "resolved",
  );
  await req(
    "/admin/moderate",
    "POST",
    { productId: reportProduct.id, hide: false, note: "Đã kiểm tra" },
    a,
  );
});
test("signed VNPAY IPN validates amount, fulfills once and ignores browser status", async () => {
  const order = await req(
    "/orders",
    "POST",
    { plan: "seller", amount: 1, status: "paid" },
    b,
  );
  assert.equal(order.status, 201);
  const o = order.data.order;
  const checkout = await req("/orders/" + o.id + "/checkout", "POST", {}, b);
  assert.ok(checkout.data.url.startsWith("https://sandbox.vnpayment.vn/"));
  const callback = async (extra = {}) => {
    const p = {
      vnp_TmnCode: "TESTCODE",
      vnp_TxnRef: o.id,
      vnp_Amount: String(o.amount * 100),
      vnp_ResponseCode: "00",
      vnp_TransactionStatus: "00",
      vnp_TransactionNo: "1234567890",
      ...extra,
    };
    const enc = (s) => encodeURIComponent(s).replace(/%20/g, "+"),
      qs = Object.keys(p)
        .sort()
        .map((k) => enc(k) + "=" + enc(p[k]))
        .join("&");
    return req(
      "/payments/vnpay/ipn?" +
        qs +
        "&vnp_SecureHash=" +
        createHmac("sha512", secret).update(qs).digest("hex"),
    );
  };
  assert.equal(
    (await req("/payments/vnpay/ipn?vnp_SecureHash=wrong")).data.RspCode,
    "97",
  );
  assert.equal((await callback({ vnp_Amount: "100" })).data.RspCode, "04");
  assert.equal((await callback()).data.RspCode, "00");
  assert.equal((await callback()).data.RspCode, "02");
  assert.equal((await req("/me", "GET", null, b)).data.user.quota, 20);
});
test("local simulation activates a labeled test entitlement and is never charged", async () => {
  const o = (await req("/orders", "POST", { plan: "both" }, c)).data.order;
  assert.equal(
    (await req("/orders/" + o.id + "/simulate", "POST", {}, c)).status,
    200,
  );
  assert.equal(
    (await req("/orders", "GET", null, c)).data.orders[0].status,
    "simulated",
  );
  assert.equal((await req("/me", "GET", null, c)).data.user.quota, 20);
});
test("password reset is one-use, changes password and revokes all sessions", async () => {
  const d = await req("/auth/forgot", "POST", { email: "buyer@uit.edu.vn" });
  resetToken = d.data.token;
  assert.ok(resetToken);
  assert.equal(
    (
      await req("/auth/reset", "POST", {
        token: resetToken,
        password: "NewPassword123!",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await req("/auth/reset", "POST", {
        token: resetToken,
        password: "AnotherPassword123!",
      })
    ).status,
    400,
  );
  assert.equal((await req("/me", "GET", null, b)).data.user, null);
  const login = await req("/login", "POST", {
    email: "buyer@uit.edu.vn",
    password: "NewPassword123!",
  });
  assert.equal(login.status, 200);
  b.cookie = login.cookie;
});
test("unread messages and read receipts reflect the other participant reading", async () => {
  const product = (await req("/products", "GET", null, c)).data.products.find(
    (p) => p.seller.id === c.id && p.status === "available",
  );
  const sent = await req(
    "/products/" + product.id + "/messages",
    "POST",
    { text: "Chào bạn, mình muốn hỏi thông tin món này." },
    b,
  );
  assert.equal(sent.status, 200);
  assert.equal(sent.data.messages[0].read, false);
  const inbox = (await req("/inbox", "GET", null, c)).data.threads.find(
    (t) => t.product_id === product.id && t.buyer === b.id,
  );
  assert.equal(inbox.unread, 1);
  await req(
    "/products/" + product.id + "/messages?buyer=" + b.id,
    "GET",
    null,
    c,
  );
  assert.equal(
    (await req("/products/" + product.id + "/messages", "GET", null, b)).data
      .messages[0].read,
    true,
  );
  assert.equal(
    (await req("/inbox", "GET", null, c)).data.threads.find(
      (t) => t.product_id === product.id && t.buyer === b.id,
    ).unread,
    0,
  );
});
test("separate buyer and seller entitlements coexist; stats use actual contact counts", async () => {
  const o = (await req("/orders", "POST", { plan: "buyer" }, b)).data.order;
  await req("/orders/" + o.id + "/simulate", "POST", {}, b);
  const me = (await req("/me", "GET", null, b)).data.user;
  assert.equal(me.quota, 20);
  assert.equal(me.savedSearchLimit, 30);
  const stats = (await req("/seller-stats", "GET", null, c)).data;
  assert.ok(stats.summary.inquiries >= 1);
  assert.ok(Array.isArray(stats.daily));
});
test("organizer can close and reopen enrollment; another member cannot", async () => {
  const r = await req(
    "/topics",
    "POST",
    {
      kind: "study",
      title: "Nhóm học thứ hai",
      text: "Học chung tại khu tự học thư viện.",
      capacity: 10,
      price: 0,
    },
    a,
  );
  assert.equal(
    (await req("/topics/" + r.data.id + "/close", "POST", {}, b)).status,
    403,
  );
  await req("/topics/" + r.data.id + "/close", "POST", {}, a);
  assert.equal(
    (await req("/topics/" + r.data.id + "/join", "POST", {}, b)).status,
    409,
  );
  await req("/topics/" + r.data.id + "/reopen", "POST", {}, a);
  assert.equal(
    (await req("/topics/" + r.data.id + "/join", "POST", {}, b)).status,
    200,
  );
});

test("public prices and taxonomy are consistent; incompatible child categories are rejected",async()=>{
 const plans=(await req('/plans')).data.plans;assert.deepEqual(plans.map(p=>[p.id,p.price]),[['buyer',50000],['seller',50000],['both',75000]]);
 assert.equal((await req('/catalog')).data.categories.electronics.children.calculators,'Máy tính cầm tay');
 assert.equal((await req('/openapi.json')).data.openapi,'3.1.0');
 assert.equal((await req('/products','POST',listing({subcategory:'laptops'}),c)).status,400);
 const p=await post(c,{title:'Máy tính Casio FX-580VN',category:'electronics',subcategory:'calculators'});assert.equal(p.subcategory,'calculators');assert.equal(p.conditionGroup,'like_new');
});
test("buyer rights increase actual quotas without seller rights; renewal queues the next period",async()=>{
 const u=await signup('premiumbuyer');let r=(await req('/me','GET',null,u)).data.user;assert.equal(r.limits.priceAlerts,3);
 const o=(await req('/orders','POST',{plan:'buyer',amount:1},u)).data.order;assert.equal(o.amount,50000);await req('/orders/'+o.id+'/simulate','POST',{},u);
 r=(await req('/membership','GET',null,u)).data;assert.equal(r.buyerPremium,true);assert.equal(r.sellerPremium,false);assert.equal(r.limits.posts,3);assert.equal(r.limits.priceAlerts,30);assert.equal(r.limits.holds,5);
 const next=(await req('/orders','POST',{plan:'buyer'},u)).data.order;await req('/orders/'+next.id+'/simulate','POST',{},u);
 r=(await req('/membership','GET',null,u)).data;assert.equal(r.subscriptions.length,2);const sorted=[...r.subscriptions].sort((a,b)=>a.starts-b.starts);assert.equal(sorted[1].starts,sorted[0].expires);assert.equal(r.pushCredits,0);
});
test("price targets notify once, stay private, rearm after editing and enforce free capacity",async()=>{
 const seller=await signup('alertseller'),buyer=await signup('alertbuyer');const o=(await req('/orders','POST',{plan:'seller'},seller)).data.order;await req('/orders/'+o.id+'/simulate','POST',{},seller);
 const products=[];for(let i=0;i<4;i++)products.push(await post(seller,{title:'Sách theo dõi giảm giá '+i}));
 for(const p of products.slice(0,3))assert.equal((await req('/products/'+p.id+'/price-alert','POST',{targetPrice:30000},buyer)).status,200);
 assert.equal((await req('/products/'+products[3].id+'/price-alert','POST',{targetPrice:30000},buyer)).status,409);
 assert.equal((await req('/products/'+products[0].id+'/price-alert','POST',{targetPrice:40000},buyer)).status,400);
 assert.equal((await req('/products/'+products[0].id+'/price-alert','POST',{targetPrice:30000},seller)).status,400);
 const p=products[0];await req('/products/'+p.id,'PATCH',{price:30000},seller);await req('/products/'+p.id,'PATCH',{price:25000},seller);
 assert.equal(db.prepare("SELECT COUNT(*) AS n FROM notifications WHERE user_id=? AND kind='price' AND target=?").get(buyer.id,p.id).n,1);
 assert.equal((await req('/price-alerts','GET',null,c)).data.alerts.length,0);
 assert.ok((await req('/price-alerts','GET',null,buyer)).data.alerts[0]);
 await req('/products/'+p.id+'/price-alert','POST',{targetPrice:20000},buyer);await req('/products/'+p.id,'PATCH',{price:20000},seller);
 assert.equal(db.prepare("SELECT COUNT(*) AS n FROM notifications WHERE user_id=? AND kind='price' AND target=?").get(buyer.id,p.id).n,2);
 await req('/products/'+p.id+'/price-alert','DELETE',null,buyer);assert.equal((await req('/products/'+products[3].id+'/price-alert','POST',{targetPrice:30000},buyer)).status,200);
});
test("seller boost credits are limited, ownership checked and renewal credits wait for next period",async()=>{
 const u=await signup('boostseller');const o=(await req('/orders','POST',{plan:'seller'},u)).data.order;await req('/orders/'+o.id+'/simulate','POST',{},u);const p=await post(u);
 assert.equal((await req('/membership','GET',null,u)).data.limits.savedSearches,5);
 assert.equal((await req('/products/'+p.id+'/use-boost','POST',{},c)).status,403);
 for(let i=0;i<3;i++)assert.equal((await req('/products/'+p.id+'/use-boost','POST',{},u)).data.credits,2-i);
 assert.equal((await req('/products/'+p.id+'/use-boost','POST',{},u)).status,409);
 const next=(await req('/orders','POST',{plan:'seller'},u)).data.order;await req('/orders/'+next.id+'/simulate','POST',{},u);assert.equal((await req('/membership','GET',null,u)).data.pushCredits,0);
 assert.equal((await req('/orders/'+o.id+'/simulate','POST',{},u)).status,409);
});
test("expired checkout retries use a fresh reference and late failure cannot overwrite newer attempt",async()=>{
 const u=await signup('retrybuyer'),o=(await req('/orders','POST',{plan:'buyer'},u)).data.order;
 const first=(await req('/orders/'+o.id+'/checkout','POST',{},u)).data;assert.ok(first.url);assert.equal((await req('/orders/'+o.id+'/checkout','POST',{},u)).data.url,first.url);
 db.prepare('UPDATE checkout_attempts SET expires=0 WHERE order_id=?').run(o.id);
 const second=(await req('/orders/'+o.id+'/checkout','POST',{},u)).data;const ref1=new URL(first.url).searchParams.get('vnp_TxnRef'),ref2=new URL(second.url).searchParams.get('vnp_TxnRef');assert.notEqual(ref1,ref2);
 const callback=async(ref,success)=>{const p={vnp_TmnCode:'TESTCODE',vnp_TxnRef:ref,vnp_Amount:'5000000',vnp_ResponseCode:success?'00':'24',vnp_TransactionStatus:success?'00':'02',vnp_TransactionNo:'retry-test'};const encoded=Object.keys(p).sort().map(k=>encodeURIComponent(k)+'='+encodeURIComponent(p[k])).join('&');p.vnp_SecureHash=createHmac('sha512',secret).update(encoded).digest('hex');return req('/payments/vnpay/ipn?'+new URLSearchParams(p));};
 assert.equal((await callback(ref1,false)).data.RspCode,'00');assert.equal(db.prepare('SELECT status FROM orders WHERE id=?').get(o.id).status,'processing');
 assert.equal((await callback(ref2,true)).data.RspCode,'00');assert.equal((await callback(ref1,true)).data.RspCode,'02');assert.equal(db.prepare('SELECT COUNT(*) AS n FROM subscriptions WHERE order_id=?').get(o.id).n,1);
});


test('wanted owner edits and reopens with capacity enforcement; dates and ownership are validated',async()=>{
 const u=await signup('hubowner');const form={title:'Cần bộ sách để học',description:'Mình tìm sách còn đủ trang để dùng học kỳ tới.',category:'books',cluster:'q5',budget:60000};
 const create=async(extra={})=>req('/buy-requests','POST',{...form,...extra},u);
 assert.equal((await create({neededBy:'2026-02-31'})).status,400);assert.equal((await create({neededBy:'2000-01-01'})).status,400);
 const one=(await create()).data.id;
 assert.equal((await req('/buy-requests/'+one,'PATCH',{budget:45000},c)).status,403);
 assert.equal((await req('/buy-requests/'+one,'PATCH',{budget:45000},u)).status,200);
 assert.equal((await req('/buy-requests','GET',null,u)).data.requests.find(i=>i.id===one).data.budget,45000);
 await req('/buy-requests/'+one,'DELETE',{},u);await create();await create();await create();
 assert.equal((await req('/buy-requests/'+one,'PATCH',{status:'open'},u)).status,409);
 const current=(await req('/buy-requests','GET',null,u)).data.requests.find(i=>i.user_id===u.id&&i.status==='open');await req('/buy-requests/'+current.id,'DELETE',{},u);
 assert.equal((await req('/buy-requests/'+one,'PATCH',{status:'open'},u)).status,200);
});
test('same listing suggestion updates text without duplicate suggestions or notifications',async()=>{
 const asker=await signup('hubasker'),seller=await signup('hubsuggest');const product=await post(seller);
 const r=await req('/buy-requests','POST',{title:'Cần giáo trình học lập trình',description:'Cần sách còn dùng được cho học kỳ mới.',category:'books',cluster:'q5',budget:50000},asker),id=r.data.id;
 assert.equal((await req('/buy-requests/'+id+'/respond','POST',{productId:product.id,text:'Mình có sách này'},seller)).status,200);
 await req('/buy-requests/'+id+'/respond','POST',{productId:product.id,text:'Mình cập nhật lời nhắn'},seller);
 const found=(await req('/buy-requests','GET',null,asker)).data.requests.find(i=>i.id===id);assert.equal(found.responses.length,1);assert.equal(found.responses[0].text,'Mình cập nhật lời nhắn');
 assert.equal(db.prepare("SELECT COUNT(*) AS n FROM notifications WHERE user_id=? AND kind='request' AND target=?").get(asker.id,id).n,1);
});
test('past community activity rejects new members but participants can still leave',async()=>{
 const organizer=await signup('hubeventhost'),member=await signup('hubeventmember');const r=await req('/topics','POST',{kind:'study',title:'Buổi học nhóm có lịch',text:'Cùng học ở thư viện trường và thảo luận.',schedule:new Date(Date.now()+86400000).toISOString(),capacity:5},organizer),id=r.data.id;
 assert.equal((await req('/topics/'+id+'/join','POST',{},member)).status,200);
 db.prepare('UPDATE topics SET schedule=? WHERE id=?').run('2000-01-01T00:00:00.000Z',id);
 assert.equal((await req('/topics/'+id+'/join','POST',{},c)).status,409);
 assert.equal((await req('/topics/'+id+'/leave','POST',{},member)).status,200);
});


test('DHV email is recognized independently from selected school; school mismatch is rejected',async()=>{
 const body={name:'Sinh viên DHV kiểm thử',email:'qa.student@dhv.edu.vn',password:'DhvTestPassword123!',school:'UIT',purpose:'both',consent:true};
 const r=await req('/register','POST',body);assert.equal(r.status,200,JSON.stringify(r.data));assert.equal(r.data.user.universityCode,'DHV');assert.equal(r.data.user.universityName,'Đại học Hùng Vương TP.HCM');
 assert.equal((await req('/register','POST',{...body,email:'wrong.dhv@uit.edu.vn',school:'DHV'})).status,400);
 const login=await req('/login','POST',{email:'QA.STUDENT@DHV.EDU.VN',password:body.password,remember:false});assert.equal(login.status,200);assert.equal(db.prepare('SELECT expires FROM sessions WHERE token=?').get(login.cookie.split('=')[1]).expires<Date.now()+13*3600000,true);
 assert.equal((await req('/login','POST',{email:body.email,password:'short'})).status,401);
 assert.equal((await req('/register','POST',{...body,email:'short.password@dhv.edu.vn',password:'short'})).status,400);
});


test('demo seeding is idempotent, leaves real records untouched and labels all new content',async()=>{
 const realBefore=db.prepare("SELECT id,data,owner FROM products WHERE owner IS NOT NULL LIMIT 1").get();const first=initDemo(db),count=db.prepare('SELECT COUNT(*) AS n FROM products').get().n;initDemo(db);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM products').get().n,count);assert.ok(first.products>=150);assert.equal(db.prepare('SELECT data FROM products WHERE id=?').get(realBefore.id).data,realBefore.data);
 const product=JSON.parse(db.prepare("SELECT data FROM products WHERE id LIKE 'demo-v3-%' LIMIT 1").get().data);assert.equal(product.isDemo,true);assert.equal(product.seller.isVerified,false);assert.equal(db.prepare('SELECT owner FROM products WHERE id=?').get(product.id).owner,null);
 const r=await fetch(base.replace('/api','')+product.images[0]);assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/svg/);
 assert.equal((await req('/topics/demo-topic-0/replies')).status,200);
 assert.equal((await req('/topics/demo-topic-0/replies','POST',{text:'No real reply to demo'},c)).status,409);
 assert.equal((await req('/topics/demo-topic-0/join','POST',{},c)).status,409);
 assert.equal((await req('/buy-requests/demo-need-0/respond','POST',{productId:realBefore.id},c)).status,409);
});
test('community bookmarks persist per user and can be removed independently of membership',async()=>{
 assert.equal((await req('/topics/demo-topic-0/save','POST',{},c)).status,200);
 assert.equal((await req('/topics','GET',null,c)).data.topics.find(t=>t.id==='demo-topic-0').saved,true);
 assert.equal((await req('/topics','GET',null,a)).data.topics.find(t=>t.id==='demo-topic-0').saved,false);
 assert.equal((await req('/topics/demo-topic-0/save','DELETE',{},c)).status,200);
 assert.equal((await req('/topics','GET',null,c)).data.topics.find(t=>t.id==='demo-topic-0').saved,false);
});

test("production disables preview verification and simulated entitlements", async () => {
  await stop();
  await start(true);
  assert.equal((await req("/config")).data.localMode, false);
  assert.equal((await req("/me", "GET", null, c)).data.user.isVerified, false);
  assert.equal((await req("/me", "GET", null, c)).data.user.quota, 3);
  assert.equal(
    (
      await req(
        "/auth/verify",
        "POST",
        { token: unverified.data.delivery.token },
        unverified,
      )
    ).status,
    400,
  );
  assert.equal(
    (await req("/auth/forgot", "POST", { email: "seller@uit.edu.vn" })).status,
    503,
  );
});
