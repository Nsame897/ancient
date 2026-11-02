import React from 'react';
import { MessageSquare, Radio, Users, Phone, Settings, ShieldAlert } from 'lucide-react';
import { NavigationTab } from '../../types/chatnova';

interface TabBarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  unreadMessagesCount: number;
  unreadStatusCount: number;
  missedCallsCount: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  unreadMessagesCount,
  unreadStatusCount,
  missedCallsCount,
}) => {
  const tabs = [
    {
      id: 'chats' as NavigationTab,
      label: 'Chats',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
    {
      id: 'status' as NavigationTab,
      label: 'Status',
      icon: Radio,
      badge: unreadStatusCount > 0 ? unreadStatusCount : null,
    },
    {
      id: 'communities' as NavigationTab,
      label: 'Communities',
      icon: Users,
      badge: null,
    },
    {
      id: 'calls' as NavigationTab,
      label: 'Calls',
      icon: Phone,
      badge: missedCallsCount > 0 ? missedCallsCount : null,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070709]/95 backdrop-blur-xl border-t border-[#1E1E26] shadow-2xl safe-area-pb">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 transition-all group cursor-pointer"
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-violet-400 scale-110'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {tab.badge !== null && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center tabular-nums shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-violet-400 font-semibold' : 'text-slate-500 group-hover:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-violet-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
