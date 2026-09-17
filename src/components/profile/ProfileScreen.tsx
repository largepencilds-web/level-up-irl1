import React, { useState } from 'react';
import {
  Trophy,
  Shield,
  Settings,
  Lock,
  Unlock,
  Coins,
  Zap,
  CheckCircle2,
  Calendar,
  Sparkles,
  RotateCcw,
  Edit3,
  Award,
} from 'lucide-react';
import { Achievement, PrivacySettings, StatKey, UserProfile } from '../../types';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { formatCoins, getLevelFromXp, STAT_METADATA } from '../../utils/progression';

interface ProfileScreenProps {
  user: UserProfile;
  achievements: Achievement[];
  onUpdatePrivacy: (newPrivacy: Partial<PrivacySettings>) => void;
  onClaimAchievement: (achievement: Achievement) => void;
  onUpdateProfileInfo: (username: string, bio: string) => void;
  onReplayOnboarding: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  achievements,
  onUpdatePrivacy,
  onClaimAchievement,
  onUpdateProfileInfo,
  onReplayOnboarding,
}) => {
  const [profileTab, setProfileTab] = useState<'overview' | 'achievements' | 'privacy' | 'settings'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editBio, setEditBio] = useState(user.bio);

  const { level, xpInCurrentLevel, xpNeededForNextLevel, progressPercent } =
    getLevelFromXp(user.xp);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfileInfo(editUsername.trim() || user.username, editBio.trim());
    setIsEditingProfile(false);
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-4 pb-24 px-4 pt-3 max-w-lg mx-auto">
      {/* Profile Navigation Tabs */}
      <div className="flex bg-[#0b1329] p-1 rounded-2xl border border-blue-900/40">
        <button
          onClick={() => setProfileTab('overview')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            profileTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setProfileTab('achievements')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            profileTab === 'achievements'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Badges ({unlockedCount})
        </button>

        <button
          onClick={() => setProfileTab('privacy')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            profileTab === 'privacy'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Privacy
        </button>

        <button
          onClick={() => setProfileTab('settings')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            profileTab === 'settings'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Settings
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {profileTab === 'overview' && (
        <div className="space-y-4">
          {/* Hero RPG Character Profile Card */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#0e1c3e] via-[#0a142c] to-[#070d1d] border border-blue-500/30 p-5 shadow-xl shadow-blue-950/40">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-blue-950/80 border-2 border-cyan-400/40 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-md">
                <CharacterAvatar character={user.character} size="lg" animate={true} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-white truncate font-display">
                    {user.username}
                  </h2>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="p-1 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Edit Profile Info"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-bold text-cyan-400 bg-blue-950 px-2 py-0.5 rounded-full border border-blue-800/50">
                    Level {level} {user.title}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2 italic">
                  &ldquo;{user.bio}&rdquo;
                </p>

                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-400" />
                    Joined {user.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* XP progress bar inside card */}
            <div className="mt-4 pt-3 border-t border-blue-900/40">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" /> Progression Level {level}
                </span>
                <span className="font-bold text-cyan-300">
                  {xpInCurrentLevel} / {xpNeededForNextLevel} XP ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-blue-900/60">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Six Attributes Radar / Bars */}
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-3xl p-4 shadow-md">
            <h3 className="text-sm font-bold text-white font-display mb-1">
              Character RPG Attributes
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Numerical points leveled up through real accomplishments.
            </p>

            <div className="space-y-2.5">
              {(Object.keys(STAT_METADATA) as StatKey[]).map((key) => {
                const meta = STAT_METADATA[key];
                const value = user.stats[key] || 0;
                const fill = Math.min(100, Math.max(10, value));

                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-slate-300">{meta.name}</span>
                      <span className="font-extrabold text-white">{value} pts</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${fill}%`, backgroundColor: meta.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Interests & Goals Chips */}
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-3xl p-4 shadow-md">
            <h3 className="text-sm font-bold text-white font-display mb-2">
              Interests &amp; Focus Goals
            </h3>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-blue-950/80 text-cyan-300 border border-blue-800/40"
                >
                  #{interest}
                </span>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
              Target Habits:
            </div>
            <div className="space-y-1">
              {user.initialGoals.map((goal) => (
                <div
                  key={goal}
                  className="flex items-center gap-1.5 text-xs text-slate-300 py-0.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{goal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ACHIEVEMENTS TAB */}
      {profileTab === 'achievements' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                Achievement Showcase
              </h3>
              <p className="text-xs text-slate-400">
                Unlocked {unlockedCount} of {achievements.length} badges.
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2.5">
            {achievements.map((ach) => {
              const isMax = ach.currentProgress >= ach.maxProgress;

              return (
                <div
                  key={ach.id}
                  className={`bg-[#0b1329] border rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all ${
                    ach.unlocked
                      ? 'border-amber-500/40 bg-gradient-to-r from-[#0b1329] to-amber-950/20'
                      : 'border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                        ach.unlocked
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      <Award className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-white">{ach.name}</h4>
                        {ach.unlocked && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Claimed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{ach.description}</p>

                      {/* Progress bar if locked */}
                      {!ach.unlocked && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (ach.currentProgress / ach.maxProgress) * 100
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {ach.currentProgress}/{ach.maxProgress}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-300 mb-1">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      +{ach.coinReward}
                    </div>

                    {!ach.unlocked && isMax && (
                      <button
                        onClick={() => onClaimAchievement(ach)}
                        className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm cursor-pointer"
                      >
                        Claim
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PRIVACY SETTINGS TAB */}
      {profileTab === 'privacy' && (
        <div className="bg-[#0b1329] border border-blue-900/40 rounded-3xl p-4 shadow-md space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Social Privacy Controls</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control what information other adventurers and friends can view on your profile and leaderboards.
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            {[
              {
                key: 'showLevel' as keyof PrivacySettings,
                title: 'Display Character Level',
                desc: 'Allow friends and leaderboards to see your current numerical level.',
              },
              {
                key: 'showXp' as keyof PrivacySettings,
                title: 'Display Experience Points (XP)',
                desc: 'Show lifetime and weekly XP progression counts.',
              },
              {
                key: 'showStats' as keyof PrivacySettings,
                title: 'Display RPG Attributes',
                desc: 'Allow inspection of your Knowledge, Fitness, Mind, and other stats.',
              },
              {
                key: 'showActivities' as keyof PrivacySettings,
                title: 'Display Completed Activities',
                desc: 'Show recent tasks in your friend profile preview.',
              },
              {
                key: 'showAchievements' as keyof PrivacySettings,
                title: 'Display Achievements & Badges',
                desc: 'Show unlocked badges on your public profile.',
              },
              {
                key: 'showCharacter' as keyof PrivacySettings,
                title: 'Display Character & Cosmetics',
                desc: 'Show custom avatar equipment and gear.',
              },
              {
                key: 'showSocialActivity' as keyof PrivacySettings,
                title: 'Publish to Friends Social Feed',
                desc: 'Allow shared achievements and tasks to appear in the activity stream.',
              },
            ].map((setting) => {
              const enabled = user.privacySettings[setting.key];

              return (
                <div
                  key={setting.key}
                  className="flex items-center justify-between gap-3 py-1.5"
                >
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-200 block">
                      {setting.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block leading-tight">
                      {setting.desc}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      onUpdatePrivacy({ [setting.key]: !enabled })
                    }
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                      enabled ? 'bg-blue-600' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SETTINGS & ACCOUNT TAB */}
      {profileTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-3xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white font-display">Account Management</h3>

            <div className="flex items-center justify-between py-2 border-b border-slate-800 text-xs">
              <span className="text-slate-300">Username:</span>
              <span className="font-bold text-white">{user.username}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800 text-xs">
              <span className="text-slate-300">Total Coins:</span>
              <span className="font-bold text-amber-400">{formatCoins(user.irlCoins)} IRL Coins</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800 text-xs">
              <span className="text-slate-300">Active Streak:</span>
              <span className="font-bold text-rose-400">{user.streakDays} Days</span>
            </div>

            <button
              onClick={onReplayOnboarding}
              className="w-full mt-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
              <span>Replay Onboarding Tour</span>
            </button>
          </div>

          <div className="p-4 rounded-3xl bg-blue-950/20 border border-blue-900/30 text-center">
            <span className="text-xs font-bold text-blue-400 block mb-1">
              LEVEL UP IRL • MVP Build 1.0
            </span>
            <p className="text-[11px] text-slate-400">
              Designed for authentic motivation and character growth.
            </p>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0b1329] border border-blue-900/60 rounded-3xl p-5 text-left shadow-2xl">
            <h3 className="text-base font-bold text-white font-display mb-1">
              Edit Adventurer Profile
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Update how your identity appears to your party and friends.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bio / Motto
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-800 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
