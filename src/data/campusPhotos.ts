import { CampusPhotoItem } from "../types";

/**
 * Campus Photo Catalog
 * This file allows students, staff and admins to register photos of campus locations.
 * When anyone searches for a place like "library" or "seminar hall" or browses the
 * Campus Gallery, the matching photos will automatically appear.
 */
export const defaultCampusPhotos: CampusPhotoItem[] = [
  {
    id: "photo-srgi-central-library-entrance",
    title: "Central Library Grand Entrance & Reading Lounge",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "/images/central_library_entrance_1789234918818.jpg",
    caption: "Block A Second Floor: Glass double doors entrance to Central Library featuring the signature wooden crescent bookshelf and circular art installation.",
    tags: ["library", "central library", "entrance", "books", "reading", "block a", "bookshelf", "study", "srgi"]
  },
  {
    id: "photo-srgi-library-neon-sign",
    title: "You Belong at the SR Library - Book Stacks & Reading Nooks",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "/images/library_belong_sign_1789235006575.jpg",
    caption: "Block A Central Library: Multi-tier book stacks with illuminated 'YOU BELONG AT THE SR LIBRARY' sign and integrated quiet study alcoves.",
    tags: ["library", "central library", "sr library", "you belong at the sr library", "books", "stacks", "study", "alcove", "block a"]
  },
  {
    id: "photo-srgi-library-reading-lounge",
    title: "Executive Library Reading Lounge & Discussion Area",
    locationName: "Central Library Lounge",
    block: "Block A",
    category: "Library",
    imageUrl: "/images/library_reading_lounge_1789235046991.jpg",
    caption: "Spacious library relaxation and reading lounge with warm LED back-lit wooden shelving, plush sofa seating, and low coffee tables.",
    tags: ["library", "central library", "lounge", "sofa", "reading lounge", "bookshelf", "armchair", "block a", "study"]
  },
  {
    id: "photo-srgi-library-digital-study-hall",
    title: "Digital Research Hall & Reading Cubicles",
    locationName: "Central Library",
    block: "Block A",
    category: "Library",
    imageUrl: "/images/library_study_hall_1789235080137.jpg",
    caption: "Modern digital reading hall with partitioned computer study tables, high-speed campus Wi-Fi, and reference textbook access.",
    tags: ["library", "central library", "digital library", "study hall", "computers", "laptops", "cubicles", "reading room", "block a"]
  },
  {
    id: "photo-srgi-library-reception-counter",
    title: "Central Library Circulation & Help Desk",
    locationName: "Central Library Help Desk",
    block: "Block A",
    category: "Library",
    imageUrl: "/images/library_help_desk_1789235107646.jpg",
    caption: "Book issue & return counter, library card registration, and digital catalog query desk located at Central Library entrance.",
    tags: ["library", "central library", "circulation", "help desk", "reception", "counter", "issue", "books", "block a"]
  },
  {
    id: "photo-library-1",
    title: "Central Library Reading & Reference Hall",
    locationName: "Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    caption: "Block A Second Floor: Sprawling digital & reference collection with quiet reading cubicles.",
    tags: ["library", "books", "study", "block a", "reading", "second floor", "reference", "journals"]
  },
  {
    id: "photo-library-2",
    title: "Library Digital Resource Section",
    locationName: "Library",
    block: "Block A",
    category: "Library",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    caption: "High-speed internet terminals for online research papers and e-journals.",
    tags: ["library", "digital", "computers", "e-books", "journals"]
  },
  {
    id: "photo-seminar-hall",
    title: "Auditorium & Seminar Hall",
    locationName: "Seminar Hall",
    block: "Block A",
    category: "Facilities",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    caption: "Block A Ground Floor (20m straight from campus cafeteria): Venue for guest lectures, seminars, and tech symposiums.",
    tags: ["seminar", "seminar hall", "hall", "auditorium", "cafeteria", "block a"]
  },
  {
    id: "photo-computer-lab",
    title: "Advanced Computer Laboratory",
    locationName: "Computer Lab",
    block: "Block C",
    category: "Labs",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    caption: "Block C Ground Floor: Equipped with modern workstations, dual monitors, and high-speed LAN.",
    tags: ["computer lab", "lab", "cse", "coding", "workstations", "block c"]
  },
  {
    id: "photo-chemistry-lab",
    title: "Applied Chemistry & Mechanics Lab",
    locationName: "Chemistry Lab",
    block: "Block A",
    category: "Labs",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    caption: "Block A Ground Floor: Hands-on experimental lab for first-year engineering students.",
    tags: ["chemistry lab", "lab", "mechanics lab", "science", "block a"]
  },
  {
    id: "photo-block-a",
    title: "Block A - Administrative & Academic Hub",
    locationName: "Block A",
    block: "Block A",
    category: "Blocks",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    caption: "Block A: Housing the Director & Chairman Offices, Registrar, Central Library, and Seminar Hall.",
    tags: ["block a", "administration", "director", "chairman", "offices", "registrar"]
  },
  {
    id: "photo-block-b",
    title: "Block B - Management & MBA Wing",
    locationName: "Block B",
    block: "Block B",
    category: "Blocks",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    caption: "Block B: Dedicated classrooms, conference rooms, and case study halls for MBA students.",
    tags: ["block b", "mba", "management", "business"]
  },
  {
    id: "photo-block-c",
    title: "Block C - Engineering & Technology Complex",
    locationName: "Block C",
    block: "Block C",
    category: "Blocks",
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
    caption: "Block C: The tech hub for CSE, IT, EC, EN, AIML, DS, Biotechnology, and SRIMT programs.",
    tags: ["block c", "cse", "engineering", "it", "hod office", "cse a"]
  },
  {
    id: "photo-block-d",
    title: "Block D - Girls Hostel & Health Center",
    locationName: "Block D (Girls Hostel)",
    block: "Block D",
    category: "Hostels",
    imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
    caption: "Block D: Secure, comfortable Girls Hostel. Note: Store room and First-Aid medicines are located just behind Block D.",
    tags: ["block d", "girls hostel", "hostel", "medicines", "store room", "girls"]
  },
  {
    id: "photo-block-e",
    title: "Block E - Senior Academic Classes",
    locationName: "Block E (Seniors Classes)",
    block: "Block E",
    category: "Blocks",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    caption: "Block E: Dedicated lectures and smart classrooms for 2nd Year, 3rd Year, and 4th Year senior students.",
    tags: ["block e", "seniors", "senior classes", "2nd year", "3rd year", "4th year"]
  },
  {
    id: "photo-boys-hostel",
    title: "SRGI Boys Hostel",
    locationName: "Boys Hostel",
    block: "Boys Hostel Campus",
    category: "Hostels",
    imageUrl: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=1200&q=80",
    caption: "Located 300 metres away from the college Main Gate inside the lush 65-acre campus.",
    tags: ["boys hostel", "hostel", "boys", "main gate", "residential"]
  },
  {
    id: "photo-cafeteria",
    title: "Campus Cafeteria & 2nd Gate Cafes",
    locationName: "Campus Cafes & Cafeteria",
    block: "Gate 2 & Central Campus",
    category: "Cafeteria",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
    caption: "Lively hangout spots with quick snacks, teas, and beverages at Gate 2 and central cafeteria (20m from Seminar Hall).",
    tags: ["cafe", "cafes", "cafeteria", "canteen", "food", "gate 2", "second gate"]
  },
  {
    id: "photo-medicines",
    title: "Campus Dispensary & Medicine Store",
    locationName: "Medicine Store & Dispensary",
    block: "Behind Block D",
    category: "Facilities",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80",
    caption: "Store room and first-aid medical support located immediately behind Block D (Girls Hostel).",
    tags: ["medicine", "medicines", "dispensary", "first aid", "store room", "block d"]
  },
  {
    id: "photo-campus-ground",
    title: "65-Acre Lush Green Campus Grounds",
    locationName: "Campus Grounds",
    block: "Main Campus",
    category: "Campus Grounds",
    imageUrl: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
    caption: "Beautiful wide avenues, tree-lined walkways, sports arena, and modern academic architecture.",
    tags: ["campus", "grounds", "65 acre", "main gate", "greenery"]
  }
];

/**
 * Searches for matching photos given a location name or search term
 */
export function getPhotosForQuery(query: string, customPhotos: CampusPhotoItem[] = []): CampusPhotoItem[] {
  // Check if user has uploaded real library photos
  const userLibraryPhotos = customPhotos.filter(
    (p) =>
      p.category.toLowerCase() === "library" ||
      p.locationName.toLowerCase().includes("library") ||
      p.tags.some((t) => t.toLowerCase().includes("library"))
  );

  let pool = [...customPhotos, ...defaultCampusPhotos];

  // If user uploaded their exact library photos, eliminate AI generated placeholder images
  // so ONLY the user's exact real photos are shown!
  if (userLibraryPhotos.length > 0) {
    pool = [
      ...customPhotos,
      ...defaultCampusPhotos.filter(
        (p) => !p.id.startsWith("photo-srgi-central-library") && !p.id.startsWith("photo-srgi-library")
      ),
    ];
  }

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
