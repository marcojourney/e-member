import React from 'react';
import { Receipt } from '../types';
import { USER_PROFILE } from '../data/mockData';

interface ReceiptDetailsScreenProps {
  receipt: Receipt;
  onBack: () => void;
  onOpenPaperPreview: () => void;
  onOpenRewards: () => void;
  onShowToast: (msg: string) => void;
}

export const ReceiptDetailsScreen: React.FC<ReceiptDetailsScreenProps> = ({
  receipt,
  onBack,
  onOpenPaperPreview,
  onOpenRewards,
  onShowToast,
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${receipt.merchantName} Digital Receipt ${receipt.receiptNumber}`,
          text: `Digital Receipt for $${receipt.totalPaid.toFixed(2)} settled at ${receipt.merchantName} via Bakong KHQR.`,
          url: window.location.href,
        });
      } catch {
        onShowToast('Receipt link copied to clipboard');
      }
    } else {
      onShowToast('Receipt link copied to clipboard');
    }
  };

  const handleDownloadPdf = () => {
    onShowToast(`Receipt ${receipt.receiptNumber} downloaded as PDF`);
  };

  const handleReportIssue = () => {
    onShowToast(`Support ticket opened for ${receipt.receiptNumber}`);
  };

  return (
    <div className="flex flex-col w-full pb-24 pt-1">
      {/* Interactive Top Action Sub-bar */}
      <div className="px-4 pt-2 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Live e-Receipt Synced
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Paper Preview"
            className="h-9 px-3 rounded-full bg-surface-container-high text-primary hover:bg-surface-variant transition-colors shadow-sm flex items-center gap-1.5 text-[11px] font-bold"
            onClick={onOpenPaperPreview}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Paper Preview</span>
          </button>
          <button
            aria-label="Share Receipt"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors shadow-sm"
            onClick={handleShare}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
          <button
            aria-label="Download Receipt"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors shadow-sm"
            onClick={handleDownloadPdf}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Receipt Physical-Metaphor Card Container */}
        <div className="relative w-full bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden transition-all duration-300 border border-slate-100">
          {/* Top Decorative Perforation Strip / Brand Accent */}
          <div className="h-2 w-full bg-gradient-to-r from-[#00685f] via-[#008378] to-[#89f5e7]"></div>

          {/* Receipt Header Section */}
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shadow-sm overflow-hidden">
                  {receipt.merchantLogoUrl ? (
                    <img
                      src={receipt.merchantLogoUrl}
                      alt={receipt.merchantName}
                      className="w-10 h-10 object-contain rounded-lg"
                    />
                  ) : (
                    <span
                      className="material-symbols-outlined text-[28px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      coffee
                    </span>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="text-[18px] font-bold text-on-surface truncate">
                    {receipt.merchantName}
                  </h2>
                  <p className="text-[12px] text-secondary truncate">
                    {receipt.merchantCategory}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-primary text-[11px] font-bold whitespace-nowrap">
                <span
                  className="material-symbols-outlined text-[13px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                Tax Invoice
              </span>
            </div>

            {/* Order Queue Banner */}
            {receipt.orderQueueNumber && (
              <div className="w-full bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">local_cafe</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] uppercase tracking-wider text-secondary font-semibold">
                      Order Queue / Pickup No.
                    </span>
                    <span className="font-mono text-[22px] font-bold text-primary tracking-tight leading-none pt-0.5">
                      {receipt.orderQueueNumber}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary text-white text-[11px] font-semibold shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse"></span>
                    {receipt.orderQueueStatus || 'Ready for Pickup'}
                  </span>
                  <span className="font-mono text-[11px] text-secondary">
                    {receipt.pickupCounter || 'Barista Counter'}
                  </span>
                </div>
              </div>
            )}

            {/* View Full Paper Receipt Button */}
            <button
              className="w-full h-11 rounded-xl bg-surface-container-high hover:bg-surface-variant active:scale-[0.98] text-primary font-semibold text-[14px] flex items-center justify-center gap-2 shadow-xs transition-all border border-primary/20"
              onClick={onOpenPaperPreview}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">fullscreen</span>
              <span>View Full Paper Receipt</span>
            </button>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 bg-surface-container-low rounded-xl p-3">
              <div className="flex flex-col">
                <span className="text-[11px] text-secondary font-semibold">RECEIPT NO.</span>
                <span className="font-mono text-[12px] text-on-surface font-bold">
                  {receipt.receiptNumber}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[11px] text-secondary font-semibold">DATE &amp; TIME</span>
                <span className="font-mono text-[12px] text-on-surface">{receipt.dateTime}</span>
              </div>
              <div className="col-span-2 pt-1.5 flex items-center justify-between text-secondary border-t border-slate-200/60 mt-1">
                <span className="text-[12px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  {receipt.cashier}
                </span>
                <span className="text-[12px] text-on-surface-variant font-mono font-medium">
                  {receipt.posTerminal}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Notch Perforation Divider */}
          <div className="relative w-full flex items-center justify-between my-1">
            <div className="w-4 h-7 bg-[#f8f9ff] rounded-r-full shadow-inner -ml-1 border-r border-slate-200/50"></div>
            <div className="flex-1 mx-2 border-b-2 border-dashed border-outline-variant/50"></div>
            <div className="w-4 h-7 bg-[#f8f9ff] rounded-l-full shadow-inner -mr-1 border-l border-slate-200/50"></div>
          </div>

          {/* Itemized Order Table */}
          <div className="px-4 py-2 flex flex-col">
            <div className="flex items-center justify-between pb-2 text-secondary text-[11px] font-bold tracking-wider uppercase border-b border-slate-100">
              <span>ITEM DESCRIPTION</span>
              <span>AMOUNT</span>
            </div>

            {/* Line Items */}
            <div className="flex flex-col gap-3 py-3">
              {receipt.items.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] text-on-surface font-semibold truncate">
                      {item.name}
                    </span>
                    <span className="font-mono text-[12px] text-secondary">
                      {item.qty} × ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="font-mono text-[13px] font-bold text-on-surface shrink-0">
                    ${item.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown Calculation */}
            <div className="mt-2 pt-3 flex flex-col gap-1.5 bg-surface-container-low/80 p-3 rounded-xl">
              <div className="flex justify-between items-center text-secondary text-[12px]">
                <span>Subtotal</span>
                <span className="font-mono text-on-surface font-semibold">
                  ${receipt.subtotal.toFixed(2)}
                </span>
              </div>
              {receipt.discountAmount && receipt.discountAmount > 0 && (
                <div className="flex justify-between items-center text-primary text-[12px]">
                  <span className="flex items-center gap-1 font-medium">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      stars
                    </span>
                    {receipt.discountName || 'Member Discount'}
                  </span>
                  <span className="font-mono font-bold">
                    -${receipt.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-secondary text-[12px]">
                <span>VAT / State Tax (10%)</span>
                <span className="font-mono text-on-surface font-semibold">
                  ${receipt.vatAmount.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 mt-1 border-t border-slate-200/80 flex justify-between items-baseline">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-on-surface uppercase tracking-wide">
                    Total Paid
                  </span>
                  <span className="text-[11px] text-primary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    {receipt.paymentMethod}
                  </span>
                </div>
                <span className="font-mono text-[28px] text-primary font-bold tracking-tight">
                  ${receipt.totalPaid.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Settlement Info */}
            <div className="mt-3 px-3 py-2.5 rounded-xl bg-surface-container flex items-center justify-between gap-2 text-on-surface">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center shrink-0 text-primary shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-bold truncate">Bakong KHQR Instant Pay</span>
                  <span className="font-mono text-[11px] text-secondary truncate">
                    {receipt.paymentTxId}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[11px] font-bold shrink-0 shadow-xs">
                PAID
              </span>
            </div>
          </div>

          {/* Ticket Cut Divider */}
          <div className="relative w-full flex items-center justify-between my-2">
            <div className="w-4 h-7 bg-[#f8f9ff] rounded-r-full shadow-inner -ml-1 border-r border-slate-200/50"></div>
            <div className="flex-1 mx-2 border-b-2 border-dashed border-outline-variant/50"></div>
            <div className="w-4 h-7 bg-[#f8f9ff] rounded-l-full shadow-inner -mr-1 border-l border-slate-200/50"></div>
          </div>

          {/* Connected I-Member Loyalty Block */}
          <div className="p-4 pt-1">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-fixed/30 to-surface-container p-4 shadow-sm border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">coffee</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-primary font-bold">
                      {receipt.membershipProgramName}
                    </span>
                    <span className="text-[16px] font-bold text-on-surface">{USER_PROFILE.name}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-bold shadow-xs">
                  {receipt.loyaltyTier}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-secondary font-mono text-[12px]">
                <span>Pass: {receipt.memberId}</span>
                <span>Roaster ID: CC-00891</span>
              </div>

              {/* Points Earned Highlight */}
              <div className="mt-3 p-2.5 bg-white rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed text-xs font-bold animate-bounce">
                    ★
                  </span>
                  <span className="text-[13px] font-semibold text-on-surface">
                    Earned This Order
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[16px] text-primary font-bold">
                    +{receipt.pointsEarned} PTS
                  </span>
                </div>
              </div>

              {/* Tier Milestone Progress */}
              <div className="mt-3 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-on-surface font-medium">
                    Balance:{' '}
                    <strong className="text-primary font-mono text-[12px]">
                      {receipt.pointBalance} pts
                    </strong>
                  </span>
                  <span className="text-tertiary font-bold">
                    {receipt.nextTierPointsNeeded} pts to {receipt.nextTierName}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: '80%' }}
                  ></div>
                </div>
                <p className="text-[11px] text-secondary text-right pt-0.5">
                  Gold unlocks free monthly single origin tasting &amp; 15% off beans
                </p>
              </div>
            </div>
          </div>

          {/* Government / Tax Authentication & QR Section */}
          <div className="px-4 pb-4 flex flex-col items-center text-center gap-3">
            <div className="relative group cursor-pointer p-3 bg-white rounded-2xl shadow-inner border border-slate-100 flex flex-col items-center gap-2">
              {/* High Contrast Tax QR Code */}
              <div className="w-36 h-36 bg-white p-2 rounded-lg flex items-center justify-center">
                <svg className="w-full h-full text-slate-900" fill="currentColor" viewBox="0 0 100 100">
                  <rect height="28" rx="4" width="28" x="0" y="0"></rect>
                  <rect fill="white" height="20" rx="2" width="20" x="4" y="4"></rect>
                  <rect fill="currentColor" height="12" rx="1" width="12" x="8" y="8"></rect>
                  <rect height="28" rx="4" width="28" x="72" y="0"></rect>
                  <rect fill="white" height="20" rx="2" width="20" x="76" y="4"></rect>
                  <rect fill="currentColor" height="12" rx="1" width="12" x="80" y="8"></rect>
                  <rect height="28" rx="4" width="28" x="0" y="72"></rect>
                  <rect fill="white" height="20" rx="2" width="20" x="4" y="76"></rect>
                  <rect fill="currentColor" height="12" rx="1" width="12" x="8" y="80"></rect>
                  <rect height="6" rx="1" width="6" x="34" y="4"></rect>
                  <rect height="12" rx="1" width="6" x="44" y="8"></rect>
                  <rect height="6" rx="1" width="10" x="54" y="4"></rect>
                  <rect height="6" rx="1" width="12" x="36" y="22"></rect>
                  <rect height="16" rx="1" width="6" x="52" y="16"></rect>
                  <rect height="8" rx="1" width="8" x="4" y="34"></rect>
                  <rect height="6" rx="1" width="10" x="18" y="38"></rect>
                  <rect height="6" rx="1" width="14" x="4" y="48"></rect>
                  <rect height="14" rx="1" width="6" x="22" y="48"></rect>
                  <rect height="14" rx="2" width="14" x="34" y="34"></rect>
                  <rect height="8" rx="1" width="14" x="54" y="38"></rect>
                  <rect height="6" rx="1" width="8" x="74" y="34"></rect>
                  <rect height="14" rx="1" width="8" x="88" y="34"></rect>
                  <rect height="6" rx="1" width="12" x="72" y="48"></rect>
                  <rect height="10" rx="1" width="8" x="88" y="52"></rect>
                  <rect height="12" rx="1" width="6" x="34" y="54"></rect>
                  <rect height="6" rx="1" width="16" x="46" y="52"></rect>
                  <rect height="14" rx="1" width="10" x="44" y="64"></rect>
                  <rect height="12" rx="1" width="6" x="60" y="62"></rect>
                  <rect height="6" rx="1" width="10" x="74" y="68"></rect>
                  <rect height="8" rx="1" width="8" x="88" y="68"></rect>
                  <rect height="16" rx="1" width="8" x="72" y="80"></rect>
                  <rect height="6" rx="1" width="12" x="84" y="82"></rect>
                  <rect height="4" rx="1" width="12" x="84" y="92"></rect>
                  <rect height="6" rx="1" width="6" x="34" y="74"></rect>
                  <rect height="6" rx="1" width="14" x="44" y="84"></rect>
                  <rect height="8" rx="1" width="6" x="34" y="88"></rect>
                  <rect height="4" rx="1" width="12" x="54" y="92"></rect>
                </svg>
              </div>
              <span className="font-mono text-[11px] text-secondary font-semibold">
                {receipt.taxQrCodeText}
              </span>
            </div>
            <p className="text-[12px] text-secondary max-w-xs leading-tight">
              Scan to verify authenticity with General Department of Taxation &amp; Merchant Audit
              Ledger.
            </p>
          </div>

          {/* Serrated Bottom Receipt Physical Cue */}
          <div className="w-full flex overflow-hidden h-3 bg-white">
            <svg className="w-full h-3 text-[#f8f9ff] fill-current" preserveAspectRatio="none" viewBox="0 0 360 12">
              <path d="M0,12 L10,0 L20,12 L30,0 L40,12 L50,0 L60,12 L70,0 L80,12 L90,0 L100,12 L110,0 L120,12 L130,0 L140,12 L150,0 L160,12 L170,0 L180,12 L190,0 L200,12 L210,0 L220,12 L230,0 L240,12 L250,0 L260,12 L270,0 L280,12 L290,0 L300,12 L310,0 L320,12 L330,0 L340,12 L350,0 L360,12 Z"></path>
            </svg>
          </div>
        </div>

        {/* Eco Delight / Environmental Impact Banner */}
        <div className="w-full rounded-2xl bg-surface-container-low p-3.5 flex items-center gap-3 shadow-xs border border-primary/10">
          <div className="w-10 h-10 rounded-full bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">eco</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] uppercase tracking-wide text-primary font-bold">
              Paper Saved
            </span>
            <p className="text-[12px] text-on-surface truncate">
              {receipt.paperSavedCount} physical receipt saved • {receipt.carbonAvoidedGrams}g carbon
              avoided
            </p>
          </div>
        </div>

        {/* Merchant Promo Callout Banner */}
        {receipt.promoTitle && (
          <div
            onClick={onOpenRewards}
            className="w-full rounded-2xl bg-surface-container-lowest p-3 flex items-center gap-3 shadow-xs border border-slate-100 cursor-pointer hover:bg-surface-container-low transition-all"
          >
            {receipt.promoImageUrl ? (
              <img
                className="w-14 h-14 rounded-xl object-cover shrink-0"
                alt="Promotion"
                src={receipt.promoImageUrl}
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">redeem</span>
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[11px] text-tertiary font-bold uppercase tracking-wide">
                Exclusive for {receipt.loyaltyTier}
              </span>
              <h4 className="text-[14px] font-bold text-on-surface truncate">
                {receipt.promoTitle}
              </h4>
              <p className="text-[12px] text-secondary truncate">{receipt.promoSubtitle}</p>
            </div>
            <span className="material-symbols-outlined text-secondary text-[20px]">
              chevron_right
            </span>
          </div>
        )}

        {/* Primary & Secondary Interactive Action Stacks */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={onOpenRewards}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container active:scale-[0.98] text-white font-semibold text-[14px] flex items-center justify-center gap-2 shadow-md transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">loyalty</span>
            <span>View Store Rewards &amp; Offers</span>
          </button>

          <button
            onClick={onOpenPaperPreview}
            className="w-full h-11 rounded-xl bg-surface-container-high hover:bg-surface-variant active:scale-[0.98] text-primary font-semibold text-[14px] flex items-center justify-center gap-2 shadow-xs transition-all border border-primary/20"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">fullscreen</span>
            <span>View Full Paper Receipt</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadPdf}
              className="h-11 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-xs transition-colors border border-slate-200/60"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">
                picture_as_pdf
              </span>
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleReportIssue}
              className="h-11 rounded-xl bg-surface-container-lowest hover:bg-error-container text-secondary hover:text-on-error-container font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-xs transition-colors border border-slate-200/60"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">help_outline</span>
              <span>Report Issue</span>
            </button>
          </div>
        </div>

        {/* Micro Safe Space Footnote */}
        <div className="py-2 text-center">
          <p className="text-[11px] text-secondary">
            Encrypted &amp; Stored securely via E-Member Vault • ID: {receipt.id}
          </p>
        </div>
      </div>
    </div>
  );
};
