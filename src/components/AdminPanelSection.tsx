import { useState, useEffect, type FormEvent } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ShieldCheck,
  Check,
  MapPin,
  Users,
  MessageSquare,
  Mail,
  Clock,
  Lock,
} from "lucide-react";
import { AdminUser, CampusLocation, TeamMember, UserMessage } from "../types";

interface SuggestionItem {
  id: string;
  name: string;
  contact: string;
  department?: string;
  category: string;
  message: string;
  createdAt: string;
  status: "unread" | "reviewed";
}

interface AdminPanelSectionProps {
  currentAdmin: AdminUser;
  locations: CampusLocation[];
  onAddLocation: (loc: CampusLocation) => void;
  onDeleteLocation: (id: string) => void;
  team: TeamMember[];
  onBack: () => void;
  onLogout: () => void;
}

export default function AdminPanelSection({
  currentAdmin,
  locations,
  onAddLocation,
  onDeleteLocation,
  team,
  onBack,
  onLogout,
}: AdminPanelSectionProps) {
  const [activeTab, setActiveTab] = useState<"locations" | "team" | "suggestions">("locations");

  const currentAdminDisplayName = currentAdmin.name.replace(/^Er\.\s*/i, "");

  // Suggestions & Messages state
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("srgi_suggestions");
      const msgsRaw = localStorage.getItem("srgi_messages");
      const combined: SuggestionItem[] = [];

      if (raw) {
        const parsed: SuggestionItem[] = JSON.parse(raw);
        combined.push(...parsed);
      }
      if (msgsRaw) {
        const userMsgs: UserMessage[] = JSON.parse(msgsRaw);
        for (const um of userMsgs) {
          combined.push({
            id: um.id,
            name: um.name,
            contact: um.email + (um.phone ? ` (${um.phone})` : ""),
            department: "Send Us a Message Form",
            category: um.subject || "Direct Message",
            message: um.message,
            createdAt: um.timestamp,
            status: um.status === "read" ? "reviewed" : "unread",
          });
        }
      }
      setSuggestions(combined);
    } catch {}
  }, [activeTab]);

  const handleDeleteSuggestion = (id: string) => {
    const updated = suggestions.filter((s) => s.id !== id);
    setSuggestions(updated);
    try {
      localStorage.setItem(
        "srgi_suggestions",
        JSON.stringify(updated.filter((s) => s.department !== "Send Us a Message Form"))
      );
      const remainingMsgs = updated.filter((s) => s.department === "Send Us a Message Form");
      localStorage.setItem(
        "srgi_messages",
        JSON.stringify(
          remainingMsgs.map((m) => ({
            id: m.id,
            name: m.name,
            email: m.contact,
            subject: m.category,
            message: m.message,
            timestamp: m.createdAt,
            status: m.status === "reviewed" ? "read" : "unread",
          }))
        )
      );
    } catch {}
  };

  const handleToggleSuggestionStatus = (id: string) => {
    const updated: SuggestionItem[] = suggestions.map((s) =>
      s.id === id ? { ...s, status: s.status === "unread" ? "reviewed" : "unread" } : s
    );
    setSuggestions(updated);
    try {
      localStorage.setItem(
        "srgi_suggestions",
        JSON.stringify(updated.filter((s) => s.department !== "Send Us a Message Form"))
      );
    } catch {}
  };

  // New location state
  const [locName, setLocName] = useState("");
  const [locBlock, setLocBlock] = useState("Block A");
  const [locFloor, setLocFloor] = useState("Ground Floor");
  const [locDept, setLocDept] = useState("");
  const [locDirection, setLocDirection] = useState("");
  const [locPhoto, setLocPhoto] = useState("");
  const [locationAdded, setLocationAdded] = useState(false);

  const handleCreateLocation = (e: FormEvent) => {
    e.preventDefault();
    if (!locName.trim() || !locDirection.trim()) return;

    const newLoc: CampusLocation = {
      id: `loc-${Date.now()}`,
      name: locName.trim(),
      block: locBlock,
      floor: locFloor,
      department: locDept.trim() || "Campus",
      direction: locDirection.trim(),
      photoUrl: locPhoto.trim() || undefined,
    };

    onAddLocation(newLoc);
    setLocName("");
    setLocDept("");
    setLocDirection("");
    setLocPhoto("");
    setLocationAdded(true);
    setTimeout(() => setLocationAdded(false), 3000);
  };

  return (
    <section id="admin-panel-section" className="max-w-5xl mx-auto px-4 py-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {currentAdminDisplayName} ({currentAdmin.role})
          </span>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-[#123f73] tracking-tight">
          ADMIN DASHBOARD
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Manage campus locations, review student messages and view official team records.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab("locations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "locations"
              ? "bg-[#123f73] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          Manage Campus Locations
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "team"
              ? "bg-[#123f73] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Official Team Directory</span>
          <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] rounded-md font-bold">
            Locked
          </span>
        </button>
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "suggestions"
              ? "bg-[#123f73] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Messages & Suggestions Inbox</span>
          {suggestions.filter((s) => s.status === "unread").length > 0 && (
            <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] rounded-full font-bold">
              {suggestions.filter((s) => s.status === "unread").length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Manage Locations */}
      {activeTab === "locations" && (
        <div className="space-y-6">
          {/* Add location form */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Add New Campus Location or Direction
            </h3>
            {locationAdded && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Location successfully added to campus map!
              </div>
            )}
            <form onSubmit={handleCreateLocation} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Location Name *</label>
                <input
                  type="text"
                  required
                  value={locName}
                  onChange={(e) => setLocName(e.target.value)}
                  placeholder="e.g. Robotics Innovation Lab"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Block</label>
                <select
                  value={locBlock}
                  onChange={(e) => setLocBlock(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Block C">Block C</option>
                  <option value="Block D">Block D (Girls Hostel)</option>
                  <option value="Block E">Block E (Seniors Classes)</option>
                  <option value="Central Campus">Central Campus</option>
                  <option value="Gate 1">Main Gate (Gate 1)</option>
                  <option value="Gate 2">Gate 2 (Cafes)</option>
                  <option value="Campus Grounds">Campus Grounds</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Floor</label>
                <select
                  value={locFloor}
                  onChange={(e) => setLocFloor(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="Ground Floor">Ground Floor</option>
                  <option value="1st Floor">1st Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="3rd Floor">3rd Floor</option>
                  <option value="All Floors">All Floors</option>
                  <option value="Campus Grounds">Campus Grounds</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department / Branch</label>
                <input
                  type="text"
                  value={locDept}
                  onChange={(e) => setLocDept(e.target.value)}
                  placeholder="e.g. Mechanical Engineering"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Photo URL (Optional)</label>
                <input
                  type="url"
                  value={locPhoto}
                  onChange={(e) => setLocPhoto(e.target.value)}
                  placeholder="https://res.cloudinary.com/... or direct image URL"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Walking Directions / Landmark *</label>
                <textarea
                  required
                  rows={3}
                  value={locDirection}
                  onChange={(e) => setLocDirection(e.target.value)}
                  placeholder="Clear directions in Hindi/English, e.g., 'From Block B main lobby, walk 20m straight...'"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Publish Location to Campus Guide
                </button>
              </div>
            </form>
          </div>

          {/* Existing Locations */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Current Campus Locations ({locations.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-3 text-xs hover:bg-slate-100/80 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{loc.name}</div>
                    <div className="text-blue-700 font-semibold text-[11px]">
                      {loc.block} • {loc.floor}
                    </div>
                    <div className="text-slate-600 text-[11px] line-clamp-2">{loc.direction}</div>
                  </div>
                  <button
                    onClick={() => onDeleteLocation(loc.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                    title="Delete location"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Official Team Directory (Read-only, Locked) */}
      {activeTab === "team" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-700" />
                <span>Official Team & Admin Directory</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official development team profiles. All credentials, names, and home cities are locked and verified.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Editing Disabled (Official Records)</span>
            </div>
          </div>

          <div className="space-y-3">
            {team.map((member) => {
              const displayName = member.name.replace(/^Er\.\s*/i, "");
              return (
                <div
                  key={member.id}
                  className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-300 shrink-0 bg-white">
                      <img
                        src={member.photoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${member.name}`}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>#{member.order}</span>
                        <span>{displayName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {member.role}
                        </span>
                      </div>
                      <div className="text-slate-600 text-xs mt-0.5 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                          {member.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1 text-[11px] bg-white sm:bg-transparent p-2 sm:p-0 rounded-xl border border-slate-200 sm:border-0">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{member.city || "Uttar Pradesh"}</span>
                    </span>
                    <span className="text-slate-500 font-medium">{member.department}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Suggestions & Messages Inbox */}
      {activeTab === "suggestions" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-700" />
                <span>विद्यार्थी सुझाव व संदेश (Messages & Suggestions Inbox)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Received from students, faculty & campus visitors via "Send Us a Message" and the Suggestion Box.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              {suggestions.length} Total Messages
            </span>
          </div>

          {suggestions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <div className="text-xs font-bold text-slate-600">कोई नया सुझाव या संदेश नहीं है</div>
              <p className="text-[11px] text-slate-400 mt-1">
                New submissions from "Send Us a Message" will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.status === "unread"
                      ? "bg-blue-50/40 border-blue-200 shadow-2xs"
                      : "bg-slate-50/60 border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/60">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-slate-900">{item.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                      {item.department && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          • {item.department}
                        </span>
                      )}
                      {item.status === "unread" && (
                        <span className="px-1.5 py-0.2 bg-red-500 text-white rounded-md text-[9px] font-bold">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                    {item.message}
                  </p>

                  <div className="mt-3 pt-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-200/40">
                    <div className="flex items-center gap-3 text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.contact}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSuggestionStatus(item.id)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        {item.status === "unread" ? "Mark Reviewed" : "Mark Unread"}
                      </button>
                      <button
                        onClick={() => handleDeleteSuggestion(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
