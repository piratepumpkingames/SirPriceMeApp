import AsyncStorage from '@react-native-async-storage/async-storage';
import { copyAsync, deleteAsync, documentDirectory } from 'expo-file-system/legacy';
import type { ItemRecord } from '../../types/item';

export type CatalogRoomSummary = {
  roomId: string;
  count: number;
  totalEUR: number;
};

const ITEMS_KEY = '@sirpriceme/items';

function parseStoredArray<T>(raw: string | null): T[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export async function loadItems(): Promise<ItemRecord[]> {
  const raw = await AsyncStorage.getItem(ITEMS_KEY);
  return parseStoredArray<ItemRecord>(raw);
}

async function saveItems(items: ItemRecord[]): Promise<void> {
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export async function persistPhotoUri(sourceUri: string): Promise<string> {
  if (!documentDirectory) {
    return sourceUri;
  }

  const destination = `${documentDirectory}item-${Date.now()}.jpg`;
  await copyAsync({ from: sourceUri, to: destination });
  return destination;
}

export async function upsertItem(item: ItemRecord): Promise<ItemRecord> {
  const items = await loadItems();
  const index = items.findIndex((entry) => entry.id === item.id);
  const updated = { ...item, updatedAt: new Date().toISOString() };

  if (index >= 0) {
    items[index] = updated;
  } else {
    items.unshift(updated);
  }

  await saveItems(items);
  return updated;
}

export async function getItemById(id: string): Promise<ItemRecord | null> {
  const items = await loadItems();
  return items.find((entry) => entry.id === id) ?? null;
}

export function getCatalogItems(items: ItemRecord[] | null | undefined): ItemRecord[] {
  return (items ?? []).filter((item) => item.inCatalog);
}

export function getCatalogTotalEUR(items: ItemRecord[] | null | undefined): number {
  return getCatalogItems(items).reduce(
    (sum, item) => sum + item.estimatedPriceEUR,
    0,
  );
}

export function getCatalogRoomSummaries(
  items: ItemRecord[] | null | undefined,
): CatalogRoomSummary[] {
  const totals = new Map<string, CatalogRoomSummary>();

  for (const item of getCatalogItems(items)) {
    if (!item.roomId) {
      continue;
    }

    const existing = totals.get(item.roomId);

    if (existing) {
      existing.count += 1;
      existing.totalEUR += item.estimatedPriceEUR;
    } else {
      totals.set(item.roomId, {
        roomId: item.roomId,
        count: 1,
        totalEUR: item.estimatedPriceEUR,
      });
    }
  }

  return [...totals.values()];
}

export async function deleteStoredPhoto(photoUri: string): Promise<void> {
  if (!documentDirectory || !photoUri.startsWith(documentDirectory)) {
    return;
  }

  try {
    await deleteAsync(photoUri, { idempotent: true });
  } catch {
    // Photo may already be missing.
  }
}

export async function deleteItemById(id: string): Promise<boolean> {
  const items = await loadItems();
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    return false;
  }

  await deleteStoredPhoto(item.photoUri);
  await saveItems(items.filter((entry) => entry.id !== id));
  return true;
}

export function getCatalogItemsInRoom(
  items: ItemRecord[] | null | undefined,
  roomId: string,
): ItemRecord[] {
  return getCatalogItems(items).filter((item) => item.roomId === roomId);
}

export function countItemsInRoom(
  items: ItemRecord[] | null | undefined,
  roomId: string,
): number {
  return getCatalogItemsInRoom(items, roomId).length;
}
