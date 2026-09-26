import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Compass } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { CinematicTypography } from '../common/CinematicTypography';
import { TiltCard } from '../common/TiltCard';

export const ScreenWelcome: React.FC = () => {
  const { config, setScreen, setIsInstaPlaying } = useExperience();

  const handleStart = () => {
    vaultAudio.playHeartCollect();
    setIsInstaPlaying(true);
    setScreen('timeline');
  };

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8">
      {/* Soft central halo */}
      <div className="absolute w-[36rem] h-[36rem] rounded-full bg-rose-500/10 blur-[130px] pointer-events-none" />

      <TiltCard maxTilt={4} scale={1.005} glare={false} className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full space-y-6 sm:space-y-8"
        >
          {/* Subtle romantic badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>A PRIVATE UNIVERSE // {config.coupleNames}</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
          </motion.div>

          {/* Main Title & Headline */}
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-white leading-tight"
            >
              {config.welcomeMessage}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-base sm:text-lg text-slate-300/90 font-sans font-light tracking-wide max-w-lg mx-auto leading-relaxed"
            >
              {config.welcomeSubtext}
            </motion.p>

            {/* Optional Typography Quote */}
            {(() => {
              const typo = config.typography.find((t) => t.section === 'welcome');
              if (!typo) return null;
              return (
                <div className="pt-3">
                  <CinematicTypography
                    text={typo.text}
                    preset={typo.preset}
                    fontSize={typo.fontSize}
                    fontFamily={typo.fontFamily}
                    color={typo.color}
                    glow={typo.glow}
                  />
                </div>
              );
            })()}
          </div>

          {/* Primary CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="pt-4"
          >
            <button
              onClick={handleStart}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-sans font-medium text-sm sm:text-base tracking-wider text-white transition-all duration-300 overflow-hidden shadow-glow-rose hover:scale-[1.03] active:scale-[0.98]"
            >
              {/* Button Gradient Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-violet-600 transition-all duration-500 group-hover:opacity-90" />
              
              {/* Shimmer light sweep */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35)_0%,_transparent_70%)]" />

              <span className="relative z-10 font-sans tracking-widest uppercase text-xs sm:text-sm">
                Begin the Journey
              </span>
              <Compass className="relative z-10 w-4 h-4 text-rose-200 transition-transform duration-500 group-hover:rotate-45" />
            </button>
          </motion.div>

          {/* Quiet audio footnote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="text-xs text-slate-400 font-sans tracking-wider"
          >
            Best experienced with sound on &bull; Headphones recommended
          </motion.p>
        </motion.div>
      </TiltCard>
    </div>
  );
};
