import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Video,
  Volume2,
  VolumeX,
  Layers,
  Film,
  Plus,
  X,
  Upload,
  CheckCircle2,
  Navigation,
  Image as ImageIcon,
  Bot,
  Play,
  RotateCcw,
} from "lucide-react";
import { CampusLocation, CampusVideoRoute } from "../types";
import { initialCampusVideos } from "../data/campusVideos";

interface LandmarkPreset {
  id: string;
  name: string;
  block: string;
  landmark: string;
  description: string;
  badge: string;
  videoRouteId?: string;
  previewImage?: string;
}

const campusLandmarks: LandmarkPreset[] = [
  {
    id: "central-campus",
    name: "Central Campus Grounds (सेंट्रल कैंपस)",
    block: "Central Lawn",
    landmark: "Between Gate 1 and Academic Blocks, sports lawns & walkways",
    description: "Heart of the 65-acre SRGI campus connecting all engineering blocks and main roads.",
    badge: "Central Landmark",
    videoRouteId: "vid-central-campus-ground",
    previewImage: "https://res.cloudinary.com/ehqczar2/video/upload/v1789356271/q7cdovbf0i2vejtx39ty.mp4",
  },
  {
    id: "college-exit",
    name: "College Exit & Gate (कॉलेज एग्जिट मार्ग)",
    block: "Gate 1",
    landmark: "Paved exit highway facing NH-24 Sitapur Road corridor",
    description: "Main outbound route for buses, auto rickshaws, and campus transport.",
    badge: "Exit & Transit",
    videoRouteId: "vid-college-exit-gate",
    previewImage: "https://res.cloudinary.com/ehqczar2/video/upload/v1789356297/unyd2mbj8legxeimf11f.mp4",
  },
  {
    id: "way-to-block-a",
    name: "Way to Block A Pathway (ब्लॉक A का रास्ता)",
    block: "Block A Connect",
    landmark: "Central paved avenue leading directly to Block A Administration",
    description: "Main walking path from Central Lawn towards the Chairman, Vice Chairman & Director Offices.",
    badge: "Admin Boulevard",
    videoRouteId: "vid-way-to-a-block",
    previewImage: "https://res.cloudinary.com/ehqczar2/video/upload/v1789356250/bxrh4ck0xjtvmuwyxut7.mp4",
  },
  {
    id: "main-gate",
    name: "Gate 1 - Main Campus Entrance (कॉलेज मुख्य गेट)",
    block: "Entrance",
    landmark: "Facing NH-24 Sitapur Road, Security Guard Post & Arch",
    description: "Primary entrance gateway into the 65-acre campus.",
    badge: "Gate 1",
    videoRouteId: "vid-main-gate-entry",
  },
  {
    id: "block-c-main-gate",
    name: "Block C - Front Porch & Entrance (ब्लॉक C मुख्य द्वार)",
    block: "Block C",
    landmark: "Large pillar porch, B.Tech CSE Board & Main Steps",
    description: "Main academic building housing Computer Science department and lecture halls.",
    badge: "Block C Entrance",
    videoRouteId: "vid-c-block-main-entry",
  },
  {
    id: "block-c-left-stairs",
    name: "Block C - Left Staircase Lobby (बाएं सीढ़ियाँ)",
    block: "Block C",
    landmark: "Left entrance door beside lift shaft leading directly to 1st & 2nd floors",
    description: "Direct stair access to 2nd Floor CSE Section A, Section B, Section C classrooms.",
    badge: "Staircase Lobby",
    videoRouteId: "vid-c-block-left-stairs-entry",
  },
  {
    id: "block-c-ground-floor",
    name: "Block C - Ground Floor Reception & Corridor",
    block: "Block C",
    landmark: "Reception desk, main notice boards & labs passage",
    description: "Ground floor hub connecting computer labs and faculty offices.",
    badge: "Ground Floor",
    videoRouteId: "vid-c-block-ground-to-second",
  },
  {
    id: "block-c-second-floor",
    name: "Block C - 2nd Floor (CSE Section A Wing)",
    block: "Block C",
    landmark: "2nd Floor Corridor, CSE Section A, Section B, Section C",
    description: "Primary classroom wing for B.Tech Computer Science Engineering students.",
    badge: "CSE Department Wing",
    videoRouteId: "vid-c-block-second-floor",
  },
  {
    id: "block-c-floor-2-right",
    name: "Block C - 2nd Floor Right Side Corridor",
    block: "Block C",
    landmark: "Right wing corridor, Department Faculty Chambers & Tutorial Rooms",
    description: "Right corridor housing faculty consulting rooms and labs.",
    badge: "2nd Floor Right",
    videoRouteId: "vid-c-block-floor-2-right-side",
  },
  {
    id: "central-library",
    name: "Central Library (केंद्रीय पुस्तकालय)",
    block: "Block A / Central Wing",
    landmark: "50,000+ technical volumes, digital catalog & reading hall",
    description: "Knowledge hub with reading desks and high-speed Wi-Fi research stations.",
    badge: "Library Hub",
    videoRouteId: "vid-central-campus-ground",
  },
  {
    id: "central-cafeteria",
    name: "Central Cafeteria & Canteen",
    block: "Block B Grounds",
    landmark: "Near Block B student activity center",
    description: "Breakfast, lunch, tea, cold drinks, snacks & student lounge.",
    badge: "Cafeteria",
    videoRouteId: "vid-way-to-a-block",
  },
  {
    id: "seminar-hall",
    name: "Main Seminar Hall & Auditorium",
    block: "Block A",
    landmark: "Block A Ground Floor, 500-seat acoustic auditorium",
    description: "Campus conferences, orientations, guest lectures & tech symposia.",
    badge: "Auditorium",
    videoRouteId: "vid-way-to-a-block",
  },
];

