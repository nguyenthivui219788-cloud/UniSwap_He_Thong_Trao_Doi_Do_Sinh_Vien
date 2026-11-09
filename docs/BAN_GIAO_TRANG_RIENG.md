# Bàn giao các trang tính năng riêng

## Cấu trúc mới

| Trang | Đường dẫn | Thao tác |
|---|---|---|
| Chợ sinh viên | / | Tìm/lọc đồ, đăng tin, mở chi tiết và giao dịch; chỉ giữ thẻ giới thiệu các không gian khác |
| Cần mua / cần tìm | /can-mua | Đăng nhu cầu, tìm kiếm/lọc/sắp xếp, xem tin của mình và tin đóng, sửa/mở lại, chia sẻ liên kết, gửi món gợi ý |
| Cộng đồng | /cong-dong | Tìm nhóm, lọc chủ đề/trường/chỗ trống/lịch sắp tới; nhóm đã tham gia, nhóm tự tổ chức; thành viên, thảo luận, lưu lịch .ics, chia sẻ |
| Hướng dẫn giao dịch | /huong-dan | Hướng dẫn riêng cho mua/bán/đổi/mượn, câu hỏi thường gặp và nút bắt đầu thao tác |
| Premium | /premium | So sánh, chọn gói, xem quyền lợi và lịch sử; thanh toán vẫn mở trong màn hình đơn |
| Hướng dẫn API | /huong-dan-api | Ví dụ thực hành và thử đọc dữ liệu API |

Mỗi trang có URL riêng, mở trực tiếp/tải lại được, có điều hướng hiện trạng, breadcrumb và hỗ trợ nút Quay lại/Tiến của trình duyệt. Footer và nút Cần tìm trên trang chủ dẫn đến trang mới. Thông báo gợi ý nhu cầu/thành viên cộng đồng mở trang tương ứng với đúng ID tin/nhóm. Liên kết chia sẻ dùng /can-mua?request=ID hoặc /cong-dong?topic=ID.

## Bổ sung thao tác và quy tắc

- Tin cần tìm: hạn mức theo gói vẫn kiểm tra ở máy chủ khi đăng và mở lại. Chỉ chủ tin sửa/đóng/mở lại. Ngày cần phải hợp lệ, từ hôm nay theo giờ Việt Nam. Tin quá ngày được đóng trong lượt dọn dữ liệu tự động khi có yêu cầu.
- Gửi lại cùng món cho cùng nhu cầu chỉ cập nhật lời nhắn, không tạo thêm gợi ý hoặc thông báo trùng.
- Cộng đồng: nhóm đầy, đóng nhận hoặc đã diễn ra hiển thị đúng trạng thái, chặn đăng ký ở cả giao diện và máy chủ. Người tham gia vẫn rời được nhóm sau buổi.
- Xuất .ics theo giờ UTC chuẩn; ứng dụng lịch tự hiển thị theo múi giờ của người dùng. Không tự thêm vào Google Calendar và không tự gửi lời mời.
- Dữ liệu và phiên đăng nhập cũ được giữ. Các trang lớn không còn nhồi xuống cuối trang chủ; những tác vụ ngắn như đăng nhập, chi tiết món, chat và xác nhận giao dịch tiếp tục dùng hộp thao tác.
- Dữ liệu bộ lọc chi tiết ở Cần tìm/Cộng đồng hiện nằm trong phiên trang, chưa lưu vào URL; liên kết trực tiếp tới tin/nhóm được hỗ trợ. Đổi trang sẽ đặt lại các bộ lọc nội bộ đó.

## Kiểm tra

44 kiểm thử đạt, lint/build đạt. Đã kiểm tra trên trình duyệt bằng dữ liệu QA riêng: đăng nhập, nhóm tự tổ chức và lọc gia sư, sửa ngân sách, đóng/mở lại nhu cầu, quay lại trang trước. Dữ liệu QA không chép vào cơ sở dữ liệu D:\SWAP.

Chạy CHAY_WEB_UNISWAP.bat rồi mở http://localhost:5173/. Thanh Các trang UniSwap ở bên dưới đầu trang có lối vào mọi trang lớn.
