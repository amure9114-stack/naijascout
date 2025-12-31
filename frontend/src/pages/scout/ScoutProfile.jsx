// frontend/src/pages/scout/ScoutProfile.jsx
import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from 'framer-motion';
import { pageFade, listContainer, listItem } from '../../lib/animations';
import Button from '../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { usePlayers } from '../../context/PlayerContext.jsx';
import {
  FaFileAlt, FaChartBar, FaRegEnvelope, FaSearch, FaUsers,
  FaBullseye, FaCalendar, FaBell, FaCog, FaPlus, FaCrown, FaSignOutAlt
} from 'react-icons/fa';

// IMPORT YOUR ACTUAL COMPONENTS
import PlayerPool from "./PlayerPool";
import ShortlistedPlayers from "./ShortlistedPlayers";
import TrialsManagement from "./trials";  // ← Your real trials.jsx

gsap.registerPlugin(ScrollTrigger);

const Card = ({ children, className }) => <div className={`bg-black/20 border border-white/20 rounded-3xl p-6 ${className}`}>{children}</div>;
const Input = ({ className, ...props }) => <input className={`bg-white/10 border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:border-green-500 focus:bg-white/15 ${className}`} {...props} />;
const Avatar = ({ children, className }) => <div className={`rounded-full overflow-hidden ${className}`}>{children}</div>;
const AvatarFallback = ({ children, className }) => <div className={`bg-white/20 text-white text-sm flex items-center justify-center w-full h-full ${className}`}>{children}</div>;

