import { ArrowLeft, MapPin, Calendar, Award, Building, Coffee, Pill, Users } from "lucide-react";
import { CollegeInfo } from "../types";
import SRGILogo from "./SRGILogo";

interface AboutSectionProps {
  collegeInfo: CollegeInfo;
  onBack: () => void;
}

export default function AboutSection({ collegeInfo, onBack }: AboutSectionProps) {
  return (
    <section id="about-section" className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          id="about-back-home-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>
      </div>

      {/* Main About Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 space-y-8">
        {/* College Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left border-b border-slate-100 pb-6">
          <SRGILogo size={68} />
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Campus Profile & Legacy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#102e59]">
              {collegeInfo.fullName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Affiliated to AKTU / Approved by AICTE, PCI & State Government • Lucknow, UP
            </p>
          </div>
        </div>

        {/* Core Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 text-center">
            <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
            <div className="text-lg font-black text-blue-950">65 Acres</div>
            <div className="text-[11px] text-blue-700 font-semibold">Campus Area</div>
          </div>
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 text-center">
            <Calendar className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
            <div className="text-lg font-black text-amber-950">Est. 2009</div>
            <div className="text-[11px] text-amber-700 font-semibold">15+ Years Legacy</div>
          </div>
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 text-center">
            <Award className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
            <div className="text-lg font-black text-emerald-950">10+ Branches</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Engg & Mgmt</div>
          </div>
          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-100 text-center">
            <Building className="w-5 h-5 text-purple-600 mx-auto mb-1.5" />
            <div className="text-lg font-black text-purple-950">5 Blocks</div>
            <div className="text-[11px] text-purple-700 font-semibold">Blocks A through E</div>
          </div>
        </div>

        {/* Campus Specifics - Important Locations */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            Essential Campus Locations & Landmarks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
              <Building className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <b className="text-slate-900">Boys Hostel:</b>
                <p className="text-slate-600 mt-0.5">{collegeInfo.boysHostel}</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
              <Coffee className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <b className="text-slate-900">Campus Cafes:</b>
                <p className="text-slate-600 mt-0.5">{collegeInfo.cafesGate2}</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
              <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <b className="text-slate-900">Seminar Hall & Cafeteria:</b>
                <p className="text-slate-600 mt-0.5">{collegeInfo.seminarHallDist}</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
              <Pill className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <b className="text-slate-900">Store Room & Medicines:</b>
                <p className="text-slate-600 mt-0.5">{collegeInfo.storeRoomMedicines}</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
              <Building className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
              <div>
                <b className="text-slate-900">Block D (Girls Hostel):</b>
                <p className="text-slate-600 mt-0.5">{collegeInfo.blockDNote}</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
              <Users className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <b className="text-slate-900">Block E (Seniors Classes):</b>
                <p className="text-slate-600 mt-0.5">{collegeInfo.blockENote}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & History */}
        <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
            About Our Institution
          </h3>
          <p>{collegeInfo.history}</p>
          <p>{collegeInfo.mission}</p>
        </div>
      </div>
    </section>
  );
}
