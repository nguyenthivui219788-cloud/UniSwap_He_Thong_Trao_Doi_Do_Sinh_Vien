import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, unlinkSync } from "node:fs";
import path from "node:path";
const port = 31000 + Math.floor(Math.random() * 10000),
  base = `http://127.0.0.1:${port}/api`;
const folder = path.resolve(".cache");
mkdirSync(folder, { recursive: true });
const database = path.join(folder, `test-${randomUUID()}.sqlite`);
let child, alice, bob, charlie, product, exchange, code;
async function request(route, method = "GET", body, cookie) {
  const r = await fetch(base + route, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return {
    status: r.status,
    data: await r.json(),
    cookie: r.headers.get("set-cookie")?.split(";")[0],
  };
}
before(async () => {
  child = spawn(process.execPath, ["server/server.mjs"], {
    env: { ...process.env, PORT: String(port), SWAP_DB: database },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let err = "";
  child.stderr.on("data", (d) => (err += d));
  for (let i = 0; i < 80; i++) {
    try {
      const h = await request("/health");
      if (h.status === 200) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw Error("Server failed: " + err);
});
after(async () => {
  if (child && !child.killed) {
    child.kill();
    await new Promise((resolve) => child.once("exit", resolve));
  }
  for (const suffix of ["", "-wal", "-shm"])
    try {
      unlinkSync(database + suffix);
    } catch {}
});
test("guest reads catalog but cannot write or bypass origin checks", async () => {
  const p = await request("/products");
  assert.equal(p.status, 200);
  assert.ok(p.data.products.length > 0);
  assert.ok(p.data.products.every((p) => p.isDemo && !p.seller.isVerified));
  assert.equal((await request("/products", "POST", {})).status, 401);
  const bad = await fetch(base + "/register", {
    method: "POST",
    headers: {
      Origin: "https://untrusted.example",
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  assert.equal(bad.status, 403);
});
test("registration checks school email and consent; password is never returned; sessions authenticate", async () => {
  assert.equal(
    (
      await request("/register", "POST", {
        email: "a@gmail.com",
        password: "Password123",
        name: "Test",
        school: "UIT",
        purpose: "both",
        consent: true,
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await request("/register", "POST", {
        email: "a@uit.edu.vn",
        password: "Password123",
        name: "Test",
        school: "UIT",
        purpose: "both",
      })
    ).status,
    400,
  );
  for (const name of ["alice", "bob", "charlie"]) {
    const r = await request("/register", "POST", {
      email: name + "@uit.edu.vn",
      password: "Password123",
      name,
      school: "UIT",
      purpose: "both",
      consent: true,
    });
    assert.equal(r.status, 200);
    assert.equal(r.data.user.isVerified, false);
    assert.equal(r.data.user.password, undefined);
    const verification=await request("/auth/verify","POST",{token:r.data.delivery.token},r.cookie);assert.equal(verification.status,200);
    if (name === "alice") alice = r;
    else if (name === "bob") bob = r;
    else charlie = r;
  }
  const bad = await request("/login", "POST", {
    email: "alice@uit.edu.vn",
    password: "incorrect",
  });
  assert.equal(bad.status, 401);
  assert.equal(
    (await request("/me", "GET", null, alice.cookie)).data.user.id,
    alice.data.user.id,
  );
  assert.equal(
    (
      await request("/register", "POST", {
        email: "alice@uit.edu.vn",
        password: "Password123",
        name: "Duplicate",
        school: "UIT",
        purpose: "both",
        consent: true,
      })
    ).status,
    409,
  );
});
test("post validation, persistence and owner-only edits", async () => {
  const body = {
    title: "Giáo trình kiểm thử",
    description: "Sách còn tốt và đầy đủ các trang.",
    tradeType: "sale",
    category: "books",
    price: 40000,
    condition: "Như mới",
    cluster: "q5",
    meetingSpot: "Thư viện trường UIT",
    images: ["/assets/prod-books.png"],
    location: { lat: 10.8, lng: 106.7 },
  };
  assert.equal(
    (await request("/products", "POST", { ...body, price: -1 }, alice.cookie))
      .status,
    400,
  );
  assert.equal(
    (
      await request(
        "/products",
        "POST",
        { ...body, images: ["javascript:alert(1)"] },
        alice.cookie,
      )
    ).status,
    400,
  );
  const created = await request("/products", "POST", body, alice.cookie);
  assert.equal(created.status, 201);
  product = created.data.product;
  assert.equal(product.seller.id, alice.data.user.id);
  assert.equal(
    (
      await request(
        "/products/" + product.id,
        "PATCH",
        { status: "completed" },
        bob.cookie,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await request(
        "/products/" + product.id,
        "PATCH",
        { status: "invalid" },
        alice.cookie,
      )
    ).status,
    400,
  );
  const updated = await request(
    "/products/" + product.id,
    "PATCH",
    { ...body, price: 45000 },
    alice.cookie,
  );
  assert.equal(updated.data.product.price, 45000);
  assert.ok(
    (await request("/products")).data.products.some(
      (p) => p.id === product.id && p.price === 45000,
    ),
  );
});
test("favorites, searches, messages and reports save only for authorized users", async () => {
  assert.equal(
    (
      await request(
        "/products/" + product.id + "/favorite",
        "POST",
        {},
        bob.cookie,
      )
    ).status,
    200,
  );
  assert.deepEqual(
    (await request("/favorites", "GET", null, bob.cookie)).data.ids,
    [product.id],
  );
  assert.equal(
    (await request("/favorites", "GET", null, alice.cookie)).data.ids.length,
    0,
  );
  await request(
    "/products/" + product.id + "/favorite",
    "DELETE",
    {},
    bob.cookie,
  );
  assert.equal(
    (await request("/favorites", "GET", null, bob.cookie)).data.ids.length,
    0,
  );
  assert.equal(
    (
      await request(
        "/products/" + product.id + "/messages",
        "POST",
        { text: "Món đồ còn không?" },
        bob.cookie,
      )
    ).status,
    200,
  );
  const thread = (await request("/inbox", "GET", null, alice.cookie)).data
    .threads[0];
  assert.equal(thread.buyer, bob.data.user.id);
  assert.equal(
    (
      await request(
        "/products/" + product.id + "/messages?buyer=" + bob.data.user.id,
        "POST",
        { text: "Còn bạn nhé" },
        alice.cookie,
      )
    ).data.messages.length,
    2,
  );
  assert.equal(
    (
      await request(
        "/products/" + product.id + "/messages?buyer=" + bob.data.user.id,
        "GET",
        null,
        charlie.cookie,
      )
    ).data.messages.length,
    0,
  );
  assert.equal(
    (
      await request(
        "/products/" + product.id + "/report",
        "POST",
        { reason: "Bài đăng cần kiểm tra lại thông tin." },
        bob.cookie,
      )
    ).status,
    201,
  );
  await request(
    "/searches",
    "POST",
    { name: "Sách UIT", filters: { category: "books", school: "UIT" } },
    bob.cookie,
  );
  const search = (await request("/searches", "GET", null, bob.cookie)).data
    .searches[0];
  assert.equal(search.name, "Sách UIT");
  await request("/searches/" + search.id, "DELETE", {}, alice.cookie);
  assert.equal(
    (await request("/searches", "GET", null, bob.cookie)).data.searches.length,
    1,
  );
});
test("reservation is exclusive, requires phone and preserves snapshot", async () => {
  assert.equal(
    (await request("/exchanges", "POST", { productId: product.id }, bob.cookie))
      .status,
    400,
  );
  const results = await Promise.all([
    request(
      "/exchanges",
      "POST",
      { productId: product.id, phone: "0900000000" },
      bob.cookie,
    ),
    request(
      "/exchanges",
      "POST",
      { productId: product.id, phone: "0900000000" },
      charlie.cookie,
    ),
  ]);
  assert.deepEqual(results.map((r) => r.status).sort(), [201, 409]);
  exchange =
    results[0].status === 201 ? results[0].data.id : results[1].data.id;
  if (results[1].status === 201) [bob, charlie] = [charlie, bob];
  const transactions = await request("/exchanges", "GET", null, bob.cookie);
  assert.equal(transactions.data.exchanges[0].locker, 1);
  assert.equal(transactions.data.exchanges[0].product.price, 45000);
  assert.equal(transactions.data.exchanges[0].code_hash, undefined);
  assert.equal(
    (await request("/exchanges", "GET", null, charlie.cookie)).data.exchanges
      .length,
    0,
  );
  assert.equal(
    (await request("/products/" + product.id, "DELETE", {}, alice.cookie))
      .status,
    409,
  );
});
test("handover is seller-issued, buyer-confirmed, throttled and single-use", async () => {
  assert.equal(
    (await request("/exchanges/" + exchange + "/code", "POST", {}, bob.cookie))
      .status,
    403,
  );
  assert.equal(
    (
      await request(
        "/exchanges/" + exchange + "/complete",
        "POST",
        { code: "123456" },
        charlie.cookie,
      )
    ).status,
    403,
  );
  const issued = await request(
    "/exchanges/" + exchange + "/code",
    "POST",
    {},
    alice.cookie,
  );
  code = issued.data.code;
  assert.match(code, /^[0-9]{6}$/);
  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await request(
          "/exchanges/" + exchange + "/complete",
          "POST",
          { code: "000000" },
          bob.cookie,
        )
      ).status,
      400,
    );
  assert.equal(
    (
      await request(
        "/exchanges/" + exchange + "/complete",
        "POST",
        { code },
        bob.cookie,
      )
    ).status,
    429,
  );
  code = (
    await request("/exchanges/" + exchange + "/code", "POST", {}, alice.cookie)
  ).data.code;
  assert.equal(
    (
      await request(
        "/exchanges/" + exchange + "/complete",
        "POST",
        { code },
        bob.cookie,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        "/exchanges/" + exchange + "/complete",
        "POST",
        { code },
        bob.cookie,
      )
    ).status,
    409,
  );
  const record = (await request("/exchanges", "GET", null, bob.cookie)).data
    .exchanges[0];
  assert.equal(record.status, "completed");
  assert.ok(record.completed);
  assert.equal(
    (await request("/products")).data.products.find((p) => p.id === product.id)
      .status,
    "completed",
  );
});
test("orders never activate paid service or accept forged price", async () => {
  const order = await request(
    "/orders",
    "POST",
    { plan: "both", amount: 1, status: "paid" },
    bob.cookie,
  );
  assert.equal(order.status, 201);
  assert.equal(order.data.order.amount, 75000);
  assert.equal(order.data.order.status, "pending_configuration");
  assert.equal(
    (await request("/me", "GET", null, bob.cookie)).data.user.tier,
    "free",
  );
  assert.equal(
    (
      await request(
        "/orders",
        "POST",
        { plan: "push1d", productId: product.id },
        bob.cookie,
      )
    ).status,
    403,
  );
});
test("community topics, hourly tutoring and replies persist; ownership is enforced", async () => {
  const r = await request(
    "/topics",
    "POST",
    {
      kind: "tutoring",
      title: "Nhóm học lập trình",
      text: "Cùng học lập trình tại thư viện chiều thứ bảy.",
      price: 50000,
    },
    alice.cookie,
  );
  assert.equal(r.status, 201);
  assert.equal(
    (
      await request(
        "/topics/" + r.data.id + "/replies",
        "POST",
        { text: "Mình muốn tham gia" },
        bob.cookie,
      )
    ).data.replies.length,
    1,
  );
  assert.equal(
    (await request("/topics/" + r.data.id, "DELETE", {}, bob.cookie)).status,
    403,
  );
  assert.equal((await request("/topics")).data.topics[0].price, 50000);
});
test("free quota is enforced; cancelling releases the item and invalidates locker code", async () => {
  const body = {
    title: "Sách dùng thử kiểm tra hạn mức",
    description: "Sách minh họa cho bài kiểm thử chức năng.",
    tradeType: "sale",
    category: "books",
    price: 50000,
    condition: "Như mới",
    cluster: "q5",
    meetingSpot: "Sảnh thư viện trường",
    images: ["/assets/prod-books.png"],
  };
  const owned = [];
  for (let i = 0; i < 3; i++) {
    const r = await request("/products", "POST", body, alice.cookie);
    assert.equal(r.status, 201);
    owned.push(r.data.product.id);
  }
  assert.equal(
    (await request("/products", "POST", body, alice.cookie)).status,
    409,
  );
  const r = await request(
    "/exchanges",
    "POST",
    { productId: owned[0], phone: "0900000000" },
    bob.cookie,
  );
  assert.equal(r.status, 201);
  const issued = await request(
    "/exchanges/" + r.data.id + "/code",
    "POST",
    {},
    alice.cookie,
  );
  assert.equal(
    (
      await request(
        "/exchanges/" + r.data.id + "/cancel",
        "POST",
        {},
        bob.cookie,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        "/exchanges/" + r.data.id + "/complete",
        "POST",
        { code: issued.data.code },
        bob.cookie,
      )
    ).status,
    409,
  );
  assert.equal(
    (await request("/products")).data.products.find((p) => p.id === owned[0])
      .status,
    "available",
  );
});
test("database and sessions survive server restart", async () => {
  child.kill();
  await new Promise((resolve) => child.once("exit", resolve));
  child = spawn(process.execPath, ["server/server.mjs"], {
    env: { ...process.env, PORT: String(port), SWAP_DB: database },
    stdio: ["ignore", "pipe", "pipe"],
  });
  for (let i = 0; i < 80; i++) {
    try {
      if ((await request("/health")).status === 200) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(
    (await request("/me", "GET", null, bob.cookie)).data.user.id,
    bob.data.user.id,
  );
  assert.ok(
    (await request("/exchanges", "GET", null, bob.cookie)).data.exchanges.some(
      (e) => e.id === exchange && e.status === "completed",
    ),
  );
  assert.equal(
    (await request("/orders", "GET", null, bob.cookie)).data.orders[0].amount,
    75000,
  );
});
test("logout revokes current session", async () => {
  assert.equal(
    (await request("/logout", "POST", {}, alice.cookie)).status,
    200,
  );
  assert.equal(
    (await request("/me", "GET", null, alice.cookie)).data.user,
    null,
  );
});
