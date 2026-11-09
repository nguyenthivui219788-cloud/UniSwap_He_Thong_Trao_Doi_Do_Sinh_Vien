# UniSwap — bản hoàn thiện Premium

Bản này triển khai theo mô hình 3 gói người mua / người bán / cả hai. Đây là cấu hình sản phẩm, không phải kết luận về khả năng sinh lời. Giá được định nghĩa tập trung tại `shared/catalog.ts`; máy chủ tự tính, không nhận số tiền từ giao diện.

| Quyền lợi | Miễn phí | Premium Mua 50.000đ/30 ngày | Premium Bán 50.000đ/30 ngày | Toàn Diện 75.000đ/30 ngày |
|---|---:|---:|---:|---:|
| Tin đang hoạt động | 3 | 3 | 20 | 20 |
| Ảnh mỗi tin | 5 | 5 | 10 | 10 |
| Tìm kiếm đã lưu | 5 | 30 | 5 | 30 |
| Theo dõi giá | 3 | 30 | 3 | 30 |
| Tin cần mua đang mở | 3 | 10 | 3 | 10 |
| Giữ món cùng lúc | 3 | 5 | 3 | 5 |
| Lượt đẩy 24 giờ trong kỳ | 0 | 0 | 3 | 3 |
| Hạn hiển thị tin | 30 ngày | 30 ngày | 60 ngày | 60 ngày |
| Đăng lại | Sau 72 giờ | Sau 72 giờ | Sau 24 giờ | Sau 24 giờ |

Đẩy tin mua riêng: 1 ngày 3.000đ, 3 ngày 7.000đ, 5 ngày 10.000đ. Lượt đi kèm gói chỉ sử dụng trong kỳ, không chuyển sau khi hết hạn. Gia hạn cùng gói nối tiếp; đổi gói khác có thể trùng thời gian. Không tự gia hạn, không tự trừ tiền. Hết hạn không xóa tin đang còn hạn; kiểm tra hạn mức miễn phí khi đăng mới hoặc đăng lại.

## Điểm đã sửa và bổ sung

- Giao diện Premium có 3 thẻ, so sánh, chọn gói, xác nhận, lịch sử kỳ, hạn mức sử dụng. Ai cũng xem được giá; mua cần đăng nhập và xác minh.
- Theo dõi giảm giá: món thật của người khác, mục tiêu thấp hơn giá hiện tại, thông báo trong ứng dụng đúng một lần; đặt lại mục tiêu để theo dõi tiếp. Quản lý tại Theo dõi giá.
- Lượt đẩy kèm gói trừ ở máy chủ, kiểm tra chủ tin, thời hạn và số lượt còn lại.
- Sửa cập nhật từng trường: PATCH giá không cần gửi lại tiêu đề. Giảm giá từ form chỉnh sửa hoặc API đều phát thông báo.
- Bảng phân loại cha/con dùng chung giữa lọc, đăng tin và máy chủ. Gợi ý theo tên có nút Áp dụng; không tự thay danh mục tin thật. Sửa danh mục mẫu sai (balo, đèn bàn, máy Casio, giày thể thao).
- Lọc tình trạng theo nhóm chính xác: mới 100%, như mới, đã dùng, cần sửa.
- Thanh toán hết hạn có thể thử lại với mã giao dịch mới. Lần thanh toán lỗi cũ không ghi đè lần mới; IPN thành công chỉ cấp một lần. Giao diện tự cập nhật quyền khi nhận trạng thái thanh toán thành công.
- Animation hover nhẹ, có chế độ giảm chuyển động theo thiết bị. Bố cục thẻ chuyển một cột trên màn hình nhỏ.

## Cách xem

Chạy CHAY_WEB_UNISWAP.bat, mở http://localhost:5173/?page=premium. Hoặc chọn Gói Premium ở thanh tiện ích tài khoản. Chọn gói → đồng ý thông tin → tiếp tục → thanh toán hoặc kích hoạt thử có ghi rõ không thu tiền. Tài khoản cần xác minh ở mục Tài khoản trước khi tạo đơn. Xem API trong Hướng dẫn API.

## Phần cần dịch vụ bên ngoài

VNPAY cần mã đơn vị và khóa do VNPAY cấp; SMTP cần tài khoản gửi email thật. Hiện chưa có khóa trong .env thì không thu tiền thật. Không thay chữ 'mô phỏng' thành 'đã thanh toán'. Máy chủ chỉ kích hoạt thật khi IPN hợp lệ. IPN cần địa chỉ HTTPS công khai do bạn vận hành và đăng ký với VNPAY. Xem CAU_HINH_V2.md và HUONG_DAN_API_THUC_HANH.md.

Chưa có quy trình hoàn tiền tự động hay phân bổ phần thời gian còn lại khi đổi gói. Lịch sử đơn và ngày từng quyền hiển thị để người dùng kiểm tra trước khi mua. Thông báo giảm giá là trong ứng dụng, không phải push khi trình duyệt đóng.

## Kiểm tra

39 kiểm thử tự động cho API, giao dịch, phân quyền, thanh toán và lọc; lint và build đều đạt. Gồm các ca mới: giá gói do máy chủ tính, quyền Mua không cấp nhầm quyền Bán, gia hạn nối kỳ, theo dõi giá và giới hạn, lượt đẩy không dùng trùng, thanh toán hết hạn và callback cũ.
