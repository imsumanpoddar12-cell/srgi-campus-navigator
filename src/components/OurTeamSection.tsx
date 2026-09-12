import { useState, type ChangeEvent } from "react";
import { Mail, Phone, Shield, Award, Edit3, Image as ImageIcon, Check } from "lucide-react";
import { TeamMember } from "../types";

interface OurTeamSectionProps {
  team: TeamMember[];
  onUpdateTeamMember?: (id: string, updated: Partial<TeamMember>) => void;
  isLoggedIn?: boolean;
}

// Fallback photo portraits with professional styling
const defaultAvatars: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  3: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  4: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  5: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  6: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
  7: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
};

export default function OurTeamSection({
  team,
  onUpdateTeamMember,
  isLoggedIn = false,
}: OurTeamSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const handleStartEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setEditPhotoUrl(m.photoUrl || "");
    setEditEmail(m.email || "");
  };

  const handleSaveEdit = (id: string) => {
    if (onUpdateTeamMember) {
      onUpdateTeamMember(id, {
        photoUrl: editPhotoUrl,
        email: editEmail,
      });
    }
    setEditingId(null);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (file && onUpdateTeamMember) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdateTeamMember(id, { photoUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="our-team-section" className="w-full max-w-6xl mx-auto my-12 px-4">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100/80 text-[#123f73] text-xs font-bold tracking-wider uppercase mb-2">
          <Award className="w-3.5 h-3.5" />
          Campus Navigator Development
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#102e59] tracking-tight">
          OUR TEAM
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mt-1">
          The student creators and core developers of SR Group of Institutes Campus Navigator.
        </p>
      </div>

      {/* Responsive Grid Layout below Team Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {team.map((member) => {
          const isLeader = member.role === "Leader";
          const isCoLeader = member.role === "Co-Leader";
          const isEditing = editingId === member.id;

          const photoSource =
            member.photoUrl ||
            defaultAvatars[member.order] ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

          return (
            <div
              key={member.id}
              id={`team-card-${member.id}`}
              className={`bg-white rounded-2xl p-5 text-center transition-all duration-300 relative flex flex-col justify-between ${
                isLeader
                  ? "border-2 border-amber-500 shadow-lg shadow-amber-500/10 ring-4 ring-amber-100"
                  : isCoLeader
                  ? "border-2 border-blue-500 shadow-lg shadow-blue-500/10 ring-4 ring-blue-100"
                  : "border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {/* Leader Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                {isLeader ? (
                  <span className="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-xs flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Leader
                  </span>
                ) : isCoLeader ? (
                  <span className="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xs flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Co-Leader
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 rounded-full">
                    Core Member
                  </span>
                )}
              </div>

              {/* Photo Area */}
              <div className="pt-4 pb-2">
                <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-inner group">
                  <img
                    src={photoSource}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback if image URL errors
                      (e.target as HTMLImageElement).src = defaultAvatars[member.order] || "";
                    }}
                  />
                  {/* Photo Edit button for admin or user */}
                  {isLoggedIn && (
                    <label
                      htmlFor={`file-input-${member.id}`}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-xs font-semibold"
                      title="Upload new photo"
                    >
                      <ImageIcon className="w-4 h-4 mb-1" />
                      <span>Change Photo</span>
                      <input
                        id={`file-input-${member.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, member.id)}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Info Details */}
              <div className="my-2">
                <div className="text-xs font-bold text-blue-600 tracking-wider">
                  #{member.order}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {member.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {member.department}
                </p>
              </div>

              {/* Contact / Email Info */}
              <div className="mt-3 pt-3 border-t border-slate-100 text-left space-y-1.5 text-xs">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-blue-500"
                    />
                    <input
                      type="url"
                      value={editPhotoUrl}
                      onChange={(e) => setEditPhotoUrl(e.target.value)}
                      placeholder="Photo URL"
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(member.id)}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs rounded-md font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-400 font-medium text-[11px]">Email:</span>
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          className="font-medium text-blue-600 hover:underline truncate max-w-[170px] text-[11px]"
                          title={member.email}
                        >
                          {member.email}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Available on request</span>
                      )}
                    </div>
                    {member.phone && (
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-400 font-medium text-[11px]">Phone:</span>
                        <a
                          href={`tel:${member.phone}`}
                          className="font-mono text-[11px] text-slate-700 hover:text-blue-600"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Admin Quick Action */}
              {isLoggedIn && !isEditing && (
                <div className="mt-3 pt-2">
                  <button
                    onClick={() => handleStartEdit(member)}
                    className="w-full py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3 h-3 text-blue-600" />
                    Edit Info / Photo
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
