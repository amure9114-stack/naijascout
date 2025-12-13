import { Routes, Route, useLocation } from "react-router-dom";
import PersonalizedDashboard from "./pages/player/PersonalizedDashboard.jsx";
import Sponsorship from "./pages/player/Sponsorships.jsx";
import Trials from "./pages/player/FindTrials.jsx";
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import PlayerBottomNav from "./components/PlayerBottomNav";
import ScoutBottomNav from "./components/ScoutBottomNav";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PerformanceAnalytics from "./pages/player/PerformanceAnalytics.jsx";
import PlayerSettings from "./pages/player/Settings.jsx";
import ScoutProfile from "./pages/scout/ScoutProfile.jsx";
import PlayerHologram from "./components/PlayerHologram.jsx";
import PlayerPool from "./components/PlayerPool.jsx";
import ScoutPlayerPool from "./pages/scout/PlayerPool.jsx";
import ShortlistedPlayers from "./pages/scout/ShortlistedPlayers.jsx";
import Analytics from "./pages/scout/Analytics.jsx";
import TrialsManagement from "./pages/scout/trials.jsx";
import TrialsNotFound from "./pages/scout/trials.not.found.jsx";

// Placeholder dashboards (create these files as needed)
// Fan and Academy dashboards are removed (scoped to Scout & Player only)

// Auth components
import Login from "@auth/Login.jsx";
import Register from "@auth/Register.jsx";
import ForgotPassword from "@auth/ForgotPassword.jsx";
import VerifyEmail from "@auth/VerifyEmail.jsx";
import AuthDashboard from "@auth/AuthDashboard.jsx";

function App() {
  const { pathname } = useLocation();
  const isPlayer = pathname.startsWith("/player");
  const isScout = pathname.startsWith("/scout");
  const isAuth = pathname.startsWith("/auth");
  // only player and scout routes are supported

  // Determine the current role from state or local storage (placeholder logic)
  const { state } = useLocation();
  const userRole = state?.role || localStorage.getItem("userRole") || "scout"; // Default to "scout" when not set

  // Navigation links based on role
  const playerLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/player/dashboard" },
    { name: "Trials", path: "/player/trials" },
    { name: "Sponsorships", path: "/player/sponsorships" },
    { name: "Analytics", path: "/player/analytics" },
  ];

  const scoutLinks = [
    { name: "Home", path: "/" },
    { name: "Profile", path: "/scout/profile" },
    { name: "Reports", path: "/scout/reports" },
    { name: "Players", path: "/scout/players" },
    { name: "Analytics", path: "/scout/analytics" },
    { name: "Settings", path: "/scout/settings" },
  ];

  // Fan and Academy links removed to keep app focused on Scout and Player roles

  // Determine which links to show based on the current role
  const links = isPlayer ? playerLinks : isScout ? scoutLinks : [];

  return (
    <main className="relative min-h-screen bg-black w-screen overflow-x-hidden font-circular">
      {/* Hide top NavBar on player, scout and auth pages (we use bottom nav for player/scout) */}
      {!isPlayer && !isScout && !isAuth && <NavBar variant={isPlayer ? "player" : undefined} links={links} />}
      <ErrorBoundary>
        <Routes>
          <Route path="/player/dashboard" element={<PersonalizedDashboard />} />
          <Route path="/player/settings" element={<PlayerSettings />} />
          <Route path="/player/sponsorships" element={<Sponsorship />} />
          <Route path="/player/trials" element={<Trials />} />
          <Route path="/player/analytics" element={<PerformanceAnalytics />} />
          <Route path="/player/hologram" element={<PlayerHologram />} />
          <Route path="/scout/profile" element={<ScoutProfile />} />
          <Route path="/scout/reports" element={<ScoutProfile />} />
          <Route path="/scout/players" element={<ScoutPlayerPool />} />
          <Route path="/scout/shortlisted" element={<ShortlistedPlayers />} />
          <Route path="/scout/analytics/:playerId" element={<Analytics />} />
          <Route path="/scout/analytics" element={<ScoutProfile />} />
          <Route path="/scout/settings" element={<ScoutProfile />} />
          <Route path="/scout/trials" element={<TrialsManagement />} />
          <Route path="/scout/schedule-trial" element={<TrialsManagement />} />
          <Route path="/scout/trials/not-found" element={<TrialsNotFound />} />
          {/* Fan and Academy routes removed */}
          <Route path="/scout/add-player" element={<ScoutPlayerPool />} />
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <Features />
                <Story />
                <Contact />
                <Footer />
              </>
            }
          />
          {/* Add auth routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/dashboard" element={<AuthDashboard />} />
        </Routes>
      </ErrorBoundary>
      {isPlayer && <PlayerBottomNav />}
      {isScout && <ScoutBottomNav />}
    </main>
  );
}

export default App;