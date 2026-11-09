import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { ProductItem, User } from "../types";
export function SellerProfile({
  id,
  user,
  products,
  onSelect,
  onLogin,
}: {
  id: string;
  user: User | null;
  products: ProductItem[];
  onSelect: (p: ProductItem) => void;
  onLogin: () => void;
}) {
  const [data, setData] = useState<any>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api("/users/" + id)
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id]);
  if (!data) return <p>{error || "Đang tải hồ sơ…"}</p>;
  const p = data.profile;
  async function follow() {
    if (!user) {
      onLogin();
      return;
    }
    try {
      await api(
        "/users/" + id + "/follow",
        p.following ? "DELETE" : "POST",
        {},
      );
      setData({
        ...data,
        profile: {
          ...p,
          following: !p.following,
          followers: p.followers + (p.following ? -1 : 1),
        },
      });
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <div className="swap-form">
      <div className="swap-account-summary">
        {p.avatar ? (
          <img className="swap-avatar-preview" src={p.avatar} alt={p.name} />
        ) : (
          <div className="swap-initial">{p.name.charAt(0)}</div>
        )}
        <div>
          <h3>{p.name}</h3>
          <p>
            {p.school} · {p.isVerified ? "Đã xác minh" : "Chưa xác minh"}
          </p>
          <p>
            {p.reviewCount
              ? `★ ${p.rating.toFixed(1)} / 5 · ${p.reviewCount} đánh giá`
              : "Chưa có đánh giá"}{" "}
            · {p.dealCount} giao dịch
          </p>
        </div>
      </div>
      <p>{p.bio || "Chưa có giới thiệu."}</p>
      <p>
        {p.followers} người theo dõi · {p.faculty}
      </p>
      {user?.id !== id && (
        <div className="swap-actions">
          <button className="swap-primary" onClick={() => void follow()}>
            {p.following ? "Đang theo dõi — bỏ theo dõi" : "Theo dõi người bán"}
          </button>
          <button
            onClick={() => {
              if (!user) {
                onLogin();
                return;
              }
              void api("/users/" + id + "/block", "POST", {})
                .then(() =>
                  setError("Đã chặn tài khoản. Bạn có thể bỏ chặn tại đây."),
                )
                .catch((e) => setError(e.message));
            }}
          >
            Chặn tài khoản
          </button>
          <button
            onClick={() => {
              if (!user) {
                onLogin();
                return;
              }
              void api("/users/" + id + "/block", "DELETE", {})
                .then(() => setError("Đã bỏ chặn."))
                .catch((e) => setError(e.message));
            }}
          >
            Bỏ chặn
          </button>
        </div>
      )}
      <h3>Món đang đăng</h3>
      <div className="swap-list">
        {products
          .filter((x) => x.seller.id === id && x.status === "available")
          .map((x) => (
            <button key={x.id} onClick={() => onSelect(x)}>
              {x.title}
            </button>
          ))}
      </div>
      <h3>Đánh giá sau giao dịch</h3>
      {data.reviews.map((r: any, i: number) => (
        <div key={i} className="swap-note">
          <b>
            {r.name} · {"★".repeat(r.rating)}
          </b>
          <p>{r.text}</p>
          <small>{new Date(r.created).toLocaleDateString("vi-VN")}</small>
        </div>
      ))}
      {error && (
        <p role="status" className="swap-note">
          {error}
        </p>
      )}
    </div>
  );
}
