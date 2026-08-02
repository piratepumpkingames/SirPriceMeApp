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
  myCatalog: string;
  sellThisItem: string;
  addToCatalog: string;
  back: string;
  scanAnother: string;
  statusInCatalog: string;
  statusForSale: string;
  statusListed: string;
  pickRoom: string;
  pickRoomHint: string;
  saveToCatalog: string;
  savedToCatalog: string;
  catalogTitle: string;
  catalogSummary: string;
  catalogEmpty: string;
  catalogDisclaimer: string;
  exportPdf: string;
  exportingPdf: string;
  exportPdfFailedTitle: string;
  pdfExportedOn: string;
  pdfUnassignedRoom: string;
  sellTitle: string;
  listingAssistTitle: string;
  listingAssistHint: string;
  generateListing: string;
  generatingListing: string;
  regenerateListing: string;
  listingTitleLabel: string;
  listingDescriptionLabel: string;
  copyTitle: string;
  copyDescription: string;
  copyAll: string;
  copiedToClipboard: string;
  listingFailedTitle: string;
  markAsListed: string;
  markedAsListed: string;
  alsoAddToCatalogTitle: string;
  alsoAddToCatalogMessage: string;
  alsoSellTitle: string;
  alsoSellMessage: string;
  yes: string;
  no: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  disclaimerCheckbox: string;
  disclaimerContinue: string;
  notesLabel: string;
  valueSourceAi: string;
  removeFromCatalog: string;
  removeFromCatalogConfirmTitle: string;
  removeFromCatalogConfirmMessage: string;
  removedFromCatalog: string;
  unmarkAsListed: string;
  unmarkAsListedConfirmTitle: string;
  unmarkAsListedConfirmMessage: string;
  unmarkedAsListed: string;
  catalogChooseRoom: string;
  roomItemCount: string;
  confirm: string;
  cancel: string;
  newRoom: string;
  newRoomTitle: string;
  newRoomHint: string;
  newRoomPlaceholder: string;
  saveRoom: string;
  roomNameRequired: string;
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
    myCatalog: 'My catalog',
    sellThisItem: 'Sell this item',
    addToCatalog: 'Add to catalog',
    back: 'Back',
    scanAnother: 'Scan another item',
    statusInCatalog: 'In catalog',
    statusForSale: 'For sale',
    statusListed: 'Listed',
    pickRoom: 'Choose a room',
    pickRoomHint: 'Group items by room for your home inventory.',
    saveToCatalog: 'Save to catalog',
    savedToCatalog: 'Saved to catalog',
    catalogTitle: 'My home catalog',
    catalogSummary: '{count} items · ~€{total} total',
    catalogEmpty: 'No items in your catalog yet. Scan something and tap Add to catalog.',
    catalogDisclaimer:
      'Estimates only. For insurance or legal use, confirm values with your insurer or a qualified appraiser.',
    exportPdf: 'Export PDF',
    exportingPdf: 'Creating PDF...',
    exportPdfFailedTitle: 'Export failed',
    pdfExportedOn: 'Exported on {date}',
    pdfUnassignedRoom: 'Unassigned',
    sellTitle: 'Sell this item',
    listingAssistTitle: 'Listing text',
    listingAssistHint: 'Copy and paste into Bolha, Facebook Marketplace, or similar.',
    generateListing: 'Generate listing',
    generatingListing: 'Writing listing...',
    regenerateListing: 'Regenerate',
    listingTitleLabel: 'Title',
    listingDescriptionLabel: 'Description',
    copyTitle: 'Copy title',
    copyDescription: 'Copy description',
    copyAll: 'Copy all',
    copiedToClipboard: 'Copied to clipboard',
    listingFailedTitle: 'Listing failed',
    markAsListed: 'Mark as listed',
    markedAsListed: 'Marked as listed for sale',
    alsoAddToCatalogTitle: 'Also add to catalog?',
    alsoAddToCatalogMessage:
      'Keep a record of this item in your home inventory before or after you sell it.',
    alsoSellTitle: 'Create a listing?',
    alsoSellMessage: 'Get marketplace links and listing help for this item.',
    yes: 'Yes',
    no: 'No',
    disclaimerTitle: 'Personal inventory only',
    disclaimerBody:
      'SirPriceMe provides estimated values using AI. These are not professional appraisals and may not match what insurers, buyers, or courts accept.\n\nYou are responsible for reviewing and correcting item details before any claim or sale.',
    disclaimerCheckbox: "I understand — don't show again",
    disclaimerContinue: 'Continue',
    notesLabel: 'Notes',
    valueSourceAi: 'AI estimate',
    removeFromCatalog: 'Remove from catalog',
    removeFromCatalogConfirmTitle: 'Remove from catalog?',
    removeFromCatalogConfirmMessage:
      'This item will stay in the app but no longer appear in your home catalog.',
    removedFromCatalog: 'Removed from catalog',
    unmarkAsListed: 'Unmark as listed',
    unmarkAsListedConfirmTitle: 'Unmark as listed?',
    unmarkAsListedConfirmMessage:
      'This item will no longer be marked as listed for sale.',
    unmarkedAsListed: 'Unmarked as listed',
    catalogChooseRoom: 'Choose a room',
    roomItemCount: '{count} items · ~€{total}',
    confirm: 'Confirm',
    cancel: 'Cancel',
    newRoom: '+ New room',
    newRoomTitle: 'New room',
    newRoomHint: 'Give this room a name you will recognize later.',
    newRoomPlaceholder: 'e.g. Shed, Basement, Kids room',
    saveRoom: 'Save room',
    roomNameRequired: 'Please enter a room name.',
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
    myCatalog: 'Moj katalog',
    sellThisItem: 'Prodaj predmet',
    addToCatalog: 'Dodaj v katalog',
    back: 'Nazaj',
    scanAnother: 'Scaniraj drug predmet',
    statusInCatalog: 'V katalogu',
    statusForSale: 'Za prodajo',
    statusListed: 'Objavljeno',
    pickRoom: 'Izberi sobo',
    pickRoomHint: 'Predmete združite po sobah za domači inventar.',
    saveToCatalog: 'Shrani v katalog',
    savedToCatalog: 'Shranjeno v katalog',
    catalogTitle: 'Moj domači katalog',
    catalogSummary: '{count} predmetov · ~€{total} skupaj',
    catalogEmpty: 'Katalog je prazen. Scanirajte predmet in tapnite Dodaj v katalog.',
    catalogDisclaimer:
      'Samo ocene. Za zavarovanje ali pravne namene preverite vrednosti pri zavarovalnici ali ocenjevalcu.',
    exportPdf: 'Izvozi PDF',
    exportingPdf: 'Pripravljam PDF...',
    exportPdfFailedTitle: 'Izvoz ni uspel',
    pdfExportedOn: 'Izvoženo {date}',
    pdfUnassignedRoom: 'Nedodeljeno',
    sellTitle: 'Prodaj predmet',
    listingAssistTitle: 'Besedilo oglasa',
    listingAssistHint: 'Kopirajte in prilepite na Bolho, Facebook Marketplace ipd.',
    generateListing: 'Ustvari oglas',
    generatingListing: 'Pripravljam oglas...',
    regenerateListing: 'Znova ustvari',
    listingTitleLabel: 'Naslov',
    listingDescriptionLabel: 'Opis',
    copyTitle: 'Kopiraj naslov',
    copyDescription: 'Kopiraj opis',
    copyAll: 'Kopiraj vse',
    copiedToClipboard: 'Kopirano v odložišče',
    listingFailedTitle: 'Oglas ni uspel',
    markAsListed: 'Označi kot objavljeno',
    markedAsListed: 'Označeno za prodajo',
    alsoAddToCatalogTitle: 'Dodam tudi v katalog?',
    alsoAddToCatalogMessage:
      'Obdržite zapis predmeta v domačem inventarju pred ali po prodaji.',
    alsoSellTitle: 'Ustvarim oglas?',
    alsoSellMessage: 'Pridobite povezave do tržnic in pomoč pri objavi.',
    yes: 'Da',
    no: 'Ne',
    disclaimerTitle: 'Samo osebni inventar',
    disclaimerBody:
      'SirPriceMe podaja ocenjene vrednosti z AI. To niso strokovne ocene in morda niso sprejete pri zavarovalnicah, kupcih ali sodiščih.\n\nZa vsako prodajo ali škodni primer preverite in popravite podatke.',
    disclaimerCheckbox: 'Razumem — ne prikaži več',
    disclaimerContinue: 'Nadaljuj',
    notesLabel: 'Opombe',
    valueSourceAi: 'AI ocena',
    removeFromCatalog: 'Odstrani iz kataloga',
    removeFromCatalogConfirmTitle: 'Odstranim iz kataloga?',
    removeFromCatalogConfirmMessage:
      'Predmet bo ostal v aplikaciji, vendar ne bo več v domačem katalogu.',
    removedFromCatalog: 'Odstranjeno iz kataloga',
    unmarkAsListed: 'Odstrani oznako objavljeno',
    unmarkAsListedConfirmTitle: 'Odstranim oznako objavljeno?',
    unmarkAsListedConfirmMessage:
      'Predmet ne bo več označen kot objavljen za prodajo.',
    unmarkedAsListed: 'Oznaka objavljeno odstranjena',
    catalogChooseRoom: 'Izberi sobo',
    roomItemCount: '{count} predmetov · ~€{total}',
    confirm: 'Potrdi',
    cancel: 'Prekliči',
    newRoom: '+ Nova soba',
    newRoomTitle: 'Nova soba',
    newRoomHint: 'Vnesite ime, ki ga boste poznali tudi kasneje.',
    newRoomPlaceholder: 'npr. Lopa, Klet, Otroška soba',
    saveRoom: 'Shrani sobo',
    roomNameRequired: 'Vnesite ime sobe.',
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
    myCatalog: 'Moj katalog',
    sellThisItem: 'Prodaj predmet',
    addToCatalog: 'Dodaj u katalog',
    back: 'Natrag',
    scanAnother: 'Skeniraj drugi predmet',
    statusInCatalog: 'U katalogu',
    statusForSale: 'Na prodaju',
    statusListed: 'Objavljeno',
    pickRoom: 'Odaberi sobu',
    pickRoomHint: 'Grupirajte predmete po sobama za inventar doma.',
    saveToCatalog: 'Spremi u katalog',
    savedToCatalog: 'Spremljeno u katalog',
    catalogTitle: 'Inventar mog doma',
    catalogSummary: '{count} predmeta · ~€{total} ukupno',
    catalogEmpty: 'Katalog je prazan. Skenirajte predmet i dodajte ga u katalog.',
    catalogDisclaimer:
      'Samo procjene. Za osiguranje ili pravne svrhe potvrdite vrijednosti s osiguravateljem.',
    exportPdf: 'Izvezi PDF',
    exportingPdf: 'Pripremam PDF...',
    exportPdfFailedTitle: 'Izvoz nije uspio',
    pdfExportedOn: 'Izvezeno {date}',
    pdfUnassignedRoom: 'Nedodijeljeno',
    sellTitle: 'Prodaj predmet',
    listingAssistTitle: 'Tekst oglasa',
    listingAssistHint: 'Kopirajte i zalijepite na Njuškalo, Facebook Marketplace itd.',
    generateListing: 'Generiraj oglas',
    generatingListing: 'Pišem oglas...',
    regenerateListing: 'Generiraj ponovno',
    listingTitleLabel: 'Naslov',
    listingDescriptionLabel: 'Opis',
    copyTitle: 'Kopiraj naslov',
    copyDescription: 'Kopiraj opis',
    copyAll: 'Kopiraj sve',
    copiedToClipboard: 'Kopirano u međuspremnik',
    listingFailedTitle: 'Oglas nije uspio',
    markAsListed: 'Označi kao objavljeno',
    markedAsListed: 'Označeno za prodaju',
    alsoAddToCatalogTitle: 'Dodati u katalog?',
    alsoAddToCatalogMessage:
      'Zadržite zapis predmeta u inventaru prije ili nakon prodaje.',
    alsoSellTitle: 'Kreirati oglas?',
    alsoSellMessage: 'Dobijte poveznice na tržnice i pomoć pri objavi.',
    yes: 'Da',
    no: 'Ne',
    disclaimerTitle: 'Samo osobni inventar',
    disclaimerBody:
      'SirPriceMe daje procijenjene vrijednosti pomoću AI-ja. To nisu stručne procjene.\n\nVi ste odgovorni za provjeru podataka prije prodaje ili prijave štete.',
    disclaimerCheckbox: 'Razumijem — ne prikazuj više',
    disclaimerContinue: 'Nastavi',
    notesLabel: 'Bilješke',
    valueSourceAi: 'AI procjena',
    removeFromCatalog: 'Ukloni iz kataloga',
    removeFromCatalogConfirmTitle: 'Ukloniti iz kataloga?',
    removeFromCatalogConfirmMessage:
      'Predmet ostaje u aplikaciji, ali više neće biti u inventaru doma.',
    removedFromCatalog: 'Uklonjeno iz kataloga',
    unmarkAsListed: 'Ukloni oznaku objavljeno',
    unmarkAsListedConfirmTitle: 'Ukloniti oznaku objavljeno?',
    unmarkAsListedConfirmMessage:
      'Predmet više neće biti označen kao objavljen na prodaju.',
    unmarkedAsListed: 'Oznaka objavljeno uklonjena',
    catalogChooseRoom: 'Odaberi sobu',
    roomItemCount: '{count} predmeta · ~€{total}',
    confirm: 'Potvrdi',
    cancel: 'Odustani',
    newRoom: '+ Nova soba',
    newRoomTitle: 'Nova soba',
    newRoomHint: 'Unesite naziv koji ćete kasnije prepoznati.',
    newRoomPlaceholder: 'npr. Šupa, Podrum, Dječja soba',
    saveRoom: 'Spremi sobu',
    roomNameRequired: 'Unesite naziv sobe.',
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
    myCatalog: 'Mein Katalog',
    sellThisItem: 'Artikel verkaufen',
    addToCatalog: 'Zum Katalog hinzufügen',
    back: 'Zurück',
    scanAnother: 'Weiteren Artikel scannen',
    statusInCatalog: 'Im Katalog',
    statusForSale: 'Zu verkaufen',
    statusListed: 'Eingestellt',
    pickRoom: 'Raum wählen',
    pickRoomHint: 'Artikel nach Räumen für Ihr Inventar gruppieren.',
    saveToCatalog: 'Im Katalog speichern',
    savedToCatalog: 'Im Katalog gespeichert',
    catalogTitle: 'Mein Hausinventar',
    catalogSummary: '{count} Artikel · ~€{total} gesamt',
    catalogEmpty: 'Noch keine Artikel. Scannen und zum Katalog hinzufügen.',
    catalogDisclaimer:
      'Nur Schätzungen. Für Versicherung oder Rechtliches Werte beim Versicherer prüfen.',
    exportPdf: 'PDF exportieren',
    exportingPdf: 'PDF wird erstellt...',
    exportPdfFailedTitle: 'Export fehlgeschlagen',
    pdfExportedOn: 'Exportiert am {date}',
    pdfUnassignedRoom: 'Nicht zugeordnet',
    sellTitle: 'Artikel verkaufen',
    listingAssistTitle: 'Anzeigentext',
    listingAssistHint: 'Kopieren und in Kleinanzeigen, Facebook Marketplace usw. einfügen.',
    generateListing: 'Anzeige erstellen',
    generatingListing: 'Anzeige wird erstellt...',
    regenerateListing: 'Neu erstellen',
    listingTitleLabel: 'Titel',
    listingDescriptionLabel: 'Beschreibung',
    copyTitle: 'Titel kopieren',
    copyDescription: 'Beschreibung kopieren',
    copyAll: 'Alles kopieren',
    copiedToClipboard: 'In Zwischenablage kopiert',
    listingFailedTitle: 'Anzeige fehlgeschlagen',
    markAsListed: 'Als eingestellt markieren',
    markedAsListed: 'Als zum Verkauf markiert',
    alsoAddToCatalogTitle: 'Auch zum Katalog hinzufügen?',
    alsoAddToCatalogMessage:
      'Behalten Sie den Artikel im Inventar vor oder nach dem Verkauf.',
    alsoSellTitle: 'Anzeige erstellen?',
    alsoSellMessage: 'Marktplatz-Links und Listing-Hilfe für diesen Artikel.',
    yes: 'Ja',
    no: 'Nein',
    disclaimerTitle: 'Nur persönliches Inventar',
    disclaimerBody:
      'SirPriceMe liefert geschätzte Werte per KI. Das sind keine professionellen Gutachten.\n\nSie sind für die Prüfung aller Angaben vor Verkauf oder Versicherungsfall verantwortlich.',
    disclaimerCheckbox: 'Verstanden — nicht mehr anzeigen',
    disclaimerContinue: 'Weiter',
    notesLabel: 'Notizen',
    valueSourceAi: 'KI-Schätzung',
    removeFromCatalog: 'Aus Katalog entfernen',
    removeFromCatalogConfirmTitle: 'Aus Katalog entfernen?',
    removeFromCatalogConfirmMessage:
      'Der Artikel bleibt in der App, erscheint aber nicht mehr im Hausinventar.',
    removedFromCatalog: 'Aus Katalog entfernt',
    unmarkAsListed: 'Als eingestellt entfernen',
    unmarkAsListedConfirmTitle: 'Markierung entfernen?',
    unmarkAsListedConfirmMessage:
      'Der Artikel wird nicht mehr als zum Verkauf eingestellt markiert.',
    unmarkedAsListed: 'Markierung entfernt',
    catalogChooseRoom: 'Raum wählen',
    roomItemCount: '{count} Artikel · ~€{total}',
    confirm: 'Bestätigen',
    cancel: 'Abbrechen',
    newRoom: '+ Neuer Raum',
    newRoomTitle: 'Neuer Raum',
    newRoomHint: 'Geben Sie einen Namen ein, den Sie später wiedererkennen.',
    newRoomPlaceholder: 'z.B. Schuppen, Keller, Kinderzimmer',
    saveRoom: 'Raum speichern',
    roomNameRequired: 'Bitte Raumnamen eingeben.',
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

export function formatString(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? ''),
  );
}
