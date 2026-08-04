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
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import type { ItemRecord } from '../types/item';

export type ItemEditDraft = {
  objectName: string;
  condition: string;
  estimatedPriceEUR: number;
  explanation: string;
  userNotes: string;
};

type EditItemModalProps = {
  visible: boolean;
  item: ItemRecord | null;
  locale: ContentLocale;
  onSave: (draft: ItemEditDraft) => void;
  onCancel: () => void;
};

export function EditItemModal({
  visible,
  item,
  locale,
  onSave,
  onCancel,
}: EditItemModalProps) {
  const strings = getStrings(locale);
  const [objectName, setObjectName] = useState('');
  const [condition, setCondition] = useState('');
  const [priceText, setPriceText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [userNotes, setUserNotes] = useState('');

  useEffect(() => {
    if (!item || !visible) {
      return;
    }

    setObjectName(item.objectName);
    setCondition(item.condition);
    setPriceText(String(item.estimatedPriceEUR));
    setExplanation(item.explanation);
    setUserNotes(item.userNotes);
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
    });
  }

  if (!item) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>{strings.editItemTitle}</Text>

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
          </ScrollView>

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{strings.saveChanges}</Text>
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
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '85%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 44,
    backgroundColor: '#fff',
    marginBottom: 14,
  },
  multiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#1a5fb4',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
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
