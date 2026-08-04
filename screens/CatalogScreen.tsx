import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppButton } from '../components/ui/AppButton';
import { EmptyState } from '../components/ui/EmptyState';
import { HintBanner } from '../components/ui/HintBanner';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SectionTitle } from '../components/ui/SectionTitle';
import { StatusChip } from '../components/ui/StatusChip';
import {
  CatalogPdfError,
  exportAndShareCatalogPdf,
  saveCatalogPdfToDevice,
} from '../lib/exportCatalogPdf';
import type { ContentLocale } from '../lib/locale';
import { formatString, getStrings } from '../lib/locale';
import { resolveRoomLabel } from '../lib/rooms';
import { colors, radii, screenContent, typography } from '../lib/theme';
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
  showPdfExportHint: boolean;
  onDismissPdfHint: () => void;
  onBack: () => void;
  onSelectItem: (item: ItemRecord) => void;
  onManageRooms: () => void;
};

export function CatalogScreen({
  items,
  locale,
  customRooms,
  showPdfExportHint,
  onDismissPdfHint,
  onBack,
  onSelectItem,
  onManageRooms,
}: CatalogScreenProps) {
  const strings = getStrings(locale);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isSharingPdf, setIsSharingPdf] = useState(false);
  const [isSavingPdf, setIsSavingPdf] = useState(false);

  const pdfStrings = useMemo(
    () => ({
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
      statusSold: strings.statusSold,
      exportPdf: strings.sharePdf,
      savePdfToPhone: strings.savePdfToPhone,
    }),
    [strings],
  );

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

  async function handleSharePdf() {
    if (catalogItems.length === 0) {
      Alert.alert(strings.sharePdf, strings.catalogEmpty);
      return;
    }

    setIsSharingPdf(true);

    try {
      await exportAndShareCatalogPdf({
        items,
        locale,
        customRooms,
        strings: pdfStrings,
      });
    } catch (error) {
      if (error instanceof CatalogPdfError && error.code === 'EMPTY_CATALOG') {
        Alert.alert(strings.sharePdf, strings.catalogEmpty);
        return;
      }

      const message =
        error instanceof Error ? error.message : strings.genericError;
      console.error('Catalog PDF share failed:', error);
      Alert.alert(strings.exportPdfFailedTitle, message);
    } finally {
      setIsSharingPdf(false);
    }
  }

  async function handleSavePdf() {
    if (catalogItems.length === 0) {
      Alert.alert(strings.savePdfToPhone, strings.catalogEmpty);
      return;
    }

    setIsSavingPdf(true);

    try {
      await saveCatalogPdfToDevice({
        items,
        locale,
        customRooms,
        strings: pdfStrings,
      });
      Alert.alert(strings.savePdfToPhone, strings.pdfSavedToPhone);
    } catch (error) {
      if (error instanceof CatalogPdfError && error.code === 'SAVE_CANCELLED') {
        return;
      }
      if (error instanceof CatalogPdfError && error.code === 'EMPTY_CATALOG') {
        Alert.alert(strings.savePdfToPhone, strings.catalogEmpty);
        return;
      }

      const message =
        error instanceof Error ? error.message : strings.genericError;
      console.error('Catalog PDF save failed:', error);
      Alert.alert(strings.exportPdfFailedTitle, message);
    } finally {
      setIsSavingPdf(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader
        backLabel={strings.back}
        title={strings.catalogTitle}
        onBack={handleBack}
      />

      <Text style={styles.summary}>
        {formatString(strings.catalogSummary, {
          count: catalogItems.length,
          total: Math.round(total),
        })}
      </Text>

      <View style={styles.disclaimerBanner}>
        <Text style={styles.disclaimerText}>{strings.catalogDisclaimer}</Text>
      </View>

      {showPdfExportHint && catalogItems.length > 0 ? (
        <HintBanner
          message={strings.pdfExportHint}
          dismissLabel={strings.dismissHint}
          onDismiss={onDismissPdfHint}
        />
      ) : null}

      <View style={styles.pdfRow}>
        <Pressable
          style={[
            styles.exportButton,
            styles.exportButtonHalf,
            (catalogItems.length === 0 || isSharingPdf) && styles.exportButtonDisabled,
          ]}
          onPress={() => void handleSharePdf()}
          disabled={catalogItems.length === 0 || isSharingPdf}
        >
          {isSharingPdf ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.exportButtonText}>{strings.sharePdf}</Text>
          )}
        </Pressable>

        {Platform.OS === 'android' ? (
          <Pressable
            style={[
              styles.saveButton,
              styles.exportButtonHalf,
              (catalogItems.length === 0 || isSavingPdf) && styles.exportButtonDisabled,
            ]}
            onPress={() => void handleSavePdf()}
            disabled={catalogItems.length === 0 || isSavingPdf}
          >
            {isSavingPdf ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.exportButtonText}>{strings.savePdfToPhone}</Text>
            )}
          </Pressable>
        ) : null}
      </View>

      {!selectedRoomId && customRooms.length > 0 ? (
        <AppButton
          label={strings.manageRooms}
          variant="secondary"
          onPress={onManageRooms}
        />
      ) : null}

      {catalogItems.length === 0 ? (
        <EmptyState
          title={strings.catalogEmptyTitle}
          message={strings.catalogEmpty}
        />
      ) : selectedRoomId ? (
        <>
          <SectionTitle>
            {resolveRoomLabel(selectedRoomId, locale, customRooms)}
          </SectionTitle>
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
                <View style={styles.badgeRow}>
                  {item.soldAt ? (
                    <StatusChip label={strings.statusSold} variant="sold" />
                  ) : null}
                  {!item.soldAt && item.forSale ? (
                    <StatusChip
                      label={
                        item.listedAt ? strings.statusListed : strings.statusForSale
                      }
                    />
                  ) : null}
                </View>
              </View>
            </Pressable>
          ))}
        </>
      ) : (
        <>
          <SectionTitle>{strings.catalogChooseRoom}</SectionTitle>
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
  content: screenContent,
  summary: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  disclaimerBanner: {
    backgroundColor: colors.warningBg,
    borderRadius: radii.md,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  disclaimerText: {
    ...typography.hint,
    color: colors.warningText,
  },
  pdfRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  exportButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: colors.success,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  exportButtonHalf: {
    flex: 1,
  },
  exportButtonDisabled: {
    opacity: 0.55,
  },
  exportButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  roomRow: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 10,
  },
  roomName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  roomMeta: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 10,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
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
    color: colors.text,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
});
