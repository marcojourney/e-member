import React, { useState } from 'react';
import { USER_PROFILE } from '../data/mockData';
import { PWAInstallButton } from '../components/PWAInstallButton';

export type AppTheme = 'light' | 'dark' | 'system';

interface ProfileScreenProps {
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onShowToast: (msg: string) => void;
  onOpenScanner: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  theme,
  onThemeChange,
  onShowToast,
  onOpenScanner,
}) => {
  const [nfcEnabled, setNfcEnabled] = useState(true);
  const [autoSaveReceipts, setAutoSaveReceipts] = useState(true);
  const [biometricUnlock, setBiometricUnlock] = useState(true);

  return (
    <div className="flex flex-col w-full px-4 space-y-4 pb-28 pt-1">
      {/* Profile Header Card */}
      <div className="w-full rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={USER_PROFILE.avatarUrl}
            alt="Sophanna M."
            className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-fixed shadow-md"
          />
          <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[12px] ring-2 ring-white font-bold">
            ✓
          </span>
        </div>

        <h2 className="text-[20px] font-bold text-on-surface mt-3">{USER_PROFILE.name}</h2>
        <p className="text-[13px] text-secondary">Universal Member since Feb 2025</p>

        <div className="mt-2.5 inline-flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full border border-slate-200">
          <span className="font-mono text-[12px] font-bold text-primary">
            {USER_PROFILE.memberId}
          </span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(USER_PROFILE.memberId);
              onShowToast('Member ID copied to clipboard');
            }}
            className="text-secondary hover:text-on-surface"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
          </button>
        </div>
      </div>

      {/* Appearance & Theme Switcher Card */}
      <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">
              {theme === 'dark' ? 'dark_mode' : theme === 'light' ? 'light_mode' : 'brightness_auto'}
            </span>
            <span>Appearance &amp; Theme</span>
          </h3>
          <span className="text-[11px] font-semibold text-primary capitalize px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            {theme} Mode
          </span>
        </div>

        {/* 3-Option Segmented Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-surface-container rounded-xl">
          <button
            onClick={() => {
              onThemeChange('light');
              onShowToast('Switched to Light Theme');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              theme === 'light'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                : 'text-secondary hover:text-on-surface'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: theme === 'light' ? "'FILL' 1" : "'FILL' 0" }}
            >
              light_mode
            </span>
            <span>Light</span>
          </button>

          <button
            onClick={() => {
              onThemeChange('dark');
              onShowToast('Switched to Dark Theme');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              theme === 'dark'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                : 'text-secondary hover:text-on-surface'
            }`}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: theme === 'dark' ? "'FILL' 1" : "'FILL' 0" }}
            >
              dark_mode
            </span>
            <span>Dark</span>
          </button>

          <button
            onClick={() => {
              onThemeChange('system');
              onShowToast('Theme set to System Default');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              theme === 'system'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                : 'text-secondary hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">brightness_auto</span>
            <span>System</span>
          </button>
        </div>
      </div>

      {/* Linked Settlement & Payment */}
      <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-[14px] font-bold text-on-surface flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[20px]">
            account_balance_wallet
          </span>
          <span>Settlement &amp; KHQR Connection</span>
        </h3>

        <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              KHQR
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-on-surface">Bakong Instant Pay</span>
              <span className="text-[11px] text-secondary">Active • Auto-sync e-Receipts</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-[10px] font-bold">
            CONNECTED
          </span>
        </div>
      </div>

      {/* Device & Hardware Settings */}
      <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-[14px] font-bold text-on-surface flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[20px]">contactless</span>
          <span>Hardware &amp; Pass Features</span>
        </h3>

        <div className="space-y-3 divide-y divide-slate-100 text-[13px]">
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="font-semibold text-on-surface">NFC Pass Broadcast</span>
              <span className="text-[11px] text-secondary">
                Tap phone against compatible POS terminals
              </span>
            </div>
            <button
              onClick={() => {
                setNfcEnabled(!nfcEnabled);
                onShowToast(`NFC Broadcast ${!nfcEnabled ? 'Enabled' : 'Disabled'}`);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                nfcEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              type="button"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  nfcEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex flex-col">
              <span className="font-semibold text-on-surface">Auto-Save Digital Receipts</span>
              <span className="text-[11px] text-secondary">
                Sync itemized tax invoices directly to vault
              </span>
            </div>
            <button
              onClick={() => {
                setAutoSaveReceipts(!autoSaveReceipts);
                onShowToast(`Auto-save ${!autoSaveReceipts ? 'Enabled' : 'Disabled'}`);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                autoSaveReceipts ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              type="button"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  autoSaveReceipts ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex flex-col">
              <span className="font-semibold text-on-surface">Biometric Unlock for Pass QR</span>
              <span className="text-[11px] text-secondary">
                Fingerprint or FaceID before showing barcode
              </span>
            </div>
            <button
              onClick={() => {
                setBiometricUnlock(!biometricUnlock);
                onShowToast(`Biometrics ${!biometricUnlock ? 'Enabled' : 'Disabled'}`);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                biometricUnlock ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              type="button"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  biometricUnlock ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Environmental & Security Footprint */}
      <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs text-secondary">
          <span>E-Member Vault Encryption</span>
          <span className="font-mono text-primary font-bold">AES-256 GCM</span>
        </div>
        <div className="flex items-center justify-between text-xs text-secondary">
          <span>General Dept of Taxation (GDT)</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Audited &amp; Synced</span>
        </div>
      </div>

      {/* Install App (PWA) */}
      <PWAInstallButton
        variant="card"
        onInstalled={() => onShowToast('E-Member installed to your home screen!')}
      />

      {/* Action to scan card */}
      <button
        onClick={onOpenScanner}
        className="w-full py-3 rounded-xl bg-surface-container-high hover:bg-surface-variant text-primary font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">document_scanner</span>
        <span>Scan Physical Membership Card</span>
      </button>

      {/* App Brand Signature */}
      <div className="pt-2 flex flex-col items-center justify-center opacity-75 hover:opacity-100 transition-opacity">
        <img
          alt="E-Member Logo"
          className="dark:hidden h-8 w-auto object-contain"
          src={USER_PROFILE.brandMarkUrl}
        />
        <img
          alt="E-Member Logo"
          className="hidden dark:block h-8 w-auto object-contain"
          src={USER_PROFILE.brandMarkDarkUrl}
        />
        <p className="text-[11px] text-secondary mt-1">E-Member Universal App v2.4.0</p>
      </div>
    </div>
  );
};
