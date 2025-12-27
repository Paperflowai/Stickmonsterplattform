'use client';

import { useState } from 'react';
import { LANGUAGES, LanguageCode } from '@/lib/translations/languages';

interface PatternData {
  title: string;
  content: string;
  image: string;
}

export default function PatternEditor() {
  const [patternData, setPatternData] = useState<PatternData>({
    title: '',
    content: '',
    image: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Alla språk valda som standard (exkluderar svenska)
  const allLanguageCodes = Object.keys(LANGUAGES).filter(code => code !== 'sv') as LanguageCode[];
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>(allLanguageCodes);

  const handleInputChange = (field: keyof PatternData, value: string) => {
    setPatternData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPatternData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const toggleLanguage = (langCode: LanguageCode) => {
    setSelectedLanguages(prev =>
      prev.includes(langCode)
        ? prev.filter(code => code !== langCode)
        : [...prev, langCode]
    );
  };

  const selectAllLanguages = () => {
    setSelectedLanguages(allLanguageCodes);
  };

  const deselectAllLanguages = () => {
    setSelectedLanguages([]);
  };

  const handleGeneratePDFs = async () => {
    if (selectedLanguages.length === 0) {
      alert('Välj minst ett språk att översätta till');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-pdfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...patternData,
          languages: selectedLanguages,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'stickmönster-alla-språk.zip';
        a.click();
      }
    } catch (error) {
      console.error('Fel vid generering:', error);
      alert('Ett fel uppstod vid genereringen');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Titel */}
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-3">
            Mönsterts Titel
          </label>
          <input
            type="text"
            value={patternData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="T.ex. SIBELLE"
          />
        </div>

        {/* Bild */}
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-3">
            Ladda upp bild
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-3 file:px-6
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
          {patternData.image && (
            <div className="mt-4 relative">
              <img
                src={patternData.image}
                alt="Uppladdad bild"
                className="max-h-64 rounded-lg border-2 border-gray-200"
              />
              <button
                onClick={() => setPatternData(prev => ({ ...prev, image: '' }))}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Språkval */}
        <div className="border-2 border-blue-100 rounded-lg p-6 bg-blue-50">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-lg font-medium text-gray-900">
              Välj språk att översätta till
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllLanguages}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Välj alla
              </button>
              <button
                type="button"
                onClick={deselectAllLanguages}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Avmarkera alla
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allLanguageCodes.map((langCode) => (
              <label
                key={langCode}
                className="flex items-center space-x-2 cursor-pointer hover:bg-blue-100 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(langCode)}
                  onChange={() => toggleLanguage(langCode)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-900">{LANGUAGES[langCode].name}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {selectedLanguages.length} {selectedLanguages.length === 1 ? 'språk valt' : 'språk valda'}
          </p>
        </div>

        {/* Mönstertext */}
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-3">
            Mönstertext
          </label>
          <textarea
            value={patternData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            rows={25}
            placeholder="Klistra in hela ditt stickmönster här...

SIBELLE
Stickas nedifrån och upp, alla delar för sig.

Material: Drops Air + Drops Kid Silk
Stickor: Nr 6
...osv"
          />
        </div>

        {/* Generera PDFs */}
        <div className="pt-6 border-t-2">
          <button
            onClick={handleGeneratePDFs}
            disabled={isGenerating || !patternData.title || !patternData.content || selectedLanguages.length === 0}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg shadow-lg"
          >
            {isGenerating
              ? `Genererar PDF-filer på ${selectedLanguages.length} språk...`
              : `Generera PDF-filer (${selectedLanguages.length} språk)`}
          </button>
          <p className="text-sm text-gray-600 mt-3 text-center">
            Skapar PDF-filer med professionell AI-översättning på valda språk
            {selectedLanguages.length > 0 && (
              <>
                <br />
                <span className="text-xs text-gray-500">
                  {selectedLanguages.map(code => LANGUAGES[code].name).join(', ')}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
