import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Check,
  Zap,
  Coins,
  Shield,
  Brain,
  Flame,
  Palette,
  Users,
  Compass,
} from 'lucide-react';
import { CharacterAppearance, StatKey, UserProfile } from '../../types';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { STAT_METADATA } from '../../utils/progression';

interface OnboardingFlowProps {
  onComplete: (data: {
    username: string;
    character: CharacterAppearance;
    interests: string[];
    initialGoals: string[];
  }) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Form states
  const [username, setUsername] = useState('HeroRider');
  const [character, setCharacter] = useState<CharacterAppearance>({
    skinTone: '#ffd1aa',
    hairStyle: 'short_spiky',
    hairColor: '#0f172a',
    eyeStyle: 'neutral',
    topStyle: 'tshirt_blue',
    pantsStyle: 'jeans_dark',
    shoesStyle: 'sneakers_cyan',
    accessoryStyle: 'none',
  });

  const availableInterests = [
    'Studying',
    'Fitness',
    'Creativity',
    'Reading',
    'Coding',
    'Mindfulness',
    'Language Learning',
    'Healthy Sleep',
  ];
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Studying',
    'Fitness',
    'Mindfulness',
  ]);

  const availableGoals = [
    'Complete a 25-minute study focus block',
    'Do a 20-minute physical movement workout',
    'Read 10 pages of a book or article',
    'Write or practice a creative skill',
    'Drink water and 5-min mindful reset',
  ];
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Complete a 25-minute study focus block',
    'Do a 20-minute physical movement workout',
  ]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter((g) => g !== goal));
      }
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleFinish = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#c084fc'],
      });
    } catch {
      // Safe fallback
    }

    onComplete({
      username: username.trim() || 'HeroRider',
      character,
      interests: selectedInterests,
      initialGoals: selectedGoals,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070c1a] text-slate-100 overflow-y-auto">
      <div className="w-full max-w-md bg-[#0b1329] border border-blue-900/60 rounded-3xl p-6 shadow-2xl relative my-auto">
        {/* Progress Dots */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-6 bg-cyan-400'
                    : s < step
                    ? 'w-3 bg-blue-600'
                    : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* STEP 1: WELCOME & IDENTITY */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Zap className="w-8 h-8 fill-white" />
            </div>

            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Welcome to
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight font-display mt-0.5">
                LEVEL UP IRL
              </h2>
              <p className="text-xs text-slate-300 mt-2 px-2 leading-relaxed">
                Turn your real-world accomplishments into RPG character progression.
                Study, exercise, create, and level up with your party.
              </p>
            </div>

            <div className="text-left pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Choose Your Adventurer Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. HeroRider"
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!username.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Next: Customize Avatar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 2: CHARACTER CREATOR */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 text-center"
          >
            <div>
              <h2 className="text-xl font-black text-white font-display">
                Create Starting Character
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize your base hero look. You can earn cosmetics and gear later!
              </p>
            </div>

            {/* Live Preview */}
            <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-b from-blue-950 to-slate-950 border-2 border-cyan-400/40 flex items-center justify-center p-2 shadow-lg shadow-blue-950/40">
              <CharacterAvatar character={character} size="md" animate={true} />
            </div>

            {/* Quick custom controls */}
            <div className="space-y-2 text-left">
              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-1">
                  Hairstyle
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'short_spiky', label: 'Spiky' },
                    { id: 'casual_side', label: 'Casual' },
                    { id: 'ponytail', label: 'Ponytail' },
                    { id: 'curly_afro', label: 'Afro' },
                  ].map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setCharacter({ ...character, hairStyle: h.id })}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        character.hairStyle === h.id
                          ? 'bg-blue-600 text-white border-blue-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-1">
                  Hair Color
                </span>
                <div className="flex gap-2">
                  {['#0f172a', '#451a03', '#b45309', '#94a3b8', '#06b6d4'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setCharacter({ ...character, hairColor: col })}
                      className={`w-8 h-8 rounded-xl border-2 transition-all ${
                        character.hairColor === col ? 'border-cyan-400 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-1">
                  Starting Outfit Color
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { top: 'tshirt_blue', label: 'Blue T-Shirt' },
                    { top: 'hoodie_slate', label: 'Slate Hoodie' },
                    { top: 'blazer_cyber', label: 'Vanguard' },
                  ].map((opt) => (
                    <button
                      key={opt.top}
                      onClick={() => setCharacter({ ...character, topStyle: opt.top })}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        character.topStyle === opt.top
                          ? 'bg-blue-600 text-white border-blue-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Next: Pick Focus Areas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 3: FOCUS INTERESTS */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-black text-white font-display">
                Choose Your Interests
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Select areas you want to build momentum in real life.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {availableInterests.map((interest) => {
                const selected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`p-3 rounded-2xl text-left border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      selected
                        ? 'bg-blue-950/70 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>{interest}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Next: Understand Stats</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 4: THE 6 CORE RPG STATS */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3.5"
          >
            <div>
              <h2 className="text-xl font-black text-white font-display">
                The 6 RPG Attributes
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every task you complete levels up specific real-world stats.
              </p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {(Object.keys(STAT_METADATA) as StatKey[]).map((key) => {
                const meta = STAT_METADATA[key];
                return (
                  <div
                    key={key}
                    className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5"
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: meta.bgLight, color: meta.color }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {meta.name}
                      </span>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStep(5)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Next: Claim Starter Pack</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 5: STARTER PACK REWARD */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 text-center py-2"
          >
            <div className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
              <Sparkles className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                Ready to Adventure
              </span>
              <h2 className="text-2xl font-black text-white font-display mt-0.5">
                Starter Pack Unlocked!
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Your character is initialized and equipped for real-life progression.
              </p>
            </div>

            {/* Reward Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/70 to-slate-900 border border-blue-800/40 grid grid-cols-2 gap-3 text-left">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">+50 Starter XP</span>
                  <span className="text-[10px] text-slate-400">Boost to Level 1</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-300 block">+75 IRL Coins</span>
                  <span className="text-[10px] text-slate-400">Cosmetics currency</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              id="finish-onboarding-btn"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span>Enter Level Up IRL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
