# Quy tắc dự án UniSwap

- Giữ giao diện gốc người dùng đã cung cấp: đầu trang xanh/vàng, banner “Đồ hay chuyền tay. Giá trị ở lại.” với hình 3D, dải danh mục 3D, ba khối công nghệ/cho tặng/đăng tin, banner danh mục và đăng nhập hai cột với ảnh gốc.
- Ưu tiên thêm/sửa chức năng; không tự thay thế các khối nhận diện này bằng thiết kế mới. Trang lớn vẫn có URL riêng, dùng cùng phong cách của giao diện gốc.
- Điều hướng tính năng nằm trong đầu trang/menu Cộng đồng; không khôi phục thanh trắng thứ hai mà người dùng đã yêu cầu bỏ.
- Các trường được hiển thị bình đẳng, không ưu tiên DHV hoặc bất kỳ trường nào. DHV (dhv.edu.vn) là một trường trong danh sách. Dữ liệu demo phân bổ nhiều trường; chỉ đổi dữ liệu mẫu được gắn nhãn, không đổi trường tài khoản/tin thật.
- Không lưu mật khẩu người dùng trong mã nguồn, tài liệu, tài nguyên giao diện hoặc dữ liệu mẫu. UniSwap có tài khoản riêng; chỉ liên kết trường qua nhà cung cấp xác thực thật khi đã cấu hình.
- Giữ tính năng và dữ liệu hiện có. Sao lưu trước các cập nhật dữ liệu. npm test, npm run lint, npm run build là các lệnh kiểm tra hiện có.

- Nút đăng tin chính nằm ở thanh tác vụ dưới banner danh mục, không đặt ở góc đầu trang. Bộ lọc mở theo yêu cầu; không hiện dãy tiện ích tài khoản hoặc bộ lọc dày trên trang chính. Không có bộ chọn bán kính trong tìm kiếm.
