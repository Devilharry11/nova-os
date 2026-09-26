import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Heart,
  Vibrate,
  Eraser,
  CheckCircle2,
  Film
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';
import { triggerFireworks } from '../../utils/celebration';

// Interactive Scratch-To-Reveal Canvas Component
const ScratchCanvas: React.FC<{
  imageUrl: string;
  caption: string;
  isRevealed: boolean;
  onRevealed: () => void;
}> = ({ imageUrl, caption, isRevealed, onRevealed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const strokeCountRef = useRef(0);

  // Initialize Canvas with Shimmering Stardust Overlay
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Metallic rose-gold gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#be185d');
    grad.addColorStop(0.3, '#831843');
    grad.addColorStop(0.7, '#4c0519');
    grad.addColorStop(1, '#881337');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add Stardust specks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 150; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * height;
      const sr = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Centered Call-To-Action Text
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = 'rgba(255, 230, 240, 0.95)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH WITH FINGER OR MOUSE ✨', width / 2, height / 2 - 12);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('Uncover our hidden secret memory', width / 2, height / 2 + 14);
  }, []);

  useEffect(() => {
    if (!isRevealed) {
      initCanvas();
    }
  }, [initCanvas, isRevealed]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();

    strokeCountRef.current += 1;
    vaultAudio.playScratchTick();

    // Check progress periodically
    if (strokeCountRef.current % 6 === 0) {
      const newPercent = Math.min(100, Math.round(strokeCountRef.current * 1.8));
      setScratchedPercent(newPercent);
      if (newPercent >= 45) {
        onRevealed();
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsScratching(false);
  };

  return (
    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-rose-500/40 shadow-2xl select-none touch-none">
      {/* Underlying Secret Photo */}
      <img
        src={imageUrl}
        alt={caption}
        className="w-full h-full object-cover"
      />

      {/* Foreground Scratch Canvas */}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-500"
        />
      )}

      {/* Quick Reveal Floating Button */}
      {!isRevealed && (
        <div className="absolute bottom-3 right-3 z-10">
          <button
            onClick={onRevealed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-[11px] font-sans text-rose-200 border border-rose-400/40 transition-all hover:scale-105"
          >
            <Eraser className="w-3.5 h-3.5 text-rose-300" />
            <span>Reveal Secret ({scratchedPercent}%)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const ScreenScrapbook: React.FC = () => {
  const { config, setScreen, activeMemoryIndex, setActiveMemoryIndex } = useExperience();
  const memories = config.memories;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  // 📸 HATKE FEATURE 1: Polaroid Chemical Development State
  // Track developed memories (default: first memory developed, others start in authentic undeveloped emulsion)
  const [developedIds, setDevelopedIds] = useState<Record<string, boolean>>({
    [memories[0]?.id || '']: true,
  });
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // ✨ HATKE FEATURE 2: Scratch-to-reveal mode toggle
  const [revealedScratchMap, setRevealedScratchMap] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'polaroid' | 'scratch' | 'cinema'>('polaroid');

  const currentMemory = memories[activeMemoryIndex] || memories[0];
  const isLast = activeMemoryIndex === memories.length - 1;
  const isFlipped = flippedIndex === activeMemoryIndex;
  const isDeveloped = !!developedIds[currentMemory.id];
  const isScratched = !!revealedScratchMap[currentMemory.id];

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
    }, currentMemory?.duration || 6000);

    return () => clearTimeout(timer);
  }, [isPlaying, isFlipped, activeMemoryIndex, memories.length, currentMemory?.duration, setActiveMemoryIndex]);

  // Handle Shake-To-Develop Action
  const handleDevelop = () => {
    if (isDeveloped || isShaking) return;
    setIsShaking(true);
    vaultAudio.playCameraShutter();

    // Trigger physical shaking animation for 1.2 seconds, then develop photo
    setTimeout(() => {
      setIsShaking(false);
      setDevelopedIds((prev) => ({ ...prev, [currentMemory.id]: true }));
      vaultAudio.playHeartCollect();
      triggerFireworks();
    }, 1200);
  };

  const handleDevelopAll = () => {
    vaultAudio.playCelebrationBurst();
    triggerFireworks();
    const all: Record<string, boolean> = {};
    memories.forEach((m) => { all[m.id] = true; });
    setDevelopedIds(all);
  };

  const handleScratchRevealed = () => {
    if (!isScratched) {
      setRevealedScratchMap((prev) => ({ ...prev, [currentMemory.id]: true }));
      vaultAudio.playCelebrationBurst();
      triggerFireworks();
    }
  };

  const handleNext = () => {
    if (isLast) {
      vaultAudio.playCardHover();
      setScreen('chatgpt');
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

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-between px-4 sm:px-6 py-6 max-w-4xl mx-auto selection:bg-rose-500/30">
      {/* Top Header & Interactive Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-sans tracking-wider text-slate-400">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-rose-400" />
          <span className="uppercase text-slate-300">
            Memory {activeMemoryIndex + 1} of {memories.length}
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-[11px] text-rose-300">
            {isDeveloped ? 'Developed 📸' : 'Needs Development 📳'}
          </span>
        </div>

        {/* View Mode Pills (Hatke Interactive Modes) */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-midnight-950/80 border border-white/10">
          <button
            onClick={() => {
              vaultAudio.playCardHover();
              setViewMode('polaroid');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-[11px] ${
              viewMode === 'polaroid'
                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3 h-3 text-rose-400" />
            <span>Shake Polaroid</span>
          </button>

          <button
            onClick={() => {
              vaultAudio.playCardHover();
              setViewMode('scratch');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-[11px] ${
              viewMode === 'scratch'
                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Stardust Scratch</span>
          </button>

          <button
            onClick={() => {
              vaultAudio.playCardHover();
              setViewMode('cinema');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-[11px] ${
              viewMode === 'cinema'
                ? 'bg-violet-500/20 text-violet-200 border border-violet-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3 h-3 text-violet-400" />
            <span>Cinema</span>
          </button>
        </div>
      </div>

      {/* Main Memory Display Area */}
      <div className="my-auto py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentMemory.id}-${viewMode}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {/* MODE 1: POLAROID WITH SHAKE-TO-DEVELOP & POSTCARD FLIP */}
            {viewMode === 'polaroid' && (
              <div className="w-full max-w-md mx-auto perspective-1000">
                <TiltCard maxTilt={8} scale={1.01} glare={!isFlipped}>
                  <motion.div
                    animate={
                      isShaking
                        ? {
                            rotate: [-6, 6, -5, 5, -3, 3, 0],
                            x: [-12, 12, -9, 9, -5, 5, 0],
                          }
                        : {}
                    }
                    transition={{ duration: 0.35, repeat: isShaking ? 3 : 0 }}
                    onClick={isDeveloped ? toggleFlip : undefined}
                    className="relative w-full cursor-pointer transition-transform duration-700 preserve-3d"
                    style={{
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* FRONT OF POLAROID */}
                    <div 
                      className="w-full p-4 pb-8 bg-[#fdfbf7] rounded-xl shadow-2xl polaroid-frame text-slate-800 backface-hidden"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      {/* Romantic Washi Tape Accent */}
                      <div className="w-24 h-6 -mt-7 mx-auto bg-rose-200/70 backdrop-blur-sm border-t border-b border-rose-300/40 transform -rotate-2" />

                      {/* Chemical Polaroid Photo Emulsion Area */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded mt-2 bg-slate-900 group">
                        {/* The Actual Memory Image */}
                        <img
                          src={currentMemory.imageUrl}
                          alt={currentMemory.caption}
                          className={`w-full h-full object-cover transition-all duration-1000 ${
                            isDeveloped
                              ? 'filter-none scale-100'
                              : 'filter blur-[12px] brightness-50 contrast-75 sepia-[0.8]'
                          }`}
                        />

                        {/* Undeveloped Foggy Chemical Milky Mask */}
                        {!isDeveloped && (
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#1b1429]/95 via-[#2d1b36]/80 to-[#12081c]/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-300 animate-pulse">
                              <Camera className="w-6 h-6" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-sans uppercase tracking-widest text-rose-300 font-semibold">
                                Chemical Film Developing
                              </span>
                              <p className="text-[11px] font-sans text-slate-300">
                                Photographic emulsion is fresh. Shake or tap to develop!
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDevelop();
                              }}
                              disabled={isShaking}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white text-xs font-sans tracking-wider uppercase font-medium shadow-glow-rose hover:scale-105 active:scale-95 transition-all"
                            >
                              <Vibrate className="w-3.5 h-3.5 text-rose-200 animate-spin" />
                              <span>{isShaking ? 'Developing Chemically...' : 'Shake To Develop 📳'}</span>
                            </button>
                          </div>
                        )}

                        {/* Developed Flip Prompt Badge */}
                        {isDeveloped && (
                          <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white/95 flex items-center gap-1.5 font-sans border border-white/10 shadow-md">
                            <Rotate3d className="w-3.5 h-3.5 text-rose-300" />
                            <span>Click photo to flip</span>
                          </div>
                        )}
                      </div>

                      {/* Polaroid Handwritten Caption */}
                      <div className="mt-4 px-2 text-center space-y-1.5">
                        <p className="font-handwriting text-2xl sm:text-3xl text-slate-900 leading-tight">
                          {currentMemory.caption}
                        </p>
                        <div className="flex items-center justify-center gap-3 text-[11px] font-sans tracking-widest uppercase text-slate-500">
                          {currentMemory.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-rose-400" />
                              <span>{currentMemory.date}</span>
                            </span>
                          )}
                          {currentMemory.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-400" />
                              <span>{currentMemory.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* BACK OF POLAROID: SECRET POSTCARD LOVE NOTE */}
                    <div
                      className="absolute inset-0 w-full h-full p-6 sm:p-8 bg-[#f7f2e7] rounded-xl shadow-2xl border border-amber-200/60 text-slate-800 flex flex-col justify-between"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      {/* Postcard Postal Header */}
                      <div className="flex items-center justify-between border-b border-amber-300/40 pb-3">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/30" />
                          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-semibold">
                            LOVE LETTER POSTCARD &bull; MEMORY #{activeMemoryIndex + 1}
                          </span>
                        </div>
                        {/* Postage Stamp */}
                        <div className="w-11 h-13 border-2 border-dashed border-rose-400/60 rounded flex flex-col items-center justify-center p-1 bg-rose-50/60 shadow-sm">
                          <Sparkles className="w-4 h-4 text-rose-500" />
                          <span className="text-[7px] font-mono font-bold text-rose-600 mt-0.5">FOREVER</span>
                        </div>
                      </div>

                      {/* Handwritten Postcard Message */}
                      <div className="my-auto space-y-3 px-2 py-4">
                        <p className="font-handwriting text-2xl sm:text-3xl text-slate-900 leading-snug">
                          &ldquo;Every time I look at this picture, I fall in love with you all over again.&rdquo;
                        </p>
                        <p className="text-xs font-serif italic text-slate-600">
                          Captured at: {currentMemory.location || 'In our happy place'} &bull; {currentMemory.date}
                        </p>
                      </div>

                      {/* Postcard Footer */}
                      <div className="pt-3 border-t border-amber-300/40 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                        <span className="font-handwriting text-xl text-rose-600">With all my love</span>
                        <span className="flex items-center gap-1 text-[10px] text-rose-500 font-medium uppercase tracking-wider">
                          <Rotate3d className="w-3 h-3" /> Flip back
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </TiltCard>
              </div>
            )}

            {/* MODE 2: HATKE STARDUST SCRATCH-TO-REVEAL */}
            {viewMode === 'scratch' && (
              <div className="w-full max-w-lg mx-auto space-y-4">
                <TiltCard maxTilt={6} scale={1.01}>
                  <div className="vault-card rounded-3xl p-5 sm:p-6 border border-rose-500/40 shadow-glow-rose space-y-4">
                    <div className="flex items-center justify-between text-xs font-sans text-rose-300">
                      <span className="uppercase tracking-widest flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Interactive Stardust Scratch</span>
                      </span>
                      {isScratched && (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Secret Unlocked</span>
                        </span>
                      )}
                    </div>

                    {/* The Scratch Canvas */}
                    <ScratchCanvas
                      imageUrl={currentMemory.imageUrl}
                      caption={currentMemory.caption}
                      isRevealed={isScratched}
                      onRevealed={handleScratchRevealed}
                    />

                    <div className="text-center pt-2 space-y-1">
                      <p className="text-lg font-serif text-white">
                        {currentMemory.caption}
                      </p>
                      <p className="text-xs text-slate-400 font-sans">
                        {currentMemory.date} {currentMemory.location && `&bull; ${currentMemory.location}`}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </div>
            )}

            {/* MODE 3: CINEMATIC FULL FRAME */}
            {viewMode === 'cinema' && (
              <TiltCard maxTilt={4} scale={1.01}>
                <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border border-rose-500/30 bg-black shadow-2xl relative">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <motion.img
                      src={currentMemory.imageUrl}
                      alt={currentMemory.caption}
                      animate={{ scale: [1, 1.05] }}
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
                </div>
              </TiltCard>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        {/* Navigation Indicator Dots */}
        <div className="flex items-center gap-2">
          {memories.map((m, idx) => {
            const isMemDev = !!developedIds[m.id];
            return (
              <button
                key={m.id}
                onClick={() => {
                  vaultAudio.playSoftTransition();
                  setActiveMemoryIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeMemoryIndex
                    ? 'w-8 bg-rose-400 shadow-sm shadow-rose-400'
                    : isMemDev
                    ? 'w-2.5 bg-rose-500/50 hover:bg-rose-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Memory ${idx + 1} (${isMemDev ? 'Developed' : 'Undeveloped'})`}
              />
            );
          })}

          {/* Quick Develop All Button if any undeveloped */}
          {Object.keys(developedIds).length < memories.length && (
            <button
              onClick={handleDevelopAll}
              className="ml-2 text-[10px] font-sans text-rose-300 hover:text-white underline underline-offset-2"
              title="Develop all polaroids instantly"
            >
              Develop All
            </button>
          )}
        </div>

        {/* Playback Controls & Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
            title={isPlaying ? 'Pause slideshow' : 'Auto-play slideshow'}
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
            <span>{isLast ? 'Ask LoveGPT AI Reveal 🤖' : 'Next Memory'}</span>
            {isLast ? <ArrowRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
