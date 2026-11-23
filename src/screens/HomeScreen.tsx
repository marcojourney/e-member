import React, { useState, useEffect } from 'react';
import { MembershipCard, Receipt } from '../types';
import { USER_PROFILE } from '../data/mockData';

interface HomeScreenProps {
  memberships: MembershipCard[];
  receipts: Receipt[];
  onViewAllMemberships: () => void;
  onViewAllReceipts: () => void;
  onViewReceipt: (receiptId: string) => void;
  onRedeemRewards: () => void;
  onOpenScanner: () => void;
  onOpenTurnstilePass: () => void;
  onShowToast: (msg: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  memberships,
  receipts,
  onViewAllMemberships,
  onViewAllReceipts,
  onViewReceipt,
  onRedeemRewards,
  onOpenScanner,
  onOpenTurnstilePass,
  onShowToast,
}) => {
  const [tokenSeconds, setTokenSeconds] = useState(37);
  const [codeMode, setCodeMode] = useState<'qr' | 'barcode'>('qr');
  const [copied, setCopied] = useState(false);

  // Dynamic security token countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTokenSeconds((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(USER_PROFILE.memberId);
    setCopied(true);
    onShowToast(`Member ID ${USER_PROFILE.memberId} copied to clipboard`);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleNfcSimulate = () => {
    if (navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
    onShowToast('NFC Pass broadcast active • Ready for contactless terminal');
  };

  const formattedTimer = `0:${tokenSeconds < 10 ? '0' + tokenSeconds : tokenSeconds}s`;

  return (
    <div className="flex flex-col w-full px-4 space-y-4 pb-28 pt-2">
      {/* Greeting & Status */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-on-surface tracking-tight truncate">
              {USER_PROFILE.greeting}
            </h2>
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/15 text-primary shrink-0"
              title="Verified Member"
            >
              <svg
                className="w-3 h-3 text-primary shrink-0"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
              </svg>
            </span>
          </div>
          <p className="text-[13px] sm:text-[14px] text-secondary font-normal truncate">
            Universal Membership &amp; Digital Receipts
          </p>
        </div>

        <button
          onClick={handleNfcSimulate}
          className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/30 active:scale-95 transition-all px-3 py-1.5 rounded-full shadow-xs border border-primary/25 shrink-0 self-center"
          type="button"
          title="Tap to trigger NFC broadcast"
          aria-label="NFC Live Status - Tap to trigger broadcast"
        >
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white shrink-0">
            <svg
              className="w-2.5 h-2.5 text-white"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
            </svg>
          </span>
          <span className="text-[11px] font-bold text-primary tracking-wide uppercase shrink-0">
            NFC Live
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0"></span>
        </button>
      </div>

      {/* Hero Universal Identity Card */}
      <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#00685f] via-[#008378] to-[#004d45] text-white p-4 shadow-xl overflow-hidden">
        {/* Security Micro-Pattern & Decorative Waves */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        ></div>

        {/* Top Meta */}
        <div className="relative z-10 flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-tertiary-fixed rounded flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-tertiary text-[18px]">memory</span>
            </div>
            <span className="text-[14px] font-semibold text-white tracking-tight flex items-center gap-1">
              E-Member Global Identity
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-white/90">
            <span className="material-symbols-outlined text-[20px] text-[#89f5e7]">contactless</span>
            <span className="font-mono text-[12px] font-bold text-[#89f5e7] bg-black/25 px-2 py-0.5 rounded border border-[#89f5e7]/30">PASS</span>
          </div>
        </div>

        {/* User & ID Quick Info */}
        <div className="relative z-10 flex items-end justify-between my-2">
          <div>
            <p className="text-[11px] text-[#89f5e7] uppercase tracking-wider font-semibold">
              Member Name
            </p>
            <p className="text-[20px] font-bold text-white tracking-tight">
              {USER_PROFILE.name}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <span className="font-mono text-[12px] text-[#89f5e7] font-semibold">
              {USER_PROFILE.memberId}
            </span>
            <button
              aria-label="Copy Member ID"
              className={`transition-transform active:scale-90 text-white/90 hover:text-white ${
                copied ? 'text-[#89f5e7] scale-110' : ''
              }`}
              onClick={handleCopyId}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
            </button>
          </div>
        </div>

        {/* High-Contrast Scannable QR Surface */}
        <div className="relative z-10 mt-3 p-3.5 bg-white rounded-xl shadow-md flex flex-col items-center">
          {codeMode === 'qr' ? (
            <div className="relative w-44 h-44 p-2 bg-white rounded-lg flex items-center justify-center">
              {/* SVG QR Presentation */}
              <svg className="w-full h-full text-slate-950" fill="currentColor" viewBox="0 0 160 160">
                {/* Corner Position Markers */}
                <rect fill="#0b1c30" height="40" rx="4" width="40" x="8" y="8"></rect>
                <rect fill="#ffffff" height="28" rx="2" width="28" x="14" y="14"></rect>
                <rect fill="#00685f" height="16" rx="1" width="16" x="20" y="20"></rect>
                <rect fill="#0b1c30" height="40" rx="4" width="40" x="112" y="8"></rect>
                <rect fill="#ffffff" height="28" rx="2" width="28" x="118" y="14"></rect>
                <rect fill="#00685f" height="16" rx="1" width="16" x="124" y="20"></rect>
                <rect fill="#0b1c30" height="40" rx="4" width="40" x="8" y="112"></rect>
                <rect fill="#ffffff" height="28" rx="2" width="28" x="14" y="118"></rect>
                <rect fill="#00685f" height="16" rx="1" width="16" x="20" y="124"></rect>
                {/* Synthetic Matrix Elements */}
                <rect fill="#0b1c30" height="10" width="10" x="56" y="12"></rect>
                <rect fill="#0b1c30" height="10" width="10" x="72" y="12"></rect>
                <rect fill="#0b1c30" height="6" width="10" x="88" y="16"></rect>
                <rect fill="#0b1c30" height="8" width="24" x="56" y="28"></rect>
                <rect fill="#0b1c30" height="10" width="14" x="86" y="28"></rect>
                <rect fill="#0b1c30" height="24" width="8" x="12" y="56"></rect>
                <rect fill="#0b1c30" height="8" width="14" x="26" y="60"></rect>
                <rect fill="#0b1c30" height="8" width="28" x="16" y="86"></rect>
                <rect fill="#0b1c30" height="12" width="12" x="56" y="54"></rect>
                <rect fill="#0b1c30" height="10" width="12" x="74" y="52"></rect>
                <rect fill="#0b1c30" height="8" width="14" x="92" y="56"></rect>
                {/* Center Branding Dot Base */}
                <rect fill="#00685f" height="32" rx="6" width="32" x="64" y="64"></rect>
                <circle cx="80" cy="80" fill="#ffffff" r="7"></circle>
                <circle cx="80" cy="80" fill="#89f5e7" r="4"></circle>
                <rect fill="#0b1c30" height="10" width="16" x="56" y="102"></rect>
                <rect fill="#0b1c30" height="16" width="10" x="78" y="98"></rect>
                <rect fill="#0b1c30" height="8" width="12" x="96" y="104"></rect>
                <rect fill="#0b1c30" height="24" width="8" x="56" y="120"></rect>
                <rect fill="#0b1c30" height="10" width="20" x="70" y="126"></rect>
                <rect fill="#0b1c30" height="20" width="10" x="98" y="122"></rect>
                <rect fill="#0b1c30" height="12" width="16" x="114" y="56"></rect>
                <rect fill="#0b1c30" height="8" width="14" x="136" y="58"></rect>
                <rect fill="#0b1c30" height="8" width="34" x="116" y="74"></rect>
                <rect fill="#0b1c30" height="16" width="12" x="112" y="90"></rect>
                <rect fill="#0b1c30" height="10" width="18" x="132" y="92"></rect>
                <rect fill="#0b1c30" height="26" width="12" x="116" y="116"></rect>
                <rect fill="#0b1c30" height="14" width="16" x="134" y="114"></rect>
                <rect fill="#0b1c30" height="12" width="16" x="134" y="134"></rect>
              </svg>
              {/* Scanning Ray Subtle Visual */}
              <div className="absolute inset-x-2 top-2 h-0.5 bg-[#89f5e7] opacity-80 rounded-full animate-[pulse_2s_infinite]"></div>
            </div>
          ) : (
            <div className="w-56 h-44 flex flex-col items-center justify-center py-2">
              <div className="w-52 h-20 flex items-stretch justify-center gap-[3px] bg-white">
                <div className="w-1.5 bg-[#0b1c30]"></div>
                <div className="w-0.5 bg-[#0b1c30]"></div>
                <div className="w-2.5 bg-[#0b1c30]"></div>
                <div className="w-1 bg-[#0b1c30]"></div>
                <div className="w-0.5 bg-[#0b1c30]"></div>
                <div className="w-2 bg-[#0b1c30]"></div>
                <div className="w-1.5 bg-[#0b1c30]"></div>
                <div className="w-0.5 bg-[#0b1c30]"></div>
                <div className="w-2 bg-[#0b1c30]"></div>
                <div className="w-1 bg-[#0b1c30]"></div>
                <div className="w-3 bg-[#0b1c30]"></div>
                <div className="w-0.5 bg-[#0b1c30]"></div>
                <div className="w-2 bg-[#0b1c30]"></div>
                <div className="w-1 bg-[#0b1c30]"></div>
                <div className="w-2 bg-[#0b1c30]"></div>
                <div className="w-0.5 bg-[#0b1c30]"></div>
                <div className="w-1.5 bg-[#0b1c30]"></div>
                <div className="w-2 bg-[#0b1c30]"></div>
              </div>
              <span className="font-mono text-[12px] tracking-widest text-[#0b1c30] font-bold mt-3">
                9 2 8 3 8 1 0 0 2 0 2 6
              </span>
            </div>
          )}

          {/* Explanatory POS Caption */}
          <p className="text-[12px] text-on-surface-variant text-center mt-2.5 max-w-xs leading-tight">
            Scan at any participating merchant or MarketChain POS to identify, earn points, and
            receive digital receipts automatically.
          </p>

          {/* Switching Utility Pill */}
          <div className="mt-3 inline-flex items-center p-0.5 rounded-full bg-surface-container gap-1">
            <button
              onClick={() => setCodeMode('qr')}
              className={`px-3 py-1 rounded-full font-semibold text-[11px] transition-all ${
                codeMode === 'qr'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-secondary hover:text-on-surface'
              }`}
              type="button"
            >
              QR Token
            </button>
            <button
              onClick={() => setCodeMode('barcode')}
              className={`px-3 py-1 rounded-full font-semibold text-[11px] flex items-center gap-1 transition-all ${
                codeMode === 'barcode'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-secondary hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">barcode</span>
              Barcode
            </button>
            <div className="flex items-center gap-1 pl-1 pr-2.5 text-on-secondary-container">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-ping"></span>
              <span className="font-mono text-[11px] text-tertiary font-semibold">
                {formattedTimer}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Stats Bar */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-3 gap-2 divide-transparent text-center">
          <div className="flex flex-col items-center">
            <span className="font-mono text-[20px] font-bold text-primary tracking-tight">
              {USER_PROFILE.totalPoints.toLocaleString()}
            </span>
            <span className="text-[11px] text-on-surface font-semibold">Total Points</span>
            <span className="text-[10px] text-secondary">across 3 stores</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-[20px] font-bold text-on-surface tracking-tight">
              {USER_PROFILE.activeCardsCount}
            </span>
            <span className="text-[11px] text-on-surface font-semibold">Active Cards</span>
            <span className="text-[10px] text-secondary">all verified</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-[20px] font-bold text-on-surface tracking-tight">
              {11 + receipts.length}
            </span>
            <span className="text-[11px] text-on-surface font-semibold">E-Receipts</span>
            <span className="text-[10px] text-primary font-medium">auto-saved</span>
          </div>
        </div>
      </div>

      {/* Action Prompts */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onRedeemRewards}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed shadow-sm active:scale-98 transition-transform text-left hover:brightness-105"
          type="button"
        >
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-tertiary text-[20px]">
              featured_seasonal_and_gifts
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold truncate">Redeem Rewards</p>
            <p className="text-[11px] text-on-tertiary-fixed-variant truncate">2 perks available</p>
          </div>
        </button>

        <button
          onClick={onOpenScanner}
          className="flex items-center gap-2.5 p-3 rounded-2xl bg-surface-container text-on-surface shadow-sm active:scale-98 transition-transform text-left hover:bg-surface-container-high"
          type="button"
        >
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold truncate">Scan POS QR</p>
            <p className="text-[11px] text-secondary truncate">View Receipt &amp; Link</p>
          </div>
        </button>
      </div>

      {/* My Memberships Section */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-semibold text-on-surface">My Memberships</h3>
          <button
            onClick={onViewAllMemberships}
            className="text-[14px] font-semibold text-primary flex items-center gap-0.5 hover:underline"
            type="button"
          >
            <span>View All ({memberships.length})</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Pass Stacks / Cards */}
        <div className="space-y-3">
          {/* Card 1: Marco Byte Store */}
          <div
            onClick={onViewAllMemberships}
            className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all active:scale-[0.99] cursor-pointer hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    devices
                  </span>
                </div>
                <div>
                  <h4 className="text-[16px] font-semibold text-on-surface">Marco Byte Store</h4>
                  <p className="text-[12px] text-secondary">Tech &amp; Electronics</p>
                </div>
              </div>
              {/* Gold Pill */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-semibold">
                <span
                  className="material-symbols-outlined text-[14px] text-tertiary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  workspace_premium
                </span>
                Gold Member
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <span className="font-mono text-[20px] font-bold text-primary">1,240</span>
                <span className="text-[12px] text-secondary ml-1 font-medium">pts</span>
              </div>
              <div className="text-right">
                <span className="text-[12px] text-secondary">Total Spend:</span>
                <span className="font-mono text-[12px] text-on-surface font-bold ml-1">$580.50</span>
              </div>
            </div>

            {/* Tier Progress */}
            <div className="mt-2.5 space-y-1">
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-container rounded-full" style={{ width: '82%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-secondary">
                <span>Current: Gold Tier</span>
                <span className="font-semibold text-tertiary">260 pts to Platinum</span>
              </div>
            </div>
          </div>

          {/* Card 2: Austin Coffee */}
          <div
            onClick={onViewAllMemberships}
            className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all active:scale-[0.99] cursor-pointer hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-tertiary text-[24px]">
                    local_cafe
                  </span>
                </div>
                <div>
                  <h4 className="text-[16px] font-semibold text-on-surface">Austin Coffee</h4>
                  <p className="text-[12px] text-secondary">Specialty Roasters</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold">
                <span
                  className="material-symbols-outlined text-[14px] text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  military_tech
                </span>
                Silver Member
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-[20px] font-bold text-on-surface">362</span>
                <span className="text-[12px] text-secondary ml-1 font-medium">pts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[12px] font-bold">
                  ✓
                </span>
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[12px] font-bold">
                  ✓
                </span>
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[12px] font-bold">
                  ✓
                </span>
                <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[12px] font-bold">
                  ✓
                </span>
                <span className="w-6 h-6 rounded-full bg-surface-container text-secondary flex items-center justify-center text-[11px]">
                  ☕
                </span>
              </div>
            </div>
            <p className="text-[11px] text-primary font-semibold mt-2 text-right">
              Free Drink progress: 4/5 stamps
            </p>
          </div>

          {/* Card 3: Fit Gym */}
          <div
            onClick={onViewAllMemberships}
            className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all active:scale-[0.99] cursor-pointer hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    fitness_center
                  </span>
                </div>
                <div>
                  <h4 className="text-[16px] font-semibold text-on-surface">Fit Gym</h4>
                  <p className="text-[12px] text-secondary">Active Club Membership</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Active
              </span>
            </div>

            <div className="mt-3 pt-2.5 flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-xl">
              <span className="text-[12px] text-on-surface font-medium">8 visits this month</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTurnstilePass();
                }}
                className="flex items-center gap-1 text-primary text-[11px] font-bold hover:underline"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code</span>
                <span>Turnstile Pass</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Digital Receipts (I-Receipt Quick Access) */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[20px] font-semibold text-on-surface">Recent Receipts</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-mono text-[10px] font-bold">
              LIVE
            </span>
          </div>
          <button
            onClick={onViewAllReceipts}
            className="text-[14px] font-semibold text-primary flex items-center gap-0.5 hover:underline"
            type="button"
          >
            <span>All Receipts</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {receipts.slice(0, 2).map((receipt) => (
            <div
              key={receipt.id}
              onClick={() => onViewReceipt(receipt.id)}
              className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all hover:bg-surface-container-low cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        receipt.merchantName.includes('Coffee') ? 'text-tertiary' : 'text-primary'
                      }`}
                    >
                      {receipt.merchantName.includes('Coffee') ? 'local_cafe' : 'receipt_long'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[16px] font-semibold text-on-surface">
                        {receipt.merchantName}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-fixed text-[10px] font-medium">
                        KHQR Paid
                      </span>
                    </div>
                    <p className="text-[12px] text-secondary">
                      {receipt.dateShort} • {receipt.items.length} items
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono text-[20px] text-on-surface font-bold">
                    ${receipt.totalPaid.toFixed(2)}
                  </p>
                  <span className="text-[11px] text-primary font-bold">
                    +{receipt.pointsEarned} Points
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-slate-100">
                <span className="font-mono text-[12px] text-secondary font-medium">
                  ID: {receipt.id}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewReceipt(receipt.id);
                  }}
                  className="px-3 py-1 rounded-full bg-surface-container-high text-primary hover:bg-primary hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
                  type="button"
                >
                  <span>View Receipt</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
