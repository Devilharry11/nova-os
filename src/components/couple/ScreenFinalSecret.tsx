import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCcw, Sliders, Check, Share2, Sparkles, Flame } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { CinematicTypography } from '../common/CinematicTypography';
import { TiltCard } from '../common/TiltCard';
import { triggerFireworks } from '../../utils/celebration';

export const ScreenFinalSecret: React.FC = () => {
  const { config, restartExperience, setViewMode, isHostAuthenticated, generatePartnerShareLink } = useExperience();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Grand celebration fireworks on arrival
    const timer = setTimeout(() => {
      triggerFireworks();
      vaultAudio.playCelebrationBurst();
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  const handleCopyLink = () => {
    vaultAudio.playHeartCollect();
    const link = generatePartnerShareLink ? generatePartnerShareLink() : window.location.href;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualFireworks = () => {
    triggerFireworks();
    vaultAudio.playCelebrationBurst();
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 py-10 text-center max-w-2xl mx-auto">
      {/* Background celestial pulse */}
      <div className="absolute w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-rose-500/15 to-violet-600/15 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 space-y-8 w-full"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>VAULT SEALED IN ETERNITY</span>
        </div>

        {/* 3D Tilt Final Romantic Message Card */}
        <TiltCard maxTilt={8} scale={1.02} className="w-full">
          <div className="vault-card rounded-3xl p-8 sm:p-12 border border-rose-500/30 shadow-glow-rose space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400">
              <Heart className="w-8 h-8 fill-rose-400/40 animate-pulse" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif text-white leading-snug">
              &ldquo;{config.letter.finalMessage}&rdquo;
            </h2>

            {(() => {
              const typo = config.typography.find((t) => t.section === 'final');
              if (!typo) return null;
              return (
                <div className="pt-2">
                  <CinematicTypography
                    text={typo.text}
                    preset={typo.preset}
                    fontFamily={typo.fontFamily}
                    fontSize={typo.fontSize}
                    color={typo.color}
                    glow={typo.glow}
                  />
                </div>
              );
            })()}

            <p className="text-sm text-slate-300/80 font-sans font-light">
              Created with infinite tenderness for {config.coupleNames}.
            </p>
          </div>
        </TiltCard>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          {/* Fireworks Burst Button */}
          <button
            onClick={handleManualFireworks}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 font-sans text-xs tracking-widest uppercase border border-rose-500/40 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Celebrate Again</span>
          </button>

          {/* Relive Journey */}
          <button
            onClick={() => {
              vaultAudio.playSoftTransition();
              restartExperience();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-sans text-xs tracking-widest uppercase border border-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-300" />
            <span>Relive Journey</span>
          </button>

          {/* Copy Shareable Link */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-rose-200 font-sans text-xs tracking-widest uppercase border border-rose-500/30 transition-all hover:scale-105 active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Vault'}</span>
          </button>

          {/* Open Host Studio (Only visible if Host is authenticated) */}
          {isHostAuthenticated && (
            <button
              onClick={() => {
                vaultAudio.playSoftTransition();
                setViewMode('studio');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 text-white font-sans text-xs tracking-widest uppercase shadow-glow-rose transition-all hover:scale-105 active:scale-95"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Host Studio</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
