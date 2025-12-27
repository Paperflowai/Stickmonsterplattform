import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import PatternPDFTemplate from '@/lib/pdf/PatternPDFTemplate';
import { translatePattern } from '@/lib/translations/translator';
import { LANGUAGES, LanguageCode } from '@/lib/translations/languages';
import JSZip from 'jszip';

export const dynamic = 'force-dynamic';

interface PatternData {
  title: string;
  content: string;
  image: string;
  languages?: LanguageCode[];
}

export async function POST(request: NextRequest) {
  try {
    const patternData: PatternData = await request.json();

    // Validera data
    if (!patternData.title) {
      return NextResponse.json(
        { error: 'Titel saknas' },
        { status: 400 }
      );
    }

    // Om inga språk är valda, använd alla språk (förutom svenska)
    const languagesToGenerate = patternData.languages && patternData.languages.length > 0
      ? patternData.languages
      : (Object.keys(LANGUAGES).filter(code => code !== 'sv') as LanguageCode[]);

    if (languagesToGenerate.length === 0) {
      return NextResponse.json(
        { error: 'Inga språk valda' },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    // Generera PDF för valda språk
    for (const langCode of languagesToGenerate) {
      const langInfo = LANGUAGES[langCode];
      try {
        // Översätt mönstret
        const translatedPattern = await translatePattern(
          {
            title: patternData.title,
            content: patternData.content,
          },
          langCode as LanguageCode
        );

        // Skapa PDF-dokument
        const pdfDoc = PatternPDFTemplate({
          title: translatedPattern.title,
          content: translatedPattern.content,
          image: patternData.image, // Bilden översätts inte
          language: langCode,
        });

        // Rendera till buffer
        const pdfBuffer = await renderToBuffer(pdfDoc);

        // Lägg till i ZIP med språknamn
        const fileName = `${sanitizeFileName(patternData.title)}_${langInfo.name}.pdf`;
        zip.file(fileName, pdfBuffer);
      } catch (error) {
        console.error(`Fel vid generering av PDF för ${langInfo.name}:`, error);
        // Fortsätt med nästa språk om ett misslyckas
      }
    }

    // Generera ZIP-fil
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Returnera ZIP-fil
    return new NextResponse(zipBlob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${sanitizeFileName(patternData.title)}_alla-språk.zip"`,
      },
    });
  } catch (error) {
    console.error('Fel vid PDF-generering:', error);
    return NextResponse.json(
      { error: 'Kunde inte generera PDF-filer' },
      { status: 500 }
    );
  }
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-ZåäöÅÄÖ0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50);
}
