import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import {
  getYearlyPackage,
  isBillingAvailable,
  purchaseYearlyPro,
  restoreProPurchases,
} from '../lib/purchases';
import { colors, radii } from '../lib/theme';

type ProPaywallModalProps = {
  visible: boolean;
  locale: ContentLocale;
  onClose: () => void;
  onProActivated: () => void;
};

export function ProPaywallModal({
  visible,
  locale,
  onClose,
  onProActivated,
}: ProPaywallModalProps) {
  const strings = getStrings(locale);
  const [priceLabel, setPriceLabel] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (!visible || !isBillingAvailable()) {
      setPriceLabel(null);
      return;
    }

    let cancelled = false;

    void getYearlyPackage()
      .then((pkg) => {
        if (cancelled) {
          return;
        }

        setPriceLabel(pkg?.product.priceString ?? null);
      })
      .catch(() => {
        if (!cancelled) {
          setPriceLabel(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [visible]);

  async function handlePurchase() {
    if (!isBillingAvailable()) {
      onClose();
      return;
    }

    setIsPurchasing(true);

    try {
      const activated = await purchaseYearlyPro();

      if (activated) {
        Alert.alert(strings.proPaywallTitle, strings.proPurchaseSuccess);
        onProActivated();
        onClose();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : strings.genericError;
      Alert.alert(strings.proPurchaseFailedTitle, message);
    } finally {
      setIsPurchasing(false);
    }
  }

  async function handleRestore() {
    if (!isBillingAvailable()) {
      onClose();
      return;
    }

    setIsRestoring(true);

    try {
      const restored = await restoreProPurchases();

      if (restored) {
        Alert.alert(strings.proPaywallTitle, strings.proRestoreSuccess);
        onProActivated();
        onClose();
        return;
      }

      Alert.alert(strings.proPaywallTitle, strings.proRestoreNone);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : strings.genericError;
      Alert.alert(strings.proPurchaseFailedTitle, message);
    } finally {
      setIsRestoring(false);
    }
  }

  const busy = isPurchasing || isRestoring;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{strings.proPaywallTitle}</Text>
          <Text style={styles.body}>{strings.proPaywallBody}</Text>

          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• {strings.proFeatureUnlimitedScans}</Text>
            <Text style={styles.featureItem}>• {strings.proFeaturePdf}</Text>
            <Text style={styles.featureItem}>• {strings.proFeatureCustomRooms}</Text>
          </View>

          <Text style={styles.price}>
            {priceLabel ?? strings.proPriceUnavailable}
          </Text>

          <Pressable
            style={[styles.primaryButton, busy && styles.buttonDisabled]}
            onPress={() => void handlePurchase()}
            disabled={busy}
          >
            {isPurchasing ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryButtonText}>{strings.proSubscribe}</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, busy && styles.buttonDisabled]}
            onPress={() => void handleRestore()}
            disabled={busy}
          >
            {isRestoring ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.secondaryButtonText}>{strings.proRestore}</Text>
            )}
          </Pressable>

          <Pressable style={styles.textButton} onPress={onClose} disabled={busy}>
            <Text style={styles.textButtonText}>{strings.proClose}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  featureList: {
    gap: 8,
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 15,
    color: colors.text,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  textButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  textButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
