import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Sliders, Heart } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { ScreenWelcome } from './ScreenWelcome';
import { ScreenQuestions } from './ScreenQuestions';
import { ScreenConstellation } from './ScreenConstellation';
import { ScreenHeartPortal } from './ScreenHeartPortal';
import { ScreenScrapbook } from './ScreenScrapbook';
import { ScreenMusic } from './ScreenMusic';
import { ScreenVideo } from './ScreenVideo';
import { ScreenLetter } from './ScreenLetter';
import { ScreenFinalSecret } from './ScreenFinalSecret';

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
  const [logoClickCount, setLogoClickCount] = useState<number>(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      case 'questions':
        return <ScreenQuestions />;
      case 'constellation':
        return <ScreenConstellation />;
      case 'portal':
        return <ScreenHeartPortal />;
      case 'scrapbook':
        return <ScreenScrapbook />;
      case 'music':
        return <ScreenMusic />;
      case 'video':
        return <ScreenVideo />;
      case 'letter':
        return <ScreenLetter />;
      case 'final':
        return <ScreenFinalSecret />;
      default:
        return <ScreenWelcome />;
    }
  };

  const SCREENS: { id: typeof currentScreen; label: string }[] = [
    { id: 'welcome', label: 'Welcome' },
    { id: 'questions', label: 'Questions' },
    { id: 'constellation', label: 'Stars' },
    { id: 'portal', label: 'Portal' },
    { id: 'scrapbook', label: 'Scrapbook' },
    { id: 'music', label: 'Song' },
    { id: 'video', label: 'Video' },
    { id: 'letter', label: 'Letter' },
    { id: 'final', label: 'Closure' },
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

          {/* Studio Mode Button: ONLY SHOWN IF USER IS VERIFIED HOST */}
          {isHostAuthenticated && (
            <button
              onClick={() => {
                vaultAudio.playSoftTransition();
                setViewMode('studio');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-200 text-xs font-sans tracking-wider border border-amber-500/40 shadow-sm transition-all"
              title="Open Creator Host Studio (Verified Host)"
            >
              <Sliders className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline font-medium">Host Studio</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono">HOST</span>
            </button>
          )}
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
    </div>
  );
};
