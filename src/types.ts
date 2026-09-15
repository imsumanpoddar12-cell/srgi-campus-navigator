export type RoleType = "Leader" | "Co-Leader" | "Core Member";

export interface AdminUser {
  id: string;
  name: string;
  password: string;
  email: string;
  role: RoleType;
  username?: string;
  aliasUsernames?: string[];
  city?: string;
  avatarUrl?: string;
}

export interface TeamMember {
  id: string;
  order: number;
  name: string;
  role: RoleType;
  email: string;
  department: string;
  city?: string;
  photoUrl?: string;
  githubOrSocial?: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  block: string;
  floor: string;
  department: string;
  direction: string;
  photoUrl?: string;
  galleryUrls?: string[];
  category?: "Office" | "Lab" | "Classroom" | "Hostel" | "Facility" | "Food" | "Hall";
}

export interface CampusPhotoItem {
  id: string;
  title: string;
  locationName: string;
  block: string;
  category: "Library" | "Blocks" | "Labs" | "Hostels" | "Cafeteria" | "Campus Grounds" | "Facilities";
  imageUrl: string;
  caption: string;
  tags: string[];
}

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  phone: string;
  subject?: string;
  sectionGroup?: "CSE A" | "CSE B & C" | "Leadership" | "General";
  roleTitle?: "Chairman" | "Vice Chairman" | "HOD" | "Deputy HOD" | "Coordinator" | "Faculty";
  email?: string;
  cabinOrRoom?: string;
  photoUrl?: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  title: string;
  role: "Chairman" | "Vice Chairman" | "HOD" | "Deputy HOD" | "Coordinator";
  phone?: string;
  bio: string;
  badge?: string;
  politicalAffiliation?: string;
  tenure?: string;
  photoUrl?: string;
}

export interface ScheduleDay {
  day: string;
  p1: string; // 09:00–10:00
  p2: string; // 10:00–11:00
  p3: string; // 11:10–12:10
  p4: string; // 1:00–2:10
  p5: string; // 2:20–3:20
  p6: string; // 3:30–4:30
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface CollegeInfo {
  name: string;
  fullName: string;
  established: number;
  area: string;
  branches: string;
  boysHostel: string;
  cafesGate2: string;
  seminarHallDist: string;
  storeRoomMedicines: string;
  blockDNote: string;
  blockENote: string;
  history: string;
  mission: string;
}

export interface UserMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  timestamp: string;
  status?: "unread" | "read" | "resolved";
}

export interface CampusVideoRoute {
  id: string;
  title: string;
  hindiTitle: string;
  videoUrl: string;
  startLocation: string;
  endLocation: string;
  block: string;
  floor: string;
  description: string;
  tags: string[];
}
