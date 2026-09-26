import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUp, 
  Sparkles, 
  Crown, 
  RotateCcw, 
  ArrowRight, 
  Check, 
  Bot, 
  User, 
  Mic, 
  Paperclip, 
  Globe2, 
  ShieldCheck,
  Flame,
  Search
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';
import { triggerFireworks } from '../../utils/celebration';

// Custom OpenAI Love Flower Logo
const LoveGptLogo: React.FC<{ size?: string }> = ({ size = 'w-7 h-7' }) => (
  <div className={`relative ${size} flex items-center justify-center shrink-0`}>
    <svg viewBox="0 0 24 24" className="w-full h-full text-emerald-400 fill-none stroke-current stroke-2">
      <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" className="stroke-rose-500/40" />
      <path d="M12 6c-3.3 0-6 2.7-6 6 0 2.2 1.2 4.1 3 5.1" className="stroke-rose-400" />
      <path d="M12 6c3.3 0 6 2.7 6 6 0 2.2-1.2 4.1-3 5.1" className="stroke-violet-400" />
      <circle cx="12" cy="12" r="3" className="fill-rose-500 stroke-none" />
    </svg>
    <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-md pointer-events-none" />
  </div>
);

const QUICK_PROMPTS = [
  'Who is the most beautiful girl in the world?',
  'Search Earth for the girl with the prettiest smile',
  'Who has the most captivating eyes in the universe?',
];

