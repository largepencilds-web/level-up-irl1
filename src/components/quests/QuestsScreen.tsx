import React, { useState } from 'react';
import {
  Plus,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Coins,
  Search,
  Filter,
} from 'lucide-react';
import { Activity, FriendUser, StatKey } from '../../types';
import { STAT_METADATA } from '../../utils/progression';

interface QuestsScreenProps {
  activities: Activity[];
  friends: FriendUser[];
  onCompleteActivity: (activity: Activity) => void;
  onOpenCreateActivity: () => void;
  onCreateSharedQuest: (data: {
    title: string;
    description: string;
    durationMinutes: number;
    friendIds: string[];
    stat: StatKey;
  }) => void;
}

export const QuestsScreen: React.FC<QuestsScreenProps> = ({
  activities,
  friends,
  onCompleteActivity,
  onOpenCreateActivity,
  onCreateSharedQuest,
}) => {
  const [tab, setTab] = useState<'today' | 'shared' | 'completed'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSharedQuestModal, setShowSharedQuestModal] = useState(false);

  // New shared quest modal state
  const [sharedTitle, setSharedTitle] = useState('Study sprint together for 30 minutes');
  const [sharedDesc, setSharedDesc] = useState('Work on assignments in a shared Pomodoro block.');
  const [sharedDuration, setSharedDuration] = useState(30);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>(['friend_alex', 'friend_kate']);
  const [sharedStat, setSharedStat] = useState<StatKey>('knowledge');

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (tab === 'today') {
      return act.status === 'available' && !act.isShared;
    }
    if (tab === 'shared') {
      return act.isShared;
    }
    if (tab === 'completed') {
      return act.status === 'completed';
    }
    return true;
  });

  const handleCreateShared = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharedTitle.trim()) return;

    onCreateSharedQuest({
      title: sharedTitle.trim(),
      description: sharedDesc.trim(),
      durationMinutes: sharedDuration,
      friendIds: selectedFriendIds,
      stat: sharedStat,
    });

    setShowSharedQuestModal(false);
  };

  const toggleFriend = (id: string) => {
    if (selectedFriendIds.includes(id)) {
      setSelectedFriendIds(selectedFriendIds.filter((f) => f !== id));
    } else {
      setSelectedFriendIds([...selectedFriendIds, id]);
    }
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-3 max-w-lg mx-auto">
      {/* Top Header & New Quest Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white font-display">Quest Log</h1>
          <p className="text-xs text-slate-400">
            Real-world activities that award XP, Coins, and Stats.
          </p>
        </div>

        <button
          onClick={onOpenCreateActivity}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Quest</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search quests or activities..."
          className="w-full bg-[#0b1329] border border-blue-900/40 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex bg-[#0b1329] p-1 rounded-2xl border border-blue-900/40">
        <button
          onClick={() => setTab('today')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'today'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Today&apos;s Active
        </button>

        <button
          onClick={() => setTab('shared')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            tab === 'shared'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Shared Quests</span>
        </button>

        <button
          onClick={() => setTab('completed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'completed'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Special banner for Shared Quests tab */}
      {tab === 'shared' && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/70 to-indigo-950/60 border border-blue-800/40 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-cyan-300 block">
              Co-op Party Quests
            </span>
            <p className="text-[11px] text-slate-300">
              Study or train together with friends. Everyone earns rewards upon finishing.
            </p>
          </div>
          <button
            onClick={() => setShowSharedQuestModal(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs whitespace-nowrap active:scale-95 transition-all cursor-pointer"
          >
            + Create Shared
          </button>
        </div>
      )}

      {/* Quest Cards List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-3xl bg-[#0b1329] border border-dashed border-slate-800">
            <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">No quests in this view.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {tab === 'completed'
                ? 'Complete your first task to start building your daily log.'
                : tab === 'shared'
                ? 'Create a shared co-op quest to challenge your friends.'
                : 'Create or AI-craft a quest to start earning XP and coins.'}
            </p>
            {tab !== 'completed' && (
              <button
                onClick={onOpenCreateActivity}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white"
              >
                + Add Activity
              </button>
            )}
          </div>
        ) : (
          filteredActivities.map((quest) => {
            const isCompleted = quest.status === 'completed';

            return (
              <div
                key={quest.id}
                className={`bg-[#0b1329] border rounded-3xl p-4 transition-all shadow-md ${
                  isCompleted
                    ? 'border-emerald-900/30 opacity-70'
                    : 'border-blue-900/40 hover:border-blue-500/40'
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-950 text-cyan-400 border border-blue-800/40">
                      {quest.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        quest.difficulty === 'Easy'
                          ? 'bg-emerald-950/60 text-emerald-400'
                          : quest.difficulty === 'Medium'
                          ? 'bg-amber-950/60 text-amber-400'
                          : 'bg-rose-950/60 text-rose-400'
                      }`}
                    >
                      {quest.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>{quest.durationMinutes} min</span>
                  </div>
                </div>

                {/* Quest Title & Description */}
                <h3 className="text-base font-bold text-white">{quest.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {quest.description}
                </p>

                {/* Shared Quest Participants (if co-op) */}
                {quest.isShared && quest.participants && (
                  <div className="my-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Party ({quest.participants.length}):
                    </span>
                    <div className="flex items-center gap-1.5">
                      {quest.participants.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-1 text-[10px] bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700"
                        >
                          <span className="font-semibold text-slate-300">{p.username}</span>
                          {p.completed ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stat Boosts & Rewards Footer */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 text-xs font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-800/40">
                      <Zap className="w-3.5 h-3.5" />
                      <span>+{quest.xpReward} XP</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-800/40">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>+{quest.coinReward} Coins</span>
                    </div>

                    {/* Stat Badges */}
                    {quest.statRewards &&
                      Object.entries(quest.statRewards).map(([key, boost]) => {
                        const meta = STAT_METADATA[key as StatKey];
                        if (!meta || !boost) return null;
                        return (
                          <span
                            key={key}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: meta.bgLight, color: meta.color }}
                          >
                            +{boost} {meta.name}
                          </span>
                        );
                      })}
                  </div>

                  {/* Complete Button or Completed Badge */}
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-800/40">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => onCompleteActivity(quest)}
                      id={`quest-complete-action-${quest.id}`}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Shared Quest Creation Modal */}
      {showSharedQuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-sm bg-[#0b1329] border border-blue-900/60 rounded-3xl p-5 text-left shadow-2xl">
            <h3 className="text-base font-bold text-white font-display mb-1">
              Create Shared Co-op Quest
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Invite friends from your party to complete a goal together.
            </p>

            <form onSubmit={handleCreateShared} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quest Title
                </label>
                <input
                  type="text"
                  required
                  value={sharedTitle}
                  onChange={(e) => setSharedTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={sharedDesc}
                  onChange={(e) => setSharedDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Attribute
                </label>
                <select
                  value={sharedStat}
                  onChange={(e) => setSharedStat(e.target.value as StatKey)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="knowledge">Knowledge (Study / Reading)</option>
                  <option value="fitness">Fitness (Exercise / Running)</option>
                  <option value="creativity">Creativity (Music / Art)</option>
                  <option value="social">Social (Meeting / Call)</option>
                  <option value="discipline">Discipline (Habits)</option>
                  <option value="mind">Mind (Meditation / Clarity)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Friends to Invite
                </label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {friends.map((friend) => (
                    <button
                      type="button"
                      key={friend.id}
                      onClick={() => toggleFriend(friend.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer ${
                        selectedFriendIds.includes(friend.id)
                          ? 'border-blue-500 bg-blue-950/60 text-white font-bold'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400'
                      }`}
                    >
                      <span>{friend.username} (Lv. {friend.level})</span>
                      {selectedFriendIds.includes(friend.id) && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSharedQuestModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-800 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  Create Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
