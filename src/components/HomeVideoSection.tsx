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
  Layers,
  Sparkles,
} from "lucide-react";
import { CampusVideoRoute } from "../types";
import { initialCampusVideos } from "../data/campusVideos";

interface HomeVideoSectionProps {
  onNavigateToCamera: () => void;
}

export default function HomeVideoSection({ onNavigateToCamera }: HomeVideoSectionProps) {
  const [allVideos, setAllVideos] = useState<CampusVideoRoute[]>(initialCampusVideos);
  const [selectedVideo, setSelectedVideo] = useState<CampusVideoRoute>(initialCampusVideos[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load any user-added videos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("srgi_custom_video_routes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllVideos([...initialCampusVideos, ...parsed]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectVideo = (video: CampusVideoRoute) => {
    setSelectedVideo(video);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section id="home-video-walkthroughs-section" className="max-w-4xl mx-auto px-4 my-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold tracking-wide uppercase border border-blue-200/60 mb-2">
            <Video className="w-3.5 h-3.5 text-blue-600" />
            Official Campus Walkthrough Videos
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#102e59] tracking-tight">
            Campus Route Videos & Walkthroughs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            कैंपस वीडियो वॉकथ्रू — गेट 1, ब्लॉक C, सीढ़ियों व लैब तक का सीधा रास्ता देखें
          </p>
        </div>

        <button
          id="home-open-camera-detector-btn"
          onClick={onNavigateToCamera}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075db4] hover:bg-[#064e9a] text-white text-xs font-bold transition-all shadow-md shadow-blue-900/10 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Compass className="w-3.5 h-3.5 text-blue-200" />
          <span>Open Full Camera Detector</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Video Player Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-900/5 overflow-hidden">
        {/* Video Player Display */}
        <div className="relative bg-slate-950 aspect-video w-full flex items-center justify-center overflow-hidden group">
          <video
            ref={videoRef}
            src={selectedVideo.videoUrl}
            className="w-full h-full object-contain"
            playsInline
            muted={isMuted}
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none">
            {/* Top Video Header */}
            <div className="flex items-center justify-between pointer-events-auto">
              <span className="px-3 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {selectedVideo.block} • {selectedVideo.floor}
              </span>
              <div className="flex items-center gap-2">
                <button
                  id="home-video-mute-btn"
                  onClick={toggleMute}
                  className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  id="home-video-fullscreen-btn"
                  onClick={handleFullscreen}
                  className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Play/Pause & Title */}
            <div className="pointer-events-auto">
              <div className="flex items-center gap-3">
                <button
                  id="home-video-play-btn"
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform transform active:scale-95 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div>
                  <div className="text-white text-sm font-bold drop-shadow-sm">{selectedVideo.title}</div>
                  <div className="text-slate-300 text-xs drop-shadow-sm">{selectedVideo.hindiTitle}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Play Button if Paused */}
          {!isPlaying && (
            <button
              id="home-video-center-play-btn"
              onClick={togglePlay}
              className="absolute z-10 w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-xl backdrop-blur-xs transition-transform transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-7 h-7 ml-1" />
            </button>
          )}
        </div>

        {/* Selected Route Info Strip */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-blue-50/40 border-b border-slate-200/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-base font-extrabold text-[#102e59] flex items-center gap-2">
                <span>{selectedVideo.title}</span>
              </div>
              <div className="text-xs font-semibold text-blue-800 mt-0.5">
                {selectedVideo.hindiTitle}
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
                {selectedVideo.description}
              </p>
            </div>

            {/* Start to Destination pill */}
            <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs shrink-0 text-xs flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">{selectedVideo.startLocation}</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-700 font-bold pl-3.5">
                <ArrowRight className="w-3 h-3 text-blue-500" />
                <span>{selectedVideo.endLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Route Videos Selector Carousel/Grid */}
        <div className="p-4 sm:p-5">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Available Route Videos ({allVideos.length})
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Tap any video to play directly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {allVideos.map((video, idx) => {
              const isSelected = selectedVideo.id === video.id;
              return (
                <button
                  key={video.id}
                  id={`home-video-card-${idx}`}
                  onClick={() => handleSelectVideo(video)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-50/90 border-blue-400 shadow-sm ring-2 ring-blue-100"
                      : "bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        Route #{idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium truncate max-w-[100px]">
                        {video.floor}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug mb-1">
                      {video.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {video.hindiTitle}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1 truncate max-w-[120px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{video.block}</span>
                    </span>
                    <span className={`font-bold flex items-center gap-0.5 ${isSelected ? "text-blue-700" : "text-slate-600"}`}>
                      {isSelected ? "Playing" : "Watch"}
                      <Play className="w-2.5 h-2.5 ml-0.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
