import { StyleSheet, Text, View } from 'react-native';
import { ItemPhotoGallery } from '../components/ItemPhotoGallery';
import { AppHeader, type AppHeaderAction } from '../components/ui/AppHeader';
import { AppIcon } from '../components/ui/AppIcon';
import { BottomActionBar } from '../components/ui/BottomActionBar';
import { ScreenLayout } from '../components/ui/ScreenLayout';
import { SectionTitle } from '../components/ui/SectionTitle';
import { StatusChip } from '../components/ui/StatusChip';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import { resolveRoomLabel } from '../lib/rooms';
import { colors, typography } from '../lib/theme';
import type { CustomRoom } from '../lib/storage/customRooms';
import { hasIdentification, type ItemRecord } from '../types/item';

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
  onAddPhoto: () => void;
  onRemovePhoto: (index: number) => void;
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
  onAddPhoto,
  onRemovePhoto,
  onOpenCatalog,
  onScanAnother,
}: ItemDetailScreenProps) {
  const strings = getStrings(locale);
  const displayPrice = item.soldAt
    ? (item.soldPriceEUR ?? item.estimatedPriceEUR)
    : item.estimatedPriceEUR;

  const headerTitle =
    mode === 'scan' ? strings.scanResultTitle : item.objectName;

  const headerActions: AppHeaderAction[] = [
    {
      icon: <AppIcon name="list-outline" size="lg" />,
      accessibilityLabel: strings.myCatalog,
      onPress: onOpenCatalog,
    },
    {
      icon: <AppIcon name="camera-outline" size="lg" />,
      accessibilityLabel: strings.scanAnother,
      onPress: onScanAnother,
    },
    {
      icon: <AppIcon name="create-outline" size="lg" />,
      accessibilityLabel: strings.editItem,
      onPress: onEdit,
    },
  ];

  const footer = !item.soldAt ? (
    item.inCatalog ? (
      <BottomActionBar
        primaryLabel={strings.sellThisItem}
        onPrimaryPress={onSell}
        secondaryLabel={strings.removeFromCatalog}
        onSecondaryPress={onRemoveFromCatalog}
      />
    ) : (
      <BottomActionBar
        primaryLabel={strings.addToCatalog}
        onPrimaryPress={onAddToCatalog}
        secondaryLabel={strings.sellThisItem}
        onSecondaryPress={onSell}
      />
    )
  ) : null;

  return (
    <ScreenLayout
      header={
        <AppHeader
          title={headerTitle}
          backLabel={strings.back}
          onBack={onBack}
          actions={headerActions}
        />
      }
      footer={footer}
    >
      <ItemPhotoGallery
        photos={item.photos}
        locale={locale}
        editable
        onAddPhoto={onAddPhoto}
        onRemovePhoto={onRemovePhoto}
      />

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

      {hasIdentification(item) ? (
        <>
          <SectionTitle>{strings.identificationSection}</SectionTitle>
          {item.serialNumber.trim().length > 0 ? (
            <>
              <Text style={styles.label}>{strings.serialNumberLabel}</Text>
              <Text style={styles.value}>{item.serialNumber}</Text>
            </>
          ) : null}
          {item.modelNumber.trim().length > 0 ? (
            <>
              <Text style={styles.label}>{strings.modelNumberLabel}</Text>
              <Text style={styles.value}>{item.modelNumber}</Text>
            </>
          ) : null}
          {item.barcode.trim().length > 0 ? (
            <>
              <Text style={styles.label}>{strings.barcodeLabel}</Text>
              <Text style={styles.value}>{item.barcode}</Text>
            </>
          ) : null}
        </>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
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
