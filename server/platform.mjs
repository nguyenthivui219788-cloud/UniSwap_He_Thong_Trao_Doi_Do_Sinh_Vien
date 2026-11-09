import {initPremium,createPremium,membershipRights} from "./premium.mjs";
import {PLANS,BOOST_PLANS,CATEGORY_TREE,validSubcategory,classifyTitle,conditionGroup} from "../shared/catalog.ts";
import {
  randomUUID,
  randomBytes,
  randomInt,
  createHash,
  createHmac,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

export function createPlatform({ db, clean, fail, parse, productData }) {
  const now = () => new Date().toISOString(),
    hash = (s) => createHash("sha256").update(s).digest("hex");
  const localMode =
    process.env.NODE_ENV !== "production" &&
    process.env.SWAP_MODE !== "production";
  const localRequest = (req) =>
    localMode &&
    ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(
      req.socket.remoteAddress,
    ) &&
    /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host || "");
  function migrate(table, col, type) {
    if (
      !db
        .prepare(`PRAGMA table_info(${table})`)
        .all()
        .some((r) => r.name === col)
    )
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`);
  }
  db.exec(`CREATE TABLE IF NOT EXISTS message_reads(user_id TEXT REFERENCES users(id),product_id TEXT REFERENCES products(id),buyer TEXT REFERENCES users(id),last_seq INTEGER,PRIMARY KEY(user_id,product_id,buyer));
 CREATE TABLE IF NOT EXISTS account_state(user_id TEXT PRIMARY KEY REFERENCES users(id),verified INTEGER DEFAULT 0,avatar TEXT DEFAULT '',bio TEXT DEFAULT '',faculty TEXT DEFAULT '',year TEXT DEFAULT '',admin INTEGER DEFAULT 0,suspended INTEGER DEFAULT 0);
 CREATE TABLE IF NOT EXISTS auth_tokens(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),kind TEXT,hash TEXT,expires INTEGER,used INTEGER DEFAULT 0);
 CREATE TABLE IF NOT EXISTS subscriptions(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),plan TEXT,expires INTEGER,order_id TEXT UNIQUE);
 CREATE TABLE IF NOT EXISTS notifications(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),kind TEXT,text TEXT,target TEXT,created TEXT,read INTEGER DEFAULT 0);
 CREATE TABLE IF NOT EXISTS follows(follower TEXT REFERENCES users(id),seller TEXT REFERENCES users(id),PRIMARY KEY(follower,seller));
 CREATE TABLE IF NOT EXISTS blocks(blocker TEXT REFERENCES users(id),blocked TEXT REFERENCES users(id),PRIMARY KEY(blocker,blocked));
 CREATE TABLE IF NOT EXISTS buy_requests(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),data TEXT,created TEXT,status TEXT);
 CREATE TABLE IF NOT EXISTS buy_responses(id TEXT PRIMARY KEY,request_id TEXT REFERENCES buy_requests(id),user_id TEXT REFERENCES users(id),product_id TEXT REFERENCES products(id),text TEXT,created TEXT);
 CREATE TABLE IF NOT EXISTS offers(id TEXT PRIMARY KEY,product_id TEXT REFERENCES products(id),buyer TEXT REFERENCES users(id),seller TEXT REFERENCES users(id),offered_product TEXT,amount INTEGER,cash INTEGER,status TEXT,created TEXT,expires INTEGER);
 CREATE TABLE IF NOT EXISTS reviews(id TEXT PRIMARY KEY,exchange_id TEXT REFERENCES exchanges(id),reviewer TEXT REFERENCES users(id),reviewee TEXT REFERENCES users(id),rating INTEGER,text TEXT,created TEXT,UNIQUE(exchange_id,reviewer));
 CREATE TABLE IF NOT EXISTS views(product_id TEXT REFERENCES products(id),viewer TEXT,day TEXT,PRIMARY KEY(product_id,viewer,day));
 CREATE TABLE IF NOT EXISTS audit(id TEXT PRIMARY KEY,actor TEXT,action TEXT,target TEXT,note TEXT,created TEXT);
 CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,provider TEXT,reference TEXT UNIQUE,created TEXT);
 CREATE TABLE IF NOT EXISTS topic_members(topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,user_id TEXT REFERENCES users(id),status TEXT,created TEXT,PRIMARY KEY(topic_id,user_id));`);
  for (const [col, type] of [
    ["expires", "INTEGER"],
    ["code_expires", "INTEGER"],
    ["appointment", "TEXT"],
    ["place", "TEXT"],
    ["due", "TEXT"],
    ["return_requested", "INTEGER DEFAULT 0"],
    ["extension", "TEXT"],
    ["extension_status", "TEXT"],
    ["offered_product", "TEXT"],
    ["offer_snapshot", "TEXT"],
    ["agreed_price", "INTEGER"],
    ["reminded", "INTEGER DEFAULT 0"],
    ["cash", "INTEGER DEFAULT 0"],
    ["appointment_change", "TEXT"],
  ])
    migrate("exchanges", col, type);
  migrate("auth_tokens", "delivery_mode", "TEXT DEFAULT 'smtp'");
  migrate("reports", "status", "TEXT DEFAULT 'open'");
  migrate("reports", "resolution", "TEXT DEFAULT ''");
  migrate("topics", "schedule", "TEXT DEFAULT ''");
  migrate("topics", "capacity", "INTEGER DEFAULT 10");
  migrate("topics", "enrollment", "TEXT DEFAULT 'open'");
  migrate("topics", "is_demo", "INTEGER DEFAULT 0");
  migrate("buy_requests", "is_demo", "INTEGER DEFAULT 0");
  for (const e of db
    .prepare(
      "SELECT id,created FROM exchanges WHERE status='reserved' AND expires IS NULL",
    )
    .all())
    db.prepare("UPDATE exchanges SET expires=? WHERE id=?").run(
      (Date.parse(e.created) || Date.now()) + 24 * 3600000,
      e.id,
    );
  db.exec('CREATE TABLE IF NOT EXISTS topic_saves(user_id TEXT REFERENCES users(id),topic_id TEXT REFERENCES topics(id) ON DELETE CASCADE,PRIMARY KEY(user_id,topic_id))');
  initPremium(db);
  const todayVN=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Ho_Chi_Minh'}).format(new Date());
  function requestData(body){
    if(clean(body.title,120).length<5||clean(body.description,2000).length<10||!Number.isSafeInteger(body.budget)||body.budget<0||body.budget>100000000)fail(400,'Nhập tiêu đề, mô tả và ngân sách hợp lệ.');
    if(!Object.hasOwn(CATEGORY_TREE,body.category)||!['lang-dh','q5','q10','nam-sai-gon','binh-thanh'].includes(body.cluster))fail(400,'Chọn danh mục và khu vực hợp lệ.');
    const date=clean(body.neededBy,40);
    if(date&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date<todayVN()))fail(400,'Ngày cần trước phải là ngày hợp lệ từ hôm nay trở đi.');
    return {
      title:clean(body.title,120),
      description:clean(body.description,2000),
      budget:body.budget,
      category:body.category,
      cluster:body.cluster,
      neededBy:date,
      postType: body.postType === 'sell' ? 'sell' : 'buy',
      contactPhone: clean(body.contactPhone, 20),
      contactZalo: clean(body.contactZalo, 50),
      isPro: !!body.isPro,
    };
  }
  const cleanSpecs = (input) =>
    Object.fromEntries(
      Object.entries(input && typeof input === "object" ? input : {})
        .slice(0, 12)
        .filter(([, v]) => typeof v === "string")
        .map(([k, v]) => [clean(k, 40), clean(v, 250)]),
    );
  const put = (p, owner) =>
    db
      .prepare(
        "INSERT INTO products(id,owner,data) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data",
      )
      .run(p.id, owner, JSON.stringify(p));
  const row = (id) => db.prepare("SELECT * FROM products WHERE id=?").get(id);
  const transaction = (fn) => {
    db.exec("BEGIN IMMEDIATE");
    try {
      const value = fn();
      db.exec("COMMIT");
      return value;
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  };
  const audit = (actor, action, target, note = "") =>
    db
      .prepare("INSERT INTO audit VALUES(?,?,?,?,?,?)")
      .run(randomUUID(), actor, action, target, clean(note, 1000), now());
  const notify = (user, kind, text, target = "") => {
    if (user)
      db.prepare("INSERT INTO notifications VALUES(?,?,?,?,?,?,0)").run(
        randomUUID(),
        user,
        kind,
        clean(text, 500),
        target,
        now(),
      );
  };
  const blocked = (a, b) =>
    !!db
      .prepare(
        "SELECT 1 FROM blocks WHERE (blocker=? AND blocked=?) OR (blocker=? AND blocked=?)",
      )
      .get(a, b, b, a);
  function userInfo(u) {
    const a=db.prepare('SELECT * FROM account_state WHERE user_id=?').get(u.id)||{},r=membershipRights(db,u.id,localMode),stats=db.prepare('SELECT AVG(rating) AS rating,COUNT(*) AS n FROM reviews WHERE reviewee=?').get(u.id);
    return {isVerified:a.verified===1||(localMode&&a.verified===2),verificationMode:a.verified===2?'local':'email',avatar:a.avatar||'',bio:a.bio||'',faculty:a.faculty||'',year:a.year||'',role:a.admin?'admin':'student',suspended:!!a.suspended,tier:r.sellerPremium?'hunter_pro':'free',subscription:r.subscription,buyerPremium:r.buyerPremium,sellerPremium:r.sellerPremium,buyerUntil:r.buyerUntil,sellerUntil:r.sellerUntil,limits:r.limits,pushCredits:r.pushCredits,quota:r.limits.posts,imageLimit:r.limits.images,savedSearchLimit:r.limits.savedSearches,rating:stats.rating||0,reviewCount:stats.n,dealCount:db.prepare("SELECT COUNT(*) AS n FROM exchanges WHERE (buyer=? OR seller=?) AND status IN ('completed','returned')").get(u.id,u.id).n};
  }
  function verified(u) {
    if (!u) fail(401, "Đăng nhập để tiếp tục.");
    const a = userInfo(u);
    if (a.suspended)
      fail(403, "Tài khoản đang tạm khóa. Liên hệ quản trị để được hỗ trợ.");
    if (!a.isVerified)
      fail(
        403,
        "Xác minh email trường trong mục Tài khoản trước khi sử dụng chức năng này.",
      );
    return a;
  }
  function quota(u) {
    const a = userInfo(u);
    return {
      ...a,
      active: db
        .prepare("SELECT data FROM products WHERE owner=?")
        .all(u.id)
        .map(parse)
        .filter(
          (p) =>
            ["available", "reserved", "lent"].includes(p.status) && !p.deleted,
        ).length,
    };
  }
  const throttles = new Map();
  function throttle(key, limit = 5, ms = 3600000) {
    const n = Date.now(),
      v = throttles.get(key) || { n: 0, until: n + ms };
    if (n >= v.until) {
      v.n = 0;
      v.until = n + ms;
    }
    if (v.n++ >= limit)
      fail(429, "Bạn thao tác quá nhanh. Vui lòng thử lại sau.");
    throttles.set(key, v);
  }
  async function deliver(u, kind, req) {
    throttle(kind + u.id);
    const token = randomBytes(32).toString("hex"),
      minutes = kind === "verify" ? 30 : 15;
    const id = randomUUID();
    db.prepare(
      "INSERT INTO auth_tokens(id,user_id,kind,hash,expires,used,delivery_mode) VALUES(?,?,?,?,?,0,?)",
    ).run(
      id,
      u.id,
      kind,
      hash(token),
      Date.now() + minutes * 60000,
      process.env.SMTP_HOST ? "smtp" : "local",
    );
    const base = process.env.SWAP_PUBLIC_URL || "http://localhost:5173",
      link = base + "/?action=" + kind + "&token=" + token;
    if (process.env.SMTP_HOST) {
      try {
        const { default: nodemailer } = await import("nodemailer");
        const transport = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_PORT === "465",
          requireTLS: process.env.SMTP_PORT !== "465",
          auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
            : undefined,
          disableFileAccess: true,
          disableUrlAccess: true,
          connectionTimeout: 10000,
          socketTimeout: 10000,
        });
        await transport.sendMail({
          from: process.env.SMTP_FROM,
          to: u.email,
          subject:
            kind === "verify"
              ? "Xác minh email UniSwap"
              : "Đặt lại mật khẩu UniSwap",
          text: `${kind === "verify" ? "Xác minh email" : "Đặt lại mật khẩu"}: ${link}\nLiên kết có hiệu lực ${minutes} phút và dùng một lần.`,
        });
      } catch {
        db.prepare("UPDATE auth_tokens SET used=1 WHERE id=?").run(id);
        fail(503, "Chưa gửi được email. Kiểm tra cấu hình SMTP và thử lại.");
      }
      return { message: "Đã gửi liên kết qua email. Kiểm tra cả thư rác." };
    }
    if (!localRequest(req)) {
      db.prepare("UPDATE auth_tokens SET used=1 WHERE id=?").run(id);
      fail(503, "Dịch vụ email chưa được cấu hình.");
    }
    return {
      message:
        "Chế độ thử trên máy: dùng liên kết bên dưới, không có email nào được gửi.",
      localDelivery: true,
      link,
      token,
    };
  }
  async function registered(u, req) {
    db.prepare("INSERT OR IGNORE INTO account_state(user_id) VALUES(?)").run(
      u.id,
    );
    return deliver(u, "verify", req);
  }
  function expireExchange(e, status = "expired") {
    db.prepare(
      "UPDATE exchanges SET status=?,code_hash=NULL,code_expires=NULL,completed=? WHERE id=?",
    ).run(status, now(), e.id);
    for (const id of [e.product_id, e.offered_product].filter(Boolean)) {
      const r = row(id),
        p = parse(r);
      if (p?.status === "reserved") put({ ...p, status: "available" }, r.owner);
    }
    notify(
      e.buyer,
      "exchange",
      status === "expired" ? "Giữ chỗ đã hết hạn." : "Giao dịch đã hủy.",
      e.id,
    );
    notify(
      e.seller,
      "exchange",
      "Món đồ đã được mở lại sau khi giữ chỗ kết thúc.",
      e.id,
    );
  }
  let lastSweep = 0;
  function sweep() {
    if (Date.now() - lastSweep < 1000) return;
    lastSweep = Date.now();
    transaction(() => {
      db.prepare("UPDATE buy_requests SET status='closed' WHERE status='open' AND length(json_extract(data,'$.neededBy'))=10 AND json_extract(data,'$.neededBy')<?").run(todayVN());
      db.prepare("UPDATE checkout_attempts SET status='expired' WHERE status='pending' AND expires<?").run(Date.now());
      db.prepare("UPDATE orders SET status='expired' WHERE status='processing' AND EXISTS(SELECT 1 FROM checkout_attempts a WHERE a.order_id=orders.id) AND NOT EXISTS(SELECT 1 FROM checkout_attempts a WHERE a.order_id=orders.id AND a.status='pending' AND a.expires>?)").run(Date.now());
      for (const e of db
        .prepare(
          "SELECT * FROM exchanges WHERE status='reserved' AND expires IS NOT NULL AND expires<?",
        )
        .all(Date.now()))
        expireExchange(e);
      for (const e of db
        .prepare(
          "SELECT * FROM exchanges WHERE status IN ('reserved','lent') AND reminded=0",
        )
        .all()) {
        const date = e.status === "lent" ? e.due : e.appointment;
        if (
          date &&
          Date.parse(date) - Date.now() < 3600000 &&
          Date.parse(date) > Date.now()
        ) {
          notify(
            e.buyer,
            "reminder",
            e.status === "lent"
              ? "Sắp đến hạn trả đồ."
              : "Sắp đến lịch nhận đồ.",
            e.id,
          );
          notify(e.seller, "reminder", "Sắp đến lịch hẹn giao dịch.", e.id);
          db.prepare("UPDATE exchanges SET reminded=1 WHERE id=?").run(e.id);
        }
      }
      for (const r of db.prepare("SELECT * FROM products").all()) {
        const p = parse(r);
        if (
          p.status === "available" &&
          p.expiresAt &&
          Date.parse(p.expiresAt) < Date.now()
        )
          put({ ...p, status: "expired" }, r.owner);
      }
      db.prepare(
        "UPDATE offers SET status='expired' WHERE status='pending' AND expires<?",
      ).run(Date.now());
    });
  }
  function enrich(r) {
    const p = parse(r),
      u = r.owner
        ? db.prepare("SELECT * FROM users WHERE id=?").get(r.owner)
        : null,
      a = u ? userInfo(u) : null;
    const n = db
      .prepare("SELECT COUNT(*) AS n FROM favorites WHERE product_id=?")
      .get(p.id).n;
    return {
      ...p,
      likes: n,
      views: db
        .prepare("SELECT COUNT(*) AS n FROM views WHERE product_id=?")
        .get(p.id).n,
      inquiries: db
        .prepare(
          "SELECT COUNT(DISTINCT buyer) AS n FROM messages WHERE product_id=?",
        )
        .get(p.id).n,
      isPushed: !!p.pushedUntil && Date.parse(p.pushedUntil) > Date.now(),
      seller: a
        ? {
            ...p.seller,
            name: u.name,
            universityCode: u.school,
            avatar: a.avatar,
            rating: a.rating,
            isVerified: a.isVerified,
            isPro: a.tier === "hunter_pro",
          }
        : p.seller,
    };
  }
  const visible = (r, u) => {
    const p = parse(r);
    return (
      !p.deleted &&
      (!["draft", "paused"].includes(p.status) || r.owner === u?.id) &&
      (p.moderation !== "hidden" || r.owner === u?.id)
    );
  };
  function publish(u, p, old) {
    const q = quota(u);
    if (
      (!old || !["available", "reserved", "lent"].includes(old.status)) &&
      q.active >= q.quota
    )
      fail(
        409,
        `Bạn đã dùng ${q.active}/${q.quota} suất đăng. Hoàn tất hoặc tạm ẩn tin cũ để đăng thêm.`,
      );
    const count = db
      .prepare(
        "SELECT COUNT(*) AS n FROM audit WHERE actor=? AND action IN ('publish','repost') AND created>?",
      )
      .get(u.id, new Date(Date.now() - 86400000).toISOString()).n;
    if (count >= (q.tier === "hunter_pro" ? 20 : 5))
      fail(429, "Đã đạt giới hạn đăng trong ngày. Hãy thử lại ngày mai.");
    return {
      ...p,
      status: "available",
      expiresAt: new Date(
        Date.now() + (q.tier === "hunter_pro" ? 60 : 30) * 86400000,
      ).toISOString(),
      publishedAt: now(),
    };
  }
  function newProduct(b, old, u) {
    const p = productData(b, old, u),
      a = userInfo(u),
      specs = {};
    for (const k of [
      "subject",
      "major",
      "edition",
      "configuration",
      "accessories",
      "faults",
      "size",
      "bundle",
      "pickupWindow",
    ])
      if (clean(b.specs?.[k], 250)) specs[k] = clean(b.specs[k], 250);
    const hint=classifyTitle(p.title),sub=b.subcategory||old?.subcategory||(hint?.category===p.category?hint.subcategory:'other');
    if(!validSubcategory(p.category,sub))fail(400,'Phân loại con không thuộc danh mục đã chọn.');
    return {
      ...p,
      subcategory:sub,conditionGroup:conditionGroup(p.condition),
      specs,
      faculty: specs.major || "",
      seller: {
        ...p.seller,
        isVerified: a.isVerified,
        avatar: a.avatar,
        isPro: a.tier === "hunter_pro",
      },
      expiresAt: old?.expiresAt,
    };
  }
  function makeExchange(u, b) {
    const r = row(clean(b.productId)),
      p = parse(r);
    if (!p || p.deleted || p.moderation === "hidden")
      fail(404, "Món đồ không còn hiển thị.");
    if (!r.owner || p.isDemo) fail(409, "Bài mẫu không nhận đặt giữ.");
    if (r.owner === u.id) fail(400, "Không đặt món của chính bạn.");
    if (blocked(u.id, r.owner))
      fail(403, "Không thể giao dịch giữa các tài khoản đã chặn.");
    if (p.status !== "available") fail(409, "Món đồ đã có người giữ chỗ.");
    if (!/^(?:0|\+84)[0-9]{9,10}$/.test(clean(b.phone, 20)))
      fail(400, "Nhập số điện thoại nhận đồ hợp lệ.");
    if (
      db
        .prepare(
          "SELECT COUNT(*) AS n FROM exchanges WHERE buyer=? AND status='reserved'",
        )
        .get(u.id).n >= userInfo(u).limits.holds
    )
      fail(
        409,
        `Bạn đang giữ tối đa ${userInfo(u).limits.holds} món. Hoàn tất hoặc hủy bớt trước khi giữ thêm.`,
      );
    let offer = b.offerId
      ? db
          .prepare(
            "SELECT * FROM offers WHERE id=? AND buyer=? AND product_id=? AND status='accepted' AND expires>?",
          )
          .get(clean(b.offerId), u.id, p.id, Date.now())
      : null;
    if (b.offerId && !offer) fail(409, "Đề nghị không còn hiệu lực.");
    if (p.tradeType === "swap" && !offer?.offered_product)
      fail(400, "Gửi đề nghị đổi đồ và chờ người bán chấp nhận trước.");
    let offered;
    if (offer?.offered_product) {
      offered = row(offer.offered_product);
      if (offered?.owner !== u.id || parse(offered).status !== "available")
        fail(409, "Món đề nghị đổi không còn sẵn.");
    }
    const appointment = b.appointment ? new Date(b.appointment) : null;
    if (
      appointment &&
      (!Number.isFinite(+appointment) ||
        +appointment < Date.now() + 60000 ||
        +appointment > Date.now() + 7 * 86400000)
    )
      fail(400, "Chọn lịch hẹn từ 1 phút đến 7 ngày tới.");
    const due = b.due ? new Date(b.due) : null;
    if (
      p.tradeType === "borrow" &&
      (!due ||
        !Number.isFinite(+due) ||
        +due < (appointment ? +appointment : Date.now()) + 3600000 ||
        +due > Date.now() + 90 * 86400000)
    )
      fail(
        400,
        "Đồ cho mượn cần hạn trả sau lúc nhận ít nhất 1 giờ và trong 90 ngày.",
      );
    const lockers = db
        .prepare("SELECT locker FROM exchanges WHERE status='reserved'")
        .all()
        .map((e) => e.locker),
      locker = Array.from({ length: 24 }, (_, i) => i + 1).find(
        (n) => !lockers.includes(n),
      );
    if (!locker) fail(409, "Tủ mô phỏng đã đầy. Thử lại sau.");
    const id = randomUUID(),
      expires = Math.max(
        Date.now() + 24 * 3600000,
        appointment ? +appointment + 2 * 3600000 : 0,
      );
    transaction(() => {
      db.prepare(
        "INSERT INTO exchanges(id,product_id,buyer,seller,status,created,locker,phone,snapshot,expires,appointment,place,due,offered_product,offer_snapshot,agreed_price,cash) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      ).run(
        id,
        p.id,
        u.id,
        r.owner,
        "reserved",
        now(),
        locker,
        clean(b.phone, 20),
        JSON.stringify(p),
        expires,
        appointment?.toISOString() || null,
        clean(b.place, 200) || p.meetingSpot,
        due?.toISOString() || null,
        offer?.offered_product || null,
        offered?.data || null,
        offer ? offer.amount : p.price,
        offer?.cash || 0,
      );
      put({ ...p, status: "reserved" }, r.owner);
      if (offered) put({ ...parse(offered), status: "reserved" }, u.id);
      if (offer)
        db.prepare("UPDATE offers SET status='used' WHERE id=?").run(offer.id);
      notify(r.owner, "exchange", `${u.name} đã đặt giữ “${p.title}”.`, id);
      notify(
        u.id,
        "exchange",
        "Đã giữ chỗ. Kiểm tra lịch hẹn và thời hạn.",
        id,
      );
    });
    return id;
  }
  function fulfill(order) {
    if (["push1d", "push3d", "combo5"].includes(order.plan)) {
      const r = row(order.product_id);
      if (!r) fail(409, "Bài đăng không còn tồn tại.");
      const p = parse(r),
        days = order.plan === "push1d" ? 1 : order.plan === "push3d" ? 3 : 5;
      put(
        {
          ...p,
          pushedUntil: new Date(
            Math.max(Date.now(), Date.parse(p.pushedUntil) || 0) +
              days * 86400000,
          ).toISOString(),
        },
        r.owner,
      );
    } else {
      const months =
        order.plan === "semester" ? 5 : order.plan === "year" ? 12 : 1;
      const active =
        db
          .prepare(
            "SELECT MAX(s.expires) AS n FROM subscriptions s JOIN orders o ON o.id=s.order_id WHERE s.user_id=? AND s.plan=? AND (o.status='paid' OR (?=1 AND o.status='simulated'))",
          )
          .get(order.user_id, order.plan,localMode?1:0).n || 0;
      const starts=Math.max(Date.now(),active),expires=starts+months*30*86400000;
      db.prepare("INSERT INTO subscriptions(id,user_id,plan,expires,order_id,starts) VALUES(?,?,?,?,?,?)").run(
        randomUUID(),
        order.user_id,
        order.plan,
        expires,
        order.id,starts,
      );
      premium.grant(order,starts,expires);
    }
    db.prepare("UPDATE orders SET status='paid' WHERE id=?").run(order.id);
    notify(order.user_id, "billing", "Dịch vụ đã được kích hoạt.", "account");
  }
  const encode = (s) => encodeURIComponent(String(s)).replace(/%20/g, "+");
  const canonical = (params) =>
    Object.keys(params)
      .filter(
        (k) =>
          k.startsWith("vnp_") &&
          !["vnp_SecureHash", "vnp_SecureHashType"].includes(k),
      )
      .sort()
      .map((k) => encode(k) + "=" + encode(params[k]))
      .join("&");
  const premium=createPremium({db,clean,fail,parse,row,put,transaction,notify,audit,localMode,verified});
  async function handle(ctx) {
    const { route, method, body, url, session: u, req, res, send } = ctx;
    if(await premium.handle(ctx))return true;
    const ok = (data = {}, status = 200) => {
        send(status, data);
        return true;
      },
      need = () => verified(u),
      owner = (id) => {
        need();
        const r = row(id);
        if (!r) fail(404, "Không tìm thấy bài.");
        if (r.owner !== u.id) fail(403, "Chỉ quản lý bài của bạn.");
        return r;
      };
    if (route === "/api/config")
      return ok({
        localMode: localRequest(req),
        mailConfigured: !!process.env.SMTP_HOST,
        paymentConfigured:
          !!process.env.VNPAY_TMN_CODE && !!process.env.VNPAY_HASH_SECRET,
        paymentSandbox: process.env.VNPAY_ENV !== "live",
      });
    if (route === "/api/payments/vnpay/ipn") {
      if (!process.env.VNPAY_HASH_SECRET || !process.env.VNPAY_TMN_CODE)
        return ok({ RspCode: "97", Message: "Not configured" });
      const params = Object.fromEntries(url.searchParams),
        sig = params.vnp_SecureHash || "",
        expected = createHmac("sha512", process.env.VNPAY_HASH_SECRET)
          .update(canonical(params))
          .digest("hex");
      if (
        !/^[a-fA-F0-9]{128}$/.test(sig) ||
        !timingSafeEqual(Buffer.from(sig.toLowerCase()), Buffer.from(expected))
      )
        return ok({ RspCode: "97", Message: "Invalid signature" });
      if (params.vnp_TmnCode !== process.env.VNPAY_TMN_CODE)
        return ok({ RspCode: "97", Message: "Wrong merchant" });
      const attempt=db.prepare('SELECT * FROM checkout_attempts WHERE reference=?').get(params.vnp_TxnRef);
      const o=db.prepare('SELECT * FROM orders WHERE id=?').get(attempt?.order_id||params.vnp_TxnRef);
      if (!o) return ok({ RspCode: "01", Message: "Order not found" });
      if (Number(params.vnp_Amount) !== o.amount * 100)
        return ok({ RspCode: "04", Message: "Invalid amount" });
      if (["paid", "simulated", "cancelled"].includes(o.status))
        return ok({ RspCode: "02", Message: "Already confirmed" });
      if (
        params.vnp_ResponseCode === "00" &&
        params.vnp_TransactionStatus === "00"
      )
        transaction(() => {
          db.prepare("INSERT INTO events VALUES(?,?,?,?)").run(
            randomUUID(),
            "vnpay",
            params.vnp_TransactionNo,
            now(),
          );
          fulfill(o);db.prepare("UPDATE checkout_attempts SET status='paid' WHERE order_id=?").run(o.id);audit(o.user_id,'payment-confirmed',o.id);
        });
      else {const latest=db.prepare('SELECT reference FROM checkout_attempts WHERE order_id=? ORDER BY created DESC,rowid DESC LIMIT 1').get(o.id);if(!latest||latest.reference===params.vnp_TxnRef)db.prepare("UPDATE orders SET status='failed' WHERE id=? AND status NOT IN ('paid','simulated')").run(o.id);if(attempt)db.prepare("UPDATE checkout_attempts SET status='failed' WHERE reference=?").run(attempt.reference);}
      return ok({ RspCode: "00", Message: "Confirmed" });
    }
    if (route === "/api/auth/forgot" && method === "POST") {
      throttle("reset-ip:" + req.socket.remoteAddress, 10);
      const user = db
        .prepare("SELECT * FROM users WHERE email=?")
        .get(clean(body.email, 200).toLowerCase());
      if (!process.env.SMTP_HOST && !localRequest(req))
        fail(503, "Dịch vụ email chưa được cấu hình.");
      let delivery;
      if (user) {
        try {
          delivery = await deliver(user, "reset", req);
        } catch (e) {
          if (localRequest(req)) throw e;
          console.error("Password recovery mail could not be delivered.");
        }
      }
      return ok({
        message:
          "Nếu email hợp lệ trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu.",
        ...(delivery?.localDelivery ? delivery : {}),
      });
    }
    if (route === "/api/auth/reset" && method === "POST") {
      throttle("reset-use:" + req.socket.remoteAddress, 20);
      const t = db
        .prepare(
          "SELECT * FROM auth_tokens WHERE hash=? AND kind='reset' AND used=0 AND expires>?",
        )
        .get(hash(clean(body.token, 100)), Date.now());
      if (!t || (!localMode && t.delivery_mode === "local"))
        fail(400, "Liên kết đã dùng hoặc hết hạn.");
      if (
        typeof body.password !== "string" ||
        body.password.length < 8 ||
        body.password.length > 128
      )
        fail(400, "Mật khẩu phải có 8–128 ký tự.");
      transaction(() => {
        const salt = randomBytes(16).toString("hex");
        db.prepare("UPDATE users SET password=?,salt=? WHERE id=?").run(
          scryptSync(body.password, salt, 64).toString("hex"),
          salt,
          t.user_id,
        );
        db.prepare(
          "UPDATE auth_tokens SET used=1 WHERE user_id=? AND kind='reset'",
        ).run(t.user_id);
        db.prepare("DELETE FROM sessions WHERE user_id=?").run(t.user_id);
      });
      return ok({
        message: "Đã đặt lại mật khẩu. Đăng nhập bằng mật khẩu mới.",
      });
    }
    if (route === "/api/auth/verify" && method === "POST") {
      throttle("verify-use:" + req.socket.remoteAddress, 20);
      const t = db
        .prepare(
          "SELECT * FROM auth_tokens WHERE hash=? AND kind='verify' AND used=0 AND expires>?",
        )
        .get(hash(clean(body.token, 100)), Date.now());
      if (!t || (!localMode && t.delivery_mode === "local"))
        fail(400, "Liên kết xác minh đã dùng hoặc hết hạn.");
      if (u && u.id !== t.user_id) fail(403, "Liên kết thuộc tài khoản khác.");
      transaction(() => {
        db.prepare("UPDATE account_state SET verified=? WHERE user_id=?").run(
          localRequest(req) && !process.env.SMTP_HOST ? 2 : 1,
          t.user_id,
        );
        db.prepare(
          "UPDATE auth_tokens SET used=1 WHERE user_id=? AND kind='verify'",
        ).run(t.user_id);
      });
      return ok({
        message:
          "Đã xác minh. Chế độ thử cục bộ không thay thế xác minh email khi triển khai.",
      });
    }
    if (route === "/api/products" && method === "GET")
      return ok({
        products: db
          .prepare("SELECT * FROM products")
          .all()
          .filter((r) => visible(r, u))
          .map(enrich),
      });
    if (route.match(/^\/api\/products\/[^/]+$/) && method === "GET") {
      const r = row(route.split("/").pop());
      if (!r || !visible(r, u)) fail(404, "Bài đăng không còn hiển thị.");
      const viewer = u?.id || hash(req.socket.remoteAddress || "local");
      db.prepare("INSERT OR IGNORE INTO views VALUES(?,?,?)").run(
        r.id,
        viewer,
        now().slice(0, 10),
      );
      return ok({ product: enrich(r) });
    }
    if (route.match(/^\/api\/users\/[^/]+$/) && method === "GET") {
      const id = route.split("/").pop(),
        s = db.prepare("SELECT * FROM users WHERE id=?").get(id);
      if (!s) fail(404, "Không tìm thấy hồ sơ.");
      const a = userInfo(s);
      return ok({
        profile: {
          id: s.id,
          name: s.name,
          school: s.school,
          bio: a.bio,
          faculty: a.faculty,
          avatar: a.avatar,
          isVerified: a.isVerified,
          rating: a.rating,
          reviewCount: a.reviewCount,
          dealCount: a.dealCount,
          followers: db
            .prepare("SELECT COUNT(*) AS n FROM follows WHERE seller=?")
            .get(id).n,
          following:
            !!u &&
            !!db
              .prepare("SELECT 1 FROM follows WHERE follower=? AND seller=?")
              .get(u.id, id),
        },
        reviews: db
          .prepare(
            "SELECT r.rating,r.text,r.created,u.name FROM reviews r JOIN users u ON u.id=r.reviewer WHERE reviewee=? ORDER BY r.created DESC LIMIT 50",
          )
          .all(id),
      });
    }
    const savedTopic=route.match(/^\/api\/topics\/([^/]+)\/save$/);
    if(savedTopic&&['POST','DELETE'].includes(method)){need();if(!db.prepare('SELECT id FROM topics WHERE id=?').get(savedTopic[1]))fail(404,'Không tìm thấy nhóm.');if(method==='POST')db.prepare('INSERT OR IGNORE INTO topic_saves VALUES(?,?)').run(u.id,savedTopic[1]);else db.prepare('DELETE FROM topic_saves WHERE user_id=? AND topic_id=?').run(u.id,savedTopic[1]);return ok({ok:true});}
    const demoDiscussion=route.match(/^\/api\/topics\/([^/]+)\/replies$/);
    if(demoDiscussion&&method==='GET'&&db.prepare('SELECT is_demo FROM topics WHERE id=?').get(demoDiscussion[1])?.is_demo)return ok({replies:db.prepare('SELECT r.*,u.name FROM replies r JOIN users u ON u.id=r.user_id WHERE topic_id=? ORDER BY created').all(demoDiscussion[1])});
    if (route === "/api/topics" && method === "GET")
      return ok({
        topics: db
          .prepare(
            "SELECT t.*,u.name FROM topics t JOIN users u ON u.id=t.user_id ORDER BY t.created DESC LIMIT 100",
          )
          .all()
          .map((t) => ({
            ...t,
            saved:!!u&&!!db.prepare('SELECT 1 FROM topic_saves WHERE user_id=? AND topic_id=?').get(u.id,t.id),
            memberCount: db
              .prepare(
                "SELECT COUNT(*) AS n FROM topic_members WHERE topic_id=?",
              )
              .get(t.id).n,
            joined:
              !!u &&
              !!db
                .prepare(
                  "SELECT 1 FROM topic_members WHERE topic_id=? AND user_id=?",
                )
                .get(t.id, u.id),
          })),
      });
    if (route === "/api/buy-requests" && method === "GET")
      return ok({
        requests: db
          .prepare(
            `SELECT b.*, u.name, u.school, u.email,
                    COALESCE(a.avatar, '') AS avatar,
                    COALESCE(a.faculty, '') AS faculty,
                    COALESCE(a.year, '') AS year,
                    COALESCE(a.verified, 0) AS verified,
                    COALESCE(a.admin, 0) AS admin
             FROM buy_requests b 
             JOIN users u ON u.id=b.user_id 
             LEFT JOIN account_state a ON a.user_id=u.id
             WHERE b.status='open' OR b.user_id=? 
             ORDER BY b.created DESC`,
          )
          .all(u?.id || "")
          .map((r) => ({
            ...r,
            data: JSON.parse(r.data),
            responses: db
              .prepare(
                "SELECT br.*,p.data FROM buy_responses br JOIN products p ON p.id=br.product_id WHERE request_id=?",
              )
              .all(r.id)
              .map((x) => ({ ...x, product: parse(x), data: undefined })),
          })),
      });
    // The remaining routes require a valid session; verification is enforced per mutation.
    if (!u) return false;
    const state = userInfo(u);
    if (state.suspended) fail(403, "Tài khoản đang tạm khóa.");
    if (route === "/api/auth/resend" && method === "POST")
      return ok(await deliver(u, "verify", req));
    if (route === "/api/account" && method === "GET")
      return ok({
        account: { ...u, password: undefined, salt: undefined, ...userInfo(u) },
        quota: quota(u),
        sessions: db
          .prepare(
            "SELECT expires FROM sessions WHERE user_id=? ORDER BY expires DESC",
          )
          .all(u.id),
        following: db
          .prepare(
            "SELECT u.id,u.name,u.school FROM follows f JOIN users u ON u.id=f.seller WHERE follower=?",
          )
          .all(u.id),
      });
    if (route === "/api/account" && method === "PATCH") {
      if (clean(body.name, 80).length < 2 || !clean(body.school, 100))
        fail(400, "Nhập tên và trường hợp lệ.");
      if (
        body.avatar &&
        !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(
          body.avatar,
        )
      )
        fail(400, "Ảnh đại diện không hợp lệ.");
      if ((body.avatar || "").length > 1400000)
        fail(400, "Ảnh đại diện quá lớn.");
      db.prepare("UPDATE users SET name=?,school=? WHERE id=?").run(
        clean(body.name, 80),
        clean(body.school, 100),
        u.id,
      );
      db.prepare("INSERT OR IGNORE INTO account_state(user_id) VALUES(?)").run(
        u.id,
      );
      db.prepare(
        "UPDATE account_state SET bio=?,faculty=?,year=?,avatar=? WHERE user_id=?",
      ).run(
        clean(body.bio, 600),
        clean(body.faculty, 100),
        clean(body.year, 60),
        body.avatar || "",
        u.id,
      );
      audit(u.id, "profile", u.id);
      return ok({ ok: true });
    }
    if (route === "/api/auth/password" && method === "POST") {
      throttle("password:" + u.id, 10);
      if (
        typeof body.current !== "string" ||
        !timingSafeEqual(
          scryptSync(body.current, u.salt, 64),
          Buffer.from(u.password, "hex"),
        )
      )
        fail(400, "Mật khẩu hiện tại không đúng.");
      if (
        typeof body.password !== "string" ||
        body.password.length < 8 ||
        body.password.length > 128
      )
        fail(400, "Mật khẩu mới phải có 8–128 ký tự.");
      const salt = randomBytes(16).toString("hex");
      transaction(() => {
        db.prepare("UPDATE users SET password=?,salt=? WHERE id=?").run(
          scryptSync(body.password, salt, 64).toString("hex"),
          salt,
          u.id,
        );
        db.prepare("DELETE FROM sessions WHERE user_id=?").run(u.id);
      });
      res.setHeader(
        "Set-Cookie",
        "swap_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
      );
      return ok({ ok: true });
    }
    if (route === "/api/auth/logout-all" && method === "POST") {
      db.prepare("DELETE FROM sessions WHERE user_id=?").run(u.id);
      res.setHeader(
        "Set-Cookie",
        "swap_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
      );
      return ok({ ok: true });
    }
    if (route === "/api/inbox" && method === "GET")
      return ok({
        threads: db
          .prepare(
            "SELECT m.product_id,m.buyer,MAX(m.rowid) AS seq,MAX(m.created) AS updated,u.name AS buyer_name,p.data FROM messages m JOIN products p ON p.id=m.product_id JOIN users u ON u.id=m.buyer WHERE m.buyer=? OR p.owner=? GROUP BY m.product_id,m.buyer ORDER BY updated DESC",
          )
          .all(u.id, u.id)
          .map((t) => ({
            ...t,
            product: parse(t),
            data: undefined,
            lastText: db
              .prepare("SELECT text FROM messages WHERE rowid=?")
              .get(t.seq)?.text,
            unread: db
              .prepare(
                "SELECT COUNT(*) AS n FROM messages WHERE product_id=? AND buyer=? AND sender!=? AND rowid>COALESCE((SELECT last_seq FROM message_reads WHERE user_id=? AND product_id=? AND buyer=?),0)",
              )
              .get(t.product_id, t.buyer, u.id, u.id, t.product_id, t.buyer).n,
          })),
      });
    const chat = route.match(/^\/api\/products\/([^/]+)\/messages$/);
    if (chat && ["GET", "POST"].includes(method)) {
      need();
      const r = row(chat[1]),
        p = parse(r);
      if (!r?.owner) fail(409, "Bài mẫu chưa có người bán thật nhận tin nhắn.");
      const buyer = r.owner === u.id ? url.searchParams.get("buyer") : u.id;
      if (!buyer || buyer === r.owner)
        fail(400, "Chọn cuộc trò chuyện với người mua.");
      if (!db.prepare("SELECT id FROM users WHERE id=?").get(buyer))
        fail(404, "Không tìm thấy người mua.");
      if (blocked(buyer, r.owner))
        fail(403, "Không thể nhắn giữa các tài khoản đã chặn.");
      if (method === "POST") {
        throttle("message:" + u.id, 120, 60000);
        const text = clean(body.text, 2000);
        if (!text) fail(400, "Nhập nội dung tin nhắn.");
        if (
          r.owner === u.id &&
          !db
            .prepare(
              "SELECT id FROM messages WHERE product_id=? AND buyer=? LIMIT 1",
            )
            .get(p.id, buyer)
        )
          fail(403, "Người mua cần bắt đầu cuộc trò chuyện trước.");
        db.prepare("INSERT INTO messages VALUES(?,?,?,?,?,?)").run(
          randomUUID(),
          p.id,
          buyer,
          u.id,
          text,
          now(),
        );
        notify(
          u.id === buyer ? r.owner : buyer,
          "message",
          u.name + " gửi tin nhắn về “" + p.title + "”.",
          p.id,
        );
      }
      const max =
        db
          .prepare(
            "SELECT MAX(rowid) AS n FROM messages WHERE product_id=? AND buyer=?",
          )
          .get(p.id, buyer).n || 0;
      db.prepare(
        "INSERT INTO message_reads VALUES(?,?,?,?) ON CONFLICT(user_id,product_id,buyer) DO UPDATE SET last_seq=excluded.last_seq",
      ).run(u.id, p.id, buyer, max);
      const other = u.id === buyer ? r.owner : buyer,
        last =
          db
            .prepare(
              "SELECT last_seq FROM message_reads WHERE user_id=? AND product_id=? AND buyer=?",
            )
            .get(other, p.id, buyer)?.last_seq || 0;
      return ok({
        messages: db
          .prepare(
            "SELECT m.rowid AS seq,m.id,m.text,m.sender,m.created,u.name FROM messages m JOIN users u ON u.id=m.sender WHERE product_id=? AND buyer=? ORDER BY m.rowid",
          )
          .all(p.id, buyer)
          .map((m) => ({ ...m, read: m.seq <= last })),
      });
    }
    if (route === "/api/seller-stats" && method === "GET") {
      need();
      const items = db
        .prepare("SELECT * FROM products WHERE owner=?")
        .all(u.id)
        .filter((r) => !parse(r).deleted)
        .map(enrich);
      return ok({
        items: items.map((p) => ({
          id: p.id,
          title: p.title,
          views: p.views,
          likes: p.likes,
          inquiries: p.inquiries,
          status: p.status,
        })),
        summary: {
          views: items.reduce((n, p) => n + p.views, 0),
          likes: items.reduce((n, p) => n + p.likes, 0),
          inquiries: items.reduce((n, p) => n + p.inquiries, 0),
        },
        daily:
          state.tier === "hunter_pro"
            ? db
                .prepare(
                  "SELECT v.day,COUNT(*) AS views FROM views v JOIN products p ON p.id=v.product_id WHERE p.owner=? AND v.day>? GROUP BY v.day ORDER BY v.day DESC",
                )
                .all(
                  u.id,
                  new Date(Date.now() - 30 * 86400000)
                    .toISOString()
                    .slice(0, 10),
                )
            : null,
      });
    }
    if (route === "/api/notifications") {
      if (method === "GET")
        return ok({
          notifications: db
            .prepare(
              "SELECT * FROM notifications WHERE user_id=? ORDER BY created DESC LIMIT 100",
            )
            .all(u.id),
          unread: db
            .prepare(
              "SELECT COUNT(*) AS n FROM notifications WHERE user_id=? AND read=0",
            )
            .get(u.id).n,
        });
      if (method === "PATCH") {
        if (body.id)
          db.prepare(
            "UPDATE notifications SET read=1 WHERE user_id=? AND id=?",
          ).run(u.id, clean(body.id));
        else
          db.prepare("UPDATE notifications SET read=1 WHERE user_id=?").run(
            u.id,
          );
        return ok({ ok: true });
      }
    }
    if (route === "/api/products" && method === "POST") {
      need();
      const draft = body.status === "draft";
      let p;
      if (draft) {
        p = {
          id: randomUUID(),
          title: clean(body.title, 120) || "Bản nháp chưa đặt tên",
          description: clean(body.description, 5000),
          images: Array.isArray(body.images)
            ? body.images
                .filter(
                  (s) =>
                    typeof s === "string" &&
                    s.length < 1400000 &&
                    /^(data:image\/(jpeg|png|webp);base64,|\/assets\/)/.test(s),
                )
                .slice(0, 10)
            : [],
          category: clean(body.category, 30) || "books",
          subcategory:validSubcategory(body.category,body.subcategory)?body.subcategory:"other",
          tradeType: clean(body.tradeType, 20) || "sale",
          price: Number.isSafeInteger(body.price) ? body.price : 0,
          condition: clean(body.condition, 80),
          cluster: clean(body.cluster, 30) || "lang-dh",
          meetingSpot: clean(body.meetingSpot, 200),
          createdAt: now(),
          status: "draft",
          seller: { id: u.id, name: u.name, universityCode: u.school },
          specs: cleanSpecs(body.specs),
          swapFor: clean(body.swapFor, 200),
          borrowDuration: clean(body.borrowDuration, 100),
        };
      } else p = publish(u, newProduct(body, null, u), null);
      transaction(() => {
        put(p, u.id);
        audit(u.id, draft ? "draft" : "publish", p.id);
        if (!draft) announce(u, p);
      });
      return ok({ product: p }, 201);
    }
    const pm = route.match(
      /^\/api\/products\/([^/]+)(?:\/(publish|pause|repost|offer))?$/,
    );
    if (
      pm &&
      ["PATCH", "DELETE", "POST"].includes(method) &&
      !pm[2]?.includes("offer")
    ) {
      const r = owner(pm[1]),
        p = parse(r),
        active = db
          .prepare(
            "SELECT id FROM exchanges WHERE (product_id=? OR offered_product=?) AND status IN ('reserved','lent')",
          )
          .get(p.id, p.id);
      if (active)
        fail(409, "Bài đang giao dịch. Quản lý trong mục Giao dịch trước.");
      if (method === "DELETE") {
        put({ ...p, status: "deleted", deleted: true }, u.id);
        audit(u.id, "delete", p.id);
        return ok({ ok: true });
      }
      let next;
      if (pm[2] === "publish" || pm[2] === "repost") {
        if (p.deleted || p.moderation === "hidden")
          fail(409, "Bài bị ẩn không thể tự đăng lại.");
        const wait = state.tier === "hunter_pro" ? 24 : 72,
          last = Date.parse(p.repostedAt || p.publishedAt || p.createdAt);
        if (pm[2] === "repost" && Date.now() - last < wait * 3600000)
          fail(429, `Chỉ đăng lại sau ${wait} giờ.`);
        next = publish(u, newProduct({ ...p, ...body }, p, u), p);
        if (pm[2] === "repost")
          next = { ...next, createdAt: now(), repostedAt: now() };
      } else if (pm[2] === "pause") next = { ...p, status: "paused" };
      else if (body.status === "draft") {
        const imgs = body.images ?? p.images;
        if (
          !Array.isArray(imgs) ||
          imgs.length > state.imageLimit ||
          imgs.some(
            (x) =>
              typeof x !== "string" ||
              x.length > 1400000 ||
              !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$|^\/assets\//.test(
                x,
              ),
          )
        )
          fail(400, "Ảnh bản nháp không hợp lệ.");
        const merged = { ...p, ...body };
        next = {
          ...p,
          title: clean(merged.title, 120) || "Bản nháp chưa đặt tên",
          description: clean(merged.description, 5000),
          images: imgs,
          price: Number.isSafeInteger(merged.price) ? merged.price : 0,
          condition: clean(merged.condition, 80),
          category: clean(merged.category, 30),
          subcategory:validSubcategory(merged.category,merged.subcategory)?merged.subcategory:"other",
          tradeType: clean(merged.tradeType, 20),
          meetingSpot: clean(merged.meetingSpot, 200),
          cluster: clean(merged.cluster, 30),
          swapFor: clean(merged.swapFor, 200),
          borrowDuration: clean(merged.borrowDuration, 100),
          specs: cleanSpecs(merged.specs),
          status: "draft",
        };
      } else if (["title","description","price","category","subcategory","condition","images","specs","meetingSpot","cluster","tradeType","swapFor","borrowDuration","location"].some(k=>Object.hasOwn(body,k))) {
        next = newProduct({ ...p, ...body }, p, u);
        if (body.status === "available" && p.status === "draft")
          next = publish(u, next, p);
      } else {
        if (
          !["available", "completed", "paused", "expired"].includes(body.status)
        )
          fail(400, "Trạng thái không hợp lệ.");
        next =
          body.status === "available"
            ? publish(u, newProduct(p, p, u), p)
            : { ...p, status: body.status };
      }
      transaction(() => {
        put(next, u.id);
        premium.changed(p,next);
        audit(
          u.id,
          pm[2] ||
            (next.status === "available" && p.status !== "available"
              ? "publish"
              : "edit"),
          p.id,
        );
        if (["publish", "repost"].includes(pm[2])) announce(u, next);
      });
      return ok({ product: next });
    }
    if (route === "/api/buy-requests" && method === "POST") {
      need();
      const requestLimit=userInfo(u).limits.buyRequests;
      if(db.prepare("SELECT COUNT(*) AS n FROM buy_requests WHERE user_id=? AND status='open'").get(u.id).n>=requestLimit)fail(409,`Gói của bạn có tối đa ${requestLimit} tin cần mua đang mở.`);
      const data=requestData(body);
      throttle("request:" + u.id,userInfo(u).buyerPremium?20:5,86400000);
      const id = randomUUID();
      db.prepare("INSERT INTO buy_requests(id,user_id,data,created,status) VALUES(?,?,?,?,?)").run(
        id,
        u.id,
        JSON.stringify(data),
        now(),
        "open",
      );
      return ok({ id }, 201);
    }
    const br = route.match(/^\/api\/buy-requests\/([^/]+)(?:\/(respond))?$/);
    if (br) {
      need();
      const b = db.prepare("SELECT * FROM buy_requests WHERE id=?").get(br[1]);
      if(b.is_demo&&method!=="GET"){
        if(br[2]==="respond") return ok({ ok: true, simulated: true });
        fail(409,"Đây là nhu cầu minh họa. Hãy tạo nhu cầu thật của bạn để tương tác.");
      }
      if(method==='PATCH'&&!br[2]){
        if(b.user_id!==u.id)fail(403,'Chỉ sửa tin cần tìm của mình.');
        if(body.status!==undefined&&!['open','closed'].includes(body.status))fail(400,'Trạng thái không hợp lệ.');
        const nextStatus=body.status||b.status;
        if(b.status!=='open'&&nextStatus==='open'&&db.prepare("SELECT COUNT(*) AS n FROM buy_requests WHERE user_id=? AND status='open'").get(u.id).n>=userInfo(u).limits.buyRequests)fail(409,'Đã đạt hạn mức nhu cầu đang mở của gói.');
        const data=requestData({...JSON.parse(b.data),...body});
        db.prepare('UPDATE buy_requests SET data=?,status=? WHERE id=?').run(JSON.stringify(data),nextStatus,b.id);audit(u.id,'edit-buy-request',b.id);
        return ok({ok:true});
      }
      if (method === "DELETE") {
        if (b.user_id !== u.id) fail(403, "Chỉ đóng tin của mình.");
        db.prepare("UPDATE buy_requests SET status='closed' WHERE id=?").run(
          b.id,
        );
        return ok({ ok: true });
      }
      if (method === "POST" && br[2]) {
        const p = row(clean(body.productId));
        if (p?.owner !== u.id || parse(p).status !== "available" || parse(p).deleted || parse(p).moderation==='hidden')
          fail(400, "Chọn món đang bán của bạn.");
        if (
          b.status !== "open" ||
          b.user_id === u.id ||
          blocked(u.id, b.user_id) || (JSON.parse(b.data).neededBy&&JSON.parse(b.data).neededBy<todayVN())
        )
          fail(409, "Không thể phản hồi tin này.");
        const previous=db.prepare('SELECT id FROM buy_responses WHERE request_id=? AND user_id=? AND product_id=?').get(b.id,u.id,p.id);
        if(previous)db.prepare('UPDATE buy_responses SET text=? WHERE id=?').run(clean(body.text,500),previous.id);
        else{
          db.prepare("INSERT INTO buy_responses VALUES(?,?,?,?,?,?)").run(randomUUID(),b.id,u.id,p.id,clean(body.text,500),now());
          notify(b.user_id,'request',`${u.name} gợi ý một món cho tin cần mua của bạn.`,b.id);
        }
        return ok({ ok: true });
      }
    }
    if (
      route.match(/^\/api\/users\/[^/]+\/(follow|block)$/) &&
      ["POST", "DELETE"].includes(method)
    ) {
      need();
      const [, id, action] = route.match(
        /^\/api\/users\/([^/]+)\/(follow|block)$/,
      );
      if (id === u.id || !db.prepare("SELECT id FROM users WHERE id=?").get(id))
        fail(400, "Tài khoản không hợp lệ.");
      const table = action === "follow" ? "follows" : "blocks",
        a = action === "follow" ? "follower" : "blocker",
        b = action === "follow" ? "seller" : "blocked";
      if (method === "POST")
        db.prepare(`INSERT OR IGNORE INTO ${table} VALUES(?,?)`).run(u.id, id);
      else
        db.prepare(`DELETE FROM ${table} WHERE ${a}=? AND ${b}=?`).run(
          u.id,
          id,
        );
      return ok({ ok: true });
    }
    if (route === "/api/offers" && method === "GET")
      return ok({
        offers: db
          .prepare(
            "SELECT o.*,p.data,u.name AS buyer_name,s.name AS seller_name FROM offers o JOIN products p ON p.id=o.product_id JOIN users u ON u.id=o.buyer JOIN users s ON s.id=o.seller WHERE o.buyer=? OR o.seller=? ORDER BY o.created DESC",
          )
          .all(u.id, u.id)
          .map((o) => ({
            ...o,
            product: parse(o),
            data: undefined,
            offered: o.offered_product ? parse(row(o.offered_product)) : null,
          })),
      });
    if (pm?.[2] === "offer" && method === "POST") {
      need();
      throttle("offer:" + u.id, 30, 86400000);
      const r = row(pm[1]),
        p = parse(r);
      if (
        !r?.owner ||
        r.owner === u.id ||
        p.status !== "available" ||
        blocked(u.id, r.owner)
      )
        fail(409, "Không gửi được đề nghị cho bài này.");
      const amount = Number(body.amount),
        cash = Number(body.cash || 0);
      if (
        !Number.isSafeInteger(amount) ||
        amount < 0 ||
        amount > 100000000 ||
        !Number.isSafeInteger(cash) ||
        Math.abs(cash) > 100000000
      )
        fail(400, "Giá đề nghị không hợp lệ.");
      let offered = null;
      if (p.tradeType === "swap") {
        offered = row(clean(body.offeredProduct));
        if (
          offered?.owner !== u.id ||
          parse(offered).status !== "available" ||
          offered.id === p.id
        )
          fail(400, "Chọn một món đang hiển thị của bạn để đổi.");
      } else if (!["sale", "borrow"].includes(p.tradeType) || amount <= 0)
        fail(400, "Món này không hỗ trợ đề nghị giá.");
      const id = randomUUID();
      db.prepare("INSERT INTO offers VALUES(?,?,?,?,?,?,?,?,?,?)").run(
        id,
        p.id,
        u.id,
        r.owner,
        offered?.id || null,
        amount,
        cash,
        "pending",
        now(),
        Date.now() + 48 * 3600000,
      );
      notify(r.owner, "offer", `${u.name} gửi đề nghị cho “${p.title}”.`, id);
      return ok({ id }, 201);
    }
    const om = route.match(
      /^\/api\/offers\/([^/]+)\/(accept|reject|withdraw)$/,
    );
    if (om && method === "POST") {
      need();
      const o = db.prepare("SELECT * FROM offers WHERE id=?").get(om[1]);
      if (!o || o.status !== "pending" || o.expires < Date.now())
        fail(409, "Đề nghị đã đóng hoặc hết hạn.");
      if ((om[2] === "withdraw" ? o.buyer : o.seller) !== u.id)
        fail(403, "Không có quyền xử lý.");
      db.prepare("UPDATE offers SET status=? WHERE id=?").run(
        om[2] === "accept"
          ? "accepted"
          : om[2] === "reject"
            ? "rejected"
            : "withdrawn",
        o.id,
      );
      notify(
        om[2] === "withdraw" ? o.seller : o.buyer,
        "offer",
        "Đề nghị đã được " +
          (om[2] === "accept"
            ? "chấp nhận. Bạn có thể đặt giữ."
            : om[2] === "reject"
              ? "từ chối."
              : "rút lại."),
        o.id,
      );
      return ok({ ok: true });
    }
    if (route === "/api/exchanges" && method === "POST") {
      need();
      return ok({ id: makeExchange(u, body) }, 201);
    }
    if (route === "/api/exchanges" && method === "GET")
      return ok({
        exchanges: db
          .prepare(
            "SELECT e.*,u.name AS buyer_name,s.name AS seller_name FROM exchanges e JOIN users u ON u.id=e.buyer JOIN users s ON s.id=e.seller WHERE buyer=? OR seller=? ORDER BY e.created DESC",
          )
          .all(u.id, u.id)
          .map((e) => ({
            ...e,
            product: JSON.parse(e.snapshot),
            offered: e.offer_snapshot ? JSON.parse(e.offer_snapshot) : null,
            code_hash: undefined,
            snapshot: undefined,
            offer_snapshot: undefined,
            reviewed: !!db
              .prepare(
                "SELECT id FROM reviews WHERE exchange_id=? AND reviewer=?",
              )
              .get(e.id, u.id),
          })),
      });
    const em = route.match(
      /^\/api\/exchanges\/([^/]+)\/(code|complete|cancel|appointment|request-return|confirm-return|extend|accept-extension|reject-extension|accept-appointment|reject-appointment|review)$/,
    );
    if (em && method === "POST") {
      need();
      const e = db.prepare("SELECT * FROM exchanges WHERE id=?").get(em[1]);
      if (!e) fail(404, "Không tìm thấy giao dịch.");
      if (e.buyer !== u.id && e.seller !== u.id)
        fail(403, "Bạn không thuộc giao dịch.");
      const action = em[2],
        p = JSON.parse(e.snapshot),
        r = row(e.product_id);
      if (action === "review") {
        if (!["completed", "returned"].includes(e.status))
          fail(409, "Chỉ đánh giá giao dịch đã hoàn tất.");
        if (
          !Number.isInteger(body.rating) ||
          body.rating < 1 ||
          body.rating > 5 ||
          clean(body.text, 1000).length < 5
        )
          fail(400, "Chọn 1–5 sao và viết tối thiểu 5 ký tự.");
        if (
          db
            .prepare(
              "SELECT id FROM reviews WHERE exchange_id=? AND reviewer=?",
            )
            .get(e.id, u.id)
        )
          fail(409, "Bạn đã đánh giá giao dịch này.");
        db.prepare("INSERT INTO reviews VALUES(?,?,?,?,?,?,?)").run(
          randomUUID(),
          e.id,
          u.id,
          u.id === e.buyer ? e.seller : e.buyer,
          body.rating,
          clean(body.text, 1000),
          now(),
        );
        return ok({ ok: true });
      }
      if (action === "appointment") {
        if (e.status !== "reserved")
          fail(409, "Chỉ đổi lịch khi đang giữ chỗ.");
        const date = Date.parse(body.appointment);
        if (
          !Number.isFinite(date) ||
          date < Date.now() + 60000 ||
          date > Date.parse(e.created) + 7 * 86400000
        )
          fail(400, "Lịch hẹn phải trong 7 ngày từ khi giữ chỗ.");
        if (e.due && date >= Date.parse(e.due))
          fail(400, "Lịch nhận phải trước hạn trả.");
        db.prepare("UPDATE exchanges SET appointment_change=? WHERE id=?").run(
          JSON.stringify({
            appointment: new Date(date).toISOString(),
            place: clean(body.place, 200) || e.place,
            by: u.id,
          }),
          e.id,
        );
        notify(
          u.id === e.buyer ? e.seller : e.buyer,
          "appointment",
          "Có đề nghị đổi lịch hẹn. Mở giao dịch để chấp nhận hoặc từ chối.",
          e.id,
        );
        return ok({ ok: true });
      }
      if (["accept-appointment", "reject-appointment"].includes(action)) {
        if (e.status !== "reserved" || !e.appointment_change)
          fail(409, "Không có đề nghị đổi lịch.");
        const change = JSON.parse(e.appointment_change);
        if (change.by === u.id) fail(403, "Bên còn lại cần xác nhận đổi lịch.");
        if (action === "accept-appointment") {
          if (Date.parse(change.appointment) < Date.now())
            fail(409, "Lịch đề nghị đã qua.");
          db.prepare(
            "UPDATE exchanges SET appointment=?,place=?,expires=?,reminded=0,appointment_change=NULL WHERE id=?",
          ).run(
            change.appointment,
            change.place,
            Date.parse(change.appointment) + 2 * 3600000,
            e.id,
          );
        } else
          db.prepare(
            "UPDATE exchanges SET appointment_change=NULL WHERE id=?",
          ).run(e.id);
        notify(
          change.by,
          "appointment",
          action === "accept-appointment"
            ? "Đã đồng ý lịch mới."
            : "Đề nghị đổi lịch chưa được đồng ý.",
          e.id,
        );
        return ok({ ok: true });
      }
      if (
        [
          "request-return",
          "confirm-return",
          "extend",
          "accept-extension",
          "reject-extension",
        ].includes(action)
      ) {
        if (e.status !== "lent")
          fail(409, "Món đồ không ở trạng thái đang mượn.");
        if (action === "request-return") {
          if (u.id !== e.buyer) fail(403, "Chỉ người mượn báo trả đồ.");
          db.prepare("UPDATE exchanges SET return_requested=1 WHERE id=?").run(
            e.id,
          );
          notify(
            e.seller,
            "return",
            "Người mượn yêu cầu xác nhận trả đồ.",
            e.id,
          );
        }
        if (action === "confirm-return") {
          if (u.id !== e.seller || !e.return_requested)
            fail(403, "Người cho mượn xác nhận sau khi có yêu cầu trả.");
          transaction(() => {
            db.prepare(
              "UPDATE exchanges SET status='returned',completed=? WHERE id=?",
            ).run(now(), e.id);
            put({ ...parse(r), status: "available" }, r.owner);
            notify(
              e.buyer,
              "return",
              "Người cho mượn đã xác nhận nhận lại đồ.",
              e.id,
            );
          });
        }
        if (action === "extend") {
          if (u.id !== e.buyer) fail(403, "Chỉ người mượn đề nghị gia hạn.");
          const date = Date.parse(body.due);
          if (
            !Number.isFinite(date) ||
            date <= Math.max(Date.now(), Date.parse(e.due)) ||
            date > Date.now() + 90 * 86400000
          )
            fail(400, "Chọn hạn mới sau hạn cũ và trong 90 ngày.");
          db.prepare(
            "UPDATE exchanges SET extension=?,extension_status='pending' WHERE id=?",
          ).run(new Date(date).toISOString(), e.id);
          notify(e.seller, "return", "Có đề nghị gia hạn mượn đồ.", e.id);
        }
        if (action === "accept-extension") {
          if (u.id !== e.seller || e.extension_status !== "pending")
            fail(403, "Không có đề nghị cần duyệt.");
          db.prepare(
            "UPDATE exchanges SET due=?,extension_status='accepted',reminded=0 WHERE id=?",
          ).run(e.extension, e.id);
          notify(e.buyer, "return", "Đề nghị gia hạn đã được đồng ý.", e.id);
        }
        if (action === "reject-extension") {
          if (u.id !== e.seller || e.extension_status !== "pending")
            fail(403, "Không có đề nghị cần duyệt.");
          db.prepare(
            "UPDATE exchanges SET extension_status='rejected' WHERE id=?",
          ).run(e.id);
          notify(
            e.buyer,
            "return",
            "Đề nghị gia hạn chưa được đồng ý. Vui lòng trả đúng hẹn.",
            e.id,
          );
        }
        return ok({ ok: true });
      }
      if (e.status !== "reserved")
        fail(409, "Giao dịch đã đóng hoặc mã không còn hiệu lực.");
      if (action === "cancel") {
        transaction(() => expireExchange(e, "cancelled"));
        return ok({ ok: true });
      }
      if (action === "code") {
        if (u.id !== e.seller) fail(403, "Chỉ người bán tạo mã.");
        const code = String(randomInt(100000, 1000000));
        db.prepare(
          "UPDATE exchanges SET code_hash=?,code_expires=?,attempts=0 WHERE id=?",
        ).run(hash(e.id + code), Date.now() + 15 * 60000, e.id);
        return ok({ code, expires: Date.now() + 15 * 60000 });
      }
      if (action === "complete") {
        if (u.id !== e.buyer) fail(403, "Chỉ người nhận xác nhận nhận đồ.");
        if (!e.code_hash || e.code_expires < Date.now())
          fail(409, "Mã chưa được tạo hoặc đã hết hạn 15 phút.");
        if (e.attempts >= 5) fail(429, "Mã bị khóa sau 5 lần sai.");
        if (hash(e.id + clean(body.code, 6)) !== e.code_hash) {
          db.prepare("UPDATE exchanges SET attempts=attempts+1 WHERE id=?").run(
            e.id,
          );
          fail(400, "Mã không đúng.");
        }
        transaction(() => {
          db.prepare(
            "UPDATE exchanges SET status=?,code_hash=NULL,code_expires=NULL,completed=? WHERE id=?",
          ).run(
            p.tradeType === "borrow" ? "lent" : "completed",
            p.tradeType === "borrow" ? null : now(),
            e.id,
          );
          put(
            {
              ...parse(r),
              status: p.tradeType === "borrow" ? "lent" : "completed",
            },
            r.owner,
          );
          if (e.offered_product) {
            const o = row(e.offered_product);
            put({ ...parse(o), status: "completed" }, o.owner);
          }
          notify(
            e.seller,
            "exchange",
            p.tradeType === "borrow"
              ? "Đã bàn giao. Theo dõi hạn trả trong giao dịch."
              : "Người mua đã xác nhận nhận đồ.",
            e.id,
          );
        });
        return ok({ ok: true });
      }
    }
    if (route === "/api/orders" && method === "POST") {
      need();
      const plans=Object.fromEntries([...PLANS.map(p=>[p.id,p.price]),...Object.entries(BOOST_PLANS)]);
      if (!Object.hasOwn(plans, body.plan)) fail(400, "Gói không hợp lệ.");
      if(body.plan.startsWith('push')||body.plan==='combo5'){const p=parse(owner(clean(body.productId)));if(p.status!=='available'||p.deleted||p.moderation==='hidden')fail(409,'Chỉ mua đẩy tin đang hiển thị.');}
      const existing = db
        .prepare(
          "SELECT * FROM orders WHERE user_id=? AND plan=? AND product_id=? AND status IN ('pending_configuration','pending','processing') AND created>?",
        )
        .get(
          u.id,
          body.plan,
          clean(body.productId),
          new Date(Date.now() - 15 * 60000).toISOString(),
        );
      if (existing)
        return ok({
          order: existing,
          message: "Đang dùng lại đăng ký chờ thanh toán hiện có.",
        });
      const order = {
        id: randomUUID().replaceAll("-", ""),
        user_id: u.id,
        plan: body.plan,
        product_id: clean(body.productId),
        amount: plans[body.plan],
        status: process.env.VNPAY_HASH_SECRET && process.env.VNPAY_TMN_CODE
          ? "pending"
          : "pending_configuration",
        created: now(),
      };
      db.prepare("INSERT INTO orders VALUES(?,?,?,?,?,?,?)").run(
        ...Object.values(order),
      );
      return ok(
        {
          order,
          message:
            "Đã lưu đăng ký. Chỉ kích hoạt sau xác nhận thanh toán hoặc trong chế độ mô phỏng cục bộ.",
        },
        201,
      );
    }
    const bm = route.match(
      /^\/api\/orders\/([^/]+)\/(checkout|cancel|simulate)$/,
    );
    if (bm && method === "POST") {
      need();
      const o = db
        .prepare("SELECT * FROM orders WHERE id=? AND user_id=?")
        .get(bm[1], u.id);
      if (!o) fail(404, "Không tìm thấy đăng ký.");
      if (
        !["pending", "pending_configuration", "failed", "processing", "expired"].includes(
          o.status,
        )
      )
        fail(409, "Đăng ký đã xử lý.");
      if (bm[2] === "cancel") {
        if (o.status === "processing")
          fail(
            409,
            "Cổng thanh toán đang xử lý. Chờ thông báo kết quả trước khi hủy.",
          );
        db.prepare("UPDATE orders SET status='cancelled' WHERE id=?").run(o.id);
        return ok({ ok: true });
      }
      if (bm[2] === "simulate") {
        if (!localRequest(req) || process.env.VNPAY_ENV === "live")
          fail(
            403,
            "Mô phỏng chỉ có trên máy cục bộ, ngoài cấu hình thanh toán thật.",
          );
        transaction(() => {
          fulfill(o);
          db.prepare("UPDATE orders SET status='simulated' WHERE id=?").run(
            o.id,
          );
          audit(u.id, "simulate-payment", o.id);
        });
        return ok({ message: "Đã kích hoạt thử trên máy, không thu tiền." });
      }
      if (!process.env.VNPAY_TMN_CODE || !process.env.VNPAY_HASH_SECRET)
        fail(
          409,
          "Chưa có mã đơn vị và khóa VNPAY. Dùng mô phỏng cục bộ hoặc cấu hình cổng thanh toán.",
        );
      const previous=db.prepare("SELECT * FROM checkout_attempts WHERE order_id=? AND status='pending' AND expires>? ORDER BY created DESC LIMIT 1").get(o.id,Date.now());if(previous)return ok({url:previous.url,expires:previous.expires});
      const attempts=db.prepare('SELECT COUNT(*) AS n FROM checkout_attempts WHERE order_id=?').get(o.id).n,reference=attempts?o.id+'r'+randomBytes(4).toString('hex'):o.id;
      const date = (d) =>
        new Intl.DateTimeFormat("sv-SE", {
          timeZone: "Asia/Ho_Chi_Minh",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
          .format(d)
          .replace(/\D/g, "");
      const params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: process.env.VNPAY_TMN_CODE,
        vnp_Amount: o.amount * 100,
        vnp_CurrCode: "VND",
        vnp_TxnRef: reference,
        vnp_OrderInfo: "UniSwap " + o.plan,
        vnp_OrderType: "other",
        vnp_Locale: "vn",
        vnp_ReturnUrl:
          (process.env.SWAP_PUBLIC_URL || "http://localhost:5173") +
          "/?payment=return&order="+o.id,
        vnp_IpAddr:
          req.socket.remoteAddress?.replace("::ffff:", "") || "127.0.0.1",
        vnp_CreateDate: date(new Date()),
        vnp_ExpireDate: date(new Date(Date.now() + 15 * 60000)),
      };
      const data = canonical(params),
        signature = createHmac("sha512", process.env.VNPAY_HASH_SECRET)
          .update(data)
          .digest("hex");
      const checkoutUrl=(process.env.VNPAY_ENV==='live'?'https://pay.vnpay.vn/vpcpay.html':'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html')+'?'+data+'&vnp_SecureHash='+signature,expires=Date.now()+15*60000;
      transaction(()=>{db.prepare("UPDATE orders SET status='processing' WHERE id=?").run(o.id);db.prepare('INSERT INTO checkout_attempts(reference,order_id,url,expires,created) VALUES(?,?,?,?,?)').run(reference,o.id,checkoutUrl,expires,now());audit(u.id,'checkout',o.id);});return ok({url:checkoutUrl,expires});
    }
    if (route === "/api/topics" && method === "POST") {
      need();
      if (
        !["bookclub", "study", "tutoring"].includes(body.kind) ||
        clean(body.title, 120).length < 5 ||
        clean(body.text, 3000).length < 10
      )
        fail(400, "Nhập chủ đề và nội dung hợp lệ.");
      const capacity = Number(body.capacity || 10),
        fee = Number(body.price || 0);
      if (
        !Number.isInteger(capacity) ||
        capacity < 1 ||
        capacity > 100 ||
        !Number.isSafeInteger(fee) ||
        fee < 0 ||
        fee > 10000000
      )
        fail(400, "Số người 1–100 và phí hợp lệ.");
      if (
        body.schedule &&
        (!Number.isFinite(Date.parse(body.schedule)) ||
          Date.parse(body.schedule) < Date.now())
      )
        fail(400, "Chọn lịch trong tương lai.");
      const id = randomUUID();
      db.prepare(
        "INSERT INTO topics(id,user_id,kind,title,text,school,price,created,schedule,capacity) VALUES(?,?,?,?,?,?,?,?,?,?)",
      ).run(
        id,
        u.id,
        body.kind,
        clean(body.title, 120),
        clean(body.text, 3000),
        u.school,
        fee,
        now(),
        clean(body.schedule, 40),
        capacity,
      );
      return ok({ id }, 201);
    }
    const tm = route.match(
      /^\/api\/topics\/([^/]+)\/(join|leave|members|close|reopen)$/,
    );
    if (tm) {
      need();
      const t = db.prepare("SELECT * FROM topics WHERE id=?").get(tm[1]);
      if (!t) fail(404, "Không tìm thấy nhóm.");
      if(t.is_demo&&method!=="GET")fail(409,"Đây là nhóm minh họa, không nhận đăng ký thật. Bạn có thể tạo nhóm của mình.");
      if (["close", "reopen"].includes(tm[2]) && method === "POST") {
        if (t.user_id !== u.id)
          fail(403, "Chỉ người tổ chức điều chỉnh nhận thành viên.");
        db.prepare("UPDATE topics SET enrollment=? WHERE id=?").run(
          tm[2] === "close" ? "closed" : "open",
          t.id,
        );
        return ok({ ok: true });
      }
      if (tm[2] === "members" && method === "GET")
        return ok({
          members: db
            .prepare(
              "SELECT m.*,u.name FROM topic_members m JOIN users u ON u.id=m.user_id WHERE topic_id=?",
            )
            .all(t.id),
        });
      if (method === "POST") {
        if (tm[2] === "join") {
          if(t.schedule&&Date.parse(t.schedule)<=Date.now())fail(409,'Buổi này đã diễn ra. Chọn một nhóm có lịch sắp tới.');
          if (t.enrollment === "closed")
            fail(409, "Nhóm đã đóng nhận thành viên.");
          if (t.user_id === u.id) fail(400, "Bạn đang là người tổ chức.");
          if (
            db
              .prepare(
                "SELECT COUNT(*) AS n FROM topic_members WHERE topic_id=?",
              )
              .get(t.id).n >= t.capacity
          )
            fail(409, "Nhóm đã đủ người.");
          db.prepare("INSERT OR IGNORE INTO topic_members VALUES(?,?,?,?)").run(
            t.id,
            u.id,
            "joined",
            now(),
          );
          notify(
            t.user_id,
            "community",
            `${u.name} đã tham gia “${t.title}”.`,
            t.id,
          );
        } else
          db.prepare(
            "DELETE FROM topic_members WHERE topic_id=? AND user_id=?",
          ).run(t.id, u.id);
        return ok({ ok: true });
      }
    }
    if (route.startsWith("/api/admin/")) {
      need();
      if (route === "/api/admin/toggle-my-role" && method === "POST") {
        const currentAdmin = db.prepare("SELECT admin FROM account_state WHERE user_id=?").get(u.id)?.admin;
        const newAdmin = currentAdmin ? 0 : 1;
        db.prepare("INSERT OR IGNORE INTO account_state(user_id) VALUES(?)").run(u.id);
        db.prepare("UPDATE account_state SET admin=? WHERE user_id=?").run(newAdmin, u.id);
        return ok({ ok: true, role: newAdmin ? "admin" : "student" });
      }
      if (!state.role || state.role !== "admin")
        fail(403, "Chỉ quản trị viên mới có quyền truy cập khu vực này.");
      if (route === "/api/admin/overview") {
        let topics = [];
        let buyRequests = [];
        try {
          topics = db
            .prepare(
              "SELECT t.*, u.name as author_name FROM topics t LEFT JOIN users u ON u.id=t.user_id ORDER BY t.created DESC LIMIT 200",
            )
            .all();
        } catch {}
        try {
          buyRequests = db
            .prepare(
              "SELECT b.*, u.name as author_name FROM buy_requests b LEFT JOIN users u ON u.id=b.user_id ORDER BY b.created DESC LIMIT 200",
            )
            .all()
            .map((b) => {
              try {
                return { ...b, data: typeof b.data === "string" ? JSON.parse(b.data) : b.data };
              } catch {
                return b;
              }
            });
        } catch {}

        return ok({
          users: db
            .prepare(
              "SELECT u.id,u.email,u.name,u.school,a.verified,a.suspended,a.admin FROM users u LEFT JOIN account_state a ON a.user_id=u.id ORDER BY u.created DESC LIMIT 200",
            )
            .all(),
          reports: db
            .prepare(
              "SELECT r.*,u.name FROM reports r JOIN users u ON u.id=r.user_id ORDER BY r.created DESC LIMIT 200",
            )
            .all(),
          products: db.prepare("SELECT * FROM products").all().map(enrich),
          topics,
          buyRequests,
          orders: db
            .prepare("SELECT * FROM orders ORDER BY created DESC LIMIT 200")
            .all(),
          audit: db
            .prepare("SELECT * FROM audit ORDER BY created DESC LIMIT 100")
            .all(),
        });
      }
      if (route === "/api/admin/moderate" && method === "POST") {
        const r = row(clean(body.productId));
        if (!r) fail(404, "Không tìm thấy bài.");
        const p = parse(r);
        put({ ...p, moderation: body.hide ? "hidden" : undefined }, r.owner);
        audit(u.id, body.hide ? "hide" : "restore", p.id, body.note);
        notify(
          r.owner,
          "moderation",
          body.hide
            ? "Bài đăng bị ẩn: " + clean(body.note, 300)
            : "Bài đăng đã được khôi phục.",
          p.id,
        );
        return ok({ ok: true });
      }
      if (route === "/api/admin/delete-product" && method === "POST") {
        const pid = clean(body.productId);
        db.prepare("DELETE FROM products WHERE id=?").run(pid);
        audit(u.id, "delete-product", pid, clean(body.note, 500) || "Admin xóa vĩnh viễn");
        return ok({ ok: true });
      }
      if (route === "/api/admin/verify-product" && method === "POST") {
        const pid = clean(body.productId);
        const r = row(pid);
        if (r) {
          const p = parse(r);
          const isVerified = body.verified !== false;
          put({ ...p, isVerified }, r.owner);
          audit(u.id, isVerified ? "verify-product" : "unverify-product", pid, clean(body.note, 500) || "Campus Check");
        }
        return ok({ ok: true });
      }
      if (route === "/api/admin/topic" && method === "POST") {
        const tid = clean(body.topicId);
        if (body.action === "delete") {
          db.prepare("DELETE FROM topics WHERE id=?").run(tid);
          audit(u.id, "delete-topic", tid, clean(body.note, 500) || "Admin xóa bài viết");
        } else if (body.action === "close") {
          db.prepare("UPDATE topics SET enrollment='closed' WHERE id=?").run(tid);
          audit(u.id, "close-topic", tid, clean(body.note, 500));
        } else if (body.action === "reopen") {
          db.prepare("UPDATE topics SET enrollment='open' WHERE id=?").run(tid);
          audit(u.id, "reopen-topic", tid, clean(body.note, 500));
        }
        return ok({ ok: true });
      }
      if (route === "/api/admin/buy-request" && method === "POST") {
        const bid = clean(body.requestId);
        if (body.action === "delete") {
          db.prepare("DELETE FROM buy_requests WHERE id=?").run(bid);
          audit(u.id, "delete-buy-request", bid, clean(body.note, 500) || "Admin xóa tin cần mua");
        } else if (body.action === "close") {
          db.prepare("UPDATE buy_requests SET status='closed' WHERE id=?").run(bid);
          audit(u.id, "close-buy-request", bid, clean(body.note, 500));
        } else if (body.action === "reopen") {
          db.prepare("UPDATE buy_requests SET status='open' WHERE id=?").run(bid);
          audit(u.id, "reopen-buy-request", bid, clean(body.note, 500));
        }
        return ok({ ok: true });
      }
      if (route === "/api/admin/verify-user" && method === "POST") {
        const uid = clean(body.userId);
        const v = body.verified ? 1 : 0;
        db.prepare("INSERT OR IGNORE INTO account_state(user_id) VALUES(?)").run(uid);
        db.prepare("UPDATE account_state SET verified=? WHERE user_id=?").run(v, uid);
        audit(u.id, v ? "verify-user" : "unverify-user", uid, clean(body.note, 500));
        return ok({ ok: true });
      }
      if (route === "/api/admin/reports" && method === "PATCH") {
        if (!["open", "resolved", "dismissed"].includes(body.status))
          fail(400, "Trạng thái không hợp lệ.");
        db.prepare("UPDATE reports SET status=?,resolution=? WHERE id=?").run(
          body.status,
          clean(body.resolution, 1000),
          clean(body.id),
        );
        audit(u.id, "report", clean(body.id), body.resolution);
        return ok({ ok: true });
      }
      if (route === "/api/admin/suspend" && method === "POST") {
        if (body.userId === u.id) fail(400, "Không tự khóa tài khoản.");
        db.prepare(
          "INSERT OR IGNORE INTO account_state(user_id) VALUES(?)",
        ).run(clean(body.userId));
        db.prepare("UPDATE account_state SET suspended=? WHERE user_id=?").run(
          body.suspended ? 1 : 0,
          clean(body.userId),
        );
        if (body.suspended)
          db.prepare("DELETE FROM sessions WHERE user_id=?").run(
            clean(body.userId),
          );
        audit(u.id, "suspend", clean(body.userId), body.note);
        return ok({ ok: true });
      }
    }
    const messages = route.match(/^\/api\/products\/([^/]+)\/messages$/);
    if (messages) {
      const r = row(messages[1]);
      if (r && blocked(u.id, r.owner))
        fail(403, "Không thể nhắn giữa các tài khoản đã chặn.");
    }
    return false;
  }
  function announce(u, p) {
    for (const f of db
      .prepare("SELECT follower FROM follows WHERE seller=?")
      .all(u.id))
      notify(f.follower, "listing", `${u.name} vừa đăng “${p.title}”.`, p.id);
    for (const s of db
      .prepare("SELECT * FROM searches WHERE user_id!=?")
      .all(u.id)) {
      const f = JSON.parse(s.filters),
        norm = (v) =>
          String(v || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .toLowerCase();
      if (
        (!f.q ||
          norm(
            p.title + " " + p.description + " " + JSON.stringify(p.specs),
          ).includes(norm(f.q))) &&
        (!f.category || f.category === "all" || f.category === p.category) &&
        (!f.school || f.school === "all" || f.school === u.school) &&
        (!f.cluster || f.cluster === "all" || f.cluster === p.cluster) &&
        (!f.trade || f.trade === "all" || f.trade === p.tradeType) &&
        (!f.max || p.price <= Number(f.max)) &&
        (!f.min || p.price >= Number(f.min))
      )
        notify(
          s.user_id,
          "match",
          "Có món mới phù hợp “" + s.name + "”.",
          p.id,
        );
    }
  }
  return { handle, sweep, userInfo, registered, notify, verified, localMode };
}
