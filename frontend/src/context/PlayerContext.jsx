import React, { createContext, useContext, useEffect, useState } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const [cache, setCache] = useState({}); // id => player object
    const [selectedId, setSelectedId] = useState(null);
    const [shortlist, setShortlist] = useState([]);

    // Load shortlist from localStorage on mount
    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('shortlistedPlayers') || '[]');
            setShortlist(stored);
        } catch (err) {
            console.error('Failed to read shortlistedPlayers from localStorage', err);
            setShortlist([]);
        }
    }, []);

    // Persist shortlist to localStorage when it changes
    useEffect(() => {
        try {
            localStorage.setItem('shortlistedPlayers', JSON.stringify(shortlist));
        } catch (err) {
            console.error('Failed to persist shortlist', err);
        }
    }, [shortlist]);

    const cachePlayer = (player) => {
        if (!player || !player.id) return;
        setCache(prev => ({ ...prev, [player.id]: player }));
    };

    const getPlayer = async (id) => {
        if (!id) return null;
        if (cache[id]) return cache[id];

        // Attempt to fetch from backend API
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            };

            const res = await fetch(`/api/players/${id}`, { headers });
            if (!res.ok) throw new Error(`API error: ${res.statusText}`);

            const response = await res.json();
            if (response.success && response.data) {
                // Transform backend player format to match frontend expectations
                const player = {
                    ...response.data,
                    // Map backend fields to frontend fields if needed
                    name: response.data.name || `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim(),
                    image: response.data.profilePicture || response.data.image || '',
                    position: response.data.position || 'Unknown',
                    age: response.data.age || 0
                };
                cachePlayer(player);
                return player;
            } else {
                console.warn('API response missing success or data', response);
                return null;
            }
        } catch (err) {
            console.warn('Failed to fetch player details from API', err);
            return null;
        }
    };

    const addToShortlist = (playerOrId) => {
        const id = typeof playerOrId === 'object' ? playerOrId.id : playerOrId;
        if (!id) return false;
        if (shortlist.some(p => p.id === id)) return false;

        // If we have a cached player, store a small snapshot; otherwise minimal placeholder
        const existing = cache[id] || (typeof playerOrId === 'object' ? playerOrId : { id });
        const snapshot = {
            id: existing.id,
            name: existing.name || 'Unknown',
            position: existing.position || '',
            image: existing.image || ''
        };
        setShortlist(prev => [...prev, snapshot]);
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
    if (!ctx) throw new Error('usePlayers must be used inside a PlayerProvider');
    return ctx;
};
