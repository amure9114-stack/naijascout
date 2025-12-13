// frontend/src/pages/player/Dashboard.jsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Top NavBar removed for player pages (persistent bottom nav used instead)
import PlayerCard from "./PlayerCard";
import PerformanceAnalytics from "./PerformanceAnalytics";
import Trials from "./FindTrials";
import InjuryManagement from "./InjuryManagement";
import VirtualTryout from "./VirtualTryout";
import Button from "../../components/Button";

gsap.registerPlugin(ScrollTrigger);

export default function PlayerDashboard() {
  const videoRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollVelocity = useRef(0);
  const animationFrameId = useRef(null);
  const navigate = useNavigate();

  // Protected: Redirect if not logged in as player
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "player") {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  // Scroll-synced video magic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;
      scrollVelocity.current = Math.abs(deltaY);
      lastScrollY.current = currentScrollY;
    };

    const updateVideoSpeed = () => {
      if (videoRef.current && scrollVelocity.current > 0) {
        scrollVelocity.current *= 0.95;
        const speed = 0.5 + Math.min(scrollVelocity.current / 10, 2.5);
        videoRef.current.playbackRate = Math.max(0.3, Math.min(speed, 3.0));
      }
      animationFrameId.current = requestAnimationFrame(updateVideoSpeed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateVideoSpeed();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Sponsorships Section
  const sponsorships = [
    {
      name: "First Bank Sports Scholarship",
      type: "Corporate",
      amount: "₦500,000 - ₦1.2M",
      location: "Nationwide",
      focus: "Elite Athletes",
      gradient: "from-blue-500 to-cyan-600",
      featured: true,
    },
    {
      name: "Lagos Sports Foundation",
      type: "Non-Profit",
      amount: "₦300,000 - ₦800,000",
      location: "Lagos",
      focus: "Youth Development",
      gradient: "from-red-500 to-pink-600",
    },
    {
      name: "Dangote Sports Initiative",
      type: "Private",
      amount: "₦200,000 - ₦600,000",
      location: "Northern Nigeria",
      focus: "Grassroots",
      gradient: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-black font-general">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-40"
        src="/videos/playback.mp4"
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="pt-6 px-6 max-w-7xl mx-auto">
          {/* Hero Card */}
          <div className="mb-20">
            <PlayerCard className="player-card" />
          </div>

          {/* Performance */}
          <section className="mb-20">
            <PerformanceAnalytics />
          </section>

          {/* Trials */}
          <section className="mb-20">
            <Trials />
          </section>

          {/* Injury Management */}
          <section className="mb-20">
            <InjuryManagement />
          </section>

          {/* Virtual Tryout */}
          <section className="mb-20">
            <VirtualTryout />
          </section>

          {/* Sponsorships */}
          <section className="py-20">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Available Sponsorships
              </h2>
              <p className="text-xl text-green-200">
                Get funded. Get seen. Get to Europe.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {sponsorships.map((s, i) => (
                <div
                  key={i}
                  className={`relative group cursor-pointer rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-105 ${s.featured ? "md:col-span-3 lg:col-span-1" : ""
                    }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-90`} />
                  <div className="relative p-10 text-white">
                    {s.featured && (
                      <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold">
                        FEATURED
                      </div>
                    )}
                    <div className="text-6xl mb-6">{i === 0 ? "Bank" : i === 1 ? "Heart" : "Crown"}</div>
                    <h3 className="text-3xl font-bold mb-2">{s.name}</h3>
                    <p className="text-lg opacity-90 mb-4">{s.type} • {s.location}</p>
                    <p className="text-4xl font-bold text-yellow-300">{s.amount}</p>
                    <p className="text-sm mt-2 opacity-80">per year</p>
                    <p className="mt-6 text-lg">Focus: {s.focus}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                title="View All Opportunities"
                onClick={() => navigate("/player/sponsorships")}
                containerClass="px-12 py-5 bg-green-600 hover:bg-green-500 text-black font-bold text-xl rounded-2xl shadow-2xl"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}