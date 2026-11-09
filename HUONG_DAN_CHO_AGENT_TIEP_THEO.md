# HƯỚNG DẪN BÀN GIAO CHO AGENT TIẾP THEO (GOM GIAO DIỆN TINH TÚY)

> **LƯU Ý CỰC KỲ QUAN TRỌNG TỪ NGƯỜI DÙNG:**
> - `D:\SWAP` là **dự án chính** (hệ thống chính thống gồm Server Node.js + SQLite + Authentication + Orders + API).
> - `E:\SWAP` (cụ thể là `E:\SWAP\SWAP\SWAP`) là **dự án phụ**, nhưng chứa các **giao diện tinh túy và tính năng hay mà người dùng RẤT THÍCH VÀ YÊU CẦU PHẢI GIỮ LẠI**.
> - Nhiệm vụ của bạn: Khi nhận file tổng mới từ người dùng, **hãy bảo tồn và tích hợp đầy đủ các file tinh túy này vào `D:\SWAP`**, không để bị mất hoặc bị đè bởi code cũ.

---

## 1. DANH SÁCH CÁC FILE TINH TÚY ĐÃ ĐƯỢC BẢO TỒN

Các file sau đây đã được kiểm tra kỹ lưỡng, biên dịch không lỗi (`npm run build` thành công 100%):

1. **`CHI_TIET_SAN_PHAM.tsx` (size ~58.5 KB):**
   - **Giao diện Modal Chi Tiết Sản Phẩm (ProductDetailModal)** chuẩn mẫu mà người dùng chụp màn hình.
   - **Cột Trái:** Ảnh chính lớn + 4 ảnh chi tiết thumbnail; thông tin tiêu đề, giá bán, nhãn chứng nhận Campus Check, tags; Tabs chuyển đổi (Thông tin chi tiết, Tình trạng, Đánh giá 36, Hỏi đáp 5); 2 cột song song: *Bảng thông tin thông số* & *Checklist tình trạng kèm ghi chú*.
   - **Cột Phải:** Khối **Địa điểm giao nhận với Bản đồ tương tác Google Maps / Vệ tinh**, nút **Bật GPS**, tính khoảng cách km và thời gian di chuyển, nút **Chỉ đường trên Google Maps (từ GPS)**.
   - Cấu hình dữ liệu mẫu phong phú: `CONFIG_BOOK` (Giáo trình Kinh tế vi mô UEH), `CONFIG_MACBOOK` (Macbook Air M1), `CONFIG_SHOES` (Giày Adidas), v.v.

2. **`DANH_MUC_SAN_PHAM.tsx` (size ~34 KB):**
   - Trang danh mục sản phẩm hoàn chỉnh với bộ lọc đa cấp, chuyển chế độ hiển thị lưới/danh sách, phân trang, lọc theo ngành và tình trạng đồ dùng sinh viên.

3. **`DU_LIEU_DANH_MUC.ts` (size ~84.5 KB):**
   - Toàn bộ cơ sở dữ liệu danh mục chi tiết (Sách & giáo trình, Đồ công nghệ, Đồ phòng trọ, Thời trang, Thể thao, Handmade, Đồ học tập...).

---

## 2. CÁC NƠI LƯU TRỮ VÀ BACKUP AN TOÀN

Để tránh trường hợp người dùng copy file tổng đè mất, các file đã được sao lưu ở các vị trí an toàn:

- **Thư mục backup tại ổ D:** `D:\SWAP\backups_tinh_tuy_tu_E\`
- **Thư mục backup tại ổ E:** `E:\SWAP\SWAP\backups_tinh_tuy\`
- **Đã đặt sẵn tại thư mục gốc của D:**
  - `D:\SWAP\CHI_TIET_SAN_PHAM.tsx`
  - `D:\SWAP\DANH_MUC_SAN_PHAM.tsx`
  - `D:\SWAP\DU_LIEU_DANH_MUC.ts`
- **Re-exports đã tạo sẵn trong `D:\SWAP\src\`:**
  - `D:\SWAP\src\components\ProductDetailModal.tsx` -> trỏ ra `../../CHI_TIET_SAN_PHAM`
  - `D:\SWAP\src\components\CategoryCatalog.tsx` -> trỏ ra `../../DANH_MUC_SAN_PHAM`
  - `D:\SWAP\src\data\categoryData.ts` -> trỏ ra `../../DU_LIEU_DANH_MUC`

---

## 3. NGUYÊN TẮC TÍCH HỢP CHO AGENT TIẾP THEO

1. **Giữ nguyên hệ thống backend & dữ liệu thật:**
   - Không can thiệp làm hỏng `D:\SWAP\server\server.mjs`, `D:\SWAP\server\platform.mjs` và SQLite database tại `D:\SWAP\data\swap.sqlite`.
2. **Ưu tiên giao diện người dùng thích:**
   - Trong `D:\SWAP\src\App.tsx`, khi hiển thị chi tiết sản phẩm (khi `panel === "detail"` hoặc khi click vào món đồ), đảm bảo gọi hiển thị giao diện từ `CHI_TIET_SAN_PHAM.tsx` (hoặc `ProductDetailModal`).
   - Nếu cần tích hợp với các action của `D:\SWAP` (như đặt giữ món đồ `onReserve`, báo cáo `onReport`, nhắn tin `openConversationWithItem`), hãy truyền các hàm đó vào props của `ProductDetailModal` để vừa có giao diện GPS đẹp vừa giữ được nghiệp vụ của hệ thống.
3. **Kiểm tra biên dịch sau khi tích hợp:**
   - Luôn chạy lệnh:
     ```powershell
     cd /d D:\SWAP
     npm run build
     ```
   - Đảm bảo Vite build thành công không lỗi TypeScript.
