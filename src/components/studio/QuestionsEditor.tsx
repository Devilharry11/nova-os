import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown
} from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';
import { vaultAudio } from '../../utils/vaultAudio';
import type { Question, QuestionType } from '../../types/heartVault';

export const QuestionsEditor: React.FC = () => {
  const { config, updateQuestion, addQuestion, deleteQuestion, reorderQuestions } = useExperience();
  const [editingId, setEditingId] = useState<string | null>(config.questions[0]?.id || null);

  const handleCreateNew = () => {
    vaultAudio.playHeartCollect();
    const newId = `q_${Date.now()}`;
    const newQ: Question = {
      id: newId,
      type: 'multiple-choice',
      text: 'What is a little memory between us you never want to forget?',
      options: [
        'Our first quiet coffee together',
        'Dancing in the living room',
        'The road trip where we got lost',
        'Watching the city lights at midnight',
      ],
      reward: 1,
      feedback: 'I will cherish that exact moment for the rest of my days.',
      required: true,
    };
    addQuestion(newQ);
    setEditingId(newId);
  };

  const handleOptionChange = (q: Question, idx: number, val: string) => {
    const opts = [...(q.options || [])];
    opts[idx] = val;
    updateQuestion({ ...q, options: opts });
  };

  const handleAddOption = (q: Question) => {
    const opts = [...(q.options || []), `New Option ${(q.options?.length || 0) + 1}`];
    updateQuestion({ ...q, options: opts });
  };

  const handleRemoveOption = (q: Question, idx: number) => {
    const opts = (q.options || []).filter((_, i) => i !== idx);
    updateQuestion({ ...q, options: opts });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif text-white">Personal Questions</h2>
          <p className="text-xs text-slate-400 mt-1">
            Questions reveal one by one to unlock stars and lead into the Heart Constellation.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sans font-medium uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-glow-rose"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {config.questions.map((q, idx) => {
          const isExpanded = editingId === q.id;

          return (
            <div
              key={q.id}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? 'vault-card border-rose-500/40 p-6 shadow-2xl'
                  : 'vault-glass border-white/10 p-4 hover:border-white/20'
              }`}
            >
              {/* Question Summary Bar */}
              <div className="flex items-center justify-between gap-4">
                <div 
                  onClick={() => setEditingId(isExpanded ? null : q.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                >
                  <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-xs font-mono shrink-0">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <h3 className="text-sm font-sans font-medium text-white truncate">
                      {q.text}
                    </h3>
                    <p className="text-[11px] font-sans text-slate-400 capitalize">
                      {q.type.replace('-', ' ')} &bull; {q.options?.length || 0} options &bull; +{q.reward} Heart
                    </p>
                  </div>
                </div>

                {/* Move & Delete Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => reorderQuestions(idx, idx - 1)}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={idx === config.questions.length - 1}
                    onClick={() => reorderQuestions(idx, idx + 1)}
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="p-1.5 rounded-lg text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Edit Form */}
              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-white/10 space-y-5">
                  {/* Question Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                      Question Text
                    </label>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => updateQuestion({ ...q, text: e.target.value })}
                      className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  {/* Question Type & Reward */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                        Question Format
                      </label>
                      <select
                        value={q.type}
                        onChange={(e) => updateQuestion({ ...q, type: e.target.value as QuestionType })}
                        className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="memory">Memory Selection</option>
                        <option value="yes-no">Yes / No Affirmation</option>
                        <option value="text">Open Text Response</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                        Heart Reward
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={q.reward}
                        onChange={(e) => updateQuestion({ ...q, reward: Number(e.target.value) || 1 })}
                        className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>

                  {/* Options Editor (for multiple choice or memory) */}
                  {q.type !== 'text' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                          Answer Options
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddOption(q)}
                          className="text-xs font-sans text-rose-300 hover:text-rose-200"
                        >
                          + Add Option
                        </button>
                      </div>

                      <div className="space-y-2">
                        {q.options?.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(q, optIdx, e.target.value)}
                              className="flex-1 p-2.5 rounded-xl bg-midnight-950/60 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                            />
                            {q.options && q.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(q, optIdx)}
                                className="p-2 text-slate-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-sans uppercase tracking-widest text-slate-400">
                      Whisper Response (Appears warmly upon answering)
                    </label>
                    <textarea
                      rows={2}
                      value={q.feedback || ''}
                      onChange={(e) => updateQuestion({ ...q, feedback: e.target.value })}
                      placeholder="e.g. That evening lives permanently in my heart..."
                      className="w-full p-3 rounded-xl bg-midnight-950/80 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
