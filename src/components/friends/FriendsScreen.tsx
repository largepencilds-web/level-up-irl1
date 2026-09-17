import React, { useState } from 'react';
import {
  Users,
  Trophy,
  Flame,
  Heart,
  MessageCircle,
  Search,
  UserPlus,
  Check,
  Zap,
  Coins,
  Crown,
  Share2,
} from 'lucide-react';
import { FriendUser, SocialPost, UserProfile } from '../../types';
import { FriendProfileModal } from './FriendProfileModal';
import { CharacterAvatar } from '../character/CharacterAvatar';
import { formatCoins } from '../../utils/progression';

interface FriendsScreenProps {
  user: UserProfile;
  friends: FriendUser[];
  socialPosts: SocialPost[];
  onLikePost: (postId: string) => void;
  onReactPost: (postId: string, reaction: 'fire' | 'celebrate' | 'muscle' | 'heart') => void;
  onSendFriendRequest: (username: string) => void;
  onAcceptFriendRequest: (friendId: string) => void;
}

export const FriendsScreen: React.FC<FriendsScreenProps> = ({
  user,
  friends,
  socialPosts,
  onLikePost,
  onReactPost,
  onSendFriendRequest,
  onAcceptFriendRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'party' | 'leaderboard'>('feed');
  const [leaderboardType, setLeaderboardType] = useState<'weekly' | 'global'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [addFriendInput, setAddFriendInput] = useState('');
  const [addSuccessMsg, setAddSuccessMsg] = useState('');
  const [inspectedFriend, setInspectedFriend] = useState<FriendUser | null>(null);

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFriendInput.trim()) return;

    onSendFriendRequest(addFriendInput.trim());
    setAddSuccessMsg(`Friend request sent to @${addFriendInput.trim()}!`);
    setAddFriendInput('');
    setTimeout(() => setAddSuccessMsg(''), 3000);
  };

  // Build Leaderboard List
  // Include user and friends
  const leaderboardList = [
    {
      id: user.id,
      username: `${user.username} (You)`,
      level: user.level,
      weeklyXp: user.todayStats.xpEarnedToday * 3 + 420,
      totalXp: user.xp,
      isUser: true,
      character: user.character,
      privacy: user.privacySettings,
    },
    ...friends.map((f) => ({
      id: f.id,
      username: f.username,
      level: f.level,
      weeklyXp: f.weeklyXp,
      totalXp: f.totalXp,
      isUser: false,
      character: f.character,
      privacy: f.privacySettings,
    })),
  ].sort((a, b) => {
    if (leaderboardType === 'weekly') {
      return b.weeklyXp - a.weeklyXp;
    }
    return b.totalXp - a.totalXp;
  });

  return (
    <div className="space-y-4 pb-24 px-4 pt-3 max-w-lg mx-auto">
      {/* Subnavigation Tabs */}
      <div className="flex bg-[#0b1329] p-1 rounded-2xl border border-blue-900/40">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Activity Feed
        </button>

        <button
          onClick={() => setActiveTab('party')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'party'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Party ({friends.length})
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Leaderboard
        </button>
      </div>

      {/* 1. SOCIAL FEED TAB */}
      {activeTab === 'feed' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recent Friend Activities
            </span>
            <span className="text-[11px] text-cyan-400 font-semibold">Live Updates</span>
          </div>

          {socialPosts.map((post) => {
            const friendObj = friends.find((f) => f.id === post.userId);

            return (
              <div
                key={post.id}
                className="bg-[#0b1329] border border-blue-900/40 rounded-3xl p-4 shadow-md transition-all"
              >
                {/* Author Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <button
                    onClick={() => {
                      if (friendObj) setInspectedFriend(friendObj);
                    }}
                    className="flex items-center gap-2.5 text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-600/40 flex items-center justify-center overflow-hidden">
                      {friendObj ? (
                        <CharacterAvatar character={friendObj.character} size="sm" animate={false} />
                      ) : (
                        <span className="font-bold text-xs text-blue-300">
                          {post.username[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                          {post.username}
                        </span>
                        <span className="text-[10px] font-semibold text-cyan-400 bg-blue-950 px-1.5 py-0.2 rounded border border-blue-800/40">
                          Lv. {post.userLevel}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {post.timestamp}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Post Title & Description */}
                <div className="text-left mb-2">
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {post.title}
                  </h4>
                  {post.subtitle && (
                    <p className="text-xs text-slate-300 mt-1">{post.subtitle}</p>
                  )}
                </div>

                {/* Reward Badges if earned */}
                {(post.xpEarned || post.coinsEarned) && (
                  <div className="flex items-center gap-2 my-2">
                    {post.xpEarned && (
                      <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/40 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> +{post.xpEarned} XP
                      </span>
                    )}
                    {post.coinsEarned && (
                      <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/40 flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-400" /> +{post.coinsEarned} Coins
                      </span>
                    )}
                  </div>
                )}

                {/* Optional Attached Photo */}
                {post.photo && (
                  <div className="my-2.5 rounded-2xl overflow-hidden border border-blue-900/40 max-h-56 bg-slate-950">
                    <img
                      src={post.photo}
                      alt="Accomplishment proof"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Interactive Reactions and Like Button */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  {/* Reaction Emojis */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onReactPost(post.id, 'fire')}
                      className={`flex items-center gap-0.5 px-2 py-1 rounded-xl text-xs transition-all cursor-pointer ${
                        post.userReaction === 'fire'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                      title="Fire reaction"
                    >
                      <span>🔥</span>
                      <span className="text-[10px] font-semibold">{post.reactions.fire}</span>
                    </button>

                    <button
                      onClick={() => onReactPost(post.id, 'celebrate')}
                      className={`flex items-center gap-0.5 px-2 py-1 rounded-xl text-xs transition-all cursor-pointer ${
                        post.userReaction === 'celebrate'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                      title="Celebrate reaction"
                    >
                      <span>👏</span>
                      <span className="text-[10px] font-semibold">{post.reactions.celebrate}</span>
                    </button>

                    <button
                      onClick={() => onReactPost(post.id, 'muscle')}
                      className={`flex items-center gap-0.5 px-2 py-1 rounded-xl text-xs transition-all cursor-pointer ${
                        post.userReaction === 'muscle'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                      title="Muscle reaction"
                    >
                      <span>💪</span>
                      <span className="text-[10px] font-semibold">{post.reactions.muscle}</span>
                    </button>
                  </div>

                  {/* Primary Like Heart */}
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      post.hasLiked
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <span>{post.likes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. PARTY / FRIENDS MANAGEMENT TAB */}
      {activeTab === 'party' && (
        <div className="space-y-4">
          {/* Add Friend Form */}
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-3xl p-4">
            <span className="text-xs font-bold text-slate-300 block mb-1">
              Add Adventurer by Username
            </span>
            <form onSubmit={handleAddFriend} className="flex gap-2">
              <input
                type="text"
                value={addFriendInput}
                onChange={(e) => setAddFriendInput(e.target.value)}
                placeholder="Enter username (e.g. Jordan, Riley)..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
            {addSuccessMsg && (
              <p className="text-[11px] text-emerald-400 font-semibold mt-2">
                {addSuccessMsg}
              </p>
            )}
          </div>

          {/* Search friends filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search current party..."
              className="w-full bg-[#0b1329] border border-blue-900/40 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Friends List */}
          <div className="space-y-2.5">
            {friends
              .filter((f) => f.username.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setInspectedFriend(friend)}
                  className="bg-[#0b1329] hover:bg-[#0f1a38] border border-blue-900/40 rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-blue-950 border border-blue-700/40 flex items-center justify-center overflow-hidden">
                        <CharacterAvatar character={friend.character} size="sm" animate={false} />
                      </div>
                      {friend.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0b1329] rounded-full" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white">{friend.username}</h4>
                        <span className="text-[10px] font-bold text-cyan-400 bg-blue-950 px-1.5 py-0.2 rounded border border-blue-800/40">
                          Lv. {friend.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {friend.recentActivity}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-cyan-400 font-semibold text-right">
                    View
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. LEADERBOARDS TAB */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3.5">
          {/* Switch Weekly / Global */}
          <div className="flex bg-[#0b1329] p-1 rounded-xl border border-blue-900/40">
            <button
              onClick={() => setLeaderboardType('weekly')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                leaderboardType === 'weekly'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly Leaderboard
            </button>

            <button
              onClick={() => setLeaderboardType('global')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                leaderboardType === 'global'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Global Lifetime
            </button>
          </div>

          <div className="text-center text-xs text-slate-400">
            {leaderboardType === 'weekly'
              ? 'Rankings reset weekly. Based on XP earned this current week.'
              : 'Lifetime XP cumulative ranking across all activities.'}
          </div>

          {/* Ranking Cards */}
          <div className="space-y-2">
            {leaderboardList.map((entry, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const xpVal = leaderboardType === 'weekly' ? entry.weeklyXp : entry.totalXp;

              // If user or friend hid level/xp in privacy settings
              const displayLevel = entry.privacy.showLevel ? `Lv. ${entry.level}` : 'Hidden';
              const displayXp = entry.privacy.showXp ? `${formatCoins(xpVal)} XP` : 'Hidden';

              return (
                <div
                  key={entry.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    entry.isUser
                      ? 'bg-blue-950/80 border-cyan-400 shadow-md shadow-blue-500/20'
                      : 'bg-[#0b1329] border-blue-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs ${
                        rank === 1
                          ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/30'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rank === 1 ? <Crown className="w-4 h-4" /> : rank}
                    </div>

                    {/* Avatar preview */}
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center">
                      <CharacterAvatar character={entry.character} size="xs" animate={false} />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">
                          {entry.username}
                        </span>
                        <span className="text-[10px] text-cyan-400 bg-blue-950 px-1.5 py-0.2 rounded border border-blue-800/40">
                          {displayLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-xs text-cyan-300 block font-mono">
                      {displayXp}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {leaderboardType === 'weekly' ? 'This week' : 'Total'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inspect Friend Profile Modal */}
      {inspectedFriend && (
        <FriendProfileModal
          friend={inspectedFriend}
          onClose={() => setInspectedFriend(null)}
        />
      )}
    </div>
  );
};
