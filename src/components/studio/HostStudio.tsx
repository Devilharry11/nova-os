import React, { useState } from 'react';
import { 
  Heart, 
  HelpCircle, 
  Image, 
  FileText, 
  Palette, 
  LayoutDashboard, 
  Eye, 
  ArrowLeft,
  Sparkles,
  Music,
  Video as VideoIcon,
  Type,
  Lock,
  Compass,
  Gift,
  Star
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { OverviewTab } from './OverviewTab';
import { QuestionsEditor } from './QuestionsEditor';
import { TimelineEditor } from './TimelineEditor';
import { ScrapbookEditor } from './ScrapbookEditor';
import { LoveNotesEditor } from './LoveNotesEditor';
import { BucketListEditor } from './BucketListEditor';
import { MusicEditor } from './MusicEditor';
import { VideoEditor } from './VideoEditor';
import { TypographyEditor } from './TypographyEditor';
import { LetterEditor } from './LetterEditor';
import { ThemeEditor } from './ThemeEditor';
import { ChatGptEditor } from './ChatGptEditor';
import { LivePreviewModal } from './LivePreviewModal';

type StudioTab = 
  | 'overview' 
  | 'timeline'
  | 'chatgpt'
  | 'questions' 
  | 'scrapbook' 
  | 'loveNotes'
  | 'bucketList'
  | 'music'
  | 'video'
  | 'typography'
  | 'letter' 
  | 'theme';

export const HostStudio: React.FC = () => {
  const { setViewMode, lockHost } = useExperience();
  const [activeTab, setActiveTab] = useState<StudioTab>('overview');
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const TABS: { id: StudioTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'timeline', label: 'Our Story & Clock', icon: <Compass className="w-4 h-4" /> },
    { id: 'scrapbook', label: 'Scrapbook', icon: <Image className="w-4 h-4" /> },
    { id: 'chatgpt', label: 'LoveGPT AI Reveal', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
    { id: 'loveNotes', label: 'Love Notes Deck', icon: <Gift className="w-4 h-4" /> },
    { id: 'bucketList', label: 'Future Bucket List', icon: <Star className="w-4 h-4" /> },
    { id: 'music', label: 'Music & Reels Songs', icon: <Music className="w-4 h-4" /> },
    { id: 'video', label: 'Edit Video', icon: <VideoIcon className="w-4 h-4" /> },
    { id: 'typography', label: 'Typography', icon: <Type className="w-4 h-4" /> },
    { id: 'letter', label: 'Love Letter & Voice', icon: <FileText className="w-4 h-4" /> },
    { id: 'theme', label: 'Theme & Sound', icon: <Palette className="w-4 h-4" /> },
    { id: 'questions', label: 'Questions (Optional)', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onSelectTab={(t) => setActiveTab(t as StudioTab)} onOpenPreview={() => setIsPreviewOpen(true)} />;
      case 'timeline':
        return <TimelineEditor />;
      case 'chatgpt':
        return <ChatGptEditor />;
      case 'questions':
        return <QuestionsEditor />;
      case 'scrapbook':
        return <ScrapbookEditor />;
      case 'loveNotes':
        return <LoveNotesEditor />;
      case 'bucketList':
        return <BucketListEditor />;
      case 'music':
        return <MusicEditor />;
      case 'video':
        return <VideoEditor />;
      case 'typography':
        return <TypographyEditor />;
      case 'letter':
        return <LetterEditor />;
      case 'theme':
        return <ThemeEditor />;
      default:
        return <OverviewTab onSelectTab={(t) => setActiveTab(t as StudioTab)} onOpenPreview={() => setIsPreviewOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 text-slate-100 font-sans">
      {/* Studio Header Bar */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/10 bg-midnight-950/90 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              vaultAudio.playSoftTransition();
              setViewMode('couple');
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-sans transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Return to Couple View</span>
          </button>

          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/40" />
            <h1 className="font-serif text-lg text-white font-medium">
              HEART<span className="text-rose-400">//</span>VAULT <span className="text-xs font-sans text-amber-300 font-normal px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">👑 Host Studio</span>
            </h1>
          </div>
        </div>

        {/* Live Preview & Lock Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              lockHost();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
            title="Lock Host Studio (Keeps it private)"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Lock Panel</span>
          </button>

          <button
            onClick={() => {
              vaultAudio.playHeartCollect();
              setIsPreviewOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-medium uppercase tracking-wider text-white bg-gradient-to-r from-rose-500 to-violet-600 shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Device Preview</span>
          </button>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-8 gap-8">
        {/* Left Side Navigation Tabs */}
        <aside className="w-full md:w-56 shrink-0 space-y-1">
          <div className="text-[10px] font-sans uppercase tracking-widest text-slate-400 px-3 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span>CUSTOMIZE EXPERIENCE</span>
          </div>

          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  vaultAudio.playSoftTransition();
                  setActiveTab(tab.id);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-sans transition-all text-left ${
                  isActive
                    ? 'bg-rose-500/15 text-rose-200 font-medium border border-rose-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-rose-400' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Active Content Area */}
        <main className="flex-1 min-w-0">
          {renderTabContent()}
        </main>
      </div>

      {/* Live Preview Modal Overlay */}
      <LivePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
