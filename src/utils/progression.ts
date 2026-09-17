// Level progression utilities for Level Up IRL

/**
 * Progression thresholds:
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 250 XP (+150)
 * Level 4: 450 XP (+200)
 * Level 5: 700 XP (+250)
 * Level 6: 1000 XP (+300)
 * Level 7: 1350 XP (+350)
 * Level 8: 1750 XP (+400)
 * Level 9: 2200 XP (+450)
 * Level 10: 2700 XP (+500)
 */

export function getXpForLevel(level: number): number {
  if (level <= 1) return 0;
  // Formula: 25 * level^2 + 25 * level - 50 -> for level 2: 100, level 3: 250, level 4: 450, level 5: 700
  return 25 * Math.pow(level, 2) + 25 * level - 50;
}

export function getLevelFromXp(totalXp: number): {
  level: number;
  currentLevelBaseXp: number;
  nextLevelXp: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressPercent: number;
} {
  let level = 1;
  while (getXpForLevel(level + 1) <= totalXp) {
    level++;
  }

  const currentLevelBaseXp = getXpForLevel(level);
  const nextLevelXp = getXpForLevel(level + 1);
  const xpInCurrentLevel = Math.max(0, totalXp - currentLevelBaseXp);
  const xpNeededForNextLevel = nextLevelXp - currentLevelBaseXp;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100))
  );

  return {
    level,
    currentLevelBaseXp,
    nextLevelXp,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercent,
  };
}

export function formatCoins(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount);
}

export function getCoinsForLevelUp(newLevel: number): number {
  return 50 + newLevel * 10;
}

export function getTitleForLevel(level: number): string {
  if (level <= 2) return 'Novice Adventurer';
  if (level <= 4) return 'Rising Explorer';
  if (level <= 6) return 'Skillful Adept';
  if (level <= 8) return 'Vanguard Champion';
  if (level <= 10) return 'Ascendant Master';
  return 'Legendary Paragon';
}

export const STAT_METADATA = {
  knowledge: {
    name: 'Knowledge',
    icon: 'Brain',
    color: '#38bdf8', // Cyan Blue
    bgLight: 'rgba(56, 189, 248, 0.15)',
    description: 'Logic, studying, memory, and cognitive growth',
  },
  fitness: {
    name: 'Fitness',
    icon: 'Flame',
    color: '#f97316', // Orange Flame
    bgLight: 'rgba(249, 117, 22, 0.15)',
    description: 'Physical health, stamina, movement, and endurance',
  },
  creativity: {
    name: 'Creativity',
    icon: 'Sparkles',
    color: '#a855f7', // Purple Sparkle
    bgLight: 'rgba(168, 85, 247, 0.15)',
    description: 'Art, music, creative writing, design, and innovation',
  },
  social: {
    name: 'Social',
    icon: 'Users',
    color: '#10b981', // Emerald
    bgLight: 'rgba(16, 185, 129, 0.15)',
    description: 'Friendship, teamwork, empathy, and active listening',
  },
  discipline: {
    name: 'Discipline',
    icon: 'ShieldCheck',
    color: '#3b82f6', // Electric Blue
    bgLight: 'rgba(59, 130, 246, 0.15)',
    description: 'Consistency, habit building, focus, and time mastery',
  },
  mind: {
    name: 'Mind',
    icon: 'Compass',
    color: '#06b6d4', // Teal/Cyan
    bgLight: 'rgba(6, 182, 212, 0.15)',
    description: 'Meditation, mindfulness, mental clarity, and peace',
  },
} as const;

export const RARITY_CONFIG = {
  common: {
    name: 'Common',
    color: '#94a3b8', // Slate
    borderColor: 'border-slate-500/30',
    bg: 'bg-slate-500/10',
    badgeBg: 'bg-slate-700/60',
    textColor: 'text-slate-300',
  },
  rare: {
    name: 'Rare',
    color: '#38bdf8', // Bright Cyan
    borderColor: 'border-sky-500/40',
    bg: 'bg-sky-500/10',
    badgeBg: 'bg-sky-950/80',
    textColor: 'text-sky-400',
  },
  epic: {
    name: 'Epic',
    color: '#c084fc', // Purple
    borderColor: 'border-purple-500/40',
    bg: 'bg-purple-500/10',
    badgeBg: 'bg-purple-950/80',
    textColor: 'text-purple-300',
  },
  legendary: {
    name: 'Legendary',
    color: '#fbbf24', // Amber/Gold
    borderColor: 'border-amber-500/50',
    bg: 'bg-amber-500/15',
    badgeBg: 'bg-amber-950/80',
    textColor: 'text-amber-300',
  },
} as const;
