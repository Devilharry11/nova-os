import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  Coffee, 
  Car, 
  Plane, 
  Star, 
  Camera, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Activity,
  Globe2,
  Fingerprint,
  CheckCircle2,
  Volume2,
  VolumeX,
  FastForward,
  Orbit
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';
import { triggerFireworks } from '../../utils/celebration';

const ICON_MAP = {
  coffee: Coffee,
  sparkles: Sparkles,
  car: Car,
  plane: Plane,
  star: Star,
  camera: Camera,
  heart: Heart,
};

// Future milestones for the time machine slider
const FUTURE_STATIONS = [
  {
    yearLabel: 'Day 1',
    title: 'The First Spark',
    text: 'A nervous smile, a racing heart, and the moment the universe decided we belonged together.',
    color: '#ff8fa3',
  },
  {
    yearLabel: 'Present Day',
    title: 'Our Living Universe',
    text: 'Every morning coffee, every quiet cuddle, building a home within each other’s arms.',
    color: '#e05a88',
  },
  {
    yearLabel: '5 Years',
    title: 'Wanderers of the Earth',
    text: 'Passports filled with stamps, dancing in foreign rainstorms, and laughing through delayed flights.',
    color: '#9d72ff',
  },
  {
    yearLabel: '20 Years',
    title: 'Deep Roots & Golden Evenings',
    text: 'A cozy house filled with inside jokes, quiet jazz on Sundays, and hands that fit together like breathing.',
    color: '#f59e0b',
  },
  {
    yearLabel: '50 Years',
    title: 'Rocking Chairs Under The Stars',
    text: 'Wrinkled hands, silver hair, but looking into your eyes and still seeing the same girl/boy from Day 1.',
    color: '#38bdf8',
  },
];

