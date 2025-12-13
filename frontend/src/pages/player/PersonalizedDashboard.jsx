import { motion, AnimatePresence } from 'framer-motion';
import { pageFade, listContainer, listItem, useAnimatedNumber } from '../../lib/animations'; // adjust path
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Trophy, Star, Zap, Target, Shield, TrendingUp, MapPin,
    Heart, Users, Video, Lock, ChevronRight, AlertCircle
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Skeleton Loader for Hero Section
const SkeletonHero = () => (
    <div className="glass rounded-3xl p-8 animate-pulse">
        <div className="flex gap-8 items-start">
            <div className="w-32 h-32 bg-muted rounded-full" />
            <div className="flex-1 space-y-4">
                <div className="h-8 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="grid grid-cols-4 gap-4 mt-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Skeleton Loader for Stats
const SkeletonStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-4 h-32 bg-muted" />
        ))}
    </div>
);

export default function PersonalizedDashboard() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [playerData, setPlayerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrollVelocity, setScrollVelocity] = useState(0);
    const lastScrollY = useRef(0);
    const animationFrameId = useRef(null);

    // Auth check and player data fetch
    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const token = localStorage.getItem('token');
                const username = localStorage.getItem('username');
                const role = localStorage.getItem('userRole');

                // Protect: Only players can access this
                if (!token || role !== 'player') {
                    navigate('/auth', { replace: true });
                    return;
                }

                if (!username) {
                    setError('No player username found. Please log in again.');
                    setLoading(false);
                    return;
                }

                // Fetch this player's full profile from backend
                const res = await fetch(`${API_URL}/api/players/username/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) {
                    if (res.status === 404) {
                        setError('Player profile not found. Complete your profile in settings.');
                    } else {
                        throw new Error(`API error: ${res.statusText}`);
                    }
                    setLoading(false);
                    return;
                }

                const response = await res.json();
                if (response.success && response.data) {
                    setPlayerData(response.data);
                    setError(null);
                } else {
                    setError('Failed to load player data.');
                }
            } catch (err) {
                console.error('Error fetching player data:', err);
                setError(err.message || 'Failed to load your profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlayerData();
    }, [navigate]);

    // Scroll-synced video playback
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const deltaY = currentScrollY - lastScrollY.current;
            setScrollVelocity(prev => Math.abs(deltaY));
            lastScrollY.current = currentScrollY;
        };

        const updateVideoSpeed = () => {
            if (videoRef.current && scrollVelocity > 0) {
                const speed = 0.5 + Math.min(scrollVelocity / 10, 2.5);
                videoRef.current.playbackRate = Math.max(0.3, Math.min(speed, 3.0));
            }
            animationFrameId.current = requestAnimationFrame(updateVideoSpeed);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateVideoSpeed();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [scrollVelocity]);

    // GSAP animations
    useEffect(() => {
        if (playerData) {
            gsap.from('.hero-section', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' });
            gsap.from('.stats-grid', { opacity: 0, y: 30, duration: 0.8, delay: 0.1, ease: 'power3.out' });
            gsap.from('.section-card', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
        }
    }, [playerData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-fill opacity-50 bg-center bg-no-repeat bg-fixed bg-cover"
                    style={{ backgroundImage: `url('/img/logo.png')` }} />
                <div className="bg-black/50 absolute inset-0" />
                <div className="relative z-10 pt-20 px-6 max-w-7xl mx-auto">
                    <div className="mb-12">
                        <SkeletonHero />
                    </div>
                    <div className="mb-12">
                        <SkeletonStats />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background text-white relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-fill opacity-50 bg-center bg-no-repeat bg-fixed bg-cover"
                    style={{ backgroundImage: `url('/img/logo.png')` }} />
                <div className="bg-black/50 absolute inset-0" />
                <div className="relative z-10 text-center glass rounded-3xl p-8 max-w-md">
                    <AlertCircle className="w-16 h-16 mx-auto text-destructive mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Unable to Load Profile</h2>
                    <p className="text-white/70 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/player/settings')}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Complete Your Profile
                    </button>
                </div>
            </div>
        );
    }

    if (!playerData) return null;

    const firstName = playerData.firstName || 'Player';
    const lastName = playerData.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const position = playerData.position || 'Position TBA';
    const age = playerData.age || '—';
    const club = playerData.club || 'Unaffiliated';
    const nationality = playerData.nationality || 'Nigeria';
    const bio = playerData.bio || 'Professional footballer. Passionate about the game.';
    const profilePhoto = playerData.profilePicture || playerData.image || 'https://via.placeholder.com/200';
    const marketValue = playerData.marketValue || 0;
    const stats = playerData.stats || {};
    const highlights = playerData.highlights || [];
    const shortlistedBy = playerData.shortlistedBy || [];
    const recentMatches = playerData.matches || [];
    const availability = playerData.availability || 'Not specified';

    // Format market value
    const formatValue = (val) => {
        if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `₦${(val / 1000).toFixed(0)}K`;
        return `₦${val}`;
    };

    // Small stat card that uses animated number
    const StatCard = ({ stat }) => {
        const value = typeof stat.value === 'number' ? stat.value : 0;
        const animated = useAnimatedNumber(value);
        return (
            <div>
                <div className={`text-2xl font-bold ${stat.color || ''}`}>{stat.formatter ? stat.formatter(stat.value) : animated}</div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background text-white relative overflow-hidden">
            {/* Background with fixed image */}
            <div className="absolute inset-0 bg-fill opacity-50 bg-center bg-no-repeat bg-fixed bg-cover"
                style={{ backgroundImage: `url('/img/logo.png')` }} />
            <div className="bg-black/50 absolute inset-0" />

            {/* Content */}
            <motion.div className="relative z-10" variants={pageFade} initial="initial" animate="animate" exit="exit">
                {/* Header with greeting */}
                <header className="sticky top-0 z-40 glass-strong border-b border-border backdrop-blur-md">
                    <div className="px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gradient">Welcome back, {firstName}</h1>
                            <p className="text-sm text-white/60">{club} • {position}</p>
                        </div>
                        <button
                            onClick={() => navigate('/player/settings')}
                            className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors text-sm"
                        >
                            Settings
                        </button>
                    </div>
                </header>

                <div className="px-6 py-12 max-w-7xl mx-auto space-y-12">
                    {/* HERO SECTION - Personal Profile Card */}
                    <motion.section className="hero-section" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="glass-strong rounded-3xl overflow-hidden border border-white/20 backdrop-blur-xl">
                            {/* Profile Header */}
                            <div className="relative bg-gradient-to-r from-primary/20 to-secondary/20 p-8">
                                <div className="flex gap-8 items-start">
                                    {/* Profile Photo */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={profilePhoto}
                                            alt={fullName}
                                            className="w-40 h-40 rounded-2xl object-cover border-4 border-primary/50 shadow-2xl"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-3 shadow-lg">
                                            <Star className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                    </div>

                                    {/* Player Info */}
                                    <div className="flex-1 pt-4">
                                        <div className="mb-6">
                                            <h1 className="text-5xl font-bold font-display mb-2">{fullName}</h1>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl text-primary font-bold">{position}</span>
                                                <span className="text-2xl">🇳🇬</span>
                                                <span className="text-white/70">• {age} years</span>
                                            </div>
                                        </div>

                                        {/* Quick Stats Row */}
                                        <div className="grid grid-cols-4 gap-4">
                                            {[
                                                { label: 'Goals', value: stats.goals || 0, color: 'text-primary' },
                                                { label: 'Assists', value: stats.assists || 0, color: 'text-secondary' },
                                                { label: 'Matches', value: stats.appearances || 0, color: 'text-accent' },
                                                { label: 'Value', value: marketValue || 0, color: 'text-primary', formatter: (v) => formatValue(v) },
                                            ].map((s, i) => (
                                                <motion.div key={i} className="glass rounded-xl p-4 text-center" variants={listItem} initial="initial" animate="animate">
                                                    <StatCard stat={s} />
                                                    <div className="text-xs text-white/70">{s.label}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Availability Badge */}
                                <div className="absolute top-8 right-8">
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${availability === 'Open to move' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                        availability === 'Signed until 2027' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                            'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                        }`}>
                                        {availability}
                                    </span>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="p-8 border-t border-white/10">
                                <h3 className="font-display font-semibold text-lg mb-3">About {firstName}</h3>
                                <p className="text-white/80 leading-relaxed">{bio}</p>
                                <div className="mt-6 grid grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{nationality}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-primary" />
                                        <span>{club}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Trophy className="w-4 h-4 text-primary" />
                                        <span>{age} years old</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* STATS SECTION */}
                    <section className="stats-grid">
                        <h2 className="text-3xl font-bold font-display mb-6">Your Performance</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Overall Rating', value: stats.overallRating || '—', icon: <Star /> },
                                { label: 'Potential', value: stats.potential || '—', icon: <Zap /> },
                                { label: 'Pass Accuracy', value: stats.passAccuracy || '—', icon: <Target /> },
                                { label: 'Defensive', value: stats.defensive || '—', icon: <Shield /> },
                            ].map((stat, i) => (
                                <div key={i} className="section-card glass-strong rounded-2xl p-4 border border-white/10 hover:border-primary/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-2 text-primary">
                                        {stat.icon}
                                        <span className="text-xs text-white/70">{stat.label}</span>
                                    </div>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* RECENT MATCHES */}
                    {recentMatches.length > 0 && (
                        <section className="section-card">
                            <h2 className="text-3xl font-bold font-display mb-6">Recent Matches</h2>
                            <div className="space-y-3">
                                {recentMatches.slice(0, 5).map((match, i) => (
                                    <div key={i} className="glass rounded-xl p-4 flex items-center justify-between border border-white/10 hover:border-primary/50 transition-colors cursor-pointer">
                                        <div>
                                            <p className="font-semibold">{match.opponent || 'Match'}</p>
                                            <p className="text-sm text-white/60">{match.date || 'Date TBA'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-primary">{match.goals || 0}G {match.assists || 0}A</p>
                                            <p className="text-xs text-white/60">{match.result || 'Result TBA'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {recentMatches.length === 0 && (
                                <p className="text-white/60 text-center py-8">No recent matches recorded.</p>
                            )}
                        </section>
                    )}

                    {/* SCOUTS INTERESTED */}
                    {shortlistedBy.length > 0 && (
                        <section className="section-card">
                            <h2 className="text-3xl font-bold font-display mb-6 flex items-center gap-2">
                                <Heart className="w-8 h-8 text-destructive" />
                                Scouts Watching You ({shortlistedBy.length})
                            </h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {shortlistedBy.slice(0, 6).map((scout, i) => (
                                    <div key={i} className="glass rounded-xl p-4 border border-white/10 hover:border-primary/50 transition-colors">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                <Users className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{scout.name || 'Scout'}</p>
                                                <p className="text-xs text-white/60">{scout.organization || 'Organization'}</p>
                                            </div>
                                        </div>
                                        <button className="w-full mt-3 px-3 py-1 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors">
                                            View Profile
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* HIGHLIGHTS SECTION */}
                    {highlights.length > 0 && (
                        <section className="section-card">
                            <h2 className="text-3xl font-bold font-display mb-6 flex items-center gap-2">
                                <Video className="w-8 h-8 text-primary" />
                                Your Highlights ({highlights.length})
                            </h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {highlights.slice(0, 6).map((video, i) => (
                                    <div key={i} className="group cursor-pointer rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all">
                                        <div className="relative bg-black/50 aspect-video flex items-center justify-center group-hover:bg-black/70 transition-colors">
                                            <Video className="w-12 h-12 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="p-3 bg-black/30">
                                            <p className="text-sm font-semibold truncate">{video.title || 'Highlight'}</p>
                                            <p className="text-xs text-white/60">{video.duration || '2:30'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* CTA SECTION */}
                    <section className="section-card">
                        <div className="glass-strong rounded-3xl p-8 border border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10">
                            <h2 className="text-3xl font-bold mb-4">Ready to Shine?</h2>
                            <p className="text-white/80 mb-6 max-w-md">
                                Complete your profile with more stats, highlights, and achievements to catch the attention of top scouts and clubs.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/player/profile')}
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    Edit Profile <ChevronRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => navigate('/player/sponsorships')}
                                    className="px-6 py-3 glass rounded-lg font-semibold hover:bg-white/10 transition-colors"
                                >
                                    Find Sponsorships
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
