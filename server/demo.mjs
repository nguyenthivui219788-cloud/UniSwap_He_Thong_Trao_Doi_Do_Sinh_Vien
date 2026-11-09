import {randomBytes} from 'node:crypto';
import {demoProducts,DEMO_TOPICS,DEMO_CAMPUSES,DEMO_PEOPLE} from '../shared/demo-data.mjs';
export function initDemo(db,now=Date.now()){
 for(const table of ['buy_requests','topics'])if(!db.prepare(`PRAGMA table_info(${table})`).all().some(c=>c.name==='is_demo'))db.exec(`ALTER TABLE ${table} ADD COLUMN is_demo INTEGER DEFAULT 0`);
 db.exec('BEGIN IMMEDIATE');try{
 const products=demoProducts(now);
 for(let i=0;i<DEMO_CAMPUSES.length;i++){const id='demo-profile-'+i,email=`profile${i}@demo.invalid`;db.prepare('INSERT OR IGNORE INTO users(id,email,name,password,salt,school,created) VALUES(?,?,?,?,?,?,?)').run(id,email,DEMO_PEOPLE[i]+' · hồ sơ demo',randomBytes(64).toString('hex'),randomBytes(16).toString('hex'),DEMO_CAMPUSES[i].code,new Date(now).toISOString());db.prepare('UPDATE users SET school=? WHERE id=? AND email=?').run(DEMO_CAMPUSES[i].code,id,email);db.prepare('INSERT OR IGNORE INTO account_state(user_id) VALUES(?)').run(id);}
 for(const p of products){db.prepare('INSERT OR IGNORE INTO products(id,owner,data) VALUES(?,?,?)').run(p.id,null,JSON.stringify(p));const old=db.prepare('SELECT owner,data FROM products WHERE id=?').get(p.id),data=JSON.parse(old.data);if(old.owner===null&&data.isDemo&&data.demoVersion===3){const next={...data,seller:p.seller,cluster:p.cluster,meetingSpot:p.meetingSpot,demoDistribution:2};db.prepare('UPDATE products SET data=? WHERE id=? AND owner IS NULL').run(JSON.stringify(next),p.id);}}
 for(const [i,p] of products.filter((p,i)=>i%7===0).entries()){
 const id='demo-need-'+i,profile='demo-profile-'+(i%DEMO_CAMPUSES.length),data={title:'Cần tìm '+p.title,description:`Mẫu nhu cầu: tìm ${p.title.toLowerCase()} phục vụ học tập và sinh hoạt. Đây là nội dung minh họa để trải nghiệm bộ lọc và xem gợi ý.`,budget:Math.max(60000,p.price+30000),category:p.category,cluster:DEMO_CAMPUSES[i%DEMO_CAMPUSES.length].cluster,neededBy:'',image:p.images[0]};
 db.prepare("INSERT OR IGNORE INTO buy_requests(id,user_id,data,created,status,is_demo) VALUES(?,?,?,?,?,1)").run(id,profile,JSON.stringify(data),new Date(now-i*3600000).toISOString(),'open');
 db.prepare('UPDATE buy_requests SET user_id=? WHERE id=? AND is_demo=1').run(profile,id);
 db.prepare('INSERT OR IGNORE INTO buy_responses(id,request_id,user_id,product_id,text,created) VALUES(?,?,?,?,?,?)').run('demo-response-'+i,id,'demo-profile-'+((i+1)%DEMO_CAMPUSES.length),p.id,'Gợi ý minh họa từ kho demo; mở xem chi tiết món.',new Date(now).toISOString());
 }
 for(const [i,t] of DEMO_TOPICS.entries()){
 const id='demo-topic-'+i;
 db.prepare('INSERT OR IGNORE INTO topics(id,user_id,kind,title,text,school,price,created,schedule,capacity,enrollment,is_demo) VALUES(?,?,?,?,?,?,?,?,?,?,?,1)').run(id,'demo-profile-'+(i%DEMO_CAMPUSES.length),t[0],t[1],t[2]+' Nội dung demo, không phải sự kiện thật.',DEMO_CAMPUSES[i%DEMO_CAMPUSES.length].code,t[0]==='tutoring'?50000:0,new Date(now-i*7200000).toISOString(),new Date(now+(i+3)*86400000).toISOString(),8+i%4,i===10?'closed':'open');
 db.prepare('UPDATE topics SET user_id=?,school=?,title=? WHERE id=? AND is_demo=1').run('demo-profile-'+(i%DEMO_CAMPUSES.length),DEMO_CAMPUSES[i%DEMO_CAMPUSES.length].code,t[1],id);
 // Keep future demo calendars useful across sessions, without touching real activities.
 db.prepare('UPDATE topics SET schedule=? WHERE id=? AND is_demo=1 AND schedule<?').run(new Date(now+(i+3)*86400000).toISOString(),id,new Date(now).toISOString());
 db.prepare('INSERT OR IGNORE INTO replies(id,topic_id,user_id,text,created) VALUES(?,?,?,?,?)').run('demo-reply-'+i,id,'demo-profile-'+((i+1)%DEMO_CAMPUSES.length),'Thảo luận minh họa: nên chuẩn bị tài liệu và thống nhất nội dung trước buổi học.',new Date(now).toISOString());
 }
 db.exec('COMMIT');return {products:products.length,topics:DEMO_TOPICS.length};
 }catch(e){db.exec('ROLLBACK');throw e}
}
