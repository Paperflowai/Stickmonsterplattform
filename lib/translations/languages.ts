export const LANGUAGES = {
  sv: { name: 'Svenska', code: 'sv' },
  da: { name: 'Danska', code: 'da' },
  fi: { name: 'Finska', code: 'fi' },
  no: { name: 'Norska', code: 'no' },
  is: { name: 'Isländska', code: 'is' },
  en: { name: 'Engelska', code: 'en' },
  de: { name: 'Tyska', code: 'de' },
  nl: { name: 'Nederländska', code: 'nl' },
  it: { name: 'Italienska', code: 'it' },
  fr: { name: 'Franska', code: 'fr' },
  tr: { name: 'Turkiska', code: 'tr' },
  es: { name: 'Spanska', code: 'es' },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;
