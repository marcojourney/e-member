export interface LineItem {
  name: string;
  sku: string;
  qty: number;
  price: number;
  total: number;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  merchantName: string;
  merchantCategory: string;
  merchantBranch: string;
  merchantLogoUrl: string;
  isTaxInvoice: boolean;
  orderQueueNumber?: string;
  orderQueueStatus?: string;
  pickupCounter?: string;
  dateTime: string;
  dateShort: string;
  cashier: string;
  posTerminal: string;
  items: LineItem[];
  subtotal: number;
  discountName?: string;
  discountAmount?: number;
  vatAmount: number;
  totalPaid: number;
  paymentMethod: string;
  paymentTxId: string;
  isPaid: boolean;
  membershipProgramName: string;
  loyaltyTier: string;
  memberId: string;
  pointsEarned: number;
  pointBalance: number;
  nextTierPointsNeeded: number;
  nextTierName: string;
  paperSavedCount: number;
  carbonAvoidedGrams: number;
  verifyHash: string;
  taxQrCodeText: string;
  barcodeNumber: string;
  promoTitle?: string;
  promoSubtitle?: string;
  promoImageUrl?: string;
}

export interface MembershipCard {
  id: string;
  name: string;
  branch: string;
  category: 'cafe' | 'tech' | 'fitness' | 'retail';
  categoryLabel: string;
  tier: string;
  tierBadgeType: 'silver' | 'gold' | 'active';
  points: number;
  totalSpend?: number;
  tierTarget?: string;
  tierProgressPercent?: number;
  activePerkTitle?: string;
  activePerkExpires?: string;
  digitalReceiptsCount: number;
  logoUrl?: string;
  stampCard?: {
    collected: number;
    total: number;
    freeRewardName: string;
  };
  turnstile?: {
    visitsThisMonth: number;
    renewsDate: string;
    smoothieTokenAvailable: boolean;
  };
  passCode: string;
}

export interface SuggestedProgram {
  id: string;
  name: string;
  category: string;
  distance: string;
  branch: string;
  incentive: string;
  iconName: string;
}

export interface RewardItem {
  id: string;
  title: string;
  merchant: string;
  pointsCost: number;
  category: string;
  expiresIn: string;
  description: string;
  isClaimed?: boolean;
}
