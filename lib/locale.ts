import { getLocales } from 'expo-localization';

export type LanguageMode = 'en' | 'local';
export type ContentLocale = 'en' | 'sl' | 'hr' | 'de';

type UiStrings = {
  subtitle: string;
  languageLabel: string;
  languageEnglish: string;
  takePhoto: string;
  analyze: string;
  analyzing: string;
  photoHint: string;
  condition: string;
  explanation: string;
  whereToSell: string;
  marketplaceHint: string;
  cameraCancel: string;
  cameraCapture: string;
  cameraPermission: string;
  analyzeFailedTitle: string;
  linkOpenFailedTitle: string;
  linkOpenFailedMessage: string;
  genericError: string;
};

const LOCALE_NAMES: Record<ContentLocale, string> = {
  en: 'English',
  sl: 'Slovenian',
  hr: 'Croatian',
  de: 'German',
};

const LOCAL_LANGUAGE_LABELS: Record<ContentLocale, string> = {
  en: 'Local',
  sl: 'Slovenščina',
  hr: 'Hrvatski',
  de: 'Deutsch',
};

const REGION_NAMES: Record<string, string> = {
  SI: 'Slovenia',
  HR: 'Croatia',
  DE: 'Germany',
  AT: 'Austria',
  US: 'United States',
  GB: 'United Kingdom',
};

const DEVICE_LANGUAGE_TO_CONTENT: Record<string, ContentLocale> = {
  sl: 'sl',
  hr: 'hr',
  de: 'de',
};

export const ui: Record<ContentLocale, UiStrings> = {
  en: {
    subtitle: 'Take a photo of any object to estimate its value',
    languageLabel: 'Results language',
    languageEnglish: 'English',
    takePhoto: 'Take photo',
    analyze: 'Analyze',
    analyzing: 'Analyzing...',
    photoHint: 'Your photo will appear here',
    condition: 'Condition',
    explanation: 'Explanation',
    whereToSell: 'Where to sell',
    marketplaceHint:
      'Local-language searches help Facebook Marketplace show nearby listings.',
    cameraCancel: 'Cancel',
    cameraCapture: 'Capture',
    cameraPermission: 'Camera permission is required to take photos.',
    analyzeFailedTitle: 'Analyze failed',
    linkOpenFailedTitle: 'Could not open link',
    linkOpenFailedMessage: 'Try again or open the link in your browser.',
    genericError: 'Something went wrong.',
  },
  sl: {
    subtitle: 'Fotografirajte predmet in ocenite njegovo vrednost',
    languageLabel: 'Jezik rezultatov',
    languageEnglish: 'Angleščina',
    takePhoto: 'Fotografiraj',
    analyze: 'Analiziraj',
    analyzing: 'Analiziram...',
    photoHint: 'Vaša fotografija bo prikazana tukaj',
    condition: 'Stanje',
    explanation: 'Pojasnilo',
    whereToSell: 'Kje prodati',
    marketplaceHint:
      'Iskanje v slovenščini pomaga Facebook Marketplace prikazati bližnje oglase.',
    cameraCancel: 'Prekliči',
    cameraCapture: 'Posnemi',
    cameraPermission: 'Za fotografiranje potrebujete dovoljenje za kamero.',
    analyzeFailedTitle: 'Analiza ni uspela',
    linkOpenFailedTitle: 'Povezave ni mogoče odpreti',
    linkOpenFailedMessage: 'Poskusite znova ali odprite povezavo v brskalniku.',
    genericError: 'Prišlo je do napake.',
  },
  hr: {
    subtitle: 'Fotografirajte predmet i procijenite njegovu vrijednost',
    languageLabel: 'Jezik rezultata',
    languageEnglish: 'Engleski',
    takePhoto: 'Fotografiraj',
    analyze: 'Analiziraj',
    analyzing: 'Analiziram...',
    photoHint: 'Vaša fotografija bit će ovdje',
    condition: 'Stanje',
    explanation: 'Objašnjenje',
    whereToSell: 'Gdje prodati',
    marketplaceHint:
      'Pretraga na hrvatskom pomaže Facebook Marketplaceu prikazati obližnje oglase.',
    cameraCancel: 'Odustani',
    cameraCapture: 'Snimi',
    cameraPermission: 'Potrebna je dozvola za kameru.',
    analyzeFailedTitle: 'Analiza nije uspjela',
    linkOpenFailedTitle: 'Ne mogu otvoriti poveznicu',
    linkOpenFailedMessage: 'Pokušajte ponovno ili otvorite poveznicu u pregledniku.',
    genericError: 'Nešto je pošlo po krivu.',
  },
  de: {
    subtitle: 'Fotografieren Sie einen Gegenstand und schätzen Sie den Wert',
    languageLabel: 'Ergebnissprache',
    languageEnglish: 'Englisch',
    takePhoto: 'Foto aufnehmen',
    analyze: 'Analysieren',
    analyzing: 'Analysiere...',
    photoHint: 'Ihr Foto erscheint hier',
    condition: 'Zustand',
    explanation: 'Erklärung',
    whereToSell: 'Wo verkaufen',
    marketplaceHint:
      'Suche in der Landessprache hilft Facebook Marketplace, Angebote in der Nähe zu zeigen.',
    cameraCancel: 'Abbrechen',
    cameraCapture: 'Aufnehmen',
    cameraPermission: 'Kamerazugriff ist erforderlich.',
    analyzeFailedTitle: 'Analyse fehlgeschlagen',
    linkOpenFailedTitle: 'Link konnte nicht geöffnet werden',
    linkOpenFailedMessage: 'Erneut versuchen oder im Browser öffnen.',
    genericError: 'Etwas ist schiefgelaufen.',
  },
};

export function getDeviceLocale() {
  const locale = getLocales()[0];

  return {
    languageCode: locale.languageCode ?? 'en',
    regionCode: locale.regionCode ?? 'US',
  };
}

export function resolveContentLocale(mode: LanguageMode): ContentLocale {
  if (mode === 'en') {
    return 'en';
  }

  const { languageCode } = getDeviceLocale();
  return DEVICE_LANGUAGE_TO_CONTENT[languageCode] ?? 'en';
}

export function getLocalLanguageLabel(): string {
  const { languageCode } = getDeviceLocale();
  const contentLocale = DEVICE_LANGUAGE_TO_CONTENT[languageCode] ?? 'en';
  return LOCAL_LANGUAGE_LABELS[contentLocale];
}

export function getStrings(contentLocale: ContentLocale): UiStrings {
  return ui[contentLocale];
}

export function getLanguageNameForAI(contentLocale: ContentLocale): string {
  return LOCALE_NAMES[contentLocale];
}

export function getRegionNameForAI(regionCode: string): string {
  return REGION_NAMES[regionCode] ?? regionCode;
}
