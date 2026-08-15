import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import { colors, radii } from '../lib/theme';
import type { ItemPhoto } from '../types/item';

type ItemPhotoGalleryProps = {
  photos: ItemPhoto[];
  locale: ContentLocale;
  editable?: boolean;
  onAddPhoto?: () => void;
  onRemovePhoto?: (index: number) => void;
};

export function ItemPhotoGallery({
  photos,
  locale,
  editable = false,
  onAddPhoto,
  onRemovePhoto,
}: ItemPhotoGalleryProps) {
  const strings = getStrings(locale);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeIndex = Math.min(selectedIndex, Math.max(photos.length - 1, 0));
  const selectedPhoto = photos[safeIndex];

  function handleRemove(index: number) {
    if (!onRemovePhoto) {
      return;
    }

    if (photos.length <= 1) {
      Alert.alert(strings.removePhotoTitle, strings.removePhotoLast);
      return;
    }

    Alert.alert(strings.removePhotoTitle, strings.removePhotoConfirm, [
      { text: strings.cancel, style: 'cancel' },
      {
        text: strings.removePhotoAction,
        style: 'destructive',
        onPress: () => {
          onRemovePhoto(index);
          setSelectedIndex(Math.max(0, index - 1));
        },
      },
    ]);
  }

  if (photos.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      {selectedPhoto ? (
        <Image source={{ uri: selectedPhoto.uri }} style={styles.preview} />
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbRow}
      >
        {photos.map((photo, index) => (
          <Pressable
            key={`${photo.uri}-${index}`}
            onPress={() => setSelectedIndex(index)}
            style={[styles.thumbWrap, index === safeIndex && styles.thumbWrapActive]}
          >
            <Image source={{ uri: photo.uri }} style={styles.thumb} />
            {index === 0 ? (
              <Text style={styles.primaryBadge}>{strings.primaryPhoto}</Text>
            ) : null}
            {editable && onRemovePhoto ? (
              <Pressable
                style={styles.removeBadge}
                onPress={() => handleRemove(index)}
                hitSlop={8}
              >
                <Text style={styles.removeBadgeText}>×</Text>
              </Pressable>
            ) : null}
          </Pressable>
        ))}

        {editable && onAddPhoto ? (
          <Pressable style={styles.addTile} onPress={onAddPhoto}>
            <Text style={styles.addTileText}>+</Text>
            <Text style={styles.addTileLabel}>{strings.addPhoto}</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  preview: {
    width: '100%',
    height: 280,
    borderRadius: radii.xl,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  thumbRow: {
    gap: 10,
    paddingVertical: 4,
  },
  thumbWrap: {
    position: 'relative',
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbWrapActive: {
    borderColor: colors.primary,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
    resizeMode: 'cover',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    borderRadius: 4,
    overflow: 'hidden',
    paddingVertical: 2,
  },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBadgeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  addTile: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 4,
  },
  addTileText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
  },
  addTileLabel: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    width: '100%',
    lineHeight: 12,
  },
});
