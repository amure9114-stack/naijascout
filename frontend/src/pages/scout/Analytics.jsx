import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
    Target,
    Zap,
    Timer,
    TrendingUp,
    Activity,
    Shield,
    Dumbbell,
    Star,
    ChevronRight,
    Trophy,
    Users,
    Calendar,
    MapPin,
    ArrowUpRight,
    BarChart3,
    Footprints,
} from "lucide-react";

// Animated Counter Hook
const useAnimatedCounter = (end, duration = 2000, start = 0) => {
    const [count, setCount] = useState(start);
    const countRef = useRef(start);
    const frameRef = useRef();

    useEffect(() => {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            countRef.current = Math.floor(start + (end - start) * easeOut);
            setCount(countRef.current);
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [end, duration, start]);

    return count;
};

// Radar Chart Component
const RadarChart = ({ attributes }) => {
    const [animated, setAnimated] = useState(false);
    const size = 280;
    const center = size / 2;
    const radius = 100;
    const levels = 5;

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const getPoint = (index, value) => {
        const angle = (Math.PI * 2 * index) / attributes.length - Math.PI / 2;
        const r = (value / 100) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    const points = attributes.map((attr, i) => getPoint(i, animated ? attr.value : 0));
    const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

    return (
        <svg width={size} height={size} className="drop-shadow-2xl">
            {/* Background levels */}
            {Array.from({ length: levels }).map((_, i) => {
                const levelRadius = (radius / levels) * (i + 1);
                const levelPoints = attributes.map((_, j) => {
                    const angle = (Math.PI * 2 * j) / attributes.length - Math.PI / 2;
                    return `${center + levelRadius * Math.cos(angle)},${center + levelRadius * Math.sin(angle)}`;
                });
                return (
                    <polygon
                        key={i}
                        points={levelPoints.join(" ")}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="1"
                        opacity={0.3 + i * 0.1}
                    />
                );
            })}

            {/* Axis lines */}
            {attributes.map((_, i) => {
                const angle = (Math.PI * 2 * i) / attributes.length - Math.PI / 2;
                const endX = center + radius * Math.cos(angle);
                const endY = center + radius * Math.sin(angle);
                return (
                    <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={endX}
                        y2={endY}
                        stroke="rgba(255, 255, 255, 0.2)"
                        strokeWidth="1"
                        opacity="0.5"
                    />
                );
            })}

            {/* Gradient definition */}
            <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Data polygon */}
            <polygon
                points={polygonPoints}
                fill="url(#radarGradient)"
                stroke="#22c55e"
                strokeWidth="2"
                filter="url(#glow)"
                style={{
                    transition: "all 1s ease-out",
                }}
            />

            {/* Data points */}
            {points.map((point, i) => (
                <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill={attributes[i].color}
                    stroke="#000000"
                    strokeWidth="2"
                    style={{
                        transition: "all 1s ease-out",
                        transitionDelay: `${i * 100}ms`,
                    }}
                />
            ))}

            {/* Labels */}
            {attributes.map((attr, i) => {
                const angle = (Math.PI * 2 * i) / attributes.length - Math.PI / 2;
                const labelRadius = radius + 30;
                const x = center + labelRadius * Math.cos(angle);
                const y = center + labelRadius * Math.sin(angle);
                return (
                    <text
                        key={i}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white/60 text-xs font-medium"
                    >
                        {attr.name}
                    </text>
                );
            })}
        </svg>
    );
};

// Animated Progress Bar
const AnimatedProgressBar = ({
    value,
    label,
    color,
    delay = 0,
}) => {
    const [width, setWidth] = useState(0);
    const animatedValue = useAnimatedCounter(value, 1500);

    useEffect(() => {
        const timer = setTimeout(() => setWidth(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">{label}</span>
                <span className="text-sm font-bold" style={{ color }}>
                    {animatedValue}
                </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                        width: `${width}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}40`,
                    }}
                />
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({
    icon: Icon,
    label,
    value,
    subValue,
    trend,
    delay = 0,
}) => {
    const numValue = typeof value === "number" ? value : parseInt(value) || 0;
    const animatedValue = useAnimatedCounter(numValue, 2000);

    return (
        <div
            className="bg-black/20 border border-white/20 backdrop-blur-xl rounded-xl p-5 hover:border-green-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-600/10 group opacity-0 animate-fade-up"
            style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
        >
            <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-green-600/10 group-hover:bg-green-600/20 transition-colors">
                    <Icon className="w-5 h-5 text-green-400" />
                </div>
                {trend !== undefined && (
                    <div
                        className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        <ArrowUpRight
                            className={`w-3 h-3 ${trend < 0 ? "rotate-90" : ""}`}
                        />
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-white/60 text-sm">{label}</p>
                <p className="text-2xl font-bold font-display mt-1 text-white">
                    {typeof value === "number" ? animatedValue : value}
                </p>
                {subValue && (
                    <p className="text-xs text-white/60 mt-1">{subValue}</p>
                )}
            </div>
        </div>
    );
};

// Match Performance Card
const MatchCard = ({
    opponent,
    date,
    rating,
    goals,
    assists,
    result,
    delay = 0,
}) => {

    const resultColors = {
        W: "bg-green-600/20 text-green-400 border-green-600/30",
        D: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
        L: "bg-red-600/20 text-red-400 border-red-600/30",
    };

    return (
        <div
            className="bg-black/20 border border-white/20 backdrop-blur-xl rounded-xl p-4 hover:border-green-600/50 transition-all duration-300 opacity-0 animate-slide-in-right"
            style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border ${resultColors[result]}`}
                    >
                        {result}
                    </div>
                    <div>
                        <p className="font-medium text-white">{opponent}</p>
                        <p className="text-xs text-white/60">{date}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-green-400">{rating.toFixed(1)}</p>
                    <p className="text-xs text-white/60">
                        {goals}G · {assists}A
                    </p>
                </div>
            </div>
        </div>
    );
};

// Performance Metric Row
const MetricRow = ({
    label,
    value,
    maxValue,
    icon: Icon,
    delay = 0,
}) => {
    const [animated, setAnimated] = useState(false);
    const percentage = (value / maxValue) * 100;

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div className="flex items-center gap-4 py-3 border-b border-white/20 last:border-0">
            <Icon className="w-4 h-4 text-green-400 shrink-0" />
            <span className="text-sm text-white/60 w-32">{label}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: animated ? `${percentage}%` : "0%" }}
                />
            </div>
            <span className="text-sm font-bold text-white w-12 text-right">
                {value}
            </span>
        </div>
    );
};

// Main Component
const Index = ({ player }) => {
    const playerAttributes = [
        { name: "PAC", value: 89, color: "#22c55e" },
        { name: "SHO", value: 82, color: "#ef4444" },
        { name: "PAS", value: 76, color: "#3b82f6" },
        { name: "DRI", value: 91, color: "#a855f7" },
        { name: "DEF", value: 38, color: "#f59e0b" },
        { name: "PHY", value: 72, color: "#f97316" },
    ];

    const recentMatches = [
        { opponent: "Rivers United", date: "Nov 28, 2024", rating: 8.7, goals: 2, assists: 1, result: "W" },
        { opponent: "Enyimba FC", date: "Nov 21, 2024", rating: 7.4, goals: 0, assists: 2, result: "D" },
        { opponent: "Kano Pillars", date: "Nov 14, 2024", rating: 9.1, goals: 3, assists: 0, result: "W" },
        { opponent: "Remo Stars", date: "Nov 7, 2024", rating: 6.8, goals: 0, assists: 1, result: "L" },
    ];

    return (
        <div className="min-h-screen bg-black/50">
            {/* Header */}
            <header className="border-b border-white/20 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                <Footprints className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold font-display text-white">
                                Naija<span className="text-green-400">Scout</span>
                            </span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#" className="text-sm font-medium text-green-400">Analytics</a>
                            <a href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Players</a>
                            <a href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Matches</a>
                            <a href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Reports</a>
                        </nav>
                        <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <BarChart3 className="w-5 h-5 text-white/60" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Player Hero Section */}
                <section className="mb-10">
                    <div className="bg-black/20 border border-white/20 backdrop-blur-xl rounded-2xl p-6 md:p-8 relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative flex flex-col lg:flex-row gap-8 items-center">
                            {/* Player Image & Info */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-1 animate-pulse-glow">
                                        <div className="w-full h-full rounded-xl bg-white/10 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-green-400">VA</span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-lg bg-green-600 text-white text-sm font-bold">
                                        #10
                                    </div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h1 className="text-3xl md:text-4xl font-bold font-display text-white">
                                        Victor Adeyemi
                                    </h1>
                                    <p className="text-green-400 font-semibold mt-1">Forward · Right Wing</p>
                                    <div className="flex flex-wrap items-center gap-4 mt-3 justify-center sm:justify-start">
                                        <div className="flex items-center gap-1.5 text-white/60 text-sm">
                                            <MapPin className="w-4 h-4" />
                                            Lagos FC
                                        </div>
                                        <div className="flex items-center gap-1.5 text-white/60 text-sm">
                                            <Calendar className="w-4 h-4" />
                                            Age 23
                                        </div>
                                        <div className="flex items-center gap-1.5 text-white/60 text-sm">
                                            <Users className="w-4 h-4" />
                                            Nigeria U23
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Overall Rating */}
                            <div className="lg:ml-auto flex items-center gap-6 opacity-0 animate-scale-up delay-200" style={{ animationFillMode: "forwards" }}>
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center animate-float">
                                        <span className="text-4xl font-bold text-white">87</span>
                                    </div>
                                    <p className="text-sm font-medium text-white/60 mt-2">Overall Rating</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-600 to-yellow-500 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-white">93</span>
                                    </div>
                                    <p className="text-sm font-medium text-white/60 mt-2">Potential</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold font-display mb-5 flex items-center gap-2 text-white">
                        <Trophy className="w-5 h-5 text-green-400" />
                        Season Statistics
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <StatCard icon={Target} label="Goals" value={18} subValue="0.72 per game" trend={23} delay={100} />
                        <StatCard icon={Zap} label="Assists" value={12} subValue="0.48 per game" trend={15} delay={200} />
                        <StatCard icon={Timer} label="Minutes" value={2245} subValue="25 matches" delay={300} />
                        <StatCard icon={TrendingUp} label="Avg Rating" value="8.2" trend={8} delay={400} />
                        <StatCard icon={Star} label="MOTM" value={7} subValue="This season" delay={500} />
                        <StatCard icon={Activity} label="Form" value="W W D W" delay={600} />
                    </div>
                </section>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Radar & Attributes */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Radar Chart Section */}
                        <section className="bg-black/20 border border-white/20 backdrop-blur-xl rounded-2xl p-6 opacity-0 animate-fade-up delay-300" style={{ animationFillMode: "forwards" }}>
                            <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2 text-white">
                                <Activity className="w-5 h-5 text-green-400" />
                                Player Attributes
                            </h2>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <RadarChart attributes={playerAttributes} />
                                <div className="flex-1 w-full space-y-4">
                                    <AnimatedProgressBar value={89} label="Pace" color="#22c55e" delay={600} />
                                    <AnimatedProgressBar value={82} label="Shooting" color="#ef4444" delay={700} />
                                    <AnimatedProgressBar value={76} label="Passing" color="#3b82f6" delay={800} />
                                    <AnimatedProgressBar value={91} label="Dribbling" color="#a855f7" delay={900} />
                                    <AnimatedProgressBar value={38} label="Defending" color="#f59e0b" delay={1000} />
                                    <AnimatedProgressBar value={72} label="Physical" color="#f97316" delay={1100} />
                                </div>
                            </div>
                        </section>

                        {/* Detailed Stats */}
                        <section className="bg-black/20 border border-white/20 backdrop-blur-xl rounded-2xl p-6 opacity-0 animate-fade-up delay-400" style={{ animationFillMode: "forwards" }}>
                            <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2 text-white">
                                <BarChart3 className="w-5 h-5 text-green-400" />
                                Detailed Performance Metrics
                            </h2>
                            <div className="grid md:grid-cols-2 gap-x-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-green-400 mb-3 uppercase tracking-wider">Attacking</h3>
                                    <MetricRow icon={Target} label="Shots on Target" value={42} maxValue={60} delay={500} />
                                    <MetricRow icon={Zap} label="Key Passes" value={38} maxValue={50} delay={600} />
                                    <MetricRow icon={TrendingUp} label="Chances Created" value={27} maxValue={40} delay={700} />
                                    <MetricRow icon={Star} label="Successful Dribbles" value={68} maxValue={80} delay={800} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-green-500 mb-3 uppercase tracking-wider">Defensive</h3>
                                    <MetricRow icon={Shield} label="Tackles Won" value={12} maxValue={30} delay={900} />
                                    <MetricRow icon={Activity} label="Interceptions" value={8} maxValue={25} delay={1000} />
                                    <MetricRow icon={Dumbbell} label="Aerial Duels Won" value={15} maxValue={30} delay={1100} />
                                    <MetricRow icon={Timer} label="Blocks" value={5} maxValue={20} delay={1200} />
                                </div>
                            </div>
                        </section>

                        {/* Advanced Metrics */}
                        <section className="bg-black/20 border border-white/20 backdrop-blur-xl rounded-2xl p-6 opacity-0 animate-fade-up delay-500" style={{ animationFillMode: "forwards" }}>
                            <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2 text-white">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                Advanced Analytics
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "xG (Expected Goals)", value: "14.2", trend: "+2.8" },
                                    { label: "xA (Expected Assists)", value: "9.7", trend: "+1.4" },
                                    { label: "Pass Accuracy", value: "84%", trend: "+3%" },
                                    { label: "Shot Accuracy", value: "62%", trend: "+5%" },
                                    { label: "Heatmap Presence", value: "High", trend: null },
                                    { label: "Sprint Speed", value: "34.2 km/h", trend: null },
                                    { label: "Distance Covered", value: "10.8 km", trend: "+0.4" },
                                    { label: "Progressive Carries", value: "127", trend: "+18" },
                                ].map((metric, i) => (
                                    <div
                                        key={metric.label}
                                        className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors"
                                    >
                                        <p className="text-xs text-white/60">{metric.label}</p>
                                        <p className="text-xl font-bold font-display mt-1 text-white">{metric.value}</p>
                                        {metric.trend && (
                                            <p className="text-xs text-green-400 mt-1">{metric.trend}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Recent Matches & More */}
                    <div className="space-y-8">
                        {/* Recent Matches */}
                        <section className="bg-black/20 border border-white/20 backdrop-blur-xl rounded-2xl p-6 opacity-0 animate-slide-in-right delay-400" style={{ animationFillMode: "forwards" }}>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold font-display flex items-center gap-2 text-white">
                                    <Calendar className="w-5 h-5 text-green-400" />
                                    Recent Matches
                                </h2>
                                <button className="text-sm text-green-400 flex items-center gap-1 hover:underline">
                                    View All <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {recentMatches.map((match, i) => (
                                    <MatchCard key={i} {...match} delay={500 + i * 100} />
                                ))}
                            </div>
                        </section>

                        {/* Scout Notes */}
                        <section className="bg-black/20 border border-white/20 backdrop-blur-xl rounded-2xl p-6 opacity-0 animate-slide-in-right delay-600" style={{ animationFillMode: "forwards" }}>
                            <h2 className="text-lg font-bold font-display mb-4 flex items-center gap-2 text-white">
                                <Star className="w-5 h-5 text-green-500" />
                                Scout Notes
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/10 rounded-xl border-l-4 border-green-600">
                                    <p className="text-sm text-white">
                                        "Exceptional pace and dribbling ability. Strong on the ball with
                                        explosive acceleration. Could improve defensive work rate and
                                        aerial presence."
                                    </p>
                                    <p className="text-xs text-white/60 mt-2">
                                        - Chief Scout · Nov 28, 2024
                                    </p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-xl border-l-4 border-green-500">
                                    <p className="text-sm text-white">
                                        "High potential for European move. Technical skills comparable to
                                        top-tier wingers. Recommend monitoring for next transfer window."
                                    </p>
                                    <p className="text-xs text-white/60 mt-2">
                                        - Technical Director · Nov 15, 2024
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Comparison Radar Mini */}
                        <section className="bg-black/20 border border-white/20 backdrop-blur-xl rounded-2xl p-6 opacity-0 animate-slide-in-right delay-700" style={{ animationFillMode: "forwards" }}>
                            <h2 className="text-lg font-bold font-display mb-4 flex items-center gap-2 text-white">
                                <Users className="w-5 h-5 text-green-400" />
                                League Comparison
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { stat: "Goals", playerValue: 18, avgValue: 8, percentile: 94 },
                                    { stat: "Assists", playerValue: 12, avgValue: 5, percentile: 89 },
                                    { stat: "Dribbles", playerValue: 68, avgValue: 32, percentile: 97 },
                                    { stat: "Key Passes", playerValue: 38, avgValue: 18, percentile: 91 },
                                ].map((item, i) => (
                                    <div key={item.stat} className="flex items-center gap-3">
                                        <span className="text-xs text-white/60 w-20">
                                            {item.stat}
                                        </span>
                                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                                                style={{ width: `${item.percentile}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-green-400 w-10 text-right">
                                            {item.percentile}%
                                        </span>
                                    </div>
                                ))}
                                <p className="text-xs text-white/60 text-center mt-2">
                                    Percentile rank among NPFL forwards
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/20 mt-16 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-white/60">
                        © 2024 NaijaScout · Nigerian Football Talent Analytics
                    </p>
                </div>
            </footer>
        </div>
    );
};

const Analytics = () => {
    const { state } = useLocation();
    const playerData = state?.player;

    console.log("Selected Player:", playerData);

    return <Index player={playerData} />;
};

export default Analytics;
