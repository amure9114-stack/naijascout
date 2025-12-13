import React, { createContext, useContext, useEffect, useState } from 'react';

// minimal PlayerContext with localStorage persistence
const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const [cache, setCache] = useState({}); // { [id]: player }
    const [selectedId, setSelectedId] = useState(null);
    const [shortlist, setShortlist] = useState([]);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('shortlistedPlayers') || '[]');
            setShortlist(stored);
        } catch (e) {
            setShortlist([]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('shortlistedPlayers', JSON.stringify(shortlist));
    }, [shortlist]);

    const cachePlayer = (player) => {
        setCache(prev => ({ ...prev, [player.id]: player }));
    };

    const getPlayer = async (id) => {
        if (cache[id]) return cache[id];
        // try local/mock first, otherwise fetch from API:
        try {
            const res = await fetch(`/api/players/${id}`);
            if (!res.ok) throw new Error('fetch failed');
            const data = await res.json();
            cachePlayer(data);
            return data;
        } catch (err) {
            // fallback: return null or throw
            console.error('Failed to fetch player', err);
            return null;
        }
    };

    const addToShortlist = (playerOrId) => {
        const id = typeof playerOrId === 'object' ? playerOrId.id : playerOrId;
        if (shortlist.some(p => p.id === id)) return false;
        // prefer adding minimal snapshot (id, name, image, position)
        const player = typeof playerOrId === 'object'
            ? playerOrId
            : cache[id] ?? { id }; // minimal placeholder
        setShortlist(prev => [...prev, { id: player.id, name: player.name, position: player.position, image: player.image }]);
        // Optionally fire backend POST /shortlist
        return true;
    };

    const removeFromShortlist = (id) => {
        setShortlist(prev => prev.filter(p => p.id !== id));
    };

    return (
        <PlayerContext.Provider value={{
            cache,
            cachePlayer,
            getPlayer,
            selectedId,
            setSelectedId,
            shortlist,
            addToShortlist,
            removeFromShortlist
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayers = () => {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error('usePlayers must be inside PlayerProvider');
    return ctx;
};