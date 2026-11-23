import { Receipt, LineItem } from '../types';
import { USER_PROFILE } from '../data/mockData';

export interface PosDemoPreset {
  id: string;
  label: string;
  merchantName: string;
  merchantCategory: string;
  merchantBranch: string;
  posTerminal: string;
  cashier: string;
  qrPayload: string;
  orderQueueNumber: string;
  pickupCounter: string;
  items: LineItem[];
  discountName?: string;
  discountAmount?: number;
  vatRate: number;
  paymentMethod: string;
  membershipProgramName: string;
  loyaltyTier: string;
  iconName: string;
}

export const POS_DEMO_PRESETS: PosDemoPreset[] = [
  {
    id: 'austin-coffee-pos',
    label: 'Austin Coffee POS',
    merchantName: 'Austin Coffee',
    merchantCategory: 'Specialty Roasters & Café (BKK1 Flagship)',
    merchantBranch: 'No. 45, St 306, BKK1, Phnom Penh',
    posTerminal: 'MarketChain POS v4.2 • Terminal 01',
    cashier: 'Sophea T. (Barista Station 1)',
    qrPayload: 'EMEMBER_POS|AC-2026-1142|Austin Coffee|8.45|Oat Latte x1, Matcha Croissant x1',
    orderQueueNumber: '#C-024',
    pickupCounter: 'Barista Counter',
    items: [
      {
        name: 'Iced Oat Milk Spanish Latte',
        sku: 'AC-LATTE-SP-OAT',
        qty: 1,
        price: 4.50,
        total: 4.50,
      },
      {
        name: 'Uji Matcha Almond Croissant',
        sku: 'AC-BAKE-MAT-CRO',
        qty: 1,
        price: 3.95,
        total: 3.95,
      },
    ],
    discountName: 'Member Discount (Silver 10%)',
    discountAmount: 0.85,
    vatRate: 0.1,
    paymentMethod: 'Settled via Bakong KHQR Instant Pay',
    membershipProgramName: 'Austin Coffee Club',
    loyaltyTier: 'SILVER TIER',
    iconName: 'local_cafe',
  },
  {
    id: 'marco-byte-pos',
    label: 'Marco Byte Store POS',
    merchantName: 'Marco Byte Store',
    merchantCategory: 'Tech & Electronics (Toul Kork Branch)',
    merchantBranch: 'St 289, Toul Kork, Phnom Penh',
    posTerminal: 'BytePOS Pro v5.1 • Counter 02',
    cashier: 'Vireak K. (Counter 02)',
    qrPayload: 'EMEMBER_POS|BS-2026-9914|Marco Byte Store|31.35|Anker 45W GaN Charger x1, USB-C Hub x1',
    orderQueueNumber: '#B-051',
    pickupCounter: 'Express Dispatch Station',
    items: [
      {
        name: 'Anker Nano 45W GaN USB-C Charger',
        sku: 'ANK-45W-GAN',
        qty: 1,
        price: 22.00,
        total: 22.00,
      },
      {
        name: 'Ugreen 5-in-1 Aluminum USB-C Hub',
        sku: 'UGR-HUB-5IN1',
        qty: 1,
        price: 11.00,
        total: 11.00,
      },
    ],
    discountName: 'E-Member Gold (5%)',
    discountAmount: 1.65,
    vatRate: 0.1,
    paymentMethod: 'Settled via Bakong KHQR Instant Pay',
    membershipProgramName: 'Marco Byte Store VIP Club',
    loyaltyTier: 'GOLD TIER',
    iconName: 'devices',
  },
  {
    id: 'amazon-cafe-pos',
    label: 'Amazon Café POS',
    merchantName: 'Amazon Café',
    merchantCategory: 'Café & Beverage (BKK Branch)',
    merchantBranch: 'Preah Monivong Blvd, BKK, Phnom Penh',
    posTerminal: 'AmazonPOS Touch v3.8 • Register 03',
    cashier: 'Kosal R. (Counter 03)',
    qrPayload: 'EMEMBER_POS|AMZ-2026-4402|Amazon Café|5.70|Iced Amazon Espresso x2',
    orderQueueNumber: '#A-109',
    pickupCounter: 'Drink Pickup Counter',
    items: [
      {
        name: 'Iced Amazon Signature Espresso',
        sku: 'AMZ-ESP-ICE',
        qty: 2,
        price: 2.85,
        total: 5.70,
      },
    ],
    vatRate: 0.1,
    paymentMethod: 'Settled via Bakong KHQR Instant Pay',
    membershipProgramName: 'Amazon Café Rewards',
    loyaltyTier: 'STANDARD MEMBER',
    iconName: 'coffee',
  },
  {
    id: 'fit-gym-pos',
    label: 'Fit Gym POS',
    merchantName: 'Fit Gym',
    merchantCategory: 'Active Club & Wellness (BKK Premium)',
    merchantBranch: 'Preah Norodom Blvd, Phnom Penh',
    posTerminal: 'ClubAccess POS v2.0 • Fuel Bar',
    cashier: 'Dara N. (Front Desk)',
    qrPayload: 'EMEMBER_POS|FG-2026-0738|Fit Gym|7.50|Whey Protein Shake x1, Electrolyte Drink x1',
    orderQueueNumber: '#G-029',
    pickupCounter: 'Fuel & Shake Bar',
    items: [
      {
        name: 'Whey Isolate Protein Shake (Vanilla)',
        sku: 'FG-SHAKE-VAN',
        qty: 1,
        price: 4.50,
        total: 4.50,
      },
      {
        name: 'Hydration Electrolyte Recovery',
        sku: 'FG-DRINK-ELEC',
        qty: 1,
        price: 3.00,
        total: 3.00,
      },
    ],
    vatRate: 0.1,
    paymentMethod: 'Settled via Bakong KHQR Instant Pay',
    membershipProgramName: 'Fit Gym VIP Community',
    loyaltyTier: 'ACTIVE MEMBER',
    iconName: 'fitness_center',
  },
];

