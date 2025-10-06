import { diffLines, diffWords, diffChars, Change } from 'diff';

export type DiffMode = 'unified' | 'side-by-side';
export type Granularity = 'lines' | 'words' | 'characters';

export interface DiffOptions {
  ignoreCase?: boolean;
  ignoreWhitespace?: boolean;
  granularity?: Granularity;
}

export interface DiffHunk {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  lineNumber?: number;
  changes?: Change[];
}

export interface ProcessedDiff {
  hunks: DiffHunk[];
  hasChanges: boolean;
}

function normalizeText(text: string, options: DiffOptions): string {
  let normalized = text;

  if (options.ignoreWhitespace) {
    normalized = normalized
      .split('\n')
      .map(line => line.trim().replace(/\s+/g, ' '))
      .join('\n');
  }

  if (options.ignoreCase) {
    normalized = normalized.toLowerCase();
  }

  return normalized;
}

export function computeDiff(
  leftText: string,
  rightText: string,
  options: DiffOptions = {}
): ProcessedDiff {
  const normalizedLeft = normalizeText(leftText, options);
  const normalizedRight = normalizeText(rightText, options);

  let changes: Change[];

  switch (options.granularity) {
    case 'words':
      changes = diffWords(normalizedLeft, normalizedRight);
      break;
    case 'characters':
      changes = diffChars(normalizedLeft, normalizedRight);
      break;
    case 'lines':
    default:
      changes = diffLines(normalizedLeft, normalizedRight);
      break;
  }

  const hunks: DiffHunk[] = changes.map((change) => {
    let type: 'added' | 'removed' | 'unchanged';
    if (change.added) {
      type = 'added';
    } else if (change.removed) {
      type = 'removed';
    } else {
      type = 'unchanged';
    }

    return {
      type,
      value: change.value,
      changes: options.granularity === 'lines' ? undefined : [change],
    };
  });

  const hasChanges = changes.some(c => c.added || c.removed);

  return { hunks, hasChanges };
}

export function computeLineDiff(
  leftText: string,
  rightText: string,
  options: DiffOptions = {}
): ProcessedDiff {
  const normalizedLeft = normalizeText(leftText, options);
  const normalizedRight = normalizeText(rightText, options);

  const changes = diffLines(normalizedLeft, normalizedRight);

  let leftLineNumber = 1;
  let rightLineNumber = 1;

  const hunks: DiffHunk[] = changes.map((change) => {
    let type: 'added' | 'removed' | 'unchanged';
    let lineNumber: number;

    if (change.added) {
      type = 'added';
      lineNumber = rightLineNumber;
      rightLineNumber += change.count || 0;
    } else if (change.removed) {
      type = 'removed';
      lineNumber = leftLineNumber;
      leftLineNumber += change.count || 0;
    } else {
      type = 'unchanged';
      lineNumber = leftLineNumber;
      leftLineNumber += change.count || 0;
      rightLineNumber += change.count || 0;
    }

    return {
      type,
      value: change.value,
      lineNumber,
    };
  });

  const hasChanges = changes.some(c => c.added || c.removed);

  return { hunks, hasChanges };
}

export function diffToText(diff: ProcessedDiff): string {
  return diff.hunks
    .map((hunk) => {
      const lines = hunk.value.split('\n').filter(l => l || hunk.value.endsWith('\n'));
      return lines
        .map((line) => {
          if (hunk.type === 'added') return `+ ${line}`;
          if (hunk.type === 'removed') return `- ${line}`;
          return `  ${line}`;
        })
        .join('\n');
    })
    .join('\n');
}

export function diffToHTML(diff: ProcessedDiff, mode: DiffMode = 'unified'): string {
  const styles = `
    <style>
      body {
        font-family: 'Courier New', monospace;
        background: #1e1e1e;
        color: #d4d4d4;
        padding: 20px;
        margin: 0;
      }
      .diff-container {
        max-width: 1200px;
        margin: 0 auto;
      }
      .diff-line {
        padding: 2px 8px;
        white-space: pre-wrap;
        word-break: break-all;
      }
      .added {
        background: #1a3d1a;
        color: #7ee787;
      }
      .removed {
        background: #3d1a1a;
        color: #f97583;
      }
      .unchanged {
        background: transparent;
        color: #d4d4d4;
      }
      .line-number {
        display: inline-block;
        width: 50px;
        color: #6e7681;
        user-select: none;
      }
    </style>
  `;

  const diffHTML = diff.hunks
    .map((hunk, index) => {
      const lines = hunk.value.split('\n').filter((l, i, arr) => l || i < arr.length - 1);
      return lines
        .map((line, lineIndex) => {
          const lineNum = hunk.lineNumber ? hunk.lineNumber + lineIndex : '';
          return `<div class="diff-line ${hunk.type}"><span class="line-number">${lineNum}</span>${escapeHtml(line)}</div>`;
        })
        .join('');
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Text Diff Export</title>
  ${styles}
</head>
<body>
  <div class="diff-container">
    <h1>Text Diff Export</h1>
    ${diffHTML}
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
