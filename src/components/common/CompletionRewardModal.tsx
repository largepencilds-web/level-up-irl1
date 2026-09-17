import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Zap, Coins, Camera, Globe, Lock, X, Upload } from 'lucide-react';
import { Activity, StatKey } from '../../types';
import { STAT_METADATA } from '../../utils/progression';

interface CompletionRewardModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onConfirm?: (payload: {
    photo?: string;
    photoUrl?: string;
    shareToFeed: boolean;
  }) => void;
  onConfirmCompletion?: (payload: {
    photo?: string;
    photoUrl?: string;
    shareToFeed: boolean;
  }) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const CompletionRewardModal: React.FC<CompletionRewardModalProps> = ({
  activity,
  isOpen,
  onConfirm,
  onConfirmCompletion,
  onCancel,
  onClose,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [shareToFeed, setShareToFeed] = useState<boolean>(true);
  const [showPhotoPicker, setShowPhotoPicker] = useState<boolean>(false);

  if (!isOpen || !activity) return null;

  const samplePhotoPresets = [
    {
      label: 'Study desk & notebook',
      url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Running shoes & track',
      url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Musical instruments',
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80',
    },
    {
      label: 'Tea & peaceful book',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = () => {
    const fn = onConfirm || onConfirmCompletion;
    if (typeof fn === 'function') {
      fn({
        photo: photoUrl || undefined,
        photoUrl: photoUrl || undefined,
        shareToFeed,
      });
    }
  };

  const handleClose = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    } else if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          className="w-full max-w-sm bg-gradient-to-b from-[#0e172e] to-[#090e1f] border border-blue-500/40 rounded-3xl p-5 text-left shadow-2xl relative"
          id="completion-reward-modal"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header check icon */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Task Finished
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">
                {activity.title}
              </h3>
            </div>
          </div>

          {/* Rewards Summary Box */}
          <div className="bg-[#0a1226] border border-blue-900/50 rounded-2xl p-3.5 my-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Experience Earned:</span>
              </div>
              <span className="font-extrabold text-cyan-400 text-sm">
                +{activity.xpReward} XP
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Coins Rewarded:</span>
              </div>
              <span className="font-extrabold text-amber-400 text-sm">
                +{activity.coinReward} IRL Coins
              </span>
            </div>

            {/* Stat upgrades */}
            {activity.statRewards && Object.keys(activity.statRewards).length > 0 && (
              <div className="border-t border-slate-800/80 pt-2">
                <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
                  Character Attributes Boosted:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(activity.statRewards).map(([key, boost]) => {
                    const meta = STAT_METADATA[key as StatKey];
                    if (!meta || !boost) return null;
                    return (
                      <span
                        key={key}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ backgroundColor: meta.bgLight, color: meta.color }}
                      >
                        +{boost} {meta.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Optional Photo Attachment */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <span>Optional Proof / Photo</span>
              </label>
              {photoUrl ? (
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="text-[11px] text-rose-400 hover:underline"
                >
                  Remove
                </button>
              ) : (
                <span className="text-[10px] text-slate-400">Optional</span>
              )}
            </div>

            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-blue-500/40 h-28 bg-slate-900">
                <img
                  src={photoUrl}
                  alt="Activity proof"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setShowPhotoPicker(!showPhotoPicker)}
                  className="w-full py-2 px-3 border border-dashed border-slate-700 hover:border-blue-500/60 rounded-xl bg-slate-900/60 text-slate-300 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>Attach photo or pick demo picture</span>
                </button>

                {showPhotoPicker && (
                  <div className="mt-2 p-2 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                    <label className="block text-[11px] text-slate-400">
                      Upload from device:
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="mt-1 block w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                      />
                    </label>

                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Or pick instant sample photo:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {samplePhotoPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPhotoUrl(preset.url);
                            setShowPhotoPicker(false);
                          }}
                          className="text-left text-[11px] p-1.5 rounded-lg bg-slate-800/80 hover:bg-blue-900/40 border border-slate-700/60 text-slate-300 hover:text-white truncate transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sharing Preference Prompt */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              Share this activity?
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShareToFeed(true)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  shareToFeed
                    ? 'bg-blue-600/30 border-blue-500 text-cyan-300 shadow-sm shadow-blue-500/20'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Share with Friends</span>
              </button>

              <button
                type="button"
                onClick={() => setShareToFeed(false)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  !shareToFeed
                    ? 'bg-slate-800 border-slate-600 text-slate-200 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Only Me</span>
              </button>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleComplete}
            id="confirm-activity-completion-btn"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>Confirm & Claim Rewards</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
