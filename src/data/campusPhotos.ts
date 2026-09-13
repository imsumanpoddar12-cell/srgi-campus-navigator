import { CampusPhotoItem } from "../types";

/**
 * Campus Photo Catalog
 * Contains exclusively the verified campus photos provided for SRGI Lucknow.
 * All placeholder/third-party images have been removed.
 */
export const defaultCampusPhotos: CampusPhotoItem[] = [
  // ==================== 1. MAIN GATE (2 PHOTOS) ====================
  {
    id: "photo-main-gate-1",
    title: "SRGI Main Gate Entrance (Photo 1)",
    locationName: "Main Gate",
    block: "Main Campus",
    category: "Campus Grounds",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789290314/WhatsApp_Image_2026-09-13_at_2.32.02_PM.jpg",
    caption: "SRGI Lucknow Main Entrance Gate on Sitapur Road (NH-24, Bakshi Ka Talab).",
    tags: ["main gate", "gate", "entrance", "campus grounds", "main entrance", "sitapur road", "bkt"]
  },
  {
    id: "photo-main-gate-2",
    title: "Main Gate of the Campus (Photo 2)",
    locationName: "Main Gate",
    block: "Main Campus",
    category: "Campus Grounds",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789290298/WhatsApp_Image_2026-09-12_at_11.07.56_PM.jpg",
    caption: "Grand entrance boulevard of the 65-acre SR Group of Institutions campus.",
    tags: ["main gate", "gate of the campus", "gate", "campus entrance", "security", "avenue"]
  },

  // ==================== 2. CENTRAL CAMPUS & MAIN CAMPUS (4 PHOTOS) ====================
  {
    id: "photo-central-campus-1",
    title: "Central Campus Grounds (Photo 1)",
    locationName: "Central Campus",
    block: "Main Campus",
    category: "Campus Grounds",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789290318/WhatsApp_Image_2026-09-12_at_11.07.43_PM.jpg",
    caption: "Central campus walkway and academic grounds of SRGI Lucknow.",
    tags: ["central campus", "centeral campus", "main campus", "walkway", "grounds", "greenery"]
  },
  {
    id: "photo-central-campus-2",
    title: "Central Campus Courtyard (Photo 2)",
    locationName: "Central Campus",
    block: "Main Campus",
    category: "Campus Grounds",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789290308/WhatsApp_Image_2026-09-12_at_11.07.40_PM.jpg",
    caption: "Lush green central campus quad connecting academic blocks and cafeteria.",
    tags: ["central campus", "centeral campus", "campus", "courtyard", "quad", "main campus"]
  },
  {
    id: "photo-main-campus-3",
    title: "Main Campus Academic Complex",
    locationName: "Main Campus",
    block: "Main Campus",
    category: "Campus Grounds",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789291170/1751570876173-1555409362phpeGIjna.jpg",
    caption: "Panoramic view of SRGI Lucknow main campus infrastructure and facilities.",
    tags: ["main campus", "campus", "srgi lucknow", "infrastructure", "central campus"]
  },
  {
    id: "photo-campus-view-4",
    title: "SR Group of Institutions Campus",
    locationName: "Campus Grounds",
    block: "Main Campus",
    category: "Campus Grounds",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789291167/s-r-group-of-institution-lucknow-305380.webp",
    caption: "SR Group of Institutions (SRGI) Lucknow campus academic buildings.",
    tags: ["campus", "sr group of institution", "srgi", "lucknow", "main campus", "campus grounds"]
  },

  // ==================== 3. BLOCK A / MAIN BLOCK (4 PHOTOS) ====================
  {
    id: "photo-block-a-1",
    title: "Block A - Main Block (Photo 1)",
    locationName: "Block A",
    block: "Block A",
    category: "Blocks",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789290312/WhatsApp_Image_2026-09-13_at_2.32.01_PM.jpg",
    caption: "Block A (Main Block): Housing the Central Library, Seminar Hall, Director Office, and Registrar.",
    tags: ["a block", "block a", "main block", "blocks", "director office", "administration"]
  },
  {
    id: "photo-block-a-2",
    title: "Block A / Main Block (Photo 2)",
    locationName: "Block A",
    block: "Block A",
    category: "Blocks",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789290305/WhatsApp_Image_2026-09-12_at_11.07.57_PM.jpg",
    caption: "Main Block administrative and academic wing at SRGI Lucknow.",
    tags: ["a block", "block a", "main block", "administration", "blocks", "academic block"]
  },
  {
    id: "photo-block-a-3",
    title: "Block A Exterior Facade (Photo 3)",
    locationName: "Block A",
    block: "Block A",
    category: "Blocks",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789290296/WhatsApp_Image_2026-09-12_at_11.07.55_PM.jpg",
    caption: "Front corridor and entrance perspective of Block A.",
    tags: ["a block", "block a", "main block", "corridor", "blocks"]
  },
  {
    id: "photo-block-a-4",
    title: "Block A Academic Complex (Photo 4)",
    locationName: "Block A",
    block: "Block A",
    category: "Blocks",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789290294/WhatsApp_Image_2026-09-12_at_11.07.54_PM.jpg",
    caption: "View of Block A near the central cafeteria and landscaped gardens.",
    tags: ["a block", "block a", "main block", "blocks", "srgi"]
  },

  // ==================== 4. SEMINAR HALL (3 PHOTOS) ====================
  {
    id: "photo-seminar-hall-1",
    title: "Seminar Hall - Auditorium & Stage (Photo 1)",
    locationName: "Seminar Hall",
    block: "Block A",
    category: "Facilities",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789290302/WhatsApp_Image_2026-09-13_at_2.31.59_PM.jpg",
    caption: "Seminar Hall (Block A Ground Floor, 20m straight from cafeteria): Stage, presentation screen, and podium.",
    tags: ["seminar hall", "seminar", "auditorium", "hall", "block a", "stage", "cafeteria"]
  },
  {
    id: "photo-seminar-hall-2",
    title: "Seminar Hall - Conference Seating (Photo 2)",
    locationName: "Seminar Hall",
    block: "Block A",
    category: "Facilities",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789290581/gggggggggg.jpg",
    caption: "Air-conditioned Seminar Hall with tiered seating for conferences, workshops, and guest lectures.",
    tags: ["seminar hall", "seminar", "hall", "seating", "conference", "block a"]
  },
  {
    id: "photo-seminar-hall-3",
    title: "Seminar Hall - Event Auditorium (Photo 3)",
    locationName: "Seminar Hall",
    block: "Block A",
    category: "Facilities",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789291164/1781176797php8vFyWL.jpg",
    caption: "Official SRGI Lucknow Seminar Hall venue for technical symposiums and college events.",
    tags: ["seminar hall", "seminar", "auditorium", "facilities", "block a", "events"]
  },

  // ==================== 5. SMART CLASS (2 PHOTOS) ====================
  {
    id: "photo-smart-class-1",
    title: "Smart Class - Digital Interactive Board (Photo 1)",
    locationName: "Smart Classroom",
    block: "Block C",
    category: "Blocks",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789291083/1782281228phpLfTbOg.jpg",
    caption: "Modern smart classroom equipped with interactive digital screen, high-definition projector, and comfortable benches.",
    tags: ["smart class", "smart classroom", "class", "classroom", "block c", "digital board", "smart"]
  },
  {
    id: "photo-smart-class-2",
    title: "Smart Classroom - Lecture Session (Photo 2)",
    locationName: "Smart Classroom",
    block: "Block C",
    category: "Blocks",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789291160/images.jpg",
    caption: "Interactive multimedia lecture hall for engineering and advanced technical learning.",
    tags: ["smart class", "smart classroom", "class", "lecture hall", "block c", "presentation"]
  },

  // ==================== 6. CENTRAL LIBRARY (10 PHOTOS) ====================
  {
    id: "photo-srgi-library-1",
    title: "Central Library - Reading Hall & Study Stacks (Photo 1)",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789288370/WhatsApp_Image_2026-09-12_at_11.07.23_PM_1.jpg",
    caption: "SRGI Central Library (Block A, 2nd Floor): View of the spacious study hall, book stacks, and reading tables.",
    tags: ["library", "central library", "reading room", "study", "books", "block a", "srgi library"]
  },
  {
    id: "photo-srgi-library-2",
    title: "Central Library - Reference Section & Bookshelves (Photo 2)",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789288371/WhatsApp_Image_2026-09-12_at_11.07.24_PM.jpg",
    caption: "SRGI Central Library: Engineering, Management, and Humanities reference book aisle.",
    tags: ["library", "central library", "books", "reference", "bookshelves", "block a", "srgi"]
  },
  {
    id: "photo-srgi-library-3",
    title: "Central Library - Quiet Study Space & Seating (Photo 3)",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789288337/WhatsApp_Image_2026-09-12_at_11.07.25_PM_1.jpg",
    caption: "SRGI Central Library: Dedicated student seating section for focused reading and exam preparation.",
    tags: ["library", "central library", "seating", "study", "quiet zone", "block a"]
  },
  {
    id: "photo-srgi-library-4",
    title: "Central Library - Digital Research & Textbook Section (Photo 4)",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789288336/WhatsApp_Image_2026-09-12_at_11.07.22_PM.jpg",
    caption: "SRGI Central Library: Digital catalog and student textbook borrowing section.",
    tags: ["library", "central library", "textbooks", "digital", "research", "block a"]
  },
  {
    id: "photo-srgi-library-5",
    title: "Central Library - Main Circulation & Corridor (Photo 5)",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789288326/WhatsApp_Image_2026-09-12_at_11.07.24_PM_1.jpg",
    caption: "SRGI Central Library: Wide aisle between book racks and circulation access corridor.",
    tags: ["library", "central library", "aisle", "corridor", "books", "block a"]
  },
  {
    id: "photo-srgi-library-6",
    title: "Central Library - Academic Journal & Periodicals Rack (Photo 6)",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789288318/WhatsApp_Image_2026-09-12_at_11.07.22_PM_1.jpg",
    caption: "SRGI Central Library: Journals, magazines, and competitive examination reference collection.",
    tags: ["library", "central library", "journals", "periodicals", "magazines", "block a"]
  },
  {
    id: "photo-srgi-library-7",
    title: "Central Library - Student Reading Area (Photo 7)",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789288324/WhatsApp_Image_2026-09-12_at_11.07.23_PM.jpg",
    caption: "SRGI Central Library: Natural lighting study desks for group discussion and individual study.",
    tags: ["library", "central library", "desks", "reading", "study area", "block a"]
  },
  {
    id: "photo-srgi-library-8",
    title: "Central Library - Comprehensive Stacks Row (Photo 8)",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789288316/WhatsApp_Image_2026-09-12_at_11.07.20_PM_1.jpg",
    caption: "SRGI Central Library: Extensive stacks housing thousands of technical volumes.",
    tags: ["library", "central library", "stacks", "volumes", "engineering", "block a"]
  },
  {
    id: "photo-srgi-library-9",
    title: "Central Library - Departmental Archive & Reference (Photo 9)",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789288377/WhatsApp_Image_2026-09-12_at_11.07.23_PM_2.jpg",
    caption: "SRGI Central Library: Departmental project reports, previous year question papers, and archives.",
    tags: ["library", "central library", "archives", "projects", "pyq", "block a"]
  },
  {
    id: "photo-srgi-library-10",
    title: "Central Library - Wide Angle Reading & Stacks View (Photo 10)",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://res.cloudinary.com/ttlyyejm/image/upload/v1789288380/WhatsApp_Image_2026-09-12_at_11.07.25_PM.jpg",
    caption: "SRGI Central Library (Block A, 2nd Floor): Full panoramic perspective of the modern campus library.",
    tags: ["library", "central library", "panorama", "reading", "block a", "srgi"]
  }
];

/**
 * Searches for matching photos given a location name or search term
 */
export function getPhotosForQuery(query: string, customPhotos: CampusPhotoItem[] = []): CampusPhotoItem[] {
  // Combine customPhotos and defaultCampusPhotos, filtering out any third-party/placeholder images
  const pool = [...customPhotos, ...defaultCampusPhotos].filter(
    (p) => p.imageUrl && !p.imageUrl.includes("unsplash.com")
  );

  if (!query || !query.trim()) return pool;

  const q = query.toLowerCase().trim();
  return pool.filter((p) => {
    return (
      p.locationName.toLowerCase().includes(q) ||
      p.block.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.caption.toLowerCase().includes(q) ||
      p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}
