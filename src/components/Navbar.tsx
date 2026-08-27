import React from 'react';
import { Home, FileText, Folder, Settings, ShieldCheck, ArrowRight } from 'lucide-react';
import { NavTab } from '../types';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNavBar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: <Home className="w-5 h-5" /> },
    { id: 'documents', label: 'المستندات', icon: <FileText className="w-5 h-5" /> },
    { id: 'categories', label: 'التصنيفات', icon: <Folder className="w-5 h-5" /> },
    { id: 'settings', label: 'الإعدادات', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121c1c]/95 backdrop-blur-md border-t border-[#dce5e5] dark:border-[#1e2d2d] pb-safe shadow-lg shadow-black/5">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#004f4f] dark:text-[#bfeaea] font-bold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-[#004f4f] dark:hover:text-[#bfeaea]'
              }`}
            >
              <div
                className={`flex items-center justify-center w-12 h-7 rounded-full mb-1 transition-all ${
                  isActive
                    ? 'bg-[#d3e8e8] dark:bg-[#004f4f] text-[#004f4f] dark:text-[#bfeaea] scale-105'
                    : 'bg-transparent'
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[11px] leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const TopHeader: React.FC<{
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}> = ({ title = 'مستنداتي', subtitle, showBack, onBack, rightAction }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#121c1c]/90 backdrop-blur-md border-b border-[#dce5e5] dark:border-[#1e2d2d] px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="p-2 -mr-1 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-[#f0f4f4] dark:hover:bg-[#1a2626] active:scale-95 transition-transform cursor-pointer"
              title="رجوع"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-base sm:text-lg font-black text-[#191c1c] dark:text-white flex items-center gap-2">
              <span>{title}</span>
            </h1>
            {subtitle && (
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">{subtitle}</p>
            )}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
};

