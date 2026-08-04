import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { AppButton } from '../components/ui/AppButton';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { SectionTitle } from '../components/ui/SectionTitle';
import { generateListingText } from '../lib/generateListing';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import { getMarketplaceLinks } from '../lib/marketplaceLinks';
import { colors, radii, screenContent, typography } from '../lib/theme';
import type { ItemRecord } from '../types/item';

type SellScreenProps = {
  item: ItemRecord;
  locale: ContentLocale;
  regionCode: string;
  onBack: () => void;
  onMarkListed: () => void;
  onUnmarkListed: () => void;
  onMarkSold: () => void;
  onUnmarkSold: () => void;
  onListingSaved: (listingTitle: string, listingDescription: string) => void;
};

export function SellScreen({
  item,
  locale,
  regionCode,
  onBack,
  onMarkListed,
  onUnmarkListed,
  onMarkSold,
  onUnmarkSold,
  onListingSaved,
}: SellScreenProps) {
  const strings = getStrings(locale);
  const [listingTitle, setListingTitle] = useState(item.listingTitle ?? '');
  const [listingDescription, setListingDescription] = useState(
    item.listingDescription ?? '',
  );
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setListingTitle(item.listingTitle ?? '');
    setListingDescription(item.listingDescription ?? '');
  }, [item.id, item.listingTitle, item.listingDescription]);

  const hasListing = listingTitle.trim().length > 0;

  async function openLink(url: string) {
    await Linking.openURL(url);
  }

  async function copyText(text: string) {
    await Clipboard.setStringAsync(text);
    Alert.alert(strings.copiedToClipboard);
  }

  async function handleGenerateListing() {
    setIsGenerating(true);

    try {
      const listing = await generateListingText(item, locale, regionCode);
      setListingTitle(listing.listingTitle);
      setListingDescription(listing.listingDescription);
      onListingSaved(listing.listingTitle, listing.listingDescription);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : strings.genericError;
      console.error('Listing generation failed:', error);
      Alert.alert(strings.listingFailedTitle, message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader
        backLabel={strings.back}
        title={strings.sellTitle}
        onBack={onBack}
      />

      <Image source={{ uri: item.photoUri }} style={styles.preview} />
      <Text style={styles.title}>{item.objectName}</Text>
      <Text style={styles.price}>~€{item.estimatedPriceEUR.toFixed(0)}</Text>

      <SectionTitle>{strings.listingAssistTitle}</SectionTitle>
      <Text style={styles.hint}>{strings.listingAssistHint}</Text>

      {hasListing ? (
        <View style={styles.listingBlock}>
          <Text style={styles.fieldLabel}>{strings.listingTitleLabel}</Text>
          <Text selectable style={styles.listingText}>
            {listingTitle}
          </Text>
          <Pressable
            style={styles.copyButton}
            onPress={() => void copyText(listingTitle)}
          >
            <Text style={styles.copyButtonText}>{strings.copyTitle}</Text>
          </Pressable>

          <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
            {strings.listingDescriptionLabel}
          </Text>
          <Text selectable style={styles.listingText}>
            {listingDescription}
          </Text>
          <Pressable
            style={styles.copyButton}
            onPress={() => void copyText(listingDescription)}
          >
            <Text style={styles.copyButtonText}>{strings.copyDescription}</Text>
          </Pressable>

          <AppButton
            label={strings.copyAll}
            onPress={() => void copyText(`${listingTitle}\n\n${listingDescription}`)}
            style={styles.copyAllButton}
          />
        </View>
      ) : null}

      <Pressable
        style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
        onPress={() => void handleGenerateListing()}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <View style={styles.generateRow}>
            <ActivityIndicator color={colors.white} />
            <Text style={styles.generateButtonText}>
              {strings.generatingListing}
            </Text>
          </View>
        ) : (
          <Text style={styles.generateButtonText}>
            {hasListing ? strings.regenerateListing : strings.generateListing}
          </Text>
        )}
      </Pressable>

      <SectionTitle style={styles.sectionTitleSpaced}>{strings.whereToSell}</SectionTitle>
      <Text style={styles.hint}>{strings.marketplaceHint}</Text>

      {getMarketplaceLinks(
        item.marketplaceSearchQuery,
        regionCode,
        locale,
      ).map((link) => (
        <AppButton
          key={link.id}
          label={link.label}
          variant="secondary"
          onPress={() => void openLink(link.url)}
        />
      ))}

      <AppButton
        label={item.soldAt ? strings.unmarkAsSold : strings.markAsSold}
        variant={item.soldAt ? 'secondary' : 'success'}
        onPress={item.soldAt ? onUnmarkSold : onMarkSold}
        style={styles.topSpaced}
      />

      {!item.soldAt ? (
        <AppButton
          label={
            item.forSale && item.listedAt
              ? strings.unmarkAsListed
              : strings.markAsListed
          }
          variant={item.forSale && item.listedAt ? 'danger' : 'primary'}
          onPress={
            item.forSale && item.listedAt ? onUnmarkListed : onMarkListed
          }
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: screenContent,
  preview: {
    width: '100%',
    height: 200,
    borderRadius: radii.xl,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.text,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 16,
  },
  hint: {
    ...typography.hint,
    marginBottom: 12,
  },
  listingBlock: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  fieldLabelSpaced: {
    marginTop: 12,
  },
  listingText: {
    ...typography.body,
  },
  copyButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
    backgroundColor: colors.primaryLight,
  },
  copyButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  copyAllButton: {
    marginTop: 12,
    marginBottom: 0,
  },
  generateButton: {
    backgroundColor: colors.success,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  generateButtonDisabled: {
    opacity: 0.85,
  },
  generateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  generateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitleSpaced: {
    marginTop: 8,
  },
  topSpaced: {
    marginTop: 16,
  },
});
