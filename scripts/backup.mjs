import { DatabaseSync } from "node:sqlite";
import { mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url)),
  source = process.env.SWAP_DB || path.join(root, "data/swap.sqlite");
if (!existsSync(source))
  throw Error("Chưa có dữ liệu. Khởi động UniSwap trước.");
const folder = path.join(root, "backups");
mkdirSync(folder, { recursive: true });
const target = path.join(
  folder,
  "swap-" + new Date().toISOString().replace(/[:.]/g, "-") + ".sqlite",
);
const db = new DatabaseSync(source);
db.exec("VACUUM INTO '" + target.replace(/'/g, "''") + "'");
db.close();
console.log("Đã tạo bản sao SQLite nhất quán: " + target);
