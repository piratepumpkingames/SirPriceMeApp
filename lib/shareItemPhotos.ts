import * as Sharing from 'expo-sharing';
import { persistPhotoUri } from './storage/items';
import type { ItemPhoto } from '../types/item';

export class ItemPhotosError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'NO_PHOTOS'
      | 'SHARING_UNAVAILABLE'
      | 'PERMISSION_DENIED'
      | 'SHARE_FAILED'
      | 'SAVE_FAILED',
  ) {
    super(message);
    this.name = 'ItemPhotosError';
  }
}

async function ensureShareableUri(uri: string): Promise<string> {
  return persistPhotoUri(uri);
}

export async function shareItemPhotos(
  photos: ItemPhoto[],
  dialogTitle: string,
): Promise<void> {
  if (photos.length === 0) {
    throw new ItemPhotosError('No photos to share.', 'NO_PHOTOS');
  }

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new ItemPhotosError(
      'Sharing is not available on this device.',
      'SHARING_UNAVAILABLE',
    );
  }

  const shareableUris = await Promise.all(
    photos.map((photo) => ensureShareableUri(photo.uri)),
  );

  for (let index = 0; index < shareableUris.length; index += 1) {
    const title =
      photos.length > 1
        ? `${dialogTitle} (${index + 1}/${photos.length})`
        : dialogTitle;

    try {
      await Sharing.shareAsync(shareableUris[index], {
        mimeType: photos[index]?.mimeType ?? 'image/jpeg',
        dialogTitle: title,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ItemPhotosError(message, 'SHARE_FAILED');
    }
  }
}

export async function saveItemPhotosToGallery(photos: ItemPhoto[]): Promise<number> {
  if (photos.length === 0) {
    throw new ItemPhotosError('No photos to save.', 'NO_PHOTOS');
  }

  const MediaLibrary = await import('expo-media-library/legacy');

  const permission = await MediaLibrary.requestPermissionsAsync();
  if (!permission.granted) {
    throw new ItemPhotosError(
      'Photo library permission was not granted.',
      'PERMISSION_DENIED',
    );
  }

  let savedCount = 0;

  for (const photo of photos) {
    try {
      const uri = await ensureShareableUri(photo.uri);
      await MediaLibrary.saveToLibraryAsync(uri);
      savedCount += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new ItemPhotosError(message, 'SAVE_FAILED');
    }
  }

  return savedCount;
}
