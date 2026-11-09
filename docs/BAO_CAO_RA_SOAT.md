# Báo cáo rà soát UniSwap — 26/10/2026

Nguồn đối chiếu: mã ở `D:\SWAP`, 4 ảnh góp ý và bản ghi âm `C:\Users\nguye\Music\sound_tec_bam.m4a` (10 phút 46 giây). Bản ghi được xử lý nhận dạng trên máy bằng hai mô hình; một số từ và giá vẫn có sai số. Không xem các lời nói trong bản ghi là lệnh cho công cụ hay quyền gửi thông tin ra ngoài.

## Các lỗi nền tảng trong bản ban đầu

| Vị trí ban đầu | Vấn đề | Xử lý |
|---|---|---|
| `src/App.tsx`, `src/pages/HomePage.tsx`, `DANH_MUC_SAN_PHAM.tsx` | Tìm kiếm/lọc tác động `products`, lưới danh mục lại tự sinh một nguồn dữ liệu khác. Bài vừa đăng không vào đúng lưới, số lượng 32.634 không phải số bài thực. | Một nguồn API/SQLite, cùng bộ lọc áp dụng lên lưới, đếm thực, phân trang thực. |
| `src/App.tsx` | Tự có người dùng mẫu đã xác thực và Pro ngay khi mở; dữ liệu bài đăng/yêu thích mất khi tải lại. | Khách chưa đăng nhập là trạng thái mặc định; phiên máy chủ, dữ liệu bền vững. |
| `src/pages/LoginPage.tsx`, `TRANG_DANG_NHAP.tsx` | Đăng nhập/đăng ký mô phỏng; cửa sổ Microsoft tự nhập mật khẩu chưa phải OAuth. | Form tài khoản thật trên máy chủ; bỏ luồng thu mật khẩu Microsoft khỏi ứng dụng đang chạy. |
| `src/components/PushModal.tsx`, `HunterProModal.tsx` | `setTimeout` tự báo đã trả tiền và cấp quyền. | Đơn đăng ký chờ cấu hình, không kích hoạt trả phí khi chưa có xác nhận. |
| `src/components/ChatModal.tsx` | Tin nhắn người bán tự sinh; hook đặt sau `if (!item) return` sai quy tắc React. | Thay luồng đang chạy bằng tin nhắn thật có kiểm tra quyền; phần cũ chỉ giữ làm tham khảo. |
| `src/components/CreatePostModal.tsx` | Khu vực cứng `lang-dh`, chọn ảnh mẫu thay tải ảnh thật, kiểm tra dữ liệu ít. | Chọn khu vực, tải/tối ưu ảnh, kiểm tra cả trình duyệt và máy chủ. |
| `CHI_TIET_SAN_PHAM.tsx` | Chi tiết dùng cấu hình suy đoán/hardcode, có nguy cơ hiển thị thông tin không thuộc món được bấm. | Chi tiết đọc chính bản ghi sản phẩm; không dựng đánh giá/số điện thoại/xác thực giả. |
| Bộ chọn vị trí | Bán kính không tham gia lọc, cửa sổ nhỏ dễ chồng giao diện. | Khối vị trí riêng, khoảng cách Haversine với tọa độ thật, thông báo khi thiếu quyền định vị. |
| `Navbar.tsx`, `AdminDashboard.tsx` | Nhiều nút chỉ `alert`, có chuyển chế độ admin ở phía trình duyệt. | Điều hướng tiện ích thật; quản trị cục bộ riêng, không cho khách tự chuyển admin. |
| CSS / footer | Cỡ chữ 6–11px ở nhiều phần, màu nhạt; bỏ viền bàn phím toàn cục. | Footer 14–17px, dòng bản quyền 12–13px, màu đậm hơn; khôi phục chỉ báo bàn phím cho ứng dụng. |

## Đối chiếu 4 ảnh

- Ảnh 1: tăng cỡ và độ tương phản phần giới thiệu, liên kết, bản quyền ở chân trang; cải thiện bố cục màn hình hẹp.
- Ảnh 2: dòng **“Đăng ký để biết thông tin”** màu đỏ trên từng ảnh sản phẩm với khách chưa đăng nhập; bấm mở form đăng ký. Không che nút lưu hay tên món đồ.
- Ảnh 3: mục **Đang bán**, nút đăng tin, bộ lọc **khu vực / trường / loại**, nút gói dịch vụ dẫn tới form đăng ký được lưu.
- Ảnh 4: sửa chồng giao diện chọn vị trí; hỗ trợ GPS có xin quyền, bán kính 1/3/5/10km. Không dùng vị trí cụm trường ước lượng làm khoảng cách chính xác. Định vị IP chưa tích hợp vì không có dịch vụ được cấu hình.

