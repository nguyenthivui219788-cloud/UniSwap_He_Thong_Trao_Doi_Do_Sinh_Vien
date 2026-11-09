# Học và áp dụng API trên UniSwap

API là cổng thao tác với dữ liệu. Dùng ngay nút Hướng dẫn API trên web để thử GET /plans, GET /catalog, GET /health. Dữ liệu bảng giá và danh mục trả về từ chính máy chủ bạn đang chạy.

## Bài 1: đọc dữ liệu

Mở DevTools → Console ở localhost:5173:

```js
const response = await fetch('/api/plans');
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const data = await response.json();
console.table(data.plans.map(p => ({goi:p.name,gia:p.price,ngay:p.days})));
```

`fetch` không tự báo lỗi cho HTTP 404/500, vì vậy luôn kiểm tra response.ok. Tham khảo chính thức: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

## Bài 2: tạo đơn ở môi trường local

Đăng nhập tài khoản đã xác minh trước. Gọi cùng miền để trình duyệt gửi cookie phiên. Không copy cookie sang nơi khác.

```js
const response = await fetch('/api/orders', {
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({plan:'buyer'})
});
const data = await response.json();
if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
console.log(data.order);
```

Không truyền amount, không tự đặt trạng thái paid. Máy chủ dùng bảng giá. Gọi POST /api/orders/{id}/checkout để lấy URL VNPAY khi có cấu hình; local có POST /api/orders/{id}/simulate nhưng chỉ thử nghiệm, không thu tiền. Không mở chế độ mô phỏng trên máy chủ công khai.

## Bài 3: phân loại và cập nhật món

GET /api/catalog trả cây cha/con. Chọn electronics → calculators cho máy Casio. POST /api/products cần các trường tiêu đề, mô tả, ảnh, danh mục, hình thức, giá (khi bán/cho mượn), tình trạng, khu vực, điểm hẹn. PATCH /api/products/{id} cập nhật từng trường; chỉ chủ tin thực hiện, đang giao dịch thì khóa sửa.

```js
await fetch('/api/products/ID_TIN_CUA_BAN', {
  method:'PATCH',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({price:30000})
});
```

Dùng ID thật từ API hoặc URL món. Không thay ID bằng index trong danh sách. Phân loại con phải thuộc danh mục cha. Gợi ý tự động theo tên là luật từ khóa đơn giản trong shared/catalog.ts, không phải nhận dạng chính xác mọi sản phẩm.

## Bài 4: theo dõi giảm giá và quyền lợi

- POST /api/products/{id}/price-alert, JSON {"targetPrice":25000}: theo dõi món thật của người khác, giá mục tiêu >0 và thấp hơn hiện tại.
- GET /api/price-alerts: chỉ danh sách của mình.
- DELETE /api/products/{id}/price-alert: bỏ theo dõi.
- GET /api/membership: quyền Mua/Bán hiện tại, limits, usage, pushCredits và các kỳ đã đăng ký.
- POST /api/products/{id}/use-boost, JSON {}: trừ 1 lượt đẩy 24 giờ kèm Premium Bán/Toàn Diện; chỉ dùng tin mình đang hiển thị.
- GET /api/notifications: đọc thông báo gồm giá giảm. Thông báo chỉ phát lần đầu đạt mục tiêu; đặt lại mục tiêu để tái theo dõi.

401: cần đăng nhập. 403: chưa xác minh, không sở hữu hoặc thiếu quyền. 400: trường không hợp lệ. 409: đã xử lý/xung đột/đạt hạn mức. 429: quá tần suất. Hiển thị message máy chủ; không mặc định mọi lỗi đều cần mua Premium.

## Bài 5: nối VNPAY

1. Nhận bộ thông tin merchant sandbox riêng từ VNPAY. Không tìm khóa dùng chung trên mạng.
2. Copy .env.example thành .env và điền VNPAY_TMN_CODE, VNPAY_HASH_SECRET, SWAP_PUBLIC_URL; VNPAY_ENV=sandbox.
3. Khởi động lại web. Đăng ký URL IPN HTTPS công khai /api/payments/vnpay/ipn với VNPAY. Máy localhost không tự nhận callback từ Internet.
4. Tạo đơn → POST checkout → chuyển URL do máy chủ trả về → thanh toán tại sandbox.
5. VNPAY gửi IPN: máy chủ kiểm HMAC SHA-512, merchant, mã tham chiếu, số tiền và trạng thái giao dịch; lưu paid và cấp quyền trong cùng giao dịch dữ liệu.
6. URL người dùng quay về chỉ mở lịch sử, không có quyền tự xác nhận đã trả tiền. Thử lại sau hết hạn dùng mã tham chiếu khác.
7. Chuyển live khi đã có thông tin và phê duyệt của VNPAY; không dùng khóa sandbox cho live. Không ghi secret vào React, ảnh chụp hay repository.

Tài liệu giao thức chính thức: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html

## Cách mở rộng sau này

Dùng src/lib/api.ts cho giao diện, thêm route ở server, kiểm session/quyền và dữ liệu trước khi ghi, rồi kiểm thử cả thành công và không đủ quyền. Khai báo endpoint trong server/openapi.mjs. Xem đặc tả tại /api/openapi.json (các API chính cho Premium và danh mục; chưa mô tả toàn bộ endpoint của ứng dụng).

Không gọi API định vị IP để thay vị trí chính xác. Lọc khu vực/trường luôn dùng được không cần quyền định vị; tìm quanh đây dùng tọa độ thiết bị khi người dùng chủ động cho phép. IP chỉ cho vị trí gần đúng và không chứng minh người dùng đang trong trường.
