import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
      <div className="bg-slate-900/95 text-slate-100 border border-slate-700/80 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-md">
        <span
          className={`material-symbols-outlined text-[18px] ${
            type === 'success' ? 'text-emerald-400' : 'text-primary-fixed'
          }`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {type === 'success' ? 'check_circle' : 'info'}
        </span>
        <span className="text-[12px] font-semibold text-slate-100">{message}</span>
      </div>
    </div>
  );
};
