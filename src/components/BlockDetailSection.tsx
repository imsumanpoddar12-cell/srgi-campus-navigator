import { useState } from "react";
import { ArrowLeft, MapPin, Navigation, Info, Image as ImageIcon, X, Upload } from "lucide-react";
import { CampusLocation, CampusPhotoItem } from "../types";
import { getPhotosForQuery } from "../data/campusPhotos";

interface BlockDetailSectionProps {
  blockName: string;
  locations: CampusLocation[];
  onBack: () => void;
  customPhotos?: CampusPhotoItem[];
  onNavigateToPhotos?: () => void;
}

export default function BlockDetailSection({
  blockName,
  locations,
  onBack,
  customPhotos = [],
  onNavigateToPhotos,
}: BlockDetailSectionProps) {
  const [selectedFloor, setSelectedFloor] = useState<string>("All");
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string; caption?: string } | null>(null);

  // Filter locations for this block
  const blockLocations = locations.filter((loc) =>
    loc.block.toLowerCase().includes(blockName.toLowerCase())
  );

  // Get distinct floors in this block
  const floors = Array.from(new Set(blockLocations.map((loc) => loc.floor)));

  const filteredLocations =
    selectedFloor === "All"
      ? blockLocations
      : blockLocations.filter((loc) => loc.floor === selectedFloor);

  // Block photos including custom user uploaded photos
  const blockPhotos = getPhotosForQuery(blockName, customPhotos);

  // Custom block description & highlights
  const blockDetailsMap: Record<string, { subtitle: string; highlight: string }> = {
    "Block A": {
      subtitle: "Administrative Wing, Central Library, Seminar Hall & Foundational Science Labs",
      highlight:
        "Seminar Hall is located on the Ground Floor, 20 metres straight from the campus cafeteria. Central Library is on the Second Floor.",
    },
    "Block B": {
      subtitle: "Department of Management Studies (MBA Block)",
      highlight:
        "Dedicated lecture halls, conference suites, case study classrooms, and faculty offices for MBA postgraduates.",
    },
    "Block C": {
      subtitle: "Engineering, Computing & Technology Complex",
      highlight:
        "Four floors housing CSE, IT, EC, EN, DS, AIML, AI, Biotechnology, Mechanical, Agriculture, and SRIMT. Restrooms are located near the right staircase on every single floor.",
    },
    "Block D": {
      subtitle: "Girls Hostel & Campus Healthcare Hub",
      highlight:
        "Secure student residential hostel. Important: Campus Store Room and First-Aid Medicines / Medical dispensary are located just behind Block D.",
    },
    "Block E": {
      subtitle: "Senior Academic Classes (2nd to 4th Year)",
      highlight:
        "Specialized engineering lecture rooms, seminar halls, and project labs dedicated to 2nd Year, 3rd Year, and 4th Year seniors.",
    },
  };

  const blockInfo = blockDetailsMap[blockName] || {
    subtitle: "Academic and Student Services Block",
    highlight: "Equipped with state-of-the-art classrooms and facilities.",
  };

  return (
    <section id="block-detail-section" className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="block-detail-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campus Blocks</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">
          {blockLocations.length} locations mapped
        </span>
      </div>

      {/* Block Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#123f73] to-[#1261a0] text-white text-3xl font-black flex items-center justify-center shadow-lg shadow-blue-900/20 shrink-0">
            {blockName.replace("Block ", "")}
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#102e59]">
              {blockName}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
              {blockInfo.subtitle}
            </p>

            <div className="mt-3 p-3 bg-blue-50/80 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <span><b>Key Landmark:</b> {blockInfo.highlight}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Block Photos Preview */}
      {blockPhotos.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-700" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                {blockName} Gallery Photos ({blockPhotos.length})
              </h3>
            </div>
            {onNavigateToPhotos && (
              <button
                id="block-detail-upload-photos-btn"
                onClick={onNavigateToPhotos}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photos</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {blockPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() =>
                  setPreviewPhoto({
                    url: photo.imageUrl,
                    title: photo.title,
                    caption: photo.caption,
                  })
                }
                className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all"
              >
                <div className="h-28 overflow-hidden relative">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold">
                    Enlarge Photo
                  </div>
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

      {/* Floor Filter Tabs */}
      {floors.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setSelectedFloor("All")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedFloor === "All"
                ? "bg-[#123f73] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            All Floors ({blockLocations.length})
          </button>
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedFloor === floor
                  ? "bg-[#123f73] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {floor}
            </button>
          ))}
        </div>
      )}

      {/* Locations inside this Block */}
      <div className="space-y-3.5">
        {filteredLocations.map((loc) => (
          <div
            key={loc.id}
            id={`block-location-card-${loc.id}`}
            className="bg-white rounded-2xl p-5 shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-bold text-[#123f73]">
                  {loc.name}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
                  {loc.floor}
                </span>
                {loc.category && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    {loc.category}
                  </span>
                )}
              </div>

              <div className="text-xs font-medium text-slate-600">
                Department: <span className="font-semibold text-slate-800">{loc.department}</span>
              </div>

              <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2 mt-2 leading-relaxed">
                <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span><b>Direction:</b> {loc.direction}</span>
              </div>
            </div>

            {loc.photoUrl && (
              <div
                onClick={() =>
                  setPreviewPhoto({
                    url: loc.photoUrl!,
                    title: loc.name,
                    caption: `${loc.block} • ${loc.floor}`,
                  })
                }
                className="w-full sm:w-32 h-24 rounded-xl overflow-hidden cursor-pointer shrink-0 border border-slate-200 relative group shadow-xs"
              >
                <img
                  src={loc.photoUrl}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                  View Photo
                </div>
              </div>
            )}
          </div>
        ))}
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
