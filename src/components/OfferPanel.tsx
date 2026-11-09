import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { ProductItem, User } from "../types";
export function OfferPanel({
  user,
  product,
  products,
  onReserve,
  onNotice,
}: {
  user: User;
  product?: ProductItem;
  products: ProductItem[];
  onReserve: (p: ProductItem, offer: string) => void;
  onNotice: (s: string) => void;
}) {
  const [items, setItems] = useState<any[]>([]),
    [amount, setAmount] = useState(product?.price || 0),
    [cash, setCash] = useState(0),
    [offered, setOffered] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const refresh = async () => setItems((await api("/offers")).offers);
  useEffect(() => {
    let active = true;
    api("/offers")
      .then((d) => {
        if (active) setItems(d.offers);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  async function act(id: string, action: string) {
    setBusy(true);
    try {
      await api("/offers/" + id + "/" + action, "POST", {});
      await refresh();
      onNotice("Đã cập nhật đề nghị.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const own = products.filter(
    (p) => p.seller.id === user.id && p.status === "available",
  );
  return (
    <div className="swap-form">
      {product && (
        <form
          className="swap-form"
          onSubmit={(e) => {
            e.preventDefault();
            setBusy(true);
            void api("/products/" + product.id + "/offer", "POST", {
              amount,
              cash,
              offeredProduct: offered,
            })
              .then(() => {
                onNotice("Đã gửi đề nghị. Chờ người bán phản hồi.");
                void refresh();
              })
              .catch((e) => setError(e.message))
              .finally(() => setBusy(false));
          }}
        >
          <h3>
            {product.tradeType === "swap"
              ? "Đề nghị đổi đồ"
              : "Gửi đề nghị giá"}
          </h3>
          <p>{product.title}</p>
          {product.tradeType === "swap" ? (
            <>
              <label>
                Món của bạn đem đổi
                <select
                  required
                  value={offered}
                  onChange={(e) => setOffered(e.target.value)}
                >
                  <option value="">Chọn món đang hiển thị</option>
                  {own.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Bù tiền (số dương: bạn bù; số âm: muốn nhận thêm)
                <input
                  type="number"
                  min={-100000000}
                  max={100000000}
                  value={cash}
                  onChange={(e) => setCash(Number(e.target.value))}
                />
              </label>
            </>
          ) : (
            <label>
              Giá bạn đề nghị (VNĐ)
              {product.tradeType === "borrow" ? " / ngày" : ""}
              <input
                required
                type="number"
                min={1}
                max={100000000}
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </label>
          )}
          <button className="swap-primary" disabled={busy}>
            Gửi đề nghị
          </button>
          <p className="swap-note">
            Đề nghị có hiệu lực 48 giờ. Chấp nhận đề nghị chưa giữ chỗ; người
            mua tiếp tục đặt giữ để khóa món.
          </p>
        </form>
      )}
      <div className="swap-list">
        <h3>Đề nghị đã gửi / đã nhận</h3>
        {items
          .filter((i) => !product || i.product_id === product.id)
          .map((i) => (
            <div key={i.id}>
              <b>{i.product.title}</b>
              <p>
                {i.buyer === user.id
                  ? "Gửi tới " + i.seller_name
                  : "Từ " + i.buyer_name}
              </p>
              <p>
                {i.offered
                  ? `Đổi lấy ${i.offered.title} · Bù tiền: ${i.cash.toLocaleString("vi-VN")}đ`
                  : `Giá đề nghị: ${i.amount.toLocaleString("vi-VN")}đ`}
              </p>
              <span className="swap-badge">
                {
                  (
                    {
                      pending: "Chờ phản hồi",
                      accepted: "Đã chấp nhận",
                      rejected: "Đã từ chối",
                      withdrawn: "Đã rút",
                      expired: "Hết hạn",
                      used: "Đã đặt giữ",
                    } as Record<string, string>
                  )[i.status]
                }
              </span>
              <div className="swap-actions">
                {i.status === "pending" &&
                  (i.seller === user.id ? (
                    <>
                      <button
                        disabled={busy}
                        onClick={() => void act(i.id, "accept")}
                      >
                        Chấp nhận
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => void act(i.id, "reject")}
                      >
                        Từ chối
                      </button>
                    </>
                  ) : (
                    <button
                      disabled={busy}
                      onClick={() => void act(i.id, "withdraw")}
                    >
                      Rút đề nghị
                    </button>
                  ))}
                {i.status === "accepted" && i.buyer === user.id && (
                  <button
                    className="swap-primary"
                    onClick={() => onReserve(i.product, i.id)}
                  >
                    Đặt giữ theo đề nghị
                  </button>
                )}
              </div>
            </div>
          ))}
        {!items.length && <p>Chưa có đề nghị.</p>}
      </div>
      {error && (
        <p role="alert" className="swap-error">
          {error}
        </p>
      )}
    </div>
  );
}
