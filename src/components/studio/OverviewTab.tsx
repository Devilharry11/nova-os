import React, { useState } from 'react';
import { 
  HelpCircle, 
  Image, 
  FileText, 
  Palette, 
  ExternalLink, 
  Check, 
  Share2, 
  RotateCcw,
  Sparkles,
  Music,
  Video as VideoIcon,
  Type,
  KeyRound,
  Radio
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';

interface OverviewTabProps {
  onSelectTab: (tab: string) => void;
  onOpenPreview: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onSelectTab, onOpenPreview }) => {
  const { config, updateConfig, resetToDefaults, updateHostPin, generatePartnerShareLink } = useExperience();
  const [copied, setCopied] = useState(false);
  const [copiedPartner, setCopiedPartner] = useState(false);

  const handleCopyLink = () => {
    vaultAudio.playHeartCollect();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPartnerLink = () => {
    vaultAudio.playHeartCollect();
    const partnerLink = generatePartnerShareLink();
    navigator.clipboard.writeText(partnerLink);
    setCopiedPartner(true);
    setTimeout(() => setCopiedPartner(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Banner */}
      <div className="rounded-3xl p-6 sm:p-8 vault-card border border-rose-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-sans tracking-widest uppercase bg-rose-500/10 text-rose-300 border border-rose-500/20">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>CREATOR CONTROL DESK</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-white">
            Welcome to the Heart Studio
          </h2>

          <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed max-w-2xl font-light">
            Every question, photo, Instagram audio track, video chapter, typography lyric, and love letter in this digital universe can be customized here in real-time. Changes are immediately saved and reflected in the live experience.
          </p>

          {/* Quick Details Inputs */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                Experience Title
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => updateConfig({ title: e.target.value })}
                className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                Couple Names
              </label>
              <input
                type="text"
                value={config.coupleNames}
                onChange={(e) => updateConfig({ coupleNames: e.target.value })}
                className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* Partner Share Link Card (Solves Cross-Device Sync) */}
            <div className="sm:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-rose-950/50 via-midnight-950 to-violet-950/50 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-rose-950/20">
              <div className="space-y-1">
                <span className="text-xs font-sans font-medium text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Share2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Send to Partner (Cross-Device Link)</span>
                </span>
                <p className="text-xs text-slate-300 font-light max-w-md leading-relaxed">
                  Click below to get a personalized shareable link that embeds all your custom photos, quiz questions, love letter, and playlist for your partner's phone!
                </p>
              </div>

              <button
                onClick={handleCopyPartnerLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white text-xs font-sans font-medium uppercase tracking-wider shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
              >
                {copiedPartner ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedPartner ? 'Partner Link Copied!' : 'Copy Partner Link 🎁'}</span>
              </button>
            </div>

            {/* Host Private PIN Code */}
            <div className="sm:col-span-2 p-4 rounded-2xl bg-midnight-950/80 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-sans font-medium text-amber-200 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Host Access Passcode / PIN</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  This PIN protects your Host Studio. Only you can open this panel. (Default: 1402)
                </p>
              </div>
              <input
                type="text"
                maxLength={16}
                value={config.hostSecurity?.pin || '1402'}
                onChange={(e) => updateHostPin(e.target.value)}
                className="w-36 p-2 rounded-xl bg-midnight-900 border border-amber-500/40 text-amber-300 font-mono text-center text-sm font-semibold tracking-widest focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Questions */}
        <div 
          onClick={() => onSelectTab('questions')}
          className="p-5 rounded-2xl vault-glass border border-white/10 hover:border-rose-400/40 cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between mb-3">
            <HelpCircle className="w-5 h-5 text-rose-400" />
            <span className="text-[10px] font-sans tracking-widest uppercase text-slate-400 group-hover:text-rose-300">
              EDIT &rarr;
            </span>
          </div>
          <div className="text-2xl font-serif text-white font-medium">{config.questions.length}</div>
          <div className="text-xs font-sans text-slate-400 mt-1">Personal Questions</div>
        </div>

        {/* Memories */}
        <div 
          onClick={() => onSelectTab('scrapbook')}
          className="p-5 rounded-2xl vault-glass border border-white/10 hover:border-rose-400/40 cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between mb-3">
            <Image className="w-5 h-5 text-violet-400" />
            <span className="text-[10px] font-sans tracking-widest uppercase text-slate-400 group-hover:text-violet-300">
              EDIT &rarr;
            </span>
          </div>
          <div className="text-2xl font-serif text-white font-medium">{config.memories.length}</div>
          <div className="text-xs font-sans text-slate-400 mt-1">Scrapbook Photos</div>
        </div>

        {/* Instagram Songs */}
        <div 
          onClick={() => onSelectTab('music')}
          className="p-5 rounded-2xl vault-glass border border-rose-500/20 hover:border-rose-400/40 cursor-pointer transition-all hover:scale-[1.02] group bg-gradient-to-b from-rose-500/5 to-transparent"
        >
          <div className="flex items-center justify-between mb-3">
            <Radio className="w-5 h-5 text-rose-400" />
            <span className="text-[10px] font-sans tracking-widest uppercase text-slate-400 group-hover:text-rose-300">
              EDIT &rarr;
            </span>
          </div>
          <div className="text-2xl font-serif text-white font-medium">{config.instaMusic?.tracks?.length || 7}</div>
          <div className="text-xs font-sans text-slate-400 mt-1">Instagram Reel Songs</div>
        </div>

        {/* Favorite Song */}
        <div 
          onClick={() => onSelectTab('music')}
          className="p-5 rounded-2xl vault-glass border border-white/10 hover:border-rose-400/40 cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between mb-3">
            <Music className="w-5 h-5 text-rose-400" />
            <span className="text-[10px] font-sans tracking-widest uppercase text-slate-400 group-hover:text-rose-300">
              EDIT &rarr;
            </span>
          </div>
          <div className="text-sm font-serif text-white font-medium truncate">{config.music.title || 'Our Song'}</div>
          <div className="text-xs font-sans text-slate-400 mt-1">Special Soundtrack</div>
        </div>

        {/* Video */}
        <div 
          onClick={() => onSelectTab('video')}
          className="p-5 rounded-2xl vault-glass border border-white/10 hover:border-rose-400/40 cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between mb-3">
            <VideoIcon className="w-5 h-5 text-violet-400" />
            <span className="text-[10px] font-sans tracking-widest uppercase text-slate-400 group-hover:text-violet-300">
              EDIT &rarr;
            </span>
          </div>
          <div className="text-sm font-serif text-white font-medium truncate">{config.video.title || 'Video Chapter'}</div>
          <div className="text-xs font-sans text-slate-400 mt-1">Montage Edit ({config.video.aspectRatio})</div>
        </div>

        {/* Typography */}
        <div 
          onClick={() => onSelectTab('typography')}
          className="p-5 rounded-2xl vault-glass border border-white/10 hover:border-rose-400/40 cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between mb-3">
            <Type className="w-5 h-5 text-pink-400" />
            <span className="text-[10px] font-sans tracking-widest uppercase text-slate-400 group-hover:text-pink-300">
              EDIT &rarr;
            </span>
          </div>
          <div className="text-2xl font-serif text-white font-medium">{config.typography.length}</div>
          <div className="text-xs font-sans text-slate-400 mt-1">Cinematic Quotes</div>
        </div>

        {/* Letter */}
        <div 
          onClick={() => onSelectTab('letter')}
          className="p-5 rounded-2xl vault-glass border border-white/10 hover:border-rose-400/40 cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-5 h-5 text-rose-300" />
            <span className="text-[10px] font-sans tracking-widest uppercase text-slate-400 group-hover:text-rose-300">
              EDIT &rarr;
            </span>
          </div>
          <div className="text-2xl font-serif text-white font-medium">Ready</div>
          <div className="text-xs font-sans text-slate-400 mt-1">Personal Love Letter</div>
        </div>

        {/* Theme */}
        <div 
          onClick={() => onSelectTab('theme')}
          className="p-5 rounded-2xl vault-glass border border-white/10 hover:border-rose-400/40 cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center justify-between mb-3">
            <Palette className="w-5 h-5 text-amber-300" />
            <span className="text-[10px] font-sans tracking-widest uppercase text-slate-400 group-hover:text-amber-300">
              EDIT &rarr;
            </span>
          </div>
          <div className="text-sm font-serif text-white capitalize truncate">{config.theme.preset.replace('-', ' ')}</div>
          <div className="text-xs font-sans text-slate-400 mt-1">Theme Palette</div>
        </div>
      </div>

      {/* Action Strip */}
      <div className="p-6 rounded-2xl bg-midnight-900/60 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-sans font-medium text-white">Experience Status</h3>
          <p className="text-xs text-slate-400 mt-0.5">Ready to present. Changes save locally in browser storage.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-sans text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-sans text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share Link'}</span>
          </button>

          <button
            onClick={onOpenPreview}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-sans font-medium uppercase tracking-wider text-white bg-gradient-to-r from-rose-500 to-violet-600 shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Live Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
