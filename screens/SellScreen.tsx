import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
};

export function SellScreen({
  item,
  locale,
  regionCode,
  onBack,
  onMarkListed,
  onUnmarkListed,
}: SellScreenProps) {
  const strings = getStrings(locale);

  async function openLink(url: string) {
    await Linking.openURL(url);
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

      <Text style={styles.label}>{strings.whereToSell}</Text>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
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
