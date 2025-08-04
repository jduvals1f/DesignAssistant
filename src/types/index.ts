export interface BrandToken {
  id: string;               // UUID
  primaryHex: string;
  secondaryHex: string;
  accentHex: string[];
  fontFamily: string;
  spacingScale: number[];   // e.g. [2,4,8,16]
}

export interface Finding {
  id: string;
  type: 'contrast' | 'spacing' | 'component-misuse' | 'design-best-practice';
  severity: 'error' | 'warn';
  location: DOMRect;
  suggestion: string;
  element?: HTMLElement;
  originalCode?: string;
  suggestedCode?: string;
  principle?: string; // Reference to design principle
  category?: string; // Design principle category
}

export interface ScreenAnalysis {
  id: string;
  timestamp: number;
  imgBlob: Blob;
  jsxSource: string;
  findings: Finding[];
  generatedJsx: string;
  patch: string;            // unified diff
}

export interface CaptureResult {
  screenshot: Blob;
  jsxSource: string;
  url: string;
  timestamp: number;
}

export interface HeuristicRule {
  id: string;
  name: string;
  description: string;
  check: (element: HTMLElement, brandTokens: BrandToken) => Finding | null;
}

export interface ComponentMapping {
  originalTag: string;
  radixComponent: string;
  props: Record<string, any>;
  className?: string;
}

export interface DiffResult {
  original: string;
  generated: string;
  unifiedDiff: string;
  changes: Array<{
    type: 'added' | 'removed' | 'modified';
    line: number;
    content: string;
  }>;
} 