'use client';

import { useI18n } from '@/lib/i18n';
import { ProcessedDiff, diffToText, diffToHTML, DiffMode } from '@/lib/diff';
import { Copy, Download } from 'lucide-react';

interface ToolbarProps {
  diff: ProcessedDiff;
  mode: DiffMode;
  onToast: (message: string) => void;
}

export default function Toolbar({ diff, mode, onToast }: ToolbarProps) {
  const { t } = useI18n();

  const handleCopyDiff = async () => {
    try {
      const text = diffToText(diff);
      await navigator.clipboard.writeText(text);
      onToast(t.copiedToClipboard);
    } catch (error) {
      onToast(t.clipboardError);
    }
  };

  const handleExportHTML = () => {
    const html = diffToHTML(diff, mode);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diff-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast(t.exportedAsHtml);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={handleCopyDiff}
        disabled={!diff.hasChanges}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Copy className="h-4 w-4" />
        {t.copyDiff}
      </button>

      <button
        onClick={handleExportHTML}
        disabled={!diff.hasChanges}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <Download className="h-4 w-4" />
        {t.exportHtml}
      </button>
    </div>
  );
}
