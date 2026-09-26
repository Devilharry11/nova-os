import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Crown, 
  Plus, 
  Trash2, 
  Eye, 
  Check 
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';

const SAMPLE_PORTRAITS = [
  {
    name: 'Sunset Radiance',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Golden Hour Smile',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Gentle Starlight',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Laughing Eyes',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop',
  },
];

export const ChatGptEditor: React.FC = () => {
  const { config, updateChatGpt } = useExperience();
  const chatConfig = config.chatgpt;

  const [newCompliment, setNewCompliment] = useState('');

  const handleAddCompliment = () => {
    if (!newCompliment.trim()) return;
    vaultAudio.playCardHover();
    const updated = [...(chatConfig.compliments || []), newCompliment.trim()];
    updateChatGpt({ compliments: updated });
    setNewCompliment('');
  };

  const handleDeleteCompliment = (index: number) => {
    vaultAudio.playSoftTransition();
    const updated = chatConfig.compliments.filter((_, i) => i !== index);
    updateChatGpt({ compliments: updated });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-slate-200 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <Bot className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-white">
              LoveGPT AI Surprise Studio
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure the viral ChatGPT surprise: when asked &ldquo;Who is the most beautiful girl in the world?&rdquo;, it reveals your partner&rsquo;s photo!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={chatConfig.enabled}
              onChange={(e) => {
                vaultAudio.playCardHover();
                updateChatGpt({ enabled: e.target.checked });
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            <span className="ml-3 text-xs font-medium text-slate-300">
              {chatConfig.enabled ? 'Feature Active' : 'Feature Disabled'}
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Settings Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Girl's Name & Photo URL */}
          <div className="vault-card rounded-2xl p-5 border border-white/10 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Partner Details (The Star of the AI Reveal)</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Girl&rsquo;s Name / Nickname
                </label>
                <input
                  type="text"
                  value={chatConfig.partnerName}
                  onChange={(e) => updateChatGpt({ partnerName: e.target.value })}
                  placeholder="e.g. Elena, My Queen, Sunshine"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-950 border border-white/15 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Girl&rsquo;s Photo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={chatConfig.partnerPhotoUrl}
                    onChange={(e) => updateChatGpt({ partnerPhotoUrl: e.target.value })}
                    placeholder="https://... photo of her"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-midnight-950 border border-white/15 text-white text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tip: Use a portrait photo where her smile or eyes look stunning!
                </p>
              </div>

              {/* Sample Photo Presets */}
              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-2">
                  Or select sample portrait demo:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_PORTRAITS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        vaultAudio.playCardHover();
                        updateChatGpt({ partnerPhotoUrl: p.url });
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${
                        chatConfig.partnerPhotoUrl === p.url
                          ? 'border-rose-400 ring-2 ring-rose-500/50 scale-105'
                          : 'border-white/15 opacity-70 hover:opacity-100'
                      }`}
                      title={p.name}
                    >
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                      {chatConfig.partnerPhotoUrl === p.url && (
                        <div className="absolute inset-0 bg-rose-500/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Question & Model Settings */}
          <div className="vault-card rounded-2xl p-5 border border-white/10 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-rose-400" />
              <span>ChatGPT Simulation Configuration</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Default Query In Input Bar
                </label>
                <input
                  type="text"
                  value={chatConfig.defaultQuery}
                  onChange={(e) => updateChatGpt({ defaultQuery: e.target.value })}
                  placeholder="Who is the most beautiful girl in the world?"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-950 border border-white/15 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  AI Model Branding Name
                </label>
                <input
                  type="text"
                  value={chatConfig.modelName}
                  onChange={(e) => updateChatGpt({ modelName: e.target.value })}
                  placeholder="LoveGPT-4o Mini"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-950 border border-white/15 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  AI Verdict Message (Typewriter Streamed)
                </label>
                <textarea
                  rows={2}
                  value={chatConfig.aiVerdict}
                  onChange={(e) => updateChatGpt({ aiVerdict: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-950 border border-white/15 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Humorous System Notice at Bottom
                </label>
                <input
                  type="text"
                  value={chatConfig.tagline}
                  onChange={(e) => updateChatGpt({ tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-950 border border-white/15 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* 3. AI Compliments & Badges */}
          <div className="vault-card rounded-2xl p-5 border border-white/10 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Compliments &amp; Metric Badges</span>
            </h3>

            <div className="space-y-2">
              {(chatConfig.compliments || []).map((comp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-midnight-950 border border-white/10 text-xs"
                >
                  <span className="text-rose-200">{comp}</span>
                  <button
                    onClick={() => handleDeleteCompliment(idx)}
                    className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                    title="Delete badge"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newCompliment}
                  onChange={(e) => setNewCompliment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCompliment()}
                  placeholder="e.g. Cutest Laugh: Universally unmatched"
                  className="flex-1 px-3 py-1.5 rounded-xl bg-midnight-950 border border-white/15 text-xs text-white focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={handleAddCompliment}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Preview Card */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="vault-card rounded-2xl p-5 border border-rose-500/40 shadow-glow-rose space-y-4 bg-gradient-to-b from-[#1e1329] to-[#0f0917]">
            <div className="flex items-center justify-between text-xs text-rose-300 border-b border-white/10 pb-3">
              <span className="font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Reveal Preview</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-200">
                100% MATCH
              </span>
            </div>

            {/* Preview Frame */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden border-2 border-amber-300/40 shadow-xl">
                <img
                  src={chatConfig.partnerPhotoUrl}
                  alt={chatConfig.partnerName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 inset-x-0 text-center space-y-0.5">
                  <h4 className="text-xl font-serif text-white font-medium">
                    {chatConfig.partnerName || 'Elena'}
                  </h4>
                  <p className="text-[11px] text-rose-200 font-sans">
                    Certified Most Beautiful in the World
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                {(chatConfig.compliments || []).slice(0, 4).map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-midnight-950/80 border border-white/10 text-rose-200 truncate"
                  >
                    {comp}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-center text-slate-400 italic font-sans pt-1">
                &ldquo;{chatConfig.tagline}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