function formatNowShort(): string {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `Just now, ${time}`;
}

function formatNowFull(): string {
  const now = new Date();
  const datePart = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${datePart} • ${timePart}`;
}

function generateHash(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex.slice(0, 4)}-882e-${hex.slice(4, 8)}-pos1`;
}

// Basic EMVCo KHQR TLV parser to extract merchant name (tag 59), amount (tag 54), city (tag 60)
function tryParseEmvKhqr(raw: string): { merchantName?: string; amount?: number; city?: string } | null {
  if (!raw.startsWith('0002')) return null;
  const tags: Record<string, string> = {};
  let idx = 0;
  try {
    while (idx + 4 <= raw.length) {
      const tag = raw.slice(idx, idx + 2);
      const len = parseInt(raw.slice(idx + 2, idx + 4), 10);
      if (Number.isNaN(len) || len < 0 || idx + 4 + len > raw.length) break;
      const val = raw.slice(idx + 4, idx + 4 + len);
      tags[tag] = val;
      idx += 4 + len;
    }
  } catch {
    return null;
  }
  if (!tags['59'] && !tags['54']) return null;
  const parsedAmount = tags['54'] ? parseFloat(tags['54']) : undefined;
  return {
    merchantName: tags['59'],
    amount: parsedAmount && !Number.isNaN(parsedAmount) ? parsedAmount : undefined,
    city: tags['60'],
  };
}

