import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { analyzePhoto } from '../_shared/gemini.ts';
import { consumeScanIfAllowed, formatThrownError } from '../_shared/quota.ts';
import { isProSubscriber } from '../_shared/revenuecat.ts';

type AnalyzeRequest = {
  appUserId?: string;
  imageBase64?: string;
  mimeType?: string;
  contentLocale?: string;
  regionCode?: string;
};

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  }

  try {
    const body = (await request.json()) as AnalyzeRequest;
    const appUserId = body.appUserId?.trim();
    const imageBase64 = body.imageBase64?.trim();
    const mimeType = body.mimeType?.trim() || 'image/jpeg';
    const contentLocale = body.contentLocale?.trim() || 'en';
    const regionCode = body.regionCode?.trim() || 'SI';

    if (!appUserId) {
      return jsonResponse({ error: 'missing_app_user_id' }, 400);
    }

    if (!imageBase64) {
      return jsonResponse({ error: 'missing_image' }, 400);
    }

    const isPro = await isProSubscriber(appUserId);
    const quota = await consumeScanIfAllowed(appUserId, isPro);

    if (!quota.allowed) {
      return jsonResponse(
        {
          error: 'scan_limit_exceeded',
          usage: quota.usage,
        },
        429,
      );
    }

    const analysis = await analyzePhoto({
      imageBase64,
      mimeType,
      contentLocale,
      regionCode,
    });

    return jsonResponse({
      analysis,
      usage: quota.usage,
    });
  } catch (error) {
    console.error('analyze function failed:', error);
    const message = formatThrownError(error);
    return jsonResponse({ error: 'analyze_failed', message }, 500);
  }
});
