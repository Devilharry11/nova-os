import React, { useState } from 'react';
import { Heart, Plus, Trash2 } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import type { LoveReason } from '../../types/heartVault';

export const LoveNotesEditor: React.FC = () => {
  const { config, updateLoveReason, addLoveReason, deleteLoveReason } = useExperience();
  const reasons = config.loveReasons || [];

  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<'sweet' | 'humorous' | 'deep' | 'promise'>('sweet');

  const handleAddReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;

    const newItem: LoveReason = {
      id: `reason-${Date.now()}`,
      number: reasons.length + 1,
      title: newTitle.trim(),
      text: newText.trim(),
      category: newCategory,
    };

    addLoveReason(newItem);
    setNewTitle('');
    setNewText('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif text-white flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-400" />
          <span>Reasons Why I Love You Deck Editor</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize intimate confessions, compliments, and inside jokes revealed on the scratch deck.
        </p>
      </div>

      {/* Existing Reasons */}
      <div className="space-y-3">
        {reasons.map((reason) => (
          <div 
            key={reason.id}
            className="vault-card rounded-2xl p-4 border border-white/10 bg-midnight-900/40 space-y-3"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono flex items-center justify-center">
                  #{reason.number}
                </span>
                <input
                  type="text"
                  value={reason.title}
                  onChange={(e) => updateLoveReason({ ...reason, title: e.target.value })}
                  className="font-serif text-base text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={reason.category || 'sweet'}
                  onChange={(e) => updateLoveReason({ ...reason, category: e.target.value as any })}
                  className="p-1.5 rounded-lg bg-midnight-950 border border-white/10 text-white text-xs"
                >
                  <option value="sweet">Sweet</option>
                  <option value="deep">Deep</option>
                  <option value="humorous">Humorous</option>
                  <option value="promise">Promise</option>
                </select>

                <button
                  onClick={() => deleteLoveReason(reason.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete reason"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <textarea
              rows={2}
              value={reason.text}
              onChange={(e) => updateLoveReason({ ...reason, text: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans leading-relaxed"
            />
          </div>
        ))}
      </div>

      {/* Add New Reason Form */}
      <form onSubmit={handleAddReason} className="vault-card rounded-2xl p-5 border border-dashed border-rose-500/30 bg-midnight-900/30 space-y-4">
        <h4 className="text-sm font-sans font-medium text-rose-200 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Another Reason</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Reason Headline (e.g. Your Bedhead Morning Smile)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as any)}
            className="p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs"
          >
            <option value="sweet">Category: Sweet &amp; Loving</option>
            <option value="deep">Category: Deep &amp; Emotional</option>
            <option value="humorous">Category: Funny &amp; Playful</option>
            <option value="promise">Category: Sacred Promise</option>
          </select>
        </div>

        <textarea
          rows={2}
          required
          placeholder="Why does this make you fall for them?..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs"
        />

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-sans text-xs uppercase tracking-widest font-medium transition-all"
        >
          Add To Love Notes Deck
        </button>
      </form>
    </div>
  );
};
