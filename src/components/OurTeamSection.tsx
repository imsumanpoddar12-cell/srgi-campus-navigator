import { Shield, Award } from "lucide-react";
import { TeamMember } from "../types";

interface OurTeamSectionProps {
  team: TeamMember[];
}

// Fallback photo portraits with professional styling
const defaultAvatars: Record<number, string> = {
  1: "https://i.postimg.cc/HW8tZbHx/Whats-App-Image-2026-09-12-at-10-06-35-PM.jpg",
  2: "https://i.postimg.cc/XYWS7Vxc/Whats-App-Image-2026-09-12-at-6-51-25-PM.jpg",
  3: "https://i.postimg.cc/RZgs59YN/Whats-App-Image-2026-09-12-at-6-54-20-PM.jpg",
  4: "https://i.postimg.cc/pd0gZKvB/Whats-App-Image-2026-09-12-at-6-58-55-PM.jpg",
  5: "https://i.postimg.cc/mDvpXw5y/Whats-App-Image-2026-09-12-at-7-02-15-PM.jpg",
  6: "https://i.postimg.cc/3NGVY6G3/Whats-App-Image-2026-09-12-at-6-53-26-PM.jpg",
  7: "https://i.postimg.cc/QddmqwMj/file-000000004a18820893d71e8d32dd2ff5.png",
};

export default function OurTeamSection({
  team,
}: OurTeamSectionProps) {
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
          const displayName = member.name.startsWith("Er.") ? member.name : `Er. ${member.name}`;

          const photoSource =
            member.photoUrl ||
            defaultAvatars[member.order] ||
            "https://api.dicebear.com/7.x/bottts/svg?seed=" + member.name;

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
                    alt={displayName}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultAvatars[member.order] || "";
                    }}
                  />
                </div>
              </div>

              {/* Info Details */}
              <div className="my-2">
                <div className="text-xs font-bold text-blue-600 tracking-wider">
                  #{member.order}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {displayName}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {member.department}
                </p>
              </div>

              {/* Contact / Email Info (Read-only) */}
              <div className="mt-3 pt-3 border-t border-slate-100 text-left space-y-1.5 text-xs">
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
                {member.city && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-400 font-medium text-[11px]">Location:</span>
                    <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[160px]" title={member.city}>
                      📍 {member.city}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
