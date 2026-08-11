import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { formatThrownError, getScanUsage } from '../_shared/quota.ts';
import { isProSubscriber } from '../_shared/revenuecat.ts';

type ScanStatusRequest = {
  appUserId?: string;
};

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method_not_allowed' }, 405);
  }

  try {
    const body = (await request.json()) as ScanStatusRequest;
    const appUserId = body.appUserId?.trim();

    if (!appUserId) {
      return jsonResponse({ error: 'missing_app_user_id' }, 400);
    }

    const isPro = await isProSubscriber(appUserId);
    const usage = await getScanUsage(appUserId, isPro);

    return jsonResponse({ usage });
  } catch (error) {
    console.error('scan-status function failed:', error);
    const message = formatThrownError(error);
    return jsonResponse({ error: 'scan_status_failed', message }, 500);
  }
});
