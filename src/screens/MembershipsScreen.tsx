import React, { useState } from 'react';
import { MembershipCard, SuggestedProgram } from '../types';
import { SUGGESTED_PROGRAMS } from '../data/mockData';

interface MembershipsScreenProps {
  memberships: MembershipCard[];
  onOpenScanner: () => void;
  onOpenPassQR: (membership: MembershipCard) => void;
  onOpenTurnstile: () => void;
  onOpenReceiptsForMerchant: (merchantName: string) => void;
  onOpenRewards: () => void;
  onJoinProgram: (program: SuggestedProgram) => void;
  onShowToast: (msg: string) => void;
}

export const MembershipsScreen: React.FC<MembershipsScreenProps> = ({
  memberships,
  onOpenScanner,
  onOpenPassQR,
  onOpenTurnstile,
  onOpenReceiptsForMerchant,
  onOpenRewards,
  onJoinProgram,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [coffeeFlipped, setCoffeeFlipped] = useState(false);

  // Find frequently used membership (Coffee Hub)
  const coffeeCard = memberships.find((m) => m.id === 'coffee-hub') || memberships[0];

  // Filtering
  const filteredMemberships = memberships.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.tier.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'cafe') return m.category === 'cafe';
    if (selectedFilter === 'tech') return m.category === 'tech';
    if (selectedFilter === 'fitness') return m.category === 'fitness';
    return true;
  });

  return (
    <div className="flex flex-col w-full px-4 space-y-4 pb-28 pt-1">
      {/* Top Section Title & Scanner Trigger */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <h1 className="text-[24px] font-bold text-on-surface tracking-tight">
            My Memberships
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold">
            {memberships.length} Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Scan Membership Barcode"
            className="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shadow-sm active:scale-95 transition-transform hover:bg-surface-variant"
            onClick={onOpenScanner}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
          </button>
          <button
            aria-label="Add New Card"
            className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform hover:bg-primary-container"
            onClick={onOpenScanner}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">add</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col space-y-2.5">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline text-[14px] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-slate-100"
            placeholder="Search programs, stores, or perks..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">clear</span>
            </button>
          )}
        </div>

        {/* Filter chips horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors shadow-xs ${
              selectedFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
            type="button"
          >
            All ({memberships.length})
          </button>
          <button
            onClick={() => setSelectedFilter('cafe')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
              selectedFilter === 'cafe'
                ? 'bg-primary text-white'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
            type="button"
          >
            Café &amp; Dining (1)
          </button>
          <button
            onClick={() => setSelectedFilter('tech')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
              selectedFilter === 'tech'
                ? 'bg-primary text-white'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
            type="button"
          >
            Tech &amp; Retail (1)
          </button>
          <button
            onClick={() => setSelectedFilter('fitness')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
              selectedFilter === 'fitness'
                ? 'bg-primary text-white'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
            type="button"
          >
            Fitness (1)
          </button>
          <button
            onClick={() => {
              onShowToast('No archived memberships yet');
            }}
            className="px-3.5 py-1.5 rounded-full bg-surface-container text-outline text-[11px] font-bold whitespace-nowrap hover:bg-surface-variant transition-colors"
            type="button"
          >
            Archived
          </button>
        </div>
      </div>

      {/* Featured / Primary Membership Card: Coffee Hub */}
      {coffeeCard && selectedFilter !== 'tech' && selectedFilter !== 'fitness' && (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] uppercase tracking-wider text-outline font-bold">
              Frequently Used
            </span>
            <button
              onClick={() => setCoffeeFlipped(!coffeeFlipped)}
              className="font-mono text-[12px] text-primary flex items-center gap-1 font-semibold hover:underline"
              type="button"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Tap to Flip QR</span>
            </button>
          </div>

          {/* Coffee Hub Tactile Pass Card */}
          <div
            onClick={() => setCoffeeFlipped(!coffeeFlipped)}
            className="relative rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden transition-all duration-300 cursor-pointer border border-slate-100 hover:shadow-lg"
          >
            {!coffeeFlipped ? (
              /* Front View */
              <div className="p-4 flex flex-col space-y-3.5 bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-surface-container-low">
                {/* Brand Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0e4b33] p-1 flex items-center justify-center shadow-sm">
                      <img
                        alt="Coffee Hub Logo"
                        className="w-full h-full object-contain rounded-lg"
                        src={coffeeCard.logoUrl}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[16px] font-bold text-on-surface leading-tight">
                        {coffeeCard.name}
                      </span>
                      <span className="text-[12px] text-outline">{coffeeCard.branch}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-bold uppercase tracking-wider">
                    {coffeeCard.tier}
                  </span>
                </div>

                {/* Stamp Progress Tracker Banner */}
                <div className="rounded-xl p-3 bg-surface-container flex flex-col space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-on-surface">Digital Stamp Card</span>
                    <span className="font-mono text-[12px] text-primary font-bold">4 / 5 Collected</span>
                  </div>

                  {/* Visual Stamp Grid */}
                  <div className="grid grid-cols-5 gap-2">
                    <div className="aspect-square rounded-xl bg-primary text-white flex flex-col items-center justify-center shadow-sm">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        local_cafe
                      </span>
                      <span className="text-[9px] font-mono opacity-90 mt-0.5">#1</span>
                    </div>
                    <div className="aspect-square rounded-xl bg-primary text-white flex flex-col items-center justify-center shadow-sm">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        local_cafe
                      </span>
                      <span className="text-[9px] font-mono opacity-90 mt-0.5">#2</span>
                    </div>
                    <div className="aspect-square rounded-xl bg-primary text-white flex flex-col items-center justify-center shadow-sm">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        local_cafe
                      </span>
                      <span className="text-[9px] font-mono opacity-90 mt-0.5">#3</span>
                    </div>
                    <div className="aspect-square rounded-xl bg-primary text-white flex flex-col items-center justify-center shadow-sm">
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        local_cafe
                      </span>
                      <span className="text-[9px] font-mono opacity-90 mt-0.5">#4</span>
                    </div>
                    {/* Stamp 5: FREE Reward slot bouncing */}
                    <div className="aspect-square rounded-xl bg-tertiary-fixed text-tertiary flex flex-col items-center justify-center animate-bounce shadow-inner border border-tertiary/30">
                      <span
                        className="material-symbols-outlined text-[22px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        redeem
                      </span>
                      <span className="text-[9px] font-mono font-bold mt-0.5">FREE</span>
                    </div>
                  </div>

                  <p className="text-[12px] text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">
                      celebration
                    </span>
                    <span>
                      1 more coffee until your <strong>FREE Specialty Drink!</strong>
                    </span>
                  </p>
                </div>

                {/* Footer Info & Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-outline font-semibold">Balance</span>
                    <span className="font-mono text-[20px] text-primary font-bold">
                      {coffeeCard.points} Pts
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant text-[11px] font-bold flex items-center gap-1 hover:bg-surface-container-high transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRewards();
                      }}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">redeem</span>
                      <span>Perks (2)</span>
                    </button>
                    <button
                      className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoffeeFlipped(true);
                      }}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                      <span>Pass QR</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Back View */
              <div className="p-5 flex flex-col items-center justify-center text-center space-y-3 bg-surface-container-lowest animate-fadeIn">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] uppercase tracking-wider text-outline font-bold">
                    Optical Checkout Scan
                  </span>
                  <button
                    className="p-1 rounded-full text-outline hover:text-on-surface"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoffeeFlipped(false);
                    }}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {/* QR Code */}
                <div className="p-3 bg-white rounded-2xl shadow-inner flex flex-col items-center border border-slate-200">
                  <svg className="w-36 h-36 text-slate-900" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M10,10 h30 v30 h-30 z M16,16 v18 h18 v-18 z M22,22 h6 v6 h-6 z"></path>
                    <path d="M60,10 h30 v30 h-30 z M66,16 v18 h18 v-18 z M72,22 h6 v6 h-6 z"></path>
                    <path d="M10,60 h30 v30 h-30 z M16,66 v18 h18 v-18 z M22,72 h6 v6 h-6 z"></path>
                    <circle cx="50" cy="20" r="3"></circle>
                    <circle cx="50" cy="35" r="4"></circle>
                    <circle cx="75" cy="55" r="4"></circle>
                    <circle cx="25" cy="48" r="3"></circle>
                    <circle cx="85" cy="70" r="3"></circle>
                    <path d="M50,50 h15 v8 h-15 z M70,80 h15 v6 h-15 z M52,70 h8 v18 h-8 z M40,65 h6 v6 h-6 z"></path>
                  </svg>
                  <span className="font-mono text-[12px] text-outline tracking-widest mt-2 font-bold">
                    {coffeeCard.passCode}
                  </span>
                </div>

                <p className="text-[12px] text-on-surface-variant max-w-xs">
                  Hold near the barista scanner to redeem stamps &amp; pay with points
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other Active Membership Cards */}
      <div className="flex flex-col space-y-2 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[11px] uppercase tracking-wider text-outline font-bold">
            Active Memberships
          </span>
          <button
            onClick={() => onShowToast('All active cards are synced with Bakong & MarketChain')}
            className="text-[11px] font-bold text-primary hover:underline"
            type="button"
          >
            Manage
          </button>
        </div>

        {/* Marco Byte Store (Tech & Retail) */}
        {filteredMemberships.some((m) => m.id === 'byte-store') && (
          <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm flex flex-col space-y-3 border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">devices</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold text-on-surface leading-tight">
                    Marco Byte Store
                  </span>
                  <span className="text-[12px] text-outline">Tech &amp; Electronics</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  stars
                </span>
                Gold VIP
              </span>
            </div>

            {/* Spend & Balance stats split panel */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-surface-container-low">
              <div className="flex flex-col">
                <span className="text-[11px] text-outline font-semibold">Points Balance</span>
                <span className="font-mono text-[20px] text-on-surface font-bold">1,240 Pts</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-outline font-semibold">Total Spend</span>
                <span className="font-mono text-[20px] text-on-surface font-bold">$580.50</span>
              </div>
            </div>

            {/* Tier Progress Meter */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-outline">Tier Upgrade</span>
                <span className="text-tertiary font-bold">260 pts to Platinum VIP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full bg-tertiary-container rounded-full"
                  style={{ width: '78%' }}
                ></div>
              </div>
            </div>

            {/* Active Perk Chip */}
            <div className="p-2.5 rounded-xl bg-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[18px] text-tertiary shrink-0">
                  percent
                </span>
                <span className="text-[12px] text-on-surface font-medium truncate">
                  10% off Apple &amp; Anker Accessories
                </span>
              </div>
              <span className="text-[11px] font-bold text-error whitespace-nowrap ml-2">
                5d left
              </span>
            </div>

            {/* Card Action Row */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => onOpenReceiptsForMerchant('Marco Byte Store')}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-on-surface-variant hover:text-primary transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>Digital Receipts (8)</span>
              </button>
              <button
                onClick={() => {
                  const byteCard = memberships.find((m) => m.id === 'byte-store');
                  if (byteCard) onOpenPassQR(byteCard);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-[11px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform hover:bg-surface-variant"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code</span>
                <span>Show ID QR</span>
              </button>
            </div>
          </div>
        )}

        {/* Fit Gym (Active Club & Wellness) */}
        {filteredMemberships.some((m) => m.id === 'fit-gym') && (
          <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm flex flex-col space-y-3 border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary-fixed-dim/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">fitness_center</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] font-bold text-on-surface leading-tight">Fit Gym</span>
                  <span className="text-[12px] text-outline">Active Club &amp; Wellness</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold uppercase tracking-wider">
                Active Monthly
              </span>
            </div>

            {/* Visit Metrics & Renewal */}
            <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  event_available
                </span>
                <span className="text-[12px] text-on-surface">
                  <strong>8 visits</strong> this month
                </span>
              </div>
              <span className="text-[11px] text-outline font-semibold">Renews Nov 15</span>
            </div>

            {/* Perk Token Pill */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary-container/50">
              <span className="material-symbols-outlined text-[18px] text-primary">local_bar</span>
              <span className="text-[12px] text-on-secondary-fixed">
                Perk: <strong>1 Free Smoothie Token</strong> ready at shake bar
              </span>
            </div>

            {/* Turnstile Barcode Quick Trigger */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-outline font-semibold">
                <span className="material-symbols-outlined text-[16px] text-primary">lock_open</span>
                <span>NFC Auto-Gate Ready</span>
              </div>
              <button
                onClick={onOpenTurnstile}
                className="px-4 py-2 rounded-xl bg-primary text-white text-[11px] font-bold flex items-center gap-2 shadow-sm active:scale-95 transition-transform hover:bg-primary-container"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
                <span>Turnstile Pass</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Discover & Link New Memberships */}
      <div className="flex flex-col space-y-2 pt-2">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h2 className="text-[16px] font-bold text-on-surface">Discover Nearby Programs</h2>
            <p className="text-[12px] text-outline">Connect merchant accounts with 1-tap</p>
          </div>
          <button
            onClick={() => onShowToast('Showing all participating merchants around Phnom Penh')}
            className="text-[11px] font-bold text-primary hover:underline"
            type="button"
          >
            View All
          </button>
        </div>

        {/* Suggested Program Horizontal Carousel */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {SUGGESTED_PROGRAMS.map((prog) => (
            <div
              key={prog.id}
              className="w-64 shrink-0 rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm flex flex-col justify-between space-y-3 border border-slate-100"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">{prog.iconName}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                  {prog.incentive}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-on-surface">{prog.name}</span>
                <span className="text-[12px] text-outline">
                  {prog.distance} • {prog.branch}
                </span>
              </div>

              <button
                onClick={() => onJoinProgram(prog)}
                className="w-full py-2 rounded-xl bg-surface-container-high hover:bg-primary hover:text-white text-primary text-[11px] font-bold flex items-center justify-center gap-1 active:scale-98 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Join in 1-Tap</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tools: Add Card Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high shadow-sm flex items-center justify-between border border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-[22px]">document_scanner</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-on-surface">Import Physical Pass</span>
            <span className="text-[12px] text-outline">Scan barcode or snap card photo</span>
          </div>
        </div>
        <button
          onClick={onOpenScanner}
          className="px-3.5 py-2 rounded-xl bg-white text-primary text-[11px] font-bold shadow-sm active:scale-95 transition-transform hover:bg-slate-50"
          type="button"
        >
          Scan Card
        </button>
      </div>
    </div>
  );
};
