import React, { useState, useEffect } from 'react';
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
  Camera,
  Rotate3d,
  Heart
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';
import type { AnimationPreset } from '../../types/heartVault';

export const ScreenScrapbook: React.FC = () => {
  const { config, setScreen, activeMemoryIndex, setActiveMemoryIndex } = useExperience();
  const memories = config.memories;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const currentMemory = memories[activeMemoryIndex] || memories[0];
  const isLast = activeMemoryIndex === memories.length - 1;
  const isFlipped = flippedIndex === activeMemoryIndex;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || isFlipped) return;

    const timer = setTimeout(() => {
      if (activeMemoryIndex < memories.length - 1) {
        setActiveMemoryIndex(activeMemoryIndex + 1);
        vaultAudio.playSoftTransition();
      } else {
        setIsPlaying(false);
      }
    }, currentMemory?.duration || 5000);

    return () => clearTimeout(timer);
  }, [isPlaying, isFlipped, activeMemoryIndex, memories.length, currentMemory?.duration, setActiveMemoryIndex]);

  const handleNext = () => {
    if (isLast) {
      setScreen('music');
    } else {
      vaultAudio.playSoftTransition();
      setActiveMemoryIndex(activeMemoryIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeMemoryIndex > 0) {
      vaultAudio.playSoftTransition();
      setActiveMemoryIndex(activeMemoryIndex - 1);
    }
  };

  const toggleFlip = () => {
    vaultAudio.playSoftTransition();
    setFlippedIndex(isFlipped ? null : activeMemoryIndex);
  };

  const renderMemoryWithPreset = (preset: AnimationPreset) => {
    switch (preset) {
      case 'polaroid':
        return (
          <div className="w-full max-w-md mx-auto perspective-1000">
            <TiltCard maxTilt={10} scale={1.02} glare={!isFlipped}>
              <div 
                onClick={toggleFlip}
                className="relative w-full cursor-pointer transition-transform duration-700 preserve-3d"
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* FRONT: POLAROID PHOTO */}
                <div 
                  className="w-full p-4 pb-8 bg-[#fdfbf7] rounded-lg shadow-2xl polaroid-frame text-slate-800 backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Washi Tape Accent */}
                  <div className="w-24 h-6 -mt-7 mx-auto bg-rose-200/60 backdrop-blur-sm border-t border-b border-rose-300/40 transform -rotate-2" />

                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded mt-2 bg-slate-900 group">
                    <img
                      src={currentMemory.imageUrl}
                      alt={currentMemory.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white/90 flex items-center gap-1 font-sans">
                      <Rotate3d className="w-3 h-3 text-rose-300" />
                      <span>Click to flip</span>
                    </div>
                  </div>

                  <div className="mt-4 px-2 text-center space-y-1">
                    <p className="font-handwriting text-2xl text-slate-800 leading-tight">
                      {currentMemory.caption}
                    </p>
                    {currentMemory.date && (
                      <p className="text-[11px] font-sans tracking-widest uppercase text-slate-400">
                        {currentMemory.date} {currentMemory.location && `• ${currentMemory.location}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* BACK: SECRET HANDWRITTEN POSTCARD NOTE */}
                <div
                  className="absolute inset-0 w-full h-full p-6 sm:p-8 bg-[#f7f2e7] rounded-lg shadow-2xl border border-amber-200/60 text-slate-800 flex flex-col justify-between"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {/* Postal stamp header */}
                  <div className="flex items-center justify-between border-b border-amber-300/40 pb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500/30" />
                      <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
                        POSTALE // MEMORY #{activeMemoryIndex + 1}
                      </span>
                    </div>
                    {/* Stamp */}
                    <div className="w-10 h-12 border-2 border-dashed border-rose-400/60 rounded flex flex-col items-center justify-center p-1 bg-rose-50/50">
                      <Sparkles className="w-4 h-4 text-rose-500" />
                      <span className="text-[7px] font-mono font-bold text-rose-600 mt-0.5">HEART</span>
                    </div>
                  </div>

                  {/* Secret handwritten message */}
                  <div className="my-auto space-y-3 px-2">
                    <p className="font-handwriting text-2xl sm:text-3xl text-slate-900 leading-snug">
                      &ldquo;If you look closely at this moment, you will see me falling more and more in love with you.&rdquo;
                    </p>
                    <p className="text-xs font-serif italic text-slate-600">
                      Location: {currentMemory.location || 'Everywhere with you'}
                    </p>
                  </div>

                  {/* Footer flip prompt */}
                  <div className="pt-3 border-t border-amber-300/40 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                    <span className="font-handwriting text-lg text-rose-600">Forever Yours</span>
                    <span className="flex items-center gap-1 text-[10px] text-rose-500 font-medium uppercase tracking-wider">
                      <Rotate3d className="w-3 h-3" /> Flip back
                    </span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        );

      case 'film':
        return (
          <TiltCard maxTilt={6} scale={1.01}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full max-w-xl mx-auto rounded-2xl bg-midnight-950 border border-white/10 p-3 sm:p-5 shadow-2xl overflow-hidden"
            >
              <div className="h-6 w-full film-perforation opacity-40 mb-2" />

              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10">
                <img
                  src={currentMemory.imageUrl}
                  alt={currentMemory.caption}
                  className="w-full h-full object-cover contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-serif text-white font-light">
                      {currentMemory.caption}
                    </p>
                    <p className="text-[10px] font-mono tracking-widest uppercase text-rose-300">
                      FRAME 0{activeMemoryIndex + 1} // {currentMemory.date}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-6 w-full film-perforation opacity-40 mt-2" />
            </motion.div>
          </TiltCard>
        );

      case 'cinema':
        return (
          <TiltCard maxTilt={5} scale={1.01}>
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-rose-500/20 bg-black shadow-2xl relative"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <motion.img
                  src={currentMemory.imageUrl}
                  alt={currentMemory.caption}
                  animate={{ scale: [1, 1.06] }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-black/40" />

                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 space-y-2 text-center">
                  <p className="text-xl sm:text-2xl font-serif text-white max-w-lg mx-auto leading-relaxed">
                    &ldquo;{currentMemory.caption}&rdquo;
                  </p>
                  {currentMemory.location && (
                    <p className="text-xs font-sans uppercase tracking-widest text-rose-300">
                      {currentMemory.location} &bull; {currentMemory.date}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </TiltCard>
        );

      case 'starlight':
      default:
        return (
          <TiltCard maxTilt={8} scale={1.02}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-lg mx-auto rounded-3xl p-4 sm:p-5 vault-card border border-rose-500/30 shadow-glow-rose"
            >
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={currentMemory.imageUrl}
                  alt={currentMemory.caption}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-midnight-950/70 backdrop-blur-md border border-white/10 text-[10px] font-sans tracking-widest uppercase text-rose-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" />
                  <span>STARLIGHT REVEAL</span>
                </div>
              </div>

              <div className="pt-5 pb-2 px-2 text-center space-y-2">
                <p className="text-lg sm:text-xl font-serif text-white leading-relaxed">
                  {currentMemory.caption}
                </p>

                <div className="flex items-center justify-center gap-4 text-xs font-sans text-slate-400 pt-1">
                  {currentMemory.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      <span>{currentMemory.date}</span>
                    </span>
                  )}
                  {currentMemory.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-violet-400" />
                      <span>{currentMemory.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </TiltCard>
        );
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between px-4 sm:px-6 py-6 max-w-4xl mx-auto">
      {/* Top Header & Presets Info */}
      <div className="flex items-center justify-between text-xs font-sans tracking-wider text-slate-400">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-rose-400" />
          <span className="uppercase">
            Memory {activeMemoryIndex + 1} of {memories.length}
          </span>
        </div>

        {/* Animation Preset Indicator */}
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase text-rose-300">
          Preset: {currentMemory.animation}
        </span>
      </div>

      {/* Main Memory Display Area */}
      <div className="my-auto py-6">
        <AnimatePresence mode="wait">
          <div key={currentMemory.id}>
            {renderMemoryWithPreset(currentMemory.animation)}
          </div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        {/* Navigation Indicator Dots */}
        <div className="flex items-center gap-2">
          {memories.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                vaultAudio.playSoftTransition();
                setActiveMemoryIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeMemoryIndex
                  ? 'w-8 bg-rose-400 shadow-sm shadow-rose-400'
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Memory ${idx + 1}`}
            />
          ))}
        </div>

        {/* Playback Controls & Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handlePrev}
            disabled={activeMemoryIndex === 0}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous Memory"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white font-sans text-xs tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>{isLast ? 'Listen To Our Song' : 'Next Memory'}</span>
            {isLast ? <ArrowRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