function buildReceiptFromPreset(preset: PosDemoPreset, rawCode: string): Receipt {
  const subtotal = Number(
    preset.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)
  );
  const discountAmount = preset.discountAmount || 0;
  const taxable = Math.max(0, subtotal - discountAmount);
  const vatAmount = Number((taxable * 0.1).toFixed(2));
  const totalPaid = Number(taxable.toFixed(2));
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `RCP-POS-${randomSuffix}`;
  const pointsEarned = Math.max(5, Math.round(totalPaid * 1.5));

  return {
    id,
    receiptNumber: `#POS-${randomSuffix}`,
    merchantName: preset.merchantName,
    merchantCategory: preset.merchantCategory,
    merchantBranch: preset.merchantBranch,
    merchantLogoUrl: '',
    isTaxInvoice: true,
    orderQueueNumber: preset.orderQueueNumber,
    orderQueueStatus: 'Verified via POS QR',
    pickupCounter: preset.pickupCounter,
    dateTime: formatNowFull(),
    dateShort: formatNowShort(),
    cashier: preset.cashier,
    posTerminal: preset.posTerminal,
    items: preset.items,
    subtotal,
    discountName: preset.discountName,
    discountAmount: preset.discountAmount,
    vatAmount,
    totalPaid,
    paymentMethod: preset.paymentMethod,
    paymentTxId: `#KHQR-${Math.floor(1000000 + Math.random() * 8999999)}-TX`,
    isPaid: true,
    membershipProgramName: preset.membershipProgramName,
    loyaltyTier: preset.loyaltyTier,
    memberId: USER_PROFILE.memberId,
    pointsEarned,
    pointBalance: USER_PROFILE.totalPoints + pointsEarned,
    nextTierPointsNeeded: 120,
    nextTierName: 'Platinum VIP',
    paperSavedCount: 1,
    carbonAvoidedGrams: 0.04,
    verifyHash: generateHash(`${rawCode}-${Date.now()}`),
    taxQrCodeText: rawCode.slice(0, 64),
    barcodeNumber: `2 4 1 1 2 0 2 6 ${String(randomSuffix).split('').join(' ')} 8 8`,
    promoTitle: `Synced from ${preset.merchantName} POS`,
    promoSubtitle: 'Digital tax invoice verified & stored in E-Member Vault',
  };
}

export interface ParsedScanOutcome {
  receipt: Receipt;
  isExisting: boolean;
}

