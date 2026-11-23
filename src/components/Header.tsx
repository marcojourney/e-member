import React from 'react';
import { USER_PROFILE } from '../data/mockData';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onProfileClick,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl border-b border-slate-200/50 shadow-[0_1px_8px_rgba(11,28,48,0.04)]">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack && (
            <button
              aria-label="Go back"
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none shrink-0"
              onClick={onBack}
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          )}

          {/* Light mode logo */}
          <img
            alt="E-Member Brand Mark"
            className={`dark:hidden ${showBack ? 'h-9 max-w-[135px]' : 'h-10 max-w-[165px]'} w-auto object-contain shrink-0`}
            src={USER_PROFILE.brandMarkUrl}
          />
          {/* Dark mode logo */}
          <img
            alt="E-Member Brand Mark"
            className={`hidden dark:block ${showBack ? 'h-9 max-w-[135px]' : 'h-10 max-w-[165px]'} w-auto object-contain shrink-0`}
            src={USER_PROFILE.brandMarkDarkUrl}
          />

          <span className="text-slate-300 dark:text-slate-700 font-light select-none shrink-0">|</span>

          <span className="text-[14px] font-semibold text-on-surface leading-tight truncate">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Notifications and Profile"
            className="relative p-1 rounded-full hover:bg-surface-container-high transition-colors focus:outline-none"
            onClick={onProfileClick}
            type="button"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              src={USER_PROFILE.avatarUrl}
            />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-tertiary-container rounded-full ring-2 ring-surface"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
