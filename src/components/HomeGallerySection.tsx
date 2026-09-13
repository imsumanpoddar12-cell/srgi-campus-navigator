import { useState } from "react";
import {
  Image as ImageIcon,
  ArrowRight,
  Maximize2,
  X,
  MapPin,
  Tag,
  Sparkles,
} from "lucide-react";
import { CampusPhotoItem } from "../types";
import { defaultCampusPhotos } from "../data/campusPhotos";

interface HomeGallerySectionProps {
  customPhotos: CampusPhotoItem[];
  onNavigateToPhotos: () => void;
}

export default function HomeGallerySection({
  customPhotos,
  onNavigateToPhotos,
}: HomeGallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxPhoto, setLightboxPhoto] = useState<CampusPhotoItem | null>(null);

  const allPhotos = [...customPhotos, ...defaultCampusPhotos];

  const categories = ["All", "Campus Grounds", "Library", "Blocks", "Labs", "Facilities"];

  const filteredPhotos = allPhotos.filter((p) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Campus Grounds") return p.category === "Campus Grounds";
    if (selectedCategory === "Library") return p.category === "Library";
    if (selectedCategory === "Blocks") return p.category === "Blocks";
    if (selectedCategory === "Labs") return p.category === "Labs";
    if (selectedCategory === "Facilities") return p.category === "Facilities" || p.category === "Cafeteria" || p.category === "Hostels";
    return true;
  });

  // Display top 6 or 8 photos on the home view to keep it crisp and fast
  const previewPhotos = filteredPhotos.slice(0, 8);

  return (
    <section id="home-campus-gallery-section" className="max-w-4xl mx-auto px-4 my-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wide uppercase border border-emerald-200/60 mb-2">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            Official Campus Photos
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#102e59] tracking-tight">
            Campus Photo Gallery
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            परिसर फोटो गैलरी — मुख्य द्वार, केंद्रीय परिसर, सेंट्रल लाइब्रेरी, सेमिनार हॉल व कंप्यूटर लैब
          </p>
        </div>

        <button
          id="home-view-all-photos-btn"
          onClick={onNavigateToPhotos}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#102e59] hover:bg-[#0c2447] text-white text-xs font-bold transition-all shadow-md shadow-slate-900/10 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <span>View All Photos ({allPhotos.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`home-gallery-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#102e59] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {previewPhotos.map((photo) => (
          <div
            key={photo.id}
            id={`home-photo-thumb-${photo.id}`}
            onClick={() => setLightboxPhoto(photo)}
            className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col transform hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                <span className="text-white text-[11px] font-bold flex items-center gap-1">
                  <Maximize2 className="w-3 h-3" />
                  View Photo
                </span>
              </div>

              {/* Category Pill Tag */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                  {photo.category}
                </span>
              </div>
            </div>

            {/* Photo Info */}
            <div className="p-2.5 flex-1 flex flex-col justify-between">
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-700 transition-colors">
                {photo.title}
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{photo.locationName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          id="home-gallery-lightbox-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">{lightboxPhoto.title}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lightboxPhoto.locationName} ({lightboxPhoto.block})</span>
                </p>
              </div>
              <button
                id="home-lightbox-close-btn"
                onClick={() => setLightboxPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Preview */}
            <div className="bg-black/95 flex items-center justify-center max-h-[60vh] overflow-hidden p-2">
              <img
                src={lightboxPhoto.imageUrl}
                alt={lightboxPhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[58vh] max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Footer with Caption & Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                {lightboxPhoto.caption}
              </p>

              <button
                id="home-lightbox-full-gallery-btn"
                onClick={() => {
                  setLightboxPhoto(null);
                  onNavigateToPhotos();
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#075db4] hover:bg-[#064e9a] text-white text-xs font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <span>Open in Full Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
