import { useEffect, useState } from "react";
import { api } from "../lib/api";
export function SellerStats({ onUpgrade }: { onUpgrade: () => void }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    let active = true;
    api("/seller-stats")
      .then((d) => {
        if (active) setData(d);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  if (!data) return null;
  return (
    <div className="swap-seller-stats">
      <div className="swap-stat-grid">
        <div>
          <strong>{data.summary.views}</strong>
          <span>Lượt xem thực</span>
        </div>
        <div>
          <strong>{data.summary.likes}</strong>
          <span>Lượt lưu</span>
        </div>
        <div>
          <strong>{data.summary.inquiries}</strong>
          <span>Cuộc liên hệ</span>
        </div>
      </div>
      {data.daily ? (
        <details>
          <summary>Thống kê theo ngày · 30 ngày gần đây</summary>
          {data.daily.length ? (
            data.daily.map((d: any) => (
              <p key={d.day}>
                {d.day} · {d.views} lượt xem
              </p>
            ))
          ) : (
            <p>Chưa có lượt xem trong 30 ngày qua.</p>
          )}
        </details>
      ) : (
        <button onClick={onUpgrade}>
          Xem thống kê theo ngày với Premium →
        </button>
      )}
    </div>
  );
}
