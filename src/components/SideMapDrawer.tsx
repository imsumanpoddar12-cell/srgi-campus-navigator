import { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Compass,
  Bus,
  Train,
  Plane,
  Car,
  ExternalLink,
  LocateFixed,
  X,
  Share2,
  Copy,
  Check,
  Maximize2,
  Route,
  Clock,
  ShieldCheck,
  Building2,
  Sparkles,
} from "lucide-react";

// SRGI Lucknow Coordinates
const SRGI_LAT = 27.0094;
const SRGI_LNG = 80.9328;
const SRGI_ADDRESS = "SR Group of Institutions, Sitapur Road, Bakshi Ka Talab (BKT), Lucknow, Uttar Pradesh 226201";

// Haversine formula to calculate distance in KM
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

interface SideMapDrawerProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onOpenFullPage?: () => void;
}

export default function SideMapDrawer({
  isOpen,
  onOpen,
  onClose,
  onOpenFullPage,
}: SideMapDrawerProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Turn-by-turn navigation URL
  const directionsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=SR+Group+of+Institutions+Bakshi+Ka+Talab+Lucknow`
    : `https://www.google.com/maps/dir/?api=1&destination=SR+Group+of+Institutions+Bakshi+Ka+Talab+Lucknow`;

  // Google Maps embed
  const mapEmbedUrl = `https://maps.google.com/maps?q=SR%20Group%20of%20Institutions%20Bakshi%20Ka%20Talab%20Lucknow&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError("आपके डिवाइस में GPS लोकेशन समर्थित नहीं है।");
      return;
    }

    setIsLocating(true);
    setLocError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        const dist = calculateDistanceKm(lat, lng, SRGI_LAT, SRGI_LNG);
        setDistanceKm(dist);
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setIsLocating(false);
        setLocError("कृपया ब्राउज़र में लोकेशन की अनुमति (Allow Location) दें।");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(SRGI_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "SRGI Lucknow Campus Location",
          text: `SR Group of Institutions, Sitapur Road, BKT, Lucknow: ${directionsUrl}`,
          url: directionsUrl,
        });
      } catch (err) {
        // user cancelled or share failed
      }
    } else {
      handleCopyAddress();
    }
  };

  return (
    <>
      {/* Persistent Floating Side Trigger Tab (Always visible on right edge) */}
      <aside
        aria-label="Campus Location Quick Finder"
        className="fixed right-0 top-[52%] -translate-y-1/2 z-40"
      >
        <button
          id="side-map-toggle-btn"
          onClick={isOpen ? onClose : onOpen}
          aria-expanded={isOpen}
          aria-label="Open SRGI Lucknow Map & Location Finder"
          className="group relative flex items-center gap-2 py-3 px-2.5 sm:px-3 bg-gradient-to-b from-[#0d2e54] to-[#1261a0] text-white rounded-l-2xl shadow-2xl shadow-blue-950/40 border-y border-l border-white/20 hover:pl-4 transition-all duration-200 cursor-pointer"
        >
          {/* Pulsing GPS Indicator */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
          </span>

          <div className="flex flex-col items-center">
            <MapPin className="w-5 h-5 text-amber-300 transition-transform group-hover:scale-110" />
            <span className="text-[11px] font-black tracking-wider uppercase mt-1 [writing-mode:vertical-lr] rotate-180">
              SRGI MAP
            </span>
          </div>

          {/* Tooltip badge on hover for desktop */}
          <span className="hidden lg:group-hover:flex absolute right-full mr-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-900/95 text-white text-[11px] font-bold rounded-lg shadow-lg whitespace-nowrap items-center gap-1.5 border border-slate-700">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>बाहर से कॉलेज का नक्शा (Find SRGI)</span>
          </span>
        </button>
      </aside>

      {/* Backdrop overlay when open */}
      {isOpen && (
        <div
          id="side-map-backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Slide-out Side Interface Panel */}
      <div
        id="side-map-interface"
        aria-modal="true"
        role="dialog"
        className={`fixed top-0 right-0 h-full w-full sm:w-[460px] md:w-[490px] bg-slate-50 z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Header with High-Contrast Gradient */}
        <div className="bg-gradient-to-r from-[#0d2e54] via-[#123f73] to-[#1261a0] text-white p-4 sm:p-5 flex items-center justify-between border-b border-blue-400/20 shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <MapPin className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide">
                  Where is SRGI Lucknow?
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-blue-950 text-[10px] font-black uppercase">
                  Map Guide
                </span>
              </div>
              <p className="text-[11px] text-blue-200 font-medium">
                अगर आप बाहर हैं तो यहाँ से कॉलेज खोजें
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenFullPage && (
              <button
                id="side-map-expand-btn"
                onClick={() => {
                  onClose();
                  onOpenFullPage();
                }}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                title="Open Full Page View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
            <button
              id="side-map-close-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-rose-500 flex items-center justify-center transition-colors text-white"
              aria-label="Close Map Interface"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* GPS Distance & Live Route Quick Action Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LocateFixed className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Live Distance From You
                </span>
              </div>
              {distanceKm !== null && (
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {distanceKm} km away
                </span>
              )}
            </div>

            {distanceKm !== null ? (
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-3.5 rounded-xl border border-emerald-200/80 space-y-1.5">
                <p className="text-xs font-bold text-slate-800">
                  🎯 आप SRGI कैंपस से लगभग <span className="text-emerald-700 font-extrabold text-sm">{distanceKm} KM</span> की दूरी पर हैं।
                </p>
                <p className="text-[11px] text-slate-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  अनुमानित समय: ~{Math.round((distanceKm / 40) * 60)} मिनट (गाड़ी/बस द्वारा)
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed">
                अपनी वर्तमान जगह (Current Location) से SRGI कॉलेज की सटीक दूरी व दिशा-निर्देश जानने के लिए नीचे क्लिक करें:
              </p>
            )}

            {locError && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {locError}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                id="side-map-detect-gps-btn"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-[#123f73] font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-blue-200 transition-colors disabled:opacity-50"
              >
                <LocateFixed className={`w-4 h-4 ${isLocating ? "animate-spin" : "text-blue-600"}`} />
                <span>{isLocating ? "GPS ढूंढ रहा है..." : "मेरी दूरी जांचें"}</span>
              </button>

              <a
                id="side-map-start-nav-btn"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-[#123f73] hover:bg-[#0e315b] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>गूगल मैप्स नेविगेशन</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">
                  SRGI Lucknow Campus Map
                </span>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Open in App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative bg-slate-100">
              <iframe
                title="SRGI Lucknow Live Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="text-[10px] text-slate-500 text-center">
              📍 Sitapur Road (NH-24), Bakshi Ka Talab, Lucknow (65-Acre Green Campus)
            </p>
          </div>

          {/* Outside Travel Guide: How to reach from outside */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                अगर आप बाहर से आ रहे हैं (Outside City Routes)
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* Route 1: Charbagh */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Train className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <p className="font-bold text-slate-800 flex items-center justify-between">
                    <span>चारबाग रेलवे स्टेशन से (Charbagh)</span>
                    <span className="text-[11px] font-bold text-blue-700">~25 KM</span>
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    चारबाग से सीतापुर रोड सीधे NH-24 हाईवे होते हुए इंजीनियरिंग कॉलेज चौराहा होकर BKT आएं। सीधे ऑटो व ई-बसें उपलब्ध हैं।
                  </p>
                </div>
              </div>

              {/* Route 2: Airport */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Plane className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <p className="font-bold text-slate-800 flex items-center justify-between">
                    <span>अमौसी एयरपोर्ट से (CCS Airport)</span>
                    <span className="text-[11px] font-bold text-amber-700">~35 KM</span>
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    एयरपोर्ट मेट्रो से मुंशी पुलिया या चारबाग उतरें, वहां से सीतापुर रोड बस या कैब द्वारा सीधे SRGI कैंपस।
                  </p>
                </div>
              </div>

              {/* Route 3: Engineering College */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Car className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <p className="font-bold text-slate-800 flex items-center justify-between">
                    <span>इंजीनियरिंग कॉलेज चौराहा से</span>
                    <span className="text-[11px] font-bold text-emerald-700">~18 KM</span>
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    लगातार BKT शेयरिंग ऑटो, ई-रिक्शा एवं SRGI की ऑफिशियल कॉलेज बसें हर 15 मिनट पर उपलब्ध रहती हैं।
                  </p>
                </div>
              </div>

              {/* Route 4: BKT Market & Sewa Hospital */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bus className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-xs">
                  <p className="font-bold text-slate-800 flex items-center justify-between">
                    <span>बक्शी का तालाब (BKT Market / सेवा अस्पताल)</span>
                    <span className="text-[11px] font-bold text-indigo-700">~2 KM</span>
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    सेवा अस्पताल से मात्र 2 किमी आगे सीतापुर की ओर मुख्य राष्ट्रीय राजमार्ग (NH-24) पर बाईं तरफ भव्य SRGI गेट है।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* College Bus Fleet Note */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/80 space-y-2">
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-blue-700" />
              <h4 className="text-xs font-bold text-blue-900">
                SRGI कॉलेज बस रूट (सभी प्रमुख स्थानों से)
              </h4>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              गोमती नगर, आलमबाग, राजाजीपुरम, इंदिरा नगर, विकास नगर, मड़ियांव, जानकीपुरम एवं सीतापुर से प्रतिदिन विशेष कॉलेज बसें संचालित होती हैं।
            </p>
          </div>

          {/* Official Address & Quick Copy/Share */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-bold text-slate-800">
                कॉलेज का आधिकारिक पता (Official Address)
              </span>
            </div>
            <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]">
              {SRGI_ADDRESS}
            </p>
            <div className="flex items-center gap-2">
              <button
                id="side-map-copy-addr-btn"
                onClick={handleCopyAddress}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "कॉपी हो गया!" : "पता कॉपी करें"}</span>
              </button>
              <button
                id="side-map-share-btn"
                onClick={handleShare}
                className="flex-1 py-2 px-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>शेयर करें</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer in Drawer */}
        <div className="p-3.5 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            SRGI Lucknow • Pin: 226201
          </p>
          <a
            id="side-map-open-google-btn"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-[#123f73] to-[#1261a0] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow hover:shadow-md transition-all"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-300" />
            <span>नेविगेट करें</span>
          </a>
        </div>
      </div>
    </>
  );
}
