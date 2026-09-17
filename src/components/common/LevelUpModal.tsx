import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Coins, ArrowRight } from 'lucide-react';
import { formatCoins } from '../../utils/progression';

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  rewardCoins?: number;
  coinsAwarded?: number;
  unlockedTitle?: string;
  newTitle?: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  newLevel,
  rewardCoins,
  coinsAwarded,
  unlockedTitle,
  newTitle,
  onClose,
}) => {
  const coins = rewardCoins ?? coinsAwarded ?? 0;
  const titleText = unlockedTitle || newTitle || 'New Cosmetics in Shop!';

  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#3b82f6', '#fbbf24', '#c084fc'],
        });
      } catch {
        // Safe fallback if canvas-confetti is not rendered
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          className="w-full max-w-sm bg-gradient-to-b from-[#0f1d40] to-[#0a1226] border-2 border-blue-500/60 rounded-3xl p-6 text-center shadow-2xl shadow-blue-500/20 relative overflow-hidden"
          id="level-up-modal"
        >
          {/* Background Rays */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Level Crown Emblem */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.15 }}
            className="w-20 h-20 mx-auto mb-4 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-amber-300"
          >
            <Crown className="w-10 h-10 text-slate-950 stroke-[2.5]" />
          </motion.div>

          <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
            Milestone Achieved
          </span>

          <h2 className="text-3xl font-extrabold text-white mt-1 tracking-tight font-display">
            LEVEL UP!
          </h2>

          <p className="text-slate-300 text-sm mt-1">
            You reached <strong className="text-blue-400 font-bold">Level {newLevel}</strong>. Your real-world consistency is leveling up your stats!
          </p>

          {/* Rewards Container */}
          <div className="my-5 bg-[#0b162e]/90 border border-blue-900/60 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                Level Reward:
              </span>
              <span className="font-bold text-amber-300 text-base">
                +{formatCoins(coins)} IRL Coins
              </span>
            </div>

            <div className="flex items-center justify-between text-sm border-t border-slate-800/80 pt-2">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Unlock Status:
              </span>
              <span className="font-semibold text-purple-300 text-xs">
                {titleText}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            id="level-up-continue-btn"
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>Claim & Keep Grinding</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
