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
import { generateListingText } from '../lib/generateListing';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import { getMarketplaceLinks } from '../lib/marketplaceLinks';
import type { ItemRecord } from '../types/item';

type SellScreenProps = {
  item: ItemRecord;
  locale: ContentLocale;
  regionCode: string;
  onBack: () => void;
  onMarkListed: () => void;
  onUnmarkListed: () => void;
  onListingSaved: (listingTitle: string, listingDescription: string) => void;
};

export function SellScreen({
  item,
  locale,
  regionCode,
  onBack,
  onMarkListed,
  onUnmarkListed,
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
      <Pressable onPress={onBack}>
        <Text style={styles.back}>{strings.back}</Text>
      </Pressable>

      <Text style={styles.heading}>{strings.sellTitle}</Text>
      <Image source={{ uri: item.photoUri }} style={styles.preview} />
      <Text style={styles.title}>{item.objectName}</Text>
      <Text style={styles.price}>~€{item.estimatedPriceEUR.toFixed(0)}</Text>

      <Text style={styles.sectionTitle}>{strings.listingAssistTitle}</Text>
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

          <Pressable
            style={styles.copyAllButton}
            onPress={() =>
              void copyText(`${listingTitle}\n\n${listingDescription}`)
            }
          >
            <Text style={styles.copyAllButtonText}>{strings.copyAll}</Text>
          </Pressable>
        </View>
      ) : null}

      <Pressable
        style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
        onPress={() => void handleGenerateListing()}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <View style={styles.generateRow}>
            <ActivityIndicator color="#fff" />
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

      <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
        {strings.whereToSell}
      </Text>
      <Text style={styles.hint}>{strings.marketplaceHint}</Text>

      {getMarketplaceLinks(
        item.marketplaceSearchQuery,
        regionCode,
        locale,
      ).map((link) => (
        <Pressable
          key={link.id}
          style={styles.marketplaceLink}
          onPress={() => openLink(link.url)}
        >
          <Text style={styles.marketplaceLinkText}>{link.label}</Text>
        </Pressable>
      ))}

      <Pressable
        style={[
          styles.markListedButton,
          item.forSale && item.listedAt && styles.unmarkListedButton,
        ]}
        onPress={item.forSale && item.listedAt ? onUnmarkListed : onMarkListed}
      >
        <Text
          style={[
            styles.markListedButtonText,
            item.forSale && item.listedAt && styles.unmarkListedButtonText,
          ]}
        >
          {item.forSale && item.listedAt
            ? strings.unmarkAsListed
            : strings.markAsListed}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  back: {
    color: '#1a5fb4',
    fontSize: 16,
    marginBottom: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a7f37',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  sectionTitleSpaced: {
    marginTop: 8,
  },
  hint: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  listingBlock: {
    backgroundColor: '#f6f8fa',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  fieldLabelSpaced: {
    marginTop: 12,
  },
  listingText: {
    fontSize: 15,
    color: '#222',
    lineHeight: 22,
  },
  copyButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#e8f0fe',
  },
  copyButtonText: {
    color: '#1a5fb4',
    fontSize: 13,
    fontWeight: '600',
  },
  copyAllButton: {
    marginTop: 12,
    backgroundColor: '#1a5fb4',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  copyAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  generateButton: {
    backgroundColor: '#1a7f37',
    borderRadius: 8,
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  marketplaceLink: {
    backgroundColor: '#fff',
    borderColor: '#1a5fb4',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  marketplaceLinkText: {
    color: '#1a5fb4',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  markListedButton: {
    marginTop: 16,
    backgroundColor: '#1a5fb4',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  unmarkListedButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#b00020',
  },
  markListedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  unmarkListedButtonText: {
    color: '#b00020',
  },
});
