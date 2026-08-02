import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import { resolveRoomLabel } from '../lib/rooms';
import type { CustomRoom } from '../lib/storage/customRooms';
import type { ItemRecord } from '../types/item';

type ResultHubScreenProps = {
  item: ItemRecord;
  locale: ContentLocale;
  customRooms: CustomRoom[];
  onSell: () => void;
  onAddToCatalog: () => void;
  onRemoveFromCatalog: () => void;
  onOpenCatalog: () => void;
  onScanAnother: () => void;
};

export function ResultHubScreen({
  item,
  locale,
  customRooms,
  onSell,
  onAddToCatalog,
  onRemoveFromCatalog,
  onOpenCatalog,
  onScanAnother,
}: ResultHubScreenProps) {
  const strings = getStrings(locale);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={{ uri: item.photoUri }} style={styles.preview} />
      <Text style={styles.title}>{item.objectName}</Text>
      <Text style={styles.price}>~€{item.estimatedPriceEUR.toFixed(0)}</Text>

      <View style={styles.statusRow}>
        {item.inCatalog && item.roomId ? (
          <Text style={styles.statusChip}>
            {strings.statusInCatalog}:{' '}
            {resolveRoomLabel(item.roomId, locale, customRooms)}
          </Text>
        ) : null}
        {item.forSale ? (
          <Text style={styles.statusChip}>
            {item.listedAt ? strings.statusListed : strings.statusForSale}
          </Text>
        ) : null}
      </View>

      <Text style={styles.label}>{strings.condition}</Text>
      <Text style={styles.value}>{item.condition}</Text>
      <Text style={styles.label}>{strings.explanation}</Text>
      <Text style={styles.value}>{item.explanation}</Text>

      <Pressable style={styles.primaryAction} onPress={onSell}>
        <Text style={styles.primaryActionText}>{strings.sellThisItem}</Text>
      </Pressable>
      {item.inCatalog ? (
        <Pressable style={styles.dangerAction} onPress={onRemoveFromCatalog}>
          <Text style={styles.dangerActionText}>{strings.removeFromCatalog}</Text>
        </Pressable>
      ) : (
        <Pressable style={styles.secondaryAction} onPress={onAddToCatalog}>
          <Text style={styles.secondaryActionText}>{strings.addToCatalog}</Text>
        </Pressable>
      )}

      <Pressable style={styles.linkButton} onPress={onOpenCatalog}>
        <Text style={styles.linkButtonText}>{strings.myCatalog}</Text>
      </Pressable>
      <Pressable style={styles.linkButton} onPress={onScanAnother}>
        <Text style={styles.linkButtonText}>{strings.scanAnother}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 40,
  },
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
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a7f37',
    marginBottom: 12,
  },
  statusRow: {
    gap: 8,
    marginBottom: 16,
  },
  statusChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f2ff',
    color: '#1a5fb4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    fontSize: 13,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
  },
  primaryAction: {
    backgroundColor: '#1a5fb4',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryAction: {
    borderColor: '#1a5fb4',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryActionText: {
    color: '#1a5fb4',
    fontSize: 16,
    fontWeight: '700',
  },
  dangerAction: {
    borderColor: '#b00020',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  dangerActionText: {
    color: '#b00020',
    fontSize: 16,
    fontWeight: '700',
  },
  linkButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#666',
    fontSize: 15,
  },
});
