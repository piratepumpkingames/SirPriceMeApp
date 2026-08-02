import AsyncStorage from '@react-native-async-storage/async-storage';
import { createItemId } from '../../types/item';

export type CustomRoom = {
  id: string;
  label: string;
  createdAt: string;
};

const CUSTOM_ROOMS_KEY = '@sirpriceme/custom_rooms';

export function createCustomRoomId(): string {
  return `custom:${createItemId()}`;
}

export async function loadCustomRooms(): Promise<CustomRoom[]> {
  const raw = await AsyncStorage.getItem(CUSTOM_ROOMS_KEY);
  if (!raw) {
    return [];
  }

  return JSON.parse(raw) as CustomRoom[];
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
