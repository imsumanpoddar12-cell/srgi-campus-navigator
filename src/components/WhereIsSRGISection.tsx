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
  Route,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

// SRGI Lucknow Coordinates
const SRGI_LAT = 27.0094;
const SRGI_LNG = 80.9328;
const SRGI_ADDRESS = "SR Group of Institutions, Sitapur Road, Bakshi Ka Talab (BKT), Lucknow, Uttar Pradesh 226201";

// Haversine formula to calculate distance in KM
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
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

export default function WhereIsSRGISection() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  // Direct directions link
  const directionsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=SR+Group+of+Institutions+Bakshi+Ka+Talab+Lucknow`
    : `https://www.google.com/maps/dir/?api=1&destination=SR+Group+of+Institutions+Bakshi+Ka+Talab+Lucknow`;

  // Map embed URL with official SRGI pin
  const mapEmbedUrl = `https://maps.google.com/maps?q=SR%20Group%20of%20Institutions%20Bakshi%20Ka%20Talab%20Lucknow&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError("आपके ब्राउज़र में GPS लोकेशन समर्थित नहीं है।");
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
        setLocError("कृपया ब्राउज़र में लोकेशन अनुमति (Allow Location) चालू करें।");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#0d2e54] via-[#123f73] to-[#1261a0] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold text-amber-300 uppercase tracking-wide">
              <Compass className="w-3.5 h-3.5" />
              <span>Campus GPS Navigator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Where is SRGI Lucknow? (लोकेशन व दिशा-निर्देश)
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              आप कहीं भी हों — बस एक क्लिक में अपनी वर्तमान लोकेशन से SRGI कैंपस (Sitapur Road, BKT, Lucknow) की दूरी और लाइव टर्न-बाय-टर्न गूगल मैप्स रास्ता देखें।
            </p>
          </div>

          {/* Quick Distance & Live Route CTA */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shrink-0 w-full md:w-auto flex flex-col items-center gap-3">
            {distanceKm !== null ? (
              <div className="text-center">
                <div className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider">
                  आपकी लोकेशन से दूरी
                </div>
                <div className="text-3xl font-black text-amber-300">
                  {distanceKm} km
                </div>
                <div className="text-[11px] text-emerald-300 font-medium mt-0.5">
                  ✓ GPS द्वारा लाइव गणना
                </div>
              </div>
            ) : (
              <button
                id="detect-gps-distance-btn"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="w-full sm:w-auto px-4 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <LocateFixed className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
                <span>{isLocating ? "लोकेशन खोजी जा रही है..." : "मेरी लोकेशन से दूरी मापें"}</span>
              </button>
            )}

            <a
              id="open-google-maps-directions-link"
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#123f73] hover:bg-blue-50 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#123f73]" />
              <span>Start Google Maps Live Navigation</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {locError && (
              <div className="text-[11px] text-amber-200 text-center max-w-xs font-medium">
                {locError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Google Map Embed + Route Directions Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Interactive Google Map Embed */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Google Maps Live View • SRGI Campus
                </h2>
                <div className="text-[11px] text-slate-500 font-medium">
                  Sitapur Road, Bakshi Ka Talab (BKT), Lucknow
                </div>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/place/SR+Group+of+Institutions+Bakshi+Ka+Talab+Lucknow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
            >
              <span>Full View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Embedded Google Map Container */}
          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative shadow-inner">
            <iframe
              title="SRGI Lucknow Google Maps Location"
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3 text-xs text-slate-700">
            <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-slate-900">Exact Campus Address: </span>
              <span>{SRGI_ADDRESS}</span>
            </div>
          </div>
        </div>

        {/* Right: How to Reach Guide & Distance Benchmarks */}
        <div className="lg:col-span-5 space-y-4">
          {/* Benchmarks from major transit hubs */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-blue-700" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                प्रमुख केंद्रों से दूरी (Distance From Hubs)
              </h3>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-100 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Charbagh Railway Station</div>
                    <div className="text-[11px] text-slate-500">Lucknow Junction (LJN / LKO)</div>
                  </div>
                </div>
                <span className="text-xs font-black text-blue-900 bg-blue-100/70 px-2.5 py-1 rounded-full">
                  ~25 km
                </span>
              </div>

              <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-100 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Engineering College Chauraha</div>
                    <div className="text-[11px] text-slate-500">Jankipuram / Ring Road</div>
                  </div>
                </div>
                <span className="text-xs font-black text-blue-900 bg-blue-100/70 px-2.5 py-1 rounded-full">
                  ~14 km
                </span>
              </div>

              <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-100 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Chaudhary Charan Singh Airport</div>
                    <div className="text-[11px] text-slate-500">Amausi Airport (LKO)</div>
                  </div>
                </div>
                <span className="text-xs font-black text-blue-900 bg-blue-100/70 px-2.5 py-1 rounded-full">
                  ~35 km
                </span>
              </div>

              <div className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-100 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">BKT Railway Station</div>
                    <div className="text-[11px] text-slate-500">Bakshi Ka Talab Local Station</div>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full">
                  ~4 km
                </span>
              </div>
            </div>
          </div>

          {/* Transport mode guide */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-700" />
              <span>कैंपस कैसे पहुंचे? (How to Reach)</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-900">🚌 बस व ऑटो: </span>
                चारबाग या कैसरबाग बस अड्डे से सीतापुर जाने वाली रोडवेज बसें सीधे SRGI गेट नं. 1 के सामने उतारती हैं।
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-900">🚇 मेट्रो से: </span>
                मुंशी पुलिया या IT चौराहा मेट्रो स्टेशन तक आएं, फिर वहां से सीतापुर रोड के ऑटो/बस से सीधे BKT पहुंचें।
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-900">🚍 SRGI कॉलेज बसें: </span>
                संस्थान की अपनी 50+ एसी/नॉन-एसी बसें लखनऊ के सभी मुख्य मोहल्लों (गोमती नगर, आलमबाग, इंदिरा नगर, चौक आदि) से विद्यार्थियों को लाती-ले जाती हैं।
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
