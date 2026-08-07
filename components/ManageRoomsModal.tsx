import { isRunningInExpoGo } from 'expo';
import { useEffect, useRef, useState } from 'react';
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
import { colors, radii } from '../lib/theme';
import type { CustomRoom } from '../lib/storage/customRooms';

type ManageRoomsModalProps = {
  visible: boolean;
  locale: ContentLocale;
  customRooms: CustomRoom[];
  itemCountByRoomId: Record<string, number>;
  onRenameRoom: (roomId: string, label: string) => Promise<void>;
  onDeleteRoom: (roomId: string) => Promise<void>;
  onClose: () => void;
};

const shouldManualKeyboardLift =
  Platform.OS === 'android' && !isRunningInExpoGo();

function ManageRoomsSheet({
  locale,
  customRooms,
  itemCountByRoomId,
  onRenameRoom,
  onDeleteRoom,
  onClose,
}: Omit<ManageRoomsModalProps, 'visible'>) {
  const strings = getStrings(locale);
  const insets = useSafeAreaInsets();
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [busyRoomId, setBusyRoomId] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const listRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!shouldManualKeyboardLift || !editingRoomId) {
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
  }, [editingRoomId]);

  function startRename(room: CustomRoom) {
    setEditingRoomId(room.id);
    setEditLabel(room.label);
  }

  async function saveRename() {
    if (!editingRoomId) {
      return;
    }

    setBusyRoomId(editingRoomId);
    try {
      await onRenameRoom(editingRoomId, editLabel);
      setEditingRoomId(null);
      setEditLabel('');
      Alert.alert(strings.manageRooms, strings.roomRenamed);
    } catch {
      Alert.alert(strings.manageRooms, strings.roomNameRequired);
    } finally {
      setBusyRoomId(null);
    }
  }

  function confirmDelete(room: CustomRoom) {
    const count = itemCountByRoomId[room.id] ?? 0;

    if (count > 0) {
      Alert.alert(strings.manageRooms, strings.roomNotEmpty);
      return;
    }

    Alert.alert(strings.deleteRoomConfirmTitle, strings.deleteRoomConfirmMessage, [
      { text: strings.cancel, style: 'cancel' },
      {
        text: strings.deleteRoom,
        style: 'destructive',
        onPress: () => {
          void (async () => {
            setBusyRoomId(room.id);
            try {
              await onDeleteRoom(room.id);
              Alert.alert(strings.manageRooms, strings.roomDeleted);
            } finally {
              setBusyRoomId(null);
            }
          })();
        },
      },
    ]);
  }

  const navBarPad = Math.max(insets.bottom, 8);
  const keyboardLift =
    keyboardHeight > 0 ? Math.max(0, keyboardHeight - insets.bottom) : 0;

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { marginBottom: keyboardLift }]}>
        <Text style={styles.title}>{strings.manageRooms}</Text>
        <Text style={styles.hint}>{strings.manageRoomsHint}</Text>

        {customRooms.length === 0 ? (
          <Text style={styles.empty}>{strings.noCustomRooms}</Text>
        ) : (
          <ScrollView
            ref={listRef}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled
          >
            {customRooms.map((room) => (
              <View key={room.id} style={styles.roomRow}>
                {editingRoomId === room.id ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={editLabel}
                      onChangeText={setEditLabel}
                      autoFocus
                      onFocus={() => {
                        listRef.current?.scrollToEnd({ animated: true });
                      }}
                    />
                    <View style={styles.rowActions}>
                      <Pressable
                        style={styles.saveRenameButton}
                        onPress={() => void saveRename()}
                        disabled={busyRoomId === room.id}
                      >
                        <Text style={styles.saveRenameText}>
                          {strings.saveChanges}
                        </Text>
                      </Pressable>
                      <Pressable onPress={() => setEditingRoomId(null)}>
                        <Text style={styles.cancelRenameText}>
                          {strings.cancel}
                        </Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.roomLabel}>{room.label}</Text>
                    <View style={styles.rowActions}>
                      <Pressable onPress={() => startRename(room)}>
                        <Text style={styles.renameText}>{strings.renameRoom}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => confirmDelete(room)}
                        disabled={busyRoomId === room.id}
                      >
                        <Text style={styles.deleteText}>{strings.deleteRoom}</Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        <Pressable
          style={[styles.closeButton, { paddingBottom: navBarPad }]}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>{strings.back}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ManageRoomsModal({
  visible,
  locale,
  customRooms,
  itemCountByRoomId,
  onRenameRoom,
  onDeleteRoom,
  onClose,
}: ManageRoomsModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        {visible ? (
          <ManageRoomsSheet
            locale={locale}
            customRooms={customRooms}
            itemCountByRoomId={itemCountByRoomId}
            onRenameRoom={onRenameRoom}
            onDeleteRoom={onDeleteRoom}
            onClose={onClose}
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
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: '70%',
    width: '100%',
    flexShrink: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  empty: {
    color: colors.textSecondary,
    marginBottom: 16,
  },
  list: {
    marginBottom: 8,
  },
  roomRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  roomLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: colors.white,
    minHeight: 48,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 16,
  },
  renameText: {
    color: colors.primary,
    fontWeight: '600',
  },
  deleteText: {
    color: colors.danger,
    fontWeight: '600',
  },
  saveRenameButton: {
    marginRight: 8,
  },
  saveRenameText: {
    color: colors.success,
    fontWeight: '700',
  },
  cancelRenameText: {
    color: colors.textSecondary,
  },
  closeButton: {
    marginTop: 4,
    paddingTop: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
