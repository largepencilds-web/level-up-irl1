import React from 'react';
import { Home, Users, ScrollText, UserCircle2, Sparkles } from 'lucide-react';
import { NavigationTab } from '../../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const tabs = [
    {
      id: 'home' as NavigationTab,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'friends' as NavigationTab,
      label: 'Friends',
      icon: Users,
    },
    {
      id: 'quests' as NavigationTab,
      label: 'Quests',
      icon: ScrollText,
      badge: 'New',
    },
    {
      id: 'character' as NavigationTab,
      label: 'Character',
      icon: Sparkles,
    },
    {
      id: 'profile' as NavigationTab,
      label: 'Profile',
      icon: UserCircle2,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080e21]/95 backdrop-blur-xl border-t border-blue-900/40 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              id={`nav-tab-${tab.id}`}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative group cursor-pointer ${
                isActive
                  ? 'text-blue-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              {/* Active Indicator bar */}
              {isActive && (
                <div className="absolute -top-1.5 w-8 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              )}

              <div className="relative p-1">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-cyan-400' : 'group-hover:scale-105'
                  }`}
                />
                {tab.badge && !isActive && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                )}
              </div>

              <span className="text-[11px] tracking-tight leading-none mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
