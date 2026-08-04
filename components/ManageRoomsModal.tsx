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

export function ManageRoomsModal({
  visible,
  locale,
  customRooms,
  itemCountByRoomId,
  onRenameRoom,
  onDeleteRoom,
  onClose,
}: ManageRoomsModalProps) {
  const strings = getStrings(locale);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [busyRoomId, setBusyRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setEditingRoomId(null);
      setEditLabel('');
      setBusyRoomId(null);
    }
  }, [visible]);

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

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{strings.manageRooms}</Text>
          <Text style={styles.hint}>{strings.manageRoomsHint}</Text>

          {customRooms.length === 0 ? (
            <Text style={styles.empty}>{strings.noCustomRooms}</Text>
          ) : (
            <ScrollView style={styles.list}>
              {customRooms.map((room) => (
                <View key={room.id} style={styles.roomRow}>
                  {editingRoomId === room.id ? (
                    <>
                      <TextInput
                        style={styles.input}
                        value={editLabel}
                        onChangeText={setEditLabel}
                        autoFocus
                      />
                      <View style={styles.rowActions}>
                        <Pressable
                          style={styles.saveRenameButton}
                          onPress={() => void saveRename()}
                          disabled={busyRoomId === room.id}
                        >
                          <Text style={styles.saveRenameText}>{strings.saveChanges}</Text>
                        </Pressable>
                        <Pressable onPress={() => setEditingRoomId(null)}>
                          <Text style={styles.cancelRenameText}>{strings.cancel}</Text>
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

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>{strings.back}</Text>
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
    maxHeight: '70%',
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
  empty: {
    color: '#666',
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 16,
  },
  renameText: {
    color: '#1a5fb4',
    fontWeight: '600',
  },
  deleteText: {
    color: '#b00020',
    fontWeight: '600',
  },
  saveRenameButton: {
    marginRight: 8,
  },
  saveRenameText: {
    color: '#1a7f37',
    fontWeight: '700',
  },
  cancelRenameText: {
    color: '#666',
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
