# Cấu hình bản mở rộng UniSwap

## Chạy và thử nhanh

Giữ nguyên Node.js 24+. Sau cập nhật chạy `npm ci`, rồi `npm run dev`; mở http://localhost:5173. `npm run build` + `npm start` dùng bản đã biên dịch tại cổng 3001.

Tài khoản cũ và dữ liệu được giữ. Hệ thống bổ sung bảng/cột bằng migration khi khởi động. Tài khoản chưa xác minh sẽ được yêu cầu xác minh tại **Tài khoản**, không được tự gắn nhãn đã xác thực.

Nếu chưa có SMTP, chế độ trên máy hiển thị **liên kết thử** khi đăng ký hoặc gửi lại xác minh. Dùng nút điền mã và xác minh để thử đầy đủ luồng. Đây là xác minh giả lập được gắn nhãn, không chứng minh quyền sở hữu email ngoài đời. Không có tài khoản admin hay mật khẩu mặc định.

## Email thật

Sao chép `.env.example` thành `.env`, điền `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` từ dịch vụ email của bạn. Không chia sẻ `.env` hoặc đưa lên Git.

- Cổng 587 dùng STARTTLS; 465 dùng TLS ngay khi kết nối. Mã không tắt kiểm tra chứng chỉ.
- Đặt `SWAP_PUBLIC_URL` là URL mà người dùng truy cập; email dùng URL này để tạo liên kết xác minh/khôi phục.
- Link xác minh có hạn 30 phút; link đặt lại mật khẩu 15 phút; chỉ dùng một lần.
- Đặt lại hoặc đổi mật khẩu thu hồi các phiên đăng nhập. Tính năng gửi lại có giới hạn tần suất.
- Kiểm tra thư tới, thư rác và miền gửi trước khi mời người dùng thật. Không đưa địa chỉ của người khác vào các lượt thử khi chưa có sự đồng ý phù hợp.

