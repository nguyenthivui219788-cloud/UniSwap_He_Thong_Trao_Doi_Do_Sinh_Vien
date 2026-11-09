import { DatabaseSync } from "node:sqlite";
import { scryptSync, randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const db = new DatabaseSync(path.join(root, "data/swap.sqlite"));

// 1. Chuyển 2305CT0661 thành sinh viên thường (admin = 0)
db.prepare("UPDATE account_state SET admin=0 WHERE user_id='usr_dhv_admin_2305ct0661'").run();
db.prepare("UPDATE users SET name='Sinh viên DHV (2305CT0661)' WHERE id='usr_dhv_admin_2305ct0661'").run();

// 2. Tạo hoặc cập nhật tài khoản Admin: username/email 'admin', pass '123'
const salt = randomBytes(16).toString("hex");
const pwdHash = scryptSync("123", salt, 64).toString("hex");

const existing = db.prepare("SELECT id FROM users WHERE id='usr_system_admin' OR email='admin@uniswap.edu.vn'").get();
if (existing) {
  db.prepare("UPDATE users SET email='admin@uniswap.edu.vn', name='Quản trị viên UniSwap (Admin)', password=?, salt=?, school='DHV' WHERE id=?").run(pwdHash, salt, existing.id);
  db.prepare("INSERT OR REPLACE INTO account_state(user_id, verified, suspended, admin, avatar) VALUES(?, 1, 0, 1, '')").run(existing.id);
} else {
  db.prepare("INSERT INTO users(id, email, name, password, salt, school, created) VALUES(?,?,?,?,?,?,?)").run(
    "usr_system_admin",
    "admin@uniswap.edu.vn",
    "Quản trị viên UniSwap (Admin)",
    pwdHash,
    salt,
    "DHV",
    new Date().toISOString()
  );
  db.prepare("INSERT INTO account_state(user_id, verified, suspended, admin, avatar) VALUES('usr_system_admin', 1, 0, 1, '')").run();
  db.prepare("INSERT OR REPLACE INTO profiles(user_id, purpose, consent) VALUES('usr_system_admin', 'both', '2026-10-31')").run();
}

console.log("Danh sách tài khoản sau khi cập nhật:");
console.log(
  db
    .prepare(
      "SELECT u.id, u.email, u.name, a.admin, a.verified FROM users u LEFT JOIN account_state a ON a.user_id=u.id"
    )
    .all()
);
