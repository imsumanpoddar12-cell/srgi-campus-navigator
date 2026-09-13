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
  Compass,
  Camera,
  MessageSquare,
  Moon,
  Sun,
  Globe,
  ExternalLink,
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
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
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
  isDarkMode = false,
  onToggleDarkMode,
}: MenuDropdownProps) {
  if (!isOpen) return null;

  const handleOpenConnectSR = () => {
    window.open("https://connectsr.in", "_blank", "noopener,noreferrer");
    onClose();
  };

  const menuItems = [
    {
      id: "home",
      label: "Home & Campus Blocks",
      subtext: "Blocks A, B, C, D & E Directory",
      icon: MapPin,
      badge: "Main",
    },
    {
      id: "camera",
      label: "Camera Place Detector & Route",
      subtext: "Detect landmark via camera or video & get route",
      icon: Camera,
      badge: "Vision",
    },
    {
      id: "connectsr",
      label: "ConnectSR Portal (connectsr.in)",
      subtext: "कॉलेज आधिकारिक पोर्टल • डायरेक्ट लिंक",
      icon: Globe,
      badge: "Direct Link",
      isExternal: true,
    },
    {
      id: "messages",
      label: "Send Us a Message",
      subtext: "Campus inquiries, feedback & suggestions",
      icon: MessageSquare,
      badge: "Contact",
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
      id: "where-is-srgi",
      label: "SRGI Map (बाहर से रास्ता)",
      subtext: "GPS Distance, routes & Google Maps navigation",
      icon: Compass,
      badge: "Map",
    },
    {
      id: "photos",
      label: "Campus Photos",
      subtext: "Central library, hostels, cafes & gallery",
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
      subtext: "Er. Suman Kumar, Er. Vivek Sahani & Core Members",
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
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity"
      />

      {/* Slide-in / Popup Menu with clean, modern aesthetics & dark mode support */}
      <div
        id="app-navigation-menu"
        className="fixed right-3 top-20 sm:right-6 w-[calc(100vw-24px)] max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors"
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

        {/* Quick Preferences: Dark Mode & Admin Photos */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700/60 divide-y divide-slate-100 dark:divide-slate-700/60">
          {/* Dark Mode Toggle */}
          <div className="px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center">
                {isDarkMode ? (
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Dark Theme
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5 font-medium">
                  {isDarkMode ? "डार्क मोड सक्रिय" : "लाइट मोड"}
                </span>
              </div>
            </div>
            <button
              id="toggle-dark-mode-menu-btn"
              onClick={onToggleDarkMode}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer focus:outline-hidden ${
                isDarkMode ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                  isDarkMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Admin Photos Display Toggle */}
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center">
                {showAdminPhotos ? (
                  <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Admin Photos Display
              </span>
            </div>
            <button
              id="toggle-admin-photos-menu-btn"
              onClick={onToggleAdminPhotos}
              className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full transition-colors cursor-pointer ${
                showAdminPhotos
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300"
              }`}
            >
              {showAdminPhotos ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>

        {/* Featured Direct Option: connectsr.in */}
        <div className="p-2 pb-1 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-slate-100 dark:border-slate-800">
          <a
            id="menu-featured-connectsr-btn"
            href="https://connectsr.in"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              handleOpenConnectSR();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800/90 hover:bg-blue-50/80 dark:hover:bg-slate-800 border border-blue-200/90 dark:border-blue-700/50 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>connectsr.in</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-600 text-white">
                    Direct Portal
                  </span>
                </div>
                <div className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                  डायरेक्ट connectsr.in खोलें ↗
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
              <span className="text-[11px] hidden sm:inline">Open</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        </div>

        {/* Menu Items List */}
        <div className="p-2 max-h-[58vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          <div className="space-y-1 pb-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isExternal = item.isExternal;
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
                    if (isExternal && item.id === "connectsr") {
                      handleOpenConnectSR();
                      return;
                    }
                    onSelectSection(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-blue-50/90 dark:bg-blue-950/60 text-[#123f73] dark:text-blue-300 font-bold border border-blue-200/80 dark:border-blue-800 shadow-2xs"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-[#123f73] dark:bg-blue-600 text-white shadow-2xs"
                          : isExternal
                          ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
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
                                ? "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300"
                                : item.badge === "Direct Link"
                                ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300"
                                : "bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                        {item.subtext}
                      </div>
                    </div>
                  </div>
                  {isExternal ? (
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Admin Section in Menu */}
          <div className="pt-2">
            {isLoggedIn ? (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Logged in as {loggedAdminName}
                  </div>
                  <button
                    id="menu-open-admin-panel-btn"
                    onClick={() => {
                      onSelectSection("admin");
                      onClose();
                    }}
                    className="text-[11px] text-emerald-700 dark:text-emerald-300 underline font-medium hover:text-emerald-900 dark:hover:text-emerald-100 cursor-pointer"
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
                className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span>Admin Login (Manage Locations & Content)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

