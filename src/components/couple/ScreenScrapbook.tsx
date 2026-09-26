import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  Heart,
  Sun,
  Camera,
  Maximize2
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';

export const ScreenScrapbook: React.FC = () => {
  const { config, setScreen } = useExperience();
  const memories = config.memories || [];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isRayShooting, setIsRayShooting] = useState<boolean>(false);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [isFullZoom, setIsFullZoom] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeMemory = memories[currentIndex] || memories[0];

  const triggerRayPulse = () => {
    setIsRayShooting(true);
    vaultAudio.playLightRayBeam();
    setTimeout(() => setIsRayShooting(false), 800);
  };

  const handleNext = () => {
    if (memories.length === 0) return;
    setDirection('next');
    triggerRayPulse();
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    if (memories.length === 0) return;
    setDirection('prev');
    triggerRayPulse();
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const handleSelectNode = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 'next' : 'prev');
    triggerRayPulse();
    setCurrentIndex(idx);
  };

  const handleTogglePlay = () => {
    vaultAudio.playCardHover();
    setIsPlaying((prev) => !prev);
  };

  // Auto-play ray stream effect
  useEffect(() => {
    if (isPlaying && memories.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        handleNext();
      }, 4200);
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    }
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, currentIndex, memories.length]);

  const handleLike = (id: string) => {
    vaultAudio.playHeartCollect();
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleContinue = () => {
    vaultAudio.playSoftTransition();
    setScreen('music');
  };

  if (!memories.length) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
        <Camera className="w-12 h-12 mb-3 text-rose-400" />
        <p>No memory photographs configured yet in studio.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-between px-3 sm:px-6 py-6 max-w-6xl w-full mx-auto select-none overflow-hidden">
      {/* 1. TOP HEADER & LIGHT RAY STREAM TITLE */}
      <div className="flex flex-wrap items-center justify-between gap-4 z-20 pb-2">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-sans tracking-widest uppercase">
            <Sun className={`w-3.5 h-3.5 text-amber-300 ${isRayShooting ? 'animate-spin' : ''}`} />
            <span>LIGHT RAY PHOTO STREAM</span>
            <Sparkles className="w-3 h-3 text-rose-400" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-wide">
            Our Journey Along The Light
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Memories emerging one by one along the luminous ray of our time together.
          </p>
        </div>

        {/* Action Controls: Auto-Stream & Counter */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans tracking-wider border transition-all ${
              isPlaying
                ? 'bg-rose-500/25 border-rose-500/40 text-rose-200 shadow-glow-rose'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-rose-300" />
                <span>Pause Beam</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Auto-Stream Ray</span>
              </>
            )}
          </button>

          <span className="text-xs font-mono text-slate-400 px-3 py-1.5 rounded-full bg-midnight-900/80 border border-white/10">
            {currentIndex + 1} / {memories.length}
          </span>
        </div>
      </div>

      {/* 2. THE GLOWING CENTRAL LIGHT RAY BEAM (HORIZON LASER & PARTICLES) */}
      <div className="relative w-full my-6 flex items-center justify-center">
        {/* Continuous Baseline Glowing Ray */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500/40 to-transparent blur-sm pointer-events-none" />
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-200 to-transparent pointer-events-none" />

        {/* Dynamic Shooting Laser Beam Wave */}
        <AnimatePresence>
          {isRayShooting && (
            <motion.div
              initial={{ x: direction === 'next' ? '-100%' : '100%', opacity: 0 }}
              animate={{ x: direction === 'next' ? '100%' : '-100%', opacity: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeInOut' }}
              className="absolute inset-y-0 h-4 w-96 bg-gradient-to-r from-transparent via-white via-amber-300 to-transparent blur-md pointer-events-none z-30"
            />
          )}
        </AnimatePresence>

        {/* Lens Flare Center Star Burst */}
        <div 
          className={`absolute w-36 h-36 rounded-full bg-gradient-to-r from-rose-500/30 via-amber-400/40 to-violet-500/30 blur-2xl pointer-events-none transition-all duration-700 ${
            isRayShooting ? 'scale-150 opacity-100' : 'scale-90 opacity-40'
          }`}
        />

        {/* MAIN PHOTO DISPLAY WITH RAY EMERGENCE ANIMATION */}
        <div className="relative z-10 w-full max-w-xl mx-auto py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMemory.id || currentIndex}
              initial={{ 
                opacity: 0, 
                scale: 0.7, 
                filter: 'blur(12px) brightness(2.5)',
                x: direction === 'next' ? 60 : -60 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                filter: 'blur(0px) brightness(1)',
                x: 0 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.85, 
                filter: 'blur(8px) brightness(1.8)',
                x: direction === 'next' ? -60 : 60 
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full"
            >
              <TiltCard maxTilt={5} scale={1.01} className="w-full">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#221028]/95 via-[#180d1e]/95 to-[#100714]/95 border-2 border-rose-500/40 shadow-[0_0_40px_rgba(224,90,136,0.35)] backdrop-blur-xl p-4 sm:p-6 space-y-4">
                  
                  {/* Photo Frame with Glowing Holographic Border */}
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/15 group">
                    <img
                      src={activeMemory.imageUrl}
                      alt={activeMemory.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="eager"
                    />

                    {/* Light Ray Shimmer on Photo */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-rose-500/20 pointer-events-none" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      {activeMemory.date && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-amber-200 font-mono">
                          <Calendar className="w-3 h-3 text-amber-300" />
                          <span>{activeMemory.date}</span>
                        </div>
                      )}

                      {activeMemory.location && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-rose-200 font-sans">
                          <MapPin className="w-3 h-3 text-rose-300" />
                          <span>{activeMemory.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Full Zoom trigger */}
                    <button
                      onClick={() => setIsFullZoom(true)}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                      title="Enlarge photograph"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Caption & Romantic Description */}
                  <div className="space-y-2 pt-1">
                    <p className="text-base sm:text-lg font-serif text-white leading-relaxed">
                      &ldquo;{activeMemory.caption}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                        <span className="font-sans tracking-wide">Memory #{currentIndex + 1} of {memories.length}</span>
                      </div>

                      {/* Interactive Heart Reaction on this memory */}
                      <button
                        onClick={() => handleLike(activeMemory.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition-all active:scale-95"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500/50 text-rose-400" />
                        <span className="font-mono text-xs">{(likes[activeMemory.id] || 0) + 1}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. LIGHT RAY TIMELINE NODES (CLICKABLE PATHWAY) */}
      <div className="relative z-20 py-3 space-y-4">
        {/* Glowing Node Points along the ray */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2 px-4 no-scrollbar">
          {memories.map((m, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={m.id || idx}
                onClick={() => handleSelectNode(idx)}
                className={`relative group flex items-center justify-center transition-all ${
                  isActive ? 'scale-125' : 'hover:scale-110 opacity-70 hover:opacity-100'
                }`}
                title={`Memory ${idx + 1}: ${m.caption.slice(0, 30)}...`}
              >
                {/* Active Halo */}
                {isActive && (
                  <motion.div
                    layoutId="rayActiveNodeHalo"
                    className="absolute -inset-2 rounded-full bg-gradient-to-r from-rose-500 via-amber-300 to-violet-500 blur-sm opacity-80"
                  />
                )}

                {/* Node Pill */}
                <div
                  className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 transition-all ${
                    isActive
                      ? 'border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                      : 'border-white/20 bg-midnight-900'
                  }`}
                >
                  <img
                    src={m.imageUrl}
                    alt={m.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Step Arrows & Continue CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
          {/* Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-sans border border-white/10 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous Ray</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-sans border border-rose-500/40 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <span className="hidden sm:inline">Next Ray</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Continue to Romantic Cassette Mixtape */}
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white text-xs font-sans tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Next: Romantic Soundscape Mixtape</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FULLSCREEN PHOTO MODAL */}
      <AnimatePresence>
        {isFullZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullZoom(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeMemory.imageUrl}
                alt={activeMemory.caption}
                className="w-full h-full object-contain max-h-[80vh] rounded-2xl"
              />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent text-center space-y-1">
                <p className="text-white font-serif text-lg">&ldquo;{activeMemory.caption}&rdquo;</p>
                <p className="text-xs text-rose-300 font-mono">{activeMemory.date} {activeMemory.location ? `• ${activeMemory.location}` : ''}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