export function ScoutProfile() {
  const navigate = useNavigate();
  const { shortlist } = usePlayers();
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [notifications, setNotifications] = useState({ trials: true, updates: false });
  const [profile, setProfile] = useState({ name: "John Doe", role: "Lead Scout" });
  const [settingsForm, setSettingsForm] = useState({
    experience: "3-5 years",
    certifications: "CAF D License",
    regions: "Lagos, Abuja, Port Harcourt",
    preferredPositions: "Forwards, Wingers, Fullbacks",
    strengths: "High potential identification, technical analysis",
    photoUrl: "",
    videoUrl: "",
    bio: "Passionate about unearthing Nigerian talent and supporting their pathway to the pros."
  });
  const [settingsError, setSettingsError] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  // PROTECTED + LOGOUT
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "scout") {
      navigate("/auth", { replace: true });
      return;
    }

    // Fetch authenticated user profile and populate UI
    (async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const resp = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) return;
        const body = await resp.json();
        if (body?.success && body.user) {
          setProfile({ name: body.user.name || body.user.username, role: body.user.role || role });
        }
      } catch (e) {
        // ignore — keep defaults
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    navigate("/");
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(".header", { opacity: 0, y: 50, duration: 1.2, ease: "power3.out", scrollTrigger: ".header" });
    gsap.from(".profile-card", { opacity: 0, x: -100, duration: 1.5, ease: "elastic.out(1, 0.3)", scrollTrigger: ".profile-card" });
    // Only animate settings when the settings element is present (settings panel is conditionally rendered)
    if (document.querySelector('.settings')) {
      gsap.from(".settings", { opacity: 0, x: 100, duration: 1.5, ease: "back.out(1.7)", scrollTrigger: ".settings" });
    }
    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, []);

  const mainMenu = [
    { name: "Dashboard", icon: <FaBullseye className="mr-3" />, section: "dashboard" },
    { name: "Players", icon: <FaSearch className="mr-3" />, section: "players" },
    { name: "Reports", icon: <FaFileAlt className="mr-3" />, section: "shortlisted" },
    { name: "Analytics", icon: <FaChartBar className="mr-3" />, section: "analytics" },
    { name: "Trials", icon: <FaCalendar className="mr-3" />, section: "trials" },
    { name: "Settings", icon: <FaCog className="mr-3" />, section: "settings" },
  ];

  return (
    <div className="h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-fill opacity-50 bg-center bg-no-repeat" style={{ backgroundImage: `url('/img/logo.png')` }} />
      <div className="bg-black/50 absolute inset-0" />

      <div className="relative z-10 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 h-screen">
        {/* Left Sidebar — YOUR ORIGINAL */}
        <Card className="col-span-1 md:col-span-2 backdrop-blur-xl mt-9 bg-black/20 border border-white/20 rounded-3xl p-4 sm:p-6 h-fit flex flex-col">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <Link to="/" className="inline-block">
                <h1 className="text-xl sm:text-xl font-bold text-white hover:text-green-400 transition-colors">NaijaScout</h1>
                <p className="text-white/60 text-xs sm:text-sm">Scout Hub</p>
              </Link>
            </div>

            <div>
              <h4 className="text-white/80 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-3">Main Menu</h4>
              <nav className="space-y-2">
                <motion.div variants={listContainer} initial="initial" animate="animate">
                  {mainMenu.map((item) => (
                    <motion.div key={item.name} variants={listItem}>
                      <Button
                        containerClass={`w-full justify-start text-sm sm:text-base text-white/80 hover:bg-green-600 hover:text-white transition-all duration-300 ease-out ${selectedSection === item.section ? "bg-green-600/30 text-white" : ""}`}
                        onClick={() => {
                          if (item.section === 'players') {
                            navigate('/scout/players');
                          } else {
                            setSelectedSection(item.section);
                          }
                        }}
                      >
                        {item.icon}
                        {item.name}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              </nav>
            </div>
          </div>

          <div className="flex-shrink-0 space-y-4 pt-2 sm:pt-4 border-t border-white/10">
            <Button
              containerClass="w-full justify-start text-sm sm:text-base text-white/80 hover:bg-green-600/20 hover:text-white transition-all duration-700 ease-out hover:scale-[1.02]"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </Button>
          </div>
        </Card>

        {/* MAIN CONTENT — FIXED */}
        <div className="col-span-1 mt-9 md:col-span-10 h-screen overflow-y-auto">
          <AnimatePresence exitBeforeEnter>
            <motion.div key={selectedSection} variants={pageFade} initial="initial" animate="animate" exit="exit" className="space-y-6">
              {/* Dashboard */}
              {selectedSection === "dashboard" && (
                <>
                  <Card className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-3xl p-4 sm:p-6 header">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                      <div>
                        <p className="text-white/60 text-sm">Dashboard — {profile.name}</p>
                        <p className="text-white text-base font-semibold">{profile.role}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 w-full sm:w-auto">
                        <div className="relative w-full sm:w-70 mb-4 sm:mb-0">
                          <Input placeholder="Search players..." className="w-full" />
                        </div>
                        <Button containerClass="w-full sm:w-auto text-white/80 hover:bg-green-600/20 hover:text-white">
                          <FaBell className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-3xl p-4 sm:p-6 profile-card">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                      <Avatar className="w-24 sm:w-32 h-24 sm:h-32 border-4 border-green-600">
                        <AvatarFallback>{profile.name?.slice(0, 2)?.toUpperCase() || 'SC'}</AvatarFallback>
                      </Avatar>
                      <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left w-full sm:w-auto">
                        <h3 className="text-xl sm:text-2xl font-semibold text-white">{profile.name}</h3>
                        <p className="text-white/60 text-sm">{profile.role}</p>
                        <Button containerClass="mt-2 sm:mt-4 w-full sm:w-auto" onClick={() => setSelectedSection("settings")}>Edit Profile</Button>
                      </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    <Card className="backdrop-blur-xl bg-black/20 border border-white/20">
                      <h4 className="text-white font-semibold mb-2">Active Shortlists</h4>
                      <p className="text-3xl font-display font-bold text-green-400">{shortlist.length}</p>
                      <p className="text-white/60 text-sm mt-1">Players you are tracking right now</p>
                    </Card>
                    <Card className="backdrop-blur-xl bg-black/20 border border-white/20">
                      <h4 className="text-white font-semibold mb-2">Upcoming Trials</h4>
                      <p className="text-3xl font-display font-bold text-green-400">2</p>
                      <p className="text-white/60 text-sm mt-1">Stay ready for invitations and updates</p>
                    </Card>
                    <Card className="backdrop-blur-xl bg-black/20 border border-white/20">
                      <h4 className="text-white font-semibold mb-2">New Leads</h4>
                      <p className="text-3xl font-display font-bold text-green-400">5</p>
                      <p className="text-white/60 text-sm mt-1">Fresh players shared with you</p>
                    </Card>
                  </div>
                </>
              )}

              {/* Settings */}
              {selectedSection === "settings" && (
                <Card className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-3xl p-4 sm:p-6 settings">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Scout Qualifications & Verification</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-white/80 text-sm sm:text-base">Name</label>
                        <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-1 sm:mt-2 w-full" />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm sm:text-base">Role / Title</label>
                        <Input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="mt-1 sm:mt-2 w-full" />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm sm:text-base">Experience</label>
                        <Input value={settingsForm.experience} onChange={(e) => setSettingsForm({ ...settingsForm, experience: e.target.value })} className="mt-1 sm:mt-2 w-full" />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm sm:text-base">Certifications</label>
                        <Input value={settingsForm.certifications} onChange={(e) => setSettingsForm({ ...settingsForm, certifications: e.target.value })} className="mt-1 sm:mt-2 w-full" />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm sm:text-base">Regions Covered</label>
                        <Input value={settingsForm.regions} onChange={(e) => setSettingsForm({ ...settingsForm, regions: e.target.value })} className="mt-1 sm:mt-2 w-full" />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm sm:text-base">Preferred Positions</label>
                        <Input value={settingsForm.preferredPositions} onChange={(e) => setSettingsForm({ ...settingsForm, preferredPositions: e.target.value })} className="mt-1 sm:mt-2 w-full" />
                      </div>
                    </div>

                    <div>
                      <label className="text-white/80 text-sm sm:text-base">Scouting Bio</label>
                      <textarea
                        value={settingsForm.bio}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                        className="w-full mt-1 sm:mt-2 rounded-xl bg-white/10 border border-white/30 text-white placeholder:text-white/50 p-3 focus:border-green-500 focus:bg-white/15"
                        rows={3}
                        placeholder="Share how you scout, your philosophy, and how clubs can reach you."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-white/80 text-sm sm:text-base">Profile Photo URL</label>
                        <Input value={settingsForm.photoUrl} onChange={(e) => setSettingsForm({ ...settingsForm, photoUrl: e.target.value })} className="mt-1 sm:mt-2 w-full" placeholder="Link to your scout photo" />
                      </div>
                      <div>
                        <label className="text-white/80 text-sm sm:text-base">Verification Video URL</label>
                        <Input value={settingsForm.videoUrl} onChange={(e) => setSettingsForm({ ...settingsForm, videoUrl: e.target.value })} className="mt-1 sm:mt-2 w-full" placeholder="Short intro or highlights video" />
                      </div>
                    </div>
                    <p className="text-xs text-white/70">Provide at least one media link (photo or video) for verification.</p>

                    {settingsError && <p className="text-destructive text-sm">{settingsError}</p>}
                    {settingsSaved && !settingsError && <p className="text-green-400 text-sm">Saved — your qualifications are updated.</p>}

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <Button onClick={() => {
                        if (!settingsForm.photoUrl && !settingsForm.videoUrl) {
                          setSettingsError("Please add a profile photo or a short video link for verification.");
                          setSettingsSaved(false);
                          return;
                        }
                        setSettingsError("");
                        setSettingsSaved(true);
                        setTimeout(() => setSettingsSaved(false), 2500);
                        setSelectedSection("dashboard");
                      }}
                      >Save & Verify</Button>
                      <Button containerClass="bg-transparent border border-white/30" onClick={() => setSelectedSection("dashboard")}>Cancel</Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Players → Full PlayerPool */}
              {selectedSection === "players" && (
                <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                  <PlayerPool />
                </motion.div>
              )}

              {/* Reports */}
              {selectedSection === "shortlisted" && <ShortlistedPlayers />}

              {/* Analytics */}
              {selectedSection === "analytics" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="backdrop-blur-xl bg-black/20 border border-white/20">
                    <h4 className="text-white font-semibold mb-2">Pipeline Overview</h4>
                    <ul className="text-white/80 space-y-1 text-sm">
                      <li>• 5 new leads added this week</li>
                      <li>• 2 players invited to trials</li>
                      <li>• 1 player signed to shortlist club</li>
                    </ul>
                  </Card>
                  <Card className="backdrop-blur-xl bg-black/20 border border-white/20">
                    <h4 className="text-white font-semibold mb-2">Focus Areas</h4>
                    <ul className="text-white/80 space-y-1 text-sm">
                      <li>• Need left-footed fullbacks</li>
                      <li>• Priority age bracket: 18-23</li>
                      <li>• Monitor pace and physicality metrics</li>
                    </ul>
                  </Card>
                </div>
              )}

              {/* Trials → Your real trials.jsx */}
              {selectedSection === "trials" && <TrialsManagement />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default ScoutProfile;
