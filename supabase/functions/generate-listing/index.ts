import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { formatThrownError } from '../_shared/quota.ts';
import { generateListing, type AnalysisResult } from '../_shared/gemini.ts';

type GenerateListingRequest = {
  item?: AnalysisResult;
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
    const body = (await request.json()) as GenerateListingRequest;
    const item = body.item;
    const contentLocale = body.contentLocale?.trim() || 'en';
    const regionCode = body.regionCode?.trim() || 'SI';

    if (
      !item?.objectName ||
      !item.condition ||
      typeof item.estimatedPriceEUR !== 'number' ||
      !item.explanation ||
      !item.marketplaceSearchQuery
    ) {
      return jsonResponse({ error: 'invalid_item_payload' }, 400);
    }

    const listing = await generateListing({
      item,
      contentLocale,
      regionCode,
    });

    return jsonResponse({ listing });
  } catch (error) {
    console.error('generate-listing function failed:', error);
    const message = formatThrownError(error);
    return jsonResponse({ error: 'listing_failed', message }, 500);
  }
});
