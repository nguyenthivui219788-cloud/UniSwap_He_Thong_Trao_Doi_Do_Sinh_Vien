-- ==============================================================================
-- DATABASE: UNISWAP - NỀN TẢNG TRAO ĐỔI & MUA BÁN ĐỒ DÙNG SINH VIÊN VIỆT NAM
-- Author: UniSwap Team (DHV - 2305CT0661)
-- Description: Script tạo toàn bộ bảng, quan hệ, phân quyền và dữ liệu mẫu cho MySQL Workbench
-- ==============================================================================

-- 1. TẠO CƠ SỞ DỮ LIỆU
CREATE DATABASE IF NOT EXISTS `uniswap_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `uniswap_db`;

-- Tắt kiểm tra khóa ngoại tạm thời để tránh xung đột khi drop/tạo bảng
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `reports`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `seller_registrations`;
DROP TABLE IF EXISTS `kindness_wall`;
DROP TABLE IF EXISTS `giveaway_claims`;
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `conversations`;
DROP TABLE IF EXISTS `exchanges`;
DROP TABLE IF EXISTS `buy_requests`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `subcategories`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `oauth_accounts`;
DROP TABLE IF EXISTS `user_sessions`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- 2. BẢNG NGƯỜI DÙNG & PHÂN QUYỀN (USERS & ROLES)
-- Hỗ trợ phân quyền: admin, moderator, student (người mua & người bán)
-- ==============================================================================
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL COMMENT 'UUID duy nhất của tài khoản',
  `student_id` VARCHAR(50) UNIQUE NOT NULL COMMENT 'Mã số sinh viên (VD: 2305CT0661)',
  `email` VARCHAR(191) UNIQUE NOT NULL COMMENT 'Email trường sinh viên (VD: 2305ct0661@dhv.edu.vn)',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã băm bảo mật (bcrypt / scrypt)',
  `salt` VARCHAR(64) DEFAULT NULL COMMENT 'Chuỗi muối mã hóa nếu dùng scrypt/pbkdf2',
  `full_name` VARCHAR(100) NOT NULL COMMENT 'Họ và tên sinh viên',
  `university_code` VARCHAR(20) NOT NULL DEFAULT 'DHV' COMMENT 'Mã trường (DHV, HCMUT, HCMUS, UEH, UIT...)',
  `university_name` VARCHAR(150) NOT NULL DEFAULT 'Đại học Hùng Vương TP.HCM',
  `faculty` VARCHAR(100) DEFAULT 'Khoa Công nghệ Thông tin' COMMENT 'Khoa / Ngành học',
  `academic_year` VARCHAR(50) DEFAULT 'K23 (2023 - 2027)' COMMENT 'Khóa học',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT 'Số điện thoại Zalo để liên hệ giao dịch',
  `avatar_url` VARCHAR(500) DEFAULT '/assets/detail/seller-avatar.png',
  
  -- Phân quyền hệ thống (Role-Based Access Control)
  `role` ENUM('admin', 'moderator', 'student') NOT NULL DEFAULT 'student' COMMENT 'Phân quyền: admin (quản trị toàn hệ thống), moderator (duyệt tin), student (người dùng thông thường)',
  `purpose` ENUM('buyer', 'seller', 'both') NOT NULL DEFAULT 'both' COMMENT 'Mục đích chính: Người mua, Người bán hoặc Cả hai',
  
  -- Gói tài khoản & Tiện ích sinh viên
  `tier` ENUM('free', 'hunter_pro') NOT NULL DEFAULT 'free' COMMENT 'Gói tài khoản: Miễn phí hoặc Hunter Pro',
  `push_credits` INT NOT NULL DEFAULT 3 COMMENT 'Số lượt đẩy tin ưu tiên',
  `rating` DECIMAL(2,1) NOT NULL DEFAULT 5.0 COMMENT 'Điểm đánh giá uy tín (tối đa 5.0 sao)',
  `deal_count` INT NOT NULL DEFAULT 0 COMMENT 'Số giao dịch đã hoàn tất',
  `is_verified` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Đã xác minh thẻ sinh viên / email trường',
  `verification_mode` ENUM('email', 'student_card', 'manual') DEFAULT 'email',
  `bio` TEXT DEFAULT NULL COMMENT 'Mô tả giới thiệu bản thân',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Trạng thái tài khoản (khóa / kích hoạt)',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_login` (`email`, `student_id`),
  INDEX `idx_users_school` (`university_code`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý tài khoản sinh viên và phân quyền';

-- ==============================================================================
-- 3. BẢNG PHIÊN ĐĂNG NHẬP (USER SESSIONS)
-- ==============================================================================
CREATE TABLE `user_sessions` (
  `token` VARCHAR(128) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 4. BẢNG LIÊN KẾT MICROSOFT OAUTH (MICROSOFT SSO AZURE AD)
-- Dùng để lưu vết đăng nhập bằng tài khoản Microsoft Office 365 của trường ĐH
-- ==============================================================================
CREATE TABLE `oauth_accounts` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `provider` VARCHAR(50) NOT NULL DEFAULT 'microsoft' COMMENT 'Nhà cung cấp: microsoft, google, etc.',
  `provider_user_id` VARCHAR(191) NOT NULL COMMENT 'Microsoft OID hoặc User Sub duy nhất',
  `email` VARCHAR(191) NOT NULL,
  `tenant_id` VARCHAR(100) DEFAULT NULL COMMENT 'Mã Tenant Azure của trường ĐH',
  `access_token` TEXT DEFAULT NULL,
  `refresh_token` TEXT DEFAULT NULL,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_provider_user` (`provider`, `provider_user_id`),
  CONSTRAINT `fk_oauth_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lưu liên kết tài khoản Microsoft SSO';

-- ==============================================================================
-- 5. BẢNG DANH MỤC VÀ DANH MỤC CON (CATEGORIES & SUBCATEGORIES)
-- ==============================================================================
CREATE TABLE `categories` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `subcategories` (
  `id` VARCHAR(50) NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `display_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_subcategories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 6. BẢNG SẢN PHẨM & MÓN ĐỒ (PRODUCTS)
-- ==============================================================================
CREATE TABLE `products` (
  `id` VARCHAR(36) NOT NULL,
  `seller_id` VARCHAR(36) NOT NULL COMMENT 'Người đăng món đồ',
  `title` VARCHAR(255) NOT NULL COMMENT 'Tiêu đề sản phẩm',
  `category_id` VARCHAR(50) NOT NULL,
  `subcategory_id` VARCHAR(50) NOT NULL,
  `major_group` VARCHAR(50) NOT NULL DEFAULT 'general' COMMENT 'it, economics, engineering, general...',
  `trade_type` ENUM('sale', 'swap', 'giveaway', 'borrow') NOT NULL DEFAULT 'sale' COMMENT 'Đang bán, Trao đổi, Cho tặng 0đ, Cho mượn',
  `price` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT '0 cho đồ cho tặng',
  `swap_for` VARCHAR(255) DEFAULT NULL COMMENT 'Món muốn đổi (nếu trade_type là swap)',
  `borrow_duration` VARCHAR(100) DEFAULT NULL COMMENT 'Thời hạn mượn (nếu trade_type là borrow)',
  `condition_grade` VARCHAR(50) NOT NULL DEFAULT 'Tốt' COMMENT 'Mới 100%, Như mới, Còn tốt, Có lỗi',
  `description` TEXT NOT NULL COMMENT 'Mô tả chi tiết',
  `meeting_spot` VARCHAR(255) NOT NULL COMMENT 'Điểm hẹn giao nhận (Sảnh cơ sở, KTX...)',
  `cluster` VARCHAR(50) NOT NULL DEFAULT 'q5' COMMENT 'Làng ĐH, Q.5, Q.10, Bình Thạnh, Nam Sài Gòn',
  `specs` JSON DEFAULT NULL COMMENT 'Thông số kỹ thuật: RAM, CPU, dung lượng, size, môn học...',
  `status` ENUM('available', 'reserved', 'lent', 'completed', 'paused', 'expired', 'hidden') NOT NULL DEFAULT 'available',
  `views_count` INT NOT NULL DEFAULT 0,
  `likes_count` INT NOT NULL DEFAULT 0,
  `is_pushed` BOOLEAN NOT NULL DEFAULT FALSE,
  `pushed_until` TIMESTAMP NULL DEFAULT NULL,
  `is_urgent` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_demo` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_products_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_products_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`),
  INDEX `idx_products_trade` (`trade_type`, `status`),
  INDEX `idx_products_cluster` (`cluster`),
  INDEX `idx_products_category` (`category_id`, `subcategory_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng danh sách món đồ trao đổi';

-- Bảng hình ảnh sản phẩm
CREATE TABLE `product_images` (
  `id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `is_primary` BOOLEAN NOT NULL DEFAULT FALSE,
  `display_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng yêu thích (Favorites)
CREATE TABLE `favorites` (
  `user_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `product_id`),
  CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fav_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 7. BẢNG GÓC CẦN TÌM / CẦN MUA (BUY REQUESTS - WANTED BOARD)
-- ==============================================================================
CREATE TABLE `buy_requests` (
  `id` VARCHAR(36) NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL COMMENT 'Nhu cầu cần tìm (VD: Tìm giáo trình CSDL)',
  `category_id` VARCHAR(50) NOT NULL,
  `budget` DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Ngân sách sinh viên có thể chi',
  `school` VARCHAR(50) NOT NULL DEFAULT 'DHV',
  `cluster` VARCHAR(50) NOT NULL DEFAULT 'q5',
  `description` TEXT DEFAULT NULL,
  `status` ENUM('open', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  `offers_count` INT NOT NULL DEFAULT 0 COMMENT 'Số người bán đã gửi báo giá',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_wanted_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 8. BẢNG GIAO DỊCH, HẸN GẶP & TỦ ĐỒ CAMPUS (EXCHANGES & ORDERS)
-- ==============================================================================
CREATE TABLE `exchanges` (
  `id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `buyer_id` VARCHAR(36) NOT NULL,
  `seller_id` VARCHAR(36) NOT NULL,
  `status` ENUM('pending', 'reserved', 'completed', 'cancelled') NOT NULL DEFAULT 'reserved',
  `handover_method` ENUM('face_to_face', 'campus_locker') NOT NULL DEFAULT 'face_to_face' COMMENT 'Gặp trực tiếp hoặc nhận qua Tủ đồ Campus',
  `locker_id` INT DEFAULT NULL COMMENT 'Mã ô tủ đồ nếu chọn nhận tại tủ KTX',
  `security_code_hash` VARCHAR(255) DEFAULT NULL COMMENT 'Mã xác nhận bàn giao (mã OTP bí mật)',
  `meeting_spot` VARCHAR(255) DEFAULT NULL,
  `meeting_time` DATETIME DEFAULT NULL,
  `buyer_phone` VARCHAR(20) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_exchanges_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_exchanges_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_exchanges_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 9. BẢNG TIN NHẮN TRÒ CHUYỆN (CONVERSATIONS & MESSAGES)
-- ==============================================================================
CREATE TABLE `conversations` (
  `id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) DEFAULT NULL,
  `user_one_id` VARCHAR(36) NOT NULL,
  `user_two_id` VARCHAR(36) NOT NULL,
  `last_message` TEXT DEFAULT NULL,
  `last_message_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_conv_user1` FOREIGN KEY (`user_one_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_conv_user2` FOREIGN KEY (`user_two_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `messages` (
  `id` VARCHAR(36) NOT NULL,
  `conversation_id` VARCHAR(36) NOT NULL,
  `sender_id` VARCHAR(36) NOT NULL,
  `text` TEXT NOT NULL,
  `is_spot_suggestion` BOOLEAN NOT NULL DEFAULT FALSE,
  `spot_name` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_messages_conv` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_messages_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 10. BẢNG ĐĂNG KÝ NHẬN ĐỒ 0Đ & BỨC TƯỜNG TRI ÂN (GIVEAWAY & KINDNESS WALL)
-- ==============================================================================
CREATE TABLE `giveaway_claims` (
  `id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `applicant_id` VARCHAR(36) NOT NULL,
  `student_year` VARCHAR(50) NOT NULL COMMENT 'Khóa học (VD: Tân sinh viên K24/K25)',
  `message` TEXT NOT NULL COMMENT 'Lời nhắn gửi tới người cho tặng',
  `commitment` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Cam kết trân trọng và không bán lại',
  `status` ENUM('pending', 'approved', 'declined') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_giveaway_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_giveaway_applicant` FOREIGN KEY (`applicant_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `kindness_wall` (
  `id` VARCHAR(36) NOT NULL,
  `from_user_id` VARCHAR(36) NOT NULL COMMENT 'Người nhận gửi lời cảm ơn',
  `to_user_name` VARCHAR(100) NOT NULL COMMENT 'Tên người tặng',
  `item_title` VARCHAR(255) NOT NULL COMMENT 'Món đồ đã nhận được',
  `school` VARCHAR(100) NOT NULL DEFAULT 'Đại học Hùng Vương TP.HCM',
  `message` TEXT NOT NULL COMMENT 'Lời tri ân',
  `likes` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_kindness_user` FOREIGN KEY (`from_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 11. BẢNG MỞ KHÓA THÔNG TIN NGƯỜI BÁN (SELLER REGISTRATIONS)
-- ==============================================================================
CREATE TABLE `seller_registrations` (
  `id` VARCHAR(36) NOT NULL,
  `buyer_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) NOT NULL,
  `buyer_name` VARCHAR(100) NOT NULL,
  `buyer_phone` VARCHAR(20) NOT NULL,
  `buyer_student_id` VARCHAR(50) NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'momo',
  `amount` DECIMAL(12,2) NOT NULL DEFAULT 2000.00 COMMENT 'Phí kết nối (2.000đ)',
  `status` ENUM('paid', 'pending', 'cancelled') NOT NULL DEFAULT 'paid',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_reg_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_reg_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 12. BẢNG ĐÁNH GIÁ UY TÍN (REVIEWS) & BÁO CÁO VI PHẠM (REPORTS)
-- ==============================================================================
CREATE TABLE `reviews` (
  `id` VARCHAR(36) NOT NULL,
  `exchange_id` VARCHAR(36) DEFAULT NULL,
  `reviewer_id` VARCHAR(36) NOT NULL,
  `reviewee_id` VARCHAR(36) NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_rev_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_rev_reviewee` FOREIGN KEY (`reviewee_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reports` (
  `id` VARCHAR(36) NOT NULL,
  `reporter_id` VARCHAR(36) NOT NULL,
  `product_id` VARCHAR(36) DEFAULT NULL,
  `target_user_id` VARCHAR(36) DEFAULT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'reviewed', 'dismissed', 'banned') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_reports_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 13. SEED DỮ LIỆU DANH MỤC VÀ DANH MỤC CON
-- ==============================================================================
INSERT INTO `categories` (`id`, `name`, `icon`, `display_order`) VALUES
('books', 'Sách & giáo trình', 'BookOpen', 1),
('electronics', 'Đồ công nghệ', 'Laptop', 2),
('dorm', 'Đồ phòng trọ', 'House', 3),
('fashion', 'Thời trang', 'Shirt', 4),
('sports', 'Thể thao', 'Dumbbell', 5),
('stationery', 'Đồ học tập', 'PencilRuler', 6),
('handmade', 'Handmade', 'HeartHandshake', 7),
('other', 'Khác', 'Grid2X2', 8);

INSERT INTO `subcategories` (`id`, `category_id`, `name`, `display_order`) VALUES
-- Sách & giáo trình
('textbooks', 'books', 'Giáo trình chuyên ngành', 1),
('reference', 'books', 'Sách tham khảo', 2),
('notes', 'books', 'Tài liệu & đề cương', 3),
('exam', 'books', 'Đề thi, tài liệu ôn tập', 4),

-- Đồ công nghệ
('laptops', 'electronics', 'Laptop, máy tính bàn', 1),
('phones', 'electronics', 'Điện thoại, máy tính bảng', 2),
('audio', 'electronics', 'Tai nghe, loa', 3),
('calculators', 'electronics', 'Máy tính Casio', 4),
('accessories', 'electronics', 'Phụ kiện điện tử', 5),

-- Đồ phòng trọ
('furniture', 'dorm', 'Bàn ghế, kệ, tủ', 1),
('lighting_fan', 'dorm', 'Đèn bàn, quạt', 2),
('kitchen', 'dorm', 'Đồ nhà bếp', 3),
('cleaning', 'dorm', 'Đồ vệ sinh, lưu trữ', 4),
('appliances', 'dorm', 'Thiết bị gia dụng', 5),

-- Thời trang
('clothing', 'fashion', 'Áo, quần', 1),
('jackets', 'fashion', 'Áo khoác', 2),
('footwear', 'fashion', 'Giày, dép', 3),
('bags', 'fashion', 'Balo, túi xách', 4),
('accessories_fa', 'fashion', 'Phụ kiện thời trang', 5),

-- Thể thao
('badminton', 'sports', 'Cầu lông', 1),
('football', 'sports', 'Bóng đá', 2),
('basketball', 'sports', 'Bóng rổ', 3),
('gym', 'sports', 'Gym, tập luyện', 4),
('cycling_running', 'sports', 'Chạy bộ, đạp xe', 5),
('other_sports', 'sports', 'Dụng cụ thể thao khác', 6),

-- Đồ học tập
('drawing_tools', 'stationery', 'Bút, thước, dụng cụ vẽ', 1),
('calculators_st', 'stationery', 'Máy tính cầm tay', 2),
('notebooks', 'stationery', 'Vở, sổ ghi chép', 3),
('major_tools', 'stationery', 'Dụng cụ học tập chuyên ngành', 4),
('pencil_cases', 'stationery', 'Hộp bút, balo học tập', 5),

-- Handmade
('keychains', 'handmade', 'Móc khóa handmade', 1),
('crochet', 'handmade', 'Đồ len, thú bông', 2),
('jewelry', 'handmade', 'Trang sức thủ công', 3),
('decor', 'handmade', 'Đồ trang trí', 4),
('materials', 'handmade', 'Nguyên liệu handmade', 5),
('diy_kits', 'handmade', 'Bộ kit DIY', 6),

-- Khác
('instruments', 'other', 'Nhạc cụ', 1),
('travel', 'other', 'Đồ du lịch', 2),
('collectibles', 'other', 'Đồ sưu tầm', 3),
('other_items', 'other', 'Món đồ khác', 4);

-- ==============================================================================
-- 14. SEED TÀI KHOẢN ADMIN: SINH VIÊN DHV (2305CT0661 - Dhv@04102005)
-- Mật khẩu: Dhv@04102005
-- ==============================================================================
INSERT INTO `users` (
  `id`, 
  `student_id`, 
  `email`, 
  `password_hash`, 
  `salt`, 
  `full_name`, 
  `university_code`, 
  `university_name`, 
  `faculty`, 
  `academic_year`, 
  `phone`, 
  `avatar_url`, 
  `role`, 
  `purpose`, 
  `tier`, 
  `push_credits`, 
  `rating`, 
  `deal_count`, 
  `is_verified`, 
  `bio`
) VALUES (
  'usr_dhv_admin_2305ct0661',
  '2305CT0661',
  '2305ct0661@dhv.edu.vn',
  -- Scrypt hash tạo từ Node.js cho mật khẩu "Dhv@04102005"
  'ea8e6f99d5e2e8ebd93655583de9406d6eee0c2bc1bdb7ddc619196aa3d295478ecfd9a838d3f71d75fefbaf27bb8bbdb830b2b6a425ed6048a2d8f54a68462e',
  'c779109eee0cf5d976eb9f18a3ae2b1e',
  'Sinh viên DHV (Admin)',
  'DHV',
  'Đại học Hùng Vương TP.HCM',
  'Khoa Công nghệ Thông tin',
  'K23 (2023 - 2027)',
  '0908123456',
  '/assets/detail/seller-avatar.png',
  'admin',               -- Phân quyền Admin tối cao
  'both',                -- Vừa mua vừa bán
  'hunter_pro',          -- Gói VIP Hunter Pro
  99,                    -- 99 lượt đẩy tin
  5.0,                   -- Đánh giá 5 sao
  28,                    -- 28 giao dịch uy tín
  TRUE,                  -- Đã xác minh sinh viên chính thức
  'Quản trị viên UniSwap - Sinh viên Khoa CNTT Trường Đại học Hùng Vương TP.HCM (DHV).'
);

-- Thêm một số tài khoản sinh viên mẫu các trường khác
INSERT INTO `users` (`id`, `student_id`, `email`, `password_hash`, `full_name`, `university_code`, `university_name`, `faculty`, `academic_year`, `phone`, `role`, `purpose`, `tier`, `is_verified`) VALUES
('usr_student_bk', '2110982', 'kiet.nguyen@hcmut.edu.vn', 'hash_bk_pwd', 'Nguyễn Tuấn Kiệt', 'HCMUT', 'ĐH Bách Khoa TP.HCM', 'Kỹ thuật Cơ khí', 'K21', '0912345678', 'student', 'seller', 'free', TRUE),
('usr_student_ueh', '2250123', 'uyen.tran@ueh.edu.vn', 'hash_ueh_pwd', 'Trần Phương Uyên', 'UEH', 'ĐH Kinh tế TP.HCM', 'Marketing', 'K22', '0987654321', 'student', 'both', 'free', TRUE),
('usr_student_spkt', '2014567', 'huy.le@ute.edu.vn', 'hash_ute_pwd', 'Lê Minh Huy', 'HCMUTE', 'ĐH Sư phạm Kỹ thuật', 'Cơ điện tử', 'K20', '0933221100', 'student', 'seller', 'free', TRUE);

-- ==============================================================================
-- 15. SEED DỮ LIỆU SẢN PHẨM MẪU (PRODUCTS)
-- ==============================================================================
INSERT INTO `products` (
  `id`, `seller_id`, `title`, `category_id`, `subcategory_id`, `major_group`, 
  `trade_type`, `price`, `condition_grade`, `description`, `meeting_spot`, `cluster`, `views_count`, `likes_count`
) VALUES
(
  'prod_demo_1', 'usr_dhv_admin_2305ct0661',
  'Laptop Dell Inspiron 15 (Core i5, RAM 16GB, SSD 512GB) học CNTT DHV',
  'electronics', 'laptops', 'it', 'sale', 6500000.00, 'Như mới',
  'Máy mình dùng học lập trình web và đồ án cơ sở dữ liệu tại DHV. Máy nguyên zin, pin còn 4 tiếng, phím gõ nảy mượt.',
  'Cơ sở ĐH Hùng Vương TP.HCM (736 Nguyễn Trãi, Q.5)', 'q5', 340, 48
),
(
  'prod_demo_2', 'usr_dhv_admin_2305ct0661',
  'Máy tính Casio FX-580VN X chính hãng Bitex (Màu đen tem chuẩn)',
  'electronics', 'calculators', 'general', 'sale', 350000.00, 'Như mới',
  'Máy mua ở Fahasa, còn nguyên tem Bitex, nắp đậy đầy đủ. Phím bấm nảy, màn hình sáng đẹp không đốm.',
  'Sảnh cơ sở DHV hoặc Canteen Q.5', 'q5', 215, 32
),
(
  'prod_demo_3', 'usr_student_bk',
  'Giáo trình Giải tích 1 & Đại số tuyến tính (ĐHQG chuẩn K23/K24)',
  'books', 'textbooks', 'general', 'giveaway', 0.00, 'Tốt',
  'Sách mình đã học qua môn, ghi chú nhiều dạng bài thi cuối kỳ. Tặng lại 0đ cho bạn tân sinh viên nào cần nhé!',
  'Sảnh nhà C6 - ĐH Bách Khoa CS2 Dĩ An / KTX Khu B', 'lang-dh', 420, 68
),
(
  'prod_demo_4', 'usr_student_ueh',
  'Bàn học gấp gọn chân sắt & Đèn học led bảo vệ mắt',
  'dorm', 'furniture', 'general', 'giveaway', 0.00, 'Tốt',
  'Mình chuyển trọ về quê nên tặng lại bàn học gấp gọn và đèn bàn led ánh sáng trắng. Ưu tiên bạn nào qua lấy trực tiếp.',
  'KTX Khu B ĐHQG - Nhà B3', 'lang-dh', 290, 55
),
(
  'prod_demo_5', 'usr_student_spkt',
  'Bộ vợt cầu lông Yonex Nanoray kèm bao đựng & 3 quả cầu',
  'sports', 'badminton', 'general', 'sale', 280000.00, 'Còn tốt',
  'Vợt đan cước 10.5kg còn rất căng, phom cân bằng công thủ toàn diện. Tặng kèm bao vợt chống sốc.',
  'Sân thể thao ĐH Sư phạm Kỹ thuật hoặc Làng ĐH', 'lang-dh', 180, 24
);

-- ==============================================================================
-- 16. SEED HÌNH ẢNH SẢN PHẨM (PRODUCT_IMAGES)
-- ==============================================================================
INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `is_primary`, `display_order`) VALUES
('img_1', 'prod_demo_1', '/assets/detail/macbook-detail-1.png', TRUE, 1),
('img_2', 'prod_demo_1', '/assets/detail/macbook-detail-2.png', FALSE, 2),
('img_3', 'prod_demo_2', 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80', TRUE, 1),
('img_4', 'prod_demo_3', '/assets/demo/books-textbooks-0.svg', TRUE, 1),
('img_5', 'prod_demo_4', '/assets/3d-dorm.png', TRUE, 1),
('img_6', 'prod_demo_5', '/assets/detail/book-detail-3.png', TRUE, 1);

-- ==============================================================================
-- 17. SEED BỨC TƯỜNG TRI ÂN (KINDNESS WALL)
-- ==============================================================================
INSERT INTO `kindness_wall` (`id`, `from_user_id`, `to_user_name`, `item_title`, `school`, `message`, `likes`) VALUES
('kw_1', 'usr_dhv_admin_2305ct0661', 'Anh Tuấn Kiệt (HCMUT)', 'Giáo trình Giải tích 1', 'Đại học Hùng Vương TP.HCM', 'Cảm ơn anh Kiệt nhiều ạ! Nhờ sách của anh có sẵn ghi chú bài tập mà em đã qua môn toán giải tích điểm B+. Chúc anh năm cuối làm đồ án thật tốt!', 24),
('kw_2', 'usr_student_ueh', 'Bạn Phương Uyên', 'Bàn học gấp & Đèn led', 'Đại học Kinh tế TP.HCM', 'Cảm ơn Uyên dễ thương đã tặng bàn học cho mình lúc mới chân ướt chân ráo lên Sài Gòn nhập học KTX Khu B. Món đồ rất ý nghĩa với mình!', 19);

-- ==============================================================================
-- HOÀN TẤT CÀI ĐẶT
-- Kiểm tra tài khoản Admin vừa tạo:
-- ==============================================================================
SELECT 
  `id`, `student_id`, `email`, `full_name`, `university_code`, `role`, `tier`, `push_credits`
FROM `users` 
WHERE `student_id` = '2305CT0661';
