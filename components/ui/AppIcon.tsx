import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../lib/theme';

export type AppIconName = keyof typeof Ionicons.glyphMap;

export const appIconSizes = {
  sm: 16,
  md: 20,
  lg: 22,
} as const;

export type AppIconSize = keyof typeof appIconSizes;

type AppIconProps = {
  name: AppIconName;
  size?: AppIconSize | number;
  color?: string;
};

export function AppIcon({
  name,
  size = 'md',
  color = colors.primary,
}: AppIconProps) {
  const pixelSize = typeof size === 'number' ? size : appIconSizes[size];
  return <Ionicons name={name} size={pixelSize} color={color} />;
}
