import { GoogleGenerativeAI } from '@google/generative-ai';
import { EncodingType, readAsStringAsync } from 'expo-file-system/legacy';

export type AnalysisResult = {
  objectName: string;
  condition: string;
  estimatedPriceEUR: number;
  explanation: string;
  marketplaceSearchQuery: string;
};

const ANALYSIS_PROMPT = `You are helping someone sell a used item. Analyze this photo and respond with ONLY valid JSON (no markdown fences), using exactly this shape:
{
  "objectName": "short name of the item",
  "condition": "brief condition assessment",
  "estimatedPriceEUR": 25,
  "explanation": "1-2 sentences on how you estimated the price",
  "marketplaceSearchQuery": "search terms for eBay"
}
Use EUR for estimatedPriceEUR. If unsure, provide your best single-number estimate.`;

// New Google AI Studio projects cannot use 2.5 models; see Google deprecations docs.
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

export async function analyzeItemPhoto(
  photoUri: string,
  mimeType = 'image/jpeg',
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
      { text: ANALYSIS_PROMPT },
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
