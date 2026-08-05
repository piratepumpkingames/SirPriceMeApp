import type { AnalysisResult } from '../lib/analyzeItem';

export type ItemPhoto = {
  uri: string;
  mimeType: string;
};

export type ItemRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  photos: ItemPhoto[];
  objectName: string;
  condition: string;
  estimatedPriceEUR: number;
  explanation: string;
  marketplaceSearchQuery: string;
  listingTitle: string | null;
  listingDescription: string | null;
  userNotes: string;
  serialNumber: string;
  modelNumber: string;
  barcode: string;
  inCatalog: boolean;
  roomId: string | null;
  forSale: boolean;
  listedAt: string | null;
  soldAt: string | null;
  soldPriceEUR: number | null;
};

type LegacyItemRecord = {
  photoUri?: string;
  photoMimeType?: string;
};

export function createItemId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getPrimaryPhoto(item: ItemRecord): ItemPhoto | null {
  return item.photos[0] ?? null;
}

export function getPrimaryPhotoUri(item: ItemRecord): string {
  return item.photos[0]?.uri ?? '';
}

export function normalizeItem(raw: unknown): ItemRecord | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const item = raw as ItemRecord & LegacyItemRecord;

  if (!item.id || !item.objectName) {
    return null;
  }

  let photos = Array.isArray(item.photos) ? item.photos : [];

  if (photos.length === 0 && item.photoUri) {
    photos = [
      {
        uri: item.photoUri,
        mimeType: item.photoMimeType ?? 'image/jpeg',
      },
    ];
  }

  return {
    id: item.id,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    photos,
    objectName: item.objectName,
    condition: item.condition ?? '',
    estimatedPriceEUR: item.estimatedPriceEUR ?? 0,
    explanation: item.explanation ?? '',
    marketplaceSearchQuery: item.marketplaceSearchQuery ?? '',
    listingTitle: item.listingTitle ?? null,
    listingDescription: item.listingDescription ?? null,
    userNotes: item.userNotes ?? '',
    serialNumber: item.serialNumber ?? '',
    modelNumber: item.modelNumber ?? '',
    barcode: item.barcode ?? '',
    inCatalog: item.inCatalog ?? false,
    roomId: item.roomId ?? null,
    forSale: item.forSale ?? false,
    listedAt: item.listedAt ?? null,
    soldAt: item.soldAt ?? null,
    soldPriceEUR: item.soldPriceEUR ?? null,
  };
}

export function createItemFromAnalysis(
  analysis: AnalysisResult,
  photos: ItemPhoto[],
): ItemRecord {
  const now = new Date().toISOString();

  return {
    id: createItemId(),
    createdAt: now,
    updatedAt: now,
    photos,
    objectName: analysis.objectName,
    condition: analysis.condition,
    estimatedPriceEUR: analysis.estimatedPriceEUR,
    explanation: analysis.explanation,
    marketplaceSearchQuery: analysis.marketplaceSearchQuery,
    listingTitle: null,
    listingDescription: null,
    userNotes: '',
    serialNumber: '',
    modelNumber: '',
    barcode: '',
    inCatalog: false,
    roomId: null,
    forSale: false,
    listedAt: null,
    soldAt: null,
    soldPriceEUR: null,
  };
}

export function getItemDisplayPrice(item: ItemRecord): number {
  return item.estimatedPriceEUR;
}

export function hasIdentification(item: ItemRecord): boolean {
  return (
    item.serialNumber.trim().length > 0 ||
    item.modelNumber.trim().length > 0 ||
    item.barcode.trim().length > 0
  );
}
