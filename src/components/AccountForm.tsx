import { useState, type FormEvent } from "react";
import { Mail, Lock, Eye, EyeOff, User as UserIcon, School, ArrowRight } from "lucide-react";
import type { User } from "../types";
import { api } from "../lib/api";
import { UNIVERSITIES } from "../data/mockData";

export interface AccountFormProps {
  onSuccess?: (user: User, delivery?: any) => void;
  onForgot?: () => void;
  onToggleMode?: () => void;
  register?: boolean;
}

export function AccountForm({
  onSuccess,
  onForgot,
  onToggleMode,
  register = false,
}: AccountFormProps) {
  const [signup, setSignup] = useState(register);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [otherSchool, setOtherSchool] = useState("");
  const [consent, setConsent] = useState(false);
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const toggleAuthMode = () => {
    setError("");
    if (onToggleMode) {
      onToggleMode();
    } else {
      setSignup(!signup);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (signup) {
        if (!name.trim()) throw new Error("Vui lòng nhập họ tên sinh viên");
        if (!email.trim()) throw new Error("Vui lòng nhập email trường .edu.vn");
        if (password.length < 8) throw new Error("Mật khẩu cần tối thiểu 8 ký tự");
        if (!consent) throw new Error("Vui lòng xác nhận đồng ý điều khoản dịch vụ");

        const selectedSchool = school === "other" ? otherSchool.trim() : school;
        const res = await api("/register", "POST", {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          school: selectedSchool || "Đại học tại TP.HCM",
        });

        if (onSuccess) onSuccess(res.user, res.delivery);
      } else {
        if (!email.trim()) throw new Error("Vui lòng nhập email đăng nhập");
        if (!password) throw new Error("Vui lòng nhập mật khẩu");

        const loginEmail = email.trim().toLowerCase() === "admin" ? "admin@uniswap.edu.vn" : email.trim().toLowerCase();
        const res = await api("/login", "POST", {
          email: loginEmail,
          password,
          remember,
        });

        if (onSuccess) onSuccess(res.user, res.delivery);
      }
    } catch (err: any) {
      setError(err?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form 
      onSubmit={submit}
      className="w-full bg-transparent p-0 select-none"
      style={{ fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif" }}
    >
      {/* Tiêu đề & phụ đề đúng chuẩn Ảnh mẫu */}
      <h1 className="text-[28px] font-black tracking-tight leading-tight mb-1 flex items-center gap-2 whitespace-nowrap">
        <span className="text-[#06462e]">Đăng nhập</span>
        <span className="text-[#ffb525]">UniSwap</span>
      </h1>
      <p className="text-[13px] text-gray-500 mb-6 font-normal">
        {signup 
          ? "Bắt đầu kết nối cùng cộng đồng sinh viên." 
          : "Tiếp tục hành trình trao đổi của bạn."
        }
      </p>

      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
          <p className="font-semibold">{error}</p>
          {!signup && (
            <p className="mt-1 text-[11px] text-red-600">
              Nếu chưa tạo tài khoản, bấm "Đăng ký" bên dưới để đăng ký bằng email trường.
            </p>
          )}
        </div>
      )}

      {/* Các trường đăng ký bổ sung khi signup = true */}
      {signup && (
        <>
          <div className="space-y-1 mb-3.5">
            <label className="block text-xs font-bold text-[#06462e]">
              Họ tên sinh viên
            </label>
            <div className="relative flex items-center">
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                style={{ paddingLeft: "42px" }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#06462e] focus:ring-1 focus:ring-[#06462e] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1 mb-3.5">
            <label className="block text-xs font-bold text-[#06462e]">
              Trường Đại học
            </label>
            <div className="relative flex items-center">
              <School className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <select
                required
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                style={{ paddingLeft: "42px" }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#06462e] transition-all"
              >
                <option value="">-- Chọn trường của bạn --</option>
                {UNIVERSITIES.map((u) => (
                  <option key={u.code} value={u.code}>
                    {u.name} ({u.code})
                  </option>
                ))}
                <option value="other">Trường khác tại TP.HCM</option>
              </select>
            </div>
          </div>

          {school === "other" && (
            <div className="space-y-1 mb-3.5">
              <label className="block text-xs font-bold text-[#06462e]">
                Tên trường của bạn
              </label>
              <input
                type="text"
                required
                value={otherSchool}
                onChange={(e) => setOtherSchool(e.target.value)}
                placeholder="Nhập tên trường ĐH/CĐ"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#06462e] transition-all"
              />
            </div>
          )}
        </>
      )}

      {/* Trường 1: Email sinh viên / Tên đăng nhập */}
      <div className="space-y-1 mb-3.5">
        <label className="block text-[12px] font-bold text-[#06462e]">
          {signup ? "Email sinh viên" : "Tài khoản / Email đăng nhập"}
        </label>
        <div className="relative flex items-center">
          <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            type={signup ? "email" : "text"}
            autoComplete="username"
            required
            maxLength={200}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (signup) {
                const domain = e.target.value.trim().toLowerCase().split("@")[1] || "";
                const match = UNIVERSITIES.find(
                  (u) => domain === u.domain || domain.endsWith("." + u.domain)
                );
                if (match) setSchool(match.code);
              }
            }}
            placeholder={signup ? "ban@truong.edu.vn" : "admin hoặc ban@truong.edu.vn"}
            style={{ paddingLeft: "42px" }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/90 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#06462e] focus:ring-1 focus:ring-[#06462e] transition-all"
          />
        </div>
      </div>

      {/* Trường 2: Mật khẩu UniSwap */}
      <div className="space-y-1 mb-3.5">
        <label className="block text-[12px] font-bold text-[#06462e]">
          Mật khẩu UniSwap
        </label>
        <div className="relative flex items-center">
          <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            type={show ? "text" : "password"}
            autoComplete={signup ? "new-password" : "current-password"}
            required
            minLength={signup ? 8 : 1}
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={signup ? "Tạo mật khẩu từ 8 ký tự" : "Mật khẩu bạn đã tạo trên UniSwap"}
            style={{ paddingLeft: "42px", paddingRight: "42px" }}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200/90 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#06462e] focus:ring-1 focus:ring-[#06462e] transition-all"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {show ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dòng Ghi nhớ đăng nhập + Quên mật khẩu (chỉ hiện khi đăng nhập) */}
      {!signup ? (
        <div className="w-full flex items-center justify-between mb-5 pt-0.5">
          <div 
            onClick={() => setRemember(!remember)}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div 
              className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors shrink-0 ${
                remember ? "bg-[#06462e] text-white" : "border border-gray-300 bg-white"
              }`}
            >
              {remember && (
                <svg className="w-2.5 h-2.5 stroke-[3] fill-none stroke-current" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-[12px] text-gray-700 font-medium whitespace-nowrap">
              Ghi nhớ đăng nhập
            </span>
          </div>
          <button
            type="button"
            onClick={onForgot}
            className="text-[12px] font-bold text-[#06462e] hover:underline transition-colors cursor-pointer whitespace-nowrap ml-auto"
          >
            Quên mật khẩu?
          </button>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          <label className="flex items-start gap-2 cursor-pointer text-[11px] text-gray-600">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 text-[#06462e] rounded border-gray-300"
            />
            <span>Tôi đồng ý với điều khoản dịch vụ và cam kết thông tin sinh viên chính xác.</span>
          </label>
        </div>
      )}

      {/* Nút Submit màu vàng cam đậm chữ xanh đậm chuẩn Ảnh mẫu */}
      <button
        type="submit"
        disabled={busy}
        className="w-full py-3 px-4 bg-[#ffb525] hover:bg-[#f5a716] active:scale-[0.99] text-[#06462e] font-extrabold text-[13.5px] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mb-3.5"
      >
        <span>{busy ? "Đang xử lý…" : signup ? "Tạo tài khoản" : "Đăng nhập"}</span>
        {!busy && <ArrowRight className="w-4 h-4 stroke-[2.8]" />}
      </button>

      {/* Khối Hoặc + Tiếp tục với Microsoft (chỉ hiện khi đăng nhập) */}
      {!signup && (
        <>
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-gray-200/80 w-full" />
            <span className="bg-[#fbfdfa] px-3 text-[11px] text-gray-400 font-medium absolute">
              hoặc
            </span>
          </div>

          {/* Nút Tiếp tục với Microsoft */}
          <button
            type="button"
            onClick={() => {
              window.location.href = "/api/auth/microsoft";
            }}
            className="w-full py-2.5 px-4 bg-white border border-gray-200/90 rounded-xl text-xs font-medium text-gray-700 hover:text-black flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:bg-gray-50/80 cursor-pointer mb-2 active:scale-98"
            title="Đăng nhập bằng tài khoản Microsoft Office 365 trường"
          >
            {/* 4 ô vuông Microsoft SVG */}
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
            <span className="whitespace-nowrap font-semibold">Tiếp tục với Microsoft (@dhv.edu.vn)</span>
          </button>

          <p className="text-[10px] text-center text-gray-400 mb-3.5 leading-relaxed">
            Hỗ trợ tài khoản Microsoft Office 365 sinh viên DHV và các trường ĐH.
          </p>
        </>
      )}

      {/* Dòng chuyển đổi Đăng nhập <-> Đăng ký */}
      <div className="text-center pt-1">
        <span className="text-xs text-gray-600">
          {signup ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
        </span>
        <button
          type="button"
          onClick={toggleAuthMode}
          className="text-xs font-bold text-[#06462e] hover:underline cursor-pointer ml-1"
        >
          {signup ? "Đăng nhập" : "Đăng ký"}
        </button>
      </div>
    </form>
  );
}

export default AccountForm;
