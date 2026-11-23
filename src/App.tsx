import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { MembershipsScreen } from './screens/MembershipsScreen';
import { ReceiptsScreen } from './screens/ReceiptsScreen';
import { RewardsScreen } from './screens/RewardsScreen';
import { AppTheme, ProfileScreen } from './screens/ProfileScreen';
import { ReceiptDetailsScreen } from './screens/ReceiptDetailsScreen';
import { ReceiptPaperPreviewScreen } from './screens/ReceiptPaperPreviewScreen';
import { ScannerModal } from './components/ScannerModal';
import { PosScreenModal } from './components/PosScreenModal';
import { PassBarcodeModal } from './components/PassBarcodeModal';
import { Toast } from './components/Toast';
import { INITIAL_MEMBERSHIPS, INITIAL_RECEIPTS, USER_PROFILE } from './data/mockData';
import { MembershipCard, Receipt, RewardItem, SuggestedProgram } from './types';
import { parsePosQrToReceipt } from './utils/posReceiptParser';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [currentScreen, setCurrentScreen] = useState<'main' | 'receipt_details' | 'paper_preview'>('main');
  const [paperReturnScreen, setPaperReturnScreen] = useState<'main' | 'receipt_details'>('receipt_details');
  const [selectedReceiptId, setSelectedReceiptId] = useState<string>('RCP-2026-0891');

  // Theme state with local persistence
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('emember_theme');
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    return 'light';
  });

  React.useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    localStorage.setItem('emember_theme', theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  const [memberships, setMemberships] = useState<MembershipCard[]>(INITIAL_MEMBERSHIPS);
  const [receipts, setReceipts] = useState<Receipt[]>(INITIAL_RECEIPTS);
  const [userPoints, setUserPoints] = useState<number>(USER_PROFILE.totalPoints);

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPosScreenOpen, setIsPosScreenOpen] = useState(false);
  const [barcodeModalConfig, setBarcodeModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    code: string;
    type: 'qr' | 'barcode' | 'turnstile';
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    code: '',
    type: 'qr',
  });

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  // Find currently selected receipt
  const currentReceipt = receipts.find((r) => r.id === selectedReceiptId) || receipts[0];

  // Navigation handlers
  const handleOpenReceiptDetails = (receiptId: string) => {
    setSelectedReceiptId(receiptId);
    setCurrentScreen('receipt_details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPaperPreview = (receipt?: Receipt, returnTo: 'main' | 'receipt_details' = 'receipt_details') => {
    if (receipt) {
      setSelectedReceiptId(receipt.id);
    }
    setPaperReturnScreen(returnTo);
    setCurrentScreen('paper_preview');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
  };

  const handleOpenTurnstile = () => {
    setBarcodeModalConfig({
      isOpen: true,
      title: 'Fit Gym Turnstile Access',
      subtitle: 'Hold phone screen directly over optical turnstile reader',
      code: 'FG-TURN-7719-0182',
      type: 'turnstile',
    });
  };

  const handleOpenPassQR = (membership: MembershipCard) => {
    setBarcodeModalConfig({
      isOpen: true,
      title: `${membership.name} VIP Pass`,
      subtitle: `Member Pass ID • ${membership.tier}`,
      code: membership.passCode || 'IM-928381',
      type: 'qr',
    });
  };

  const handleJoinProgram = (program: SuggestedProgram) => {
    if (memberships.some((m) => m.name === program.name)) {
      showToast(`Already connected with ${program.name}`);
      return;
    }

    const newMembership: MembershipCard = {
      id: program.id,
      name: program.name,
      branch: program.branch,
      category: program.id.includes('cafe') || program.id.includes('coffee') ? 'cafe' : 'retail',
      categoryLabel: program.category,
      tier: 'Standard Member',
      tierBadgeType: 'active',
      points: 50,
      totalSpend: 0,
      digitalReceiptsCount: 0,
      passCode: `IM-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setMemberships((prev) => [newMembership, ...prev]);
    showToast(`Joined ${program.name}! +50 Welcome Points added.`);
  };

  const handleScanResult = (code: string, merchantName?: string) => {
    setIsScannerOpen(false);
    setIsPosScreenOpen(false);

    const { receipt, isExisting } = parsePosQrToReceipt(code, receipts, merchantName);

    if (!isExisting) {
      setReceipts((prev) => [receipt, ...prev]);
      setUserPoints((prev) => prev + receipt.pointsEarned);
    }

    if (
      (merchantName?.includes('Amazon') || receipt.merchantName.includes('Amazon')) &&
      !memberships.some((m) => m.name === 'Amazon Café')
    ) {
      handleJoinProgram({
        id: 'amazon-cafe',
        name: 'Amazon Café',
        category: 'Café & Beverage',
        distance: '120m away',
        branch: 'BKK Branch',
        incentive: 'Earn 1 pt / $1',
        iconName: 'coffee',
      });
    }

    setSelectedReceiptId(receipt.id);
    setCurrentTab('receipts');
    setPaperReturnScreen('main');
    setCurrentScreen('paper_preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showToast(
      isExisting
        ? `Opened paper receipt ${receipt.receiptNumber}`
        : `POS QR synced! Viewing paper receipt ${receipt.receiptNumber}`
    );
  };

  const handleRedeemReward = (reward: RewardItem) => {
    setUserPoints((prev) => Math.max(0, prev - reward.pointsCost));
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans select-none transition-colors duration-200">
      {/* Toast Banner */}
      <Toast message={toastMessage} />

      {/* Screen Routing */}
      {currentScreen === 'paper_preview' ? (
        <ReceiptPaperPreviewScreen
          receipt={currentReceipt}
          onClose={() => setCurrentScreen(paperReturnScreen)}
          onShowToast={showToast}
        />
      ) : (
        <>
          {/* Header */}
          <Header
            title={
              currentScreen === 'receipt_details'
                ? 'Receipt Details'
                : currentTab === 'memberships'
                ? 'Memberships'
                : currentTab === 'receipts'
                ? 'Receipts'
                : currentTab === 'rewards'
                ? 'Rewards'
                : currentTab === 'profile'
                ? 'Profile'
                : 'Home'
            }
            showBack={currentScreen === 'receipt_details'}
            onBack={handleBackToMain}
            onProfileClick={() => {
              setCurrentScreen('main');
              setCurrentTab('profile');
            }}
          />

          {/* Main View Area */}
          <main className="flex-1 flex flex-col relative w-full pt-16 max-w-md mx-auto">
            {currentScreen === 'receipt_details' ? (
              <ReceiptDetailsScreen
                receipt={currentReceipt}
                onBack={handleBackToMain}
                onOpenPaperPreview={() => handleOpenPaperPreview(currentReceipt)}
                onOpenRewards={() => {
                  setCurrentScreen('main');
                  setCurrentTab('rewards');
                }}
                onShowToast={showToast}
              />
            ) : (
              <>
                {currentTab === 'home' && (
                  <HomeScreen
                    memberships={memberships}
                    receipts={receipts}
                    onViewAllMemberships={() => setCurrentTab('memberships')}
                    onViewAllReceipts={() => setCurrentTab('receipts')}
                    onViewReceipt={handleOpenReceiptDetails}
                    onRedeemRewards={() => setCurrentTab('rewards')}
                    onOpenScanner={() => setIsScannerOpen(true)}
                    onOpenTurnstilePass={handleOpenTurnstile}
                    onShowToast={showToast}
                  />
                )}

                {currentTab === 'memberships' && (
                  <MembershipsScreen
                    memberships={memberships}
                    onOpenScanner={() => setIsScannerOpen(true)}
                    onOpenPassQR={handleOpenPassQR}
                    onOpenTurnstile={handleOpenTurnstile}
                    onOpenReceiptsForMerchant={(merchant) => {
                      setCurrentTab('receipts');
                      showToast(`Filtered receipts for ${merchant}`);
                    }}
                    onOpenRewards={() => setCurrentTab('rewards')}
                    onJoinProgram={handleJoinProgram}
                    onShowToast={showToast}
                  />
                )}

                {currentTab === 'receipts' && (
                  <ReceiptsScreen
                    receipts={receipts}
                    onViewReceipt={handleOpenReceiptDetails}
                    onViewPaperPreview={(r) => handleOpenPaperPreview(r, 'main')}
                    onOpenScanner={() => setIsScannerOpen(true)}
                    onOpenPosScreen={() => setIsPosScreenOpen(true)}
                    onShowToast={showToast}
                  />
                )}

                {currentTab === 'rewards' && (
                  <RewardsScreen
                    userPoints={userPoints}
                    onRedeemReward={handleRedeemReward}
                    onShowToast={showToast}
                  />
                )}

                {currentTab === 'profile' && (
                  <ProfileScreen
                    theme={theme}
                    onThemeChange={setTheme}
                    onShowToast={showToast}
                    onOpenScanner={() => setIsScannerOpen(true)}
                  />
                )}
              </>
            )}
          </main>

          {/* Bottom Navigation */}
          {currentScreen !== 'receipt_details' && (
            <BottomNav
              currentTab={currentTab}
              onTabChange={(tab) => {
                setCurrentScreen('main');
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              unreadReceiptsCount={2}
            />
          )}

          {/* Scanner Modal */}
          <ScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onScanResult={handleScanResult}
            onOpenPosScreen={() => {
              setIsScannerOpen(false);
              setIsPosScreenOpen(true);
            }}
          />

          {/* Simulated POS Screen Modal */}
          <PosScreenModal
            isOpen={isPosScreenOpen}
            onClose={() => setIsPosScreenOpen(false)}
            onScanPosQr={(qrPayload, merchantName) => handleScanResult(qrPayload, merchantName)}
          />

          {/* Pass & Turnstile Modal */}
          <PassBarcodeModal
            isOpen={barcodeModalConfig.isOpen}
            onClose={() => setBarcodeModalConfig((prev) => ({ ...prev, isOpen: false }))}
            title={barcodeModalConfig.title}
            subtitle={barcodeModalConfig.subtitle}
            code={barcodeModalConfig.code}
            type={barcodeModalConfig.type}
            onSimulateScanSuccess={() => {
              setBarcodeModalConfig((prev) => ({ ...prev, isOpen: false }));
              showToast(
                barcodeModalConfig.type === 'turnstile'
                  ? 'Turnstile gate opened! Welcome to Fit Gym.'
                  : 'Pass verified by merchant terminal.'
              );
            }}
          />
        </>
      )}
    </div>
  );
}
