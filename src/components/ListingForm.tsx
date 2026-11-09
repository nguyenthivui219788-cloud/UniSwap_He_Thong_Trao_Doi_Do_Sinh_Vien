import {UNIVERSITIES} from "../data/mockData";
import {PackagePlus,ImagePlus,MapPin,Check,Save,Eye} from "lucide-react";
import {CATEGORY_TREE,classifyTitle,type CategoryId} from "../../shared/catalog";
import { useState, type FormEvent } from "react";
import type { ProductItem, CampusCluster } from "../types";
import { api } from "../lib/api";
import { categories, clusters, trades } from "../lib/market";
export function ListingForm({
  item,
  onSaved,
  imageLimit = 5,
  campus,
}: {
  campus?:string;
  imageLimit?: number;
  item?: ProductItem;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: item?.title || "",
    description: item?.description || "",
    tradeType: item?.tradeType || "sale",
    category: item?.category || "books",
    subcategory:item?.subcategory||"other",
    price: item?.price || 0,
    condition: item?.condition || "Đã qua sử dụng",
    cluster: item?.cluster || (UNIVERSITIES.find(u=>u.code===campus)?.cluster||"lang-dh") as CampusCluster,
    meetingSpot: item?.meetingSpot || "",
    swapFor: item?.swapFor || "",
    borrowDuration: item?.borrowDuration || "",
    images: item?.images || [],
    location: item?.location,
    specs: item?.specs || ({} as Record<string, string>),
  });
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [reading, setReading] = useState(false);
  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  async function upload(files: FileList | null) {
    if (!files) return;
    setReading(true);
    setError("");
    try {
      if (form.images.length + files.length > imageLimit)
        throw new Error(`Tối đa ${imageLimit} ảnh.`);
      const images: string[] = [];
      for (const file of Array.from(files)) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 10 * 1024 * 1024
        )
          throw new Error("Chọn ảnh JPG/PNG/WebP dưới 10 MB.");
        const bitmap = await createImageBitmap(file),
          canvas = document.createElement("canvas"),
          scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        canvas
          .getContext("2d")!
          .drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        const image = canvas.toDataURL("image/jpeg", 0.78);
        if (image.length > 1400000)
          throw new Error("Ảnh quá lớn sau khi tối ưu. Hãy chọn ảnh nhỏ hơn.");
        images.push(image);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...images] }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setReading(false);
    }
  }
  const [preview, setPreview] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api(
        "/products" + (item ? "/" + item.id : ""),
        item ? "PATCH" : "POST",
        {
          ...form,
          status:
            (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") ===
            "draft"
              ? "draft"
              : item?.status === "draft"
                ? "available"
                : undefined,
        },
      );
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="swap-form listing-composer" onSubmit={submit}>
      <div className="listing-compose-intro"><div><small><PackagePlus size={16}/> CHO MÓN ĐỒ MỘT VÒNG ĐỜI MỚI</small><h3>{item?'Chỉnh sửa món đồ của bạn':'Món đồ tốt, tìm người cần.'}</h3><p>Thông tin rõ ràng và ảnh thật giúp hai bên trao đổi dễ hơn.</p></div><img src="/assets/3d-fashion.png" alt="Minh họa đăng tin"/></div>
      <div className="listing-compose-progress"><span className={form.title.length>=5?'complete':''}><PackagePlus size={17}/>Thông tin món {form.title.length>=5&&<Check size={14}/>}</span><span className={form.images.length?'complete':''}><ImagePlus size={17}/>Ảnh thực tế {form.images.length>0&&<Check size={14}/>}</span><span className={form.meetingSpot.length>=5?'complete':''}><MapPin size={17}/>Điểm hẹn {form.meetingSpot.length>=5&&<Check size={14}/>}</span></div>

      <label>
        Tiêu đề
        <input
          required
          minLength={5}
          maxLength={120}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Ví dụ: Giáo trình Giải tích 1 còn mới"
        />
      </label>
      <div className="swap-form-row">
        <label>
          Hình thức
          <select
            value={form.tradeType}
            onChange={(e) => set("tradeType", e.target.value)}
          >
            {Object.entries(trades)
              .filter(([k]) => k !== "all")
              .map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
          </select>
        </label>
        <label>
          Danh mục
          <select
            value={form.category}
            onChange={(e) => setForm(prev=>({...prev,category:e.target.value as CategoryId,subcategory:"other"}))}
          >
            {Object.entries(categories)
              .filter(([k]) => k !== "all")
              .map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
          </select>
        </label>
      </div>
      <label>Phân loại chi tiết<select value={form.subcategory} onChange={e=>set('subcategory',e.target.value)}>{Object.entries(CATEGORY_TREE[form.category].children).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
      {classifyTitle(form.title)&&classifyTitle(form.title)!.category!==form.category&&<p className="swap-note">Gợi ý theo tên: {CATEGORY_TREE[classifyTitle(form.title)!.category].label}. <button type="button" onClick={()=>{const hint=classifyTitle(form.title)!;setForm(prev=>({...prev,...hint}))}}>Áp dụng gợi ý</button></p>}
      {["sale", "borrow"].includes(form.tradeType) && (
        <label>
          Giá (VNĐ){form.tradeType === "borrow" ? " / ngày" : ""}
          <input
            required
            type="number"
            min={1}
            max={100000000}
            step={1}
            value={form.price || ""}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </label>
      )}
      {form.tradeType === "swap" && (
        <label>
          Món muốn đổi
          <input
            required
            maxLength={200}
            value={form.swapFor}
            onChange={(e) => set("swapFor", e.target.value)}
          />
        </label>
      )}
      {form.tradeType === "borrow" && (
        <label>
          Thời hạn cho mượn
          <input
            required
            maxLength={100}
            value={form.borrowDuration}
            onChange={(e) => set("borrowDuration", e.target.value)}
            placeholder="Ví dụ: tối đa 3 ngày"
          />
        </label>
      )}
      <label>
        Tình trạng
        <select
          value={form.condition}
          onChange={(e) => set("condition", e.target.value)}
        >
          {Array.from(
            new Set([
              form.condition,
              "Mới 100%",
              "Như mới",
              "Đã qua sử dụng",
              "Cần sửa chữa",
            ]),
          ).map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <div className="swap-spec-fields">
        {(form.category === "books"
          ? [
              ["subject", "Môn học"],
              ["major", "Ngành học"],
              ["edition", "Phiên bản / năm xuất bản"],
            ]
          : form.category === "electronics"
            ? [
                ["configuration", "Cấu hình"],
                ["accessories", "Phụ kiện"],
                ["faults", "Lỗi / tình trạng cần lưu ý"],
              ]
            : form.category === "fashion"
              ? [["size", "Kích thước / size"]]
              : []
        ).map(([k, v]) => (
          <label key={k}>
            {v}
            <input
              maxLength={250}
              value={form.specs[k] || ""}
              onChange={(e) =>
                set("specs", { ...form.specs, [k]: e.target.value })
              }
            />
          </label>
        ))}
        <label>
          Tên bộ đồ (nếu bán theo bộ)
          <input
            maxLength={250}
            value={form.specs.bundle || ""}
            onChange={(e) =>
              set("specs", { ...form.specs, bundle: e.target.value })
            }
            placeholder="Ví dụ: Bộ dọn phòng tốt nghiệp"
          />
        </label>
        <label>
          Thời gian thuận tiện nhận đồ
          <input
            maxLength={250}
            value={form.specs.pickupWindow || ""}
            onChange={(e) =>
              set("specs", { ...form.specs, pickupWindow: e.target.value })
            }
            placeholder="Ví dụ: Chiều thứ bảy tại KTX"
          />
        </label>
      </div>
      <label>
        Mô tả
        <textarea
          required
          minLength={10}
          maxLength={5000}
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Tình trạng thực tế, phụ kiện, lỗi nếu có và cách trao đổi…"
        />
      </label>
      <label>
        Khu vực
        <select
          value={form.cluster}
          onChange={(e) => set("cluster", e.target.value)}
        >
          {Object.entries(clusters)
            .filter(([k]) => k !== "all")
            .map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
        </select>
      </label>
      <label>
        Điểm hẹn công cộng
        <input
          required
          minLength={5}
          maxLength={200}
          value={form.meetingSpot}
          onChange={(e) => set("meetingSpot", e.target.value)}
          placeholder="Sảnh thư viện, cổng trường…"
        />
      </label>
      <div className="swap-note">
        <button
          type="button"
          onClick={() => {
            if (!navigator.geolocation) {
              setError("Trình duyệt không hỗ trợ định vị.");
              return;
            }
            navigator.geolocation.getCurrentPosition(
              (p) =>
                set("location", {
                  lat: p.coords.latitude,
                  lng: p.coords.longitude,
                }),
              () =>
                setError(
                  "Không lấy được vị trí. Bạn vẫn có thể đăng theo khu vực.",
                ),
              { timeout: 10000 },
            );
          }}
        >
          {form.location
            ? "✓ Đã gắn vị trí — lấy lại"
            : "Gắn vị trí hiện tại cho tìm kiếm gần bạn"}
        </button>
        {form.location && (
          <button type="button" onClick={() => set("location", undefined)}>
            Bỏ vị trí
          </button>
        )}
        <p>
          Chỉ gắn khi bạn đang ở điểm hẹn công cộng. Tọa độ này sẽ hiển thị với
          bài đăng.
        </p>
      </div>
      <label>
        Ảnh thật của món đồ (tối đa {imageLimit} ảnh)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={reading}
          onChange={(e) => {
            void upload(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      <div className="swap-upload">
        {form.images.map((src, i) => (
          <div key={src.slice(-30) + i}>
            <div className="swap-image-order">
              <button
                type="button"
                disabled={i === 0}
                aria-label={`Đưa ảnh ${i + 1} lên trước`}
                onClick={() => {
                  const imgs = [...form.images];
                  [imgs[i - 1], imgs[i]] = [imgs[i], imgs[i - 1]];
                  set("images", imgs);
                }}
              >
                ←
              </button>
              <button
                type="button"
                disabled={i === form.images.length - 1}
                aria-label={`Đưa ảnh ${i + 1} ra sau`}
                onClick={() => {
                  const imgs = [...form.images];
                  [imgs[i], imgs[i + 1]] = [imgs[i + 1], imgs[i]];
                  set("images", imgs);
                }}
              >
                →
              </button>
            </div>
            <img src={src} alt={`Ảnh món đồ ${i + 1}`} />
            <button
              type="button"
              onClick={() =>
                set(
                  "images",
                  form.images.filter((_, n) => n !== i),
                )
              }
              aria-label={`Xóa ảnh ${i + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {reading && <p role="status">Đang tối ưu ảnh…</p>}
      {error && (
        <p role="alert" className="swap-error">
          {error}
        </p>
      )}
      <p className="swap-note">
        Ảnh đầu tiên là ảnh bìa. Dùng nút mũi tên để sắp xếp ảnh.
      </p>
      <div className="swap-actions">
        <button
          type="submit"
          value="draft"
          formNoValidate
          disabled={busy || reading}
        >
          <Save size={16}/> Lưu bản nháp
        </button>
        <button type="button" onClick={() => setPreview(!preview)}>
          <Eye size={16}/>{preview ? "Đóng xem trước" : "Xem trước bài đăng"}
        </button>
      </div>
      {preview && (
        <div className="swap-listing-preview">
          {form.images[0] && (
            <img src={form.images[0]} alt="Ảnh bìa xem trước" />
          )}
          <h3>{form.title || "Tiêu đề của bạn"}</h3>
          <b>
            {form.tradeType === "giveaway"
              ? "Miễn phí"
              : form.tradeType === "swap"
                ? "Trao đổi"
                : form.price.toLocaleString("vi-VN") + "đ"}
          </b>
          <p>{form.description}</p>
          <small>{form.meetingSpot}</small>
        </div>
      )}
      <button
        className="swap-primary"
        disabled={busy || reading || form.images.length === 0}
      >
        {busy
          ? "Đang lưu…"
          : item?.status === "draft"
            ? "Xuất bản nháp"
            : item
              ? "Lưu thay đổi"
              : "Đăng tin miễn phí"}
      </button>
    </form>
  );
}
