import React from 'react';
import { X, Trophy, ShieldAlert, Award, Brain, Flame, Palette, Users, ShieldCheck, Compass } from 'lucide-react';
import { FriendUser, StatKey } from '../../types';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { STAT_METADATA } from '../../utils/progression';

interface FriendProfileModalProps {
  friend: FriendUser | null;
  onClose: () => void;
}

export const FriendProfileModal: React.FC<FriendProfileModalProps> = ({
  friend,
  onClose,
}) => {
  if (!friend) return null;

  const statIcons: Record<StatKey, React.ComponentType<{ className?: string }>> = {
    knowledge: Brain,
    fitness: Flame,
    creativity: Palette,
    social: Users,
    discipline: ShieldCheck,
    mind: Compass,
  };

  const privacy = friend.privacySettings;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-sm bg-[#0a1226] border border-blue-900/60 rounded-3xl p-5 text-left shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Character & Avatar Banner */}
        <div className="flex flex-col items-center text-center pt-2 pb-4 border-b border-slate-800">
          {privacy.showCharacter ? (
            <div className="w-28 h-28 rounded-3xl bg-blue-950/60 border-2 border-blue-500/40 flex items-center justify-center p-1 mb-2 shadow-lg shadow-blue-950/40">
              <CharacterAvatar character={friend.character} size="lg" animate={true} />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-2">
              <ShieldAlert className="w-8 h-8" />
            </div>
          )}

          <h3 className="text-xl font-extrabold text-white font-display">
            {friend.username}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            {privacy.showLevel ? (
              <span className="text-xs font-bold text-cyan-400 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-800/40">
                Level {friend.level}
              </span>
            ) : (
              <span className="text-xs text-slate-500 italic">Level Hidden</span>
            )}

            {privacy.showXp && (
              <span className="text-xs text-slate-400">
                {friend.totalXp} Lifetime XP
              </span>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="my-3 p-3 rounded-2xl bg-[#0e172e] border border-blue-950">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            Recent Accomplishment
          </span>
          <p className="text-xs text-slate-300">
            {privacy.showActivities ? friend.recentActivity : 'Activities set to private by user.'}
          </p>
        </div>

        {/* Six Stats (respecting privacy) */}
        <div className="mb-4">
          <span className="text-xs font-bold text-slate-300 block mb-2">
            Character Attributes
          </span>

          {privacy.showStats ? (
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(STAT_METADATA) as StatKey[]).map((key) => {
                const meta = STAT_METADATA[key];
                const Icon = statIcons[key];
                const val = friend.stats[key] || 0;

                return (
                  <div
                    key={key}
                    className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                      <span className="text-xs text-slate-300">{meta.name}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{val}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900 text-center text-xs text-slate-500 italic">
              Attributes hidden by friend privacy settings.
            </div>
          )}
        </div>

        {/* Achievements count */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Unlocked Badges</span>
          </div>
          <span className="font-bold text-white">
            {privacy.showAchievements ? `${friend.achievementsCount} Achievements` : 'Hidden'}
          </span>
        </div>
      </div>
    </div>
  );
};
