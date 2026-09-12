import { useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowLeft, Search, Image as ImageIcon, Plus, X, Tag, Upload, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { CampusPhotoItem } from "../types";
import { defaultCampusPhotos } from "../data/campusPhotos";

interface CampusPhotosGalleryProps {
  customPhotos: CampusPhotoItem[];
  onAddPhoto: (photo: CampusPhotoItem) => void;
  onAddMultiplePhotos?: (photos: CampusPhotoItem[]) => void;
  onDeletePhoto?: (id: string) => void;
  onBack: () => void;
  isLoggedIn?: boolean;
}

export default function CampusPhotosGallery({
  customPhotos,
  onAddPhoto,
  onAddMultiplePhotos,
  onDeletePhoto,
  onBack,
  isLoggedIn = false,
}: CampusPhotosGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxPhoto, setLightboxPhoto] = useState<CampusPhotoItem | null>(null);

  // Batch upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");
  const [hideAiPlaceholders, setHideAiPlaceholders] = useState(true);

  // Form state for adding photo
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLocationName, setNewLocationName] = useState("");
  const [newBlock, setNewBlock] = useState("Block A");
  const [newCategory, setNewCategory] = useState<CampusPhotoItem["category"]>("Library");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newTags, setNewTags] = useState("");

  const userLibraryPhotos = customPhotos.filter(
    (p) =>
      p.category.toLowerCase() === "library" ||
      p.locationName.toLowerCase().includes("library") ||
      p.tags.some((t) => t.toLowerCase().includes("library"))
  );

  // If user uploaded real library photos, eliminate AI generated placeholder images
  // so ONLY the user's exact real photos are shown!
  const basePool =
    userLibraryPhotos.length > 0 || hideAiPlaceholders
      ? [
          ...customPhotos,
          ...defaultCampusPhotos.filter(
            (p) =>
              !p.id.startsWith("photo-srgi-central-library") &&
              !p.id.startsWith("photo-srgi-library")
          ),
        ]
      : [...customPhotos, ...defaultCampusPhotos];

  const categories = ["All", "Library", "Blocks", "Labs", "Hostels", "Cafeteria", "Facilities", "Campus Grounds"];

  const filteredPhotos = basePool.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      p.title.toLowerCase().includes(q) ||
      p.locationName.toLowerCase().includes(q) ||
      p.block.toLowerCase().includes(q) ||
      p.caption.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleBatchLibraryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadSuccessMsg("");

    const newItems: CampusPhotoItem[] = [];
    const payloadForServer: Array<{
      filename: string;
      dataBase64: string;
      title: string;
      locationName: string;
      block: string;
      category: "Library";
    }> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const cleanTitle = `Central Library - Photo ${i + 1}`;

      const photoItem: CampusPhotoItem = {
        id: `exact-library-${Date.now()}-${i}`,
        title: cleanTitle,
        locationName: "Central Library",
        block: "Block A",
        category: "Library",
        imageUrl: dataUrl,
        caption: `Original verified photo of SRGI Central Library (Block A, 2nd Floor). File: ${file.name}`,
        tags: ["library", "central library", "srgi", "block a", "reading room", "study", "books", "exact photo"],
      };

      newItems.push(photoItem);
      payloadForServer.push({
        filename: file.name,
        dataBase64: dataUrl,
        title: photoItem.title,
        locationName: "Central Library",
        block: "Block A",
        category: "Library",
      });
    }

    if (onAddMultiplePhotos) {
      onAddMultiplePhotos(newItems);
    } else {
      newItems.forEach((p) => onAddPhoto(p));
    }

    // Persist to server public/images directory
    try {
      await fetch("/api/upload-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: payloadForServer }),
      });
    } catch (err) {
      console.warn("Could not save to disk, stored in localStorage", err);
    }

    setIsUploading(false);
    setUploadSuccessMsg(`🎉 Successfully loaded ${newItems.length} exact Library photos! AI placeholders have been removed.`);
    setSelectedCategory("Library");

    e.target.value = "";
  };

  const handleCreatePhoto = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    const tagsArray = newTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (!tagsArray.includes(newLocationName.toLowerCase())) {
      tagsArray.push(newLocationName.toLowerCase());
    }

    const item: CampusPhotoItem = {
      id: `photo-${Date.now()}`,
      title: newTitle.trim(),
      locationName: newLocationName.trim() || "Campus Location",
      block: newBlock,
      category: newCategory,
      imageUrl: newImageUrl.trim(),
      caption: newCaption.trim() || `${newLocationName} at ${newBlock}`,
      tags: tagsArray,
    };

    onAddPhoto(item);
    setShowAddModal(false);
    // Reset form
    setNewTitle("");
    setNewLocationName("");
    setNewImageUrl("");
    setNewCaption("");
    setNewTags("");
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="campus-photos-gallery-section" className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          id="gallery-back-home-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            {filteredPhotos.length} Photos Available
          </span>
          <button
            id="open-add-photo-modal-btn"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Single Photo</span>
          </button>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold mb-2">
          <ImageIcon className="w-4 h-4 text-blue-600" />
          Campus Visual Catalog
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#123f73] tracking-tight">
          Campus Photos & Media
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
          Official verified photographs of SRGI Central Library, academic blocks, labs, and student facilities.
        </p>
      </div>

      {/* Exact Library Photos Batch Upload Callout */}
      <div className="bg-gradient-to-r from-[#102e59] to-[#123f73] text-white rounded-3xl p-6 mb-8 shadow-lg border border-blue-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 shadow-inner">
              <Upload className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Upload Exact Library Photos
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  Zero AI • 100% Original
                </span>
                {userLibraryPhotos.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-200 text-[10px] font-semibold">
                    {userLibraryPhotos.length} exact photos loaded
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl leading-relaxed">
                Aapne jo 10 WhatsApp library photos bheji hain, unhe ek sath yahan select karein. Upload hote hi sari AI-generated placeholder images automatically remove ho jayengi aur exact original photos set ho jayengi!
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
            <label
              id="batch-upload-library-btn"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-blue-50 text-[#102e59] rounded-2xl text-xs font-black shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Upload className="w-4 h-4 text-[#102e59]" />
              <span>{isUploading ? "Uploading Exact Photos..." : "Select All 10 Library Photos (Batch)"}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBatchLibraryUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {userLibraryPhotos.length > 0 && (
              <button
                onClick={() => {
                  userLibraryPhotos.forEach((p) => onDeletePhoto && onDeletePhoto(p.id));
                  setUploadSuccessMsg("Cleared custom library photos. Reverted to initial state.");
                }}
                className="px-3 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
              >
                Clear Uploaded
              </button>
            )}
          </div>
        </div>

        {uploadSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/25 border border-emerald-400/40 text-xs text-emerald-100 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{uploadSuccessMsg}</span>
            </div>
            <button onClick={() => setUploadSuccessMsg("")} className="text-emerald-200 hover:text-white font-bold ml-2">✕</button>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="gallery-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by library, lab, block, hostel, cafes..."
            className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
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
            { label: "☕ Cafeteria & Cafes", q: "cafeteria" },
            { label: "🔬 Labs", q: "lab" },
          ].map((chip) => (
            <button
              key={chip.q}
              onClick={() => {
                setSearchQuery(chip.q);
                setSelectedCategory("All");
              }}
              className={`px-2.5 py-0.5 rounded-full border transition-colors font-medium cursor-pointer shadow-2xs ${
                searchQuery.toLowerCase() === chip.q.toLowerCase()
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border-slate-200"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#123f73] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => {
          const isCustom = photo.id.startsWith("exact-") || photo.id.startsWith("uploaded-") || photo.id.startsWith("photo-1") || photo.id.startsWith("photo-srgi-");
          const isUserUploaded = photo.id.startsWith("exact-") || photo.id.startsWith("uploaded-");

          return (
            <div
              key={photo.id}
              id={`photo-card-${photo.id}`}
              onClick={() => setLightboxPhoto(photo)}
              className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-slate-200/80 cursor-pointer group flex flex-col justify-between relative"
            >
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                  {photo.block}
                </span>
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-semibold">
                  {photo.category}
                </span>

                {isUserUploaded && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                    ✓ Exact Photo
                  </span>
                )}
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-xs font-bold text-[#123f73] line-clamp-1 group-hover:text-blue-700">
                      {photo.title}
                    </h3>
                    {onDeletePhoto && (isUserUploaded || isLoggedIn) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePhoto(photo.id);
                        }}
                        title="Delete photo"
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-700">{photo.locationName}</span>
                  <span className="text-blue-600 font-bold group-hover:underline">View Photo ➜</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No photos found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or upload your exact campus photos using the button above.
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white hover:bg-black flex items-center justify-center z-10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lightboxPhoto.imageUrl}
                alt={lightboxPhoto.title}
                className="w-full max-h-[70vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 bg-white space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                    {lightboxPhoto.block}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {lightboxPhoto.locationName}
                  </span>
                  {(lightboxPhoto.id.startsWith("exact-") || lightboxPhoto.id.startsWith("uploaded-")) && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      ✓ Original Verified Photo
                    </span>
                  )}
                </div>

                {onDeletePhoto && (lightboxPhoto.id.startsWith("exact-") || lightboxPhoto.id.startsWith("uploaded-") || isLoggedIn) && (
                  <button
                    onClick={() => {
                      onDeletePhoto(lightboxPhoto.id);
                      setLightboxPhoto(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Photo</span>
                  </button>
                )}
              </div>
              <h3 className="text-lg font-black text-[#102e59]">
                {lightboxPhoto.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lightboxPhoto.caption}
              </p>
              {lightboxPhoto.tags && lightboxPhoto.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {lightboxPhoto.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-[#123f73] mb-1">
              Add Campus Photograph
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Upload a photograph of any campus facility, lab, hostel, or landmark.
            </p>

            <form onSubmit={handleCreatePhoto} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Central Library Digital Reading Hall"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    placeholder="e.g. Central Library"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campus Block *
                  </label>
                  <select
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D (Girls Hostel)</option>
                    <option value="Block E">Block E (Seniors)</option>
                    <option value="Boys Hostel">Boys Hostel</option>
                    <option value="Gate 2">Gate 2 & Cafes</option>
                    <option value="Main Campus">Main Campus Grounds</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Library">Library</option>
                  <option value="Blocks">Blocks</option>
                  <option value="Labs">Labs</option>
                  <option value="Hostels">Hostels</option>
                  <option value="Cafeteria">Cafeteria & Cafes</option>
                  <option value="Facilities">Facilities & Dispensary</option>
                  <option value="Campus Grounds">Campus Grounds</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Photo Source *
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs font-semibold text-blue-800 text-center cursor-pointer hover:bg-blue-100 transition-colors">
                      <span>Choose File from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste an Image URL (https://...)"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {newImageUrl && (
                <div className="rounded-xl overflow-hidden h-36 bg-slate-100 border border-slate-200">
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Caption
                </label>
                <textarea
                  rows={2}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Key features, floor directions, timings, etc."
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Search Keywords / Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. library, books, reading, block a"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newImageUrl.trim()}
                  className="px-5 py-2 text-xs font-bold bg-[#123f73] hover:bg-[#0e315b] disabled:opacity-50 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
