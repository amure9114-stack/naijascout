
import React, { useState, useEffect } from 'react';

// Mock initial feed data (replace with state management or API)
const initialFeed = [];

const Feed = () => {
  const [feedItems, setFeedItems] = useState(initialFeed);

  // Simulate adding a player to feed (triggered by PlayerPool)
  const handleAddToFeed = (player) => {
    const newItem = {
      id: Date.now(), // Unique ID for frontend simulation
      player: player.name,
      content: `Added ${player.name} to your feed! Boost their scout points with engagement.`,
      type: 'text', // Can be 'video' or 'image' later
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + ' WAT',
    };
    setFeedItems((prev) => [newItem, ...prev]); // Add to top of feed
    // Simulate scout points increase (frontend-only)
    player.engagement.interactions += 1; // Mock engagement
  };

  useEffect(() => {
    // Pass handleAddToFeed to parent (e.g., dashboard) via context or prop drilling
    // For now, assume it's passed down
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-blue-600/50 max-w-3xl mx-auto mt-6">
      <h2 className="text-3xl font-bold text-pink-500 text-center mb-6 glow-text">Feed</h2>
      <div className="space-y-4">
        {feedItems.length === 0 ? (
          <p className="text-gray-400 text-center">No posts yet. Add players to start!</p>
        ) : (
          feedItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800/80 p-4 rounded-md shadow-md border-l-4 border-pink-500 hover:shadow-blue-500/50 transition-shadow"
            >
              <p className="text-white font-semibold">{item.player}</p>
              <p className="text-gray-300">{item.content}</p>
              <p className="text-gray-500 text-sm mt-2">{item.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;