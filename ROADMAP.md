# SirPriceMe — Roadmap

## Next up

- **Play subscription:** Create and activate `sirpriceme_pro_yearly` → RevenueCat → Supabase proxy + scan quota.
- **Monetization stack:** RevenueCat (yearly Pro) + Supabase Edge Function; 10 scans/month free; listing generation not counted.

## Done

- **Play setup (partial):** Internal testing, app access declarations, privacy policy URL live at [privacy.html](https://piratepumpkingames.github.io/SirPriceMeApp/privacy.html).

- **Sell photo handoff:** Share photos, save to gallery, full photo gallery on Sell screen, workflow hint.
- **Insurance IDs + multi-photo:** Barcode scan, serial/model fields, multiple photos per item, PDF export of IDs.
- **UX polish batch (6–9):** Shared design language, catalog item detail screen, empty states & hints, analyzing overlay.
- **Quality-of-life batch:** Save PDF to phone, edit items, mark as sold, delete items, manage custom rooms.
- **Phase 3 — Catalog PDF:** Export catalog as PDF with disclaimer footer and per-item lines.
- **Phase 2 — Sell assist:** AI-generated listing title and description on the Sell screen (copy-paste for Bolha, Facebook, etc.).

## Before public Play Store release

> **Reminder:** Keep `docs/privacy.html` and Play Console **Varnost podatkov** (Data safety) in sync.

Whenever you add or change data handling (Supabase proxy, RevenueCat, Sentry, scan quotas, etc.):

1. Update `docs/privacy.html`, `docs/data-deletion.html`, and the “Zadnja posodobitev” date at the top.
2. Update the **Varnost podatkov** form in Play Console so it matches the privacy policy (same data types, purposes, third parties, retention).
3. Re-check the privacy policy URL in **Pravilnik o zasebnosti** if the page path changes.

> **Reminder:** Move Gemini API calls behind a small backend proxy (Supabase Edge Function + RevenueCat entitlement check).

Today the app uses `EXPO_PUBLIC_GEMINI_API_KEY`, which is embedded in the client bundle at build time. That is fine for personal preview APKs and Expo Go development, but **not** safe for a public Play Store app — anyone can extract the key from the APK.

When preparing for release:

1. Add a lightweight backend (e.g. Expo API route, Cloud Function, or small server) that holds the Gemini key server-side.
2. Have the app send the photo (or a signed upload URL flow) to *your* backend; the backend calls Gemini and returns the JSON result.
3. Remove `EXPO_PUBLIC_GEMINI_API_KEY` from client builds; use auth/rate limits on the backend if needed.

Ask in a chat: *"remind me about the backend proxy for the Gemini key"* — this file is the source of truth.

## Later (optional)

- Richer marketplace search terms (synonyms, local phrasing).
- Branch strategy for bigger feature experiments.
- AI read serial/model from label photos.
