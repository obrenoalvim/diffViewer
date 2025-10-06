'use client';

import { useI18n } from '@/lib/i18n';
import { DiffMode, Granularity } from '@/lib/diff';

interface DiffOptionsProps {
  viewMode: DiffMode;
  granularity: Granularity;
  ignoreCase: boolean;
  ignoreWhitespace: boolean;
  showLineNumbers: boolean;
  collapseUnchanged: boolean;
  onViewModeChange: (mode: DiffMode) => void;
  onGranularityChange: (granularity: Granularity) => void;
  onIgnoreCaseChange: (value: boolean) => void;
  onIgnoreWhitespaceChange: (value: boolean) => void;
  onShowLineNumbersChange: (value: boolean) => void;
  onCollapseUnchangedChange: (value: boolean) => void;
}

export default function DiffOptions({
  viewMode,
  granularity,
  ignoreCase,
  ignoreWhitespace,
  showLineNumbers,
  collapseUnchanged,
  onViewModeChange,
  onGranularityChange,
  onIgnoreCaseChange,
  onIgnoreWhitespaceChange,
  onShowLineNumbersChange,
  onCollapseUnchangedChange,
}: DiffOptionsProps) {
  const { t } = useI18n();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t.viewMode}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onViewModeChange('unified')}
              className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                viewMode === 'unified'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {t.unified}
            </button>
            <button
              onClick={() => onViewModeChange('side-by-side')}
              className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                viewMode === 'side-by-side'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {t.sideBySide}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t.granularity}
          </label>
          <select
            value={granularity}
            onChange={(e) => onGranularityChange(e.target.value as Granularity)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="lines">{t.lines}</option>
            <option value="words">{t.words}</option>
            <option value="characters">{t.characters}</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => onIgnoreCaseChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-300">{t.ignoreCase}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => onIgnoreWhitespaceChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-300">{t.ignoreWhitespace}</span>
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={(e) => onShowLineNumbersChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-300">{t.showLineNumbers}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={collapseUnchanged}
              onChange={(e) => onCollapseUnchangedChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-300">{t.collapseUnchanged}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
