import React from 'react';
import { Feather, Heart } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import type { RevealStyle } from '../../types/heartVault';

export const LetterEditor: React.FC = () => {
  const { config, updateLetter } = useExperience();
  const letter = config.letter;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-serif text-white">Personal Letter Editor</h2>
        <p className="text-xs text-slate-400 mt-1">
          Craft the emotional climax of the experience. This appears right after the scrapbook.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
              Letter Title
            </label>
            <input
              type="text"
              value={letter.title}
              onChange={(e) => updateLetter({ title: e.target.value })}
              className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Letter Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                Letter Body (Separate paragraphs with blank lines)
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {letter.body.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <textarea
              rows={10}
              value={letter.body}
              onChange={(e) => updateLetter({ body: e.target.value })}
              className="w-full p-4 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans leading-relaxed focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Signature & Reveal Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                Signature
              </label>
              <input
                type="text"
                value={letter.signature}
                onChange={(e) => updateLetter({ signature: e.target.value })}
                placeholder="e.g. Forever & Always, Julian"
                className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400 font-handwriting text-lg"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                Reveal Style
              </label>
              <select
                value={letter.revealStyle}
                onChange={(e) => updateLetter({ revealStyle: e.target.value as RevealStyle })}
                className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
              >
                <option value="paragraph">Paragraph by Paragraph (Recommended)</option>
                <option value="fade">Gentle Full Fade</option>
                <option value="typewriter">Typewriter Style</option>
              </select>
            </div>
          </div>

          {/* Final Whisper Message */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
              Final Closing Whisper (Shown on vault closure screen)
            </label>
            <input
              type="text"
              value={letter.finalMessage}
              onChange={(e) => updateLetter({ finalMessage: e.target.value })}
              className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* Right Column: Live Mini Paper Preview */}
        <div className="space-y-3">
          <label className="text-xs font-sans uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5 text-rose-400" />
            <span>Parchment Preview</span>
          </label>

          <div className="vault-card rounded-2xl p-5 border border-rose-500/20 shadow-xl space-y-4">
            <h4 className="text-sm font-serif text-white font-medium">
              {letter.title}
            </h4>

            <div className="text-xs font-serif text-slate-300 space-y-2 leading-relaxed max-h-72 overflow-y-auto pr-1">
              {letter.body.split('\n\n').map((p, i) => (
                <p key={i} className="whitespace-pre-line">{p}</p>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="font-handwriting text-xl text-rose-300">
                {letter.signature}
              </span>
              <div className="w-8 h-8 rounded-full bg-rose-600/40 border border-rose-400/50 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-rose-200 fill-rose-200/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
