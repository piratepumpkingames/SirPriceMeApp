import AsyncStorage from '@react-native-async-storage/async-storage';

const DISCLAIMER_KEY = '@sirpriceme/disclaimer_accepted';

export async function isDisclaimerAccepted(): Promise<boolean> {
  const value = await AsyncStorage.getItem(DISCLAIMER_KEY);
  return value === 'true';
}

export async function setDisclaimerAccepted(): Promise<void> {
  await AsyncStorage.setItem(DISCLAIMER_KEY, 'true');
}
