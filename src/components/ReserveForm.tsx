import { useState } from "react";
import { api } from "../lib/api";
import type { ProductItem, User } from "../types";
export function ReserveForm({
  product,
  user,
  offerId,
  onSaved,
}: {
  product: ProductItem;
  user: User;
  offerId?: string;
  onSaved: () => void;
}) {
  const [phone, setPhone] = useState(""),
    [appointment, setAppointment] = useState(""),
    [place, setPlace] = useState(product.meetingSpot),
    [due, setDue] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <form
      className="swap-form"
      onSubmit={(e) => {
        e.preventDefault();
        setBusy(true);
        void api("/exchanges", "POST", {
          productId: product.id,
          phone,
          offerId,
          appointment: appointment
            ? new Date(appointment).toISOString()
            : undefined,
          place,
          due: due ? new Date(due).toISOString() : undefined,
        })
          .then(onSaved)
          .catch((e) => setError(e.message))
          .finally(() => setBusy(false));
      }}
    >
      <h3>{product.title}</h3>
      <p>Người nhận: {user.name}</p>
      {offerId && (
        <p className="swap-note">Áp dụng đề nghị đã được hai bên chấp nhận.</p>
      )}
      <label>
        Số điện thoại nhận đồ
        <input
          type="tel"
          required
          pattern="(0|[+]84)[0-9]{9,10}"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="09xxxxxxxx"
        />
      </label>
      <label>
        Lịch nhận đồ (tùy chọn, trong 7 ngày)
        <input
          type="datetime-local"
          value={appointment}
          onChange={(e) => setAppointment(e.target.value)}
        />
      </label>
      <label>
        Điểm hẹn công cộng
        <input
          required
          minLength={5}
          maxLength={200}
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        />
      </label>
      {product.tradeType === "borrow" && (
        <label>
          Hạn trả đồ
          <input
            required
            type="datetime-local"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </label>
      )}
      <p className="swap-note">
        Giữ chỗ tự hết hạn sau 24 giờ nếu chưa có lịch, hoặc 2 giờ sau lịch
        nhận. Gói của bạn giữ tối đa {user.limits?.holds||3} món. Tủ và mã bàn giao là mô phỏng; số
        điện thoại chỉ hiển thị với các bên.
      </p>
      {error && (
        <p className="swap-error" role="alert">
          {error}
        </p>
      )}
      <button className="swap-primary" disabled={busy}>
        {busy ? "Đang giữ chỗ…" : "Xác nhận đặt giữ"}
      </button>
    </form>
  );
}
