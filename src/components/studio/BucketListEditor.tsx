import React, { useState } from 'react';
import { Star, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import type { BucketListItem } from '../../types/heartVault';

export const BucketListEditor: React.FC = () => {
  const { config, toggleBucketItem, addBucketItem, deleteBucketItem } = useExperience();
  const bucketList = config.bucketList || [];

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'travel' | 'romantic' | 'adventure' | 'cozy'>('romantic');
  const [newNote, setNewNote] = useState('');

  const handleAddBucketItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: BucketListItem = {
      id: `wish-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      completed: false,
      note: newNote.trim() || undefined,
    };

    addBucketItem(newItem);
    setNewTitle('');
    setNewNote('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-rose-400" />
          <span>Couple Bucket List &amp; Wish Capsule Editor</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage future promises, travel destinations, and romantic milestones to live together.
        </p>
      </div>

      {/* Existing Bucket Items */}
      <div className="space-y-3">
        {bucketList.map((item) => (
          <div 
            key={item.id}
            className="vault-card rounded-2xl p-4 border border-white/10 bg-midnight-900/40 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => toggleBucketItem(item.id)}
                className="shrink-0"
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-rose-400 fill-rose-400/20" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 hover:text-rose-400" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <span className={`block text-sm font-sans ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                  {item.title}
                </span>
                {item.note && (
                  <span className="text-xs text-slate-400 italic block">
                    {item.note}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-sans uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                {item.category}
              </span>

              <button
                onClick={() => deleteBucketItem(item.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete dream"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Wish Form */}
      <form onSubmit={handleAddBucketItem} className="vault-card rounded-2xl p-5 border border-dashed border-rose-500/30 bg-midnight-900/30 space-y-4">
        <h4 className="text-sm font-sans font-medium text-rose-200 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add To Future Bucket List</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Bucket List Wish (e.g. Scuba dive together in the Great Barrier Reef)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as any)}
            className="p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs"
          >
            <option value="travel">Category: Wanderlust / Travel</option>
            <option value="romantic">Category: Romantic</option>
            <option value="adventure">Category: Adventure</option>
            <option value="cozy">Category: Cozy Moments</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Optional note / special promise..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs"
        />

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-sans text-xs uppercase tracking-widest font-medium transition-all"
        >
          Add Wish To Bucket List
        </button>
      </form>
    </div>
  );
};
