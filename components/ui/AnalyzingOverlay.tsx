import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radii } from '../../lib/theme';

type AnalyzingOverlayProps = {
  visible: boolean;
  photoUri: string | null;
  steps: string[];
};

export function AnalyzingOverlay({
  visible,
  photoUri,
  steps,
}: AnalyzingOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStepIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setStepIndex((current) => (current + 1) % steps.length);
    }, 2200);

    return () => clearInterval(timer);
  }, [visible, steps]);

  if (!visible) {
    return null;
  }

  const stepLabel = steps[stepIndex] ?? steps[0] ?? '';

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.preview} />
          ) : null}
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.step}>{stepLabel}</Text>
          <View style={styles.dots}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === stepIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: 20,
    alignItems: 'center',
  },
  preview: {
    width: 160,
    height: 160,
    borderRadius: radii.md,
    resizeMode: 'cover',
    marginBottom: 16,
    opacity: 0.92,
  },
  step: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d0d7de',
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
});
