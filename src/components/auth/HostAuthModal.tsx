import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, KeyRound, X, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';

export const HostAuthModal: React.FC = () => {
  const { 
    isHostAuthModalOpen, 
    setIsHostAuthModalOpen, 
    authenticateHost, 
    isHostAuthenticated,
    setViewMode 
  } = useExperience();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isHostAuthModalOpen) {
      setPin('');
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isHostAuthModalOpen]);

  if (!isHostAuthModalOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) return;

    const success = authenticateHost(pin);
    if (success) {
      setError(false);
      setViewMode('studio');
    } else {
      setError(true);
      vaultAudio.playCardHover();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsHostAuthModalOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-md rounded-3xl bg-midnight-950/95 border border-rose-500/30 p-6 sm:p-8 shadow-2xl shadow-rose-950/40 text-slate-100 overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => setIsHostAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="relative z-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500/20 to-violet-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 shadow-inner">
                {isHostAuthenticated ? (
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                ) : (
                  <Lock className="w-7 h-7 text-rose-400" />
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20">
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>PRIVATE CREATOR ACCESS</span>
              </div>

              <h3 className="text-2xl font-serif text-white">Host Security Gate</h3>
              <p className="text-xs font-sans text-slate-400 max-w-xs mx-auto">
                The Host Studio is restricted so only you can customize and manage this vault.
              </p>
            </div>

            {/* PIN Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-sans uppercase tracking-widest text-slate-300 flex items-center justify-between">
                  <span>Enter Host Passcode / PIN</span>
                  <span className="text-slate-500 text-[10px]">Default: 1402</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4 text-rose-400" />
                  </div>
                  <input
                    ref={inputRef}
                    type="password"
                    maxLength={16}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="Enter Secret PIN..."
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-midnight-900/90 border text-white text-center font-mono text-base tracking-[0.25em] focus:outline-none transition-colors ${
                      error
                        ? 'border-rose-500 ring-1 ring-rose-500 animate-pulse'
                        : 'border-white/10 focus:border-rose-400'
                    }`}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>Incorrect Host PIN. Please check and try again.</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsHostAuthModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-sans text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 text-white font-sans text-xs tracking-wider uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Unlock Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="pt-2 text-center border-t border-white/5">
              <p className="text-[11px] text-slate-500 font-sans">
                💡 Tip: You can access this gate anytime by triple-clicking the logo or using <code className="text-rose-300 bg-white/5 px-1 py-0.5 rounded">?host=1</code>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
