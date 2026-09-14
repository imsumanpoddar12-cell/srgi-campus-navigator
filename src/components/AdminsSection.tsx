import { useState } from "react";
import { Mail, MapPin, Shield, Award, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { AdminUser } from "../types";

interface AdminsSectionProps {
  admins: AdminUser[];
  onBack: () => void;
  showPhotos: boolean;
  onTogglePhotos: () => void;
  onUpdateAdmin?: (id: string, updated: Partial<AdminUser>) => void;
  isLoggedIn?: boolean;
  currentAdminId?: string;
}

const adminDefaultAvatars: Record<string, string> = {
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

export default function AdminsSection({
  admins,
  onBack,
  showPhotos,
  onTogglePhotos,
}: AdminsSectionProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <section id="admins-directory-section" className="max-w-5xl mx-auto px-4 py-8">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          id="admins-back-home-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* Option to toggle admin photos as requested by user */}
        <button
          id="toggle-admin-photos-btn"
          onClick={onTogglePhotos}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
        >
          {showPhotos ? (
            <>
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Admin Photos: <b className="text-blue-700">Shown</b></span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 text-slate-400" />
              <span>Admin Photos: <b className="text-slate-500">Hidden</b></span>
            </>
          )}
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-[#123f73] tracking-tight">
          ABOUT ADMINS
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          SRGI Campus Navigator Administrators & Technical Coordinators
        </p>
      </div>

      {/* Grid of Admins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {admins.map((admin) => {
          const isLeader = admin.role === "Leader";
          const isCoLeader = admin.role === "Co-Leader";
          const photoUrl = admin.avatarUrl || adminDefaultAvatars[admin.id];
          const displayName = admin.name.replace(/^Er\.\s*/i, "");

          return (
            <div
              key={admin.id}
              id={`admin-card-${admin.id}`}
              className={`bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all relative border flex flex-col justify-between ${
                isLeader
                  ? "border-amber-400 ring-4 ring-amber-50"
                  : isCoLeader
                  ? "border-blue-400 ring-4 ring-blue-50"
                  : "border-slate-200"
              }`}
            >
              <div>
                {/* Role badge */}
                <div className="mb-3 flex justify-center">
                  {isLeader ? (
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Shield className="w-3 h-3" />
                      Leader
                    </span>
                  ) : isCoLeader ? (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Award className="w-3 h-3" />
                      Co-Leader
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full">
                      Admin • CSE A
                    </span>
                  )}
                </div>

                {/* Optional Photo display */}
                {showPhotos && (
                  <div className="my-3 flex justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md">
                      <img
                        src={photoUrl}
                        alt={displayName}
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            adminDefaultAvatars[admin.id] || "";
                        }}
                      />
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-extrabold text-[#123f73] mt-1">
                  {displayName}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Department of Computer Science (CSE A)
                </p>
              </div>

              {/* Email & Contact Area (Read-only) */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Email:</span>
                  {admin.email ? (
                    <div className="flex items-center gap-1">
                      <a
                        href={`mailto:${admin.email}`}
                        className="font-medium text-blue-600 hover:underline truncate max-w-[150px]"
                        title={admin.email}
                      >
                        {admin.email}
                      </a>
                      <button
                        onClick={() => copyToClipboard(admin.email)}
                        className="text-[10px] px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
                        title="Copy email"
                      >
                        {copiedEmail === admin.email ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Not set</span>
                  )}
                </div>

                {admin.city && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>City:</span>
                    </span>
                    <span className="font-semibold text-slate-700">
                      {admin.city}
                    </span>
                  </div>
                )}

                {/* Verified read-only status badge */}
                <div className="pt-2 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <Shield className="w-3 h-3 text-emerald-600" />
                    Verified Admin • Protected
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
