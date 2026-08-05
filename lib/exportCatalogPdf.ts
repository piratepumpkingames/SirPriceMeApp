import * as Print from 'expo-print';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  documentDirectory,
  EncodingType,
  StorageAccessFramework,
  writeAsStringAsync,
} from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import type { ContentLocale } from './locale';
import { formatString } from './locale';
import { resolveRoomLabel } from './rooms';
import type { CustomRoom } from './storage/customRooms';
import { getCatalogItems, getCatalogTotalEUR } from './storage/items';
import type { ItemRecord } from '../types/item';

const UNASSIGNED_ROOM_ID = '__unassigned__';

export type CatalogPdfStrings = {
  catalogTitle: string;
  catalogSummary: string;
  catalogDisclaimer: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  condition: string;
  valueSourceAi: string;
  notesLabel: string;
  pdfExportedOn: string;
  pdfUnassignedRoom: string;
  statusForSale: string;
  statusListed: string;
  statusSold: string;
  exportPdf: string;
  savePdfToPhone: string;
  pdfSerialNumber: string;
  pdfModelNumber: string;
  pdfBarcode: string;
};

type ExportCatalogPdfOptions = {
  items: ItemRecord[];
  locale: ContentLocale;
  customRooms: CustomRoom[];
  strings: CatalogPdfStrings;
};