export function parsePosQrToReceipt(
  rawCode: string,
  existingReceipts: Receipt[],
  hintMerchantName?: string
): ParsedScanOutcome {
  const trimmed = rawCode.trim();
  const normalized = trimmed.toLowerCase();

  // 1. Check if QR directly matches an existing receipt in wallet
  const existingMatch = existingReceipts.find(
    (r) =>
      r.id.toLowerCase() === normalized ||
      r.receiptNumber.toLowerCase() === normalized ||
      r.receiptNumber.replace('#', '').toLowerCase() === normalized ||
      r.taxQrCodeText.toLowerCase() === normalized ||
      r.paymentTxId.toLowerCase() === normalized
  );
  if (existingMatch) {
    return { receipt: existingMatch, isExisting: true };
  }

  // 2. Check structured POS preset payload or known merchant tags
  const matchedPreset = POS_DEMO_PRESETS.find(
    (p) =>
      p.qrPayload.toLowerCase() === normalized ||
      (normalized.includes('austin') && p.id === 'austin-coffee-pos') ||
      (normalized.includes('ch-pos') && p.id === 'austin-coffee-pos') ||
      (normalized.includes('byte') && p.id === 'marco-byte-pos') ||
      (normalized.includes('bs-pos') && p.id === 'marco-byte-pos') ||
      (normalized.includes('amazon') && p.id === 'amazon-cafe-pos') ||
      (normalized.includes('amz-') && p.id === 'amazon-cafe-pos') ||
      (normalized.includes('fit') && p.id === 'fit-gym-pos') ||
      (normalized.includes('fg-pos') && p.id === 'fit-gym-pos')
  );
  if (matchedPreset) {
    return {
      receipt: buildReceiptFromPreset(matchedPreset, trimmed),
      isExisting: false,
    };
  }

  // 3. Check JSON POS receipt format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const data = JSON.parse(trimmed) as {
        id?: string;
        receiptNumber?: string;
        merchantName?: string;
        merchant?: string;
        branch?: string;
        total?: number;
        totalPaid?: number;
        items?: Array<{ name: string; qty?: number; price?: number; total?: number; sku?: string }>;
        posTerminal?: string;
        orderQueueNumber?: string;
      };

      const mName = data.merchantName || data.merchant || hintMerchantName || 'POS Merchant';
      const items: LineItem[] =
        Array.isArray(data.items) && data.items.length > 0
          ? data.items.map((it, idx) => {
              const qty = it.qty || 1;
              const price = Number(it.price ?? it.total ?? 5.0);
              const total = Number(it.total ?? qty * price);
              return {
                name: it.name || `Item ${idx + 1}`,
                sku: it.sku || `POS-SKU-${idx + 101}`,
                qty,
                price,
                total,
              };
            })
          : [
              {
                name: 'POS Counter Purchase',
                sku: 'POS-GEN-001',
                qty: 1,
                price: Number(data.totalPaid ?? data.total ?? 10.0),
                total: Number(data.totalPaid ?? data.total ?? 10.0),
              },
            ];

      const subtotal = Number(items.reduce((s, i) => s + i.total, 0).toFixed(2));
      const totalPaid = Number(data.totalPaid ?? data.total ?? subtotal);
      const vatAmount = Number((totalPaid * 0.1).toFixed(2));
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const receiptNum = data.receiptNumber || `#POS-${randomNum}`;
      const pointsEarned = Math.max(5, Math.round(totalPaid * 1.5));

      return {
        isExisting: false,
        receipt: {
          id: data.id || `RCP-POS-${randomNum}`,
          receiptNumber: receiptNum.startsWith('#') ? receiptNum : `#${receiptNum}`,
          merchantName: mName,
          merchantCategory: 'Verified POS Terminal Receipt',
          merchantBranch: data.branch || 'Phnom Penh Main Branch',
          merchantLogoUrl: '',
          isTaxInvoice: true,
          orderQueueNumber: data.orderQueueNumber || `#P-${String(randomNum).slice(0, 3)}`,
          orderQueueStatus: 'Verified via POS QR',
          pickupCounter: 'POS Checkout Counter',
          dateTime: formatNowFull(),
          dateShort: formatNowShort(),
          cashier: 'POS Self-Checkout',
          posTerminal: data.posTerminal || 'Universal Smart POS',
          items,
          subtotal,
          vatAmount,
          totalPaid,
          paymentMethod: 'Settled via Bakong KHQR Instant Pay',
          paymentTxId: `#KHQR-${Math.floor(1000000 + Math.random() * 8999999)}-TX`,
          isPaid: true,
          membershipProgramName: `${mName} Club`,
          loyaltyTier: 'ACTIVE MEMBER',
          memberId: USER_PROFILE.memberId,
          pointsEarned,
          pointBalance: USER_PROFILE.totalPoints + pointsEarned,
          nextTierPointsNeeded: 100,
          nextTierName: 'Gold VIP',
          paperSavedCount: 1,
          carbonAvoidedGrams: 0.04,
          verifyHash: generateHash(trimmed),
          taxQrCodeText: trimmed.slice(0, 64),
          barcodeNumber: `2 4 1 1 2 0 2 6 ${String(randomNum).split('').join(' ')} 0 1`,
        },
      };
    } catch {
      // Fall through to generic/KHQR parsing
    }
  }

  // 4. Check URL format (?receipt=... or ?merchant=...&amount=...)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      const paramReceiptId = url.searchParams.get('receipt') || url.searchParams.get('id');
      if (paramReceiptId) {
        const matchByParam = existingReceipts.find(
          (r) =>
            r.id.toLowerCase() === paramReceiptId.toLowerCase() ||
            r.receiptNumber.replace('#', '').toLowerCase() === paramReceiptId.toLowerCase()
        );
        if (matchByParam) return { receipt: matchByParam, isExisting: true };
      }

      const merchant =
        url.searchParams.get('merchant') ||
        url.searchParams.get('store') ||
        hintMerchantName ||
        url.hostname.replace('www.', '');
      const amountParam = parseFloat(url.searchParams.get('amount') || url.searchParams.get('total') || '12.50');
      const totalPaid = Number.isNaN(amountParam) ? 12.5 : amountParam;
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const pointsEarned = Math.max(5, Math.round(totalPaid * 1.5));

      return {
        isExisting: false,
        receipt: {
          id: `RCP-POS-${randomNum}`,
          receiptNumber: `#${paramReceiptId || `POS-${randomNum}`}`,
          merchantName: merchant,
          merchantCategory: 'POS Web QR e-Receipt',
          merchantBranch: url.searchParams.get('branch') || 'POS Connected Terminal',
          merchantLogoUrl: '',
          isTaxInvoice: true,
          orderQueueNumber: `#Q-${String(randomNum).slice(0, 3)}`,
          orderQueueStatus: 'Verified via POS QR',
          pickupCounter: 'POS Counter',
          dateTime: formatNowFull(),
          dateShort: formatNowShort(),
          cashier: 'POS Terminal Auto-Sync',
          posTerminal: url.hostname,
          items: [
            {
              name: url.searchParams.get('item') || 'POS Checkout Purchase',
              sku: 'POS-URL-01',
              qty: 1,
              price: totalPaid,
              total: totalPaid,
            },
          ],
          subtotal: totalPaid,
          vatAmount: Number((totalPaid * 0.1).toFixed(2)),
          totalPaid,
          paymentMethod: 'Settled via Digital POS QR',
          paymentTxId: `#QR-${randomNum}-TX`,
          isPaid: true,
          membershipProgramName: `${merchant} Rewards`,
          loyaltyTier: 'ACTIVE MEMBER',
          memberId: USER_PROFILE.memberId,
          pointsEarned,
          pointBalance: USER_PROFILE.totalPoints + pointsEarned,
          nextTierPointsNeeded: 120,
          nextTierName: 'Gold VIP',
          paperSavedCount: 1,
          carbonAvoidedGrams: 0.04,
          verifyHash: generateHash(trimmed),
          taxQrCodeText: trimmed.slice(0, 64),
          barcodeNumber: `2 4 1 1 2 0 2 6 ${String(randomNum).split('').join(' ')} 1 9`,
        },
      };
    } catch {
      // Fall through
    }
  }

  // 5. Check EMVCo KHQR string or generic POS QR text
  const khqr = tryParseEmvKhqr(trimmed);
  const merchantName =
    khqr?.merchantName ||
    (hintMerchantName && hintMerchantName !== 'Merchant QR Terminal'
      ? hintMerchantName
      : 'Merchant POS Terminal');
  const totalPaid = khqr?.amount ?? (trimmed.includes('KHQR') ? 14.50 : 9.80);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const pointsEarned = Math.max(5, Math.round(totalPaid * 1.5));

  return {
    isExisting: false,
    receipt: {
      id: `RCP-POS-${randomNum}`,
      receiptNumber: `#POS-${randomNum}`,
      merchantName,
      merchantCategory: khqr
        ? `Bakong KHQR Merchant (${khqr.city || 'Phnom Penh'})`
        : 'POS Scanned Digital Receipt',
      merchantBranch: khqr?.city ? `${khqr.city}, Cambodia` : 'POS Counter Terminal',
      merchantLogoUrl: '',
      isTaxInvoice: true,
      orderQueueNumber: `#P-${String(randomNum).slice(0, 3)}`,
      orderQueueStatus: 'Synced from POS QR',
      pickupCounter: 'Checkout Counter',
      dateTime: formatNowFull(),
      dateShort: formatNowShort(),
      cashier: 'POS Terminal',
      posTerminal: `QR Ref: ${trimmed.slice(0, 22)}${trimmed.length > 22 ? '…' : ''}`,
      items: [
        {
          name: khqr ? 'KHQR Instant POS Settlement' : `POS Order (${trimmed.slice(0, 18)})`,
          sku: `POS-${randomNum}`,
          qty: 1,
          price: totalPaid,
          total: totalPaid,
        },
      ],
      subtotal: totalPaid,
      vatAmount: Number((totalPaid * 0.1).toFixed(2)),
      totalPaid,
      paymentMethod: khqr
        ? 'Settled via Bakong KHQR Instant Pay'
        : 'Settled at Merchant POS Terminal',
      paymentTxId: `#KHQR-${Math.floor(1000000 + Math.random() * 8999999)}-TX`,
      isPaid: true,
      membershipProgramName: `${merchantName} Club`,
      loyaltyTier: 'ACTIVE MEMBER',
      memberId: USER_PROFILE.memberId,
      pointsEarned,
      pointBalance: USER_PROFILE.totalPoints + pointsEarned,
      nextTierPointsNeeded: 120,
      nextTierName: 'Gold Tier',
      paperSavedCount: 1,
      carbonAvoidedGrams: 0.04,
      verifyHash: generateHash(trimmed),
      taxQrCodeText: trimmed.slice(0, 64),
      barcodeNumber: `2 4 1 1 2 0 2 6 ${String(randomNum).split('').join(' ')} 0 7`,
    },
  };
}
