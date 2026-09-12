import { ArrowLeft, Clock, Calendar, Coffee, Droplets } from "lucide-react";
import { ScheduleDay } from "../types";

interface ScheduleSectionProps {
  schedule: ScheduleDay[];
  onBack: () => void;
}

export default function ScheduleSection({ schedule, onBack }: ScheduleSectionProps) {
  const periods = [
    { label: "P1", time: "09:00 - 10:00" },
    { label: "P2", time: "10:00 - 11:00" },
    { label: "P3", time: "11:10 - 12:10" },
    { label: "P4", time: "01:00 - 02:10" },
    { label: "P5", time: "02:20 - 03:20" },
    { label: "P6", time: "03:30 - 04:30" },
  ];

  return (
    <section id="schedule-section" className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          id="schedule-back-home-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Mon - Sat Academic Timetable
        </span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-[#123f73] tracking-tight">
          SCHEDULE
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          B.Tech Class Timetable, Lectures, Laboratory Batches & Break Timings
        </p>
      </div>

      {/* Break timings card */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 p-4 rounded-2xl border border-blue-200/80 shadow-xs">
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

      {/* Responsive Timetable Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#123f73] text-white font-bold">
                <th className="p-3.5 border-b border-blue-900 font-extrabold sticky left-0 bg-[#123f73] z-10">
                  DAY
                </th>
                {periods.map((p) => (
                  <th key={p.label} className="p-3.5 border-b border-blue-900 min-w-[130px]">
                    <div>{p.label}</div>
                    <div className="text-[10px] font-normal text-blue-200">{p.time}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedule.map((row) => (
                <tr key={row.day} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-black text-slate-800 bg-slate-50/90 sticky left-0 z-10 border-r border-slate-200">
                    {row.day}
                  </td>
                  <td className="p-3.5 font-medium text-slate-700">{row.p1}</td>
                  <td className="p-3.5 font-medium text-slate-700">{row.p2}</td>
                  <td className="p-3.5 font-medium text-slate-700">{row.p3}</td>
                  <td className="p-3.5 font-medium text-slate-700">{row.p4}</td>
                  <td className="p-3.5 font-medium text-slate-700">{row.p5}</td>
                  <td className="p-3.5 font-medium text-slate-700">{row.p6}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
