import type { ContentLocale } from './locale';
import type { CustomRoom } from './storage/customRooms';

export type PresetRoomId =
  | 'living_room'
  | 'kitchen'
  | 'bedroom'
  | 'attic'
  | 'garage'
  | 'other';

/** @deprecated Use PresetRoomId — kept as alias for preset rooms */
export type RoomId = PresetRoomId;

export const PRESET_ROOM_IDS: PresetRoomId[] = [
  'living_room',
  'kitchen',
  'bedroom',
  'attic',
  'garage',
  'other',
];

export const ROOM_IDS = PRESET_ROOM_IDS;

const ROOM_LABELS: Record<ContentLocale, Record<PresetRoomId, string>> = {
  en: {
    living_room: 'Living room',
    kitchen: 'Kitchen',
    bedroom: 'Bedroom',
    attic: 'Attic',
    garage: 'Garage',
    other: 'Other',
  },
  sl: {
    living_room: 'Dnevna soba',
    kitchen: 'Kuhinja',
    bedroom: 'Spalnica',
    attic: 'Podstrešje',
    garage: 'Garaža',
    other: 'Drugo',
  },
  hr: {
    living_room: 'Dnevni boravak',
    kitchen: 'Kuhinja',
    bedroom: 'Spavaća soba',
    attic: 'Tavan',
    garage: 'Garaža',
    other: 'Ostalo',
  },
  de: {
    living_room: 'Wohnzimmer',
    kitchen: 'Küche',
    bedroom: 'Schlafzimmer',
    attic: 'Dachboden',
    garage: 'Garage',
    other: 'Sonstiges',
  },
};

export function isPresetRoomId(roomId: string): roomId is PresetRoomId {
  return (PRESET_ROOM_IDS as string[]).includes(roomId);
}

export function isCustomRoomId(roomId: string): boolean {
  return roomId.startsWith('custom:');
}

export function getPresetRoomLabel(
  roomId: PresetRoomId,
  locale: ContentLocale,
): string {
  return ROOM_LABELS[locale][roomId];
}

export function getRoomLabel(roomId: PresetRoomId, locale: ContentLocale): string {
  return getPresetRoomLabel(roomId, locale);
}

export function resolveRoomLabel(
  roomId: string,
  locale: ContentLocale,
  customRooms: CustomRoom[],
): string {
  if (isPresetRoomId(roomId)) {
    return getPresetRoomLabel(roomId, locale);
  }

  const customRoom = customRooms.find((room) => room.id === roomId);
  return customRoom?.label ?? roomId;
}
