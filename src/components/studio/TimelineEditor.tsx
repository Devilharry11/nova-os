import React, { useState } from 'react';
import { Compass, Plus, Trash2, Clock, Sparkles } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import type { TimelineMilestone } from '../../types/heartVault';

export const TimelineEditor: React.FC = () => {
  const { config, updateConfig, updateTimelineMilestone, addTimelineMilestone, deleteTimelineMilestone } = useExperience();
  const timeline = config.timeline || [];

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newIcon, setNewIcon] = useState<'sparkles' | 'coffee' | 'heart' | 'car' | 'plane' | 'star' | 'camera'>('sparkles');

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newItem: TimelineMilestone = {
      id: `milestone-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate.trim() || 'OUR SPECIAL DAY',
      location: newLocation.trim() || undefined,
      description: newDescription.trim(),
      imageUrl: newImageUrl.trim() || undefined,
      icon: newIcon,
    };

    addTimelineMilestone(newItem);
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewDescription('');
    setNewImageUrl('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-rose-400" />
          <span>Our Love Story &amp; Timeline Editor</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize your relationship start date and the key milestone moments that define your universe.
        </p>
      </div>

      {/* Relationship Start Date (For the Live Love Stopwatch) */}
      <div className="vault-card rounded-2xl p-5 border border-rose-500/30 bg-midnight-900/60 backdrop-blur-md space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-sans font-medium text-white uppercase tracking-wider">
            When Did Your Story Begin?
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          This powers the real-time "Days Together" Live Stopwatch on the couple's story screen.
        </p>

        <div className="max-w-xs">
          <input
            type="datetime-local"
            value={config.startDate ? config.startDate.slice(0, 16) : '2023-10-14T20:00'}
            onChange={(e) => updateConfig({ startDate: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-rose-400"
          />
        </div>
      </div>

      {/* Existing Milestones List */}
      <div className="space-y-4">
        <h3 className="text-sm font-sans uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Milestones ({timeline.length})</span>
        </h3>

        <div className="space-y-3">
          {timeline.map((item, idx) => (
            <div 
              key={item.id}
              className="vault-card rounded-2xl p-4 border border-white/10 bg-midnight-900/40 space-y-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateTimelineMilestone({ ...item, title: e.target.value })}
                    className="font-serif text-base text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => deleteTimelineMilestone(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Date Tag</label>
                  <input
                    type="text"
                    value={item.date}
                    onChange={(e) => updateTimelineMilestone({ ...item, date: e.target.value })}
                    className="w-full p-2 rounded-lg bg-midnight-950/80 border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider">Location Tag</label>
                  <input
                    type="text"
                    value={item.location || ''}
                    placeholder="Optional location"
                    onChange={(e) => updateTimelineMilestone({ ...item, location: e.target.value })}
                    className="w-full p-2 rounded-lg bg-midnight-950/80 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">Story / Memory Note</label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => updateTimelineMilestone({ ...item, description: e.target.value })}
                  className="w-full p-2 rounded-lg bg-midnight-950/80 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider">Photo URL (Optional)</label>
                <input
                  type="url"
                  value={item.imageUrl || ''}
                  placeholder="https://images.unsplash.com/..."
                  onChange={(e) => updateTimelineMilestone({ ...item, imageUrl: e.target.value })}
                  className="w-full p-2 rounded-lg bg-midnight-950/80 border border-white/10 text-white text-xs font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Milestone Card */}
      <form onSubmit={handleAddMilestone} className="vault-card rounded-2xl p-5 border border-dashed border-rose-500/30 bg-midnight-900/30 space-y-4">
        <h4 className="text-sm font-sans font-medium text-rose-200 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add New Story Milestone</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Milestone Title (e.g. Our First Kiss)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs"
          />
          <input
            type="text"
            placeholder="Date (e.g. DECEMBER 24, 2023)"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Location (e.g. Rooftop by the river)"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className="p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs"
          />
          <select
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value as any)}
            className="p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs"
          >
            <option value="sparkles">Icon: Sparkles</option>
            <option value="coffee">Icon: Coffee Cup</option>
            <option value="heart">Icon: Heart</option>
            <option value="car">Icon: Road Trip Car</option>
            <option value="plane">Icon: Airplane Flight</option>
            <option value="star">Icon: Starlight</option>
            <option value="camera">Icon: Camera Snapshot</option>
          </select>
        </div>

        <textarea
          rows={2}
          required
          placeholder="Describe this precious moment..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs"
        />

        <input
          type="url"
          placeholder="Photo URL (optional image for this milestone)"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-mono"
        />

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-sans text-xs uppercase tracking-widest font-medium transition-all"
        >
          Add Milestone To Timeline
        </button>
      </form>
    </div>
  );
};
