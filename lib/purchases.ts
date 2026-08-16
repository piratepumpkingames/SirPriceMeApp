import AsyncStorage from '@react-native-async-storage/async-storage';
import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';

export const PRO_ENTITLEMENT_ID = 'pro';

export const PRO_PRODUCT_IDS = {
  monthly: 'sirpriceme_pro_monthly',
  sixMonth: 'sirpriceme_pro_6month',
  yearly: 'sirpriceme_pro_yearly',
} as const;

export type ProPlanId = keyof typeof PRO_PRODUCT_IDS;

/** Marketing discounts vs paying month-by-month. */
export const PRO_PLAN_DISCOUNTS: Record<ProPlanId, number | null> = {
  monthly: null,
  sixMonth: 25,
  yearly: 50,
};

/** @deprecated Use PRO_PRODUCT_IDS.yearly */
export const PRO_PRODUCT_ID = PRO_PRODUCT_IDS.yearly;

const APP_USER_ID_KEY = '@sirpriceme/appUserId';
const PRO_PLAN_ORDER: ProPlanId[] = ['monthly', 'sixMonth', 'yearly'];

export type ProPlanOption = {
  id: ProPlanId;
  package: PurchasesPackage;
  priceString: string;
  discountPercent: number | null;
};

function createAnonymousId(): string {
  const suffix = Math.random().toString(36).slice(2, 11);
  return `spm_${Date.now()}_${suffix}`;
}

export function isBillingAvailable(): boolean {
  return Platform.OS === 'android' && !isRunningInExpoGo();
}

export async function getOrCreateAppUserId(): Promise<string> {
  const existing = await AsyncStorage.getItem(APP_USER_ID_KEY);
  if (existing) {
    return existing;
  }

  const id = createAnonymousId();
  await AsyncStorage.setItem(APP_USER_ID_KEY, id);
  return id;
}

export async function initializePurchases(): Promise<void> {
  if (!isBillingAvailable()) {
    return;
  }

  const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
  if (!apiKey || apiKey === 'your_revenuecat_android_key_here') {
    console.warn(
      'RevenueCat: missing EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY. Billing library is included; configure the key before testing purchases.',
    );
    return;
  }

  const appUserID = await getOrCreateAppUserId();

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey, appUserID });
}

export async function isProSubscriber(): Promise<boolean> {
  if (!isBillingAvailable()) {
    return false;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== 'undefined';
  } catch {
    return false;
  }
}

async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  if (!isBillingAvailable()) {
    return null;
  }

  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

function resolvePlanPackage(
  offering: PurchasesOffering,
  planId: ProPlanId,
): PurchasesPackage | null {
  const productId = PRO_PRODUCT_IDS[planId];

  switch (planId) {
    case 'monthly':
      return (
        offering.monthly ??
        offering.availablePackages.find(
          (pkg) =>
            pkg.identifier === '$rc_monthly' ||
            pkg.product.identifier === productId,
        ) ??
        null
      );
    case 'sixMonth':
      return (
        offering.sixMonth ??
        offering.availablePackages.find(
          (pkg) =>
            pkg.identifier === '$rc_six_month' ||
            pkg.product.identifier === productId,
        ) ??
        null
      );
    case 'yearly':
      return (
        offering.annual ??
        offering.availablePackages.find(
          (pkg) =>
            pkg.identifier === '$rc_annual' ||
            pkg.product.identifier === productId,
        ) ??
        null
      );
  }
}

export async function getProPlans(): Promise<ProPlanOption[]> {
  const offering = await getCurrentOffering();

  if (!offering) {
    return [];
  }

  return PRO_PLAN_ORDER.flatMap((planId) => {
    const pkg = resolvePlanPackage(offering, planId);

    if (!pkg) {
      return [];
    }

    return [
      {
        id: planId,
        package: pkg,
        priceString: pkg.product.priceString,
        discountPercent: PRO_PLAN_DISCOUNTS[planId],
      },
    ];
  });
}

export async function purchaseProPlan(planId: ProPlanId): Promise<boolean> {
  const offering = await getCurrentOffering();

  if (!offering) {
    throw new Error('No subscription offering is configured.');
  }

  const pkg = resolvePlanPackage(offering, planId);

  if (!pkg) {
    throw new Error('Selected subscription plan is not available.');
  }

  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return typeof customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== 'undefined';
}

export async function getYearlyPackage(): Promise<PurchasesPackage | null> {
  const offering = await getCurrentOffering();

  if (!offering) {
    return null;
  }

  return resolvePlanPackage(offering, 'yearly');
}

export async function purchaseYearlyPro(): Promise<boolean> {
  return purchaseProPlan('yearly');
}

export async function restoreProPurchases(): Promise<boolean> {
  if (!isBillingAvailable()) {
    return false;
  }

  const customerInfo = await Purchases.restorePurchases();
  return typeof customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== 'undefined';
}
