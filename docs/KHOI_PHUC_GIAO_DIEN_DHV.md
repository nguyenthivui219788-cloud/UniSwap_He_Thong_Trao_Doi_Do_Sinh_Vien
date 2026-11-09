# Khôi phục giao diện gốc và bổ sung DHV

Đã dùng lại tài nguyên gốc còn trong public/assets và đối chiếu bản sao lưu trước các nâng cấp chức năng:

- Banner xanh/vàng và bốn cụm hình 3D; dải danh mục 3D; ba khối công nghệ/cho tặng/đăng tin; banner danh mục với ảnh gốc.
- Đăng nhập hai cột dùng uniswap-left-panel-perfect.png, form thật gọi API. Giữ kiểm tra đăng ký, xác minh email và khôi phục tài khoản.
- Menu đầu trang theo phong cách gốc; các trang Cần tìm/Cộng đồng/Hướng dẫn/API ở menu Cộng đồng, Premium ở nút Thợ Săn Đồ Pro. Các đường dẫn trang riêng tiếp tục hoạt động.
- Thêm DHV lên đầu danh sách trường ở đăng ký, bộ lọc và cộng đồng, dù chưa có tin. Nhận diện email DHV tự động; tên trường đầy đủ trong tài khoản. Sắp xếp Ưu tiên DHV được chọn ban đầu; các kiểu giá/mới nhất vẫn giữ ý nghĩa riêng. Có nút chỉ xem DHV.
- Form đăng tin nhận trường người dùng để gợi ý khu vực ban đầu; người đăng có thể đổi khu vực. Điểm hẹn luôn do hai bên thống nhất, không khẳng định quan hệ đối tác với nhà trường.
- Không đổi trường hay tạo tin DHV giả để lấp danh sách. Có thể dùng tài khoản thật đăng tin sau khi xác minh email.

## Đăng nhập

Email DHV do người dùng nêu chưa có tài khoản trong SQLite UniSwap tại thời điểm kiểm tra. Email/mật khẩu cổng trường không tự đăng nhập được vào ứng dụng này. Chọn Đăng ký để tạo tài khoản UniSwap bằng email DHV và mật khẩu mới từ 8 ký tự; xác minh email theo hướng dẫn. Nút Microsoft giữ hình thức nhưng chưa có kết nối OAuth thật, nên không mở form giả yêu cầu mật khẩu trường.

Đã sửa việc áp dụng sai độ dài mật khẩu mới vào thao tác đăng nhập: đăng nhập không chặn sẵn mật khẩu ngắn của tài khoản cũ, nhưng vẫn phải khớp bản băm; đăng ký vẫn yêu cầu ít nhất 8 ký tự. Ghi nhớ đăng nhập hoạt động: bật lưu cookie 7 ngày; tắt dùng cookie phiên với thời hạn máy chủ 12 giờ. Không lưu mật khẩu người dùng vào file.

## Kiểm tra

46 kiểm thử đạt; lint/build đạt. Có ca nhận diện DHV, trường không khớp, tài khoản/phiên đăng nhập và ưu tiên tin DHV không làm sai sắp xếp theo giá.

Nguồn thông tin trường chính thức: https://dhv.edu.vn/ . Domain DHV được người dùng cung cấp và đối chiếu với website trường.

Xem giao diện đăng nhập: http://localhost:5173/?login=true . Giao diện khôi phục không bỏ các tính năng mới đã làm.
