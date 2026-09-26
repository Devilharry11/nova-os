import React from 'react';
import { Palette, Sparkles, Volume2, Wand2 } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import type { ThemePreset } from '../../types/heartVault';

const PRESETS: { id: ThemePreset; name: string; desc: string; colors: string[] }[] = [
  {
    id: 'midnight-violet',
    name: 'Midnight & Violet',
    desc: 'Deep navy velvet, subtle violet nebulae, and celestial rose highlights',
    colors: ['#070913', '#9d72ff', '#e05a88'],
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold Starlight',
    desc: 'Warm dusk atmosphere with champagne embers and tender pink glow',
    colors: ['#0c0f20', '#e8a598', '#ff8fa3'],
  },
  {
    id: 'celestial-noir',
    name: 'Celestial Noir',
    desc: 'Pitch obsidian void with glowing diamond stars and deep crimson accents',
    colors: ['#04060d', '#fdfbf7', '#9f1239'],
  },
];

export const ThemeEditor: React.FC = () => {
  const { config, updateTheme } = useExperience();
  const theme = config.theme;

  const handleApplyPreset = (presetId: ThemePreset) => {
    vaultAudio.playHeartCollect();
    if (presetId === 'midnight-violet') {
      updateTheme({
        preset: 'midnight-violet',
        colors: {
          primary: '#e05a88',
          secondary: '#ff8fa3',
          accent: '#9d72ff',
          text: '#f8fafc',
          glow: 'rgba(224, 90, 136, 0.4)',
        },
      });
    } else if (presetId === 'rose-gold') {
      updateTheme({
        preset: 'rose-gold',
        colors: {
          primary: '#e8a598',
          secondary: '#fbcfe8',
          accent: '#f4a261',
          text: '#fdfbf7',
          glow: 'rgba(232, 165, 152, 0.4)',
        },
      });
    } else {
      updateTheme({
        preset: 'celestial-noir',
        colors: {
          primary: '#ff4d6d',
          secondary: '#ffffff',
          accent: '#c9184a',
          text: '#f8fafc',
          glow: 'rgba(255, 77, 109, 0.4)',
        },
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif text-white">Atmosphere & Theme</h2>
        <p className="text-xs text-slate-400 mt-1">
          Adjust the visual ambiance, celestial particle effects, and audio presence.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="space-y-3">
        <label className="text-xs font-sans uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-rose-400" />
          <span>Curated Color Presets</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRESETS.map((p) => {
            const isSelected = theme.preset === p.id;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p.id)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'vault-card border-rose-500/50 shadow-glow-rose'
                    : 'vault-glass border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {p.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="text-sm font-sans font-medium text-white">{p.name}</div>
                <div className="text-xs font-sans text-slate-400 mt-1 leading-relaxed">{p.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Motion & Particles */}
      <div className="p-6 rounded-2xl vault-card border border-white/10 space-y-4">
        <h3 className="text-sm font-sans font-medium text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Motion & Starfield Settings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
              Motion Pace
            </label>
            <select
              value={theme.motion.preset}
              onChange={(e) =>
                updateTheme({
                  motion: {
                    ...theme.motion,
                    preset: e.target.value as 'calm' | 'balanced' | 'cinematic',
                  },
                })
              }
              className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
            >
              <option value="cinematic">Cinematic (Smooth floating ease)</option>
              <option value="balanced">Balanced</option>
              <option value="calm">Calm & Still</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
              Floating Starlight Embers
            </label>
            <button
              type="button"
              onClick={() =>
                updateTheme({
                  motion: { ...theme.motion, particles: !theme.motion.particles },
                })
              }
              className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans text-left flex items-center justify-between"
            >
              <span>{theme.motion.particles ? 'Particles Active' : 'Particles Disabled'}</span>
              <span
                className={`w-3 h-3 rounded-full ${
                  theme.motion.particles ? 'bg-emerald-400' : 'bg-slate-600'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Audio Preferences */}
      <div className="p-6 rounded-2xl vault-card border border-white/10 space-y-4">
        <h3 className="text-sm font-sans font-medium text-white flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-rose-400" />
          <span>Audio Synthesizer Engine</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
              Procedural Sound Synthesis
            </label>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native Web Audio API chords and chimes triggered on star discovery and heart collection.
            </p>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => {
                vaultAudio.playPortalResonance();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-rose-300 border border-rose-500/20 text-xs font-sans uppercase tracking-wider transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Test Audio Chime</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
