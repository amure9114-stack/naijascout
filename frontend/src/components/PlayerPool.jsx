import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

const PlayerPool = ({ onAddToFeed }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await axios.get(`${API_URL}/api/players?sort=scoutPoints&order=desc&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlayers(response.data.data || []);
      } catch (err) {
        console.error("Error fetching players:", err);
        let errorMessage = "Failed to load players. Please try again.";
        if (err.response) {
          if (err.response.status === 401) errorMessage = "Please log in to view players.";
          else if (err.response.status === 403) errorMessage = "You don’t have permission to view players.";
          else errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
        } else if (err.request) {
          errorMessage = "Can’t reach the server. Is it running on port 5000?";
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const rankedPlayers = useMemo(() => {
    return players
      .map((player) => {
        const engagement = player.engagement || {};
        const goals = Number(engagement.goals ?? 0);
        const assists = Number(engagement.assists ?? 0);
        const interactions = Number(engagement.interactions ?? 0);
        const scoutPoints = goals + assists * 2 + interactions;
        const name =
          player.name || [player.firstName, player.lastName].filter(Boolean).join(" ") || "Unnamed Player";

        return {
          ...player,
          name,
          engagement: {
            ...engagement,
            goals,
            assists,
            interactions,
          },
          scoutPoints,
        };
      })
      .sort((a, b) => b.scoutPoints - a.scoutPoints);
  }, [players]);

  const handleAddToFeed = (player) => {
    if (onAddToFeed) {
      onAddToFeed(player);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-blue-600/50 max-w-3xl mx-auto">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading players...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-red-600/50 max-w-3xl mx-auto">
        <div className="text-center text-white">
          <p className="text-red-400 mb-2">Error loading players</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <p className="text-gray-400 text-sm mt-2">Make sure the backend server is running on port 5000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-blue-600/50 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-pink-500 text-center mb-6 glow-text">RANKING NOMBRE DEL JUEGO</h1>
      <div className="space-y-2">
        {rankedPlayers.map((player, index) => (
          <div
            key={player._id || player.id}
            className="flex items-center justify-between bg-gray-800/80 p-4 rounded-md shadow-md border-l-4 border-pink-500 hover:shadow-blue-500/50 transition-shadow"
          >
            <div className="flex items-center">
              <span className="w-8 h-8 flex items-center justify-center bg-pink-500 text-black font-bold rounded-full mr-4">
                {index + 1}
              </span>
              <img src={player.image || "/avatar-icon.png"} alt="Avatar" className="w-8 h-8 rounded-full mr-4" />
              <div className="flex-1">
                <span className="text-white font-semibold block">{player.name}</span>
                <span className="text-gray-400 text-sm">
                  {player.position || "N/A"} • {player.club || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <span className="text-pink-400 font-bold block">{player.scoutPoints}</span>
                <span className="text-gray-400 text-xs">
                  {player.engagement.goals}G {player.engagement.assists}A
                </span>
              </div>
              <button
                onClick={() => handleAddToFeed(player)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md transition-colors"
              >
                Add to Feed
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center text-gray-400 text-sm">
        www.tusitoweb.com
      </div>
    </div>
  );
};

export default PlayerPool;