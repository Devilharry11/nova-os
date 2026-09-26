import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Smartphone, Monitor, RotateCcw, Sparkles } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { CoupleExperience } from '../couple/CoupleExperience';
import { vaultAudio } from '../../utils/vaultAudio';

interface LivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ isOpen, onClose }) => {
  const { restartExperience } = useExperience();
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col">
      {/* Top Preview Control Bar */}
      <div className="p-4 px-6 border-b border-white/10 bg-midnight-950/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-rose-300">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-sans uppercase tracking-widest font-semibold">
              LIVE EXPERIENCE PREVIEW
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-lg bg-midnight-900 border border-white/10 text-xs font-sans">
            <button
              onClick={() => {
                vaultAudio.playSoftTransition();
                setDevice('desktop');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                device === 'desktop' ? 'bg-rose-500 text-white font-medium shadow-sm' : 'text-slate-400'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => {
                vaultAudio.playSoftTransition();
                setDevice('mobile');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                device === 'mobile' ? 'bg-rose-500 text-white font-medium shadow-sm' : 'text-slate-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              vaultAudio.playSoftTransition();
              restartExperience();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Journey</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center">
        {device === 'desktop' ? (
          <div className="w-full h-full max-w-6xl rounded-2xl border border-white/15 overflow-hidden shadow-2xl bg-midnight-950 flex flex-col">
            <CoupleExperience />
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="w-[390px] h-[780px] rounded-[48px] border-[8px] border-slate-800 shadow-2xl overflow-hidden bg-midnight-950 flex flex-col relative ring-1 ring-white/15"
          >
            {/* Phone Speaker Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-50 pointer-events-none" />

            <div className="flex-1 overflow-y-auto w-full pt-4">
              <CoupleExperience />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
