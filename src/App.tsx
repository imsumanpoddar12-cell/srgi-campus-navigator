import { useState, useEffect } from "react";
import Header from "./components/Header";
import MenuDropdown from "./components/MenuDropdown";
import HomeSection from "./components/HomeSection";
import CampusSearchSection from "./components/CampusSearchSection";
import BlockDetailSection from "./components/BlockDetailSection";
import AdminsSection from "./components/AdminsSection";
import FacultiesSection from "./components/FacultiesSection";
import ScheduleSection from "./components/ScheduleSection";
import CampusPhotosGallery from "./components/CampusPhotosGallery";
import AdminPhotosSection from "./components/AdminPhotosSection";
import FacultiesScheduleSection from "./components/FacultiesScheduleSection";
import OurTeamSection from "./components/OurTeamSection";
import AboutSection from "./components/AboutSection";
import AdminPanelSection from "./components/AdminPanelSection";
import WhereIsSRGISection from "./components/WhereIsSRGISection";
import SideMapDrawer from "./components/SideMapDrawer";
import AdminLoginModal from "./components/AdminLoginModal";
import AIAssistantModal from "./components/AIAssistantModal";
import AcknowledgementModal from "./components/AcknowledgementModal";
import SRGILogo from "./components/SRGILogo";

import {
  initialCollegeInfo,
  initialAdmins,
  initialTeamMembers,
  initialCampusLocations,
  facultiesList,
  cseSchedule,
} from "./data/campusData";
import { defaultCampusPhotos } from "./data/campusPhotos";
import { AdminUser, TeamMember, CampusLocation, CampusPhotoItem } from "./types";
import { Sparkles, Heart, ShieldCheck, Compass, Mic } from "lucide-react";

// Safe localStorage utilities to prevent unhandled quota/security exceptions
function safeGetItem(key: string): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {
    console.warn("Storage access not available:", e);
  }
  return null;
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn("Storage write skipped (quota or restricted iframe):", e);
  }
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn("Storage remove skipped:", e);
  }
}

