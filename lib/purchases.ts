import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

export const PRO_ENTITLEMENT_ID = 'pro';
export const PRO_PRODUCT_ID = 'sirpriceme_pro_yearly';

const APP_USER_ID_KEY = '@sirpriceme/appUserId';

function createAnonymousId(): string {
  const suffix = Math.random().toString(36).slice(2, 11);
  return `spm_${Date.now()}_${suffix}`;
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
  if (Platform.OS !== 'android') {
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
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== 'undefined';
  } catch {
    return false;
  }
}
