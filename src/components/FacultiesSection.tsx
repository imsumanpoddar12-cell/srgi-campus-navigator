import { useState } from "react";
import { ArrowLeft, Phone, Search, GraduationCap, UserCheck } from "lucide-react";
import { Faculty } from "../types";

interface FacultiesSectionProps {
  faculties: Faculty[];
  onBack: () => void;
}

export default function FacultiesSection({ faculties, onBack }: FacultiesSectionProps) {
  const [search, setSearch] = useState("");

  const filtered = faculties.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      (f.subject && f.subject.toLowerCase().includes(q)) ||
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

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-6">
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
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((faculty) => (
          <div
            key={faculty.id}
            id={`faculty-card-${faculty.id}`}
            className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-extrabold text-[#123f73]">
                  {faculty.name}
                </h3>
              </div>
              <p className="text-xs font-semibold text-slate-700">
                {faculty.designation}
              </p>
              {faculty.subject && (
                <p className="text-[11px] text-slate-500 font-medium">
                  {faculty.subject}
                </p>
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
