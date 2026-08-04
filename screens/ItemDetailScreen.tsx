import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/ui/AppButton';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SectionTitle } from '../components/ui/SectionTitle';
import { StatusChip } from '../components/ui/StatusChip';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import { resolveRoomLabel } from '../lib/rooms';
import { colors, screenContent, typography } from '../lib/theme';
import type { CustomRoom } from '../lib/storage/customRooms';
import type { ItemRecord } from '../types/item';

export type ItemDetailMode = 'scan' | 'catalog';

type ItemDetailScreenProps = {
  item: ItemRecord;
  locale: ContentLocale;
  customRooms: CustomRoom[];
  mode: ItemDetailMode;
  onBack: () => void;
  onSell: () => void;
  onAddToCatalog: () => void;
  onRemoveFromCatalog: () => void;
  onEdit: () => void;
  onMarkSold: () => void;
  onUnmarkSold: () => void;
  onDeleteItem: () => void;
  onOpenCatalog: () => void;
  onScanAnother: () => void;
};

export function ItemDetailScreen({
  item,
  locale,
  customRooms,
  mode,
  onBack,
  onSell,
  onAddToCatalog,
  onRemoveFromCatalog,
  onEdit,
  onMarkSold,
  onUnmarkSold,
  onDeleteItem,
  onOpenCatalog,
  onScanAnother,
}: ItemDetailScreenProps) {
  const strings = getStrings(locale);
  const displayPrice = item.soldAt
    ? (item.soldPriceEUR ?? item.estimatedPriceEUR)
    : item.estimatedPriceEUR;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {mode === 'catalog' ? (
        <ScreenHeader backLabel={strings.back} onBack={onBack} />
      ) : null}

      <Image source={{ uri: item.photoUri }} style={styles.preview} />
      <Text style={styles.title}>{item.objectName}</Text>
      <Text style={styles.price}>
        {item.soldAt ? '€' : '~€'}
        {displayPrice.toFixed(0)}
      </Text>

      <View style={styles.statusRow}>
        {item.inCatalog && item.roomId ? (
          <StatusChip
            label={`${strings.statusInCatalog}: ${resolveRoomLabel(item.roomId, locale, customRooms)}`}
          />
        ) : null}
        {item.soldAt ? (
          <StatusChip label={strings.statusSold} variant="sold" />
        ) : null}
        {!item.soldAt && item.forSale ? (
          <StatusChip
            label={item.listedAt ? strings.statusListed : strings.statusForSale}
          />
        ) : null}
      </View>

      <SectionTitle>{strings.itemDetailsSection}</SectionTitle>
      <Text style={styles.label}>{strings.condition}</Text>
      <Text style={styles.value}>{item.condition}</Text>
      <Text style={styles.label}>{strings.explanation}</Text>
      <Text style={styles.value}>{item.explanation}</Text>
      {item.userNotes.trim().length > 0 ? (
        <>
          <Text style={styles.label}>{strings.notesLabel}</Text>
          <Text style={styles.value}>{item.userNotes}</Text>
        </>
      ) : null}

      <SectionTitle>{strings.itemActionsSection}</SectionTitle>

      <AppButton label={strings.editItem} variant="ghost" onPress={onEdit} />

      {!item.soldAt ? (
        <AppButton label={strings.sellThisItem} onPress={onSell} />
      ) : null}

      {item.soldAt ? (
        <AppButton
          label={strings.unmarkAsSold}
          variant="secondary"
          onPress={onUnmarkSold}
        />
      ) : (
        <AppButton
          label={strings.markAsSold}
          variant="success"
          onPress={onMarkSold}
        />
      )}

      {item.inCatalog ? (
        <AppButton
          label={strings.removeFromCatalog}
          variant="danger"
          onPress={onRemoveFromCatalog}
        />
      ) : (
        <AppButton
          label={strings.addToCatalog}
          variant="secondary"
          onPress={onAddToCatalog}
        />
      )}

      <AppButton
        label={strings.deleteItem}
        variant="danger"
        onPress={onDeleteItem}
      />

      {mode === 'scan' ? (
        <>
          <AppButton
            label={strings.myCatalog}
            variant="secondary"
            onPress={onOpenCatalog}
          />
          <AppButton
            label={strings.scanAnother}
            variant="ghost"
            onPress={onScanAnother}
          />
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: screenContent,
  preview: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  price: {
    ...typography.price,
    marginBottom: 12,
  },
  statusRow: {
    gap: 8,
    marginBottom: 20,
  },
  label: {
    ...typography.label,
    marginBottom: 4,
  },
  value: {
    ...typography.body,
    marginBottom: 12,
  },
});
