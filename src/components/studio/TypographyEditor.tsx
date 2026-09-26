import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Play, 
  Eye 
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { CinematicTypography } from '../common/CinematicTypography';
import type { TypographyItem, TypographyPreset } from '../../types/heartVault';

const PRESETS: { id: TypographyPreset; label: string; desc: string }[] = [
  { id: 'minimal-cinematic', label: 'Minimal Cinematic', desc: 'Spaced elegant tracking with soft gradient shimmer' },
  { id: 'typewriter', label: 'Typewriter', desc: 'Character-by-character cadence with glowing caret' },
  { id: 'kinetic', label: 'Kinetic Text', desc: 'Spring trajectory with slight tilt and dynamic scale' },
  { id: 'split-text', label: 'Split Text', desc: 'Words converge and settle into reading alignment' },
  { id: 'handwritten', label: 'Handwritten Reveal', desc: 'Fluid script stroke curve into focus' },
  { id: 'letter-by-letter', label: 'Letter-by-Letter', desc: 'Individual staggered character drop-in with soft blur' },
  { id: 'fade-in', label: 'Fade In', desc: 'Ethereal soft fade with subtle vertical float' },
];

export const TypographyEditor: React.FC = () => {
  const { config, updateTypographyItem, addTypographyItem, deleteTypographyItem } = useExperience();
  const [selectedId, setSelectedId] = useState<string | null>(config.typography[0]?.id || null);
  const [previewKey, setPreviewKey] = useState<number>(0);

  const activeItem = config.typography.find((t) => t.id === selectedId) || config.typography[0];

  const handleCreateNew = () => {
    vaultAudio.playHeartCollect();
    const newId = `typo_${Date.now()}`;
    const newItem: TypographyItem = {
      id: newId,
      text: 'Every second with you is my favorite second.',
      preset: 'minimal-cinematic',
      fontFamily: 'serif',
      fontSize: '2xl',
      color: '#ffffff',
      glow: true,
      align: 'center',
      section: 'music',
      delay: 0.3,
      duration: 1.2,
    };
    addTypographyItem(newItem);
    setSelectedId(newId);
  };

  const handleReplayPreview = () => {
    vaultAudio.playSoftTransition();
    setPreviewKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-white">Cinematic Typography Studio</h2>
          <p className="text-xs text-slate-400 mt-1">
            Create emotional lyric quotes and captions that appear dynamically across your experience.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-medium uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-glow-rose"
        >
          <Plus className="w-4 h-4" />
          <span>Add Overlay Quote</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Typography Items */}
        <div className="space-y-3">
          <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
            Active Typography Overlays ({config.typography.length})
          </label>

          <div className="space-y-2">
            {config.typography.map((item) => {
              const isSelected = activeItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedId(item.id);
                    setPreviewKey((prev) => prev + 1);
                  }}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'vault-card border-rose-500/50 shadow-glow-rose'
                      : 'vault-glass border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-rose-400 block">
                      {item.section || 'General'} &bull; {item.preset}
                    </span>
                    <p className="text-xs font-serif text-white truncate mt-0.5">
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>

                  {config.typography.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTypographyItem(item.id);
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete quote"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right: Editor Form & Live Animation Sandbox */}
        {activeItem && (
          <div className="lg:col-span-2 space-y-6">
            {/* Live Interactive Preview Box */}
            <div className="vault-card rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[180px]">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-[10px] font-sans uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-rose-400" />
                  <span>Interactive Animation Sandbox</span>
                </span>

                <button
                  type="button"
                  onClick={handleReplayPreview}
                  className="inline-flex items-center gap-1 text-[11px] font-sans text-rose-300 hover:text-white"
                >
                  <Play className="w-3 h-3" />
                  <span>Replay Animation</span>
                </button>
              </div>

              {/* Render Animated Typography */}
              <div key={previewKey} className="py-6 flex items-center justify-center">
                <CinematicTypography
                  text={activeItem.text}
                  preset={activeItem.preset}
                  fontFamily={activeItem.fontFamily}
                  fontSize={activeItem.fontSize}
                  color={activeItem.color}
                  glow={activeItem.glow}
                  align={activeItem.align}
                  delay={0.1}
                  duration={activeItem.duration || 1.2}
                />
              </div>

              <div className="text-[10px] font-mono text-center text-slate-500">
                Preset: {activeItem.preset} &bull; Font: {activeItem.fontFamily || 'serif'}
              </div>
            </div>

            {/* Customization Controls */}
            <div className="vault-glass rounded-2xl p-6 border border-white/10 space-y-5">
              {/* Text Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                  Quote Text
                </label>
                <textarea
                  rows={2}
                  value={activeItem.text}
                  onChange={(e) => updateTypographyItem({ ...activeItem, text: e.target.value })}
                  className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
                />
              </div>

              {/* Animation Preset Selector */}
              <div className="space-y-2">
                <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                  Animation Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        updateTypographyItem({ ...activeItem, preset: p.id });
                        handleReplayPreview();
                      }}
                      className={`p-2.5 rounded-xl border text-left font-sans transition-all ${
                        activeItem.preset === p.id
                          ? 'bg-rose-500/20 border-rose-400 text-white font-medium shadow-sm'
                          : 'bg-midnight-950/50 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-medium text-white">{p.label}</div>
                      <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography Options: Font, Size, Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Font Family
                  </label>
                  <select
                    value={activeItem.fontFamily || 'serif'}
                    onChange={(e) => {
                      updateTypographyItem({ ...activeItem, fontFamily: e.target.value as any });
                      handleReplayPreview();
                    }}
                    className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                  >
                    <option value="serif">Cormorant Garamond (Serif)</option>
                    <option value="display">Playfair Display</option>
                    <option value="sans">Outfit (Modern Sans)</option>
                    <option value="handwriting">Caveat (Handwritten)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Font Size
                  </label>
                  <select
                    value={activeItem.fontSize || 'xl'}
                    onChange={(e) => {
                      updateTypographyItem({ ...activeItem, fontSize: e.target.value as any });
                      handleReplayPreview();
                    }}
                    className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                  >
                    <option value="sm">Small</option>
                    <option value="base">Base</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra Large</option>
                    <option value="2xl">2X Large</option>
                    <option value="3xl">3X Large (Headline)</option>
                    <option value="4xl">4X Large (Hero)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Target Section
                  </label>
                  <select
                    value={activeItem.section || 'music'}
                    onChange={(e) => updateTypographyItem({ ...activeItem, section: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                  >
                    <option value="welcome">Welcome Section</option>
                    <option value="music">Favorite Song Section</option>
                    <option value="video">Edit Video Section</option>
                    <option value="scrapbook">Scrapbook Section</option>
                    <option value="portal">Heart Portal</option>
                    <option value="letter">Love Letter</option>
                    <option value="final">Final Closure</option>
                  </select>
                </div>
              </div>

              {/* Color & Glow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeItem.color || '#ffffff'}
                      onChange={(e) => {
                        updateTypographyItem({ ...activeItem, color: e.target.value });
                        handleReplayPreview();
                      }}
                      className="w-9 h-9 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={activeItem.color || '#ffffff'}
                      onChange={(e) => {
                        updateTypographyItem({ ...activeItem, color: e.target.value });
                        handleReplayPreview();
                      }}
                      className="flex-1 p-2 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950/60 border border-white/5">
                  <span className="text-xs font-sans text-slate-300">Celestial Glow Effect</span>
                  <button
                    type="button"
                    onClick={() => {
                      updateTypographyItem({ ...activeItem, glow: !activeItem.glow });
                      handleReplayPreview();
                    }}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      activeItem.glow ? 'bg-rose-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                        activeItem.glow ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
