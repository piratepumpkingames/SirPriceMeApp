# Supabase backend setup

SirPriceMe uses Supabase Edge Functions as a **Gemini proxy** and **server-side scan quota** (5 free photo scans per month). Listing generation goes through the same backend but does **not** consume scan quota.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Add both to your local `.env` and to the build environment before `eas build --local`.

## 2. Install Supabase CLI

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

## 3. Apply database migration

From the repo root:

```bash
supabase db push
```

This creates the `scan_usage` table used for monthly quotas.

## 4. Set Edge Function secrets

In **Supabase Dashboard → Edge Functions → Secrets** (or via CLI):

| Secret | Value |
|--------|--------|
| `GEMINI_API_KEY` | Your Google AI Studio key (server-side only) |
| `REVENUECAT_SECRET_API_KEY` | RevenueCat **Secret** API key (not the public Android key) |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically when functions run on Supabase.

## 5. Deploy functions

```bash
supabase functions deploy analyze
supabase functions deploy generate-listing
supabase functions deploy scan-status
```

## 6. Production app build

For Play Store builds **remove** `EXPO_PUBLIC_GEMINI_API_KEY` from `.env` so the Gemini key is not embedded in the APK. The app will call Supabase when `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set.

Keep `EXPO_PUBLIC_GEMINI_API_KEY` only for Expo Go / local dev without Supabase.

## 7. Verify

1. Launch the app with Supabase env vars set.
2. Home screen should show remaining scans from the server.
3. Analyze a photo — quota increments on the server.
4. After 5 scans in a calendar month (UTC), free users get the Pro paywall.

## 8. Privacy & Play Console

When this backend is live, update:

- `docs/privacy.html` and `docs/data-deletion.html`
- Play Console **Varnost podatkov** (Data safety) — mention Supabase as processor, photo data sent for AI analysis, anonymous app user ID for quota.
