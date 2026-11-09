# Bản nâng cấp Premium

- Xem ba gói tại http://localhost:5173/?page=premium sau khi chạy web.
- Bàn giao và quyền lợi: [docs/BAN_GIAO_PREMIUM.md](docs/BAN_GIAO_PREMIUM.md).
- Học và kết nối API: [docs/HUONG_DAN_API_THUC_HANH.md](docs/HUONG_DAN_API_THUC_HANH.md).
- VNPAY/SMTP cần thông tin dịch vụ riêng trong .env để vận hành thật. Mô phỏng local không thu tiền.

# UniSwap — Trao đổi đồ sinh viên

Bản mở rộng ngày **27/10/2026**: React/TypeScript/Vite, Node.js và SQLite. Giữ dữ liệu tài khoản, bài đăng và giao dịch hiện có; cập nhật cấu trúc dữ liệu tự động khi khởi động.

## Chạy trên Windows

Yêu cầu Node.js **24 trở lên**.

```text
cd /d D:\SWAP
npm ci
npm run dev
```

Mở **http://localhost:5173**. Có thể bấm đúp `CHAY_WEB_UNISWAP.bat`. Giữ cửa sổ chạy web mở. Dùng `DUNG_WEB_UNISWAP.bat` để dừng đúng phiên của thư mục này trước khi khởi chạy lại.

Chạy bản đã biên dịch: `npm run build`, sau đó `npm start`, mở **http://localhost:3001**. Không mở file `index.html` trực tiếp.

## Các chức năng hiện có

- Đăng ký email trường; chọn người mua/người bán/cả hai; hồ sơ, ảnh đại diện, xác minh email, quên/đổi mật khẩu và thu hồi phiên đăng nhập.
- Đăng bán/đổi/tặng/cho mượn; bản nháp, xem trước, ảnh bìa, sắp xếp ảnh, thuộc tính theo danh mục, tên bộ đồ và lịch nhận thuận tiện.
- Quản lý tin theo trạng thái, tạm ẩn, hết hạn, đăng lại có thời gian chờ; hạn mức Free/Premium và thống kê lượt xem/lưu/liên hệ.
- Tìm kiếm tiếng Việt không dấu, theo môn/ngành/phiên bản và thông tin sản phẩm; lọc khu vực/trường/hình thức/giá/tình trạng; tìm theo khoảng cách với tọa độ thật.
- Tin cần mua/cần tìm: ngân sách, thời điểm cần, khu vực; người bán gợi ý món của mình.
- Đề nghị giá; đổi món hai chiều và bù tiền; đặt giữ chống trùng, lịch hẹn, thay đổi lịch cần bên kia đồng ý, tự hết hạn giữ chỗ.
- Vòng mượn/trả đồ, đề nghị gia hạn, xác nhận trả và nhắc hẹn trong ứng dụng.
- Mô phỏng 24 ngăn tủ; mã nhận dùng một lần, hết hạn 15 phút, giới hạn nhập sai; giữ bản thông tin tại thời điểm giao dịch.
- Yêu thích, lịch sử xem trên thiết bị, bộ lọc đã lưu và thông báo khi có món phù hợp; theo dõi/chặn người bán; đánh giá một lần sau giao dịch.
- Tin nhắn riêng tư, hộp thư có số chưa đọc và trạng thái đã đọc.
- Cộng đồng đọc sách/học nhóm/gia sư theo giờ: lịch, sức chứa, đăng ký/rời nhóm, đóng/mở nhận thành viên, phản hồi.
- Đăng ký dịch vụ có thời hạn; luồng VNPAY có kiểm tra chữ ký và số tiền; mô phỏng được gắn nhãn trong chế độ cục bộ.
- Trang quản trị có phân quyền: báo cáo, ẩn/khôi phục tin, xử lý báo cáo, tạm khóa tài khoản và nhật ký.
- Hiệu ứng rê chuột/chuyển màu nhẹ, ảnh phóng vừa phải, chuyển cảnh hộp thoại, thẻ xuất hiện khi cuộn và trạng thái đang tải. Tôn trọng lựa chọn giảm chuyển động của thiết bị; có thanh điều hướng điện thoại.

Các bài mẫu có nhãn rõ ràng, không nhận đặt giữ hoặc có người bán tự trả lời giả.

## Cấu hình và vận hành

- [Cấu hình email, Premium, VNPAY và quản trị](docs/CAU_HINH_V2.md).
- [Phương án vận hành ngoài đời và thử trong 4 tuần](docs/VAN_HANH_THUC_TE.md).
- [Báo cáo rà soát ảnh và ghi âm của bản ban đầu](docs/BAO_CAO_RA_SOAT.md).

**Chưa có dịch vụ bên ngoài được tự cấu hình:** email thật cần SMTP của bạn; thanh toán thật cần merchant VNPAY và kiểm tra tích hợp; tủ thật cần thiết bị và quy trình xác nhận ngăn trống. Link xác minh và kích hoạt Premium trong chế độ thử không chứng minh có email/tiền thật. Không tự tạo tài khoản quản trị mặc định.

Tài khoản cũ chưa xác minh cần vào **Tài khoản → Gửi lại liên kết xác minh**. Trên localhost, khi chưa có SMTP, có liên kết thử được gắn nhãn. Khi vận hành, dùng `NODE_ENV=production`, `SWAP_MODE=production`, HTTPS và cấu hình dịch vụ thật; quyền mô phỏng không có hiệu lực ở chế độ này.

Dữ liệu SQLite ở `data/swap.sqlite`; `.env` và `data/` không đưa lên Git hoặc phục vụ công khai. Mặc định máy chủ chỉ nghe ở `127.0.0.1`; triển khai qua reverse proxy HTTPS. Chi tiết trong tài liệu cấu hình.

## Kiểm tra

```text
npm run lint
npm run build
npm test
```

Kiểm thử dùng cơ sở dữ liệu và tài khoản giả riêng trong `.cache`, không trộn với dữ liệu sử dụng. Điểm bắt đầu của mã là `src/App.tsx`; phần nghiệp vụ mở rộng ở `server/platform.mjs`, API nền ở `server/server.mjs`. Phần giao diện cũ trong `legacy/` chỉ để tham khảo, không biên dịch vào ứng dụng.

Bản demo trang phụ: [docs/DEMO_TRANG_PHU.md](docs/DEMO_TRANG_PHU.md). Mở http://localhost:5173/kho-demo sau khi chạy web.
