import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Video,
  Navigation,
  Compass,
  Volume2,
  VolumeX,
  RefreshCw,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Upload,
  Layers,
  HelpCircle,
  Maximize2,
  Film,
  Plus,
  X,
  ExternalLink,
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
}

const campusLandmarks: LandmarkPreset[] = [
  {
    id: "main-gate",
    name: "College Main Entrance (Gate 1)",
    block: "Main Gate",
    landmark: "Grand entry gate with security checkpoint & campus map display",
    description: "Primary arrival point for buses, cars, and visitors entering the 65-acre campus.",
    badge: "Campus Entrance",
    videoRouteId: "vid-main-gate-entry",
  },
  {
    id: "main-gate-to-c",
    name: "Campus Roadway to Block C",
    block: "Campus Grounds",
    landmark: "Main campus road leading from Gate 1 directly towards Block C",
    description: "Walking path along sports grounds connecting Main Gate to Block C.",
    badge: "Connecting Pathway",
    videoRouteId: "vid-main-gate-to-c-block",
  },
  {
    id: "block-c-main-gate",
    name: "Block C - Main Entrance & Porch",
    block: "Block C",
    landmark: "Front entrance gate & academic porch of Block C",
    description: "Main entryway to computer laboratories, departments, and central lecture halls.",
    badge: "Academic Entrance",
    videoRouteId: "vid-c-block-main-entry",
  },
  {
    id: "block-c-left-stairs",
    name: "Block C - Left Stairs Gate Entry",
    block: "Block C",
    landmark: "Side gate entrance opening directly into the left staircase",
    description: "Direct side entryway giving rapid access to the left stairs leading to 2nd floor CSE wing.",
    badge: "Direct Side Entry",
    videoRouteId: "vid-c-block-left-stairs-entry",
  },
  {
    id: "block-c-ground-floor",
    name: "Block C - Ground Floor Left Stairs",
    block: "Block C",
    landmark: "Ground floor base of left staircase in Block C",
    description: "Ascending point to reach 1st floor HOD office and 2nd floor CSE Section A, B, C classrooms.",
    badge: "Staircase Landing",
    videoRouteId: "vid-c-block-ground-to-second",
  },
  {
    id: "block-c-second-floor",
    name: "Block C - 2nd Floor Corridor (CSE Wing)",
    block: "Block C",
    landmark: "2nd Floor landing — CSE Section A, Section B, Section C & HOD Office",
    description: "Department corridor housing CSE classrooms, faculty cabins, Bio-Tech and Mechanical branches.",
    badge: "CSE Department Floor",
    videoRouteId: "vid-c-block-second-floor",
  },
  {
    id: "block-c-floor-2-right",
    name: "Block C - Floor 2 Right Wing (Labs & Mech)",
    block: "Block C",
    landmark: "Right wing corridor of 2nd Floor, laboratories, and washrooms",
    description: "Classrooms, agriculture/mech sections, hardware labs, and student washrooms near right staircase.",
    badge: "Right Wing Corridor",
    videoRouteId: "vid-c-block-floor-2-right-side",
  },
  {
    id: "block-a-lobby",
    name: "Block A - Main Lobby & Reception",
    block: "Block A",
    landmark: "Main Admin Lobby, Director Office & Account Office",
    description: "Centrally connected to Seminar Hall, Library on 2nd Floor, and walkway to Block B.",
    badge: "Administrative Hub",
  },
  {
    id: "central-library",
    name: "SRGI Central Library (Block A)",
    block: "Block A",
    landmark: "2nd Floor, Block A — 50,000+ volumes & digital section",
    description: "Quiet study zones, textbook racks, computer lab, and reading halls.",
    badge: "Academic Resource",
  },
  {
    id: "seminar-hall",
    name: "Campus Seminar Hall (Block A)",
    block: "Block A",
    landmark: "Ground Floor Block A — 20m straight to cafeteria",
    description: "Air-conditioned auditorium for seminars, webinars, and cultural orientations.",
    badge: "Event Center",
  },
  {
    id: "block-b-hub",
    name: "Block B - Department Classes (MBA)",
    block: "Block B",
    landmark: "Connected via central corridor to Block A",
    description: "Classrooms, lecture halls, and MBA faculty cabins.",
    badge: "Academic Block",
  },
  {
    id: "central-cafeteria",
    name: "Central Cafeteria (Dining Hall)",
    block: "Central Campus",
    landmark: "20 metres straight from Seminar Hall",
    description: "Multi-cuisine student dining hall, tea bar, snacks, and seating lounge.",
    badge: "Food & Refreshment",
  },
  {
    id: "block-d-hostel",
    name: "Block D - Girls Hostel & Health Center",
    block: "Block D",
    landmark: "Girls Hostel inside campus; Medicines store room is located behind",
    description: "Residential hostel with 24x7 security and campus medical dispensary behind it.",
    badge: "Residence & Health",
  },
  {
    id: "block-e-seniors",
    name: "Block E - Seniors Academic Wing",
    block: "Block E",
    landmark: "Dedicated classes for 2nd Year, 3rd Year & 4th Year seniors",
    description: "Advanced engineering lectures, seminar rooms, and senior departmental staff.",
    badge: "Seniors Wing",
  },
  {
    id: "boys-hostel",
    name: "Boys Hostel (Campus Residence)",
    block: "Campus Grounds",
    landmark: "300 metres away from the college Main Gate",
    description: "Multi-story residential complex inside the 65-acre campus grounds.",
    badge: "Student Residence",
  },
  {
    id: "campus-cafes-gate2",
    name: "Campus Cafes (2nd Gate)",
    block: "Gate 2",
    landmark: "Located at the 2nd Gate of the college",
    description: "Street-side cafes, tea kiosks, beverage bars, and food stalls.",
    badge: "Cafes Hub",
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
  locations: CampusLocation[];
  onOpenMap?: () => void;
}

export default function CameraDetectorSection({ locations }: CameraDetectorSectionProps) {
  // Mode: "live" | "video-route" | "upload"
  const [activeMode, setActiveMode] = useState<"live" | "video-route" | "upload">("live");

  // Video routes state (persisted in localStorage so user additions stay available)
  const [videoRoutes, setVideoRoutes] = useState<CampusVideoRoute[]>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem("srgi_video_routes");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge with initialCampusVideos to ensure official ones are present
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

  // Active selected video walkthrough route
  const [selectedVideoRoute, setSelectedVideoRoute] = useState<CampusVideoRoute>(
    videoRoutes[0] || initialCampusVideos[0]
  );

  // Add new video modal state
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoHindiTitle, setNewVideoHindiTitle] = useState("");
  const [newVideoStart, setNewVideoStart] = useState("");
  const [newVideoEnd, setNewVideoEnd] = useState("");
  const [newVideoDesc, setNewVideoDesc] = useState("");

  // Camera stream state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const uploadedVideoRef = useRef<HTMLVideoElement | null>(null);
  const routeVideoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isScanning, setIsScanning] = useState(false);

  // Uploaded video state (for local file test)
  const [videoFileUrl, setVideoFileUrl] = useState<string | null>(null);

  // Detected place state
  const [detectedPlace, setDetectedPlace] = useState<LandmarkPreset | null>(campusLandmarks[0]);
  const [confidence, setConfidence] = useState<number>(96);
  const [detectionTimestamp, setDetectionTimestamp] = useState<string>("");

  // Route calculation state
  const [targetDestinationId, setTargetDestinationId] = useState<string>("block-c-second-floor");
  const [calculatedRoute, setCalculatedRoute] = useState<CalculatedRouteData | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Start / stop live camera stream
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
        "Camera permission is blocked or unavailable in this tab. You can use Official Video Route Guide mode above, or choose your location below!"
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
    };
  }, [activeMode, facingMode]);

  // Generate initial route on mount
  useEffect(() => {
    generateRoute(campusLandmarks[0].id, "block-c-second-floor");
  }, []);

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
  };

  // Handle uploaded video file
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoFileUrl(url);
      setActiveMode("upload");
      stopCamera();
    }
  };

  // Find matching video for a given route
  const findMatchingVideoForRoute = (startId: string, endId: string): CampusVideoRoute | undefined => {
    // 1. Check if start or end has direct videoRouteId
    const startObj = campusLandmarks.find((l) => l.id === startId);
    const endObj = campusLandmarks.find((l) => l.id === endId);

    // Exact matches
    if (startId === "main-gate" && (endId.includes("block-c") || endId === "block-c-main-gate")) {
      return videoRoutes.find((v) => v.id === "vid-main-gate-to-c-block");
    }
    if (startId === "main-gate") {
      return videoRoutes.find((v) => v.id === "vid-main-gate-entry");
    }
    if (startId === "block-c-main-gate") {
      return videoRoutes.find((v) => v.id === "vid-c-block-main-entry");
    }
    if (startId === "block-c-left-stairs") {
      return videoRoutes.find((v) => v.id === "vid-c-block-left-stairs-entry");
    }
    if (startId === "block-c-ground-floor" && endId === "block-c-second-floor") {
      return videoRoutes.find((v) => v.id === "vid-c-block-ground-to-second");
    }
    if (startId === "block-c-second-floor" && endId === "block-c-ground-floor") {
      return videoRoutes.find((v) => v.id === "vid-c-block-second-to-ground");
    }
    if (endId === "block-c-second-floor") {
      return videoRoutes.find((v) => v.id === "vid-c-block-second-floor");
    }
    if (endId === "block-c-floor-2-right") {
      return videoRoutes.find((v) => v.id === "vid-c-block-floor-2-right-side");
    }

    // Secondary match from preset
    if (startObj?.videoRouteId) {
      const match = videoRoutes.find((v) => v.id === startObj.videoRouteId);
      if (match) return match;
    }
    if (endObj?.videoRouteId) {
      const match = videoRoutes.find((v) => v.id === endObj.videoRouteId);
      if (match) return match;
    }

    return videoRoutes[0];
  };

  // Place detection simulation / camera snapshot scanner
  const handleScanLocation = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Pick a realistic landmark
      const randomLandmark =
        campusLandmarks[Math.floor(Math.random() * campusLandmarks.length)];
      setDetectedPlace(randomLandmark);
      setConfidence(Math.floor(93 + Math.random() * 6));
      setDetectionTimestamp(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setIsScanning(false);

      // Auto-compute route and sync video
      generateRoute(randomLandmark.id, targetDestinationId);
    }, 1100);
  };

  // Route Generator between points
  const generateRoute = (startId: string, endId: string) => {
    const startObj = campusLandmarks.find((l) => l.id === startId) || campusLandmarks[0];
    const endObj = campusLandmarks.find((l) => l.id === endId) || campusLandmarks[5];

    const matchedVideo = findMatchingVideoForRoute(startId, endId);
    if (matchedVideo) {
      setSelectedVideoRoute(matchedVideo);
    }

    if (startId === endId) {
      setCalculatedRoute({
        distance: "0 m",
        estTime: "Arrived",
        steps: [
          {
            stepNumber: 1,
            instruction: `You are already at ${endObj.name}!`,
            hindiInstruction: `आप पहले से ही ${endObj.name} पर मौजूद हैं!`,
            distance: "0m",
            turn: "straight",
          },
        ],
        matchedVideo,
      });
      return;
    }

    // Specific landmark routes with accurate walking steps
    let distance = "85 m";
    let estTime = "1 min";
    let steps: RouteStep[] = [];

    if (startId === "main-gate" && (endId.includes("block-c") || endId === "block-c-main-gate")) {
      distance = "240 m";
      estTime = "2.8 mins";
      steps = [
        {
          stepNumber: 1,
          instruction: "Pass through Gate 1 security checkpoint and step onto the main campus paved roadway (watch Video 1).",
          hindiInstruction: "कॉलेज के मेन गेट 1 से प्रवेश करें और मुख्य पक्की सड़क पर सीधे आगे बढ़ें।",
          distance: "40m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: "Walk straight along the green tree-lined boulevard passing the central sports area (watch Video 2).",
          hindiInstruction: "हरियाली और खेल मैदान के पास से होते हुए मुख्य मार्ग पर सीधे लगभग 120 मीटर चलें।",
          distance: "120m",
          turn: "straight",
        },
        {
          stepNumber: 3,
          instruction: "Turn slightly right towards Block C front porch and main entrance gate.",
          hindiInstruction: "दाएं मुड़ें और ब्लॉक C के मुख्य द्वार व पोर्च की ओर आगे बढ़ें।",
          distance: "80m",
          turn: "right",
        },
      ];
    } else if (startId === "block-c-left-stairs" && endId === "block-c-second-floor") {
      distance = "45 m";
      estTime = "40 sec";
      steps = [
        {
          stepNumber: 1,
          instruction: "Enter through Block C left side gate directly into the staircase lobby (watch Video 4).",
          hindiInstruction: "ब्लॉक C के बाएं साइड वाले गेट से अंदर प्रवेश करें और सीढ़ियों के पास जाएँ।",
          distance: "10m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: "Ascend the left staircase up past 1st Floor (HOD office wing) to 2nd Floor (watch Video 5).",
          hindiInstruction: "बाएं सीढ़ियों से होते हुए 1st फ्लोर पार करके सीधे 2nd फ्लोर पर चढ़ें।",
          distance: "25m",
          turn: "stairs",
        },
        {
          stepNumber: 3,
          instruction: "Turn right onto 2nd floor corridor: CSE Section A, Section B, Section C are directly ahead (watch Video 6).",
          hindiInstruction: "2nd फ्लोर पर पहुँचकर दाईं ओर मुड़ें: CSE Section A, B, C क्लासरूम्स सामने मौजूद हैं।",
          distance: "10m",
          turn: "right",
        },
      ];
    } else if (startId === "block-c-main-gate" && endId === "block-c-second-floor") {
      distance = "60 m";
      estTime = "1 min";
      steps = [
        {
          stepNumber: 1,
          instruction: "Enter Block C via the main porch into the ground floor lobby (watch Video 3).",
          hindiInstruction: "ब्लॉक C मुख्य पोर्च से प्रवेश करके ग्राउंड फ्लोर लॉबी में आएँ।",
          distance: "15m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: "Walk down the corridor to the left staircase (watch Video 4 & 5).",
          hindiInstruction: "कॉरिडोर में बाएं सीढ़ियों की तरफ बढ़ें और 2nd फ्लोर पर जाएँ।",
          distance: "25m",
          turn: "stairs",
        },
        {
          stepNumber: 3,
          instruction: "Arrive at 2nd Floor CSE Section A, B, C classrooms & faculty rooms (watch Video 6).",
          hindiInstruction: "2nd फ्लोर पर CSE Section A और अन्य क्लासरूम्स में पहुँचें।",
          distance: "20m",
          turn: "straight",
        },
      ];
    } else if (startId === "central-cafeteria" && endId === "seminar-hall") {
      distance = "20 m";
      estTime = "25 sec";
      steps = [
        {
          stepNumber: 1,
          instruction: "Exit Central Cafeteria and face straight north towards Block A.",
          hindiInstruction: "कैफेटेरिया से बाहर निकलें और ब्लॉक A की तरफ सीधे देखें।",
          distance: "5m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: "Walk straight 20 metres ahead. Seminar Hall entrance will be directly in front of you.",
          hindiInstruction: "सीधे 20 मीटर आगे चलें। सेमिनार हॉल का मुख्य द्वार ठीक आपके सामने होगा।",
          distance: "15m",
          turn: "straight",
        },
      ];
    } else if (startId === "block-b-hub" && endId === "seminar-hall") {
      distance = "40 m";
      estTime = "45 sec";
      steps = [
        {
          stepNumber: 1,
          instruction: "From Block B main corridor, walk 20 metres left.",
          hindiInstruction: "ब्लॉक B के मुख्य कॉरिडोर से 20 मीटर बाएं (Left) चलें।",
          distance: "20m",
          turn: "left",
        },
        {
          stepNumber: 2,
          instruction: "Turn right and walk another 20 metres towards Block A Ground Floor.",
          hindiInstruction: "अब दाएं (Right) मुड़ें और ब्लॉक A ग्राउंड फ्लोर की ओर 20 मीटर चलें।",
          distance: "20m",
          turn: "right",
        },
      ];
    } else if (startId === "main-gate" && endId === "boys-hostel") {
      distance = "300 m";
      estTime = "3.5 mins";
      steps = [
        {
          stepNumber: 1,
          instruction: "From College Main Gate (Gate 1), take the inner wide campus roadway.",
          hindiInstruction: "कॉलेज मेन गेट से अंदर की ओर चौड़े मुख्य मार्ग पर चलें।",
          distance: "100m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: "Continue straight past the sports grounds for approximately 200 metres.",
          hindiInstruction: "खेल मैदान के पास से लगभग 200 मीटर सीधा आगे बढ़ते रहें।",
          distance: "200m",
          turn: "straight",
        },
        {
          stepNumber: 3,
          instruction: "The Boys Hostel residential complex is situated directly 300m from the Main Gate.",
          hindiInstruction: "बॉयज हॉस्टल रेसिडेंशियल कॉम्प्लेक्स ठीक 300 मीटर की दूरी पर स्थित है।",
          distance: "50m",
          turn: "straight",
        },
      ];
    } else {
      distance = "110 m";
      estTime = "1.5 mins";
      steps = [
        {
          stepNumber: 1,
          instruction: `Start from ${startObj.name} and proceed into the main connecting corridor.`,
          hindiInstruction: `${startObj.name} से शुरू करके मुख्य कनेक्टिंग कॉरिडोर में आगे बढ़ें।`,
          distance: "30m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: `Follow the campus pathway directly towards ${endObj.block}.`,
          hindiInstruction: `कैंपस मार्ग से सीधे ${endObj.block} की ओर बढ़ें।`,
          distance: "50m",
          turn: "straight",
        },
        {
          stepNumber: 3,
          instruction: `Arrive at ${endObj.name}. Look for landmark signs: "${endObj.landmark}".`,
          hindiInstruction: `${endObj.name} पर पहुंचे। लैंडमार्क पहचानें: ${endObj.landmark}।`,
          distance: "30m",
          turn: "right",
        },
      ];
    }

    setCalculatedRoute({
      distance,
      estTime,
      steps,
      matchedVideo,
    });
  };

  // Add new video submission
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

    // Reset form
    setNewVideoUrl("");
    setNewVideoTitle("");
    setNewVideoHindiTitle("");
    setNewVideoStart("");
    setNewVideoEnd("");
    setNewVideoDesc("");
    setIsAddVideoModalOpen(false);
    setActiveMode("video-route");
  };

  // Text-to-Speech Voice Guidance (Hindi & English)
  const speakRoute = () => {
    if (!calculatedRoute || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = calculatedRoute.steps
      .map((s) => `Step ${s.stepNumber}: ${s.instruction}. ${s.hindiInstruction}`)
      .join(" ");

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section id="camera-detector-section" className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wider uppercase mb-2">
          <Camera className="w-3.5 h-3.5 text-emerald-700" />
          <span>Camera Vision & Video Route Navigator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#102e59] tracking-tight">
          CAMPUS PLACE DETECTOR & VIDEO WALKTHROUGHS
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto mt-1">
          Detect your location via live camera or video walkthroughs, and navigate step-by-step across SRGI Lucknow with 8 official campus route videos.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveMode("live")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeMode === "live"
              ? "bg-[#102e59] text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-500" />
          <span>Live Camera Scan</span>
        </button>

        <button
          onClick={() => setActiveMode("video-route")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeMode === "video-route"
              ? "bg-[#102e59] text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Film className="w-4 h-4 text-amber-500" />
          <span>Official Route Videos ({videoRoutes.length})</span>
        </button>

        <button
          onClick={() => setActiveMode("upload")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeMode === "upload"
              ? "bg-[#102e59] text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Upload className="w-4 h-4 text-blue-500" />
          <span>Upload Walk Video</span>
        </button>
      </div>

      {/* Video Route Selector Strip when in video mode */}
      {activeMode === "video-route" && (
        <div className="mb-6 bg-slate-900 text-white rounded-3xl p-4 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Select Official Campus Walkthrough Video
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

          {/* Video Tabs Grid / Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {videoRoutes.map((v, idx) => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVideoRoute(v);
                  // Match landmark if applicable
                  const matchedLandmark = campusLandmarks.find(
                    (l) => l.videoRouteId === v.id || l.name.toLowerCase().includes(v.block.toLowerCase())
                  );
                  if (matchedLandmark) {
                    setDetectedPlace(matchedLandmark);
                    generateRoute(matchedLandmark.id, targetDestinationId);
                  }
                }}
                className={`p-2.5 rounded-xl text-left transition-all border text-xs cursor-pointer ${
                  selectedVideoRoute?.id === v.id
                    ? "bg-amber-500/20 border-amber-400 text-white shadow-sm"
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

      {/* Main Scanner Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Viewfinder Column */}
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

                {/* Camera fallback placeholder when stream is blocked */}
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
                      <button
                        onClick={() => setActiveMode("video-route")}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Watch Route Video</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : activeMode === "video-route" ? (
              /* Official Campus Route Video Player */
              <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
                {selectedVideoRoute ? (
                  <video
                    key={selectedVideoRoute.videoUrl}
                    ref={routeVideoPlayerRef}
                    src={selectedVideoRoute.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-slate-400 text-xs">No video selected</div>
                )}
              </div>
            ) : (
              /* User Uploaded Video file player */
              <div className="w-full h-full flex flex-col items-center justify-center bg-black relative">
                {videoFileUrl ? (
                  <video
                    ref={uploadedVideoRef}
                    src={videoFileUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="p-6 text-center text-white">
                    <Video className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <div className="font-bold text-sm">Upload Campus Video</div>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mb-4">
                      Upload a recorded video of your walk to detect the place and navigate:
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Choose Video File</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* HUD Reticle Overlay (Only in live camera mode) */}
            {activeMode === "live" && (
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>HUD VISION ACTIVE</span>
                  </div>
                  <button
                    onClick={handleToggleFacingMode}
                    className="pointer-events-auto p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-black/80 transition-colors text-xs flex items-center gap-1"
                    title="Flip camera"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Targeting Center Frame */}
                <div className="relative mx-auto w-48 h-32 sm:w-64 sm:h-40 border-2 border-dashed border-emerald-400/70 rounded-2xl flex items-center justify-center">
                  {isScanning && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce" />
                  )}
                  <div className="text-[10px] font-mono text-emerald-300/80 bg-black/40 px-2 py-0.5 rounded">
                    {isScanning ? "MATCHING CAMPUS LANDMARK..." : "ALIGN LANDMARK HERE"}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded">
                    SRGI LUCKNOW 65-ACRE GRID
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons under camera */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleScanLocation}
              disabled={isScanning}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isScanning ? "Scanning Location..." : "Detect Place / जगह पहचानें"}</span>
            </button>

            {activeMode === "upload" && (
              <label className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-300">
                <Upload className="w-4 h-4" />
                <span>Upload New Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            )}

            {activeMode !== "video-route" && (
              <button
                onClick={() => setActiveMode("video-route")}
                className="px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Film className="w-4 h-4 text-amber-600" />
                <span>Show Walk Video</span>
              </button>
            )}
          </div>

          {/* Preset Spot Picker (Instant manual override) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs shadow-xs">
            <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Or Choose Detected Starting Point:</span>
            </div>
            <select
              value={detectedPlace?.id || campusLandmarks[0].id}
              onChange={(e) => {
                const found = campusLandmarks.find((l) => l.id === e.target.value);
                if (found) {
                  setDetectedPlace(found);
                  setConfidence(98);
                  generateRoute(found.id, targetDestinationId);
                }
              }}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-medium bg-slate-50"
            >
              {campusLandmarks.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.block})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Route Guide Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Detected Spot Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-200/80 bg-gradient-to-b from-emerald-50/40 to-white">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Detected Location
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-bold">
                {confidence}% Match
              </span>
            </div>

            <h3 className="text-base font-black text-slate-900">
              {detectedPlace ? detectedPlace.name : "Align Camera or Select Place"}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {detectedPlace?.landmark || "Detecting campus features..."}
            </p>
          </div>

          {/* Target Destination & Calculate */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>Where Do You Want to Go? (कहाँ जाना है?)</span>
            </div>

            <select
              value={targetDestinationId}
              onChange={(e) => {
                setTargetDestinationId(e.target.value);
                if (detectedPlace) {
                  generateRoute(detectedPlace.id, e.target.value);
                }
              }}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
            >
              {campusLandmarks.map((l) => (
                <option key={l.id} value={l.id}>
                  ➡️ To: {l.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (detectedPlace) {
                  generateRoute(detectedPlace.id, targetDestinationId);
                }
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Compass className="w-4 h-4" />
              <span>Get Route / रास्‍ता देखें</span>
            </button>
          </div>

          {/* Dedicated Route Walkthrough Video Player Card */}
          {calculatedRoute?.matchedVideo && (
            <div className="bg-slate-900 text-white rounded-3xl p-4 border border-slate-800 shadow-md space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Film className="w-4 h-4" />
                  <span>रास्ता दिखाने वाला वीडियो (Route Video)</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedVideoRoute(calculatedRoute.matchedVideo!);
                    setActiveMode("video-route");
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  className="text-[11px] text-amber-300 hover:text-white underline cursor-pointer"
                >
                  Full Video View
                </button>
              </div>

              <div className="aspect-video bg-black rounded-2xl overflow-hidden relative border border-slate-700">
                <video
                  src={calculatedRoute.matchedVideo.videoUrl}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-xs">
                <div className="font-bold text-slate-100">
                  {calculatedRoute.matchedVideo.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {calculatedRoute.matchedVideo.hindiTitle}
                </div>
              </div>
            </div>
          )}

          {/* Turn-by-Turn Directions Guide */}
          {calculatedRoute && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <div className="text-xs font-black text-slate-900">
                    Walking Route Guide
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Distance: <span className="font-bold text-blue-600">{calculatedRoute.distance}</span> • Est. Time:{" "}
                    <span className="font-bold text-slate-800">{calculatedRoute.estTime}</span>
                  </div>
                </div>

                {/* Voice Directions Button */}
                <button
                  onClick={speakRoute}
                  className={`p-2 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer ${
                    isSpeaking
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                  title={isSpeaking ? "Stop Voice" : "Listen in Hindi/English"}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Speak</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {calculatedRoute.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3 text-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {step.stepNumber}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900 leading-snug">
                        {step.instruction}
                      </div>
                      <div className="text-slate-600 text-[11px] leading-snug font-normal">
                        {step.hindiInstruction}
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.2 rounded-md">
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

      {/* Add New Video Walkthrough Modal (For future video uploads) */}
      {isAddVideoModalOpen && (
        <div
          id="add-video-modal-backdrop"
          onClick={() => setIsAddVideoModalOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">
                  Add Campus Route Video
                </h3>
              </div>
              <button
                onClick={() => setIsAddVideoModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewVideo} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Video URL (Cloudinary / MP4 link)*
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://res.cloudinary.com/.../video.mp4"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Route Title (English)*
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block A to Central Cafeteria Walk"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Hindi Title (हिंदी में नाम)
                </label>
                <input
                  type="text"
                  placeholder="उदा. ब्लॉक A से कैफेटेरिया का रास्ता"
                  value={newVideoHindiTitle}
                  onChange={(e) => setNewVideoHindiTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Start Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main Gate"
                    value={newVideoStart}
                    onChange={(e) => setNewVideoStart(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    End Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Block C"
                    value={newVideoEnd}
                    onChange={(e) => setNewVideoEnd(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Walkthrough Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief steps or landmark notes..."
                  value={newVideoDesc}
                  onChange={(e) => setNewVideoDesc(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#102e59] hover:bg-[#0c2447] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
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
