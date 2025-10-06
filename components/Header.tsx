'use client';

import { useI18n } from '@/lib/i18n';
import { Languages } from 'lucide-react';

export default function Header() {
  const { language, setLanguage, t } = useI18n();

  return (
    <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{t.title}</h1>
            <p className="text-sm text-gray-400">{t.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'pt')}
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
