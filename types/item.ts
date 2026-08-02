import type { AnalysisResult } from '../lib/analyzeItem';

export type ItemRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  photoUri: string;
  photoMimeType: string;
  objectName: string;
  condition: string;
  estimatedPriceEUR: number;
  explanation: string;
  marketplaceSearchQuery: string;
  userNotes: string;
  inCatalog: boolean;
  roomId: string | null;
  forSale: boolean;
  listedAt: string | null;
  soldAt: string | null;
};

export function createItemId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createItemFromAnalysis(
  analysis: AnalysisResult,
  photoUri: string,
  photoMimeType: string,
): ItemRecord {
  const now = new Date().toISOString();

  return {
    id: createItemId(),
    createdAt: now,
    updatedAt: now,
    photoUri,
    photoMimeType,
    objectName: analysis.objectName,
    condition: analysis.condition,
    estimatedPriceEUR: analysis.estimatedPriceEUR,
    explanation: analysis.explanation,
    marketplaceSearchQuery: analysis.marketplaceSearchQuery,
    userNotes: '',
    inCatalog: false,
    roomId: null,
    forSale: false,
    listedAt: null,
    soldAt: null,
  };
}

export function getItemDisplayPrice(item: ItemRecord): number {
  return item.estimatedPriceEUR;
}
