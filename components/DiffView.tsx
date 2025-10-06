'use client';

import { useI18n } from '@/lib/i18n';
import { ProcessedDiff, DiffMode, DiffHunk } from '@/lib/diff';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface DiffViewProps {
  diff: ProcessedDiff;
  mode: DiffMode;
  showLineNumbers: boolean;
  collapseUnchanged: boolean;
}

export default function DiffView({
  diff,
  mode,
  showLineNumbers,
  collapseUnchanged,
}: DiffViewProps) {
  const { t } = useI18n();
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());

  if (!diff.hasChanges) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">{t.noChanges}</p>
      </div>
    );
  }

  const toggleCollapse = (index: number) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const processHunksForDisplay = () => {
    if (!collapseUnchanged) {
      return diff.hunks;
    }

    const processed: (DiffHunk | { type: 'collapsed'; count: number; index: number })[] = [];
    let unchangedBuffer: DiffHunk[] = [];

    diff.hunks.forEach((hunk, index) => {
      if (hunk.type === 'unchanged') {
        unchangedBuffer.push(hunk);
      } else {
        if (unchangedBuffer.length > 5) {
          processed.push({
            type: 'collapsed',
            count: unchangedBuffer.length,
            index: processed.length,
          });
          unchangedBuffer = [];
        } else if (unchangedBuffer.length > 0) {
          processed.push(...unchangedBuffer);
          unchangedBuffer = [];
        }
        processed.push(hunk);
      }
    });

    if (unchangedBuffer.length > 5) {
      processed.push({
        type: 'collapsed',
        count: unchangedBuffer.length,
        index: processed.length,
      });
    } else if (unchangedBuffer.length > 0) {
      processed.push(...unchangedBuffer);
    }

    return processed;
  };

  const processedHunks = processHunksForDisplay();

  if (mode === 'unified') {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="font-mono text-sm">
          {processedHunks.map((item, index) => {
            if ('type' in item && item.type === 'collapsed') {
              const isCollapsed = collapsedSections.has(item.index);
              return (
                <div
                  key={`collapsed-${index}`}
                  className="bg-gray-800/50 border-y border-gray-700"
                >
                  <button
                    onClick={() => toggleCollapse(item.index)}
                    className="w-full px-4 py-2 flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300 hover:bg-gray-800/70 transition-colors"
                  >
                    {isCollapsed ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                    <span>
                      {item.count} {t.unchangedLines}
                    </span>
                  </button>
                </div>
              );
            }

            const hunk = item as DiffHunk;
            const lines = hunk.value.split('\n').filter((l, i, arr) => l || i < arr.length - 1);

            return lines.map((line, lineIndex) => {
              const lineNum = hunk.lineNumber ? hunk.lineNumber + lineIndex : '';
              let bgColor = '';
              let textColor = 'text-gray-300';
              let prefix = ' ';

              if (hunk.type === 'added') {
                bgColor = 'bg-green-900/20';
                textColor = 'text-green-400';
                prefix = '+';
              } else if (hunk.type === 'removed') {
                bgColor = 'bg-red-900/20';
                textColor = 'text-red-400';
                prefix = '-';
              }

              return (
                <div
                  key={`${index}-${lineIndex}`}
                  className={`flex ${bgColor} border-l-2 ${
                    hunk.type === 'added'
                      ? 'border-green-600'
                      : hunk.type === 'removed'
                      ? 'border-red-600'
                      : 'border-transparent'
                  }`}
                >
                  {showLineNumbers && (
                    <span className="px-4 py-1 text-gray-500 select-none min-w-[60px] text-right">
                      {lineNum}
                    </span>
                  )}
                  <span className={`px-2 py-1 ${textColor} select-none`}>{prefix}</span>
                  <pre className={`px-2 py-1 flex-1 ${textColor} whitespace-pre-wrap break-all`}>
                    {line}
                  </pre>
                </div>
              );
            });
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-gray-800">
        <div className="font-mono text-sm">
          {processedHunks.map((item, index) => {
            if ('type' in item && item.type === 'collapsed') {
              return (
                <div
                  key={`collapsed-left-${index}`}
                  className="bg-gray-800/50 border-y border-gray-700"
                >
                  <div className="px-4 py-2 text-center text-gray-400 text-xs">
                    {item.count} {t.unchangedLines}
                  </div>
                </div>
              );
            }

            const hunk = item as DiffHunk;
            if (hunk.type === 'added') return null;

            const lines = hunk.value.split('\n').filter((l, i, arr) => l || i < arr.length - 1);

            return lines.map((line, lineIndex) => {
              const lineNum = hunk.lineNumber ? hunk.lineNumber + lineIndex : '';
              const bgColor = hunk.type === 'removed' ? 'bg-red-900/20' : '';
              const textColor = hunk.type === 'removed' ? 'text-red-400' : 'text-gray-300';

              return (
                <div key={`left-${index}-${lineIndex}`} className={`flex ${bgColor}`}>
                  {showLineNumbers && (
                    <span className="px-4 py-1 text-gray-500 select-none min-w-[60px] text-right">
                      {lineNum}
                    </span>
                  )}
                  <pre className={`px-4 py-1 flex-1 ${textColor} whitespace-pre-wrap break-all`}>
                    {line}
                  </pre>
                </div>
              );
            });
          })}
        </div>

        <div className="font-mono text-sm">
          {processedHunks.map((item, index) => {
            if ('type' in item && item.type === 'collapsed') {
              return (
                <div
                  key={`collapsed-right-${index}`}
                  className="bg-gray-800/50 border-y border-gray-700"
                >
                  <div className="px-4 py-2 text-center text-gray-400 text-xs">
                    {item.count} {t.unchangedLines}
                  </div>
                </div>
              );
            }

            const hunk = item as DiffHunk;
            if (hunk.type === 'removed') return null;

            const lines = hunk.value.split('\n').filter((l, i, arr) => l || i < arr.length - 1);

            return lines.map((line, lineIndex) => {
              const lineNum = hunk.lineNumber ? hunk.lineNumber + lineIndex : '';
              const bgColor = hunk.type === 'added' ? 'bg-green-900/20' : '';
              const textColor = hunk.type === 'added' ? 'text-green-400' : 'text-gray-300';

              return (
                <div key={`right-${index}-${lineIndex}`} className={`flex ${bgColor}`}>
                  {showLineNumbers && (
                    <span className="px-4 py-1 text-gray-500 select-none min-w-[60px] text-right">
                      {lineNum}
                    </span>
                  )}
                  <pre className={`px-4 py-1 flex-1 ${textColor} whitespace-pre-wrap break-all`}>
                    {line}
                  </pre>
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}
