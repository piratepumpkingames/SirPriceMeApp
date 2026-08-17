import type { ContentLocale } from './locale';

export type MarketplaceLink = {
  id: string;
  label: string;
  url: string;
};

type LinkContext = {
  query: string;
  encoded: string;
  bolhaKeywords: string;
  slug: string;
};

type RegionLinkBuilder = (ctx: LinkContext) => MarketplaceLink;

function encodeQuery(query: string): string {
  return encodeURIComponent(query.trim());
}

function slugQuery(query: string): string {
  return encodeURIComponent(
    query
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, ''),
  );
}

function facebook(ctx: LinkContext): MarketplaceLink {
  return {
    id: 'facebook',
    label: 'Facebook Marketplace',
    url: `https://www.facebook.com/marketplace/search/?query=${ctx.encoded}`,
  };
}

function ebay(tld: string, label?: string): RegionLinkBuilder {
  return (ctx) => ({
    id: `ebay-${tld.replace('.', '-')}`,
    label: label ?? `eBay.${tld}`,
    url: `https://www.ebay.${tld}/sch/i.html?_nkw=${ctx.encoded}`,
  });
}

function link(
  id: string,
  label: string,
  buildUrl: (ctx: LinkContext) => string,
): RegionLinkBuilder {
  return (ctx) => ({
    id,
    label,
    url: buildUrl(ctx),
  });
}

const REGION_LINK_BUILDERS: Record<string, RegionLinkBuilder[]> = {
  SI: [
    link('bolha', 'Bolha.com', (ctx) =>
      `https://www.bolha.com/search/?keywords=${ctx.bolhaKeywords}`,
    ),
    facebook,
    ebay('de'),
  ],
  HR: [
    link('njuskalo', 'Njuškalo', (ctx) =>
      `https://www.njuskalo.hr/pretraga?keywords=${ctx.encoded}`,
    ),
    facebook,
    ebay('de'),
  ],
  DE: [
    link('kleinanzeigen', 'Kleinanzeigen', (ctx) =>
      `https://www.kleinanzeigen.de/s-suchanfrage/k0?keywords=${ctx.encoded}`,
    ),
    ebay('de'),
    facebook,
  ],
  AT: [
    link('willhaben', 'Willhaben', (ctx) =>
      `https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz?keywords=${ctx.encoded}`,
    ),
    ebay('at'),
    facebook,
  ],
  CH: [
    link('tutti', 'tutti.ch', (ctx) => `https://www.tutti.ch/de/q/${ctx.encoded}`),
    link('ricardo', 'Ricardo', (ctx) => `https://www.ricardo.ch/de/s/${ctx.encoded}`),
    facebook,
  ],
  GB: [
    link('gumtree', 'Gumtree', (ctx) =>
      `https://www.gumtree.com/search?search_category=all&q=${ctx.encoded}`,
    ),
    ebay('co.uk', 'eBay UK'),
    facebook,
  ],
  IE: [
    link('donedeal', 'DoneDeal', (ctx) => `https://www.donedeal.ie/all?words=${ctx.encoded}`),
    ebay('ie', 'eBay Ireland'),
    facebook,
  ],
  US: [
    facebook,
    ebay('com', 'eBay'),
    link('offerup', 'OfferUp', (ctx) => `https://offerup.com/search/?q=${ctx.encoded}`),
  ],
  CA: [
    link('kijiji', 'Kijiji', (ctx) => `https://www.kijiji.ca/b-search.html?q=${ctx.encoded}`),
    ebay('ca', 'eBay Canada'),
    facebook,
  ],
  AU: [
    link('gumtree-au', 'Gumtree', (ctx) =>
      `https://www.gumtree.com.au/s-search.html?query=${ctx.encoded}`,
    ),
    ebay('com.au', 'eBay Australia'),
    facebook,
  ],
  FR: [
    link('leboncoin', 'Leboncoin', (ctx) =>
      `https://www.leboncoin.fr/recherche?text=${ctx.encoded}`,
    ),
    ebay('fr'),
    facebook,
  ],
  IT: [
    link('subito', 'Subito', (ctx) =>
      `https://www.subito.it/annunci-italia/vendita/usato/?q=${ctx.encoded}`,
    ),
    ebay('it'),
    facebook,
  ],
  ES: [
    link('wallapop', 'Wallapop', (ctx) =>
      `https://es.wallapop.com/search?keywords=${ctx.encoded}`,
    ),
    link('milanuncios', 'Milanuncios', (ctx) =>
      `https://www.milanuncios.com/anuncios/todos.htm?palabras=${ctx.encoded}`,
    ),
    facebook,
  ],
  PT: [
    link('olx-pt', 'OLX', (ctx) => `https://www.olx.pt/ads/q-${ctx.slug}/`),
    facebook,
    ebay('com', 'eBay'),
  ],
  NL: [
    link('marktplaats', 'Marktplaats', (ctx) => `https://www.marktplaats.nl/q/${ctx.encoded}/`),
    ebay('nl'),
    facebook,
  ],
  BE: [
    link('2dehands', '2dehands', (ctx) => `https://www.2dehands.be/q/${ctx.encoded}/`),
    facebook,
    ebay('be', 'eBay Belgium'),
  ],
  PL: [
    link('olx-pl', 'OLX', (ctx) => `https://www.olx.pl/oferty/q-${ctx.slug}/`),
    facebook,
    ebay('pl'),
  ],
  CZ: [
    link('bazos-cz', 'Bazoš', (ctx) =>
      `https://www.bazos.cz/search.php?hledat=${ctx.encoded}&rubrika=0&hlokalita=&humkreis=25&cenaod=&cenado=`,
    ),
    facebook,
    ebay('de'),
  ],
  SK: [
    link('bazos-sk', 'Bazoš', (ctx) =>
      `https://www.bazos.sk/search.php?hledat=${ctx.encoded}&rubrika=0&hlokalita=&humkreis=25&cenaod=&cenado=`,
    ),
    facebook,
    ebay('de'),
  ],
  RO: [
    link('olx-ro', 'OLX', (ctx) => `https://www.olx.ro/oferte/q-${ctx.slug}/`),
    facebook,
    ebay('com', 'eBay'),
  ],
  HU: [
    link('jofogas', 'Jófogás', (ctx) => `https://www.jofogas.hu/magyarorszag?q=${ctx.encoded}`),
    facebook,
    ebay('com', 'eBay'),
  ],
  GR: [
    link('xe', 'xe.gr', (ctx) => `https://www.xe.gr/search?q=${ctx.encoded}`),
    facebook,
    ebay('com', 'eBay'),
  ],
  SE: [
    link('blocket', 'Blocket', (ctx) =>
      `https://www.blocket.se/annonser/hela_sverige?q=${ctx.encoded}`,
    ),
    facebook,
    ebay('com', 'eBay'),
  ],
  NO: [
    link('finn', 'Finn.no', (ctx) =>
      `https://www.finn.no/bap/forsale/search.html?q=${ctx.encoded}`,
    ),
    facebook,
    ebay('com', 'eBay'),
  ],
  DK: [
    link('dba', 'DBA', (ctx) => `https://www.dba.dk/recommerce/forsale/search?q=${ctx.encoded}`),
    facebook,
    ebay('com', 'eBay'),
  ],
  FI: [
    link('tori', 'Tori', (ctx) => `https://www.tori.fi/haku?q=${ctx.encoded}`),
    facebook,
    ebay('com', 'eBay'),
  ],
};

