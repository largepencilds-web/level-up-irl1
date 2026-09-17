import React from 'react';
import {
  Flame,
  Coins,
  Zap,
  CheckCircle,
  PlusCircle,
  Users,
  Sparkles,
  Scroll,
  ArrowRight,
  Brain,
  Palette,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { Activity, NavigationTab, StatKey, UserProfile } from '../../types';
import { getLevelFromXp, STAT_METADATA } from '../../utils/progression';
import { CharacterAvatar } from '../character/CharacterAvatar';

interface HomeScreenProps {
  user: UserProfile;
  activities: Activity[];
  onNavigate: (tab: NavigationTab) => void;
  onOpenCreateActivity: () => void;
  onCompleteActivity: (activity: Activity) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  activities,
  onNavigate,
  onOpenCreateActivity,
  onCompleteActivity,
}) => {
  const { level, xpInCurrentLevel, xpNeededForNextLevel, progressPercent } =
    getLevelFromXp(user.xp);

  const statIcons: Record<StatKey, React.ComponentType<{ className?: string }>> = {
    knowledge: Brain,
    fitness: Flame,
    creativity: Palette,
    social: Users,
    discipline: ShieldCheck,
    mind: Compass,
  };

  const activeQuests = activities.filter((a) => a.status === 'available').slice(0, 3);

  return (
    <div className="space-y-5 pb-24 px-4 pt-3 max-w-lg mx-auto">
      {/* Top Hero Progression Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e1b3d] via-[#0c1630] to-[#080e22] border border-blue-500/30 p-5 shadow-xl shadow-blue-950/40">
        {/* Subtle decorative background light */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-1.5">
              <span>Level {level}</span>
              <span className="text-blue-400/60">•</span>
              <span className="text-[11px] font-medium text-slate-300">{user.title}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              {user.username}
            </h1>

            <p className="text-xs text-slate-300 mt-0.5">
              Turn your real day into character XP.
            </p>
          </div>

          {/* Interactive Character Thumbnail Preview */}
          <button
            onClick={() => onNavigate('character')}
            className="group relative cursor-pointer"
            id="home-avatar-preview-btn"
            title="Customize RPG Character"
          >
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-b from-blue-950/80 to-slate-950 border-2 border-blue-500/40 group-hover:border-cyan-400 p-1 transition-all overflow-hidden flex items-center justify-center shadow-lg shadow-blue-950/60">
              <CharacterAvatar character={user.character} size="md" animate={true} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-md shadow-sm">
              EDIT
            </div>
          </button>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-4 pt-3 border-t border-blue-900/40">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              XP to Level {level + 1}
            </span>
            <span className="font-bold text-cyan-300">
              {xpInCurrentLevel} / {xpNeededForNextLevel} XP ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900/90 rounded-full overflow-hidden border border-blue-900/50 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Today's Progress Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Today&apos;s Progress
          </h2>
          <span className="text-[11px] font-semibold text-cyan-400 bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-800/40">
            {user.todayStats.completedCount > 0 ? 'Active Today' : 'Ready to start'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* XP Earned Today */}
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl p-3 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-medium">XP Today</span>
              <div className="p-1 rounded-lg bg-blue-500/10 text-cyan-400">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-extrabold text-white font-display">
              +{user.todayStats.xpEarnedToday}
            </div>
            <span className="text-[10px] text-slate-500">Points earned</span>
          </div>

          {/* IRL Coins Earned Today */}
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl p-3 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Coins Today</span>
              <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
                <Coins className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-extrabold text-amber-300 font-display">
              +{user.todayStats.coinsEarnedToday}
            </div>
            <span className="text-[10px] text-slate-500">Shop currency</span>
          </div>

          {/* Tasks Completed */}
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl p-3 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Completed</span>
              <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-extrabold text-emerald-400 font-display">
              {user.todayStats.completedCount}
            </div>
            <span className="text-[10px] text-slate-500">Activities logged</span>
          </div>

          {/* Current Streak */}
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-2xl p-3 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-medium">Streak</span>
              <div className="p-1 rounded-lg bg-rose-500/10 text-rose-400">
                <Flame className="w-3.5 h-3.5 fill-rose-400" />
              </div>
            </div>
            <div className="text-lg font-extrabold text-rose-400 font-display">
              {user.streakDays} Days
            </div>
            <span className="text-[10px] text-slate-500">Keep flame alive</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={onOpenCreateActivity}
            id="quick-action-add-activity"
            className="flex items-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-blue-950/60 to-[#0e1e40] border border-blue-600/40 hover:border-cyan-400 text-left transition-all active:scale-95 group cursor-pointer shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-blue-500/30">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                Add Activity
              </div>
              <div className="text-[10px] text-slate-400">Log or AI craft</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('quests')}
            id="quick-action-quests"
            className="flex items-center gap-2 p-3 rounded-2xl bg-[#0b1329] border border-blue-900/40 hover:border-blue-500/50 text-left transition-all active:scale-95 group cursor-pointer shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Scroll className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-purple-300">
                View Quests
              </div>
              <div className="text-[10px] text-slate-400">Today &amp; shared</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('friends')}
            id="quick-action-friends"
            className="flex items-center gap-2 p-3 rounded-2xl bg-[#0b1329] border border-blue-900/40 hover:border-blue-500/50 text-left transition-all active:scale-95 group cursor-pointer shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                Friends Feed
              </div>
              <div className="text-[10px] text-slate-400">Social party</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('character')}
            id="quick-action-character"
            className="flex items-center gap-2 p-3 rounded-2xl bg-[#0b1329] border border-blue-900/40 hover:border-blue-500/50 text-left transition-all active:scale-95 group cursor-pointer shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-300">
                Character
              </div>
              <div className="text-[10px] text-slate-400">Gear &amp; Shop</div>
            </div>
          </button>
        </div>
      </div>

      {/* Your Stats Section (Six core RPG attributes) */}
      <div className="bg-[#0a1226] border border-blue-900/40 rounded-3xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-sm font-bold text-white font-display">
              Your RPG Character Attributes
            </h2>
            <p className="text-[11px] text-slate-400">
              Grow six foundational attributes by completing real-world tasks.
            </p>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-0.5"
          >
            <span>Breakdown</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {(Object.keys(STAT_METADATA) as StatKey[]).map((key) => {
            const meta = STAT_METADATA[key];
            const Icon = statIcons[key];
            const statValue = user.stats[key] || 0;
            // Stat rank / percent (out of 100)
            const fillPercent = Math.min(100, Math.max(10, statValue));

            return (
              <div
                key={key}
                className="p-2.5 rounded-2xl bg-[#0f1a38]/80 border border-slate-800/80 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-5 h-5 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: meta.bgLight }}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">{meta.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-white">{statValue}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${fillPercent}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Active Quests Preview */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Available Quests Today
          </h2>
          <button
            onClick={() => onNavigate('quests')}
            className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>See All ({activities.filter((a) => a.status === 'available').length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {activeQuests.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-[#0b1329] border border-dashed border-slate-800">
            <p className="text-xs text-slate-400">All available quests completed today!</p>
            <button
              onClick={onOpenCreateActivity}
              className="mt-2 text-xs font-bold text-cyan-400 hover:underline"
            >
              + Create a new custom quest
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeQuests.map((quest) => (
              <div
                key={quest.id}
                className="bg-[#0b1329] hover:bg-[#0e1834] border border-blue-900/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-colors shadow-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-md bg-blue-950 text-cyan-400 border border-blue-800/40">
                      {quest.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {quest.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white truncate">
                    {quest.title}
                  </h3>

                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-cyan-400 font-semibold">+{quest.xpReward} XP</span>
                    <span className="text-amber-300 font-semibold">+{quest.coinReward} Coins</span>
                  </div>
                </div>

                <button
                  onClick={() => onCompleteActivity(quest)}
                  id={`complete-quest-${quest.id}`}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  Complete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Motivational Bottom Footnote */}
      <div className="text-center p-3 rounded-2xl bg-blue-950/20 border border-blue-900/20">
        <p className="text-xs text-slate-400 italic">
          &ldquo;Every small action counts. Real life is your progression system.&rdquo;
        </p>
      </div>
    </div>
  );
};
