import { useState, useRef, useEffect } from "react";
import {
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ArrowRight,
  Compass,
  MapPin,
  Sparkles,
  Search,
  Filter,
  Plus,
  RotateCcw,
  CheckCircle2,
  Camera,
  Film,
  X,
  ExternalLink,
} from "lucide-react";
import { CampusVideoRoute } from "../types";
import { initialCampusVideos } from "../data/campusVideos";

interface CampusVideosSectionProps {
  onBack?: () => void;
  onNavigateToCamera?: () => void;
  initialVideoId?: string;
}

export default function CampusVideosSection({
  onBack,
  onNavigateToCamera,
  initialVideoId,
}: CampusVideosSectionProps) {
  const [allVideos, setAllVideos] = useState<CampusVideoRoute[]>(() => {
    try {
      const saved = localStorage.getItem("srgi_custom_video_routes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...initialCampusVideos];
          for (const p of parsed) {
            if (!merged.some((v) => v.id === p.id)) {
              merged.push(p);
            }
          }
          return merged;
        }
      }
    } catch {}
    return initialCampusVideos;
  });

  const [selectedVideo, setSelectedVideo] = useState<CampusVideoRoute>(() => {
    if (initialVideoId) {
      const found = initialCampusVideos.find((v) => v.id === initialVideoId);
      if (found) return found;
    }
    return initialCampusVideos[0];
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.8);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Form states for new video
  const [newTitle, setNewTitle] = useState("");
  const [newHindiTitle, setNewHindiTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newBlock, setNewBlock] = useState("Block C");
  const [newDesc, setNewDesc] = useState("");

  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  // Speed setup
  useEffect(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = playbackSpeed;
    }
  }, [selectedVideo, playbackSpeed]);

  const handleSelectVideo = (vid: CampusVideoRoute) => {
    setSelectedVideo(vid);
    setIsPlaying(true);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.load();
      videoPlayerRef.current.playbackRate = playbackSpeed;
      videoPlayerRef.current.play().catch(() => setIsPlaying(false));
    }
    // Scroll smoothly to player
    const el = document.getElementById("campus-videos-player-anchor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const togglePlay = () => {
    if (!videoPlayerRef.current) return;
    if (isPlaying) {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      videoPlayerRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoPlayerRef.current) return;
    videoPlayerRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (videoPlayerRef.current) {
      if (videoPlayerRef.current.requestFullscreen) {
        videoPlayerRef.current.requestFullscreen();
      }
    }
  };

  const categories = [
    { id: "all", label: `All Videos (${allVideos.length})` },
    { id: "central", label: "Central Campus & Gates" },
    { id: "block-c", label: "Block C & Floors" },
    { id: "stairs", label: "Stairs & Passages" },
    { id: "block-a", label: "Block A & Administration" },
  ];

  const filteredVideos = allVideos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.hindiTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === "central") {
      return (
        v.block.toLowerCase().includes("central") ||
        v.block.toLowerCase().includes("gate") ||
        v.block.toLowerCase().includes("exit")
      );
    }
    if (selectedCategory === "block-c") {
      return v.block.toLowerCase().includes("block c");
    }
    if (selectedCategory === "stairs") {
      return (
        v.title.toLowerCase().includes("stair") ||
        v.hindiTitle.toLowerCase().includes("सीढ़ी") ||
        v.tags?.some((t) => t.includes("stair"))
      );
    }
    if (selectedCategory === "block-a") {
      return (
        v.block.toLowerCase().includes("block a") ||
        v.title.toLowerCase().includes("block a") ||
        v.tags?.some((t) => t.includes("block a"))
      );
    }

    return true;
  });

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newTitle.trim()) return;

    const newRoute: CampusVideoRoute = {
      id: `vid-user-${Date.now()}`,
      title: newTitle.trim(),
      hindiTitle: newHindiTitle.trim() || newTitle.trim(),
      videoUrl: newUrl.trim(),
      startLocation: newStart.trim() || "Campus Location",
      endLocation: newEnd.trim() || "Destination",
      block: newBlock.trim() || "SRGI Lucknow",
      floor: "Ground",
      description: newDesc.trim() || "Campus official walkthrough video.",
      tags: ["custom", "walkthrough", "video"],
    };

    const updated = [newRoute, ...allVideos];
    setAllVideos(updated);
    setSelectedVideo(newRoute);

    try {
      const saved = localStorage.getItem("srgi_custom_video_routes");
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(newRoute);
      localStorage.setItem("srgi_custom_video_routes", JSON.stringify(list));
    } catch {}

    setNewTitle("");
    setNewHindiTitle("");
    setNewUrl("");
    setNewStart("");
    setNewEnd("");
    setNewDesc("");
    setIsAddModalOpen(false);
  };

  return (
    <section id="campus-videos-section" className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Top Breadcrumb / Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              ← Back to Home
            </button>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 text-xs font-bold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Campus Video Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToCamera && (
            <button
              onClick={onNavigateToCamera}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Detector</span>
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-[#123f73] hover:bg-[#0e315b] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Video</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-[#102e59] dark:text-white tracking-tight">
          CAMPUS VIDEO WALKTHROUGHS
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Explore all 23 official walking videos covering Central Campus, Main Gate, Block C corridors, CSE Section A classrooms, Block A administration, and staircases.
        </p>
      </div>

      {/* Anchor for Auto Scroll */}
      <div id="campus-videos-player-anchor" className="scroll-mt-24" />

      {/* Main Video Cinema Showcase Player */}
      <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 mb-8">
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <video
            ref={videoPlayerRef}
            src={selectedVideo.videoUrl}
            playsInline
            controls
            autoPlay
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />

          {/* Speed & Badge Overlays */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>{selectedVideo.block}</span>
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={() => {
                const nextSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 1.8 : playbackSpeed === 1.8 ? 2 : 1;
                setPlaybackSpeed(nextSpeed);
              }}
              className="px-3 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-amber-300 border border-amber-400/40 text-xs font-bold backdrop-blur-md transition-colors cursor-pointer"
              title="Change playback speed"
            >
              ⚡ {playbackSpeed}x Speed
            </button>

            <button
              onClick={handleFullscreen}
              className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Information Strip Below Player */}
        <div className="p-5 sm:p-6 bg-slate-900 border-t border-slate-800 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] tracking-wide uppercase">
                  NOW PLAYING
                </span>
                <span className="text-xs text-slate-400 font-mono">Floor: {selectedVideo.floor}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {selectedVideo.title}
              </h3>
              <p className="text-sm text-blue-300 font-medium mt-0.5">
                {selectedVideo.hindiTitle}
              </p>
              <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <div className="bg-slate-800/90 px-4 py-2.5 rounded-xl border border-slate-700 text-xs">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Route From</div>
                <div className="font-semibold text-white">{selectedVideo.startLocation}</div>
                <div className="text-amber-400 text-[10px] font-bold mt-1 uppercase">To Destination</div>
                <div className="font-semibold text-white">{selectedVideo.endLocation}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 23 videos by name, block, classroom or tag..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#123f73] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video, idx) => {
          const isSelected = selectedVideo.id === video.id;
          return (
            <div
              key={video.id}
              onClick={() => handleSelectVideo(video)}
              className={`group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-blue-600 ring-2 ring-blue-500/30 shadow-md"
                  : "border-slate-200 dark:border-slate-800 hover:border-blue-300"
              }`}
            >
              {/* Card Header with Video Index & Block Badge */}
              <div className="p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[11px] border border-blue-200 dark:border-blue-800">
                    Video #{idx + 1}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {video.block}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mt-1 line-clamp-1">
                  {video.hindiTitle}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>
              </div>

              {/* Card Footer with Start/End Locations & Play Button */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{video.startLocation}</span> → {video.endLocation}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectVideo(video);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isSelected ? "Playing" : "Watch"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <Film className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="font-bold text-sm text-slate-800 dark:text-slate-200">No videos found for "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Add Custom Video Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Campus Walk Video
              </h3>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Video URL (Direct MP4 / Cloudinary link) *
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/.../video.mp4"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Video Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Block A to Central Cafeteria Walk"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hindi Title
                </label>
                <input
                  type="text"
                  value={newHindiTitle}
                  onChange={(e) => setNewHindiTitle(e.target.value)}
                  placeholder="e.g. ब्लॉक A से सेंट्रल कैफेटेरिया रास्ता"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Start Location
                  </label>
                  <input
                    type="text"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    placeholder="e.g. Block A Gate"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    placeholder="e.g. Cafeteria"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Provide route details and walking landmarks..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#123f73] hover:bg-[#0e315b] text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
