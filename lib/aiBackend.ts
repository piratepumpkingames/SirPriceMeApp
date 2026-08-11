import type { ContentLocale } from './locale';
import { getOrCreateAppUserId } from './purchases';

export type ScanUsageSnapshot = {
  used: number;
  limit: number;
  remaining: number;
  isPro: boolean;
};

export class AiBackendError extends Error {
  code: string;
  usage?: ScanUsageSnapshot;

  constructor(code: string, message: string, usage?: ScanUsageSnapshot) {
    super(message);
    this.code = code;
    this.usage = usage;
  }
}

function normalizeSupabaseUrl(url: string): string {
  return url.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
}

function getSupabaseConfig(): { url: string; anonKey: string } | null {
  const rawUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!rawUrl || !anonKey || rawUrl.includes('your_supabase')) {
    return null;
  }

  return { url: normalizeSupabaseUrl(rawUrl), anonKey };
}

export function isAiBackendConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

async function invokeFunction<T>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<T> {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error('Supabase backend is not configured.');
  }

  const response = await fetch(`${config.url}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as T & {
    error?: string;
    message?: string;
    usage?: ScanUsageSnapshot;
  };

  if (!response.ok) {
    const code = payload.error ?? 'backend_error';
    const message =
      payload.message ??
      (code === 'scan_limit_exceeded'
        ? 'Free scan limit reached for this month.'
        : 'The AI backend request failed.');

    throw new AiBackendError(code, message, payload.usage);
  }

  return payload;
}

export async function fetchScanStatus(): Promise<ScanUsageSnapshot | null> {
  if (!isAiBackendConfigured()) {
    return null;
  }

  const appUserId = await getOrCreateAppUserId();
  const payload = await invokeFunction<{ usage: ScanUsageSnapshot }>(
    'scan-status',
    { appUserId },
  );

  return payload.usage;
}

export async function fetchPhotoAnalysis(params: {
  imageBase64: string;
  mimeType: string;
  contentLocale: ContentLocale;
  regionCode: string;
}): Promise<{
  analysis: {
    objectName: string;
    condition: string;
    estimatedPriceEUR: number;
    explanation: string;
    marketplaceSearchQuery: string;
  };
  usage?: ScanUsageSnapshot;
}> {
  const appUserId = await getOrCreateAppUserId();

  return invokeFunction('analyze', {
    appUserId,
    imageBase64: params.imageBase64,
    mimeType: params.mimeType,
    contentLocale: params.contentLocale,
    regionCode: params.regionCode,
  });
}

export async function fetchListingGeneration(params: {
  item: {
    objectName: string;
    condition: string;
    estimatedPriceEUR: number;
    explanation: string;
    marketplaceSearchQuery: string;
  };
  contentLocale: ContentLocale;
  regionCode: string;
}): Promise<{
  listing: {
    listingTitle: string;
    listingDescription: string;
  };
}> {
  return invokeFunction('generate-listing', {
    item: params.item,
    contentLocale: params.contentLocale,
    regionCode: params.regionCode,
  });
}
