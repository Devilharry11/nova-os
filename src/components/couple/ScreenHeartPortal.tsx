import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { triggerFireworks } from '../../utils/celebration';

// Coordinates forming an elegant celestial constellation surrounding the portal
const CONSTELLATION_POINTS = [
  { x: 200, y: 110 }, // Center top cleft
  { x: 135, y: 55 },  // Left top arch
  { x: 60, y: 100 },  // Left swell
  { x: 50, y: 180 },  // Left mid
  { x: 105, y: 275 }, // Left lower
  { x: 200, y: 350 }, // Bottom tip
  { x: 295, y: 275 }, // Right lower
  { x: 350, y: 180 }, // Right mid
  { x: 340, y: 100 }, // Right swell
  { x: 265, y: 55 },  // Right top arch
];

export const ScreenHeartPortal: React.FC = () => {
  const { setScreen, collectedHearts } = useExperience();
  const [isOpening, setIsOpening] = useState(false);
  const [litStars, setLitStars] = useState<number>(0);

  useEffect(() => {
    // Sequentially illuminate constellation nodes
    const interval = setInterval(() => {
      setLitStars((prev) => {
        if (prev < CONSTELLATION_POINTS.length) {
          vaultAudio.playStarConnect();
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleOpenPortal = () => {
    if (isOpening) return;
    setIsOpening(true);
    vaultAudio.playPortalResonance();
    triggerFireworks();

    setTimeout(() => {
      setScreen('scrapbook');
    }, 1300);
  };

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-8 text-center overflow-hidden">
      {/* Radiant Background Bloom */}
      <motion.div
        animate={{
          scale: isOpening ? [1, 3] : [1, 1.15, 1],
          opacity: isOpening ? [0.4, 0.9, 0] : [0.2, 0.4, 0.2],
        }}
        transition={{ duration: isOpening ? 1.2 : 4, repeat: isOpening ? 0 : Infinity }}
        className="absolute w-[36rem] h-[36rem] rounded-full bg-gradient-to-r from-rose-500/20 via-violet-600/20 to-rose-400/20 blur-[120px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-xl space-y-5"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>CELESTIAL GATEWAY &bull; {collectedHearts} HEARTS GATHERED</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Step Into Our Sacred Memories
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans font-light max-w-md mx-auto">
            The constellation has aligned. Touch the glowing heart portal to unlock our memory vault.
          </p>
        </div>

        {/* Combined Constellation + Heart Portal Element */}
        <div className="relative w-84 sm:w-96 h-84 sm:h-96 mx-auto my-4 flex items-center justify-center">
          {/* Constellation SVG Overlay */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_20px_rgba(224,90,136,0.3)]"
          >
            <defs>
              <linearGradient id="portalLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e05a88" />
                <stop offset="50%" stopColor="#ff8fa3" />
                <stop offset="100%" stopColor="#9d72ff" />
              </linearGradient>
            </defs>

            {/* Connecting Starlight Lines */}
            {CONSTELLATION_POINTS.map((pt, idx) => {
              if (idx >= litStars) return null;
              const nextPt = CONSTELLATION_POINTS[(idx + 1) % CONSTELLATION_POINTS.length];

              return (
                <motion.line
                  key={`line-${idx}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ duration: 0.3 }}
                  x1={pt.x}
                  y1={pt.y}
                  x2={nextPt.x}
                  y2={nextPt.y}
                  stroke="url(#portalLineGrad)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              );
            })}

            {/* Glowing Star Nodes */}
            {CONSTELLATION_POINTS.map((pt, idx) => {
              const isLit = idx < litStars;
              return (
                <g key={`star-${idx}`}>
                  {isLit && (
                    <motion.circle
                      initial={{ r: 0 }}
                      animate={{ r: [3, 8, 3], opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.15 }}
                      cx={pt.x}
                      cy={pt.y}
                      fill="#e05a88"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isLit ? 3.5 : 1.5}
                    fill={isLit ? '#ffffff' : '#334155'}
                  />
                </g>
              );
            })}
          </svg>

          {/* Orbiting Starlight Particle Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 rounded-full border border-rose-500/20 pointer-events-none"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-300 shadow-[0_0_15px_#ff8fa3]" />
            <div className="absolute bottom-4 right-10 w-2 h-2 rounded-full bg-violet-300 shadow-[0_0_10px_#9d72ff]" />
            <div className="absolute top-1/3 left-2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
          </motion.div>

          {/* Interactive Portal Center Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenPortal}
            disabled={isOpening}
            className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center p-6 border-2 border-rose-400/50 bg-gradient-to-b from-rose-950/70 via-midnight-950/90 to-violet-950/70 backdrop-blur-2xl shadow-portal cursor-pointer group"
          >
            {/* Heart SVG inside portal */}
            <motion.div
              animate={{
                scale: isOpening ? [1, 2.5] : [1, 1.08, 1],
                rotate: isOpening ? 20 : 0,
              }}
              transition={{ duration: isOpening ? 1 : 2.5, repeat: isOpening ? 0 : Infinity }}
              className="text-rose-400 group-hover:text-rose-300 transition-colors"
            >
              <Heart className="w-16 h-16 sm:w-20 sm:h-20 fill-rose-500/40 drop-shadow-[0_0_25px_rgba(224,90,136,0.85)]" />
            </motion.div>

            <span className="mt-3 text-[11px] font-sans font-medium tracking-widest uppercase text-rose-200/90 group-hover:text-white transition-colors">
              {isOpening ? 'Opening Vault...' : 'Unlock Memories'}
            </span>
          </motion.button>
        </div>

        {/* Portal Flash Transition Overlay */}
        <AnimatePresence>
          {isOpening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1 }}
              className="fixed inset-0 z-50 bg-gradient-to-t from-rose-950 via-midnight-950 to-white/20 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
