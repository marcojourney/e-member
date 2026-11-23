import React, { useState, useRef } from 'react';
import { Receipt } from '../types';
import { USER_PROFILE } from '../data/mockData';

interface ReceiptPaperPreviewScreenProps {
  receipt: Receipt;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const ReceiptPaperPreviewScreen: React.FC<ReceiptPaperPreviewScreenProps> = ({
  receipt,
  onClose,
}) => {
  const [showClose, setShowClose] = useState(true);
  const lastScrollTopRef = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    if (currentScrollTop <= 12) {
      setShowClose(true);
    } else if (currentScrollTop > lastScrollTopRef.current + 4) {
      setShowClose(false);
    } else if (currentScrollTop < lastScrollTopRef.current - 4) {
      setShowClose(true);
    }
    lastScrollTopRef.current = currentScrollTop;
  };

  return (
    <div
      onScroll={handleScroll}
      className="fixed inset-0 z-50 bg-[#FAF9F5] text-[#141517] flex flex-col overflow-y-auto no-scrollbar antialiased"
    >
      {/* Floating Close Button (auto-hides on scroll down) */}
      <button
        aria-label="Close receipt preview"
        className={`fixed top-3 right-3 z-50 h-9 px-3 rounded-full bg-[#18191B]/10 hover:bg-[#18191B]/20 backdrop-blur-md active:scale-95 text-[#141517] flex items-center justify-center gap-1 text-[12px] font-semibold shadow-sm border border-[#18191B]/10 transition-all duration-200 ${
          showClose ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
        onClick={onClose}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
        <span>Close</span>
      </button>

      {/* Full-Screen Thermal Paper Content */}
      <div className="relative flex-1 w-full bg-[#FAF9F5] select-none pb-8">
        {/* Subtle Paper Surface Texture Overlay */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '10px 10px',
          }}
        ></div>

        {/* Subtle Paper Vertical Crease & Lighting Gradient */}
        <div className="pointer-events-none fixed inset-0 bg-gradient-to-r from-black/[0.03] via-white/[0.1] to-black/[0.03]"></div>

        {/* Main Receipt Body Content (80mm Monospace POS Output) */}
        <div className="relative w-full max-w-md mx-auto px-5 pt-4 pb-6 font-mono text-[12px] leading-relaxed text-[#18191B]">
              {/* Dot Matrix Icon & Store Header */}
              <div className="flex flex-col items-center text-center mb-3">
                <img
                  src={
                    receipt.merchantLogoUrl ||
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuAvFBq0Y0XXaI4Mf6VFVZb1ThEhSauDhB4ccbNIYTLEDY6Lu_t7o5UHLjY1jXa6QXAWQaAAWfNFwMyCpwIbGtHWTLwhgCiGolz9ohjahDtZbJj3C-28bigiKPcphpnZpSN5NzAenGUu-pu1ejn9Rscx0wWJor3rh_VSVfrfBYvPMIP-XzvI8HmaPt0SHUTswnFsjkVqDR0zGRtVPDUcmPRt9pEmylAZNDbzcmS6KEkazphFDxA_V_2AMobfjMsqxhVyOw'
                  }
                  alt="Merchant Logo"
                  className="w-16 h-16 mb-2 rounded-full object-contain filter grayscale contrast-150"
                />
                <span className="font-bold text-[15px] tracking-tight uppercase">
                  {receipt.merchantName.toUpperCase()}
                </span>
                <span className="text-[11px] text-[#333] mt-0.5">
                  {receipt.merchantBranch}
                </span>
                <span className="text-[10px] text-[#444]">
                  VAT TIN: K008-902104829 | Tel: +855 23 999 123
                </span>
                <div className="mt-1 font-semibold text-[12px] tracking-wider uppercase bg-[#18191B]/5 px-2 py-0.5">
                  TAX INVOICE / OFFICIAL RECEIPT
                </div>
              </div>

              {/* Thermal Divider */}
              <div className="text-[10px] text-center tracking-tighter text-[#555] overflow-hidden whitespace-nowrap mb-2">
                ========================================
              </div>

              {/* Prominent Queue / Order Number Box */}
              <div className="border-2 border-dashed border-[#18191B] p-2.5 my-2 text-center bg-[#18191B]/[0.02]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#444] block">
                  ORDER QUEUE CALL
                </span>
                <span className="font-mono font-bold text-[28px] tracking-tight leading-none my-1 block text-[#111]">
                  {receipt.orderQueueNumber || '#C-018'}
                </span>
                <div className="inline-block bg-[#18191B] text-[#FAF9F5] px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase mt-1">
                  [ READY FOR PICKUP - BARISTA COUNTER ]
                </div>
              </div>

              {/* Thermal Divider */}
              <div className="text-[10px] text-center tracking-tighter text-[#555] overflow-hidden whitespace-nowrap my-1">
                ----------------------------------------
              </div>

              {/* Transaction Meta Info */}
              <div className="text-[11px] space-y-0.5 text-[#222]">
                <div className="flex justify-between">
                  <span className="text-[#555]">Receipt #:</span>
                  <span className="font-bold">{receipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">Date &amp; Time:</span>
                  <span>24/10/2026 08:30:15 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">Cashier:</span>
                  <span>{receipt.cashier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#555]">POS Terminal:</span>
                  <span>{receipt.posTerminal}</span>
                </div>
              </div>

              {/* Thermal Divider */}
              <div className="text-[10px] text-center tracking-tighter text-[#555] overflow-hidden whitespace-nowrap my-2">
                ----------------------------------------
              </div>

              {/* Itemized Table Header */}
              <div className="flex justify-between text-[11px] font-bold uppercase pb-1 text-[#111]">
                <span className="w-8">QTY</span>
                <span className="flex-1 px-1">DESCRIPTION</span>
                <span className="text-right w-16">AMOUNT</span>
              </div>
              <div className="text-[10px] text-center tracking-tighter text-[#555] overflow-hidden whitespace-nowrap mb-1">
                ----------------------------------------
              </div>

              {/* Items Rows */}
              <div className="space-y-1.5 text-[11px] text-[#222]">
                {receipt.items.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between">
                    <span className="w-8 font-bold">{item.qty}</span>
                    <div className="flex-1 px-1">
                      <span className="font-medium block leading-tight">{item.name}</span>
                      <span className="text-[9px] text-[#666]">SKU: {item.sku}</span>
                    </div>
                    <span className="text-right w-16 font-bold">${item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Thermal Divider */}
              <div className="text-[10px] text-center tracking-tighter text-[#555] overflow-hidden whitespace-nowrap my-2">
                ----------------------------------------
              </div>

              {/* Subtotal / Discount / Tax Calculations */}
              <div className="space-y-0.5 text-[11px] text-[#222]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${receipt.subtotal.toFixed(2)}</span>
                </div>
                {receipt.discountAmount && (
                  <div className="flex justify-between text-[#111]">
                    <span className="flex items-center gap-1">
                      <span>{receipt.discountName || 'Member Silver (10%)'}:</span>
                    </span>
                    <span>-${receipt.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>VAT (10% Inclusive):</span>
                  <span>${receipt.vatAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Thermal Bold Line */}
              <div className="text-[10px] text-center tracking-tighter text-[#18191B] overflow-hidden whitespace-nowrap my-1.5 font-bold">
                ========================================
              </div>

              {/* Total Paid */}
              <div className="flex items-baseline justify-between py-1">
                <span className="font-bold text-[14px] uppercase tracking-wide">TOTAL PAID:</span>
                <span className="font-bold text-[22px] tracking-tight leading-none text-[#111]">
                  ${receipt.totalPaid.toFixed(2)}
                </span>
              </div>

              <div className="text-[10px] text-center tracking-tighter text-[#18191B] overflow-hidden whitespace-nowrap my-1 font-bold">
                ========================================
              </div>

              {/* Payment Settlement Data */}
              <div className="text-[10px] space-y-0.5 text-[#333] pt-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase text-[11px] tracking-wider text-[#111]">
                    E-MEMBER PRIVILEGE
                  </span>
                  <span className="bg-[#18191B] text-[#FAF9F5] px-1.5 py-0.5 text-[9px] font-bold">
                    SILVER TIER
                  </span>
                </div>
                <div className="flex justify-between text-[#333]">
                  <span>Member: {USER_PROFILE.name}</span>
                  <span>ID: {receipt.memberId}</span>
                </div>
                <div className="flex justify-between font-bold text-[#111] pt-0.5">
                  <span>Points Earned Today:</span>
                  <span className="text-[#00685f]">+{receipt.pointsEarned} PTS</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Point Balance:</span>
                  <span className="font-bold">{receipt.pointBalance} PTS</span>
                </div>
                <div className="text-[9px] text-[#555] italic pt-0.5">
                  ★ Only {receipt.nextTierPointsNeeded} pts needed to unlock {receipt.nextTierName}{' '}
                  VIP status!
                </div>
              </div>

              {/* Loyalty Membership Box (Gold Tier privilege preview) */}
              <div className="mt-3 bg-[#18191B]/[0.03] p-2 border border-[#18191B]/20 text-[10px] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold uppercase text-[11px] tracking-wider text-[#111]">
                    E-MEMBER PRIVILEGE
                  </span>
                  <span className="bg-[#18191B] text-[#FAF9F5] px-1.5 py-0.5 text-[9px] font-bold">
                    GOLD TIER
                  </span>
                </div>
                <div className="flex justify-between text-[#333]">
                  <span>Member: {USER_PROFILE.name}</span>
                  <span>ID: EM-928381</span>
                </div>
                <div className="flex justify-between font-bold text-[#111] pt-0.5">
                  <span>Points Earned Today:</span>
                  <span className="text-[#00685f]">+23 PTS</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Point Balance:</span>
                  <span className="font-bold">1,240 PTS</span>
                </div>
                <div className="text-[9px] text-[#555] italic pt-0.5">
                  ★ Only 260 pts needed to unlock Platinum VIP status!
                </div>
              </div>

              {/* Thermal Footer */}
              <div className="text-[10px] text-center tracking-tighter text-[#555] overflow-hidden whitespace-nowrap mt-3 pb-3 border-t border-dashed border-[#555] pt-2">
                <div className="font-bold tracking-wider text-[#111]">
                  *** THANK YOU FOR VISITING {receipt.merchantName.toUpperCase()} ***
                </div>
                <div className="text-[9px] text-[#555]">Freshly roasted specialty coffee daily.</div>
                <div className="text-[8px] text-[#666] pt-1">
                  Powered by E-Member &amp; E-Receipt Digital Systems
                </div>
                <div className="text-[8px] text-[#777] font-semibold">
                  www.coffeehub.kh | support@coffeehub.kh
                </div>
              </div>
        </div>
      </div>
    </div>
  );
};
