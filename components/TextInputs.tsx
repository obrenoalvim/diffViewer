'use client';

import { useI18n } from '@/lib/i18n';
import { Copy, Clipboard, Trash2, ArrowLeftRight } from 'lucide-react';
import { useState } from 'react';

interface TextInputsProps {
  leftText: string;
  rightText: string;
  onLeftChange: (text: string) => void;
  onRightChange: (text: string) => void;
  onSwap: () => void;
  onToast: (message: string) => void;
}

export default function TextInputs({
  leftText,
  rightText,
  onLeftChange,
  onRightChange,
  onSwap,
  onToast,
}: TextInputsProps) {
  const { t } = useI18n();

  const handlePaste = async (side: 'left' | 'right') => {
    try {
      const text = await navigator.clipboard.readText();
      if (side === 'left') {
        onLeftChange(text);
      } else {
        onRightChange(text);
      }
      onToast(t.pastedFromClipboard);
    } catch (error) {
      onToast(t.clipboardError);
    }
  };

  const handleClear = (side: 'left' | 'right') => {
    if (side === 'left') {
      onLeftChange('');
    } else {
      onRightChange('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="left-input" className="text-sm font-medium text-gray-300">
            {t.leftInput}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handlePaste('left')}
              className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
              title={t.paste}
              aria-label={`${t.paste} ${t.leftInput}`}
            >
              <Clipboard className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleClear('left')}
              className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
              title={t.clear}
              aria-label={`${t.clear} ${t.leftInput}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <textarea
          id="left-input"
          value={leftText}
          onChange={(e) => onLeftChange(e.target.value)}
          className="w-full h-64 bg-gray-900 text-white border border-gray-700 rounded-lg p-4 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter or paste text here..."
          spellCheck={false}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="right-input" className="text-sm font-medium text-gray-300">
            {t.rightInput}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handlePaste('right')}
              className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
              title={t.paste}
              aria-label={`${t.paste} ${t.rightInput}`}
            >
              <Clipboard className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleClear('right')}
              className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
              title={t.clear}
              aria-label={`${t.clear} ${t.rightInput}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <textarea
          id="right-input"
          value={rightText}
          onChange={(e) => onRightChange(e.target.value)}
          className="w-full h-64 bg-gray-900 text-white border border-gray-700 rounded-lg p-4 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter or paste text here..."
          spellCheck={false}
        />
      </div>

      <div className="lg:col-span-2 flex justify-center">
        <button
          onClick={onSwap}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={t.swap}
        >
          <ArrowLeftRight className="h-4 w-4" />
          {t.swap}
        </button>
      </div>
    </div>
  );
}
