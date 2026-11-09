import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { User } from "../types";
type Delivery = {
  link?: string;
  token?: string;
  message?: string;
  localDelivery?: boolean;
};
export function AccountCenter({
  user,
  delivery: initial,
  token,
  action,
  onUser,
  onLogout,
  onNotice,
}: {
  user: User | null;
  delivery?: Delivery;
  token?: string;
  action?: string;
  onUser: (u: User) => void;
  onLogout: () => void;
  onNotice: (s: string) => void;
}) {
  const [data, setData] = useState<any>(null),
    [form, setForm] = useState<any>({
      name: user?.name || "",
      school: user?.universityCode || "",
      bio: "",
      faculty: "",
      year: "",
      avatar: "",
    }),
    [delivery, setDelivery] = useState<Delivery | undefined>(initial),
    [email, setEmail] = useState(""),
    [code, setCode] = useState(token || initial?.token || ""),
    [password, setPassword] = useState(""),
    [current, setCurrent] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    let active = true;
    api("/account")
      .then((d) => {
        if (active) {
          setData(d);
          setForm({ ...d.account, school: d.account.school });
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [user]);
  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function update() {
    const d = await api("/me");
    if (d.user) onUser(d.user);
  }
  function deliveryView() {
    return (
      delivery && (
        <div className="swap-note">
          <p>{delivery.message}</p>
          {delivery.localDelivery && (
            <>
              <b>Chỉ thử trên máy — chưa gửi email thật</b>
              <p>
                Liên kết mô phỏng có hiệu lực như email thử; không dùng để xác
                minh danh tính ngoài đời.
              </p>
              {delivery.link && <a href={delivery.link}>Mở liên kết thử</a>}
              <button
                type="button"
                onClick={() => setCode(delivery.token || "")}
              >
                Điền mã từ thư thử
              </button>
            </>
          )}
        </div>
      )
    );
  }
  return (
    <div className="swap-form">
      {action === "verify" && !user ? (
        <form
          className="swap-form"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              const d = await api("/auth/verify", "POST", { token: code });
              onNotice(d.message);
              onLogout();
            });
          }}
        >
          <h3>Xác minh email trường</h3>
          <label>
            Mã trong liên kết
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button className="swap-primary" disabled={busy}>
            Xác minh email
          </button>
        </form>
      ) : action === "reset" || !user ? (
        <>
          <h3>Khôi phục tài khoản</h3>
          <form
            className="swap-form"
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                setDelivery(await api("/auth/forgot", "POST", { email }));
              });
            }}
          >
            <label>
              Email trường
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button className="swap-primary" disabled={busy}>
              Gửi liên kết đặt lại mật khẩu
            </button>
          </form>
          {deliveryView()}
          <form
            className="swap-form"
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                const d = await api("/auth/reset", "POST", {
                  token: code,
                  password,
                });
                onNotice(d.message);
                setPassword("");
                setCode("");
                onLogout();
              });
            }}
          >
            <label>
              Mã trong liên kết
              <input
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>
            <label>
              Mật khẩu mới
              <input
                autoComplete="new-password"
                type="password"
                minLength={8}
                maxLength={128}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button disabled={busy} className="swap-primary">
              Đặt lại mật khẩu
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="swap-account-summary">
            <div className="swap-initial">{user.name.charAt(0)}</div>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <span
                className={"swap-badge " + (user.isVerified ? "verified" : "")}
              >
                {user.isVerified
                  ? user.verificationMode === "local"
                    ? "Đã xác minh thử trên máy"
                    : "Đã xác minh email"
                  : "Chưa xác minh email"}
              </span>
            </div>
          </div>
          {!user.isVerified && (
            <section className="swap-note">
              <h3>Xác minh email trường</h3>
              <p>
                Bạn có thể khám phá trước. Xác minh để đăng tin, nhắn tin và
                giao dịch.
              </p>
              <button
                disabled={busy}
                onClick={() =>
                  void run(async () =>
                    setDelivery(await api("/auth/resend", "POST", {})),
                  )
                }
              >
                Gửi lại liên kết xác minh
              </button>
              {deliveryView()}
              <form
                className="swap-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void run(async () => {
                    const d = await api("/auth/verify", "POST", {
                      token: code,
                    });
                    onNotice(d.message);
                    await update();
                  });
                }}
              >
                <label>
                  Mã xác minh trong liên kết
                  <input
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </label>
                <button disabled={busy} className="swap-primary">
                  Xác minh tài khoản
                </button>
              </form>
            </section>
          )}
          {data && (
            <>
              <div className="swap-quota">
                <b>
                  {data.quota.active}/{data.quota.quota} suất đăng đang sử dụng
                </b>
                <progress value={data.quota.active} max={data.quota.quota} />
                <p>
                  {user.buyerPremium&&user.sellerPremium?"Premium Mua & Bán":user.buyerPremium?"Premium Mua":user.sellerPremium?"Premium Bán":"Miễn phí"} ·{" "}
                  {data.quota.imageLimit} ảnh/tin · Bản nháp không chiếm suất
                </p>
                {user.buyerUntil&&<p>Quyền Mua đến {new Date(user.buyerUntil).toLocaleString('vi-VN')}</p>}
                {user.sellerUntil&&<p>Quyền Bán đến {new Date(user.sellerUntil).toLocaleString('vi-VN')} · Còn {user.pushCredits} lượt đẩy kèm gói</p>}
              </div>
              <form
                className="swap-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void run(async () => {
                    await api("/account", "PATCH", form);
                    await update();
                    onNotice("Đã lưu hồ sơ.");
                  });
                }}
              >
                <h3>Hồ sơ của bạn</h3>
                <label>
                  Họ tên
                  <input
                    required
                    minLength={2}
                    maxLength={80}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>
                <label>
                  Trường
                  <input
                    required
                    maxLength={100}
                    value={form.school}
                    onChange={(e) =>
                      setForm({ ...form, school: e.target.value })
                    }
                  />
                </label>
                <label>
                  Ngành / khoa
                  <input
                    maxLength={100}
                    value={form.faculty}
                    onChange={(e) =>
                      setForm({ ...form, faculty: e.target.value })
                    }
                  />
                </label>
                <label>
                  Năm học
                  <input
                    maxLength={60}
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </label>
                <label>
                  Giới thiệu
                  <textarea
                    rows={3}
                    maxLength={600}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  />
                </label>
                <label>
                  Ảnh đại diện
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      void run(async () => {
                        if (file.size > 5 * 1024 * 1024)
                          throw Error("Chọn ảnh dưới 5 MB.");
                        const bitmap = await createImageBitmap(file),
                          canvas = document.createElement("canvas");
                        canvas.width = 256;
                        canvas.height = 256;
                        const side = Math.min(bitmap.width, bitmap.height);
                        canvas
                          .getContext("2d")!
                          .drawImage(
                            bitmap,
                            (bitmap.width - side) / 2,
                            (bitmap.height - side) / 2,
                            side,
                            side,
                            0,
                            0,
                            256,
                            256,
                          );
                        bitmap.close();
                        setForm({
                          ...form,
                          avatar: canvas.toDataURL("image/jpeg", 0.8),
                        });
                      });
                    }}
                  />
                </label>
                {form.avatar && (
                  <img
                    className="swap-avatar-preview"
                    src={form.avatar}
                    alt="Ảnh đại diện xem trước"
                  />
                )}
                <button disabled={busy} className="swap-primary">
                  Lưu hồ sơ
                </button>
              </form>
              <div>
                <h3>Người bán đang theo dõi</h3>
                {!data.following.length ? (
                  <p>Chưa theo dõi người bán nào.</p>
                ) : (
                  data.following.map((s: any) => (
                    <p key={s.id}>
                      {s.name} · {s.school}
                    </p>
                  ))
                )}
              </div>
            </>
          )}
          <details className="swap-security">
            <summary>Bảo mật tài khoản</summary>
            <form
              className="swap-form"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  await api("/auth/password", "POST", { current, password });
                  onNotice("Đã đổi mật khẩu và đăng xuất các thiết bị.");
                  onLogout();
                });
              }}
            >
              <label>
                Mật khẩu hiện tại
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                />
              </label>
              <label>
                Mật khẩu mới
                <input
                  required
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <button disabled={busy}>Đổi mật khẩu & đăng xuất</button>
            </form>
            <button
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  await api("/auth/logout-all", "POST", {});
                  onLogout();
                  onNotice("Đã đăng xuất tất cả thiết bị.");
                })
              }
            >
              Đăng xuất mọi thiết bị ({data?.sessions.length || 0} phiên)
            </button>
          </details>
        </>
      )}
      {error && (
        <p role="alert" className="swap-error">
          {error}
        </p>
      )}
    </div>
  );
}
