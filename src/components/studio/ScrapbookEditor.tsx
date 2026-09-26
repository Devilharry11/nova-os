import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Sparkles, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import type { MemoryItem, AnimationPreset } from '../../types/heartVault';

const PRESET_OPTIONS: { id: AnimationPreset; label: string; desc: string }[] = [
  { id: 'starlight', label: 'Starlight Reveal', desc: 'Emerges with celestial star trails and subtle aura' },
  { id: 'polaroid', label: 'Polaroid Drop', desc: 'Classic vintage photo with tape, rotation, and soft drop shadow' },
  { id: 'film', label: 'Film Roll', desc: 'Cinematic horizontal 35mm film strip with perforations' },
  { id: 'cinema', label: 'Slow Cinema', desc: 'Widescreen Ken Burns slow zoom with vignette' },
  { id: 'orbit', label: 'Orbit', desc: 'Floating celestial orbit spotlight' },
  { id: 'letter', label: 'Letter Reveal', desc: 'Typewritten caption reveal with focused focus' },
];

export const ScrapbookEditor: React.FC = () => {
  const { config, updateMemory, addMemory, deleteMemory } = useExperience();
  const [editingId, setEditingId] = useState<string | null>(config.memories[0]?.id || null);

  const handleCreateNew = () => {
    vaultAudio.playHeartCollect();
    const newId = `m_${Date.now()}`;
    const newMem: MemoryItem = {
      id: newId,
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop',
      caption: 'A new unforgettable chapter in our love story.',
      date: 'SEPTEMBER 2024',
      location: 'Our Secret Spot',
      animation: 'polaroid',
      duration: 5000,
      captionStyle: 'handwritten',
      transition: 'fade',
    };
    addMemory(newMem);
    setEditingId(newId);
  };

  const handleLocalImageUpload = (m: MemoryItem, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateMemory({ ...m, imageUrl: event.target.result as string });
          vaultAudio.playHeartCollect();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-white">Scrapbook Memories</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure each photo, caption, and pick from 7 data-driven cinematic animation presets.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-medium uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-glow-rose"
        >
          <Plus className="w-4 h-4" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Memory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {config.memories.map((m, idx) => {
          const isSelected = editingId === m.id;

          return (
            <div
              key={m.id}
              onClick={() => setEditingId(m.id)}
              className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'vault-card border-rose-500/50 shadow-glow-rose'
                  : 'vault-glass border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-rose-300">
                    MEMORY {idx + 1} &bull; {m.animation}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMemory(m.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-midnight-950 border border-white/5">
                  <img
                    src={m.imageUrl}
                    alt={m.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-sans text-white">
                    {m.date || 'No Date'}
                  </div>
                </div>

                <p className="text-xs font-serif text-slate-200 line-clamp-2">
                  &ldquo;{m.caption}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <span>{m.location || 'Location unspecified'}</span>
                <span className="text-rose-400 font-medium">
                  {isSelected ? 'Editing' : 'Click to Edit'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Memory Detailed Edit Drawer / Box */}
      {editingId && (() => {
        const activeMem = config.memories.find((m) => m.id === editingId);
        if (!activeMem) return null;

        return (
          <div className="p-6 rounded-3xl vault-card border border-rose-500/40 shadow-2xl space-y-6 mt-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-serif text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>Editing Memory: {activeMem.caption.slice(0, 30)}...</span>
              </h3>
              <span className="text-xs font-sans text-rose-300">Changes auto-save</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Image Preview & URL */}
              <div className="space-y-4">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/10 bg-midnight-950">
                  <img
                    src={activeMem.imageUrl}
                    alt={activeMem.caption}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Upload Local Image or Paste URL */}
                <div className="space-y-2">
                  <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Photo Source
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={activeMem.imageUrl}
                      onChange={(e) => updateMemory({ ...activeMem, imageUrl: e.target.value })}
                      placeholder="Paste image URL..."
                      className="flex-1 p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                    />
                    <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-sans cursor-pointer transition-colors shrink-0">
                      <Upload className="w-3.5 h-3.5 text-rose-300" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLocalImageUpload(activeMem, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Supports online URLs (Unsplash, Cloudinary, etc.) or local file previews.
                  </p>
                </div>
              </div>

              {/* Right: Caption, Preset, Date, Location */}
              <div className="space-y-4">
                {/* Caption */}
                <div className="space-y-1.5">
                  <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Romantic Caption
                  </label>
                  <textarea
                    rows={3}
                    value={activeMem.caption}
                    onChange={(e) => updateMemory({ ...activeMem, caption: e.target.value })}
                    className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
                  />
                </div>

                {/* Date & Location */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-sans uppercase tracking-widest text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-rose-400" />
                      <span>Date</span>
                    </label>
                    <input
                      type="text"
                      value={activeMem.date || ''}
                      onChange={(e) => updateMemory({ ...activeMem, date: e.target.value })}
                      placeholder="e.g. October 14, 2024"
                      className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-sans uppercase tracking-widest text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-violet-400" />
                      <span>Location</span>
                    </label>
                    <input
                      type="text"
                      value={activeMem.location || ''}
                      onChange={(e) => updateMemory({ ...activeMem, location: e.target.value })}
                      placeholder="e.g. Misty Ridge"
                      className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>

                {/* Animation Preset Selector */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                    Cinematic Animation Preset
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          vaultAudio.playSoftTransition();
                          updateMemory({ ...activeMem, animation: opt.id });
                        }}
                        className={`p-2.5 rounded-xl border text-left font-sans transition-all ${
                          activeMem.animation === opt.id
                            ? 'bg-rose-500/20 border-rose-400 text-white shadow-sm shadow-rose-500/20'
                            : 'bg-midnight-950/50 border-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-medium text-white">{opt.label}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
