export type StatKey = 'knowledge' | 'fitness' | 'creativity' | 'social' | 'discipline' | 'mind';

export interface StatInfo {
  key: StatKey;
  name: string;
  value: number; // 0 - 100+
  icon: string;
  color: string;
  bgLight: string;
  description: string;
}

export type CosmeticCategory = 'hair' | 'top' | 'pants' | 'shoes' | 'accessory' | 'eyes';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CosmeticItem {
  id: string;
  name: string;
  category: CosmeticCategory;
  rarity: ItemRarity;
  price: number; // in IRL Coins
  description: string;
  svgVariant: string; // Identifier for visual rendering
  colorAccent?: string;
  source: 'shop' | 'case' | 'quest' | 'starter';
  isLimited?: boolean;
}

export interface CharacterAppearance {
  skinTone: string; // hex code
  hairStyle: string; // 'short_neat' | 'undercut' | 'ponytail' | 'curly' | 'spiky' | 'braids' | 'wavy_long'
  hairColor: string; // hex code
  eyesStyle?: string; // 'focused' | 'cheerful' | 'sharp' | 'cool'
  eyeStyle?: string;
  topStyle: string; // 'starter_tee' | 'hoodie' | 'athletic_jacket' | 'cyber_vest' | 'denim_jacket' | 'mage_robe'
  pantsStyle: string; // 'cargo_dark' | 'joggers' | 'denim_jeans' | 'shorts' | 'cyber_pants'
  shoesStyle: string; // 'sneakers_white' | 'combat_boots' | 'runners_neon' | 'high_tops'
  accessoryStyle: string; // 'none' | 'wireless_headphones' | 'cool_shades' | 'cyber_visor' | 'cat_ears' | 'gaming_headset' | 'champion_cape'
  auraStyle?: string; // 'none' | 'blue_sparkle' | 'cosmic' | 'golden'
}

export interface PrivacySettings {
  showLevel: boolean;
  showXp: boolean;
  showStats: boolean;
  showActivities: boolean;
  showAchievements: boolean;
  showCharacter: boolean;
  showSocialActivity: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  title: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  irlCoins: number;
  streakDays: number;
  stats: Record<StatKey, number>;
  character: CharacterAppearance;
  ownedItemIds: string[];
  privacySettings: PrivacySettings;
  interests: string[];
  initialGoals: string[];
  bio: string;
  joinedDate: string;
  todayStats: {
    xpEarnedToday: number;
    coinsEarnedToday: number;
    completedCount: number;
    lastActiveDate: string;
  };
}

export type ActivityCategory = 'study' | 'fitness' | 'creativity' | 'social' | 'discipline' | 'mind' | 'personal';

export interface Activity {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: ActivityCategory;
  durationMinutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  coinReward: number;
  statRewards: Partial<Record<StatKey, number>>;
  completedAt?: string;
  photo?: string;
  visibility: 'friends' | 'private';
  status: 'available' | 'completed';
  isShared?: boolean;
  sharedWithFriends?: string[];
  participants?: {
    id: string;
    username: string;
    avatar?: string;
    completed: boolean;
  }[];
}

export interface CaseRewardBox {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  accentColor: string;
  items: {
    itemId: string;
    weight: number; // For probability calculation
    rarity: ItemRarity;
  }[];
}

export interface SocialPost {
  id: string;
  userId: string;
  username: string;
  userLevel: number;
  userAvatar?: string;
  type?: 'activity_completed' | 'item_unlocked' | 'streak_milestone' | 'level_up';
  activityTitle?: string;
  title: string;
  subtitle?: string;
  xpEarned?: number;
  coinsEarned?: number;
  statRewards?: Partial<Record<StatKey, number>>;
  photo?: string;
  timestamp: string;
  likes: number;
  hasLiked: boolean;
  reactions: {
    fire: number;
    celebrate: number;
    muscle: number;
    heart: number;
  };
  userReaction?: string;
}

export interface FriendUser {
  id: string;
  username: string;
  title?: string;
  level: number;
  avatar: string;
  character: CharacterAppearance;
  stats: Record<StatKey, number>;
  equippedItems: CosmeticItem[];
  achievementsCount: number;
  recentActivity: string;
  weeklyXp: number;
  totalXp: number;
  streakDays?: number;
  isOnline: boolean;
  friendshipStatus: 'friend' | 'pending_sent' | 'pending_received';
  privacySettings: PrivacySettings;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'progression' | 'social' | 'stats' | 'habits';
  unlocked: boolean;
  unlockedAt?: string;
  currentProgress: number;
  maxProgress: number;
  coinReward: number;
}

export type NavigationTab = 'home' | 'friends' | 'quests' | 'character' | 'profile';
