import React from 'react';
import { ExperienceProvider, useExperience } from './context/ExperienceContext';
import { CelestialCanvas } from './components/canvas/CelestialCanvas';
import { CursorStardust } from './components/common/CursorStardust';
import { HeartFireworks } from './components/common/HeartFireworks';
import { CoupleExperience } from './components/couple/CoupleExperience';
import { HostStudio } from './components/studio/HostStudio';

import { InstaMusicPlayer } from './components/audio/InstaMusicPlayer';
import { HostAuthModal } from './components/auth/HostAuthModal';

const VaultRoot: React.FC = () => {
  const { viewMode, config, isHostAuthenticated } = useExperience();

  return (
    <div className="relative min-h-screen bg-midnight-950 text-slate-100 overflow-x-hidden selection:bg-rose-500/20 selection:text-rose-200">
      {/* 2D Canvas Celestial Starfield & Embers */}
      <CelestialCanvas reducedMotion={config.theme.motion.reducedMotion} />

      {/* Interactive Cursor Stardust Trail & Micro-Sparkles */}
      <CursorStardust />

      {/* Global Celebratory Heart Fireworks & Streamers Engine */}
      <HeartFireworks />

      {/* Instagram Background Songs & Reels Music Sticker Widget */}
      <InstaMusicPlayer />

      {/* Secret Host Access Gate PIN Modal */}
      <HostAuthModal />

      {/* Render Couple Experience or Host Studio (Protected: only if host is verified) */}
      {viewMode === 'studio' && isHostAuthenticated ? (
        <HostStudio />
      ) : (
        <CoupleExperience />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ExperienceProvider>
      <VaultRoot />
    </ExperienceProvider>
  );
};

export default App;
