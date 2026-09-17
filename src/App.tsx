import React, { useState, useEffect } from 'react';
import {
  Activity,
  CaseRewardBox,
  CharacterAppearance,
  CosmeticItem,
  FriendUser,
  NavigationTab,
  PrivacySettings,
  SocialPost,
  StatKey,
  UserProfile,
} from './types';
import {
  INITIAL_ACHIEVEMENTS,
  INITIAL_ACTIVITIES,
  INITIAL_CASES,
  INITIAL_COSMETICS,
  INITIAL_FRIENDS,
  INITIAL_SOCIAL_POSTS,
  DEFAULT_USER,
} from './data/initialData';
import { getLevelFromXp, getTitleForLevel } from './utils/progression';

// Components
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LevelUpModal } from './components/common/LevelUpModal';
import { CompletionRewardModal } from './components/common/CompletionRewardModal';

// Screens
import { HomeScreen } from './components/home/HomeScreen';
import { CreateActivityModal } from './components/home/CreateActivityModal';
import { CharacterScreen } from './components/character/CharacterScreen';
import { QuestsScreen } from './components/quests/QuestsScreen';
import { FriendsScreen } from './components/friends/FriendsScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';

const STORAGE_KEY = 'level_up_irl_app_state_v1';

export default function App() {
  // Primary state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_activities');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [friends, setFriends] = useState<FriendUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_friends');
      return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
    } catch {
      return INITIAL_FRIENDS;
    }
  });

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_posts');
      return saved ? JSON.parse(saved) : INITIAL_SOCIAL_POSTS;
    } catch {
      return INITIAL_SOCIAL_POSTS;
    }
  });

  const [achievements, setAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_achievements');
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const [cosmetics] = useState<CosmeticItem[]>(INITIAL_COSMETICS);
  const [cases] = useState<CaseRewardBox[]>(INITIAL_CASES);

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_onboarding');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Modals state
  const [isCreateActivityOpen, setIsCreateActivityOpen] = useState(false);
  const [pendingCompleteActivity, setPendingCompleteActivity] = useState<Activity | null>(null);
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number;
    newTitle: string;
    coinsAwarded: number;
  } | null>(null);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_user', JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY + '_activities', JSON.stringify(activities));
      localStorage.setItem(STORAGE_KEY + '_friends', JSON.stringify(friends));
      localStorage.setItem(STORAGE_KEY + '_posts', JSON.stringify(socialPosts));
      localStorage.setItem(STORAGE_KEY + '_achievements', JSON.stringify(achievements));
      localStorage.setItem(STORAGE_KEY + '_onboarding', String(hasCompletedOnboarding));
    } catch {
      // Storage quota or restriction fallback
    }
  }, [user, activities, friends, socialPosts, achievements, hasCompletedOnboarding]);

  // Handle Onboarding Completion
  const handleOnboardingComplete = (data: {
    username: string;
    character: CharacterAppearance;
    interests: string[];
    initialGoals: string[];
  }) => {
    const updatedUser: UserProfile = {
      ...user,
      username: data.username,
      character: data.character,
      interests: data.interests,
      initialGoals: data.initialGoals,
      xp: user.xp + 50,
      irlCoins: user.irlCoins + 75,
      level: getLevelFromXp(user.xp + 50).level,
      todayStats: {
        ...user.todayStats,
        xpEarnedToday: user.todayStats.xpEarnedToday + 50,
        coinsEarnedToday: user.todayStats.coinsEarnedToday + 75,
      },
    };

    setUser(updatedUser);
    setHasCompletedOnboarding(true);
    setActiveTab('home');
  };

  // Replay Onboarding
  const handleReplayOnboarding = () => {
    setHasCompletedOnboarding(false);
  };

  // Open Quest Completion modal
  const handleTriggerCompleteActivity = (activity: Activity) => {
    setPendingCompleteActivity(activity);
  };

  // Finalize Activity Completion with rewards and feed post
  const handleFinalizeActivityCompletion = (data: {
    note?: string;
    photoUrl?: string;
    shareToFeed: boolean;
  }) => {
    if (!pendingCompleteActivity) return;
    const act = pendingCompleteActivity;

    const oldLevel = getLevelFromXp(user.xp).level;
    const newTotalXp = user.xp + act.xpReward;
    const { level: newLevel } = getLevelFromXp(newTotalXp);
    const newTitle = getTitleForLevel(newLevel);

    // Update stats
    const updatedStats = { ...user.stats };
    if (act.statRewards) {
      Object.entries(act.statRewards).forEach(([key, boost]) => {
        const statKey = key as StatKey;
        updatedStats[statKey] = (updatedStats[statKey] || 0) + (boost || 0);
      });
    }

    const coinBonus = act.coinReward;
    const levelUpCoinReward = newLevel > oldLevel ? (newLevel - oldLevel) * 50 : 0;
    const totalCoinsEarned = coinBonus + levelUpCoinReward;

    // Update user object
    const updatedUser: UserProfile = {
      ...user,
      xp: newTotalXp,
      level: newLevel,
      title: newTitle,
      irlCoins: user.irlCoins + totalCoinsEarned,
      stats: updatedStats,
      todayStats: {
        xpEarnedToday: user.todayStats.xpEarnedToday + act.xpReward,
        coinsEarnedToday: user.todayStats.coinsEarnedToday + totalCoinsEarned,
        completedCount: user.todayStats.completedCount + 1,
      },
    };
    setUser(updatedUser);

    // Update activities list to mark completed
    setActivities((prev) =>
      prev.map((a) => (a.id === act.id ? { ...a, status: 'completed' as const } : a))
    );

    // Check achievement progress
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === 'first_step') {
          return { ...ach, currentProgress: 1, unlocked: true };
        }
        if (ach.id === 'reach_level_5' && newLevel >= 5) {
          return { ...ach, currentProgress: newLevel, unlocked: true };
        }
        if (ach.id === 'shared_champ' && act.isShared) {
          return { ...ach, currentProgress: 1, unlocked: true };
        }
        return ach;
      })
    );

    // Post to feed if requested
    if (data.shareToFeed) {
      const newPost: SocialPost = {
        id: `post_${Date.now()}`,
        userId: user.id,
        username: user.username,
        userLevel: newLevel,
        activityTitle: act.title,
        title: `Completed: ${act.title}`,
        subtitle: data.note || act.description,
        photo: data.photoUrl,
        timestamp: 'Just now',
        xpEarned: act.xpReward,
        coinsEarned: act.coinReward,
        likes: 0,
        reactions: { fire: 1, celebrate: 1, muscle: 0, heart: 0 },
        hasLiked: false,
      };
      setSocialPosts((prev) => [newPost, ...prev]);
    }

    // Trigger level up modal if leveled up
    if (newLevel > oldLevel) {
      setTimeout(() => {
        setLevelUpData({
          newLevel,
          newTitle,
          coinsAwarded: levelUpCoinReward,
        });
      }, 300);
    }

    setPendingCompleteActivity(null);
  };

  // Create Custom Activity
  const handleCreateActivity = (
    newActData: Omit<Activity, 'id' | 'creatorId' | 'status'>
  ) => {
    const newActivity: Activity = {
      ...newActData,
      id: `custom_act_${Date.now()}`,
      creatorId: user.id,
      status: 'available',
    };

    setActivities((prev) => [newActivity, ...prev]);
  };

  // Create Shared Co-op Quest
  const handleCreateSharedQuest = (data: {
    title: string;
    description: string;
    durationMinutes: number;
    friendIds: string[];
    stat: StatKey;
  }) => {
    const participants = [
      { id: user.id, username: user.username, completed: false },
      ...data.friendIds.map((fId) => {
        const friend = friends.find((f) => f.id === fId);
        return {
          id: fId,
          username: friend ? friend.username : 'Friend',
          completed: false,
        };
      }),
    ];

    const newSharedAct: Activity = {
      id: `shared_act_${Date.now()}`,
      title: data.title,
      description: data.description,
      category: 'social',
      durationMinutes: data.durationMinutes,
      difficulty: 'Medium',
      xpReward: 120,
      coinReward: 35,
      statRewards: { [data.stat]: 15, social: 10 },
      isShared: true,
      participants,
      creatorId: user.id,
      status: 'available',
      visibility: 'friends',
    };

    setActivities((prev) => [newSharedAct, ...prev]);
  };

  // Character appearance update
  const handleUpdateCharacter = (newAppearance: Partial<CharacterAppearance>) => {
    setUser((prev) => ({
      ...prev,
      character: {
        ...prev.character,
        ...newAppearance,
      },
    }));
  };

  // Buy item from cosmetic shop
  const handleBuyCosmeticItem = (item: CosmeticItem) => {
    if (user.irlCoins < item.price || user.ownedItemIds.includes(item.id)) return;

    setUser((prev) => {
      const newOwned = [...prev.ownedItemIds, item.id];
      const newCoins = prev.irlCoins - item.price;

      // Equip immediately for smooth user UX
      const updatedAppearance = { ...prev.character };
      if (item.category === 'hair') updatedAppearance.hairStyle = item.svgVariant;
      if (item.category === 'top') updatedAppearance.topStyle = item.svgVariant;
      if (item.category === 'pants') updatedAppearance.pantsStyle = item.svgVariant;
      if (item.category === 'shoes') updatedAppearance.shoesStyle = item.svgVariant;
      if (item.category === 'accessory') updatedAppearance.accessoryStyle = item.svgVariant;

      return {
        ...prev,
        irlCoins: newCoins,
        ownedItemIds: newOwned,
        character: updatedAppearance,
      };
    });

    // Check collector achievement
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === 'collector') {
          const count = user.ownedItemIds.length + 1;
          return {
            ...ach,
            currentProgress: count,
            unlocked: count >= ach.maxProgress,
          };
        }
        return ach;
      })
    );
  };

  // Open Mystery Case Reward Result
  const handleOpenCaseResult = (caseBox: CaseRewardBox, wonItem: CosmeticItem) => {
    setUser((prev) => {
      const newOwned = prev.ownedItemIds.includes(wonItem.id)
        ? prev.ownedItemIds
        : [...prev.ownedItemIds, wonItem.id];
      const newCoins = Math.max(0, prev.irlCoins - caseBox.price);

      const updatedAppearance = { ...prev.character };
      if (wonItem.category === 'hair') updatedAppearance.hairStyle = wonItem.svgVariant;
      if (wonItem.category === 'top') updatedAppearance.topStyle = wonItem.svgVariant;
      if (wonItem.category === 'pants') updatedAppearance.pantsStyle = wonItem.svgVariant;
      if (wonItem.category === 'shoes') updatedAppearance.shoesStyle = wonItem.svgVariant;
      if (wonItem.category === 'accessory') updatedAppearance.accessoryStyle = wonItem.svgVariant;

      return {
        ...prev,
        irlCoins: newCoins,
        ownedItemIds: newOwned,
        character: updatedAppearance,
      };
    });
  };

  // Social interactions
  const handleLikePost = (postId: string) => {
    setSocialPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked,
            likes: hasLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const handleReactPost = (
    postId: string,
    reaction: 'fire' | 'celebrate' | 'muscle' | 'heart'
  ) => {
    setSocialPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isSame = p.userReaction === reaction;
          const currentCount = p.reactions[reaction] || 0;
          return {
            ...p,
            userReaction: isSame ? undefined : reaction,
            reactions: {
              ...p.reactions,
              [reaction]: isSame ? Math.max(0, currentCount - 1) : currentCount + 1,
            },
          };
        }
        return p;
      })
    );
  };

  const handleSendFriendRequest = (friendUsername: string) => {
    const newFriend: FriendUser = {
      id: `friend_${Date.now()}`,
      username: friendUsername,
      level: 3,
      title: 'Apprentice Adventurer',
      character: {
        skinTone: '#ffd1aa',
        hairStyle: 'short_spiky',
        hairColor: '#0f172a',
        eyeStyle: 'neutral',
        topStyle: 'tshirt_blue',
        pantsStyle: 'jeans_dark',
        shoesStyle: 'sneakers_cyan',
        accessoryStyle: 'none',
      },
      stats: {
        knowledge: 25,
        fitness: 20,
        creativity: 15,
        social: 20,
        discipline: 22,
        mind: 18,
      },
      streakDays: 4,
      weeklyXp: 310,
      totalXp: 680,
      recentActivity: 'Joined your party via invite',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      equippedItems: [],
      friendshipStatus: 'friend',
      isOnline: true,
      achievementsCount: 2,
      privacySettings: {
        showLevel: true,
        showXp: true,
        showStats: true,
        showActivities: true,
        showAchievements: true,
        showCharacter: true,
        showSocialActivity: true,
      },
    };

    setFriends((prev) => [newFriend, ...prev]);

    // Social player achievement
    setAchievements((prev) =>
      prev.map((ach) => (ach.id === 'social_butterfly' ? { ...ach, unlocked: true } : ach))
    );
  };

  // Privacy update
  const handleUpdatePrivacy = (newPrivacy: Partial<PrivacySettings>) => {
    setUser((prev) => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        ...newPrivacy,
      },
    }));
  };

  // Claim achievement
  const handleClaimAchievement = (ach: any) => {
    setUser((prev) => ({
      ...prev,
      irlCoins: prev.irlCoins + ach.coinReward,
    }));

    setAchievements((prev) =>
      prev.map((a) => (a.id === ach.id ? { ...a, unlocked: true } : a))
    );
  };

  // Update profile bio/username
  const handleUpdateProfileInfo = (newUsername: string, newBio: string) => {
    setUser((prev) => ({
      ...prev,
      username: newUsername,
      bio: newBio,
    }));
  };

  return (
    <div className="min-h-screen bg-[#070d1d] text-slate-100 flex flex-col antialiased selection:bg-blue-500 selection:text-white font-sans">
      {/* Onboarding Overlay */}
      {!hasCompletedOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {/* Main App Layout */}
      <div className="w-full flex-1 flex flex-col max-w-md mx-auto relative">
        {/* Top Header */}
        <Header user={user} onProfileClick={() => setActiveTab('profile')} />

        {/* View Router */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeScreen
              user={user}
              activities={activities}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenCreateActivity={() => setIsCreateActivityOpen(true)}
              onCompleteActivity={handleTriggerCompleteActivity}
            />
          )}

          {activeTab === 'friends' && (
            <FriendsScreen
              user={user}
              friends={friends}
              socialPosts={socialPosts}
              onLikePost={handleLikePost}
              onReactPost={handleReactPost}
              onSendFriendRequest={handleSendFriendRequest}
              onAcceptFriendRequest={() => {}}
            />
          )}

          {activeTab === 'quests' && (
            <QuestsScreen
              activities={activities}
              friends={friends}
              onCompleteActivity={handleTriggerCompleteActivity}
              onOpenCreateActivity={() => setIsCreateActivityOpen(true)}
              onCreateSharedQuest={handleCreateSharedQuest}
            />
          )}

          {activeTab === 'character' && (
            <CharacterScreen
              user={user}
              cosmetics={cosmetics}
              cases={cases}
              onUpdateCharacter={handleUpdateCharacter}
              onBuyItem={handleBuyCosmeticItem}
              onOpenCaseResult={handleOpenCaseResult}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              user={user}
              achievements={achievements}
              onUpdatePrivacy={handleUpdatePrivacy}
              onClaimAchievement={handleClaimAchievement}
              onUpdateProfileInfo={handleUpdateProfileInfo}
              onReplayOnboarding={handleReplayOnboarding}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
      </div>

      {/* Create Activity / Quest Modal with AI Assistant */}
      <CreateActivityModal
        isOpen={isCreateActivityOpen}
        onClose={() => setIsCreateActivityOpen(false)}
        onCreate={handleCreateActivity}
      />

      {/* Complete Quest / Activity Reward Modal with Photo Upload & Feed Sharing */}
      {pendingCompleteActivity && (
        <CompletionRewardModal
          isOpen={!!pendingCompleteActivity}
          activity={pendingCompleteActivity}
          onClose={() => setPendingCompleteActivity(null)}
          onCancel={() => setPendingCompleteActivity(null)}
          onConfirm={handleFinalizeActivityCompletion}
          onConfirmCompletion={handleFinalizeActivityCompletion}
        />
      )}

      {/* Level Up Celebration Modal */}
      {levelUpData && (
        <LevelUpModal
          isOpen={!!levelUpData}
          newLevel={levelUpData.newLevel}
          newTitle={levelUpData.newTitle}
          coinsAwarded={levelUpData.coinsAwarded}
          onClose={() => setLevelUpData(null)}
        />
      )}
    </div>
  );
}
