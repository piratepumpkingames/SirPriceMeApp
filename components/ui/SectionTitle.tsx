import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';
import { typography } from '../../lib/theme';

type SectionTitleProps = {
  children: string;
  style?: StyleProp<TextStyle>;
};

export function SectionTitle({ children, style }: SectionTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    ...typography.sectionTitle,
    marginBottom: 8,
  },
});
