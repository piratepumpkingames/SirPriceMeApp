import AsyncStorage from '@react-native-async-storage/async-storage';

const PDF_HINT_KEY = '@sirpriceme/hint_pdf_export_dismissed';

export async function isPdfExportHintDismissed(): Promise<boolean> {
  const value = await AsyncStorage.getItem(PDF_HINT_KEY);
  return value === 'true';
}

export async function dismissPdfExportHint(): Promise<void> {
  await AsyncStorage.setItem(PDF_HINT_KEY, 'true');
}
