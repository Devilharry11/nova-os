import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Heart,
  Plane,
  Home,
  Star
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';
import { triggerFireworks } from '../../utils/celebration';
import type { BucketListItem } from '../../types/heartVault';

const CATEGORY_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  travel: { label: 'Wanderlust', icon: <Plane className="w-3.5 h-3.5 text-sky-400" />, color: 'bg-sky-500/10 text-sky-300 border-sky-500/20' },
  romantic: { label: 'Romantic', icon: <Heart className="w-3.5 h-3.5 text-rose-400" />, color: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
  adventure: { label: 'Adventure', icon: <Compass className="w-3.5 h-3.5 text-amber-400" />, color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  cozy: { label: 'Cozy Moments', icon: <Home className="w-3.5 h-3.5 text-emerald-400" />, color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
};

export const ScreenBucketList: React.FC = () => {
  const { config, setScreen, toggleBucketItem, addBucketItem } = useExperience();
  const bucketList = config.bucketList || [];
  
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddingWish, setIsAddingWish] = useState(false);
  const [newWishTitle, setNewWishTitle] = useState('');
  const [newWishCategory, setNewWishCategory] = useState<'travel' | 'romantic' | 'adventure' | 'cozy'>('romantic');
  const [newWishNote, setNewWishNote] = useState('');

  const completedCount = bucketList.filter((b) => b.completed).length;
  const totalCount = bucketList.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems = filterCategory === 'all'
    ? bucketList
    : bucketList.filter((b) => b.category === filterCategory);

  const handleToggle = (id: string, isNowCompleted: boolean) => {
    toggleBucketItem(id);
    if (!isNowCompleted) {
      triggerFireworks();
      vaultAudio.playCelebrationBurst();
    }
  };

  const handleAddWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishTitle.trim()) return;

    const newItem: BucketListItem = {
      id: `wish-${Date.now()}`,
      title: newWishTitle.trim(),
      category: newWishCategory,
      completed: false,
      note: newWishNote.trim() || undefined,
    };

    addBucketItem(newItem);
    vaultAudio.playHeartCollect();
    setNewWishTitle('');
    setNewWishNote('');
    setIsAddingWish(false);
  };

  const handleContinue = () => {
    vaultAudio.playSoftTransition();
    setScreen('letter');
  };

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col items-center justify-start px-4 sm:px-6 py-10 max-w-4xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4 mb-8 w-full"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20 backdrop-blur-md">
          <Star className="w-3.5 h-3.5 text-rose-400" />
          <span>OUR WISH CAPSULE &bull; DREAMS AHEAD</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
          Adventures We Still Have To Live
        </h2>
        <p className="text-sm sm:text-base text-slate-300 font-sans font-light max-w-lg mx-auto">
          Promises to keep, sunrises to chase, and a lifetime of shared dreams waiting to be crossed off together.
        </p>

        {/* Progress Progress Ring Bar */}
        <div className="max-w-md mx-auto pt-2">
          <div className="vault-card rounded-2xl p-4 border border-white/10 bg-midnight-900/60 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="text-left space-y-0.5">
              <span className="text-xs font-sans uppercase tracking-wider text-rose-300 font-medium">
                Dreams Manifested
              </span>
              <p className="text-xs text-slate-400 font-sans">
                {completedCount} of {totalCount} adventures lived ({progressPercent}%)
              </p>
            </div>
            
            {/* Visual Bar */}
            <div className="flex-1 max-w-[140px] h-2 bg-midnight-950 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-violet-500 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Filters & Add Wish Button */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {['all', 'travel', 'romantic', 'adventure', 'cozy'].map((cat) => {
            const isActive = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  vaultAudio.playCardHover();
                  setFilterCategory(cat);
                }}
                className={`px-3 py-1 rounded-full text-xs font-sans capitalize transition-all ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40 font-medium shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                {cat === 'all' ? 'All Wishes' : cat}
              </button>
            );
          })}

          <button
            onClick={() => {
              vaultAudio.playHeartCollect();
              setIsAddingWish(!isAddingWish);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-sans transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Make a Wish</span>
          </button>
        </div>
      </motion.div>

      {/* Quick Add Wish Form Modal / Expandable Card */}
      <AnimatePresence>
        {isAddingWish && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-xl mx-auto mb-6 overflow-hidden"
          >
            <form onSubmit={handleAddWishSubmit} className="vault-card rounded-2xl p-5 border border-rose-500/30 bg-midnight-900/90 backdrop-blur-xl shadow-glow-rose space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-sans font-medium text-rose-200 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Add a Future Dream Wish</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingWish(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <input
                type="text"
                required
                value={newWishTitle}
                onChange={(e) => setNewWishTitle(e.target.value)}
                placeholder="E.g., Watch sunrise from hot air balloon in Cappadocia..."
                className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-rose-400/50"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newWishCategory}
                  onChange={(e) => setNewWishCategory(e.target.value as any)}
                  className="p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs focus:outline-none"
                >
                  <option value="travel">Category: Wanderlust (Travel)</option>
                  <option value="romantic">Category: Romantic</option>
                  <option value="adventure">Category: Adventure</option>
                  <option value="cozy">Category: Cozy Moments</option>
                </select>

                <input
                  type="text"
                  value={newWishNote}
                  onChange={(e) => setNewWishNote(e.target.value)}
                  placeholder="Optional note / promise..."
                  className="p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-400/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 text-white font-sans text-xs uppercase tracking-widest font-medium hover:scale-[1.01] transition-all"
              >
                Seal Into Wish Capsule
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bucket List Items */}
      <div className="w-full max-w-2xl space-y-3.5 my-2">
        {filteredItems.map((item) => {
          const categoryMeta = CATEGORY_MAP[item.category] || CATEGORY_MAP.romantic;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TiltCard maxTilt={3} scale={1.01} className="w-full">
                <div 
                  onClick={() => handleToggle(item.id, item.completed)}
                  className={`vault-card rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                    item.completed
                      ? 'bg-rose-950/20 border-rose-500/40 shadow-sm'
                      : 'bg-midnight-900/50 hover:bg-midnight-900/80 border-white/10 hover:border-rose-400/30'
                  }`}
                >
                  {/* Left Checkbox & Text */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 transition-transform active:scale-90"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-rose-400 fill-rose-400/30" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-rose-400" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <span className={`block text-sm sm:text-base font-sans font-light tracking-wide transition-all ${
                        item.completed ? 'text-slate-300 line-through decoration-rose-400/70' : 'text-white'
                      }`}>
                        {item.title}
                      </span>

                      {item.note && (
                        <p className="text-xs text-slate-400 font-sans italic">
                          &ldquo;{item.note}&rdquo;
                        </p>
                      )}

                      {item.targetDate && (
                        <span className="inline-block text-[10px] font-sans uppercase tracking-widest text-rose-300/80 font-medium">
                          Completed: {item.targetDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Category Tag */}
                  <div className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans uppercase tracking-wider border ${categoryMeta.color}`}>
                    {categoryMeta.icon}
                    <span className="hidden sm:inline">{categoryMeta.label}</span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation CTA to Letter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="pt-8 pb-10 text-center"
      >
        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white font-sans text-xs sm:text-sm tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Open The Sealed Love Letter &amp; Voice Note</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
