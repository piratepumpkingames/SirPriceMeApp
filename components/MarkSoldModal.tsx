import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import type { ItemRecord } from '../types/item';

type MarkSoldModalProps = {
  visible: boolean;
  item: ItemRecord | null;
  locale: ContentLocale;
  onConfirm: (soldPriceEUR: number) => void;
  onCancel: () => void;
};

export function MarkSoldModal({
  visible,
  item,
  locale,
  onConfirm,
  onCancel,
}: MarkSoldModalProps) {
  const strings = getStrings(locale);
  const [priceText, setPriceText] = useState('');

  useEffect(() => {
    if (!item || !visible) {
      return;
    }

    setPriceText(String(item.soldPriceEUR ?? item.estimatedPriceEUR));
  }, [item, visible]);

  function handleConfirm() {
    const price = Number.parseFloat(priceText.replace(',', '.'));

    if (!Number.isFinite(price) || price < 0) {
      Alert.alert(strings.markAsSoldTitle, strings.invalidPrice);
      return;
    }

    onConfirm(price);
  }

  if (!item) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{strings.markAsSoldTitle}</Text>
          <Text style={styles.hint}>{strings.soldPriceHint}</Text>

          <Text style={styles.label}>{strings.soldPriceLabel}</Text>
          <TextInput
            style={styles.input}
            value={priceText}
            onChangeText={setPriceText}
            keyboardType="decimal-pad"
          />

          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>{strings.markAsSold}</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>{strings.cancel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 48,
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: '#1a7f37',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
