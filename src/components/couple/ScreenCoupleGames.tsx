import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Heart, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  Trophy, 
  Gift, 
  HelpCircle,
  Flame,
  Award
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';
import { triggerFireworks } from '../../utils/celebration';

type GameTab = 'catcher' | 'wheel' | 'quiz';

type FallingHeart = {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  points: number;
};

const WHEEL_SLICES = [
  { label: '10-Sec Tight Hug 🤗', color: '#be185d', reward: 'Redeem an unbreakable warm hug right now!' },
  { label: 'Sweet Forehead Kiss 💋', color: '#881337', reward: 'A gentle, lingering forehead kiss.' },
  { label: 'Share 1 Secret Memory 🤫', color: '#6b21a8', reward: 'Tell one moment when your heart beat fastest for me.' },
  { label: 'Free Dessert Coupon 🍨', color: '#a21caf', reward: 'Valid for your favorite ice cream or sweet treat on demand!' },
  { label: 'Slow Dance 30s 💃', color: '#9d174d', reward: 'Put on a song and slow dance right where we are.' },
  { label: '3 Reasons Why I Love You 💕', color: '#7c3aed', reward: 'Listen carefully as I whisper three true reasons.' },
  { label: '1 Golden Wish Coupon 🎟️', color: '#c026d3', reward: 'Grant any 1 favor or wish anytime without complaints!' },
  { label: 'Recreate Our First Pose 📸', color: '#e11d48', reward: 'Look at each other and strike our signature favorite pose.' }
];

const QUIZ_QUESTIONS = [
  {
    q: 'Who fell in love first?',
    options: ['Him 🙋‍♂️', 'Her 🙋‍♀️', 'Both at the exact same second 💫'],
    comment: 'The cosmic connection was instantaneous anyway! ✨'
  },
  {
    q: 'Who takes longer getting ready for a date?',
    options: ['Him 👔', 'Her 👗', 'Depends on the outfit panic 😅'],
    comment: 'Worth every single second of waiting! 🥰'
  },
  {
    q: 'Who is more dramatic when slightly sick?',
    options: ['Him 🤒', 'Her 🥺', 'Total drama kings/queens!'],
    comment: 'Demands soup, cuddles, and 24/7 royal attention! 👑'
  },
  {
    q: 'Who says "I’m not hungry" then steals the food?',
    options: ['Her (always!) 🍟', 'Him (sometimes) 🍔', 'Guilty as charged! 😂'],
    comment: 'The French fries never stood a chance! 🍟'
  },
  {
    q: 'Who loves the other person more?',
    options: ['Impossible to measure ♾️', 'To infinity and back ❤️', 'A tie that grows every day 🌟'],
    comment: '100% Soulmate Compatibility verified! 💖'
  }
];

