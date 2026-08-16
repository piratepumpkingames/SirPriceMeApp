import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarcodeScanModal } from './BarcodeScanModal';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import { colors, radii } from '../lib/theme';
import type { ItemRecord } from '../types/item';

export type ItemEditDraft = {
  objectName: string;
  condition: string;
  estimatedPriceEUR: number;
  explanation: string;
  userNotes: string;
  serialNumber: string;
  modelNumber: string;
  barcode: string;
};

type EditItemModalProps = {
  visible: boolean;
  item: ItemRecord | null;
  locale: ContentLocale;
  onSave: (draft: ItemEditDraft) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

export function EditItemModal({
  visible,
  item,
  locale,
  onSave,
  onCancel,
  onDelete,
}: EditItemModalProps) {
  const strings = getStrings(locale);
  const [objectName, setObjectName] = useState('');
  const [condition, setCondition] = useState('');
  const [priceText, setPriceText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  useEffect(() => {
    if (!item || !visible) {
      return;
    }

    setObjectName(item.objectName);
    setCondition(item.condition);
    setPriceText(String(item.estimatedPriceEUR));
    setExplanation(item.explanation);
    setUserNotes(item.userNotes);
    setSerialNumber(item.serialNumber);
    setModelNumber(item.modelNumber);
    setBarcode(item.barcode);
  }, [item, visible]);

  function handleSave() {
    const trimmedName = objectName.trim();
    const price = Number.parseFloat(priceText.replace(',', '.'));

    if (!trimmedName) {
      Alert.alert(strings.editItemTitle, strings.itemNameRequired);
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      Alert.alert(strings.editItemTitle, strings.invalidPrice);
      return;
    }

    onSave({
      objectName: trimmedName,
      condition: condition.trim(),
      estimatedPriceEUR: price,
      explanation: explanation.trim(),
      userNotes: userNotes.trim(),
      serialNumber: serialNumber.trim(),
      modelNumber: modelNumber.trim(),
      barcode: barcode.trim(),
    });
  }

  function handleBarcodeScanned(value: string) {
    setBarcode(value);
    setShowBarcodeScanner(false);
    Alert.alert(strings.scanBarcodeTitle, strings.barcodeScanned);
  }

  if (!item) {
    return null;
  }

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <SafeAreaView edges={['bottom']} style={styles.card}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={styles.title}>{strings.editItemTitle}</Text>

              <Text style={styles.sectionLabel}>{strings.itemDetailsSection}</Text>

              <Text style={styles.label}>{strings.itemNameLabel}</Text>
              <TextInput style={styles.input} value={objectName} onChangeText={setObjectName} />

              <Text style={styles.label}>{strings.priceLabel}</Text>
              <TextInput
                style={styles.input}
                value={priceText}
                onChangeText={setPriceText}
                keyboardType="decimal-pad"
              />

              <Text style={styles.label}>{strings.condition}</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={condition}
                onChangeText={setCondition}
                multiline
              />

              <Text style={styles.label}>{strings.explanation}</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={explanation}
                onChangeText={setExplanation}
                multiline
              />

              <Text style={styles.label}>{strings.notesLabel}</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={userNotes}
                onChangeText={setUserNotes}
                multiline
              />

              <Text style={styles.sectionLabel}>{strings.identificationSection}</Text>
              <Text style={styles.sectionHint}>{strings.identificationHint}</Text>

              <Text style={styles.label}>{strings.serialNumberLabel}</Text>
              <TextInput
                style={styles.input}
                value={serialNumber}
                onChangeText={setSerialNumber}
                autoCapitalize="characters"
              />

              <Text style={styles.label}>{strings.modelNumberLabel}</Text>
              <TextInput
                style={styles.input}
                value={modelNumber}
                onChangeText={setModelNumber}
                autoCapitalize="characters"
              />

              <Text style={styles.label}>{strings.barcodeLabel}</Text>
              <TextInput
                style={styles.input}
                value={barcode}
                onChangeText={setBarcode}
                keyboardType="number-pad"
              />

              <Pressable
                style={styles.scanButton}
                onPress={() => setShowBarcodeScanner(true)}
              >
                <Text style={styles.scanButtonText}>{strings.scanBarcode}</Text>
              </Pressable>
            </ScrollView>

            <View style={styles.actions}>
              <Pressable style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{strings.saveChanges}</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>{strings.cancel}</Text>
              </Pressable>
              {onDelete ? (
                <Pressable style={styles.deleteButton} onPress={onDelete}>
                  <Text style={styles.deleteButtonText}>{strings.deleteItem}</Text>
                </Pressable>
              ) : null}
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      <BarcodeScanModal
        visible={showBarcodeScanner}
        locale={locale}
        onScan={handleBarcodeScanned}
        onCancel={() => setShowBarcodeScanner(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '90%',
  },
  scrollContent: {
    paddingBottom: 8,
  },
  actions: {
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
    backgroundColor: colors.white,
    marginBottom: 14,
  },
  multiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  scanButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  scanButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  deleteButton: {
    paddingVertical: 12,
    paddingBottom: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});
