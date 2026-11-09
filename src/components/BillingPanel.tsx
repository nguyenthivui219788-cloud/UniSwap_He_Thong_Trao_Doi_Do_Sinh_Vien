import { useEffect, useState, useRef } from "react";
import { api } from "../lib/api";
export function BillingPanel({
  onChange,
  onNotice,
}: {
  onChange: () => void;
  onNotice: (s: string) => void;
}) {
  const [orders, setOrders] = useState<any[]>([]),
    [config, setConfig] = useState<any>({}),
    [busy, setBusy] = useState(""),
    [error, setError] = useState("");
  const callback=useRef(onChange);useEffect(()=>{callback.current=onChange},[onChange]);
  const previous=useRef<Record<string,string>>({});
  const refresh = async () => setOrders((await api("/orders")).orders);
  useEffect(() => {
    let active = true;
    const timer = setInterval(() => {
      api("/orders")
        .then((d) => {
          if (active) {if(d.orders.some((o:any)=>previous.current[o.id]&&previous.current[o.id]!==o.status&&["paid","simulated"].includes(o.status)))callback.current();previous.current=Object.fromEntries(d.orders.map((o:any)=>[o.id,o.status]));setOrders(d.orders)}
        })
        .catch(() => {});
    }, 5000);
    Promise.all([api("/orders"), api("/config")])
      .then(([o, c]) => {
        if (active) {
          setOrders(o.orders);previous.current=Object.fromEntries(o.orders.map((o:any)=>[o.id,o.status]));
          setConfig(c);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);
  async function act(id: string, action: string) {
    setBusy(id);
    try {
      const d = await api("/orders/" + id + "/" + action, "POST", {});
      if (d.url) {
        location.assign(d.url);
        return;
      }
      await refresh();
      onChange();
      onNotice(d.message || "Đã cập nhật đăng ký.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }
  const labels: Record<string, string> = {
    buyer: "Premium người mua",
    seller: "Premium người bán",
    both: "Premium mua & bán",
    month: "Pro 1 tháng",
    semester: "Pro 5 tháng",
    year: "Pro 12 tháng",
    push1d: "Đẩy tin 1 ngày",
    push3d: "Đẩy tin 3 ngày",
    combo5: "Đẩy tin 5 ngày",
  };
  return (
    <div className="swap-list">
      <p className="swap-note">
        {config.paymentConfigured
          ? `Cổng VNPAY ${config.paymentSandbox ? "thử nghiệm" : "đang cấu hình cho thanh toán thật"}. Chỉ kích hoạt sau thông báo hợp lệ từ cổng thanh toán.`
          : "Cổng thanh toán chưa kết nối. Đăng ký vẫn được lưu; không có khoản tiền nào được thu."}
      </p>
      {orders.map((o) => (
        <div key={o.id}>
          <b>{labels[o.plan] || o.plan}</b>
          <p>
            {o.amount.toLocaleString("vi-VN")}đ ·{" "}
            {
              (
                {
                  paid: "Đã thanh toán",
                  simulated: "Đã kích hoạt thử — không thu tiền",
                  pending: "Chờ thanh toán",
                  processing: "Đang chờ xác nhận từ cổng thanh toán",
                  pending_configuration: "Chờ cấu hình thanh toán",
                  failed: "Chưa thanh toán thành công",
                  cancelled: "Đã hủy",
                  expired:"Liên kết thanh toán đã hết hạn",
                } as Record<string, string>
              )[o.status]
            }
          </p>
          <small>
            {new Date(o.created).toLocaleString("vi-VN")} · {o.id}
          </small>
          {["pending", "pending_configuration", "failed", "processing", "expired"].includes(
            o.status,
          ) && (
            <div className="swap-actions">
              {config.paymentConfigured && (
                <button
                  className="swap-primary"
                  disabled={busy === o.id}
                  onClick={() => void act(o.id, "checkout")}
                >
                  {o.status==="processing"?"Tiếp tục tại VNPAY":"Thanh toán qua VNPAY"}
                </button>
              )}
              {config.localMode && (
                <button
                  disabled={busy === o.id}
                  onClick={() => void act(o.id, "simulate")}
                >
                  Kích hoạt mô phỏng trên máy
                </button>
              )}
              <button
                disabled={busy === o.id||o.status==='processing'}
                onClick={() => void act(o.id, "cancel")}
              >
                Hủy đăng ký
              </button>
            </div>
          )}
        </div>
      ))}
      {!orders.length && <p>Chưa có đăng ký dịch vụ.</p>}
      {error && (
        <p className="swap-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