export const ScreenChatGpt: React.FC = () => {
  const { config, setScreen } = useExperience();
  const chatConfig = config.chatgpt;

  const [inputQuery, setInputQuery] = useState(chatConfig.defaultQuery || 'Who is the most beautiful girl in the world?');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchStep, setSearchStep] = useState<number>(0);
  // 0: idle, 1: scanning global database, 2: analyzing metrics, 3: verdict revealed
  const [typedVerdict, setTypedVerdict] = useState('');

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Typewriter effect for the AI verdict
  useEffect(() => {
    if (searchStep === 2) {
      const fullText = chatConfig.aiVerdict || 'Query completed with 100% confidence. There is only ONE exact match across the entire universe:';
      let currentIdx = 0;
      setTypedVerdict('');

      const interval = setInterval(() => {
        if (currentIdx < fullText.length) {
          setTypedVerdict(fullText.slice(0, currentIdx + 1));
          vaultAudio.playAiTypingTick();
          currentIdx += 1;
        } else {
          clearInterval(interval);
          setSearchStep(3);
          vaultAudio.playAiRevealChime();
          triggerFireworks();
        }
      }, 25);

      return () => clearInterval(interval);
    }
  }, [searchStep, chatConfig.aiVerdict]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [searchStep, typedVerdict]);

  const handleSend = (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim()) return;

    vaultAudio.playCardHover();
    setHasSearched(true);
    setSearchStep(1);

    // Step 1 -> Step 2
    setTimeout(() => {
      vaultAudio.playAiTypingTick();
      setSearchStep(2);
    }, 1800);
  };

  const handleReset = () => {
    vaultAudio.playSoftTransition();
    setHasSearched(false);
    setSearchStep(0);
    setTypedVerdict('');
    setInputQuery(chatConfig.defaultQuery);
  };

  const handleContinue = () => {
    vaultAudio.playWaxSealBreak();
    setScreen('letter');
  };

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-between px-3 sm:px-6 py-4 max-w-4xl mx-auto selection:bg-rose-500/30 font-sans">
      {/* Top ChatGPT Minimalist Bar */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#1e1e24]/90 border border-white/10 backdrop-blur-xl shadow-lg mb-4">
        <div className="flex items-center gap-3">
          <LoveGptLogo />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-wide">
                {chatConfig.modelName || 'LoveGPT-4o'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30">
                Special Edition
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Trained on 8,142,000,000 human beings &bull; Memory Enabled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasSearched && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors border border-white/10"
              title="Reset query"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
            <ShieldCheck className="w-3 h-3" />
            <span className="hidden sm:inline">Truth Mode: Verified</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-center my-2 overflow-y-auto space-y-6">
        {!hasSearched ? (
          /* INITIAL STATE: ChatGPT Welcome Screen */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center space-y-6 py-8"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#272732] border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-glow-rose">
                <LoveGptLogo size="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-2 max-w-lg">
              <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-tight">
                Ask LoveGPT Anything
              </h2>
              <p className="text-sm text-slate-300/80 font-light">
                Connected to the global neural satellite network. Query beauty metrics, soul frequencies, and celestial rankings.
              </p>
            </div>

            {/* Quick Suggested Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl pt-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(prompt);
                    handleSend(prompt);
                  }}
                  className="p-3.5 rounded-2xl bg-[#1e1e24]/80 hover:bg-[#282834] border border-white/10 hover:border-rose-500/40 text-left transition-all group hover:scale-[1.02] shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-slate-200 group-hover:text-white font-medium leading-snug">
                    &ldquo;{prompt}&rdquo;
                  </p>
                  <span className="text-[10px] text-rose-300/70 mt-2 block font-mono">
                    Run Analysis &rarr;
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* CHAT CONVERSATION VIEW */
          <div className="space-y-6 w-full max-w-2xl mx-auto py-2">
            {/* User Question Bubble */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start justify-end gap-3"
            >
              <div className="p-4 rounded-2xl rounded-tr-sm bg-[#2f2f3d] text-white text-sm sm:text-base border border-white/10 shadow-md max-w-md">
                <p className="font-medium">{inputQuery}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shrink-0">
                <User className="w-4 h-4" />
              </div>
            </motion.div>

            {/* LoveGPT Response Bubble */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#1e1e24] border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <Bot className="w-4 h-4 text-rose-400" />
              </div>

              <div className="flex-1 p-5 rounded-2xl rounded-tl-sm bg-[#18181f]/95 border border-rose-500/30 text-slate-200 text-sm sm:text-base shadow-2xl space-y-4">
                {/* Step 1: Processing / Searching Global Humans */}
                {searchStep === 1 && (
                  <div className="space-y-3 py-2">
                    <div className="flex items-center gap-2.5 text-xs text-rose-300 font-mono">
                      <Globe2 className="w-4 h-4 animate-spin text-rose-400" />
                      <span>{chatConfig.aiResponseIntro || 'Scanning 8.14 billion humans across Earth...'}</span>
                    </div>

                    <div className="w-full bg-[#272733] h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.6, ease: 'easeInOut' }}
                        className="h-full bg-gradient-to-r from-rose-500 to-violet-500 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2 & 3: Verdict Text */}
                {searchStep >= 2 && (
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm font-mono text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Database Query Completed: 1 Match Found (Score: 100.00%)</span>
                    </p>
                    <p className="text-sm sm:text-base text-slate-100 font-serif leading-relaxed">
                      {typedVerdict}
                    </p>
                  </div>
                )}

                {/* Step 3: THE GRAND REVEAL (GIRL'S PHOTO CARD) */}
                {searchStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="pt-2"
                  >
                    <TiltCard maxTilt={5} scale={1.01} className="w-full">
                      <div className="relative rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#24132e] via-[#1a0e23] to-[#120819] border-2 border-rose-500/50 shadow-glow-rose overflow-hidden space-y-5">
                        {/* Shimmering Starlight Ambient Glow */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

                        {/* Crown & Match Rank Header */}
                        <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                          <div className="flex items-center gap-2">
                            <Crown className="w-5 h-5 text-amber-300 animate-bounce" />
                            <span className="text-xs font-sans uppercase tracking-widest text-amber-200 font-bold">
                              CERTIFIED MOST BEAUTIFUL IN THE WORLD
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                            #1 UNIVERSAL RANK
                          </span>
                        </div>

                        {/* Photo Display with Glowing Frame */}
                        <div className="relative aspect-[4/5] sm:aspect-square w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-amber-300/40 group">
                          <img
                            src={chatConfig.partnerPhotoUrl}
                            alt={chatConfig.partnerName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                          {/* Floating Bottom Name Overlay */}
                          <div className="absolute bottom-0 inset-x-0 p-4 text-center space-y-1">
                            <h3 className="text-2xl sm:text-3xl font-serif text-white font-medium drop-shadow-md">
                              {chatConfig.partnerName || 'Elena'}
                            </h3>
                            <p className="text-xs font-sans text-rose-200 tracking-wider">
                              The One &amp; Only &bull; Out of 8.2 Billion
                            </p>
                          </div>
                        </div>

                        {/* AI Metrics Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {(chatConfig.compliments || [
                            'Smile: Brighter than a thousand supernovas',
                            'Kindness: Pure golden soul',
                            'Cutest Laugh: Universally unmatched',
                            'Multiverse Rank: #1 Forever & Always',
                          ]).map((comp, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-midnight-950/70 border border-white/10 text-xs text-rose-200 font-sans"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                              <span>{comp}</span>
                            </div>
                          ))}
                        </div>

                        {/* Humorous System Notice */}
                        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-center">
                          <p className="text-xs text-rose-200/90 italic font-sans">
                            &ldquo;{chatConfig.tagline || 'System Notice: Looking at this photograph may cause accelerated heartbeat and uncontrollable blushing.'}&rdquo;
                          </p>
                        </div>
                      </div>
                    </TiltCard>

                    {/* Post-Reveal Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
                      <button
                        onClick={() => {
                          vaultAudio.playCelebrationBurst();
                          triggerFireworks();
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-sans tracking-wider uppercase transition-all hover:scale-105 active:scale-95"
                      >
                        <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span>Confirm Truth (Celebrate)</span>
                      </button>

                      <button
                        onClick={handleContinue}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white text-xs font-sans tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.03] active:scale-[0.98] transition-all"
                      >
                        <span>Open Wax-Sealed Love Letter</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Bottom ChatGPT Prompt Bar */}
      <div className="w-full max-w-2xl mx-auto pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center bg-[#1e1e24] border border-white/15 focus-within:border-rose-500/50 rounded-2xl shadow-xl transition-all p-2"
        >
          <div className="flex items-center gap-2 px-2 text-slate-400">
            <Paperclip className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask ChatGPT: Who is the most beautiful girl in the world?..."
            className="flex-1 bg-transparent px-2 py-1.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />

          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white transition-colors hidden sm:block" />

            <button
              type="submit"
              disabled={!inputQuery.trim() || searchStep === 1}
              className="w-9 h-9 rounded-xl bg-white text-black hover:bg-rose-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
              title="Send prompt to ChatGPT"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>

        <p className="text-[11px] text-center text-slate-400/60 mt-2 font-sans">
          LoveGPT can produce accurate universal truths about how stunning she is. Verify with your own eyes.
        </p>
      </div>
    </div>
  );
};
