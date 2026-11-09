import { randomUUID } from "node:crypto";
// Local-only administration: run from the project folder; no public admin toggle.
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const db = new DatabaseSync(
  process.env.SWAP_DB || path.join(root, "data/swap.sqlite"),
);
const [command, id] = process.argv.slice(2);
if (command === "grant-admin" && id) {
  const u = db
    .prepare("SELECT id FROM users WHERE email=?")
    .get(id.toLowerCase());
  if (!u) throw Error("Tài khoản phải đăng ký và xác minh trước.");
  const a = db
    .prepare("SELECT verified FROM account_state WHERE user_id=?")
    .get(u.id);
  if (!a?.verified) throw Error("Tài khoản chưa xác minh.");
  db.prepare("UPDATE account_state SET admin=1 WHERE user_id=?").run(u.id);
  db.prepare("INSERT INTO audit VALUES(?,?,?,?,?,?)").run(
    randomUUID(),
    "local-cli",
    "grant-admin",
    u.id,
    "",
    new Date().toISOString(),
  );
  console.log("Đã cấp quản trị cho " + id);
} else if (command === "revoke-admin" && id) {
  db.prepare(
    "UPDATE account_state SET admin=0 WHERE user_id=(SELECT id FROM users WHERE email=?)",
  ).run(id.toLowerCase());
  db.prepare("INSERT INTO audit VALUES(?,?,?,?,?,?)").run(
    randomUUID(),
    "local-cli",
    "revoke-admin",
    id,
    "",
    new Date().toISOString(),
  );
  console.log("Đã thu hồi quản trị.");
} else if (command === "reports")
  console.table(
    db
      .prepare(
        "SELECT r.id,r.product_id,r.reason,r.created,u.name FROM reports r JOIN users u ON u.id=r.user_id ORDER BY r.created DESC",
      )
      .all(),
  );
else if (command === "orders")
  console.table(
    db
      .prepare(
        "SELECT o.id,u.email,o.plan,o.amount,o.status,o.created FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created DESC",
      )
      .all(),
  );
else if (["hide", "restore"].includes(command) && id) {
  const row = db.prepare("SELECT data FROM products WHERE id=?").get(id);
  if (!row) throw Error("Không tìm thấy bài đăng.");
  const item = JSON.parse(row.data);
  item.moderation = command === "hide" ? "hidden" : undefined;
  db.prepare("UPDATE products SET data=? WHERE id=?").run(
    JSON.stringify(item),
    id,
  );
  console.log(
    command === "hide"
      ? "Đã ẩn bài khỏi kết quả công khai."
      : "Đã khôi phục hiển thị.",
  );
} else
  console.log(
    "npm run admin -- reports | orders | hide <product-id> | restore <product-id> | grant-admin <email> | revoke-admin <email>",
  );
db.close();