const DEFAULT_LINK_BUILDERS = REGION_LINK_BUILDERS.US;

const LOCALE_FALLBACK_REGION: Partial<Record<ContentLocale, keyof typeof REGION_LINK_BUILDERS>> = {
  sl: 'SI',
  hr: 'HR',
  de: 'DE',
};

function normalizeRegionCode(regionCode: string): string {
  const upper = regionCode.trim().toUpperCase();
  return upper === 'UK' ? 'GB' : upper;
}

function resolveMarketRegion(regionCode: string, contentLocale: ContentLocale): string {
  const normalized = normalizeRegionCode(regionCode);

  if (REGION_LINK_BUILDERS[normalized]) {
    return normalized;
  }

  const localeFallback = LOCALE_FALLBACK_REGION[contentLocale];
  if (localeFallback) {
    return localeFallback;
  }

  return 'DEFAULT';
}

function buildLinks(
  searchQuery: string,
  builders: RegionLinkBuilder[],
): MarketplaceLink[] {
  const ctx: LinkContext = {
    query: searchQuery.trim(),
    encoded: encodeQuery(searchQuery),
    bolhaKeywords: encodeQuery(searchQuery).replace(/%20/g, '+'),
    slug: slugQuery(searchQuery),
  };

  return builders.map((builder) => builder(ctx));
}

export function getMarketplaceLinks(
  searchQuery: string,
  regionCode: string,
  contentLocale: ContentLocale,
): MarketplaceLink[] {
  const marketRegion = resolveMarketRegion(regionCode, contentLocale);
  const builders =
    marketRegion === 'DEFAULT'
      ? DEFAULT_LINK_BUILDERS
      : REGION_LINK_BUILDERS[marketRegion];

  return buildLinks(searchQuery, builders);
}