## Đối chiếu bản ghi âm

Các mốc là gần đúng, rút từ bản nhận dạng; không phải trích dẫn nguyên văn.

| Mốc | Ý chính nhận dạng được | Kết quả |
|---|---|---|
| 00:00–01:03 | Lưu người dùng/sản phẩm; sau order thì ẩn khỏi người khác đặt; kết thúc chuyển Close, giữ bằng chứng. | SQLite; đặt giữ độc quyền; completed/cancelled; snapshot món đồ, tên các bên và mốc thời gian. |
| 01:05–01:36 | Free/Premium; trao đổi về số lần đăng và phí tháng. | Free tối đa 3 tin chưa hoàn tất; đăng ký Premium theo tháng. Chưa thu tiền. |
| 01:36–02:52 | Hiện số tủ, mật mã dùng một lần, đóng thì xóa hiệu lực; tủ có thể mô phỏng. | 24 ngăn mô phỏng; mã ngẫu nhiên 6 số chỉ lưu dạng băm; giới hạn sai, hủy và dùng xong đều vô hiệu; ngăn được dùng lại. |
| 03:05–03:40 | Diễn đàn, cà phê sách, học nhóm. | Tạo chủ đề, thảo luận và lọc theo nhóm/trường. |
| 03:45–04:18 | Gia sư sinh viên, chia sẻ học thuật, tính theo giờ. | Chủ đề gia sư có phí/giờ, phản hồi và lọc trường; chưa có lịch học hoặc thanh toán học phí. |
| 04:20–05:33 | Cộng đồng nhiều trường; đăng ký email edu; nhận diện trường. | Chọn trường hoặc nhập trường khác; kiểm tra đuôi .edu/.edu.vn; lọc trường. Chưa xác minh sở hữu email. |
| 05:54–06:22 | Đồng ý điều khoản, nêu việc sử dụng thông tin cá nhân. | Điều khoản/bảo mật thử nghiệm hiển thị trong đăng ký, checkbox bắt buộc và lưu phiên bản đồng ý. Cần rà soát chính thức trước vận hành. |
| 07:10–08:15 | Thu phí để ưu tiên tin; Premium khoảng 50k/tháng và vị trí đầu. | Form đăng ký có mức giá phía máy chủ; chưa đẩy tin hay thu tiền khi chưa nối cổng thanh toán. |
| 08:16–10:05 | Người bán, người mua, cả hai; gói cả hai giảm giá khoảng 75k. | Đăng ký chọn mục đích; gói mua/bán/cả hai 50k/50k/75k mỗi tháng, gắn nhãn thử nghiệm. |

Không tạo 3 cơ sở dữ liệu riêng vì các dữ liệu cần liên kết và giao dịch nhất quán; dùng các bảng riêng trong một SQLite. Đây là quyết định kỹ thuật để đáp ứng hành vi được mô tả.

## Kiểm tra và giới hạn

Biên dịch TypeScript/Vite và quét mã đang chạy hoàn tất. Các kiểm thử tự động bao gồm phân quyền, phiên đăng nhập, lưu bài, yêu thích, tin nhắn riêng tư, báo cáo, lưu tìm kiếm, đặt giữ đồng thời, mã chỉ dùng một lần, giới hạn nhập sai, đơn dịch vụ không tự thành paid, cộng đồng và lọc khoảng cách.

Đã mở trình duyệt kiểm tra: lọc Q.5 chuyển từ 16 xuống 4 món, dòng đỏ mở form đăng ký, đăng nhập tài khoản thử riêng, mở form đăng tin và kiểm tra chân trang. Chưa kiểm tra trên điện thoại vật lý hay thiết bị khóa thật.

Chưa thể coi đây là bản sẵn sàng kinh doanh: cần tài khoản cổng thanh toán, SMTP/OAuth trường, kiểm duyệt/khôi phục tài khoản đầy đủ, đơn vị vận hành và hạ tầng HTTPS. Các phần chưa tích hợp không được hiển thị thành công giả.