Mẫu cấu hình dựa trên [Nodemailer SMTP](https://nodemailer.com/smtp). Luồng đã kiểm thử bằng dữ liệu riêng; chưa gửi email qua một tài khoản SMTP thật vì chưa có thông tin dịch vụ của đơn vị vận hành.

## Premium và VNPAY

Đặt `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET` từ merchant của bạn, giữ `VNPAY_ENV=sandbox` để kiểm tra. Cấu hình IPN tại merchant:

```text
https://ten-mien-cua-ban/api/payments/vnpay/ipn
```

Endpoint tạo URL: `POST /api/orders/:id/checkout`. URL trở lại giao diện chỉ để xem kết quả; **IPN có chữ ký đúng, đúng merchant và số tiền** mới kích hoạt gói. Gọi IPN lặp không cộng quyền hai lần. Đăng ký đang được cổng xử lý không được hủy tùy tiện ở phía giao diện.

Trên localhost có nút **Kích hoạt mô phỏng trên máy**, trạng thái `simulated`, không thu tiền. Quyền kích hoạt thử và xác minh thử không được tính khi chuyển `NODE_ENV=production` hoặc `SWAP_MODE=production`. Nút mô phỏng cũng không hoạt động nếu cấu hình cổng ở chế độ live.

Tích hợp theo tài liệu [VNPAY 2.1.0](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html). Kiểm thử hiện xác nhận cách ký và xử lý callback bằng dữ liệu giả trên máy; chưa phải chứng nhận tích hợp hay giao dịch sandbox/live thành công với merchant thật. Cần kiểm tra trọn luồng tại VNPAY trước khi nhận tiền.

| Quyền | Free | Premium người bán | Premium cả hai |
|---|---:|---:|---:|
| Tin đang bán/giữ chỗ/cho mượn | 3 | 20 | 20 |
| Ảnh/tin | 5 | 10 | 10 |
| Hiển thị tin | 30 ngày | 60 ngày | 60 ngày |
| Chờ đăng lại | 72 giờ | 24 giờ | 24 giờ |
| Lượt xuất bản/đăng lại tối đa mỗi ngày | 5 | 20 | 20 |
| Bộ lọc đã lưu | 5 | 5 | 30 |
| Thống kê theo ngày | Không | Có | Có |

Premium người mua tăng bộ lọc đã lưu lên 30 nhưng không tăng suất đăng. Mua và nhắn tin cơ bản vẫn miễn phí. Gói tháng trong bản này là quyền dùng có thời hạn 30 ngày, **không tự động trừ tiền gia hạn**.

## Quản trị

Đăng ký tài khoản, xác minh email, sau đó trên máy vận hành chạy:

```text
npm run admin -- grant-admin email-cua-nguoi-quan-tri
npm run admin -- revoke-admin email-cua-nguoi-quan-tri
```

Đăng nhập tài khoản đã cấp sẽ thấy **Quản trị**: kiểm tra báo cáo, ẩn/khôi phục bài, ghi kết quả xử lý, tạm khóa tài khoản, xem dịch vụ và nhật ký. API luôn kiểm tra quyền, không dựa vào việc ẩn/hiện nút.

Đội dự án tự chỉ định người quản trị; không cấp quyền mặc định cho người đăng ký đầu tiên. Việc đổi trường trong hồ sơ chỉ là cập nhật thông tin khai báo; xác minh email chưa phải xác minh toàn bộ giấy tờ hay tư cách sinh viên hiện tại.

## Giao dịch và dữ liệu

- Giữ tối đa 3 món/tài khoản. Không có lịch thì giữ 24 giờ; có lịch thì hết hạn 2 giờ sau hẹn. Đổi lịch cần bên kia đồng ý, tối đa trong 7 ngày từ lúc đặt giữ.
- Mã bàn giao dùng một lần, hết hạn sau 15 phút, khóa sau 5 lần sai. Đây là mã mô phỏng, chưa điều khiển phần cứng.
- Đồ mượn: nhận đồ → đang mượn → báo trả → bên cho mượn xác nhận. Gia hạn cần bên cho mượn đồng ý.
- Đổi đồ: chọn một món của mình, có thể đề nghị bù tiền; sau chấp nhận mới đặt giữ. Cả hai món đều bị khóa trong lúc giữ.
- Lưu bản thông tin món tại thời điểm giao dịch. Sửa bài sau khi hủy hoặc xóa mềm không xóa lịch sử đó.
- Đánh giá chỉ dành cho các bên đã hoàn tất, mỗi bên một lần/giao dịch.
- Thông báo trong ứng dụng cập nhật khoảng 15 giây; chat 4 giây; danh sách giao dịch 30 giây. Chưa có thông báo đẩy khi đóng trình duyệt, SMS hay gửi nhắc hẹn qua email.
- Quá hạn và nhắc hẹn được kiểm tra khi máy chủ chạy. Trong chế độ thử tủ, hết hạn sẽ giải phóng ngăn logic; tủ vật lý cần cảm biến/quy trình ngăn trống riêng.

## Đưa lên môi trường thật

Đặt `NODE_ENV=production`, `SWAP_MODE=production`, `SWAP_SECURE=1`, `SWAP_PUBLIC_URL=https://...`, `SWAP_ORIGIN=https://...`; cấu hình reverse proxy HTTPS tới máy chủ 127.0.0.1:3001. Giữ SQLite và `.env` ở ngoài thư mục phục vụ tĩnh.

Chạy `npm run backup` để tạo bản sao SQLite nhất quán trong `backups/`. Sao lưu trước khi cập nhật; khi sao lưu một ứng dụng đang chạy, dùng bản sao nhất quán của SQLite thay vì chỉ chép một file trong lúc ghi. Giới hạn truy cập backup, thử khôi phục, bố trí người nhận lỗi gửi email/thanh toán và kiểm tra dung lượng định kỳ.

Ảnh hiện được tối ưu rồi lưu cùng dữ liệu bài. Khi có lượng sử dụng đáng kể, chuyển sang kho ảnh riêng và truy vấn/phân trang tại máy chủ. Đừng công bố hỗ trợ lượng người dùng lớn chỉ dựa trên kiểm thử chức năng cục bộ.
