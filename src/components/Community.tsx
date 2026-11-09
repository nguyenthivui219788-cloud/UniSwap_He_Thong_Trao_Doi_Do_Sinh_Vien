import {UNIVERSITIES} from "../data/mockData";
import {calendarEvent} from "../lib/calendar";
import { useEffect, useState, type FormEvent } from "react";
import {normalize} from "../lib/market";
import { api } from "../lib/api";
import type { User } from "../types";
const kinds: Record<string, string> = {
  bookclub: "Cà phê sách",
  study: "Nhóm học tập",
  tutoring: "Gia sư sinh viên",
};
export function Community({
  user,
  focusId="",onClearFocus,
  onLogin,
}: {
  focusId?:string;onClearFocus:()=>void;
  user: User | null;
  onLogin: () => void;
}) {
  const [topics, setTopics] = useState<any[]>([]),
    [filter, setFilter] = useState("all"),
    [schoolFilter, setSchoolFilter] = useState("all"),
    [creating, setCreating] = useState(false),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [active, setActive] = useState(""),
    [replies, setReplies] = useState<any[]>([]),
    [reply, setReply] = useState("");
  const [query,setQuery]=useState(''),[scope,setScope]=useState('all'),[availability,setAvailability]=useState('all'),[pagination,setPagination]=useState({key:'',limit:12}),[now]=useState(()=>Date.now()),[shareNotice,setShareNotice]=useState('');
  const [form, setForm] = useState({
    kind: "bookclub",
    title: "",
    text: "",
    price: 0,
    schedule: "",
    capacity: 10,
  });
  async function refresh() {
    try {
      setTopics((await api("/topics")).topics);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    api("/topics")
      .then((data) => {
        if (active) setTopics(data.topics);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user?.id]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/topics", "POST", {
        ...form,
        schedule: form.schedule
          ? new Date(form.schedule).toISOString()
          : undefined,
      });
      setForm({
        kind: "bookclub",
        title: "",
        text: "",
        price: 0,
        schedule: "",
        capacity: 10,
      });
      setCreating(false);
      setError("");
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function show(id: string) {
    if (!user&&!topics.find(t=>t.id===id)?.is_demo) {onLogin();return;}
    try {
      setActive(id);
      setReplies((await api("/topics/" + id + "/replies")).replies);
      setReply("");
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const visible = topics.filter(
    (t) =>
      (!focusId||t.id===focusId)&&
      (filter === "all" || t.kind === filter) &&
      (schoolFilter === "all" || t.school === schoolFilter)&&
      (!query||normalize([t.title,t.text,t.name].join(' ')).includes(normalize(query)))&&
      (scope==='mine'?t.user_id===user?.id:scope==='joined'?t.joined:scope==='saved'?t.saved:true)&&
      (availability==='open'?t.enrollment!=='closed'&&t.memberCount<t.capacity&&(!t.schedule||Date.parse(t.schedule)>now):availability==='scheduled'?!!t.schedule&&Date.parse(t.schedule)>now:true),
  );
  const paginationKey=JSON.stringify([query,scope,availability,filter,schoolFilter,focusId]);
  const limit=pagination.key===paginationKey?pagination.limit:12;
  async function share(id:string){const link=location.origin+'/cong-dong?topic='+encodeURIComponent(id);try{await navigator.clipboard.writeText(link);setShareNotice('Đã sao chép liên kết nhóm.')}catch{setShareNotice(link)}}
  return (
    <section className="swap-community">
      <div className="swap-result-heading">
        <div>
          <h2>Cộng đồng sinh viên</h2>
          <p>Cùng đọc sách, tìm nhóm học và chia sẻ kiến thức.</p>
        </div>
        <button
          onClick={() => {
            if (!user) {
              onLogin();
              return;
            }
            setCreating(!creating);
          }}
        >
          {creating ? "Đóng biểu mẫu" : "＋ Tạo chủ đề"}
        </button>
      </div>
      <div className="hub-board-stats"><span><b>{topics.length}</b> chủ đề cộng đồng</span><span><b>{topics.filter(t=>t.enrollment!=='closed'&&t.memberCount<t.capacity&&(!t.schedule||Date.parse(t.schedule)>now)).length}</b> nhóm đang mở</span>{user&&<span><b>{topics.filter(t=>t.joined||t.user_id===user.id).length}</b> nhóm của bạn</span>}</div>
      <div className="hub-tabs" role="group" aria-label="Nhóm cộng đồng">{[['all','Khám phá'],['joined','Đã tham gia'],['mine','Tôi tổ chức'],['saved','Đã lưu']].map(([k,v])=><button key={k} aria-pressed={scope===k} onClick={()=>{if(k!=='all'&&!user){onLogin();return}setScope(k);onClearFocus()}}>{v}</button>)}</div>
      {focusId&&<p className="hub-focus-note">Bạn đang xem một chủ đề được chia sẻ. <button onClick={onClearFocus}>Khám phá tất cả nhóm</button></p>}
      <div className="hub-filter-bar"><label>Tìm cộng đồng<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tên nhóm, chủ đề hoặc người tổ chức…"/></label><label>Trạng thái<select value={availability} onChange={e=>setAvailability(e.target.value)}><option value="all">Tất cả nhóm</option><option value="open">Còn chỗ đăng ký</option><option value="scheduled">Có lịch sắp tới</option></select></label></div>
      <div className="swap-actions">
        {[["all", "Tất cả"], ...Object.entries(kinds)].map(([k, v]) => (
          <button
            key={k}
            aria-pressed={filter === k}
            onClick={() => setFilter(k)}
          >
            {v}
          </button>
        ))}
        <label>
          Trường
          <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
          >
            <option value="all">Tất cả trường</option>
            {Array.from(new Set([...UNIVERSITIES.map(u=>u.code),...topics.map((t) => t.school)])).map((s) => (
              <option key={s} value={s}>{UNIVERSITIES.find(u=>u.code===s)?.name||s}</option>
            ))}
          </select>
        </label>
      </div>
      {creating && (
        <form className="swap-form swap-community-form" onSubmit={submit}>
          <label>
            Chủ đề
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
            >
              {Object.entries(kinds).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tiêu đề
            <input
              required
              minLength={5}
              maxLength={120}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label>
            Nội dung, thời gian & điểm hẹn công cộng
            <textarea
              required
              minLength={10}
              maxLength={3000}
              rows={3}
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
            />
          </label>
          {form.kind === "tutoring" && (
            <label>
              Phí mỗi giờ (0 = miễn phí)
              <input
                required
                type="number"
                min={0}
                max={10000000}
                step={1}
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </label>
          )}
          <div className="swap-form-row">
            <label>
              Lịch học / gặp mặt
              <input
                type="datetime-local"
                value={form.schedule}
                onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              />
            </label>
            <label>
              Số người nhận tham gia
              <input
                required
                type="number"
                min={1}
                max={100}
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: Number(e.target.value) })
                }
              />
            </label>
          </div>
          <button className="swap-primary" disabled={busy}>
            Đăng chủ đề
          </button>
        </form>
      )}
      {loading ? (
        <p>Đang tải cộng đồng…</p>
      ) : !visible.length ? (
        <p className="swap-empty">
          Chưa có nhóm phù hợp. Hãy thay bộ lọc hoặc mở đầu một buổi đọc sách, nhóm học.
          <button onClick={()=>{setQuery('');setFilter('all');setSchoolFilter('all');setScope('all');setAvailability('all');onClearFocus()}}>Xóa bộ lọc</button>
        </p>
      ) : (
        <div className="swap-community-grid">
          {visible.slice(0,limit).map((t) => (
            <article id={"topic-"+t.id} key={t.id}><div className={'hub-card-art community-art-'+t.kind}><img src={'/assets/'+(t.kind==='bookclub'?'3d-books.png':t.kind==='tutoring'?'3d-tech.png':'3d-study.png')} alt="Minh họa chủ đề cộng đồng" loading="lazy"/>{!!t.is_demo&&<span>NHÓM DEMO</span>}</div>
              <small>
                {kinds[t.kind]} · {t.school}
              </small>
              <h3>{t.title}</h3>
              <p className="swap-description">{t.text}</p>
              {t.kind === "tutoring" && (
                <b>
                  {t.price === 0
                    ? "Chia sẻ miễn phí"
                    : t.price.toLocaleString("vi-VN") + "đ / giờ"}
                </b>
              )}
              <p>
                {t.name} · {new Date(t.created).toLocaleDateString("vi-VN")}
              </p>
              {!t.is_demo&&<TopicMembers key={t.id+":"+t.memberCount} id={t.id} user={user} onLogin={onLogin} />}
              {t.schedule && (
                <p>Lịch: {new Date(t.schedule).toLocaleString("vi-VN")}</p>
              )}
              <p>
                {t.memberCount || 0}/{t.capacity || 10} người tham gia
              </p>
              {t.user_id === user?.id && (
                <button
                  onClick={() => {
                    void api(
                      "/topics/" +
                        t.id +
                        "/" +
                        (t.enrollment === "closed" ? "reopen" : "close"),
                      "POST",
                      {},
                    )
                      .then(refresh)
                      .catch((e) => setError(e.message));
                  }}
                >
                  {t.enrollment === "closed"
                    ? "Mở nhận thành viên"
                    : "Đóng nhận thành viên"}
                </button>
              )}
              {t.enrollment === "closed" && (
                <span className="swap-badge">Đã đóng đăng ký</span>
              )}
              <div className="swap-actions"><button onClick={()=>void share(t.id)}>Sao chép liên kết</button><button aria-pressed={!!t.saved} disabled={busy} onClick={async()=>{if(!user){onLogin();return}setBusy(true);try{await api('/topics/'+t.id+'/save',t.saved?'DELETE':'POST',{});await refresh()}catch(e){setError((e as Error).message)}finally{setBusy(false)}}}>{t.saved?'♥ Đã lưu nhóm':'♡ Lưu nhóm'}</button>
                {t.schedule&&<button onClick={()=>{try{const content=calendarEvent({id:t.id,title:t.title,text:t.text,schedule:t.schedule,url:location.origin+'/cong-dong?topic='+t.id}),url=URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='uniswap-lich-'+t.id+'.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}catch(e){setError((e as Error).message)}}}>Lưu lịch (.ics)</button>}
                <button
                  onClick={() => {
                    if (!user) {
                      onLogin();
                      return;
                    }
                    setBusy(true);
                    void api(
                      "/topics/" + t.id + "/" + (t.joined ? "leave" : "join"),
                      "POST",
                      {},
                    )
                      .then(refresh)
                      .catch((e) => setError(e.message))
                      .finally(() => setBusy(false));
                  }}
                  disabled={busy || !!t.is_demo || t.user_id === user?.id || (!t.joined&&(t.enrollment==='closed'||t.memberCount>=t.capacity||!!t.schedule&&Date.parse(t.schedule)<=now))}
                >
                  {t.is_demo?'Nhóm minh họa':t.user_id === user?.id
                    ? "Bạn tổ chức"
                    : t.joined
                      ? "Rời nhóm"
                      : t.schedule&&Date.parse(t.schedule)<=now?'Đã diễn ra':t.enrollment==='closed'?'Đã đóng đăng ký':t.memberCount>=t.capacity?'Đã đủ người':'Đăng ký tham gia'}
                </button>
                <button onClick={() => void show(t.id)}>Thảo luận</button>
                {t.user_id === user?.id && (
                  <button
                    onClick={() => {
                      if (confirm("Xóa chủ đề này và các phản hồi?"))
                        void api("/topics/" + t.id, "DELETE")
                          .then(refresh)
                          .catch((e) => setError(e.message));
                    }}
                  >
                    Xóa chủ đề
                  </button>
                )}
              </div>
              {active === t.id && (
                <>
                  <div className="swap-replies">
                    {replies.map((r) => (
                      <div key={r.id}>
                        <b>{r.name}</b>
                        <p>{r.text}</p>
                      </div>
                    ))}
                    {!replies.length && <p>Chưa có phản hồi.</p>}
                  </div>
                  {!t.is_demo&&<form
                    className="swap-chat-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setBusy(true);
                      void api("/topics/" + t.id + "/replies", "POST", {
                        text: reply,
                      })
                        .then((d) => {
                          setReplies(d.replies);
                          setReply("");
                        })
                        .catch((e) => setError(e.message))
                        .finally(() => setBusy(false));
                    }}
                  >
                    <input
                      aria-label="Nội dung phản hồi"
                      required
                      maxLength={1500}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Chia sẻ của bạn…"
                    />
                    <button className="swap-primary" disabled={busy}>
                      Gửi
                    </button>
                  </form>}{!!t.is_demo&&<p className="demo-content-note">Thảo luận minh họa. Tạo nhóm của bạn để trò chuyện và nhận thành viên thật.</p>}
                </>
              )}
            </article>
          ))}
        </div>
      )}
      {visible.length>limit&&<button className="hub-load-more" onClick={()=>setPagination({key:paginationKey,limit:limit+12})}>Xem thêm nhóm ({visible.length-limit})</button>}
      <p className="hub-result-count">{visible.length} chủ đề phù hợp</p>
      {shareNotice&&<p role="status" className="swap-note">{shareNotice}</p>}
      {error && (
        <p className="swap-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

function TopicMembers({
  id,
  user,
  onLogin,
}: {
  id: string;
  user: User | null;
  onLogin: () => void;
}) {
  const [members, setMembers] = useState<any[] | null>(null),
    [error, setError] = useState("");
  return (
    <div className="swap-topic-members">
      <button
        onClick={() => {
          if (!user) {
            onLogin();
            return;
          }
          if (members) {
            setMembers(null);
            return;
          }
          void api("/topics/" + id + "/members")
            .then((d) => setMembers(d.members))
            .catch((e) => setError(e.message));
        }}
      >
        {members ? "Ẩn danh sách" : "Xem người tham gia"}
      </button>
      {members && (
        <ul>
          {members.length ? (
            members.map((m) => <li key={m.user_id}>{m.name}</li>)
          ) : (
            <li>Chưa có thành viên đăng ký.</li>
          )}
        </ul>
      )}
      {error && <p className="swap-error">{error}</p>}
    </div>
  );
}
