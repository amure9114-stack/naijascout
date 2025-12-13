// frontend/src/pages/scout/ScoutProfile.jsx
import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from 'framer-motion';
import { pageFade, listContainer, listItem } from '../../lib/animations';
import Button from '../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
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
  const [selectedSection, setSelectedSection] = useState("profile");
  const [notifications, setNotifications] = useState({ trials: true, updates: false });
  const [profile, setProfile] = useState({ name: "John Doe", role: "Lead Scout" });

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
    navigate("/auth");
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
    { name: "Profile", icon: <FaUsers className="mr-3" />, section: "profile" },
    { name: "Players", icon: <FaSearch className="mr-3" />, section: "players" },
    { name: "Reports", icon: <FaFileAlt className="mr-3" />, section: "shortlisted" },
    { name: "Analytics", icon: <FaChartBar className="mr-3" />, section: "shortlisted" },
    { name: "Trials", icon: <FaCalendar className="mr-3" />, section: "trials" },
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
              {/* Profile Section */}
              {selectedSection === "profile" && (
                <>
                  <Card className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-3xl p-4 sm:p-6 header">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                      <div>
                        <p className="text-white/60 text-sm">Welcome back! Manage your scouting network</p>
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
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left w-full sm:w-auto">
                        <h3 className="text-xl sm:text-2xl font-semibold text-white">{profile.name}</h3>
                        <p className="text-white/60 text-sm">{profile.role}</p>
                        <Button containerClass="mt-2 sm:mt-4 w-full sm:w-auto" onClick={() => setSelectedSection("settings")}>Edit Profile</Button>
                      </div>
                    </div>
                  </Card>

                  {selectedSection === "settings" && (
                    <Card className="backdrop-blur-xl bg-black/20 border border-white/20 rounded-3xl p-4 sm:p-6 settings">
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Settings</h3>
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="text-white/80 text-sm sm:text-base">Name</label>
                          <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-1 sm:mt-2 w-full" />
                        </div>
                        <div>
                          <label className="text-white/80 text-sm sm:text-base">Role</label>
                          <Input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className="mt-1 sm:mt-2 w-full" />
                        </div>
                        <Button onClick={() => setSelectedSection("profile")} className="mt-3 sm:mt-4 w-full sm:w-auto">Save Changes</Button>
                      </div>
                    </Card>
                  )}
                </>
              )}

              {/* Players → Full PlayerPool */}
              {selectedSection === "players" && (
                <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                  <PlayerPool />
                </motion.div>
              )}

              {/* Reports & Analytics → Only Shortlisted */}
              {selectedSection === "shortlisted" && <ShortlistedPlayers />}

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