import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Feather, 
  ArrowRight, 
  Eye, 
  Sparkles, 
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';
import { triggerFireworks } from '../../utils/celebration';

// Pre-defined waveform bar heights for realistic voice recording aesthetic
const WAVEFORM_BARS = [
  24, 38, 55, 30, 48, 70, 85, 45, 60, 92, 75, 40, 65, 80, 50, 
  35, 60, 88, 72, 45, 62, 95, 68, 52, 78, 42, 60, 35, 48, 25
];

export const ScreenLetter: React.FC = () => {
  const { config, setScreen } = useExperience();
  const letter = config.letter;
  const voiceNote = letter.voiceNote;

  const [isSealed, setIsSealed] = useState<boolean>(true);
  const [isBreaking, setIsBreaking] = useState<boolean>(false);
  const [revealedParagraphs, setRevealedParagraphs] = useState<number>(1);
  const [isFullyRevealed, setIsFullyRevealed] = useState<boolean>(false);

  // Voice Note Audio Player State
  const [isVoicePlaying, setIsVoicePlaying] = useState<boolean>(false);
  const [voiceProgress, setVoiceProgress] = useState<number>(0);
  const [voiceDuration, setVoiceDuration] = useState<number>(102); // 1:42 fallback
  const [voiceCurrentTime, setVoiceCurrentTime] = useState<number>(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const paragraphs = letter.body.split('\n\n').filter(Boolean);

  // Audio setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setVoiceDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setVoiceCurrentTime(audio.currentTime);
      if (audio.duration) {
        setVoiceProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsVoicePlaying(false);
      setVoiceProgress(0);
      setVoiceCurrentTime(0);
      vaultAudio.playCelebrationBurst();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [voiceNote?.audioUrl]);

  const toggleVoicePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isVoicePlaying) {
      audio.pause();
      setIsVoicePlaying(false);
    } else {
      audio.play().then(() => {
        setIsVoicePlaying(true);
        vaultAudio.playHeartCollect();
      }).catch(() => {
        // Fallback simulation if browser blocks external MP3
        setIsVoicePlaying(true);
        vaultAudio.playQuizSuccess();
      });
    }
  };

  const handleVoiceSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetPercent = Number(e.target.value);
    const audio = audioRef.current;
    if (audio && voiceDuration) {
      const targetTime = (targetPercent / 100) * voiceDuration;
      audio.currentTime = targetTime;
      setVoiceCurrentTime(targetTime);
      setVoiceProgress(targetPercent);
    }
  };

  const toggleVoiceMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isVoiceMuted;
    setIsVoiceMuted(!isVoiceMuted);
  };

  const formatAudioTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleBreakSeal = () => {
    if (isBreaking || !isSealed) return;
    setIsBreaking(true);
    vaultAudio.playWaxSealBreak();

    setTimeout(() => {
      setIsSealed(false);
      setIsBreaking(false);
      vaultAudio.playSoftTransition();
    }, 700);
  };

  const handleNextParagraph = () => {
    if (revealedParagraphs < paragraphs.length) {
      vaultAudio.playSoftTransition();
      setRevealedParagraphs((prev) => prev + 1);
      if (revealedParagraphs + 1 >= paragraphs.length) {
        setIsFullyRevealed(true);
      }
    } else {
      setIsFullyRevealed(true);
    }
  };

  const handleRevealAll = () => {
    vaultAudio.playSoftTransition();
    setRevealedParagraphs(paragraphs.length);
    setIsFullyRevealed(true);
  };

  const handleFinish = () => {
    if (audioRef.current) audioRef.current.pause();
    vaultAudio.playCelebrationBurst();
    triggerFireworks();
    setScreen('final');
  };

  const handleReseal = () => {
    if (audioRef.current) audioRef.current.pause();
    setIsVoicePlaying(false);
    vaultAudio.playSoftTransition();
    setIsSealed(true);
    setRevealedParagraphs(1);
    setIsFullyRevealed(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-10 max-w-3xl mx-auto">
      {/* Hidden Audio Tag for Voice Note */}
      {voiceNote?.audioUrl && (
        <audio 
          ref={audioRef} 
          src={voiceNote.audioUrl} 
          preload="metadata" 
        />
      )}

      {/* Soft warm reading halo */}
      <div className="absolute w-[36rem] h-[36rem] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative z-10 space-y-8"
      >
        {/* Letter Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20">
            <Feather className="w-3.5 h-3.5 text-rose-400" />
            <span>A PERSONAL CONFESSION</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-tight leading-snug">
            {letter.title}
          </h2>
        </div>

        {/* Envelope or Parchment View */}
        <AnimatePresence mode="wait">
          {isSealed ? (
            /* SEALED ENVELOPE WITH 3D WAX SEAL */
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20, filter: 'blur(4px)' }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-xl mx-auto"
            >
              <TiltCard maxTilt={8} scale={1.02} className="w-full">
                <div className="relative w-full aspect-[16/10] rounded-3xl bg-gradient-to-br from-[#1d122b] via-[#140e22] to-[#0d0918] border border-rose-500/30 p-8 shadow-2xl overflow-hidden flex flex-col justify-between items-center text-center">
                  {/* Velvet Fabric Grain & Shimmer */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,143,163,0.3)_0%,_transparent_60%)] pointer-events-none" />

                  {/* Envelope Flap Fold Lines */}
                  <div className="absolute top-0 inset-x-0 h-1/2 border-b border-rose-500/20 [clip-path:polygon(0_0,50%_100%,100%_0)] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                  {/* Top Stamp Text */}
                  <div className="relative z-10 pt-2 space-y-1">
                    <span className="text-[11px] font-sans uppercase tracking-widest text-rose-300/80">
                      Confidential &bull; Written For You
                    </span>
                    <p className="font-serif italic text-white/90 text-sm">
                      To the keeper of my heart
                    </p>
                  </div>

                  {/* Central Interactive Wax Seal Button */}
                  <div className="relative z-20 my-auto">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={handleBreakSeal}
                      disabled={isBreaking}
                      className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full cursor-pointer focus:outline-none flex items-center justify-center"
                      title="Click to break the wax seal"
                    >
                      {/* Outer Wax Seal Organic Rim */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#c1121f] via-[#780000] to-[#400008] border-2 border-amber-300/40 shadow-[0_10px_30px_rgba(120,0,0,0.7),inset_0_2px_4px_rgba(255,200,200,0.4)] transition-all group-hover:shadow-[0_10px_35px_rgba(224,90,136,0.8),inset_0_2px_6px_rgba(255,255,255,0.6)]" />

                      {/* Inner Ring Seal Stamp */}
                      <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full border border-amber-200/40 bg-gradient-to-tr from-[#660000] to-[#a30b1e] flex flex-col items-center justify-center p-2 text-amber-200 shadow-inner">
                        {/* Shard Breaking Animation */}
                        {isBreaking ? (
                          <div className="relative w-full h-full">
                            <motion.div
                              animate={{ x: -35, y: -35, rotate: -40, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#a30b1e] rounded-tl-full border border-amber-300/50"
                            />
                            <motion.div
                              animate={{ x: 35, y: -35, rotate: 40, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#800000] rounded-tr-full border border-amber-300/50"
                            />
                            <motion.div
                              animate={{ x: -35, y: 35, rotate: -50, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#5c0000] rounded-bl-full border border-amber-300/50"
                            />
                            <motion.div
                              animate={{ x: 35, y: 35, rotate: 50, opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#940d21] rounded-br-full border border-amber-300/50"
                            />
                            <motion.div
                              animate={{ scale: [1, 2.5], opacity: [1, 0] }}
                              transition={{ duration: 0.5 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <Sparkles className="w-10 h-10 text-amber-300 animate-spin" />
                            </motion.div>
                          </div>
                        ) : (
                          <>
                            <Heart className="w-8 h-8 sm:w-9 sm:h-9 fill-amber-200/80 text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-[9px] font-serif tracking-widest uppercase text-amber-200/90 mt-0.5">
                              SEALED
                            </span>
                          </>
                        )}
                      </div>

                      <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse pointer-events-none" />
                    </motion.button>
                  </div>

                  {/* Bottom Action Prompt */}
                  <div className="relative z-10 pb-2">
                    <p className="text-xs font-sans tracking-widest uppercase text-rose-300/90 flex items-center justify-center gap-1.5 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                      <span>{isBreaking ? 'Breaking the Wax Seal...' : 'Click the Wax Seal to Open'}</span>
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ) : (
            /* OPENED LETTER PARCHMENT VIEW WITH 3D TILT */
            <motion.div
              key="letter-content"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full space-y-6"
            >
              {/* VOICE NOTE AUDIO CAPSULE WIDGET (USER REQUESTED FEATURE!) */}
              {voiceNote?.enabled !== false && (
                <TiltCard maxTilt={4} scale={1.01} className="w-full">
                  <div className="vault-card rounded-2xl p-5 sm:p-6 border border-rose-500/40 bg-gradient-to-r from-rose-950/50 via-midnight-900/80 to-violet-950/50 backdrop-blur-xl shadow-glow-rose space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
                          <Mic className="w-4 h-4 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-sans font-medium text-white tracking-wide">
                            {voiceNote?.title || 'Personal Voice Note'}
                          </h4>
                          <p className="text-[11px] font-sans text-rose-300/80">
                            Recorded with infinite love &bull; {voiceNote?.senderName || 'For You'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={toggleVoiceMute}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title={isVoiceMuted ? 'Unmute voice note' : 'Mute voice note'}
                      >
                        {isVoiceMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Dynamic Waveform Visualizer */}
                    <div className="flex items-center justify-between gap-1 h-12 px-2 py-1 bg-midnight-950/60 rounded-xl border border-white/5 overflow-hidden">
                      {WAVEFORM_BARS.map((height, idx) => {
                        const barProgress = (idx / WAVEFORM_BARS.length) * 100;
                        const isPlayed = barProgress <= voiceProgress;

                        return (
                          <motion.div
                            key={idx}
                            animate={{
                              height: isVoicePlaying
                                ? [
                                    `${Math.max(15, height * 0.4)}%`,
                                    `${Math.min(100, height * (1 + Math.sin(idx + voiceCurrentTime * 4) * 0.35))}%`,
                                    `${Math.max(20, height * 0.6)}%`,
                                  ]
                                : `${height}%`,
                            }}
                            transition={{
                              duration: 0.4,
                              repeat: isVoicePlaying ? Infinity : 0,
                              repeatType: 'mirror',
                              delay: (idx % 5) * 0.05,
                            }}
                            className={`flex-1 rounded-full transition-colors duration-200 ${
                              isPlayed
                                ? 'bg-gradient-to-t from-rose-500 to-rose-300 shadow-[0_0_8px_rgba(224,90,136,0.6)]'
                                : 'bg-slate-700/60'
                            }`}
                            style={{ minWidth: '2px' }}
                          />
                        );
                      })}
                    </div>

                    {/* Audio Scrubbing Bar & Controls */}
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={voiceProgress}
                        onChange={handleVoiceSeek}
                        className="w-full h-1.5 bg-midnight-950 rounded-lg appearance-none cursor-pointer accent-rose-400"
                      />

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{formatAudioTime(voiceCurrentTime)}</span>
                        <span>{voiceNote?.duration || formatAudioTime(voiceDuration)}</span>
                      </div>
                    </div>

                    {/* Big Center Play/Pause Button */}
                    <div className="flex items-center justify-center pt-1">
                      <button
                        onClick={toggleVoicePlay}
                        className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-400 hover:to-violet-500 text-white font-sans text-xs tracking-widest uppercase font-medium shadow-glow-rose hover:scale-105 active:scale-95 transition-all"
                      >
                        {isVoicePlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-white" />
                            <span>Pause Voice Note</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                            <span>Listen To Voice Note</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </TiltCard>
              )}

              {/* PARCHMENT LETTER CARD */}
              <TiltCard maxTilt={4} scale={1.005} className="w-full">
                <div className="vault-card rounded-3xl p-7 sm:p-12 border border-rose-500/30 shadow-2xl relative space-y-6">
                  {/* Subtle Heart Watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
                    <Heart className="w-96 h-96 text-rose-300 fill-rose-300" />
                  </div>

                  {/* Reseal Keepsake Badge */}
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    <button
                      onClick={handleReseal}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-200 text-[11px] font-sans transition-all"
                      title="Reseal the letter back into the envelope"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reseal</span>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-rose-950/80 border border-amber-300/40 flex items-center justify-center text-amber-300 text-xs shadow-inner">
                      <Heart className="w-4 h-4 fill-amber-300/60" />
                    </div>
                  </div>

                  {/* Letter Paragraphs */}
                  <div className="relative z-10 space-y-5 text-base sm:text-lg font-serif text-slate-200/90 leading-relaxed font-light tracking-wide pt-4">
                    {paragraphs.map((p, idx) => {
                      if (idx >= revealedParagraphs && !isFullyRevealed) return null;

                      return (
                        <motion.p
                          key={idx}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="whitespace-pre-line"
                        >
                          {p}
                        </motion.p>
                      );
                    })}
                  </div>

                  {/* Signature & Wax Seal Stamp */}
                  {(isFullyRevealed || revealedParagraphs >= paragraphs.length) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6"
                    >
                      <div className="space-y-1 text-center sm:text-left">
                        <p className="text-xs font-sans uppercase tracking-widest text-slate-400">
                          Written with infinite love
                        </p>
                        <p className="font-handwriting text-3xl sm:text-4xl text-rose-300">
                          {letter.signature}
                        </p>
                      </div>

                      {/* Romantic Wax Seal Badge */}
                      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 border-2 border-rose-300/40 shadow-glow-rose transform hover:scale-105 transition-transform">
                        <Heart className="w-7 h-7 text-rose-200 fill-rose-200/50" />
                        <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse pointer-events-none" />
                      </div>
                    </motion.div>
                  )}

                  {/* Letter Interaction Controls */}
                  {!isFullyRevealed && revealedParagraphs < paragraphs.length && (
                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                      <button
                        onClick={handleRevealAll}
                        className="flex items-center gap-1.5 text-xs font-sans text-slate-400 hover:text-rose-300 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Read entire letter</span>
                      </button>

                      <button
                        onClick={handleNextParagraph}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-sans text-xs tracking-wider uppercase border border-rose-500/30 transition-all hover:scale-105"
                      >
                        <span>Continue Reading</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </TiltCard>

              {/* Final Screen Button */}
              {(isFullyRevealed || revealedParagraphs >= paragraphs.length) && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center pt-6"
                >
                  <button
                    onClick={handleFinish}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white font-sans text-xs tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.03] active:scale-[0.98] transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-rose-200" />
                    <span>Step Into Our Forever Closure</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
