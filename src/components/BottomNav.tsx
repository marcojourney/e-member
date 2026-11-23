import React from 'react';

export type NavTab = 'home' | 'memberships' | 'receipts' | 'rewards' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadReceiptsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  unreadReceiptsCount = 2,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(11,28,48,0.06)] border-t border-slate-200/50">
      <div className="flex justify-between items-center h-20 px-2 max-w-md mx-auto">
        {/* Home Tab */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
            currentTab === 'home'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="text-[11px] leading-none">Home</span>
        </button>

        {/* Memberships Tab */}
        <button
          onClick={() => onTabChange('memberships')}
          className={`flex-1 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
            currentTab === 'memberships'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'memberships' ? "'FILL' 1" : "'FILL' 0" }}
          >
            badge
          </span>
          <span className="text-[11px] leading-none">Memberships</span>
        </button>

        {/* Receipts Tab */}
        <button
          onClick={() => onTabChange('receipts')}
          className={`flex-1 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 relative transition-colors ${
            currentTab === 'receipts'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span className="relative">
            <span
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: currentTab === 'receipts' ? "'FILL' 1" : "'FILL' 0" }}
            >
              receipt_long
            </span>
            {unreadReceiptsCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-primary text-on-primary font-mono text-[10px] font-bold rounded-full">
                {unreadReceiptsCount}
              </span>
            )}
          </span>
          <span className="text-[11px] leading-none">Receipts</span>
        </button>

        {/* Rewards Tab */}
        <button
          onClick={() => onTabChange('rewards')}
          className={`flex-1 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
            currentTab === 'rewards'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'rewards' ? "'FILL' 1" : "'FILL' 0" }}
          >
            featured_seasonal_and_gifts
          </span>
          <span className="text-[11px] leading-none">Rewards</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex-1 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors ${
            currentTab === 'profile'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: currentTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
          >
            person
          </span>
          <span className="text-[11px] leading-none">Profile</span>
        </button>
      </div>
    </nav>
  );
};
