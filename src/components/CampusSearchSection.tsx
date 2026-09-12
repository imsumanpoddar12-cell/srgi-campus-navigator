import { useState, useMemo } from "react";
import { ArrowLeft, Search, MapPin, Navigation, Image as ImageIcon, X } from "lucide-react";
import { CampusLocation, CampusPhotoItem } from "../types";
import { defaultCampusPhotos, getPhotosForQuery } from "../data/campusPhotos";

interface CampusSearchSectionProps {
  locations: CampusLocation[];
  onBack: () => void;
  initialQuery?: string;
  customPhotos?: CampusPhotoItem[];
}

export default function CampusSearchSection({
  locations,
  onBack,
  initialQuery = "",
  customPhotos = [],
}: CampusSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>("All");
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string; caption?: string } | null>(null);

  const blockFilters = ["All", "Block A", "Block B", "Block C", "Block D", "Block E", "Hostels & Food"];

  // Filter locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchesBlock =
        selectedBlockFilter === "All"
          ? true
          : selectedBlockFilter === "Hostels & Food"
          ? loc.block.includes("Hostel") || loc.block.includes("Gate") || loc.block.includes("Campus") || loc.category === "Hostel" || loc.category === "Food"
          : loc.block.toLowerCase().includes(selectedBlockFilter.toLowerCase());

      if (!matchesBlock) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.block.toLowerCase().includes(q) ||
        loc.floor.toLowerCase().includes(q) ||
        loc.department.toLowerCase().includes(q) ||
        loc.direction.toLowerCase().includes(q)
      );
    });
  }, [locations, searchQuery, selectedBlockFilter]);

  // Matching campus gallery photos for the current query (includes newly uploaded customPhotos)
  const matchingPhotos = useMemo(() => {
    if (!searchQuery.trim() && selectedBlockFilter === "All") return [];
    const query = searchQuery.trim() || selectedBlockFilter;
    return getPhotosForQuery(query, customPhotos);
  }, [searchQuery, selectedBlockFilter, customPhotos]);

  return (
    <section id="campus-search-section" className="max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="campus-back-home-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredLocations.length} locations
        </span>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-[#123f73] tracking-tight">
          Campus Information & Navigation
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Search any building, room, lab, office, or amenity. Photos appear automatically for places like Library, Labs, and Hostels.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="campus-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location, library, room, block, department, hostel..."
            className="w-full pl-12 pr-10 py-3.5 bg-white rounded-2xl border border-slate-300 shadow-sm text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Chips */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 justify-center text-[11px]">
          <span className="text-slate-400 font-medium">Quick search:</span>
          {[
            { label: "📚 Library", q: "library" },
            { label: "🏢 Block D (Girls Hostel)", q: "Block D" },
            { label: "🎓 Block E (Seniors)", q: "Block E" },
            { label: "🛏️ Boys Hostel", q: "boys hostel" },
            { label: "☕ Cafes & Canteen", q: "cafes" },
            { label: "🔬 Labs", q: "lab" },
          ].map((chip) => (
            <button
              key={chip.q}
              onClick={() => {
                setSearchQuery(chip.q);
                setSelectedBlockFilter("All");
              }}
              className="px-2.5 py-0.5 rounded-full bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors font-medium cursor-pointer shadow-2xs"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Block Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {blockFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setSelectedBlockFilter(filter);
              if (filter !== "All" && !searchQuery) {
                // Keep filter clean
              }
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedBlockFilter === filter
                ? "bg-[#123f73] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Matching Campus Photos Gallery Preview (if any matched) */}
      {matchingPhotos.length > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-700" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                Matching Campus Photos ({matchingPhotos.length})
              </h3>
            </div>
            <span className="text-[11px] text-blue-700 font-medium">Click photo to enlarge</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {matchingPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() =>
                  setPreviewPhoto({
                    url: photo.imageUrl,
                    title: photo.title,
                    caption: photo.caption,
                  })
                }
                className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-blue-100 shadow-xs hover:shadow-md transition-all"
              >
                <div className="h-28 sm:h-32 overflow-hidden relative">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 text-white rounded text-[10px] font-medium">
                    {photo.block}
                  </span>
                </div>
                <div className="p-2">
                  <div className="text-xs font-bold text-slate-800 truncate">{photo.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{photo.caption}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locations Results List */}
      <div className="space-y-4">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((loc) => (
            <div
              key={loc.id}
              id={`location-card-${loc.id}`}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md border border-slate-200/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-[#123f73]">
                    {loc.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100/70 text-blue-800">
                    {loc.block}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                    {loc.floor}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                  <span className="text-slate-400 font-normal">Department:</span>
                  <span className="font-semibold text-slate-800">{loc.department}</span>
                </p>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2 mt-2 leading-relaxed">
                  <Navigation className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><b>Direction:</b> {loc.direction}</span>
                </p>
              </div>

              {/* Photo thumbnail if location has one */}
              {loc.photoUrl && (
                <div
                  onClick={() =>
                    setPreviewPhoto({
                      url: loc.photoUrl!,
                      title: loc.name,
                      caption: `${loc.block} • ${loc.floor}`,
                    })
                  }
                  className="w-full md:w-36 h-28 rounded-xl overflow-hidden cursor-pointer shrink-0 border border-slate-200 group relative shadow-xs"
                >
                  <img
                    src={loc.photoUrl}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                    View Photo
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Locations Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find matches for "{searchQuery}". Try searching for Block A, Block B, Block C, Block D, Block E, CSE Section A, Library, HOD Office, or Boys Hostel.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedBlockFilter("All");
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>

      {/* Enlarged Photo Modal */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center z-10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={previewPhoto.url}
              alt={previewPhoto.title}
              className="w-full max-h-[65vh] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="p-4 bg-white">
              <h4 className="text-base font-bold text-slate-900">{previewPhoto.title}</h4>
              {previewPhoto.caption && (
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{previewPhoto.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
