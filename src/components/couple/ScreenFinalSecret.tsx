import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  RotateCcw, 
  Sliders, 
  Check, 
  Share2, 
  Sparkles, 
  Flame, 
  Award, 
  Download
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { CinematicTypography } from '../common/CinematicTypography';
import { TiltCard } from '../common/TiltCard';
import { triggerFireworks } from '../../utils/celebration';

export const ScreenFinalSecret: React.FC = () => {
  const { config, restartExperience, setViewMode, isHostAuthenticated, generatePartnerShareLink } = useExperience();
  const [copied, setCopied] = useState(false);
  const [savedKeepsake, setSavedKeepsake] = useState(false);

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

  const handleSaveKeepsake = () => {
    vaultAudio.playSoulSync();
    triggerFireworks();
    setSavedKeepsake(true);
    setTimeout(() => setSavedKeepsake(false), 3000);
    // Trigger browser print or save dialog
    window.print();
  };

  const startDateFormatted = config.startDate 
    ? new Date(config.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'October 14, 2023';

  return (
    <div className="relative min-h-[92vh] w-full flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center max-w-3xl mx-auto">
      {/* Background celestial pulse */}
      <div className="absolute w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-rose-500/15 via-violet-600/15 to-amber-500/10 blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 space-y-8 w-full"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/25 shadow-glow-rose">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>FOREVER &amp; ALWAYS // {config.coupleNames}</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
        </div>

        {/* 1. GRAND CENTERPIECE: "THANK YOU FOR BEING WITH ME" */}
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight leading-tight"
          >
            Thank You For Being With Me
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base sm:text-xl text-rose-200/90 font-serif italic max-w-xl mx-auto"
          >
            &ldquo;In a world of billions of people, having you by my side is the greatest blessing I will ever know.&rdquo;
          </motion.p>
        </div>

        {/* 2. 4 GRATITUDE PILLARS CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
            <div className="flex items-center gap-2 text-rose-300 font-sans text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-rose-500/40 text-rose-400" />
              <span>For Your Patience</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              For understanding my silence, calming my storms, and holding my hand when life gets overwhelming.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-sans text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>For Your Warm Smile</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              For lighting up every room you walk into and making ordinary, quiet days feel like extraordinary magic.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
            <div className="flex items-center gap-2 text-violet-300 font-sans text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-violet-400" />
              <span>For Believing In Us</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              For trusting our bond, laughing at our silly inside jokes, and dreaming about the future together.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
            <div className="flex items-center gap-2 text-pink-300 font-sans text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-pink-400" />
              <span>For Being My Home</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Wherever in this world we go, as long as I am with you, I know I am safe, loved, and exactly where I belong.
            </p>
          </div>
        </div>

        {/* 3D Tilt Final Romantic Message Card */}
        <TiltCard maxTilt={6} scale={1.01} className="w-full">
          <div className="vault-card rounded-3xl p-6 sm:p-10 border border-rose-500/30 shadow-glow-rose space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(224,90,136,0.5)]">
              <Heart className="w-7 h-7 fill-rose-400/40 animate-pulse" />
            </div>

            <h2 className="text-xl sm:text-3xl font-serif text-white leading-snug">
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

            <p className="text-xs sm:text-sm text-slate-300/80 font-sans font-light">
              Sealed with eternal love &bull; {config.coupleNames}
            </p>
          </div>
        </TiltCard>

        {/* 📜 ETERNAL LOVE PASSPORT & CELESTIAL KEEPSAKE */}
        <TiltCard maxTilt={4} scale={1.01} className="w-full">
          <div className="vault-card rounded-3xl p-6 sm:p-8 border-2 border-amber-300/30 bg-gradient-to-br from-[#1b122c] via-[#110a1f] to-[#0a0614] shadow-2xl relative overflow-hidden text-left space-y-6">
            {/* Gold Ribbon Watermark */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-300" />
                <span className="text-xs font-sans uppercase tracking-widest text-amber-200 font-medium">
                  Celestial Certificate of Eternal Love
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                VAULT ID: #HV-INF-2026
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Souls Bound</span>
                <span className="font-serif text-lg text-white font-medium">{config.coupleNames}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Genesis Date</span>
                <span className="font-mono text-sm text-rose-300">{startDateFormatted}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Validity</span>
                <span className="font-serif text-sm text-amber-200">Across All Lifetimes &amp; Universes</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <Sparkles className="w-3 h-3" /> Sealed &amp; Eternal
                </span>
              </div>
            </div>

            {/* Bottom Seal & Download button */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-amber-600 border border-amber-300/50 flex items-center justify-center text-amber-200 shadow-md">
                  <Heart className="w-6 h-6 fill-amber-200" />
                </div>
                <div>
                  <p className="font-handwriting text-2xl text-rose-300 leading-none">
                    {config.letter.signature}
                  </p>
                  <span className="text-[10px] text-slate-400 font-sans uppercase tracking-widest">
                    Signed in Starlight
                  </span>
                </div>
              </div>

              <button
                onClick={handleSaveKeepsake}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 text-xs font-sans uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>{savedKeepsake ? 'Printing Keepsake...' : 'Print / Save Keepsake'}</span>
              </button>
            </div>
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
