import { useEffect, useState } from "react";
import { api } from "../lib/api";
export function NotificationsPanel({
  onOpen,
}: {
  onOpen: (kind: string, target: string) => void;
}) {
  const [data, setData] = useState<any[]>([]),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api("/notifications")
      .then((d) => {
        if (active) setData(d.notifications);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="swap-list">
      <div className="swap-actions">
        <button
          onClick={() => {
            void api("/notifications", "PATCH", {})
              .then(() =>
                setData((prev) => prev.map((n) => ({ ...n, read: 1 }))),
              )
              .catch((e) => setError(e.message));
          }}
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>
      {data.map((n) => (
        <button
          key={n.id}
          className={n.read ? "" : "swap-unread"}
          onClick={() => {
            void api("/notifications", "PATCH", { id: n.id });
            onOpen(n.kind, n.target);
          }}
        >
          <b>
            {!n.read ? "● " : ""}
            {n.text}
          </b>
          <p>{new Date(n.created).toLocaleString("vi-VN")}</p>
        </button>
      ))}
      {!data.length && (
        <p>
          Chưa có thông báo. Tin nhắn, lịch hẹn và món phù hợp sẽ xuất hiện tại
          đây.
        </p>
      )}
      {error && <p className="swap-error">{error}</p>}
    </div>
  );
}
