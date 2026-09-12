import { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Search,
  GraduationCap,
  Calendar,
  Clock,
  Coffee,
  Droplets,
  BookOpen,
} from "lucide-react";
import { Faculty, ScheduleDay } from "../types";

interface FacultiesScheduleSectionProps {
  faculties: Faculty[];
  schedule: ScheduleDay[];
  onBack: () => void;
  defaultTab?: "faculties" | "schedule";
}

export default function FacultiesScheduleSection({
  faculties,
  schedule,
  onBack,
  defaultTab = "faculties",
}: FacultiesScheduleSectionProps) {
  const [activeTab, setActiveTab] = useState<"faculties" | "schedule">(defaultTab);
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("All");

  const periods = [
    { label: "P1", time: "09:00 - 10:00" },
    { label: "P2", time: "10:00 - 11:00" },
    { label: "P3", time: "11:10 - 12:10" },
    { label: "P4", time: "01:00 - 02:10" },
    { label: "P5", time: "02:20 - 03:20" },
    { label: "P6", time: "03:30 - 04:30" },
  ];

  const filteredFaculties = faculties.filter((f) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      f.name.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      (f.subject && f.subject.toLowerCase().includes(q)) ||
      f.phone.includes(q)
    );
  });

  const filteredSchedule =
    selectedDay === "All"
      ? schedule
      : schedule.filter((s) => s.day.toLowerCase() === selectedDay.toLowerCase());

  return (
    <section id="faculties-and-schedule-section" className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          id="faculties-schedule-back-home-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            id="tab-faculties-btn"
            onClick={() => setActiveTab("faculties")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "faculties"
                ? "bg-[#123f73] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculties ({faculties.length})</span>
          </button>
          <button
            id="tab-schedule-btn"
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "schedule"
                ? "bg-[#123f73] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Class Schedule</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-2 border border-blue-200/60">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          Academic Information & Timetable
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#123f73] tracking-tight">
          Faculties & Schedule
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
          Contact details for professors, departmental heads, and full weekly B.Tech academic timetable with period breaks.
        </p>
      </div>

      {/* TAB 1: FACULTIES DIRECTORY */}
      {activeTab === "faculties" && (
        <div>
          {/* Search bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="faculty-search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search faculty by name, department, or subject..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
              />
            </div>
          </div>

          {/* Faculty Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFaculties.map((f) => (
              <div
                key={f.id}
                id={`faculty-card-${f.id}`}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#123f73] to-[#1e5899] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {f.name.replace("Prof. ", "").replace("Dr. ", "").substring(0, 2).toUpperCase()}
                    </div>
                    {f.subject && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200/80 text-right truncate max-w-[140px]">
                        {f.subject}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                    {f.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {f.designation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{f.phone}</span>
                  </div>
                  <a
                    href={`tel:${f.phone}`}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Call
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredFaculties.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-6">
              <p className="text-sm font-bold text-slate-700">No faculty found</p>
              <p className="text-xs text-slate-500 mt-1">Try searching with a different name or subject</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACADEMIC SCHEDULE */}
      {activeTab === "schedule" && (
        <div className="space-y-6">
          {/* Recess & Break Times Info */}
          <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 p-4 rounded-2xl border border-blue-200/80 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-blue-900 font-bold">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span>Water Breaks: 11:00 - 11:10 • 02:10 - 02:20 • 03:20 - 03:30</span>
              </div>
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <Coffee className="w-4 h-4 text-amber-600" />
                <span>Lunch Recess: 12:10 - 01:00 PM</span>
              </div>
            </div>
          </div>

          {/* Day Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedDay === day
                    ? "bg-[#123f73] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                    <th className="p-3.5 font-bold uppercase tracking-wider text-slate-900">Day</th>
                    {periods.map((p) => (
                      <th key={p.label} className="p-3 font-semibold text-center border-l border-slate-200">
                        <div className="font-bold text-blue-900">{p.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{p.time}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchedule.map((row) => (
                    <tr key={row.day} className="hover:bg-blue-50/40 transition-colors">
                      <td className="p-3.5 font-bold text-[#123f73] whitespace-nowrap bg-slate-50/50">
                        {row.day}
                      </td>
                      <td className="p-3 text-center border-l border-slate-100 text-slate-800 font-medium">
                        {row.p1}
                      </td>
                      <td className="p-3 text-center border-l border-slate-100 text-slate-800 font-medium">
                        {row.p2}
                      </td>
                      <td className="p-3 text-center border-l border-slate-100 text-slate-800 font-medium">
                        {row.p3}
                      </td>
                      <td className="p-3 text-center border-l border-slate-100 text-slate-800 font-medium bg-amber-50/20">
                        {row.p4}
                      </td>
                      <td className="p-3 text-center border-l border-slate-100 text-slate-800 font-medium">
                        {row.p5}
                      </td>
                      <td className="p-3 text-center border-l border-slate-100 text-slate-800 font-medium">
                        {row.p6}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-4">
            {filteredSchedule.map((row) => (
              <div
                key={row.day}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-sm text-[#123f73]">{row.day}</span>
                  <span className="text-[11px] text-slate-400 font-medium">6 Periods</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">P1 (09:00 - 10:00)</span>
                    <span className="font-semibold text-slate-800">{row.p1}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">P2 (10:00 - 11:00)</span>
                    <span className="font-semibold text-slate-800">{row.p2}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">P3 (11:10 - 12:10)</span>
                    <span className="font-semibold text-slate-800">{row.p3}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50/50 border border-amber-200/60">
                    <span className="text-[10px] text-amber-700 font-bold block">P4 (01:00 - 02:10)</span>
                    <span className="font-semibold text-slate-800">{row.p4}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">P5 (02:20 - 03:20)</span>
                    <span className="font-semibold text-slate-800">{row.p5}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">P6 (03:30 - 04:30)</span>
                    <span className="font-semibold text-slate-800">{row.p6}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
