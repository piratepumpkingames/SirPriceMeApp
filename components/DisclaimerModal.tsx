import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';

type DisclaimerModalProps = {
  visible: boolean;
  locale: ContentLocale;
  onAccept: (dontShowAgain: boolean) => void;
  onCancel: () => void;
};

export function DisclaimerModal({
  visible,
  locale,
  onAccept,
  onCancel,
}: DisclaimerModalProps) {
  const strings = getStrings(locale);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!visible) {
      setChecked(false);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{strings.disclaimerTitle}</Text>
          <ScrollView style={styles.bodyScroll}>
            <Text style={styles.body}>{strings.disclaimerBody}</Text>
          </ScrollView>
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setChecked(!checked)}
          >
            <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>{strings.disclaimerCheckbox}</Text>
          </Pressable>
          <View style={styles.actions}>
            <Pressable style={styles.secondaryButton} onPress={onCancel}>
              <Text style={styles.secondaryButtonText}>{strings.back}</Text>
            </Pressable>
            <Pressable
              style={styles.primaryButton}
              onPress={() => onAccept(checked)}
            >
              <Text style={styles.primaryButtonText}>
                {strings.disclaimerContinue}
              </Text>
            </Pressable>
          </View>
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
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bodyScroll: {
    maxHeight: 220,
    marginBottom: 16,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#1a5fb4',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#1a5fb4',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#444',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  secondaryButtonText: {
    color: '#444',
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#1a5fb4',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
