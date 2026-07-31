import type { ContentLocale } from './locale';

export type MarketplaceLink = {
  id: string;
  label: string;
  url: string;
};

function encodeQuery(query: string): string {
  return encodeURIComponent(query.trim());
}

function linksForRegion(
  searchQuery: string,
  regionCode: string,
  contentLocale: ContentLocale,
): MarketplaceLink[] {
  const encoded = encodeQuery(searchQuery);

  if (regionCode === 'SI' || contentLocale === 'sl') {
    return [
      {
        id: 'bolha',
        label: 'Bolha.com',
        url: `https://www.bolha.com/iskalnik?keywords=${encoded}`,
      },
      {
        id: 'facebook',
        label: 'Facebook Marketplace',
        url: `https://www.facebook.com/marketplace/search/?query=${encoded}`,
      },
      {
        id: 'ebay-de',
        label: 'eBay.de',
        url: `https://www.ebay.de/sch/i.html?_nkw=${encoded}`,
      },
      {
        id: 'google',
        label: 'Google (lokalno)',
        url: `https://www.google.com/search?q=${encodeQuery(`prodam ${searchQuery} rabljeno`)}&hl=sl`,
      },
    ];
  }

  if (regionCode === 'HR' || contentLocale === 'hr') {
    return [
      {
        id: 'njuskalo',
        label: 'Njuškalo',
        url: `https://www.njuskalo.hr/pretraga?keywords=${encoded}`,
      },
      {
        id: 'facebook',
        label: 'Facebook Marketplace',
        url: `https://www.facebook.com/marketplace/search/?query=${encoded}`,
      },
      {
        id: 'ebay-de',
        label: 'eBay.de',
        url: `https://www.ebay.de/sch/i.html?_nkw=${encoded}`,
      },
      {
        id: 'google',
        label: 'Google (lokalno)',
        url: `https://www.google.com/search?q=${encodeQuery(`prodajem ${searchQuery} rabljeno`)}&hl=hr`,
      },
    ];
  }

  if (regionCode === 'DE' || regionCode === 'AT' || contentLocale === 'de') {
    return [
      {
        id: 'kleinanzeigen',
        label: 'Kleinanzeigen',
        url: `https://www.kleinanzeigen.de/s-suchanfrage/k0?keywords=${encoded}`,
      },
      {
        id: 'ebay-de',
        label: 'eBay.de',
        url: `https://www.ebay.de/sch/i.html?_nkw=${encoded}`,
      },
      {
        id: 'facebook',
        label: 'Facebook Marketplace',
        url: `https://www.facebook.com/marketplace/search/?query=${encoded}`,
      },
      {
        id: 'google',
        label: 'Google (lokal)',
        url: `https://www.google.com/search?q=${encodeQuery(`${searchQuery} gebraucht verkaufen`)}&hl=de`,
      },
    ];
  }

  return [
    {
      id: 'ebay',
      label: 'Search on eBay',
      url: `https://www.ebay.com/sch/i.html?_nkw=${encoded}`,
    },
    {
      id: 'facebook',
      label: 'Facebook Marketplace',
      url: `https://www.facebook.com/marketplace/search/?query=${encoded}`,
    },
    {
      id: 'google',
      label: 'Google local listings',
      url: `https://www.google.com/search?q=${encodeQuery(`sell ${searchQuery} second hand marketplace`)}`,
    },
  ];
}

export function getMarketplaceLinks(
  searchQuery: string,
  regionCode: string,
  contentLocale: ContentLocale,
): MarketplaceLink[] {
  return linksForRegion(searchQuery, regionCode, contentLocale);
}
