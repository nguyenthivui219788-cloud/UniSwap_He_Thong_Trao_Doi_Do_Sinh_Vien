# Bản demo mở rộng các trang phụ

Giữ giao diện và ảnh gốc của trang chủ. Bổ sung bố cục minh họa 3D, chuyển động nhẹ và nội dung cho các trang riêng theo cùng tông xanh/vàng.

## Xem nhanh

- /kho-demo: Kho đồ demo riêng, danh mục/phân loại con, bộ từ khóa thử, hình thức, sắp xếp, xem chi tiết và tải thêm.
- /can-mua: Tin nhu cầu có hình, lọc thêm trường và ngân sách; mẫu có gợi ý món để mở xem. Tin thật vẫn đăng/sửa/đóng/mở lại theo hạn mức cũ.
- /cong-dong: 12 chủ đề minh họa, ảnh theo loại, thảo luận mẫu, lưu nhóm vào tài khoản, bộ lọc Đã lưu và các nhóm của mình. Lưu lịch tiếp tục xuất .ics.
- /huong-dan: Quy trình tương tác 4 bước có thể đặt lại; chỉ là mô phỏng trên trang, không tạo giữ chỗ/giao dịch/thanh toán thật.
- /premium: Banner 3D và công cụ gợi ý gói theo số tin/số món theo dõi. Người dùng vẫn tự chọn, xác nhận và tạo đơn.
- /huong-dan-api: API Playground gọi GET trực tiếp, hiển thị mã HTTP/JSON, sao chép mã gọi/kết quả và giải thích các nhóm lỗi.

## Dữ liệu

Thêm 234 món, 59 phân loại con thuộc 8 nhóm chính, 234 ảnh vector minh họa. Cộng với 16 món minh họa có sẵn là 250 món demo. Có điện thoại nhiều mẫu iPhone/Samsung/Oppo/Xiaomi, laptop các hãng, Casio, sách theo môn, phụ kiện, đồ phòng trọ, thể thao, handmade, đồ học tập và nhạc cụ. Đa số hồ sơ minh họa thuộc DHV, một phần thuộc UIT. Tài khoản và tin thật không bị đổi.

Thêm 34 nhu cầu mẫu có gợi ý món, 12 nhóm và thảo luận mẫu. Tất cả đều có nhãn demo, không phải người rao bán hoặc sự kiện thật. Các hồ sơ mẫu dùng domain .invalid và mật khẩu ngẫu nhiên không được xuất ra; không cung cấp đăng nhập vào hồ sơ đó.

Dữ liệu tạo bằng ID ổn định, chạy lại không nhân bản. Chỉ tự thêm khi local, ngoài NODE_ENV=test và SWAP_DEMO khác 0. NODE_ENV=production hoặc SWAP_MODE=production không tự tạo mới. Đặt SWAP_DEMO=0 chỉ dừng thêm dữ liệu, không xóa những mẫu đã có trong database. Không dùng chung database chứa demo để vận hành thật nếu chưa chọn lọc dữ liệu.

Chạy npm run demo:assets để tạo lại ảnh sau khi sửa shared/demo-data.mjs. Ảnh minh họa được vẽ bằng SVG, không khẳng định là ảnh sản phẩm thật.

## Tìm kiếm

Tìm không dấu, theo nhãn phân loại, một số từ đồng nghĩa, lỗi gõ nhỏ và dạng viết liền/viết tắt như iphone16 / ip14. Các bộ lọc danh mục, trường, mức giá vẫn phải đúng. Khi không khớp, hiển thị phần gợi ý riêng; không gọi gợi ý là kết quả khớp chính xác. Không có kho demo hữu hạn nào bảo đảm khớp mọi chuỗi ký tự.

## Kiểm tra

53 kiểm thử đạt; lint/build đạt. Đã thử trên trình duyệt: tìm iPhone, từ khóa không có kết quả và gợi ý thay thế, lọc nhóm Cà phê sách, đọc thảo luận mẫu không cần tạo tin thật, API Playground trả HTTP 200, chuyển bước quy trình giao dịch.

Ảnh minh họa, hồ sơ, giá và lịch nhóm mẫu không phải bằng chứng xác minh sinh viên, đơn hàng, doanh thu hay giao dịch thật. Các API tạo dữ liệu/giao dịch thật vẫn yêu cầu quyền và xác minh như trước.
