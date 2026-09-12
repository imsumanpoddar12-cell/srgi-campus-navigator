import { useState, type FormEvent, type ChangeEvent } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  Edit3,
  Check,
  Upload,
  User,
  X,
  Camera,
  Copy,
  ExternalLink,
} from "lucide-react";
import { AdminUser } from "../types";

interface AdminPhotosSectionProps {
  admins: AdminUser[];
  onBack: () => void;
  onUpdateAdmin: (id: string, updated: Partial<AdminUser>) => void;
  isLoggedIn?: boolean;
  currentAdminId?: string;
}

export default function AdminPhotosSection({
  admins,
  onBack,
  onUpdateAdmin,
  isLoggedIn = false,
  currentAdminId,
}: AdminPhotosSectionProps) {
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [avatarInput, setAvatarInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const startEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setNameInput(admin.name);
    setEmailInput(admin.email);
    setPhoneInput(admin.phone || "");
    setPasswordInput(admin.password || "");
    setAvatarInput(admin.avatarUrl || "");
    setSavedSuccess(false);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    onUpdateAdmin(editingAdmin.id, {
      name: nameInput.trim() || editingAdmin.name,
      email: emailInput.trim() || editingAdmin.email,
      phone: phoneInput.trim() || editingAdmin.phone,
      password: passwordInput.trim() || editingAdmin.password,
      avatarUrl: avatarInput.trim() || undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setEditingAdmin(null);
      setSavedSuccess(false);
    }, 600);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
          const hasPhoto = Boolean(admin.avatarUrl && admin.avatarUrl.trim());

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
                        src={admin.avatarUrl}
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

                {/* Admin Name & Username */}
                <div className="text-center mt-3">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {admin.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-center gap-1.5">
                    <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      @{admin.username || admin.id}
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

                  {/* Phone (if available) */}
                  {admin.phone && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <a
                          href={`tel:${admin.phone}`}
                          className="text-slate-700 hover:text-emerald-700 font-medium"
                        >
                          {admin.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Option for Admins */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  id={`edit-admin-btn-${admin.id}`}
                  onClick={() => startEdit(admin)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-[#123f73] text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Info & Photo</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Admin Modal */}
      {editingAdmin && (
        <div
          id="edit-admin-modal-backdrop"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
        >
          <div
            id="edit-admin-modal"
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Admin Information & Photo
                  </h3>
                  <p className="text-[11px] text-slate-500">{editingAdmin.role}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingAdmin(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Photo Preview & Upload */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Admin Photo
                </label>
                <div className="flex items-center gap-4">
                  {avatarInput ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-500 bg-slate-100 shrink-0">
                      <img
                        src={avatarInput}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      value={avatarInput}
                      onChange={(e) => setAvatarInput(e.target.value)}
                      placeholder="Or paste photo URL..."
                      className="w-full p-2 bg-slate-50 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-semibold"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Optional phone number"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Admin Login Password
                </label>
                <input
                  type="text"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter login password (e.g. a@12)"
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800 font-mono"
                />
              </div>

              {savedSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Admin details saved successfully!</span>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#123f73] hover:bg-[#0e315b] text-white font-bold shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
