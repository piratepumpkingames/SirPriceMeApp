import { useEffect, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { isRunningInExpoGo } from 'expo';
import * as Clipboard from 'expo-clipboard';
import { ItemPhotoGallery } from '../components/ItemPhotoGallery';
import { AppButton } from '../components/ui/AppButton';
import { AppHeader } from '../components/ui/AppHeader';
import { CopyIconButton } from '../components/ui/CopyIconButton';
import { IconActionButton } from '../components/ui/IconActionButton';
import { MarketplaceLinkRow } from '../components/ui/MarketplaceLinkRow';
import { ScreenLayout } from '../components/ui/ScreenLayout';
import { SectionTitle } from '../components/ui/SectionTitle';
import { generateListingText } from '../lib/generateListing';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import { getMarketplaceLinks } from '../lib/marketplaceLinks';
import {
  ItemPhotosError,
  saveItemPhotosToGallery,
  shareItemPhotos,
} from '../lib/shareItemPhotos';
import { colors, radii, typography } from '../lib/theme';
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
  const [isSharingPhotos, setIsSharingPhotos] = useState(false);
  const [isSavingPhotos, setIsSavingPhotos] = useState(false);

  useEffect(() => {
    setListingTitle(item.listingTitle ?? '');
    setListingDescription(item.listingDescription ?? '');
  }, [item.id, item.listingTitle, item.listingDescription]);

  const hasListing = listingTitle.trim().length > 0;
  const hasPhotos = item.photos.length > 0;
  const showExpoGoSaveHint = Platform.OS === 'android' && isRunningInExpoGo();

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

  async function handleSharePhotos() {
    if (!hasPhotos) {
      Alert.alert(strings.sharePhotos, strings.noPhotosToShare);
      return;
    }

    setIsSharingPhotos(true);

    try {
      await shareItemPhotos(item.photos, strings.sharePhotos);
    } catch (error) {
      if (error instanceof ItemPhotosError && error.code === 'NO_PHOTOS') {
        Alert.alert(strings.sharePhotos, strings.noPhotosToShare);
        return;
      }

      const message =
        error instanceof Error ? error.message : strings.genericError;
      console.error('Photo share failed:', error);
      Alert.alert(strings.photosShareFailedTitle, message);
    } finally {
      setIsSharingPhotos(false);
    }
  }

  async function handleSavePhotos() {
    if (!hasPhotos) {
      Alert.alert(strings.savePhotosToGallery, strings.noPhotosToShare);
      return;
    }

    setIsSavingPhotos(true);

    try {
      await saveItemPhotosToGallery(item.photos);
      Alert.alert(strings.savePhotosToGallery, strings.photosSavedToGallery);
    } catch (error) {
      if (error instanceof ItemPhotosError && error.code === 'NO_PHOTOS') {
        Alert.alert(strings.savePhotosToGallery, strings.noPhotosToShare);
        return;
      }
      if (error instanceof ItemPhotosError && error.code === 'PERMISSION_DENIED') {
        Alert.alert(strings.savePhotosToGallery, strings.photoLibraryPermission);
        return;
      }

      const message =
        error instanceof Error ? error.message : strings.genericError;
      console.error('Photo save failed:', error);
      Alert.alert(strings.photosSaveFailedTitle, message);
    } finally {
      setIsSavingPhotos(false);
    }
  }

  return (
    <ScreenLayout
      header={
        <AppHeader
          title={strings.sellTitle}
          backLabel={strings.back}
          onBack={onBack}
        />
      }
    >

      <View style={styles.workflowBox}>
        <Text style={styles.workflowText}>{strings.sellWorkflowHint}</Text>
      </View>

      <SectionTitle>{strings.listingPhotosTitle}</SectionTitle>

      {hasPhotos ? (
        <ItemPhotoGallery photos={item.photos} locale={locale} />
      ) : (
        <Text style={styles.hint}>{strings.noPhotosToShare}</Text>
      )}

      <View style={styles.photoActions}>
        <IconActionButton
          icon="share-outline"
          label={strings.sharePhotos}
          onPress={() => void handleSharePhotos()}
          disabled={!hasPhotos}
          loading={isSharingPhotos}
          variant="primary"
        />
        <IconActionButton
          icon="download-outline"
          label={strings.savePhotosToGallery}
          onPress={() => void handleSavePhotos()}
          disabled={!hasPhotos}
          loading={isSavingPhotos}
          variant="secondary"
        />
      </View>

      {showExpoGoSaveHint ? (
        <Text style={styles.expoGoHint}>{strings.savePhotosExpoGoHint}</Text>
      ) : null}

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
          <CopyIconButton
            label={strings.copyTitle}
            onPress={() => void copyText(listingTitle)}
          />

          <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
            {strings.listingDescriptionLabel}
          </Text>
          <Text selectable style={styles.listingText}>
            {listingDescription}
          </Text>
          <CopyIconButton
            label={strings.copyDescription}
            onPress={() => void copyText(listingDescription)}
          />

          <AppButton
            label={strings.copyAll}
            icon="copy-outline"
            onPress={() => void copyText(`${listingTitle}\n\n${listingDescription}`)}
            variant="secondary"
            style={styles.copyAllButton}
          />
        </View>
      ) : null}

      <AppButton
        label={hasListing ? strings.regenerateListing : strings.generateListing}
        icon="document-text-outline"
        onPress={() => void handleGenerateListing()}
        disabled={isGenerating}
        loading={isGenerating}
        variant="success"
        style={styles.generateButton}
      />

      <SectionTitle style={styles.sectionTitleSpaced}>{strings.whereToSell}</SectionTitle>
      <Text style={styles.hint}>{strings.marketplaceHint}</Text>

      {getMarketplaceLinks(
        item.marketplaceSearchQuery,
        regionCode,
        locale,
      ).map((link) => (
        <MarketplaceLinkRow
          key={link.id}
          label={link.label}
          onPress={() => void openLink(link.url)}
        />
      ))}

      <AppButton
        label={item.soldAt ? strings.unmarkAsSold : strings.markAsSold}
        icon={item.soldAt ? 'refresh-outline' : 'checkmark-circle-outline'}
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
          icon={
            item.forSale && item.listedAt ? 'close-circle-outline' : 'pricetag-outline'
          }
          variant={item.forSale && item.listedAt ? 'danger' : 'primary'}
          onPress={
            item.forSale && item.listedAt ? onUnmarkListed : onMarkListed
          }
        />
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  workflowBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.md,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#c5daf5',
  },
  workflowText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  expoGoHint: {
    ...typography.hint,
    color: colors.warningText,
    backgroundColor: colors.warningBg,
    borderRadius: radii.md,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.warningBorder,
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
  copyAllButton: {
    marginTop: 12,
    marginBottom: 0,
  },
  generateButton: {
    marginBottom: 8,
  },
  sectionTitleSpaced: {
    marginTop: 8,
  },
  topSpaced: {
    marginTop: 16,
  },
});
