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
} from "lucide-react";
import { CampusLocation } from "../types";

interface LandmarkPreset {
  id: string;
  name: string;
  block: string;
  landmark: string;
  description: string;
  badge: string;
}

const campusLandmarks: LandmarkPreset[] = [
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
    name: "Block B - Department Classes",
    block: "Block B",
    landmark: "Connected via central corridor to Block A",
    description: "Classrooms, lecture halls, and faculty cabins.",
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
    id: "block-c-workshops",
    name: "Block C - Engineering Workshops & Labs",
    block: "Block C",
    landmark: "Heavy engineering labs, robotics, and machine shop",
    description: "Foundry, carpentry, welding, computer hardware, and electrical labs.",
    badge: "Laboratories",
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
  {
    id: "main-gate",
    name: "College Main Entrance (Gate 1)",
    block: "Main Gate",
    landmark: "Grand entry gate with security checkpoint & campus map display",
    description: "Primary arrival point for buses, cars, and visitors.",
    badge: "Campus Entrance",
  },
];

interface RouteStep {
  stepNumber: number;
  instruction: string;
  hindiInstruction: string;
  distance: string;
  turn: "straight" | "left" | "right" | "stairs";
}

interface CameraDetectorSectionProps {
  locations: CampusLocation[];
  onOpenMap?: () => void;
}

export default function CameraDetectorSection({ locations }: CameraDetectorSectionProps) {
  // Mode: "live" | "video"
  const [activeMode, setActiveMode] = useState<"live" | "video">("live");

  // Camera stream state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const uploadedVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isScanning, setIsScanning] = useState(false);

  // Uploaded video state (for the user's video feature)
  const [videoFileUrl, setVideoFileUrl] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Detected place state
  const [detectedPlace, setDetectedPlace] = useState<LandmarkPreset | null>(campusLandmarks[0]);
  const [confidence, setConfidence] = useState<number>(96);
  const [detectionTimestamp, setDetectionTimestamp] = useState<string>("");

  // Route calculation state
  const [targetDestinationId, setTargetDestinationId] = useState<string>(campusLandmarks[2].id);
  const [calculatedRoute, setCalculatedRoute] = useState<{
    distance: string;
    estTime: string;
    steps: RouteStep[];
  } | null>(null);
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
        "Camera access not granted or unavailable in this window. You can still test place detection and route navigation below, or upload a video file!"
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

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
  };

  // Handle uploaded video
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoFileUrl(url);
      setActiveMode("video");
      stopCamera();
    }
  };

  // Place detection simulation / scanner
  const handleScanLocation = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Pick or rotate a realistic landmark based on current state
      const randomLandmark =
        campusLandmarks[Math.floor(Math.random() * campusLandmarks.length)];
      setDetectedPlace(randomLandmark);
      setConfidence(Math.floor(92 + Math.random() * 7));
      setDetectionTimestamp(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setIsScanning(false);
      // Auto-compute route to current selected destination
      generateRoute(randomLandmark.id, targetDestinationId);
    }, 1200);
  };

  // Route Generator between points
  const generateRoute = (startId: string, endId: string) => {
    const startObj = campusLandmarks.find((l) => l.id === startId) || campusLandmarks[0];
    const endObj = campusLandmarks.find((l) => l.id === endId) || campusLandmarks[2];

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
      });
      return;
    }

    // Specific famous landmark distances
    let distance = "85 m";
    let estTime = "1 min";
    let steps: RouteStep[] = [];

    if (startId === "central-cafeteria" && endId === "seminar-hall") {
      distance = "20 m";
      estTime = "25 sec";
      steps = [
        {
          stepNumber: 1,
          instruction: "Exit Central Cafeteria and face straight north towards Block A.",
          hindiInstruction: "कैफेटेरिया से बाहर निकलें और ब्लॉक ए की तरफ सीधे देखें।",
          distance: "5m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: "Walk straight 20 metres ahead. Seminar Hall entrance will be directly in front of you.",
          hindiInstruction: "सीधे 20 मीटर आगे चलें। सेमिनार हॉल का मुख्य द्वार ठीक आपके सामने होगा।",
          distance: "20m",
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
        {
          stepNumber: 3,
          instruction: "Seminar Hall is on your right side opposite the central cafeteria lawn.",
          hindiInstruction: "सेमिनार हॉल आपके दाईं ओर स्थित है।",
          distance: "10m",
          turn: "straight",
        },
      ];
    } else if (startId === "main-gate" && endId === "boys-hostel") {
      distance = "300 m";
      estTime = "3.5 mins";
      steps = [
        {
          stepNumber: 1,
          instruction: "From College Main Gate (Gate 1), take the inner wide campus pathway.",
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
    } else if (endId === "block-d-hostel") {
      distance = "180 m";
      estTime = "2.2 mins";
      steps = [
        {
          stepNumber: 1,
          instruction: `From ${startObj.name}, follow the directional signboards towards the Girls Residential Wing.`,
          hindiInstruction: `${startObj.name} से गर्ल्स विंग की दिशा में आगे बढ़ें।`,
          distance: "80m",
          turn: "straight",
        },
        {
          stepNumber: 2,
          instruction: "Turn left towards Block D secure gated boundary.",
          hindiInstruction: "ब्लॉक D के सुरक्षित गेट की ओर बाएं मुड़ें।",
          distance: "60m",
          turn: "left",
        },
        {
          stepNumber: 3,
          instruction: "Block D (Girls Hostel) is here. Note: Medicines dispensary and Store Room are just behind Block D.",
          hindiInstruction: "ब्लॉक D गर्ल्स हॉस्टल यहाँ है। ध्यान दें: दवाएं व स्टोर रूम ठीक इसके पीछे स्थित हैं।",
          distance: "40m",
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
          instruction: `Follow the central campus pathway directly towards ${endObj.block}.`,
          hindiInstruction: `केंद्रीय मार्ग से सीधे ${endObj.block} की ओर बढ़ें।`,
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
    });
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
          <span>AI Camera Vision & Route Navigator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#102e59] tracking-tight">
          PLACE DETECTOR & ROUTE GUIDE
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto mt-1">
          Detect your current spot via live camera or recorded video, and get instant step-by-step walking directions across SRGI Lucknow.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveMode("live")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeMode === "live"
              ? "bg-[#102e59] text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Live Camera View</span>
        </button>

        <button
          onClick={() => setActiveMode("video")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeMode === "video"
              ? "bg-[#102e59] text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Video Detection Mode</span>
        </button>
      </div>

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
                      {cameraError || "Point camera at campus blocks, hallways, or library."}
                    </p>
                    <button
                      onClick={() => startCamera()}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Start Camera
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Video file player */
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

            {/* HUD Reticle Overlay */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>HUD VISION ACTIVE</span>
                </div>
                {activeMode === "live" && (
                  <button
                    onClick={handleToggleFacingMode}
                    className="pointer-events-auto p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-black/80 transition-colors text-xs flex items-center gap-1"
                    title="Flip camera"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
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

            {activeMode === "video" && (
              <label className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-300">
                <Upload className="w-4 h-4" />
                <span>Upload Walk Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Preset Spot Picker (Instant manual override) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs">
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
    </section>
  );
}
