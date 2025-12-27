'use client';

import { useState } from 'react';
import PatternEditor from '@/components/PatternEditor';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Stickmönster Plattform
        </h1>
        <p className="text-gray-600 mb-8">
          Skapa ditt stickmönster på svenska och generera PDF-filer på 12 olika språk
        </p>

        <PatternEditor />
      </div>
    </main>
  );
}
