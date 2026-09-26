import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Music as MusicIcon, 
  ArrowRight, 
  Sparkles,
  Heart,
  Radio
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';

export const ScreenMusic: React.FC = () => {
  const { config, setScreen } = useExperience();
  const music = config.music;
  const lyrics = music.lyrics || [
    { time: 0, text: 'It was just two lovers sitting in the car, listening to blonde' },
    { time: 6, text: 'Falling for each other, pink and orange skies feeling super warm' },
    { time: 14, text: 'She got her foot up on the dash, laughing at our inside jokes' },
    { time: 22, text: 'You look like starlight shining through the misty night' },
    { time: 30, text: 'I don’t need no paradise, because I found home right beside you' },
    { time: 42, text: 'In your golden hour, the whole universe stops to watch you breathe' },
    { time: 55, text: 'You are the only melody I want to play on repeat forever' },
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(90);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeLyricRef = useRef<HTMLDivElement | null>(null);

  // Audio setup and progress synchronization
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
      audio.pause();
    };
  }, [music.audioUrl]);

  // Scroll active lyric smoothly into view
  useEffect(() => {
    activeLyricRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentTime]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        vaultAudio.playHeartCollect();
      }).catch(() => {
        // Fallback simulation mode
        setIsPlaying(true);
        vaultAudio.playCardHover();
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = Number(e.target.value);
    setCurrentTime(target);
    if (audioRef.current) {
      audioRef.current.currentTime = target;
    }
  };

  const handleLyricClick = (time: number) => {
    vaultAudio.playCardHover();
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      if (!isPlaying) togglePlay();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Find active lyric index based on currentTime
  let activeLyricIdx = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeLyricIdx = i;
    }
  }

  const handleContinue = () => {
    if (audioRef.current) audioRef.current.pause();
    vaultAudio.playSoftTransition();
    setScreen('scrapbook');
  };

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-between px-4 sm:px-6 py-8 max-w-5xl mx-auto selection:bg-rose-500/30">
      {/* Hidden Audio Element */}
      {music.audioUrl && (
        <audio
          ref={audioRef}
          src={music.audioUrl}
          preload="metadata"
        />
      )}

      {/* Atmospheric Background Glow */}
      <div className="absolute top-1/3 left-1/4 w-[32rem] h-[32rem] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20 backdrop-blur-md">
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>OUR ANTHEM &bull; VINYL SOUNDSCAPE</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
          {music.title || 'Golden Hour (Our Anthem)'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 font-sans font-light max-w-lg mx-auto">
          {music.introText || 'Spin the vinyl, close your eyes, and watch our lyrics light up line-by-line.'}
        </p>
      </div>

      {/* Main Showcase: Turntable Left + Live Lyrics Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-4">
        {/* LEFT: 3D ROTATING VINYL RECORD & TURNTABLE */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <TiltCard maxTilt={6} scale={1.02} className="w-full max-w-sm">
            <div className="relative aspect-square w-full rounded-3xl p-6 bg-gradient-to-br from-[#1b1226] via-[#120a1c] to-[#09050e] border border-rose-500/30 shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Turntable Platter Base */}
              <div className="absolute inset-4 rounded-full bg-[#0d0914] border border-white/5 shadow-inner flex items-center justify-center" />

              {/* The Spinning Vinyl Disc */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{
                  repeat: isPlaying ? Infinity : 0,
                  duration: 6,
                  ease: 'linear',
                }}
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full shadow-2xl flex items-center justify-center cursor-pointer select-none"
                style={{
                  background: 'radial-gradient(circle, #222 0%, #111 60%, #000 100%)',
                  boxShadow: '0 0 35px rgba(0,0,0,0.8), inset 0 0 10px rgba(255,255,255,0.1)',
                }}
                onClick={togglePlay}
              >
                {/* Vinyl Grooves (Subtle concentric rings) */}
                <div className="absolute inset-3 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute inset-14 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute inset-20 rounded-full border border-white/5 pointer-events-none" />

                {/* Vinyl Center Label (Cover Art) */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-amber-300/40 shadow-lg flex items-center justify-center">
                  <img
                    src={music.coverUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop'}
                    alt="Album Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-midnight-950 border border-white/30" />
                  </div>
                </div>

                {/* Shimmer Light Reflection on Vinyl */}
                <div className="absolute inset-0 rounded-full opacity-25 bg-[conic-gradient(from_0deg,_rgba(255,255,255,0.4)_0deg,_transparent_60deg,_rgba(255,255,255,0.4)_180deg,_transparent_240deg,_rgba(255,255,255,0.4)_360deg)] pointer-events-none" />
              </motion.div>

              {/* Turntable Tonearm / Stylus */}
              <motion.div
                animate={{ rotate: isPlaying ? 22 : 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute top-6 right-6 w-32 h-44 pointer-events-none origin-top-right"
              >
                {/* Arm pivot base */}
                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-500 shadow-md absolute top-0 right-0" />
                {/* Arm rod */}
                <div className="w-1.5 h-36 bg-gradient-to-b from-slate-400 to-slate-200 shadow-sm absolute top-4 right-3.5 transform -rotate-12" />
                {/* Cartridge head */}
                <div className="w-3.5 h-6 bg-rose-500 rounded-sm absolute bottom-0 left-12 transform rotate-15 shadow-sm" />
              </motion.div>
            </div>
          </TiltCard>

          {/* Quick Play Controls Bar under Turntable */}
          <div className="w-full max-w-sm mt-4 p-4 rounded-2xl bg-midnight-950/70 border border-white/10 backdrop-blur-md space-y-3">
            {/* Scrubber */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Play/Pause & Volume */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-sans font-medium text-white block">
                  {music.artist || 'JVKE & Celestial Strings'}
                </span>
                <span className="text-[10px] text-rose-300 font-sans">
                  {isPlaying ? 'Now Playing &bull; Vinyl Spinning' : 'Paused'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white flex items-center justify-center shadow-glow-rose hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: SPOTIFY / APPLE MUSIC SYNCHRONIZED FLOATING LYRICS */}
        <div className="lg:col-span-7">
          <TiltCard maxTilt={4} scale={1.01} className="w-full">
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#180e22]/95 via-[#120a1c]/95 to-[#0b0611]/95 border border-rose-500/30 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-rose-300 font-semibold">
                  <MusicIcon className="w-4 h-4 text-rose-400" />
                  <span>Synchronized Floating Lyrics</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Tap line to jump
                </span>
              </div>

              {/* Scrollable Karaoke Lyric Lines */}
              <div className="h-80 sm:h-96 overflow-y-auto space-y-6 pr-2 scrollbar-none py-6 select-none">
                {lyrics.map((line, idx) => {
                  const isActive = idx === activeLyricIdx;
                  const isPast = idx < activeLyricIdx;

                  return (
                    <motion.div
                      key={idx}
                      ref={isActive ? activeLyricRef : null}
                      onClick={() => handleLyricClick(line.time)}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                        opacity: isActive ? 1 : isPast ? 0.45 : 0.25,
                      }}
                      transition={{ duration: 0.35 }}
                      className={`cursor-pointer transition-all duration-300 text-left ${
                        isActive
                          ? 'font-serif text-2xl sm:text-3xl text-white font-medium drop-shadow-[0_0_15px_rgba(224,90,136,0.6)]'
                          : 'font-serif text-lg sm:text-xl text-slate-300 hover:text-white hover:opacity-80'
                      }`}
                    >
                      <span>{line.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footnote */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="font-handwriting text-xl text-rose-300">
                  Our song, on loop forever
                </span>
                <span className="flex items-center gap-1 text-[11px] text-rose-400">
                  <Heart className="w-3.5 h-3.5 fill-rose-400/40" />
                  <span>{config.coupleNames}</span>
                </span>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* Bottom Navigation CTA */}
      <div className="pt-6 pb-2 text-center">
        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white font-sans text-xs sm:text-sm tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Step Into Our Memory Scrapbook</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
