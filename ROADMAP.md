# SirPriceMe — Roadmap

## Next up

- **Supabase deploy:** Create project, `supabase db push`, deploy `analyze`, `generate-listing`, `scan-status`, set secrets — see [docs/supabase-setup.md](docs/supabase-setup.md).
- **Production build:** Ship AAB **without** `EXPO_PUBLIC_GEMINI_API_KEY`; Supabase env vars only.
- **Privacy sync:** Update `docs/privacy.html` + Play **Varnost podatkov** when backend goes live.

## Done

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

- Richer marketplace search terms (synonyms, local phrasing).
- Branch strategy for bigger feature experiments.
- AI read serial/model from label photos.
