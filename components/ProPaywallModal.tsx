import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ContentLocale } from '../lib/locale';
import { formatString, getStrings } from '../lib/locale';
import {
  getProPlans,
  isBillingAvailable,
  purchaseProPlan,
  restoreProPurchases,
  type ProPlanId,
  type ProPlanOption,
} from '../lib/purchases';
import { colors, radii } from '../lib/theme';

type ProPaywallModalProps = {
  visible: boolean;
  locale: ContentLocale;
  onClose: () => void;
  onProActivated: () => void;
};

function getPlanLabel(planId: ProPlanId, strings: ReturnType<typeof getStrings>): string {
  switch (planId) {
    case 'monthly':
      return strings.proPlanMonthly;
    case 'sixMonth':
      return strings.proPlanSixMonth;
    case 'yearly':
      return strings.proPlanYearly;
  }
}

export function ProPaywallModal({
  visible,
  locale,
  onClose,
  onProActivated,
}: ProPaywallModalProps) {
  const strings = getStrings(locale);
  const [plans, setPlans] = useState<ProPlanOption[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<ProPlanId>('yearly');
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (!visible || !isBillingAvailable()) {
      setPlans([]);
      return;
    }

    let cancelled = false;
    setIsLoadingPlans(true);

    void getProPlans()
      .then((loadedPlans) => {
        if (cancelled) {
          return;
        }

        setPlans(loadedPlans);

        if (loadedPlans.some((plan) => plan.id === 'yearly')) {
          setSelectedPlanId('yearly');
        } else if (loadedPlans[0]) {
          setSelectedPlanId(loadedPlans[0].id);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPlans([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingPlans(false);
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
      const activated = await purchaseProPlan(selectedPlanId);

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

  const busy = isPurchasing || isRestoring || isLoadingPlans;
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
          <View style={styles.card}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>{strings.proPaywallTitle}</Text>
              <Text style={styles.body}>{strings.proPaywallBody}</Text>

              <View style={styles.featureList}>
                <Text style={styles.featureItem}>• {strings.proFeatureUnlimitedScans}</Text>
                <Text style={styles.featureItem}>• {strings.proFeaturePdf}</Text>
                <Text style={styles.featureItem}>• {strings.proFeatureCustomRooms}</Text>
              </View>

              {isLoadingPlans ? (
                <View style={styles.loadingWrap}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : plans.length > 0 ? (
                <View style={styles.planList}>
                  {plans.map((plan) => {
                    const selected = plan.id === selectedPlanId;

                    return (
                      <Pressable
                        key={plan.id}
                        style={[styles.planRow, selected && styles.planRowSelected]}
                        onPress={() => setSelectedPlanId(plan.id)}
                        disabled={busy}
                      >
                        <View style={styles.planTextWrap}>
                          <Text style={styles.planLabel}>
                            {getPlanLabel(plan.id, strings)}
                          </Text>
                          <Text style={styles.planPrice}>{plan.priceString}</Text>
                        </View>
                        {plan.discountPercent ? (
                          <View style={styles.discountBadge}>
                            <Text style={styles.discountBadgeText}>
                              {formatString(strings.proSavePercent, {
                                percent: String(plan.discountPercent),
                              })}
                            </Text>
                          </View>
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.priceUnavailable}>{strings.proPriceUnavailable}</Text>
              )}

              <Pressable
                style={[styles.primaryButton, busy && styles.buttonDisabled]}
                onPress={() => void handlePurchase()}
                disabled={busy || !selectedPlan}
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
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  safeArea: {
    width: '100%',
  },
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    maxHeight: '92%',
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
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
  },
  planList: {
    gap: 10,
    marginBottom: 16,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
    gap: 12,
  },
  planRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  planTextWrap: {
    flex: 1,
    gap: 2,
  },
  planLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  planPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  discountBadge: {
    backgroundColor: colors.success,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexShrink: 0,
  },
  discountBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  priceUnavailable: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
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
