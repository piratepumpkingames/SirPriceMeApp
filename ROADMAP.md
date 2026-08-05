# SirPriceMe — Roadmap

## Next up

- *(Nothing queued — see **Later** for optional ideas.)*

## Done

- **Sell photo handoff:** Share photos, save to gallery, full photo gallery on Sell screen, workflow hint.
- **Insurance IDs + multi-photo:** Barcode scan, serial/model fields, multiple photos per item, PDF export of IDs.
- **UX polish batch (6–9):** Shared design language, catalog item detail screen, empty states & hints, analyzing overlay.
- **Quality-of-life batch:** Save PDF to phone, edit items, mark as sold, delete items, manage custom rooms.
- **Phase 3 — Catalog PDF:** Export catalog as PDF with disclaimer footer and per-item lines.
- **Phase 2 — Sell assist:** AI-generated listing title and description on the Sell screen (copy-paste for Bolha, Facebook, etc.).

## Before public Play Store release

> **Reminder:** Move Gemini API calls behind a small backend proxy.

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
