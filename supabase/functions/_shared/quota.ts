import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

export const FREE_SCANS_PER_MONTH = 10;

export type ScanUsageSnapshot = {
  used: number;
  limit: number;
  remaining: number;
  isPro: boolean;
};

function currentMonthKey(): string {
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${now.getUTCFullYear()}-${month}`;
}

function getServiceRoleKey(): string {
  const legacyKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim();
  if (legacyKey) {
    return legacyKey;
  }

  const singleSecretKey = Deno.env.get('SUPABASE_SECRET_KEY')?.trim();
  if (singleSecretKey) {
    return singleSecretKey;
  }

  const secretKeysJson = Deno.env.get('SUPABASE_SECRET_KEYS')?.trim();
  if (secretKeysJson) {
    const keys = JSON.parse(secretKeysJson) as Record<string, string>;
    const namedKey = keys.default ?? keys['default'] ?? Object.values(keys)[0];
    if (namedKey) {
      return namedKey;
    }
  }

  throw new Error(
    'Supabase service role is not configured (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEYS)',
  );
}

function createServiceClient() {
  const url = Deno.env.get('SUPABASE_URL');
  if (!url) {
    throw new Error('SUPABASE_URL is not configured');
  }

  return createClient(url, getServiceRoleKey());
}

export function formatThrownError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const record = error as Record<string, unknown>;
    if (typeof record.message === 'string') {
      return record.message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  return String(error);
}

export async function getScanUsage(
  appUserId: string,
  isPro: boolean,
): Promise<ScanUsageSnapshot> {
  const client = createServiceClient();
  const monthKey = currentMonthKey();

  const { data, error } = await client
    .from('scan_usage')
    .select('scan_count')
    .eq('app_user_id', appUserId)
    .eq('month_key', monthKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const used = data?.scan_count ?? 0;
  const limit = FREE_SCANS_PER_MONTH;

  return {
    used,
    limit,
    remaining: isPro ? limit : Math.max(0, limit - used),
    isPro,
  };
}

export async function consumeScanIfAllowed(
  appUserId: string,
  isPro: boolean,
): Promise<{ allowed: true; usage: ScanUsageSnapshot } | { allowed: false; usage: ScanUsageSnapshot }> {
  const usage = await getScanUsage(appUserId, isPro);

  if (isPro) {
    return { allowed: true, usage };
  }

  if (usage.used >= FREE_SCANS_PER_MONTH) {
    return { allowed: false, usage };
  }

  const client = createServiceClient();
  const monthKey = currentMonthKey();
  const nextCount = usage.used + 1;

  const { error } = await client.from('scan_usage').upsert(
    {
      app_user_id: appUserId,
      month_key: monthKey,
      scan_count: nextCount,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'app_user_id,month_key' },
  );

  if (error) {
    throw error;
  }

  return {
    allowed: true,
    usage: {
      used: nextCount,
      limit: FREE_SCANS_PER_MONTH,
      remaining: Math.max(0, FREE_SCANS_PER_MONTH - nextCount),
      isPro: false,
    },
  };
}
