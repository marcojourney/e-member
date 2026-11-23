import React, { useState } from 'react';
import { RewardItem } from '../types';
import { REWARDS_CATALOG } from '../data/mockData';

interface RewardsScreenProps {
  userPoints: number;
  onRedeemReward: (reward: RewardItem) => void;
  onShowToast: (msg: string) => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({
  userPoints,
  onRedeemReward,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeVoucher, setActiveVoucher] = useState<RewardItem | null>(null);

  const categories = ['all', 'Food & Drinks', 'Electronics', 'Fitness'];

  const filteredRewards = REWARDS_CATALOG.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleClaim = (reward: RewardItem) => {
    if (userPoints < reward.pointsCost) {
      onShowToast(`Need ${reward.pointsCost - userPoints} more points to unlock this perk`);
      return;
    }
    setActiveVoucher(reward);
    onRedeemReward(reward);
    onShowToast(`Unlocked "${reward.title}" voucher!`);
  };

  return (
    <div className="flex flex-col w-full px-4 space-y-4 pb-28 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-[24px] font-bold text-on-surface tracking-tight">Perks &amp; Rewards</h1>
        <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
          2 Unlocked
        </span>
      </div>

      {/* Points Balance Hero Card */}
      <div className="rounded-2xl bg-gradient-to-br from-tertiary-fixed via-amber-100 to-orange-100 p-4 shadow-sm border border-tertiary/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-tertiary flex items-center justify-center shadow-xs">
            <span
              className="material-symbols-outlined text-[26px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              featured_seasonal_and_gifts
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-tertiary-fixed-variant">
              Available Point Balance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-[24px] font-bold text-tertiary leading-none">
                {userPoints.toLocaleString()}
              </span>
              <span className="text-[12px] text-tertiary font-semibold">Universal Points</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onShowToast('Universal Points can be redeemed at all 3 linked stores')}
          className="text-xs font-bold text-tertiary underline"
          type="button"
        >
          Rules
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-xs transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-white'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
            type="button"
          >
            {cat === 'all' ? 'All Rewards' : cat}
          </button>
        ))}
      </div>

      {/* Rewards Catalog Grid */}
      <div className="space-y-3 pt-1">
        {filteredRewards.map((reward) => {
          const canAfford = userPoints >= reward.pointsCost;

          return (
            <div
              key={reward.id}
              className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col space-y-3 border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      {reward.category === 'Food & Drinks'
                        ? 'local_cafe'
                        : reward.category === 'Fitness'
                        ? 'fitness_center'
                        : 'loyalty'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-on-surface">{reward.title}</h3>
                    <p className="text-[12px] text-secondary">
                      {reward.merchant} • {reward.expiresIn}
                    </p>
                  </div>
                </div>

                <span className="font-mono text-[14px] font-bold text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded-lg shrink-0">
                  {reward.pointsCost} pts
                </span>
              </div>

              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                {reward.description}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[11px] text-secondary font-medium">{reward.category}</span>
                <button
                  onClick={() => handleClaim(reward)}
                  className={`px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all active:scale-95 shadow-sm ${
                    canAfford
                      ? 'bg-primary text-white hover:bg-primary-container'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                  type="button"
                >
                  {canAfford ? 'Redeem Voucher' : `Need ${reward.pointsCost} Pts`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Voucher Modal */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative border border-slate-200">
            <button
              onClick={() => setActiveVoucher(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-variant flex items-center justify-center text-secondary"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed text-tertiary flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">redeem</span>
            </div>

            <h3 className="text-lg font-bold text-on-surface">{activeVoucher.title}</h3>
            <p className="text-xs text-secondary mt-0.5 mb-4">{activeVoucher.merchant}</p>

            <div className="w-full bg-white p-5 rounded-2xl shadow-inner border border-slate-200 flex flex-col items-center">
              <svg className="w-36 h-36 text-slate-900" fill="currentColor" viewBox="0 0 100 100">
                <path d="M10,10 h30 v30 h-30 z M16,16 v18 h18 v-18 z M22,22 h6 v6 h-6 z"></path>
                <path d="M60,10 h30 v30 h-30 z M66,16 v18 h18 v-18 z M72,22 h6 v6 h-6 z"></path>
                <path d="M10,60 h30 v30 h-30 z M16,66 v18 h18 v-18 z M22,72 h6 v6 h-6 z"></path>
                <circle cx="50" cy="20" r="3"></circle>
                <circle cx="50" cy="35" r="4"></circle>
                <circle cx="75" cy="55" r="4"></circle>
                <path d="M50,50 h15 v8 h-15 z M70,80 h15 v6 h-15 z M52,70 h8 v18 h-8 z"></path>
              </svg>
              <span className="font-mono text-xs tracking-wider text-slate-700 font-bold mt-2">
                VOUCH-CC-881920
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-3">
              Present this code at checkout to claim your perk. Valid for 10 minutes.
            </p>

            <button
              onClick={() => {
                onShowToast('Voucher redeemed successfully!');
                setActiveVoucher(null);
              }}
              className="w-full mt-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-container"
              type="button"
            >
              Done / Used
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
