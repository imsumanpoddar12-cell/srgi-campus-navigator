import { useState, type FormEvent } from "react";
import { X, Lock, ShieldCheck, User } from "lucide-react";
import { AdminUser } from "../types";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  admins: AdminUser[];
  onLoginSuccess: (admin: AdminUser) => void;
}

export default function AdminLoginModal({
  isOpen,
  onClose,
  admins,
  onLoginSuccess,
}: AdminLoginModalProps) {
  const [adminIdOrEmail, setAdminIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const input = adminIdOrEmail.trim().toLowerCase();
    const foundAdmin = admins.find(
      (a) =>
        a.id.toLowerCase() === input ||
        a.email.toLowerCase() === input ||
        a.name.toLowerCase().includes(input)
    );

    if (!foundAdmin) {
      setErrorMsg("Admin ID or Email not recognized. Please check your credentials.");
      return;
    }

    if (foundAdmin.password !== password.trim()) {
      setErrorMsg("Incorrect password. Please verify your phone/password credentials.");
      return;
    }

    onLoginSuccess(foundAdmin);
    onClose();
  };

  return (
    <div
      id="admin-login-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        id="admin-login-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200"
      >
        <button
          id="close-admin-login-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-[#102e59]">
            Admin Authentication
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Access administrative management to edit team info, campus photos, and directions.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Admin ID or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-id-input"
                type="text"
                required
                value={adminIdOrEmail}
                onChange={(e) => setAdminIdOrEmail(e.target.value)}
                placeholder="e.g. suman01 or imsumanpoddar12@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-blue-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: your contact number)"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-blue-600 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            id="admin-submit-login-btn"
            className="w-full py-3 bg-[#123f73] hover:bg-[#0e315b] text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Authenticate & Login
          </button>
        </form>

        <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-100 text-center">
          Available to registered admins (Suman Kumar, Vivek Sahani, Pranjal Maurya, Roshan Kumar Bharti, Rijawan Khan, Avinash Prajapati, Vivek Saroj).
        </div>
      </div>
    </div>
  );
}
