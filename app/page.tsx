'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';
import Header from '@/components/Header';
import TextInputs from '@/components/TextInputs';
import DiffOptions from '@/components/DiffOptions';
import DiffView from '@/components/DiffView';
import Toolbar from '@/components/Toolbar';
import Toast from '@/components/Toast';
import { computeDiff, DiffMode, Granularity, ProcessedDiff } from '@/lib/diff';
import { saveToStorage, loadFromStorage } from '@/lib/storage';

export default function Home() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [viewMode, setViewMode] = useState<DiffMode>('unified');
  const [granularity, setGranularity] = useState<Granularity>('lines');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [collapseUnchanged, setCollapseUnchanged] = useState(false);
  const [diff, setDiff] = useState<ProcessedDiff>({ hunks: [], hasChanges: false });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored.leftText) setLeftText(stored.leftText);
    if (stored.rightText) setRightText(stored.rightText);
    if (stored.viewMode) setViewMode(stored.viewMode);
    if (stored.granularity) setGranularity(stored.granularity);
    if (stored.ignoreCase !== undefined) setIgnoreCase(stored.ignoreCase);
    if (stored.ignoreWhitespace !== undefined) setIgnoreWhitespace(stored.ignoreWhitespace);
    if (stored.showLineNumbers !== undefined) setShowLineNumbers(stored.showLineNumbers);
    if (stored.collapseUnchanged !== undefined) setCollapseUnchanged(stored.collapseUnchanged);
    setMounted(true);
  }, []);

  const debouncedComputeDiff = useMemo(
    () =>
      debounce((left: string, right: string, options: any) => {
        const result = computeDiff(left, right, options);
        setDiff(result);
      }, 200),
    []
  );

  useEffect(() => {
    if (!mounted) return;

    debouncedComputeDiff(leftText, rightText, {
      granularity,
      ignoreCase,
      ignoreWhitespace,
    });

    saveToStorage({ leftText, rightText });
  }, [leftText, rightText, granularity, ignoreCase, ignoreWhitespace, mounted, debouncedComputeDiff]);

  useEffect(() => {
    if (!mounted) return;
    saveToStorage({ viewMode, granularity, ignoreCase, ignoreWhitespace, showLineNumbers, collapseUnchanged });
  }, [viewMode, granularity, ignoreCase, ignoreWhitespace, showLineNumbers, collapseUnchanged, mounted]);

  const handleSwap = useCallback(() => {
    setLeftText(rightText);
    setRightText(leftText);
  }, [leftText, rightText]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <TextInputs
          leftText={leftText}
          rightText={rightText}
          onLeftChange={setLeftText}
          onRightChange={setRightText}
          onSwap={handleSwap}
          onToast={showToast}
        />

        <DiffOptions
          viewMode={viewMode}
          granularity={granularity}
          ignoreCase={ignoreCase}
          ignoreWhitespace={ignoreWhitespace}
          showLineNumbers={showLineNumbers}
          collapseUnchanged={collapseUnchanged}
          onViewModeChange={setViewMode}
          onGranularityChange={setGranularity}
          onIgnoreCaseChange={setIgnoreCase}
          onIgnoreWhitespaceChange={setIgnoreWhitespace}
          onShowLineNumbersChange={setShowLineNumbers}
          onCollapseUnchangedChange={setCollapseUnchanged}
        />

        <DiffView
          diff={diff}
          mode={viewMode}
          showLineNumbers={showLineNumbers}
          collapseUnchanged={collapseUnchanged}
        />

        <Toolbar diff={diff} mode={viewMode} onToast={showToast} />
      </main>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
