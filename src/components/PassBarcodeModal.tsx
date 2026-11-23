import React from 'react';

interface PassBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  code: string;
  type: 'qr' | 'barcode' | 'turnstile';
  onSimulateScanSuccess?: () => void;
}

export const PassBarcodeModal: React.FC<PassBarcodeModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  code,
  type,
  onSimulateScanSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-variant flex items-center justify-center text-secondary transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[28px]">
            {type === 'turnstile' ? 'barcode_scanner' : type === 'barcode' ? 'barcode' : 'qr_code_2'}
          </span>
        </div>

        <h3 className="text-lg font-bold text-on-surface">{title}</h3>
        <p className="text-xs text-secondary mt-0.5 mb-4">{subtitle}</p>

        {/* High-Contrast Scannable Area */}
        <div className="w-full bg-white p-5 rounded-2xl shadow-inner border border-slate-200 flex flex-col items-center">
          {type === 'turnstile' || type === 'barcode' ? (
            <div className="flex flex-col items-center w-full py-2">
              <div className="w-64 h-20 flex items-stretch justify-center gap-[3px] bg-white py-1">
                <div className="w-1.5 bg-black"></div>
                <div className="w-0.5 bg-black"></div>
                <div className="w-2 bg-black"></div>
                <div className="w-1 bg-black"></div>
                <div className="w-0.5 bg-black"></div>
                <div className="w-2.5 bg-black"></div>
                <div className="w-1 bg-black"></div>
                <div className="w-0.5 bg-black"></div>
                <div className="w-2 bg-black"></div>
                <div className="w-1.5 bg-black"></div>
                <div className="w-0.5 bg-black"></div>
                <div className="w-3 bg-black"></div>
                <div className="w-1 bg-black"></div>
                <div className="w-0.5 bg-black"></div>
                <div className="w-2 bg-black"></div>
                <div className="w-1 bg-black"></div>
                <div className="w-0.5 bg-black"></div>
                <div className="w-2.5 bg-black"></div>
                <div className="w-1 bg-black"></div>
                <div className="w-1.5 bg-black"></div>
                <div className="w-0.5 bg-black"></div>
                <div className="w-2 bg-black"></div>
                <div className="w-1 bg-black"></div>
                <div className="w-2.5 bg-black"></div>
              </div>
              <span className="font-mono text-sm tracking-widest text-slate-800 font-bold mt-2">
                {code}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-44 h-44 p-2 bg-white flex items-center justify-center">
                <svg className="w-full h-full text-slate-900" fill="currentColor" viewBox="0 0 100 100">
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
              </div>
              <span className="font-mono text-xs tracking-wider text-slate-600 font-medium mt-1">
                {code}
              </span>
            </div>
          )}
        </div>

        {/* Screen Brightness & Tap to Simulate Entry */}
        <p className="text-[11px] text-slate-400 mt-3">
          Auto-brightness enabled • Hold 3-5 cm from optical scanner
        </p>

        {onSimulateScanSuccess && (
          <button
            onClick={onSimulateScanSuccess}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Simulate Reader Verification
          </button>
        )}
      </div>
    </div>
  );
};
