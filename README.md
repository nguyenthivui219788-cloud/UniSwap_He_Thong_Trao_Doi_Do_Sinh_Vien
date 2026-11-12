<div align="center">

# ⚡ UNISWAP — HỆ THỐNG TRAO ĐỔI ĐỒ SINH VIÊN THÔNG MINH
[![Status](https://img.shields.io/badge/Status-Ho%E1%BA%A1t%2_%C4%90%E1%BB%99ng-success?style=for-the-badge&logo=appveyor)](https://uniswap.id.vn)
[![Domain](https://img.shields.io/badge/Domain-uniswap.id.vn-blue?style=for-the-badge&logo=google-chrome)](https://uniswap.id.vn)
[![Platform](https://img.shields.io/badge/Platform-Web%20Fullstack-orange?style=for-the-badge&logo=react)](https://github.com/nguyenthivui219788-cloud/UniSwap_He_Thong_Trao_Doi_Do_Sinh_Vien)
[![License](https://img.shields.io/badge/License-MIT-yellow.badge?style=for-the-badge)](https://github.com/nguyenthivui219788-cloud/UniSwap_He_Thong_Trao_Doi_Do_Sinh_Vien)

*Nền tảng kết nối trao đổi, mua bán, cho mượn và tặng đồ dùng học tập hàng đầu dành cho sinh viên.*

🌐 **Trang web chính thức:** [https://uniswap.id.vn](https://uniswap.id.vn)

</div>

---

## 🌟 1. Giới thiệu tổng quan (Overview)
**UniSwap** là hệ sinh thái số toàn diện được xây dựng nhằm giải quyết bài toán thanh lý, trao đổi, cho mượn đồ dùng học tập, sách vở và thiết bị ký túc xá giữa các sinh viên trong trường đại học. 

Dự án tích hợp các công nghệ hiện đại từ giao diện người dùng mượt mà đến hệ thống xử lý backend tối ưu, kết hợp mô phỏng trạm khóa tủ thông minh và hệ thống thanh toán điện tử, mang đến trải nghiệm tiện lợi, an toàn và văn minh cho cộng đồng sinh viên.

---

## 🏗️ 2. Sơ đồ kiến trúc & Cấu trúc thư mục (Architecture)
Hệ thống được thiết kế theo mô hình client-server hiện đại, phân tách rõ ràng giữa mã nguồn giao diện và logic máy chủ:

```text
UniSwap_He_Thong_Trao_Doi_Do_Sinh_Vien/
│
├── admin/                     # Giao diện quản trị hệ thống (Admin panel)
├── database/                  # Quản lý cơ sở dữ liệu và dữ liệu mẫu
├── docs/                      # Tài liệu kỹ thuật, hướng dẫn API & bàn giao Premium
├── public/                    # Tài nguyên tĩnh (Hình ảnh, icon, asset)
├── server/                    # Mã nguồn backend (Node.js, xử lý API, platform.mjs)
├── src/                       # Mã nguồn frontend (React, TypeScript, Vite)
├── tests/                     # Kịch bản kiểm thử hệ thống tự động
├── .env.example               # Mẫu cấu hình biến môi trường
├── CHAY_WEB_UNISWAP.bat       # Script khởi động nhanh trên Windows
├── DUNG_WEB_UNISWAP.bat       # Script dừng tiến trình web an toàn
└── README.md                  # Tài liệu mô tả dự án
```

## 💻 3. Công nghệ sử dụng (Tech Stack)
Dự án áp dụng stack công nghệ hiện đại, hiệu suất cao và tối ưu trải nghiệm người dùng:

Frontend: React, TypeScript, Vite, giao diện tùy chỉnh tương thích đa thiết bị (Desktop & Mobile).

Backend: Node.js, xử lý API bất đồng bộ, kiến trúc module hóa an toàn.

Database: SQLite lưu trữ cục bộ tối ưu, tự động cập nhật cấu trúc dữ liệu khi khởi động.

Thanh toán & Dịch vụ: Tích hợp luồng thanh toán VNPAY (có chế độ mô phỏng local) và cấu hình SMTP cho hệ thống email.

## ✨ 4. Các tính năng cốt lõi (Key Features)
👤 A. Xác thực & Quản lý tài khoản
Đăng ký bằng email trường, phân quyền linh hoạt (Người mua / Người bán / Cả hai).

Xác minh email, khôi phục mật khẩu, đổi mật khẩu và tính năng bảo mật thu hồi phiên đăng nhập.

📦 B. Đăng tin & Quản lý sản phẩm đa hình thức
Hỗ trợ đa dạng hình thức: Đăng bán, Trao đổi, Tặng cho, Cho mượn.

Quản lý trạng thái tin đăng (tạm ẩn, hết hạn, đăng lại có thời gian chờ), thống kê lượt xem, lượt lưu và tương tác.

Tìm kiếm tiếng Việt thông minh không dấu, lọc theo ngành, môn học, khu vực, khoảng cách tọa độ thực tế và tin cần mua.

🤝 C. Giao dịch, Đổi món & Tủ thông minh
Đề nghị giá, đổi món hai chiều kèm bù tiền, đặt giữ chống trùng lịch hẹn.

Hệ thống vòng mượn/trả đồ, gia hạn thời gian và mô phỏng 24 ngăn tủ thông minh với mã nhận dùng một lần.

📚 D. Cộng đồng & Tiện ích nâng cao
Không gian đọc sách, học nhóm, kết nối gia sư theo giờ với hệ thống đăng ký sức chứa linh hoạt.

Gói nâng cấp Premium với nhiều quyền lợi mở rộng.

Trang quản trị phân quyền chặt chẽ giúp kiểm duyệt tin đăng, xử lý báo cáo và tạm khóa tài khoản vi phạm.

## 🚀 5. Hướng dẫn cài đặt & Chạy dự án (Getting Started)
Yêu cầu hệ thống:
Đã cài đặt Node.js (phiên bản 24 trở lên).

Các bước chạy trên môi trường Local (Windows):
Mở terminal tại thư mục chứa dự án và chạy lệnh cài đặt thư viện:

```
cd /d D:\SWAP
npm ci
```
Khởi động môi trường phát triển:

```
npm run dev
```
Mở trình duyệt và truy cập: http://localhost:5173.(Hoặc nhanh chóng bấm đúp vào file CHAY_WEB_UNISWAP.bat sẵn có trong thư mục).

Chạy phiên bản sản xuất (Production Build):
```
npm run build
npm start
```
Truy cập ứng dụng tại: http://localhost:3001.

## 🌐 6. Triển khai thực tế
Tên miền truy cập chính thức: 
```
https://uniswap.id.vn
```

Dữ liệu cục bộ được lưu trữ an toàn tại thư mục data/.

Bây giờ bạn chỉ cần copy toàn bộ nội dung trên dán đè vào file README.md trên GitHub là repo trông sẽ cực kỳ chuyên nghiệp, nổi bật tên miền uniswap.id.vn và sẵn sàng chinh phục mọi vòng tiếp theo nhé! Chúc dự án của bạn tiến thật xa!
