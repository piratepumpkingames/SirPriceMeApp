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
  scanResultTitle: string;
  moreActions: string;
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
  sharePdf: string;
  savePdfToPhone: string;
  savingPdf: string;
  pdfSavedToPhone: string;
  pdfSaveCancelled: string;
  exportingPdf: string;
  exportPdfFailedTitle: string;
  pdfExportedOn: string;
  pdfUnassignedRoom: string;
  editItem: string;
  editItemTitle: string;
  saveChanges: string;
  itemNameLabel: string;
  itemNameRequired: string;
  priceLabel: string;
  invalidPrice: string;
  itemUpdated: string;
  markAsSold: string;
  markAsSoldTitle: string;
  soldPriceLabel: string;
  soldPriceHint: string;
  markedAsSold: string;
  statusSold: string;
  unmarkAsSold: string;
  unmarkAsSoldConfirmTitle: string;
  unmarkAsSoldConfirmMessage: string;
  unmarkedAsSold: string;
  deleteItem: string;
  deleteItemConfirmTitle: string;
  deleteItemConfirmMessage: string;
  itemDeleted: string;
  manageRooms: string;
  manageRoomsHint: string;
  renameRoom: string;
  deleteRoom: string;
  deleteRoomConfirmTitle: string;
  deleteRoomConfirmMessage: string;
  roomNotEmpty: string;
  roomRenamed: string;
  roomDeleted: string;
  noCustomRooms: string;
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
  homeEmptyTitle: string;
  homeEmptyMessage: string;
  catalogEmptyTitle: string;
  pdfExportHint: string;
  dismissHint: string;
  analyzingStepPhoto: string;
  analyzingStepIdentify: string;
  analyzingStepPrice: string;
  itemDetailsSection: string;
  itemActionsSection: string;
  identificationSection: string;
  identificationHint: string;
  serialNumberLabel: string;
  modelNumberLabel: string;
  barcodeLabel: string;
  scanBarcode: string;
  scanBarcodeTitle: string;
  scanBarcodeHint: string;
  scanBarcodeAllowCamera: string;
  scanBarcodeWaiting: string;
  barcodeScanned: string;
  addPhoto: string;
  addAnotherPhoto: string;
  primaryPhoto: string;
  removePhotoTitle: string;
  removePhotoConfirm: string;
  removePhotoLast: string;
  removePhotoAction: string;
  pdfSerialNumber: string;
  pdfModelNumber: string;
  pdfBarcode: string;
  listingPhotosTitle: string;
  sellWorkflowHint: string;
  sharePhotos: string;
  sharingPhotos: string;
  savePhotosToGallery: string;
  savingPhotosToGallery: string;
  photosSavedToGallery: string;
  photosShareFailedTitle: string;
  photosSaveFailedTitle: string;
  photoLibraryPermission: string;
  noPhotosToShare: string;
  savePhotosExpoGoHint: string;
  proPaywallTitle: string;
  proPaywallBody: string;
  proFeatureUnlimitedScans: string;
  proFeaturePdf: string;
  proFeatureCustomRooms: string;
  proSubscribe: string;
  proRestore: string;
  proClose: string;
  proPurchaseSuccess: string;
  proPurchaseFailedTitle: string;
  proRestoreSuccess: string;
  proRestoreNone: string;
  scanLimitReachedTitle: string;
  scanLimitReachedMessage: string;
  scansRemaining: string;
  upgradeToPro: string;
  proOnlyPdf: string;
  proOnlyCustomRooms: string;
  proPriceUnavailable: string;
  proPurchasing: string;
  proRestoring: string;
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
    scanResultTitle: 'Scan result',
    moreActions: 'More actions',
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
    sharePdf: 'Share PDF',
    savePdfToPhone: 'Save to phone',
    savingPdf: 'Saving PDF...',
    pdfSavedToPhone: 'PDF saved to your chosen folder.',
    pdfSaveCancelled: 'Save cancelled.',
    exportingPdf: 'Creating PDF...',
    exportPdfFailedTitle: 'Export failed',
    pdfExportedOn: 'Exported on {date}',
    pdfUnassignedRoom: 'Unassigned',
    editItem: 'Edit details',
    editItemTitle: 'Edit item',
    saveChanges: 'Save changes',
    itemNameLabel: 'Item name',
    itemNameRequired: 'Please enter an item name.',
    priceLabel: 'Estimated price (EUR)',
    invalidPrice: 'Please enter a valid price.',
    itemUpdated: 'Item updated.',
    markAsSold: 'Mark as sold',
    markAsSoldTitle: 'Mark as sold',
    soldPriceLabel: 'Sold for (EUR)',
    soldPriceHint: 'Enter the price you sold it for, or keep the estimate.',
    markedAsSold: 'Marked as sold.',
    statusSold: 'Sold',
    unmarkAsSold: 'Unmark as sold',
    unmarkAsSoldConfirmTitle: 'Unmark as sold?',
    unmarkAsSoldConfirmMessage: 'This item will no longer be marked as sold.',
    unmarkedAsSold: 'Unmarked as sold.',
    deleteItem: 'Delete item',
    deleteItemConfirmTitle: 'Delete item?',
    deleteItemConfirmMessage:
      'This removes the item and its photo from the app. This cannot be undone.',
    itemDeleted: 'Item deleted.',
    manageRooms: 'Manage custom rooms',
    manageRoomsHint: 'Rename or delete rooms you created. Empty rooms only.',
    renameRoom: 'Rename',
    deleteRoom: 'Delete',
    deleteRoomConfirmTitle: 'Delete room?',
    deleteRoomConfirmMessage: 'This custom room will be removed from the picker.',
    roomNotEmpty: 'Move or remove catalog items from this room first.',
    roomRenamed: 'Room renamed.',
    roomDeleted: 'Room deleted.',
    noCustomRooms: 'No custom rooms yet.',
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
    homeEmptyTitle: 'Scan your first item',
    homeEmptyMessage:
      'Take a photo of anything at home — furniture, electronics, collectibles — and get an AI price estimate in seconds.',
    catalogEmptyTitle: 'Your catalog is empty',
    pdfExportHint:
      'Tip: Export your catalog as a PDF for insurance records or when moving house.',
    dismissHint: 'Got it',
    analyzingStepPhoto: 'Analyzing photo…',
    analyzingStepIdentify: 'Identifying the item…',
    analyzingStepPrice: 'Estimating value…',
    itemDetailsSection: 'Details',
    itemActionsSection: 'Actions',
    identificationSection: 'Identification',
    identificationHint:
      'Optional — helps with insurance claims. Scan a barcode or type numbers from the label.',
    serialNumberLabel: 'Serial number',
    modelNumberLabel: 'Model number',
    barcodeLabel: 'Barcode / EAN',
    scanBarcode: 'Scan barcode',
    scanBarcodeTitle: 'Scan barcode',
    scanBarcodeHint: 'Point the camera at the product barcode or QR code on the box or label.',
    scanBarcodeAllowCamera: 'Allow camera',
    scanBarcodeWaiting: 'Starting scanner…',
    barcodeScanned: 'Barcode saved. You can edit it before saving.',
    addPhoto: 'Add photo',
    addAnotherPhoto: 'Add another photo',
    primaryPhoto: 'Main',
    removePhotoTitle: 'Remove photo?',
    removePhotoConfirm: 'This photo will be removed from the item.',
    removePhotoLast: 'Keep at least one photo for this item.',
    removePhotoAction: 'Remove',
    pdfSerialNumber: 'Serial',
    pdfModelNumber: 'Model',
    pdfBarcode: 'Barcode',
    listingPhotosTitle: 'Photos for your listing',
    sellWorkflowHint:
      '1. Generate and copy the listing text\n2. Share or save photos below\n3. Open Bolha, Facebook Marketplace, or similar\n4. Paste the text and attach the photos',
    sharePhotos: 'Share photos',
    sharingPhotos: 'Sharing…',
    savePhotosToGallery: 'Save photos to gallery',
    savingPhotosToGallery: 'Saving…',
    photosSavedToGallery: 'Photos saved to your gallery. Attach them when creating the ad.',
    photosShareFailedTitle: 'Could not share photos',
    photosSaveFailedTitle: 'Could not save photos',
    photoLibraryPermission: 'Photo library access is needed to save images to your gallery.',
    noPhotosToShare: 'This item has no photos.',
    savePhotosExpoGoHint:
      'In Expo Go, use Share photos. Save to gallery works fully in the installed APK.',
    proPaywallTitle: 'SirPriceMe Pro',
    proPaywallBody: 'Unlock unlimited AI scans and premium catalog tools.',
    proFeatureUnlimitedScans: 'Unlimited AI photo scans every month',
    proFeaturePdf: 'Export your catalog as PDF',
    proFeatureCustomRooms: 'Create custom rooms in your catalog',
    proSubscribe: 'Subscribe yearly',
    proRestore: 'Restore purchases',
    proClose: 'Not now',
    proPurchaseSuccess: 'Welcome to SirPriceMe Pro!',
    proPurchaseFailedTitle: 'Purchase failed',
    proRestoreSuccess: 'Your Pro subscription is active.',
    proRestoreNone: 'No active subscription was found for this Google account.',
    scanLimitReachedTitle: 'Free scan limit reached',
    scanLimitReachedMessage:
      'You have used all {limit} free AI scans this month. Upgrade to Pro for unlimited scans.',
    scansRemaining: '{remaining} of {limit} free scans left this month',
    upgradeToPro: 'Go Pro',
    proOnlyPdf: 'PDF export is a Pro feature.',
    proOnlyCustomRooms: 'Custom rooms are a Pro feature.',
    proPriceUnavailable: 'Subscription price unavailable',
    proPurchasing: 'Opening Google Play…',
    proRestoring: 'Restoring purchases…',
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
    scanResultTitle: 'Rezultat',
    moreActions: 'Več dejanj',
    scanAnother: 'Scaniraj drug predmet',
    statusInCatalog: 'V katalogu',
    statusForSale: 'Za prodajo',
    statusListed: 'Objavljeno',
    pickRoom: 'Izberi prostor',
    pickRoomHint: 'Predmete združite po prostorih za domači inventar.',
    saveToCatalog: 'Shrani v katalog',
    savedToCatalog: 'Shranjeno v katalog',
    catalogTitle: 'Moj domači katalog',
    catalogSummary: '{count} predmetov · ~€{total} skupaj',
    catalogEmpty: 'Katalog je prazen. Scanirajte predmet in tapnite Dodaj v katalog.',
    catalogDisclaimer:
      'Samo ocene. Za zavarovanje ali pravne namene preverite vrednosti pri zavarovalnici ali ocenjevalcu.',
    exportPdf: 'Izvozi PDF',
    sharePdf: 'Deli PDF',
    savePdfToPhone: 'Shrani v telefon',
    savingPdf: 'Shranjujem PDF...',
    pdfSavedToPhone: 'PDF shranjen v izbrano mapo.',
    pdfSaveCancelled: 'Shranjevanje preklicano.',
    exportingPdf: 'Pripravljam PDF...',
    exportPdfFailedTitle: 'Izvoz ni uspel',
    pdfExportedOn: 'Izvoženo {date}',
    pdfUnassignedRoom: 'Nedodeljeno',
    editItem: 'Uredi podatke',
    editItemTitle: 'Uredi predmet',
    saveChanges: 'Shrani spremembe',
    itemNameLabel: 'Ime predmeta',
    itemNameRequired: 'Vnesite ime predmeta.',
    priceLabel: 'Ocenjena cena (EUR)',
    invalidPrice: 'Vnesite veljavno ceno.',
    itemUpdated: 'Predmet posodobljen.',
    markAsSold: 'Označi kot prodano',
    markAsSoldTitle: 'Označi kot prodano',
    soldPriceLabel: 'Prodano za (EUR)',
    soldPriceHint: 'Vnesite prodajno ceno ali obdržite oceno.',
    markedAsSold: 'Označeno kot prodano.',
    statusSold: 'Prodano',
    unmarkAsSold: 'Odstrani oznako prodano',
    unmarkAsSoldConfirmTitle: 'Odstranim oznako prodano?',
    unmarkAsSoldConfirmMessage: 'Predmet ne bo več označen kot prodan.',
    unmarkedAsSold: 'Oznaka prodano odstranjena.',
    deleteItem: 'Izbriši predmet',
    deleteItemConfirmTitle: 'Izbrišem predmet?',
    deleteItemConfirmMessage:
      'Predmet in fotografija bosta odstranjena iz aplikacije. Tega ni mogoče razveljaviti.',
    itemDeleted: 'Predmet izbrisan.',
    manageRooms: 'Upravljaj prostore',
    manageRoomsHint: 'Preimenujte ali izbrišite svoje prostore. Samo prazni prostori.',
    renameRoom: 'Preimenuj',
    deleteRoom: 'Izbriši',
    deleteRoomConfirmTitle: 'Izbrišem prostor?',
    deleteRoomConfirmMessage: 'Ta prostor bo odstranjen s seznama.',
    roomNotEmpty: 'Najprej premaknite ali odstranite predmete iz tega prostora.',
    roomRenamed: 'Prostor preimenovan.',
    roomDeleted: 'Prostor izbrisan.',
    noCustomRooms: 'Ni še lastnih prostorov.',
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
    catalogChooseRoom: 'Izberi prostor',
    roomItemCount: '{count} predmetov · ~€{total}',
    confirm: 'Potrdi',
    cancel: 'Prekliči',
    newRoom: '+ Nov prostor',
    newRoomTitle: 'Nov prostor',
    newRoomHint: 'Vnesite ime prostora, ki ga boste poznali tudi kasneje.',
    newRoomPlaceholder: 'npr. Lopa, Klet, Shramba',
    saveRoom: 'Shrani prostor',
    roomNameRequired: 'Vnesite ime prostora.',
    homeEmptyTitle: 'Scanirajte prvi predmet',
    homeEmptyMessage:
      'Fotografirajte karkoli doma — pohištvo, elektroniko, zbirateljske predmete — in v sekundah dobite AI oceno vrednosti.',
    catalogEmptyTitle: 'Katalog je prazen',
    pdfExportHint:
      'Namig: Katalog izvozite v PDF za zavarovalnico ali ob selitvi.',
    dismissHint: 'Razumem',
    analyzingStepPhoto: 'Analiziram fotografijo…',
    analyzingStepIdentify: 'Prepoznavam predmet…',
    analyzingStepPrice: 'Ocenjujem vrednost…',
    itemDetailsSection: 'Podrobnosti',
    itemActionsSection: 'Dejanja',
    identificationSection: 'Identifikacija',
    identificationHint:
      'Neobvezno — koristno za zavarovalnico. Scanirajte črtno kodo ali vnesite številke s nalepke.',
    serialNumberLabel: 'Serijska številka',
    modelNumberLabel: 'Številka modela',
    barcodeLabel: 'Črtna koda / EAN',
    scanBarcode: 'Scaniraj črtno kodo',
    scanBarcodeTitle: 'Scaniraj črtno kodo',
    scanBarcodeHint: 'Usmerite kamero na črtno kodo ali QR kodo na embalaži ali nalepki.',
    scanBarcodeAllowCamera: 'Dovoli kamero',
    scanBarcodeWaiting: 'Zaganjam scanner…',
    barcodeScanned: 'Črtna koda shranjena. Lahko jo uredite pred shranjevanjem.',
    addPhoto: 'Dodaj fotografijo',
    addAnotherPhoto: 'Dodaj še fotografijo',
    primaryPhoto: 'Glavna',
    removePhotoTitle: 'Odstranim fotografijo?',
    removePhotoConfirm: 'Ta fotografija bo odstranjena s predmeta.',
    removePhotoLast: 'Obdržite vsaj eno fotografijo za ta predmet.',
    removePhotoAction: 'Odstrani',
    pdfSerialNumber: 'Serijska',
    pdfModelNumber: 'Model',
    pdfBarcode: 'Črtna koda',
    listingPhotosTitle: 'Fotografije za oglas',
    sellWorkflowHint:
      '1. Ustvarite in kopirajte besedilo oglasa\n2. Spodaj delite ali shranite fotografije\n3. Odprite Bolho, Facebook Marketplace ipd.\n4. Prilepite besedilo in priložite fotografije',
    sharePhotos: 'Deli fotografije',
    sharingPhotos: 'Delim…',
    savePhotosToGallery: 'Shrani fotografije v galerijo',
    savingPhotosToGallery: 'Shranjujem…',
    photosSavedToGallery:
      'Fotografije shranjene v galerijo. Priložite jih ob objavi oglasa.',
    photosShareFailedTitle: 'Fotografij ni mogoče deliti',
    photosSaveFailedTitle: 'Fotografij ni mogoče shraniti',
    photoLibraryPermission:
      'Za shranjevanje v galerijo potrebujete dostop do fotografij.',
    noPhotosToShare: 'Ta predmet nima fotografij.',
    savePhotosExpoGoHint:
      'V Expo Go uporabite Deli fotografije. Shranjevanje v galerijo deluje v nameščeni APK aplikaciji.',
    proPaywallTitle: 'SirPriceMe Pro',
    proPaywallBody: 'Odklenite neomejene AI sken in premium orodja za katalog.',
    proFeatureUnlimitedScans: 'Neomejeni AI foto skeni vsak mesec',
    proFeaturePdf: 'Izvoz kataloga v PDF',
    proFeatureCustomRooms: 'Ustvarjanje lastnih prostorov v katalogu',
    proSubscribe: 'Letna naročnina',
    proRestore: 'Obnovi nakupe',
    proClose: 'Ne zdaj',
    proPurchaseSuccess: 'Dobrodošli v SirPriceMe Pro!',
    proPurchaseFailedTitle: 'Nakup ni uspel',
    proRestoreSuccess: 'Vaša Pro naročnina je aktivna.',
    proRestoreNone: 'Za ta Google račun ni aktivne naročnine.',
    scanLimitReachedTitle: 'Porabili ste brezplačne skene',
    scanLimitReachedMessage:
      'Porabili ste vseh {limit} brezplačnih AI skenov ta mesec. Nadgradite na Pro za neomejene skene.',
    scansRemaining: 'Še {remaining} od {limit} brezplačnih skenov ta mesec',
    upgradeToPro: 'Nadgradi na Pro',
    proOnlyPdf: 'Izvoz PDF je Pro funkcija.',
    proOnlyCustomRooms: 'Lastni prostori so Pro funkcija.',
    proPriceUnavailable: 'Cena naročnine ni na voljo',
    proPurchasing: 'Odpiram Google Play…',
    proRestoring: 'Obnavljam nakupe…',
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
    scanResultTitle: 'Rezultat',
    moreActions: 'Više radnji',
    scanAnother: 'Skeniraj drugi predmet',
    statusInCatalog: 'U katalogu',
    statusForSale: 'Na prodaju',
    statusListed: 'Objavljeno',
    pickRoom: 'Odaberi prostor',
    pickRoomHint: 'Grupirajte predmete po prostorima za inventar doma.',
    saveToCatalog: 'Spremi u katalog',
    savedToCatalog: 'Spremljeno u katalog',
    catalogTitle: 'Inventar mog doma',
    catalogSummary: '{count} predmeta · ~€{total} ukupno',
    catalogEmpty: 'Katalog je prazan. Skenirajte predmet i dodajte ga u katalog.',
    catalogDisclaimer:
      'Samo procjene. Za osiguranje ili pravne svrhe potvrdite vrijednosti s osiguravateljem.',
    exportPdf: 'Izvezi PDF',
    sharePdf: 'Podijeli PDF',
    savePdfToPhone: 'Spremi na telefon',
    savingPdf: 'Spremanje PDF-a...',
    pdfSavedToPhone: 'PDF spremljen u odabranu mapu.',
    pdfSaveCancelled: 'Spremanje otkazano.',
    exportingPdf: 'Pripremam PDF...',
    exportPdfFailedTitle: 'Izvoz nije uspio',
    pdfExportedOn: 'Izvezeno {date}',
    pdfUnassignedRoom: 'Nedodijeljeno',
    editItem: 'Uredi podatke',
    editItemTitle: 'Uredi predmet',
    saveChanges: 'Spremi promjene',
    itemNameLabel: 'Naziv predmeta',
    itemNameRequired: 'Unesite naziv predmeta.',
    priceLabel: 'Procijenjena cijena (EUR)',
    invalidPrice: 'Unesite valjanu cijenu.',
    itemUpdated: 'Predmet ažuriran.',
    markAsSold: 'Označi kao prodano',
    markAsSoldTitle: 'Označi kao prodano',
    soldPriceLabel: 'Prodano za (EUR)',
    soldPriceHint: 'Unesite prodajnu cijenu ili zadržite procjenu.',
    markedAsSold: 'Označeno kao prodano.',
    statusSold: 'Prodano',
    unmarkAsSold: 'Ukloni oznaku prodano',
    unmarkAsSoldConfirmTitle: 'Ukloniti oznaku prodano?',
    unmarkAsSoldConfirmMessage: 'Predmet više neće biti označen kao prodan.',
    unmarkedAsSold: 'Oznaka prodano uklonjena.',
    deleteItem: 'Obriši predmet',
    deleteItemConfirmTitle: 'Obrisati predmet?',
    deleteItemConfirmMessage:
      'Predmet i fotografija bit će uklonjeni iz aplikacije. Ovo se ne može poništiti.',
    itemDeleted: 'Predmet obrisan.',
    manageRooms: 'Upravljaj prostore',
    manageRoomsHint: 'Preimenujte ili obrišite svoje prostore. Samo prazni prostori.',
    renameRoom: 'Preimenuj',
    deleteRoom: 'Obriši',
    deleteRoomConfirmTitle: 'Obrisati prostor?',
    deleteRoomConfirmMessage: 'Ovaj prostor bit će uklonjen s popisa.',
    roomNotEmpty: 'Prvo premjestite ili uklonite predmete iz ovog prostora.',
    roomRenamed: 'Prostor preimenovan.',
    roomDeleted: 'Prostor obrisan.',
    noCustomRooms: 'Još nema vlastitih prostora.',
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
    catalogChooseRoom: 'Odaberi prostor',
    roomItemCount: '{count} predmeta · ~€{total}',
    confirm: 'Potvrdi',
    cancel: 'Odustani',
    newRoom: '+ Novi prostor',
    newRoomTitle: 'Novi prostor',
    newRoomHint: 'Unesite naziv prostora koji ćete kasnije prepoznati.',
    newRoomPlaceholder: 'npr. Šupa, Podrum, Garaža',
    saveRoom: 'Spremi prostor',
    roomNameRequired: 'Unesite naziv prostora.',
    homeEmptyTitle: 'Skenirajte prvi predmet',
    homeEmptyMessage:
      'Fotografirajte bilo što kod kuće — namještaj, elektroniku, kolekcionarske predmete — i dobijte AI procjenu vrijednosti.',
    catalogEmptyTitle: 'Katalog je prazan',
    pdfExportHint:
      'Savjet: Izvezite katalog u PDF za osiguranje ili selidbu.',
    dismissHint: 'Razumijem',
    analyzingStepPhoto: 'Analiziram fotografiju…',
    analyzingStepIdentify: 'Prepoznajem predmet…',
    analyzingStepPrice: 'Procjenjujem vrijednost…',
    itemDetailsSection: 'Detalji',
    itemActionsSection: 'Radnje',
    identificationSection: 'Identifikacija',
    identificationHint:
      'Neobavezno — korisno za osiguranje. Skenirajte barkod ili upišite brojeve s naljepnice.',
    serialNumberLabel: 'Serijski broj',
    modelNumberLabel: 'Broj modela',
    barcodeLabel: 'Barkod / EAN',
    scanBarcode: 'Skeniraj barkod',
    scanBarcodeTitle: 'Skeniraj barkod',
    scanBarcodeHint: 'Usmjerite kameru prema barkodu ili QR kodu na kutiji ili naljepnici.',
    scanBarcodeAllowCamera: 'Dozvoli kameru',
    scanBarcodeWaiting: 'Pokrećem skener…',
    barcodeScanned: 'Barkod spremljen. Možete ga urediti prije spremanja.',
    addPhoto: 'Dodaj fotografiju',
    addAnotherPhoto: 'Dodaj još fotografiju',
    primaryPhoto: 'Glavna',
    removePhotoTitle: 'Ukloniti fotografiju?',
    removePhotoConfirm: 'Ova fotografija bit će uklonjena s predmeta.',
    removePhotoLast: 'Zadržite barem jednu fotografiju za ovaj predmet.',
    removePhotoAction: 'Ukloni',
    pdfSerialNumber: 'Serijski',
    pdfModelNumber: 'Model',
    pdfBarcode: 'Barkod',
    listingPhotosTitle: 'Fotografije za oglas',
    sellWorkflowHint:
      '1. Generirajte i kopirajte tekst oglasa\n2. Podijelite ili spremite fotografije u galeriju\n3. Otvorite Njuškalo, Facebook Marketplace itd.\n4. Zalijepite tekst i priložite fotografije',
    sharePhotos: 'Podijeli fotografije',
    sharingPhotos: 'Dijelim…',
    savePhotosToGallery: 'Spremi fotografije u galeriju',
    savingPhotosToGallery: 'Spremanje…',
    photosSavedToGallery:
      'Fotografije spremljene u galeriju. Priložite ih pri objavi oglasa.',
    photosShareFailedTitle: 'Fotografije se ne mogu podijeliti',
    photosSaveFailedTitle: 'Fotografije se ne mogu spremiti',
    photoLibraryPermission:
      'Potreban je pristup galeriji za spremanje fotografija.',
    noPhotosToShare: 'Ovaj predmet nema fotografija.',
    savePhotosExpoGoHint:
      'U Expo Go koristite Podijeli fotografije. Spremanje u galeriju radi u instaliranoj APK aplikaciji.',
    proPaywallTitle: 'SirPriceMe Pro',
    proPaywallBody: 'Otključajte neograničene AI skenove i premium alate kataloga.',
    proFeatureUnlimitedScans: 'Neograničeni AI foto skenovi svaki mjesec',
    proFeaturePdf: 'Izvoz kataloga u PDF',
    proFeatureCustomRooms: 'Stvaranje vlastitih prostorija u katalogu',
    proSubscribe: 'Godišnja pretplata',
    proRestore: 'Vrati kupnje',
    proClose: 'Ne sada',
    proPurchaseSuccess: 'Dobrodošli u SirPriceMe Pro!',
    proPurchaseFailedTitle: 'Kupnja nije uspjela',
    proRestoreSuccess: 'Vaša Pro pretplata je aktivna.',
    proRestoreNone: 'Nema aktivne pretplate za ovaj Google račun.',
    scanLimitReachedTitle: 'Iskoristili ste besplatne skenove',
    scanLimitReachedMessage:
      'Iskoristili ste svih {limit} besplatnih AI skenova ovaj mjesec. Nadogradite na Pro za neograničene skenove.',
    scansRemaining: 'Još {remaining} od {limit} besplatnih skenova ovaj mjesec',
    upgradeToPro: 'Nadogradi na Pro',
    proOnlyPdf: 'PDF izvoz je Pro funkcija.',
    proOnlyCustomRooms: 'Vlastite prostorije su Pro funkcija.',
    proPriceUnavailable: 'Cijena pretplate nije dostupna',
    proPurchasing: 'Otvaram Google Play…',
    proRestoring: 'Vraćam kupnje…',
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
    scanResultTitle: 'Scan-Ergebnis',
    moreActions: 'Weitere Aktionen',
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
    sharePdf: 'PDF teilen',
    savePdfToPhone: 'Auf Handy speichern',
    savingPdf: 'PDF wird gespeichert...',
    pdfSavedToPhone: 'PDF im gewählten Ordner gespeichert.',
    pdfSaveCancelled: 'Speichern abgebrochen.',
    exportingPdf: 'PDF wird erstellt...',
    exportPdfFailedTitle: 'Export fehlgeschlagen',
    pdfExportedOn: 'Exportiert am {date}',
    pdfUnassignedRoom: 'Nicht zugeordnet',
    editItem: 'Details bearbeiten',
    editItemTitle: 'Artikel bearbeiten',
    saveChanges: 'Änderungen speichern',
    itemNameLabel: 'Artikelname',
    itemNameRequired: 'Bitte Artikelnamen eingeben.',
    priceLabel: 'Geschätzter Preis (EUR)',
    invalidPrice: 'Bitte gültigen Preis eingeben.',
    itemUpdated: 'Artikel aktualisiert.',
    markAsSold: 'Als verkauft markieren',
    markAsSoldTitle: 'Als verkauft markieren',
    soldPriceLabel: 'Verkauft für (EUR)',
    soldPriceHint: 'Verkaufspreis eingeben oder Schätzung behalten.',
    markedAsSold: 'Als verkauft markiert.',
    statusSold: 'Verkauft',
    unmarkAsSold: 'Als verkauft entfernen',
    unmarkAsSoldConfirmTitle: 'Als verkauft entfernen?',
    unmarkAsSoldConfirmMessage: 'Der Artikel wird nicht mehr als verkauft markiert.',
    unmarkedAsSold: 'Als verkauft entfernt.',
    deleteItem: 'Artikel löschen',
    deleteItemConfirmTitle: 'Artikel löschen?',
    deleteItemConfirmMessage:
      'Artikel und Foto werden aus der App entfernt. Dies kann nicht rückgängig gemacht werden.',
    itemDeleted: 'Artikel gelöscht.',
    manageRooms: 'Eigene Räume verwalten',
    manageRoomsHint: 'Räume umbenennen oder löschen. Nur leere Räume.',
    renameRoom: 'Umbenennen',
    deleteRoom: 'Löschen',
    deleteRoomConfirmTitle: 'Raum löschen?',
    deleteRoomConfirmMessage: 'Dieser Raum wird aus der Auswahl entfernt.',
    roomNotEmpty: 'Entfernen Sie zuerst alle Artikel aus diesem Raum.',
    roomRenamed: 'Raum umbenannt.',
    roomDeleted: 'Raum gelöscht.',
    noCustomRooms: 'Noch keine eigenen Räume.',
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
    homeEmptyTitle: 'Ersten Artikel scannen',
    homeEmptyMessage:
      'Fotografieren Sie etwas zu Hause — Möbel, Elektronik, Sammlerstücke — und erhalten Sie in Sekunden eine KI-Preisschätzung.',
    catalogEmptyTitle: 'Ihr Katalog ist leer',
    pdfExportHint:
      'Tipp: Exportieren Sie den Katalog als PDF für Versicherung oder Umzug.',
    dismissHint: 'Verstanden',
    analyzingStepPhoto: 'Foto wird analysiert…',
    analyzingStepIdentify: 'Gegenstand wird erkannt…',
    analyzingStepPrice: 'Wert wird geschätzt…',
    itemDetailsSection: 'Details',
    itemActionsSection: 'Aktionen',
    identificationSection: 'Identifikation',
    identificationHint:
      'Optional — hilfreich für Versicherungen. Barcode scannen oder Nummern vom Etikett eingeben.',
    serialNumberLabel: 'Seriennummer',
    modelNumberLabel: 'Modellnummer',
    barcodeLabel: 'Barcode / EAN',
    scanBarcode: 'Barcode scannen',
    scanBarcodeTitle: 'Barcode scannen',
    scanBarcodeHint: 'Kamera auf den Produktbarcode oder QR-Code auf Verpackung oder Etikett richten.',
    scanBarcodeAllowCamera: 'Kamera erlauben',
    scanBarcodeWaiting: 'Scanner startet…',
    barcodeScanned: 'Barcode gespeichert. Vor dem Speichern bearbeitbar.',
    addPhoto: 'Foto hinzufügen',
    addAnotherPhoto: 'Weiteres Foto',
    primaryPhoto: 'Haupt',
    removePhotoTitle: 'Foto entfernen?',
    removePhotoConfirm: 'Dieses Foto wird vom Artikel entfernt.',
    removePhotoLast: 'Mindestens ein Foto behalten.',
    removePhotoAction: 'Entfernen',
    pdfSerialNumber: 'Seriennummer',
    pdfModelNumber: 'Modell',
    pdfBarcode: 'Barcode',
    listingPhotosTitle: 'Fotos für Ihre Anzeige',
    sellWorkflowHint:
      '1. Anzeigentext erstellen und kopieren\n2. Fotos unten teilen oder in der Galerie speichern\n3. Kleinanzeigen, Facebook Marketplace usw. öffnen\n4. Text einfügen und Fotos anhängen',
    sharePhotos: 'Fotos teilen',
    sharingPhotos: 'Teile…',
    savePhotosToGallery: 'Fotos in Galerie speichern',
    savingPhotosToGallery: 'Speichere…',
    photosSavedToGallery:
      'Fotos in der Galerie gespeichert. Beim Erstellen der Anzeige anhängen.',
    photosShareFailedTitle: 'Fotos konnten nicht geteilt werden',
    photosSaveFailedTitle: 'Fotos konnten nicht gespeichert werden',
    photoLibraryPermission:
      'Galeriezugriff wird zum Speichern der Fotos benötigt.',
    noPhotosToShare: 'Dieser Artikel hat keine Fotos.',
    savePhotosExpoGoHint:
      'In Expo Go Fotos teilen verwenden. Galerie-Speichern funktioniert in der installierten APK.',
    proPaywallTitle: 'SirPriceMe Pro',
    proPaywallBody: 'Schalten Sie unbegrenzte KI-Scans und Premium-Katalogtools frei.',
    proFeatureUnlimitedScans: 'Unbegrenzte KI-Fotoscans pro Monat',
    proFeaturePdf: 'Katalog als PDF exportieren',
    proFeatureCustomRooms: 'Eigene Räume im Katalog anlegen',
    proSubscribe: 'Jahresabo',
    proRestore: 'Käufe wiederherstellen',
    proClose: 'Nicht jetzt',
    proPurchaseSuccess: 'Willkommen bei SirPriceMe Pro!',
    proPurchaseFailedTitle: 'Kauf fehlgeschlagen',
    proRestoreSuccess: 'Ihr Pro-Abo ist aktiv.',
    proRestoreNone: 'Für dieses Google-Konto wurde kein aktives Abo gefunden.',
    scanLimitReachedTitle: 'Kostenloses Scan-Limit erreicht',
    scanLimitReachedMessage:
      'Sie haben alle {limit} kostenlosen KI-Scans in diesem Monat verbraucht. Upgraden Sie auf Pro für unbegrenzte Scans.',
    scansRemaining: 'Noch {remaining} von {limit} kostenlosen Scans in diesem Monat',
    upgradeToPro: 'Pro freischalten',
    proOnlyPdf: 'PDF-Export ist eine Pro-Funktion.',
    proOnlyCustomRooms: 'Eigene Räume sind eine Pro-Funktion.',
    proPriceUnavailable: 'Abo-Preis nicht verfügbar',
    proPurchasing: 'Google Play wird geöffnet…',
    proRestoring: 'Käufe werden wiederhergestellt…',
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
