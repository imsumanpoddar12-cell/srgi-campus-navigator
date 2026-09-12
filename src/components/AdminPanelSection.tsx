import { useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowLeft, Plus, Trash2, Edit3, ShieldCheck, Check, Image as ImageIcon, MapPin, Users } from "lucide-react";
import { AdminUser, CampusLocation, TeamMember } from "../types";

interface AdminPanelSectionProps {
  currentAdmin: AdminUser;
  locations: CampusLocation[];
  onAddLocation: (loc: CampusLocation) => void;
  onDeleteLocation: (id: string) => void;
  team: TeamMember[];
  onUpdateTeamMember: (id: string, updated: Partial<TeamMember>) => void;
  onUpdateAdmin: (id: string, updated: Partial<AdminUser>) => void;
  onBack: () => void;
  onLogout: () => void;
}

export default function AdminPanelSection({
  currentAdmin,
  locations,
  onAddLocation,
  onDeleteLocation,
  team,
  onUpdateTeamMember,
  onUpdateAdmin,
  onBack,
  onLogout,
}: AdminPanelSectionProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "locations" | "team">("profile");

  // Profile Edit state
  const [myEmail, setMyEmail] = useState(currentAdmin.email);
  const [myPhoto, setMyPhoto] = useState(currentAdmin.avatarUrl || "");
  const [profileSaved, setProfileSaved] = useState(false);

  // New location state
  const [locName, setLocName] = useState("");
  const [locBlock, setLocBlock] = useState("Block A");
  const [locFloor, setLocFloor] = useState("Ground Floor");
  const [locDept, setLocDept] = useState("");
  const [locDirection, setLocDirection] = useState("");
  const [locPhoto, setLocPhoto] = useState("");
  const [locationAdded, setLocationAdded] = useState(false);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    onUpdateAdmin(currentAdmin.id, {
      email: myEmail,
      avatarUrl: myPhoto,
    });
    // Also update matching team member if found
    const matchingTeam = team.find(
      (t) => t.name.toLowerCase() === currentAdmin.name.toLowerCase()
    );
    if (matchingTeam) {
      onUpdateTeamMember(matchingTeam.id, {
        email: myEmail,
        photoUrl: myPhoto,
      });
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMyPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
            {currentAdmin.name} ({currentAdmin.role})
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
          Manage admin profile, contact emails, campus photos, and directional locations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "profile"
              ? "bg-[#123f73] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          My Profile & Photo
        </button>
        <button
          onClick={() => setActiveTab("locations")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "locations"
              ? "bg-[#123f73] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          Manage Campus Locations
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "team"
              ? "bg-[#123f73] text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
          }`}
        >
          Team Photos & Emails
        </button>
      </div>

      {/* Tab 1: Profile & Photo */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-xl mx-auto">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Edit My Admin Information
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Changes made here will instantly reflect on the Admins directory and Our Team section.
          </p>

          {profileSaved && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Profile and photo successfully updated!
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={currentAdmin.name}
                className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl text-slate-600 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={myEmail}
                onChange={(e) => setMyEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Profile Photo (URL or File)</label>
              <input
                type="url"
                value={myPhoto}
                onChange={(e) => setMyPhoto(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-blue-600 mb-2 font-medium"
              />
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">or upload:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {myPhoto && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                    <img src={myPhoto} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-slate-500">Preview</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Manage Locations */}
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
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Block *</label>
                <select
                  value={locBlock}
                  onChange={(e) => setLocBlock(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Block C">Block C</option>
                  <option value="Block D">Block D (Girls Hostel)</option>
                  <option value="Block E">Block E (Seniors)</option>
                  <option value="Boys Hostel">Boys Hostel</option>
                  <option value="Gate 2 & Cafes">Gate 2 & Cafes</option>
                  <option value="Central Campus">Central Campus</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Floor</label>
                <input
                  type="text"
                  value={locFloor}
                  onChange={(e) => setLocFloor(e.target.value)}
                  placeholder="Ground Floor, 1st Floor, etc."
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  value={locDept}
                  onChange={(e) => setLocDept(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Step-by-Step Directions *</label>
                <textarea
                  required
                  value={locDirection}
                  onChange={(e) => setLocDirection(e.target.value)}
                  placeholder="e.g. Enter Block C, take left staircase to 2nd floor, turn right..."
                  rows={2}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Photo URL (Optional)</label>
                <input
                  type="url"
                  value={locPhoto}
                  onChange={(e) => setLocPhoto(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Save Campus Location
                </button>
              </div>
            </form>
          </div>

          {/* Locations list */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Existing Locations ({locations.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">
                      {loc.name} <span className="font-normal text-slate-500">({loc.block} • {loc.floor})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{loc.direction}</div>
                  </div>
                  <button
                    onClick={() => onDeleteLocation(loc.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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

      {/* Tab 3: Team photos & emails */}
      {activeTab === "team" && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Team Member Details & Photos
          </h3>
          <div className="space-y-4">
            {team.map((member) => (
              <div
                key={member.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-300 shrink-0">
                    <img
                      src={member.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      #{member.order} {member.name} ({member.role})
                    </div>
                    <div className="text-slate-500 text-[11px]">{member.email || "No email"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    defaultValue={member.email}
                    onBlur={(e) => {
                      if (e.target.value !== member.email) {
                        onUpdateTeamMember(member.id, { email: e.target.value });
                      }
                    }}
                    placeholder="Update email"
                    className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                  <input
                    type="url"
                    defaultValue={member.photoUrl || ""}
                    onBlur={(e) => {
                      if (e.target.value !== member.photoUrl) {
                        onUpdateTeamMember(member.id, { photoUrl: e.target.value });
                      }
                    }}
                    placeholder="Photo URL"
                    className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
