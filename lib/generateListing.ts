import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  getLanguageNameForAI,
  getRegionNameForAI,
  type ContentLocale,
} from './locale';

export type ListingResult = {
  listingTitle: string;
  listingDescription: string;
};

type ListingInput = {
  objectName: string;
  condition: string;
  estimatedPriceEUR: number;
  explanation: string;
  marketplaceSearchQuery: string;
};

const GEMINI_MODEL = 'gemini-3.1-flash-lite';

function buildListingPrompt(
  item: ListingInput,
  contentLocale: ContentLocale,
  regionCode: string,
) {
  const languageName = getLanguageNameForAI(contentLocale);
  const regionName = getRegionNameForAI(regionCode);
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

function parseListingResponse(text: string): ListingResult {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned) as ListingResult;

  if (!parsed.listingTitle?.trim() || !parsed.listingDescription?.trim()) {
    throw new Error('The AI response was missing required listing fields.');
  }

  return {
    listingTitle: parsed.listingTitle.trim(),
    listingDescription: parsed.listingDescription.trim(),
  };
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export async function generateListingText(
  item: ListingInput,
  contentLocale: ContentLocale,
  regionCode: string,
): Promise<ListingResult> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      'Missing API key. Copy .env.example to .env, add your Gemini key, and restart Expo.',
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  let result;
  try {
    result = await model.generateContent([
      { text: buildListingPrompt(item, contentLocale, regionCode) },
    ]);
  } catch (error) {
    console.error('Gemini listing error:', error);
    const message = formatError(error);

    if (message.includes('quota') || message.includes('limit: 0')) {
      throw new Error(
        'Gemini free tier blocked this model for your API key. Check billing/quota at ai.google.dev, or try again later.',
      );
    }

    if (message.includes('404') || message.includes('no longer available')) {
      throw new Error(
        `Model ${GEMINI_MODEL} is unavailable for your account. Check Google's current model list at ai.google.dev/gemini-api/docs/models.`,
      );
    }

    throw new Error(message);
  }

  const text = result.response.text();

  if (!text) {
    throw new Error('The AI returned an empty response.');
  }

  return parseListingResponse(text);
}
