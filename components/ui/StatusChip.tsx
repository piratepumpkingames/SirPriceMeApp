import { StyleSheet, Text } from 'react-native';
import { colors, radii } from '../../lib/theme';

type StatusChipVariant = 'default' | 'sold';

type StatusChipProps = {
  label: string;
  variant?: StatusChipVariant;
};

export function StatusChip({ label, variant = 'default' }: StatusChipProps) {
  return (
    <Text
      style={[
        styles.chip,
        variant === 'sold' ? styles.sold : styles.default,
      ]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.md,
    overflow: 'hidden',
    fontSize: 13,
    fontWeight: '600',
  },
  default: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },
  sold: {
    backgroundColor: colors.successLight,
    color: colors.success,
  },
});
