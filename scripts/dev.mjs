import { spawn } from "node:child_process";
import {readFileSync,writeFileSync,mkdirSync,existsSync,unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),runfile=path.join(root,'.cache/run.json');
mkdirSync(path.dirname(runfile),{recursive:true});
if(existsSync(runfile)){try{const previous=JSON.parse(readFileSync(runfile,'utf8'));process.kill(previous.pid,0);console.log('UniSwap đang chạy. Mở http://localhost:8080 (hoặc http://localhost:5173) hoặc dùng DUNG_WEB_UNISWAP.bat trước khi chạy lại.');process.exit(0);}catch{/* stale record */}}
const children = [
  spawn(process.execPath, [path.join(root,"server/server.mjs")], { stdio: "inherit",cwd:root }),
  spawn(process.execPath, [path.join(root,"node_modules/vite/bin/vite.js")], {
    stdio: "inherit",
    cwd:root,
  }),
  spawn(process.execPath, [path.join(root,"scripts/forwarder-5173.mjs")], {
    stdio: "inherit",
    cwd:root,
  }),
];
writeFileSync(runfile,JSON.stringify({root,pid:process.pid,children:children.map(c=>c.pid)}));
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  try{if(JSON.parse(readFileSync(runfile,'utf8')).pid===process.pid)unlinkSync(runfile);}catch{/* no record */}
  process.exit(code);
}
for (const child of children) {
  child.on("error", (e) => {
    console.error(e);
    stop(1);
  });
  child.on("exit", (code) => stop(code || 0));
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
