import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../../lib/theme';

type ScreenHeaderProps = {
  title?: string;
  backLabel: string;
  onBack: () => void;
};

export function ScreenHeader({ title, backLabel, onBack }: ScreenHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onBack} hitSlop={8}>
        <Text style={styles.back}>{backLabel}</Text>
      </Pressable>
      {title ? <Text style={styles.title}>{title}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  back: {
    ...typography.link,
    marginBottom: 4,
  },
  title: {
    ...typography.screenTitle,
    marginTop: 4,
  },
});
