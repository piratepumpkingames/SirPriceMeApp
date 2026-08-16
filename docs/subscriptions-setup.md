# Subscriptions setup (Google Play + RevenueCat)

SirPriceMe Pro uses **three auto-renewing subscriptions** on Google Play, sold through **RevenueCat**:

| Plan | Product ID | Discount vs monthly |
|------|------------|---------------------|
| 1 month | `sirpriceme_pro_monthly` | — (base price) |
| 6 months | `sirpriceme_pro_6month` | **25%** off vs 6× monthly |
| 1 year | `sirpriceme_pro_yearly` | **50%** off vs 12× monthly |

All three unlock the same **`pro`** entitlement in the app.

---

## 1. Choose a monthly base price

Pick your **1-month** price in Google Play (example: **€3.99**).

Then set the other plans using this math:

| Plan | Formula | Example (€3.99/mo base) |
|------|---------|-------------------------|
| 6 months | `monthly × 6 × 0.75` | **€17.96** |
| 1 year | `monthly × 12 × 0.50` | **€23.94** |

In Play Console you enter the **total price for the whole period** (not per month).

---

## 2. Google Play Console

1. Open [Google Play Console](https://play.google.com/console) → your app → **Monetize → Products → Subscriptions**.
2. Create **three subscriptions** (or add to an existing subscription group):

   **Monthly**
   - Product ID: `sirpriceme_pro_monthly`
   - Billing period: **1 month**
   - Price: your base (e.g. €3.99)

   **6 months**
   - Product ID: `sirpriceme_pro_6month`
   - Billing period: **6 months**
   - Price: monthly × 6 × 0.75 (e.g. €17.96)

   **Yearly** (may already exist)
   - Product ID: `sirpriceme_pro_yearly`
   - Billing period: **1 year**
   - Price: monthly × 12 × 0.50 (e.g. €23.94)

3. Put all three in the **same subscription group** so users can upgrade/downgrade between them.
4. Activate each subscription when ready for testing.

---

## 3. RevenueCat dashboard

1. Go to [RevenueCat](https://app.revenuecat.com) → your project → **Products**.
2. Add Android products matching the Play IDs above.
3. Open **Entitlements** → ensure entitlement **`pro`** includes all three products.
4. Open **Offerings** → edit your **current** offering (e.g. `default`):
   - Add package **Monthly** → `sirpriceme_pro_monthly`
   - Add package **Six month** → `sirpriceme_pro_6month`
   - Add package **Annual** → `sirpriceme_pro_yearly`
5. Save and confirm **Current offering** is set for the Android app.

RevenueCat package identifiers used by the app:

| Plan | RC package type | Typical identifier |
|------|-----------------|-------------------|
| Monthly | Monthly | `$rc_monthly` |
| 6 months | Six month | `$rc_six_month` |
| Yearly | Annual | `$rc_annual` |

The app also falls back to matching by **product ID** if package names differ.

---

## 4. Test

1. Add **license testers** in Play Console (Setup → License testing).
2. Install a **production or internal testing** build (not Expo Go — billing is disabled there).
3. Open the Pro paywall in the app:
   - You should see **three selectable plans** with prices from Google Play.
   - **6 months** shows a green **Prihrani 25%** badge.
   - **1 year** shows **Prihrani 50%**.
4. Complete a test purchase with a license tester account.
5. Confirm **Pro** unlocks (unlimited scans, PDF, custom rooms).

---

## 5. App code reference

- Product IDs: `lib/purchases.ts` → `PRO_PRODUCT_IDS`
- Paywall UI: `components/ProPaywallModal.tsx`
- Discount badges: `PRO_PLAN_DISCOUNTS` (25% / 50%) — marketing labels aligned with Play pricing above

If a plan is missing from the paywall, check RevenueCat **Offerings** and that the product is **Active** in Play Console.

---

## 6. Play Console listing (Slovenia)

When you publish, mention all three options in your subscription disclosure. Example copy:

> SirPriceMe Pro: mesečna, 6-mesečna ali letna naročnina. Letna naročnina prihrani 50 % v primerjavi z 12 mesečnimi plačili.

Update `docs/privacy.html` if you change billing periods or processors.