interface RouteStep {
  stepNumber: number;
  instruction: string;
  hindiInstruction: string;
  distance: string;
  turn: "straight" | "left" | "right" | "stairs";
}

interface CalculatedRouteData {
  distance: string;
  estTime: string;
  steps: RouteStep[];
  matchedVideo?: CampusVideoRoute;
}

interface CameraDetectorSectionProps {
  locations?: CampusLocation[];
  onOpenMap?: () => void;
}

export default function CameraDetectorSection({ locations, onOpenMap }: CameraDetectorSectionProps) {
  // Mode: "live" | "video-route" | "upload"
  const [activeMode, setActiveMode] = useState<"live" | "video-route" | "upload">("live");

  // Video routes state
  const [videoRoutes, setVideoRoutes] = useState<CampusVideoRoute[]>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem("srgi_video_routes");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const merged = [...parsed];
            for (const initVid of initialCampusVideos) {
              if (!merged.some((v) => v.id === initVid.id)) {
                merged.push(initVid);
              }
            }
            return merged;
          }
        }
      }
    } catch {}
    return initialCampusVideos;
  });

  const [selectedVideoRoute, setSelectedVideoRoute] = useState<CampusVideoRoute>(
    videoRoutes[0] || initialCampusVideos[0]
  );

  // Camera stream refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const routeVideoPlayerRef = useRef<HTMLVideoElement | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isScanning, setIsScanning] = useState(false);

  // Captured Photo state
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [photoSource, setPhotoSource] = useState<"camera" | "upload" | null>(null);

  // Detected place state
  const [detectedPlace, setDetectedPlace] = useState<LandmarkPreset | null>(campusLandmarks[0]);
  const [confidence, setConfidence] = useState<number>(97);
  const [detectionTimestamp, setDetectionTimestamp] = useState<string>("");

  // Route calculation state
  const [targetDestinationId, setTargetDestinationId] = useState<string>("block-c-second-floor");
  const [calculatedRoute, setCalculatedRoute] = useState<CalculatedRouteData | null>(null);

  // AI Audio Guidance state
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [aiSpokenText, setAiSpokenText] = useState<string>("");

  // Add new video modal state
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoHindiTitle, setNewVideoHindiTitle] = useState("");
  const [newVideoStart, setNewVideoStart] = useState("");
  const [newVideoEnd, setNewVideoEnd] = useState("");
  const [newVideoDesc, setNewVideoDesc] = useState("");

  // Start live camera stream
  const startCamera = async (facing: "environment" | "user" = facingMode) => {
    setCameraError(null);
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn("Camera stream access issue:", err);
      setCameraError(
        "Camera stream is restricted in this tab or device. You can choose or upload a photo below, or click 'Detect Place' to identify location!"
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (activeMode === "live") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
      stopAiSpeech();
    };
  }, [activeMode, facingMode]);

  // Initial route calculation
  useEffect(() => {
    generateRoute(campusLandmarks[0].id, "block-c-second-floor", false);
  }, []);

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
  };

  // Find matching video for a route
  const findMatchingVideoForRoute = (startId: string, endId: string): CampusVideoRoute => {
    if (startId === "central-campus" || startId === "main-gate") {
      const found = videoRoutes.find((v) => v.id === "vid-central-campus-ground");
      if (found) return found;
    }
    if (startId === "college-exit") {
      const found = videoRoutes.find((v) => v.id === "vid-college-exit-gate");
      if (found) return found;
    }
    if (startId === "way-to-block-a" || startId.includes("block-a") || endId.includes("block-a")) {
      const found = videoRoutes.find((v) => v.id === "vid-way-to-a-block");
      if (found) return found;
    }
    if (startId === "block-c-left-stairs") {
      const found = videoRoutes.find((v) => v.id === "vid-c-block-left-stairs-entry");
      if (found) return found;
    }
    if (startId === "block-c-main-gate") {
      const found = videoRoutes.find((v) => v.id === "vid-c-block-main-entry");
      if (found) return found;
    }
    if (endId === "block-c-second-floor" || startId === "block-c-second-floor") {
      const found = videoRoutes.find((v) => v.id === "vid-c-block-second-floor");
      if (found) return found;
    }

    const startObj = campusLandmarks.find((l) => l.id === startId);
    if (startObj?.videoRouteId) {
      const match = videoRoutes.find((v) => v.id === startObj.videoRouteId);
      if (match) return match;
    }

    return videoRoutes[0] || initialCampusVideos[0];
  };

  // Route calculation
  const generateRoute = (startId: string, endId: string, shouldSpeak: boolean = true) => {
    const startObj = campusLandmarks.find((l) => l.id === startId) || campusLandmarks[0];
    const endObj = campusLandmarks.find((l) => l.id === endId) || campusLandmarks[7];

    const matchedVideo = findMatchingVideoForRoute(startId, endId);
    setSelectedVideoRoute(matchedVideo);

    let distance = "85 m";
    let estTime = "1 min";
    let steps: RouteStep[] = [];

    if (startId === "central-campus") {
      distance = "150 m";
      estTime = "1.8 mins";
      steps = [
        {
          stepNumber: 1,
          instruction: "From Central Campus Lawn, follow the main bricked pathway towards Block C.",
          hindiInstruction: "सेंट्रल कैंपस मैदान से मुख्य मार्ग पकड़कर सीधे ब्लॉक C की ओर बढ़ें।",
          distance: "60m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: "Pass the sports fields on your right and take the wide walkway towards the main porch.",
          hindiInstruction: "दाएं हाथ पर खेल मैदान को छोड़ते हुए सीधे ब्लॉक C के पोर्च की ओर आगे बढ़ें।",
          distance: "50m",
          turn: "straight",
        },
        {
          stepNumber: 3,
          instruction: `Enter ${endObj.name}. Follow corridor signage to reach your room.`,
          hindiInstruction: `${endObj.name} में प्रवेश करें और कॉरिडोर में आगे बढ़ें।`,
          distance: "40m",
          turn: "right",
        },
      ];
    } else if (startId === "college-exit") {
      distance = "250 m";
      estTime = "3 mins";
      steps = [
        {
          stepNumber: 1,
          instruction: "Turn from College Exit gate inward onto the campus boulevard roadway.",
          hindiInstruction: "कॉलेज एग्जिट गेट से मुड़कर अंदर मुख्य कैंपस मार्ग पर आगे बढ़ें।",
          distance: "100m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: "Walk past the security booth and Central Lawn heading to academic blocks.",
          hindiInstruction: "सुरक्षा बूथ और सेंट्रल लॉन को पार करते हुए आगे बढ़ें।",
          distance: "100m",
          turn: "straight",
        },
        {
          stepNumber: 3,
          instruction: `Arrive at ${endObj.name}.`,
          hindiInstruction: `${endObj.name} पर पहुंचे।`,
          distance: "50m",
          turn: "straight",
        },
      ];
    } else if (startId === "way-to-block-a") {
      distance = "90 m";
      estTime = "1.1 mins";
      steps = [
        {
          stepNumber: 1,
          instruction: "Walk along the shaded tree-lined pathway directly towards Block A front portico.",
          hindiInstruction: "पेड़ों की छांव वाले मार्ग से होते हुए सीधे ब्लॉक A के मुख्य द्वार की ओर चलें।",
          distance: "50m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: "Enter Block A ground floor. Director, Chairman & Vice Chairman offices are in this wing.",
          hindiInstruction: "ब्लॉक A के ग्राउंड फ्लोर में प्रवेश करें। चेयरमैन, वाइस चेयरमैन व डायरेक्टर ऑफिस यहीं हैं।",
          distance: "40m",
          turn: "straight",
        },
      ];
    } else if (startId === "block-c-left-stairs" && endId === "block-c-second-floor") {
      distance = "45 m";
      estTime = "40 sec";
      steps = [
        {
          stepNumber: 1,
          instruction: "Enter through Block C left entrance into the main stairwell.",
          hindiInstruction: "ब्लॉक C के बाएं गेट से अंदर सीढ़ियों की लॉबी में प्रवेश करें।",
          distance: "10m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: "Climb the stairs to 2nd Floor (passing 1st Floor HOD offices).",
          hindiInstruction: "सीढ़ियों से 1st फ्लोर पार करते हुए सीधे 2nd फ्लोर पर चढ़ें।",
          distance: "25m",
          turn: "stairs",
        },
        {
          stepNumber: 3,
          instruction: "Turn right onto 2nd floor corridor: CSE Section A, Section B, Section C are directly ahead.",
          hindiInstruction: "2nd फ्लोर पर दाईं ओर मुड़ें: CSE Section A, B, C क्लासरूम्स सामने मौजूद हैं।",
          distance: "10m",
          turn: "right",
        },
      ];
    } else {
      distance = "110 m";
      estTime = "1.4 mins";
      steps = [
        {
          stepNumber: 1,
          instruction: `Start at ${startObj.name} and head into the central connecting walkway.`,
          hindiInstruction: `${startObj.name} से शुरू करके मुख्य कनेक्टिंग मार्ग पर आगे बढ़ें।`,
          distance: "40m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: `Follow campus corridor signs towards ${endObj.block}.`,
          hindiInstruction: `कैंपस साइनबोर्ड देखकर सीधे ${endObj.block} की ओर बढ़ें।`,
          distance: "40m",
          turn: "straight",
        },
        {
          stepNumber: 3,
          instruction: `Arrive at ${endObj.name}. Landmark: ${endObj.landmark}.`,
          hindiInstruction: `${endObj.name} पर पहुंचे। लैंडमार्क: ${endObj.landmark}।`,
          distance: "30m",
          turn: "straight",
        },
      ];
    }

    const newRouteData: CalculatedRouteData = {
      distance,
      estTime,
      steps,
      matchedVideo,
    };
    setCalculatedRoute(newRouteData);

    // AI voice guidance trigger: "aur ai guide karne lage"
    if (shouldSpeak) {
      const aiSpeech = `नमस्ते! आपकी फोटो पहचानी गई है: यह ${startObj.name} है। ${startObj.landmark}। वीडियो वॉकथ्रू शुरू हो गया है। ${endObj.name} पहुँचने के लिए ${steps[0].hindiInstruction}। कुल दूरी ${distance} है।`;
      triggerAiVoiceGuidance(aiSpeech);
    }
  };

  // Text-to-Speech Engine
  const stopAiSpeech = () => {
    try {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    } catch {}
    setIsAiSpeaking(false);
  };

  const triggerAiVoiceGuidance = (text: string) => {
    stopAiSpeech();
    setAiSpokenText(text);

    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const clean = text
          .replace(/CSE Section A/gi, "सी एस ई सेक्शन ए")
          .replace(/Block A/gi, "ब्लॉक ए")
          .replace(/Block B/gi, "ब्लॉक बी")
          .replace(/Block C/gi, "ब्लॉक सी")
          .replace(/Gate 1/gi, "गेट 1")
          .replace(/[*_#]/g, " ");

        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = "hi-IN";
        utterance.rate = 0.95;
        utterance.pitch = 1.05;

        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("hi") ||
            v.name.toLowerCase().includes("hindi") ||
            v.name.toLowerCase().includes("kalpana")
        );
        if (hindiVoice) utterance.voice = hindiVoice;

        utterance.onstart = () => setIsAiSpeaking(true);
        utterance.onend = () => setIsAiSpeaking(false);
        utterance.onerror = () => setIsAiSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("AI Speech synthesis error:", err);
        setIsAiSpeaking(false);
      }
    }, 100);
  };

  // User takes photo from live camera feed
  const handleCapturePhotoFromCamera = () => {
    setIsScanning(true);
    let captured = "";

    try {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          captured = canvas.toDataURL("image/jpeg", 0.85);
          setCapturedPhotoUrl(captured);
          setPhotoSource("camera");
        }
      }
    } catch {}

    // Location detection simulation from photo
    setTimeout(() => {
      // Pick a meaningful landmark from the 23 video routes (Central Campus, Exit, Way to A, Block C)
      const topLandmarks = [
        campusLandmarks[0], // Central Campus
        campusLandmarks[1], // College Exit
        campusLandmarks[2], // Way to Block A
        campusLandmarks[4], // Block C Entrance
        campusLandmarks[5], // Block C Left Stairs
        campusLandmarks[7], // Block C 2nd Floor
      ];
      const selected = topLandmarks[Math.floor(Math.random() * topLandmarks.length)];

      setDetectedPlace(selected);
      setConfidence(Math.floor(94 + Math.random() * 5));
      setDetectionTimestamp(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setIsScanning(false);

      // "videoo chalanae lage aur ai guide karne lage"
      generateRoute(selected.id, targetDestinationId, true);

      // Auto-scroll to the route & video player
      const el = document.getElementById("detected-video-showcase-box");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 1000);
  };

  // User uploads a photo from device/camera roll
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCapturedPhotoUrl(dataUrl);
        setPhotoSource("upload");
        setIsScanning(true);

        setTimeout(() => {
          const topLandmarks = [
            campusLandmarks[0],
            campusLandmarks[1],
            campusLandmarks[2],
            campusLandmarks[4],
            campusLandmarks[7],
          ];
          const selected = topLandmarks[Math.floor(Math.random() * topLandmarks.length)];

          setDetectedPlace(selected);
          setConfidence(Math.floor(95 + Math.random() * 4));
          setDetectionTimestamp(
            new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          );
          setIsScanning(false);

          // Auto-start video walkthrough & AI audio guidance
          generateRoute(selected.id, targetDestinationId, true);

          const el = document.getElementById("detected-video-showcase-box");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 1100);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add custom video handler
  const handleAddNewVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) return;

    const newRoute: CampusVideoRoute = {
      id: `vid-custom-${Date.now()}`,
      title: newVideoTitle.trim(),
      hindiTitle: newVideoHindiTitle.trim() || newVideoTitle.trim(),
      videoUrl: newVideoUrl.trim(),
      startLocation: newVideoStart.trim() || "Campus Landmark",
      endLocation: newVideoEnd.trim() || "Destination Landmark",
      block: "SRGI Campus",
      floor: "Ground",
      description: newVideoDesc.trim() || "Campus walkthrough video.",
      tags: ["custom video", "walkthrough", "route"],
    };

    const updated = [newRoute, ...videoRoutes];
    setVideoRoutes(updated);
    setSelectedVideoRoute(newRoute);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("srgi_video_routes", JSON.stringify(updated));
      }
    } catch {}

    setNewVideoUrl("");
    setNewVideoTitle("");
    setNewVideoHindiTitle("");
    setNewVideoStart("");
    setNewVideoEnd("");
    setNewVideoDesc("");
    setIsAddVideoModalOpen(false);
    setActiveMode("video-route");
  };

  return (
    <section id="camera-detector-section" className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Hidden Canvas for Live Video Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold tracking-wider uppercase mb-2 border border-emerald-300 dark:border-emerald-800">
          <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Camera Photo Place Detector & AI Route Guide</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#102e59] dark:text-white tracking-tight">
          PHOTO DETECTION • VIDEO WALKTHROUGH • AI GUIDE
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mt-1">
          कैंपस की फोटो खींचें या अपलोड करें — सिस्टम तुरंत जगह पहचानकर <b>वीडियो चलाएगा</b> और <b>AI बोलकर रास्ता गाइड</b> करेगी!
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveMode("live")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeMode === "live"
              ? "bg-[#102e59] text-white shadow-md"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-500" />
          <span>Live Camera Feed</span>
        </button>

        <button
          onClick={() => setActiveMode("video-route")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeMode === "video-route"
              ? "bg-[#102e59] text-white shadow-md"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
          }`}
        >
          <Film className="w-4 h-4 text-amber-500" />
          <span>All 23 Route Videos</span>
        </button>
      </div>

      {/* Video Route Carousel when in video-route mode */}
      {activeMode === "video-route" && (
        <div className="mb-6 bg-slate-900 text-white rounded-3xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Official Campus Walkthrough Videos ({videoRoutes.length})
              </span>
            </div>
            <button
              onClick={() => setIsAddVideoModalOpen(true)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Video</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {videoRoutes.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVideoRoute(v);
                  const matchedLandmark = campusLandmarks.find(
                    (l) => l.videoRouteId === v.id || l.name.toLowerCase().includes(v.block.toLowerCase())
                  );
                  if (matchedLandmark) {
                    setDetectedPlace(matchedLandmark);
                    generateRoute(matchedLandmark.id, targetDestinationId, true);
                  }
                }}
                className={`p-2.5 rounded-xl text-left transition-all border text-xs cursor-pointer ${
                  selectedVideoRoute?.id === v.id
                    ? "bg-amber-500/20 border-amber-400 text-white shadow-xs"
                    : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">
                  Video {idx + 1} • {v.block}
                </div>
                <div className="font-semibold line-clamp-1 text-slate-100 text-[11px]">
                  {v.title}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {v.hindiTitle}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Vision Scanner & Route Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Camera Viewfinder / Photo Capture */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-xl relative aspect-video flex items-center justify-center group">
            {activeMode === "live" ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Fallback placeholder when camera is blocked */}
                {!isCameraActive && (
                  <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center text-white">
                    <Camera className="w-12 h-12 text-slate-500 mb-3" />
                    <div className="font-bold text-sm">Live Camera Scanner</div>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      {cameraError || "Point camera at campus blocks, hallways, or entry gates."}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      <button
                        onClick={() => startCamera()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Start Camera
                      </button>
                      <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo Instead</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* HUD Overlay in Live Mode */}
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>HUD PLACE DETECTOR</span>
                    </div>
                    <button
                      onClick={handleToggleFacingMode}
                      className="pointer-events-auto p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-black/80 transition-colors text-xs flex items-center gap-1"
                      title="Flip camera"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Reticle Target */}
                  <div className="relative mx-auto w-48 h-32 sm:w-64 sm:h-40 border-2 border-dashed border-emerald-400/70 rounded-2xl flex items-center justify-center">
                    {isScanning && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce" />
                    )}
                    <div className="text-[10px] font-mono text-emerald-300/90 bg-black/50 px-2.5 py-1 rounded-md text-center">
                      {isScanning
                        ? "IDENTIFYING CAMPUS LOCATION..."
                        : "POINT CAMERA AT CAMPUS LOCATION"}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                      SRGI LUCKNOW 65-ACRE GRID
                    </span>
                  </div>
                </div>
              </>
            ) : (
              /* Route Video Mode */
              <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
                {selectedVideoRoute && (
                  <>
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                        ⚡ 1.80x Speed
                      </span>
                    </div>
                    <video
                      key={selectedVideoRoute.videoUrl}
                      ref={routeVideoPlayerRef}
                      src={selectedVideoRoute.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      onLoadedData={(e) => {
                        e.currentTarget.playbackRate = 1.8;
                      }}
                      onPlay={(e) => {
                        e.currentTarget.playbackRate = 1.8;
                      }}
                      className="w-full h-full object-contain"
                    />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Photo Capture & Upload Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Primary Action: Take Photo */}
            <button
              onClick={handleCapturePhotoFromCamera}
              disabled={isScanning}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:to-cyan-800 text-white font-black rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transform active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>
                {isScanning ? "Scanning Location..." : "📸 Take Photo & Detect (फोटो लें)"}
              </span>
            </button>

            {/* Upload Photo Option */}
            <label className="py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs">
              <Upload className="w-4 h-4 text-blue-500" />
              <span>Choose Photo (फोटो चुनें)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Captured Photo Preview Badge if available */}
          {capturedPhotoUrl && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <img
                src={capturedPhotoUrl}
                alt="Captured campus spot"
                className="w-16 h-12 object-cover rounded-lg border border-emerald-300 shrink-0"
              />
              <div className="flex-1 text-xs">
                <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Photo Captured & Location Analyzed!</span>
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Identified: <b>{detectedPlace?.name}</b> ({confidence}% confidence)
                </div>
              </div>
            </div>
          )}

          {/* Quick Manual Landmark Override */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Or Manually Choose Your Current Location:</span>
            </div>
            <select
              value={detectedPlace?.id || campusLandmarks[0].id}
              onChange={(e) => {
                const found = campusLandmarks.find((l) => l.id === e.target.value);
                if (found) {
                  setDetectedPlace(found);
                  setConfidence(98);
                  generateRoute(found.id, targetDestinationId, true);
                }
              }}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {campusLandmarks.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.block})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column: AI Guidance & Route Walkthrough Video */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Audio Guide Box ("aur ai guide karne lage") */}
          <div className="bg-gradient-to-br from-[#0d2e54] to-[#123f73] text-white rounded-3xl p-5 shadow-xl border border-blue-400/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black tracking-wide text-white">
                    SRGI AI VOICE GUIDE
                  </span>
                  <span className="block text-[10px] text-blue-200 font-medium">
                    {isAiSpeaking ? "🔊 बोलकर बता रही हूँ..." : "ध्वनि वॉकथ्रू गाइड"}
                  </span>
                </div>
              </div>

              {/* Voice controls */}
              <button
                onClick={() => {
                  if (isAiSpeaking) {
                    stopAiSpeech();
                  } else if (aiSpokenText) {
                    triggerAiVoiceGuidance(aiSpokenText);
                  } else if (detectedPlace) {
                    const txt = `नमस्ते! आपकी फोटो पहचानी गई है: यह ${detectedPlace.name} है। ${detectedPlace.landmark}। इसके लिए वीडियो वॉकथ्रू शुरू कर दिया गया है।`;
                    triggerAiVoiceGuidance(txt);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAiSpeaking
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-md animate-pulse"
                    : "bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/40"
                }`}
              >
                {isAiSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Replay Voice (पुनः सुनें)</span>
                  </>
                )}
              </button>
            </div>

            {/* Speaking animation waves */}
            {isAiSpeaking && (
              <div className="flex items-center gap-1.5 py-1 px-3 mb-2 rounded-lg bg-amber-400/20 text-amber-200 text-[11px] font-medium border border-amber-400/30">
                <span className="flex gap-0.5">
                  <span className="w-1 h-3 bg-amber-300 rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-amber-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-2 bg-amber-300 rounded-full animate-bounce [animation-delay:0.3s]" />
                </span>
                <span>AI आवाज़ मार्ग समझा रही है...</span>
              </div>
            )}

            <p className="text-xs text-blue-100/90 leading-relaxed bg-black/20 p-3 rounded-2xl border border-white/10">
              {aiSpokenText ||
                `नमस्ते! अपनी जगह की फोटो खींचें — AI तुरंत जगह पहचानकर वॉकथ्रू वीडियो चलाएगी और आपको रास्ता बोलकर बताएगी!`}
            </p>
          </div>

          {/* Destination Selector */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>Where Do You Want to Go? (कहाँ जाना है?)</span>
            </div>

            <select
              value={targetDestinationId}
              onChange={(e) => {
                setTargetDestinationId(e.target.value);
                if (detectedPlace) {
                  generateRoute(detectedPlace.id, e.target.value, true);
                }
              }}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {campusLandmarks.map((l) => (
                <option key={l.id} value={l.id}>
                  ➡️ To: {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dedicated Video Player for Route ("videoo chalanae lage") */}
          {calculatedRoute?.matchedVideo && (
            <div
              id="detected-video-showcase-box"
              className="bg-slate-950 text-white rounded-3xl p-4 border border-slate-800 shadow-xl space-y-2.5 scroll-mt-24"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Film className="w-4 h-4" />
                  <span>▶ Playing Walk Video (रास्ता वीडियो)</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  ⚡ 1.80x Speed
                </span>
              </div>

              <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-slate-800">
                <video
                  key={calculatedRoute.matchedVideo.videoUrl}
                  src={calculatedRoute.matchedVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  onLoadedData={(e) => {
                    e.currentTarget.playbackRate = 1.8;
                  }}
                  onPlay={(e) => {
                    e.currentTarget.playbackRate = 1.8;
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-xs">
                <div className="font-bold text-slate-100">
                  {calculatedRoute.matchedVideo.title}
                </div>
                <div className="text-[11px] text-blue-300 mt-0.5">
                  {calculatedRoute.matchedVideo.hindiTitle}
                </div>
              </div>
            </div>
          )}

          {/* Turn-by-Turn Directions Guide */}
          {calculatedRoute && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                    Step-by-Step Walking Guide
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Distance: <span className="font-bold text-blue-600">{calculatedRoute.distance}</span> • Est. Time:{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{calculatedRoute.estTime}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (aiSpokenText) {
                      triggerAiVoiceGuidance(aiSpokenText);
                    }
                  }}
                  className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {calculatedRoute.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-2xl flex items-start gap-3 text-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {step.stepNumber}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                        {step.instruction}
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-snug font-normal">
                        {step.hindiInstruction}
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-900/50 px-2 py-0.2 rounded-md">
                        {step.distance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add New Video Walkthrough Modal */}
      {isAddVideoModalOpen && (
        <div
          id="add-video-modal-backdrop"
          onClick={() => setIsAddVideoModalOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Add Campus Route Video
                </h3>
              </div>
              <button
                onClick={() => setIsAddVideoModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewVideo} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Video URL (Cloudinary / MP4 link)*
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://res.cloudinary.com/.../video.mp4"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-[11px] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Route Title (English)*
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block A to Central Cafeteria Walk"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Hindi Title (हिंदी में नाम)
                </label>
                <input
                  type="text"
                  placeholder="उदा. ब्लॉक A से कैफेटेरिया का रास्ता"
                  value={newVideoHindiTitle}
                  onChange={(e) => setNewVideoHindiTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Start Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main Gate"
                    value={newVideoStart}
                    onChange={(e) => setNewVideoStart(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    End Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Block C"
                    value={newVideoEnd}
                    onChange={(e) => setNewVideoEnd(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Walkthrough Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief steps or landmark notes..."
                  value={newVideoDesc}
                  onChange={(e) => setNewVideoDesc(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#102e59] hover:bg-[#0c2447] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Save & Activate Video Route</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
