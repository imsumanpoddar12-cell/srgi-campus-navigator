import { useState } from "react";
import {
  Award,
  Phone,
  Building2,
  Calendar,
  CheckCircle2,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Info,
} from "lucide-react";
import { leadershipMembers } from "../data/campusData";
import { LeadershipMember } from "../types";

interface LeadershipSectionProps {
  onNavigateToFaculties?: () => void;
  standalone?: boolean;
  onBack?: () => void;
}

export default function LeadershipSection({
  onNavigateToFaculties,
  standalone = false,
  onBack,
}: LeadershipSectionProps) {
  const [selectedLeader, setSelectedLeader] = useState<LeadershipMember | null>(null);

  const chairman = leadershipMembers.find((m) => m.role === "Chairman") || leadershipMembers[0];
  const viceChairman = leadershipMembers.find((m) => m.role === "Vice Chairman") || leadershipMembers[1];
  const academicLeaders = leadershipMembers.filter(
    (m) => m.role === "HOD" || m.role === "Deputy HOD" || m.role === "Coordinator"
  );

  return (
    <section
      id="leadership-section"
      className={`w-full max-w-5xl mx-auto px-4 ${standalone ? "py-8" : "my-12"}`}
    >
      {/* Back button if standalone */}
      {standalone && onBack && (
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors cursor-pointer shadow-xs"
          >
            ← Back to Home
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-2.5">
          <Award className="w-3.5 h-3.5 text-amber-600" />
          <span>Institutional & Departmental Leadership</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#102e59] tracking-tight">
          Chairman, Vice-Chairman & Academic Leaders
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl mx-auto leading-relaxed">
          The visionary founders and dedicated academic administrators steering SR Group of Institutions (SRGI), Lucknow.
        </p>
      </div>

      {/* Primary Leadership Cards: Chairman & Vice Chairman */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Chairman Feature Card */}
        <div
          id="card-chairman"
          className="bg-white rounded-2xl p-6 border-2 border-amber-300 shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between overflow-hidden group"
        >
          {/* Subtle decorative background banner */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-100/50 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300">
                <Award className="w-3.5 h-3.5 text-amber-700" />
                Chairman • SR Group
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Est. 2009
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-amber-900/15 shrink-0 border border-amber-200">
                PSC
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {chairman.name}
                </h3>
                <div className="text-xs font-bold text-amber-800 mt-0.5">
                  Hon'ble Chairman, SR Group of Institutions
                </div>
                <div className="text-[11px] font-medium text-slate-600 mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                    MLC, Uttar Pradesh (Sitapur)
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200 font-semibold">
                    Bhartiya Janata Party
                  </span>
                </div>
              </div>
            </div>

            {/* Official Bio Excerpt */}
            <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200/80 text-xs text-slate-700 leading-relaxed mb-4">
              <p className="font-medium">
                <b>Pawan Singh Chauhan</b> (born 3 February 1965) is an Indian politician from <b>Bhartiya Janata Party</b>. He has been a distinguished member of the <b>Uttar Pradesh Legislative Council (MLC)</b> from Sitapur since 2022. And he is the <b>Chairman of SR Group</b>.
              </p>
              <p className="mt-2 text-slate-600 text-[11px]">
                Under his leadership, SRGI was founded in 2009 with a single program and has expanded into a premier 65-acre multi-disciplinary campus in Lucknow providing world-class technical education.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">Office: Block A (1st Floor)</span>
            <button
              onClick={() => setSelectedLeader(chairman)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Full Biography</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vice-Chairman Feature Card */}
        <div
          id="card-vice-chairman"
          className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-100/50 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-[11px] border border-blue-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                Vice-Chairman • SR Group
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Institutional Executive
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-blue-900/15 shrink-0 border border-blue-200">
                PSC
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {viceChairman.name}
                </h3>
                <div className="text-xs font-bold text-blue-800 mt-0.5">
                  Vice-Chairman, SR Group of Institutions
                </div>
                <div className="text-[11px] font-medium text-slate-600 mt-1">
                  Spearheading Technical Innovation & Research
                </div>
              </div>
            </div>

            {/* Vice-Chairman Bio */}
            <div className="bg-blue-50/70 rounded-xl p-3.5 border border-blue-200/80 text-xs text-slate-700 leading-relaxed mb-4">
              <p className="font-medium">
                <b>Piyush Singh Chauhan</b> serves as the Vice-Chairman of SR Group of Institutions.
              </p>
              <p className="mt-2 text-slate-600 text-[11px]">
                Directing strategic industry collaborations, advanced computing and engineering laboratories, startup incubation cells, and national placement initiatives for undergraduate and postgraduate scholars.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px]">SRGI Executive Administration</span>
            <button
              onClick={() => setSelectedLeader(viceChairman)}
              className="px-3 py-1.5 bg-[#123f73] hover:bg-[#0e315b] text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Academic Leadership Row: HOD, Deputy HOD, Quardinator (Coordinator) */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#123f73]" />
            <h3 className="text-lg font-bold text-slate-800">
              Department Leadership & Coordination
            </h3>
          </div>
          {onNavigateToFaculties && (
            <button
              onClick={onNavigateToFaculties}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All Faculties</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {academicLeaders.map((leader) => {
            const isHOD = leader.role === "HOD";
            const isDeputy = leader.role === "Deputy HOD";
            const isCoordinator = leader.role === "Coordinator";

            return (
              <div
                key={leader.id}
                id={`academic-leader-${leader.id}`}
                className={`bg-white rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  isHOD
                    ? "border-blue-400 ring-2 ring-blue-50"
                    : isDeputy
                    ? "border-sky-300 ring-2 ring-sky-50"
                    : "border-emerald-300 ring-2 ring-emerald-50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isHOD
                          ? "bg-blue-100 text-blue-900 border border-blue-300"
                          : isDeputy
                          ? "bg-sky-100 text-sky-900 border border-sky-300"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      }`}
                    >
                      {leader.badge}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Block C</span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 tracking-tight">
                    {leader.name}
                  </h4>
                  <div className="text-xs font-bold text-slate-700 mt-0.5">
                    {leader.title}
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {leader.phone ? (
                    <a
                      href={`tel:${leader.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors border border-emerald-200/80 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{leader.phone}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Block C Office</span>
                  )}
                  <button
                    onClick={() => setSelectedLeader(leader)}
                    className="text-xs font-semibold text-slate-500 hover:text-[#123f73] underline cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leadership Bio Modal */}
      {selectedLeader && (
        <div
          id="leader-bio-modal"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedLeader(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
                  {selectedLeader.badge || selectedLeader.role}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {selectedLeader.name}
                </h3>
                <div className="text-xs font-bold text-[#123f73] mt-0.5">
                  {selectedLeader.title}
                </div>
              </div>
              <button
                onClick={() => setSelectedLeader(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedLeader.politicalAffiliation && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 mb-4 text-xs">
                <div className="font-bold text-amber-900">Political & Public Service:</div>
                <div className="text-slate-700 mt-0.5">{selectedLeader.politicalAffiliation}</div>
                {selectedLeader.tenure && (
                  <div className="text-[11px] text-amber-800 font-semibold mt-1">
                    {selectedLeader.tenure}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed mb-6">
              <p>{selectedLeader.bio}</p>
              {selectedLeader.role === "Chairman" && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-[11px] text-slate-600">
                  <div>• <b>Born:</b> 3 February 1965</div>
                  <div>• <b>Political Party:</b> Bharatiya Janata Party (BJP)</div>
                  <div>• <b>Legislative Office:</b> Member of Uttar Pradesh Legislative Council (MLC), Sitapur (2022 - present)</div>
                  <div>• <b>Organization:</b> Chairman, SR Group of Institutions (SRGI)</div>
                  <div>• <b>Campus:</b> 65-Acre Sprawling Campus at NH-24, Bakshi Ka Talab, Lucknow</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              {selectedLeader.phone ? (
                <a
                  href={`tel:${selectedLeader.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {selectedLeader.phone}</span>
                </a>
              ) : (
                <span className="text-xs text-slate-400">SRGI Administrative Block A</span>
              )}
              <button
                onClick={() => setSelectedLeader(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
