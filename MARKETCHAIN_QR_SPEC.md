# MarketChain POS Receipt QR Specification

This document defines the QR code formats supported by the **E-Member** app (`src/utils/posReceiptParser.ts`) for scanning receipts directly from a **MarketChain POS** customer display screen into the full-screen thermal paper receipt preview.

---

## 1. Recommended Format: JSON Payload (Multi-Item POS Receipt)

Generate a minified UTF-8 JSON string inside the QR code so MarketChain can pass full itemized receipt data directly to E-Member.

### Schema

| Field | Type | Required | Description / App Behavior |
| :--- | :--- | :---: | :--- |
| `id` | `string` | Optional | Unique receipt ID (e.g. `"RCP-MC-1042"`). Auto-generated (`RCP-POS-xxxx`) if omitted. |
| `receiptNumber` | `string` | Recommended | Invoice number displayed on the receipt (e.g. `"#MC-2026-1042"`). |
| `merchantName` | `string` | **Yes** | Store name (alias: `merchant`). |
| `branch` | `string` | Optional | Branch address or location. Defaults to `"Phnom Penh Main Branch"`. |
| `posTerminal` | `string` | Optional | Terminal identifier (e.g. `"MarketChain POS v4.2"`). |
| `orderQueueNumber` | `string` | Optional | Queue/pickup call number (e.g. `"#C-025"`). |
| `totalPaid` | `number` | Recommended | Final paid amount in USD (alias: `total`). Defaults to sum of `items`. |
| `items` | `Array<Item>` | Recommended | Line items purchased (defaults to 1 generic item if omitted). |
| `items[].name` | `string` | **Yes** | Product or menu item name. |
| `items[].sku` | `string` | Optional | Product SKU code. |
| `items[].qty` | `number` | Optional | Quantity (defaults to `1`). |
| `items[].price` | `number` | Optional | Unit price in USD. |
| `items[].total` | `number` | Optional | Line total (defaults to `qty * price`). |

> **Auto-calculated by E-Member on scan:**
> - `vatAmount`: 10% of `totalPaid`
> - `pointsEarned`: `Math.max(5, Math.round(totalPaid * 1.5))`
> - `dateTime` / `dateShort`: Current scan timestamp
> - `verifyHash`: Generated verification hash
> - `memberId`: Linked to the active member profile (`USER_PROFILE.memberId`)

### Example Payload (Readable)

```json
{
  "id": "RCP-MC-20261127-018",
  "receiptNumber": "#MC-2026-0892",
  "merchantName": "Austin Coffee",
  "branch": "No. 45, St 306, BKK1, Phnom Penh",
  "posTerminal": "MarketChain POS v4.2",
  "orderQueueNumber": "#C-025",
  "totalPaid": 11.75,
  "items": [
    {
      "name": "Iced Oat Spanish Latte",
      "sku": "AC-LATTE-01",
      "qty": 2,
      "price": 4.25,
      "total": 8.50
    },
    {
      "name": "Almond Butter Croissant",
      "sku": "AC-CROIS-02",
      "qty": 1,
      "price": 3.25,
      "total": 3.25
    }
  ]
}
```

### Example Payload (Minified for QR Encoding)

```text
{"id":"RCP-MC-20261127-018","receiptNumber":"#MC-2026-0892","merchantName":"Austin Coffee","branch":"No. 45, St 306, BKK1, Phnom Penh","posTerminal":"MarketChain POS v4.2","orderQueueNumber":"#C-025","totalPaid":11.75,"items":[{"name":"Iced Oat Spanish Latte","sku":"AC-LATTE-01","qty":2,"price":4.25,"total":8.5},{"name":"Almond Butter Croissant","sku":"AC-CROIS-02","qty":1,"price":3.25,"total":3.25}]}
```

---

## 2. Alternative Format: URL Query String (Lightweight)

If MarketChain generates a web receipt URL instead of raw JSON, E-Member parses the following query parameters:

```text
https://pos.marketchain.example/receipt?id=MC-2026-0892&merchant=Austin%20Coffee&branch=BKK1%20Flagship&amount=11.75&item=Iced%20Oat%20Latte
```

| Parameter | Alias | Description |
| :--- | :--- | :--- |
| `receipt` | `id` | Receipt ID or number (matches an existing wallet receipt if already saved). |
| `merchant` | `store` | Store name. |
| `branch` | — | Branch location. |
| `amount` | `total` | Paid total in USD. |
| `item` | — | Single-line order summary. |

---

## 3. Alternative Format: EMVCo KHQR String

If the POS screen displays a standard **Bakong KHQR** (`000201...`) TLV string, E-Member extracts:

- **Tag `59`**: Merchant Name
- **Tag `54`**: Transaction Amount
- **Tag `60`**: Merchant City

---

## 4. QR Rendering Guidelines for MarketChain POS Displays

- **Character Encoding**: UTF-8
- **Error Correction Level**: `M` (15%) — balances density and scan speed on backlit/glossy POS monitors
- **Quiet Zone**: At least 2–4 modules of solid white border around the QR code
- **Color Contrast**: Pure dark foreground (`#000000` or `#0B1C30`) on pure white (`#FFFFFF`); avoid inverted dark-mode QR codes
- **Recommended Display Size**: `220×220 px` to `280×280 px` on customer-facing screens
- **Recommended Max Payload Size**: Keep minified JSON under **450–500 bytes** (omit optional fields or shorten long SKUs on large orders so mobile cameras focus quickly)
