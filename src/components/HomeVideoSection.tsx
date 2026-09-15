import { useState } from "react";
import {
  Video,
  Play,
  ArrowRight,
  Sparkles,
  MapPin,
  Film,
  Camera,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { CampusVideoRoute } from "../types";
import { initialCampusVideos } from "../data/campusVideos";

interface HomeVideoSectionProps {
  onNavigateToVideos?: () => void;
  onNavigateToCamera?: () => void;
  onSelectVideo?: (videoId: string) => void;
}

export default function HomeVideoSection({
  onNavigateToVideos,
  onNavigateToCamera,
  onSelectVideo,
}: HomeVideoSectionProps) {
  const [activePreviewVideo, setActivePreviewVideo] = useState<CampusVideoRoute | null>(null);

  // Top 4 highlighted route walkthroughs for quick preview
  const featuredVideos = [
    {
      vid: initialCampusVideos.find((v) => v.id === "vid-central-campus-ground") || initialCampusVideos[0],
      badge: "Central Campus",
      color: "from-blue-600 to-indigo-700",
      bgBadge: "bg-blue-500/20 text-blue-200 border-blue-400/30",
    },
    {
      vid: initialCampusVideos.find((v) => v.id === "vid-college-exit-gate") || initialCampusVideos[1],
      badge: "College Exit Route",
      color: "from-emerald-600 to-teal-700",
      bgBadge: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
    },
    {
      vid: initialCampusVideos.find((v) => v.id === "vid-way-to-a-block") || initialCampusVideos[2],
      badge: "Way to Block A",
      color: "from-amber-600 to-orange-700",
      bgBadge: "bg-amber-500/20 text-amber-200 border-amber-400/30",
    },
    {
      vid: initialCampusVideos.find((v) => v.id === "vid-c-block-second-floor") || initialCampusVideos[5],
      badge: "Block C & CSE A",
      color: "from-purple-600 to-pink-700",
      bgBadge: "bg-purple-500/20 text-purple-200 border-purple-400/30",
    },
  ];

  const handleCardClick = (vid: CampusVideoRoute) => {
    if (onSelectVideo) {
      onSelectVideo(vid.id);
    } else if (onNavigateToVideos) {
      onNavigateToVideos();
    } else {
      setActivePreviewVideo(vid);
    }
  };

  return (
    <section id="home-video-walkthroughs-section" className="max-w-4xl mx-auto px-4 my-12">
      <div className="bg-gradient-to-br from-slate-950 via-[#0d233e] to-[#08182b] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/20 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30 mb-2">
                <Video className="w-3.5 h-3.5 text-blue-400" />
                <span>23 Official Campus Videos</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Campus Video Walkthroughs (वीडियो वॉकथ्रू)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                High-definition walking videos guiding you step-by-step through Central Campus, Main Gate, Block C corridors, CSE Section A classrooms, and Block A administration.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {onNavigateToVideos && (
                <button
                  id="view-all-23-videos-btn"
                  onClick={onNavigateToVideos}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/30 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Film className="w-4 h-4 text-blue-200" />
                  <span>Open Video Section ({initialCampusVideos.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {onNavigateToCamera && (
                <button
                  onClick={onNavigateToCamera}
                  className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-400/30 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Camera Vision</span>
                </button>
              )}
            </div>
          </div>

          {/* Featured Video Route Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {featuredVideos.map((item, idx) => (
              <div
                key={item.vid.id}
                onClick={() => handleCardClick(item.vid)}
                className="bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 hover:border-blue-400/50 transition-all duration-200 cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${item.bgBadge}`}>
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      #{idx + 1}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                    {item.vid.title}
                  </h4>
                  <p className="text-[11px] text-blue-200/80 font-medium mt-0.5 line-clamp-1">
                    {item.vid.hindiTitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">1.8x Fast Walk</span>
                  <div className="w-7 h-7 rounded-full bg-blue-600/80 group-hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-sm">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Route Highlights Bar */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                All 23 route videos feature <b>1.8x speed</b> for fast walking preview across all 5 campus blocks.
              </span>
            </div>

            {onNavigateToVideos && (
              <button
                onClick={onNavigateToVideos}
                className="text-amber-300 hover:text-amber-200 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Browse All 23 Walk Videos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick In-Modal Video Player if triggered directly */}
      {activePreviewVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl max-w-3xl w-full overflow-hidden border border-slate-800 shadow-2xl relative">
            <div className="p-4 bg-slate-900 flex items-center justify-between border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">{activePreviewVideo.title}</h4>
                <p className="text-xs text-blue-300">{activePreviewVideo.hindiTitle}</p>
              </div>
              <button
                onClick={() => setActivePreviewVideo(null)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold"
              >
                Close ✕
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                src={activePreviewVideo.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 bg-slate-900 text-xs text-slate-300 flex items-center justify-between">
              <div>
                From: <b>{activePreviewVideo.startLocation}</b> → To: <b>{activePreviewVideo.endLocation}</b>
              </div>
              {onNavigateToVideos && (
                <button
                  onClick={() => {
                    setActivePreviewVideo(null);
                    onNavigateToVideos();
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  <span>Open Full Video Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
