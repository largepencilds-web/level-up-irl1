import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Check, PackageOpen } from 'lucide-react';
import { CaseRewardBox, CosmeticItem } from '../../types';
import { RARITY_CONFIG } from '../../utils/progression';

interface CaseOpeningModalProps {
  isOpen: boolean;
  caseBox: CaseRewardBox | null;
  allItems: CosmeticItem[];
  userCoins: number;
  onOpenCase: (caseBox: CaseRewardBox, wonItem: CosmeticItem) => void;
  onClose: () => void;
}

export const CaseOpeningModal: React.FC<CaseOpeningModalProps> = ({
  isOpen,
  caseBox,
  allItems,
  userCoins,
  onOpenCase,
  onClose,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<CosmeticItem | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsOpening(false);
      setWonItem(null);
    }
  }, [isOpen]);

  if (!isOpen || !caseBox) return null;

  const handleStartOpen = () => {
    if (userCoins < caseBox.price || isOpening) return;

    setIsOpening(true);
    setWonItem(null);

    // Weighted random selection
    const totalWeight = caseBox.items.reduce((acc, curr) => acc + curr.weight, 0);
    const randomVal = Math.random() * totalWeight;

    let cumulative = 0;
    let selectedId = caseBox.items[0].itemId;

    for (const item of caseBox.items) {
      cumulative += item.weight;
      if (randomVal <= cumulative) {
        selectedId = item.itemId;
        break;
      }
    }

    const itemObj = allItems.find((i) => i.id === selectedId) || allItems[0];

    // Simulate suspense spin
    setTimeout(() => {
      setWonItem(itemObj);
      setIsOpening(false);
      onOpenCase(caseBox, itemObj);

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#38bdf8', '#c084fc', '#fbbf24'],
        });
      } catch {
        // Safe fallback
      }
    }, 1800);
  };

  const rarity = wonItem ? RARITY_CONFIG[wonItem.rarity] : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-[#0a1226] border border-blue-900/80 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden"
          id="case-opening-modal"
        >
          <button
            onClick={onClose}
            disabled={isOpening}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 disabled:opacity-30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {!wonItem ? (
            <>
              {/* Case Hero Icon */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-blue-950 to-indigo-950 border-2 border-blue-500/40 flex items-center justify-center shadow-xl shadow-blue-900/30 relative">
                {isOpening ? (
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -15, 15, 0], scale: [1, 1.1, 1.15, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="text-cyan-400"
                  >
                    <PackageOpen className="w-12 h-12" />
                  </motion.div>
                ) : (
                  <Sparkles
                    className="w-12 h-12"
                    style={{ color: caseBox.accentColor }}
                  />
                )}
              </div>

              <h3 className="text-xl font-extrabold text-white font-display">
                {caseBox.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 px-4">
                {caseBox.description}
              </p>

              {/* Possible Drops Pool & Odds */}
              <div className="mt-4 mb-5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Possible Rewards &amp; Odds
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {caseBox.items.map((drop) => {
                    const itm = allItems.find((i) => i.id === drop.itemId);
                    const r = RARITY_CONFIG[drop.rarity];
                    return (
                      <div
                        key={drop.itemId}
                        className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0"
                      >
                        <span className="font-medium text-slate-300 truncate max-w-[170px]">
                          {itm ? itm.name : drop.itemId}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${r.badgeBg} ${r.textColor}`}
                          >
                            {r.name}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {drop.weight}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Unlock Action Button */}
              <button
                onClick={handleStartOpen}
                disabled={isOpening || userCoins < caseBox.price}
                id="unlock-case-btn"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                {isOpening ? (
                  <span>Cracking Seal...</span>
                ) : (
                  <span>Open for {caseBox.price} IRL Coins</span>
                )}
              </button>

              {userCoins < caseBox.price && (
                <p className="text-[11px] text-rose-400 mt-2">
                  Need {caseBox.price - userCoins} more Coins. Complete tasks to earn more!
                </p>
              )}
            </>
          ) : (
            /* Item Won Reveal Screen */
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-2"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                <Check className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
                Reward Unlocked!
              </span>

              <h3 className="text-2xl font-black text-white mt-1 font-display">
                {wonItem.name}
              </h3>

              {rarity && (
                <span
                  className={`inline-block text-xs font-extrabold px-3 py-0.5 rounded-full mt-1.5 ${rarity.badgeBg} ${rarity.textColor} border border-current`}
                >
                  {rarity.name} • {wonItem.category.toUpperCase()}
                </span>
              )}

              <p className="text-xs text-slate-300 mt-2 px-2">
                {wonItem.description}
              </p>

              <div className="mt-5 p-3 rounded-2xl bg-slate-900/90 border border-blue-900/40 text-xs text-slate-300">
                Added to your Character Wardrobe inventory!
              </div>

              <button
                onClick={onClose}
                className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Equip in Wardrobe
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
