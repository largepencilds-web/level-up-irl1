import React from 'react';
import { Flame, Coins } from 'lucide-react';
import { UserProfile } from '../../types';
import { formatCoins, getLevelFromXp } from '../../utils/progression';
import { CharacterAvatar } from '../character/CharacterAvatar';

interface HeaderProps {
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenShop: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenProfile,
  onOpenShop,
}) => {
  const { level, progressPercent } = getLevelFromXp(user.xp);

  return (
    <header className="sticky top-0 z-30 bg-[#0b1329]/95 backdrop-blur-md border-b border-blue-900/30 px-4 py-2.5 transition-all">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        {/* User Identity & Level */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          id="header-user-profile-btn"
          aria-label="View user profile"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/40 p-0.5 overflow-hidden flex items-center justify-center">
              <CharacterAvatar character={user.character} size="sm" animate={false} />
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] font-bold text-white px-1.5 py-0.2 rounded-full border border-blue-400/50 shadow-sm">
              {level}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                {user.username}
              </span>
              <div className="flex items-center text-amber-400 text-[11px] font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                <Flame className="w-3 h-3 fill-amber-400 mr-0.5" />
                <span>{user.streakDays}d</span>
              </div>
            </div>

            {/* XP mini bar */}
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </button>

        {/* IRL Coins pill & Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-yellow-500/10 hover:from-amber-500/25 hover:to-yellow-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-300 font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
            id="header-coins-btn"
            title="Open Cosmetic Shop"
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="tracking-tight">{formatCoins(user.irlCoins)}</span>
            <span className="text-[10px] font-semibold text-amber-400/70 hidden sm:inline">IRL</span>
          </button>
        </div>
      </div>
    </header>
  );
};
