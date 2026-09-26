import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUp, 
  Sparkles, 
  Crown, 
  RotateCcw, 
  ArrowRight, 
  Check, 
  Mic, 
  Paperclip, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Volume2, 
  ChevronDown, 
  ChevronRight, 
  PanelLeftClose, 
  PanelLeft, 
  Plus, 
  MessageSquare, 
  Share2, 
  Flame 
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';
import { triggerFireworks } from '../../utils/celebration';

// Custom OpenAI Love Logo
const OpenAiLogo: React.FC<{ size?: string }> = ({ size = 'w-5 h-5' }) => (
  <div className={`relative ${size} flex items-center justify-center shrink-0`}>
    <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-none stroke-current stroke-2">
      <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" className="stroke-rose-500/40" />
      <path d="M12 6c-3.3 0-6 2.7-6 6 0 2.2 1.2 4.1 3 5.1" className="stroke-rose-400" />
      <path d="M12 6c3.3 0 6 2.7 6 6 0 2.2-1.2 4.1-3 5.1" className="stroke-violet-400" />
      <circle cx="12" cy="12" r="3" className="fill-rose-500 stroke-none" />
    </svg>
    <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-sm pointer-events-none" />
  </div>
);

const CHAT_HISTORY = [
  { id: '1', title: 'Who is the most beautiful girl in the world?', active: true, time: 'Today' },
  { id: '2', title: 'Our love compatibility analysis', active: false, time: 'Today' },
  { id: '3', title: 'Why her smile stops time', active: false, time: 'Previous 7 Days' },
  { id: '4', title: 'Valentine cosmic odds calculation', active: false, time: 'Previous 7 Days' },
  { id: '5', title: 'Cutest giggles & habits database', active: false, time: 'Previous 30 Days' },
];

const SCAN_STAGES = [
  'Querying 8,142,918,400 global human profiles & beauty indices...',
  'Evaluating facial symmetry, heartwarming smile, and radiance quotient...',
  'Cross-referencing purest soul, gentle kindness, and mesmerizing eyes...',
  'Match verified at 100.00% certainty — Single entity confirmed!'
];

