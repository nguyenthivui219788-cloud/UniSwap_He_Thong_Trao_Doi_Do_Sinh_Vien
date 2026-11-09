# Bàn giao UniSwap v2 — 27/10/2026

Đã cập nhật trực tiếp `D:\SWAP`, giữ cơ sở dữ liệu sử dụng. Bản sao trước cập nhật: `D:\SWAP-backup-20261027-b0f4111d`; trong đó `swap-consistent.sqlite` là ảnh chụp SQLite nhất quán. Bản gốc trước đợt sửa đầu tiên vẫn ở `D:\SWAP-backup-20261026-97a1339d`.

## Kết quả kiểm tra

- `npm run lint`: không báo lỗi/cảnh báo.
- `npm run build`: hoàn tất TypeScript/Vite.
- `npm test`: **33/33** kiểm thử đạt trên bản tại `D:\SWAP`.
- Đã thử đăng nhập, hồ sơ, lưu bản nháp chưa đủ thông tin và mở trực tiếp link sản phẩm trong trình duyệt bằng dữ liệu kiểm thử riêng. Bản nháp không chiếm suất đăng.
- Đã thử sao lưu SQLite và dừng/chạy lại web. Tài khoản kiểm thử không được chép sang dữ liệu sử dụng.
- Chưa kiểm tra trên điện thoại vật lý, tài khoản SMTP/VNPAY thật hoặc khóa tủ thật.

## Điểm mới chính

Tài khoản có xác minh/khôi phục, hồ sơ, thu hồi phiên; người mua có tin cần tìm, đề nghị giá/đổi món; người bán có bản nháp, xem trước, ảnh bìa/sắp xếp ảnh, thuộc tính danh mục, bộ đồ, quản lý trạng thái và hạn mức. Giao dịch có thời hạn, lịch hẹn được hai bên xác nhận, vòng mượn/trả/gia hạn và đánh giá sau hoàn tất.

Thêm theo dõi/chặn người bán, thông báo món phù hợp, hộp thư có chưa đọc/đã đọc, cộng đồng có lịch/sức chứa/thành viên, trang quản trị và luồng dịch vụ có thời hạn. Hiệu ứng gồm đổi màu khi rê chuột, nâng thẻ/zoom ảnh nhẹ, chuyển cảnh hộp thoại, trạng thái tải và xuất hiện khi cuộn; hỗ trợ giảm chuyển động.

## Sử dụng ngay

- Mở http://localhost:5173.
- Tài khoản cũ chưa xác minh: vào **Tài khoản → Gửi lại liên kết xác minh**. Nếu chưa có SMTP, liên kết thử trên máy được ghi rõ trong giao diện.
- Chạy/dừng: `CHAY_WEB_UNISWAP.bat` / `DUNG_WEB_UNISWAP.bat`.
- Quản trị: chỉ người được cấp bằng lệnh cục bộ mới có quyền; xem tài liệu cấu hình.

## Phần cần dịch vụ và nhân sự vận hành

Email thật cần SMTP của đơn vị. Thanh toán thật cần merchant VNPAY, HTTPS và kiểm thử tích hợp. Tủ thật cần phần cứng, cảm biến và quy trình kiểm tra ngăn trống. Các phần mô phỏng được gắn nhãn và không có hiệu lực như quyền thật khi chạy chế độ production.

Đọc [cấu hình](CAU_HINH_V2.md) và [phương án vận hành ngoài đời](VAN_HANH_THUC_TE.md). Nên thử trong một trường/KTX, với sách và đồ học tập, điểm giao nhận được đồng ý và nhóm hỗ trợ nhỏ trước khi mở rộng.
