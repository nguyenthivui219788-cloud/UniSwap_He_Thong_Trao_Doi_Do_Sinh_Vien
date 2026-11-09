import {readFileSync,unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),file=path.join(root,'.cache/run.json');
let run;try{run=JSON.parse(readFileSync(file,'utf8'));}catch{console.log('Không có phiên UniSwap được ghi nhận.');process.exit(0);}
if(path.resolve(run.root)!==path.resolve(root))throw Error('Bản ghi không thuộc dự án này.');
for(const pid of run.children||[]){
 if(!Number.isSafeInteger(pid)||pid<=0)continue;
 if(process.platform==='win32'){
   let p;try{p=JSON.parse(execFileSync('powershell.exe',['-NoProfile','-Command',`Get-CimInstance Win32_Process -Filter 'ProcessId = ${pid}' | Select-Object Name,CommandLine | ConvertTo-Json -Compress`],{encoding:'utf8',windowsHide:true}).trim()||'null');}catch{continue;}
   if(p?.Name?.toLowerCase()==='node.exe'&&p.CommandLine?.toLowerCase().includes(root.toLowerCase()))try{execFileSync('taskkill.exe',['/PID',String(pid),'/T','/F'],{stdio:'ignore',windowsHide:true});}catch{/* already exited */}
 }else try{process.kill(pid,'SIGTERM');}catch{/* already exited */}
}
try{unlinkSync(file);}catch{/* main process cleaned it */}console.log('Đã dừng phiên UniSwap của thư mục này.');
