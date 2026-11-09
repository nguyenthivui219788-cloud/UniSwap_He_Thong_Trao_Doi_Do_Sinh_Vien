export const PRIMARY_CAMPUS={id:'dhv',code:'DHV',name:'Đại học Hùng Vương TP.HCM',domain:'dhv.edu.vn',cluster:'q5',spots:['Điểm hẹn công cộng gần cơ sở DHV']} as const;
export function isDhvEmail(email:string){const domain=String(email).trim().toLowerCase().split('@')[1]||'';return domain==='dhv.edu.vn'||domain.endsWith('.dhv.edu.vn');}
