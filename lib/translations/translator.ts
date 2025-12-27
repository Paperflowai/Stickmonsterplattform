import { LanguageCode } from './languages';
import { KNITTING_TERMS } from './dictionary';
import OpenAI from 'openai';

// Mappa våra språkkoder till fullständiga språknamn för OpenAI
const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  sv: 'Swedish',
  da: 'Danish',
  fi: 'Finnish',
  no: 'Norwegian',
  is: 'Icelandic',
  en: 'English',
  de: 'German',
  nl: 'Dutch',
  it: 'Italian',
  fr: 'French',
  tr: 'Turkish',
  es: 'Spanish',
};

/**
 * Översätter en text från svenska till målspråket med OpenAI API
 */
export async function translateText(text: string, targetLang: LanguageCode): Promise<string> {
  if (targetLang === 'sv') return text;
  if (!text || text.trim() === '') return text;

  // Använd OpenAI API om tillgänglig
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const targetLanguage = LANGUAGE_NAMES[targetLang];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o', // Bättre modell för högre kvalitet
        messages: [
          {
            role: 'system',
            content: `You are an expert knitting pattern translator with native-level fluency in ${targetLanguage}.

Your task is to translate Swedish knitting patterns into idiomatic, natural, and professional ${targetLanguage} that sounds like it was originally written by a native speaker who is an experienced knitter.

CRITICAL REQUIREMENTS:
1. ONLY translate the exact text provided - DO NOT add, remove, or modify any content
2. DO NOT add examples, explanations, or additional instructions that are not in the original
3. DO NOT invent or hallucinate pattern details that are not present in the source text
4. Translate EXACTLY what is given - nothing more, nothing less
5. Use authentic knitting terminology that is standard in ${targetLanguage}-speaking knitting communities
6. Translate idiomatically - not word-for-word. The result should read naturally to a native speaker
7. Preserve ALL formatting, line breaks, numerical values, and pattern structure exactly as given
8. Use the grammatical conventions and sentence structures that native ${targetLanguage} knitting patterns typically use
9. Maintain the professional tone used in published knitting patterns
10. Keep brand names, yarn names, and proper nouns untranslated (e.g., "Drops Air", "SIBELLE")
11. Use standard abbreviations for knitting terms if they exist in ${targetLanguage}

IMPORTANT: Return ONLY the direct translation of the provided text. Do not add any text that was not in the original Swedish text.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1, // Mycket låg temperatur för exakt översättning
      });

      return response.choices[0]?.message?.content || text;
    } catch (error) {
      console.error('OpenAI översättningsfel:', error);
      // Fallback till ordbok om OpenAI misslyckas
      return translateWithDictionary(text, targetLang);
    }
  }

  // Fallback till ordbok om ingen API-nyckel finns
  return translateWithDictionary(text, targetLang);
}

/**
 * Översätter med hjälp av inbyggd ordbok (fallback)
 */
function translateWithDictionary(text: string, targetLang: LanguageCode): string {
  let translatedText = text;

  // Ersätt kända termer från ordboken
  Object.entries(KNITTING_TERMS).forEach(([swedish, translations]) => {
    const regex = new RegExp(`\\b${swedish}\\b`, 'gi');
    translatedText = translatedText.replace(regex, (match) => {
      return translations[targetLang] || match;
    });
  });

  return translatedText;
}

/**
 * Översätter mönsterdata (enkel version)
 */
export async function translatePattern(
  pattern: {
    title: string;
    content: string;
  },
  targetLang: LanguageCode
) {
  const [title, content] = await Promise.all([
    translateText(pattern.title, targetLang),
    translateText(pattern.content, targetLang),
  ]);

  return {
    title,
    content,
  };
}
