import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card';
  onInstalled?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  onInstalled,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Suppress button when already running in standalone installed PWA mode
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        onInstalled?.();
      }
    } else {
      setShowGuideModal(true);
    }
  };

  // In Header: show native install button when installable or on iOS; keep compact
  if (variant === 'header') {
    if (!isInstallable && !isIOS) {
      return null;
    }

    return (
      <>
        <button
          onClick={handleInstallClick}
          className="h-8 px-2.5 rounded-full bg-primary/10 hover:bg-primary/20 active:scale-95 text-primary border border-primary/25 flex items-center gap-1 text-[11px] font-bold transition-all shrink-0"
          type="button"
          title={isIOS ? 'Install E-Member on iPhone / iPad' : 'Install E-Member App'}
        >
          <span className="material-symbols-outlined text-[15px]">install_mobile</span>
          <span>Install</span>
        </button>

        {showGuideModal && (
          <InstallGuideModal isIOS={isIOS} onClose={() => setShowGuideModal(false)} />
        )}
      </>
    );
  }

  // In Profile / Settings card: always show install option if not yet installed
  return (
    <>
      <button
        onClick={handleInstallClick}
        className="w-full py-3 px-4 rounded-2xl bg-primary hover:bg-primary-container active:scale-[0.98] text-white font-semibold text-xs flex items-center justify-between shadow-sm transition-all"
        type="button"
      >
        <span className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">install_mobile</span>
          </span>
          <span className="text-left">
            <span className="block font-bold text-[13px]">Install E-Member App</span>
            <span className="block text-[11px] text-white/80 font-normal">
              {isInstallable
                ? 'Add to home screen for instant offline access'
                : isIOS
                ? 'Tap for iOS Safari Add to Home Screen steps'
                : 'Add shortcut & offline wallet to your device'}
            </span>
          </span>
        </span>
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>

      {showGuideModal && (
        <InstallGuideModal isIOS={isIOS} onClose={() => setShowGuideModal(false)} />
      )}
    </>
  );
};

const InstallGuideModal: React.FC<{ isIOS: boolean; onClose: () => void }> = ({
  isIOS,
  onClose,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-on-surface">
      <div className="flex items-center gap-3 mb-3">
        <img
          src="/pwa-192x192.png"
          alt="E-Member App Icon"
          className="w-11 h-11 rounded-xl shadow-sm"
        />
        <div>
          <h3 className="text-[16px] font-bold text-on-surface">
            {isIOS ? 'Install on iPhone / iPad' : 'Install E-Member App'}
          </h3>
          <p className="text-[11px] text-secondary">Runs full-screen with offline receipt access</p>
        </div>
      </div>

      {isIOS ? (
        <ol className="text-[13px] text-secondary space-y-2 my-3 pl-4 list-decimal">
          <li>
            Tap the <strong className="text-on-surface">Share</strong> button in the Safari toolbar.
          </li>
          <li>
            Scroll down and tap <strong className="text-on-surface">Add to Home Screen</strong>.
          </li>
          <li>
            Tap <strong className="text-on-surface">Add</strong> in the top-right corner.
          </li>
        </ol>
      ) : (
        <p className="text-[13px] text-secondary leading-relaxed my-3">
          Open your browser menu (⋮ or address bar install icon) and select{' '}
          <strong className="text-on-surface">Install App</strong> or{' '}
          <strong className="text-on-surface">Add to Home Screen</strong>. If viewing inside an
          embedded preview frame, open the app directly in a browser tab first.
        </p>
      )}

      <button
        onClick={onClose}
        className="mt-2 w-full h-10 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-colors"
        type="button"
      >
        Got it
      </button>
    </div>
  </div>
);
