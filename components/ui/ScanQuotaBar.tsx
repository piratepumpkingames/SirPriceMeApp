import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, typography } from '../../lib/theme';

type ScanQuotaBarProps = {
  label: string;
  upgradeLabel: string;
  onUpgrade: () => void;
};

export function ScanQuotaBar({
  label,
  upgradeLabel,
  onUpgrade,
}: ScanQuotaBarProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [styles.upgradeButton, pressed && styles.upgradeButtonPressed]}
        onPress={onUpgrade}
        accessibilityRole="button"
        accessibilityLabel={upgradeLabel}
        hitSlop={8}
      >
        <Text style={styles.plusIcon}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    width: '100%',
    marginBottom: 12,
  },
  label: {
    ...typography.hint,
    fontSize: 14,
    lineHeight: 19,
    color: colors.danger,
    textAlign: 'right',
    flexShrink: 1,
  },
  upgradeButton: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
  },
  upgradeButtonPressed: {
    opacity: 0.88,
  },
  plusIcon: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 24,
    includeFontPadding: false,
    textAlign: 'center',
  },
});
