import React, { useState } from 'react';
import { Receipt } from '../types';

interface ReceiptsScreenProps {
  receipts: Receipt[];
  onViewReceipt: (id: string) => void;
  onViewPaperPreview: (receipt: Receipt) => void;
  onOpenScanner: () => void;
  onOpenPosScreen: () => void;
  onShowToast: (msg: string) => void;
}

export const ReceiptsScreen: React.FC<ReceiptsScreenProps> = ({
  receipts,
  onViewReceipt,
  onViewPaperPreview,
  onOpenScanner,
  onOpenPosScreen,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'coffee' | 'tech' | 'fitness'>('all');

  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch =
      r.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'all') return true;
    if (filter === 'coffee') return r.merchantName.toLowerCase().includes('coffee') || r.merchantName.toLowerCase().includes('café');
    if (filter === 'tech') return r.merchantName.toLowerCase().includes('byte');
    if (filter === 'fitness') return r.merchantName.toLowerCase().includes('gym');
    return true;
  });

  const totalSpent = receipts.reduce((sum, r) => sum + r.totalPaid, 0);
  const savedTotalCount = 11 + receipts.length;
  const carbonSavedGrams = (savedTotalCount * 0.04).toFixed(2);

  return (
    <div className="flex flex-col w-full px-4 space-y-4 pb-28 pt-1">
      {/* Header Title */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-[22px] sm:text-[24px] font-bold text-on-surface tracking-tight truncate">
            Digital Receipts
          </h1>
          <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-mono text-[10px] font-bold shrink-0">
            {savedTotalCount} SAVED
          </span>
        </div>
        <button
          onClick={() => onShowToast('Exporting tax ledger to CSV...')}
          className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline shrink-0"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">file_download</span>
          <span>Export</span>
        </button>
      </div>

      {/* Scan POS QR Quick Action Banner */}
      <div className="w-full rounded-2xl bg-primary text-white p-3.5 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px] text-primary-fixed">
              qr_code_scanner
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold leading-tight truncate">Scan QR on POS Screen</p>
            <p className="text-[11px] text-white/80 truncate">
              Capture &amp; view receipt instantly
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenPosScreen}
            className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold transition-colors"
            type="button"
            title="Show sample POS checkout screen QR"
          >
            POS Demo
          </button>
          <button
            onClick={onOpenScanner}
            className="px-3 py-1.5 rounded-xl bg-white text-primary hover:bg-primary-fixed font-bold text-[11px] flex items-center gap-1 shadow-xs active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">photo_camera</span>
            <span>Scan</span>
          </button>
        </div>
      </div>

      {/* Eco Impact KPI Banner */}
      <div className="w-full rounded-2xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high p-4 flex items-center justify-between shadow-xs border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">eco</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-on-surface">
              {savedTotalCount} Paper Receipts Saved
            </span>
            <span className="text-[12px] text-primary font-semibold">
              {carbonSavedGrams}g carbon footprint avoided
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-secondary uppercase font-semibold">Total Paid</span>
          <p className="font-mono text-[16px] font-bold text-on-surface">${totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
          search
        </span>
        <input
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline text-[14px] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-slate-100"
          placeholder="Search by merchant, invoice # or date..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-xs ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
          }`}
          type="button"
        >
          All Receipts ({receipts.length})
        </button>
        <button
          onClick={() => setFilter('coffee')}
          className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${
            filter === 'coffee'
              ? 'bg-primary text-white'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
          }`}
          type="button"
        >
          Coffee &amp; Dining
        </button>
        <button
          onClick={() => setFilter('tech')}
          className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${
            filter === 'tech'
              ? 'bg-primary text-white'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
          }`}
          type="button"
        >
          Tech &amp; Retail
        </button>
        <button
          onClick={() => setFilter('fitness')}
          className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${
            filter === 'fitness'
              ? 'bg-primary text-white'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
          }`}
          type="button"
        >
          Fitness Club
        </button>
      </div>

      {/* Receipts List */}
      <div className="space-y-3 pt-1">
        {filteredReceipts.map((receipt) => (
          <div
            key={receipt.id}
            onClick={() => onViewReceipt(receipt.id)}
            className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all hover:bg-surface-container-low cursor-pointer border border-slate-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      receipt.merchantName.includes('Coffee')
                        ? 'text-tertiary'
                        : receipt.merchantName.includes('Gym')
                        ? 'text-secondary'
                        : 'text-primary'
                    }`}
                  >
                    {receipt.merchantName.includes('Coffee')
                      ? 'local_cafe'
                      : receipt.merchantName.includes('Gym')
                      ? 'fitness_center'
                      : 'receipt_long'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[16px] font-bold text-on-surface">{receipt.merchantName}</h3>
                    <span className="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-fixed text-[10px] font-medium">
                      KHQR Paid
                    </span>
                  </div>
                  <p className="text-[12px] text-secondary">
                    {receipt.dateTime} • {receipt.items.length} items
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
                ID: {receipt.receiptNumber}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewPaperPreview(receipt);
                  }}
                  className="px-2.5 py-1 rounded-full bg-surface-container text-secondary hover:text-on-surface text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                  <span>Paper</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewReceipt(receipt.id);
                  }}
                  className="px-3 py-1 rounded-full bg-surface-container-high text-primary hover:bg-primary hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
                  type="button"
                >
                  <span>Details</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
