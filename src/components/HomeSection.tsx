import { ArrowRight, Sparkles, MapPin, Coffee, Home as HomeIcon, Pill, BookOpen, Layers } from "lucide-react";
import { CollegeInfo, TeamMember } from "../types";
import OurTeamSection from "./OurTeamSection";

interface HomeSectionProps {
  collegeInfo: CollegeInfo;
  onExploreCampus: () => void;
  onOpenBlock: (blockName: string) => void;
  onOpenAI: () => void;
  onAcknowledge: () => void;
  onAdminLogin: () => void;
  team: TeamMember[];
  onUpdateTeamMember?: (id: string, updated: Partial<TeamMember>) => void;
  isLoggedIn?: boolean;
}

export default function HomeSection({
  collegeInfo,
  onExploreCampus,
  onOpenBlock,
  onOpenAI,
  onAcknowledge,
  onAdminLogin,
  team,
  onUpdateTeamMember,
  isLoggedIn = false,
}: HomeSectionProps) {
  const blocks = [
    {
      id: "Block A",
      letter: "A",
      title: "Block A",
      label: "Offices, Library & Labs",
      labelBadge: "bg-blue-100 text-blue-800 border border-blue-200",
      subtitle: "OFFICES, LIBRARY, LABS,\nSEMINAR HALL & MORE",
      gradient: "from-blue-600 to-indigo-700",
      accent: "border-blue-200 hover:border-blue-400",
    },
    {
      id: "Block B",
      letter: "B",
      title: "Block B",
      label: "MBA Students Block",
      labelBadge: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      subtitle: "MBA STUDENTS BLOCK\nLECTURE HALLS & SUITES",
      gradient: "from-emerald-600 to-teal-700",
      accent: "border-emerald-200 hover:border-emerald-400",
    },
    {
      id: "Block C",
      letter: "C",
      title: "Block C",
      label: "CSE, IT, EC, AI Complex",
      labelBadge: "bg-sky-100 text-sky-800 border border-sky-200",
      subtitle: "CSE, IT, EC, EN, DS, AIML,\nAI & SRIMT",
      gradient: "from-sky-600 to-blue-700",
      accent: "border-sky-200 hover:border-sky-400",
    },
    {
      id: "Block D",
      letter: "D",
      title: "Block D",
      label: "Girls Hostel",
      labelBadge: "bg-rose-100 text-rose-800 border border-rose-300 shadow-xs",
      subtitle: "GIRLS HOSTEL\n(MEDICINES & STORE ROOM BEHIND)",
      gradient: "from-rose-600 to-pink-700",
      accent: "border-rose-200 hover:border-rose-400 ring-2 ring-rose-100",
    },
    {
      id: "Block E",
      letter: "E",
      title: "Block E",
      label: "Seniors Classes (2nd-4th Year)",
      labelBadge: "bg-amber-100 text-amber-900 border border-amber-300 shadow-xs",
      subtitle: "SENIORS CLASSES (2ND-4TH YEAR)\nENGINEERING & TECH WING",
      gradient: "from-amber-600 to-orange-700",
      accent: "border-amber-200 hover:border-amber-400 ring-2 ring-amber-100",
    },
  ];

  return (
    <section id="home-section" className="pb-24">
      {/* Hero Banner */}
      <div className="max-w-4xl mx-auto my-6 px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-blue-950/5 border border-white/80 p-6 sm:p-10 text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-100/60 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold tracking-wide uppercase border border-blue-200/60 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Smart Campus Navigator • Lucknow
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#102e59] tracking-tight mb-2">
              Welcome to SR Group of Institutes
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-xl mx-auto font-normal leading-relaxed">
              Your comprehensive guide across our 65-acre campus. Explore classroom blocks, faculty offices, timetable, library, laboratories, and hostel facilities with real-time navigation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                id="explore-campus-hero-btn"
                onClick={onExploreCampus}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#075db4] to-[#1176d0] hover:from-[#064e9a] hover:to-[#0f67b5] text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>EXPLORE CAMPUS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="ai-guide-hero-btn"
                onClick={onOpenAI}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200/80 transition-colors cursor-pointer"
              >
                <span>🤖 Ask Gemini AI Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* College Highlights / Quick Facts Bar */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/85 p-3.5 rounded-xl border border-slate-200/70 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">65-Acre Area</div>
              <div className="text-[11px] text-slate-500">Lush green campus</div>
            </div>
          </div>

          <div className="bg-white/85 p-3.5 rounded-xl border border-slate-200/70 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Est. in 2009</div>
              <div className="text-[11px] text-slate-500">15+ yrs excellence</div>
            </div>
          </div>

          <div className="bg-white/85 p-3.5 rounded-xl border border-slate-200/70 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">10+ Branches</div>
              <div className="text-[11px] text-slate-500">Engg & Management</div>
            </div>
          </div>

          <div className="bg-white/85 p-3.5 rounded-xl border border-slate-200/70 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <HomeIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">5 Blocks (A–E)</div>
              <div className="text-[11px] text-slate-500">Academic & Hostels</div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Campus Landmarks Notifier */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Boys Hostel & Cafes */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-xl p-4 border border-blue-200/60 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <HomeIcon className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#102e59]">Boys Hostel (Inside Campus)</div>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  Located <b className="text-blue-900">300 metres away from Main Gate</b> of college in the same campus.
                </p>
                <div className="mt-2 text-slate-600 flex items-center gap-1.5 font-medium">
                  <Coffee className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cafes & snacks available at <b>2nd Gate</b> of college.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seminar Hall & Store/Medicines */}
          <div className="bg-gradient-to-br from-rose-50/80 to-amber-50/50 rounded-xl p-4 border border-rose-200/60 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Pill className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#102e59]">Medicines & Seminar Hall Landmark</div>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  <b>Store Room & First-Aid Medicines</b> are located <b className="text-rose-900">just behind Block D</b> (Girls Hostel).
                </p>
                <p className="mt-1.5 text-slate-600 leading-relaxed">
                  <b>Seminar Hall</b> is <b className="text-slate-900">20 metres straight</b> from the campus cafeteria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Blocks Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-[#102e59] tracking-tight">
          Campus Blocks
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Select any block to see detailed floors, departments, and directions
        </p>
      </div>

      {/* Blocks Grid: Blocks A, B, C, D & E */}
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {blocks.map((block) => (
          <button
            key={block.id}
            id={`block-card-${block.letter}`}
            onClick={() => onOpenBlock(block.id)}
            className={`bg-white rounded-2xl p-5 text-center cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border ${block.accent} flex flex-col items-center justify-between min-h-[168px] group`}
          >
            {/* Circle Badge */}
            <div
              className={`w-14 h-14 rounded-full bg-gradient-to-br ${block.gradient} text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-blue-900/15 mb-3 group-hover:scale-110 transition-transform`}
            >
              {block.letter}
            </div>

            {/* Block Heading & Primary Label */}
            <div className="w-full">
              <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center justify-center gap-1.5">
                <span>{block.title}</span>
              </h3>
              <div className="mb-2">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${block.labelBadge}`}>
                  {block.label}
                </span>
              </div>
            </div>

            {/* Subtitle / Department Tags */}
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed whitespace-pre-line uppercase tracking-wide">
              {block.subtitle}
            </p>
          </button>
        ))}
      </div>

      {/* Section: OUR TEAM on the Main Interface */}
      <OurTeamSection
        team={team}
        onUpdateTeamMember={onUpdateTeamMember}
        isLoggedIn={isLoggedIn}
      />
    </section>
  );
}
