import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  School,
  FileText,
} from "lucide-react";
import { srgiHolidays2026, CollegeHoliday } from "../data/holidaysData";

interface HolidaysSectionProps {
  onNavigateHome?: () => void;
}

export default function HolidaysSection({ onNavigateHome }: HolidaysSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "academic" | "upcoming">("all");

  const todayStr = "2026-09-13"; // current reference date

  const filteredHolidays = srgiHolidays2026.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.nameHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.dateRangeDisplay.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === "academic") {
      return h.type === "academic-screenshot";
    }
    if (selectedCategory === "upcoming") {
      return h.endDate >= todayStr;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header Banner inspired by college portal */}
      <div className="bg-gradient-to-r from-[#0d2e54] via-[#123f73] to-[#1a5b9b] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-bold tracking-wide uppercase text-blue-200 mb-2">
              <CalendarIcon className="w-3.5 h-3.5 text-amber-300" />
              <span>Official Academic Calendar • 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              कॉलेज अवकाश तालिका 2026
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl">
              SR Group of Institutions (SRGI) Lucknow — Semester Holidays & Festival Calendar.
              Verified with academic notification list.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center shrink-0">
            <div className="text-[11px] text-blue-200 font-semibold">Total College Breaks</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              {srgiHolidays2026.length} Holidays
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* College Selector & Filter Tabs matching screenshot ~ Select College ~ */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200">
            <School className="w-4 h-4 text-blue-600" />
            <span>~ Select College ~ SR Group of Institutions (SRGI)</span>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#123f73] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All 2026 ({srgiHolidays2026.length})
            </button>
            <button
              onClick={() => setSelectedCategory("academic")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                selectedCategory === "academic"
                  ? "bg-[#123f73] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Notice List (8 Holidays)
            </button>
            <button
              onClick={() => setSelectedCategory("upcoming")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                selectedCategory === "upcoming"
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              Upcoming Ahead
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search holiday (e.g., Deepawali, Raksha Bandhan, Muharram, August, Oct...)"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-blue-600 focus:ring-2 focus:ring-blue-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Holidays List rendered in the authentic Screenshot card aesthetic */}
      <div className="space-y-3.5">
        {filteredHolidays.map((holiday: CollegeHoliday) => {
          const isUpcoming = holiday.startDate >= todayStr;
          const isPast = holiday.endDate < todayStr;

          return (
            <div
              key={holiday.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isUpcoming
                  ? "border-blue-200 ring-2 ring-blue-50/60 shadow-xs"
                  : isPast
                  ? "border-slate-200/80 opacity-90"
                  : "border-slate-200"
              }`}
            >
              {/* Left side: Authentic Blue Date Block & Title/Date Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Date Block matching screenshot: Solid deep navy blue background with white month & big day */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#0e3b6e] text-white flex flex-col items-center justify-center shrink-0 shadow-sm border border-blue-900/30">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-200">
                    {holiday.month}
                  </span>
                  <span className="text-xl sm:text-2xl font-black leading-none mt-0.5">
                    {holiday.day}
                  </span>
                </div>

                {/* Holiday Title & Dates */}
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      {holiday.name}
                    </h2>
                    {holiday.daysCount > 1 && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold">
                        {holiday.daysCount} Days Vacation
                      </span>
                    )}
                    {holiday.type === "academic-screenshot" && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[10px] font-semibold">
                        Notice List
                      </span>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm font-semibold text-slate-700">
                    {holiday.nameHindi}
                  </div>

                  {/* Date range with clock icon exactly like screenshot */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium pt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{holiday.dateRangeDisplay}</span>
                  </div>

                  {holiday.description && (
                    <p className="text-[11px] text-slate-500 font-normal pt-0.5">
                      {holiday.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right side status badge */}
              <div className="sm:self-center shrink-0 w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                {isUpcoming ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Upcoming</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium">
                    <CheckCircle2 className="w-3 h-3 text-slate-400" />
                    <span>Completed</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredHolidays.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <div className="font-bold text-slate-700">No matching holidays found</div>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with another festival name or clear filters.
            </p>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs text-blue-900 flex items-start gap-3">
        <FileText className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-blue-950">Academic Notice Information:</div>
          <p className="text-blue-800/90 mt-0.5 leading-relaxed">
            यह अवकाश तालिका SRGI एकेडमिक कैलेंडर व आधिकारिक नोटिस के आधार पर तैयार की गई है।
            विशेष परिस्थितियों या सरकारी घोषणाओं के आधार पर अवकाश में आंशिक बदलाव संभव है।
          </p>
        </div>
      </div>
    </div>
  );
}
