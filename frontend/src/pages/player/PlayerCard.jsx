import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from '../../components/Button';

gsap.registerPlugin(ScrollTrigger);

const PlayerCard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from(".player-image", { duration: 1, opacity: 0, x: -100, ease: "power2.out" });
    gsap.from(".player-info", { duration: 1, opacity: 0, x: 100, ease: "power2.out", delay: 0.2 });
    gsap.from(".stats", { duration: 1, opacity: 0, y: 50, ease: "power2.out", delay: 0.4 });
    gsap.from(".achievement", { duration: 1, opacity: 0, y: 50, stagger: 0.2, ease: "power2.out", delay: 0.6 });
  }, []);

  const handleImageClick = () => {
    navigate("/player/hologram");
  };

  return (
    <div className="container mx-auto p-6 font-sans font-robert-regular">
      <div className="flex flex-col md:flex-row items-center justify-between bg-black/70 shadow-lg rounded-lg p-6 relative overflow-hidden">
        <div className="flex-shrink-0 player-image">
          <img
            src="/img/gallery-1.webp"
            alt="Player Image"
            className="w-64 h-80 object-cover rounded-full transition-transform duration-300 hover:scale-105 cursor-pointer"
            data-hover="opacity"
            onClick={handleImageClick}
          />
        </div>
        <div className="flex-1 ml-6 text-center md:text-left player-info">
          <h1 className="text-4xl font-bold text-white">01</h1>
          <h2 className="text-3xl font-semibold text-white">Mardy Collins</h2>
          <p className="text-lg text-white">Defender</p>
          <Button title="BIOGRAPHY" containerClass="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-white hover:text-green-600 transition duration-300" />
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-black bg-opacity-50 p-4 rounded-lg shadow-md text-center achievement" data-hover="opacity">
          <h3 className="text-xl font-semibold text-white">2010</h3>
          <p className="text-white">Winner of Serbia</p>
        </div>
        <div className="bg-black bg-opacity-50 p-4 rounded-lg shadow-md text-center achievement" data-hover="opacity">
          <h3 className="text-xl font-semibold text-white">2014</h3>
          <p className="text-white">D-league All-star match</p>
        </div>
        <div className="bg-black bg-opacity-50 p-4 rounded-lg shadow-md text-center achievement" data-hover="opacity">
          <h3 className="text-xl font-semibold text-white">2016</h3>
          <p className="text-white">Cup of Russia</p>
        </div>
        <div className="bg-black bg-opacity-50 p-4 rounded-lg shadow-md text-center achievement" data-hover="opacity">
          <h3 className="text-xl font-semibold text-white">2017</h3>
          <p className="text-white">NCAA Final Four</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;