import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../../lib/theme';

export type AppHeaderAction = {
  icon: ReactNode;
  accessibilityLabel: string;
  onPress: () => void;
};

type AppHeaderProps = {
  title?: string;
  backLabel: string;
  onBack: () => void;
  actions?: AppHeaderAction[];
};

export function AppHeader({
  title,
  backLabel,
  onBack,
  actions = [],
}: AppHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onBack}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        hitSlop={8}
      >
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>

      {title ? (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={styles.titleSpacer} />
      )}

      <View style={styles.actions}>
        {actions.map((action) => (
          <Pressable
            key={action.accessibilityLabel}
            onPress={action.onPress}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel}
            hitSlop={8}
          >
            {action.icon}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 32,
    lineHeight: 34,
    color: colors.primary,
    fontWeight: '300',
    marginTop: -2,
  },
  title: {
    ...typography.screenTitle,
    flex: 1,
    fontSize: 18,
    marginBottom: 0,
    textAlign: 'center',
  },
  titleSpacer: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
    justifyContent: 'flex-end',
    gap: 0,
  },
});
