
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlayerHologram() {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [scanLine, setScanLine] = useState(0);

  // Animate rotation and scan lines
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);

    const scanInterval = setInterval(() => {
      setScanLine(prev => (prev + 2) % 100);
    }, 100);

    return () => {
      clearInterval(rotationInterval);
      clearInterval(scanInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Back Button */}
      <button
        className="absolute top-4 right-4 text-white text-3xl bg-none border-none cursor-pointer hover:text-blue-400 transition-colors z-10"
        onClick={() => navigate('/player/dashboard')}
      >
        &times;
      </button>

      {/* Main Container */}
      <div className="w-4/5 h-4/5 flex bg-gray-900 border-2 border-blue-600 rounded-lg relative overflow-hidden">
        
        {/* Left Side - Hologram Display */}
        <div className="w-1/2 h-full relative flex items-center justify-center">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          {/* Hologram Container */}
          <div className="relative">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 w-64 h-64 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-30 animate-pulse blur-xl"></div>
            
            {/* Main Hologram Circle */}
            <div className="relative w-64 h-64 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center relative overflow-hidden">
                
                {/* Scan Line Effect */}
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50"
                  style={{
                    transform: `translateY(${scanLine}%)`,
                    transition: 'transform 0.1s linear'
                  }}
                ></div>

                {/* Player Silhouette */}
                <div className="relative z-10">
                  {/* Head */}
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mx-auto mb-3 animate-pulse"></div>
                  
                  {/* Body */}
                  <div className="w-16 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-t-full mx-auto relative">
                    {/* Arms */}
                    <div className="absolute top-3 -left-6 w-4 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full transform -rotate-12"></div>
                    <div className="absolute top-3 -right-6 w-4 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full transform rotate-12"></div>
                    
                    {/* Legs */}
                    <div className="absolute bottom-0 left-1 w-6 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-t-full"></div>
                    <div className="absolute bottom-0 right-1 w-6 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-t-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rotating Stats Rings */}
            <div 
              className="absolute inset-0 w-64 h-64 rounded-full border border-cyan-400/40 animate-spin"
              style={{ animationDuration: '20s' }}
            ></div>
            <div 
              className="absolute inset-0 w-64 h-64 rounded-full border border-blue-500/40 animate-spin"
              style={{ animationDuration: '15s', animationDirection: 'reverse' }}
            ></div>
            <div 
              className="absolute inset-0 w-64 h-64 rounded-full border border-purple-600/40 animate-spin"
              style={{ animationDuration: '25s' }}
            ></div>

            {/* Floating Stats */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="text-cyan-400 font-mono text-sm bg-black/70 px-3 py-2 rounded-lg border border-cyan-400/50 animate-pulse">
                ⚡ Speed: 92
              </div>
            </div>
            
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="text-cyan-400 font-mono text-sm bg-black/70 px-3 py-2 rounded-lg border border-cyan-400/50 animate-pulse">
                🎯 Passing: 89
              </div>
            </div>
            
            <div className="absolute top-1/2 -right-16 transform -translate-y-1/2">
              <div className="text-cyan-400 font-mono text-sm bg-black/70 px-3 py-2 rounded-lg border border-cyan-400/50 animate-pulse">
                🥅 Shooting: 95
              </div>
            </div>
            
            <div className="absolute top-1/2 -left-16 transform -translate-y-1/2">
              <div className="text-cyan-400 font-mono text-sm bg-black/70 px-3 py-2 rounded-lg border border-cyan-400/50 animate-pulse">
                💪 Strength: 88
              </div>
            </div>

            {/* Data Points */}
            <div className="absolute top-8 right-8 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-8 left-8 w-2 h-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 right-4 w-1.5 h-1.5 bg-purple-600 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>

        {/* Right Side - Player Info */}
        <div className="w-1/2 p-8 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-blue-400">Mardy Collins</h2>
          
          <div className="space-y-4">
            <div className="bg-black/50 p-4 rounded-lg border border-blue-600/30">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Season Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Goals:</span>
                  <span className="text-white ml-2">15</span>
                </div>
                <div>
                  <span className="text-gray-400">Assists:</span>
                  <span className="text-white ml-2">8</span>
                </div>
                <div>
                  <span className="text-gray-400">Rating:</span>
                  <span className="text-white ml-2">8.7</span>
                </div>
                <div>
                  <span className="text-gray-400">Matches:</span>
                  <span className="text-white ml-2">24</span>
                </div>
              </div>
            </div>

            <div className="bg-black/50 p-4 rounded-lg border border-blue-600/30">
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Attributes</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Speed</span>
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-white text-sm">92</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Passing</span>
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                  <span className="text-white text-sm">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Shooting</span>
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-white text-sm">95</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
