import { GoogleGenerativeAI } from '@google/generative-ai';
import { EncodingType, readAsStringAsync } from 'expo-file-system/legacy';
import {
  AiBackendError,
  fetchPhotoAnalysis,
  isAiBackendConfigured,
  type ScanUsageSnapshot,
} from './aiBackend';
import {
  getLanguageNameForAI,
  getRegionNameForAI,
  type ContentLocale,
} from './locale';

export type AnalysisResult = {
  objectName: string;
  condition: string;
  estimatedPriceEUR: number;
  explanation: string;
  marketplaceSearchQuery: string;
};

export type AnalyzeItemPhotoResult = {
  analysis: AnalysisResult;
  usage?: ScanUsageSnapshot;
};

function buildAnalysisPrompt(contentLocale: ContentLocale, regionCode: string) {
  const languageName = getLanguageNameForAI(contentLocale);
  const regionName = getRegionNameForAI(regionCode);

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

const GEMINI_MODEL = 'gemini-3.1-flash-lite';

function parseAnalysisResponse(text: string): AnalysisResult {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned) as AnalysisResult;

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

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

async function analyzeItemPhotoLocally(
  photoUri: string,
  mimeType: string,
  contentLocale: ContentLocale,
  regionCode: string,
): Promise<AnalysisResult> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      'Missing API key. Copy .env.example to .env, add your Gemini key, and restart Expo.',
    );
  }

  const base64 = await readAsStringAsync(photoUri, {
    encoding: EncodingType.Base64,
  });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  let result;
  try {
    result = await model.generateContent([
      { text: buildAnalysisPrompt(contentLocale, regionCode) },
      {
        inlineData: {
          data: base64,
          mimeType,
        },
      },
    ]);
  } catch (error) {
    console.error('Gemini API error:', error);
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

  return parseAnalysisResponse(text);
}

export async function analyzeItemPhoto(
  photoUri: string,
  mimeType = 'image/jpeg',
  contentLocale: ContentLocale = 'en',
  regionCode = 'US',
): Promise<AnalyzeItemPhotoResult> {
  if (isAiBackendConfigured()) {
    const base64 = await readAsStringAsync(photoUri, {
      encoding: EncodingType.Base64,
    });

    try {
      const payload = await fetchPhotoAnalysis({
        imageBase64: base64,
        mimeType,
        contentLocale,
        regionCode,
      });

      return {
        analysis: payload.analysis,
        usage: payload.usage,
      };
    } catch (error) {
      if (error instanceof AiBackendError) {
        throw error;
      }

      throw new Error(formatError(error));
    }
  }

  const analysis = await analyzeItemPhotoLocally(
    photoUri,
    mimeType,
    contentLocale,
    regionCode,
  );

  return { analysis };
}

export { AiBackendError };
