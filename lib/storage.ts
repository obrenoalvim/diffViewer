import { DiffMode, Granularity } from './diff';

interface StorageData {
  leftText?: string;
  rightText?: string;
  viewMode?: DiffMode;
  granularity?: Granularity;
  ignoreCase?: boolean;
  ignoreWhitespace?: boolean;
  showLineNumbers?: boolean;
  collapseUnchanged?: boolean;
}

const STORAGE_KEY = 'text-diff-viewer-state';

export function saveToStorage(data: StorageData): void {
  try {
    const existing = loadFromStorage();
    const updated = { ...existing, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromStorage(): StorageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return {};
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
