import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Gift, 
  Smile, 
  Shield, 
  Star
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';
import type { LoveReason } from '../../types/heartVault';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  sweet: <Heart className="w-3.5 h-3.5 text-rose-400" />,
  deep: <Shield className="w-3.5 h-3.5 text-violet-400" />,
  humorous: <Smile className="w-3.5 h-3.5 text-amber-400" />,
  promise: <Star className="w-3.5 h-3.5 text-pink-400" />,
};

export const ScreenLoveNotes: React.FC = () => {
  const { config, setScreen } = useExperience();
  const reasons: LoveReason[] = config.loveReasons || [];
  
  // Track which reasons are revealed (id -> boolean)
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({
    [reasons[0]?.id || '']: true, // First one open by default
  });

  const unlockedCount = Object.values(revealedIds).filter(Boolean).length;
  const totalCount = reasons.length;

  const handleReveal = (id: string) => {
    if (!revealedIds[id]) {
      vaultAudio.playQuizSuccess();
      setRevealedIds((prev) => ({ ...prev, [id]: true }));
    } else {
      vaultAudio.playCardHover();
    }
  };

  const handleRevealAll = () => {
    vaultAudio.playCelebrationBurst();
    const all: Record<string, boolean> = {};
    reasons.forEach((r) => { all[r.id] = true; });
    setRevealedIds(all);
  };

  const handleContinue = () => {
    vaultAudio.playSoftTransition();
    setScreen('bucketList');
  };

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col items-center justify-start px-4 sm:px-6 py-10 max-w-4xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4 mb-8 w-full"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20 backdrop-blur-md">
          <Gift className="w-3.5 h-3.5 text-rose-400" />
          <span>LITTLE CONFESSIONS DECK</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
          Reasons Why I Adore You
        </h2>
        <p className="text-sm sm:text-base text-slate-300 font-sans font-light max-w-lg mx-auto">
          Tap each sealed wax envelope to scratch open a heartfelt reason, an inside joke, or a quiet truth.
        </p>

        {/* Progress & Quick Actions Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-midnight-900/70 border border-rose-500/30 text-xs text-rose-300 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Unlocked: <strong className="text-white font-medium">{unlockedCount}</strong> / {totalCount}</span>
          </div>

          {unlockedCount < totalCount && (
            <button
              onClick={handleRevealAll}
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-sans tracking-wider transition-all"
            >
              Reveal All Secrets
            </button>
          )}
        </div>
      </motion.div>

      {/* Reasons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full my-4">
        {reasons.map((reason, index) => {
          const isRevealed = !!revealedIds[reason.id];

          return (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => handleReveal(reason.id)}
              className="cursor-pointer"
            >
              <TiltCard maxTilt={5} scale={1.02} className="h-full">
                <div 
                  className={`h-full min-h-[160px] rounded-2xl p-6 transition-all duration-500 relative overflow-hidden flex flex-col justify-between border ${
                    isRevealed
                      ? 'vault-card bg-gradient-to-br from-midnight-900/90 via-midnight-950/90 to-rose-950/30 border-rose-500/30 shadow-glow-rose'
                      : 'bg-gradient-to-br from-[#1a1127] via-[#120c1f] to-[#0c0817] border-rose-400/20 hover:border-rose-400/50 shadow-lg'
                  }`}
                >
                  {/* UNREVEALED: MYSTERIOUS GOLD WAX ENVELOPE */}
                  {!isRevealed ? (
                    <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3 py-4">
                      {/* Wax Seal Icon Badge */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(224,90,136,0.6)] group-hover:scale-105 transition-transform">
                        <Heart className="w-6 h-6 fill-white/80" />
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-sans tracking-widest uppercase text-rose-300 font-medium">
                          Secret Reason #{reason.number}
                        </span>
                        <p className="text-[11px] font-sans text-slate-400 tracking-wider">
                          &bull; Tap to break wax seal &bull;
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* REVEALED: ROMANTIC CARD CONTENT */
                    <div className="space-y-3 relative z-10 flex flex-col justify-between h-full">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] tracking-wider uppercase">
                          {CATEGORY_ICONS[reason.category || 'sweet']}
                          <span>{reason.category || 'Love'}</span>
                        </div>

                        <span className="text-[11px] font-mono text-slate-400">
                          #{reason.number}
                        </span>
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <h4 className="text-lg font-serif text-white font-medium">
                          {reason.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 font-sans font-light leading-relaxed">
                          &ldquo;{reason.text}&rdquo;
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-end text-rose-400">
                        <Heart className="w-3.5 h-3.5 fill-rose-400/40 text-rose-400" />
                      </div>
                    </div>
                  )}

                  {/* Shimmer light overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-white/5 pointer-events-none" />
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation CTA to Bucket List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pt-8 pb-10 text-center"
      >
        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white font-sans text-xs sm:text-sm tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Explore Our Future Bucket List</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
