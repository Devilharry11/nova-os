import React, { useState } from 'react';
import { Mail, Plus, Trash2, Sparkles } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import type { OpenWhenEnvelope } from '../../types/heartVault';

export const OpenWhenEditor: React.FC = () => {
  const { config, updateOpenWhenEnvelope, addOpenWhenEnvelope, deleteOpenWhenEnvelope } = useExperience();
  const envelopes = config.openWhen || [];

  const [selectedId, setSelectedId] = useState<string>(envelopes[0]?.id || '');
  const selectedEnv = envelopes.find((e) => e.id === selectedId) || envelopes[0];

  const handleAddNew = () => {
    vaultAudio.playCardHover();
    const newEnv: OpenWhenEnvelope = {
      id: `ow-${Date.now()}`,
      trigger: 'Open when you need a gentle hug',
      subtitle: 'Close your eyes and breathe deep',
      message: 'Whenever you feel overwhelmed, remember you have a safe harbor in my arms. I love you endlessly.',
      photoUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
      category: 'miss-you',
      sealColor: '#e05a88',
    };
    addOpenWhenEnvelope(newEnv);
    setSelectedId(newEnv.id);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-slate-200 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <Mail className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-white">
              &ldquo;Open When...&rdquo; Envelopes Studio
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Write customized letters for her to open when she misses you, feels sad, or can&rsquo;t sleep.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-400 hover:to-violet-500 text-white text-xs font-medium shadow-glow-rose transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Envelope</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Envelope Selector List */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Envelopes ({envelopes.length})
          </span>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {envelopes.map((env) => (
              <div
                key={env.id}
                onClick={() => {
                  vaultAudio.playCardHover();
                  setSelectedId(env.id);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedEnv?.id === env.id
                    ? 'bg-rose-500/20 border-rose-500/50 shadow-sm shadow-rose-950/40'
                    : 'bg-midnight-950/70 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: env.sealColor || '#e05a88' }}
                  />
                  <div className="truncate">
                    <h4 className="text-xs sm:text-sm font-medium text-white truncate">
                      {env.trigger}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {env.subtitle || env.category}
                    </p>
                  </div>
                </div>

                {envelopes.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      vaultAudio.playSoftTransition();
                      deleteOpenWhenEnvelope(env.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete envelope"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Envelope Editor Form */}
        {selectedEnv && (
          <div className="lg:col-span-7 space-y-5 vault-card rounded-2xl p-6 border border-white/10">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Editing Envelope</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Envelope Trigger Title (&ldquo;Open when...&rdquo;)
                </label>
                <input
                  type="text"
                  value={selectedEnv.trigger}
                  onChange={(e) => updateOpenWhenEnvelope({ ...selectedEnv, trigger: e.target.value })}
                  placeholder="e.g. Open when you miss me terribly"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-950 border border-white/15 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Subtitle / Hint
                </label>
                <input
                  type="text"
                  value={selectedEnv.subtitle || ''}
                  onChange={(e) => updateOpenWhenEnvelope({ ...selectedEnv, subtitle: e.target.value })}
                  placeholder="e.g. Close your eyes and hold this near"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-950 border border-white/15 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Letter Message (Unfolds when wax seal breaks)
                </label>
                <textarea
                  rows={4}
                  value={selectedEnv.message}
                  onChange={(e) => updateOpenWhenEnvelope({ ...selectedEnv, message: e.target.value })}
                  placeholder="Write your heartfelt note..."
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-950 border border-white/15 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Optional Photo URL (Shown inside the letter)
                </label>
                <input
                  type="url"
                  value={selectedEnv.photoUrl || ''}
                  onChange={(e) => updateOpenWhenEnvelope({ ...selectedEnv, photoUrl: e.target.value })}
                  placeholder="https://... memorable photo"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-950 border border-white/15 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Wax Seal Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedEnv.sealColor || '#e05a88'}
                      onChange={(e) => updateOpenWhenEnvelope({ ...selectedEnv, sealColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-slate-400">
                      {selectedEnv.sealColor || '#e05a88'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Category Mood
                  </label>
                  <select
                    value={selectedEnv.category || 'miss-you'}
                    onChange={(e) => updateOpenWhenEnvelope({ ...selectedEnv, category: e.target.value as OpenWhenEnvelope['category'] })}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-white/15 text-white text-xs focus:outline-none focus:border-rose-500"
                  >
                    <option value="miss-you">Miss You</option>
                    <option value="sad-day">Tough / Sad Day</option>
                    <option value="cant-sleep">Can't Sleep</option>
                    <option value="mad-at-me">Mad At Me</option>
                    <option value="celebrate">Celebration</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
