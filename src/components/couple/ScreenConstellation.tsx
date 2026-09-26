import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';

// Coordinates forming an elegant celestial heart constellation
const HEART_POINTS = [
  { x: 200, y: 140 }, // Center cleft
  { x: 140, y: 80 },  // Left top arch
  { x: 70, y: 120 },  // Left upper swell
  { x: 60, y: 190 },  // Left mid
  { x: 110, y: 270 }, // Left lower
  { x: 200, y: 340 }, // Bottom tip
  { x: 290, y: 270 }, // Right lower
  { x: 340, y: 190 }, // Right mid
  { x: 330, y: 120 }, // Right upper swell
  { x: 260, y: 80 },  // Right top arch
];

export const ScreenConstellation: React.FC = () => {
  const { setScreen, collectedHearts } = useExperience();
  const [activeStarCount, setActiveStarCount] = useState(0);

  useEffect(() => {
    // Sequentially illuminate the constellation stars
    const interval = setInterval(() => {
      setActiveStarCount((prev) => {
        if (prev < HEART_POINTS.length) {
          vaultAudio.playStarConnect();
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    vaultAudio.playPortalResonance();
    setScreen('portal');
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 text-center">
      {/* Soft background bloom */}
      <div className="absolute w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-xl space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans tracking-widest uppercase bg-violet-500/10 text-violet-300 border border-violet-500/20">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>MEMORY CONSTELLATION REVEALED</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            You found all the little pieces.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans font-light">
            Every memory, every smile, connecting into a shape that only we understand.
          </p>
        </div>

        {/* Interactive SVG Heart Constellation */}
        <div className="relative w-80 sm:w-96 h-80 sm:h-96 mx-auto my-4 flex items-center justify-center">
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full drop-shadow-[0_0_25px_rgba(224,90,136,0.35)]"
          >
            {/* Constellation Connecting Lines */}
            {HEART_POINTS.map((pt, idx) => {
              if (idx >= activeStarCount) return null;
              const nextPt = HEART_POINTS[(idx + 1) % HEART_POINTS.length];
              const isLastVisible = idx === activeStarCount - 1 && activeStarCount < HEART_POINTS.length;

              return (
                <motion.line
                  key={`line-${idx}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: isLastVisible ? 0.4 : 0.8 }}
                  transition={{ duration: 0.4 }}
                  x1={pt.x}
                  y1={pt.y}
                  x2={nextPt.x}
                  y2={nextPt.y}
                  stroke="url(#lineGradient)"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
              );
            })}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e05a88" />
                <stop offset="50%" stopColor="#ff8fa3" />
                <stop offset="100%" stopColor="#9d72ff" />
              </linearGradient>
            </defs>

            {/* Glowing Constellation Star Nodes */}
            {HEART_POINTS.map((pt, idx) => {
              const isLit = idx < activeStarCount;

              return (
                <g 
                  key={`star-${idx}`} 
                  onClick={() => vaultAudio.playStarConnect()} 
                  className="cursor-pointer group"
                >
                  {isLit && (
                    <motion.circle
                      initial={{ r: 0, opacity: 0 }}
                      animate={{ r: [6, 12, 6], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.15 }}
                      cx={pt.x}
                      cy={pt.y}
                      fill="#e05a88"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isLit ? 4 : 2}
                    fill={isLit ? '#ffffff' : '#334155'}
                    className="transition-all duration-300 group-hover:fill-rose-300"
                  />
                </g>
              );
            })}
          </svg>

          {/* Central Heart Count Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-serif text-white font-medium">
              {collectedHearts}
            </span>
            <span className="text-[10px] font-sans tracking-widest uppercase text-rose-300/80">
              Stars Harmonized
            </span>
          </div>
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: activeStarCount >= HEART_POINTS.length ? 1 : 0.6 }}
          transition={{ duration: 0.5 }}
          className="pt-2"
        >
          <button
            onClick={handleContinue}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white font-sans text-xs tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Approach The Heart Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};
