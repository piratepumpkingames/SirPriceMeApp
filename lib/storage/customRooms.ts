import AsyncStorage from '@react-native-async-storage/async-storage';
import { createItemId } from '../../types/item';
import { isCustomRoomId } from '../rooms';

export type CustomRoom = {
  id: string;
  label: string;
  createdAt: string;
};

const CUSTOM_ROOMS_KEY = '@sirpriceme/custom_rooms';

function parseStoredArray<T>(raw: string | null): T[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function createCustomRoomId(): string {
  return `custom:${createItemId()}`;
}

export async function loadCustomRooms(): Promise<CustomRoom[]> {
  const raw = await AsyncStorage.getItem(CUSTOM_ROOMS_KEY);
  return parseStoredArray<CustomRoom>(raw);
}

async function saveCustomRooms(rooms: CustomRoom[]): Promise<void> {
  await AsyncStorage.setItem(CUSTOM_ROOMS_KEY, JSON.stringify(rooms));
}

export async function addCustomRoom(label: string): Promise<CustomRoom> {
  const trimmed = label.trim();
  if (!trimmed) {
    throw new Error('Room name is required.');
  }

  const room: CustomRoom = {
    id: createCustomRoomId(),
    label: trimmed,
    createdAt: new Date().toISOString(),
  };

  const rooms = await loadCustomRooms();
  rooms.push(room);
  await saveCustomRooms(rooms);
  return room;
}

export async function updateCustomRoom(
  roomId: string,
  label: string,
): Promise<CustomRoom> {
  if (!isCustomRoomId(roomId)) {
    throw new Error('Only custom rooms can be renamed.');
  }

  const trimmed = label.trim();
  if (!trimmed) {
    throw new Error('Room name is required.');
  }

  const rooms = await loadCustomRooms();
  const index = rooms.findIndex((room) => room.id === roomId);

  if (index < 0) {
    throw new Error('Room not found.');
  }

  const updated: CustomRoom = { ...rooms[index], label: trimmed };
  rooms[index] = updated;
  await saveCustomRooms(rooms);
  return updated;
}

export async function deleteCustomRoom(roomId: string): Promise<void> {
  if (!isCustomRoomId(roomId)) {
    throw new Error('Only custom rooms can be deleted.');
  }

  const rooms = await loadCustomRooms();
  await saveCustomRooms(rooms.filter((room) => room.id !== roomId));
}
