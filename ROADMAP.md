# SirPriceMe — Roadmap

## Next up (before wider Play release)

- **Privacy sync (Play Console):** Confirm **Varnost podatkov** matches live backend handling (`docs/privacy.html` already mentions Supabase, Gemini proxy, RevenueCat, scan quota — updated 11 Aug 2026).
- **Production track:** Promote tested AAB from internal testing to **Open testing** or **Production** when ready.
- **Store listing polish:** Feature graphic, screenshots, short description — assets partly in repo (`assets/play-feature-graphic.png`, `assets/screenshots/`).

## Ready for audience

The app is **functionally shippable**: Supabase backend live, production AAB verified on device (analyze, quota, listing assist, Pro paywall), Gemini key server-side only.

## Done

- **Supabase deploy:** Project linked, `db push`, Edge Function secrets, `analyze` / `generate-listing` / `scan-status` deployed — see [docs/supabase-setup.md](docs/supabase-setup.md).
- **Production build:** AAB without `EXPO_PUBLIC_GEMINI_API_KEY`; Supabase + RevenueCat env vars only; Play install smoke-tested OK.
- **Launcher icons:** Scaled for Android adaptive icon safe zone (lens + price tag visible on home screen).
- **Supabase code (in repo):** Edge Functions (Gemini proxy, RevenueCat Pro check, scan quota), client `lib/aiBackend.ts`, server-authoritative quota when configured.
- **Paywall + Pro gating:** RevenueCat yearly `sirpriceme_pro_yearly`, PDF export, custom rooms, client/server scan limits.
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

## Later (optional)

- **Backend hardening:** Retry Gemini on 503/429; consume scan quota only after successful analyze.
- **Marketplace handoff:** Open “create listing” URLs instead of search (Bolha, FB); eBay publish via official API if demand warrants it.
- Richer marketplace search terms (synonyms, local phrasing).
- Branch strategy for bigger feature experiments.
- AI read serial/model from label photos.