function safeParse<T>(jsonStr: string | null, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  // State initialization with safe localStorage fallback
  const [collegeInfo] = useState(initialCollegeInfo);

  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    const saved = safeParse<AdminUser[]>(safeGetItem("srgi_admins"), []);
    // If empty or containing outdated credentials, migrate to new initialAdmins
    if (!saved || saved.length === 0 || !saved.some((a) => a.id === "suman92" || a.password === "a@12")) {
      safeSetItem("srgi_admins", JSON.stringify(initialAdmins));
      return initialAdmins;
    }
    // Automatically update admins with official photo URLs if missing or previous unsplash placeholder
    const updated = saved.map((admin) => {
      const match = initialAdmins.find((init) => init.id === admin.id);
      if (match && (!admin.avatarUrl || admin.avatarUrl.includes("unsplash.com"))) {
        return { ...admin, avatarUrl: match.avatarUrl };
      }
      return admin;
    });
    return updated;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = safeParse<TeamMember[]>(safeGetItem("srgi_team"), initialTeamMembers);
    const updated = saved.map((member) => {
      const match = initialTeamMembers.find((init) => init.id === member.id);
      if (match && (!member.photoUrl || member.photoUrl.includes("unsplash.com"))) {
        return { ...member, photoUrl: match.photoUrl };
      }
      return member;
    });
    return updated;
  });

  const [locations, setLocations] = useState<CampusLocation[]>(() => {
    const saved = safeParse<CampusLocation[]>(safeGetItem("srgi_locations"), initialCampusLocations);
    // Sanitize any outdated unsplash placeholder photos from saved locations
    const sanitized = saved.map((loc) => {
      const match = initialCampusLocations.find((init) => init.id === loc.id);
      if (loc.photoUrl && loc.photoUrl.includes("unsplash.com")) {
        return { ...loc, photoUrl: match?.photoUrl };
      }
      return loc;
    });
    // Ensure all new official locations from initialCampusLocations are present
    for (const initLoc of initialCampusLocations) {
      if (!sanitized.some((l) => l.id === initLoc.id)) {
        sanitized.unshift(initLoc);
      }
    }
    return sanitized;
  });

  const [customPhotos, setCustomPhotos] = useState<CampusPhotoItem[]>(() => {
    const saved = safeParse<CampusPhotoItem[]>(safeGetItem("srgi_photos"), []);
    // Ensure no third-party/unsplash photos linger in customPhotos cache
    return saved.filter((p) => p.imageUrl && !p.imageUrl.includes("unsplash.com"));
  });

  // Admin photos toggle state (requested by user to be able to show admin photos in menu / admin section)
  const [showAdminPhotos, setShowAdminPhotos] = useState<boolean>(() => {
    const saved = safeGetItem("srgi_show_admin_photos");
    return saved !== null ? safeParse(saved, true) : true;
  });

  const [loggedAdmin, setLoggedAdmin] = useState<AdminUser | null>(() => {
    return safeParse(safeGetItem("srgi_logged_admin"), null);
  });

  // Navigation State
  const [activeSection, setActiveSection] = useState<string>("home");
  const [selectedBlock, setSelectedBlock] = useState<string>("Block A");

  // Modals & Drawers
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSideMapOpen, setIsSideMapOpen] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAckModalOpen, setIsAckModalOpen] = useState<boolean>(false);

  // Persistence effects
  useEffect(() => {
    safeSetItem("srgi_admins", JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    safeSetItem("srgi_team", JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    safeSetItem("srgi_locations", JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    safeSetItem("srgi_photos", JSON.stringify(customPhotos));
  }, [customPhotos]);

  useEffect(() => {
    safeSetItem("srgi_show_admin_photos", JSON.stringify(showAdminPhotos));
  }, [showAdminPhotos]);

  useEffect(() => {
    if (loggedAdmin) {
      safeSetItem("srgi_logged_admin", JSON.stringify(loggedAdmin));
    } else {
      safeRemoveItem("srgi_logged_admin");
    }
  }, [loggedAdmin]);

  // Handlers
  const handleUpdateAdmin = (id: string, updated: Partial<AdminUser>) => {
    setAdmins((prev) =>
      prev.map((admin) => (admin.id === id ? { ...admin, ...updated } : admin))
    );
    if (loggedAdmin && loggedAdmin.id === id) {
      setLoggedAdmin((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const handleUpdateTeamMember = (id: string, updated: Partial<TeamMember>) => {
    setTeam((prev) =>
      prev.map((member) => (member.id === id ? { ...member, ...updated } : member))
    );
  };

  const handleAddLocation = (newLoc: CampusLocation) => {
    setLocations((prev) => [newLoc, ...prev]);
  };

  const handleDeleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const handleAddPhoto = (photo: CampusPhotoItem) => {
    setCustomPhotos((prev) => [photo, ...prev]);
  };

  const handleAddMultiplePhotos = (photos: CampusPhotoItem[]) => {
    setCustomPhotos((prev) => [...photos, ...prev]);
  };

  const handleDeletePhoto = (id: string) => {
    setCustomPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleOpenBlock = (blockName: string) => {
    setSelectedBlock(blockName);
    setActiveSection("block-detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setLoggedAdmin(null);
    if (activeSection === "admin") {
      setActiveSection("home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f9] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* Main App Header with Official SRGI Logo */}
      <Header
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        onNavigate={(sec) => {
          setActiveSection(sec);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        activeSection={activeSection}
      />

      {/* Navigation Menu Dropdown */}
      <MenuDropdown
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectSection={(sec) => {
          if (sec === "where-is-srgi") {
            setIsSideMapOpen(true);
            setActiveSection("where-is-srgi");
          } else {
            setActiveSection(sec);
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        activeSection={activeSection}
        isLoggedIn={!!loggedAdmin}
        loggedAdminName={loggedAdmin?.name}
        onLogout={handleLogout}
        showAdminPhotos={showAdminPhotos}
        onToggleAdminPhotos={() => setShowAdminPhotos((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeSection === "home" && (
          <HomeSection
            collegeInfo={collegeInfo}
            onExploreCampus={() => {
              setActiveSection("campus");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenBlock={handleOpenBlock}
            onOpenAI={() => setIsAIModalOpen(true)}
            onAcknowledge={() => setIsAckModalOpen(true)}
            onAdminLogin={() => {
              if (loggedAdmin) {
                setActiveSection("admin");
              } else {
                setIsAdminLoginOpen(true);
              }
            }}
            team={team}
            onUpdateTeamMember={handleUpdateTeamMember}
            isLoggedIn={!!loggedAdmin}
          />
        )}

        {activeSection === "campus" && (
          <CampusSearchSection
            locations={locations}
            customPhotos={customPhotos}
            onBack={() => {
              setActiveSection("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activeSection === "block-detail" && (
          <BlockDetailSection
            blockName={selectedBlock}
            locations={locations}
            customPhotos={customPhotos}
            onNavigateToPhotos={() => {
              setActiveSection("photos");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onBack={() => {
              setActiveSection("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {(activeSection === "admin-photos" || activeSection === "admins") && (
          <AdminPhotosSection
            admins={admins}
            onBack={() => {
              setActiveSection("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onUpdateAdmin={handleUpdateAdmin}
            isLoggedIn={!!loggedAdmin}
            currentAdminId={loggedAdmin?.id}
          />
        )}

        {(activeSection === "faculties-schedule" ||
          activeSection === "faculties" ||
          activeSection === "schedule") && (
          <FacultiesScheduleSection
            faculties={facultiesList}
            schedule={cseSchedule}
            defaultTab={activeSection === "schedule" ? "schedule" : "faculties"}
            onBack={() => {
              setActiveSection("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activeSection === "photos" && (
          <CampusPhotosGallery
            customPhotos={customPhotos}
            onAddPhoto={handleAddPhoto}
            onAddMultiplePhotos={handleAddMultiplePhotos}
            onDeletePhoto={handleDeletePhoto}
            onBack={() => {
              setActiveSection("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            isLoggedIn={!!loggedAdmin}
          />
        )}

        {activeSection === "team" && (
          <div className="py-8">
            <div className="max-w-6xl mx-auto px-4 mb-4">
              <button
                onClick={() => {
                  setActiveSection("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors"
              >
                ← Back to Home
              </button>
            </div>
            <OurTeamSection
              team={team}
              onUpdateTeamMember={handleUpdateTeamMember}
              isLoggedIn={!!loggedAdmin}
            />
          </div>
        )}

        {activeSection === "where-is-srgi" && (
          <div className="py-6">
            <div className="max-w-6xl mx-auto px-4 mb-4">
              <button
                onClick={() => {
                  setActiveSection("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-4 py-2 bg-[#123f73] text-white rounded-xl text-xs font-bold hover:bg-[#0e315b] transition-colors flex items-center gap-1.5"
              >
                ← Back to Home
              </button>
            </div>
            <WhereIsSRGISection />
          </div>
        )}

        {activeSection === "about" && (
          <AboutSection
            collegeInfo={collegeInfo}
            onBack={() => {
              setActiveSection("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activeSection === "admin" && loggedAdmin && (
          <AdminPanelSection
            currentAdmin={loggedAdmin}
            locations={locations}
            onAddLocation={handleAddLocation}
            onDeleteLocation={handleDeleteLocation}
            team={team}
            onUpdateTeamMember={handleUpdateTeamMember}
            onUpdateAdmin={handleUpdateAdmin}
            onBack={() => {
              setActiveSection("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Floating Sticky Bottom Bar for Quick Actions */}
      <aside
        aria-label="Quick Action Toolbar"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl shadow-blue-950/15 border border-slate-200/80 flex items-center gap-2 max-w-[calc(100vw-32px)]"
      >
        <button
          id="dock-map-btn"
          onClick={() => setIsSideMapOpen(true)}
          className="px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl flex items-center gap-1.5 transition-colors border border-amber-200"
        >
          <Compass className="w-4 h-4 text-amber-600" />
          <span className="hidden sm:inline">SRGI Map</span>
        </button>

        <button
          id="dock-explore-btn"
          onClick={() => {
            setActiveSection("campus");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Compass className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Explore Map</span>
        </button>

        <button
          id="dock-ai-assistant-btn"
          onClick={() => setIsAIModalOpen(true)}
          className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#123f73] to-[#1261a0] text-white rounded-xl shadow-md flex items-center gap-1.5 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Gemini AI</span>
          <Mic className="w-3.5 h-3.5 text-blue-200 ml-0.5" />
        </button>

        <button
          id="dock-ack-btn"
          onClick={() => setIsAckModalOpen(true)}
          className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-rose-700 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span className="hidden sm:inline">Acknowledge</span>
        </button>

        {loggedAdmin ? (
          <button
            id="dock-admin-panel-btn"
            onClick={() => {
              setActiveSection("admin");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-200"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        ) : (
          <button
            id="dock-admin-login-btn"
            onClick={() => setIsAdminLoginOpen(true)}
            className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Login</span>
          </button>
        )}
      </aside>

      {/* Footer */}
      <footer className="bg-[#0b2444] text-white pt-10 pb-20 border-t border-blue-900 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-blue-900/60">
            <div className="flex items-center gap-3.5">
              <SRGILogo size={52} />
              <div>
                <h3 className="text-base font-black text-white">SR GROUP OF INSTITUTIONS</h3>
                <p className="text-xs text-blue-200">
                  NH-24, Sitapur Road, Bakshi Ka Talab, Lucknow, Uttar Pradesh 226201
                </p>
              </div>
            </div>

            <div className="text-xs text-blue-200 text-center md:text-right space-y-1">
              <div>
                <b>Campus Area:</b> 65 Acres • <b>Established:</b> 2009 • <b>Branches:</b> 10+
              </div>
              <div>
                <b>Boys Hostel:</b> 300m from Main Gate • <b>Cafes:</b> 2nd Gate of College
              </div>
              <div>
                <b>Medicines & Store:</b> Behind Block D • <b>Seminar Hall:</b> 20m from Cafeteria (Block B se 20m left, 20m right)
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300 gap-3 text-center sm:text-left">
            <div>
              © {new Date().getFullYear()} SRGI Campus Navigator • Built with pride by Suman Kumar (Leader), Vivek Sahani (Co-Leader) & Team.
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSideMapOpen(true)}
                className="hover:text-amber-300 underline cursor-pointer font-semibold text-amber-200"
              >
                📍 Find SRGI Map
              </button>
              <button
                onClick={() => setIsAckModalOpen(true)}
                className="hover:text-white underline cursor-pointer"
              >
                Acknowledgements
              </button>
              <button
                onClick={() => {
                  setActiveSection("team");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white underline cursor-pointer"
              >
                Our Team
              </button>
              <button
                onClick={() => {
                  if (loggedAdmin) {
                    setActiveSection("admin");
                  } else {
                    setIsAdminLoginOpen(true);
                  }
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white underline cursor-pointer"
              >
                {loggedAdmin ? "Admin Dashboard" : "Admin Portal"}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <SideMapDrawer
        isOpen={isSideMapOpen}
        onOpen={() => setIsSideMapOpen(true)}
        onClose={() => setIsSideMapOpen(false)}
        onOpenFullPage={() => {
          setActiveSection("where-is-srgi");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        admins={admins}
        onLoginSuccess={(admin) => {
          setLoggedAdmin(admin);
          setActiveSection("admin");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <AcknowledgementModal
        isOpen={isAckModalOpen}
        onClose={() => setIsAckModalOpen(false)}
      />
    </div>
  );
}
