import { isRunningInExpoGo } from 'expo';
import { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
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

const shouldManualKeyboardLift =
  Platform.OS === 'android' && !isRunningInExpoGo();

function RoomPickerSheet({
  locale,
  customRooms = [],
  onSelect,
  onCreateCustomRoom,
  onCancel,
}: Omit<RoomPickerModalProps, 'visible'>) {
  const strings = getStrings(locale);
  const insets = useSafeAreaInsets();
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!shouldManualKeyboardLift || !showNewRoomForm) {
      setKeyboardHeight(0);
      return;
    }

    const showSub = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [showNewRoomForm]);

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

  const navBarPad = Math.max(insets.bottom, 8);
  const keyboardLift =
    keyboardHeight > 0 ? Math.max(0, keyboardHeight - insets.bottom) : 0;

  if (showNewRoomForm) {
    return (
      <View style={styles.overlay}>
        <View style={[styles.card, styles.cardForm, { marginBottom: keyboardLift }]}>
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
            style={[styles.cancelButton, { paddingBottom: navBarPad }]}
            onPress={() => setShowNewRoomForm(false)}
          >
            <Text style={styles.cancelButtonText}>{strings.back}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, styles.cardList]}>
        <Text style={styles.title}>{strings.pickRoom}</Text>
        <Text style={styles.hint}>{strings.pickRoomHint}</Text>
        <ScrollView
          style={styles.roomList}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
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
        <Pressable
          style={[styles.cancelButton, { paddingBottom: navBarPad }]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>{strings.back}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function RoomPickerModal({
  visible,
  locale,
  customRooms,
  onSelect,
  onCreateCustomRoom,
  onCancel,
}: RoomPickerModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <SafeAreaProvider>
        {visible ? (
          <RoomPickerSheet
            locale={locale}
            customRooms={customRooms}
            onSelect={onSelect}
            onCreateCustomRoom={onCreateCustomRoom}
            onCancel={onCancel}
          />
        ) : null}
      </SafeAreaProvider>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    width: '100%',
    flexShrink: 0,
  },
  cardList: {
    maxHeight: '70%',
  },
  cardForm: {
    width: '100%',
  },
  roomList: {
    marginBottom: 8,
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
    marginTop: 8,
    paddingTop: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
