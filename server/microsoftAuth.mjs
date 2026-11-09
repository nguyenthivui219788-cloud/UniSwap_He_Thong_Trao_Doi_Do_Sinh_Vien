/**
 * MICROSOFT SSO / OAUTH 2.0 HANDLER CHO UNISWAP
 * Cho phép sinh viên đăng nhập bằng tài khoản Microsoft Office 365 trường ĐH (@dhv.edu.vn)
 */

export const MS_CONFIG = {
  // Lấy từ file .env hoặc điền trực tiếp khi đăng ký trên Azure Portal
  clientId: process.env.MS_CLIENT_ID || 'YOUR_AZURE_CLIENT_ID',
  clientSecret: process.env.MS_CLIENT_SECRET || 'YOUR_AZURE_CLIENT_SECRET',
  redirectUri: process.env.MS_REDIRECT_URI || 'http://localhost:8080/auth/microsoft/callback',
  // 'common' cho phép tất cả các trường dùng Office 365, hoặc điền Tenant ID nếu chỉ dành cho trường DHV
  authority: 'https://login.microsoftonline.com/common',
};

/**
 * 1. Tạo URL chuyển hướng sinh viên sang trang đăng nhập của Microsoft
 */
export function getMicrosoftAuthUrl(state = 'uniswap_login') {
  const params = new URLSearchParams({
    client_id: MS_CONFIG.clientId,
    response_type: 'code',
    redirect_uri: MS_CONFIG.redirectUri,
    response_mode: 'query',
    scope: 'openid profile email User.Read',
    state: state,
    prompt: 'select_account', // Cho phép sinh viên chọn tài khoản trường nếu đang đăng nhập nhiều email
  });

  return `${MS_CONFIG.authority}/oauth2/v2.0/authorize?${params.toString()}`;
}

/**
 * 2. Đổi mã 'code' lấy Access Token và truy vấn thông tin sinh viên từ Microsoft Graph API
 */
export async function handleMicrosoftCallback(code) {
  // B1: Gửi yêu cầu đổi 'code' lấy 'access_token'
  const tokenUrl = `${MS_CONFIG.authority}/oauth2/v2.0/token`;
  const bodyParams = new URLSearchParams({
    client_id: MS_CONFIG.clientId,
    client_secret: MS_CONFIG.clientSecret,
    code: code,
    redirect_uri: MS_CONFIG.redirectUri,
    grant_type: 'authorization_code',
  });

  const tokenRes = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: bodyParams.toString(),
  });

  const tokenData = await tokenRes.json();
  if (tokenData.error) {
    throw new Error(`Lỗi Microsoft Token: ${tokenData.error_description || tokenData.error}`);
  }

  const accessToken = tokenData.access_token;

  // B2: Gọi Microsoft Graph API để lấy thông tin hồ sơ sinh viên
  const graphRes = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const profile = await graphRes.json();
  if (profile.error) {
    throw new Error(`Lỗi Microsoft Profile: ${profile.error.message}`);
  }

  // B3: Trích xuất thông tin sinh viên
  // Ví dụ email: 2305CT0661@dhv.edu.vn -> MSSV: 2305CT0661
  const studentEmail = profile.mail || profile.userPrincipalName || '';
  const studentName = profile.displayName || 'Sinh viên UniSwap';
  const studentId = studentEmail.split('@')[0].toUpperCase();

  return {
    microsoftId: profile.id,
    email: studentEmail.toLowerCase(),
    name: studentName,
    studentId: studentId,
    universityCode: studentEmail.includes('dhv.edu.vn') ? 'DHV' : 'OTHER',
    accessToken: accessToken,
  };
}
