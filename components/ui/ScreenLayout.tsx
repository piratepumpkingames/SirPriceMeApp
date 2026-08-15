import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, type ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, screenContent } from '../../lib/theme';

type ScreenLayoutProps = {
  header: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  scrollProps?: Omit<ScrollViewProps, 'children' | 'contentContainerStyle'>;
};

export function ScreenLayout({
  header,
  footer,
  children,
  scrollProps,
}: ScreenLayoutProps) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      {header}
      <ScrollView
        {...scrollProps}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {footer ? (
        <SafeAreaView style={styles.footerSafe} edges={['bottom']}>
          {footer}
        </SafeAreaView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    ...screenContent,
    paddingTop: 16,
  },
  footerSafe: {
    backgroundColor: colors.white,
  },
});
