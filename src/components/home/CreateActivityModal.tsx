import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Plus, Clock, Brain, Flame, Palette, Users, ShieldCheck, Compass } from 'lucide-react';
import { Activity, ActivityCategory, StatKey } from '../../types';

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (activity: Omit<Activity, 'id' | 'creatorId' | 'status'>) => void;
}

export const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('study');
  const [duration, setDuration] = useState(25);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedStats, setSelectedStats] = useState<StatKey[]>(['knowledge', 'discipline']);

  // AI assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStatToggle = (stat: StatKey) => {
    if (selectedStats.includes(stat)) {
      if (selectedStats.length > 1) {
        setSelectedStats(selectedStats.filter((s) => s !== stat));
      }
    } else {
      if (selectedStats.length < 3) {
        setSelectedStats([...selectedStats, stat]);
      }
    }
  };

  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);

    setTimeout(() => {
      const p = aiPrompt.toLowerCase();
      let generatedTitle = `Progress session: ${aiPrompt}`;
      let generatedDesc = `Dedicated focus block: ${aiPrompt}`;
      let cat: ActivityCategory = 'study';
      let stats: StatKey[] = ['knowledge', 'discipline'];
      let dur = 30;
      let diff: 'Easy' | 'Medium' | 'Hard' = 'Medium';

      if (p.includes('history') || p.includes('exam') || p.includes('study') || p.includes('math') || p.includes('read')) {
        generatedTitle = `Review key concepts & notes: ${aiPrompt}`;
        generatedDesc = 'Focus study block with phone on do-not-disturb.';
        cat = 'study';
        stats = ['knowledge', 'discipline'];
        dur = 30;
        diff = 'Easy';
      } else if (p.includes('run') || p.includes('gym') || p.includes('workout') || p.includes('walk') || p.includes('exercise')) {
        generatedTitle = `Physical conditioning: ${aiPrompt}`;
        generatedDesc = 'Active physical movement session with proper warmup.';
        cat = 'fitness';
        stats = ['fitness', 'discipline'];
        dur = 25;
        diff = 'Medium';
      } else if (p.includes('music') || p.includes('guitar') || p.includes('art') || p.includes('draw') || p.includes('write')) {
        generatedTitle = `Creative craft session: ${aiPrompt}`;
        generatedDesc = 'Practice creative expression and build tangible progress.';
        cat = 'creativity';
        stats = ['creativity', 'mind'];
        dur = 25;
        diff = 'Easy';
      } else if (p.includes('friend') || p.includes('meet') || p.includes('call') || p.includes('family')) {
        generatedTitle = `Social connection: ${aiPrompt}`;
        generatedDesc = 'Meaningful real-life conversation and active connection.';
        cat = 'social';
        stats = ['social', 'mind'];
        dur = 30;
        diff = 'Easy';
      } else if (p.includes('meditat') || p.includes('sleep') || p.includes('clean') || p.includes('tidy')) {
        generatedTitle = `Mindful reset: ${aiPrompt}`;
        generatedDesc = 'Clutter-free space and calm mental clarity.';
        cat = 'mind';
        stats = ['mind', 'discipline'];
        dur = 15;
        diff = 'Easy';
      }

      setTitle(generatedTitle);
      setDescription(generatedDesc);
      setCategory(cat);
      setSelectedStats(stats);
      setDuration(dur);
      setDifficulty(diff);
      setAiSuggestion('AI suggested balanced rewards and stat alignment!');
      setIsGeneratingAi(false);
    }, 600);
  };

  const calculateXp = () => {
    const base = difficulty === 'Easy' ? 60 : difficulty === 'Medium' ? 90 : 130;
    return base + Math.floor(duration * 0.8);
  };

  const calculateCoins = () => {
    const base = difficulty === 'Easy' ? 15 : difficulty === 'Medium' ? 25 : 40;
    return base + Math.floor(duration * 0.3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const statRewards: Partial<Record<StatKey, number>> = {};
    selectedStats.forEach((s) => {
      statRewards[s] = difficulty === 'Easy' ? 8 : difficulty === 'Medium' ? 12 : 18;
    });

    onCreate({
      title: title.trim(),
      description: description.trim() || 'Custom real-life accomplishment.',
      category,
      durationMinutes: duration,
      difficulty,
      xpReward: calculateXp(),
      coinReward: calculateCoins(),
      statRewards,
      visibility: 'friends',
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          className="w-full max-w-md bg-[#0b1329] border border-blue-900/60 rounded-3xl p-5 text-left shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">
                New Objective
              </span>
              <h3 className="text-lg font-bold text-white">Create Custom Activity</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI Helper Bar */}
          <div className="my-3 p-3 rounded-2xl bg-gradient-to-r from-blue-950/60 to-purple-950/50 border border-blue-800/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Quest Crafter (Optional)</span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2">
              Type what you need to do (e.g. &quot;Prepare for history test&quot;), and AI will format duration &amp; stat rewards.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. 30 min math homework..."
                className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isGeneratingAi || !aiPrompt.trim()}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              >
                {isGeneratingAi ? '...' : 'Generate'}
              </button>
            </div>
            {aiSuggestion && (
              <span className="text-[10px] text-emerald-400 font-medium block mt-1.5">
                {aiSuggestion}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Activity Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Study mathematics for 30 minutes"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description / Notes
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will you accomplish in this session?"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category & Difficulty Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="study">Study</option>
                  <option value="fitness">Fitness</option>
                  <option value="creativity">Creativity</option>
                  <option value="social">Social</option>
                  <option value="discipline">Discipline</option>
                  <option value="mind">Mind</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                <span className="font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  Estimated Duration
                </span>
                <span className="font-bold text-cyan-400">{duration} minutes</span>
              </div>
              <input
                type="range"
                min={5}
                max={120}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Affected Stats selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Affected Stats (pick up to 3)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { key: 'knowledge', label: 'Knowledge', icon: Brain, color: '#38bdf8' },
                    { key: 'fitness', label: 'Fitness', icon: Flame, color: '#f97316' },
                    { key: 'creativity', label: 'Creativity', icon: Palette, color: '#a855f7' },
                    { key: 'social', label: 'Social', icon: Users, color: '#10b981' },
                    { key: 'discipline', label: 'Discipline', icon: ShieldCheck, color: '#3b82f6' },
                    { key: 'mind', label: 'Mind', icon: Compass, color: '#06b6d4' },
                  ] as const
                ).map((stat) => {
                  const Icon = stat.icon;
                  const isSelected = selectedStats.includes(stat.key);
                  return (
                    <button
                      type="button"
                      key={stat.key}
                      onClick={() => handleStatToggle(stat.key)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl text-left border transition-all cursor-pointer text-xs ${
                        isSelected
                          ? 'border-blue-500 bg-blue-950/60 font-bold text-white'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: stat.color }} />
                      <span className="truncate text-[11px]">{stat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Reward Preview */}
            <div className="p-3 bg-[#080e21] rounded-2xl border border-blue-900/40 flex items-center justify-between">
              <span className="text-xs text-slate-400">Total Reward Estimate:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400">+{calculateXp()} XP</span>
                <span className="text-xs font-bold text-amber-300">+{calculateCoins()} Coins</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-create-activity-btn"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Quests</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
