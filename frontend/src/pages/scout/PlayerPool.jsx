import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Grid3X3, List, X, Lock, ChevronDown, Filter,
  MapPin, Trophy, Phone, Mail, MessageCircle, User,
  Play, Star, TrendingUp, Eye, Zap, Target, Shield,
  Activity, Flame, Snowflake, Sun, Menu, SlidersHorizontal
} from 'lucide-react';

import { usePlayers } from '../../context/PlayerContext.jsx';
import axios from 'axios';
import { listContainer, listItem } from '../../lib/animations';

// Mock Nigerian Players Data
const mockPlayers = [
  { id: 1, name: "Chukwueze Victor", age: 24, position: "RWF", positions: ["RWF", "LWF", "ST"], height: 172, foot: "Left", club: "AC Milan", state: "Lagos", city: "Ikeja", type: "Professional", availability: "Not available", pace: 89, technique: 85, physical: 72, vision: 78, dribbling: 88, finishing: 76, defensive: 45, form: 82, marketValue: 25000000, demand: "hot", image: "https://img.a.transfermarkt.technology/portrait/big/342823-1663839944.jpg", bio: "Explosive winger with incredible pace and dribbling ability. Product of Diamond Academy." },
  { id: 2, name: "Osimhen Victor", age: 25, position: "ST", positions: ["ST", "CF"], height: 186, foot: "Right", club: "Napoli", state: "Lagos", city: "Olusosun", type: "Professional", availability: "Open to move", pace: 90, technique: 78, physical: 88, vision: 72, dribbling: 75, finishing: 92, defensive: 38, form: 95, marketValue: 120000000, demand: "hot", image: "https://img.a.transfermarkt.technology/portrait/big/401923-1694520942.jpg", bio: "One of the most lethal strikers in world football. Clinical finisher with devastating pace." },
  { id: 3, name: "Iwobi Alex", age: 27, position: "CMF", positions: ["CMF", "AMF", "LWF"], height: 180, foot: "Right", club: "Fulham", state: "Lagos", city: "Lagos Island", type: "Professional", availability: "Not available", pace: 76, technique: 82, physical: 78, vision: 85, dribbling: 81, finishing: 68, defensive: 72, form: 78, marketValue: 18000000, demand: "warm", image: "https://img.a.transfermarkt.technology/portrait/big/195506-1663839661.jpg", bio: "Versatile midfielder with excellent work rate and technical ability." },
  { id: 4, name: "Lookman Ademola", age: 26, position: "LWF", positions: ["LWF", "RWF", "ST"], height: 173, foot: "Right", club: "Atalanta", state: "Lagos", city: "Wandsworth", type: "Professional", availability: "Not available", pace: 87, technique: 86, physical: 70, vision: 80, dribbling: 89, finishing: 82, defensive: 42, form: 90, marketValue: 45000000, demand: "hot", image: "https://img.a.transfermarkt.technology/portrait/big/316409-1694520765.jpg", bio: "AFCON 2023 hero. Electrifying attacker with incredible flair." },
  { id: 5, name: "Troost-Ekong William", age: 30, position: "CB", positions: ["CB"], height: 191, foot: "Right", club: "Al-Kholood", state: "Groningen", city: "Haarlem", type: "Professional", availability: "Open to move", pace: 68, technique: 65, physical: 85, vision: 62, dribbling: 58, finishing: 45, defensive: 88, form: 72, marketValue: 2500000, demand: "warm", image: "https://img.a.transfermarkt.technology/portrait/big/110179-1687783740.jpg", bio: "Experienced center-back and Super Eagles captain. Strong in the air." },
  { id: 6, name: "Ndidi Wilfred", age: 27, position: "DMF", positions: ["DMF", "CB"], height: 183, foot: "Right", club: "Leicester City", state: "Lagos", city: "Ikeja", type: "Professional", availability: "Open to move", pace: 72, technique: 68, physical: 90, vision: 70, dribbling: 62, finishing: 55, defensive: 92, form: 75, marketValue: 28000000, demand: "hot", image: "https://img.a.transfermarkt.technology/portrait/big/274944-1663839745.jpg", bio: "Elite defensive midfielder. One of the best ball winners in the Premier League." },
  { id: 7, name: "Awoniyi Taiwo", age: 26, position: "ST", positions: ["ST", "CF"], height: 183, foot: "Right", club: "Nottingham Forest", state: "Ogun", city: "Ilorin", type: "Professional", availability: "Not available", pace: 82, technique: 75, physical: 86, vision: 68, dribbling: 72, finishing: 84, defensive: 40, form: 70, marketValue: 20000000, demand: "warm", image: "https://img.a.transfermarkt.technology/portrait/big/320404-1663838737.jpg", bio: "Powerful striker with excellent aerial ability and hold-up play." },
  { id: 8, name: "Simon Moses", age: 28, position: "RWF", positions: ["RWF", "LWF"], height: 170, foot: "Left", club: "Nantes", state: "Jos", city: "Jos", type: "Professional", availability: "Actively looking", pace: 91, technique: 80, physical: 68, vision: 74, dribbling: 84, finishing: 72, defensive: 38, form: 76, marketValue: 8000000, demand: "warm", image: "https://img.a.transfermarkt.technology/portrait/big/230498-1695379011.jpg", bio: "Lightning-fast winger with excellent crossing ability." },
  { id: 9, name: "Onyeka Frank", age: 26, position: "CMF", positions: ["CMF", "DMF"], height: 183, foot: "Right", club: "Brentford", state: "Edo", city: "Benin City", type: "Professional", availability: "Not available", pace: 78, technique: 72, physical: 84, vision: 75, dribbling: 70, finishing: 62, defensive: 82, form: 74, marketValue: 15000000, demand: "cold", image: "https://img.a.transfermarkt.technology/portrait/big/467089-1663605336.jpg", bio: "Box-to-box midfielder with excellent engine and physicality." },
  { id: 10, name: "Boniface Victor", age: 23, position: "ST", positions: ["ST"], height: 188, foot: "Right", club: "Bayer Leverkusen", state: "Akwa Ibom", city: "Uyo", type: "Professional", availability: "Not available", pace: 85, technique: 82, physical: 84, vision: 76, dribbling: 80, finishing: 88, defensive: 35, form: 92, marketValue: 50000000, demand: "hot", image: "https://img.a.transfermarkt.technology/portrait/big/608596-1694158889.jpg", bio: "Rising star in Bundesliga. Complete striker with excellent link-up play." },
  { id: 11, name: "Adeleye Olaitan", age: 19, position: "CB", positions: ["CB", "RB"], height: 185, foot: "Right", club: "Flying Eagles FC", state: "Oyo", city: "Ibadan", type: "Academy Player", availability: "Actively looking", pace: 75, technique: 65, physical: 78, vision: 60, dribbling: 58, finishing: 42, defensive: 80, form: 82, marketValue: 150000, demand: "warm", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400", bio: "Promising young defender with excellent reading of the game." },
  { id: 12, name: "Chinedu Emmanuel", age: 21, position: "AMF", positions: ["AMF", "CMF", "LWF"], height: 175, foot: "Both", club: "Enyimba FC", state: "Abia", city: "Aba", type: "Semi-Pro", availability: "Open to move", pace: 80, technique: 84, physical: 68, vision: 82, dribbling: 86, finishing: 70, defensive: 55, form: 85, marketValue: 350000, demand: "hot", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400", bio: "Creative playmaker with exceptional vision and passing range." },
  { id: 13, name: "Okechukwu Daniel", age: 22, position: "GK", positions: ["GK"], height: 192, foot: "Right", club: "Rivers United", state: "Rivers", city: "Port Harcourt", type: "Semi-Pro", availability: "Open to move", pace: 45, technique: 55, physical: 80, vision: 72, dribbling: 35, finishing: 20, defensive: 85, form: 78, marketValue: 200000, demand: "cold", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", bio: "Athletic goalkeeper with excellent reflexes and command of the box." },
  { id: 14, name: "Abubakar Sadiq", age: 20, position: "LB", positions: ["LB", "LWF"], height: 178, foot: "Left", club: "Kano Pillars", state: "Kano", city: "Kano", type: "Semi-Pro", availability: "Actively looking", pace: 86, technique: 72, physical: 74, vision: 70, dribbling: 75, finishing: 58, defensive: 76, form: 80, marketValue: 280000, demand: "warm", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400", bio: "Attacking full-back with excellent pace and crossing ability." },
];

const positions = ["GK", "LB", "CB", "RB", "DMF", "CMF", "AMF", "LWF", "RWF", "ST", "CF"];
const playerTypes = ["Professional", "Semi-Pro", "Free Agent", "Academy Player"];
const availabilityOptions = ["Open to move", "Actively looking", "Not available"];
const nigerianStates = ["Lagos", "Kano", "Oyo", "Rivers", "Edo", "Abia", "Ogun", "Akwa Ibom", "Jos", "All States"];

const getPositionColor = (position) => {
  if (position === "GK") return "bg-position-gk text-black";
  if (["LB", "CB", "RB"].includes(position)) return "bg-position-def";
  if (["DMF", "CMF", "AMF"].includes(position)) return "bg-position-mid";
  return "bg-position-fwd";
};

const getDemandBadge = (demand) => {
  switch (demand) {
    case "hot":
      return { icon: <Flame className="w-3 h-3" />, text: "Hot", class: "bg-demand-hot/20 text-demand-hot border-demand-hot/30" };
    case "warm":
      return { icon: <Sun className="w-3 h-3" />, text: "Warm", class: "bg-demand-warm/20 text-demand-warm border-demand-warm/30" };
    default:
      return { icon: <Snowflake className="w-3 h-3" />, text: "Cold", class: "bg-demand-cold/20 text-demand-cold border-demand-cold/30" };
  }
};


const formatValue = (value) => {
  if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `₦${(value / 1000).toFixed(0)}K`;
  return `₦${value}`;
};

// Skeleton Loading Component
const SkeletonCard = () => (
  <div className="glass rounded-xl p-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-16 h-16 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2">
      <div className="h-12 bg-muted rounded" />
      <div className="h-12 bg-muted rounded" />
      <div className="h-12 bg-muted rounded" />
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-9 bg-muted rounded flex-1" />
      <div className="h-9 bg-muted rounded flex-1" />
    </div>
  </div>
);

const PlayerPool = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { addToShortlist, cachePlayer, setSelectedId, getPlayer, selectedId } = usePlayers();
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!selectedId) {
      setSelectedPlayer(null);
      return () => { mounted = false; };
    }

    setPreviewLoading(true);
    (async () => {
      try {
        const p = await getPlayer(selectedId);
        if (mounted) setSelectedPlayer(p);
      } catch (err) {
        console.error('Error loading player for preview', err);
        if (mounted) setSelectedPlayer(null);
      } finally {
        if (mounted) setPreviewLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [selectedId, getPlayer]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [ageRange, setAgeRange] = useState([16, 35]);
  const [heightRange, setHeightRange] = useState([150, 210]);
  const [selectedFoot, setSelectedFoot] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [valueRange, setValueRange] = useState([0, 150000000]);

  // Filter players
  const filteredPlayers = useMemo(() => {
    return mockPlayers.filter(player => {
      if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedPositions.length && !selectedPositions.includes(player.position)) return false;
      if (player.age < ageRange[0] || player.age > ageRange[1]) return false;
      if (player.height < heightRange[0] || player.height > heightRange[1]) return false;
      if (selectedFoot && player.foot !== selectedFoot) return false;
      if (selectedState && selectedState !== 'All States' && player.state !== selectedState) return false;
      if (selectedClub && !player.club.toLowerCase().includes(selectedClub.toLowerCase())) return false;
      if (selectedType && player.type !== selectedType) return false;
      if (selectedAvailability && player.availability !== selectedAvailability) return false;
      if (player.marketValue < valueRange[0] || player.marketValue > valueRange[1]) return false;
      return true;
    });
  }, [searchQuery, selectedPositions, ageRange, heightRange, selectedFoot, selectedState, selectedClub, selectedType, selectedAvailability, valueRange]);

  const togglePosition = (pos) => {
    setSelectedPositions(prev =>
      prev.includes(pos) ? prev.filter(p => p !== pos) : [...prev, pos]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPositions([]);
    setAgeRange([16, 35]);
    setHeightRange([150, 210]);
    setSelectedFoot('');
    setSelectedState('');
    setSelectedClub('');
    setSelectedType('');
    setSelectedAvailability('');
    setValueRange([0, 150000000]);
  };

  // Player Card Component (simpler, consistent motion-enabled card)
  const PlayerCard = ({ player, index }) => {
    const demand = getDemandBadge(player.demand);
    return (
      <motion.div
        layout
        variants={listItem}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.995 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className={`glass rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 ${viewMode === 'list' ? 'flex items-center gap-4 p-4' : 'p-4'}`}
        onClick={() => { cachePlayer(player); setSelectedPlayer(player); setSelectedId(player.id); }}
      >
        <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}>
          <div className={`flex ${viewMode === 'list' ? 'items-center gap-4' : 'items-start gap-3'}`}>
            <div className="relative">
              <img
                src={player.image}
                alt={player.name}
                className={`${viewMode === 'list' ? 'w-14 h-14' : 'w-16 h-16'} rounded-full object-cover border-2 border-primary/30 group-hover:border-primary transition-colors`}
              />
              <div className={`absolute -bottom-1 -right-1 ${getPositionColor(player.position)} text-xs font-bold px-1.5 py-0.5 rounded-md`}>
                {player.position}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-white truncate">{player.name}</h3>
                <span className="text-lg">🇳🇬</span>
              </div>
              <p className="text-sm text-white">{player.age} yrs • {player.height}cm • {player.foot}</p>
              <p className="text-sm text-white truncate">{player.club}</p>
            </div>
          </div>

          <div className={`grid grid-cols-3 gap-2 ${viewMode === 'list' ? '' : 'mt-4'}`}>
            <div className="glass-strong rounded-lg p-2 text-center group-hover:bg-primary/10 transition-colors">
              <div className="flex items-center justify-center gap-1 text-primary">
                <Zap className="w-3 h-3" />
                <span className="font-bold text-sm">{player.pace}</span>
              </div>
              <p className="text-[10px] text-white">Pace</p>
            </div>
            <div className="glass-strong rounded-lg p-2 text-center group-hover:bg-secondary/10 transition-colors">
              <div className="flex items-center justify-center gap-1 text-secondary">
                <Target className="w-3 h-3" />
                <span className="font-bold text-sm">{player.technique}</span>
              </div>
              <p className="text-[10px] text-white">Tech</p>
            </div>
            <div className="glass-strong rounded-lg p-2 text-center group-hover:bg-accent/10 transition-colors">
              <div className="flex items-center justify-center gap-1 text-accent">
                <Shield className="w-3 h-3" />
                <span className="font-bold text-sm">{player.physical}</span>
              </div>
              <p className="text-[10px] text-white">Physical</p>
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-between ${viewMode === 'list' ? 'gap-4' : 'mt-4'}`}>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-primary">{formatValue(player.marketValue)}</span>
            <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${demand.class}`}>
              {demand.icon}
              {demand.text}
            </span>
          </div>
        </div>

        <div className={`flex gap-2 ${viewMode === 'list' ? '' : 'mt-4'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); cachePlayer(player); setSelectedPlayer(player); setSelectedId(player.id); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg glass-strong text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); addToShortlist(player); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/80 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Unlock
          </button>
        </div>
      </motion.div>
    );
  };

  // Filters Sidebar Component
  const FiltersSidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'p-4' : 'p-4 sticky top-4'} space-y-5 overflow-y-auto scrollbar-thin ${mobile ? 'max-h-[70vh]' : 'max-h-[calc(100vh-2rem)]'}`}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
        <input
          type="text"
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-input border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Position Filter */}
      <div>
        <h4 className="font-display font-semibold mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Position
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => togglePosition(pos)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${selectedPositions.includes(pos)
                ? getPositionColor(pos)
                : 'bg-muted text-white hover:bg-muted/80'
                }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Age Range */}
      <div>
        <h4 className="font-display font-semibold mb-2">Age Range: {ageRange[0]} - {ageRange[1]}</h4>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="16"
            max="35"
            value={ageRange[0]}
            onChange={(e) => setAgeRange([+e.target.value, ageRange[1]])}
            className="flex-1 accent-primary"
          />
          <input
            type="range"
            min="16"
            max="35"
            value={ageRange[1]}
            onChange={(e) => setAgeRange([ageRange[0], +e.target.value])}
            className="flex-1 accent-primary"
          />
        </div>
      </div>

      {/* Height Range */}
      <div>
        <h4 className="font-display font-semibold mb-2">Height: {heightRange[0]} - {heightRange[1]}cm</h4>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="150"
            max="210"
            value={heightRange[0]}
            onChange={(e) => setHeightRange([+e.target.value, heightRange[1]])}
            className="flex-1 accent-primary"
          />
          <input
            type="range"
            min="150"
            max="210"
            value={heightRange[1]}
            onChange={(e) => setHeightRange([heightRange[0], +e.target.value])}
            className="flex-1 accent-primary"
          />
        </div>
      </div>

      {/* Preferred Foot */}
      <div>
        <h4 className="font-display font-semibold mb-2">Preferred Foot</h4>
        <div className="flex gap-2">
          {['Left', 'Right', 'Both'].map(foot => (
            <button
              key={foot}
              onClick={() => setSelectedFoot(selectedFoot === foot ? '' : foot)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedFoot === foot
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-white hover:bg-muted/80'
                }`}
            >
              {foot}
            </button>
          ))}
        </div>
      </div>

      {/* State */}
      <div>
        <h4 className="font-display font-semibold mb-2">State</h4>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All States</option>
          {nigerianStates.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* Club */}
      <div>
        <h4 className="font-display font-semibold mb-2">Club / Academy</h4>
        <input
          type="text"
          placeholder="Enter club name..."
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Player Type */}
      <div>
        <h4 className="font-display font-semibold mb-2">Player Type</h4>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Types</option>
          {playerTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-display font-semibold mb-2">Availability</h4>
        <select
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-input border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All</option>
          {availabilityOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Market Value Range */}
      <div>
        <h4 className="font-display font-semibold mb-2">Market Value</h4>
        <p className="text-xs text-white mb-2">{formatValue(valueRange[0])} - {formatValue(valueRange[1])}</p>
        <input
          type="range"
          min="0"
          max="150000000"
          step="1000000"
          value={valueRange[1]}
          onChange={(e) => setValueRange([valueRange[0], +e.target.value])}
          className="w-full accent-primary"
        />
      </div>

      {/* Premium Filters (Locked) */}
      <div className="relative">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-6 h-6 text-gold mx-auto mb-1" />
            <span className="text-xs text-gold font-medium">Premium Only</span>
          </div>
        </div>
        <div className="space-y-3 opacity-50">
          <h4 className="font-display font-semibold flex items-center gap-2">
            <Star className="w-4 h-4 text-gold" />
            Advanced Filters
          </h4>
          {['Pace', 'Technique', 'Physical', 'Vision', 'Dribbling', 'Finishing'].map(stat => (
            <div key={stat} className="flex items-center justify-between">
              <span className="text-sm text-white">{stat}</span>
              <div className="w-24 h-2 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  // Player Preview Panel
  const PlayerPreview = () => {
    if (!selectedId && !selectedPlayer) return null;
    const player = selectedPlayer;
    const demand = getDemandBadge(player?.demand);

    return (
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-full md:w-[480px] glass-strong z-50 overflow-y-auto scrollbar-thin"
      >
        {/* Close Button */}
        <button
          onClick={() => { setSelectedPlayer(null); setSelectedId(null); }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full glass hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 overflow-hidden">
          {previewLoading && !player ? (
            <div className="w-full h-full bg-muted animate-pulse" />
          ) : (
            <img
              src={player?.image}
              alt={player?.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end gap-3">
              <img
                src={selectedPlayer.image}
                alt={selectedPlayer.name}
                className="w-20 h-20 rounded-xl border-4 border-background object-cover"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-display text-2xl font-bold">{player?.name ?? 'Loading...'}</h2>
                  <span className="text-2xl">🇳🇬</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {player?.positions?.map(pos => (
                    <span key={pos} className={`${getPositionColor(pos)} text-xs font-bold px-2 py-1 rounded-md`}>
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-lg p-3">
              <p className="text-xs text-white">Age</p>
              <p className="font-display font-bold text-lg">{selectedPlayer.age} years</p>
            </div>
            <div className="glass rounded-lg p-3">
              <p className="text-xs text-white">Height</p>
              <p className="font-display font-bold text-lg">{selectedPlayer.height} cm</p>
            </div>
            <div className="glass rounded-lg p-3">
              <p className="text-xs text-white">Preferred Foot</p>
              <p className="font-display font-bold text-lg">{selectedPlayer.foot}</p>
            </div>
            <div className="glass rounded-lg p-3">
              <p className="text-xs text-white">Current Club</p>
              <p className="font-display font-bold text-lg truncate">{selectedPlayer.club}</p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="font-display font-semibold mb-2">About</h3>
            <p className="text-sm text-white leading-relaxed">{selectedPlayer.bio}</p>
          </div>

          {/* Stats */}
          <div>
            <h3 className="font-display font-semibold mb-3">Attributes</h3>
            <div className="space-y-3">
              {[
                { name: 'Pace', value: selectedPlayer.pace, icon: <Zap className="w-4 h-4" />, color: 'bg-primary' },
                { name: 'Technique', value: selectedPlayer.technique, icon: <Target className="w-4 h-4" />, color: 'bg-secondary' },
                { name: 'Physical', value: selectedPlayer.physical, icon: <Shield className="w-4 h-4" />, color: 'bg-accent' },
                { name: 'Vision', value: selectedPlayer.vision, icon: <Eye className="w-4 h-4" />, color: 'bg-primary' },
                { name: 'Dribbling', value: selectedPlayer.dribbling, icon: <Activity className="w-4 h-4" />, color: 'bg-secondary' },
                { name: 'Finishing', value: selectedPlayer.finishing, icon: <Target className="w-4 h-4" />, color: 'bg-destructive' },
              ].map(stat => (
                <div key={stat.name} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-24">
                    {stat.icon}
                    <span className="text-sm">{stat.name}</span>
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className={`h-full ${stat.color} rounded-full`}
                    />
                  </div>
                  <span className="font-bold text-sm w-8">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Info */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold">Market Info</h3>
              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${demand.class}`}>
                {demand.icon}
                {demand.text} Demand
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-primary">{formatValue(selectedPlayer.marketValue)}</span>
              <span className="text-sm text-white">estimated value</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-white">{selectedPlayer.availability}</span>
            </div>
          </div>

          {/* Highlight Video */}
          <div>
            <h3 className="font-display font-semibold mb-3">Highlights</h3>
            <div className="glass rounded-xl aspect-video flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2 cursor-pointer hover:bg-primary/30 transition-colors">
                  <Play className="w-8 h-8 text-primary ml-1" />
                </div>
                <p className="text-sm text-white">30-sec highlight clip</p>
              </div>
            </div>
          </div>

          {/* Premium Blurred Section */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center glass opacity-40 rounded-xl p-6">
                <Lock className="w-8 h-8 text-gold mx-auto mb-2" />
                <h4 className="font-display font-bold mb-1">Premium Content</h4>
                <p className="text-xs text-white mb-3">Unlock full contact info & stats</p>
              </div>
            </div>
            <div className="blur-premium space-y-4 p-4 glass rounded-xl">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>+234 XXX XXX XXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Available</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>email@example.com</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <span>Agent: John Doe</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <button onClick={() => selectedPlayer && addToShortlist(selectedPlayer)} className="w-full py-4 rounded-xl bg-destructive text-destructive-foreground font-display font-bold text-lg hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Unlock This Player – ₦1,500
            </button>
            <button className="w-full py-4 rounded-l gradient-green opacity-60 text-primary-foreground font-display font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1 glow-green">
              Subscribe Monthly – Unlock Everything
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-white">
      <div className="absolute inset-0 bg-fill opacity-50 bg-center bg-no-repeat bg-fixed bg-cover" style={{ backgroundImage: `url('/img/logo.png')` }} />
      <div className="bg-black/50 absolute inset-0" />
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 glass-strong border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-bold text-gradient">NaijaScout</h1>
                  <p className="text-xs text-white">Nigerian Football Scouting</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="hidden sm:flex items-center gap-1 p-1 glass rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden p-2 glass rounded-lg hover:bg-muted transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>

                {/* Desktop Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-muted transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Filters Sidebar - Desktop */}
            <AnimatePresence>
              {showFilters && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hidden lg:block flex-shrink-0 glass rounded-xl overflow-hidden"
                >
                  <FiltersSidebar />
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Players Grid/List */}
            <main className="flex-1 min-w-0">
              {/* Results Counter */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-white">
                  <span className="font-display font-bold text-white">{filteredPlayers.length}</span> players found
                </p>
                <div className="flex sm:hidden items-center gap-1 p-1 glass rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredPlayers.map((player, index) => (
                    <PlayerCard key={player.id} player={player} index={index} />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && filteredPlayers.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">No players found</h3>
                  <p className="text-white mb-4">Try adjusting your filters</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-x-0 bottom-0 z-50 glass-strong rounded-t-3xl lg:hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-display font-bold text-lg">Filters</h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FiltersSidebar mobile />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Player Preview Panel */}
        <AnimatePresence>
          {selectedId && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                onClick={() => { setSelectedPlayer(null); setSelectedId(null); }}
              />
              <PlayerPreview />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlayerPool;