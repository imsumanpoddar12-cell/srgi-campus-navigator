import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Shield,
  Check,
  User,
  Copy,
  Lock,
} from "lucide-react";
import { AdminUser } from "../types";

interface AdminPhotosSectionProps {
  admins: AdminUser[];
  onBack: () => void;
  onUpdateAdmin?: (id: string, updated: Partial<AdminUser>) => void;
  isLoggedIn?: boolean;
  currentAdminId?: string;
}

const defaultAdminAvatars: Record<string, string> = {
  suman92: "https://i.postimg.cc/HW8tZbHx/Whats-App-Image-2026-09-12-at-10-06-35-PM.jpg",
  suman01: "https://i.postimg.cc/HW8tZbHx/Whats-App-Image-2026-09-12-at-10-06-35-PM.jpg",
  vivek93: "https://i.postimg.cc/XYWS7Vxc/Whats-App-Image-2026-09-12-at-6-51-25-PM.jpg",
  vivek01: "https://i.postimg.cc/XYWS7Vxc/Whats-App-Image-2026-09-12-at-6-51-25-PM.jpg",
  pranjal94: "https://i.postimg.cc/RZgs59YN/Whats-App-Image-2026-09-12-at-6-54-20-PM.jpg",
  pranjal01: "https://i.postimg.cc/RZgs59YN/Whats-App-Image-2026-09-12-at-6-54-20-PM.jpg",
  roshan95: "https://i.postimg.cc/pd0gZKvB/Whats-App-Image-2026-09-12-at-6-58-55-PM.jpg",
  roshan01: "https://i.postimg.cc/pd0gZKvB/Whats-App-Image-2026-09-12-at-6-58-55-PM.jpg",
  rijawan96: "https://i.postimg.cc/mDvpXw5y/Whats-App-Image-2026-09-12-at-7-02-15-PM.jpg",
  rijawan01: "https://i.postimg.cc/mDvpXw5y/Whats-App-Image-2026-09-12-at-7-02-15-PM.jpg",
  avinash97: "https://i.postimg.cc/3NGVY6G3/Whats-App-Image-2026-09-12-at-6-53-26-PM.jpg",
  avinash01: "https://i.postimg.cc/3NGVY6G3/Whats-App-Image-2026-09-12-at-6-53-26-PM.jpg",
  viveksaroj98: "https://i.postimg.cc/QddmqwMj/file-000000004a18820893d71e8d32dd2ff5.png",
  vivek02: "https://i.postimg.cc/QddmqwMj/file-000000004a18820893d71e8d32dd2ff5.png",
};

export default function AdminPhotosSection({
  admins,
  onBack,
}: AdminPhotosSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyEmail = (id: string, email: string) => {
    try {
      navigator.clipboard.writeText(email);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.warn("Clipboard access failed:", e);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <section id="admin-photos-section" className="max-w-6xl mx-auto px-4 py-8">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          id="admin-photos-back-home-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <span className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 rounded-xl border border-slate-200">
          {admins.length} Administrators Listed
        </span>
      </div>

      {/* Page Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-2 border border-blue-200/60">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          Administration & Executive Directory
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#123f73] tracking-tight">
          Admin Photos
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
          Official contact details and verified photos of the campus administration team. Admins can update their own profile and photo anytime.
        </p>
      </div>

      {/* Admins Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {admins.map((admin) => {
          const avatarSrc = (admin.avatarUrl && admin.avatarUrl.trim()) || defaultAdminAvatars[admin.id] || "";
          const hasPhoto = Boolean(avatarSrc);

          return (
            <div
              key={admin.id}
              id={`admin-photo-card-${admin.id}`}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Photo or Placeholder Icon */}
                <div className="relative mb-4 flex justify-center">
                  {hasPhoto ? (
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-md bg-slate-100">
                      <img
                        src={avatarSrc}
                        alt={admin.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          (e.target as HTMLElement).style.display = "none";
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-2xl">${getInitials(
                              admin.name
                            )}</div>`;
                          }
                        }}
                      />
                    </div>
                  ) : (
                    /* Placeholder image/icon for each admin */
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#123f73] via-[#1b5594] to-[#2563eb] text-white flex flex-col items-center justify-center shadow-md border-2 border-blue-200">
                      <User className="w-8 h-8 text-blue-200 mb-1" />
                      <span className="text-sm font-black tracking-wider">
                        {getInitials(admin.name)}
                      </span>
                    </div>
                  )}

                  {/* Role Badge */}
                  <span
                    className={`absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs border ${
                      admin.role === "Leader"
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : admin.role === "Co-Leader"
                        ? "bg-blue-100 text-blue-900 border-blue-300"
                        : "bg-slate-100 text-slate-800 border-slate-300"
                    }`}
                  >
                    {admin.role}
                  </span>
                </div>

                {/* Admin Name & Designation */}
                <div className="text-center mt-3">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {admin.name.replace(/^Er\.\s*/i, "")}
                  </h3>
                  <div className="mt-1 flex items-center justify-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/80">
                      SRGI Administrator
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mt-4 space-y-2 text-xs">
                  {/* Email */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 overflow-hidden mr-2">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <a
                        href={`mailto:${admin.email}`}
                        className="text-slate-700 hover:text-blue-600 truncate font-medium"
                        title={admin.email}
                      >
                        {admin.email}
                      </a>
                    </div>
                    <button
                      id={`copy-admin-email-${admin.id}`}
                      onClick={() => copyEmail(admin.id, admin.email)}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                      title="Copy Email"
                    >
                      {copiedId === admin.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* City / Location */}
                  {admin.city && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="text-slate-700 font-medium">
                          {admin.city}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Read-only Protected Status (No editing allowed) */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verified Admin • Official Record</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
