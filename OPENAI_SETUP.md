# Hur du aktiverar OpenAI för professionell översättning

## Varför OpenAI?

Den inbyggda ordboken översätter endast vanliga stickmönstertermer. För att få hela texten översatt med hög kvalitet använder vi OpenAI's GPT-4o-mini modell.

**Kostnad:** Mycket billigt! Ca 0.01-0.05 kr per stickmönster (pay-as-you-go, inga månadskostnader)

## Viktigt att veta

- OpenAI API är **SEPARAT** från ditt ChatGPT Plus/Pro-abonnemang
- Du behöver lägga in ett kreditkort (men betalar endast för det du använder)
- GPT-4o-mini är extremt billig för översättning
- Första $5 är ofta gratis för nya konton

## Steg-för-steg guide

### 1. Skapa OpenAI API-konto

1. Gå till https://platform.openai.com/signup
2. Logga in med ditt OpenAI-konto (samma som ChatGPT)
3. Om du aldrig använt API:et innan, följ uppsättningsguiden

### 2. Lägg till betalningsmetod

1. Gå till https://platform.openai.com/account/billing/overview
2. Klicka på "Add payment method"
3. Lägg in ditt kreditkort
4. (Valfritt) Sätt en utgiftsgräns under "Usage limits" för säkerhets skull
   - T.ex. 50 kr/månad är mer än tillräckligt för många mönster

### 3. Skapa API-nyckel

1. Gå till https://platform.openai.com/api-keys
2. Klicka på "Create new secret key"
3. Ge den ett namn (t.ex. "Stickmönster Plattform")
4. Klicka "Create secret key"
5. **VIKTIGT:** Kopiera nyckeln DIREKT (du kan inte se den igen!)
   - Den börjar med `sk-...`

### 4. Lägg till API-nyckeln i projektet

1. I projektmappen `stickmonster-plattform`, kopiera filen `.env.example` och döp kopian till `.env.local`

   **Windows (i terminalen):**
   ```bash
   copy .env.example .env.local
   ```

2. Öppna `.env.local` i en textredigerare (VS Code, Notepad, etc.)

3. Hitta raden:
   ```
   # OPENAI_API_KEY=sk-din_api_nyckel_här
   ```

4. Ta bort `#` och ersätt `sk-din_api_nyckel_här` med din riktiga API-nyckel:
   ```
   OPENAI_API_KEY=sk-proj-abc123xyz789DinRiktigaNyckelHär
   ```

5. Spara filen

### 5. Starta om servern

1. Om servern körs, stoppa den (Ctrl+C i terminalen)
2. Starta om med:
   ```bash
   npm run dev
   ```

### 6. Testa!

1. Öppna http://localhost:3000
2. Skapa ett stickmönster med lite text
3. Generera PDF-filer
4. Öppna en översatt PDF - texten bör nu vara professionellt översatt!

## Hur mycket kostar det?

GPT-4o-mini är extremt billig:
- Input: $0.15 per 1 miljon tokens
- Output: $0.60 per 1 miljon tokens

**I praktiken:**
- Ett typiskt stickmönster = ca 500-2000 tokens
- Översättning till 12 språk = ca 0.01-0.05 kr per mönster
- 100 mönster översatta = ca 1-5 kr

## Säkerhet

- **DELA ALDRIG** din API-nyckel med någon
- `.env.local` är i `.gitignore` så den syncs inte till GitHub
- Om du råkar dela nyckeln, radera den omedelbart på https://platform.openai.com/api-keys

## Felsökning

### "Invalid API key" eller liknande fel

- Kontrollera att du kopierat hela API-nyckeln (börjar med `sk-`)
- Se till att det inte finns några mellanslag före eller efter nyckeln
- Kontrollera att filen heter exakt `.env.local` (inte `.env.local.txt`)
- Verifiera att du startat om servern efter att du lagt till nyckeln

### "Insufficient quota" fel

- Du behöver lägga till ett kreditkort på https://platform.openai.com/account/billing
- Om du redan har kort, kolla att du har krediter kvar

### Översättningen är fortfarande dålig

- Kontrollera att servern startade om efter du la till nyckeln
- Kolla i terminalen efter felmeddelanden om API-anrop
- Testa att generera mönstret igen

### Hur ser jag hur mycket jag har använt?

- Logga in på https://platform.openai.com/usage
- Här ser du exakt hur mycket du spenderat
- Uppdateras varje dag

## Utgiftskontroll

För att undvika oväntade kostnader:

1. Sätt en månadsgräns:
   - https://platform.openai.com/account/limits
   - T.ex. 50 kr/månad

2. Aktivera e-postnotiser:
   - Du får mail när du når 75% och 100% av gränsen

## Behöver du hjälp?

Om något inte fungerar:
1. Kontrollera att `.env.local` finns i rätt mapp (`stickmonster-plattform`)
2. Verifiera att API-nyckeln är korrekt kopierad (börjar med `sk-`)
3. Kontrollera att servern är omstartad
4. Titta i terminalen för felmeddelanden
5. Kolla din usage på OpenAI's dashboard

## Alternativ

Om OpenAI känns för komplicerat eller dyrt:
- Google Translate API (liknande pris och kvalitet)
- Förbättrad ordbok (gratis men grundläggande)
