import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { User } from "../types";
const labels: Record<string, string> = {
  reserved: "Đang giữ chỗ",
  completed: "Đã hoàn tất",
  cancelled: "Đã hủy",
  expired: "Giữ chỗ hết hạn",
  lent: "Đang cho mượn",
  returned: "Đã trả đồ",
};
const fmt = (s: string | number) =>
  s ? new Date(s).toLocaleString("vi-VN") : "Chưa hẹn";
export function ExchangePanel({
  user,
  onChange,
}: {
  user: User;
  onChange: () => void;
}) {
  const [items, setItems] = useState<any[]>([]),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(""),
    [codes, setCodes] = useState<
      Record<string, { code: string; expires: number }>
    >({}),
    [input, setInput] = useState<Record<string, string>>({}),
    [time, setTime] = useState(() => Date.now()),
    [editing, setEditing] = useState(""),
    [appointment, setAppointment] = useState(""),
    [place, setPlace] = useState(""),
    [due, setDue] = useState(""),
    [rating, setRating] = useState(5),
    [review, setReview] = useState(""),
    [reviewId, setReviewId] = useState("");
  const refresh = async () => setItems((await api("/exchanges")).exchanges);
  useEffect(() => {
    let active = true;
    const load = () =>
      api("/exchanges")
        .then((d) => {
          if (active) setItems(d.exchanges);
        })
        .catch((e) => {
          if (active) setError(e.message);
        });
    void load();
    const timer = setInterval(() => {
      setTime(Date.now());
      void load();
    }, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  async function act(id: string, action: string, body: unknown = {}) {
    setBusy(id);
    setError("");
    try {
      const d = await api("/exchanges/" + id + "/" + action, "POST", body);
      if (action === "code")
        setCodes((prev) => ({
          ...prev,
          [id]: { code: d.code, expires: d.expires },
        }));
      else {
        await refresh();
        onChange();
        setEditing("");
        setReviewId("");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }
  return (
    <div className="swap-list">
      <p className="swap-note">
        Giữ chỗ có hạn dùng. Mã bàn giao 6 số hết hạn sau 15 phút và chỉ dùng
        một lần. Với đồ mượn, giao dịch chỉ kết thúc sau khi người cho mượn xác
        nhận đã nhận lại.
      </p>
      {!items.length && (
        <p>Chưa có giao dịch. Bạn có thể đặt giữ ở trang chi tiết món đồ.</p>
      )}
      {items.map((e) => (
        <div key={e.id} className="swap-exchange">
          <span className="swap-badge">{labels[e.status] || e.status}</span>
          <h3>{e.product.title}</h3>
          <p>
            {e.seller === user.id
              ? "Người mua / mượn: " + e.buyer_name
              : "Người bán / cho mượn: " + e.seller_name}
          </p>
          <p>
            Tủ mô phỏng #{e.locker} · Điện thoại nhận: {e.phone}
          </p>
          <p>
            Giá thống nhất: {(e.agreed_price || 0).toLocaleString("vi-VN")}đ
            {e.product.tradeType === "borrow" ? " / ngày" : ""}
          </p>
          {e.offered && (
            <p>
              Đổi lấy: {e.offered.title} · Bù tiền:{" "}
              {(e.cash || 0).toLocaleString("vi-VN")}đ (dương: người đề nghị bù)
            </p>
          )}
          <p>
            Lịch nhận: {fmt(e.appointment)} · {e.place || e.product.meetingSpot}
          </p>
          {e.status === "reserved" && e.expires && (
            <p className="swap-countdown">
              Còn {Math.max(0, Math.ceil((e.expires - time) / 60000))} phút giữ
              chỗ · hết hạn {fmt(e.expires)}
            </p>
          )}
          {e.due && (
            <p
              className={
                e.status === "lent" && Date.parse(e.due) < time
                  ? "swap-error"
                  : ""
              }
            >
              Hạn trả: {fmt(e.due)}{" "}
              {e.status === "lent" && Date.parse(e.due) < time
                ? "· Đã quá hạn"
                : ""}
            </p>
          )}
          {e.completed && <small>Đóng giao dịch: {fmt(e.completed)}</small>}
          {e.status === "reserved" &&
            e.appointment_change &&
            (() => {
              const c = JSON.parse(e.appointment_change);
              return (
                <div className="swap-note">
                  <p>
                    Đề nghị lịch mới: {fmt(c.appointment)} · {c.place}
                  </p>
                  {c.by !== user.id ? (
                    <div className="swap-actions">
                      <button
                        disabled={busy === e.id}
                        onClick={() => void act(e.id, "accept-appointment")}
                      >
                        Đồng ý lịch mới
                      </button>
                      <button
                        disabled={busy === e.id}
                        onClick={() => void act(e.id, "reject-appointment")}
                      >
                        Từ chối
                      </button>
                    </div>
                  ) : (
                    <p>Đang chờ bên kia xác nhận. Lịch cũ vẫn còn hiệu lực.</p>
                  )}
                </div>
              );
            })()}
          {e.status === "reserved" && (
            <>
              <div className="swap-actions">
                {e.seller === user.id ? (
                  <button
                    className="swap-primary"
                    disabled={busy === e.id}
                    onClick={() => void act(e.id, "code")}
                  >
                    Tạo mã bàn giao
                  </button>
                ) : (
                  <form
                    className="swap-chat-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void act(e.id, "complete", { code: input[e.id] });
                    }}
                  >
                    <input
                      aria-label="Mã nhận đồ"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={input[e.id] || ""}
                      onChange={(event) =>
                        setInput({ ...input, [e.id]: event.target.value })
                      }
                      placeholder="Mã 6 số từ người bán"
                    />
                    <button className="swap-primary" disabled={busy === e.id}>
                      Đã nhận đồ
                    </button>
                  </form>
                )}
                <button
                  onClick={() => {
                    setEditing(editing === e.id ? "" : e.id);
                    setPlace(e.place || e.product.meetingSpot);
                  }}
                >
                  Đổi lịch hẹn
                </button>
                <button
                  disabled={busy === e.id}
                  onClick={() => void act(e.id, "cancel")}
                >
                  Hủy giữ chỗ
                </button>
              </div>
              {codes[e.id] && codes[e.id].expires > time && (
                <p className="swap-code">
                  {codes[e.id].code}
                  <small>
                    Hết hạn {fmt(codes[e.id].expires)}. Chỉ đưa mã khi hoàn tất
                    kiểm tra và nhận đủ tiền/món đổi.
                  </small>
                </p>
              )}
              {editing === e.id && (
                <form
                  className="swap-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void act(e.id, "appointment", {
                      appointment: new Date(appointment).toISOString(),
                      place,
                    });
                  }}
                >
                  <label>
                    Lịch mới
                    <input
                      required
                      type="datetime-local"
                      value={appointment}
                      onChange={(event) => setAppointment(event.target.value)}
                    />
                  </label>
                  <label>
                    Điểm hẹn
                    <input
                      required
                      minLength={5}
                      maxLength={200}
                      value={place}
                      onChange={(event) => setPlace(event.target.value)}
                    />
                  </label>
                  <button disabled={busy === e.id}>Gửi đề nghị đổi lịch</button>
                </form>
              )}
            </>
          )}
          {e.status === "lent" && (
            <>
              <div className="swap-actions">
                {e.buyer === user.id ? (
                  <>
                    <button
                      disabled={busy === e.id || e.return_requested}
                      onClick={() => void act(e.id, "request-return")}
                    >
                      {e.return_requested
                        ? "Đã báo trả — chờ xác nhận"
                        : "Tôi đã trả đồ"}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(editing === e.id ? "" : e.id);
                        setDue("");
                      }}
                    >
                      Đề nghị gia hạn
                    </button>
                  </>
                ) : e.return_requested ? (
                  <button
                    className="swap-primary"
                    disabled={busy === e.id}
                    onClick={() => void act(e.id, "confirm-return")}
                  >
                    Xác nhận đã nhận lại đồ
                  </button>
                ) : (
                  <span>Chờ người mượn trả đồ.</span>
                )}
                {e.seller === user.id && e.extension_status === "pending" && (
                  <>
                    <button
                      disabled={busy === e.id}
                      onClick={() => void act(e.id, "accept-extension")}
                    >
                      Đồng ý gia hạn đến {fmt(e.extension)}
                    </button>
                    <button
                      disabled={busy === e.id}
                      onClick={() => void act(e.id, "reject-extension")}
                    >
                      Từ chối gia hạn
                    </button>
                  </>
                )}
              </div>
              {editing === e.id && e.buyer === user.id && (
                <form
                  className="swap-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void act(e.id, "extend", {
                      due: new Date(due).toISOString(),
                    });
                  }}
                >
                  <label>
                    Hạn trả đề nghị
                    <input
                      required
                      type="datetime-local"
                      value={due}
                      onChange={(event) => setDue(event.target.value)}
                    />
                  </label>
                  <button disabled={busy === e.id}>Gửi đề nghị gia hạn</button>
                </form>
              )}
              {e.extension_status === "pending" && (
                <p>
                  Đề nghị hạn trả mới: {fmt(e.extension)} · Chờ người cho mượn
                  đồng ý
                </p>
              )}
            </>
          )}
          {["completed", "returned"].includes(e.status) && !e.reviewed && (
            <>
              <button
                className="swap-review-button"
                onClick={() => {
                  setReviewId(reviewId === e.id ? "" : e.id);
                  setReview("");
                  setRating(5);
                }}
              >
                ★ Đánh giá giao dịch
              </button>
              {reviewId === e.id && (
                <form
                  className="swap-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void act(e.id, "review", { rating, text: review });
                  }}
                >
                  <label>
                    Số sao
                    <select
                      value={rating}
                      onChange={(event) =>
                        setRating(Number(event.target.value))
                      }
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {"★".repeat(n)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Trải nghiệm của bạn
                    <textarea
                      required
                      minLength={5}
                      maxLength={1000}
                      value={review}
                      onChange={(event) => setReview(event.target.value)}
                    />
                  </label>
                  <button className="swap-primary" disabled={busy === e.id}>
                    Gửi đánh giá
                  </button>
                </form>
              )}
            </>
          )}
          {e.reviewed && <p>✓ Bạn đã đánh giá giao dịch này</p>}
        </div>
      ))}
      {error && (
        <p role="alert" className="swap-error">
          {error}
        </p>
      )}
    </div>
  );
}
