import { GoogleGenerativeAI } from 'npm:@google/generative-ai@0.24.1';

const GEMINI_MODEL = 'gemini-3.1-flash-lite';

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  sl: 'Slovenian',
  hr: 'Croatian',
  de: 'German',
};

const REGION_NAMES: Record<string, string> = {
  SI: 'Slovenia',
  HR: 'Croatia',
  DE: 'Germany',
  AT: 'Austria',
  US: 'United States',
  GB: 'United Kingdom',
};

function getLanguageName(contentLocale: string): string {
  return LOCALE_NAMES[contentLocale] ?? 'English';
}

function getRegionName(regionCode: string): string {
  return REGION_NAMES[regionCode] ?? regionCode;
}

export type AnalysisResult = {
  objectName: string;
  condition: string;
  estimatedPriceEUR: number;
  explanation: string;
  marketplaceSearchQuery: string;
};

export type ListingResult = {
  listingTitle: string;
  listingDescription: string;
};

function buildAnalysisPrompt(contentLocale: string, regionCode: string): string {
  const languageName = getLanguageName(contentLocale);
  const regionName = getRegionName(regionCode);

  return `You are helping someone sell a used item in ${regionName}. Analyze this photo and respond with ONLY valid JSON (no markdown fences), using exactly this shape:
{
  "objectName": "short name of the item",
  "condition": "brief condition assessment",
  "estimatedPriceEUR": 25,
  "explanation": "1-2 sentences on how you estimated the price",
  "marketplaceSearchQuery": "local search terms for classifieds"
}
Rules:
- Write ALL string values in ${languageName}.
- Use EUR for estimatedPriceEUR.
- marketplaceSearchQuery must use words people in ${regionName} would type on Facebook Marketplace and local classifieds (not English unless the results language is English).
- If unsure about price, provide your best single-number estimate.`;
}

function buildListingPrompt(
  item: AnalysisResult,
  contentLocale: string,
  regionCode: string,
): string {
  const languageName = getLanguageName(contentLocale);
  const regionName = getRegionName(regionCode);
  const price = item.estimatedPriceEUR.toFixed(0);

  return `You are helping someone write a classified ad to sell a used item on local marketplaces in ${regionName} (e.g. Facebook Marketplace, Bolha, Kleinanzeigen).

Item details:
- Name: ${item.objectName}
- Condition: ${item.condition}
- Asking price: €${price}
- Price note: ${item.explanation}
- Search terms locals use: ${item.marketplaceSearchQuery}

Respond with ONLY valid JSON (no markdown fences), using exactly this shape:
{
  "listingTitle": "short, clear ad title",
  "listingDescription": "2-4 sentences for a classified ad"
}
Rules:
- Write BOTH fields in ${languageName}.
- listingTitle: concise, specific, no price in title unless common locally.
- listingDescription: mention condition, asking price €${price}, and a friendly call to contact/message. Do not invent features not implied by the details.
- Suitable for copy-paste into Bolha, Facebook Marketplace, or similar.`;
}

function getGeminiModel() {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

function parseJsonResponse<T>(text: string): T {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as T;
}

export async function analyzePhoto(params: {
  imageBase64: string;
  mimeType: string;
  contentLocale: string;
  regionCode: string;
}): Promise<AnalysisResult> {
  const model = getGeminiModel();
  const result = await model.generateContent([
    { text: buildAnalysisPrompt(params.contentLocale, params.regionCode) },
    {
      inlineData: {
        data: params.imageBase64,
        mimeType: params.mimeType,
      },
    },
  ]);

  const text = result.response.text();
  if (!text) {
    throw new Error('The AI returned an empty response.');
  }

  const parsed = parseJsonResponse<AnalysisResult>(text);

  if (
    !parsed.objectName ||
    !parsed.condition ||
    typeof parsed.estimatedPriceEUR !== 'number' ||
    !parsed.explanation ||
    !parsed.marketplaceSearchQuery
  ) {
    throw new Error('The AI response was missing required fields.');
  }

  return parsed;
}

export async function generateListing(params: {
  item: AnalysisResult;
  contentLocale: string;
  regionCode: string;
}): Promise<ListingResult> {
  const model = getGeminiModel();
  const result = await model.generateContent([
    {
      text: buildListingPrompt(
        params.item,
        params.contentLocale,
        params.regionCode,
      ),
    },
  ]);

  const text = result.response.text();
  if (!text) {
    throw new Error('The AI returned an empty response.');
  }

  const parsed = parseJsonResponse<ListingResult>(text);

  if (!parsed.listingTitle?.trim() || !parsed.listingDescription?.trim()) {
    throw new Error('The AI response was missing required listing fields.');
  }

  return {
    listingTitle: parsed.listingTitle.trim(),
    listingDescription: parsed.listingDescription.trim(),
  };
}
