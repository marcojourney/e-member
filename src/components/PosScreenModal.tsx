import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { POS_DEMO_PRESETS, PosDemoPreset } from '../utils/posReceiptParser';

interface PosScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanPosQr: (qrPayload: string, merchantName: string) => void;
}

export const PosScreenModal: React.FC<PosScreenModalProps> = ({
  isOpen,
  onClose,
  onScanPosQr,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PosDemoPreset>(POS_DEMO_PRESETS[0]);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    QRCode.toDataURL(selectedPreset.qrPayload, {
      width: 240,
      margin: 2,
      color: {
        dark: '#0b1c30',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate POS QR:', err);
      });
    return () => {
      active = false;
    };
  }, [isOpen, selectedPreset]);

  if (!isOpen) return null;

  const subtotal = selectedPreset.items.reduce((s, it) => s + it.total, 0);
  const totalPaid = Math.max(0, subtotal - (selectedPreset.discountAmount || 0));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto no-scrollbar animate-fadeIn">
      <div className="w-full max-w-sm bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* POS Hardware Top Bezel */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              POS Customer Screen
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
            type="button"
            aria-label="Close POS display"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Terminal Switcher */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {POS_DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedPreset.id === preset.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">{preset.iconName}</span>
              <span>{preset.merchantName}</span>
            </button>
          ))}
        </div>

        {/* Simulated POS Display Body */}
        <div className="p-4 space-y-3">
          <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-[15px] font-bold text-white">{selectedPreset.merchantName}</h3>
                <p className="text-[11px] text-slate-400">{selectedPreset.posTerminal}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold">
                PAID
              </span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1.5">
              {selectedPreset.items.map((item) => (
                <div key={item.sku} className="flex items-center justify-between text-[12px]">
                  <span className="text-slate-300 truncate pr-2">
                    {item.qty}x {item.name}
                  </span>
                  <span className="font-mono text-slate-200 shrink-0">${item.total.toFixed(2)}</span>
                </div>
              ))}
              {selectedPreset.discountAmount && (
                <div className="flex items-center justify-between text-[11px] text-emerald-400">
                  <span>{selectedPreset.discountName}</span>
                  <span className="font-mono">-${selectedPreset.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[12px] text-slate-400 font-medium">Total Settled</span>
              <span className="font-mono text-[18px] font-bold text-primary-fixed">
                ${totalPaid.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Real Scannable POS Receipt QR */}
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-inner">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
              Scan QR for Digital Receipt
            </span>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`POS Receipt QR for ${selectedPreset.merchantName}`}
                className="w-44 h-44 rounded-lg border border-slate-100"
              />
            ) : (
              <div className="w-44 h-44 bg-slate-100 animate-pulse rounded-lg" />
            )}
            <span className="mt-2 font-mono text-[10px] text-slate-500 break-all px-2">
              Order {selectedPreset.orderQueueNumber} • Instant e-Receipt
            </span>
          </div>

          {/* Direct Action to Scan/Capture into Wallet */}
          <button
            onClick={() => onScanPosQr(selectedPreset.qrPayload, selectedPreset.merchantName)}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container active:scale-[0.98] text-white font-semibold text-[13px] flex items-center justify-center gap-2 shadow-lg transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Scan This POS QR to View Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
