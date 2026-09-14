import { useState } from "react";
import { ArrowLeft, Phone, Search, GraduationCap, UserCheck, Award } from "lucide-react";
import { Faculty } from "../types";

interface FacultiesSectionProps {
  faculties: Faculty[];
  onBack: () => void;
}

export default function FacultiesSection({ faculties, onBack }: FacultiesSectionProps) {
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState<"all" | "cse-a" | "cse-bc" | "leadership">("all");

  const filtered = faculties.filter((f) => {
    if (sectionFilter === "cse-a" && f.sectionGroup !== "CSE A") return false;
    if (sectionFilter === "cse-bc" && f.sectionGroup !== "CSE B & C") return false;
    if (sectionFilter === "leadership" && !f.roleTitle) return false;

    const q = search.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      (f.subject && f.subject.toLowerCase().includes(q)) ||
      (f.sectionGroup && f.sectionGroup.toLowerCase().includes(q)) ||
      (f.roleTitle && f.roleTitle.toLowerCase().includes(q)) ||
      f.phone.includes(q)
    );
  });

  return (
    <section id="faculties-section" className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          id="faculties-back-home-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          {filtered.length} Faculties listed
        </span>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-2">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          Academic Directory
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#123f73] tracking-tight">
          FACULTIES
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          SRGI Department Heads, Professors & Subject Faculty Contacts
        </p>
      </div>

      {/* Search Bar & Section Filter Pills */}
      <div className="max-w-md mx-auto mb-6 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search faculty name, subject or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSectionFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              sectionFilter === "all"
                ? "bg-[#123f73] text-white"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            All ({faculties.length})
          </button>
          <button
            onClick={() => setSectionFilter("cse-a")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              sectionFilter === "cse-a"
                ? "bg-[#123f73] text-white"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            CSE Section A
          </button>
          <button
            onClick={() => setSectionFilter("cse-bc")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              sectionFilter === "cse-bc"
                ? "bg-[#123f73] text-white"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            CSE Section B & C
          </button>
          <button
            onClick={() => setSectionFilter("leadership")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              sectionFilter === "leadership"
                ? "bg-amber-600 text-white"
                : "bg-white text-amber-800 border border-amber-200"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Leadership</span>
          </button>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((faculty) => (
          <div
            key={faculty.id}
            id={`faculty-card-${faculty.id}`}
            className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex items-start justify-between gap-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-extrabold text-[#123f73]">
                  {faculty.name}
                </h3>
                {faculty.roleTitle && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                    {faculty.roleTitle}
                  </span>
                )}
                {faculty.sectionGroup && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {faculty.sectionGroup}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-slate-700">
                {faculty.designation}
              </p>
              {faculty.subject && (
                <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Subject: {faculty.subject}
                </span>
              )}
            </div>

            <a
              href={`tel:${faculty.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors shrink-0"
              title={`Call ${faculty.name}`}
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{faculty.phone}</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
