import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music, Sliders, Heart, Maximize, Minimize, Sparkles } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { ScreenWelcome } from './ScreenWelcome';
import { ScreenQuestions } from './ScreenQuestions';
import { ScreenTimeline } from './ScreenTimeline';
import { ScreenHeartPortal } from './ScreenHeartPortal';
import { ScreenScrapbook } from './ScreenScrapbook';
import { ScreenLoveNotes } from './ScreenLoveNotes';
import { ScreenBucketList } from './ScreenBucketList';
import { ScreenMusic } from './ScreenMusic';
import { ScreenVideo } from './ScreenVideo';
import { ScreenLetter } from './ScreenLetter';
import { ScreenFinalSecret } from './ScreenFinalSecret';
import { ScreenChatGpt } from './ScreenChatGpt';
import { ScreenOpenWhen } from './ScreenOpenWhen';
import { ScreenCoupleGames } from './ScreenCoupleGames';

export const CoupleExperience: React.FC = () => {
  const { 
    currentScreen, 
    setScreen, 
    setViewMode, 
    config, 
    isHostAuthenticated, 
    setIsHostAuthModalOpen 
  } = useExperience();
  const [isMuted, setIsMuted] = useState<boolean>(vaultAudio.getIsMuted());
  const [isMusicOn, setIsMusicOn] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [logoClickCount, setLogoClickCount] = useState<number>(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync fullscreen change events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    vaultAudio.playCardHover();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Keyboard shortcut: Ctrl+Shift+H or Alt+H to trigger Host PIN modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') || (e.altKey && e.key.toLowerCase() === 'h')) {
        e.preventDefault();
        vaultAudio.playCardHover();
        setIsHostAuthModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsHostAuthModalOpen]);

  // Triple-click on brand logo secretly opens Host Auth Modal
  const handleLogoClick = () => {
    setScreen('welcome');
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (newCount >= 3) {
      setLogoClickCount(0);
      vaultAudio.playCardHover();
      setIsHostAuthModalOpen(true);
    } else {
      clickTimerRef.current = setTimeout(() => {
        setLogoClickCount(0);
      }, 1000);
    }
  };

  const handleToggleMute = () => {
    const muted = vaultAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      vaultAudio.playHeartCollect();
    }
  };

  const handleToggleMusic = () => {
    const active = vaultAudio.toggleAmbientMusic();
    setIsMusicOn(active);
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <ScreenWelcome />;
      case 'chatgpt':
        return <ScreenChatGpt />;
      case 'scrapbook':
        return <ScreenScrapbook />;
      case 'music':
        return <ScreenMusic />;
      case 'games':
        return <ScreenCoupleGames />;
      case 'openWhen':
        return <ScreenOpenWhen />;
      case 'letter':
        return <ScreenLetter />;
      case 'final':
        return <ScreenFinalSecret />;
      case 'questions':
        return <ScreenQuestions />;
      case 'timeline':
        return <ScreenTimeline />;
      case 'portal':
      case 'constellation':
        return <ScreenHeartPortal />;
      case 'loveNotes':
        return <ScreenLoveNotes />;
      case 'bucketList':
        return <ScreenBucketList />;
      case 'video':
        return <ScreenVideo />;
      default:
        return <ScreenWelcome />;
    }
  };

  const SCREENS: { id: typeof currentScreen; label: string }[] = [
    { id: 'welcome', label: 'Welcome' },
    { id: 'chatgpt', label: 'LoveGPT AI' },
    { id: 'scrapbook', label: 'Light Ray Memories' },
    { id: 'music', label: 'Soundtrack Mixtape' },
    { id: 'games', label: 'Couple Games' },
    { id: 'openWhen', label: 'Open When' },
    { id: 'letter', label: 'Letter & Voice' },
    { id: 'final', label: 'Thank You' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Top Subtle Cinematic Floating Header */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between backdrop-blur-md bg-midnight-950/50 border-b border-white/5">
        {/* Brand Logo (Secret triple-click to open Host Login) */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          title="HEART//VAULT"
        >
          <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 fill-rose-500/30" />
          </div>
          <span className="font-serif text-lg tracking-wider text-white group-hover:text-rose-200 transition-colors">
            HEART<span className="text-rose-400">//</span>VAULT
          </span>
        </div>

        {/* Step Navigation Breadcrumbs (Subtle pills) */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-midnight-900/60 border border-white/5 text-[11px] font-sans tracking-wider text-slate-400">
          {SCREENS.map((s, idx) => {
            const isActive = s.id === currentScreen;
            return (
              <button
                key={s.id}
                onClick={() => setScreen(s.id)}
                className={`px-2 py-0.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-300 font-medium border border-rose-500/30 shadow-sm'
                    : 'hover:text-slate-200'
                }`}
              >
                {idx + 1}. {s.label}
              </button>
            );
          })}
        </div>

        {/* Audio Controls & Host Studio Switcher (Only visible to verified host) */}
        <div className="flex items-center gap-2">
          {/* Ambient Music Toggle */}
          <button
            onClick={handleToggleMusic}
            className={`p-2 rounded-full border transition-all ${
              isMusicOn
                ? 'bg-violet-500/20 border-violet-500/40 text-violet-300 shadow-sm shadow-violet-500/30'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isMusicOn ? 'Pause Ambient Soundscape' : 'Play Ambient Soundscape'}
          >
            <Music className={`w-3.5 h-3.5 ${isMusicOn ? 'animate-pulse' : ''}`} />
          </button>

          {/* Sound FX Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-full border transition-all ${
              isMuted
                ? 'bg-white/5 border-white/10 text-slate-500'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
            }`}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen / Full Scene Mode Toggle */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-full border transition-all ${
              isFullscreen
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-sm shadow-rose-500/30'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen / Full Scene Mode'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          {/* Admin Portal Button: ALWAYS VISIBLE */}
          <button
            onClick={() => {
              vaultAudio.playCardHover();
              if (isHostAuthenticated) {
                setViewMode('studio');
              } else {
                setIsHostAuthModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/25 to-rose-500/25 hover:from-amber-500/35 hover:to-rose-500/35 text-amber-200 text-xs font-sans tracking-wider border border-amber-500/40 shadow-sm transition-all"
            title="Open Admin Portal to add Photos, Videos & Song with Instagram Lyrics"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-medium">Admin Portal</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono">
              {isHostAuthenticated ? 'ADMIN' : 'LOGIN'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Screen Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        {renderActiveScreen()}
      </main>

      {/* Footer subtle imprint */}
      <footer className="relative z-10 py-3 text-center text-[11px] font-sans tracking-widest uppercase text-slate-400/60 pointer-events-none">
        HEART//VAULT &bull; {config.coupleNames}
      </footer>

      {/* Floating LoveGPT Quick Summon Bubble (when not on chatgpt screen) */}
      {currentScreen !== 'chatgpt' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            vaultAudio.playCardHover();
            setScreen('chatgpt');
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-violet-600 text-white font-sans text-xs font-medium shadow-[0_0_25px_rgba(224,90,136,0.6)] border border-white/20 backdrop-blur-md group"
          title="Ask LoveGPT who the prettiest girl in the world is"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-amber-200 animate-spin-slow" />
          </div>
          <span className="tracking-wide">Ask LoveGPT</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </motion.button>
      )}
    </div>
  );
};
