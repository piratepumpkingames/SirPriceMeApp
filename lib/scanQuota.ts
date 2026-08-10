import AsyncStorage from '@react-native-async-storage/async-storage';

export const FREE_SCANS_PER_MONTH = 10;

const STORAGE_KEY = '@sirpriceme/scanUsage';

type ScanUsage = {
  month: string;
  count: number;
};

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

async function loadUsage(): Promise<ScanUsage> {
  const month = currentMonthKey();
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return { month, count: 0 };
  }

  try {
    const parsed = JSON.parse(raw) as ScanUsage;
    if (parsed.month !== month) {
      return { month, count: 0 };
    }

    return { month, count: parsed.count ?? 0 };
  } catch {
    return { month, count: 0 };
  }
}

export async function getScanUsage(): Promise<{
  used: number;
  limit: number;
  remaining: number;
}> {
  const usage = await loadUsage();
  const limit = FREE_SCANS_PER_MONTH;

  return {
    used: usage.count,
    limit,
    remaining: Math.max(0, limit - usage.count),
  };
}

export async function canPerformScan(isPro: boolean): Promise<boolean> {
  if (isPro) {
    return true;
  }

  const { remaining } = await getScanUsage();
  return remaining > 0;
}

export async function recordScan(isPro: boolean): Promise<void> {
  if (isPro) {
    return;
  }

  const usage = await loadUsage();
  usage.count += 1;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
}