const LOCALE_TAGS: Record<ContentLocale, string> = {
  en: 'en-GB',
  sl: 'sl-SI',
  hr: 'hr-HR',
  de: 'de-DE',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatExportDate(locale: ContentLocale): string {
  return new Date().toLocaleDateString(LOCALE_TAGS[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getSaleStatus(item: ItemRecord, strings: CatalogPdfStrings): string | null {
  if (item.soldAt) {
    const soldPrice = item.soldPriceEUR ?? item.estimatedPriceEUR;
    return `${strings.statusSold} · €${soldPrice.toFixed(0)}`;
  }

  if (!item.forSale) {
    return null;
  }

  return item.listedAt ? strings.statusListed : strings.statusForSale;
}

function groupItemsByRoom(
  items: ItemRecord[],
  locale: ContentLocale,
  customRooms: CustomRoom[],
  strings: CatalogPdfStrings,
): { roomId: string; roomLabel: string; items: ItemRecord[] }[] {
  const groups = new Map<string, ItemRecord[]>();

  for (const item of getCatalogItems(items)) {
    const roomId = item.roomId ?? UNASSIGNED_ROOM_ID;
    const roomItems = groups.get(roomId) ?? [];
    roomItems.push(item);
    groups.set(roomId, roomItems);
  }

  return [...groups.entries()]
    .map(([roomId, roomItems]) => ({
      roomId,
      roomLabel:
        roomId === UNASSIGNED_ROOM_ID
          ? strings.pdfUnassignedRoom
          : resolveRoomLabel(roomId, locale, customRooms),
      items: roomItems.sort((a, b) =>
        a.objectName.localeCompare(b.objectName, LOCALE_TAGS[locale]),
      ),
    }))
    .sort((a, b) =>
      a.roomLabel.localeCompare(b.roomLabel, LOCALE_TAGS[locale]),
    );
}

function buildItemHtml(item: ItemRecord, strings: CatalogPdfStrings): string {
  const saleStatus = getSaleStatus(item, strings);
  const metaParts = [
    `${strings.condition}: ${item.condition}`,
    `~€${item.estimatedPriceEUR.toFixed(0)} (${strings.valueSourceAi})`,
  ];

  if (saleStatus) {
    metaParts.push(saleStatus);
  }

  const notes =
    item.userNotes.trim().length > 0
      ? `<div class="item-notes">${escapeHtml(strings.notesLabel)}: ${escapeHtml(item.userNotes.trim())}</div>`
      : '';

  const idLines: string[] = [];
  if (item.serialNumber.trim()) {
    idLines.push(
      `${strings.pdfSerialNumber}: ${escapeHtml(item.serialNumber.trim())}`,
    );
  }
  if (item.modelNumber.trim()) {
    idLines.push(
      `${strings.pdfModelNumber}: ${escapeHtml(item.modelNumber.trim())}`,
    );
  }
  if (item.barcode.trim()) {
    idLines.push(`${strings.pdfBarcode}: ${escapeHtml(item.barcode.trim())}`);
  }

  const identification =
    idLines.length > 0
      ? `<div class="item-notes">${escapeHtml(idLines.join(' · '))}</div>`
      : '';

  return `
    <div class="item">
      <div class="item-name">${escapeHtml(item.objectName)}</div>
      <div class="item-meta">${escapeHtml(metaParts.join(' · '))}</div>
      ${identification}
      ${notes}
    </div>
  `;
}

function buildCatalogHtml({
  items,
  locale,
  customRooms,
  strings,
}: ExportCatalogPdfOptions): string {
  const catalogItems = getCatalogItems(items);
  const total = getCatalogTotalEUR(items);
  const roomGroups = groupItemsByRoom(items, locale, customRooms, strings);
  const exportedOn = formatString(strings.pdfExportedOn, {
    date: formatExportDate(locale),
  });

  const roomsHtml = roomGroups
    .map(
      (room) => `
        <section class="room">
          <h2>${escapeHtml(room.roomLabel)}</h2>
          ${room.items.map((item) => buildItemHtml(item, strings)).join('')}
        </section>
      `,
    )
    .join('');

  const disclaimerParagraphs = strings.disclaimerBody
    .split('\n\n')
    .map((paragraph) => `<p>${escapeHtml(paragraph.replace(/\n/g, ' '))}</p>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 12px;
        color: #222;
        margin: 24px;
      }
      h1 {
        font-size: 20px;
        margin: 0 0 4px;
      }
      .summary,
      .exported-on {
        color: #666;
        margin: 0 0 8px;
      }
      .exported-on {
        margin-bottom: 20px;
        font-size: 11px;
      }
      .room {
        margin-bottom: 18px;
        page-break-inside: avoid;
      }
      .room h2 {
        font-size: 14px;
        color: #1a5fb4;
        border-bottom: 1px solid #ddd;
        padding-bottom: 4px;
        margin: 0 0 8px;
      }
      .item {
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }
      .item-name {
        font-weight: 700;
      }
      .item-meta {
        color: #555;
        margin-top: 2px;
      }
      .item-notes {
        color: #666;
        margin-top: 4px;
        font-size: 11px;
      }
      .footer {
        margin-top: 32px;
        padding: 12px;
        border-top: 2px solid #f0d998;
        background: #fff8e6;
        font-size: 10px;
        color: #6b5a2e;
        line-height: 1.5;
        page-break-inside: avoid;
      }
      .footer-title {
        font-weight: 700;
        margin-bottom: 6px;
      }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(strings.catalogTitle)}</h1>
    <p class="summary">${escapeHtml(
      formatString(strings.catalogSummary, {
        count: catalogItems.length,
        total: Math.round(total),
      }),
    )}</p>
    <p class="exported-on">${escapeHtml(exportedOn)}</p>
    ${roomsHtml}
    <footer class="footer">
      <div class="footer-title">${escapeHtml(strings.disclaimerTitle)}</div>
      <p>${escapeHtml(strings.catalogDisclaimer)}</p>
      ${disclaimerParagraphs}
    </footer>
  </body>
</html>`;
}

export class CatalogPdfError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'EMPTY_CATALOG'
      | 'SHARING_UNAVAILABLE'
      | 'EXPORT_FAILED'
      | 'SAVE_CANCELLED',
  ) {
    super(message);
    this.name = 'CatalogPdfError';
  }
}

const PDF_SAVE_DIR_KEY = '@sirpriceme/pdf_save_dir';

async function generateCatalogPdfBase64(
  options: ExportCatalogPdfOptions,
): Promise<string> {
  const catalogItems = getCatalogItems(options.items);

  if (catalogItems.length === 0) {
    throw new CatalogPdfError('Catalog is empty.', 'EMPTY_CATALOG');
  }

  const html = buildCatalogHtml(options);
  const result = await Print.printToFileAsync({ html, base64: true });

  if (!result.base64) {
    throw new CatalogPdfError(
      'PDF data was not returned.',
      'EXPORT_FAILED',
    );
  }

  return result.base64;
}

async function prepareShareablePdfUri(base64: string): Promise<string> {
  if (!documentDirectory) {
    throw new CatalogPdfError(
      'PDF could not be saved for sharing.',
      'EXPORT_FAILED',
    );
  }

  const destination = `${documentDirectory}sirpriceme-catalog-${Date.now()}.pdf`;
  await writeAsStringAsync(destination, base64, {
    encoding: EncodingType.Base64,
  });
  return destination;
}

export async function exportAndShareCatalogPdf(
  options: ExportCatalogPdfOptions,
): Promise<void> {
  let uri: string;
  try {
    const base64 = await generateCatalogPdfBase64(options);
    uri = await prepareShareablePdfUri(base64);
  } catch (error) {
    if (error instanceof CatalogPdfError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new CatalogPdfError(message, 'EXPORT_FAILED');
  }

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new CatalogPdfError('Sharing is not available on this device.', 'SHARING_UNAVAILABLE');
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: options.strings.exportPdf,
  });
}

async function resolveSaveDirectoryUri(): Promise<string> {
  const savedUri = await AsyncStorage.getItem(PDF_SAVE_DIR_KEY);
  if (savedUri) {
    return savedUri;
  }

  const initialUri = StorageAccessFramework.getUriForDirectoryInRoot('Download');
  const permissions =
    await StorageAccessFramework.requestDirectoryPermissionsAsync(initialUri);

  if (!permissions.granted) {
    throw new CatalogPdfError('Save location was not selected.', 'SAVE_CANCELLED');
  }

  await AsyncStorage.setItem(PDF_SAVE_DIR_KEY, permissions.directoryUri);
  return permissions.directoryUri;
}

export async function saveCatalogPdfToDevice(
  options: ExportCatalogPdfOptions,
): Promise<string> {
  if (Platform.OS !== 'android') {
    throw new CatalogPdfError(
      'Direct save is only supported on Android.',
      'EXPORT_FAILED',
    );
  }

  const base64 = await generateCatalogPdfBase64(options);
  const directoryUri = await resolveSaveDirectoryUri();
  const fileName = `sirpriceme-catalog-${Date.now()}`;
  const fileUri = await StorageAccessFramework.createFileAsync(
    directoryUri,
    fileName,
    'application/pdf',
  );

  await StorageAccessFramework.writeAsStringAsync(fileUri, base64, {
    encoding: EncodingType.Base64,
  });

  return fileName;
}
