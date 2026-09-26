import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Disc, 
  Music as MusicIcon, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { CinematicTypography } from '../common/CinematicTypography';
import { TiltCard } from '../common/TiltCard';

export const ScreenMusic: React.FC = () => {
  const { config, setScreen } = useExperience();
  const music = config.music;
  const typoItem = config.typography.find((t) => t.section === 'music');

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio setup and progress synchronization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [music.audioUrl]);

  // Audio play/pause handler
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setAudioError(false);
      }).catch(() => {
        // Fallback or autoplay blocked
        setAudioError(true);
        setIsPlaying(false);
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Audio Visualizer Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !music.visualizer) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      phase += 0.05;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const barCount = 36;
      const barWidth = w / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        const heightMultiplier = isPlaying 
          ? Math.abs(Math.sin(phase + i * 0.35) * 0.7) + Math.cos(phase * 0.5 + i * 0.2) * 0.3
          : 0.1;
        const barHeight = Math.max(4, heightMultiplier * h * 0.85);

        const gradient = ctx.createLinearGradient(0, h, 0, h - barHeight);
        gradient.addColorStop(0, 'rgba(224, 90, 136, 0.2)');
        gradient.addColorStop(0.5, 'rgba(255, 143, 163, 0.6)');
        gradient.addColorStop(1, 'rgba(157, 114, 255, 0.9)');

        ctx.fillStyle = gradient;
        ctx.fillRect(i * (barWidth + 2), h - barHeight, barWidth, barHeight);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, music.visualizer]);

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between px-4 sm:px-6 py-8 max-w-4xl mx-auto">
      {/* Hidden Audio Tag */}
      <audio
        ref={audioRef}
        src={music.audioUrl}
        preload="metadata"
      />

      {/* Top Header & Intro text */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20">
          <MusicIcon className="w-3.5 h-3.5 text-rose-400" />
          <span>OUR ANTHEM // FAVORITE SONG</span>
        </div>

        {music.introText && (
          <p className="text-sm sm:text-base font-serif italic text-slate-300 max-w-xl mx-auto leading-relaxed">
            &ldquo;{music.introText}&rdquo;
          </p>
        )}
      </div>

      {/* Main Music Player Card */}
      <div className="my-auto py-6">
        <TiltCard maxTilt={5} scale={1.01} className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="vault-card rounded-3xl p-6 sm:p-10 border border-rose-500/25 shadow-2xl relative overflow-hidden w-full"
          >
          {/* Subtle Ambient Halo */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Vinyl Record / Album Cover */}
            <div className="relative w-44 sm:w-52 aspect-square shrink-0">
              {/* Rotating Vinyl Disc behind cover when playing */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className={`absolute -right-6 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-black border-4 border-slate-900 shadow-2xl flex items-center justify-center transition-all ${
                  isPlaying ? 'translate-x-4 opacity-90' : 'translate-x-0 opacity-40'
                }`}
              >
                <div className="w-14 h-14 rounded-full border-2 border-rose-500/40 bg-gradient-to-tr from-rose-900 to-midnight-950 flex items-center justify-center">
                  <Disc className="w-5 h-5 text-rose-300" />
                </div>
              </motion.div>

              {/* Album Art Frame */}
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-midnight-950">
                <img
                  src={music.coverUrl}
                  alt={music.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>

            {/* Song Info & Controls */}
            <div className="flex-1 w-full space-y-5 text-center sm:text-left">
              <div>
                <span className="text-[11px] font-sans tracking-widest uppercase text-rose-400">
                  PLAYING FOR {config.coupleNames}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white font-medium tracking-tight mt-0.5">
                  {music.title}
                </h3>
                <p className="text-sm font-sans text-slate-300 font-light mt-0.5">
                  {music.artist}
                </p>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-midnight-950/80 rounded-lg accent-rose-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons & Volume */}
              <div className="flex items-center justify-between gap-4 pt-1">
                {/* Play / Pause Primary Button */}
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-glow-rose hover:scale-105 active:scale-95 transition-all"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white translate-x-0.5" />
                  )}
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-midnight-950/80 rounded-lg accent-rose-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Error indicator if audio failed to load */}
              {audioError && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Audio source unavailable. You can update the link in the Host Studio anytime.</span>
                </div>
              )}
            </div>
          </div>

          {/* Visualizer Canvas Bar */}
          {music.visualizer && (
            <div className="mt-6 pt-4 border-t border-white/5">
              <canvas
                ref={canvasRef}
                width={500}
                height={36}
                className="w-full h-9 block"
              />
            </div>
          )}
        </motion.div>
        </TiltCard>
      </div>

      {/* Embedded Typography Lyrics / Outro Quote */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        {typoItem ? (
          <CinematicTypography
            text={typoItem.text}
            preset={typoItem.preset}
            fontSize={typoItem.fontSize}
            fontFamily={typoItem.fontFamily}
            color={typoItem.color}
            glow={typoItem.glow}
          />
        ) : music.outroText ? (
          <p className="text-sm font-serif italic text-slate-300">
            &ldquo;{music.outroText}&rdquo;
          </p>
        ) : null}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => {
              vaultAudio.playSoftTransition();
              setScreen('scrapbook');
            }}
            className="flex items-center gap-2 text-xs font-sans text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Scrapbook</span>
          </button>

          <button
            onClick={() => {
              vaultAudio.playSoftTransition();
              setScreen('video');
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white font-sans text-xs tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Our Video Chapters</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
