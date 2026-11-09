import {PLANS,BOOST_PLANS,FREE_LIMITS,planLimits,CATEGORY_TREE,CONDITIONS,classifyTitle,validSubcategory,conditionGroup} from '../shared/catalog.ts';
import {apiSpec} from './openapi.mjs';
const day=86400000;
export function initPremium(db){
 if(!db.prepare('PRAGMA table_info(subscriptions)').all().some(r=>r.name==='starts'))db.exec('ALTER TABLE subscriptions ADD COLUMN starts INTEGER');
 db.prepare("UPDATE subscriptions SET starts=expires-CASE WHEN plan='semester' THEN 150 WHEN plan='year' THEN 360 ELSE 30 END*86400000 WHERE starts IS NULL").run();
 db.exec(`CREATE TABLE IF NOT EXISTS boost_wallet(order_id TEXT PRIMARY KEY REFERENCES orders(id),user_id TEXT REFERENCES users(id),starts INTEGER,expires INTEGER,remaining INTEGER);
 CREATE TABLE IF NOT EXISTS price_alerts(user_id TEXT REFERENCES users(id),product_id TEXT REFERENCES products(id),target INTEGER,triggered TEXT,created TEXT,PRIMARY KEY(user_id,product_id));
 CREATE TABLE IF NOT EXISTS checkout_attempts(reference TEXT PRIMARY KEY,order_id TEXT REFERENCES orders(id),url TEXT,expires INTEGER,created TEXT,status TEXT DEFAULT 'pending');`);
 for(const s of db.prepare("SELECT s.*,o.status FROM subscriptions s JOIN orders o ON o.id=s.order_id WHERE s.plan IN ('seller','both','month','semester','year') AND o.status IN ('paid','simulated')").all())db.prepare('INSERT OR IGNORE INTO boost_wallet VALUES(?,?,?,?,?)').run(s.order_id,s.user_id,s.starts,s.expires,3);
 // Correct only demo categorization. User content keeps its chosen parent category.
 for(const r of db.prepare('SELECT id,data FROM products').all()){const p=JSON.parse(r.data),hint=classifyTitle(p.title);if(p.isDemo&&!p.demoVersion&&hint)p.category=hint.category;p.subcategory=validSubcategory(p.category,p.subcategory)?p.subcategory:hint?.category===p.category?hint.subcategory:'other';p.conditionGroup=conditionGroup(p.condition);const value=JSON.stringify(p);if(value!==r.data)db.prepare('UPDATE products SET data=? WHERE id=?').run(value,r.id);}
}
export function membershipRights(db,id,localMode){
 const subscriptions=db.prepare("SELECT s.*,o.status FROM subscriptions s JOIN orders o ON o.id=s.order_id WHERE s.user_id=? AND s.expires>? AND (o.status='paid' OR (?=1 AND o.status='simulated')) ORDER BY s.expires DESC").all(id,Date.now(),localMode?1:0),active=subscriptions.filter(s=>s.starts<=Date.now());
 const seller=active.filter(s=>['seller','both','month','semester','year'].includes(s.plan)),buyer=active.filter(s=>['buyer','both'].includes(s.plan)),limits=planLimits(buyer.length>0,seller.length>0);
 const credits=db.prepare("SELECT COALESCE(SUM(w.remaining),0) AS n FROM boost_wallet w JOIN orders o ON o.id=w.order_id WHERE w.user_id=? AND w.starts<=? AND w.expires>? AND (o.status='paid' OR (?=1 AND o.status='simulated'))").get(id,Date.now(),Date.now(),localMode?1:0).n;
 return {buyerPremium:buyer.length>0,sellerPremium:seller.length>0,buyerUntil:buyer.length?Math.max(...buyer.map(s=>s.expires)):null,sellerUntil:seller.length?Math.max(...seller.map(s=>s.expires)):null,limits,pushCredits:credits,subscription:active[0]||null,subscriptions};
}
export function createPremium({db,fail,parse,row,put,transaction,notify,audit,localMode,verified}){
 const now=()=>new Date().toISOString();
 const rights=u=>membershipRights(db,u.id,localMode);
 function grant(order,starts,expires){if(['seller','both','month','semester','year'].includes(order.plan))db.prepare('INSERT OR IGNORE INTO boost_wallet VALUES(?,?,?,?,?)').run(order.id,order.user_id,starts,expires,3);}
 function changed(old,p){
   if(!old||old.price===p.price||p.status!=='available')return;
   for(const w of db.prepare('SELECT * FROM price_alerts WHERE product_id=? AND triggered IS NULL AND target>=?').all(p.id,p.price)){notify(w.user_id,'price',`“${p.title}” đã về ${p.price.toLocaleString('vi-VN')}đ, đạt giá bạn theo dõi.`,p.id);db.prepare('UPDATE price_alerts SET triggered=? WHERE user_id=? AND product_id=?').run(now(),w.user_id,p.id);}
 }
 async function handle({route,method,body,session:u,send}){
   const ok=(data={},status=200)=>{send(status,data);return true;};
   if(route==='/api/plans'&&method==='GET')return ok({plans:PLANS,free:FREE_LIMITS,boostPlans:BOOST_PLANS,renewal:'manual',currency:'VND'});
   if(route==='/api/catalog'&&method==='GET')return ok({categories:CATEGORY_TREE,conditions:CONDITIONS});
   if(route==='/api/openapi.json'&&method==='GET')return ok(apiSpec);
   if(route==='/api/membership'&&method==='GET'){
     if(!u)fail(401,'Đăng nhập để xem gói của bạn.');const r=rights(u);return ok({...r,subscriptions:db.prepare('SELECT s.*,o.status FROM subscriptions s JOIN orders o ON o.id=s.order_id WHERE s.user_id=? ORDER BY s.starts DESC').all(u.id),usage:{posts:db.prepare('SELECT data FROM products WHERE owner=?').all(u.id).map(parse).filter(p=>['available','reserved','lent'].includes(p.status)&&!p.deleted).length,priceAlerts:db.prepare('SELECT COUNT(*) AS n FROM price_alerts WHERE user_id=?').get(u.id).n,buyRequests:db.prepare("SELECT COUNT(*) AS n FROM buy_requests WHERE user_id=? AND status='open'").get(u.id).n,savedSearches:db.prepare('SELECT COUNT(*) AS n FROM searches WHERE user_id=?').get(u.id).n}});
   }
   if(route==='/api/price-alerts'&&method==='GET'){verified(u);return ok({alerts:db.prepare('SELECT w.*,p.data FROM price_alerts w JOIN products p ON p.id=w.product_id WHERE w.user_id=? ORDER BY w.created DESC').all(u.id).map(w=>({...w,product:parse(w),data:undefined})),limit:rights(u).limits.priceAlerts});}
   const watch=route.match(/^\/api\/products\/([^/]+)\/price-alert$/);
   if(watch){verified(u);const r=row(watch[1]),p=parse(r);if(!p||p.deleted)fail(404,'Món đồ không còn tồn tại.');if(method==='DELETE'){db.prepare('DELETE FROM price_alerts WHERE user_id=? AND product_id=?').run(u.id,p.id);return ok({ok:true});}if(method==='POST'){
     if(r.owner===u.id||p.isDemo||!['sale','borrow'].includes(p.tradeType)||p.status!=='available'||p.moderation==='hidden')fail(400,'Chọn món đang bán hoặc cho mượn của người khác.');if(!Number.isSafeInteger(body.targetPrice)||body.targetPrice<1||body.targetPrice>=p.price)fail(400,'Giá mục tiêu phải thấp hơn giá hiện tại và lớn hơn 0.');
     if(!db.prepare('SELECT 1 FROM price_alerts WHERE user_id=? AND product_id=?').get(u.id,p.id)&&db.prepare('SELECT COUNT(*) AS n FROM price_alerts WHERE user_id=?').get(u.id).n>=rights(u).limits.priceAlerts)fail(409,'Đã đạt hạn mức theo dõi giá. Bỏ bớt món hoặc chọn Premium Mua.');
     db.prepare('INSERT INTO price_alerts VALUES(?,?,?,NULL,?) ON CONFLICT(user_id,product_id) DO UPDATE SET target=excluded.target,triggered=NULL').run(u.id,p.id,body.targetPrice,now());return ok({ok:true,message:'Đã theo dõi. Bạn sẽ nhận thông báo trong ứng dụng khi món về giá mục tiêu.'});
   }}
   const boost=route.match(/^\/api\/products\/([^/]+)\/use-boost$/);
   if(boost&&method==='POST'){
     verified(u);const r=row(boost[1]),p=parse(r);if(!p||r.owner!==u.id)fail(403,'Chỉ đẩy tin của bạn.');if(p.status!=='available'||p.deleted||p.moderation==='hidden')fail(409,'Tin cần đang hiển thị để đẩy.');if(!rights(u).sellerPremium)fail(403,'Lượt đẩy kèm gói dành cho Premium Bán hoặc Toàn Diện.');
     transaction(()=>{const w=db.prepare("SELECT w.* FROM boost_wallet w JOIN orders o ON o.id=w.order_id WHERE w.user_id=? AND w.starts<=? AND w.expires>? AND w.remaining>0 AND (o.status='paid' OR (?=1 AND o.status='simulated')) ORDER BY w.expires LIMIT 1").get(u.id,Date.now(),Date.now(),localMode?1:0);if(!w)fail(409,'Đã dùng hết lượt đẩy kèm gói trong kỳ.');db.prepare('UPDATE boost_wallet SET remaining=remaining-1 WHERE order_id=? AND remaining>0').run(w.order_id);put({...p,pushedUntil:new Date(Math.max(Date.now(),Date.parse(p.pushedUntil)||0)+day).toISOString()},u.id);audit(u.id,'use-boost',p.id);});return ok({message:'Đã đẩy tin 24 giờ và dùng 1 lượt kèm gói.',credits:rights(u).pushCredits});
   }
   return false;
 }
 return {handle,grant,changed,rights};
}
