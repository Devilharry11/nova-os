import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, MessageCircleHeart } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import { TiltCard } from '../common/TiltCard';

export const ScreenQuestions: React.FC = () => {
  const { config, answerQuestion, answeredQuestions, setScreen, collectedHearts } = useExperience();

  const questions = config.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQ = questions[currentIndex];
  const isAnswered = currentQ ? !!answeredQuestions[currentQ.id] : false;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    answerQuestion(currentQ.id, option, currentQ.reward);
    vaultAudio.playQuizSuccess();
    setShowFeedback(true);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    answerQuestion(currentQ.id, textInput, currentQ.reward);
    vaultAudio.playQuizSuccess();
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    setTextInput('');

    if (isLastQuestion) {
      vaultAudio.playStarConnect();
      setScreen('timeline');
    } else {
      vaultAudio.playSoftTransition();
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!currentQ) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">No questions configured.</p>
        <button
          onClick={() => setScreen('timeline')}
          className="mt-4 px-6 py-2 rounded-full bg-rose-500 text-white font-sans text-xs tracking-wider"
        >
          Proceed to Our Story
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-8">
      {/* Top Constellation Progress Bar */}
      <div className="w-full max-w-xl mx-auto mb-8 flex items-center justify-between text-xs font-sans tracking-widest text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span className="uppercase">Question {currentIndex + 1} of {questions.length}</span>
        </div>

        {/* Hearts Collected Count */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 backdrop-blur-md">
          <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
          <span className="font-medium">{collectedHearts} {collectedHearts === 1 ? 'Heart' : 'Hearts'} Gathered</span>
        </div>
      </div>

      {/* Main Question Card with Framer Motion & 3D Tilt */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl"
        >
          <TiltCard maxTilt={5} scale={1.01} className="w-full">
            <div className="w-full vault-card rounded-3xl p-6 sm:p-10 border border-rose-500/20 shadow-2xl relative overflow-hidden">
              {/* Subtle warm halo in card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Question Text */}
              <div className="space-y-4 mb-8">
                <span className="inline-block text-[11px] font-sans uppercase tracking-widest text-rose-400/80">
                  Moment of Reflection
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-white leading-relaxed font-normal">
                  {currentQ.text}
                </h2>
              </div>

              {/* Answer Options */}
              {!showFeedback && !isAnswered && (
                <div className="space-y-3">
                  {currentQ.type === 'text' ? (
                    <form onSubmit={handleTextSubmit} className="space-y-4">
                      <textarea
                        rows={3}
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Write whatever is in your heart..."
                        className="w-full p-4 rounded-2xl bg-midnight-950/70 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400/50 text-sm font-sans"
                      />
                      <button
                        type="submit"
                        disabled={!textInput.trim()}
                        className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white text-xs uppercase tracking-widest font-sans font-medium transition-all disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Save Memory
                      </button>
                    </form>
                  ) : (
                    currentQ.options?.map((option, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelectOption(option)}
                        className={`w-full p-4 sm:p-4.5 rounded-2xl text-left text-sm sm:text-base font-sans font-light tracking-wide text-slate-200 transition-all duration-200 flex items-center justify-between group border ${
                          selectedOption === option
                            ? 'bg-rose-950/60 border-rose-400 text-white shadow-glow-rose'
                            : 'bg-midnight-900/60 hover:bg-rose-950/30 border-white/10 hover:border-rose-400/40'
                        }`}
                      >
                        <span>{option}</span>
                        <Heart className={`w-4 h-4 transition-colors ${
                          selectedOption === option ? 'text-rose-400 fill-rose-400' : 'text-slate-600 group-hover:text-rose-400'
                        }`} />
                      </motion.button>
                    ))
                  )}
                </div>
              )}

              {/* Warm Feedback Display */}
              {(showFeedback || isAnswered) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 pt-2"
                >
                  <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3.5 text-rose-200">
                    <MessageCircleHeart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-sans uppercase tracking-widest text-rose-400">
                        A Whisper Back To You
                      </p>
                      <p className="text-sm sm:text-base font-serif italic text-white/95 leading-relaxed">
                        &ldquo;{currentQ.feedback || 'Every answer with you is the right one.'}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-violet-600 text-white font-sans text-xs tracking-widest uppercase font-medium shadow-glow-rose hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <span>{isLastQuestion ? 'View Heart Constellation' : 'Next Question'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Little Progress Dots at Card Bottom */}
              <div className="flex justify-center gap-1.5 mt-8 pt-4 border-t border-white/5">
                {questions.map((q, idx) => (
                  <span
                    key={q.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? 'w-6 bg-rose-400 shadow-sm shadow-rose-400'
                        : answeredQuestions[q.id]
                        ? 'w-2 bg-rose-500/50'
                        : 'w-1.5 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