export const ScreenTimeline: React.FC = () => {
  const { config, setScreen } = useExperience();
  const timeline = config.timeline || [];
  const coupleNames = config.coupleNames || 'Elena & Julian';
  
  // Real-time Cosmic Clock
  const [elapsed, setElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  // Biometric Soul Sync Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isSynced, setIsSynced] = useState(false);
  const scanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Heartbeat sound toggle
  const [isHeartSoundOn, setIsHeartSoundOn] = useState(false);

  // Time Travel Capsule Slider index
  const [futureIndex, setFutureIndex] = useState(1);

  // Milestone love reactions
  const [lovedMilestones, setLovedMilestones] = useState<Record<string, number>>({});
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(timeline[0]?.id || null);

  useEffect(() => {
    const startDate = config.startDate ? new Date(config.startDate) : new Date('2023-10-14T20:00:00');

    const updateTimer = () => {
      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - startDate.getTime());
      const totalSeconds = Math.floor(diffMs / 1000);

      const seconds = Math.floor(totalSeconds % 60);
      const minutes = Math.floor((totalSeconds / 60) % 60);
      const hours = Math.floor((totalSeconds / 3600) % 24);
      const days = Math.floor(totalSeconds / 86400);

      setElapsed({ days, hours, minutes, seconds, totalSeconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [config.startDate]);

  // Periodic heartbeat sound if enabled
  useEffect(() => {
    if (!isHeartSoundOn) return;
    const heartInterval = setInterval(() => {
      vaultAudio.playHeartbeatPulse();
    }, 850); // ~70 BPM
    return () => clearInterval(heartInterval);
  }, [isHeartSoundOn]);

  // Biometric Touch & Hold Scanner Handlers
  const handleStartScan = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSynced) return;
    e.preventDefault();
    setIsScanning(true);
    vaultAudio.playCardHover();

    let current = 0;
    scanTimerRef.current = setInterval(() => {
      current += 4;
      setScanProgress(Math.min(100, current));
      vaultAudio.playBiometricScanTick(current);

      if (current >= 100) {
        if (scanTimerRef.current) clearInterval(scanTimerRef.current);
        setIsScanning(false);
        setIsSynced(true);
        vaultAudio.playSoulSync();
        triggerFireworks();
      }
    }, 50);
  };

  const handleStopScan = () => {
    if (isSynced) return;
    if (scanTimerRef.current) {
      clearInterval(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    setIsScanning(false);
    setScanProgress(0);
  };

  const handleLoveMilestone = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    vaultAudio.playHeartCollect();
    setLovedMilestones((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleContinue = () => {
    vaultAudio.playPortalResonance();
    setScreen('scrapbook');
  };

  // Cosmic calculations
  const totalHeartbeats = Math.floor(elapsed.totalSeconds * 1.18); // ~71 BPM average
  const sunrisesTogether = Math.max(1, elapsed.days);
  const earthOrbits = (elapsed.days / 365.25).toFixed(2);

  return (
    <div className="relative min-h-[95vh] w-full flex flex-col items-center justify-start px-4 sm:px-8 py-8 sm:py-12 max-w-6xl mx-auto selection:bg-rose-500/30">
      {/* Edge-to-edge cosmic ambient lights */}
      <div className="absolute top-10 left-1/4 w-[32rem] h-[32rem] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[32rem] h-[32rem] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-4 mb-10 w-full"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20 backdrop-blur-md shadow-glow-rose">
          <Orbit className="w-3.5 h-3.5 text-rose-400 animate-spin-slow" />
          <span>THE COSMIC PULSE OF US &bull; {coupleNames}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <h2 className="text-3xl sm:text-6xl font-serif text-white tracking-tight leading-tight">
          Every Heartbeat Since Day One
        </h2>
        <p className="text-sm sm:text-base text-slate-300 font-sans font-light max-w-2xl mx-auto leading-relaxed">
          Time is not measured in seconds, but in the quiet glances, late-night laughs, and the rhythm of two hearts synchronizing across the universe.
        </p>
      </motion.div>

      {/* 🚀 THE HATKE "COSMIC HEART ENGINE & DUAL SOUL ORB" */}
      <div className="w-full max-w-4xl mx-auto mb-12">
        <TiltCard maxTilt={3} scale={1.008} className="w-full">
          <div className="vault-card rounded-3xl p-6 sm:p-10 border border-rose-500/30 bg-gradient-to-b from-[#160c24]/90 via-[#0e091a]/95 to-[#080511]/95 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            {/* Glowing Nebula In Card */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar: Heartbeat ECG Line + Sound Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-8">
              <div className="flex items-center gap-3">
                {/* Pulsing Anatomical Neon Heart */}
                <motion.div
                  animate={{
                    scale: [1, 1.18, 1, 1.25, 1],
                  }}
                  transition={{
                    duration: 0.85,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(224,90,136,0.6)]"
                >
                  <Heart className="w-5 h-5 fill-rose-500" />
                </motion.div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-sans uppercase tracking-widest text-rose-300 font-medium">
                      Live Heartbeat Pulse
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">
                    ~72 BPM &bull; Linked with your breath
                  </p>
                </div>
              </div>

              {/* Toggle Heartbeat Sound */}
              <button
                onClick={() => {
                  const next = !isHeartSoundOn;
                  setIsHeartSoundOn(next);
                  if (next) vaultAudio.playHeartbeatPulse();
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans transition-all border ${
                  isHeartSoundOn
                    ? 'bg-rose-500/20 text-rose-200 border-rose-500/40 shadow-glow-rose'
                    : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
                }`}
              >
                {isHeartSoundOn ? <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isHeartSoundOn ? 'Heartbeat Audio: ON' : 'Listen To Heartbeat'}</span>
              </button>
            </div>

            {/* Central Giant Heartbeat & Real-time Cosmic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Stat 1: Total Heartbeats Shared (Ticking Live) */}
              <div className="vault-glass rounded-2xl p-5 border border-white/5 text-center space-y-1 group hover:border-rose-500/30 transition-colors">
                <div className="flex items-center justify-center gap-1.5 text-xs font-sans uppercase tracking-wider text-rose-300/80 mb-1">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span>Shared Heartbeats</span>
                </div>
                <div className="text-2xl sm:text-3xl font-mono text-white font-semibold tracking-tight">
                  {totalHeartbeats.toLocaleString()}
                </div>
                <p className="text-[11px] font-sans text-slate-400">
                  Beats our hearts took for each other
                </p>
              </div>

              {/* Centerpiece: The High-Precision Time Glyphs */}
              <div className="vault-glass rounded-2xl p-6 border border-rose-500/30 bg-gradient-to-b from-rose-950/30 to-midnight-950/60 shadow-glow-rose text-center space-y-3">
                <span className="text-[10px] font-sans uppercase tracking-widest text-amber-300 font-medium flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>In Synchrony For</span>
                </span>

                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-midnight-950/80 border border-white/10">
                    <span className="block text-xl sm:text-3xl font-serif text-white font-semibold">
                      {elapsed.days}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Days</span>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-xl bg-midnight-950/80 border border-white/10">
                    <span className="block text-xl sm:text-3xl font-serif text-rose-200 font-semibold">
                      {elapsed.hours.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Hrs</span>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-xl bg-midnight-950/80 border border-white/10">
                    <span className="block text-xl sm:text-3xl font-serif text-rose-300 font-semibold">
                      {elapsed.minutes.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Min</span>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-xl bg-midnight-950/80 border border-white/10">
                    <span className="block text-xl sm:text-3xl font-serif text-rose-400 font-semibold animate-pulse">
                      {elapsed.seconds.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-rose-400">Sec</span>
                  </div>
                </div>

                <div className="text-[11px] font-sans text-rose-200/90 italic">
                  &ldquo;Every second was worth waiting for you.&rdquo;
                </div>
              </div>

              {/* Stat 3: Cosmic Sunrises & Celestial Orbit */}
              <div className="vault-glass rounded-2xl p-5 border border-white/5 text-center space-y-1 group hover:border-violet-500/30 transition-colors">
                <div className="flex items-center justify-center gap-1.5 text-xs font-sans uppercase tracking-wider text-violet-300/80 mb-1">
                  <Globe2 className="w-3.5 h-3.5 text-violet-400" />
                  <span>Sun &amp; Earth Orbits</span>
                </div>
                <div className="text-2xl sm:text-3xl font-mono text-white font-semibold tracking-tight">
                  {sunrisesTogether} <span className="text-base font-sans font-light text-slate-400">Dawns</span>
                </div>
                <p className="text-[11px] font-sans text-slate-400">
                  {earthOrbits} full journeys around the sun
                </p>
              </div>
            </div>

            {/* 🌟 HATKE FEATURE: DUAL BIOMETRIC SOUL SCANNER ("Touch & Sync Our Souls") */}
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center justify-center text-center">
              <div className="max-w-md space-y-2 mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-rose-300">
                  <Fingerprint className="w-3.5 h-3.5 text-rose-400" />
                  <span>Interactive Soul Synchronizer</span>
                </span>
                <h4 className="text-lg sm:text-xl font-serif text-white font-medium">
                  {isSynced ? '✨ Souls Synchronized for Eternity' : 'Hold Your Finger To Sync Our Frequency'}
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  {isSynced 
                    ? 'Our wavelengths are aligned in the celestial ledger. Touch again anytime.' 
                    : 'Press and hold the glowing biometric ring for 2.5 seconds to harmonize our heartbeat.'}
                </p>
              </div>

              {/* The Interactive Touch Scanner Orb */}
              <div className="relative flex items-center justify-center">
                {/* Animated Outer Pulse Rings */}
                {isScanning && (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute w-36 h-36 rounded-full border-2 border-rose-400 pointer-events-none"
                  />
                )}

                {/* Progress SVG Ring */}
                <svg className="w-32 h-32 transform -rotate-90 pointer-events-none">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e05a88"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={351.8}
                    strokeDashoffset={351.8 - (351.8 * scanProgress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-75"
                  />
                </svg>

                {/* Center Touch Sensor Button */}
                <button
                  onMouseDown={handleStartScan}
                  onMouseUp={handleStopScan}
                  onMouseLeave={handleStopScan}
                  onTouchStart={handleStartScan}
                  onTouchEnd={handleStopScan}
                  className={`absolute w-24 h-24 rounded-full flex flex-col items-center justify-center select-none cursor-pointer transition-all duration-300 ${
                    isSynced
                      ? 'bg-gradient-to-tr from-rose-600 to-violet-600 shadow-[0_0_30px_rgba(224,90,136,0.9)] scale-105'
                      : isScanning
                      ? 'bg-rose-600/50 shadow-[0_0_25px_rgba(224,90,136,0.8)] scale-95'
                      : 'bg-midnight-950 border-2 border-rose-500/40 hover:border-rose-400 hover:scale-105 shadow-xl'
                  }`}
                >
                  {isSynced ? (
                    <CheckCircle2 className="w-9 h-9 text-white animate-bounce" />
                  ) : (
                    <Fingerprint className={`w-9 h-9 transition-colors ${
                      isScanning ? 'text-white animate-pulse' : 'text-rose-400'
                    }`} />
                  )}

                  <span className="text-[10px] font-mono text-rose-200 mt-1 font-semibold">
                    {isSynced ? '100% SYNC' : isScanning ? `${scanProgress}%` : 'HOLD'}
                  </span>
                </button>
              </div>
            </div>

            {/* 🕰️ HATKE FEATURE: TIME MACHINE CAPSULE SLIDER ("Our Future Years") */}
            <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FastForward className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-sans uppercase tracking-widest text-slate-300 font-medium">
                    Time Machine Slider: Travel Through Our Lifetimes
                  </span>
                </div>
                <span className="text-xs font-mono text-rose-300 font-medium">
                  {FUTURE_STATIONS[futureIndex].yearLabel}
                </span>
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min={0}
                max={FUTURE_STATIONS.length - 1}
                value={futureIndex}
                onChange={(e) => {
                  vaultAudio.playCardHover();
                  setFutureIndex(Number(e.target.value));
                }}
                className="w-full h-2 bg-midnight-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />

              {/* Projected Future Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={futureIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 sm:p-5 rounded-2xl bg-midnight-950/70 border border-white/10 space-y-1.5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: FUTURE_STATIONS[futureIndex].color }} 
                    />
                    <h5 className="text-sm sm:text-base font-serif text-white font-medium">
                      {FUTURE_STATIONS[futureIndex].title}
                    </h5>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans font-light leading-relaxed">
                    &ldquo;{FUTURE_STATIONS[futureIndex].text}&rdquo;
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* 📜 VERTICAL MILESTONE ROADMAP */}
      <div className="w-full max-w-3xl space-y-8 my-6">
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-sans uppercase tracking-widest text-rose-300/80">
            Memory Landmarks
          </span>
          <h3 className="text-2xl sm:text-4xl font-serif text-white">
            The Chapters That Made Us
          </h3>
        </div>

        <div className="relative w-full space-y-8">
          {/* Central Glowing Connector Line */}
          <div className="absolute top-4 bottom-4 left-6 sm:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-rose-500/40 via-violet-500/40 to-rose-500/20" />

          {timeline.map((item, idx) => {
            const isEven = idx % 2 === 0;
            const IconComponent = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : Sparkles;
            const loveCount = lovedMilestones[item.id] || 0;
            const isExpanded = activeMilestoneId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`relative flex items-start gap-4 sm:gap-8 ${
                  isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Central Glowing Icon Node */}
                <div 
                  onClick={() => {
                    vaultAudio.playCardHover();
                    setActiveMilestoneId(isExpanded ? null : item.id);
                  }}
                  className="relative z-10 w-12 h-12 rounded-full bg-midnight-900 border-2 border-rose-500/40 flex items-center justify-center shrink-0 cursor-pointer shadow-glow-rose hover:scale-110 transition-transform group"
                >
                  <IconComponent className="w-5 h-5 text-rose-400 group-hover:text-rose-200 transition-colors" />
                  <div className="absolute -inset-1 rounded-full bg-rose-500/20 blur-sm pointer-events-none group-hover:bg-rose-500/40 transition-colors" />
                </div>

                {/* Milestone Content Card */}
                <div className="flex-1 min-w-0">
                  <TiltCard maxTilt={4} scale={1.01} className="w-full">
                    <div 
                      onClick={() => {
                        vaultAudio.playCardHover();
                        setActiveMilestoneId(isExpanded ? null : item.id);
                      }}
                      className="vault-card rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer shadow-xl relative overflow-hidden group"
                    >
                      {/* Top Date & Location Tags */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-[11px] font-sans tracking-wider uppercase text-rose-400/90">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        {item.location && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3 h-3 text-rose-300/70" />
                            {item.location}
                          </span>
                        )}
                      </div>

                      {/* Milestone Title */}
                      <h4 className="text-xl sm:text-2xl font-serif text-white font-normal group-hover:text-rose-200 transition-colors">
                        {item.title}
                      </h4>

                      {/* Description */}
                      <p className="mt-2 text-sm text-slate-300 font-sans font-light leading-relaxed">
                        {item.description}
                      </p>

                      {/* Optional Photo */}
                      {item.imageUrl && (
                        <div className="mt-4 rounded-xl overflow-hidden aspect-video relative group/img bg-slate-900/60 border border-white/5">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                      )}

                      {/* Interactive Heart Reaction Button */}
                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-sans">
                        <span className="text-[11px] text-slate-400">
                          {loveCount > 0 ? `${loveCount} Hearts for this chapter` : 'Send a heart to this chapter'}
                        </span>
                        <button
                          onClick={(e) => handleLoveMilestone(item.id, e)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-all hover:scale-105 active:scale-95"
                        >
                          <Heart className={`w-3.5 h-3.5 ${loveCount > 0 ? 'fill-rose-400 text-rose-400 animate-bounce' : 'text-rose-300'}`} />
                          <span className="font-mono font-medium">{loveCount}</span>
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation CTA to Portal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pt-6 pb-12 text-center"
      >
        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white font-sans text-xs sm:text-sm tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          <span>Step Into Our Memory Gallery</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
