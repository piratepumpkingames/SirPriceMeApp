import { AppIcon } from './AppIcon';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii } from '../../lib/theme';

type CopyIconButtonProps = {
  label: string;
  onPress: () => void;
};

export function CopyIconButton({ label, onPress }: CopyIconButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <AppIcon name="copy-outline" size="sm" />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.primaryLight,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
