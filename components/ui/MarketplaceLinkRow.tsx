import { AppIcon } from './AppIcon';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii } from '../../lib/theme';

type MarketplaceLinkRowProps = {
  label: string;
  onPress: () => void;
};

export function MarketplaceLinkRow({ label, onPress }: MarketplaceLinkRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="link"
    >
      <Text style={styles.label}>{label}</Text>
      <AppIcon name="open-outline" size="md" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e8ecf2',
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 12,
  },
});
