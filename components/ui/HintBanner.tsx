import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, typography } from '../../lib/theme';

type HintBannerProps = {
  message: string;
  dismissLabel: string;
  onDismiss: () => void;
};

export function HintBanner({ message, dismissLabel, onDismiss }: HintBannerProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.message}>{message}</Text>
      <Pressable onPress={onDismiss} hitSlop={8}>
        <Text style={styles.dismiss}>{dismissLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.md,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#c5daf5',
  },
  message: {
    ...typography.hint,
    color: colors.text,
    marginBottom: 8,
  },
  dismiss: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
});
