export const colors = {
  primary: '#1a5fb4',
  primaryLight: '#e8f2ff',
  success: '#1a7f37',
  successLight: '#e8f5e9',
  danger: '#b00020',
  dangerLight: '#fde8eb',
  text: '#222',
  textSecondary: '#666',
  textMuted: '#999',
  border: '#ccc',
  surface: '#f5f7fb',
  surfaceAlt: '#f6f8fa',
  warningBg: '#fff8e6',
  warningBorder: '#f0d998',
  warningText: '#6b5a2e',
  white: '#fff',
  black: '#000',
} as const;

export const spacing = {
  screen: 24,
  screenBottom: 40,
  section: 16,
  item: 10,
  gap: 12,
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
} as const;

export const typography = {
  screenTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#444',
  },
  body: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  link: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600' as const,
  },
  price: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.success,
  },
};

export const screenContent = {
  padding: spacing.screen,
  paddingBottom: spacing.screenBottom,
};
