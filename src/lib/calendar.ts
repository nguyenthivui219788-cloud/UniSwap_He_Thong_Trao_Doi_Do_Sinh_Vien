export function calendarEvent({id,title,text,schedule,url}:{id:string;title:string;text:string;schedule:string;url:string}){
 const date=new Date(schedule);if(!Number.isFinite(date.getTime()))throw new Error('Lịch không hợp lệ.');
 const esc=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
 const stamp=(d:Date)=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//UniSwap//Community//VI','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+esc(id)+'@uniswap.local','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(date),'SUMMARY:'+esc(title),'DESCRIPTION:'+esc(text),'URL:'+url,'END:VEVENT','END:VCALENDAR'];
 const fold=(s:string)=>{let line='',out='';for(const c of s){if(new TextEncoder().encode(line+c).length>73){out+=line+'\r\n ';line='';}line+=c;}return out+line;};
 return lines.map(fold).join('\r\n')+'\r\n';
}
