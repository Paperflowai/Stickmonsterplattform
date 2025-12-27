# Stickmönster Plattform

En webbapplikation för att skapa stickmönster på svenska och automatiskt generera PDF-filer på 12 olika språk.

## Funktioner

- ✏️ Skapa stickmönster med titel, bilder, material och instruktioner
- 📊 Lägg till tabeller för storlekar, maskanvändning etc.
- 🖼️ Ladda upp bilder
- 🌍 Automatisk översättning till 12 språk
- 📄 Generera PDF-filer för alla språk samtidigt

## Språk som stöds

- Svenska (original)
- Danska
- Finska
- Norska
- Isländska
- Engelska
- Tyska
- Nederländska
- Italienska
- Franska
- Turkiska
- Spanska

## Kom igång

### Installation

```bash
npm install
```

### Kör utvecklingsserver

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

### Bygga för produktion

```bash
npm run build
npm start
```

## Översättning

Plattformen använder OpenAI's GPT-4o-mini för professionell översättning. Om ingen API-nyckel är konfigurerad används en inbyggd ordbok som fallback.

### Aktivera OpenAI-översättning (rekommenderat)

**Kostnad:** Ca 0.01-0.05 kr per mönster (pay-as-you-go, inga fasta avgifter)

**Snabbguide:**
1. Gå till https://platform.openai.com/api-keys
2. Skapa en API-nyckel
3. Kopiera `.env.example` till `.env.local`
4. Lägg till din API-nyckel i `.env.local`:
   ```
   OPENAI_API_KEY=sk-din_api_nyckel_här
   ```
5. Starta om servern

**Detaljerad guide:** Se [OPENAI_SETUP.md](./OPENAI_SETUP.md)

## Projektstruktur

```
stickmonster-plattform/
├── app/                      # Next.js App Router
│   ├── api/
│   │   └── generate-pdfs/   # API för PDF-generering
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Startsida
│   └── globals.css          # Globala stilar
├── components/              # React-komponenter
│   ├── PatternEditor.tsx    # Huvudeditor
│   ├── TableEditor.tsx      # Tabelleditor
│   └── ImageUpload.tsx      # Bilduppladdning
├── lib/
│   ├── pdf/                 # PDF-mallar
│   │   └── PatternPDFTemplate.tsx
│   └── translations/        # Översättningsfunktioner
│       ├── languages.ts
│       ├── dictionary.ts
│       └── translator.ts
└── public/                  # Statiska filer
```

## Teknologier

- **Next.js 16** - React framework
- **TypeScript** - Typsäkerhet
- **Tailwind CSS** - Styling
- **@react-pdf/renderer** - PDF-generering
- **JSZip** - ZIP-filskapande
- **OpenAI API** - Professionell översättning (valfritt)

## Utveckling

För att lägga till fler översatta termer, redigera `lib/translations/dictionary.ts` och lägg till nya termer i `KNITTING_TERMS`-objektet.

## Licens

ISC
