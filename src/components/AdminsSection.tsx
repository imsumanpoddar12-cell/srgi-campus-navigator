import { useState } from "react";
import { Mail, Phone, Shield, Award, Eye, EyeOff, Edit3, Check, ArrowLeft, Image as ImageIcon } from "lucide-react";
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
  suman01: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  vivek01: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  pranjal01: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  roshan01: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  rijawan01: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  avinash01: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
  vivek02: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
};

export default function AdminsSection({
  admins,
  onBack,
  showPhotos,
  onTogglePhotos,
  onUpdateAdmin,
  isLoggedIn = false,
}: AdminsSectionProps) {
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const startEdit = (admin: AdminUser) => {
    setEditingAdminId(admin.id);
    setEditEmail(admin.email);
    setEditPhotoUrl(admin.avatarUrl || "");
  };

  const saveEdit = (id: string) => {
    if (onUpdateAdmin) {
      onUpdateAdmin(id, {
        email: editEmail,
        avatarUrl: editPhotoUrl,
      });
    }
    setEditingAdminId(null);
  };

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
          const isEditing = editingAdminId === admin.id;
          const photoUrl = admin.avatarUrl || adminDefaultAvatars[admin.id];

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
                        alt={admin.name}
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
                  {admin.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Department of Computer Science (CSE A)
                </p>
              </div>

              {/* Email & Contact Area */}
              <div className="mt-4 pt-4 border-t border-slate-100 text-left text-xs space-y-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-600">Edit Email:</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                    />
                    <label className="text-[11px] font-bold text-slate-600">Edit Photo URL:</label>
                    <input
                      type="url"
                      value={editPhotoUrl}
                      onChange={(e) => setEditPhotoUrl(e.target.value)}
                      placeholder="Paste photo URL"
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg"
                    />
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => saveEdit(admin.id)}
                        className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingAdminId(null)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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

                    {admin.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Phone:</span>
                        <a
                          href={`tel:${admin.phone}`}
                          className="font-mono text-slate-700 hover:text-blue-600"
                        >
                          {admin.phone}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Admin self-edit action */}
              {isLoggedIn && !isEditing && (
                <div className="mt-3 pt-2">
                  <button
                    onClick={() => startEdit(admin)}
                    className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit Email / Photo
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
