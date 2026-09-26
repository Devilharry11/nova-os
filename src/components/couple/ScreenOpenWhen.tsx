import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Mail, 
  Smile, 
  Moon, 
  CloudRain, 
  PartyPopper 
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';
import { triggerFireworks } from '../../utils/celebration';
import type { OpenWhenEnvelope } from '../../types/heartVault';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'miss-you': <Heart className="w-4 h-4 text-rose-400" />,
  'sad-day': <CloudRain className="w-4 h-4 text-violet-400" />,
  'cant-sleep': <Moon className="w-4 h-4 text-sky-400" />,
  'mad-at-me': <Smile className="w-4 h-4 text-amber-400" />,
  'celebrate': <PartyPopper className="w-4 h-4 text-pink-400" />,
};

export const ScreenOpenWhen: React.FC = () => {
  const { config, setScreen } = useExperience();
  const envelopes: OpenWhenEnvelope[] = config.openWhen || [];

  const [activeEnvelope, setActiveEnvelope] = useState<OpenWhenEnvelope | null>(null);
  const [openedIds, setOpenedIds] = useState<Record<string, boolean>>({});

  const handleOpenEnvelope = (env: OpenWhenEnvelope) => {
    vaultAudio.playWaxSealBreak();
    setActiveEnvelope(env);
    setOpenedIds((prev) => ({ ...prev, [env.id]: true }));
    triggerFireworks();
  };

  const handleCloseEnvelope = () => {
    vaultAudio.playSoftTransition();
    setActiveEnvelope(null);
  };

  const handleContinue = () => {
    vaultAudio.playWaxSealBreak();
    setScreen('letter');
  };

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-between px-4 sm:px-6 py-8 max-w-5xl mx-auto selection:bg-rose-500/30">
      {/* Background Starlight Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[34rem] h-[34rem] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20 backdrop-blur-md">
          <Mail className="w-3.5 h-3.5 text-rose-400" />
          <span>TIME-LOCKED LOVE LETTERS</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
          &ldquo;Open When...&rdquo; Envelopes
        </h2>
        <p className="text-sm sm:text-base text-slate-300 font-sans font-light max-w-xl mx-auto">
          Whenever you need a reminder, select a sealed envelope. Written for the good days, the quiet nights, and every mood in between.
        </p>
      </div>

      {/* Main Envelopes Grid or Active Letter Modal */}
      <div className="my-auto py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {envelopes.map((env, idx) => {
            const isOpened = !!openedIds[env.id];

            return (
              <motion.div
                key={env.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => handleOpenEnvelope(env)}
                className="cursor-pointer"
              >
                <TiltCard maxTilt={6} scale={1.02} className="h-full">
                  <div className="h-full min-h-[220px] rounded-3xl p-6 bg-gradient-to-br from-[#1d122b] via-[#140e22] to-[#0d0918] border border-rose-500/30 hover:border-rose-400/60 shadow-xl hover:shadow-glow-rose transition-all flex flex-col justify-between relative overflow-hidden group">
                    {/* Top Envelope Flap Texture */}
                    <div className="absolute top-0 inset-x-0 h-16 border-b border-rose-500/20 [clip-path:polygon(0_0,50%_100%,100%_0)] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    {/* Top Category Badge */}
                    <div className="flex items-center justify-between text-xs font-sans relative z-10">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-rose-300 text-[11px]">
                        {CATEGORY_ICONS[env.category || 'miss-you']}
                        <span className="capitalize">{env.category?.replace('-', ' ') || 'Love'}</span>
                      </div>

                      {isOpened && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          Opened
                        </span>
                      )}
                    </div>

                    {/* Central Wax Seal Button */}
                    <div className="my-auto py-4 flex flex-col items-center justify-center text-center space-y-3 relative z-10">
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                        style={{
                          background: `radial-gradient(circle, ${env.sealColor || '#e05a88'}, #400008)`,
                          boxShadow: `0 0 20px ${env.sealColor || '#e05a88'}60`,
                        }}
                      >
                        <Heart className="w-7 h-7 text-white fill-white/80" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base sm:text-lg font-serif text-white font-medium group-hover:text-rose-200 transition-colors">
                          {env.trigger}
                        </h4>
                        {env.subtitle && (
                          <p className="text-xs text-slate-400 font-sans">
                            {env.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Prompt */}
                    <div className="pt-2 text-center text-[10px] font-sans tracking-widest uppercase text-rose-300/80">
                      &bull; Tap to break wax seal &bull;
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE UNROLLED LETTER MODAL */}
      <AnimatePresence>
        {activeEnvelope && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto"
            >
              <TiltCard maxTilt={4} scale={1.01} className="w-full">
                <div className="vault-card rounded-3xl p-6 sm:p-10 border-2 border-rose-500/40 bg-gradient-to-b from-[#24132e] via-[#1a0e23] to-[#0f0714] shadow-2xl space-y-6 relative text-left">
                  {/* Watermark */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      onClick={handleCloseEnvelope}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Close</span>
                    </button>
                  </div>

                  {/* Header */}
                  <div className="space-y-2 border-b border-white/10 pb-4 pr-16">
                    <span className="text-xs font-sans uppercase tracking-widest text-rose-300 font-semibold flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{activeEnvelope.trigger}</span>
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-white">
                      From My Heart To Yours
                    </h3>
                  </div>

                  {/* Optional Photo */}
                  {activeEnvelope.photoUrl && (
                    <div className="rounded-2xl overflow-hidden aspect-video relative border border-white/10 shadow-lg">
                      <img
                        src={activeEnvelope.photoUrl}
                        alt={activeEnvelope.trigger}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Letter Body */}
                  <p className="text-base sm:text-lg font-serif text-slate-200 leading-relaxed font-light whitespace-pre-line">
                    &ldquo;{activeEnvelope.message}&rdquo;
                  </p>

                  {/* Signature & Seal */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-sans uppercase tracking-widest text-slate-400">
                        Always right here
                      </p>
                      <p className="font-handwriting text-3xl text-rose-300">
                        {config.coupleNames}
                      </p>
                    </div>

                    <button
                      onClick={handleCloseEnvelope}
                      className="px-5 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-sans tracking-wider uppercase transition-all"
                    >
                      Keep In Pocket
                    </button>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation CTA */}
      <div className="pt-8 pb-4 text-center">
        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white font-sans text-xs sm:text-sm tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Continue to Wax-Sealed Letter &amp; Voice Note</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