export const ScreenCoupleGames: React.FC = () => {
  const { config, setScreen } = useExperience();
  const [activeTab, setActiveTab] = useState<GameTab>('catcher');

  // --- 1. HEART CATCHER STATE ---
  const [catcherScore, setCatcherScore] = useState<number>(0);
  const [catcherHearts, setCatcherHearts] = useState<FallingHeart[]>([]);
  const [isCatcherRunning, setIsCatcherRunning] = useState<boolean>(true);
  const [catcherWon, setCatcherWon] = useState<boolean>(false);
  const heartIdCounter = useRef<number>(0);
  const catcherContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeTab !== 'catcher' || !isCatcherRunning) return;

    const interval = setInterval(() => {
      heartIdCounter.current += 1;
      const isGold = Math.random() > 0.75;
      const newHeart: FallingHeart = {
        id: heartIdCounter.current,
        x: Math.random() * 85 + 5,
        y: -10,
        speed: Math.random() * 2 + 1.8,
        size: isGold ? 34 : 26,
        color: isGold ? '#fbbf24' : '#f43f5e',
        points: isGold ? 30 : 10
      };

      setCatcherHearts((prev) => [...prev.slice(-15), newHeart]);
    }, 850);

    return () => clearInterval(interval);
  }, [activeTab, isCatcherRunning]);

  // Falling animation frame
  useEffect(() => {
    if (activeTab !== 'catcher' || !isCatcherRunning) return;

    const moveInterval = setInterval(() => {
      setCatcherHearts((prev) =>
        prev
          .map((h) => ({ ...h, y: h.y + h.speed }))
          .filter((h) => h.y < 105)
      );
    }, 45);

    return () => clearInterval(moveInterval);
  }, [activeTab, isCatcherRunning]);

  const handleCatchHeart = (id: number, points: number) => {
    vaultAudio.playGameCatch();
    setCatcherHearts((prev) => prev.filter((h) => h.id !== id));
    setCatcherScore((prev) => {
      const nextScore = prev + points;
      if (nextScore >= 150 && !catcherWon) {
        setCatcherWon(true);
        vaultAudio.playAiRevealChime();
        triggerFireworks();
      }
      return nextScore;
    });
  };

  const handleResetCatcher = () => {
    vaultAudio.playCardHover();
    setCatcherScore(0);
    setCatcherHearts([]);
    setCatcherWon(false);
    setIsCatcherRunning(true);
  };

  // --- 2. SPIN THE WHEEL STATE ---
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wonPrize, setWonPrize] = useState<(typeof WHEEL_SLICES)[0] | null>(null);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);
    vaultAudio.playWheelSpinTick();

    // Random extra rotations (5-8 full spins + random slice)
    const randomSliceIdx = Math.floor(Math.random() * WHEEL_SLICES.length);
    const sliceAngle = 360 / WHEEL_SLICES.length;
    const extraSpins = (Math.floor(Math.random() * 4) + 5) * 360;
    const targetDeg = wheelRotation + extraSpins + (360 - randomSliceIdx * sliceAngle - sliceAngle / 2);

    setWheelRotation(targetDeg);

    // Audio ticking simulation
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      vaultAudio.playWheelSpinTick();
      tickCount += 1;
      if (tickCount > 18) clearInterval(tickInterval);
    }, 180);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(WHEEL_SLICES[randomSliceIdx]);
      vaultAudio.playAiRevealChime();
      triggerFireworks();
    }, 3800);
  };

  // --- 3. QUIZ STATE ---
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const handleSelectQuizOption = (qIdx: number, option: string) => {
    vaultAudio.playCardHover();
    const updated = { ...quizAnswers, [qIdx]: option };
    setQuizAnswers(updated);

    if (Object.keys(updated).length === QUIZ_QUESTIONS.length) {
      setQuizFinished(true);
      vaultAudio.playAiRevealChime();
      triggerFireworks();
    }
  };

  const handleContinue = () => {
    vaultAudio.playSoftTransition();
    setScreen('openWhen');
  };

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-between px-3 sm:px-6 py-6 max-w-5xl w-full mx-auto select-none">
      {/* Top Header */}
      <div className="text-center space-y-2 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-sans tracking-widest uppercase">
          <Gamepad2 className="w-3.5 h-3.5 text-rose-400" />
          <span>COUPLE ARCADE ZONE</span>
          <Sparkles className="w-3 h-3 text-amber-300" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-wide">
          Fun Games For Just The Two Of Us
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto font-light">
          Catch falling hearts, spin for romantic coupons, and test our soulmate vibe!
        </p>

        {/* Tab Switcher Pills */}
        <div className="flex items-center justify-center gap-2 pt-3">
          <button
            onClick={() => {
              vaultAudio.playCardHover();
              setActiveTab('catcher');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-sans tracking-wider transition-all ${
              activeTab === 'catcher'
                ? 'bg-rose-500/25 border border-rose-500/50 text-rose-200 shadow-glow-rose font-medium'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40" />
            <span>1. Heart Catcher</span>
          </button>

          <button
            onClick={() => {
              vaultAudio.playCardHover();
              setActiveTab('wheel');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-sans tracking-wider transition-all ${
              activeTab === 'wheel'
                ? 'bg-amber-500/25 border border-amber-500/50 text-amber-200 shadow-sm font-medium'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Spin The Wheel</span>
          </button>

          <button
            onClick={() => {
              vaultAudio.playCardHover();
              setActiveTab('quiz');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-sans tracking-wider transition-all ${
              activeTab === 'quiz'
                ? 'bg-violet-500/25 border border-violet-500/50 text-violet-200 shadow-sm font-medium'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
            <span>3. Soulmate Quiz</span>
          </button>
        </div>
      </div>

      {/* ACTIVE GAME CANVAS / CONTAINER */}
      <div className="relative my-6 w-full max-w-2xl mx-auto z-10 flex-1 flex flex-col justify-center">
        
        {/* GAME 1: HEART CATCHER */}
        {activeTab === 'catcher' && (
          <TiltCard maxTilt={3} scale={1.005} className="w-full">
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-[#200f24] to-[#120716] border-2 border-rose-500/30 shadow-2xl backdrop-blur-xl space-y-4">
              {/* Score Bar & Love Meter */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono text-slate-300">
                    Love Score: <span className="text-rose-300 font-bold text-sm">{catcherScore} pts</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-32 sm:w-44 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400"
                      style={{ width: `${Math.min(100, (catcherScore / 150) * 100)}%` }}
                    />
                  </div>
                  <button
                    onClick={handleResetCatcher}
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Restart game"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Falling Hearts Play Area */}
              <div 
                ref={catcherContainerRef}
                className="relative h-72 sm:h-80 w-full rounded-2xl bg-black/50 border border-white/10 overflow-hidden cursor-crosshair select-none"
              >
                {/* Background Instruction */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40 text-center px-4">
                  <p className="text-sm font-sans text-rose-200">
                    Tap or Click the falling hearts before they fade away!
                  </p>
                  <p className="text-[11px] font-mono text-amber-300/80 mt-1">
                    Gold Heart = 30 pts &bull; Pink Heart = 10 pts
                  </p>
                </div>

                {/* Animated Falling Hearts */}
                {catcherHearts.map((h) => (
                  <motion.button
                    key={h.id}
                    onClick={() => handleCatchHeart(h.id, h.points)}
                    style={{
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="absolute p-2 rounded-full hover:scale-125 active:scale-90 transition-transform cursor-pointer"
                  >
                    <Heart 
                      style={{ width: h.size, height: h.size, fill: h.color, color: h.color }}
                      className="drop-shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse" 
                    />
                  </motion.button>
                ))}

                {/* Winner Celebration Overlay */}
                <AnimatePresence>
                  {catcherWon && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3 z-30"
                    >
                      <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-300 animate-bounce">
                        <Flame className="w-7 h-7 text-amber-400" />
                      </div>
                      <h4 className="text-2xl font-serif text-white">
                        Love Meter 100% Unlocked!
                      </h4>
                      <p className="text-xs text-rose-200 font-sans max-w-xs">
                        Reflexes verified: You have officially stolen my heart for eternity! 💖
                      </p>
                      <button
                        onClick={handleResetCatcher}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-sans tracking-wider"
                      >
                        Play Again
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </TiltCard>
        )}

        {/* GAME 2: SPIN THE ROMANCE WHEEL */}
        {activeTab === 'wheel' && (
          <TiltCard maxTilt={3} scale={1.005} className="w-full">
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-[#1e0f22] to-[#100614] border-2 border-amber-500/30 shadow-2xl backdrop-blur-xl flex flex-col items-center space-y-6">
              
              {/* Wheel Container with Pointer */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                {/* Arrow Needle Pointer */}
                <div className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                </div>

                {/* Rotating Wheel Platter */}
                <motion.div
                  style={{ rotate: wheelRotation }}
                  transition={{ duration: 3.8, ease: [0.12, 0.8, 0.25, 1] }}
                  className="relative w-full h-full rounded-full border-4 border-amber-400/50 shadow-2xl overflow-hidden flex items-center justify-center bg-[#1a0c20]"
                >
                  {WHEEL_SLICES.map((slice, i) => {
                    const angle = (360 / WHEEL_SLICES.length) * i;
                    return (
                      <div
                        key={i}
                        style={{
                          transform: `rotate(${angle}deg)`,
                          transformOrigin: '50% 50%'
                        }}
                        className="absolute inset-0 flex items-start justify-center pt-2"
                      >
                        <span className="text-[10px] sm:text-[11px] font-sans font-medium text-white tracking-tight drop-shadow px-2 text-center max-w-[85px] leading-tight">
                          {slice.label}
                        </span>
                      </div>
                    );
                  })}

                  {/* Center Hub */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 border-2 border-white/60 flex items-center justify-center shadow-lg z-20">
                    <Heart className="w-6 h-6 fill-white text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Spin Button */}
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 text-white font-sans text-xs tracking-widest uppercase font-bold shadow-glow-rose hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
              >
                {isSpinning ? 'Spinning Destiny...' : 'SPIN THE WHEEL 🎰'}
              </button>

              {/* Won Prize Display */}
              {wonPrize && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-center space-y-1"
                >
                  <p className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                    Winner Prize Unlocked! 🎉
                  </p>
                  <h4 className="text-base sm:text-lg font-serif text-white">
                    {wonPrize.label}
                  </h4>
                  <p className="text-xs text-amber-100/90 font-sans italic">
                    &ldquo;{wonPrize.reward}&rdquo;
                  </p>
                </motion.div>
              )}
            </div>
          </TiltCard>
        )}

        {/* GAME 3: SOULMATE VIBE QUIZ */}
        {activeTab === 'quiz' && (
          <TiltCard maxTilt={3} scale={1.005} className="w-full">
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-[#1c0d24] to-[#0f0514] border-2 border-violet-500/30 shadow-2xl backdrop-blur-xl space-y-5">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono text-violet-300 uppercase tracking-wider">
                  Soulmate Vibe Checker
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {Object.keys(quizAnswers).length} / {QUIZ_QUESTIONS.length} Answered
                </span>
              </div>

              {/* Questions List */}
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {QUIZ_QUESTIONS.map((item, qIdx) => {
                  const selected = quizAnswers[qIdx];
                  return (
                    <div 
                      key={qIdx}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5"
                    >
                      <p className="text-sm font-medium text-white">
                        {qIdx + 1}. {item.q}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizOption(qIdx, opt)}
                            className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all ${
                              selected === opt
                                ? 'bg-violet-500 text-white font-medium shadow-md shadow-violet-500/40'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      {selected && (
                        <p className="text-[11px] text-rose-300 font-mono italic pt-1">
                          &bull; {item.comment}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Finale Result */}
              {quizFinished && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-gradient-to-r from-violet-600/20 to-rose-600/20 border border-violet-400/40 text-center space-y-1.5"
                >
                  <Award className="w-6 h-6 text-amber-300 mx-auto animate-bounce" />
                  <h4 className="text-lg font-serif text-white">
                    100% Soulmate Compatibility Certified!
                  </h4>
                  <p className="text-xs text-rose-200 font-sans">
                    Through every giggle, silly argument, and midnight craving &bull; {config.coupleNames} are made for each other.
                  </p>
                </motion.div>
              )}
            </div>
          </TiltCard>
        )}
      </div>

      {/* Bottom CTA to Open When Envelopes */}
      <div className="flex justify-end pt-4 border-t border-white/5 z-20">
        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-violet-600 text-white text-xs font-sans tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Next: &ldquo;Open When...&rdquo; Envelopes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
