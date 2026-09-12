import {
  Info,
  Users,
  GraduationCap,
  Image as ImageIcon,
  ShieldCheck,
  Sparkles,
  MapPin,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";
import SRGILogo from "./SRGILogo";

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (section: string) => void;
  activeSection: string;
  isLoggedIn: boolean;
  loggedAdminName?: string;
  onLogout: () => void;
  showAdminPhotos: boolean;
  onToggleAdminPhotos: () => void;
}

export default function MenuDropdown({
  isOpen,
  onClose,
  onSelectSection,
  activeSection,
  isLoggedIn,
  loggedAdminName,
  onLogout,
  showAdminPhotos,
  onToggleAdminPhotos,
}: MenuDropdownProps) {
  if (!isOpen) return null;

  const menuItems = [
    {
      id: "home",
      label: "Home & Campus Blocks",
      subtext: "Blocks A, B, C, D & E Directory",
      icon: MapPin,
      badge: "Main",
    },
    {
      id: "campus",
      label: "Explore & Search Campus",
      subtext: "Find rooms, library, labs & directions",
      icon: Sparkles,
      badge: "Search",
    },
    {
      id: "admin-photos",
      label: "Admin Photos",
      subtext: "Leadership directory, photos & emails",
      icon: UserCheck,
      badge: "New",
    },
    {
      id: "faculties-schedule",
      label: "Faculties & Schedule",
      subtext: "Faculty contacts & weekly class timetable",
      icon: GraduationCap,
      badge: null,
    },
    {
      id: "photos",
      label: "Campus Photos",
      subtext: "Central library, hostels, cafes & upload",
      icon: ImageIcon,
      badge: "Gallery",
    },
    {
      id: "about",
      label: "About SRGI",
      subtext: "65-Acre area, 2009 history & 10+ branches",
      icon: Info,
      badge: null,
    },
    {
      id: "team",
      label: "Our Team",
      subtext: "Suman Kumar, Vivek Sahani & Core Members",
      icon: Users,
      badge: null,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        id="menu-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
      />

      {/* Slide-in / Popup Menu with clean, modern aesthetics */}
      <div
        id="app-navigation-menu"
        className="fixed right-3 top-20 sm:right-6 w-[calc(100vw-24px)] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Menu Header with refined gradient */}
        <div className="bg-gradient-to-r from-[#0d2e54] via-[#123f73] to-[#1261a0] p-4 text-white flex items-center justify-between border-b border-blue-400/20">
          <div className="flex items-center gap-3">
            <SRGILogo size={36} />
            <div>
              <div className="text-sm font-black tracking-wide leading-tight">
                Campus Navigation
              </div>
              <div className="text-[11px] text-blue-200 font-medium">
                SR Group of Institutes • Lucknow
              </div>
            </div>
          </div>
          <button
            id="close-menu-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-white cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Admin Photo Visibility Preference */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showAdminPhotos ? (
              <Eye className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="text-[11px] font-semibold text-slate-700">
              Admin Photos Display
            </span>
          </div>
          <button
            id="toggle-admin-photos-menu-btn"
            onClick={onToggleAdminPhotos}
            className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition-colors cursor-pointer ${
              showAdminPhotos
                ? "bg-blue-600 text-white shadow-2xs"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            {showAdminPhotos ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* Menu Items List */}
        <div className="p-2 max-h-[62vh] overflow-y-auto divide-y divide-slate-100">
          <div className="space-y-1 pb-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activeSection === item.id ||
                (item.id === "admin-photos" && activeSection === "admins") ||
                (item.id === "faculties-schedule" &&
                  (activeSection === "faculties" || activeSection === "schedule"));

              return (
                <button
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  onClick={() => {
                    onSelectSection(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-blue-50/90 text-[#123f73] font-bold border border-blue-200/80 shadow-2xs"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-[#123f73] text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              item.badge === "New"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                        {item.subtext}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Admin Section in Menu */}
          <div className="pt-2">
            {isLoggedIn ? (
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Logged in as {loggedAdminName}
                  </div>
                  <button
                    id="menu-open-admin-panel-btn"
                    onClick={() => {
                      onSelectSection("admin");
                      onClose();
                    }}
                    className="text-[11px] text-emerald-700 underline font-medium hover:text-emerald-900 cursor-pointer"
                  >
                    Open Management Dashboard
                  </button>
                </div>
                <button
                  id="menu-logout-btn"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                id="menu-login-btn"
                onClick={() => {
                  onSelectSection("admin");
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Admin Login (Manage Locations & Content)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