export const ScreenChatGpt: React.FC = () => {
  const { config, setScreen } = useExperience();
  const chatConfig = config.chatgpt;

  const [inputQuery, setInputQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchStep, setSearchStep] = useState<number>(0);
  // 0: idle, 1: scanning/thinking, 2: typing response, 3: verdict & photo reveal
  const [loadingStatusIdx, setLoadingStatusIdx] = useState(0);
  const [typedVerdict, setTypedVerdict] = useState('');
  const [isThinkingOpen, setIsThinkingOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Typewriter effect for AI verdict
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
      }, 22);

      return () => clearInterval(interval);
    }
  }, [searchStep, chatConfig.aiVerdict]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [searchStep, typedVerdict]);

  // Loading status cycling during searchStep === 1
  useEffect(() => {
    if (searchStep === 1) {
      setLoadingStatusIdx(0);
      const stageTimer1 = setTimeout(() => {
        setLoadingStatusIdx(1);
        vaultAudio.playAiTypingTick();
      }, 700);

      const stageTimer2 = setTimeout(() => {
        setLoadingStatusIdx(2);
        vaultAudio.playAiTypingTick();
      }, 1500);

      const stageTimer3 = setTimeout(() => {
        setLoadingStatusIdx(3);
        vaultAudio.playAiTypingTick();
      }, 2300);

      const finishTimer = setTimeout(() => {
        vaultAudio.playAiTypingTick();
        setSearchStep(2);
      }, 3100);

      return () => {
        clearTimeout(stageTimer1);
        clearTimeout(stageTimer2);
        clearTimeout(stageTimer3);
        clearTimeout(finishTimer);
      };
    }
  }, [searchStep]);

  const handleSend = (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim()) return;

    vaultAudio.playCardHover();
    setHasSearched(true);
    setSearchStep(1);
    setIsThinkingOpen(true);
  };

  const handleReset = () => {
    vaultAudio.playSoftTransition();
    setHasSearched(false);
    setSearchStep(0);
    setTypedVerdict('');
    setInputQuery('');
    setLoadingStatusIdx(0);
  };

  const handleCopy = () => {
    vaultAudio.playCardHover();
    const textToCopy = `ChatGPT Analysis: ${chatConfig.partnerName} is certified as the most beautiful girl in the universe! 💖`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    vaultAudio.playLightRayBeam();
    setScreen('scrapbook');
  };

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex bg-[#212121] text-[#ececec] font-sans overflow-hidden rounded-2xl border border-white/10 shadow-2xl my-2">
      {/* 1. AUTHENTIC COLLAPSIBLE SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full bg-[#171717] border-r border-white/10 flex flex-col justify-between shrink-0 z-30 select-none overflow-hidden"
          >
            {/* Sidebar Top: New Chat & Close */}
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="font-medium">New chat</span>
                </button>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 ml-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  title="Close sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              {/* Chat History List */}
              <div className="space-y-4 pt-2">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 px-3 uppercase tracking-wider">
                    Today
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {CHAT_HISTORY.filter(c => c.time === 'Today').map(chat => (
                      <button
                        key={chat.id}
                        onClick={() => {
                          if (chat.id === '1') {
                            setInputQuery(chatConfig.defaultQuery);
                            handleSend(chatConfig.defaultQuery);
                          }
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left truncate transition-colors ${
                          chat.active && hasSearched
                            ? 'bg-[#212121] text-white font-medium'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{chat.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-slate-400 px-3 uppercase tracking-wider">
                    Previous 7 Days
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {CHAT_HISTORY.filter(c => c.time === 'Previous 7 Days').map(chat => (
                      <div
                        key={chat.id}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-white/5 truncate cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{chat.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Bottom: User Profile */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/5 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 font-serif font-bold text-xs">
                  {config.coupleNames.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">
                    {config.coupleNames}
                  </div>
                  <div className="text-[10px] text-rose-300 font-mono flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    <span>Love Edition Plus</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 2. MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col justify-between h-full min-w-0 bg-[#212121]">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-5 py-2.5 bg-[#212121]/90 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Open sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            {/* Model Switcher Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 cursor-pointer text-sm font-semibold text-white transition-colors group">
              <span>ChatGPT</span>
              <span className="text-xs text-slate-400 font-normal group-hover:text-slate-300">4o Love</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasSearched && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors border border-white/10"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            )}

            <button
              onClick={() => {
                vaultAudio.playCardHover();
                triggerFireworks();
              }}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Celebration fireworks"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-8 max-w-3xl w-full mx-auto">
          {!hasSearched ? (
            /* INITIAL STATE: Clean, authentic ChatGPT Opening Screen */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-6 my-auto min-h-[50vh] px-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#2f2f2f] border border-rose-500/30 flex items-center justify-center shadow-2xl shadow-rose-950/40">
                <OpenAiLogo size="w-10 h-10" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-4xl font-serif text-white">
                  What would you like to ask ChatGPT?
                </h2>
                <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto font-light leading-relaxed">
                  Type any question below into the input prompt bar — such as <span className="text-rose-300 font-medium">&ldquo;who is the most beautiful girl in the world?&rdquo;</span> — to query the neural database.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>ChatGPT 4o &bull; Ready for your query</span>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE CHAT: USER MESSAGE & AI RESPONSE */
            <div className="space-y-6">
              {/* User Bubble */}
              <div className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[70%] bg-[#2f2f2f] text-white px-4 py-3 rounded-3xl rounded-tr-sm text-sm sm:text-base shadow-sm">
                  <p>{inputQuery}</p>
                </div>
              </div>

              {/* ChatGPT Response */}
              <div className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-[#2f2f2f] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <OpenAiLogo size="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-4 text-sm sm:text-base leading-relaxed text-[#ececec]">
                  {/* REAL-LOOKING "Thought for 3 seconds" ACCORDION (Like real ChatGPT o1/4o) */}
                  <div className="border border-white/10 rounded-xl overflow-hidden bg-[#181818]">
                    <button
                      onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {searchStep === 1 ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span>
                          {searchStep === 1 ? 'Reasoning & scanning humanity...' : 'Thought for 3 seconds'}
                        </span>
                      </div>
                      {isThinkingOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {isThinkingOpen && (
                      <div className="px-3.5 pb-3 pt-1 text-[11px] font-mono text-slate-400 border-t border-white/5 space-y-1 bg-[#141414]">
                        <p className="text-rose-300">&gt; Target parameter: &quot;{inputQuery}&quot;</p>
                        <p>&gt; Scanning global database: 8,142,918,400 individuals evaluated.</p>
                        <p>&gt; Cross-referencing facial harmony, kindest soul, and warm contagious laugh.</p>
                        <p className="text-emerald-400">&gt; Outliers eliminated: 1 solitary match found with 100.00% confidence.</p>
                      </div>
                    )}
                  </div>

                  {/* HIGH-TECH CYBER SCANNING & LOADING STATE */}
                  {searchStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 rounded-2xl bg-gradient-to-br from-[#1c121e] to-[#120a16] border border-rose-500/30 space-y-4 shadow-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-rose-300 animate-spin" />
                          <div className="absolute inset-0 rounded-full border border-rose-400/50 animate-ping" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-white truncate">
                            {SCAN_STAGES[loadingStatusIdx]}
                          </p>
                          <p className="text-[11px] text-rose-300/80 font-mono">
                            Neural Pipeline &bull; Stage {loadingStatusIdx + 1} of 4
                          </p>
                        </div>
                      </div>

                      {/* Loading Shimmer Box */}
                      <div className="relative h-40 sm:h-48 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-2">
                          <Crown className="w-6 h-6 text-amber-300 animate-pulse" />
                        </div>
                        <p className="text-xs font-mono text-slate-300">Searching global identity records...</p>
                        <p className="text-[11px] font-mono text-slate-500 mt-1">Retrieving photograph and verification badge</p>
                        
                        <div className="w-48 h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400"
                            animate={{ width: `${(loadingStatusIdx + 1) * 25}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* AI Response Stream */}
                  {searchStep >= 2 && (
                    <div className="space-y-4">
                      <p className="text-sm sm:text-base font-serif text-white leading-relaxed">
                        {typedVerdict}
                        {searchStep === 2 && <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse" />}
                      </p>

                      {/* THE GRAND PARTNER PHOTO REVEAL CARD */}
                      {searchStep === 3 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          className="pt-2"
                        >
                          <TiltCard maxTilt={4} scale={1.01} className="w-full">
                            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#2a132e] via-[#1a0e23] to-[#120819] border-2 border-rose-500/50 shadow-2xl overflow-hidden space-y-5">
                              {/* Background Aurora */}
                              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
                              <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

                              {/* Crown Badge */}
                              <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
                                <div className="flex items-center gap-2">
                                  <Crown className="w-5 h-5 text-amber-300 animate-bounce" />
                                  <span className="text-xs font-sans uppercase tracking-widest text-amber-200 font-bold">
                                    CERTIFIED MOST BEAUTIFUL IN THE WORLD
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                                  #1 UNIVERSAL RANK
                                </span>
                              </div>

                              {/* Framed Photograph */}
                              <div className="relative aspect-[4/5] sm:aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-300/40 group">
                                <img
                                  src={chatConfig.partnerPhotoUrl}
                                  alt={chatConfig.partnerName}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                                <div className="absolute bottom-0 inset-x-0 p-5 text-center space-y-1">
                                  <h3 className="text-3xl font-serif text-white font-medium drop-shadow-lg">
                                    {chatConfig.partnerName || 'Elena'}
                                  </h3>
                                  <p className="text-xs text-rose-200 tracking-wider">
                                    The One &amp; Only &bull; Out of 8.2 Billion
                                  </p>
                                </div>
                              </div>

                              {/* AI Badges */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                                {(chatConfig.compliments || [
                                  'Smile: Brighter than a thousand supernovas',
                                  'Kindness: Pure golden soul',
                                  'Cutest Laugh: Universally unmatched',
                                  'Multiverse Rank: #1 Forever & Always',
                                ]).map((comp, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-midnight-950/80 border border-white/10 text-xs text-rose-200 font-sans"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                                    <span>{comp}</span>
                                  </div>
                                ))}
                              </div>

                              {/* System Notice */}
                              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-center">
                                <p className="text-xs text-rose-200/90 italic font-sans">
                                  &ldquo;{chatConfig.tagline || 'System Notice: Looking at this photograph may cause accelerated heartbeat and uncontrollable blushing.'}&rdquo;
                                </p>
                              </div>
                            </div>
                          </TiltCard>

                          {/* Navigation CTA to Open When Envelopes */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
                            <button
                              onClick={() => {
                                vaultAudio.playCelebrationBurst();
                                triggerFireworks();
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-sans tracking-wider uppercase transition-all"
                            >
                              <Flame className="w-3.5 h-3.5 text-amber-300" />
                              <span>Celebrate Truth</span>
                            </button>

                            <button
                              onClick={handleContinue}
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white text-xs font-sans tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                              <span>Next: Digital Light Ray Scrapbook</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Real ChatGPT Action Row (Copy, Thumbs, Sound) */}
                      <div className="flex items-center gap-2 pt-2 text-slate-400 text-xs">
                        <button
                          onClick={handleCopy}
                          className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                          title="Copy response"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => {
                            setLiked(true);
                            vaultAudio.playHeartCollect();
                          }}
                          className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${liked === true ? 'text-emerald-400' : 'hover:text-white'}`}
                          title="Good response"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setLiked(false);
                            vaultAudio.playCardHover();
                          }}
                          className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${liked === false ? 'text-rose-400' : 'hover:text-white'}`}
                          title="Bad response"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => vaultAudio.playAiRevealChime()}
                          className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                          title="Read response aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* 3. AUTHENTIC BOTTOM INPUT PILL */}
        <div className="p-3 sm:p-5 max-w-3xl w-full mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center bg-[#2f2f2f] focus-within:bg-[#2f2f2f] border border-white/10 focus-within:border-white/20 rounded-3xl p-2 shadow-lg transition-all"
          >
            <div className="flex items-center gap-1.5 pl-2 text-slate-400">
              <button
                type="button"
                className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask ChatGPT anything..."
              className="flex-1 bg-transparent px-3 py-2 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
            />

            <div className="flex items-center gap-1 pr-1">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors hidden sm:block"
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!inputQuery.trim() || searchStep === 1}
                className="w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm"
                title="Send query"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

          <p className="text-[11px] text-center text-slate-500 mt-2 font-sans">
            ChatGPT can make mistakes. But regarding {chatConfig.partnerName || 'her'}, the analysis is 100% infallible.
          </p>
        </div>
      </div>
    </div>
  );
};
