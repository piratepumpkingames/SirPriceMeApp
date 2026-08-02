import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CatalogPdfError,
  exportAndShareCatalogPdf,
} from '../lib/exportCatalogPdf';
import type { ContentLocale } from '../lib/locale';
import { formatString, getStrings } from '../lib/locale';
import { resolveRoomLabel } from '../lib/rooms';
import type { CustomRoom } from '../lib/storage/customRooms';
import {
  getCatalogItems,
  getCatalogItemsInRoom,
  getCatalogRoomSummaries,
  getCatalogTotalEUR,
} from '../lib/storage/items';
import type { ItemRecord } from '../types/item';

type CatalogScreenProps = {
  items: ItemRecord[];
  locale: ContentLocale;
  customRooms: CustomRoom[];
  onBack: () => void;
  onSelectItem: (item: ItemRecord) => void;
};

export function CatalogScreen({
  items,
  locale,
  customRooms,
  onBack,
  onSelectItem,
}: CatalogScreenProps) {
  const strings = getStrings(locale);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const catalogItems = getCatalogItems(items);
  const total = getCatalogTotalEUR(items);
  const roomSummaries = getCatalogRoomSummaries(items).sort((a, b) =>
    resolveRoomLabel(a.roomId, locale, customRooms).localeCompare(
      resolveRoomLabel(b.roomId, locale, customRooms),
    ),
  );
  const roomItems = selectedRoomId
    ? getCatalogItemsInRoom(items, selectedRoomId)
    : [];

  function handleBack() {
    if (selectedRoomId) {
      setSelectedRoomId(null);
      return;
    }
    onBack();
  }

  async function handleExportPdf() {
    if (catalogItems.length === 0) {
      Alert.alert(strings.exportPdf, strings.catalogEmpty);
      return;
    }

    setIsExporting(true);

    try {
      await exportAndShareCatalogPdf({
        items,
        locale,
        customRooms,
        strings: {
          catalogTitle: strings.catalogTitle,
          catalogSummary: strings.catalogSummary,
          catalogDisclaimer: strings.catalogDisclaimer,
          disclaimerTitle: strings.disclaimerTitle,
          disclaimerBody: strings.disclaimerBody,
          condition: strings.condition,
          valueSourceAi: strings.valueSourceAi,
          notesLabel: strings.notesLabel,
          pdfExportedOn: strings.pdfExportedOn,
          pdfUnassignedRoom: strings.pdfUnassignedRoom,
          statusForSale: strings.statusForSale,
          statusListed: strings.statusListed,
          exportPdf: strings.exportPdf,
        },
      });
    } catch (error) {
      if (error instanceof CatalogPdfError && error.code === 'EMPTY_CATALOG') {
        Alert.alert(strings.exportPdf, strings.catalogEmpty);
        return;
      }

      const message =
        error instanceof Error ? error.message : strings.genericError;
      console.error('Catalog PDF export failed:', error);
      Alert.alert(strings.exportPdfFailedTitle, message);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable onPress={handleBack}>
        <Text style={styles.back}>{strings.back}</Text>
      </Pressable>

      <Text style={styles.heading}>{strings.catalogTitle}</Text>
      <Text style={styles.summary}>
        {formatString(strings.catalogSummary, {
          count: catalogItems.length,
          total: Math.round(total),
        })}
      </Text>

      <View style={styles.disclaimerBanner}>
        <Text style={styles.disclaimerText}>{strings.catalogDisclaimer}</Text>
      </View>

      <Pressable
        style={[
          styles.exportButton,
          (catalogItems.length === 0 || isExporting) && styles.exportButtonDisabled,
        ]}
        onPress={() => void handleExportPdf()}
        disabled={catalogItems.length === 0 || isExporting}
      >
        {isExporting ? (
          <View style={styles.exportRow}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.exportButtonText}>{strings.exportingPdf}</Text>
          </View>
        ) : (
          <Text style={styles.exportButtonText}>{strings.exportPdf}</Text>
        )}
      </Pressable>

      {catalogItems.length === 0 ? (
        <Text style={styles.empty}>{strings.catalogEmpty}</Text>
      ) : selectedRoomId ? (
        <>
          <Text style={styles.sectionTitle}>
            {resolveRoomLabel(selectedRoomId, locale, customRooms)}
          </Text>
          {roomItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.itemRow}
              onPress={() => onSelectItem(item)}
            >
              <Image source={{ uri: item.photoUri }} style={styles.thumb} />
              <View style={styles.itemMeta}>
                <Text style={styles.itemName}>{item.objectName}</Text>
                <Text style={styles.itemPrice}>
                  ~€{item.estimatedPriceEUR.toFixed(0)} · {strings.valueSourceAi}
                </Text>
                {item.forSale ? (
                  <Text style={styles.itemBadge}>
                    {item.listedAt ? strings.statusListed : strings.statusForSale}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          ))}
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>{strings.catalogChooseRoom}</Text>
          {roomSummaries.map((room) => (
            <Pressable
              key={room.roomId}
              style={styles.roomRow}
              onPress={() => setSelectedRoomId(room.roomId)}
            >
              <Text style={styles.roomName}>
                {resolveRoomLabel(room.roomId, locale, customRooms)}
              </Text>
              <Text style={styles.roomMeta}>
                {formatString(strings.roomItemCount, {
                  count: room.count,
                  total: Math.round(room.totalEUR),
                })}
              </Text>
            </Pressable>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  back: {
    color: '#1a5fb4',
    fontSize: 16,
    marginBottom: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summary: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  disclaimerBanner: {
    backgroundColor: '#fff8e6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0d998',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#6b5a2e',
    lineHeight: 18,
  },
  exportButton: {
    backgroundColor: '#1a5fb4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  exportButtonDisabled: {
    opacity: 0.55,
  },
  exportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  empty: {
    color: '#666',
    fontSize: 15,
    lineHeight: 22,
  },
  roomRow: {
    backgroundColor: '#f5f7fb',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  roomName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a5fb4',
    marginBottom: 4,
  },
  roomMeta: {
    fontSize: 14,
    color: '#666',
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    backgroundColor: '#f5f7fb',
    borderRadius: 10,
    padding: 10,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  itemMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#1a7f37',
    fontWeight: '600',
  },
  itemBadge: {
    marginTop: 4,
    fontSize: 12,
    color: '#1a5fb4',
    fontWeight: '600',
  },
});
