import React, { useState, useRef, useEffect } from 'react';
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
  Sliders
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';

export const ScreenMusic: React.FC = () => {
  const { config, setScreen } = useExperience();
  const music = config.music;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Ambient Sound Layers
  const [rainActive, setRainActive] = useState<boolean>(false);
  const [fireplaceActive, setFireplaceActive] = useState<boolean>(false);
  const [chimesActive, setChimesActive] = useState<boolean>(true);

  // Equalizer visualizer heights
  const [barHeights, setBarHeights] = useState<number[]>(new Array(24).fill(20));

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

      {/* Top Header */}
      <div className="text-center space-y-2 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-sans tracking-widest uppercase">
          <Disc3 className={`w-3.5 h-3.5 text-violet-400 ${isPlaying ? 'animate-spin' : ''}`} />
          <span>CYBER-ROMANTIC MIXTAPE ROOM</span>
          <Sparkles className="w-3 h-3 text-amber-300" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-wide">
          Our Personal Soundtrack
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto font-light">
          A dedicated tape cassette recorded for our quiet midnight talks.
        </p>
      </div>

      {/* MAIN CASSETTE & EQUALIZER DISPLAY */}
      <div className="relative my-6 w-full max-w-2xl mx-auto z-10">
        <TiltCard maxTilt={5} scale={1.01} className="w-full">
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1b0d26] via-[#12081c] to-[#0a0410] border-2 border-rose-500/30 shadow-[0_0_50px_rgba(139,92,246,0.3)] backdrop-blur-xl space-y-6">
            
            {/* 1. RETRO CYBER-CASSETTE TAPE HOUSING */}
            <div className="relative aspect-[16/9] w-full rounded-2xl bg-gradient-to-b from-[#241334] to-[#12071d] border-2 border-white/15 p-4 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
              
              {/* Cassette Upper Label */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] font-mono">
                <span className="text-rose-300 font-bold uppercase tracking-wider">
                  SIDE A &bull; STEREO HI-FI
                </span>
                <span className="text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  LOVE TAPE VOL. 1
                </span>
              </div>

              {/* Tape Window with Spinning Spools */}
              <div className="relative h-20 sm:h-24 mx-auto w-full max-w-md rounded-xl bg-black/70 border border-white/20 flex items-center justify-around px-6 overflow-hidden">
                {/* Left Spool */}
                <div className="relative flex items-center justify-center">
                  <div 
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-dashed border-rose-400/80 bg-rose-950/60 flex items-center justify-center transition-transform ${
                      isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white/30 border border-white/40" />
                  </div>
                </div>

                {/* Center Tape Level Ribbon */}
                <div className="flex-1 px-4 flex flex-col items-center justify-center space-y-1">
                  <div className="w-full h-2 bg-gradient-to-r from-rose-600 via-amber-400 to-violet-600 rounded-full opacity-70" />
                  <span className="text-[10px] font-mono text-slate-400">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Right Spool */}
                <div className="relative flex items-center justify-center">
                  <div 
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-dashed border-violet-400/80 bg-violet-950/60 flex items-center justify-center transition-transform ${
                      isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white/30 border border-white/40" />
                  </div>
                </div>
              </div>

              {/* Cassette Title Imprint */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 font-sans">
                <div>
                  <h4 className="text-white font-medium text-sm sm:text-base">
                    {music.title || 'Golden Hour Symphony'}
                  </h4>
                  <p className="text-slate-400 text-xs">
                    {music.artist || 'JVKE &bull; Dedication'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <Heart className="w-4 h-4 fill-rose-500/40 animate-pulse" />
                  <span className="text-[11px] font-mono">FOREVER</span>
                </div>
              </div>
            </div>

            {/* 2. REALTIME EQUALIZER WAVEFORM FREQUENCY BARS */}
            <div className="flex items-end justify-between gap-1 h-12 px-2 bg-black/40 rounded-xl p-2 border border-white/10">
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="flex-1 bg-gradient-to-t from-rose-500 via-amber-400 to-violet-400 rounded-t-sm transition-all duration-75 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
                />
              ))}
            </div>

            {/* 3. AUDIO SCRUB BAR & CONTROLS */}
            <div className="space-y-4">
              {/* Progress Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.5}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full accent-rose-500 h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Buttons Row */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleRewind}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Big Play/Pause Button */}
                <button
                  onClick={handleTogglePlay}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-violet-600 text-white flex items-center justify-center shadow-glow-rose hover:scale-105 active:scale-95 transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleToggleMute}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 4. ATMOSPHERIC SOUNDSCAPE MIXER (Rain, Fireplace, Chimes) */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 font-sans">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-300" />
                  <span className="font-medium">Atmospheric Ambience Layers</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Interactive Room</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Rain */}
                <button
                  onClick={() => {
                    vaultAudio.playCardHover();
                    setRainActive(!rainActive);
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${
                    rainActive
                      ? 'bg-blue-500/20 border-blue-400/50 text-blue-200 shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CloudRain className={`w-4 h-4 ${rainActive ? 'animate-bounce text-blue-300' : ''}`} />
                  <span className="text-[11px]">Night Rain</span>
                </button>

                {/* Fireplace */}
                <button
                  onClick={() => {
                    vaultAudio.playCardHover();
                    setFireplaceActive(!fireplaceActive);
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${
                    fireplaceActive
                      ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flame className={`w-4 h-4 ${fireplaceActive ? 'animate-pulse text-amber-300' : ''}`} />
                  <span className="text-[11px]">Fireplace</span>
                </button>

                {/* Starlight Chimes */}
                <button
                  onClick={() => {
                    vaultAudio.playCardHover();
                    setChimesActive(!chimesActive);
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition-all ${
                    chimesActive
                      ? 'bg-violet-500/20 border-violet-400/50 text-violet-200 shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${chimesActive ? 'animate-spin text-violet-300' : ''}`} />
                  <span className="text-[11px]">Stardust</span>
                </button>
              </div>
            </div>

            {/* Dedication Note */}
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/25 text-center">
              <p className="text-xs text-rose-200 font-serif italic">
                &ldquo;{music.introText || 'Whenever you listen to this song, remember you are loved beyond words.'}&rdquo;
              </p>
            </div>
          </div>
        </TiltCard>
      </div>

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
