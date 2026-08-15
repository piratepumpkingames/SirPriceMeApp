import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii } from '../../lib/theme';

type BottomActionBarProps = {
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  tertiaryLabel?: string;
  onTertiaryPress?: () => void;
  primaryVariant?: 'primary' | 'secondary' | 'danger';
};

export function BottomActionBar({
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
  tertiaryLabel,
  onTertiaryPress,
  primaryVariant = 'primary',
}: BottomActionBarProps) {
  const showSecondary = secondaryLabel && onSecondaryPress;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable
          style={[
            styles.button,
            showSecondary ? styles.buttonHalf : styles.buttonFull,
            primaryVariantStyles[primaryVariant],
          ]}
          onPress={onPrimaryPress}
        >
          <Text
            style={[
              styles.buttonText,
              primaryVariant === 'secondary' || primaryVariant === 'danger'
                ? styles.buttonTextSecondary
                : styles.buttonTextPrimary,
              primaryVariant === 'danger' && styles.buttonTextDanger,
            ]}
            numberOfLines={2}
          >
            {primaryLabel}
          </Text>
        </Pressable>

        {showSecondary ? (
          <Pressable
            style={[styles.button, styles.buttonHalf, styles.buttonSecondary]}
            onPress={onSecondaryPress}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondaryOutline]} numberOfLines={2}>
              {secondaryLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {tertiaryLabel && onTertiaryPress ? (
        <Pressable style={styles.tertiary} onPress={onTertiaryPress}>
          <Text style={styles.tertiaryText}>{tertiaryLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const primaryVariantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.danger,
  },
});

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonFull: {
    flex: 1,
  },
  buttonHalf: {
    flex: 1,
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonTextPrimary: {
    color: colors.white,
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
  buttonTextSecondaryOutline: {
    color: colors.primary,
  },
  buttonTextDanger: {
    color: colors.danger,
  },
  tertiary: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  tertiaryText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
