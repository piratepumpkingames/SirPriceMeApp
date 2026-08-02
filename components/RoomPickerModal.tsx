import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import { PRESET_ROOM_IDS, resolveRoomLabel } from '../lib/rooms';
import type { CustomRoom } from '../lib/storage/customRooms';

type RoomPickerModalProps = {
  visible: boolean;
  locale: ContentLocale;
  customRooms: CustomRoom[];
  onSelect: (roomId: string) => void;
  onCreateCustomRoom: (label: string) => Promise<CustomRoom>;
  onCancel: () => void;
};

export function RoomPickerModal({
  visible,
  locale,
  customRooms = [],
  onSelect,
  onCreateCustomRoom,
  onCancel,
}: RoomPickerModalProps) {
  const strings = getStrings(locale);
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowNewRoomForm(false);
      setNewRoomName('');
      setIsSaving(false);
    }
  }, [visible]);

  async function handleSaveNewRoom() {
    const trimmed = newRoomName.trim();
    if (!trimmed) {
      Alert.alert(strings.newRoomTitle, strings.roomNameRequired);
      return;
    }

    setIsSaving(true);
    try {
      const room = await onCreateCustomRoom(trimmed);
      onSelect(room.id);
    } catch {
      Alert.alert(strings.newRoomTitle, strings.roomNameRequired);
    } finally {
      setIsSaving(false);
    }
  }

  const newRoomForm = (
    <View style={[styles.card, styles.cardForm]}>
      <Text style={styles.title}>{strings.newRoomTitle}</Text>
      <Text style={styles.hint}>{strings.newRoomHint}</Text>
      <TextInput
        style={styles.input}
        value={newRoomName}
        onChangeText={setNewRoomName}
        placeholder={strings.newRoomPlaceholder}
        autoFocus
      />
      <Pressable
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={() => void handleSaveNewRoom()}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>{strings.saveRoom}</Text>
      </Pressable>
      <Pressable
        style={styles.cancelButton}
        onPress={() => setShowNewRoomForm(false)}
      >
        <Text style={styles.cancelButtonText}>{strings.back}</Text>
      </Pressable>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        {showNewRoomForm ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.formAvoider}
          >
            {newRoomForm}
          </KeyboardAvoidingView>
        ) : (
          <View style={[styles.card, styles.cardList]}>
            <Text style={styles.title}>{strings.pickRoom}</Text>
            <Text style={styles.hint}>{strings.pickRoomHint}</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              {(PRESET_ROOM_IDS ?? []).map((roomId) => (
                <Pressable
                  key={roomId}
                  style={styles.roomOption}
                  onPress={() => onSelect(roomId)}
                >
                  <Text style={styles.roomOptionText}>
                    {resolveRoomLabel(roomId, locale, customRooms)}
                  </Text>
                </Pressable>
              ))}
              {customRooms.map((room) => (
                <Pressable
                  key={room.id}
                  style={styles.roomOption}
                  onPress={() => onSelect(room.id)}
                >
                  <Text style={styles.roomOptionText}>{room.label}</Text>
                </Pressable>
              ))}
              <Pressable
                style={styles.newRoomOption}
                onPress={() => setShowNewRoomForm(true)}
              >
                <Text style={styles.newRoomOptionText}>{strings.newRoom}</Text>
              </Pressable>
            </ScrollView>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>{strings.back}</Text>
            </Pressable>
          </View>
        )}
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
    flexShrink: 0,
  },
  cardList: {
    maxHeight: '70%',
  },
  cardForm: {
    width: '100%',
  },
  formAvoider: {
    width: '100%',
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 48,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#1a5fb4',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  roomOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  roomOptionText: {
    fontSize: 16,
    color: '#1a5fb4',
    fontWeight: '600',
  },
  newRoomOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  newRoomOptionText: {
    fontSize: 16,
    color: '#1a7f37',
    fontWeight: '700',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
