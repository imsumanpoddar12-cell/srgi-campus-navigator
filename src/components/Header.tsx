import { Menu, Sparkles, Image as ImageIcon, Users, Compass, Camera, MessageSquare, Moon, Sun } from "lucide-react";
import SRGILogo from "./SRGILogo";

interface HeaderProps {
  onToggleMenu: () => void;
  onNavigate: (section: string) => void;
  activeSection: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export default function Header({ onToggleMenu, onNavigate, activeSection, isDarkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-30 h-20 bg-gradient-to-r from-[#0d2e54] via-[#123f73] to-[#1261a0] text-white shadow-lg shadow-blue-950/20 px-4 sm:px-8 flex items-center justify-between border-b border-blue-400/20"
    >
      {/* Brand & Logo */}
      <div
        id="brand-logo-container"
        onClick={() => onNavigate("home")}
        className="flex items-center gap-3.5 cursor-pointer group"
        title="SR Group of Institutes - Go to Home"
      >
        <div className="transition-transform group-hover:scale-105 duration-200">
          <SRGILogo size={46} />
        </div>
        <div>
          <h1 className="text-base sm:text-lg md:text-xl font-black tracking-wide leading-tight text-white drop-shadow-xs flex items-center gap-2">
            <span>SR GROUP OF INSTITUTES</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-blue-200/90 font-medium tracking-wide flex items-center gap-1.5">
            <span>Campus Navigator</span>
            <span className="text-blue-300">•</span>
            <span className="text-amber-300 font-semibold">My Campus Info</span>
          </p>
        </div>
      </div>

      {/* Desktop Quick Nav Links */}
      <nav className="hidden xl:flex items-center gap-1 bg-white/10 p-1.5 rounded-xl backdrop-blur-xs border border-white/10">
        <button
          id="header-nav-home"
          onClick={() => onNavigate("home")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSection === "home" ? "bg-white text-[#123f73] shadow-xs" : "text-white hover:bg-white/15"
          }`}
        >
          Campus Blocks
        </button>
        <button
          id="header-nav-campus"
          onClick={() => onNavigate("campus")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSection === "campus" ? "bg-white text-[#123f73] shadow-xs" : "text-white hover:bg-white/15"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Search Map
        </button>
        <button
          id="header-nav-camera"
          onClick={() => onNavigate("camera")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSection === "camera" ? "bg-white text-[#123f73] shadow-xs" : "text-emerald-300 hover:bg-white/15"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          Camera Detector
        </button>
        <button
          id="header-nav-messages"
          onClick={() => onNavigate("messages")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSection === "messages" ? "bg-white text-[#123f73] shadow-xs" : "text-white hover:bg-white/15"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Send Message
        </button>
        <button
          id="header-nav-admin-photos"
          onClick={() => onNavigate("admin-photos")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSection === "admin-photos" || activeSection === "admins"
              ? "bg-white text-[#123f73] shadow-xs"
              : "text-white hover:bg-white/15"
          }`}
        >
          Admin Photos
        </button>
        <button
          id="header-nav-faculties-schedule"
          onClick={() => onNavigate("faculties-schedule")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeSection === "faculties-schedule" || activeSection === "faculties" || activeSection === "schedule"
              ? "bg-white text-[#123f73] shadow-xs"
              : "text-white hover:bg-white/15"
          }`}
        >
          Faculties & Schedule
        </button>
        <button
          id="header-nav-photos"
          onClick={() => onNavigate("photos")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSection === "photos" ? "bg-white text-[#123f73] shadow-xs" : "text-white hover:bg-white/15"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Photos
        </button>
        <button
          id="header-nav-map"
          onClick={() => onNavigate("where-is-srgi")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSection === "where-is-srgi" ? "bg-white text-[#123f73] shadow-xs" : "text-amber-300 hover:bg-white/15"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          SRGI Map
        </button>
      </nav>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {onToggleDarkMode && (
          <button
            id="header-toggle-dark-mode-btn"
            onClick={onToggleDarkMode}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-300" />
            ) : (
              <Moon className="w-5 h-5 text-blue-200" />
            )}
          </button>
        )}

        {/* Menu Toggle Button */}
        <button
          id="open-menu-btn"
          onClick={onToggleMenu}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white text-[#123f73] hover:bg-blue-50 shadow-md font-bold text-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
