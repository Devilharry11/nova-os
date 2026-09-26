import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { triggerFireworks } from '../../utils/celebration';

export const ScreenHeartPortal: React.FC = () => {
  const { setScreen } = useExperience();
  const [isOpening, setIsOpening] = useState(false);

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
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 text-center overflow-hidden">
      {/* Radiant Background Bloom */}
      <motion.div
        animate={{
          scale: isOpening ? [1, 3] : [1, 1.15, 1],
          opacity: isOpening ? [0.4, 0.9, 0] : [0.2, 0.4, 0.2],
        }}
        transition={{ duration: isOpening ? 1.2 : 4, repeat: isOpening ? 0 : Infinity }}
        className="absolute w-[32rem] h-[32rem] rounded-full bg-gradient-to-r from-rose-500/20 via-violet-600/20 to-rose-400/20 blur-[110px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-xl space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>GATEWAY OF REMEMBRANCE</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Every little moment led you here.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans font-light">
            Touch the glowing heart to step into the vault of our shared memories.
          </p>
        </div>

        {/* The Heart Portal Element */}
        <div className="relative w-72 sm:w-84 h-72 sm:h-84 mx-auto my-6 flex items-center justify-center">
          {/* Orbiting Starlight Particle Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-rose-500/20 pointer-events-none"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-300 shadow-[0_0_15px_#ff8fa3]" />
            <div className="absolute bottom-4 right-10 w-2 h-2 rounded-full bg-violet-300 shadow-[0_0_10px_#9d72ff]" />
            <div className="absolute top-1/3 left-2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
          </motion.div>

          {/* Glowing Inner Halo */}
          <motion.div
            animate={{
              scale: [0.95, 1.05, 0.95],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-4 rounded-full bg-gradient-to-tr from-rose-600/30 to-violet-600/30 blur-xl pointer-events-none"
          />

          {/* Interactive Portal Center Button */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenPortal}
            disabled={isOpening}
            className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center p-6 border border-rose-400/40 bg-gradient-to-b from-rose-950/60 via-midnight-950/80 to-violet-950/60 backdrop-blur-2xl shadow-portal cursor-pointer group"
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
              <Heart className="w-16 h-16 sm:w-20 sm:h-20 fill-rose-500/40 drop-shadow-[0_0_20px_rgba(224,90,136,0.8)]" />
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
