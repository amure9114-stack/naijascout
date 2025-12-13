import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { Link, useLocation } from "react-router-dom";

import Button from "./Button";

// Updated navigation items for NaijaScout theme
const defaultNavItems = ["Home", "Scouts", "Players", "About", "Contact"];
const playerNavItems = ["Home", "Dashboard", "About", "Contact"];
const scoutNavItems = ["Home", "Profile", "Reports", "Players", "Analytics", "Settings"];

const NavBar = ({ variant, links }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { pathname } = useLocation();
  const isPlayerRoute = pathname.startsWith("/player");
  const isScoutRoute = pathname.startsWith("/scout");
  const isFanRoute = pathname.startsWith("/fan");
  const isAcademyRoute = pathname.startsWith("/academy");
  const isPlayerVariant = variant === "player" || isPlayerRoute;
  const isScoutVariant = variant === "scout" || isScoutRoute;
  const isFanVariant = variant === "fan" || isFanRoute;
  const isAcademyVariant = variant === "academy" || isAcademyRoute;

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  const items = isPlayerVariant ? playerNavItems : isScoutVariant ? scoutNavItems : defaultNavItems;
  const showJoinNow = !isPlayerVariant && !isScoutVariant && !isFanVariant && !isAcademyVariant;

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6  backdrop-blur-md rounded-lg border border-white/10"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Product button */}
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-14 rounded-lg" />

            {showJoinNow && (
              <Button
                id="product-button"
                title="Join Now"
                rightIcon={<TiLocationArrow />}
                containerClass="bg-green-600 text-white hover:bg-white hover:text-green-600 md:flex hidden items-center justify-center gap-1 transition-colors duration-300"
                onClick={() => window.location.href = "/auth/dashboard"}
              />
            )}
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {links
                ? links.map((link) => (
                    <Link key={link.name} to={link.path} className="nav-hover-btn">
                      {link.name}
                    </Link>
                  ))
                : items.map((item) => {
                    // If we're in a dashboard, navigate to actual pages instead of auth
                    if (isPlayerVariant) {
                      if (item === "Dashboard") {
                        return <Link key={item} to="/player/dashboard" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "About") {
                        return <a key={item} href="#about" className="nav-hover-btn">{item}</a>;
                      } else if (item === "Contact") {
                        return <a key={item} href="#contact" className="nav-hover-btn">{item}</a>;
                      } else if (item === "Home") {
                        return <Link key={item} to="/" className="nav-hover-btn">{item}</Link>;
                      }
                    } else if (isScoutVariant) {
                      if (item === "Profile") {
                        return <Link key={item} to="/scout/profile" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Reports") {
                        return <Link key={item} to="/scout/reports" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Players") {
                        return <Link key={item} to="/scout/players" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Analytics") {
                        return <Link key={item} to="/scout/analytics" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Settings") {
                        return <Link key={item} to="/scout/settings" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Home") {
                        return <Link key={item} to="/" className="nav-hover-btn">{item}</Link>;
                      }
                    } else if (isFanVariant) {
                      if (item === "Dashboard") {
                        return <Link key={item} to="/fan/dashboard" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Feed") {
                        return <Link key={item} to="/fan/feed" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Community") {
                        return <Link key={item} to="/fan/community" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Predictions") {
                        return <Link key={item} to="/fan/predictions" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Home") {
                        return <Link key={item} to="/" className="nav-hover-btn">{item}</Link>;
                      }
                    } else if (isAcademyVariant) {
                      if (item === "Dashboard") {
                        return <Link key={item} to="/academy/dashboard" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Players") {
                        return <Link key={item} to="/academy/players" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Trials") {
                        return <Link key={item} to="/academy/trials" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Settings") {
                        return <Link key={item} to="/academy/settings" className="nav-hover-btn">{item}</Link>;
                      } else if (item === "Home") {
                        return <Link key={item} to="/" className="nav-hover-btn">{item}</Link>;
                      }
                    } else {
                      // Default navigation for home page
                      if (item === "Players" || item === "Dashboard" || item === "Scouts" || item === "Profile" || item === "Reports" || item === "Analytics" || item === "Settings") {
                        return <Link key={item} to="/auth/dashboard" className="nav-hover-btn">{item}</Link>;
                      } else {
                        return <a key={item} href={`#${item.toLowerCase()}`} className="nav-hover-btn">{item}</a>;
                      }
                    }
                    return null;
                  })}
            </div>

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
