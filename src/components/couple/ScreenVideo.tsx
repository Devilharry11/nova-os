import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Video as VideoIcon, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { CinematicTypography } from '../common/CinematicTypography';
import { TiltCard } from '../common/TiltCard';

export const ScreenVideo: React.FC = () => {
  const { config, setScreen } = useExperience();
  const video = config.video;
  const typoItem = config.typography.find((t) => t.section === 'video');

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;

    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
    } else {
      v.play().then(() => {
        setIsPlaying(true);
        setVideoError(false);
      }).catch(() => {
        setVideoError(true);
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current && videoRef.current.duration) {
      const targetTime = (Number(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = targetTime;
      setProgress(Number(e.target.value));
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  // Aspect ratio class mapping
  const getAspectRatioClass = () => {
    switch (video.aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-w-xs';
      case '4:3':
        return 'aspect-[4/3] max-w-xl';
      case '1:1':
        return 'aspect-square max-w-md';
      case '16:9':
      default:
        return 'aspect-video max-w-3xl';
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between px-4 sm:px-6 py-8 max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20">
          <VideoIcon className="w-3.5 h-3.5 text-rose-400" />
          <span>OUR MEMORIES IN MOTION</span>
        </div>

        {video.introText && (
          <p className="text-sm sm:text-base font-serif italic text-slate-300 max-w-xl mx-auto leading-relaxed">
            &ldquo;{video.introText}&rdquo;
          </p>
        )}
      </div>

      {/* Main Video Presentation Player */}
      <div className="my-auto py-6 flex justify-center">
        <TiltCard maxTilt={4} scale={1.01} className={`w-full ${getAspectRatioClass()}`}>
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-full rounded-3xl overflow-hidden border border-rose-500/30 bg-black shadow-2xl group"
          >
          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.posterUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onError={() => setVideoError(true)}
            playsInline
            className="w-full h-full object-cover"
            onClick={togglePlay}
          />

          {/* Fallback Overlay if Video fails to load */}
          {videoError && (
            <div className="absolute inset-0 bg-midnight-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-400" />
              <h4 className="text-base font-serif text-white">Video Source Offline</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                You can upload a personalized video clip or paste a video URL in the Host Studio.
              </p>
            </div>
          )}

          {/* Floating Typography Overlay */}
          {(video.overlayText || typoItem) && (
            <div className="absolute top-6 inset-x-6 z-20 pointer-events-none drop-shadow-md">
              <CinematicTypography
                text={video.overlayText || typoItem?.text || ''}
                preset={typoItem?.preset || 'typewriter'}
                fontFamily={typoItem?.fontFamily || 'handwriting'}
                fontSize={typoItem?.fontSize || '2xl'}
                color={typoItem?.color || '#fdfbf7'}
              />
            </div>
          )}

          {/* Center Play Button Overlay (when paused) */}
          {!isPlaying && !videoError && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-rose-600/80 hover:bg-rose-500 text-white flex items-center justify-center shadow-glow-rose backdrop-blur-sm transition-all hover:scale-110 z-20"
              aria-label="Play video"
            >
              <Play className="w-8 h-8 fill-white translate-x-1" />
            </button>
          )}

          {/* Bottom Custom Cinema Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
            {/* Progress Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-white/20 rounded-lg accent-rose-400 cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1 hover:text-rose-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1 hover:text-rose-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <span className="font-serif text-slate-200 tracking-wide">
                  {video.title}
                </span>
              </div>

              <button
                onClick={handleFullscreen}
                className="p-1 hover:text-rose-400 transition-colors"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
        </TiltCard>
      </div>

      {/* Outro text & Navigation */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        {video.outroText && (
          <p className="text-sm font-serif italic text-slate-300">
            &ldquo;{video.outroText}&rdquo;
          </p>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => {
              vaultAudio.playSoftTransition();
              setScreen('music');
            }}
            className="flex items-center gap-2 text-xs font-sans text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Our Song</span>
          </button>

          <button
            onClick={() => {
              vaultAudio.playSoftTransition();
              setScreen('letter');
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white font-sans text-xs tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Read Personal Letter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
