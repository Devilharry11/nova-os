import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  CloudRain, 
  Flame, 
  RotateCcw, 
  Disc3, 
  Sliders, 
  Radio, 
  Check, 
  Send 
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const DEFAULT_LYRICS = [
  { time: 0, text: 'Two lovers sitting under pink and orange skies 🌅' },
  { time: 6, text: 'Looking in your eyes, everything else fades away ✨' },
  { time: 14, text: 'You smile, and the whole world stops to watch you breathe 💖' },
  { time: 22, text: 'I found my home right here beside you forever 🏡' },
  { time: 30, text: 'Every song I hear now sounds like your name 🎶' },
  { time: 42, text: 'In your golden hour, life feels like infinite poetry 💫' },
];

export const ScreenMusic: React.FC = () => {
  const { config, setScreen } = useExperience();
  const music = config.music;
  const lyrics = music.lyrics && music.lyrics.length > 0 ? music.lyrics : DEFAULT_LYRICS;

  const [displayMode, setDisplayMode] = useState<'instaStory' | 'cassette'>('instaStory');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [dmSent, setDmSent] = useState<boolean>(false);
  const [flyingHearts, setFlyingHearts] = useState<{ id: number; x: number }[]>([]);

  // Ambient Sound Layers
  const [rainActive, setRainActive] = useState<boolean>(false);
  const [fireplaceActive, setFireplaceActive] = useState<boolean>(false);
  const [chimesActive, setChimesActive] = useState<boolean>(true);

  // Equalizer visualizer heights
  const [barHeights, setBarHeights] = useState<number[]>(new Array(24).fill(20));

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Active lyric based on currentTime
  const activeLyric = [...lyrics].reverse().find((l) => l.time <= currentTime) || lyrics[0];

  // Animate Equalizer bars when playing
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const updateBars = () => {
        setBarHeights(
          new Array(24).fill(0).map(() => Math.floor(Math.random() * 65) + 15)
        );
        animId = requestAnimationFrame(updateBars);
      };
      animId = requestAnimationFrame(updateBars);
    } else {
      setBarHeights(new Array(24).fill(15));
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Audio setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleTogglePlay = () => {
    vaultAudio.playCardHover();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleToggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
    vaultAudio.playCardHover();
  };

  const handleRewind = () => {
    vaultAudio.playCardHover();
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleHeartReaction = () => {
    vaultAudio.playHeartCollect();
    const newId = Date.now();
    setFlyingHearts((prev) => [...prev, { id: newId, x: Math.random() * 60 + 20 }]);
    setTimeout(() => {
      setFlyingHearts((prev) => prev.filter((h) => h.id !== newId));
    }, 1800);
  };

  const handleSendDm = (e: React.FormEvent) => {
    e.preventDefault();
    vaultAudio.playHeartCollect();
    setDmSent(true);
    setTimeout(() => setDmSent(false), 2500);
  };

  const handleContinue = () => {
    if (audioRef.current) audioRef.current.pause();
    vaultAudio.playSoftTransition();
    setScreen('games');
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-between px-3 sm:px-6 py-6 max-w-5xl w-full mx-auto select-none">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={music.audioUrl || 'https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1036.mp3'}
        preload="metadata"
      />

      {/* Top Header & Mode Toggle */}
      <div className="text-center space-y-3 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-sans tracking-widest uppercase">
          <Disc3 className={`w-3.5 h-3.5 text-violet-400 ${isPlaying ? 'animate-spin' : ''}`} />
          <span>OUR FAVORITE MELODY &amp; LYRICS</span>
          <Sparkles className="w-3 h-3 text-amber-300" />
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-wide">
          Soundtrack of Us
        </h2>

        {/* View Switcher: Instagram Story Mode vs Cyber-Cassette */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={() => {
              vaultAudio.playCardHover();
              setDisplayMode('instaStory');
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans tracking-wider transition-all ${
              displayMode === 'instaStory'
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-600 text-white font-medium shadow-glow-rose'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Instagram Story Lyrics 📱</span>
          </button>

          <button
            onClick={() => {
              vaultAudio.playCardHover();
              setDisplayMode('cassette');
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans tracking-wider transition-all ${
              displayMode === 'cassette'
                ? 'bg-rose-500/25 border border-rose-500/50 text-rose-200 shadow-sm font-medium'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Cyber-Cassette Mode 📼</span>
          </button>
        </div>
      </div>

      {/* 1. INSTAGRAM STORY REEL MODE (WITH LIVE SYNCED LYRICS) */}
      {displayMode === 'instaStory' && (
        <div className="relative my-4 w-full max-w-sm sm:max-w-md mx-auto z-10">
          <TiltCard maxTilt={4} scale={1.01} className="w-full">
            <div className="relative aspect-[9/16] max-h-[72vh] w-full rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black flex flex-col justify-between p-4 sm:p-5">
              
              {/* Blurred Cover Art Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-40 pointer-events-none"
                style={{ backgroundImage: `url(${music.coverUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 pointer-events-none" />

              {/* Flying Hearts Animation */}
              <AnimatePresence>
                {flyingHearts.map((h) => (
                  <motion.div
                    key={h.id}
                    initial={{ opacity: 1, y: 0, scale: 0.8 }}
                    animate={{ opacity: 0, y: -260, scale: 1.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                    style={{ left: `${h.x}%` }}
                    className="absolute bottom-16 pointer-events-none z-30"
                  >
                    <Heart className="w-6 h-6 fill-rose-500 text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Top Story Header */}
              <div className="relative z-10 space-y-2.5">
                {/* Story Progress Bar */}
                <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-200"
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  />
                </div>

                {/* Profile Pill */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600">
                      <div className="w-full h-full rounded-full overflow-hidden bg-black">
                        <img src={music.coverUrl} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-white font-sans">
                          {config.coupleNames.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                        </span>
                        <span className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-[7px] text-white">✓</span>
                        <span className="text-[10px] text-slate-300 font-sans">2h</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-mono">Special Story Track</p>
                    </div>
                  </div>

                  {/* Audio Controls */}
                  <button
                    onClick={handleTogglePlay}
                    className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
                  </button>
                </div>
              </div>

              {/* CENTER: INSTAGRAM MUSIC STICKER & LIVE SYNCED LYRICS */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 my-auto px-2">
                
                {/* Official Instagram Story Music Sticker */}
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-3 p-3 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-xl shadow-2xl max-w-xs w-full"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/30 shadow-md">
                    <img 
                      src={music.coverUrl} 
                      alt="album" 
                      className={`w-full h-full object-cover ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`} 
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-bold text-white truncate font-sans">{music.title || 'Golden Hour'}</p>
                    <p className="text-[10px] text-slate-300 truncate font-sans">{music.artist || 'JVKE'}</p>
                    {/* Equalizer Wavelet */}
                    <div className="flex items-center gap-0.5 mt-1 h-2">
                      <span className="w-1 h-2 bg-rose-400 rounded-full animate-bounce" />
                      <span className="w-1 h-3.5 bg-amber-400 rounded-full animate-bounce delay-75" />
                      <span className="w-1 h-1.5 bg-fuchsia-400 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                </motion.div>

                {/* THE POPPING LIVE SYNCED LYRIC STICKER */}
                <div className="min-h-[110px] flex items-center justify-center px-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeLyric.text}
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="space-y-2"
                    >
                      <p className="text-xl sm:text-2xl font-sans font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-fuchsia-200 drop-shadow-[0_2px_12px_rgba(244,63,94,0.6)] leading-snug">
                        {activeLyric.text}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-mono text-amber-200">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Live Synced Lyrics</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom: Instagram Story DM & Reaction Bar */}
              <div className="relative z-10 space-y-2">
                <form onSubmit={handleSendDm} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={dmSent ? "Message sent to their heart! 💖" : "Send message to Story..."}
                      disabled={dmSent}
                      className="w-full pl-3 pr-8 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-slate-300 text-xs focus:outline-none focus:border-white/50"
                    />
                    <button type="submit" className="absolute right-2.5 top-2 text-slate-300 hover:text-white">
                      {dmSent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Send className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Heart Tap Button */}
                  <button
                    type="button"
                    onClick={handleHeartReaction}
                    className="p-2.5 rounded-full bg-white/15 hover:bg-rose-500/30 text-rose-300 border border-white/20 backdrop-blur-md transition-all active:scale-90"
                    title="Send Heart Reaction"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-400 animate-pulse" />
                  </button>
                </form>
              </div>

            </div>
          </TiltCard>
        </div>
      )}

      {/* 2. CYBER-CASSETTE MODE */}
      {displayMode === 'cassette' && (
        <div className="relative my-6 w-full max-w-2xl mx-auto z-10">
          <TiltCard maxTilt={5} scale={1.01} className="w-full">
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1b0d26] via-[#12081c] to-[#0a0410] border-2 border-rose-500/30 shadow-[0_0_50px_rgba(139,92,246,0.3)] backdrop-blur-xl space-y-6">
              
              {/* Tape Housing */}
              <div className="relative aspect-[16/9] w-full rounded-2xl bg-gradient-to-b from-[#241334] to-[#12071d] border-2 border-white/15 p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] font-mono">
                  <span className="text-rose-300 font-bold uppercase tracking-wider">SIDE A &bull; STEREO HI-FI</span>
                  <span className="text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">LOVE TAPE VOL. 1</span>
                </div>

                <div className="relative h-20 sm:h-24 mx-auto w-full max-w-md rounded-xl bg-black/70 border border-white/20 flex items-center justify-around px-6 overflow-hidden">
                  <div className="relative flex items-center justify-center">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-dashed border-rose-400/80 bg-rose-950/60 flex items-center justify-center transition-transform ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                      <div className="w-5 h-5 rounded-full bg-white/30 border border-white/40" />
                    </div>
                  </div>

                  <div className="flex-1 px-4 flex flex-col items-center justify-center space-y-1">
                    <div className="w-full h-2 bg-gradient-to-r from-rose-600 via-amber-400 to-violet-600 rounded-full opacity-70" />
                    <span className="text-[10px] font-mono text-slate-400">{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-dashed border-violet-400/80 bg-violet-950/60 flex items-center justify-center transition-transform ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                      <div className="w-5 h-5 rounded-full bg-white/30 border border-white/40" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 font-sans">
                  <div>
                    <h4 className="text-white font-medium text-sm sm:text-base">{music.title || 'Golden Hour Symphony'}</h4>
                    <p className="text-slate-400 text-xs">{music.artist || 'JVKE &bull; Dedication'}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <Heart className="w-4 h-4 fill-rose-500/40 animate-pulse" />
                    <span className="text-[11px] font-mono">FOREVER</span>
                  </div>
                </div>
              </div>

              {/* Equalizer Frequency Bars */}
              <div className="flex items-end justify-between gap-1 h-12 px-2 bg-black/40 rounded-xl p-2 border border-white/10">
                {barHeights.map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-gradient-to-t from-rose-500 via-amber-400 to-violet-400 rounded-t-sm transition-all duration-75 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                ))}
              </div>

              {/* Audio Controls */}
              <div className="space-y-4">
                <input type="range" min={0} max={duration || 100} step={0.5} value={currentTime} onChange={handleSeek} className="w-full accent-rose-500 h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer" />
                <div className="flex items-center justify-between">
                  <button onClick={handleRewind} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300" title="Rewind 10s">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button onClick={handleTogglePlay} className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-violet-600 text-white flex items-center justify-center shadow-glow-rose hover:scale-105 active:scale-95 transition-all">
                    {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                  </button>
                  <button onClick={handleToggleMute} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300" title="Mute">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Atmospheric Ambience Mixer */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 font-sans">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-300" />
                    <span className="font-medium">Atmospheric Ambience Layers</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setRainActive(!rainActive)} className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${rainActive ? 'bg-blue-500/20 border-blue-400/50 text-blue-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    <CloudRain className="w-4 h-4" />
                    <span className="text-[11px]">Night Rain</span>
                  </button>
                  <button onClick={() => setFireplaceActive(!fireplaceActive)} className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${fireplaceActive ? 'bg-amber-500/20 border-amber-400/50 text-amber-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    <Flame className="w-4 h-4" />
                    <span className="text-[11px]">Fireplace</span>
                  </button>
                  <button onClick={() => setChimesActive(!chimesActive)} className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${chimesActive ? 'bg-violet-500/20 border-violet-400/50 text-violet-200' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[11px]">Stardust</span>
                  </button>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      )}

      {/* Bottom CTA to Couple Games */}
      <div className="flex justify-end pt-4 border-t border-white/5 z-20">
        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white text-xs font-sans tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Next: Play Couple Games</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
